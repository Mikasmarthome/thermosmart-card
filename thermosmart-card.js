/**
 * ThermoSmart Lovelace Card v1.0.0-beta.1
 * https://github.com/Mikasmarthome/thermosmart-card
 */
const CARD_VERSION = '1.0.0-beta.1';

// ── i18n ─────────────────────────────────────────────────────────────────────

const I18N = {
  de: {
    heating: 'Heizt', idle: 'Hält Temp', off: 'Aus',
    obs: 'Beobachtung', window: 'Fenster offen',
    confident: 'Zuverlässig', learning: 'Lernend', collecting: 'Sammle Daten',
    target: 'Ziel',
    window_banner: 'Fenster offen – Heizung pausiert',
    not_found: 'Entity nicht gefunden',
    label_entity:   'ThermoSmart Climate-Entity',
    label_name:     'Anzeigename (optional)',
    label_compact:  'Kompaktes 2-Zeilen Layout',
    label_min_temp: 'Skalenminimum (°C)',
    label_max_temp: 'Skalenmaximum (°C)',
  },
  en: {
    heating: 'Heating', idle: 'Idle', off: 'Off',
    obs: 'Observation', window: 'Window open',
    confident: 'Reliable', learning: 'Learning', collecting: 'Collecting data',
    target: 'Target',
    window_banner: 'Window open – Heating paused',
    not_found: 'Entity not found',
    label_entity:   'ThermoSmart Climate Entity',
    label_name:     'Display name (optional)',
    label_compact:  'Compact 2-line layout',
    label_min_temp: 'Scale minimum (°C)',
    label_max_temp: 'Scale maximum (°C)',
  },
  fr: {
    heating: 'Chauffe', idle: 'Temp atteinte', off: 'Éteint',
    obs: 'Observation', window: 'Fenêtre ouverte',
    confident: 'Fiable', learning: 'Apprentissage', collecting: 'Collecte de données',
    target: 'Cible',
    window_banner: 'Fenêtre ouverte – Chauffage en pause',
    not_found: 'Entité introuvable',
    label_entity:   'Entité ThermoSmart',
    label_name:     "Nom d'affichage (optionnel)",
    label_compact:  'Disposition compacte',
    label_min_temp: "Minimum de l'échelle (°C)",
    label_max_temp: "Maximum de l'échelle (°C)",
  },
  nl: {
    heating: 'Verwarmt', idle: 'Temp bereikt', off: 'Uit',
    obs: 'Observatie', window: 'Raam open',
    confident: 'Betrouwbaar', learning: 'Lerend', collecting: 'Data verzamelen',
    target: 'Doel',
    window_banner: 'Raam open – Verwarming gepauzeerd',
    not_found: 'Entiteit niet gevonden',
    label_entity:   'ThermoSmart klimaatentiteit',
    label_name:     'Weergavenaam (optioneel)',
    label_compact:  'Compacte 2-regelweergave',
    label_min_temp: 'Schaalminimum (°C)',
    label_max_temp: 'Schaalmaximum (°C)',
  },
  es: {
    heating: 'Calentando', idle: 'Temp alcanzada', off: 'Apagado',
    obs: 'Observación', window: 'Ventana abierta',
    confident: 'Fiable', learning: 'Aprendiendo', collecting: 'Recopilando datos',
    target: 'Objetivo',
    window_banner: 'Ventana abierta – Calefacción pausada',
    not_found: 'Entidad no encontrada',
    label_entity:   'Entidad ThermoSmart',
    label_name:     'Nombre (opcional)',
    label_compact:  'Diseño compacto',
    label_min_temp: 'Mínimo de escala (°C)',
    label_max_temp: 'Máximo de escala (°C)',
  },
  it: {
    heating: 'Riscaldamento', idle: 'Temp raggiunta', off: 'Spento',
    obs: 'Osservazione', window: 'Finestra aperta',
    confident: 'Affidabile', learning: 'Apprendimento', collecting: 'Raccolta dati',
    target: 'Obiettivo',
    window_banner: 'Finestra aperta – Riscaldamento in pausa',
    not_found: 'Entità non trovata',
    label_entity:   'Entità ThermoSmart',
    label_name:     'Nome (opzionale)',
    label_compact:  'Layout compatto',
    label_min_temp: 'Minimo scala (°C)',
    label_max_temp: 'Massimo scala (°C)',
  },
  pl: {
    heating: 'Grzeje', idle: 'Temp osiągnięta', off: 'Wyłączony',
    obs: 'Obserwacja', window: 'Okno otwarte',
    confident: 'Niezawodny', learning: 'Uczenie się', collecting: 'Zbieranie danych',
    target: 'Cel',
    window_banner: 'Okno otwarte – Ogrzewanie wstrzymane',
    not_found: 'Encja nie znaleziona',
    label_entity:   'Encja ThermoSmart',
    label_name:     'Nazwa wyświetlania (opcjonalna)',
    label_compact:  'Układ kompaktowy',
    label_min_temp: 'Minimum skali (°C)',
    label_max_temp: 'Maksimum skali (°C)',
  },
  sv: {
    heating: 'Värmer', idle: 'Temp nådd', off: 'Av',
    obs: 'Observation', window: 'Fönster öppet',
    confident: 'Tillförlitlig', learning: 'Lärande', collecting: 'Samlar data',
    target: 'Mål',
    window_banner: 'Fönster öppet – Värme pausad',
    not_found: 'Entitet hittades inte',
    label_entity:   'ThermoSmart klimatenhet',
    label_name:     'Visningsnamn (valfritt)',
    label_compact:  'Kompakt 2-radsvy',
    label_min_temp: 'Skalminimum (°C)',
    label_max_temp: 'Skalmaximum (°C)',
  },
};

function tr(hass, key) {
  const lang = (hass?.language || 'de').split('-')[0];
  return (I18N[lang] || I18N.de)[key] ?? I18N.de[key] ?? key;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

function polarToXY(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, fromDeg, sweepDeg) {
  if (sweepDeg < 0.5) return '';
  const s = polarToXY(cx, cy, r, fromDeg);
  const e = polarToXY(cx, cy, r, fromDeg + sweepDeg);
  return `M${s.x.toFixed(1)} ${s.y.toFixed(1)} A${r} ${r} 0 ${sweepDeg > 180 ? 1 : 0} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
}

// ── Ring geometry constants ────────────────────────────────────────────────────
const CX = 140, CY = 118, R = 95, AF = 240, AS = 240;

// ── Constants ─────────────────────────────────────────────────────────────────

const MODES = [
  { preset: 'Auto',     icon: 'mdi:home-thermometer-outline' },
  { preset: 'Komfort',  icon: 'mdi:sun-thermometer-outline'  },
  { preset: 'Eco',      icon: 'mdi:leaf'                     },
  { preset: 'Nacht',    icon: 'mdi:weather-night'            },
  { preset: 'Abwesend', icon: 'mdi:walk'                     },
  { preset: 'Urlaub',   icon: 'mdi:airplane'                 },
];

const STATE_COLORS = {
  heating: { main: '#e8573f', glow: 0.18, text: '#ff8a70' },
  idle:    { main: '#4caf50', glow: 0.14, text: '#81c784' },
  window:  { main: '#2196f3', glow: 0.15, text: '#64b5f6' },
  obs:     { main: '#ff9800', glow: 0.04, text: '#ffb74d' },
  off:     { main: '#555555', glow: 0.04, text: '#888888' },
};

// ── Config-Editor ─────────────────────────────────────────────────────────────

class ThermosmartCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; }

  setConfig(config) { this._config = config; this._render(); }
  set hass(hass)    { this._hass = hass; this._render(); }

  _render() {
    if (!this._hass) return;
    const schema = [
      { name: 'entity',   required: true, selector: { entity: { domain: 'climate' } } },
      { name: 'name',     selector: { text: {} } },
      { name: 'compact',  selector: { boolean: {} } },
      { name: 'min_temp', selector: { number: { min: 5,  max: 20, step: 1, mode: 'box', unit_of_measurement: '°C' } } },
      { name: 'max_temp', selector: { number: { min: 20, max: 35, step: 1, mode: 'box', unit_of_measurement: '°C' } } },
    ];
    const form = document.createElement('ha-form');
    form.hass         = this._hass;
    form.data         = this._config;
    form.schema       = schema;
    form.computeLabel = (s) => tr(this._hass, `label_${s.name}`);
    form.addEventListener('value-changed', (ev) => {
      this._config = ev.detail.value;
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
    });
    this.replaceChildren(form);
  }
}
customElements.define('thermosmart-card-editor', ThermosmartCardEditor);

// ── Main Card ─────────────────────────────────────────────────────────────────

class ThermosmartCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config     = {};
    this._hass       = null;
    this._isDragging      = false;
    this._dragTemp        = null;
    this._listeners       = [];
    this._historyData     = null;
    this._historyFetching = false;
    this._lastHistoryFetch = 0;
  }

  static getStubConfig()    { return { entity: 'climate.thermosmart_zone' }; }
  static getConfigElement() { return document.createElement('thermosmart-card-editor'); }

  setConfig(config) {
    if (!config.entity) throw new Error('ThermoSmart Card: "entity" fehlt.');
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._isDragging) {
      this._fetchHistory();
      this._render();
    }
  }

  getCardSize() { return this._config.compact ? 2 : 7; }

  // ── History ───────────────────────────────────────────────────────────────

  _fetchHistory() {
    if (!this._hass?.callApi || this._historyFetching) return;
    if (Date.now() - this._lastHistoryFetch < 5 * 60 * 1000) return;

    this._historyFetching = true;
    const start = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();

    this._hass.callApi(
      'GET',
      `history/period/${start}?filter_entity_id=${this._config.entity}&significant_changes_only=false&minimal_response=true`
    ).then(data => {
      this._historyFetching  = false;
      this._lastHistoryFetch = Date.now();

      const states = data?.[0];
      if (!states?.length) return;

      this._historyData = states.map(s => {
        const a = s.a || s.attributes || {};
        const t = s.lu ? s.lu * 1000 : new Date(s.last_updated).getTime();
        return { t, curr: parseFloat(a.current_temperature), tgt: parseFloat(a.temperature) };
      }).filter(p => !isNaN(p.curr));

      if (!this._isDragging) this._render();
    }).catch(() => {
      this._historyFetching  = false;
      this._lastHistoryFetch = Date.now();
    });
  }

  // ── Cleanup ──────────────────────────────────────────────────────────────

  _cleanup() {
    this._listeners.forEach(fn => { try { fn(); } catch (_) {} });
    this._listeners = [];
  }

  // ── Data ─────────────────────────────────────────────────────────────────

  _getData() {
    if (!this._hass || !this._config.entity) return null;
    const st = this._hass.states[this._config.entity];
    if (!st) return null;
    const a = st.attributes;

    const num = (v, fb = null) => {
      const n = parseFloat(String(v ?? '').replace(/[^0-9.+-]/g, ''));
      return isNaN(n) ? fb : n;
    };

    const windowOpen = a.fenster_offen === true;
    const isObs      = a.beobachtungsmodus === true;
    const hvacAction = a.hvac_action || 'off';

    let stateKey = 'off';
    if (isObs)                         stateKey = 'obs';
    else if (windowOpen)               stateKey = 'window';
    else if (hvacAction === 'heating') stateKey = 'heating';
    else if (hvacAction === 'idle')    stateKey = 'idle';
    else if (st.state !== 'off')       stateKey = 'idle';

    const raw  = this._config.name || a.friendly_name || this._config.entity;
    const name = raw.replace(/^ThermoSmart\s*[–\-]\s*/i, '');

    return {
      entityId:    this._config.entity,
      name,
      currentTemp: a.current_temperature ?? null,
      targetTemp:  this._dragTemp ?? (a.temperature ?? null),
      hvacMode:    st.state,
      hvacAction,
      preset:      a.preset_mode || 'Auto',
      windowOpen,
      isObs,
      stateKey,
      col:         STATE_COLORS[stateKey],
      outdoorTemp: num(a.außentemperatur),
      weatherOff:  num(a.wetterkorrektur),
      confidence:  num(a.vorhersage_konfidenz, 0),
      preheat:     num(a.vorheizzeit, 0),
      trvSetpoint: num(a.trv_setpoint),
      boostDelta:  num(a.boost_delta, 0),
      boostFactor: num(a.boost_faktor, 1.0),
      suppression: num(a.vorhersage_unterdrückung, 0),
    };
  }

  _statusLabel(d) {
    if (d.isObs)                    return tr(this._hass, 'obs');
    if (d.windowOpen)               return tr(this._hass, 'window');
    if (d.hvacAction === 'heating') return tr(this._hass, 'heating');
    if (d.hvacAction === 'idle')    return tr(this._hass, 'idle');
    return tr(this._hass, 'off');
  }

  // ── SVG Ring ─────────────────────────────────────────────────────────────

  _buildRing(d) {
    const MIN_T = this._config.min_temp ?? 15;
    const MAX_T = this._config.max_temp ?? 30;
    const frac  = t => Math.max(0, Math.min(1, (t - MIN_T) / (MAX_T - MIN_T)));

    const arcInactive = d.isObs || d.hvacMode === 'off';
    const fillColor   = arcInactive ? '#383838' : d.col.main;

    let fillSvg = '';
    if (d.currentTemp != null) {
      const sw = frac(d.currentTemp) * AS;
      if (sw > 0.5) {
        fillSvg = `
          <path d="${arcPath(CX, CY, R, AF, sw)}"
            fill="none" stroke="${fillColor}" stroke-width="18" stroke-linecap="round"/>
          <path d="${arcPath(CX, CY, R - 16, AF, sw)}"
            fill="none" stroke="${fillColor}" stroke-width="3" stroke-linecap="round" opacity="0.28"/>`;
      }
    }

    let dotSvg = '';
    if (d.targetTemp != null) {
      const p = polarToXY(CX, CY, R, AF + frac(d.targetTemp) * AS);
      dotSvg = `<circle class="ring-dot" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7"
        fill="#1c1c1e" stroke="${d.col.main}" stroke-width="2.5"/>`;
    }

    return `
      <svg class="ring-svg" viewBox="0 0 280 235"
        style="width:100%;max-width:290px;display:block;margin:0 auto;overflow:visible;touch-action:none">
        <defs>
          <radialGradient id="grd_${d.stateKey}" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="${d.col.main}" stop-opacity="${d.col.glow}"/>
            <stop offset="100%" stop-color="${d.col.main}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="${CX}" cy="${CY}" r="100" fill="url(#grd_${d.stateKey})"/>
        <path d="${arcPath(CX, CY, R, AF, AS)}"
          fill="none" stroke="#2c2c2e" stroke-width="18" stroke-linecap="round"/>
        <path d="${arcPath(CX, CY, R - 16, AF, AS)}"
          fill="none" stroke="#242424" stroke-width="3" stroke-linecap="round"/>
        ${fillSvg}
        ${dotSvg}
        <path class="arc-interact" d="${arcPath(CX, CY, R, AF, AS)}"
          fill="none" stroke="transparent" stroke-width="44" stroke-linecap="round"/>
      </svg>`;
  }

  // ── Overlays & widgets ───────────────────────────────────────────────────

  _buildTempOverlay(d) {
    const curr    = d.currentTemp;
    const intPart = curr != null ? Math.floor(Math.abs(curr)) * (curr < 0 ? -1 : 1) : null;
    const decPart = curr != null ? Math.round(Math.abs(curr - Math.trunc(curr)) * 10) : null;

    return `
      <div class="ring-overlay">
        <div class="ov-status" style="color:${d.col.text}">${this._statusLabel(d)}</div>
        <div class="ov-temp">
          ${intPart != null
            ? `<span class="ov-int">${intPart}</span><span class="ov-frac">.${decPart}<span class="ov-unit">°C</span></span>`
            : `<span class="ov-int">--</span>`
          }
        </div>
        ${d.targetTemp != null
          ? `<div class="ov-target">→ ${d.targetTemp.toFixed(1)}° ${tr(this._hass, 'target')}</div>`
          : ''}
      </div>`;
  }

  _buildWindowBanner(d) {
    if (!d.windowOpen) return '';
    return `<div class="window-banner">
      <ha-icon icon="mdi:window-open-variant" style="--mdc-icon-size:14px"></ha-icon>
      ${tr(this._hass, 'window_banner')}
    </div>`;
  }

  _buildModes(d) {
    return `<div class="modes">${MODES.map(m => {
      const active = m.preset === d.preset;
      return `<button class="mode-btn${active ? ' active' : ''}" data-preset="${m.preset}"
        title="${m.preset}" style="${active ? `--mc:${d.col.main};--mt:${d.col.text}` : ''}">
        <ha-icon icon="${m.icon}"></ha-icon>
      </button>`;
    }).join('')}</div>`;
  }

  _buildChips(d) {
    const c = [];
    if (d.weatherOff != null && Math.abs(d.weatherOff) >= 0.1)
      c.push(`<span class="chip ${d.weatherOff > 0 ? 'pos' : 'neg'}">💨 ${d.weatherOff > 0 ? '+' : ''}${d.weatherOff.toFixed(1)}°</span>`);
    if (d.boostDelta > 0.05 && d.trvSetpoint != null)
      c.push(`<span class="chip warn">↑ ${d.trvSetpoint.toFixed(1)}° TRV ×${d.boostFactor.toFixed(2)}</span>`);
    if (d.suppression > 0)
      c.push(`<span class="chip info">🌤️ −${d.suppression}%</span>`);
    if (d.preheat > 0)
      c.push(`<span class="chip warn">⏱ ${d.preheat} min</span>`);
    return c.length ? `<div class="chips">${c.join('')}</div>` : '';
  }

  _buildSparkline(d) {
    const data = this._historyData;
    if (!data || data.length < 3) return '';

    const W = 260, H = 56;
    const PL = 30, PR = 6, PT = 4, PB = 14;
    const vW = W - PL - PR, vH = H - PT - PB;

    const step = Math.max(1, Math.ceil(data.length / 80));
    const pts  = data.filter((_, i) => i % step === 0);
    if (pts.length < 2) return '';

    const allT = [...pts.map(p => p.curr), ...pts.map(p => p.tgt)].filter(t => !isNaN(t));
    if (!allT.length) return '';

    const minT  = Math.floor(Math.min(...allT) * 2) / 2;
    const maxT  = Math.ceil(Math.max(...allT) * 2) / 2;
    const range = maxT - minT || 1;

    const tx = i  => (PL + (i / (pts.length - 1)) * vW).toFixed(1);
    const ty = tv => (PT + vH - ((tv - minT) / range) * vH).toFixed(1);

    const makePath = (get) => pts.reduce((acc, p, i) => {
      const v = get(p);
      if (isNaN(v)) return acc;
      return acc + (acc === '' ? `M${tx(i)} ${ty(v)}` : ` L${tx(i)} ${ty(v)}`);
    }, '');

    const currPath = makePath(p => p.curr);
    const tgtPath  = makePath(p => p.tgt);

    const fmt = ts => {
      const d = new Date(ts);
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    };

    return `
      <div class="spark-wrap">
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;overflow:visible">
          ${tgtPath  ? `<path d="${tgtPath}"  fill="none" stroke="#363636" stroke-width="1.2" stroke-dasharray="4 3"/>` : ''}
          ${currPath ? `<path d="${currPath}" fill="none" stroke="${d.col.main}" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"/>` : ''}
          <text x="${PL - 4}" y="${ty(maxT)}" dominant-baseline="middle"
            text-anchor="end" font-size="8" fill="#3a3a3a">${maxT.toFixed(1)}°</text>
          <text x="${PL - 4}" y="${ty(minT)}" dominant-baseline="middle"
            text-anchor="end" font-size="8" fill="#3a3a3a">${minT.toFixed(1)}°</text>
          <text x="${PL}" y="${H - 1}" text-anchor="start" font-size="8" fill="#2e2e2e">
            ${fmt(pts[0].t)}
          </text>
          <text x="${W - PR}" y="${H - 1}" text-anchor="end" font-size="8" fill="#2e2e2e">
            ${fmt(pts[pts.length - 1].t)}
          </text>
        </svg>
      </div>`;
  }

  _buildConf(d) {
    const pct = Math.min(100, Math.max(0, d.confidence)).toFixed(0);
    const lbl = d.confidence >= 80
      ? tr(this._hass, 'confident')
      : d.confidence >= 50
      ? tr(this._hass, 'learning')
      : tr(this._hass, 'collecting');
    const bar = d.stateKey === 'off' ? '#4fc3f7' : d.col.main;
    return `<div class="conf-row">
      <ha-icon icon="mdi:brain" style="--mdc-icon-size:13px;opacity:.45"></ha-icon>
      <span class="conf-lbl">${lbl}</span>
      <div class="conf-bg"><div class="conf-fill" style="width:${pct}%;background:${bar}"></div></div>
      <span class="conf-pct">${pct}%</span>
    </div>`;
  }

  // ── Layout ───────────────────────────────────────────────────────────────

  _renderNormal(d) {
    return `
      <ha-card class="dark">
        <div class="hdr">
          <span class="hdr-name">${d.name}</span>
          ${d.outdoorTemp != null ? `<span class="hdr-out">🌡️ ${d.outdoorTemp.toFixed(1)}°C</span>` : ''}
        </div>

        <div class="ring-wrap">
          ${this._buildRing(d)}
          ${this._buildTempOverlay(d)}
        </div>

        ${this._buildWindowBanner(d)}

        <div class="ctrl-row">
          <button class="ctrl-btn" data-action="dec"><ha-icon icon="mdi:minus"></ha-icon></button>
          <span class="ctrl-val">${d.targetTemp != null ? d.targetTemp.toFixed(1) : '--'}</span>
          <button class="ctrl-btn" data-action="inc"><ha-icon icon="mdi:plus"></ha-icon></button>
          <button class="ctrl-btn sm" data-action="schedule" title="Details">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
          </button>
          <button class="ctrl-btn sm${d.isObs ? ' pwr-off' : ''}" data-action="power">
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>

        ${this._buildModes(d)}
        ${this._buildChips(d)}
        ${this._buildConf(d)}
        ${this._buildSparkline(d)}
      </ha-card>`;
  }

  _renderCompact(d) {
    const pct = Math.min(100, Math.max(0, d.confidence)).toFixed(0);
    return `
      <ha-card class="dark">
        <div class="cmp-row">
          <div class="cmp-icon" style="background:${d.col.main}22;border-color:${d.col.main}66">
            <ha-icon icon="mdi:home-thermometer" style="color:${d.col.main};--mdc-icon-size:20px"></ha-icon>
          </div>
          <div class="cmp-info">
            <div class="cmp-name">${d.name}</div>
            <div class="cmp-sub">${this._statusLabel(d)}${d.outdoorTemp != null ? ' · ' + d.outdoorTemp.toFixed(1) + '°C' : ''}</div>
          </div>
          <div class="cmp-temps">
            <span class="cmp-curr">${d.currentTemp != null ? d.currentTemp.toFixed(1) + '°' : '--'}</span>
            <span class="cmp-tgt">${d.targetTemp != null ? '→ ' + d.targetTemp.toFixed(1) + '°' : ''}</span>
          </div>
        </div>
        <div class="conf-bg" style="height:3px">
          <div class="conf-fill" style="width:${pct}%;background:${d.col.main}"></div>
        </div>
      </ha-card>`;
  }

  // ── CSS ───────────────────────────────────────────────────────────────────

  _css() {
    return `<style>
      :host { display: block; }
      ha-card.dark {
        background: #1c1c1e; color: #fff;
        padding: 14px 14px 12px; box-sizing: border-box;
      }

      /* Header */
      .hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
      .hdr-name { font-size: 1em; font-weight: 500; color: #ccc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .hdr-out  { font-size: 0.75em; color: #777; background: #2a2a2a; padding: 2px 8px; border-radius: 9px; flex-shrink: 0; margin-left: 8px; }

      /* Ring + Overlay */
      .ring-wrap { position: relative; display: flex; justify-content: center; margin-bottom: 2px; }
      .ring-svg { cursor: default; }
      .ring-svg.dragging, .ring-svg.dragging .arc-interact { cursor: grabbing !important; }
      .arc-interact { cursor: grab; }
      .ring-overlay {
        position: absolute;
        top: 51%; left: 50%;
        transform: translate(-50%, -50%);
        text-align: center; pointer-events: none;
        width: 175px;
      }
      .ov-status { font-size: 0.82em; font-weight: 600; margin-bottom: 1px; white-space: nowrap; }
      .ov-temp   { line-height: 1; white-space: nowrap; }
      .ov-int    { font-size: 3.2em; font-weight: 200; color: #fff; letter-spacing: -0.02em; }
      .ov-frac   { font-size: 1.3em; font-weight: 300; color: #ddd; vertical-align: top; display: inline-block; margin-top: 0.42em; }
      .ov-unit   { font-size: 0.72em; }
      .ov-target { font-size: 0.77em; color: #666; margin-top: 4px; }

      /* Window banner */
      .window-banner {
        display: flex; align-items: center; gap: 6px;
        background: #1565c022; border: 1px solid #2196f344; border-radius: 8px;
        color: #64b5f6; font-size: 0.78em; padding: 5px 10px; margin-bottom: 8px;
      }

      /* Controls */
      .ctrl-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 2px 0 10px; }
      .ctrl-btn {
        width: 38px; height: 38px; border-radius: 50%; border: none;
        background: #2a2a2a; color: #bbb; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        --mdc-icon-size: 20px; transition: background 0.15s;
      }
      .ctrl-btn:hover { background: #363636; }
      .ctrl-btn.sm    { width: 32px; height: 32px; --mdc-icon-size: 17px; }
      .ctrl-btn.pwr-off { color: #e8573f; }
      .ctrl-val { font-size: 1.5em; font-weight: 300; color: #fff; min-width: 58px; text-align: center; }

      /* Modes */
      .modes { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
      .mode-btn {
        flex: 1; min-width: 36px; height: 34px; border: none; border-radius: 9px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        background: #272727; color: #444;
        transition: background 0.15s, color 0.15s;
        --mdc-icon-size: 18px;
      }
      .mode-btn.active  { background: color-mix(in srgb, var(--mc) 20%, transparent); color: var(--mt); }
      .mode-btn:hover:not(.active) { background: #333; color: #888; }

      /* Chips */
      .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
      .chip { padding: 3px 9px; border-radius: 9px; font-size: 0.72em; background: #2a2a2a; color: #666; }
      .chip.pos  { color: #81c784; }
      .chip.neg  { color: #e57373; }
      .chip.warn { color: #ffb74d; }
      .chip.info { color: #64b5f6; }

      /* Confidence */
      .conf-row { display: flex; align-items: center; gap: 6px; font-size: 0.72em; color: #444; }
      .conf-lbl { flex-shrink: 0; }
      .conf-bg  { flex: 1; height: 4px; border-radius: 2px; background: #2a2a2a; overflow: hidden; }
      .conf-fill { height: 100%; border-radius: 2px; transition: width 0.6s; }
      .conf-pct { min-width: 26px; text-align: right; flex-shrink: 0; }

      /* Sparkline */
      .spark-wrap {
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid #222;
      }

      /* Compact */
      .cmp-row  { display: flex; align-items: center; gap: 10px; padding-bottom: 7px; }
      .cmp-icon { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 1.5px solid; }
      .cmp-info { flex: 1; min-width: 0; }
      .cmp-name { font-size: 0.9em; font-weight: 500; color: #ddd; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .cmp-sub  { font-size: 0.72em; color: #555; }
      .cmp-temps { flex-shrink: 0; text-align: right; }
      .cmp-curr { font-size: 1.1em; font-weight: 300; color: #fff; }
      .cmp-tgt  { font-size: 0.74em; color: #555; margin-left: 4px; }
    </style>`;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  _render() {
    this._cleanup();
    const d = this._getData();

    if (!d) {
      this.shadowRoot.innerHTML = `${this._css()}
        <ha-card class="dark" style="padding:16px;color:#e57373;font-size:.85em">
          ${tr(this._hass, 'not_found')}: <b>${this._config?.entity || '?'}</b>
        </ha-card>`;
      return;
    }

    const body = this._config.compact ? this._renderCompact(d) : this._renderNormal(d);
    this.shadowRoot.innerHTML = this._css() + body;

    // Mode buttons
    this.shadowRoot.querySelectorAll('.mode-btn').forEach(btn => {
      const h = () => this._hass.callService('climate', 'set_preset_mode', {
        entity_id: d.entityId, preset_mode: btn.dataset.preset,
      });
      btn.addEventListener('click', h);
      this._listeners.push(() => btn.removeEventListener('click', h));
    });

    // Control buttons
    const setTempDebounced = debounce((temp) => {
      this._hass.callService('climate', 'set_temperature', { entity_id: d.entityId, temperature: temp });
    }, 300);

    this.shadowRoot.querySelectorAll('.ctrl-btn[data-action]').forEach(btn => {
      const h = () => {
        const act = btn.dataset.action;
        if (act === 'inc' || act === 'dec') {
          const t = Math.max(5, Math.min(30, (d.targetTemp ?? 20) + (act === 'inc' ? 0.5 : -0.5)));
          setTempDebounced(t);
        } else if (act === 'power') {
          this._hass.callService('climate', 'set_hvac_mode', {
            entity_id: d.entityId, hvac_mode: d.isObs ? 'heat' : 'off',
          });
        } else if (act === 'schedule') {
          this.dispatchEvent(new CustomEvent('hass-more-info', {
            detail: { entityId: d.entityId },
            bubbles: true,
            composed: true,
          }));
        }
      };
      btn.addEventListener('click', h);
      this._listeners.push(() => btn.removeEventListener('click', h));
    });

    if (!this._config.compact) this._setupDrag(d);
  }

  // ── Arc drag ──────────────────────────────────────────────────────────────

  _setupDrag(d) {
    const svg = this.shadowRoot.querySelector('.ring-svg');
    if (!svg) return;

    const MIN_T = this._config.min_temp ?? 15;
    const MAX_T = this._config.max_temp ?? 30;

    const getAngle = (clientX, clientY) => {
      const rect = svg.getBoundingClientRect();
      const svgX = (clientX - rect.left) * (280 / rect.width);
      const svgY = (clientY - rect.top)  * (235 / rect.height);
      let angle = Math.atan2(svgY - CY, svgX - CX) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;
      return angle;
    };

    const distFromRing = (clientX, clientY) => {
      const rect = svg.getBoundingClientRect();
      const svgX = (clientX - rect.left) * (280 / rect.width);
      const svgY = (clientY - rect.top)  * (235 / rect.height);
      return Math.abs(Math.hypot(svgX - CX, svgY - CY) - R);
    };

    const angleToTemp = (angle) => {
      let rel = angle - AF;
      if (rel < 0) rel += 360;
      rel = Math.max(0, Math.min(AS, rel));
      return Math.round((MIN_T + (rel / AS) * (MAX_T - MIN_T)) * 2) / 2;
    };

    let dragging = false;
    let lastTemp = null;

    const callSet = debounce((temp) => {
      this._hass.callService('climate', 'set_temperature', {
        entity_id: d.entityId, temperature: temp,
      });
    }, 600);

    const onDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      if (distFromRing(clientX, clientY) > 32) return;
      dragging          = true;
      this._isDragging  = true;
      svg.classList.add('dragging');
      const temp = angleToTemp(getAngle(clientX, clientY));
      lastTemp       = temp;
      this._dragTemp = temp;
      this._updateDragUI(temp);
      callSet(temp);
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const temp = angleToTemp(getAngle(clientX, clientY));
      if (temp !== lastTemp) {
        lastTemp       = temp;
        this._dragTemp = temp;
        this._updateDragUI(temp);
        callSet(temp);
      }
      e.preventDefault();
    };

    const onUp = () => {
      if (!dragging) return;
      dragging          = false;
      this._isDragging  = false;
      this._dragTemp    = null;
      svg.classList.remove('dragging');
    };

    svg.addEventListener('mousedown',  onDown);
    svg.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('touchmove',  onMove, { passive: false });
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchend',   onUp);

    this._listeners.push(
      () => svg.removeEventListener('mousedown',  onDown),
      () => svg.removeEventListener('touchstart', onDown),
      () => window.removeEventListener('mousemove',  onMove),
      () => window.removeEventListener('touchmove',  onMove),
      () => window.removeEventListener('mouseup',    onUp),
      () => window.removeEventListener('touchend',   onUp),
    );
  }

  _updateDragUI(temp) {
    const MIN_T = this._config.min_temp ?? 15;
    const MAX_T = this._config.max_temp ?? 30;
    const frac  = Math.max(0, Math.min(1, (temp - MIN_T) / (MAX_T - MIN_T)));
    const p     = polarToXY(CX, CY, R, AF + frac * AS);
    const sh    = this.shadowRoot;

    const valEl = sh.querySelector('.ctrl-val');
    if (valEl) valEl.textContent = temp.toFixed(1);

    const dot = sh.querySelector('.ring-dot');
    if (dot) {
      dot.setAttribute('cx', p.x.toFixed(1));
      dot.setAttribute('cy', p.y.toFixed(1));
    }

    const tgtEl = sh.querySelector('.ov-target');
    if (tgtEl) tgtEl.textContent = `→ ${temp.toFixed(1)}° ${tr(this._hass, 'target')}`;
  }
}

customElements.define('thermosmart-card', ThermosmartCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'thermosmart-card',
  name: 'ThermoSmart Card',
  description: 'KI-gestützte Heizungskarte für ThermoSmart – Drag-Ring, i18n, Diagnose & mehr',
  preview: true,
  documentationURL: 'https://github.com/Mikasmarthome/thermosmart-card',
});

console.info(
  `%c THERMOSMART-CARD %c v${CARD_VERSION} `,
  'background:#e8573f;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:bold;font-size:11px',
  'background:#2a2a2a;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0;font-size:11px',
);
