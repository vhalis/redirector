const params = new URLSearchParams(window.location.search);
const requestedType = (params.get("type") || "obsidian").toLowerCase();

const ALLOWED_TYPES = Object.freeze(new Set(["obsidian", "todoist"]));

const icon = document.getElementById("icon");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const countdown = document.getElementById("countdown");
const actions = document.getElementById("actions");

function isReasonableText(value, maxLength = 300) {
  if (!value || value.length > maxLength) {
    return false;
  }

  // Block control chars and angle brackets to reduce abuse in reflected text/URLs.
  return !/[\u0000-\u001F<>]/.test(value);
}

function isValidTodoistId(value) {
  return /^\d{1,20}$/.test(value || "");
}

function startAutoClose(seconds = 10) {
  let remaining = seconds;
  countdown.textContent = `This tab closes in ${remaining}s.`;

  const timer = setInterval(() => {
    remaining -= 1;

    if (remaining > 0) {
      countdown.textContent = `This tab closes in ${remaining}s.`;
      return;
    }

    clearInterval(timer);
    countdown.textContent = "Closing tab...";

    // Browsers only allow close() for script-opened tabs/windows.
    window.close();

    setTimeout(() => {
      countdown.textContent = "Auto-close was blocked by your browser. You can close this tab manually.";
    }, 350);
  }, 1000);
}

function renderError(msg, heading = "Invalid request") {
  icon.textContent = "!";
  title.textContent = heading;
  subtitle.textContent = "";
  countdown.textContent = "";
  actions.textContent = "";

  const p = document.createElement("p");
  p.className = "error";
  p.textContent = msg;
  actions.appendChild(p);
}

function renderButton(appUrl, label, webUrl, webLabel) {
  const btn = document.createElement("a");
  btn.href = appUrl;
  btn.className = "btn btn-primary";
  btn.textContent = label;
  actions.appendChild(btn);

  if (webUrl) {
    const fallback = document.createElement("a");
    fallback.href = webUrl;
    fallback.className = "btn-secondary";
    fallback.textContent = webLabel || "Open in browser instead";
    actions.appendChild(fallback);
  }

  const allowAuto = params.get("auto") === "1";
  if (allowAuto) {
    subtitle.textContent = "Trusted auto-redirect is enabled for this link.";
    setTimeout(() => {
      window.location.href = appUrl;
    }, 50);
    startAutoClose(10);
  } else {
    subtitle.textContent = "Click to open. Auto-redirect is disabled by default for safety.";
    countdown.textContent = "";
  }
}

if (!ALLOWED_TYPES.has(requestedType)) {
  renderError("Unknown type. Only 'obsidian' and 'todoist' are allowed.", "Blocked");
} else if (requestedType === "obsidian") {
  const vault = params.get("vault");
  const file = params.get("file");

  if (!isReasonableText(vault, 120) || !isReasonableText(file, 500)) {
    renderError("Expected valid 'vault' and 'file' query parameters.", "Missing parameters");
  } else {
    const appUrl = `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(file)}`;
    icon.textContent = "O";
    title.textContent = "Open in Obsidian";
    renderButton(appUrl, "Open in Obsidian", null, null);
  }
} else {
  const id = params.get("id");

  if (!isValidTodoistId(id)) {
    renderError("Expected a valid numeric 'id' query parameter.", "Missing parameters");
  } else {
    const appUrl = `todoist://task?id=${encodeURIComponent(id)}`;
    const webUrl = `https://app.todoist.com/app/task/${encodeURIComponent(id)}`;
    icon.textContent = "T";
    title.textContent = "Open in Todoist";
    renderButton(appUrl, "Open in Todoist", webUrl, "Open in browser instead");
  }
}
