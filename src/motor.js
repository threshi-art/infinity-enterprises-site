(() => {
  const dialog = document.getElementById('motor-lightbox');
  const image = dialog.querySelector('img');
  const caption = document.getElementById('motor-caption');
  let opener = null;
  document.querySelectorAll('[data-full]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    image.src = button.dataset.full;
    image.alt = button.dataset.caption;
    caption.textContent = button.dataset.caption;
    dialog.showModal();
  }));
  document.getElementById('motor-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    opener?.focus();
  });
})();
