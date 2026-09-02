import "./scripts/init.js";
import "./components.js";

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

  const actionSlider = new Swiper(".action-container", {
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
    let cardSlider = new Swiper(slider.querySelector(".card-container"), {
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
  let feedbackSlider = new Swiper(".feedback-container", {
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
