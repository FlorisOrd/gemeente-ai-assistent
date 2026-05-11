(function () {
  "use strict";

  var currentScript = document.currentScript;
  var tenant = currentScript ? currentScript.getAttribute("data-tenant") : "demo";
  var apiBase = currentScript ? currentScript.getAttribute("data-api-base") || "" : "";
  var widgetId = "gemeente-ai-assistent-widget";
  var tenantConfig = {
    id: tenant || "demo",
    municipalityName: "Gemeente Demo",
    assistantName: "Gemeente AI Assistent",
    themeColor: "#0f766e",
    buttonLabel: "Vraag de gemeente",
    welcomeMessage: "Hoi, ik ben Gemeente AI Assistent. Waarmee kan ik helpen?",
    position: "bottom-right",
    logoText: "AI",
    contactUrl: "https://example.com/contact",
    privacyUrl: "https://example.com/privacy",
    allowedTopics: [
      "paspoorten en identiteitskaarten",
      "verhuizen",
      "afval",
      "vergunningen",
      "contact met de gemeente",
    ],
  };

  if (document.getElementById(widgetId)) {
    return;
  }

  var container = document.createElement("div");
  container.id = widgetId;
  container.className = "gemeente-ai-assistent-position-bottom-right";

  var button = document.createElement("button");
  button.type = "button";
  button.className = "gemeente-ai-assistent-button";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "gemeente-ai-assistent-panel");
  button.innerHTML =
    '<span class="gemeente-ai-assistent-button-logo" aria-hidden="true">AI</span>' +
    '<span class="gemeente-ai-assistent-button-label">Vraag de gemeente</span>';

  var panel = document.createElement("section");
  panel.id = "gemeente-ai-assistent-panel";
  panel.className = "gemeente-ai-assistent-panel";
  panel.setAttribute("aria-label", "Gemeente AI Assistent");
  panel.hidden = true;

  // The widget builds its own small interface so the host website only needs one script tag.
  panel.innerHTML =
    '<div class="gemeente-ai-assistent-header">' +
    '  <div class="gemeente-ai-assistent-brand">' +
    '    <span class="gemeente-ai-assistent-logo" aria-hidden="true">AI</span>' +
    '    <div>' +
    '      <strong class="gemeente-ai-assistent-title">Gemeente AI Assistent</strong>' +
    '      <span class="gemeente-ai-assistent-tenant-context">Tenant: ' + escapeHtml(tenant || "demo") + "</span>" +
    "    </div>" +
    "  </div>" +
    '  <button type="button" class="gemeente-ai-assistent-close" aria-label="Sluit assistent">x</button>' +
    "</div>" +
    '<div class="gemeente-ai-assistent-body">' +
    '  <div class="gemeente-ai-assistent-scroll-area">' +
    '    <p class="gemeente-ai-assistent-disclaimer">Deze AI-assistent helpt u informatie te vinden, maar neemt geen besluiten. Controleer altijd de officiele gemeentelijke informatie.</p>' +
    '    <p class="gemeente-ai-assistent-privacy-notice">Deel geen BSN, medische gegevens of andere gevoelige persoonsgegevens. Lees de <a href="https://example.com/privacy" target="_blank" rel="noopener noreferrer">privacyinformatie</a>.</p>' +
    '    <div class="gemeente-ai-assistent-messages" aria-live="polite">' +
    '      <p class="gemeente-ai-assistent-message gemeente-ai-assistent-message-assistant gemeente-ai-assistent-intro">Hoi, ik ben Gemeente AI Assistent. Waarmee kan ik helpen?</p>' +
    "    </div>" +
    "  </div>" +
    '  <div class="gemeente-ai-assistent-composer">' +
    '    <button type="button" class="gemeente-ai-assistent-clear">Gesprek wissen</button>' +
    '    <label for="gemeente-ai-assistent-input">Uw vraag</label>' +
    '    <textarea id="gemeente-ai-assistent-input" rows="3" placeholder="Bijvoorbeeld: hoe vraag ik een paspoort aan?"></textarea>' +
    '    <button type="button" class="gemeente-ai-assistent-send">Verstuur</button>' +
    '    <p class="gemeente-ai-assistent-contact"><a href="https://example.com/contact" target="_blank" rel="noopener noreferrer">Neem contact op met de gemeente</a></p>' +
    '    <p class="gemeente-ai-assistent-note" role="status"></p>' +
    "  </div>" +
    "</div>";

  var style = document.createElement("style");
  // Design tokens are scoped to this widget so host website styles do not need
  // to know anything about the assistant internals.
  style.textContent =
    "#" + widgetId + " {" +
    "  --gaa-color-primary: #154273;" +
    "  --gaa-color-primary-contrast: #ffffff;" +
    "  --gaa-color-surface: #ffffff;" +
    "  --gaa-color-surface-muted: #f3f6f8;" +
    "  --gaa-color-surface-raised: #ffffff;" +
    "  --gaa-color-text: #1f2933;" +
    "  --gaa-color-text-muted: #4b5563;" +
    "  --gaa-color-border: #c8d1dc;" +
    "  --gaa-color-focus: #ffb612;" +
    "  --gaa-color-warning-surface: #fff7ed;" +
    "  --gaa-color-warning-border: #b45309;" +
    "  --gaa-color-info-surface: #eef6ff;" +
    "  --gaa-color-assistant-bubble: #f7f9fc;" +
    "  --gaa-color-user-bubble: var(--gaa-color-primary);" +
    "  --gaa-color-status-surface: #f8fafc;" +
    "  --gaa-space-1: 4px;" +
    "  --gaa-space-2: 8px;" +
    "  --gaa-space-3: 12px;" +
    "  --gaa-space-4: 16px;" +
    "  --gaa-space-5: 20px;" +
    "  --gaa-space-6: 24px;" +
    "  --gaa-font-size-meta: 13px;" +
    "  --gaa-font-size-support: 14px;" +
    "  --gaa-font-size-body: 16px;" +
    "  --gaa-line-height-tight: 1.25;" +
    "  --gaa-line-height-body: 1.5;" +
    "  --gaa-radius-sm: 4px;" +
    "  --gaa-radius-md: 6px;" +
    "  --gaa-radius-lg: 8px;" +
    "  --gaa-shadow-panel: 0 18px 44px rgba(15, 23, 42, 0.2);" +
    "  --gaa-shadow-button: 0 9px 22px rgba(15, 23, 42, 0.22);" +
    "  --gaa-transition-fast: 120ms ease;" +
    "  --gaa-panel-width: 408px;" +
    "  --gaa-launcher-min-height: 48px;" +
    "  --gaa-message-max-width: 92%;" +
    "  display: flex;" +
    "  flex-direction: column;" +
    "  gap: var(--gaa-space-3);" +
    "  position: fixed;" +
    "  bottom: var(--gaa-space-5);" +
    "  z-index: 2147483647;" +
    "  font-family: system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;" +
    "  font-size: var(--gaa-font-size-body);" +
    "  line-height: var(--gaa-line-height-body);" +
    "  color: var(--gaa-color-text);" +
    "}" +
    "#" + widgetId + ".gemeente-ai-assistent-position-bottom-right {" +
    "  align-items: flex-end;" +
    "  right: var(--gaa-space-5);" +
    "}" +
    "#" + widgetId + ".gemeente-ai-assistent-position-bottom-left {" +
    "  align-items: flex-start;" +
    "  left: var(--gaa-space-5);" +
    "}" +
    "#" + widgetId + " * {" +
    "  box-sizing: border-box;" +
    "}" +
    ".gemeente-ai-assistent-button {" +
    "  display: inline-flex;" +
    "  align-items: center;" +
    "  justify-content: center;" +
    "  gap: var(--gaa-space-2);" +
    "  min-height: var(--gaa-launcher-min-height);" +
    "  max-width: min(360px, calc(100vw - 32px));" +
    "  border: 1px solid rgba(255, 255, 255, 0.18);" +
    "  border-radius: 999px;" +
    "  padding: 7px var(--gaa-space-4) 7px 8px;" +
    "  background: var(--gaa-color-primary);" +
    "  color: var(--gaa-color-primary-contrast);" +
    "  font: inherit;" +
    "  font-weight: 700;" +
    "  line-height: var(--gaa-line-height-tight);" +
    "  cursor: pointer;" +
    "  box-shadow: var(--gaa-shadow-button);" +
    "  transition: transform var(--gaa-transition-fast), box-shadow var(--gaa-transition-fast), filter var(--gaa-transition-fast);" +
    "  text-align: left;" +
    "}" +
    ".gemeente-ai-assistent-button:hover {" +
    "  filter: brightness(0.96);" +
    "  transform: translateY(-1px);" +
    "  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.28);" +
    "}" +
    ".gemeente-ai-assistent-button-label {" +
    "  overflow-wrap: anywhere;" +
    "}" +
    ".gemeente-ai-assistent-button:focus-visible," +
    ".gemeente-ai-assistent-close:focus-visible," +
    ".gemeente-ai-assistent-send:focus-visible," +
    ".gemeente-ai-assistent-clear:focus-visible," +
    ".gemeente-ai-assistent-feedback button:focus-visible," +
    ".gemeente-ai-assistent-sources a:focus-visible," +
    ".gemeente-ai-assistent-contact a:focus-visible," +
    ".gemeente-ai-assistent-privacy-notice a:focus-visible," +
    ".gemeente-ai-assistent-body textarea:focus-visible {" +
    "  outline: 3px solid var(--gaa-color-focus);" +
    "  outline-offset: 3px;" +
    "}" +
    ".gemeente-ai-assistent-button-logo," +
    ".gemeente-ai-assistent-logo {" +
    "  display: inline-flex;" +
    "  align-items: center;" +
    "  justify-content: center;" +
    "  width: 36px;" +
    "  height: 36px;" +
    "  border-radius: 50%;" +
    "  font-weight: 800;" +
    "  letter-spacing: 0;" +
    "  line-height: 1;" +
    "}" +
    ".gemeente-ai-assistent-button-logo {" +
    "  background: rgba(255, 255, 255, 0.2);" +
    "  color: var(--gaa-color-primary-contrast);" +
    "}" +
    ".gemeente-ai-assistent-panel {" +
    "  display: flex;" +
    "  flex-direction: column;" +
    "  width: min(var(--gaa-panel-width), calc(100vw - 32px));" +
    "  height: min(680px, calc(100vh - 96px));" +
    "  max-height: calc(100vh - 96px);" +
    "  overflow: hidden;" +
    "  border: 1px solid var(--gaa-color-border);" +
    "  border-radius: var(--gaa-radius-lg);" +
    "  background: var(--gaa-color-surface);" +
    "  box-shadow: var(--gaa-shadow-panel);" +
    "}" +
    ".gemeente-ai-assistent-panel[hidden] {" +
    "  display: none;" +
    "}" +
    ".gemeente-ai-assistent-header {" +
    "  display: flex;" +
    "  align-items: center;" +
    "  justify-content: space-between;" +
    "  gap: var(--gaa-space-3);" +
    "  padding: var(--gaa-space-4) var(--gaa-space-4) var(--gaa-space-4) var(--gaa-space-5);" +
    "  background: var(--gaa-color-primary);" +
    "  color: var(--gaa-color-primary-contrast);" +
    "  flex: 0 0 auto;" +
    "}" +
    ".gemeente-ai-assistent-brand {" +
    "  display: flex;" +
    "  align-items: center;" +
    "  gap: var(--gaa-space-3);" +
    "  min-width: 0;" +
    "}" +
    ".gemeente-ai-assistent-logo {" +
    "  flex: 0 0 auto;" +
    "  background: var(--gaa-color-primary-contrast);" +
    "  color: var(--gaa-color-primary);" +
    "  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);" +
    "}" +
    ".gemeente-ai-assistent-title {" +
    "  display: block;" +
    "  max-width: 250px;" +
    "  overflow-wrap: anywhere;" +
    "  line-height: var(--gaa-line-height-tight);" +
    "  font-size: 17px;" +
    "}" +
    ".gemeente-ai-assistent-tenant-context {" +
    "  display: block;" +
    "  margin-top: 2px;" +
    "  font-size: var(--gaa-font-size-meta);" +
    "  opacity: 0.88;" +
    "}" +
    ".gemeente-ai-assistent-close {" +
    "  width: 40px;" +
    "  height: 40px;" +
    "  border: 1px solid rgba(255, 255, 255, 0.5);" +
    "  border-radius: 50%;" +
    "  background: rgba(255, 255, 255, 0.08);" +
    "  color: var(--gaa-color-primary-contrast);" +
    "  font-size: 18px;" +
    "  font-weight: 700;" +
    "  line-height: 1;" +
    "  cursor: pointer;" +
    "  flex: 0 0 auto;" +
    "  transition: background var(--gaa-transition-fast), border-color var(--gaa-transition-fast);" +
    "}" +
    ".gemeente-ai-assistent-close:hover {" +
    "  background: rgba(255, 255, 255, 0.16);" +
    "  border-color: rgba(255, 255, 255, 0.72);" +
    "}" +
    ".gemeente-ai-assistent-body {" +
    "  display: flex;" +
    "  flex-direction: column;" +
    "  flex: 1 1 auto;" +
    "  min-height: 0;" +
    "  overflow: hidden;" +
    "  padding: 0;" +
    "}" +
    ".gemeente-ai-assistent-scroll-area {" +
    "  flex: 1 1 auto;" +
    "  min-height: 0;" +
    "  overflow-y: auto;" +
    "  padding: var(--gaa-space-4) var(--gaa-space-4) var(--gaa-space-3);" +
    "}" +
    ".gemeente-ai-assistent-composer {" +
    "  flex: 0 0 auto;" +
    "  padding: var(--gaa-space-4) var(--gaa-space-4) var(--gaa-space-5);" +
    "  border-top: 1px solid var(--gaa-color-border);" +
    "  background: var(--gaa-color-surface);" +
    "}" +
    ".gemeente-ai-assistent-disclaimer {" +
    "  margin: 0 0 var(--gaa-space-3);" +
    "  padding: var(--gaa-space-2) var(--gaa-space-3);" +
    "  border: 1px solid #d7e4f2;" +
    "  border-left: 3px solid var(--gaa-color-primary);" +
    "  border-radius: var(--gaa-radius-md);" +
    "  background: var(--gaa-color-info-surface);" +
    "  color: #1f3a5f;" +
    "  font-size: var(--gaa-font-size-support);" +
    "  line-height: var(--gaa-line-height-body);" +
    "}" +
    ".gemeente-ai-assistent-privacy-notice {" +
    "  margin: 0 0 var(--gaa-space-3);" +
    "  padding: var(--gaa-space-2) var(--gaa-space-3);" +
    "  border: 1px solid #fed7aa;" +
    "  border-left: 3px solid var(--gaa-color-warning-border);" +
    "  border-radius: var(--gaa-radius-md);" +
    "  background: var(--gaa-color-warning-surface);" +
    "  color: #7c2d12;" +
    "  font-size: var(--gaa-font-size-support);" +
    "  line-height: var(--gaa-line-height-body);" +
    "}" +
    ".gemeente-ai-assistent-privacy-notice a," +
    ".gemeente-ai-assistent-contact a {" +
    "  color: var(--gaa-color-primary);" +
    "  font-weight: 700;" +
    "  text-underline-offset: 3px;" +
    "}" +
    ".gemeente-ai-assistent-messages {" +
    "  display: flex;" +
    "  flex-direction: column;" +
    "  gap: var(--gaa-space-3);" +
    "  margin: 0;" +
    "  overflow: visible;" +
    "}" +
    ".gemeente-ai-assistent-message {" +
    "  width: fit-content;" +
    "  max-width: var(--gaa-message-max-width);" +
    "  margin: 0;" +
    "  padding: var(--gaa-space-3) var(--gaa-space-4);" +
    "  border-radius: var(--gaa-radius-lg);" +
    "  line-height: var(--gaa-line-height-body);" +
    "  font-size: var(--gaa-font-size-body);" +
    "  overflow-wrap: anywhere;" +
    "}" +
    ".gemeente-ai-assistent-message-user {" +
    "  align-self: flex-end;" +
    "  background: var(--gaa-color-user-bubble);" +
    "  color: var(--gaa-color-primary-contrast);" +
    "  border-bottom-right-radius: var(--gaa-radius-sm);" +
    "}" +
    ".gemeente-ai-assistent-message-assistant {" +
    "  align-self: flex-start;" +
    "  background: var(--gaa-color-assistant-bubble);" +
    "  border: 1px solid var(--gaa-color-border);" +
    "  border-bottom-left-radius: var(--gaa-radius-sm);" +
    "}" +
    ".gemeente-ai-assistent-sources {" +
    "  margin-top: var(--gaa-space-3);" +
    "  padding: var(--gaa-space-2) var(--gaa-space-3);" +
    "  border: 1px solid var(--gaa-color-border);" +
    "  border-radius: var(--gaa-radius-md);" +
    "  background: var(--gaa-color-surface-raised);" +
    "}" +
    ".gemeente-ai-assistent-sources-label {" +
    "  display: block;" +
    "  margin-bottom: var(--gaa-space-1);" +
    "  color: var(--gaa-color-text-muted);" +
    "  font-size: var(--gaa-font-size-meta);" +
    "  font-weight: 700;" +
    "}" +
    ".gemeente-ai-assistent-sources-list {" +
    "  margin: 0;" +
    "  padding-left: var(--gaa-space-4);" +
    "}" +
    ".gemeente-ai-assistent-sources li + li {" +
    "  margin-top: var(--gaa-space-1);" +
    "}" +
    ".gemeente-ai-assistent-sources a {" +
    "  display: inline-block;" +
    "  padding: 3px 0;" +
    "  color: var(--gaa-color-primary);" +
    "  font-weight: 700;" +
    "  text-decoration: underline;" +
    "  text-underline-offset: 3px;" +
    "}" +
    ".gemeente-ai-assistent-status-label {" +
    "  display: inline-flex;" +
    "  align-items: center;" +
    "  width: fit-content;" +
    "  margin-top: var(--gaa-space-2);" +
    "  padding: 3px var(--gaa-space-2);" +
    "  border-radius: 999px;" +
    "  background: var(--gaa-color-status-surface);" +
    "  color: var(--gaa-color-text-muted);" +
    "  font-size: var(--gaa-font-size-meta);" +
    "  border: 1px solid var(--gaa-color-border);" +
    "  line-height: var(--gaa-line-height-tight);" +
    "}" +
    ".gemeente-ai-assistent-support-code {" +
    "  display: block;" +
    "  margin-top: var(--gaa-space-2);" +
    "  color: var(--gaa-color-text-muted);" +
    "  font-size: var(--gaa-font-size-meta);" +
    "}" +
    ".gemeente-ai-assistent-feedback {" +
    "  display: flex;" +
    "  flex-wrap: wrap;" +
    "  align-items: center;" +
    "  gap: var(--gaa-space-2);" +
    "  margin-top: var(--gaa-space-3);" +
    "}" +
    ".gemeente-ai-assistent-feedback button," +
    ".gemeente-ai-assistent-clear {" +
    "  min-height: 38px;" +
    "  border: 1px solid var(--gaa-color-border);" +
    "  border-radius: var(--gaa-radius-md);" +
    "  background: var(--gaa-color-surface);" +
    "  color: var(--gaa-color-text);" +
    "  font: inherit;" +
    "  font-size: var(--gaa-font-size-support);" +
    "  cursor: pointer;" +
    "  transition: background var(--gaa-transition-fast), border-color var(--gaa-transition-fast), color var(--gaa-transition-fast);" +
    "}" +
    ".gemeente-ai-assistent-feedback button:hover," +
    ".gemeente-ai-assistent-clear:hover {" +
    "  background: var(--gaa-color-surface-muted);" +
    "  border-color: #9aa8b6;" +
    "}" +
    ".gemeente-ai-assistent-feedback button {" +
    "  padding: var(--gaa-space-2) var(--gaa-space-3);" +
    "}" +
    ".gemeente-ai-assistent-feedback button:disabled {" +
    "  cursor: default;" +
    "  opacity: 0.76;" +
    "  background: var(--gaa-color-surface-muted);" +
    "}" +
    ".gemeente-ai-assistent-feedback-message {" +
    "  color: var(--gaa-color-text-muted);" +
    "  font-size: var(--gaa-font-size-meta);" +
    "}" +
    ".gemeente-ai-assistent-clear {" +
    "  align-self: flex-start;" +
    "  margin: 0 0 var(--gaa-space-3);" +
    "  padding: var(--gaa-space-2) var(--gaa-space-3);" +
    "}" +
    ".gemeente-ai-assistent-body p {" +
    "  margin: 0 0 12px;" +
    "}" +
    ".gemeente-ai-assistent-body label {" +
    "  display: block;" +
    "  margin-bottom: var(--gaa-space-2);" +
    "  font-weight: 700;" +
    "  font-size: var(--gaa-font-size-support);" +
    "}" +
    ".gemeente-ai-assistent-body textarea {" +
    "  width: 100%;" +
    "  resize: vertical;" +
    "  min-height: 96px;" +
    "  padding: var(--gaa-space-3);" +
    "  border: 1px solid var(--gaa-color-border);" +
    "  border-radius: var(--gaa-radius-md);" +
    "  font: inherit;" +
    "  line-height: var(--gaa-line-height-body);" +
    "  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.05);" +
    "  transition: border-color var(--gaa-transition-fast), box-shadow var(--gaa-transition-fast);" +
    "}" +
    ".gemeente-ai-assistent-body textarea:hover {" +
    "  border-color: #9aa8b6;" +
    "}" +
    ".gemeente-ai-assistent-send {" +
    "  width: 100%;" +
    "  min-height: 44px;" +
    "  margin-top: var(--gaa-space-3);" +
    "  margin-bottom: var(--gaa-space-1);" +
    "  border: 1px solid transparent;" +
    "  border-radius: var(--gaa-radius-md);" +
    "  padding: var(--gaa-space-3) var(--gaa-space-4);" +
    "  background: var(--gaa-color-primary);" +
    "  color: var(--gaa-color-primary-contrast);" +
    "  font: inherit;" +
    "  font-weight: 700;" +
    "  cursor: pointer;" +
    "  transition: filter var(--gaa-transition-fast), transform var(--gaa-transition-fast);" +
    "}" +
    ".gemeente-ai-assistent-send:hover {" +
    "  filter: brightness(0.95);" +
    "}" +
    ".gemeente-ai-assistent-send:disabled {" +
    "  cursor: progress;" +
    "  opacity: 0.78;" +
    "}" +
    ".gemeente-ai-assistent-note {" +
    "  min-height: 1.4em;" +
    "  margin-top: var(--gaa-space-2);" +
    "  margin-bottom: var(--gaa-space-2);" +
    "  color: var(--gaa-color-text-muted);" +
    "  font-size: var(--gaa-font-size-support);" +
    "}" +
    ".gemeente-ai-assistent-contact {" +
    "  margin: var(--gaa-space-4) 0 var(--gaa-space-2);" +
    "  font-size: var(--gaa-font-size-support);" +
    "}" +
    "@media (max-width: 480px) {" +
    "  #" + widgetId + " {" +
    "    right: var(--gaa-space-3);" +
    "    bottom: var(--gaa-space-3);" +
    "    left: var(--gaa-space-3);" +
    "  }" +
    "  .gemeente-ai-assistent-panel {" +
    "    width: 100%;" +
    "    height: min(640px, calc(100vh - 80px));" +
    "    max-height: calc(100vh - 80px);" +
    "  }" +
    "  .gemeente-ai-assistent-header {" +
    "    padding: var(--gaa-space-3) var(--gaa-space-3) var(--gaa-space-3) var(--gaa-space-4);" +
    "  }" +
    "  .gemeente-ai-assistent-body {" +
    "    padding: 0;" +
    "  }" +
    "  .gemeente-ai-assistent-scroll-area {" +
    "    padding: var(--gaa-space-3);" +
    "  }" +
    "  .gemeente-ai-assistent-composer {" +
    "    padding: var(--gaa-space-3) var(--gaa-space-3) var(--gaa-space-4);" +
    "  }" +
    "  .gemeente-ai-assistent-button {" +
    "    max-width: 100%;" +
    "    min-height: 46px;" +
    "  }" +
    "  .gemeente-ai-assistent-button-label {" +
    "    overflow: hidden;" +
    "    text-overflow: ellipsis;" +
    "    white-space: nowrap;" +
    "  }" +
    "}" +
    "@media (max-height: 640px) {" +
    "  .gemeente-ai-assistent-body textarea {" +
    "    min-height: 72px;" +
    "  }" +
    "}";

  container.appendChild(style);
  container.appendChild(panel);
  container.appendChild(button);
  document.body.appendChild(container);

  var closeButton = panel.querySelector(".gemeente-ai-assistent-close");
  var sendButton = panel.querySelector(".gemeente-ai-assistent-send");
  var clearButton = panel.querySelector(".gemeente-ai-assistent-clear");
  var input = panel.querySelector("#gemeente-ai-assistent-input");
  var scrollArea = panel.querySelector(".gemeente-ai-assistent-scroll-area");
  var messages = panel.querySelector(".gemeente-ai-assistent-messages");
  var note = panel.querySelector(".gemeente-ai-assistent-note");
  var title = panel.querySelector(".gemeente-ai-assistent-title");
  var headerLogo = panel.querySelector(".gemeente-ai-assistent-logo");
  var buttonLogo = button.querySelector(".gemeente-ai-assistent-button-logo");
  var buttonLabel = button.querySelector(".gemeente-ai-assistent-button-label");
  var intro = panel.querySelector(".gemeente-ai-assistent-intro");
  var privacyLink = panel.querySelector(".gemeente-ai-assistent-privacy-notice a");
  var contactLink = panel.querySelector(".gemeente-ai-assistent-contact a");

  applyTenantConfig(tenantConfig);
  loadTenantConfig();

  button.addEventListener("click", function (event) {
    event.preventDefault();
    setPanelOpen(panel.hidden);
  });

  closeButton.addEventListener("click", function (event) {
    event.preventDefault();
    setPanelOpen(false, true);
  });

  sendButton.addEventListener("click", function (event) {
    event.preventDefault();
    sendMessage();
  });
  clearButton.addEventListener("click", function (event) {
    event.preventDefault();
    resetConversation();
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) {
      event.preventDefault();
      setPanelOpen(false, true);
    }
  });

  function setPanelOpen(isOpen, focusLauncher) {
    panel.hidden = !isOpen;
    button.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      window.setTimeout(function () {
        input.focus();
      }, 0);
      return;
    }

    if (focusLauncher) {
      button.focus();
    }
  }

  async function sendMessage() {
    var message = input.value.trim();

    if (!message) {
      note.textContent = "Typ eerst een vraag.";
      return;
    }

    addMessage("user", message);
    input.value = "";
    note.textContent = "De assistent denkt na...";
    sendButton.disabled = true;

    try {
      // The backend returns a mock response for now; no real AI provider is called.
      var response = await fetch(
        apiBase + "/api/chat?tenant=" + encodeURIComponent(tenant || "demo"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );
      var data = await readJsonResponse(response);

      if (!response.ok) {
        addMessage(
          "assistant",
          getFriendlyErrorMessage(response, data),
          [],
          "",
          data.requestId
        );
        note.textContent = "";
        return;
      }

      addMessage(
        "assistant",
        data.message,
        data.sources || [],
        data.mode,
        data.requestId
      );
      note.textContent = "";
    } catch (error) {
      addMessage(
        "assistant",
        "Sorry, de demo-server is niet bereikbaar. Start de server en probeer het opnieuw."
      );
      note.textContent = "";
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  }

  async function readJsonResponse(response) {
    try {
      return await response.json();
    } catch (error) {
      // Some server/proxy failures may return plain text or HTML. Keep that technical
      // response out of the chat and show a friendly Dutch fallback instead.
      return {
        error: "Sorry, de assistent kon uw bericht niet verwerken. Probeer het opnieuw.",
      };
    }
  }

  function getFriendlyErrorMessage(response, data) {
    if (response.status === 405) {
      return "Sorry, de assistent kon uw bericht niet verwerken. Probeer het opnieuw.";
    }

    return (
      data.error ||
      "Sorry, de assistent kon uw bericht niet verwerken. Probeer het opnieuw."
    );
  }

  function addMessage(sender, text, sources, mode, requestId) {
    var messageElement = document.createElement("div");
    messageElement.className =
      "gemeente-ai-assistent-message gemeente-ai-assistent-message-" + sender;
    messageElement.textContent = text;

    if (sender === "assistant" && mode) {
      messageElement.appendChild(createStatusLabel(mode));
    }

    if (sender === "assistant" && shouldShowSupportCode(mode, requestId)) {
      messageElement.appendChild(createSupportCode(requestId));
    }

    if (sources && sources.length) {
      messageElement.appendChild(createSourcesList(sources));
    }

    if (sender === "assistant") {
      messageElement.appendChild(createFeedbackControls());
    }

    messages.appendChild(messageElement);
    scrollArea.scrollTop = scrollArea.scrollHeight;
  }

  function shouldShowSupportCode(mode, requestId) {
    return Boolean(
      requestId &&
        (!mode ||
          mode === "openai-error" ||
          mode === "no-approved-source" ||
          mode === "off-topic")
    );
  }

  function createSupportCode(requestId) {
    var supportCode = document.createElement("span");
    supportCode.className = "gemeente-ai-assistent-support-code";
    supportCode.textContent = "Ondersteuningscode: " + requestId;
    return supportCode;
  }

  function createStatusLabel(mode) {
    var label = document.createElement("span");
    label.className = "gemeente-ai-assistent-status-label";
    label.textContent = getFriendlyModeLabel(mode);
    return label;
  }

  function getFriendlyModeLabel(mode) {
    var labels = {
      mock: "Demo-antwoord",
      openai: "Antwoord op basis van goedgekeurde bronnen",
      greeting: "Begroeting",
      "off-topic": "Buiten onderwerp",
      "no-approved-source": "Geen goedgekeurde bron gevonden",
      "openai-error": "Tijdelijke storing",
    };

    return labels[mode] || "Antwoord";
  }

  function createSourcesList(sources) {
    var wrapper = document.createElement("div");
    var label = document.createElement("span");
    var list = document.createElement("ul");

    wrapper.className = "gemeente-ai-assistent-sources";
    label.className = "gemeente-ai-assistent-sources-label";
    label.textContent = "Gebruikte bron(nen):";
    list.className = "gemeente-ai-assistent-sources-list";

    sources.forEach(function (source) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = source.title;
      item.appendChild(link);
      list.appendChild(item);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(list);
    return wrapper;
  }

  function createFeedbackControls() {
    var wrapper = document.createElement("div");
    var usefulButton = document.createElement("button");
    var notUsefulButton = document.createElement("button");
    var message = document.createElement("span");

    wrapper.className = "gemeente-ai-assistent-feedback";
    usefulButton.type = "button";
    usefulButton.textContent = "Nuttig";
    usefulButton.setAttribute("aria-label", "Markeer dit antwoord als nuttig");
    notUsefulButton.type = "button";
    notUsefulButton.textContent = "Niet nuttig";
    notUsefulButton.setAttribute(
      "aria-label",
      "Markeer dit antwoord als niet nuttig"
    );
    message.className = "gemeente-ai-assistent-feedback-message";
    message.setAttribute("role", "status");

    function handleFeedback() {
      // Future feedback storage needs a privacy review before anything is sent or saved.
      message.textContent = "Bedankt voor uw feedback.";
      usefulButton.disabled = true;
      notUsefulButton.disabled = true;
    }

    usefulButton.addEventListener("click", handleFeedback);
    notUsefulButton.addEventListener("click", handleFeedback);

    wrapper.appendChild(usefulButton);
    wrapper.appendChild(notUsefulButton);
    wrapper.appendChild(message);
    return wrapper;
  }

  function resetConversation() {
    messages.innerHTML = "";
    addIntroMessage();
    scrollArea.scrollTop = 0;
    note.textContent = "";
    input.focus();
  }

  function addIntroMessage() {
    var introElement = document.createElement("p");
    introElement.className =
      "gemeente-ai-assistent-message gemeente-ai-assistent-message-assistant gemeente-ai-assistent-intro";
    introElement.textContent = getIntroText(tenantConfig);
    messages.appendChild(introElement);
    intro = introElement;
  }

  async function loadTenantConfig() {
    try {
      var response = await fetch(
        apiBase + "/api/config?tenant=" + encodeURIComponent(tenant || "demo")
      );

      if (!response.ok) {
        return;
      }

      var config = await response.json();
      tenantConfig = Object.assign({}, tenantConfig, config);
      applyTenantConfig(tenantConfig);
    } catch (error) {
      // Keep the widget usable with safe defaults if public tenant config cannot be loaded.
      note.textContent = "";
    }
  }

  function applyTenantConfig(config) {
    var theme = getAccessibleTheme(config.themeColor);
    var logoText = getSafeLogoText(config.logoText);

    container.style.setProperty("--gaa-color-primary", theme.color);
    container.style.setProperty("--gaa-color-primary-contrast", theme.contrast);
    container.className = getPositionClass(config.position);

    var assistantName = config.assistantName || "Gemeente AI Assistent";

    title.textContent = assistantName;
    panel.setAttribute("aria-label", assistantName);
    buttonLabel.textContent = config.buttonLabel || "Vraag de gemeente";
    headerLogo.textContent = logoText;
    buttonLogo.textContent = logoText;
    intro.textContent = getIntroText(config);

    privacyLink.href = config.privacyUrl || "https://example.com/privacy";
    contactLink.href = config.contactUrl || "https://example.com/contact";
  }

  function getIntroText(config) {
    return (
      config.welcomeMessage ||
      "Hoi, ik ben Gemeente AI Assistent. Waarmee kan ik helpen?"
    );
  }

  function getSafeThemeColor(color) {
    return /^#[0-9a-fA-F]{6}$/.test(color || "") ? color : "#0f766e";
  }

  function getAccessibleTheme(color) {
    var safeColor = getSafeThemeColor(color);
    var whiteContrast = getContrastRatio(safeColor, "#ffffff");
    var blackContrast = getContrastRatio(safeColor, "#111827");

    if (whiteContrast >= 4.5) {
      return {
        color: safeColor,
        contrast: "#ffffff",
      };
    }

    if (blackContrast >= 4.5) {
      return {
        color: safeColor,
        contrast: "#111827",
      };
    }

    return {
      color: "#154273",
      contrast: "#ffffff",
    };
  }

  function getContrastRatio(firstColor, secondColor) {
    var first = getRelativeLuminance(firstColor);
    var second = getRelativeLuminance(secondColor);
    var lighter = Math.max(first, second);
    var darker = Math.min(first, second);

    return (lighter + 0.05) / (darker + 0.05);
  }

  function getRelativeLuminance(color) {
    var rgb = hexToRgb(color).map(function (channel) {
      var value = channel / 255;
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  function hexToRgb(color) {
    var normalized = getSafeThemeColor(color).replace("#", "");
    return [
      parseInt(normalized.slice(0, 2), 16),
      parseInt(normalized.slice(2, 4), 16),
      parseInt(normalized.slice(4, 6), 16),
    ];
  }

  function getPositionClass(position) {
    return position === "bottom-left"
      ? "gemeente-ai-assistent-position-bottom-left"
      : "gemeente-ai-assistent-position-bottom-right";
  }

  function getSafeLogoText(text) {
    var safeText = String(text || "AI").trim().slice(0, 4);
    return safeText || "AI";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
