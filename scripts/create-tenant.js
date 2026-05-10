const fs = require("fs");
const path = require("path");

const tenantId = process.argv[2];
const ROOT_DIR = path.join(__dirname, "..");
const TENANT_TEMPLATE_PATH = path.join(ROOT_DIR, "templates", "tenant.template.json");
const KNOWLEDGE_TEMPLATE_PATH = path.join(
  ROOT_DIR,
  "templates",
  "knowledge.template.json"
);
const TENANTS_DIR = path.join(ROOT_DIR, "apps", "server", "tenants");
const KNOWLEDGE_DIR = path.join(ROOT_DIR, "apps", "server", "knowledge");

run();

function run() {
  if (!tenantId) {
    fail("Usage: node scripts/create-tenant.js nieuwegemeente");
  }

  if (!/^[a-z0-9-]+$/.test(tenantId)) {
    fail("Tenant id may only contain lowercase letters, numbers, and hyphens.");
  }

  const tenantPath = path.join(TENANTS_DIR, tenantId + ".json");
  const knowledgePath = path.join(KNOWLEDGE_DIR, tenantId + ".json");

  if (fs.existsSync(tenantPath) || fs.existsSync(knowledgePath)) {
    fail("Tenant or knowledge file already exists for: " + tenantId);
  }

  const tenantTemplate = readTemplate(TENANT_TEMPLATE_PATH);
  const knowledgeTemplate = readTemplate(KNOWLEDGE_TEMPLATE_PATH);

  fs.writeFileSync(tenantPath, fillTemplate(tenantTemplate, tenantId), "utf8");
  fs.writeFileSync(
    knowledgePath,
    fillTemplate(knowledgeTemplate, tenantId),
    "utf8"
  );

  console.log("PASS Created tenant starter files for: " + tenantId);
  console.log("  " + path.relative(ROOT_DIR, tenantPath));
  console.log("  " + path.relative(ROOT_DIR, knowledgePath));
  console.log("");
  console.log("Next steps:");
  console.log("1. Edit the tenant file with the real municipality name, links, and allowedOrigins.");
  console.log("2. Edit the knowledge file with approved source URLs and summaries.");
  console.log("3. Do not add API keys, BSN examples, private data, or unapproved content.");
  console.log("4. Run: node scripts/check-deployment-config.js");
  console.log("5. Run: node scripts/smoke-test.js");
}

function readTemplate(templatePath) {
  return fs.readFileSync(templatePath, "utf8");
}

function fillTemplate(template, id) {
  return template.replace(/__TENANT_ID__/g, id);
}

function fail(message) {
  console.error("FAIL " + message);
  process.exit(1);
}
