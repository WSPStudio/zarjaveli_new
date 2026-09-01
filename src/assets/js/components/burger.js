import { body, menu, menuActive, burgerMedia, burgerButton, headerTop, bodyOpenModalClass } from "../scripts/variables";
import { debounce, closeOutClick } from "../scripts/core/helpers";
import { hideScrollbar, showScrollbar } from "../scripts/ui/scrollbar";

/* 
================================================

Бургер

================================================
*/

export function burger() {
  if (burgerButton) {
    let isAnimating = false;

    burgerButton.addEventListener("click", function (e) {
      if (isAnimating) return;
      isAnimating = true;

      burgerButton.classList.toggle("active");
      menu.classList.toggle(menuActive);

      if (menu.classList.contains(menuActive)) {
        hideScrollbar();

        const scrollY = window.scrollY;
        const headerHeight = headerTop.offsetHeight;

        if (scrollY === 0) {
          menu.style.removeProperty("top");
        } else if (scrollY < headerHeight) {
          menu.style.top = scrollY + "px";
        } else {
          const headerRect = headerTop.getBoundingClientRect();
          menu.style.top = headerRect.bottom + "px";
        }
      } else {
        setTimeout(() => {
          showScrollbar();
        }, 400);
      }

      setTimeout(() => {
        isAnimating = false;
      }, 500);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        burgerButton.classList.remove("active");
        menu.classList.remove(menuActive);
        setTimeout(() => {
          showScrollbar();
        }, 400);
      }
    });

    const desktopMedia = window.matchMedia(`(min-width: ${burgerMedia + 1}px)`);

    function checkHeaderOffset(e) {
      if (e.matches) {
        menu.removeAttribute("style");

        if (!body.classList.contains(bodyOpenModalClass)) {
          body.classList.remove("no-scroll");
        }
      }
    }

    desktopMedia.addEventListener("change", checkHeaderOffset);
    checkHeaderOffset(desktopMedia);

    window.addEventListener("resize", debounce(checkHeaderOffset, 50));
    window.addEventListener("resize", debounce(checkHeaderOffset, 150));

    if (document.querySelector(".header__mobile")) {
      closeOutClick(".header__mobile", ".burger", "active");
    }
  }
}
