/* 
  ================================================
	  
  Анимация чисел
	
  ================================================
*/

export function numbers() {
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
