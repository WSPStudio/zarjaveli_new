/* 
  ================================================
	  
  До / После
	
  ================================================
*/

export function splitView() {
  document.addEventListener("DOMContentLoaded", () => {
    const splitviews = document.querySelectorAll("[data-splitview]");

    splitviews.forEach((slider) => {
      const beforeContainer = slider.querySelector("[data-splitview-before]");
      const afterContainer = slider.querySelector("[data-splitview-after]");
      const resizer = slider.querySelector("[data-splitview-arrow]");

      if (!beforeContainer || !afterContainer || !resizer) {
        console.warn("Splitview: не найдены обязательные data-атрибуты внутри элемента", slider);
        return;
      }

      const beforeImage = beforeContainer.querySelector("img");

      let active = false;

      function setInitialWidth() {
        const width = slider.offsetWidth;
        if (beforeImage) {
          beforeImage.style.width = `${width}px`;
        }
        resizer.style.left = "50%";
      }

      function slideIt(x) {
        const rect = slider.getBoundingClientRect();
        let pos = x - rect.left;
        pos = Math.max(0, Math.min(pos, rect.width));

        const percent = (pos / rect.width) * 100;

        beforeContainer.style.width = `${percent}%`;
        resizer.style.left = `${percent}%`;

        if (range) {
          range.value = Math.round(percent);
        }
      }

      resizer.addEventListener("mousedown", (e) => {
        active = true;
        resizer.classList.add("resize");
        e.preventDefault();
      });

      document.addEventListener("mouseup", () => {
        active = false;
        resizer.classList.remove("resize");
      });

      document.addEventListener("mouseleave", () => {
        active = false;
        resizer.classList.remove("resize");
      });

      document.addEventListener("mousemove", (e) => {
        if (!active) return;
        slideIt(e.pageX);
      });

      resizer.addEventListener(
        "touchstart",
        (e) => {
          active = true;
          resizer.classList.add("resize");
          if (e.cancelable) {
            e.preventDefault();
          }
        },
        {
          passive: false,
        }
      );

      document.addEventListener("touchend", () => {
        active = false;
        resizer.classList.remove("resize");
      });

      document.addEventListener("touchcancel", () => {
        active = false;
        resizer.classList.remove("resize");
      });

      document.addEventListener(
        "touchmove",
        (e) => {
          if (!active) return;
          if (e.touches.length === 0) return;

          const touch = e.touches[0];
          slideIt(touch.pageX);

          if (e.cancelable) {
            e.preventDefault();
          }
        },
        { passive: false }
      );

      // Перемещение стрелками
      const range = resizer.querySelector('input[type="range"]');

      if (range) {
        const step = parseInt(range.step) || 1;

        const updateFromRange = () => {
          const rect = slider.getBoundingClientRect();
          const percent = range.value / 100;
          const x = rect.left + rect.width * percent;

          slideIt(x);
        };

        range.addEventListener("input", updateFromRange);

        range.addEventListener("keydown", (e) => {
          let value = parseInt(range.value);

          if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
          }

          if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            value -= step;
          }

          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            value += step;
          }

          value = Math.max(0, Math.min(100, value));

          range.value = value;
          updateFromRange();
        });
      }

      window.addEventListener("resize", () => {
        if (beforeImage) {
          beforeImage.style.width = `${slider.offsetWidth}px`;
        }
      });

      setInitialWidth();
    });
  });
}
