const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const PORT = 3100;
const ORIGIN = "http://localhost:3000";
const SERVER_PATH = path.join(__dirname, "..", "apps", "server", "server.js");

let serverProcess;
let failures = 0;

runSmokeTests()
  .catch(function (error) {
    failures += 1;
    console.error("FAIL Unexpected smoke test error");
    console.error(error.message);
  })
  .finally(async function () {
    await stopServer();
    process.exit(failures > 0 ? 1 : 0);
  });

async function runSmokeTests() {
  console.log("Starting smoke test server on port " + PORT + "...");
  await startServer();

  await test("GET /api/config returns 200 for allowed origin", async function () {
    const response = await request({
      method: "GET",
      path: "/api/config?tenant=demo",
      origin: ORIGIN,
    });

    assertEqual(response.statusCode, 200);
  });

  await test("POST /api/chat allows a passport question", async function () {
    const response = await request({
      method: "POST",
      path: "/api/chat?tenant=demo",
      origin: ORIGIN,
      body: {
        message: "Hoe vraag ik een paspoort aan?",
      },
    });

    assertEqual(response.statusCode, 200);
  });

  await test("POST /api/chat rejects an off-topic cake question", async function () {
    const response = await request({
      method: "POST",
      path: "/api/chat?tenant=demo",
      origin: ORIGIN,
      body: {
        message: "Hoe bak ik een cake?",
      },
    });

    assertEqual(response.statusCode, 200);
    assertEqual(response.json.mode, "off-topic");
  });

  await test("POST /api/chat rejects an unapproved origin", async function () {
    const response = await request({
      method: "POST",
      path: "/api/chat?tenant=demo",
      origin: "https://evil.example",
      body: {
        message: "Hoe vraag ik een paspoort aan?",
      },
    });

    assertEqual(response.statusCode, 403);
  });

  await test("POST /api/chat rejects an empty message", async function () {
    const response = await request({
      method: "POST",
      path: "/api/chat?tenant=demo",
      origin: ORIGIN,
      body: {
        message: "",
      },
    });

    assertEqual(response.statusCode, 400);
  });

  await test("POST /api/chat rejects a message over 1000 characters", async function () {
    const response = await request({
      method: "POST",
      path: "/api/chat?tenant=demo",
      origin: ORIGIN,
      body: {
        message: "a".repeat(1001),
      },
    });

    assertEqual(response.statusCode, 400);
  });
}

function startServer() {
  return new Promise(function (resolve, reject) {
    const env = Object.assign({}, process.env, {
      PORT: String(PORT),
    });

    // The smoke test must run in mock mode, so it deliberately removes any real API key.
    delete env.OPENAI_API_KEY;

    serverProcess = spawn(process.execPath, [SERVER_PATH], {
      env: env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    serverProcess.on("error", reject);
    serverProcess.on("exit", function (code) {
      if (code !== null && code !== 0 && code !== 143) {
        reject(new Error("Server exited early with code " + code));
      }
    });

    waitForServer(resolve, reject, 0);
  });
}

function waitForServer(resolve, reject, attempt) {
  if (attempt > 40) {
    reject(new Error("Server did not start on port " + PORT));
    return;
  }

  request({
    method: "GET",
    path: "/api/config?tenant=demo",
    origin: ORIGIN,
  })
    .then(function () {
      resolve();
    })
    .catch(function () {
      setTimeout(function () {
        waitForServer(resolve, reject, attempt + 1);
      }, 100);
    });
}

function stopServer() {
  return new Promise(function (resolve) {
    if (!serverProcess || serverProcess.killed) {
      resolve();
      return;
    }

    serverProcess.once("exit", function () {
      resolve();
    });
    serverProcess.kill();

    setTimeout(function () {
      resolve();
    }, 1000);
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

function request(options) {
  return new Promise(function (resolve, reject) {
    const body = options.body ? JSON.stringify(options.body) : "";
    const headers = {};

    if (options.origin) {
      headers.Origin = options.origin;
    }

    if (body) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(body);
    }

    const requestOptions = {
      hostname: "localhost",
      port: PORT,
      path: options.path,
      method: options.method,
      headers: headers,
    };

    const req = http.request(requestOptions, function (res) {
      let rawBody = "";

      res.on("data", function (chunk) {
        rawBody += chunk;
      });

      res.on("end", function () {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: rawBody,
          json: parseJson(rawBody),
        });
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function parseJson(rawBody) {
  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch (error) {
    return {};
  }
}

function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error("Expected " + expected + " but got " + actual);
  }
}
