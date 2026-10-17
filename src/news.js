// "Yangiliklar" bo'limi: admin panelda qo'shilgan yangiliklar
import { fileUrl, news, pick } from './content.js';
import { lang, t } from './i18n.js';
import { icon } from './icons.js';

const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function formatDate(value) {
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(+d)) return '';
  return lang === 'uz'
    ? `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()}`
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

const paragraphs = (text) =>
  text
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');

export const items = (news ?? [])
  .map((r) => ({ r, title: pick(r, 'title'), body: pick(r, 'body'), date: formatDate(r.date) }))
  .filter((n) => n.title);

let box;
function open(n) {
  if (!box) {
    box = document.createElement('dialog');
    box.className = 'news-box';
    document.body.append(box);
    box.addEventListener('click', (e) => (e.target === box || e.target.closest('[data-close]')) && box.close());
    box.addEventListener('close', () => (document.documentElement.style.overflow = ''));
  }
  box.innerHTML = `<article class="relative mx-auto my-6 w-[min(720px,calc(100%-24px))] overflow-hidden rounded-3xl bg-white shadow-2xl">
    ${n.r.image ? `<img class="aspect-[16/9] w-full object-cover" src="${fileUrl(n.r, n.r.image)}" alt="" />` : ''}
    <button class="ctrl absolute top-3 right-3 bg-white/90" data-close aria-label="${t('close')}">${icon('x')}</button>
    <div class="p-6 sm:p-8">
      <p class="text-sm font-semibold text-brand-600">${n.date}</p>
      <h3 class="mt-1 text-2xl font-extrabold tracking-tight text-ink">${esc(n.title)}</h3>
      <div class="news-body mt-4 text-slate-700">${paragraphs(n.body)}</div>
    </div>
  </article>`;
  box.showModal();
  box.scrollTop = 0;
  document.documentElement.style.overflow = 'hidden';
}

export function renderNews(onReveal) {
  const section = document.querySelector('#yangiliklar');
  if (!items.length) return;
  section.hidden = false;
  const grid = section.querySelector('#newsGrid');
  grid.innerHTML = items
    .map(
      (n, i) => `<button type="button" class="reveal group flex flex-col overflow-hidden rounded-3xl bg-white text-left ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl" style="--d:${(i % 3) * 90}ms" data-news="${i}">
        ${n.r.image ? `<img class="aspect-[16/10] w-full object-cover" src="${fileUrl(n.r, n.r.image, '800x0')}" alt="" loading="lazy" />` : ''}
        <div class="flex flex-1 flex-col p-5">
          <p class="text-xs font-semibold text-brand-600">${n.date}</p>
          <h3 class="mt-1 text-lg leading-snug font-bold text-ink">${esc(n.title)}</h3>
          ${n.body ? `<p class="mt-2 line-clamp-3 text-sm text-slate-600">${esc(n.body)}</p>` : ''}
          ${n.body ? `<span class="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600">${t('readMore')} ${icon('arrow', 'size-4 transition group-hover:translate-x-1')}</span>` : ''}
        </div>
      </button>`,
    )
    .join('');
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-news]');
    if (b) open(items[+b.dataset.news]);
  });
  onReveal?.(grid);
}
