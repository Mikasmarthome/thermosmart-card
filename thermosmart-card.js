/**
 * ThermoSmart Lovelace Card
 * https://github.com/Mikasmarthome/thermosmart-card
 *
 * Zeigt eine einzelne ThermoSmart-Zone: Temperatur-Ring, Moduswahl,
 * Wetterkorrektur, Lernkonfidenz und TRV-Boost auf einen Blick.
 *
 * Konfiguration (minimal):
 *   type: custom:thermosmart-card
 *   entity: climate.thermosmart_wohnzimmer
 *
 * Optionale Felder:
 *   name: Wohnzimmer          # überschreibt Entitätsname
 *   compact: true             # kompakte 2-Zeilen Ansicht
 *   min_temp: 15              # Skalierung Temperaturring (Standard: 15)
 *   max_temp: 30              # Skalierung Temperaturring (Standard: 30)
 */

const CARD_VERSION = '1.0.0';

// Heizmodi: preset_mode Werte aus ThermoSmart integration
const MODES = [
  { preset: 'Auto',     label: 'Auto',    icon: 'mdi:home-thermometer-outline' },
  { preset: 'Komfort',  label: 'Komfort', icon: 'mdi:sun-thermometer-outline'  },
  { preset: 'Nacht',    label: 'Nacht',   icon: 'mdi:weather-night'            },
  { preset: 'Abwesend', label: 'Weg',     icon: 'mdi:walk'                     },
  { preset: 'Urlaub',   label: 'Urlaub',  icon: 'mdi:airplane'                 },
];

// SVG-Hilfsfunktionen für den Temperaturring
function polarToXY(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Zeichnet einen SVG-Arc (clockwise) von fromDeg über sweepDeg Grad
function arcPath(cx, cy, r, fromDeg, sweepDeg) {
  if (sweepDeg < 0.5) return '';
  const s = polarToXY(cx, cy, r, fromDeg);
  const e = polarToXY(cx, cy, r, fromDeg + sweepDeg);
  const large = sweepDeg > 180 ? 1 : 0;
  return [
    `M ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,
    `A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`,
  ].join(' ');
}


// ── Haupt-Card ───────────────────────────────────────────────────────────────

class ThermosmartCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
  }

  static getStubConfig() {
    return { entity: 'climate.thermosmart_zone' };
  }

  setConfig(config) {
    if (!config.entity) throw new Error('ThermoSmart Card: Pflichtfeld "entity" fehlt.');
    this._config = config;
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  getCardSize() {
    return this._config.compact ? 2 : 7;
  }

  // ── Daten aus der Climate-Entity lesen ───────────────────────────────────

  _getData() {
    if (!this._hass || !this._config.entity) return null;
    const state = this._hass.states[this._config.entity];
    if (!state) return null;

    const a = state.attributes;

    const parseNum = (str, fallback = null) => {
      if (str == null) return fallback;
      const n = parseFloat(String(str).replace(/[^0-9.+-]/g, ''));
      return isNaN(n) ? fallback : n;
    };

    const confidence  = parseNum(a.vorhersage_konfidenz, 0);
    const preheat     = parseNum(a.vorheizzeit, 0);
    const weatherOff  = parseNum(a.wetterkorrektur, null);
    const suppression = parseNum(a.vorhersage_unterdrückung, 0);
    const boostDelta  = parseNum(a.boost_delta, 0);
    const trvSetpoint = parseNum(a.trv_setpoint, null);
    const boostFactor = parseNum(a.boost_faktor, 1.0);

    return {
      entityId:    this._config.entity,
      name:        this._config.name || a.friendly_name || this._config.entity,
      currentTemp: a.current_temperature ?? null,
      targetTemp:  a.temperature ?? null,
      hvacAction:  a.hvac_action || 'off',    // 'heating' | 'idle' | 'off'
      hvacMode:    state.state,               // 'heat' | 'off'
      preset:      a.preset_mode || 'Auto',
      outdoorTemp: parseNum(a.außentemperatur, null),
      weatherOff,
      confidence,
      preheat,
      trvSetpoint,
      boostDelta,
      boostFactor,
      suppression,
      isObs:       a.beobachtungsmodus === true,
    };
  }

  // ── Farb- und Text-Hilfsmethoden ────────────────────────────────────────

  _statusText(d) {
    if (d.isObs)                    return 'Beobachtung';
    if (d.hvacAction === 'heating') return 'Heizt';
    if (d.hvacAction === 'idle')    return 'Hält Temp';
    return 'Aus';
  }

  _statusColor(d) {
    if (d.isObs)                    return 'var(--warning-color, #ff9800)';
    if (d.hvacAction === 'heating') return 'var(--error-color, #ff6b35)';
    if (d.hvacAction === 'idle')    return 'var(--success-color, #4caf50)';
    return 'var(--disabled-text-color, #9e9e9e)';
  }

  _arcColor(d) {
    if (d.isObs || d.hvacMode === 'off') return 'var(--disabled-text-color, #bdbdbd)';
    if (d.hvacAction === 'heating')      return 'var(--error-color, #ff6b35)';
    return 'var(--success-color, #4caf50)';
  }

  // ── SVG Temperatur-Ring ─────────────────────────────────────────────────

  _buildRing(d) {
    const CX = 100, CY = 112, R = 74;
    const ARC_FROM = 240;   // Start-Winkel (8-Uhr-Position, links-unten)
    const ARC_SWEEP = 240;  // 240° Gesamt-Bogen über den oberen Halbkreis
    const MIN_T = this._config.min_temp ?? 15;
    const MAX_T = this._config.max_temp ?? 30;

    const tempFrac = t => Math.max(0, Math.min(1, (t - MIN_T) / (MAX_T - MIN_T)));

    // Hintergrund-Bogen
    const bgPath = arcPath(CX, CY, R, ARC_FROM, ARC_SWEEP);

    // Füll-Bogen (aktuell gemessene Temperatur)
    let fillSvg = '';
    if (d.currentTemp != null) {
      const sweep = tempFrac(d.currentTemp) * ARC_SWEEP;
      if (sweep > 0.5) {
        fillSvg = `<path d="${arcPath(CX, CY, R, ARC_FROM, sweep)}"
          fill="none" stroke="${this._arcColor(d)}" stroke-width="10" stroke-linecap="round"
          opacity="${d.isObs ? 0.35 : 1}"/>`;
      }
    }

    // Punkt für Zieltemperatur
    let targetSvg = '';
    if (d.targetTemp != null) {
      const angle = ARC_FROM + tempFrac(d.targetTemp) * ARC_SWEEP;
      const p = polarToXY(CX, CY, R, angle);
      targetSvg = `
        <circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="6"
          fill="var(--card-background-color, #fff)" stroke="var(--primary-text-color)" stroke-width="2.5"/>`;
    }

    // Temperatur-Text im Ring
    const currText = d.currentTemp != null
      ? `${d.currentTemp.toFixed(1)}<tspan font-size="18" dy="-8">°C</tspan>`
      : '<tspan font-size="22">--</tspan>';
    const targetText = d.targetTemp != null
      ? `→ ${d.targetTemp.toFixed(1)}° Ziel`
      : '';

    return `
      <svg viewBox="0 0 200 200" width="190" height="190" style="overflow:visible">
        <path d="${bgPath}"
          fill="none" stroke="var(--secondary-background-color, #ececec)" stroke-width="10" stroke-linecap="round"/>
        ${fillSvg}
        ${targetSvg}
        <text x="${CX}" y="${CY - 8}" text-anchor="middle"
          font-size="42" font-weight="300" fill="var(--primary-text-color)">${currText}</text>
        <text x="${CX}" y="${CY + 22}" text-anchor="middle"
          font-size="14" fill="var(--secondary-text-color)">${targetText}</text>
      </svg>`;
  }

  // ── Modus-Buttons ────────────────────────────────────────────────────────

  _buildModes(d) {
    return MODES.map(m => {
      const active = m.preset === d.preset;
      return `<button class="mode-btn${active ? ' active' : ''}" data-preset="${m.preset}" title="${m.preset}">
        <ha-icon icon="${m.icon}"></ha-icon>
        <span>${m.label}</span>
      </button>`;
    }).join('');
  }

  // ── Info-Chips ───────────────────────────────────────────────────────────

  _buildChips(d) {
    const chips = [];

    if (d.outdoorTemp != null) {
      chips.push(`<span class="chip">🌡️ ${d.outdoorTemp > 0 ? '+' : ''}${d.outdoorTemp.toFixed(1)}°C außen</span>`);
    }

    if (d.weatherOff != null && Math.abs(d.weatherOff) >= 0.1) {
      const sign = d.weatherOff > 0 ? '+' : '';
      const cls = d.weatherOff > 0 ? ' pos' : ' neg';
      chips.push(`<span class="chip${cls}">💨 ${sign}${d.weatherOff.toFixed(1)}°C Wetter</span>`);
    }

    if (d.boostDelta > 0.05 && d.trvSetpoint != null) {
      chips.push(`<span class="chip warn">↑ ${d.trvSetpoint.toFixed(1)}°C TRV (×${d.boostFactor.toFixed(2)})</span>`);
    }

    if (d.suppression > 0) {
      chips.push(`<span class="chip info">🌤️ −${d.suppression}% Prognose</span>`);
    }

    return chips.length > 0
      ? `<div class="chips">${chips.join('')}</div>`
      : '';
  }

  // ── Konfidenz-Balken ─────────────────────────────────────────────────────

  _buildConfidence(d) {
    const pct = Math.min(100, Math.max(0, d.confidence)).toFixed(0);
    let label = 'Sammle Daten';
    if (d.confidence >= 80) label = 'Hohe Zuverlässigkeit';
    else if (d.confidence >= 50) label = 'Wird zuverlässiger';
    else if (d.confidence >= 25) label = 'Erste Muster';

    return `
      <div class="conf-row">
        <ha-icon icon="mdi:brain" style="--mdc-icon-size:14px;color:var(--secondary-text-color)"></ha-icon>
        <span class="conf-label">${label}</span>
        <div class="conf-bg"><div class="conf-fill" style="width:${pct}%"></div></div>
        <span class="conf-pct">${pct}%</span>
      </div>`;
  }

  // ── Kompakt-Ansicht ─────────────────────────────────────────────────────

  _renderCompact(d) {
    const statusCol = this._statusColor(d);
    const currStr = d.currentTemp != null ? `${d.currentTemp.toFixed(1)}°` : '--';
    const targStr = d.targetTemp != null ? `→ ${d.targetTemp.toFixed(1)}°` : '';
    const pct = Math.min(100, Math.max(0, d.confidence)).toFixed(0);

    return `
      <ha-card>
        <div class="compact-row">
          <ha-icon icon="mdi:home-thermometer-outline" style="--mdc-icon-size:22px;color:${statusCol}"></ha-icon>
          <span class="compact-name">${d.name}</span>
          <span class="compact-temp">${currStr}</span>
          <span class="compact-target">${targStr}</span>
          <span class="compact-pill" style="background:${statusCol}22;color:${statusCol}">${this._statusText(d)}</span>
        </div>
        <div class="compact-bottom">
          <span class="conf-label-sm">${d.preset}</span>
          ${d.preheat > 0 ? `<span class="chip-sm warn">⏱ ${d.preheat} min</span>` : ''}
          ${d.outdoorTemp != null ? `<span class="chip-sm">🌡️ ${d.outdoorTemp.toFixed(1)}°C</span>` : ''}
          <div style="flex:1"></div>
          <div class="conf-bg-sm"><div class="conf-fill" style="width:${pct}%"></div></div>
          <span class="conf-pct">${pct}%</span>
        </div>
      </ha-card>`;
  }

  // ── Normaler Render ──────────────────────────────────────────────────────

  _renderNormal(d) {
    const statusCol = this._statusColor(d);

    return `
      <ha-card>
        <div class="header">
          <span class="name">${d.name}</span>
          <span class="status-pill" style="background:${statusCol}1a;color:${statusCol}">
            <span class="dot" style="background:${statusCol}"></span>
            ${this._statusText(d)}
          </span>
        </div>

        ${d.isObs ? `
          <div class="obs-banner">
            <ha-icon icon="mdi:eye-outline" style="--mdc-icon-size:16px"></ha-icon>
            Beobachtungsmodus – Aktive Steuerung deaktiviert
          </div>` : ''}

        <div class="ring-wrap">
          ${this._buildRing(d)}
        </div>

        ${d.preheat > 0 ? `<div class="preheat">⏱ ${d.preheat} min Vorheizung aktiv</div>` : '<div class="preheat"></div>'}

        <div class="modes">
          ${this._buildModes(d)}
        </div>

        ${this._buildChips(d)}
        ${this._buildConfidence(d)}
      </ha-card>`;
  }

  // ── CSS ──────────────────────────────────────────────────────────────────

  _styles(d) {
    return `
      <style>
        :host { display: block; }
        ha-card { padding: 14px 16px 14px; box-sizing: border-box; }

        /* ── Header ── */
        .header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 6px;
        }
        .name {
          font-size: 1.05em; font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .status-pill {
          display: flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 12px;
          font-size: 0.76em; font-weight: 600; white-space: nowrap; flex-shrink: 0;
        }
        .dot { width: 7px; height: 7px; border-radius: 50%; }

        /* ── Observation Banner ── */
        .obs-banner {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px; border-radius: 8px; margin-bottom: 8px;
          background: var(--warning-color, #ff9800)18;
          border: 1px solid var(--warning-color, #ff9800)44;
          color: var(--warning-color, #ff9800);
          font-size: 0.78em;
        }

        /* ── Ring ── */
        .ring-wrap {
          display: flex; justify-content: center;
          margin: 0 0 2px;
        }

        /* ── Vorheizzeit ── */
        .preheat {
          text-align: center; min-height: 20px;
          font-size: 0.78em; color: var(--warning-color, #ff9800);
          margin-bottom: 8px;
        }

        /* ── Modus-Buttons ── */
        .modes {
          display: flex; gap: 5px; margin-bottom: 12px;
        }
        .mode-btn {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 8px 2px; border: none; border-radius: 10px; cursor: pointer;
          background: var(--secondary-background-color, #f0f0f0);
          color: var(--secondary-text-color);
          font-size: 0.65em; font-family: inherit;
          transition: background 0.18s, color 0.18s;
          --mdc-icon-size: 19px;
        }
        .mode-btn.active {
          background: var(--primary-color, #03a9f4);
          color: var(--text-primary-color, #fff);
        }
        .mode-btn:hover:not(.active) {
          background: var(--primary-color, #03a9f4)22;
          color: var(--primary-color, #03a9f4);
        }

        /* ── Info-Chips ── */
        .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
        .chip {
          padding: 3px 9px; border-radius: 10px;
          font-size: 0.74em;
          background: var(--secondary-background-color, #f0f0f0);
          color: var(--secondary-text-color);
        }
        .chip.pos { color: var(--success-color, #4caf50); }
        .chip.neg { color: var(--error-color, #f44336); }
        .chip.warn { color: var(--warning-color, #ff9800); }
        .chip.info { color: var(--info-color, #2196f3); }

        /* ── Konfidenz-Balken ── */
        .conf-row {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.74em; color: var(--secondary-text-color);
        }
        .conf-label { flex-shrink: 0; }
        .conf-bg {
          flex: 1; height: 5px; border-radius: 3px;
          background: var(--secondary-background-color, #e0e0e0);
          overflow: hidden;
        }
        .conf-fill {
          height: 100%; border-radius: 3px;
          background: var(--primary-color, #03a9f4);
          transition: width 0.6s ease;
        }
        .conf-pct { flex-shrink: 0; min-width: 28px; text-align: right; }

        /* ── Kompakt ── */
        .compact-row {
          display: flex; align-items: center; gap: 8px;
          padding: 2px 0 6px;
        }
        .compact-name {
          font-weight: 500; font-size: 0.95em; flex: 1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .compact-temp { font-size: 1.2em; font-weight: 300; color: var(--primary-text-color); }
        .compact-target { font-size: 0.82em; color: var(--secondary-text-color); }
        .compact-pill {
          padding: 2px 8px; border-radius: 10px;
          font-size: 0.73em; font-weight: 600; white-space: nowrap; flex-shrink: 0;
        }
        .compact-bottom {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.74em; color: var(--secondary-text-color);
        }
        .conf-label-sm { flex-shrink: 0; }
        .chip-sm {
          padding: 2px 7px; border-radius: 8px; font-size: 0.9em;
          background: var(--secondary-background-color);
          color: var(--secondary-text-color);
        }
        .chip-sm.warn { color: var(--warning-color, #ff9800); }
        .conf-bg-sm {
          width: 60px; height: 4px; border-radius: 2px;
          background: var(--secondary-background-color); overflow: hidden;
        }
      </style>`;
  }

  // ── Update ───────────────────────────────────────────────────────────────

  _update() {
    const d = this._getData();

    if (!d) {
      this.shadowRoot.innerHTML = `
        <ha-card>
          <div style="padding:16px;color:var(--error-color,#f44336);font-size:0.9em">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            Entity nicht gefunden: <b>${this._config?.entity || '?'}</b>
          </div>
        </ha-card>`;
      return;
    }

    const body = this._config.compact ? this._renderCompact(d) : this._renderNormal(d);
    this.shadowRoot.innerHTML = this._styles(d) + body;

    // Mode-Button Events
    this.shadowRoot.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._hass.callService('climate', 'set_preset_mode', {
          entity_id: d.entityId,
          preset_mode: btn.dataset.preset,
        });
      });
    });
  }
}

customElements.define('thermosmart-card', ThermosmartCard);


// ── HACS & HA Card-Registry ──────────────────────────────────────────────────

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'thermosmart-card',
  name: 'ThermoSmart Card',
  description: 'Dashboard-Karte für die ThermoSmart Heizungssteuerung – zeigt Ist/Ziel-Temperatur, Heizmodus, Wetterkorrektur und Lernkonfidenz.',
  preview: true,
  documentationURL: 'https://github.com/Mikasmarthome/thermosmart-card',
});

console.info(
  `%c THERMOSMART-CARD %c v${CARD_VERSION} `,
  'background:#2196f3;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:bold;font-size:11px',
  'background:#444;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0;font-size:11px',
);
