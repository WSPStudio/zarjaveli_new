(function () {
  const PHONE_MASK = "+7 (***) *** ** **";
  const PHONE_MASK_8 = "8 (***) *** ** **";
  const MAX_DIGITS = 11;

  function getDigits(value) {
    return (value || "").replace(/\D/g, "");
  }

  function formatPhone(digits) {
    if (!digits) return "";

    let d = digits.slice(0, MAX_DIGITS);

    if (d[0] !== "7" && d[0] !== "8") {
      d = "7" + d;
      d = d.slice(0, MAX_DIGITS);
    }

    const mask = d[0] === "8" ? PHONE_MASK_8 : PHONE_MASK;
    let result = "";
    let i = 0;

    for (const char of mask) {
      if (i >= d.length) break;
      if (char === "*" || /\d/.test(char)) {
        result += d[i++];
      } else {
        result += char;
      }
    }
    return result;
  }

  function setCursorToEndOrStar(input) {
    const pos = input.value.indexOf("*");
    const target = pos === -1 ? input.value.length : pos;
    input.setSelectionRange(target, target);
  }

  function applyPhoneMask(input, digits) {
    const clean = (digits || "").slice(0, MAX_DIGITS);
    const formatted = formatPhone(clean);
    input.value = formatted;
    input.dataset.rawValue = clean;
  }

  function clearPhoneIfEmpty(input) {
    const digits = getDigits(input.value);
    if (digits.length === 0 || input.value === "+7 (" || input.value === "8 (") {
      input.value = "";
      input.dataset.rawValue = "";
      if (input.dataset.originalPlaceholder !== undefined) {
        input.placeholder = input.dataset.originalPlaceholder;
      }
    }
  }

  function validatePhone(input) {
    const digits = getDigits(input.value);
    input.dataset.rawValue = digits;

    if (digits.length === 0) {
      input.setCustomValidity("");
      input.classList.remove("error");
      return;
    }

    if (digits.length !== MAX_DIGITS) {
      if (input.hasAttribute("required")) {
        input.setCustomValidity("Телефон должен содержать 11 цифр");
      } else {
        input.setCustomValidity("");
      }
      input.classList.add("error");
    } else {
      input.setCustomValidity("");
      input.classList.remove("error");
    }
  }

  function handleTelInput(input, e) {
    input.setCustomValidity("");

    const isDelete = e.inputType === "deleteContentBackward" || e.inputType === "deleteContentForward";

    let digits = getDigits(input.value).slice(0, MAX_DIGITS);

    if (isDelete) {
      input.dataset.rawValue = digits;
      validatePhone(input);
      return;
    }

    applyPhoneMask(input, digits);
    validatePhone(input);
    setTimeout(() => setCursorToEndOrStar(input), 0);
  }

  function handleTelFocus(input) {
    if (!input.dataset.originalPlaceholder) {
      input.dataset.originalPlaceholder = input.placeholder || "";
    }

    if (!input.value) {
      input.value = "+7 (";
      input.placeholder = "";
      input.dataset.rawValue = "7";
      setTimeout(() => {
        input.setSelectionRange(input.value.length, input.value.length);
      }, 0);
    }
  }

  function handleTelBlur(input) {
    clearPhoneIfEmpty(input);
    validatePhone(input);
  }

  function handleTelPaste(input, e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const digits = getDigits(text).slice(0, MAX_DIGITS);
    applyPhoneMask(input, digits);
    validatePhone(input);
    setTimeout(() => setCursorToEndOrStar(input), 0);
  }

  function switchToPhone(input) {
    if (input.dataset.mode === "phone") return;

    input.dataset.mode = "phone";
    input.type = "tel";
    input.placeholder = "";
    applyPhoneMask(input, input.dataset.rawValue || "");
    validatePhone(input);
  }

  function switchToEmail(input, restoreValue) {
    input.dataset.mode = "email";
    input.type = "email";
    input.placeholder = input.dataset.originalPlaceholder || "";
    input.value = restoreValue !== undefined ? restoreValue : input.dataset.rawValue || "";
    input.setCustomValidity("");
    input.classList.remove("error");
  }

  function handleUniversalInput(input, e) {
    let val = input.value;

    if (val.includes("+")) {
      const firstPlus = val.indexOf("+");
      val = (firstPlus === 0 ? "+" : "") + val.replace(/\+/g, "").trim();
      input.value = val;
    }

    const trimmed = val.trim();
    const hasAt = trimmed.includes("@");
    const hasLetter = /[a-zA-Zа-яА-ЯёЁ]/.test(trimmed);
    let digits = getDigits(trimmed).slice(0, MAX_DIGITS);
    const startsLikePhone = /^[\+78]/.test(trimmed);
    const shouldBePhone = digits.length >= 4 && !hasLetter && !hasAt && val !== "+";

    if (shouldBePhone || (startsLikePhone && !hasLetter && !hasAt && digits.length >= 1)) {
      if (hasLetter) {
        const letterMatch = trimmed.match(/[a-zA-Zа-яА-ЯёЁ]/);
        const restore = (input.dataset.rawValue || digits) + (letterMatch ? letterMatch[0] : "");
        switchToEmail(input, restore);
        input.dataset.rawValue = restore;
        return;
      }

      input.dataset.rawValue = digits;

      if (input.dataset.mode === "phone") {
        applyPhoneMask(input, digits);
        validatePhone(input);
        setTimeout(() => setCursorToEndOrStar(input), 0);
      } else {
        switchToPhone(input);
      }
    } else {
      if (input.dataset.mode === "phone" && hasLetter) {
        const letterMatch = trimmed.match(/[a-zA-Zа-яА-ЯёЁ]/);
        const restore = (input.dataset.rawValue || "") + (letterMatch ? letterMatch[0] : "");
        switchToEmail(input, restore);
        input.dataset.rawValue = restore;
      } else {
        input.dataset.rawValue = trimmed;
        switchToEmail(input);
      }
    }
  }

  function handleUniversalFocus(input) {
    if (!input.dataset.originalPlaceholder) {
      input.dataset.originalPlaceholder = input.placeholder || "";
    }
    if (!input.dataset.mode) {
      input.dataset.mode = "email";
      input.type = "email";
    }
  }

  function handleUniversalBlur(input) {
    if (input.dataset.mode === "phone") {
      clearPhoneIfEmpty(input);
      if (!input.value) {
        switchToEmail(input, "");
      } else {
        validatePhone(input);
      }
    }
  }

  document.addEventListener("focusin", function (e) {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;

    if (input.type === "tel" && !input.hasAttribute("data-tel-or-email")) {
      handleTelFocus(input);
    }

    if (input.hasAttribute("data-tel-or-email")) {
      handleUniversalFocus(input);
    }
  });

  document.addEventListener("focusout", function (e) {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;

    if (input.type === "tel" && !input.hasAttribute("data-tel-or-email")) {
      handleTelBlur(input);
    }

    if (input.hasAttribute("data-tel-or-email")) {
      handleUniversalBlur(input);
    }
  });

  document.addEventListener("input", function (e) {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;

    if (input.type === "tel" && !input.hasAttribute("data-tel-or-email")) {
      handleTelInput(input, e);
    }

    if (input.hasAttribute("data-tel-or-email")) {
      handleUniversalInput(input, e);
    }
  });

  document.addEventListener("change", function (e) {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;

    if (input.type === "tel" || (input.hasAttribute("data-tel-or-email") && input.dataset.mode === "phone")) {
      validatePhone(input);
    }
  });

  document.addEventListener("paste", function (e) {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;

    if (input.type === "tel" && !input.hasAttribute("data-tel-or-email")) {
      handleTelPaste(input, e);
    }

    if (input.hasAttribute("data-tel-or-email") && input.dataset.mode === "phone") {
      handleTelPaste(input, e);
    }
  });

  function initExisting() {
    document.querySelectorAll('input[type="tel"]:not([data-tel-or-email])').forEach((input) => {
      if (!input.dataset.originalPlaceholder) {
        input.dataset.originalPlaceholder = input.placeholder || "";
      }
      input.dataset.rawValue = getDigits(input.value).slice(0, MAX_DIGITS);
    });

    document.querySelectorAll("input[data-tel-or-email]").forEach((input) => {
      if (!input.dataset.originalPlaceholder) {
        input.dataset.originalPlaceholder = input.placeholder || "";
      }

      if (!input.dataset.mode) {
        input.dataset.mode = "email";
        input.type = "email";
      }

      input.dataset.rawValue = input.value || "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExisting);
  } else {
    initExisting();
  }
})();
