/**
 * ThermoSmart Lovelace Card v1.0.1-beta.1
 * https://github.com/Mikasmarthome/thermosmart-card
 */
const CARD_VERSION = '1.0.1-beta.2';

// ── i18n ─────────────────────────────────────────────────────────────────────

const I18N = {
  de: {
    heating: 'Heizt', idle: 'Hält Temp', off: 'Aus',
    obs: 'Beobachtung',
    confident: 'Zuverlässig', learning: 'Lernend', collecting: 'Sammle Daten',
    target: 'Ziel',
    battery_low: 'Batterie schwach',
    not_found: 'Entity nicht gefunden',
    chart_ist: 'Ist', chart_soll: 'Soll', chart_aussen: 'Außen',
    learn_active: 'Lernmodus aktiv', learn_inactive: 'Beobachtungsmodus',
    label_entity:   'ThermoSmart Climate-Entity',
    label_name:     'Anzeigename (optional)',
    label_section_display:   'Anzeige',
    label_section_scale:     'Temperaturskala',
    label_section_warnings:  'Warnungen',
    label_compact:  'Kompaktes 2-Zeilen Layout',
    label_disable_humidity: 'Luftfeuchtigkeit ausblenden',
    label_disable_chart:    'Verlaufsdiagramm ausblenden',
    label_disable_modes:    'Modus-Buttons ausblenden',
    label_disable_chips:    'Info-Chips ausblenden',
    label_min_temp: 'Skalenminimum (°C)',
    label_max_temp: 'Skalenmaximum (°C)',
    label_low_battery_threshold: 'Schwellenwert Batteriewarnung (%)',
    label_chart_hours: 'Diagramm-Zeitfenster (Stunden)',
    window_open:      'Fenster offen',
    heating_failure:  'Heizungsausfall erkannt',
    summer_mode:      'Sommermodus – Heizung deaktiviert',
    mode_summer:      'Sommer',
    mode_vacation:    'Urlaub',
  },
  en: {
    heating: 'Heating', idle: 'Idle', off: 'Off',
    obs: 'Observation',
    confident: 'Reliable', learning: 'Learning', collecting: 'Collecting data',
    target: 'Target',
    battery_low: 'Low battery',
    not_found: 'Entity not found',
    chart_ist: 'Actual', chart_soll: 'Target', chart_aussen: 'Outdoor',
    learn_active: 'Learning active', learn_inactive: 'Observation mode',
    label_entity:   'ThermoSmart Climate Entity',
    label_name:     'Display name (optional)',
    label_section_display:   'Display',
    label_section_scale:     'Temperature scale',
    label_section_warnings:  'Warnings',
    label_compact:  'Compact 2-line layout',
    label_disable_humidity: 'Hide humidity',
    label_disable_chart:    'Hide history chart',
    label_disable_modes:    'Hide mode buttons',
    label_disable_chips:    'Hide info chips',
    label_min_temp: 'Scale minimum (°C)',
    label_max_temp: 'Scale maximum (°C)',
    label_low_battery_threshold: 'Low battery threshold (%)',
    label_chart_hours: 'Chart time window (hours)',
    window_open:      'Window open',
    heating_failure:  'Heating failure detected',
    summer_mode:      'Summer mode – heating disabled',
    mode_summer:      'Summer',
    mode_vacation:    'Vacation',
  },
  fr: {
    heating: 'Chauffe', idle: 'Temp atteinte', off: 'Éteint',
    obs: 'Observation',
    confident: 'Fiable', learning: 'Apprentissage', collecting: 'Collecte de données',
    target: 'Cible',
    battery_low: 'Batterie faible',
    not_found: 'Entité introuvable',
    chart_ist: 'Réel', chart_soll: 'Cible', chart_aussen: 'Extérieur',
    learn_active: 'Apprentissage actif', learn_inactive: 'Mode observation',
    label_entity:   'Entité ThermoSmart',
    label_name:     "Nom d'affichage (optionnel)",
    label_section_display:   'Affichage',
    label_section_scale:     "Échelle de température",
    label_section_warnings:  'Avertissements',
    label_compact:  'Disposition compacte',
    label_disable_humidity: "Masquer l'humidité",
    label_disable_chart:    "Masquer le graphique",
    label_disable_modes:    'Masquer les boutons de mode',
    label_disable_chips:    'Masquer les puces info',
    label_min_temp: "Minimum de l'échelle (°C)",
    label_max_temp: "Maximum de l'échelle (°C)",
    label_low_battery_threshold: 'Seuil batterie faible (%)',
    label_chart_hours: 'Fenêtre temporelle du graphique (heures)',
    window_open:      'Fenêtre ouverte',
    heating_failure:  'Défaillance du chauffage',
    summer_mode:      'Mode été – chauffage désactivé',
    mode_summer:      'Été',
    mode_vacation:    'Vacances',
  },
  nl: {
    heating: 'Verwarmt', idle: 'Temp bereikt', off: 'Uit',
    obs: 'Observatie',
    confident: 'Betrouwbaar', learning: 'Lerend', collecting: 'Data verzamelen',
    target: 'Doel',
    battery_low: 'Batterij bijna leeg',
    not_found: 'Entiteit niet gevonden',
    chart_ist: 'Actueel', chart_soll: 'Doel', chart_aussen: 'Buiten',
    learn_active: 'Leermodus actief', learn_inactive: 'Observatiemodus',
    label_entity:   'ThermoSmart klimaatentiteit',
    label_name:     'Weergavenaam (optioneel)',
    label_section_display:   'Weergave',
    label_section_scale:     'Temperatuurschaal',
    label_section_warnings:  'Waarschuwingen',
    label_compact:  'Compacte 2-regelweergave',
    label_disable_humidity: 'Luchtvochtigheid verbergen',
    label_disable_chart:    'Grafiek verbergen',
    label_disable_modes:    'Modusknoppen verbergen',
    label_disable_chips:    'Info-chips verbergen',
    label_min_temp: 'Schaalminimum (°C)',
    label_max_temp: 'Schaalmaximum (°C)',
    label_low_battery_threshold: 'Drempel batterij bijna leeg (%)',
    label_chart_hours: 'Grafiek tijdvenster (uren)',
    window_open:      'Raam open',
    heating_failure:  'Verwarmingsstoring gedetecteerd',
    summer_mode:      'Zomermodus – verwarming uitgeschakeld',
    mode_summer:      'Zomer',
    mode_vacation:    'Vakantie',
  },
  it: {
    heating: 'Riscaldamento', idle: 'Temp raggiunta', off: 'Spento',
    obs: 'Osservazione',
    confident: 'Affidabile', learning: 'Apprendimento', collecting: 'Raccolta dati',
    target: 'Obiettivo',
    battery_low: 'Batteria scarica',
    not_found: 'Entità non trovata',
    chart_ist: 'Reale', chart_soll: 'Obiettivo', chart_aussen: 'Esterno',
    learn_active: 'Apprendimento attivo', learn_inactive: 'Modalità osservazione',
    label_entity:   'Entità ThermoSmart',
    label_name:     'Nome (opzionale)',
    label_section_display:   'Visualizzazione',
    label_section_scale:     'Scala di temperatura',
    label_section_warnings:  'Avvisi',
    label_compact:  'Layout compatto',
    label_disable_humidity: "Nascondi umidità",
    label_disable_chart:    'Nascondi grafico',
    label_disable_modes:    'Nascondi pulsanti modalità',
    label_disable_chips:    'Nascondi chip info',
    label_min_temp: 'Minimo scala (°C)',
    label_max_temp: 'Massimo scala (°C)',
    label_low_battery_threshold: 'Soglia batteria scarica (%)',
    label_chart_hours: 'Finestra temporale grafico (ore)',
    window_open:      'Finestra aperta',
    heating_failure:  'Guasto riscaldamento rilevato',
    summer_mode:      'Modalità estiva – riscaldamento disattivato',
    mode_summer:      'Estate',
    mode_vacation:    'Vacanza',
  },
  pl: {
    heating: 'Grzeje', idle: 'Temp osiągnięta', off: 'Wyłączony',
    obs: 'Obserwacja',
    confident: 'Niezawodny', learning: 'Uczenie się', collecting: 'Zbieranie danych',
    target: 'Cel',
    battery_low: 'Niski poziom baterii',
    not_found: 'Encja nie znaleziona',
    chart_ist: 'Rzeczywista', chart_soll: 'Cel', chart_aussen: 'Zewnętrzna',
    learn_active: 'Nauka aktywna', learn_inactive: 'Tryb obserwacji',
    label_entity:   'Encja ThermoSmart',
    label_name:     'Nazwa wyświetlania (opcjonalna)',
    label_section_display:   'Wyświetlanie',
    label_section_scale:     'Skala temperatury',
    label_section_warnings:  'Ostrzeżenia',
    label_compact:  'Układ kompaktowy',
    label_disable_humidity: 'Ukryj wilgotność',
    label_disable_chart:    'Ukryj wykres',
    label_disable_modes:    'Ukryj przyciski trybu',
    label_disable_chips:    'Ukryj chipy info',
    label_min_temp: 'Minimum skali (°C)',
    label_max_temp: 'Maksimum skali (°C)',
    label_low_battery_threshold: 'Próg niskiej baterii (%)',
    label_chart_hours: 'Okno czasowe wykresu (godziny)',
    window_open:      'Okno otwarte',
    heating_failure:  'Wykryto awarię ogrzewania',
    summer_mode:      'Tryb letni – ogrzewanie wyłączone',
    mode_summer:      'Lato',
    mode_vacation:    'Urlop',
  },
  sv: {
    heating: 'Värmer', idle: 'Temp nådd', off: 'Av',
    obs: 'Observation',
    confident: 'Tillförlitlig', learning: 'Lärande', collecting: 'Samlar data',
    target: 'Mål',
    battery_low: 'Lågt batteri',
    not_found: 'Entitet hittades inte',
    chart_ist: 'Aktuell', chart_soll: 'Mål', chart_aussen: 'Utomhus',
    learn_active: 'Inlärning aktiv', learn_inactive: 'Observationsläge',
    label_entity:   'ThermoSmart klimatenhet',
    label_name:     'Visningsnamn (valfritt)',
    label_section_display:   'Visning',
    label_section_scale:     'Temperaturskala',
    label_section_warnings:  'Varningar',
    label_compact:  'Kompakt 2-radsvy',
    label_disable_humidity: 'Dölj luftfuktighet',
    label_disable_chart:    'Dölj historikdiagram',
    label_disable_modes:    'Dölj lägesknappar',
    label_disable_chips:    'Dölj info-chips',
    label_min_temp: 'Skalminimum (°C)',
    label_max_temp: 'Skalmaximum (°C)',
    label_low_battery_threshold: 'Tröskel för lågt batteri (%)',
    label_chart_hours: 'Diagrammets tidsfönster (timmar)',
    window_open:      'Fönster öppet',
    heating_failure:  'Uppvärmningsfel detekterat',
    summer_mode:      'Sommarläge – uppvärmning inaktiverad',
    mode_summer:      'Sommar',
    mode_vacation:    'Semester',
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
const CX = 140, CY = 126, R = 112, AF = 240, AS = 240;

// ── MDI icon paths for editor sections ────────────────────────────────────────
const MDI_EYE  = 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z';
const MDI_TUNE = 'M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z';
const MDI_ALERT= 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z';

// ── Preset modes (must match ThermoSmart integration const.py) ─────────────────
const MODES = [
  { preset: 'auto',     label: 'Auto',     icon: 'mdi:home-thermometer-outline' },
  { preset: 'comfort',  label: 'Komfort',  icon: 'mdi:sun-thermometer-outline'  },
  { preset: 'eco',      label: 'Eco',      icon: 'mdi:leaf'                     },
  { preset: 'sleep',    label: 'Nacht',    icon: 'mdi:weather-night'            },
  { preset: 'away',     label: 'Abwesend', icon: 'mdi:walk'                     },
  { preset: 'vacation', label: 'Urlaub',   icon: 'mdi:airplane'                 },
];

const STATE_COLORS = {
  heating: { main: '#e8573f', glow: 0.18, text: '#ff8a70' },
  idle:    { main: '#4caf50', glow: 0.14, text: '#81c784' },
  obs:     { main: '#ff9800', glow: 0.10, text: '#ffb74d' },
  off:     { main: '#555555', glow: 0.04, text: '#888888' },
};

// chart line colors
const CHART_COL_TGT    = '#2196F3';  // blue    – Soll
const CHART_COL_OUTDOOR= '#ef5350';  // red     – Außen

// ── Config-Editor ─────────────────────────────────────────────────────────────

const EDITOR_SCHEMA = [
  { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
  { name: 'name',   selector: { text: {} } },
  {
    name: 'section_display',
    type: 'expandable',
    flatten: true,
    expanded: true,
    iconPath: MDI_EYE,
    schema: [
      { type: 'grid', name: '', schema: [
        { name: 'compact',           selector: { boolean: {} } },
        { name: 'disable_humidity',  selector: { boolean: {} } },
        { name: 'disable_modes',     selector: { boolean: {} } },
        { name: 'disable_chips',     selector: { boolean: {} } },
        { name: 'disable_chart',     selector: { boolean: {} } },
      ]},
      { name: 'chart_hours', selector: { number: { min: 1, max: 24, step: 1, mode: 'box', unit_of_measurement: 'h' } } },
    ],
  },
  {
    name: 'section_scale',
    type: 'expandable',
    flatten: true,
    iconPath: MDI_TUNE,
    schema: [
      { type: 'grid', name: '', schema: [
        { name: 'min_temp', selector: { number: { min: 5,  max: 20, step: 1, mode: 'box', unit_of_measurement: '°C' } } },
        { name: 'max_temp', selector: { number: { min: 20, max: 35, step: 1, mode: 'box', unit_of_measurement: '°C' } } },
      ]},
    ],
  },
  {
    name: 'section_warnings',
    type: 'expandable',
    flatten: true,
    iconPath: MDI_ALERT,
    schema: [
      { name: 'low_battery_threshold', selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
    ],
  },
];

class ThermosmartCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass   = null;
    this._form   = null;
  }

  setConfig(config) { this._config = config; this._update(); }
  set hass(hass)    { this._hass = hass; this._update(); }

  // ha-form created once and reused to prevent focus loss on HA state updates
  _update() {
    if (!this._hass) return;

    if (!this._form) {
      const form = document.createElement('ha-form');
      form.schema       = EDITOR_SCHEMA;
      form.computeLabel = (s) => tr(this._hass, `label_${s.name}`);
      form.addEventListener('value-changed', (ev) => {
        ev.stopPropagation();
        this._config = ev.detail.value;
        this.dispatchEvent(new CustomEvent('config-changed', {
          detail: { config: this._config }, bubbles: true, composed: true,
        }));
      });
      this._form = form;
      this.replaceChildren(form);
    }

    this._form.hass = this._hass;
    this._form.data = this._config;
  }
}
if (!customElements.get('thermosmart-card-editor'))
  customElements.define('thermosmart-card-editor', ThermosmartCardEditor);

// ── Main Card ─────────────────────────────────────────────────────────────────

class ThermosmartCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config           = {};
    this._hass             = null;
    this._isDragging       = false;
    this._dragTemp         = null;
    this._optimisticTemp   = null;   // holds target after set until HA confirms
    this._optimisticTimer  = null;
    this._listeners        = [];
    this._historyData      = null;
    this._historyFetching  = false;
    this._lastHistoryFetch = 0;
    this._sparklineCache   = null;
    this._minTemp = 15;
    this._maxTemp = 30;
  }

  static async getStubConfig(hass) {
    const found = Object.keys(hass?.states || {})
      .find(eid => eid.startsWith('climate.thermosmart'));
    return { entity: found || 'climate.thermosmart_zone' };
  }
  static getConfigElement() { return document.createElement('thermosmart-card-editor'); }

  setConfig(config) {
    if (!config.entity) throw new Error('ThermoSmart Card: "entity" fehlt.');
    this._config = config;
    this._lastHistoryFetch = 0;
    this._render();
  }

  set hass(hass) {
    const prev = this._hass;
    this._hass = hass;
    if (this._isDragging) return;
    if (prev && this._config?.entity) {
      const wasUnavailable = prev.states[this._config.entity]?.state === 'unavailable';
      const isAvailable    = hass.states[this._config.entity]?.state !== 'unavailable';
      if (wasUnavailable && isAvailable) this._lastHistoryFetch = 0;
    }
    // Clear optimistic temp once HA confirms the new value
    if (this._optimisticTemp !== null) {
      const haTemp = hass.states[this._config?.entity]?.attributes?.temperature;
      if (haTemp != null && Math.abs(haTemp - this._optimisticTemp) < 0.3) {
        clearTimeout(this._optimisticTimer);
        this._optimisticTemp  = null;
        this._optimisticTimer = null;
      }
    }
    const entityChanged = !prev ||
      prev.states[this._config?.entity] !== hass.states[this._config?.entity];
    if (!entityChanged) return;
    this._fetchHistory();
    this._render();
  }

  // Keep displayed target temp optimistically after a set call until HA confirms
  _setOptimistic(temp) {
    this._optimisticTemp = temp;
    clearTimeout(this._optimisticTimer);
    this._optimisticTimer = setTimeout(() => {
      this._optimisticTemp  = null;
      this._optimisticTimer = null;
    }, 30000);
  }

  getCardSize() { return this._config.compact ? 2 : 8; }

  // ── Cleanup ──────────────────────────────────────────────────────────────

  _cleanup() {
    this._listeners.forEach(fn => { try { fn(); } catch (_) {} });
    this._listeners = [];
  }

  // ── History fetch ─────────────────────────────────────────────────────────

  _fetchHistory() {
    if (this._config.disable_chart || this._config.compact) return;
    if (!this._hass?.callApi || this._historyFetching) return;
    if (Date.now() - this._lastHistoryFetch < 5 * 60 * 1000) return;

    this._historyFetching = true;
    const hours = this._config.chart_hours ?? 24;
    const start = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

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
        return {
          t,
          curr:    parseFloat(a.current_temperature),
          tgt:     parseFloat(a.temperature),
          outdoor: parseFloat(a.outdoor_temperature),
        };
      }).filter(p => !isNaN(p.curr));

      if (!this._isDragging) this._render();
    }).catch(() => {
      this._historyFetching  = false;
      this._lastHistoryFetch = Date.now();
    });
  }

  // ── Data ─────────────────────────────────────────────────────────────────

  _getData() {
    if (!this._hass || !this._config.entity) return null;
    const st = this._hass.states[this._config.entity];
    if (!st) return null;
    const a = st.attributes;

    // Parses both raw numbers and string values like "16%", "5 min", "+2.5°C"
    const num = (v, fb = null) => {
      const n = parseFloat(String(v ?? '').replace(/[^0-9.+-]/g, ''));
      return isNaN(n) ? fb : n;
    };

    const isObs      = a.observation_mode === true;
    const hvacAction = a.hvac_action || 'off';

    let stateKey = 'off';
    if (isObs)                         stateKey = 'obs';
    else if (hvacAction === 'heating') stateKey = 'heating';
    else if (hvacAction === 'idle')    stateKey = 'idle';
    else if (st.state !== 'off')       stateKey = 'idle';

    const raw  = this._config.name || a.friendly_name || this._config.entity;
    const name = raw.replace(/^ThermoSmart\s*[–\-]\s*/i, '');

    return {
      entityId:    this._config.entity,
      name,
      currentTemp: a.current_temperature ?? null,
      targetTemp:  this._dragTemp ?? this._optimisticTemp ?? (a.temperature ?? null),
      hvacMode:    st.state,
      hvacAction,
      preset:      a.preset_mode || 'auto',
      isObs,
      stateKey,
      col:         STATE_COLORS[stateKey],
      outdoorTemp: num(a.outdoor_temperature),
      weatherOff:  num(a.weather_correction),
      confidence:  num(a.learning_confidence, 0),
      preheat:     num(a.preheat_time, 0),
      trvSetpoint: num(a.trv_setpoint),
      boostDelta:  num(a.boost_delta, 0),
      boostFactor: num(a.boost_factor, 1.0),
      suppression: num(a.forecast_suppression, 0),
      humidity:         num(a.current_humidity),
      deviceBatteries:  a.device_batteries || {},
      windowOpen:     a.window_open === true,
      heatingFailure: a.heating_failure === true,
      summerMode:     a.summer_mode === true,
      overrideActive: a.override_active === true,
      overrideTemp:   num(a.override_temp),
      preheatActive:  a.preheat_active === true,
      entityMinTemp:  a.min_temp ?? 15,
      entityMaxTemp:  a.max_temp ?? 30,
    };
  }

  _statusLabel(d) {
    if (d.hvacAction === 'heating') return tr(this._hass, 'heating');
    if (d.hvacAction === 'idle')    return tr(this._hass, 'idle');
    return tr(this._hass, 'off');
  }

  // ── SVG Ring ─────────────────────────────────────────────────────────────

  _buildRing(d) {
    const MIN_T = this._minTemp;
    const MAX_T = this._maxTemp;
    const frac  = t => Math.max(0, Math.min(1, (t - MIN_T) / (MAX_T - MIN_T)));

    const arcInactive = d.isObs || d.hvacMode === 'off';
    const fillColor   = arcInactive ? 'var(--secondary-background-color,rgba(120,120,120,.25))' : d.col.main;

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
        style="fill:var(--ha-card-background,var(--card-background-color,#fff))" stroke="${d.col.main}" stroke-width="2.5"/>`;
    }

    return `
      <svg class="ring-svg" viewBox="0 0 280 250"
        style="width:100%;max-width:360px;display:block;margin:0 auto;overflow:visible;touch-action:none">
        <defs>
          <radialGradient id="grd_${d.stateKey}" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="${d.col.main}" stop-opacity="${d.col.glow}"/>
            <stop offset="100%" stop-color="${d.col.main}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="${CX}" cy="${CY}" r="126" fill="url(#grd_${d.stateKey})"/>
        <path d="${arcPath(CX, CY, R, AF, AS)}"
          fill="none" stroke="var(--secondary-background-color,rgba(120,120,120,.15))" stroke-width="18" stroke-linecap="round"/>
        <path d="${arcPath(CX, CY, R - 16, AF, AS)}"
          fill="none" stroke="var(--divider-color,rgba(120,120,120,.12))" stroke-width="3" stroke-linecap="round"/>
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

    const contextPill = d.windowOpen
      ? `<div class="ov-pill ov-pill--window"><ha-icon icon="mdi:window-open-variant" style="--mdc-icon-size:14px"></ha-icon></div>`
      : d.isObs
      ? `<div class="ov-pill ov-pill--obs"><ha-icon icon="mdi:eye" style="--mdc-icon-size:14px"></ha-icon></div>`
      : d.summerMode
      ? `<div class="ov-pill ov-pill--summer"><ha-icon icon="mdi:weather-sunny" style="--mdc-icon-size:13px"></ha-icon>${tr(this._hass, 'mode_summer')}</div>`
      : d.preset === 'vacation'
      ? `<div class="ov-pill ov-pill--vacation"><ha-icon icon="mdi:airplane" style="--mdc-icon-size:13px"></ha-icon>${tr(this._hass, 'mode_vacation')}</div>`
      : '';

    return `
      <div class="ring-overlay">
        <div class="ov-pill-slot">${contextPill}</div>
        <div class="ov-status" style="color:${d.col.text}">${this._statusLabel(d)}</div>
        <div class="ov-temp">
          ${intPart != null
            ? `<span class="ov-int">${intPart}</span><span class="ov-frac">.${decPart}<span class="ov-unit">°C</span></span>`
            : `<span class="ov-int">--</span>`
          }
        </div>
        ${d.targetTemp != null
          ? `<div class="ov-target"><ha-icon icon="mdi:thermostat" style="--mdc-icon-size:13px"></ha-icon>${d.targetTemp.toFixed(1)}°</div>`
          : ''}
        ${d.humidity != null && !this._config.disable_humidity
          ? `<div class="ov-humidity"><ha-icon icon="mdi:water-percent" style="--mdc-icon-size:13px"></ha-icon>${d.humidity.toFixed(0)}%</div>`
          : ''}
      </div>`;
  }

  _buildBanners(d) {
    let html = '';
    if (d.heatingFailure) {
      html += `<div class="banner failure">
        <ha-icon icon="mdi:alert" style="--mdc-icon-size:14px"></ha-icon>
        ${tr(this._hass, 'heating_failure')}
      </div>`;
    }
    const thr = this._config.low_battery_threshold ?? 15;
    const lowDevices = Object.entries(d.deviceBatteries)
      .filter(([, pct]) => pct <= thr)
      .sort(([, a], [, b]) => a - b);
    for (const [entityId, pct] of lowDevices) {
      const name = this._hass.states[entityId]?.attributes?.friendly_name
        || entityId.split('.').pop().replace(/_/g, ' ');
      html += `<div class="banner battery">
        <ha-icon icon="mdi:battery-alert-variant-outline" style="--mdc-icon-size:14px"></ha-icon>
        ${tr(this._hass, 'battery_low')}: ${name} · ${pct}%
      </div>`;
    }
    return html;
  }

  _buildModes(d) {
    return `<div class="modes">${MODES.map(m => {
      const active = m.preset === d.preset;
      return `<button class="mode-btn${active ? ' active' : ''}" data-preset="${m.preset}"
        title="${m.label}" style="${active ? `--mc:${d.col.main};--mt:${d.col.text}` : ''}">
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
      c.push(`<span class="chip info">🌤️ −${d.suppression.toFixed(0)}%</span>`);
    if (d.preheat > 0)
      c.push(`<span class="chip ${d.preheatActive ? 'pos' : 'warn'}">${d.preheatActive ? '🔥' : '⏱'} ${d.preheat.toFixed(0)} min</span>`);
    if (d.overrideActive && d.overrideTemp != null)
      c.push(`<span class="chip info">✋ ${d.overrideTemp.toFixed(1)}°</span>`);
    return c.length ? `<div class="chips">${c.join('')}</div>` : '';
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
      <ha-icon icon="mdi:brain" style="--mdc-icon-size:13px;opacity:.5"></ha-icon>
      <span class="conf-lbl">${lbl}</span>
      <div class="conf-bg"><div class="conf-fill" style="width:${pct}%;background:${bar}"></div></div>
      <span class="conf-pct">${pct}%</span>
    </div>`;
  }

  // ── Sparkline chart ───────────────────────────────────────────────────────

  _buildSparkline(d) {
    if (this._historyFetching && !this._historyData) {
      return `<div class="spark-wrap spark-loading"><div class="spark-spinner"></div></div>`;
    }

    const data = this._historyData;
    if (!data || data.length < 3) return '';

    if (this._sparklineCache?.dataRef === this._historyData &&
        this._sparklineCache?.color   === d.col.main &&
        this._sparklineCache?.minTemp === this._config.min_temp &&
        this._sparklineCache?.maxTemp === this._config.max_temp) {
      return this._sparklineCache.html;
    }

    const W = 260, H = 72;
    const PL = 34, PR = 6, PT = 6, PB = 16;
    const vW = W - PL - PR, vH = H - PT - PB;

    const step = Math.max(1, Math.ceil(data.length / 100));
    const pts  = data.filter((_, i) => i % step === 0);
    if (pts.length < 2) return '';

    const allT = [
      ...pts.map(p => p.curr),
      ...pts.map(p => p.tgt),
      ...pts.map(p => p.outdoor),
    ].filter(t => !isNaN(t));
    if (!allT.length) return '';

    const rawMin = Math.min(...allT);
    const rawMax = Math.max(...allT);
    // Config-Skala hat Vorrang; sonst auto auf nächste 5°C runden
    const minT = this._config.min_temp != null
      ? this._config.min_temp
      : Math.floor(rawMin / 5) * 5;
    const maxT = this._config.max_temp != null
      ? this._config.max_temp
      : (Math.ceil(rawMax / 5) * 5 || minT + 5);
    const range = maxT - minT || 1;

    const tx = i  => (PL + (i / (pts.length - 1)) * vW).toFixed(1);
    const ty = tv => (PT + vH - ((tv - minT) / range) * vH).toFixed(1);

    const makePath = (get) => pts.reduce((acc, p, i) => {
      const v = get(p);
      if (isNaN(v)) return acc;
      return acc + (acc === '' ? `M${tx(i)} ${ty(v)}` : ` L${tx(i)} ${ty(v)}`);
    }, '');

    // Grid lines at every 5°C
    let gridLines = '';
    for (let t = minT; t <= maxT; t += 5) {
      const y = parseFloat(ty(t)).toFixed(1);
      gridLines += `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}"
        style="stroke:var(--divider-color,rgba(0,0,0,.1))" stroke-width="1"/>`;
      gridLines += `<text x="${PL - 4}" y="${y}" dominant-baseline="middle"
        text-anchor="end" style="font-size:8px;fill:var(--secondary-text-color,#888)">${t}°</text>`;
    }

    const currPath    = makePath(p => p.curr);
    const tgtPath     = makePath(p => p.tgt);
    const outdoorPath = makePath(p => p.outdoor);

    const fmt = ts => {
      const d = new Date(ts);
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    };

    // Legend
    const legendItems = [
      { col: d.col.main,     label: tr(this._hass, 'chart_ist'),    dash: false },
      { col: CHART_COL_TGT,  label: tr(this._hass, 'chart_soll'),   dash: true  },
    ];
    if (outdoorPath) {
      legendItems.push({ col: CHART_COL_OUTDOOR, label: tr(this._hass, 'chart_aussen'), dash: true });
    }
    const legendSpacing = 75;
    const legendItemW   = 58;
    const legendTotalW  = legendItems.length === 1
      ? legendItemW
      : (legendItems.length - 1) * legendSpacing + legendItemW;
    const legendStartX  = Math.max(0, (W - legendTotalW) / 2);
    const legendSvg = legendItems.map((item, i) => {
      const x = legendStartX + i * legendSpacing;
      return `<line x1="${x.toFixed(1)}" y1="0" x2="${(x + 12).toFixed(1)}" y2="0"
          stroke="${item.col}" stroke-width="2" ${item.dash ? 'stroke-dasharray="4 3"' : ''}/>
        <text x="${(x + 15).toFixed(1)}" y="3" style="font-size:8px;fill:var(--secondary-text-color,#888)">${item.label}</text>`;
    }).join('');

    const result = `
      <div class="spark-wrap">
        <svg viewBox="0 0 ${W} ${H + 14}" style="width:100%;display:block;overflow:visible">
          ${gridLines}
          ${tgtPath     ? `<path d="${tgtPath}"     fill="none" stroke="${CHART_COL_TGT}"     stroke-width="1.4" stroke-dasharray="5 3"/>` : ''}
          ${outdoorPath ? `<path d="${outdoorPath}" fill="none" stroke="${CHART_COL_OUTDOOR}" stroke-width="1.4" stroke-dasharray="3 3"/>` : ''}
          ${currPath    ? `<path d="${currPath}"    fill="none" stroke="${d.col.main}"         stroke-width="2"   stroke-linecap="round" stroke-linejoin="round"/>` : ''}
          <text x="${PL}"     y="${H + 1}" text-anchor="start" style="font-size:8px;fill:var(--secondary-text-color,#888)">${fmt(pts[0].t)}</text>
          <text x="${W - PR}" y="${H + 1}" text-anchor="end"   style="font-size:8px;fill:var(--secondary-text-color,#888)">${fmt(pts[pts.length - 1].t)}</text>
          <g transform="translate(${PL}, ${H + 9})">${legendSvg}</g>
        </svg>
      </div>`;

    this._sparklineCache = { dataRef: this._historyData, color: d.col.main, minTemp: this._config.min_temp, maxTemp: this._config.max_temp, html: result };
    return result;
  }

  // ── Layout ───────────────────────────────────────────────────────────────

  _renderNormal(d) {
    return `
      <ha-card>
        <div class="hdr">
          <span class="hdr-name">${d.name}</span>
          <span class="hdr-readouts">
            ${d.outdoorTemp != null
              ? `<span class="hdr-out"><ha-icon icon="mdi:thermometer" style="--mdc-icon-size:14px"></ha-icon>${d.outdoorTemp.toFixed(1)}°C</span>` : ''}
          </span>
        </div>

        <div class="ring-wrap">
          ${this._buildRing(d)}
          ${this._buildTempOverlay(d)}
        </div>

        ${this._buildBanners(d)}

        <div class="ctrl-row">
          <button class="ctrl-btn sm${!d.isObs ? ' learn-active' : ''}" data-action="learn"
            title="${!d.isObs ? tr(this._hass, 'learn_active') : tr(this._hass, 'learn_inactive')}">
            <ha-icon icon="mdi:brain"></ha-icon>
          </button>
          <button class="ctrl-btn" data-action="dec"><ha-icon icon="mdi:minus"></ha-icon></button>
          <span class="ctrl-val">${d.targetTemp != null ? d.targetTemp.toFixed(1) : '--'}</span>
          <button class="ctrl-btn" data-action="inc"><ha-icon icon="mdi:plus"></ha-icon></button>
          <button class="ctrl-btn sm${d.isObs ? ' pwr-off' : ''}" data-action="power">
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>

        ${this._config.disable_modes ? '' : this._buildModes(d)}
        ${this._config.disable_chips ? '' : this._buildChips(d)}
        ${this._config.disable_chips ? '' : this._buildConf(d)}
        ${this._config.disable_chart ? '' : this._buildSparkline(d)}
      </ha-card>`;
  }

  _renderCompact(d) {
    const pct = Math.min(100, Math.max(0, d.confidence)).toFixed(0);
    const alert = d.heatingFailure
      ? { cls: 'failure',  icon: 'mdi:alert',               key: 'heating_failure' }
      : d.windowOpen
      ? { cls: 'window',   icon: 'mdi:window-open-variant', key: 'window_open'     }
      : d.summerMode
      ? { cls: 'summer',   icon: 'mdi:weather-sunny',       key: 'mode_summer'     }
      : d.preset === 'vacation'
      ? { cls: 'vacation', icon: 'mdi:airplane',            key: 'mode_vacation'   }
      : null;
    return `
      <ha-card>
        <div class="cmp-row">
          <div class="cmp-icon" style="background:${d.col.main}22;border-color:${d.col.main}66">
            <ha-icon icon="mdi:home-thermometer" style="color:${d.col.main};--mdc-icon-size:20px"></ha-icon>
          </div>
          <div class="cmp-info">
            <div class="cmp-name">${d.name}</div>
            <div class="cmp-sub">${this._statusLabel(d)}${
              d.humidity != null && !this._config.disable_humidity
                ? ' · 💧' + d.humidity.toFixed(0) + '%' : ''}${
              d.outdoorTemp != null ? ' · 🌡️' + d.outdoorTemp.toFixed(1) + '°C' : ''}</div>
          </div>
          <div class="cmp-temps">
            <span class="cmp-curr">${d.currentTemp != null ? d.currentTemp.toFixed(1) + '°' : '--'}</span>
            <span class="cmp-tgt">${d.targetTemp != null ? '→ ' + d.targetTemp.toFixed(1) + '°' : ''}</span>
          </div>
        </div>
        ${alert ? `<div class="banner ${alert.cls} cmp-banner">
          <ha-icon icon="${alert.icon}" style="--mdc-icon-size:12px"></ha-icon>
          ${tr(this._hass, alert.key)}
        </div>` : ''}
        <div class="conf-bg" style="height:3px">
          <div class="conf-fill" style="width:${pct}%;background:${d.col.main}"></div>
        </div>
      </ha-card>`;
  }

  // ── CSS ───────────────────────────────────────────────────────────────────

  _css() {
    return `<style>
      :host { display: block; }
      ha-card { padding: 14px 14px 12px; box-sizing: border-box; }

      /* Header */
      .hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px; }
      .hdr-name { font-size: 1em; font-weight: 600; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .hdr-readouts { display: flex; gap: 6px; flex-shrink: 0; }
      .hdr-out { display: inline-flex; align-items: center; gap: 2px; font-size: 0.75em; color: var(--secondary-text-color); background: var(--secondary-background-color, rgba(120,120,120,.1)); padding: 2px 9px; border-radius: 10px; white-space: nowrap; --mdc-icon-size: 14px; }

      /* Ring + Overlay */
      .ring-wrap { position: relative; display: flex; justify-content: center; margin-bottom: 2px; }
      .ring-svg { cursor: default; }
      .ring-svg.dragging, .ring-svg.dragging .arc-interact { cursor: grabbing !important; }
      .arc-interact { cursor: grab; }
      .ring-overlay {
        position: absolute; top: 51%; left: 50%;
        transform: translate(-50%, -50%);
        text-align: center; pointer-events: none; width: 210px;
      }
      .ov-pill-slot { min-height: 26px; display: flex; justify-content: center; align-items: center; margin-bottom: 2px; }
      .ov-pill {
        display: inline-flex; align-items: center; gap: 3px;
        font-size: 0.7em; font-weight: 500; border-radius: 20px;
        padding: 4px 10px; border: 1px solid;
        letter-spacing: 0.02em;
      }
      .ov-pill--window  { color: #29b6f6; background: rgba(41,182,246,.12);  border-color: rgba(41,182,246,.3); }
      .ov-pill--obs     { color: #90a4ae; background: rgba(144,164,174,.12); border-color: rgba(144,164,174,.3); }
      .ov-pill--summer  { color: #f57c00; background: rgba(255,152,0,.12);   border-color: rgba(255,152,0,.3);  }
      .ov-pill--vacation{ color: #7986cb; background: rgba(121,134,203,.12); border-color: rgba(121,134,203,.3);}
      .ov-status { font-size: 0.9em; font-weight: 700; margin-bottom: 1px; white-space: nowrap; letter-spacing: 0.01em; }
      .ov-temp   { line-height: 1; white-space: nowrap; }
      .ov-int    { font-size: 4.2em; font-weight: 300; color: var(--primary-text-color); letter-spacing: -0.03em; }
      .ov-frac   { font-size: 1.5em; font-weight: 400; color: var(--primary-text-color); vertical-align: top; display: inline-block; margin-top: 0.46em; opacity: .85; }
      .ov-unit   { font-size: 0.68em; font-weight: 300; }
      .ov-target  { display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-size: 0.88em; font-weight: 500; color: var(--secondary-text-color); margin-top: 5px; --mdc-icon-size: 15px; }
      .ov-humidity{ display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-size: 0.88em; font-weight: 500; color: #6fa3d6; margin-top: 3px; --mdc-icon-size: 15px; }

      /* Banners */
      .banner {
        display: flex; align-items: center; gap: 6px;
        border-radius: 8px; font-size: 0.78em; padding: 5px 10px; margin-bottom: 8px;
      }
      .banner.failure  { background: rgba(232,87,63,.1);  border: 1px solid rgba(232,87,63,.35);  color: #e8573f; }
      .banner.window   { background: rgba(41,182,246,.1); border: 1px solid rgba(41,182,246,.3);  color: #29b6f6; }
      .banner.summer   { background: rgba(255,152,0,.1);  border: 1px solid rgba(255,152,0,.35);  color: #f57c00; }
      .banner.vacation { background: rgba(121,134,203,.1);border: 1px solid rgba(121,134,203,.3); color: #7986cb; }
      .banner.battery  { background: rgba(232,87,63,.08); border: 1px solid rgba(232,87,63,.25);  color: #e8573f; }

      /* Controls */
      .ctrl-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 4px 0 12px; }
      .ctrl-btn {
        width: 40px; height: 40px; border-radius: 50%; border: none;
        background: var(--secondary-background-color, rgba(120,120,120,.08));
        color: var(--primary-text-color); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        --mdc-icon-size: 20px;
        transition: background 0.18s, color 0.18s, transform 0.12s;
        box-shadow: 0 1px 3px rgba(0,0,0,.08);
      }
      .ctrl-btn:hover  { background: var(--secondary-background-color, rgba(120,120,120,.16)); transform: scale(1.06); }
      .ctrl-btn:active { transform: scale(0.95); }
      .ctrl-btn.sm     { width: 34px; height: 34px; --mdc-icon-size: 17px; }
      .ctrl-btn.pwr-off  { color: #e8573f; background: rgba(232,87,63,.08); }
      .ctrl-btn.learn-active { color: #43a047; background: rgba(67,160,71,.1); }
      .ctrl-val { font-size: 1.6em; font-weight: 300; color: var(--primary-text-color); min-width: 62px; text-align: center; }

      /* Modes */
      .modes { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
      .mode-btn {
        flex: 1; min-width: 36px; height: 36px; border: none; border-radius: 10px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        background: var(--secondary-background-color, rgba(120,120,120,.07));
        color: var(--secondary-text-color);
        transition: background 0.18s, color 0.18s, transform 0.12s; --mdc-icon-size: 18px;
        box-shadow: 0 1px 2px rgba(0,0,0,.06);
      }
      .mode-btn.active  { background: color-mix(in srgb, var(--mc) 20%, transparent); color: var(--mt); box-shadow: 0 2px 6px color-mix(in srgb, var(--mc) 25%, transparent); }
      .mode-btn:hover:not(.active) { background: var(--secondary-background-color, rgba(120,120,120,.15)); transform: scale(1.04); }
      .mode-btn:active  { transform: scale(0.96); }

      /* Chips */
      .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
      .chip { padding: 3px 10px; border-radius: 10px; font-size: 0.72em; background: var(--secondary-background-color, rgba(120,120,120,.1)); color: var(--secondary-text-color); }
      .chip.pos  { color: #43a047; }
      .chip.neg  { color: #e53935; }
      .chip.warn { color: #f57c00; }
      .chip.info { color: #1e88e5; }

      /* Confidence */
      .conf-row { display: flex; align-items: center; gap: 6px; font-size: 0.72em; color: var(--secondary-text-color); }
      .conf-lbl { flex-shrink: 0; }
      .conf-bg  { flex: 1; height: 4px; border-radius: 2px; background: var(--secondary-background-color, rgba(120,120,120,.12)); overflow: hidden; }
      .conf-fill { height: 100%; border-radius: 2px; transition: width 0.6s; }
      .conf-pct { min-width: 26px; text-align: right; flex-shrink: 0; }

      /* Sparkline */
      .spark-wrap { margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--divider-color, rgba(120,120,120,.2)); }
      .spark-loading { display: flex; align-items: center; justify-content: center; height: 56px; }
      .spark-spinner {
        width: 20px; height: 20px; border-radius: 50%;
        border: 2px solid var(--secondary-background-color, rgba(120,120,120,.15));
        border-top-color: var(--secondary-text-color, #888);
        animation: ts-spin 0.8s linear infinite;
      }
      @keyframes ts-spin { to { transform: rotate(360deg); } }

      /* Compact */
      .cmp-row  { display: flex; align-items: center; gap: 10px; padding-bottom: 7px; }
      .cmp-icon { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 1.5px solid; }
      .cmp-info { flex: 1; min-width: 0; }
      .cmp-name { font-size: 0.9em; font-weight: 600; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .cmp-sub  { font-size: 0.72em; color: var(--secondary-text-color); }
      .cmp-temps { flex-shrink: 0; text-align: right; }
      .cmp-curr { font-size: 1.1em; font-weight: 300; color: var(--primary-text-color); }
      .cmp-tgt  { font-size: 0.74em; color: var(--secondary-text-color); margin-left: 4px; }
      .cmp-banner { font-size: 0.72em; padding: 3px 8px; margin: 0 0 5px; border-radius: 6px; }
    </style>`;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  _render() {
    this._cleanup();
    const d = this._getData();

    if (!d) {
      this.shadowRoot.innerHTML = `${this._css()}
        <ha-card style="padding:16px;color:#e8573f;font-size:.85em">
          ${tr(this._hass, 'not_found')}: <b>${this._config?.entity || '?'}</b>
        </ha-card>`;
      return;
    }

    this._minTemp = d.entityMinTemp;
    this._maxTemp = d.entityMaxTemp;

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
          const t = Math.max(this._minTemp, Math.min(this._maxTemp, (d.targetTemp ?? 20) + (act === 'inc' ? 0.5 : -0.5)));
          this._setOptimistic(t);
          setTempDebounced(t);
        } else if (act === 'learn') {
          this._hass.callService('climate', 'set_hvac_mode', {
            entity_id: d.entityId, hvac_mode: d.isObs ? 'heat' : 'off',
          });
        } else if (act === 'power') {
          this._hass.callService('climate', 'set_hvac_mode', {
            entity_id: d.entityId, hvac_mode: d.isObs ? 'heat' : 'off',
          });
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

    const MIN_T = this._minTemp;
    const MAX_T = this._maxTemp;

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
      dragging = true; this._isDragging = true;
      svg.classList.add('dragging');
      const temp = angleToTemp(getAngle(clientX, clientY));
      lastTemp = temp; this._dragTemp = temp;
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
        lastTemp = temp; this._dragTemp = temp;
        this._updateDragUI(temp);
        callSet(temp);
      }
      e.preventDefault();
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false; this._isDragging = false;
      if (lastTemp !== null) this._setOptimistic(lastTemp);
      this._dragTemp = null;
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
    const MIN_T = this._minTemp;
    const MAX_T = this._maxTemp;
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

if (!customElements.get('thermosmart-card'))
  customElements.define('thermosmart-card', ThermosmartCard);

window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'thermosmart-card')) {
  window.customCards.push({
    type: 'thermosmart-card',
    name: 'ThermoSmart Card',
    description: 'KI-gestützte Heizungskarte für ThermoSmart – Drag-Ring, i18n, 3-Linien-Chart & mehr',
    preview: true,
    documentationURL: 'https://github.com/Mikasmarthome/thermosmart-card',
  });
}

console.info(
  `%c THERMOSMART-CARD %c v${CARD_VERSION} `,
  'background:#e8573f;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:bold;font-size:11px',
  'background:#2a2a2a;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0;font-size:11px',
);
