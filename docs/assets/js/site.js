/* Progressive enhancement only: image links continue to work without JavaScript. */
(() => {
  'use strict';
  const dialog = document.querySelector('#lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  const close = dialog.querySelector('button');
  const zoom = document.createElement('button');
  zoom.type = 'button'; zoom.className = 'zoom-toggle';
  const english = document.documentElement.lang === 'en';
  const zoomText = english ? 'Original size' : 'Originalgröße';
  const fitText = english ? 'Fit image' : 'Einpassen';
  zoom.textContent = zoomText; zoom.setAttribute('aria-pressed', 'false');
  close.before(zoom);
  zoom.addEventListener('click', () => {
    const original = dialog.classList.toggle('original-size');
    zoom.textContent = original ? fitText : zoomText;
    zoom.setAttribute('aria-pressed', String(original));
  });
  let opener;
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      const thumbnail = link.querySelector('img');
      dialog.classList.remove('original-size'); zoom.textContent = zoomText; zoom.setAttribute('aria-pressed', 'false');
      image.src = link.href;
      image.alt = thumbnail.alt;
      caption.textContent = link.dataset.caption || thumbnail.alt;
      dialog.showModal();
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  // Native <dialog> handles Escape, focus trapping and the inert background.
})();

(() => {
  'use strict';
  const opener = document.querySelector('#portable-download');
  const dialog = document.querySelector('#download-consent');
  if (!opener || !dialog || typeof dialog.showModal !== 'function') return;
  const form = dialog.querySelector('form');
  const check = form.querySelector('input[type="checkbox"]');
  const accept = form.querySelector('[type="submit"]');
  const error = form.querySelector('.download-error');

  opener.addEventListener('click', () => {
    check.checked = false;
    accept.disabled = true;
    error.hidden = true;
    dialog.showModal();
  });
  check.addEventListener('change', () => { accept.disabled = !check.checked; });
  form.querySelector('[data-download-cancel]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener.focus());
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!dialog.open || !check.checked) return;
    const target = opener.dataset.downloadUrl;
    if (!target) {
      error.hidden = false;
      return;
    }
    dialog.close();
    window.location.assign(target);
  });
  opener.disabled = false;
})();
