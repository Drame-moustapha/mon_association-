// main.ts - TypeScript frontend that récupère événements et stats depuis l'API
type EventItem = {
  id: string | number;
  title: string;
  date: string; // ISO
  location?: string;
  description?: string;
};

type Stats = Record<string, number>;

const EVENTS_API = '/api/events'; // adapter si nécessaire
const STATS_API = '/api/stats';   // adapter si nécessaire
const LOGIN_URL = '/login';       // adapter vers /member ou /admin si besoin

function formatDate(iso: string){
  try {
    const d = new Date(iso);
    return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return iso; }
}

async function fetchJson<T>(url: string, fallback: any = null): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } catch (e) {
    console.warn(`Échec récupération ${url}:`, e);
    return fallback;
  }
}

function renderEvents(events: EventItem[] = []) {
  const list = document.getElementById('eventsList')!;
  const fallback = document.getElementById('eventsFallback')!;
  list.innerHTML = '';
  if (!events || events.length === 0) {
    fallback.textContent = 'Aucun événement à venir pour l’instant.';
    return;
  }
  fallback.style.display = 'none';
  for (const ev of events) {
    const li = document.createElement('li');
    li.className = 'event-item';
    li.innerHTML = `
      <strong>${ev.title}</strong>
      <div class="event-meta">${formatDate(ev.date)}${ev.location ? ' — ' + ev.location : ''}</div>
      ${ev.description ? `<div class="muted" style="margin-top:8px">${ev.description}</div>` : ''}
    `;
    list.appendChild(li);
  }
}

function animateCounter(el: HTMLElement, to: number, duration = 900) {
  const start = 0;
  const startTime = performance.now();
  function frame(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (to - start) * progress);
    el.textContent = value.toString();
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderStats(stats: Stats = {}) {
  const container = document.getElementById('statsGrid')!;
  const fallback = document.getElementById('statsFallback')!;
  container.innerHTML = '';
  const keys = Object.keys(stats);
  if (keys.length === 0) {
    fallback.textContent = 'Aucune statistique disponible pour le moment.';
    return;
  }
  fallback.style.display = 'none';
  for (const k of keys) {
    const value = stats[k];
    const card = document.createElement('div');
    card.className = 'stat';
    card.innerHTML = `
      <div class="value" data-value="${value}">0</div>
      <div class="label">${k}</div>
    `;
    container.appendChild(card);
    // animation
    const valueEl = card.querySelector('.value') as HTMLElement;
    animateCounter(valueEl, Number(value));
  }
}

async function init() {
  // Login button
  const loginBtn = document.getElementById('loginBtn')!;
  loginBtn.addEventListener('click', () => {
    window.location.href = LOGIN_URL;
  });

  // Récupérer événements
  const events = await fetchJson<EventItem[]>(EVENTS_API, []);
  renderEvents(events || []);

  // Récupérer stats
  const stats = await fetchJson<Stats>(STATS_API, {});
  renderStats(stats || {});

  // Optionnel : contenu alternatif si API non disponible (exemples locaux)
  if ((!events || events.length === 0) && (!stats || Object.keys(stats).length === 0)) {
    // exemples
    const sampleEvents: EventItem[] = [
      { id: 1, title: 'Réunion associative', date: new Date(Date.now() + 3*24*3600*1000).toISOString(), location: 'Mairie', description: 'Discussion projets saisonniers.' },
      { id: 2, title: 'Tournoi de football', date: new Date(Date.now() + 10*24*3600*1000).toISOString(), location: 'Stade du quartier' }
    ];
    const sampleStats: Stats = { "Projets réalisés": 12, "Bénévoles actifs": 48, "Événements cette année": 6 };
    if (!events || events.length === 0) renderEvents(sampleEvents);
    if (!stats || Object.keys(stats).length === 0) renderStats(sampleStats);
  }
}

document.addEventListener('DOMContentLoaded', init);
