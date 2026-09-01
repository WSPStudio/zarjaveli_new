// Добавление прокрутки мышью для горизонтальных блоков
export function scrolling() {
  let dataScrollingBlocks = document.querySelectorAll("[data-scrolling]");

  if (dataScrollingBlocks) {
    dataScrollingBlocks.forEach((element) => {
      let isDragging = false;
      let startX;
      let scrollLeft;
      let moved = false;

      element.addEventListener("mousedown", (e) => {
        isDragging = true;
        moved = false;
        element.classList.add("dragging");
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;

        element.querySelectorAll("img, a").forEach((item) => (item.ondragstart = () => false));
      });

      element.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        moved = true;
        const x = e.pageX - element.offsetLeft;
        const walk = x - startX;
        element.scrollLeft = scrollLeft - walk;
      });

      element.addEventListener("mouseup", (e) => {
        isDragging = false;
        element.classList.remove("dragging");

        element.querySelectorAll("img, a").forEach((item) => (item.ondragstart = null));

        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      });

      element.addEventListener("mouseleave", () => {
        isDragging = false;
        element.classList.remove("dragging");
        element.querySelectorAll("img, a").forEach((item) => (item.ondragstart = null));
      });

      element.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (e) => {
          if (moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
    });
  }
}

// Плавный скролл
export function scrollToSmoothly(pos, time = 400) {
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
