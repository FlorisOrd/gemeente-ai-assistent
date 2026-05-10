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
    '      <span>Tenant: ' + escapeHtml(tenant || "demo") + "</span>" +
    "    </div>" +
    "  </div>" +
    '  <button type="button" class="gemeente-ai-assistent-close" aria-label="Sluit assistent">x</button>' +
    "</div>" +
    '<div class="gemeente-ai-assistent-body">' +
    '  <p class="gemeente-ai-assistent-disclaimer">Deze AI-assistent helpt u informatie te vinden, maar neemt geen besluiten. Controleer altijd de officiele gemeentelijke informatie.</p>' +
    '  <p class="gemeente-ai-assistent-privacy-notice">Deel geen BSN, medische gegevens of andere gevoelige persoonsgegevens. Lees de <a href="https://example.com/privacy" target="_blank" rel="noopener noreferrer">privacyinformatie</a>.</p>' +
    '  <div class="gemeente-ai-assistent-messages" aria-live="polite">' +
    '    <p class="gemeente-ai-assistent-message gemeente-ai-assistent-message-assistant gemeente-ai-assistent-intro">Hoi, ik ben Gemeente AI Assistent. Waarmee kan ik helpen?</p>' +
    "  </div>" +
    '  <button type="button" class="gemeente-ai-assistent-clear">Gesprek wissen</button>' +
    '  <label for="gemeente-ai-assistent-input">Uw vraag</label>' +
    '  <textarea id="gemeente-ai-assistent-input" rows="3" placeholder="Bijvoorbeeld: hoe vraag ik een paspoort aan?"></textarea>' +
    '  <button type="button" class="gemeente-ai-assistent-send">Verstuur</button>' +
    '  <p class="gemeente-ai-assistent-contact"><a href="https://example.com/contact" target="_blank" rel="noopener noreferrer">Neem contact op met de gemeente</a></p>' +
    '  <p class="gemeente-ai-assistent-note" role="status"></p>' +
    "</div>";

  var style = document.createElement("style");
  style.textContent =
    "#" + widgetId + " {" +
    "  position: fixed;" +
    "  bottom: 20px;" +
    "  z-index: 2147483647;" +
    "  font-family: Arial, sans-serif;" +
    "  color: #1f2933;" +
    "}" +
    "#" + widgetId + ".gemeente-ai-assistent-position-bottom-right {" +
    "  right: 20px;" +
    "}" +
    "#" + widgetId + ".gemeente-ai-assistent-position-bottom-left {" +
    "  left: 20px;" +
    "}" +
    "#" + widgetId + " * {" +
    "  box-sizing: border-box;" +
    "}" +
    ".gemeente-ai-assistent-button {" +
    "  display: inline-flex;" +
    "  align-items: center;" +
    "  gap: 10px;" +
    "  border: 0;" +
    "  border-radius: 999px;" +
    "  padding: 10px 16px 10px 10px;" +
    "  background: #0f766e;" +
    "  color: #ffffff;" +
    "  font: inherit;" +
    "  font-weight: 700;" +
    "  cursor: pointer;" +
    "  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.24);" +
    "  transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;" +
    "}" +
    ".gemeente-ai-assistent-button:hover {" +
    "  filter: brightness(0.96);" +
    "  transform: translateY(-1px);" +
    "  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.28);" +
    "}" +
    ".gemeente-ai-assistent-button:focus-visible," +
    ".gemeente-ai-assistent-close:focus-visible," +
    ".gemeente-ai-assistent-send:focus-visible," +
    ".gemeente-ai-assistent-clear:focus-visible," +
    ".gemeente-ai-assistent-feedback button:focus-visible," +
    ".gemeente-ai-assistent-body textarea:focus-visible {" +
    "  outline: 3px solid #fbbf24;" +
    "  outline-offset: 3px;" +
    "}" +
    ".gemeente-ai-assistent-button-logo," +
    ".gemeente-ai-assistent-logo {" +
    "  display: inline-flex;" +
    "  align-items: center;" +
    "  justify-content: center;" +
    "  width: 34px;" +
    "  height: 34px;" +
    "  border-radius: 50%;" +
    "  font-weight: 800;" +
    "  letter-spacing: 0;" +
    "}" +
    ".gemeente-ai-assistent-button-logo {" +
    "  background: rgba(255, 255, 255, 0.2);" +
    "  color: #ffffff;" +
    "}" +
    ".gemeente-ai-assistent-panel {" +
    "  width: min(380px, calc(100vw - 32px));" +
    "  margin-bottom: 12px;" +
    "  overflow: hidden;" +
    "  border: 1px solid #d6dce5;" +
    "  border-radius: 8px;" +
    "  background: #ffffff;" +
    "  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.24);" +
    "}" +
    ".gemeente-ai-assistent-header {" +
    "  display: flex;" +
    "  align-items: center;" +
    "  justify-content: space-between;" +
    "  gap: 12px;" +
    "  padding: 16px;" +
    "  background: #0f766e;" +
    "  color: #ffffff;" +
    "}" +
    ".gemeente-ai-assistent-brand {" +
    "  display: flex;" +
    "  align-items: center;" +
    "  gap: 10px;" +
    "  min-width: 0;" +
    "}" +
    ".gemeente-ai-assistent-logo {" +
    "  flex: 0 0 auto;" +
    "  background: #ffffff;" +
    "  color: var(--gemeente-ai-assistent-theme, #0f766e);" +
    "}" +
    ".gemeente-ai-assistent-title {" +
    "  display: block;" +
    "  line-height: 1.2;" +
    "}" +
    ".gemeente-ai-assistent-header span {" +
    "  display: block;" +
    "  margin-top: 2px;" +
    "  font-size: 0.82rem;" +
    "  opacity: 0.88;" +
    "}" +
    ".gemeente-ai-assistent-close {" +
    "  width: 28px;" +
    "  height: 28px;" +
    "  border: 1px solid rgba(255, 255, 255, 0.45);" +
    "  border-radius: 50%;" +
    "  background: transparent;" +
    "  color: #ffffff;" +
    "  cursor: pointer;" +
    "  flex: 0 0 auto;" +
    "}" +
    ".gemeente-ai-assistent-body {" +
    "  padding: 16px;" +
    "}" +
    ".gemeente-ai-assistent-disclaimer {" +
    "  margin: 0 0 12px;" +
    "  padding: 10px 12px;" +
    "  border-left: 4px solid var(--gemeente-ai-assistent-theme, #0f766e);" +
    "  background: #eef6ff;" +
    "  color: #1f3a5f;" +
    "  font-size: 0.92rem;" +
    "}" +
    ".gemeente-ai-assistent-privacy-notice {" +
    "  margin: 0 0 12px;" +
    "  padding: 10px 12px;" +
    "  border-left: 4px solid #f59e0b;" +
    "  background: #fff7ed;" +
    "  color: #7c2d12;" +
    "  font-size: 0.92rem;" +
    "}" +
    ".gemeente-ai-assistent-privacy-notice a," +
    ".gemeente-ai-assistent-contact a {" +
    "  color: var(--gemeente-ai-assistent-theme, #0f766e);" +
    "}" +
    ".gemeente-ai-assistent-messages {" +
    "  display: flex;" +
    "  flex-direction: column;" +
    "  gap: 10px;" +
    "  max-height: 280px;" +
    "  overflow-y: auto;" +
    "  margin-bottom: 14px;" +
    "}" +
    ".gemeente-ai-assistent-message {" +
    "  width: fit-content;" +
    "  max-width: 100%;" +
    "  margin: 0;" +
    "  padding: 11px 13px;" +
    "  border-radius: 8px;" +
    "  line-height: 1.4;" +
    "}" +
    ".gemeente-ai-assistent-message-user {" +
    "  align-self: flex-end;" +
    "  background: #e6fffb;" +
    "}" +
    ".gemeente-ai-assistent-message-assistant {" +
    "  align-self: flex-start;" +
    "  background: #eef2f7;" +
    "}" +
    ".gemeente-ai-assistent-sources {" +
    "  margin-top: 10px;" +
    "  padding-top: 8px;" +
    "  border-top: 1px solid #d6dce5;" +
    "}" +
    ".gemeente-ai-assistent-sources-label {" +
    "  display: block;" +
    "  margin-bottom: 4px;" +
    "  color: #52616f;" +
    "  font-size: 0.84rem;" +
    "  font-weight: 700;" +
    "}" +
    ".gemeente-ai-assistent-sources-list {" +
    "  margin: 0;" +
    "  padding-left: 18px;" +
    "}" +
    ".gemeente-ai-assistent-sources a {" +
    "  color: var(--gemeente-ai-assistent-theme, #0f766e);" +
    "  font-weight: 700;" +
    "  text-decoration: underline;" +
    "}" +
    ".gemeente-ai-assistent-status-label {" +
    "  display: block;" +
    "  width: fit-content;" +
    "  margin-top: 8px;" +
    "  padding: 3px 7px;" +
    "  border-radius: 999px;" +
    "  background: #ffffff;" +
    "  color: #52616f;" +
    "  font-size: 0.78rem;" +
    "  border: 1px solid #d6dce5;" +
    "}" +
    ".gemeente-ai-assistent-support-code {" +
    "  display: block;" +
    "  margin-top: 8px;" +
    "  color: #52616f;" +
    "  font-size: 0.78rem;" +
    "}" +
    ".gemeente-ai-assistent-feedback {" +
    "  display: flex;" +
    "  flex-wrap: wrap;" +
    "  align-items: center;" +
    "  gap: 6px;" +
    "  margin-top: 8px;" +
    "}" +
    ".gemeente-ai-assistent-feedback button," +
    ".gemeente-ai-assistent-clear {" +
    "  border: 1px solid #bcc7d3;" +
    "  border-radius: 6px;" +
    "  background: #ffffff;" +
    "  color: #1f2933;" +
    "  font: inherit;" +
    "  font-size: 0.86rem;" +
    "  cursor: pointer;" +
    "}" +
    ".gemeente-ai-assistent-feedback button {" +
    "  padding: 5px 8px;" +
    "}" +
    ".gemeente-ai-assistent-feedback-message {" +
    "  color: #52616f;" +
    "  font-size: 0.84rem;" +
    "}" +
    ".gemeente-ai-assistent-clear {" +
    "  margin: 0 0 12px;" +
    "  padding: 7px 9px;" +
    "}" +
    ".gemeente-ai-assistent-body p {" +
    "  margin: 0 0 12px;" +
    "}" +
    ".gemeente-ai-assistent-body label {" +
    "  display: block;" +
    "  margin-bottom: 6px;" +
    "  font-weight: 700;" +
    "}" +
    ".gemeente-ai-assistent-body textarea {" +
    "  width: 100%;" +
    "  resize: vertical;" +
    "  padding: 10px;" +
    "  border: 1px solid #bcc7d3;" +
    "  border-radius: 6px;" +
    "  font: inherit;" +
    "}" +
    ".gemeente-ai-assistent-send {" +
    "  margin-top: 10px;" +
    "  border: 0;" +
    "  border-radius: 6px;" +
    "  padding: 10px 12px;" +
    "  background: #1f2933;" +
    "  color: #ffffff;" +
    "  font: inherit;" +
    "  cursor: pointer;" +
    "  transition: filter 120ms ease;" +
    "}" +
    ".gemeente-ai-assistent-send:hover {" +
    "  filter: brightness(0.95);" +
    "}" +
    ".gemeente-ai-assistent-note {" +
    "  min-height: 1.4em;" +
    "  margin-top: 12px;" +
    "  color: #52616f;" +
    "  font-size: 0.92rem;" +
    "}" +
    ".gemeente-ai-assistent-contact {" +
    "  margin: 12px 0 0;" +
    "  font-size: 0.92rem;" +
    "}" +
    "@media (max-width: 480px) {" +
    "  #" + widgetId + " {" +
    "    right: 12px;" +
    "    bottom: 12px;" +
    "    left: 12px;" +
    "  }" +
    "  .gemeente-ai-assistent-panel {" +
    "    width: 100%;" +
    "  }" +
    "  .gemeente-ai-assistent-button {" +
    "    max-width: 100%;" +
    "  }" +
    "  .gemeente-ai-assistent-button-label {" +
    "    overflow: hidden;" +
    "    text-overflow: ellipsis;" +
    "    white-space: nowrap;" +
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

  button.addEventListener("click", function () {
    var isOpen = !panel.hidden;
    panel.hidden = isOpen;
    button.setAttribute("aria-expanded", String(!isOpen));
  });

  closeButton.addEventListener("click", function () {
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
    button.focus();
  });

  sendButton.addEventListener("click", sendMessage);
  clearButton.addEventListener("click", resetConversation);

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

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
      var data = await response.json();

      if (!response.ok) {
        addMessage(
          "assistant",
          data.error || "De demo-server kon uw bericht niet verwerken.",
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
      note.textContent = error.message;
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
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
    messages.scrollTop = messages.scrollHeight;
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
    var themeColor = getSafeThemeColor(config.themeColor);
    var logoText = getSafeLogoText(config.logoText);

    container.style.setProperty(
      "--gemeente-ai-assistent-theme",
      themeColor
    );
    container.className = getPositionClass(config.position);
    button.style.background = themeColor;

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
