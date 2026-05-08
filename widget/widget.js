(function () {
  "use strict";

  var currentScript = document.currentScript;
  var tenant = currentScript ? currentScript.getAttribute("data-tenant") : "demo";
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

  panel.innerHTML =
    '<div class="gemeente-ai-assistent-header">' +
    '  <div>' +
    '    <strong>Gemeente AI Assistent</strong>' +
    '    <span>Tenant: ' + escapeHtml(tenant || "demo") + "</span>" +
    "  </div>" +
    '  <button type="button" class="gemeente-ai-assistent-close" aria-label="Sluit assistent">x</button>' +
    "</div>" +
    '<div class="gemeente-ai-assistent-body">' +
    "  <p>Hallo! Ik ben een placeholder voor de toekomstige gemeente-assistent.</p>" +
    "  <p>Er wordt nog geen AI API aangeroepen en er worden geen berichten opgeslagen.</p>" +
    '  <label for="gemeente-ai-assistent-input">Uw vraag</label>' +
    '  <textarea id="gemeente-ai-assistent-input" rows="3" placeholder="Typ hier later uw vraag..."></textarea>' +
    '  <button type="button" class="gemeente-ai-assistent-send">Verstuur demo</button>' +
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

  sendButton.addEventListener("click", function () {
    note.textContent = "Demo: er is nog geen backend of AI-koppeling aangesloten.";
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
