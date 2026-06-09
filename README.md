<p align="center">
  <img src="https://raw.githubusercontent.com/Mikasmarthome/thermosmart-card/main/icon.png"
       width="256" alt="ThermoSmart Card Logo"/>
</p>

<h1 align="center">ThermoSmart Card</h1>
<p align="center"><strong>Lovelace card for the <a href="https://github.com/Mikasmarthome/ThermoSmart">ThermoSmart</a> Home Assistant integration</strong></p>

<p align="center">
  <a href="https://hacs.xyz"><img src="https://img.shields.io/badge/HACS-Custom-orange.svg" alt="HACS Custom"/></a>
  <a href="https://github.com/Mikasmarthome/thermosmart-card/releases"><img src="https://img.shields.io/badge/version-v1.0.0--rc.3-blue.svg" alt="Version"/></a>
  <a href="https://www.home-assistant.io"><img src="https://img.shields.io/badge/HA-2024.1%2B-brightgreen.svg" alt="HA min"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"/></a>
</p>

---

## Requirements

- **[ThermoSmart integration](https://github.com/Mikasmarthome/ThermoSmart)** v1.0.0-rc.1 or later
- Home Assistant 2024.1+
- No build step — pure vanilla JS, no Node.js required

---

## Features

- **Temperature ring** — current vs. target with arc visualisation, drag to set (mouse & touch)
- **History sparkline** — current / target / outdoor temp, configurable 1–24 h window, auto-refreshed every 5 min
- **Mode buttons** — Auto / Comfort / Eco / Night / Away / Vacation
- **Status indicator** — Heating / Maintaining / Off / Observation mode
- **Window banner** — prominent warning when heating is paused due to open window
- **Info chips** — weather offset, TRV boost, forecast suppression, preheat timer
- **Learning confidence bar** — shows how well ThermoSmart knows your home
- **Humidity readout** — shown in header and as chip (if available)
- **Low-battery banner** — configurable threshold
- **24 languages** — auto-detected from HA user language

---

## Installation

### HACS (recommended)
1. HACS → Frontend → ⋮ → **Custom Repositories**
2. URL: `https://github.com/Mikasmarthome/thermosmart-card` → Lovelace → Add
3. Download **ThermoSmart Card** and reload the browser

### Manual
Copy `thermosmart-card.js` to `config/www/` and add to your Lovelace resources:

```yaml
resources:
  - url: /local/thermosmart-card.js
    type: module
```

---

## Configuration

### Minimal
```yaml
type: custom:thermosmart-card
entity: climate.thermosmart_living_room
```

### All options
```yaml
type: custom:thermosmart-card
entity: climate.thermosmart_living_room
name: Living Room            # optional — overrides entity friendly name
compact: false               # true = compact 2-line layout (YAML only)
min_temp: 4                  # temperature ring scale minimum (default: 4)
max_temp: 35                 # temperature ring scale maximum (default: 35)
disable_humidity: false      # hide humidity readout
disable_chart: false         # hide 3-hour history sparkline
disable_modes: false         # hide mode buttons
disable_chips: false         # hide all diagnostic info chips
hide_chip_weather: false     # hide weather offset chip individually
hide_chip_boost: false       # hide TRV boost chip individually
hide_chip_suppression: false # hide forecast suppression chip individually
hide_chip_preheat: false     # hide preheat timer chip individually
chart_hours: 24              # history chart time window in hours (1–24, default: 24)
invert_temps: false          # swap primary/secondary temp display (target = large)
low_battery_threshold: 15    # low-battery banner threshold in % (default: 15)
```

---

## What the card reads

All data comes directly from the ThermoSmart climate entity — **no additional sensor configuration needed**.

| Attribute | Shown as |
|---|---|
| `current_temperature` | Current temperature (large, center) |
| `current_humidity` | Humidity chip |
| `temperature` | Target temperature (ring dot + drag handle) |
| `hvac_action` | Status pill (Heating / Idle / Off) |
| `preset_mode` | Active mode button highlighted |
| `outdoor_temperature` | Outdoor chip |
| `weather_correction` | Weather offset chip |
| `trv_setpoint` + `boost_delta` | TRV boost chip |
| `forecast_suppression` | Forecast suppression chip |
| `learning_confidence` | Confidence bar |
| `preheat_time` | Preheat timer (below ring) |
| `observation_mode` | Observation mode indicator |
| `window_open` | Window open indicator |
| `device_batteries` | Low-battery banner (per device) |

---

## License

MIT
