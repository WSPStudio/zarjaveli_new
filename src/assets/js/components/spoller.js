import { dataMediaQueries } from "../scripts/core/checks";
import { slideToggle, slideUp } from "../scripts/ui/animation";

/* 
  ================================================
	  
  Спойлеры
	
  ================================================
*/

export function spoller() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (!spollersArray.length) return;

  document.addEventListener("click", setSpollerAction);

  const spollersRegular = [...spollersArray].filter((item) => !item.dataset.spollers.split(",")[0]);
  if (spollersRegular.length) initSpollers(spollersRegular);

  const mdQueriesArray = dataMediaQueries(spollersArray, "spollers");

  mdQueriesArray?.forEach((mdItem) => {
    mdItem.matchMedia.addEventListener("change", () => initSpollers(mdItem.itemsArray, mdItem.matchMedia));
    initSpollers(mdItem.itemsArray, mdItem.matchMedia);
  });

  function initSpollers(array, matchMedia = false) {
    array.forEach((spollersBlock) => {
      const block = matchMedia ? spollersBlock.item : spollersBlock;
      const isInit = matchMedia ? matchMedia.matches : true;

      block.classList.toggle("_spoller-init", isInit);
      initSpollerBody(block, isInit);
    });
  }

  function initSpollerBody(block, hideBody = true) {
    block.querySelectorAll(":scope > [data-spoller]").forEach((item) => {
      const title = item.querySelector("[data-spoller-title]");
      const content = item.querySelector("[data-spoller-content]");
      if (!content) return;

      if (hideBody) {
        if (!item.hasAttribute("data-open")) {
          content.style.display = "none";
          title.classList.remove("active");
        } else {
          title.classList.add("active");
        }
      } else {
        content.style.display = "";
        title.classList.remove("active");
      }
    });
  }

  function setSpollerAction(e) {
    const titleEl = e.target.closest("[data-spoller-title]");
    const blockEl = e.target.closest("[data-spollers]");

    if (titleEl && blockEl) {
      if (blockEl.classList.contains("_disabled-click")) return;

      const itemEl = titleEl.closest("[data-spoller]");
      const contentEl = itemEl.querySelector("[data-spoller-content]");
      const speed = parseInt(blockEl.dataset.spollersSpeed) || 400;

      blockEl.classList.add("_disabled-click");
      setTimeout(() => blockEl.classList.remove("_disabled-click"), speed);

      if (blockEl.classList.contains("_spoller-init") && contentEl && !blockEl.querySelectorAll("._slide").length) {
        if (blockEl.hasAttribute("data-one-spoller") && !titleEl.classList.contains("active")) {
          hideSpollersBody(blockEl);
        }

        titleEl.classList.toggle("active");

        if (titleEl.classList.contains("active")) {
          itemEl.setAttribute("data-open", "");
        } else {
          itemEl.removeAttribute("data-open");
        }

        slideToggle(contentEl, speed);

        if (itemEl.hasAttribute("data-spoller-scroll") && titleEl.classList.contains("active")) {
          const scrollOffset = parseInt(itemEl.dataset.spollerScroll) || 0;
          const headerOffset = itemEl.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header")?.offsetHeight || 0 : 0;
          const top = itemEl.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: top - (scrollOffset + headerOffset),
            behavior: "smooth",
          });
        }
      }
    }

    if (!blockEl) {
      document.querySelectorAll("[data-spoller-close]").forEach((title) => {
        const item = title.closest("[data-spoller]");
        const block = title.closest("[data-spollers]");
        const content = item.querySelector("[data-spoller-content]");
        const speed = parseInt(block.dataset.spollersSpeed) || 400;

        if (block.classList.contains("_spoller-init")) {
          const itemEl = title.closest("[data-spoller]");

          title.classList.remove("active");
          itemEl?.removeAttribute("data-open");

          slideUp(content, speed);
        }
      });
    }
  }

  function hideSpollersBody(block) {
    const activeTitle = block.querySelector(":scope > [data-spoller] .active");
    if (!activeTitle || block.querySelectorAll("._slide").length) return;

    const content = activeTitle.closest("[data-spoller]")?.querySelector("[data-spoller-content]");
    const speed = parseInt(block.dataset.spollersSpeed) || 400;
    const activeItem = activeTitle.closest("[data-spoller]");

    activeTitle.classList.remove("active");
    activeItem?.removeAttribute("data-open");

    slideUp(content, speed);
  }
}
