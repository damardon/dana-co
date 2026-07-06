"use strict";

/* pieza-whatsapp-interactivo-v1: chat interactivo + n8n/demo */
(function () {
  var config = window.DanaWhatsAppAgents;
  if (!config || !config.industries) return;

  var WEBHOOK_URL = window.NEXT_PUBLIC_N8N_WEBHOOK_URL || "";
  var DEMO_MODE = String(window.NEXT_PUBLIC_DEMO_MODE || "true") === "true";
  var SESSION_KEY_PREFIX = "dana_whatsapp_chat_v1:";

  var state = {
    industry: config.defaultIndustry,
    messages: [],
    isTyping: false,
    waiting: false,
    sessionId: createSessionId(),
  };

  var refs = {
    root: document.getElementById("dana-demos-widget"),
    features: document.getElementById("adw-features"),
    industryTabs: document.querySelectorAll(".adw-ind-tab"),
    phoneBody: document.getElementById("adw-phone-body"),
    phoneName: document.getElementById("adw-phone-agent-name"),
    phoneDot: document.getElementById("adw-phone-dot"),
    phoneStatus: document.getElementById("adw-phone-status"),
    form: document.getElementById("adw-chat-form"),
    input: document.getElementById("adw-chat-input"),
    sendBtn: document.getElementById("adw-chat-send"),
  };

  if (!refs.root || !refs.phoneBody || !refs.form || !refs.input || !refs.sendBtn) {
    return;
  }

  init();

  function init() {
    bindIndustryTabs();
    bindForm();
    hydrateOrSeed(state.industry);
    renderAll();
  }

  function bindIndustryTabs() {
    refs.industryTabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var nextIndustry = btn.dataset.industry;
        if (!nextIndustry || !config.industries[nextIndustry]) return;
        switchIndustry(nextIndustry);
      });
    });
  }

  function bindForm() {
    refs.form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      sendCurrentInput();
    });

    refs.input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        sendCurrentInput();
      }
    });
  }

  function sendCurrentInput() {
    if (state.waiting) return;
    var text = (refs.input.value || "").trim();
    if (!text) return;

    refs.input.value = "";
    pushMessage("out", text, "sent");
    setWaiting(true);
    setTyping(true);

    var respond = DEMO_MODE ? sendDemo : sendReal;
    respond(text)
      .then(function (reply) {
        pushMessage("in", reply, "read");
        markLastOutgoingAsRead();
      })
      .catch(function () {
        pushMessage(
          "in",
          "Estoy con una intermitencia temporal del sistema. Intenta nuevamente en unos segundos.",
          "read",
        );
      })
      .finally(function () {
        setTyping(false);
        setWaiting(false);
      });
  }

  function sendDemo(userText) {
    return new Promise(function (resolve) {
      var industry = config.industries[state.industry];
      var replies = industry.demoReplies || [];
      var delay = 500 + Math.floor(Math.random() * 1500);
      window.setTimeout(function () {
        var seed = (userText.length + state.messages.length) % Math.max(replies.length, 1);
        resolve(
          replies[seed] ||
            "Gracias por tu mensaje. Ya estoy procesando la mejor opción para tu caso.",
        );
      }, delay);
    });
  }

  function sendReal(userText) {
    if (!WEBHOOK_URL) return Promise.reject(new Error("Webhook URL missing"));

    return fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        industry: state.industry,
        message: userText,
        sessionId: state.sessionId,
        timestamp: new Date().toISOString(),
        piece: config.pieceName,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Webhook failed");
        return res.json().catch(function () {
          return {};
        });
      })
      .then(function (data) {
        var extracted = extractReply(data);
        if (extracted) return extracted;
        throw new Error("Invalid response");
      })
      .catch(function (err) {
        throw err;
      });
  }

  function extractReply(data) {
    if (typeof data === "string") return data;
    if (!data) return "";

    if (typeof data.reply === "string") return data.reply;
    if (typeof data.message === "string") return data.message;
    if (typeof data.output === "string") return data.output;
    if (typeof data.text === "string") return data.text;

    if (Array.isArray(data) && data.length) {
      for (var i = 0; i < data.length; i += 1) {
        var itemReply = extractReply(data[i]);
        if (itemReply) return itemReply;
      }
    }

    if (Array.isArray(data.output) && data.output.length) {
      for (var j = 0; j < data.output.length; j += 1) {
        var nestedReply = extractReply(data.output[j]);
        if (nestedReply) return nestedReply;
      }
    }

    return "";
  }

  function switchIndustry(industryId) {
    state.industry = industryId;
    state.sessionId = createSessionId();
    state.isTyping = false;
    state.waiting = false;
    refs.input.value = "";
    hydrateOrSeed(industryId, true);
    renderAll();
    refs.input.focus();
  }

  function hydrateOrSeed(industryId, forceReset) {
    var key = getStorageKey(industryId);
    if (!forceReset) {
      var raw = window.sessionStorage.getItem(key);
      if (raw) {
        try {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length) {
            state.messages = parsed;
            return;
          }
        } catch (_e) {}
      }
    }
    state.messages = [buildMessage("in", config.industries[industryId].welcome, "read")];
    persist();
  }

  function pushMessage(direction, text, status) {
    state.messages.push(buildMessage(direction, text, status));
    persist();
    renderMessages();
  }

  function buildMessage(direction, text, status) {
    return {
      id: "m_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      direction: direction,
      text: text,
      status: status || "sent",
      ts: new Date().toISOString(),
    };
  }

  function markLastOutgoingAsRead() {
    for (var i = state.messages.length - 1; i >= 0; i -= 1) {
      if (state.messages[i].direction === "out") {
        state.messages[i].status = "read";
        break;
      }
    }
    persist();
    renderMessages();
  }

  function setTyping(flag) {
    state.isTyping = !!flag;
    renderStatus();
    renderMessages();
  }

  function setWaiting(flag) {
    state.waiting = !!flag;
    refs.sendBtn.disabled = state.waiting;
    refs.input.disabled = state.waiting;
  }

  function renderAll() {
    renderIndustryTabs();
    renderAgentHeader();
    renderFeatures();
    renderStatus();
    renderMessages();
  }

  function renderIndustryTabs() {
    refs.industryTabs.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.industry === state.industry);
      btn.setAttribute("aria-pressed", String(btn.dataset.industry === state.industry));
    });
  }

  function renderAgentHeader() {
    var industry = config.industries[state.industry];
    refs.phoneName.textContent = industry.agentName;
    refs.phoneDot.textContent = industry.agentLetter;
    refs.phoneDot.style.background = industry.agentColor;
  }

  function renderFeatures() {
    var industry = config.industries[state.industry];
    refs.features.innerHTML = (industry.features || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
  }

  function renderStatus() {
    refs.phoneStatus.textContent = state.isTyping ? "Escribiendo..." : "En línea";
  }

  function renderMessages() {
    var lines = state.messages
      .map(function (msg) {
        var bubbleClass = msg.direction === "out" ? "out" : "in";
        var status = msg.direction === "out" ? formatStatus(msg.status) : "";
        return (
          '<div class="dana-msg ' +
          bubbleClass +
          '">' +
          "<p>" +
          escapeHtml(msg.text) +
          '</p><div class="dana-msg-meta">' +
          formatTime(msg.ts) +
          (status ? '<span class="dana-msg-status">' + status + "</span>" : "") +
          "</div></div>"
        );
      })
      .join("");

    var typingBlock = state.isTyping
      ? '<div class="dana-msg in dana-msg-typing"><span></span><span></span><span></span></div>'
      : "";

    refs.phoneBody.innerHTML = lines + typingBlock;
    refs.phoneBody.scrollTop = refs.phoneBody.scrollHeight;
  }

  function persist() {
    window.sessionStorage.setItem(getStorageKey(state.industry), JSON.stringify(state.messages));
  }

  function getStorageKey(industryId) {
    return SESSION_KEY_PREFIX + industryId;
  }

  function formatTime(ts) {
    var d = new Date(ts);
    var hh = String(d.getHours()).padStart(2, "0");
    var mm = String(d.getMinutes()).padStart(2, "0");
    return hh + ":" + mm;
  }

  function formatStatus(status) {
    if (status === "read") return "✓✓";
    if (status === "sent") return "✓";
    return "";
  }

  function createSessionId() {
    return "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
