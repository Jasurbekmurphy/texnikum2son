// Saytda bosib tahrirlash rejimi: /?edit=1 (admin panelga kirilgan brauzerda).
// Belgilangan matnlar ([data-edit] va index.html dagi [data-i18n]) joyida o'zgartiriladi
// va serverdagi "texts" jadvaliga tanlangan til uchun yoziladi.
import { lang, LANGS } from './i18n.js';

const API = '/api';
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Elementdagi matn: ko'k rangda ajratilgan qism [shunday] ko'rinishida
function read(el) {
  let out = '';
  for (const n of el.childNodes) {
    if (n.nodeType === Node.TEXT_NODE) out += n.nodeValue;
    else if (n.nodeName === 'BR') out += ' ';
    else if (n.classList?.contains('text-brand-600')) out += `[${n.textContent}]`;
    else if (n.nodeType === Node.ELEMENT_NODE) out += read(n);
  }
  return out.replace(/\s+/g, ' ').trim();
}

const keyOf = (el) => el.dataset.edit || (el.dataset.i18n ? `ui.${el.dataset.i18n}` : null);
const plain = (() => {
  const d = document.createElement('div');
  d.contentEditable = 'plaintext-only';
  return d.contentEditable === 'plaintext-only' ? 'plaintext-only' : 'true';
})();

function bar(html) {
  let el = document.querySelector('.edit-bar');
  if (!el) {
    el = document.createElement('div');
    el.className = 'edit-bar';
    document.body.append(el);
  }
  el.innerHTML = html;
  return el;
}

export async function startEditor() {
  const exitUrl = (() => {
    const u = new URL(location.href);
    u.searchParams.delete('edit');
    return u.pathname + u.search;
  })();
  let token = localStorage.getItem('pb_token');
  const refresh = token && (await fetch(`${API}/collections/_superusers/auth-refresh`, { method: 'POST', headers: { Authorization: token } }).catch(() => null));
  if (!refresh?.ok) {
    bar(`<span>Tahrirlash uchun avval admin panelga kiring.</span><a class="edit-btn primary" href="/admin/">Admin panel</a><a class="edit-btn" href="${exitUrl}">Yopish</a>`);
    return;
  }
  token = (await refresh.json()).token;
  localStorage.setItem('pb_token', token);
  document.documentElement.classList.add('editing');

  const changes = new Map();
  const mark = (root) => {
    for (const el of root.querySelectorAll?.('[data-edit],[data-i18n]') ?? []) {
      if (el.dataset.key) continue;
      el.dataset.key = keyOf(el);
      el.dataset.orig = read(el);
      el.contentEditable = plain;
      el.spellcheck = false;
      // Saqlanmagan o'zgarish qayta chizilgan elementga qaytariladi (masalan, panel yopilib ochilsa)
      if (changes.has(el.dataset.key)) el.textContent = changes.get(el.dataset.key);
    }
  };
  // Sanagichlar 0 dan boshlanadi: tahrirlashda haqiqiy son ko'rinsin
  document.querySelectorAll('[data-count]').forEach((el) => (el.textContent = el.dataset.count));
  mark(document);
  new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && mark(n.parentNode ?? n)))).observe(document.body, {
    childList: true,
    subtree: true,
  });

  const other = LANGS.find((l) => l !== lang);
  // O'zbekchada yozilgani inglizchaga avtomatik tarjima qilinadi (xohlasa o'chiriladi)
  let auto = lang === 'uz';
  const render = (msg = '') =>
    bar(`<span class="font-bold">✏️ Tahrirlash · ${lang.toUpperCase()}</span>
      <span class="hidden text-slate-300 xl:inline">Matnni bosib o'zgartiring. [qavs] ichidagi so'z ko'k chiqadi, bo'sh qoldirilsa asl matn qaytadi.</span>
      <span class="text-sky-300">${esc(msg)}</span>
      <label class="flex items-center gap-1.5"><input type="checkbox" class="accent-sky-400" data-auto ${auto ? 'checked' : ''} />${other.toUpperCase()} ga avto-tarjima</label>
      <a class="edit-btn" href="?edit=1&lang=${other}">${other.toUpperCase()} tilida</a>
      <button class="edit-btn primary" data-save ${changes.size ? '' : 'disabled'}>Saqlash${changes.size ? ` (${changes.size})` : ''}</button>
      <a class="edit-btn" href="${exitUrl}">Chiqish</a>`);
  render();

  // Tahrirlanayotgan havola/tugma bosilganda sahifa o'tib ketmasin
  document.addEventListener(
    'click',
    (e) => {
      if (e.target.closest('[data-key]') && e.target.closest('a,button,summary')) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
  document.addEventListener('keydown', (e) => {
    if (!e.target.closest?.('[data-key]')) return;
    if (e.key === 'Enter') e.preventDefault();
    // Savol (summary) ichida bo'sh joy bosilsa javob ochilib-yopilmasin
    if (e.key === ' ' && e.target.closest('summary')) {
      e.preventDefault();
      document.execCommand('insertText', false, ' ');
    }
  });
  document.addEventListener('input', (e) => {
    const el = e.target.closest?.('[data-key]');
    if (!el) return;
    const value = read(el);
    if (value === el.dataset.orig) changes.delete(el.dataset.key);
    else changes.set(el.dataset.key, value);
    render();
  });
  addEventListener('beforeunload', (e) => changes.size && e.preventDefault());

  document.addEventListener('change', (e) => {
    if (e.target.matches('.edit-bar [data-auto]')) auto = e.target.checked;
  });
  document.addEventListener('click', async (e) => {
    if (!e.target.closest('.edit-bar [data-save]')) return;
    render('Saqlanmoqda...');
    try {
      const api = async (path, method, body) => {
        const res = await fetch(API + path, {
          method,
          headers: { Authorization: token, 'Content-Type': 'application/json' },
          body: body && JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || `Xato ${res.status}`);
        return res.json();
      };
      const list = [...changes];
      let translated = null;
      if (auto) {
        render('Tarjima qilinmoqda...');
        translated = await api('/translate', 'POST', { from: lang, to: other, texts: list.map(([, v]) => v) })
          .then((r) => r.texts)
          .catch(() => null);
      }
      const existing = new Map((await api('/collections/texts/records?perPage=1000&fields=id,key', 'GET')).items.map((r) => [r.key, r.id]));
      for (const [i, [key, value]] of list.entries()) {
        const body = { [lang]: value };
        if (translated) body[other] = translated[i];
        const id = existing.get(key);
        if (id) await api(`/collections/texts/records/${id}`, 'PATCH', body);
        else await api('/collections/texts/records', 'POST', { key, ...body });
      }
      changes.clear();
      if (auto && !translated) {
        render(`Saqlandi, lekin ${other.toUpperCase()} ga tarjima ishlamadi`);
        setTimeout(() => location.reload(), 3000);
      } else location.reload();
    } catch (err) {
      render(err.message);
    }
  });
}
