/**
 * ThermoSmart Lovelace Card v0.0.3b
 * https://github.com/Mikasmarthome/thermosmart-card
 */
const CARD_VERSION = '0.0.4b1';

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

const EDITOR_LABELS = {
  entity:   'ThermoSmart Climate-Entity',
  name:     'Anzeigename (optional)',
  compact:  'Kompaktes 2-Zeilen Layout',
  min_temp: 'Skalenminimum (°C)',
  max_temp: 'Skalenmaximum (°C)',
};

// ── SVG-Hilfsfunktionen ───────────────────────────────────────────────────────
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


// ── Config-Editor (ha-form) ───────────────────────────────────────────────────
class ThermosmartCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass = null;
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass) return;

    const schema = [
      { name: 'entity',   required: true,
        selector: { entity: { domain: 'climate' } } },
      { name: 'name',
        selector: { text: {} } },
      { name: 'compact',
        selector: { boolean: {} } },
      { name: 'min_temp',
        selector: { number: { min: 5, max: 20, step: 1, mode: 'box', unit_of_measurement: '°C' } } },
      { name: 'max_temp',
        selector: { number: { min: 20, max: 35, step: 1, mode: 'box', unit_of_measurement: '°C' } } },
    ];

    const form = document.createElement('ha-form');
    form.hass   = this._hass;
    form.data   = this._config;
    form.schema = schema;
    form.computeLabel = (s) => EDITOR_LABELS[s.name] || s.name;
    form.addEventListener('value-changed', (ev) => {
      this._config = ev.detail.value;
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
    });
    this.replaceChildren(form);
  }
}
customElements.define('thermosmart-card-editor', ThermosmartCardEditor);


// ── Haupt-Card ────────────────────────────────────────────────────────────────
class ThermosmartCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass   = null;
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
    this._render();
  }

  getCardSize() { return this._config.compact ? 2 : 7; }

  // ── Daten aus Climate-Entity ─────────────────────────────────────────────

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

    // "ThermoSmart – Badezimmer" → "Badezimmer"
    const raw = this._config.name || a.friendly_name || this._config.entity;
    const name = raw.replace(/^ThermoSmart\s*[–\-]\s*/i, '');

    return {
      entityId:    this._config.entity,
      name,
      currentTemp: a.current_temperature ?? null,
      targetTemp:  a.temperature ?? null,
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
    if (d.isObs)                          return 'Beobachtung';
    if (d.windowOpen)                     return 'Fenster offen';
    if (d.hvacAction === 'heating')       return 'Heating';
    if (d.hvacAction === 'idle')          return 'Idle';
    return 'Off';
  }

  // ── SVG Arc (nur Ring, kein Text) ────────────────────────────────────────

  _buildRing(d) {
    // viewBox 280×235 — CX=140, CY=118, R=95, 240° Bogen
    const CX = 140, CY = 118, R = 95;
    const AF = 240, AS = 240;
    const MIN_T = this._config.min_temp ?? 15;
    const MAX_T = this._config.max_temp ?? 30;
    const frac  = t => Math.max(0, Math.min(1, (t - MIN_T) / (MAX_T - MIN_T)));

    const arcInactive = (d.isObs || d.hvacMode === 'off');
    const fillColor   = arcInactive ? '#383838' : d.col.main;

    // Fill-Bogen (Ist-Temperatur)
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

    // Ziel-Punkt
    let dotSvg = '';
    if (d.targetTemp != null) {
      const p = polarToXY(CX, CY, R, AF + frac(d.targetTemp) * AS);
      dotSvg = `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7"
        fill="#1c1c1e" stroke="${d.col.main}" stroke-width="2.5"/>`;
    }

    return `
      <svg viewBox="0 0 280 235" style="width:100%;max-width:290px;display:block;margin:0 auto;overflow:visible">
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
      </svg>`;
  }

  // ── HTML-Overlay: Temperatur-Anzeige im Ring ─────────────────────────────

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
        ${d.targetTemp != null ? `<div class="ov-target">→ ${d.targetTemp.toFixed(1)}° Ziel</div>` : ''}
      </div>`;
  }

  // ── Mode-Buttons ─────────────────────────────────────────────────────────

  _buildModes(d) {
    return `<div class="modes">${MODES.map(m => {
      const active = m.preset === d.preset;
      return `<button class="mode-btn${active ? ' active' : ''}" data-preset="${m.preset}"
        title="${m.preset}" style="${active ? `--mc:${d.col.main};--mt:${d.col.text}` : ''}">
        <ha-icon icon="${m.icon}"></ha-icon>
      </button>`;
    }).join('')}</div>`;
  }

  // ── Info-Chips ────────────────────────────────────────────────────────────

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

  // ── Konfidenz-Balken ──────────────────────────────────────────────────────

  _buildConf(d) {
    const pct = Math.min(100, Math.max(0, d.confidence)).toFixed(0);
    const lbl = d.confidence >= 80 ? 'Zuverlässig' : d.confidence >= 50 ? 'Lernend' : 'Sammle Daten';
    const bar = d.stateKey === 'off' ? '#4fc3f7' : d.col.main;
    return `<div class="conf-row">
      <ha-icon icon="mdi:brain" style="--mdc-icon-size:13px;opacity:.45"></ha-icon>
      <span class="conf-lbl">${lbl}</span>
      <div class="conf-bg"><div class="conf-fill" style="width:${pct}%;background:${bar}"></div></div>
      <span class="conf-pct">${pct}%</span>
    </div>`;
  }

  // ── Normal-Ansicht ────────────────────────────────────────────────────────

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

        <div class="ctrl-row">
          <button class="ctrl-btn" data-action="dec"><ha-icon icon="mdi:minus"></ha-icon></button>
          <span class="ctrl-val">${d.targetTemp != null ? d.targetTemp.toFixed(1) : '--'}</span>
          <button class="ctrl-btn" data-action="inc"><ha-icon icon="mdi:plus"></ha-icon></button>
          <button class="ctrl-btn sm" data-action="schedule"><ha-icon icon="mdi:calendar-clock"></ha-icon></button>
          <button class="ctrl-btn sm${d.isObs ? ' pwr-off' : ''}" data-action="power">
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>

        ${this._buildModes(d)}
        ${this._buildChips(d)}
        ${this._buildConf(d)}
      </ha-card>`;
  }

  // ── Kompakt-Ansicht ───────────────────────────────────────────────────────

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
        <div class="conf-bg" style="height:3px"><div class="conf-fill" style="width:${pct}%;background:${d.col.main}"></div></div>
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
    const d = this._getData();
    if (!d) {
      this.shadowRoot.innerHTML = `${this._css()}
        <ha-card class="dark" style="padding:16px;color:#e57373;font-size:.85em">
          Entity nicht gefunden: <b>${this._config?.entity || '?'}</b>
        </ha-card>`;
      return;
    }

    const body = this._config.compact ? this._renderCompact(d) : this._renderNormal(d);
    this.shadowRoot.innerHTML = this._css() + body;

    // Mode-Buttons
    this.shadowRoot.querySelectorAll('.mode-btn').forEach(btn =>
      btn.addEventListener('click', () =>
        this._hass.callService('climate', 'set_preset_mode', {
          entity_id: d.entityId, preset_mode: btn.dataset.preset,
        })
      )
    );

    // Steuerungs-Buttons
    this.shadowRoot.querySelectorAll('.ctrl-btn[data-action]').forEach(btn =>
      btn.addEventListener('click', () => {
        const act = btn.dataset.action;
        if (act === 'inc' || act === 'dec') {
          const t = Math.max(5, Math.min(30, (d.targetTemp ?? 20) + (act === 'inc' ? 0.5 : -0.5)));
          this._hass.callService('climate', 'set_temperature', { entity_id: d.entityId, temperature: t });
        } else if (act === 'power') {
          this._hass.callService('climate', 'set_hvac_mode', {
            entity_id: d.entityId, hvac_mode: d.isObs ? 'heat' : 'off',
          });
        }
      })
    );
  }
}

customElements.define('thermosmart-card', ThermosmartCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'thermosmart-card',
  name: 'ThermoSmart Card',
  description: 'KI-gestützte Heizungskarte für ThermoSmart – Boost, Eco, Diagnose & mehr',
  preview: true,
  documentationURL: 'https://github.com/Mikasmarthome/thermosmart-card',
});

console.info(
  `%c THERMOSMART-CARD %c v${CARD_VERSION} `,
  'background:#e8573f;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:bold;font-size:11px',
  'background:#2a2a2a;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0;font-size:11px',
);
