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

  var button = document.createElement("button");
  button.type = "button";
  button.className = "gemeente-ai-assistent-button";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "gemeente-ai-assistent-panel");
  button.textContent = "Vraag de gemeente";

  var panel = document.createElement("section");
  panel.id = "gemeente-ai-assistent-panel";
  panel.className = "gemeente-ai-assistent-panel";
  panel.setAttribute("aria-label", "Gemeente AI Assistent");
  panel.hidden = true;

  // The widget builds its own small interface so the host website only needs one script tag.
  panel.innerHTML =
    '<div class="gemeente-ai-assistent-header">' +
    '  <div>' +
    '    <strong class="gemeente-ai-assistent-title">Gemeente AI Assistent</strong>' +
    '    <span>Tenant: ' + escapeHtml(tenant || "demo") + "</span>" +
    "  </div>" +
    '  <button type="button" class="gemeente-ai-assistent-close" aria-label="Sluit assistent">x</button>' +
    "</div>" +
    '<div class="gemeente-ai-assistent-body">' +
    '  <p class="gemeente-ai-assistent-disclaimer">Deze AI-assistent helpt u informatie te vinden, maar neemt geen besluiten. Controleer altijd de officiële gemeentelijke informatie.</p>' +
    '  <p class="gemeente-ai-assistent-privacy-notice">Deel geen BSN, medische gegevens of andere gevoelige persoonsgegevens. Lees de <a href="https://example.com/privacy" target="_blank" rel="noopener noreferrer">privacyinformatie</a>.</p>' +
    '  <div class="gemeente-ai-assistent-messages" aria-live="polite">' +
    '    <p class="gemeente-ai-assistent-message gemeente-ai-assistent-message-assistant gemeente-ai-assistent-intro">Hoi, ik ben Gemeente AI Assistent. Ik kan helpen met vragen over paspoorten en identiteitskaarten, verhuizen, afval, vergunningen en contact met de gemeente.</p>' +
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
    "  right: 20px;" +
    "  bottom: 20px;" +
    "  z-index: 2147483647;" +
    "  font-family: Arial, sans-serif;" +
    "  color: #1f2933;" +
    "}" +
    "#" + widgetId + " * {" +
    "  box-sizing: border-box;" +
    "}" +
    ".gemeente-ai-assistent-button {" +
    "  border: 0;" +
    "  border-radius: 999px;" +
    "  padding: 12px 18px;" +
    "  background: #0f766e;" +
    "  color: #ffffff;" +
    "  font: inherit;" +
    "  font-weight: 700;" +
    "  cursor: pointer;" +
    "  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.24);" +
    "}" +
    ".gemeente-ai-assistent-panel {" +
    "  width: min(360px, calc(100vw - 40px));" +
    "  margin-bottom: 12px;" +
    "  overflow: hidden;" +
    "  border: 1px solid #d6dce5;" +
    "  border-radius: 8px;" +
    "  background: #ffffff;" +
    "  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.24);" +
    "}" +
    ".gemeente-ai-assistent-header {" +
    "  display: flex;" +
    "  align-items: flex-start;" +
    "  justify-content: space-between;" +
    "  gap: 12px;" +
    "  padding: 14px 16px;" +
    "  background: #0f766e;" +
    "  color: #ffffff;" +
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
    "  max-height: 260px;" +
    "  overflow-y: auto;" +
    "  margin-bottom: 14px;" +
    "}" +
    ".gemeente-ai-assistent-message {" +
    "  width: fit-content;" +
    "  max-width: 100%;" +
    "  margin: 0;" +
    "  padding: 10px 12px;" +
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
          data.error || "De demo-server kon uw bericht niet verwerken."
        );
        note.textContent = "";
        return;
      }

      addMessage("assistant", data.message, data.sources || [], data.mode);
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

  function addMessage(sender, text, sources, mode) {
    var messageElement = document.createElement("div");
    messageElement.className =
      "gemeente-ai-assistent-message gemeente-ai-assistent-message-" + sender;
    messageElement.textContent = text;

    if (sender === "assistant" && mode) {
      messageElement.appendChild(createStatusLabel(mode));
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
    container.style.setProperty(
      "--gemeente-ai-assistent-theme",
      getSafeThemeColor(config.themeColor)
    );
    button.style.background = getSafeThemeColor(config.themeColor);

    var assistantName = config.assistantName || "Gemeente AI Assistent";
    var topics = Array.isArray(config.allowedTopics)
      ? config.allowedTopics.join(", ")
      : "gemeentelijke onderwerpen";

    title.textContent = assistantName;
    button.textContent = "Vraag " + (config.municipalityName || "de gemeente");
    intro.textContent = getIntroText(config);

    privacyLink.href = config.privacyUrl || "https://example.com/privacy";
    contactLink.href = config.contactUrl || "https://example.com/contact";
  }

  function getIntroText(config) {
    var assistantName = config.assistantName || "Gemeente AI Assistent";
    var topics = Array.isArray(config.allowedTopics)
      ? config.allowedTopics.join(", ")
      : "gemeentelijke onderwerpen";

    return (
      "Hoi, ik ben " +
      assistantName +
      ". Ik kan helpen met vragen over " +
      topics +
      "."
    );
  }

  function getSafeThemeColor(color) {
    return /^#[0-9a-fA-F]{6}$/.test(color || "") ? color : "#0f766e";
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
