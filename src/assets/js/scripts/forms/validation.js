import { allForms, body } from "../variables";
import { fadeIn, fadeOut } from "../ui/animation";

//
//
//
//
// Валидация элементов формы

let validationInited = false;

export function validation() {
  if (validationInited) return;
  validationInited = true;

  const getInput = (e) => {
    const input = e.target;
    return input.matches("input, textarea") ? input : null;
  };

  const updateActiveState = (input) => {
    if (!input) return;

    if (input.type === "text") {
      input.parentElement?.classList.toggle("active", input.value.length > 0);
    }
  };

  const validateFIOField = (input) => {
    const nameAttr = (input.name || "").toLowerCase();
    const placeholder = (input.placeholder || "").toLowerCase();

    const fioKeywords = ["имя", "фамилия", "отчество"];
    const isFIO = nameAttr.includes("name") || fioKeywords.some((word) => placeholder.includes(word));

    if (!isFIO) return;

    input.value = input.value.replace(/[^а-яА-ЯёЁ\s]/g, "").replace(/\s{2,}/g, " ");
  };

  document.addEventListener("keyup", (e) => {
    const input = getInput(e);
    if (!input) return;

    updateActiveState(input);
  });

  document.addEventListener("change", (e) => {
    const input = getInput(e);
    if (!input) return;

    input.classList.remove("wpcf7-not-valid");
    updateActiveState(input);

    if (input.type === "email") {
      const value = input.value.trim();

      if (!value) {
        input.setCustomValidity("");
      } else {
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
        input.setCustomValidity(emailPattern.test(value) ? "" : "Введите корректный email");
      }
    }
  });

  document.addEventListener("input", (e) => {
    const input = getInput(e);
    if (!input) return;

    if (input.hasAttribute("data-number")) {
      input.value = input.value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }

    if (input.type === "email") {
      input.value = input.value.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, "");
    }

    validateFIOField(input);
  });

  document.addEventListener("paste", (e) => {
    const input = getInput(e);
    if (!input) return;

    setTimeout(() => {
      if (input.type === "email") {
        input.value = input.value.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, "");
      }

      validateFIOField(input);
      updateActiveState(input);
    }, 0);
  });
}

validation();

export function clearInputs() {
  let inputs = document.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    input.classList.remove("wpcf7-not-valid", "error");

    if (input.type == "date") {
      input.classList.add("empty");
    }
  });
}

function initDateInputs() {
  document.querySelectorAll(".input-date").forEach((wrapper) => {
    const input = wrapper.querySelector(".input-date__value");
    const picker = wrapper.querySelector(".input-date__picker");

    if (!input || !picker) return;

    const formatDate = (value) => {
      const numbers = value.replace(/\D/g, "").slice(0, 8);

      if (numbers.length <= 2) {
        return numbers;
      }

      if (numbers.length <= 4) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      }

      return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4)}`;
    };

    const updateState = () => {
      wrapper.classList.toggle("has-value", input.value.length > 0);
    };

    const updatePicker = () => {
      const match = input.value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

      if (!match) {
        picker.value = "";
        return;
      }

      const [, day, month, year] = match;
      picker.value = `${year}-${month}-${day}`;
    };

    const updateInput = () => {
      if (!picker.value) {
        input.value = "";
        updateState();
        return;
      }

      const [year, month, day] = picker.value.split("-");

      input.value = `${day}.${month}.${year}`;
      updateState();

      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const validate = () => {
      input.setCustomValidity("");

      if (!input.value) return;

      const match = input.value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

      if (!match) {
        input.setCustomValidity("Введите дату в формате ДД.ММ.ГГГГ");
        return;
      }

      const [, day, month, year] = match;
      const date = new Date(year, month - 1, day);

      const isValid = date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day);

      if (!isValid) {
        input.setCustomValidity("Введите корректную дату");
      }
    };

    input.addEventListener("input", () => {
      input.value = formatDate(input.value);

      updateState();
      validate();
      updatePicker();
    });

    picker.addEventListener("change", updateInput);

    wrapper.addEventListener("click", (e) => {
      if (e.target === input) return;

      picker.showPicker?.();
    });

    updateState();
    updatePicker();
    validate();
  });
}

initDateInputs();
