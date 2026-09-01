import { getPageSide } from "../scripts/core/helpers";

/* 
  ================================================
	  
  Тултипы 
	
  ================================================
*/

export function tooltip() {
  const timers = new WeakMap();
  let activeItem = null;

  const getTooltip = (item) => {
    let tooltip = item.querySelector(".tooltip");

    if (item.getAttribute("data-tooltip") === "html") {
      return tooltip;
    }

    if (!tooltip) {
      let text = "";

      if (item.hasAttribute("title")) {
        text = item.getAttribute("title");
        item.removeAttribute("title");
      } else {
        text = item.getAttribute("data-tooltip") || "";
      }

      tooltip = document.createElement("span");
      tooltip.className = "tooltip";
      tooltip.textContent = text;

      item.append(tooltip);
    }

    return tooltip;
  };

  const calculatePosTooltip = (item, tooltip) => {
    tooltip.style.left = "";
    tooltip.style.right = "";

    const offset = item.offsetWidth / 2 - tooltip.offsetWidth / 2;

    if (getPageSide(item) === "left") {
      tooltip.style.left = offset + "px";
    } else {
      tooltip.style.right = offset + "px";
    }

    tooltip.style.bottom = item.offsetHeight + "px";
  };

  const showTooltip = (item) => {
    if (activeItem === item) return;

    if (activeItem) {
      hideTooltip(activeItem, true);
    }

    const tooltip = getTooltip(item);
    if (!tooltip) return;

    clearTimeout(timers.get(item));

    calculatePosTooltip(item, tooltip);
    tooltip.classList.add("tooltip_active");

    activeItem = item;
  };

  const hideTooltip = (item, force = false) => {
    const tooltip = item.querySelector(".tooltip");
    if (!tooltip) return;

    clearTimeout(timers.get(item));

    if (force) {
      tooltip.classList.remove("tooltip_active");
      if (activeItem === item) activeItem = null;
      return;
    }

    const timer = setTimeout(() => {
      tooltip.classList.remove("tooltip_active");

      if (activeItem === item) {
        activeItem = null;
      }
    }, 120);

    timers.set(item, timer);
  };

  const getItem = (target) => {
    if (!(target instanceof Element)) return null;
    return target.closest("[data-tooltip]");
  };

  document.addEventListener("mouseover", (e) => {
    const item = getItem(e.target);
    if (!item) return;

    showTooltip(item);
  });

  document.addEventListener("mouseout", (e) => {
    const item = getItem(e.target);
    if (!item) return;

    if (e.relatedTarget && item.contains(e.relatedTarget)) return;

    hideTooltip(item);
  });

  document.addEventListener("focusin", (e) => {
    const item = getItem(e.target);
    if (!item) return;

    showTooltip(item);
  });

  document.addEventListener("focusout", (e) => {
    const item = getItem(e.target);
    if (!item) return;

    hideTooltip(item);
  });
}
