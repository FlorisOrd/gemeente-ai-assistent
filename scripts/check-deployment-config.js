const fs = require("fs");
const path = require("path");

const TENANTS_DIR = path.join(__dirname, "..", "apps", "server", "tenants");
const KNOWLEDGE_DIR = path.join(__dirname, "..", "apps", "server", "knowledge");
const REQUIRED_FIELDS = [
  "id",
  "municipalityName",
  "assistantName",
  "contactUrl",
  "privacyUrl",
  "allowedOrigins",
  "allowedTopics",
  "mockSources",
];
const REQUIRED_KNOWLEDGE_FIELDS = ["id", "title", "url", "keywords", "summary"];
const MIN_SUMMARY_LENGTH = 60;

let failures = 0;
let warnings = 0;

run();

function run() {
  console.log("Checking tenant deployment configuration...");

  const tenantFiles = getTenantFiles();

  tenantFiles.forEach(function (fileName) {
    checkTenantFile(fileName);
  });

  if (failures > 0) {
    console.error(
      "FAIL Deployment config check finished with " + failures + " failure(s)."
    );
    process.exit(1);
  }

  if (warnings > 0) {
    console.warn(
      "WARN Deployment config check finished with " + warnings + " warning(s)."
    );
    process.exit(0);
  }

  console.log("PASS Deployment config check passed.");
}

function getTenantFiles() {
  try {
    const tenantFiles = fs
      .readdirSync(TENANTS_DIR)
      .filter(function (fileName) {
        return fileName.endsWith(".json");
      })
      .sort();

    if (tenantFiles.length === 0) {
      fail("No tenant JSON files found.");
    } else {
      pass("Found " + tenantFiles.length + " tenant JSON file(s).");
    }

    return tenantFiles;
  } catch (error) {
    fail("Could not read tenant config directory.");
    return [];
  }
}

function checkTenantFile(fileName) {
  const filePath = path.join(TENANTS_DIR, fileName);
  const tenant = readTenantJson(filePath, fileName);

  if (!tenant) {
    return;
  }

  const label = tenant.id || fileName;

  REQUIRED_FIELDS.forEach(function (fieldName) {
    if (!hasValue(tenant[fieldName])) {
      fail(label + " is missing required field: " + fieldName);
    }
  });

  if (!Array.isArray(tenant.allowedOrigins) || tenant.allowedOrigins.length === 0) {
    fail(label + " must have a non-empty allowedOrigins array.");
  } else {
    pass(label + " has allowedOrigins.");

    if (
      tenant.allowedOrigins.every(function (origin) {
        return String(origin).startsWith("http://localhost");
      })
    ) {
      warn(label + " has only localhost origins.");
    }

    tenant.allowedOrigins.forEach(function (origin) {
      if (usesPlaceholderUrl(origin)) {
        warn(label + " allowedOrigins contains placeholder/example.com.");
      }
    });
  }

  if (!Array.isArray(tenant.allowedTopics)) {
    fail(label + " must have allowedTopics as an array.");
  }

  if (!Array.isArray(tenant.mockSources)) {
    fail(label + " must have mockSources as an array.");
  }

  if (!isHexColor(tenant.themeColor)) {
    warn(label + " themeColor is missing or is not a hex color.");
  }

  if (!hasValue(tenant.buttonLabel)) {
    warn(label + " is missing buttonLabel.");
  }

  if (!hasValue(tenant.welcomeMessage)) {
    warn(label + " is missing welcomeMessage.");
  }

  if (tenant.position !== "bottom-right" && tenant.position !== "bottom-left") {
    warn(label + " position should be bottom-right or bottom-left.");
  }

  if (String(tenant.logoText || "").trim().length > 4) {
    warn(label + " logoText should be 4 characters or shorter.");
  }

  if (usesPlaceholderUrl(tenant.contactUrl)) {
    warn(label + " contactUrl uses placeholder/example.com.");
  }

  if (usesPlaceholderUrl(tenant.privacyUrl)) {
    warn(label + " privacyUrl uses placeholder/example.com.");
  }

  checkKnowledgeFile(label);
}

function readTenantJson(filePath, fileName) {
  try {
    const rawJson = fs.readFileSync(filePath, "utf8");
    const tenant = JSON.parse(rawJson);

    pass(fileName + " contains valid JSON.");
    return tenant;
  } catch (error) {
    fail(fileName + " contains invalid JSON.");
    return null;
  }
}

function hasValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && String(value).trim() !== "";
}

function usesPlaceholderUrl(value) {
  const text = String(value || "");
  return text.includes("example.com") || text.includes("placeholder");
}

function isHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || ""));
}

function checkKnowledgeFile(tenantId) {
  const knowledgePath = path.join(KNOWLEDGE_DIR, tenantId + ".json");

  if (!fs.existsSync(knowledgePath)) {
    warn(tenantId + " has no matching knowledge file.");
    return;
  }

  const knowledgeItems = readKnowledgeJson(knowledgePath, tenantId);

  if (!knowledgeItems) {
    return;
  }

  if (!Array.isArray(knowledgeItems)) {
    fail(tenantId + " knowledge file must contain an array.");
    return;
  }

  knowledgeItems.forEach(function (item, index) {
    const label = tenantId + " knowledge item " + (item.id || index + 1);

    REQUIRED_KNOWLEDGE_FIELDS.forEach(function (fieldName) {
      if (!hasValue(item[fieldName])) {
        fail(label + " is missing required field: " + fieldName);
      }
    });

    if (!Array.isArray(item.keywords)) {
      fail(label + " must have keywords as an array.");
    }

    if (usesPlaceholderUrl(item.url)) {
      warn(label + " url uses placeholder/example.com.");
    }

    if (String(item.summary || "").trim().length < MIN_SUMMARY_LENGTH) {
      warn(label + " summary is very short.");
    }
  });
}

function readKnowledgeJson(filePath, tenantId) {
  try {
    const rawJson = fs.readFileSync(filePath, "utf8");
    const knowledgeItems = JSON.parse(rawJson);

    pass(tenantId + " knowledge file contains valid JSON.");
    return knowledgeItems;
  } catch (error) {
    fail(tenantId + " knowledge file contains invalid JSON.");
    return null;
  }
}

function pass(message) {
  console.log("PASS " + message);
}

function warn(message) {
  warnings += 1;
  console.warn("WARN " + message);
}

function fail(message) {
  failures += 1;
  console.error("FAIL " + message);
}
