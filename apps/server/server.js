const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const TENANTS_DIR = path.join(__dirname, "tenants");

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

  if (!message) {
    sendJson(response, 400, {
      error: "Typ eerst een vraag voordat u het bericht verstuurt.",
    });
    return;
  }

  // This is intentionally a mock answer. Later, this is where retrieval and AI calls can be added.
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
  });
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
