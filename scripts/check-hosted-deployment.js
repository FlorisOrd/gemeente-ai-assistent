const http = require("http");
const https = require("https");

const BASE_URL = process.env.BASE_URL;
const STAGING_ORIGIN = "https://staging.example.com";
const BLOCKED_ORIGIN = "https://evil.example";

let failures = 0;

run()
  .catch(function (error) {
    failures += 1;
    console.error("FAIL Unexpected hosted deployment check error");
    console.error("  " + error.message);
  })
  .finally(function () {
    process.exit(failures > 0 ? 1 : 0);
  });

async function run() {
  if (!BASE_URL) {
    console.error("FAIL BASE_URL is missing.");
    console.error(
      "  Example: BASE_URL=https://assistant.example.nl node scripts/check-hosted-deployment.js"
    );
    failures += 1;
    return;
  }

  const baseUrl = normalizeBaseUrl(BASE_URL);

  console.log("Checking hosted deployment at " + baseUrl);

  await test("GET /health returns 200", async function () {
    const response = await request(baseUrl, {
      method: "GET",
      path: "/health",
    });

    assertEqual(response.statusCode, 200);
  });

  await test("GET /ready returns 200", async function () {
    const response = await request(baseUrl, {
      method: "GET",
      path: "/ready",
    });

    assertEqual(response.statusCode, 200);
  });

  await test("GET /api/config allows the staging origin", async function () {
    const response = await request(baseUrl, {
      method: "GET",
      path: "/api/config?tenant=staging",
      origin: STAGING_ORIGIN,
    });

    assertEqual(response.statusCode, 200);
  });

  await test("POST /api/chat allows a staging passport question", async function () {
    const response = await request(baseUrl, {
      method: "POST",
      path: "/api/chat?tenant=staging",
      origin: STAGING_ORIGIN,
      body: {
        message: "Hoe vraag ik een paspoort aan?",
      },
    });

    assertEqual(response.statusCode, 200);
  });

  await test("POST /api/chat blocks an unapproved origin", async function () {
    const response = await request(baseUrl, {
      method: "POST",
      path: "/api/chat?tenant=staging",
      origin: BLOCKED_ORIGIN,
      body: {
        message: "Hoe vraag ik een paspoort aan?",
      },
    });

    assertEqual(response.statusCode, 403);
  });
}

async function test(name, fn) {
  try {
    await fn();
    console.log("PASS " + name);
  } catch (error) {
    failures += 1;
    console.error("FAIL " + name);
    console.error("  " + error.message);
  }
}

function normalizeBaseUrl(value) {
  return String(value).replace(/\/+$/, "");
}

function request(baseUrl, options) {
  return new Promise(function (resolve, reject) {
    const url = new URL(options.path, baseUrl);
    const body = options.body ? JSON.stringify(options.body) : "";
    const headers = {};
    const client = url.protocol === "https:" ? https : http;

    if (options.origin) {
      headers.Origin = options.origin;
    }

    if (body) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(body);
    }

    const req = client.request(
      {
        hostname: url.hostname,
        port: url.port || undefined,
        path: url.pathname + url.search,
        method: options.method,
        headers: headers,
      },
      function (res) {
        let rawBody = "";

        res.on("data", function (chunk) {
          rawBody += chunk;
        });

        res.on("end", function () {
          resolve({
            statusCode: res.statusCode,
            body: rawBody,
          });
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error("Expected " + expected + " but got " + actual);
  }
}
