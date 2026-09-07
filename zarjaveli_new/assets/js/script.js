(function () {
  'use strict';

  //
  //
  //
  //
  // Переменные

  const body = document.querySelector("body");
  const html = document.querySelector("html");

  const modals = document.querySelectorAll(".modal");
  const modalStack = [];

  const headerTop = document.querySelector(".header");

  document.querySelectorAll("[data-fixed]");

  document.querySelectorAll("form");

  const menu = document.querySelector(".header__mobile");
  const burgerButton = document.querySelector(".burger");
  const menuActive = "active";

  const burgerMedia = 991;
  const bodyOpenModalClass = "modal-show";

  let windowWidth = window.innerWidth;
  document.querySelector(".container")?.offsetWidth || 0;

  const checkWindowWidth = () => {
    windowWidth = window.innerWidth;
    document.querySelector(".container")?.offsetWidth || 0;
  };

  // Задержка при вызове функции. Выполняется в конце
  function debounce(fn, delay) {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }

  window.addEventListener("resize", debounce(checkWindowWidth, 100));

  // Уникализация массива
  function uniqArray(array) {
    return array.filter(function (item, index, self) {
      return self.indexOf(item) === index;
    });
  }

  //
  //
  //
  //
  // Позиционирование

  // Отступ элемента от краев страницы
  function offset(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      right: windowWidth - rect.width - (rect.left + scrollLeft),
    };
  }

  //
  //
  //
  //
  // Массивы

  // Индекс элемента
  function indexInParent(node) {
    let children = node.parentNode.childNodes;
    let num = 0;
    for (var i = 0; i < children.length; i++) {
      if (children[i] == node) return num;
      if (children[i].nodeType == 1) num++;
    }
    return -1;
  }

  //
  //
  //
  // Общее

  // Добавление элементу обертки
  let wrap = (query, tag, wrapContent = false) => {
    let elements;

    let tagName = tag.split(".")[0] || "div";
    let tagClass = tag.split(".").slice(1);
    tagClass = tagClass.length > 0 ? tagClass : [];

    if (typeof query === "object") {
      elements = query;
    } else {
      elements = document.querySelectorAll(query);
    }

    function createWrapElement(item) {
      let newElement = document.createElement(tagName);
      if (tagClass.length) {
        newElement.classList.add(...tagClass);
      }

      if (wrapContent) {
        while (item.firstChild) {
          newElement.appendChild(item.firstChild);
        }
        item.appendChild(newElement);
      } else {
        item.parentElement.insertBefore(newElement, item);
        newElement.appendChild(item);
      }
    }

    if (elements.length) {
      for (let i = 0; i < elements.length; i++) {
        createWrapElement(elements[i]);
      }
    } else {
      if (elements.parentElement) {
        createWrapElement(elements);
      }
    }
  };

  wrap("table", ".table");
  wrap("video", ".video");

  const videoBlocks = document.querySelectorAll("video");

  if (videoBlocks) {
    videoBlocks.forEach((video) => {
      const block = video.closest(".video");

      const toggle = () => {
        video.paused ? video.play() : video.pause();
      };

      block.addEventListener("click", toggle);

      video.addEventListener("play", () => {
        block.classList.add("is-playing");
      });

      video.addEventListener("pause", () => {
        block.classList.remove("is-playing");
      });

      video.addEventListener("ended", () => {
        block.classList.remove("is-playing");
      });
    });
  }

  // Проверка на десктоп разрешение
  function isDesktop() {
    return windowWidth > burgerMedia;
  }

  // Проверка поддержки webp
  function checkWebp() {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      if (webP.height !== 2) {
        document.querySelectorAll("[style]").forEach((item) => {
          const styleAttr = item.getAttribute("style");
          if (styleAttr.indexOf("background-image") === 0) {
            item.setAttribute("style", styleAttr.replace(".webp", ".jpg"));
          }
        });
      }
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  // Проверка на браузер safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Проверка есть ли скролл
  function haveScroll() {
    return document.documentElement.scrollHeight !== document.documentElement.clientHeight;
  }

  // Видимость элемента
  function isHidden(el) {
    return window.getComputedStyle(el).display === "none";
  }

  // Закрытие бургера на десктопе
  function checkBurgerAndMenu() {
    if (isDesktop()) {
      if (!burgerButton) return;

      burgerButton.classList.remove("active");
      if (menu) {
        menu.classList.remove(menuActive);
        if (!body.classList.contains(bodyOpenModalClass)) {
          body.classList.remove("no-scroll");
        }
      }
    }
  }

  // Получение объектов с медиа-запросами
  function dataMediaQueries(array, dataSetValue) {
    let media = Array.from(array).filter(function (item) {
      if (item.dataset[dataSetValue]) {
        return item.dataset[dataSetValue].split(",")[0];
      }
    });

    if (media.length) {
      let breakpointsArray = [];
      media.forEach((item) => {
        let params = item.dataset[dataSetValue];
        let breakpoint = {};
        let paramsArray = params.split(",");
        breakpoint.value = paramsArray[0];
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
        breakpoint.item = item;
        breakpointsArray.push(breakpoint);
      });

      let mdQueries = breakpointsArray.map(function (item) {
        return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
      });

      mdQueries = uniqArray(mdQueries);
      let mdQueriesArray = [];

      if (mdQueries.length) {
        mdQueries.forEach((breakpoint) => {
          let paramsArray = breakpoint.split(",");
          let mediaBreakpoint = paramsArray[1];
          let mediaType = paramsArray[2];
          let matchMedia = window.matchMedia(paramsArray[0]);

          let itemsArray = breakpointsArray.filter(function (item) {
            return item.value === mediaBreakpoint && item.type === mediaType;
          });

          mdQueriesArray.push({ itemsArray, matchMedia });
        });

        return mdQueriesArray;
      }
    }
  }

  // Изменение ссылок в меню
  if (!document.querySelector("body").classList.contains("home") && document.querySelector("body").classList.contains("wp")) {
    let menu = document.querySelectorAll(".menu li a");

    for (let i = 0; i < menu.length; i++) {
      if (menu[i].getAttribute("href").indexOf("#") > -1) {
        menu[i].setAttribute("href", "/" + menu[i].getAttribute("href"));
      }
    }
  }

  // Добавление класса loaded после полной загрузки страницы
  function loaded() {
    const onReady = () => {
      const hasScroll = haveScroll();

      html.classList.add("loaded");

      const header = document.querySelector("header");
      if (header) {
        header.classList.add("loaded");
      }

      if (hasScroll) {
        setTimeout(() => {
          html.classList.remove("scrollbar-auto");
        }, 500);
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady, {
        once: true,
      });
    } else {
      onReady();
    }
  }

  // Для локалки
  if (window.location.hostname == "localhost" || window.location.hostname.includes("192.168")) {
    document.querySelectorAll(".logo, .crumbs>li:first-child>a").forEach((logo) => {
      logo.setAttribute("href", "/");
    });

    document.querySelectorAll(".menu a").forEach((item) => {
      let firstSlash = 0;
      let lastSlash = 0;

      if (item.href.split("/").length - 1 == 4) {
        for (let i = 0; i < item.href.length; i++) {
          if (item.href[i] == "/") {
            if (i > 6 && firstSlash == 0) {
              firstSlash = i;
              continue;
            }

            if (i > 6 && lastSlash == 0) {
              lastSlash = i;
            }
          }
        }

        let newLink = "";
        let removeProjectName = "";

        for (let i = 0; i < item.href.length; i++) {
          if (i > firstSlash && i < lastSlash + 1) {
            removeProjectName += item.href[i];
          }
        }

        newLink = item.href.replace(removeProjectName, "");
        item.href = newLink;
      }
    });
  }

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

  /* 
  	================================================
  	  
  	Карты
  	
  	================================================
  */

  function map() {
    let spinner = document.querySelectorAll(".loader");
    let check_if_load = false;

    function loadScript(url, callback) {
      let script = document.createElement("script");
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = function () {
          callback();
        };
      }

      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    function initMap() {
      loadScript("https://api-maps.yandex.ru/2.1/?apikey=5b7736c7-611f-40ce-a5a8-b7fd86e6737c&lang=ru_RU&amp;loadByRequire=1", function () {
        ymaps.load(init);
      });
      check_if_load = true;
    }

    if (document.querySelectorAll(".map").length) {
      let observer = new IntersectionObserver(
        function (entries) {
          if (entries[0]["isIntersecting"] === true) {
            if (!check_if_load) {
              spinner.forEach((element) => {
                element.classList.add("is-active");
              });
              if (entries[0]["intersectionRatio"] > 0.1) {
                initMap();
              }
            }
          }
        },
        {
          threshold: [0, 0.1, 0.2, 0.5, 1],
          rootMargin: "200px 0px",
        }
      );

      observer.observe(document.querySelector(".map"));
    }
  }

  function waitForTilesLoad(layer) {
    return new ymaps.vow.Promise(function (resolve, reject) {
      let tc = getTileContainer(layer),
        readyAll = true;
      tc.tiles.each(function (tile, number) {
        if (!tile.isReady()) {
          readyAll = false;
        }
      });
      if (readyAll) {
        resolve();
      } else {
        tc.events.once("ready", function () {
          resolve();
        });
      }
    });
  }

  function getTileContainer(layer) {
    for (let k in layer) {
      if (layer.hasOwnProperty(k)) {
        if (layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer || layer[k] instanceof ymaps.layer.tileContainer.DomContainer) {
          return layer[k];
        }
      }
    }
    return null;
  }

  window.waitForTilesLoad = waitForTilesLoad;
  window.getTileContainer = getTileContainer;

  //
  //
  //
  //
  // Функции для работы со скроллом и скроллбаром

  // Скрытие скроллбара
  function hideScrollbar() {
    modals.forEach((element) => {
      element.style.display = "none";
    });

    if (haveScroll()) {
      body.classList.add("no-scroll");
    }

    // changeScrollbarPadding();
  }

  // Показ скроллбара
  function showScrollbar() {
    if (menu && !menu.classList.contains(menuActive)) {
      body.classList.remove("no-scroll");
    }
  }

  //
  //
  //
  //
  // Анимации

  const fadeTokens = new WeakMap();

  // Плавное появление
  const fadeIn = (el, display = "block", timeout = 400) => {
    document.body.classList.add("_fade");

    const elements = el instanceof Element ? [el] : document.querySelectorAll(el);

    if (!elements.length) return;

    elements.forEach((element) => {
      const token = Symbol();
      fadeTokens.set(element, token);

      element.style.transition = "none";
      element.style.opacity = 0;
      element.style.display = display;
      element.style.transition = `opacity ${timeout}ms`;

      setTimeout(() => {
        if (fadeTokens.get(element) !== token) return;
        element.style.opacity = 1;

        setTimeout(() => {
          if (fadeTokens.get(element) !== token) return;
          document.body.classList.remove("_fade");
        }, timeout);
      }, 10);
    });
  };

  // Плавное исчезновение
  const fadeOut = (el, timeout = 400) => {
    document.body.classList.add("_fade");

    const elements = el instanceof Element ? [el] : document.querySelectorAll(el);

    if (!elements.length) return;

    elements.forEach((element) => {
      const token = Symbol();
      fadeTokens.set(element, token);

      element.style.transition = "none";
      element.style.opacity = 1;
      element.style.transition = `opacity ${timeout}ms`;

      setTimeout(() => {
        if (fadeTokens.get(element) !== token) return;
        element.style.opacity = 0;

        setTimeout(() => {
          if (fadeTokens.get(element) !== token) return;
          element.style.display = "none";
          document.body.classList.remove("_fade");
        }, timeout);

        setTimeout(() => {
          if (fadeTokens.get(element) !== token) return;
          element.removeAttribute("style");
        }, timeout + 400);
      }, 10);
    });
  };

  // Плавно скрыть с анимацией слайда
  const slideUp$1 = (target, duration = 400, showmore = 0) => {
    if (target && !target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingBlock = 0;
      target.style.marginBlock = 0;
      window.setTimeout(() => {
        target.style.display = !showmore ? "none" : "block";
        !showmore ? target.style.removeProperty("height") : null;
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        !showmore ? target.style.removeProperty("overflow") : null;
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(
          new CustomEvent("slideUpDone", {
            detail: {
              target: target,
            },
          })
        );
      }, duration);
    }
  };

  // Плавно показать с анимацией слайда
  const slideDown$1 = (target, duration = 400) => {
    if (target && !target.classList.contains("_slide")) {
      target.style.removeProperty("display");
      let display = window.getComputedStyle(target).display;
      if (display === "none") display = "block";
      target.style.display = display;
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = 0;
      target.style.paddingBLock = 0;
      target.style.marginBlock = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
      }, duration);
    }
  };

  // Плавно изменить состояние между slideUp и slideDown
  const slideToggle = (target, duration = 400) => {
    if (target && isHidden(target)) {
      return slideDown$1(target, duration);
    } else {
      return slideUp$1(target, duration);
    }
  };

  //
  //
  //
  //
  // Работа с url

  // Получение хэша
  function getHash() {
  	return location.hash ? location.hash.replace('#', '') : '';
  }

  // Удаление хэша
  function removeHash() {
  	setTimeout(() => {
  		history.pushState("", document.title, window.location.pathname + window.location.search);
  	}, 100);
  }

  // Установка хэша
  function setHash(hash) {
  	hash = hash ? `#${hash}` : window.location.href.split('#')[0];
  	history.pushState('', '', hash);
  }

  //
  //
  //
  //
  // Валидация элементов формы

  let validationInited = false;

  function validation() {
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

  function clearInputs() {
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

  /* 
    ================================================
  	  
    Модалки
  	
    ================================================
  */

  // Открытие модалки
  function openModal(modal, addHashFlag = true, dataTab = null, stack = false, animate = true) {
    if (typeof modal === "string") {
      modal = document.querySelector(modal);
    }

    if (!(modal instanceof HTMLElement)) return;

    if (!stack) {
      document.querySelectorAll(".modal_open").forEach((m) => {
        closeModal(m, false, animate);
      });

      modalStack.length = 0;
      body.classList.add(bodyOpenModalClass);
    }

    modalStack.push(modal);

    hideScrollbar();

    if (addHashFlag && !window.location.hash.includes(modal.id)) {
      window.location.hash = modal.id;
    }

    fadeIn(modal);

    modal.classList.remove("modal_close");
    modal.classList.add("modal_open");

    if (dataTab) {
      document.querySelector(`[data-href="#${dataTab}"]`)?.click();
    }
  }

  window.openModal = openModal;

  function closeModal(modal, removeHashFlag = true, animate = true) {
    if (typeof modal === "string") {
      modal = document.querySelector(modal);
    }

    if (!(modal instanceof HTMLElement)) return;

    modal.classList.remove("modal_open");
    modal.classList.add("modal_close");

    // Убрать из стека
    const index = modalStack.indexOf(modal);

    if (index !== -1) {
      modalStack.splice(index, 1);
    }

    const close = () => {
      if (animate) {
        fadeOut(modal);
      } else {
        modal.style.display = "none";
      }

      if (removeHashFlag && getHash() ? getHash() == modal.id : true) {
        if (modalStack.length) {
          window.location.hash = modalStack[modalStack.length - 1].id;
        } else {
          history.pushState("", document.title, window.location.pathname + window.location.search);

          body.classList.remove(bodyOpenModalClass);
          showScrollbar();
        }
      }

      clearInputs();

      if (animate) {
        setTimeout(() => {
          const modalInfo = document.querySelector(".modal-info");

          if (modalInfo) {
            modalInfo.value = "";
          }
        }, 400);
      } else {
        const modalInfo = document.querySelector(".modal-info");

        if (modalInfo) {
          modalInfo.value = "";
        }
      }
    };

    if (animate) {
      setTimeout(close, 200);
    } else {
      close();
    }
  }

  function modal() {
    const modalDialogs = document.querySelectorAll(".modal__dialog");

    document.querySelectorAll("[data-modal]").forEach((button) => {
      button.addEventListener("click", function () {
        let [dataModal, dataTab] = button.getAttribute("data-modal").split("#");
        const stack = button.hasAttribute("data-modal-stack");

        let modal = document.getElementById(dataModal);
        if (!modal) return;

        openModal(modal, !button.hasAttribute("data-modal-not-hash"), dataTab, stack);
      });
    });

    // Открытие модалки по хешу
    window.addEventListener("load", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const modal = document.querySelector(`.modal[id="${hash}"]`);
        if (modal) {
          setTimeout(() => {
            hideScrollbar();
            modal.classList.add("modal_open");
            body.classList.add(bodyOpenModalClass);
            fadeIn(modal);
          }, 500);
        }
      }
    });

    // Закрытие модалки при клике на крестик
    document.querySelectorAll("[data-modal-close]").forEach((element) => {
      element.addEventListener("click", () => closeModal(element.closest(".modal")));
    });

    // Закрытие модалки при клике вне области контента
    window.addEventListener("click", (e) => {
      modalDialogs.forEach((modal) => {
        if (e.target === modal) {
          closeModal(modal.closest(".modal"));
        }
      });
    });

    // Закрытие модалки при клике ESC
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.querySelectorAll(".lg-show").length === 0) {
        if (modalStack.length) {
          closeModal(modalStack[modalStack.length - 1]);
        }
      }
    });

    // Навигация назад/вперёд
    let isAnimating = false;

    window.addEventListener("popstate", async () => {
      if (isAnimating) {
        await new Promise((resolve) => {
          const checkAnimation = () => {
            if (!document.body.classList.contains("_fade")) {
              resolve();
            } else {
              setTimeout(checkAnimation, 50);
            }
          };
          checkAnimation();
        });
      }

      const hash = window.location.hash.replace("#", "");
      const modal = hash ? document.querySelector(`.modal[id="${hash}"]`) : null;
      const openedModal = document.querySelector(".modal_open");

      if (hash && modal) {
        hideScrollbar();
        isAnimating = true;
        await fadeIn(modal);

        modal.classList.remove("modal_close");
        modal.classList.add("modal_open");

        isAnimating = false;
      } else if (!hash && openedModal) {
        isAnimating = true;
        await closeModal(openedModal, false);
        isAnimating = false;
      }
    });
  }

  // Добавление прокрутки мышью для горизонтальных блоков

  // Плавный скролл
  function scrollToSmoothly(pos, time = 400) {
    const currentPos = window.pageYOffset;
    let start = null;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      const progress = currentTime - start;
      if (currentPos < pos) {
        window.scrollTo(0, ((pos - currentPos) * progress) / time + currentPos);
      } else {
        window.scrollTo(0, currentPos - ((currentPos - pos) * progress) / time);
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  }

  /* 
  	================================================
  	  
  	Табы
  	
  	================================================
  */

  function tab() {
    let tabs = document.querySelectorAll("[data-tabs]");
    let tabsActiveHash = [];
    let tabsHashId = null;

    if (tabs.length > 0) {
      let hash = getHash();

      if (hash && hash.startsWith("tab-")) {
        const hashValue = hash.replace("tab-", "");
        if (/^\d+-\d+$/.test(hashValue)) {
          tabsActiveHash = hashValue.split("-");
        } else {
          tabsHashId = hashValue;
        }
      }

      tabs.forEach((tabsBlock, index) => {
        tabsBlock.classList.add("tab_init");
        tabsBlock.setAttribute("data-tabs-index", index);
        tabsBlock.addEventListener("click", setTabsAction);
        initTabs(tabsBlock);
      });

      let mdQueriesArray = dataMediaQueries(tabs, "tabs");

      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach((mdQueriesItem) => {
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
      }
    }

    function setTitlePosition(tabsMediaArray, matchMedia) {
      tabsMediaArray.forEach((tabsMediaItem) => {
        tabsMediaItem = tabsMediaItem.item;
        let tabsTitles = tabsMediaItem.querySelector("[data-tabs-header]");
        let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
        let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
        let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");

        tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest("[data-tabs]") === tabsMediaItem);
        tabsContentItems = Array.from(tabsContentItems).filter((item) => item.closest("[data-tabs]") === tabsMediaItem);
        tabsContentItems.forEach((tabsContentItem, index) => {
          if (matchMedia.matches) {
            tabsContent.append(tabsTitleItems[index]);
            tabsContent.append(tabsContentItem);
            tabsMediaItem.classList.add("tab-spoller");
          } else {
            tabsTitles.append(tabsTitleItems[index]);
            tabsMediaItem.classList.remove("tab-spoller");
          }
        });
      });
    }

    function initTabs(tabsBlock) {
      let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-header]>*");
      let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
      let tabsBlockIndex = tabsBlock.dataset.tabsIndex;
      let tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

      if (tabsContent.length) {
        tabsContent.forEach((tabsContentItem, index) => {
          tabsTitles[index].setAttribute("data-tabs-title", "");
          tabsContentItem.setAttribute("data-tabs-item", "");

          if (tabsHashId || tabsActiveHashBlock) {
            tabsTitles[index].classList.remove("active");
          }

          if (tabsHashId) {
            if (tabsTitles[index].dataset.tabId === tabsHashId) {
              tabsTitles[index].classList.add("active");
            }
          } else if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
            tabsTitles[index].classList.add("active");
          }

          tabsContentItem.hidden = true;
        });

        let activeTab = tabsBlock.querySelector("[data-tabs-header]>.active");
        if (!activeTab) {
          tabsTitles[0].classList.add("active");
          tabsContent[0].hidden = false;
        } else {
          tabsContent[indexInParent(activeTab)].hidden = false;
        }
      }
    }

    function setTabsStatus(tabsBlock) {
      let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
      let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
      let tabsBlockIndex = tabsBlock.dataset.tabsIndex;

      function isTabsAnamate(tabsBlock) {
        if (tabsBlock.hasAttribute("data-tabs-animate")) {
          return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
        }
      }

      let tabsBlockAnimate = isTabsAnamate(tabsBlock);

      if (tabsContent.length > 0) {
        let isHash = tabsBlock.hasAttribute("data-tabs-hash");

        tabsContent = Array.from(tabsContent).filter((item) => item.closest("[data-tabs]") === tabsBlock);
        tabsTitles = Array.from(tabsTitles).filter((item) => item.closest("[data-tabs]") === tabsBlock);
        tabsContent.forEach((tabsContentItem, index) => {
          if (tabsTitles[index].classList.contains("active")) {
            if (tabsBlockAnimate) {
              slideDown(tabsContentItem, tabsBlockAnimate);
            } else {
              fadeIn(tabsContentItem, true);
              tabsContentItem.hidden = false;
            }

            if (isHash && !tabsContentItem.closest(".modal")) {
              const activeTitle = tabsTitles[index];
              const tabId = activeTitle.dataset.tabId;
              if (tabId) {
                setHash(`tab-${tabId}`);
              } else {
                setHash(`tab-${tabsBlockIndex}-${index}`);
              }
            }
          } else {
            if (tabsBlockAnimate) {
              slideUp(tabsContentItem, tabsBlockAnimate);
            } else {
              tabsContentItem.hidden = true;
            }
          }
        });
      }
    }

    function setTabsAction(e) {
      let el = e.target;

      if (el.closest("[data-tabs-title]") && !el.closest("[data-tabs-title]").classList.contains("active")) {
        let tabTitle = el.closest("[data-tabs-title]");
        let tabsBlock = tabTitle.closest("[data-tabs]");

        if (!tabTitle.classList.contains("active") && !tabsBlock.querySelector("._slide")) {
          let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title].active");
          tabActiveTitle.length ? (tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-tabs]") === tabsBlock)) : null;
          tabActiveTitle.length ? tabActiveTitle[0].classList.remove("active") : null;
          tabTitle.classList.add("active");
          setTabsStatus(tabsBlock);

          scrollToSmoothly(offset(el.closest("[data-tabs]")).top - parseInt(headerTop.clientHeight));
        }

        e.preventDefault();
      }
    }

    // Переключение табов левыми кнопками (атрибут data-tab="")
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-tab]");
      if (!target) return;

      const tabId = target.getAttribute("data-tab");
      const element = document.querySelector(`[data-tab-id="${tabId}"]`);

      element.click();

      scrollToSmoothly(element.offsetTop - headerTop.clientHeight);
    });
  }

  /* 
    ================================================
  	  
    Галерея
  	
    ================================================
  */

  function viewer() {
    const galleries = document.querySelectorAll("[data-viewer]");
    if (!galleries.length) return;

    const galleryData = [];

    galleries.forEach((gallery, index) => {
      if (gallery.classList.contains("viewer_init")) return;

      const items = [];
      const galleryItems = gallery.querySelectorAll("a[href], [data-viewer-item]");

      galleryItems.forEach((el) => {
        const src = el.getAttribute("href") || el.getAttribute("data-src");
        if (!src) return;

        const title = el.getAttribute("data-title") || el.querySelector("img")?.alt || undefined;
        const description = el.getAttribute("data-description") || undefined;
        const button = el.getAttribute("data-button") || undefined;
        const buttonHref = el.getAttribute("data-button-href") || undefined;
        const fit = el.getAttribute("data-fit") || undefined;

        items.push({
          src,
          title: title === "false" ? false : title,
          description,
          button,
          onclick: buttonHref
            ? () => {
                const target = galleryData.find((g) => g.id === buttonHref.trim());
                if (target) {
                  openSpotlight(target.items, 1);
                }
              }
            : undefined,
          fit,
        });
      });

      if (items.length === 0) return;

      const id = gallery.getAttribute("data-viewer");

      galleryData.push({
        items,
        gallery,
        index: index,
        id: id && id.trim() !== "" ? id.trim() : null,
      });

      gallery.addEventListener("click", (e) => {
        const link = e.target.closest("a[href], [data-viewer-item]");
        if (!link) return;

        e.preventDefault();
        e.stopPropagation();

        const idx = Array.from(galleryItems).indexOf(link);
        if (idx === -1) return;

        openSpotlight(items, idx + 1);
      });

      gallery.classList.add("viewer_init");
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-viewer-open]");
      if (!btn) return;

      const value = btn.getAttribute("data-viewer-open")?.trim();
      if (!value) return;

      let targetItems = null;

      const n = parseInt(value, 10);
      if (!isNaN(n) && n >= 1) {
        const targetIndex = n - 1;
        if (targetIndex < galleryData.length) {
          targetItems = galleryData[targetIndex].items;
        }
      } else {
        const target = galleryData.find((g) => g.id === value);
        if (target) {
          targetItems = target.items;
        }
      }

      if (targetItems) {
        openSpotlight(targetItems, 1);
      }
    });
  }

  function openSpotlight(items, startIndex = 1) {
    if (!items?.length) return;

    Spotlight.show(items, {
      index: startIndex,
      animation: "slide,fade,scale",
      control: "next,prev,page,zoom,autofit,fullscreen,download,close",
      zoom: true,
      autofit: true,
      fullscreen: true,
      download: true,
      play: false,
      // autoslide: 4 ,
      progress: true,
      close: true,
      page: true,
    });

    let closing = false;

    const handler = (e) => {
      if (closing) return;
      const pane = e.target.closest(".spl-pane");
      const img = e.target.closest("img");
      if (!pane || img) return;

      closing = true;
      Spotlight.close();
      document.removeEventListener("pointerdown", handler, true);
    };

    document.addEventListener("pointerdown", handler, true);
  }

  /* 
    ================================================
  	  
    Спойлеры
  	
    ================================================
  */

  function spoller() {
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

            slideUp$1(content, speed);
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

      slideUp$1(content, speed);
    }
  }

  /* 
    ================================================
  	  
    Плавная прокрутка
  	
    ================================================
  */

  function scroll() {
    let headerScroll = 0;
    const scrollLinks = document.querySelectorAll("[data-scroll], .menu a");

    if (scrollLinks.length) {
      scrollLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const target = link.hash;

          if (target && target !== "#") {
            const scrollBlock = document.querySelector(target);
            e.preventDefault();

            if (scrollBlock) {
              headerScroll = window.getComputedStyle(scrollBlock).paddingTop === "0px" ? -40 : 0;

              scrollToSmoothly(offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll), 400);

              removeHash();
              menu.classList.remove(menuActive);
              burgerButton.classList.remove("active");
              body.classList.remove("no-scroll");
            } else {
              let [baseUrl, hash] = link.href.split("#");
              if (window.location.href !== baseUrl && hash) {
                link.setAttribute("href", `${baseUrl}?link=${hash}`);
                window.location = link.getAttribute("href");
              }
            }
          }
        });
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const link = urlParams.get("link");

      if (link) {
        if (link.startsWith("tab-") && /^\d+-\d+$/.test(link.replace("tab-", ""))) {
          const [_, blockIndex, tabIndex] = link.split("-");
          const tabsBlock = document.querySelector(`[data-tabs-index="${blockIndex}"]`);
          const tabs = tabsBlock.querySelectorAll("[data-tabs-title]");

          if (tabs && tabs[tabIndex]) {
            tabs[tabIndex].click();

            scrollToSmoothly(offset(tabsBlock).top - parseInt(headerTop.clientHeight), 400);
          }
        } else if (link.startsWith("tab-")) {
          const tabId = link;
          const tabButton = document.getElementById(tabId);

          if (tabButton) {
            tabButton.click();

            scrollToSmoothly(offset(tabButton.closest("[data-tabs]") || tabButton).top - parseInt(headerTop.clientHeight), 400);
          }
        } else {
          const scrollBlock = document.getElementById(link);
          if (scrollBlock) {
            const headerScroll = window.getComputedStyle(scrollBlock).paddingTop === "0px" ? -40 : 0;
            scrollToSmoothly(offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll), 400);
          }
        }

        urlParams.delete("link");
        const newUrl = urlParams.toString() ? `${window.location.pathname}?${urlParams}` : window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    });
  }

  /* 
    ================================================
  	  
    Анимация чисел
  	
    ================================================
  */

  function numbers() {
    function digitsCountersInit(digitsCounter) {
      if (!digitsCounter.classList.contains("active")) {
        digitsCounter.dataset.originalValue = digitsCounter.innerHTML.replace(" ", "").replace(",", ".");

        digitsCounter.style.width = digitsCounter.offsetWidth + "px";
        digitsCounter.innerHTML = "0";
      }

      if (parseFloat(digitsCounter.dataset.originalValue.replace(",", ".")) % 1 != 0) {
        digitsCounter.setAttribute("data-float", true);
      }

      digitsCountersAnimate(digitsCounter);
    }

    function digitsCountersAnimate(digitsCounter) {
      let startTimestamp = null;
      const duration = parseInt(digitsCounter.dataset.digitsCounter) || 1000;
      const startValue = parseFloat(digitsCounter.dataset.originalValue.replace(/[^0-9]/g, "")) || 0;
      const startPosition = 0;

      digitsCounter.classList.add("active");

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        if (digitsCounter.getAttribute("data-float")) {
          digitsCounter.innerHTML = (progress * (startPosition + startValue)).toFixed(1).replace(".", ",");
        } else {
          digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
          digitsCounter.innerHTML = digitsCounter.innerHTML.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);

      setTimeout(() => {
        digitsCounter.removeAttribute("style");
      }, duration + 500);
    }

    // digitsCountersInit() // Запуск при скролле

    let options = {
      threshold: 0,
      rootMargin: "0px 0px 0px 0px",
    };

    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const digitsCounter = entry.target;

        if (entry.isIntersecting) {
          digitsCountersInit(digitsCounter);
          observer.unobserve(digitsCounter);
        }
      });
    }, options);

    let digitsCounters = document.querySelectorAll("[data-digits-counter]");

    if (digitsCounters.length) {
      digitsCounters.forEach((digitsCounter) => {
        observer.observe(digitsCounter);
      });
    }
  }

  map();
  modal();
  tab();
  viewer();
  spoller();
  scroll();
  numbers();

  //
  //
  //
  //
  // Общие скрипты

  //
  //
  // Слайдеры

  // Акции

  if (document.querySelector(".action-container")) {
    let actionThumbs = null;

    if (document.querySelector(".action-thumbs-container")) {
      actionThumbs = new Swiper(".action-thumbs-container", {
        spaceBetween: 12,
        watchSlidesProgress: true,
        slideToClickedSlide: false,
        allowTouchMove: true,
        scrollbar: {
          el: ".action-thumbs__scrollbar",
          draggable: true,
          hide: false,
        },
        breakpoints: {
          1: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        },
      });
    }

    function setThumbsWidth(swiper) {
      const thumbsEl = document.querySelector(".action-thumbs");

      if (!thumbsEl || !actionThumbs) return;

      const activeSlide = swiper.slides[swiper.activeIndex];

      if (activeSlide) {
        thumbsEl.style.width = activeSlide.offsetWidth + "px";
      }
    }

    new Swiper(".action-container", {
      loop: true,
      resistanceRatio: 0,
      ...(actionThumbs && {
        thumbs: {
          swiper: actionThumbs,
          autoScrollOffset: 1,
        },
      }),
      ...(!actionThumbs && {
        pagination: {
          el: ".action__pagination",
          type: "bullets",
          clickable: true,
        },
      }),
      navigation: {
        nextEl: ".action__next",
        prevEl: ".action__prev",
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      speed: 500,
      breakpoints: {
        1: {
          spaceBetween: 16,
          slidesPerView: 1,
          centeredSlides: false,
        },
        576: {
          spaceBetween: 20,
          slidesPerView: 1.3,
          centeredSlides: true,
        },
        768: {
          spaceBetween: 24,
          slidesPerView: 1.4,
          centeredSlides: true,
        },
        1200: {
          spaceBetween: 40,
          slidesPerView: 1.58,
          centeredSlides: true,
        },
      },

      on: {
        init: function () {
          setThumbsWidth(this);
        },
        resize: function () {
          setThumbsWidth(this);
        },
        breakpoint: function () {
          setThumbsWidth(this);
        },
      },
    });
  }

  // Карточки
  if (document.querySelector(".card-container")) {
    document.querySelectorAll(".card-slider").forEach((slider) => {
      new Swiper(slider.querySelector(".card-container"), {
        loop: true,
        // autoplay: {
        //   delay: 4000,
        //   pauseOnMouseEnter: true,
        //   disableOnInteraction: false,
        // },
        pagination: {
          el: slider.querySelector(".card-pagination"),
          type: "bullets",
          clickable: true,
        },
        speed: 600,
        observer: true,
        observeParents: true,
        breakpoints: {
          1: {
            spaceBetween: 12,
            slidesPerView: "auto",
          },
          768: {
            spaceBetween: 16,
            slidesPerView: 2,
          },
          992: {
            spaceBetween: 16,
            slidesPerView: 3,
          },
          1200: {
            spaceBetween: 20,
            slidesPerView: 4,
          },
        },
      });

      // const swiperEl = slider.querySelector(".card-container");
      // swiperEl.addEventListener("mouseenter", () => {
      //   cardSlider.autoplay.pause();
      // });

      // swiperEl.addEventListener("mouseleave", () => {
      //   cardSlider.autoplay.resume();
      // });
    });
  }

  // Отзывы
  if (document.querySelector(".feedback-container")) {
    new Swiper(".feedback-container", {
      loop: true,
      resistanceRatio: 0,
      pagination: {
        el: ".feedback__pagination",
        type: "bullets",
        clickable: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      spaceBetween: 24,
      speed: 500,
    });
  }

  // Слайдер залов
  const hallsItems = document.querySelectorAll(".halls__item");

  if (hallsItems) {
    hallsItems.forEach((item) => {
      const hallsSlider = item.querySelector(".halls-container");

      if (hallsSlider) {
        new Swiper(hallsSlider, {
          // autoplay: {
          //   delay: 4000,
          //   pauseOnMouseEnter: true,
          // },
          loop: true,
          resistanceRatio: 0,
          spaceBetween: 24,
          pagination: {
            el: hallsSlider.parentElement.querySelector(".halls__pagination"),
            dynamicBullets: true,
            dynamicMainBullets: 2,
            clickable: true,
          },
          speed: 500,
          breakpoints: {
            1: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 1,
            },
          },
        });
      }
    });
  }

  // В корзину + -
  document.addEventListener("click", (e) => {
    const button = e.target.closest(".count__button");

    if (!button) return;

    e.preventDefault();

    const count = button.closest(".count");
    const value = count.querySelector(".count__value");
    const minusButton = count.querySelector(".count__minus");
    const radio = button.closest(".checkbox")?.querySelector(".checkbox__input");
    const card = button.closest("[data-card]");
    const isMinus = button === minusButton;

    let quantity = value.valueAsNumber;

    if (isMinus && quantity === 1) {
      if (radio) {
        radio.checked = false;
      }

      return;
    }

    quantity += isMinus ? -1 : 1;
    value.value = quantity;

    minusButton.classList.toggle("is-minus", quantity > 1);

    if (!card) return;

    card.querySelectorAll("[data-price]").forEach((price) => {
      changeProductPrice(price, Number(price.dataset.price) * quantity);
    });
  });

  // Изменить стоимость при изменении количества
  function changeProductPrice(price, newValue) {
    const start = Number(price.dataset.currentPrice ?? price.dataset.price);
    const duration = 200;

    if (price._animation) {
      cancelAnimationFrame(price._animation);
    }

    let startTimestamp;

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(start + (newValue - start) * progress);

      price.textContent = value.toLocaleString("ru-RU").replace(/\u00A0/g, " ");

      if (progress < 1) {
        price._animation = requestAnimationFrame(animate);
      } else {
        price.dataset.currentPrice = newValue;
        price._animation = null;
      }
    };

    price._animation = requestAnimationFrame(animate);
  }

  // Выбор времени заказа при оформлении
  const callbackTime = document.querySelectorAll(".callback-time");

  if (callbackTime) {
    callbackTime.forEach((block) => {
      const timeInput = block.querySelector('[name="order_time"]');
      const nearestCheckbox = block.querySelector('[name="order_time_nearest"]');

      if (!timeInput || !nearestCheckbox) return;

      const updateTime = () => {
        timeInput.disabled = nearestCheckbox.checked;
        timeInput.required = !nearestCheckbox.checked;

        if (nearestCheckbox.checked) {
          timeInput.value = "";
          timeInput.setCustomValidity("");
        }
      };

      const validateTime = () => {
        timeInput.setCustomValidity("");

        if (timeInput.disabled || !timeInput.value) return;

        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(timeInput.value)) {
          timeInput.setCustomValidity("Укажите время в формате ЧЧ:ММ");
        }
      };

      // Маска времени при ручном вводе
      timeInput.addEventListener("input", () => {
        let value = timeInput.value.replace(/\D/g, "").slice(0, 4);

        if (value.length > 2) {
          value = `${value.slice(0, 2)}:${value.slice(2)}`;
        }

        timeInput.value = value;

        validateTime();
      });

      timeInput.addEventListener("blur", () => {
        if (!timeInput.value) return;

        const match = timeInput.value.match(/^(\d{1,2}):?(\d{1,2})$/);

        if (match) {
          const hours = Math.min(Number(match[1]), 23);
          const minutes = Math.min(Number(match[2]), 59);

          timeInput.value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        }

        validateTime();
      });

      nearestCheckbox.addEventListener("change", updateTime);

      updateTime();
    });
  }

  // Подгрузка виджета отзывов
  const iframe = document.getElementById("yandex-reviews-widget");
  if (iframe) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = iframe.dataset.src;
            if (src) {
              iframe.src = src;
              observer.unobserve(iframe);
            }
          }
        });
      },
      {
        rootMargin: "100px",
      }
    );

    observer.observe(iframe);
  }

})();
//# sourceMappingURL=script.js.map
