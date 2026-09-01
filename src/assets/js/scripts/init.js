import { debounce } from "./core/helpers";
import { loaded } from "./core/dom";
import { isSafari, checkWebp } from "./ui/browser";
import { checkBurgerAndMenu } from "./core/checks";
import { headerTop } from "./variables";

// Проверка на браузер safari
if (isSafari) document.documentElement.classList.add("safari");

// Проверка поддержки webp
checkWebp();

// Закрытие бургера на десктопе
window.addEventListener("resize", debounce(checkBurgerAndMenu, 100));
checkBurgerAndMenu();

// Добавление класса loaded при загрузке страницы
loaded();

// Расчет высоты шапки
let lastHeaderHeight = 0;

function setHeaderFixedHeight(height) {
  if (height === lastHeaderHeight) return;

  lastHeaderHeight = height;
  document.documentElement.style.setProperty("--headerFixedHeight", height + "px");
}

function updateHeaderHeight() {
  if (!headerTop) return;
  setHeaderFixedHeight(headerTop.offsetHeight);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateHeaderHeight, { once: true });
} else {
  updateHeaderHeight();
}

if (headerTop && window.ResizeObserver) {
  const ro = new ResizeObserver((entries) => {
    const entry = entries[0];
    const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    setHeaderFixedHeight(height);
  });

  ro.observe(headerTop);
}
