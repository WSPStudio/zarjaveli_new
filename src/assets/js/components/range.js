/* 
	================================================
	  
	Input range
	
	================================================
*/

export function range() {
  let ranges = document.querySelectorAll(".range");

  if (ranges) {
    ranges.forEach((rangeBlock) => {
      const rangeMin = rangeBlock.querySelector('input[type=range][data-role="min"]');
      const rangeMax = rangeBlock.querySelector('input[type=range][data-role="max"]');
      const inputMin = rangeBlock.querySelector('input[type=number][data-role="min"]');
      const inputMax = rangeBlock.querySelector('input[type=number][data-role="max"]');
      const rangeBetween = rangeBlock.querySelector(".range__between");
      const track = rangeBlock.querySelector(".range__track");

      const minValue = parseInt(rangeMin.min);
      const maxValue = parseInt(rangeMax.max);
      let isTouched = false;

      function activateBetween() {
        if (!isTouched) {
          rangeBetween.style.display = "block";
          isTouched = true;
        } else {
          if (!rangeBlock.classList.contains("active")) {
            rangeBlock.classList.add("active");
          }
        }
      }

      function updateBetween(min, max) {
        const range = maxValue - minValue;
        const left = ((min - minValue) / range) * 100;
        const right = 100 - ((max - minValue) / range) * 100;
        rangeBetween.style.left = `${left}%`;
        rangeBetween.style.right = `${right}%`;
      }

      function syncFromRange() {
        activateBetween();

        let min = parseInt(rangeMin.value);
        let max = parseInt(rangeMax.value);
        if (min > max) [min, max] = [max, min];

        inputMin.value = min;
        inputMax.value = max;

        updateBetween(min, max);
      }

      function syncFromInput() {
        activateBetween();

        let min = parseInt(inputMin.value);
        let max = parseInt(inputMax.value);

        min = Math.max(minValue, Math.min(min, maxValue));
        max = Math.max(minValue, Math.min(max, maxValue));

        if (min > max) [min, max] = [max, min];

        inputMin.value = min;
        inputMax.value = max;
        rangeMin.value = min;
        rangeMax.value = max;

        updateBetween(min, max);
      }

      track.addEventListener("click", (e) => {
        if (!(e.target.classList.contains("range__track") || e.target.classList.contains("range__between"))) {
          return;
        }

        const rect = track.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickRatio = clickX / rect.width;
        const clickedValue = Math.round(minValue + clickRatio * (maxValue - minValue));
        const distToMin = Math.abs(clickedValue - parseInt(rangeMin.value));
        const distToMax = Math.abs(clickedValue - parseInt(rangeMax.value));

        if (distToMin <= distToMax) {
          rangeMin.value = clickedValue;
        } else {
          rangeMax.value = clickedValue;
        }
        syncFromRange();
      });

      rangeMin.addEventListener("input", syncFromRange);
      rangeMax.addEventListener("input", syncFromRange);
      inputMin.addEventListener("change", syncFromInput);
      inputMax.addEventListener("change", syncFromInput);

      rangeBlock
        .closest("form")
        .querySelector('[type="reset"]')
        .addEventListener("click", function () {
          rangeBetween.style.left = "0";
          rangeBetween.style.right = "0";
        });

      syncFromRange();
    });
  }
}
