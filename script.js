const photo = document.querySelector("[data-photo]");
const photoPlaceholder = document.querySelector("[data-photo-placeholder]");

function showPhotoPlaceholder() {
  if (!photo || !photoPlaceholder) return;
  photo.classList.add("is-hidden");
  photoPlaceholder.hidden = false;
}

if (photo && photoPlaceholder) {
  photoPlaceholder.hidden = true;
  if (photo.complete && photo.naturalWidth === 0) {
    showPhotoPlaceholder();
  }
  photo.addEventListener("error", showPhotoPlaceholder, { once: true });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
const shouldRevealImmediately = Boolean(window.location.hash);

if (shouldRevealImmediately || prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}
