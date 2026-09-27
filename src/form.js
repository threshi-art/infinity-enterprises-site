(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const title = document.querySelector('#form-caption h1');
  const description = document.querySelector('#form-caption p');
  const overline = document.querySelector('#form-caption .overline');
  const count = document.getElementById('form-count');
  const progress = document.getElementById('form-progress');
  let current = 0;
  let touchX = null;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('current', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    const copy = slides[current].querySelector('.slide-caption').textContent.trim();
    const period = copy.indexOf('.');
    title.textContent = copy.slice(0, period + 1);
    description.textContent = copy.slice(period + 1).trim();
    overline.textContent = String(current + 1).padStart(2, '0') + ' / The practice';
    count.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    progress.style.transform = 'scaleX(' + (current + 1) + ')';
  }
  document.getElementById('form-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('form-next').addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    if (event.key === 'Home') { event.preventDefault(); show(0); }
    if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
  });
  const gallery = document.getElementById('gallery');
  gallery.addEventListener('touchstart', event => { touchX = event.changedTouches[0].screenX; }, { passive: true });
  gallery.addEventListener('touchend', event => {
    if (touchX === null) return;
    const distance = event.changedTouches[0].screenX - touchX;
    touchX = null;
    if (Math.abs(distance) > 55) show(current + (distance < 0 ? 1 : -1));
  }, { passive: true });
})();
