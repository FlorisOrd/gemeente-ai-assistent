const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const TENANTS_DIR = path.join(__dirname, "tenants");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-5.4-mini";
const MAX_MESSAGE_LENGTH = 1000;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_MESSAGES = 10;
const OPENAI_MAX_OUTPUT_TOKENS = 450;
const rateLimitStore = new Map();
const MUNICIPALITY_KEYWORDS = [
  "gemeente",
  "paspoort",
  "paspoorten",
  "identiteitskaart",
  "identiteitskaarten",
  "rijbewijs",
  "verhuizen",
  "verhuizing",
  "afval",
  "container",
  "vergunning",
  "vergunningen",
  "melding",
  "openbare ruimte",
  "afspraak",
  "loket",
  "openingstijden",
  "contact",
  "bezwaar",
  "belasting",
  "woz",
  "parkeren",
  "uittreksel",
  "geboorte",
  "huwelijk",
];
const OFF_TOPIC_KEYWORDS = [
  "taart bakken",
  "cake bakken",
  "recept",
  "voetbal",
  "film",
  "vakantieadvies",
  "programmeerhulp",
  "liefdesadvies",
];
const OFF_TOPIC_MESSAGE =
  "Sorry, ik kan alleen helpen met vragen over gemeentelijke onderwerpen. Stel bijvoorbeeld een vraag over paspoorten, verhuizen, afval, vergunningen of contact met de gemeente.";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async function (request, response) {
  try {
    if (request.method === "POST" && request.url === "/api/chat") {
      await handleChat(request, response);
      return;
    }

    if (request.method === "GET") {
      serveStaticFile(request, response);
      return;
    }

    sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Er ging iets mis in de demo-server." });
  }
});

server.listen(PORT, function () {
  console.log("Gemeente AI Assistent demo server");
  console.log("Open http://localhost:" + PORT + "/demo/demo.html");
});

async function handleChat(request, response) {
  const body = await readJsonBody(request);
  const tenantId = body.tenant || "demo";
  const message = String(body.message || "").trim();
  const tenant = loadTenant(tenantId);
  const clientIp = getClientIp(request);

  if (!message) {
    sendJson(response, 400, {
      error: "Typ eerst een vraag voordat u het bericht verstuurt.",
    });
    return;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    sendJson(response, 400, {
      error:
        "Uw bericht is te lang. Houd uw vraag korter dan " +
        MAX_MESSAGE_LENGTH +
        " tekens.",
    });
    return;
  }

  if (!isProbablyAllowedTopic(message, tenant)) {
    logChatStatus("off_topic", tenant.id, clientIp);
    sendJson(response, 200, {
      tenant: tenant.id,
      assistantName: tenant.assistantName,
      message: OFF_TOPIC_MESSAGE,
      sources: tenant.mockSources,
      mode: "off-topic",
    });
    return;
  }

  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    logChatStatus("rate_limited", tenant.id, clientIp);
    sendJson(response, 429, {
      error:
        "U heeft te veel berichten kort achter elkaar gestuurd. Wacht een paar minuten en probeer het daarna opnieuw.",
    });
    return;
  }

  if (OPENAI_API_KEY) {
    try {
      const openAIMessage = await callOpenAI(message, tenant);

      logChatStatus("openai_success", tenant.id, clientIp);
      sendJson(response, 200, {
        tenant: tenant.id,
        assistantName: tenant.assistantName,
        message: openAIMessage,
        sources: tenant.mockSources,
        mode: "openai",
      });
      return;
    } catch (error) {
      // Keep raw provider errors on the server only. Visitors get a friendly Dutch message.
      console.error("OpenAI request failed:", error.message);
      logChatStatus("openai_error", tenant.id, clientIp);
      sendJson(response, 200, {
        tenant: tenant.id,
        assistantName: tenant.assistantName,
        message:
          "Sorry, de assistent kan nu geen antwoord ophalen. Probeer het later opnieuw of neem contact op met de gemeente via de officiele contactkanalen.",
        sources: tenant.mockSources,
        mode: "openai-error",
      });
      return;
    }
  }

  // This is intentionally a mock answer. It keeps the demo working without an API key.
  logChatStatus("mock_success", tenant.id, clientIp);
  sendJson(response, 200, {
    tenant: tenant.id,
    assistantName: tenant.assistantName,
    message:
      "Bedankt voor uw vraag. Dit is een demo-antwoord van " +
      tenant.assistantName +
      ". In een echte versie zoekt de assistent informatie op in goedgekeurde gemeentelijke bronnen. Voor nu kan ik alvast aangeven dat uw vraag is ontvangen: \"" +
      message +
      "\".",
    sources: tenant.mockSources,
    mode: "mock",
  });
}

function isProbablyAllowedTopic(message, tenant) {
  const normalizedMessage = normalizeText(message);

  // This MVP gate is intentionally simple keyword matching. It catches clear off-topic
  // questions before OpenAI or mock mode, but a production version needs a stronger policy layer.
  if (
    OFF_TOPIC_KEYWORDS.some(function (keyword) {
      return normalizedMessage.includes(normalizeText(keyword));
    })
  ) {
    return false;
  }

  const tenantTopicKeywords = Array.isArray(tenant.allowedTopics)
    ? tenant.allowedTopics.flatMap(topicToKeywords)
    : [];
  const allowedKeywords = MUNICIPALITY_KEYWORDS.concat(tenantTopicKeywords);

  return allowedKeywords.some(function (keyword) {
    return normalizedMessage.includes(normalizeText(keyword));
  });
}

function topicToKeywords(topic) {
  const normalizedTopic = normalizeText(topic);
  const words = normalizedTopic
    .split(" ")
    .map(function (word) {
      return word.trim();
    })
    .filter(function (word) {
      return word.length >= 4;
    });

  return [normalizedTopic].concat(words);
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function callOpenAI(message, tenant) {
  const allowedTopics = Array.isArray(tenant.allowedTopics)
    ? tenant.allowedTopics.join(", ")
    : "algemene gemeentelijke informatie";
  const instructionPrompt =
    "Je bent " +
    tenant.assistantName +
    " voor " +
    tenant.municipalityName +
    ". Antwoord in helder Nederlands en blijf gericht op gemeentelijke informatie. Richt je vooral op deze onderwerpen: " +
    allowedTopics +
    ". Vraag nooit om een BSN. Verwerk geen gevoelige persoonsgegevens, zoals medische gegevens, financiele details of gegevens over persoonlijke dossiers. Neem geen definitieve juridische beslissingen en doe niet alsof je een officieel besluit namens de gemeente neemt. Adviseer gebruikers om officiele gemeentelijke bronnen te controleren voor definitieve informatie. Verwijs urgente of persoonlijke situaties door naar de officiele contactkanalen van de gemeente: " +
    tenant.contactUrl +
    ". Verwijs voor privacyinformatie naar: " +
    tenant.privacyUrl +
    ". Houd antwoorden kort en praktisch.";

  const response = await postJson("https://api.openai.com/v1/responses", {
    model: OPENAI_MODEL,
    instructions: instructionPrompt,
    input: message,
    max_output_tokens: OPENAI_MAX_OUTPUT_TOKENS,
    store: false,
  });

  if (!response.ok) {
    throw new Error("OpenAI returned status " + response.status);
  }

  const data = await response.json();
  const text = extractOpenAIText(data);

  if (!text) {
    throw new Error("OpenAI response did not contain text");
  }

  return text;
}

function checkRateLimit(clientIp) {
  const now = Date.now();
  const current = rateLimitStore.get(clientIp);

  // This in-memory limiter is only suitable for the MVP. A public deployment should use
  // production-grade rate limiting shared across server instances, such as a gateway or Redis.
  if (!current || now > current.resetAt) {
    rateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  if (current.count >= RATE_LIMIT_MAX_MESSAGES) {
    return { allowed: false, resetAt: current.resetAt };
  }

  current.count += 1;
  return { allowed: true };
}

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (forwardedFor) {
    return String(forwardedFor).split(",")[0].trim();
  }

  return request.socket.remoteAddress || "unknown";
}

function logChatStatus(status, tenantId, clientIp) {
  // Avoid logging citizen messages. Even a simple question may contain personal data.
  console.log(
    "chat_status=" +
      status +
      " tenant=" +
      tenantId +
      " ip=" +
      maskIp(clientIp)
  );
}

function maskIp(clientIp) {
  if (!clientIp || clientIp === "unknown") {
    return "unknown";
  }

  if (clientIp.includes(".")) {
    return clientIp.split(".").slice(0, 3).join(".") + ".x";
  }

  if (clientIp.includes(":")) {
    return clientIp.split(":").slice(0, 4).join(":") + "::";
  }

  return "masked";
}

async function postJson(url, body) {
  if (typeof fetch === "function") {
    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  // Older Node versions do not have built-in fetch. This tiny fallback still avoids npm packages.
  return postJsonWithHttps(url, body);
}

function postJsonWithHttps(url, body) {
  const https = require("https");
  const parsedUrl = new URL(url);
  const payload = JSON.stringify(body);

  return new Promise(function (resolve, reject) {
    const request = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
        method: "POST",
        headers: {
          Authorization: "Bearer " + OPENAI_API_KEY,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      function (response) {
        let rawBody = "";

        response.on("data", function (chunk) {
          rawBody += chunk;
        });

        response.on("end", function () {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode,
            json: async function () {
              return rawBody ? JSON.parse(rawBody) : {};
            },
          });
        });
      }
    );

    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

function extractOpenAIText(data) {
  if (data.output_text) {
    return data.output_text;
  }

  if (!Array.isArray(data.output)) {
    return "";
  }

  return data.output
    .flatMap(function (item) {
      return Array.isArray(item.content) ? item.content : [];
    })
    .filter(function (content) {
      return content.type === "output_text" && content.text;
    })
    .map(function (content) {
      return content.text;
    })
    .join("\n")
    .trim();
}

function readJsonBody(request) {
  return new Promise(function (resolve, reject) {
    let rawBody = "";

    request.on("data", function (chunk) {
      rawBody += chunk;

      // Keep the beginner demo safe from very large requests.
      if (rawBody.length > 10000) {
        request.destroy();
        reject(new Error("Request body is too large"));
      }
    });

    request.on("end", function () {
      try {
        resolve(rawBody ? JSON.parse(rawBody) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function loadTenant(tenantId) {
  const safeTenantId = String(tenantId).replace(/[^a-z0-9-]/gi, "");
  const tenantPath = path.join(TENANTS_DIR, safeTenantId + ".json");

  if (!fs.existsSync(tenantPath)) {
    return loadTenant("demo");
  }

  return JSON.parse(fs.readFileSync(tenantPath, "utf8"));
}

function serveStaticFile(request, response) {
  const requestedPath = request.url === "/" ? "/demo/demo.html" : request.url;
  const cleanPath = decodeURIComponent(requestedPath.split("?")[0]);
  const filePath = path.normalize(path.join(ROOT_DIR, cleanPath));

  // Prevent paths like /../../secret.txt from escaping the project folder.
  if (!filePath.startsWith(ROOT_DIR)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, function (error, content) {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": CONTENT_TYPES[extension] || "text/plain; charset=utf-8",
    });
    response.end(content);
  });
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}
