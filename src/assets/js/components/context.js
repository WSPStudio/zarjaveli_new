import { getPageSide, debounce } from "../scripts/core/helpers";

/* 
	================================================
	  
	Контекстное меню

	================================================
*/

export function context() {
  let activeContext = null;
  let isAnimating = false;

  const getMenu = (context) => context.querySelector("[data-context-menu]");
  const getTrigger = (context) => context.querySelector("button");
  const positionMenu = (context, menu) => {
    const trigger = getTrigger(context);
    const margin = 8;

    menu.style.top = "";
    menu.style.bottom = "";
    menu.style.left = "";
    menu.style.right = "";

    if (getPageSide(context) === "left") {
      menu.style.left = "0";
    } else {
      menu.style.right = "0";
    }

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const gap = 4;

    if (spaceBelow >= menuHeight + margin) {
      menu.style.top = `${trigger.offsetHeight + gap}px`;
    } else {
      menu.style.top = `-${menuHeight + gap}px`;
    }
  };

  const openMenu = (context) => {
    if (isAnimating) return;

    const menu = getMenu(context);
    if (!menu) return;

    if (activeContext && activeContext !== context) {
      closeMenu(activeContext);
    }

    positionMenu(context, menu);

    menu.classList.toggle("active");

    context.classList.add("active");
    activeContext = context;
  };

  const closeMenu = (context) => {
    if (isAnimating) return;

    const menu = getMenu(context);
    if (!menu) return;

    menu.classList.remove("active");
    context.classList.remove("active");

    if (activeContext === context) {
      activeContext = null;
    }

    const trigger = getTrigger(context);
    trigger?.blur();
  };

  const toggleMenu = (context) => {
    context.classList.contains("active") ? closeMenu(context) : openMenu(context);
  };

  document.addEventListener("click", (e) => {
    if (isAnimating) return;
    if (!(e.target instanceof Element)) return;

    const trigger = e.target.closest("[data-context] > button");
    const context = trigger?.closest("[data-context]");
    const menu = e.target.closest("[data-context-menu]");

    if (context && trigger) {
      e.preventDefault();
      toggleMenu(context);
      return;
    }

    if (!menu && activeContext) {
      closeMenu(activeContext);
    }

    if (e.target.closest("[data-context-menu] button")) {
      if (activeContext) {
        closeMenu(activeContext);
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeContext && !isAnimating) {
      closeMenu(activeContext);
    }
  });

  document.addEventListener("focusin", (e) => {
    if (!activeContext) return;
    if (!(e.target instanceof Element)) return;

    if (!activeContext.contains(e.target)) {
      closeMenu(activeContext);
    }
  });

  const repositionAllMenus = () => {
    document.querySelectorAll("[data-context].active").forEach((context) => {
      const menu = context.querySelector("[data-context-menu]");
      if (menu) positionMenu(context, menu);
    });
  };

  window.addEventListener("resize", debounce(repositionAllMenus, 150));
}
