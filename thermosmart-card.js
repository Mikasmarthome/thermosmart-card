/**
 * ThermoSmart Lovelace Card
 * https://github.com/Mikasmarthome/thermosmart-card
 *
 * Minimal config:
 *   type: custom:thermosmart-card
 *   entity: climate.thermosmart_wohnzimmer
 *
 * Optional:
 *   name: Wohnzimmer
 *   compact: true
 *   min_temp: 15
 *   max_temp: 30
 */

const CARD_VERSION = '0.0.1b1';

const MODES = [
  { preset: 'Auto',     label: 'Auto',    icon: 'mdi:home-thermometer-outline' },
  { preset: 'Komfort',  label: 'Komfort', icon: 'mdi:sun-thermometer-outline'  },
  { preset: 'Nacht',    label: 'Nacht',   icon: 'mdi:weather-night'            },
  { preset: 'Abwesend', label: 'Weg',     icon: 'mdi:walk'                     },
  { preset: 'Urlaub',   label: 'Urlaub',  icon: 'mdi:airplane'                 },
];

// SVG arc helpers
function polarToXY(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx, cy, r, fromDeg, sweepDeg) {
  if (sweepDeg < 0.5) return '';
  const s = polarToXY(cx, cy, r, fromDeg);
  const e = polarToXY(cx, cy, r, fromDeg + sweepDeg);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

// State colours – matching BT card palette
const STATE_COLORS = {
  heating: { main: '#e8573f', glow: 'rgba(232,87,63,0.22)', text: '#ff8a70' },
  idle:    { main: '#4caf50', glow: 'rgba(76,175,80,0.18)',  text: '#81c784' },
  window:  { main: '#2196f3', glow: 'rgba(33,150,243,0.20)', text: '#64b5f6' },
  obs:     { main: '#ff9800', glow: 'rgba(255,152,0,0.18)',  text: '#ffb74d' },
  off:     { main: '#555',    glow: 'rgba(80,80,80,0.12)',   text: '#888'    },
};

class ThermosmartCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass   = null;
  }

  static getStubConfig() {
    return { entity: 'climate.thermosmart_zone' };
  }

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

  // ── data ────────────────────────────────────────────────────────────────

  _getData() {
    if (!this._hass || !this._config.entity) return null;
    const st = this._hass.states[this._config.entity];
    if (!st) return null;
    const a = st.attributes;

    const num = (v, fb = null) => {
      const n = parseFloat(String(v ?? '').replace(/[^0-9.+-]/g, ''));
      return isNaN(n) ? fb : n;
    };

    const windowOpen  = a.fenster_offen === true;
    const isObs       = a.beobachtungsmodus === true;
    const hvacAction  = a.hvac_action || 'off';

    let stateKey = 'off';
    if (isObs)                   stateKey = 'obs';
    else if (windowOpen)         stateKey = 'window';
    else if (hvacAction === 'heating') stateKey = 'heating';
    else if (hvacAction === 'idle')    stateKey = 'idle';

    return {
      entityId:    this._config.entity,
      name:        this._config.name || a.friendly_name || this._config.entity,
      currentTemp: a.current_temperature ?? null,
      targetTemp:  a.temperature ?? null,
      hvacMode:    st.state,
      hvacAction,
      preset:      a.preset_mode || 'Auto',
      windowOpen,
      isObs,
      stateKey,
      colors:      STATE_COLORS[stateKey],
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
    if (d.isObs)      return 'Beobachtung';
    if (d.windowOpen) return 'Fenster offen';
    if (d.hvacAction === 'heating') return 'Heating';
    if (d.hvacAction === 'idle')    return 'Idle';
    return 'Off';
  }

  // ── SVG ring ─────────────────────────────────────────────────────────────

  _buildRing(d) {
    const CX = 130, CY = 130, R = 100;
    const ARC_FROM  = 144;   // ~8-Uhr
    const ARC_SWEEP = 252;   // 252° über den oberen Halbkreis
    const MIN_T = this._config.min_temp ?? 15;
    const MAX_T = this._config.max_temp ?? 30;
    const frac  = t => Math.max(0, Math.min(1, (t - MIN_T) / (MAX_T - MIN_T)));

    const bgPath   = arcPath(CX, CY, R, ARC_FROM, ARC_SWEEP);
    const innerR   = R - 16;
    const innerBg  = arcPath(CX, CY, innerR, ARC_FROM, ARC_SWEEP);

    // Fill arc (current temp)
    let fillArc = '';
    if (d.currentTemp != null) {
      const sweep = frac(d.currentTemp) * ARC_SWEEP;
      if (sweep > 0.5)
        fillArc = `<path d="${arcPath(CX, CY, R, ARC_FROM, sweep)}"
          fill="none" stroke="${d.colors.main}" stroke-width="18" stroke-linecap="round"
          opacity="${d.isObs ? 0.4 : 1}"/>
          <path d="${arcPath(CX, CY, innerR, ARC_FROM, sweep)}"
          fill="none" stroke="${d.colors.main}" stroke-width="4" stroke-linecap="round"
          opacity="0.3"/>`;
    }

    // Target dot
    let targetDot = '';
    if (d.targetTemp != null) {
      const angle = ARC_FROM + frac(d.targetTemp) * ARC_SWEEP;
      const p     = polarToXY(CX, CY, R, angle);
      targetDot   = `
        <circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="9"
          fill="#1c1c1e" stroke="${d.targetTemp > (d.currentTemp ?? 0) ? d.colors.main : '#aaa'}"
          stroke-width="3"/>`;
    }

    // Status icon inside ring (window / obs / etc.)
    let statusIcon = '';
    if (d.windowOpen)
      statusIcon = `<text x="${CX}" y="${CY - 42}" text-anchor="middle" font-size="20">🪟</text>`;
    else if (d.isObs)
      statusIcon = `<text x="${CX}" y="${CY - 42}" text-anchor="middle" font-size="20">👁</text>`;

    // Current temp – large split: integer / decimal
    let tempSvg = `<text x="${CX}" y="${CY + 18}" text-anchor="middle" fill="#fff"
      font-size="14" opacity="0.5">--</text>`;
    if (d.currentTemp != null) {
      const [intPart, decPart] = d.currentTemp.toFixed(1).split('.');
      tempSvg = `
        <text text-anchor="middle" fill="#fff" font-weight="200">
          <tspan x="${CX - 6}" y="${CY + 20}" font-size="62">${intPart}</tspan><tspan font-size="28" dy="-24">.${decPart}</tspan><tspan font-size="18" dy="-4">°C</tspan>
        </text>`;
    }

    // Status label
    const statusLabel = `<text x="${CX}" y="${CY - 20}" text-anchor="middle"
      font-size="15" font-weight="600" fill="${d.colors.text}">${this._statusLabel(d)}</text>`;

    // Outdoor temp + confidence row inside ring
    const infoY = CY + 50;
    let infoRow = '';
    if (d.outdoorTemp != null) {
      infoRow += `<text x="${CX - 22}" y="${infoY}" text-anchor="middle" font-size="13" fill="#aaa">🌡️</text>
        <text x="${CX + 4}" y="${infoY}" font-size="13" fill="#ccc">${d.outdoorTemp.toFixed(1)}°</text>`;
    }

    return `
      <svg viewBox="0 0 260 220" width="100%" style="max-width:300px;display:block;margin:0 auto">
        <!-- background glow -->
        <radialGradient id="glow_${d.stateKey}" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="${d.colors.main}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${d.colors.main}" stop-opacity="0"/>
        </radialGradient>
        <circle cx="${CX}" cy="${CY}" r="105" fill="url(#glow_${d.stateKey})"/>

        <!-- arc tracks -->
        <path d="${bgPath}"   fill="none" stroke="#2a2a2a" stroke-width="18" stroke-linecap="round"/>
        <path d="${innerBg}"  fill="none" stroke="#222"    stroke-width="4"  stroke-linecap="round"/>

        <!-- fill -->
        ${fillArc}

        <!-- target dot -->
        ${targetDot}

        <!-- ring content -->
        ${statusIcon}
        ${statusLabel}
        ${tempSvg}
        ${infoRow}
      </svg>`;
  }

  // ── mode buttons ─────────────────────────────────────────────────────────

  _buildModes(d) {
    return `<div class="modes">
      ${MODES.map(m => {
        const active = m.preset === d.preset;
        return `<button class="mode-btn${active ? ' active' : ''}" data-preset="${m.preset}" title="${m.preset}"
          style="${active ? `--btn-bg:${d.colors.main}33;--btn-color:${d.colors.text}` : ''}">
          <ha-icon icon="${m.icon}"></ha-icon>
        </button>`;
      }).join('')}
    </div>`;
  }

  // ── temp controls (–  value  +) ──────────────────────────────────────────

  _buildTempControls(d) {
    const val = d.targetTemp != null ? d.targetTemp.toFixed(1) : '--';
    return `
      <div class="temp-controls">
        <button class="ctrl-btn" data-action="dec" title="−0.5°C">
          <ha-icon icon="mdi:minus"></ha-icon>
        </button>
        <span class="ctrl-val">${val}</span>
        <button class="ctrl-btn" data-action="inc" title="+0.5°C">
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
        <button class="ctrl-btn sm" data-action="schedule" title="Zeitplan">
          <ha-icon icon="mdi:calendar-clock"></ha-icon>
        </button>
        <button class="ctrl-btn sm${d.hvacMode === 'off' ? ' off' : ''}" data-action="power" title="Ein/Aus">
          <ha-icon icon="mdi:power"></ha-icon>
        </button>
      </div>`;
  }

  // ── info chips below ring ─────────────────────────────────────────────────

  _buildInfo(d) {
    const chips = [];
    if (d.weatherOff != null && Math.abs(d.weatherOff) >= 0.1) {
      const sign = d.weatherOff > 0 ? '+' : '';
      chips.push(`<span class="chip ${d.weatherOff > 0 ? 'pos' : 'neg'}">💨 ${sign}${d.weatherOff.toFixed(1)}°</span>`);
    }
    if (d.boostDelta > 0.05 && d.trvSetpoint != null)
      chips.push(`<span class="chip warn">↑ ${d.trvSetpoint.toFixed(1)}° TRV</span>`);
    if (d.suppression > 0)
      chips.push(`<span class="chip info">🌤️ −${d.suppression}%</span>`);
    if (d.preheat > 0)
      chips.push(`<span class="chip warn">⏱ ${d.preheat} min</span>`);

    const confPct = Math.min(100, Math.max(0, d.confidence)).toFixed(0);
    const confLabel = d.confidence >= 80 ? 'Zuverlässig' : d.confidence >= 50 ? 'Lernend' : 'Sammle Daten';

    return `
      ${chips.length ? `<div class="chips">${chips.join('')}</div>` : ''}
      <div class="conf-row">
        <ha-icon icon="mdi:brain" style="--mdc-icon-size:13px;opacity:.6"></ha-icon>
        <span class="conf-lbl">${confLabel}</span>
        <div class="conf-bg"><div class="conf-fill" style="width:${confPct}%"></div></div>
        <span class="conf-pct">${confPct}%</span>
      </div>`;
  }

  // ── compact ──────────────────────────────────────────────────────────────

  _renderCompact(d) {
    const val   = d.currentTemp != null ? `${d.currentTemp.toFixed(1)}°` : '--';
    const tgt   = d.targetTemp  != null ? `→ ${d.targetTemp.toFixed(1)}°` : '';
    const pct   = Math.min(100, Math.max(0, d.confidence)).toFixed(0);
    const c     = d.colors;

    return `
      <ha-card class="dark">
        <div class="compact-row">
          <div class="compact-icon" style="background:${c.main}22;border-color:${c.main}55">
            <ha-icon icon="mdi:home-thermometer" style="color:${c.main};--mdc-icon-size:20px"></ha-icon>
          </div>
          <div class="compact-info">
            <div class="compact-name">${d.name}</div>
            <div class="compact-sub">${this._statusLabel(d)} · ${d.outdoorTemp != null ? d.outdoorTemp.toFixed(1) + '°C' : ''}</div>
          </div>
          <div class="compact-temps">
            <span class="compact-curr">${val}</span>
            <span class="compact-tgt">${tgt}</span>
          </div>
          <div class="compact-mode-icons">
            ${MODES.map(m => `<ha-icon icon="${m.icon}"
              style="--mdc-icon-size:16px;opacity:${m.preset===d.preset?1:0.25};color:${m.preset===d.preset?c.main:'#fff'}"></ha-icon>`).join('')}
          </div>
        </div>
        <div class="compact-bottom">
          <div class="conf-bg" style="height:3px"><div class="conf-fill" style="width:${pct}%;background:${c.main}"></div></div>
        </div>
      </ha-card>`;
  }

  // ── normal ───────────────────────────────────────────────────────────────

  _renderNormal(d) {
    return `
      <ha-card class="dark">
        <div class="card-header">
          <span class="zone-name">${d.name}</span>
          ${d.outdoorTemp != null ? `<span class="outdoor-badge">🌡️ ${d.outdoorTemp.toFixed(1)}°C</span>` : ''}
        </div>

        <div class="ring-wrap">
          ${this._buildRing(d)}
        </div>

        ${this._buildTempControls(d)}
        ${this._buildModes(d)}
        ${this._buildInfo(d)}
      </ha-card>`;
  }

  // ── CSS ──────────────────────────────────────────────────────────────────

  _styles() {
    return `<style>
      :host { display: block; }

      ha-card.dark {
        background: #1c1c1e;
        color: #fff;
        padding: 14px 14px 12px;
        box-sizing: border-box;
      }

      /* Header */
      .card-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 4px;
      }
      .zone-name {
        font-size: 1em; font-weight: 500; color: #ccc;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .outdoor-badge {
        font-size: 0.78em; color: #888;
        background: #2a2a2a; padding: 2px 8px; border-radius: 9px;
        flex-shrink: 0;
      }

      /* Ring */
      .ring-wrap { margin: 0 0 4px; }

      /* Temp controls */
      .temp-controls {
        display: flex; align-items: center; justify-content: center;
        gap: 8px; margin: 2px 0 12px;
      }
      .ctrl-btn {
        display: flex; align-items: center; justify-content: center;
        width: 38px; height: 38px; border-radius: 50%; border: none;
        background: #2a2a2a; color: #ccc; cursor: pointer;
        transition: background 0.15s;
        --mdc-icon-size: 20px;
      }
      .ctrl-btn:hover { background: #3a3a3a; }
      .ctrl-btn.sm { width: 32px; height: 32px; --mdc-icon-size: 17px; }
      .ctrl-btn.off { color: #e8573f; }
      .ctrl-val {
        font-size: 1.5em; font-weight: 300; color: #fff;
        min-width: 64px; text-align: center;
      }

      /* Mode buttons */
      .modes {
        display: flex; gap: 6px; margin-bottom: 10px;
        justify-content: center;
      }
      .mode-btn {
        flex: 1; display: flex; align-items: center; justify-content: center;
        height: 38px; border: none; border-radius: 10px; cursor: pointer;
        background: var(--btn-bg, #2a2a2a);
        color: var(--btn-color, #666);
        transition: background 0.15s, color 0.15s;
        --mdc-icon-size: 20px;
      }
      .mode-btn.active {
        background: var(--btn-bg, #e8573f33);
        color: var(--btn-color, #ff8a70);
      }
      .mode-btn:hover:not(.active) { background: #333; color: #aaa; }

      /* Info chips */
      .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
      .chip {
        padding: 3px 9px; border-radius: 9px; font-size: 0.73em;
        background: #2a2a2a; color: #888;
      }
      .chip.pos  { color: #81c784; }
      .chip.neg  { color: #e57373; }
      .chip.warn { color: #ffb74d; }
      .chip.info { color: #64b5f6; }

      /* Confidence */
      .conf-row {
        display: flex; align-items: center; gap: 6px;
        font-size: 0.73em; color: #666;
      }
      .conf-lbl { flex-shrink: 0; }
      .conf-bg {
        flex: 1; height: 4px; border-radius: 2px;
        background: #2a2a2a; overflow: hidden;
      }
      .conf-fill {
        height: 100%; border-radius: 2px;
        background: #4fc3f7;
        transition: width 0.6s ease;
      }
      .conf-pct { min-width: 26px; text-align: right; flex-shrink: 0; }

      /* Compact */
      .compact-row {
        display: flex; align-items: center; gap: 10px; padding-bottom: 8px;
      }
      .compact-icon {
        width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        border: 1.5px solid;
      }
      .compact-info { flex: 1; overflow: hidden; }
      .compact-name { font-size: 0.9em; font-weight: 500; color: #ddd; }
      .compact-sub  { font-size: 0.73em; color: #777; margin-top: 1px; }
      .compact-temps { text-align: right; flex-shrink: 0; }
      .compact-curr { font-size: 1.15em; font-weight: 300; color: #fff; }
      .compact-tgt  { font-size: 0.75em; color: #777; margin-left: 4px; }
      .compact-mode-icons {
        display: flex; gap: 3px; flex-shrink: 0;
      }
      .compact-bottom { margin-top: 0; }
    </style>`;
  }

  // ── render ───────────────────────────────────────────────────────────────

  _render() {
    const d = this._getData();

    if (!d) {
      this.shadowRoot.innerHTML = `${this._styles()}
        <ha-card class="dark">
          <div style="padding:16px;color:#e57373;font-size:.85em">
            Entity nicht gefunden: <b>${this._config?.entity || '?'}</b>
          </div>
        </ha-card>`;
      return;
    }

    const body = this._config.compact ? this._renderCompact(d) : this._renderNormal(d);
    this.shadowRoot.innerHTML = this._styles() + body;

    // Mode buttons
    this.shadowRoot.querySelectorAll('.mode-btn').forEach(btn =>
      btn.addEventListener('click', () =>
        this._hass.callService('climate', 'set_preset_mode', {
          entity_id: d.entityId, preset_mode: btn.dataset.preset,
        })
      )
    );

    // Temp +/–/power
    this.shadowRoot.querySelectorAll('.ctrl-btn[data-action]').forEach(btn =>
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'inc' || action === 'dec') {
          const current = d.targetTemp ?? 20;
          const newTemp = action === 'inc' ? current + 0.5 : current - 0.5;
          this._hass.callService('climate', 'set_temperature', {
            entity_id: d.entityId, temperature: Math.max(5, Math.min(30, newTemp)),
          });
        } else if (action === 'power') {
          const newMode = d.hvacMode === 'off' ? 'heat' : 'off';
          this._hass.callService('climate', 'set_hvac_mode', {
            entity_id: d.entityId, hvac_mode: newMode,
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
  description: 'Dashboard card for the ThermoSmart heating integration',
  preview: true,
  documentationURL: 'https://github.com/Mikasmarthome/thermosmart-card',
});

console.info(
  `%c THERMOSMART-CARD %c v${CARD_VERSION} `,
  'background:#e8573f;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:bold;font-size:11px',
  'background:#2a2a2a;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0;font-size:11px',
);
