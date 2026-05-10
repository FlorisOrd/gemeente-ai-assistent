const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const TENANTS_DIR = path.join(__dirname, "tenants");
const KNOWLEDGE_DIR = path.join(__dirname, "knowledge");
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
  "gemeentelijke belasting",
  "woz",
  "woz-waarde",
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
const GREETING_WORDS = ["hallo", "hoi", "goedemorgen", "goedemiddag", "goedenavond"];

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async function (request, response) {
  try {
    const url = new URL(request.url, "http://localhost");

    if (request.method === "GET" && url.pathname === "/health") {
      handleHealth(response);
      return;
    }

    if (request.method === "GET" && url.pathname === "/ready") {
      handleReady(response);
      return;
    }

    if (request.method === "OPTIONS") {
      handleOptions(request, response);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/config") {
      handleConfig(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
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
  console.log("port=" + PORT);
  console.log("mode=" + getServerMode());
  console.log("tenants_loaded=" + getTenantCountForLog());
  console.log("demo_url=http://localhost:" + PORT + "/demo/demo.html");
});

function handleHealth(response) {
  // Health checks are intentionally public and contain no tenant or secret data.
  logEvent("health_check", {
    statusCode: 200,
    mode: getServerMode(),
  });
  sendJson(response, 200, {
    status: "ok",
    service: "gemeente-ai-assistent",
    mode: getServerMode(),
  });
}

function handleReady(response) {
  try {
    const tenantFiles = getTenantFiles();

    tenantFiles.forEach(function (tenantFile) {
      loadTenantFromFile(tenantFile);
    });
    logEvent("ready_check", {
      statusCode: 200,
    });
    sendJson(response, 200, {
      status: "ready",
      tenants: tenantFiles.length,
    });
  } catch (error) {
    // Keep readiness errors safe for browsers and logs. Do not expose file paths.
    logEvent("ready_check", {
      statusCode: 500,
    });
    sendJson(response, 500, {
      status: "error",
      error: "Tenantconfiguratie kan niet worden geladen.",
    });
  }
}

function handleConfig(request, response) {
  const url = new URL(request.url, "http://localhost");
  const tenantId = url.searchParams.get("tenant") || "demo";
  const tenant = loadTenant(tenantId);
  const origin = getRequestOrigin(request);
  const publicConfig = getPublicTenantConfig(tenant);

  if (!isAllowedOrigin(origin, tenant)) {
    logEvent("chat_blocked_origin", {
      tenant: tenant.id,
      statusCode: 403,
      origin: origin || "missing",
    });
    sendJson(response, 403, {
      error: "Deze website mag deze assistent niet gebruiken.",
    });
    return;
  }

  sendCorsHeaders(response, origin, tenant);

  // This endpoint returns only public configuration that the browser may safely use.
  // Do not add API keys, internal settings, prompts, or private tenant data here.
  logEvent("config_loaded", {
    tenant: tenant.id,
    statusCode: 200,
    origin: origin || "missing",
  });
  sendJson(response, 200, publicConfig);
}

function getPublicTenantConfig(tenant) {
  return {
    id: tenant.id || "demo",
    municipalityName: tenant.municipalityName || "Gemeente Demo",
    assistantName: tenant.assistantName || "Gemeente AI Assistent",
    themeColor: tenant.themeColor || "#0f766e",
    buttonLabel: tenant.buttonLabel || "Vraag de gemeente",
    welcomeMessage:
      tenant.welcomeMessage ||
      "Hoi, ik ben Gemeente AI Assistent. Waarmee kan ik helpen?",
    position: tenant.position || "bottom-right",
    logoText: tenant.logoText || "AI",
    contactUrl: tenant.contactUrl || "https://example.com/contact",
    privacyUrl: tenant.privacyUrl || "https://example.com/privacy",
    allowedTopics: Array.isArray(tenant.allowedTopics) ? tenant.allowedTopics : [],
  };
}

function handleOptions(request, response) {
  const url = new URL(request.url, "http://localhost");

  if (url.pathname !== "/api/chat" && url.pathname !== "/api/config") {
    response.writeHead(404);
    response.end();
    return;
  }

  const tenantId = url.searchParams.get("tenant") || "demo";
  const tenant = loadTenant(tenantId);
  const origin = getRequestOrigin(request);

  if (!isAllowedOrigin(origin, tenant)) {
    logEvent("chat_blocked_origin", {
      tenant: tenant.id,
      statusCode: 403,
      origin: origin || "missing",
    });
    sendJson(response, 403, {
      error: "Deze website mag deze assistent niet gebruiken.",
    });
    return;
  }

  sendCorsHeaders(response, origin, tenant);
  response.writeHead(204);
  response.end();
}

function getRequestOrigin(request) {
  return request.headers.origin || "";
}

function getServerMode() {
  return OPENAI_API_KEY ? "openai" : "mock";
}

function getTenantFiles() {
  const tenantFiles = fs
    .readdirSync(TENANTS_DIR)
    .filter(function (fileName) {
      return fileName.endsWith(".json");
    });

  if (tenantFiles.length === 0) {
    throw new Error("No tenant files found");
  }

  return tenantFiles;
}

function getTenantCountForLog() {
  try {
    return getTenantFiles().length;
  } catch (error) {
    return "unknown";
  }
}

function isAllowedOrigin(origin, tenant) {
  if (!origin) {
    // Local manual tests and same-origin demo requests may not include an Origin header.
    // Public browser embeds should send Origin, so production tenants should rely on explicit origins.
    return true;
  }

  return Array.isArray(tenant.allowedOrigins)
    ? tenant.allowedOrigins.includes(origin)
    : false;
}

function sendCorsHeaders(response, origin, tenant) {
  if (origin && isAllowedOrigin(origin, tenant)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

async function handleChat(request, response) {
  const requestId = createRequestId();
  const startedAt = Date.now();
  const url = new URL(request.url, "http://localhost");
  const tenantId = url.searchParams.get("tenant") || "demo";
  const tenant = loadTenant(tenantId);
  const origin = getRequestOrigin(request);
  const clientIp = getClientIp(request);

  response.setHeader("X-Request-Id", requestId);

  logEvent("chat_started", {
    requestId: requestId,
    tenant: tenant.id,
    mode: getServerMode(),
    ip: clientIp,
    origin: origin || "missing",
  });

  if (!isAllowedOrigin(origin, tenant)) {
    logEvent("chat_blocked_origin", {
      requestId: requestId,
      tenant: tenant.id,
      statusCode: 403,
      durationMs: getDurationMs(startedAt),
      ip: clientIp,
      origin: origin || "missing",
    });
    sendJson(response, 403, {
      error: "Deze website mag deze assistent niet gebruiken.",
      requestId: requestId,
    });
    return;
  }

  sendCorsHeaders(response, origin, tenant);

  let body;

  try {
    body = await readJsonBody(request);
  } catch (error) {
    logEvent("chat_validation_error", {
      requestId: requestId,
      tenant: tenant.id,
      statusCode: 400,
      durationMs: getDurationMs(startedAt),
      ip: clientIp,
      origin: origin || "missing",
    });
    sendJson(response, 400, {
      error: "Het bericht kon niet worden gelezen. Probeer het opnieuw.",
      requestId: requestId,
    });
    return;
  }

  const message = String(body.message || "").trim();

  if (!message) {
    logEvent("chat_validation_error", {
      requestId: requestId,
      tenant: tenant.id,
      statusCode: 400,
      durationMs: getDurationMs(startedAt),
      ip: clientIp,
      origin: origin || "missing",
    });
    sendJson(response, 400, {
      error: "Typ eerst een vraag voordat u het bericht verstuurt.",
      requestId: requestId,
    });
    return;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    logEvent("chat_validation_error", {
      requestId: requestId,
      tenant: tenant.id,
      statusCode: 400,
      durationMs: getDurationMs(startedAt),
      ip: clientIp,
      origin: origin || "missing",
    });
    sendJson(response, 400, {
      error:
        "Uw bericht is te lang. Houd uw vraag korter dan " +
        MAX_MESSAGE_LENGTH +
        " tekens.",
      requestId: requestId,
    });
    return;
  }

  if (isGreeting(message)) {
    logEvent("chat_success", {
      requestId: requestId,
      tenant: tenant.id,
      mode: "greeting",
      statusCode: 200,
      durationMs: getDurationMs(startedAt),
      ip: clientIp,
      origin: origin || "missing",
      sourceCount: 0,
    });
    sendJson(response, 200, {
      tenant: tenant.id,
      assistantName: tenant.assistantName,
      message:
        "Hallo, ik ben " +
        tenant.assistantName +
        ". Ik kan helpen met vragen over gemeentelijke onderwerpen zoals paspoorten, verhuizen, afval, vergunningen, parkeren, WOZ of contact met de gemeente.",
      sources: getContactSources(tenant),
      mode: "greeting",
    });
    return;
  }

  if (!isProbablyAllowedTopic(message, tenant)) {
    logEvent("chat_off_topic", {
      requestId: requestId,
      tenant: tenant.id,
      mode: "off-topic",
      statusCode: 200,
      durationMs: getDurationMs(startedAt),
      ip: clientIp,
      origin: origin || "missing",
    });
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
    logEvent("chat_rate_limited", {
      requestId: requestId,
      tenant: tenant.id,
      statusCode: 429,
      durationMs: getDurationMs(startedAt),
      ip: clientIp,
      origin: origin || "missing",
    });
    sendJson(response, 429, {
      error:
        "U heeft te veel berichten kort achter elkaar gestuurd. Wacht een paar minuten en probeer het daarna opnieuw.",
      requestId: requestId,
    });
    return;
  }

  const knowledgeItems = loadKnowledge(tenant.id);
  const relevantKnowledge = findRelevantKnowledge(message, knowledgeItems);

  if (relevantKnowledge.length === 0) {
    logEvent("chat_no_approved_source", {
      requestId: requestId,
      tenant: tenant.id,
      mode: "no-approved-source",
      statusCode: 200,
      durationMs: getDurationMs(startedAt),
      ip: clientIp,
      origin: origin || "missing",
      sourceCount: 0,
    });
    sendJson(response, 200, {
      tenant: tenant.id,
      assistantName: tenant.assistantName,
      message:
        "Ik heb hiervoor nog geen goedgekeurde gemeentelijke informatie beschikbaar. Controleer de officiele website van de gemeente of neem contact op via de contactpagina.",
      sources: getContactSources(tenant),
      mode: "no-approved-source",
    });
    return;
  }

  if (OPENAI_API_KEY) {
    try {
      const openAIMessage = await callOpenAI(message, tenant, relevantKnowledge);

      logEvent("chat_success", {
        requestId: requestId,
        tenant: tenant.id,
        mode: "openai",
        statusCode: 200,
        durationMs: getDurationMs(startedAt),
        ip: clientIp,
        origin: origin || "missing",
        sourceCount: relevantKnowledge.length,
      });
      sendJson(response, 200, {
        tenant: tenant.id,
        assistantName: tenant.assistantName,
        message: openAIMessage,
        sources: getSourceLinks(relevantKnowledge),
        mode: "openai",
      });
      return;
    } catch (error) {
      // Keep raw provider errors on the server only. Visitors get a friendly Dutch message.
      logEvent("chat_openai_error", {
        requestId: requestId,
        tenant: tenant.id,
        mode: "openai-error",
        statusCode: 200,
        durationMs: getDurationMs(startedAt),
        ip: clientIp,
        origin: origin || "missing",
        sourceCount: relevantKnowledge.length,
      });
      sendJson(response, 200, {
        tenant: tenant.id,
        assistantName: tenant.assistantName,
        message:
          "Sorry, de assistent kan nu geen antwoord ophalen. Probeer het later opnieuw of neem contact op met de gemeente via de officiele contactkanalen.",
        sources: tenant.mockSources,
        mode: "openai-error",
        requestId: requestId,
      });
      return;
    }
  }

  // This is intentionally a mock answer. It keeps the demo working without an API key.
  logEvent("chat_success", {
    requestId: requestId,
    tenant: tenant.id,
    mode: "mock",
    statusCode: 200,
    durationMs: getDurationMs(startedAt),
    ip: clientIp,
    origin: origin || "missing",
    sourceCount: relevantKnowledge.length,
  });
  sendJson(response, 200, {
    tenant: tenant.id,
    assistantName: tenant.assistantName,
    message:
      "Bedankt voor uw vraag. Dit is een demo-antwoord van " +
      tenant.assistantName +
      ". Ik heb een relevante goedgekeurde bron gevonden: " +
      relevantKnowledge[0].title +
      ". In een echte versie gebruikt de assistent alleen dit soort goedgekeurde gemeentelijke bronnen.",
    sources: getSourceLinks(relevantKnowledge),
    mode: "mock",
  });
}

function isGreeting(message) {
  const normalizedMessage = normalizeText(message).replace(/[.!?]/g, "").trim();

  return GREETING_WORDS.some(function (greeting) {
    return normalizedMessage === greeting;
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

function loadKnowledge(tenantId) {
  const safeTenantId = String(tenantId).replace(/[^a-z0-9-]/gi, "");
  const knowledgePath = path.join(KNOWLEDGE_DIR, safeTenantId + ".json");

  if (!fs.existsSync(knowledgePath)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(knowledgePath, "utf8"));
  } catch (error) {
    // Keep raw file errors away from visitors. The deployment checker catches invalid JSON.
    console.error("knowledge_status=load_failed tenant=" + safeTenantId);
    return [];
  }
}

function findRelevantKnowledge(message, knowledgeItems) {
  const normalizedMessage = normalizeText(message);

  // MVP keyword matching: simple, readable, and good enough for demos.
  // Production should replace this with an approved search or retrieval pipeline.
  return knowledgeItems
    .map(function (item) {
      const keywords = Array.isArray(item.keywords) ? item.keywords : [];
      const titleWords = String(item.title || "")
        .split(" ")
        .filter(function (word) {
          return word.length >= 4;
        });
      const searchTerms = keywords.concat(titleWords);
      const score = searchTerms.reduce(function (total, term) {
        return normalizedMessage.includes(normalizeText(term)) ? total + 1 : total;
      }, 0);

      return {
        item: item,
        score: score,
      };
    })
    .filter(function (result) {
      return result.score > 0;
    })
    .sort(function (a, b) {
      return b.score - a.score;
    })
    .slice(0, 3)
    .map(function (result) {
      return result.item;
    });
}

function getSourceLinks(knowledgeItems) {
  return knowledgeItems.map(function (item) {
    return {
      title: item.title,
      url: item.url,
    };
  });
}

function getContactSources(tenant) {
  if (!tenant.contactUrl) {
    return [];
  }

  return [
    {
      title: "Contact met " + tenant.municipalityName,
      url: tenant.contactUrl,
    },
  ];
}

async function callOpenAI(message, tenant, relevantKnowledge) {
  const approvedSummaries = relevantKnowledge
    .map(function (item, index) {
      return (
        index +
        1 +
        ". " +
        item.title +
        "\nURL: " +
        item.url +
        "\nSamenvatting: " +
        item.summary
      );
    })
    .join("\n\n");
  const instructionPrompt =
    "Je bent " +
    tenant.assistantName +
    " voor " +
    tenant.municipalityName +
    ". Antwoord in helder Nederlands. Gebruik alleen de goedgekeurde bronsamenvattingen hieronder. Verzin geen details en gebruik geen algemene modelkennis. Als de goedgekeurde samenvattingen onvoldoende informatie bevatten, zeg dat duidelijk en verwijs naar de contactpagina: " +
    tenant.contactUrl +
    ". Vraag nooit om een BSN. Verwerk geen gevoelige persoonsgegevens. Neem geen definitieve juridische beslissingen en doe niet alsof je een officieel besluit namens de gemeente neemt. Link gebruikers naar de officiele bronnen. Houd antwoorden kort en praktisch.\n\nGoedgekeurde bronsamenvattingen:\n" +
    approvedSummaries;

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

function createRequestId() {
  // Request IDs are random technical references. They never contain citizen messages.
  return (
    "req_" + Date.now().toString(36) + "_" + crypto.randomBytes(4).toString("hex")
  );
}

function getDurationMs(startedAt) {
  return Date.now() - startedAt;
}

function logEvent(eventName, details) {
  const detailsObject = details || {};
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: eventName,
  };
  const safeFields = [
    "requestId",
    "tenant",
    "mode",
    "statusCode",
    "durationMs",
    "origin",
    "sourceCount",
  ];

  safeFields.forEach(function (field) {
    if (detailsObject[field] !== undefined) {
      logEntry[field] = detailsObject[field];
    }
  });

  if (detailsObject.ip) {
    logEntry.maskedIp = maskIp(detailsObject.ip);
  }

  // Logs deliberately avoid citizen messages, prompts, API keys, source summaries,
  // and raw OpenAI responses because those may contain sensitive personal data.
  console.log(JSON.stringify(logEntry));
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

  return loadTenantFromFile(safeTenantId + ".json");
}

function loadTenantFromFile(fileName) {
  return JSON.parse(fs.readFileSync(path.join(TENANTS_DIR, fileName), "utf8"));
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
