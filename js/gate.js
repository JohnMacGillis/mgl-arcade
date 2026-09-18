/* ==========================================================================
   MacGillivray Law Arcade — door
   --------------------------------------------------------------------------
   HONEST DESCRIPTION OF WHAT THIS IS

   This keeps casual visitors out of a party game. It is NOT security.
   The page runs entirely in the browser, so anyone who opens devtools can
   walk straight past it. Treat the site as public and never put anything
   here you would mind a stranger seeing.

   What it does do: the password itself is not written down anywhere. Only
   its SHA-256 digest ships, so reading the source does not hand anyone the
   word — which matters if the word resembles one used somewhere else.

   To change the password, print a new digest and paste it below:

       printf '%s' 'your-new-password' | shasum -a 256
   ========================================================================== */

(function () {
  "use strict";

  var DIGEST = "5118c75b0cbb40bb183b90351f3b83170c3d5b9a593e187a6ff5902ed881bd28";
  var KEY = "mgl-arcade:door";

  var root = document.documentElement;
  var gate, input, form, err;

  function open() {
    try { localStorage.setItem(KEY, DIGEST); } catch (e) {}
    root.classList.remove("locked");
    if (gate) gate.remove();
  }

  // already let in on this device?
  try {
    if (localStorage.getItem(KEY) === DIGEST) { root.classList.remove("locked"); return; }
  } catch (e) {}

  function sha256(text) {
    if (!(window.crypto && window.crypto.subtle)) return Promise.reject(new Error("insecure"));
    var bytes = new TextEncoder().encode(text);
    return window.crypto.subtle.digest("SHA-256", bytes).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function build() {
    gate = document.getElementById("gate");
    if (!gate) return;
    gate.hidden = false;
    form = document.getElementById("gateForm");
    input = document.getElementById("gateWord");
    err = document.getElementById("gateErr");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var word = input.value.trim();
      if (!word) return;
      sha256(word).then(function (hex) {
        if (hex === DIGEST) { open(); return; }
        err.textContent = "Not the word. Ask whoever sent you the link.";
        input.value = "";
        input.focus();
      }).catch(function () {
        err.textContent = "This page needs to be served over https to check that.";
      });
    });

    setTimeout(function () { input.focus(); }, 80);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
