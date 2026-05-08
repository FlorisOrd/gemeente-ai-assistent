(function () {
  "use strict";

  var currentScript = document.currentScript;
  var tenant = currentScript ? currentScript.getAttribute("data-tenant") : "demo";
  var apiBase = currentScript ? currentScript.getAttribute("data-api-base") || "" : "";
  var widgetId = "gemeente-ai-assistent-widget";

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
  button.textContent = "Vraag iets";

  var panel = document.createElement("section");
  panel.id = "gemeente-ai-assistent-panel";
  panel.className = "gemeente-ai-assistent-panel";
  panel.setAttribute("aria-label", "Gemeente AI Assistent");
  panel.hidden = true;

  // The widget builds its own small interface so the host website only needs one script tag.
  panel.innerHTML =
    '<div class="gemeente-ai-assistent-header">' +
    '  <div>' +
    '    <strong>Gemeente AI Assistent</strong>' +
    '    <span>Tenant: ' + escapeHtml(tenant || "demo") + "</span>" +
    "  </div>" +
    '  <button type="button" class="gemeente-ai-assistent-close" aria-label="Sluit assistent">x</button>' +
    "</div>" +
    '<div class="gemeente-ai-assistent-body">' +
    '  <p class="gemeente-ai-assistent-privacy-notice">Deel geen BSN, medische gegevens of andere gevoelige persoonsgegevens.</p>' +
    '  <div class="gemeente-ai-assistent-messages" aria-live="polite">' +
    '    <p class="gemeente-ai-assistent-message gemeente-ai-assistent-message-assistant">Hallo! Stel gerust een vraag. Deze demo gebruikt een mock-antwoord en geen echte AI API.</p>' +
    "  </div>" +
    '  <label for="gemeente-ai-assistent-input">Uw vraag</label>' +
    '  <textarea id="gemeente-ai-assistent-input" rows="3" placeholder="Bijvoorbeeld: hoe vraag ik een paspoort aan?"></textarea>' +
    '  <button type="button" class="gemeente-ai-assistent-send">Verstuur</button>' +
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
    ".gemeente-ai-assistent-privacy-notice {" +
    "  margin: 0 0 12px;" +
    "  padding: 10px 12px;" +
    "  border-left: 4px solid #f59e0b;" +
    "  background: #fff7ed;" +
    "  color: #7c2d12;" +
    "  font-size: 0.92rem;" +
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
    "  margin: 8px 0 0;" +
    "  padding-left: 18px;" +
    "}" +
    ".gemeente-ai-assistent-sources a {" +
    "  color: #0f766e;" +
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
    "}";

  container.appendChild(style);
  container.appendChild(panel);
  container.appendChild(button);
  document.body.appendChild(container);

  var closeButton = panel.querySelector(".gemeente-ai-assistent-close");
  var sendButton = panel.querySelector(".gemeente-ai-assistent-send");
  var input = panel.querySelector("#gemeente-ai-assistent-input");
  var messages = panel.querySelector(".gemeente-ai-assistent-messages");
  var note = panel.querySelector(".gemeente-ai-assistent-note");

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
      var response = await fetch(apiBase + "/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenant: tenant || "demo",
          message: message,
        }),
      });
      var data = await response.json();

      if (!response.ok) {
        addMessage(
          "assistant",
          data.error || "De demo-server kon uw bericht niet verwerken."
        );
        note.textContent = "";
        return;
      }

      addMessage("assistant", data.message, data.sources || []);
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

  function addMessage(sender, text, sources) {
    var messageElement = document.createElement("div");
    messageElement.className =
      "gemeente-ai-assistent-message gemeente-ai-assistent-message-" + sender;
    messageElement.textContent = text;

    if (sources && sources.length) {
      messageElement.appendChild(createSourcesList(sources));
    }

    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
  }

  function createSourcesList(sources) {
    var list = document.createElement("ul");
    list.className = "gemeente-ai-assistent-sources";

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

    return list;
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
