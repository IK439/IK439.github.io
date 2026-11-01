"use strict";
const gallery = document.querySelector('#gallery');
const filters = document.querySelector('#filters');
const providers = ['ISTQB', 'OpenAI Academy', 'Claude Academy', 'IBM SkillsBuild'].filter(p => certificates.some(c => c.provider === p));
document.querySelector('#total').textContent = `${certificates.length} credentials`;
document.querySelector('#providers').textContent = `${providers.length} providers`;
const dialog = document.querySelector('#preview-dialog');
const previewImage = document.querySelector('#preview-image');
const previewTitle = document.querySelector('#preview-title');
const previewVerify = document.querySelector('#preview-verify');
let active = 'All';
let lastTrigger = null;
function openPreview(c, trigger) {
  lastTrigger = trigger;
  previewImage.src = c.image;
  previewImage.alt = `${c.title} certificate preview`;
  previewTitle.textContent = c.title;
  // ISTQB previews never show a verification action, even if a URL is added later.
  const showVerification = c.provider !== 'ISTQB' && typeof c.verify === 'string' && /^https:\/\/[^\s]+$/i.test(c.verify.trim());
  previewVerify.hidden = !showVerification;
  if (showVerification) previewVerify.href = c.verify;
  else previewVerify.removeAttribute('href');
  dialog.showModal();
}
dialog.addEventListener('close', () => { previewImage.removeAttribute('src'); lastTrigger?.focus(); });
dialog.querySelector('.preview-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
function render() {
  filters.replaceChildren();
  ['All', ...providers].forEach(name => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = name;
    button.setAttribute('aria-pressed', String(name === active));
    button.addEventListener('click', () => { active = name; render(); });
    filters.append(button);
  });
  gallery.replaceChildren();
  certificates.filter(c => active === 'All' || c.provider === active).forEach(c => {
    const article = document.createElement('article'); article.className = 'cert';
    const art = document.createElement('button'); art.type = 'button'; art.className = 'art preview-trigger';
    art.setAttribute('aria-label', `Enlarge ${c.title}`);
    const img = document.createElement('img'); img.src = c.image;
    img.alt = `${c.title} credential artwork`; img.loading = 'lazy';
    art.append(img); art.addEventListener('click', () => openPreview(c, art));
    const body = document.createElement('div'); body.className = 'cert-body';
    const provider = document.createElement('div'); provider.className = 'provider'; provider.textContent = c.provider;
    const title = document.createElement('h3'); title.textContent = c.title;
    const date = document.createElement('p'); date.className = 'meta';
    date.textContent = `${c.type} · Issued ${c.date}`;
    body.append(provider, title, date);
    if (typeof c.verify === 'string' && /^https:\/\/[^\s]+$/i.test(c.verify.trim())) {
      const link = document.createElement('a'); link.className = 'verify'; link.href = c.verify;
      link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Verify credential ↗';
      body.append(link);
    }
    article.append(art, body); gallery.append(article);
  });
}
render();
