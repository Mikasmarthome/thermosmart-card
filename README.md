# ThermoSmart Card

Custom Lovelace card for the [ThermoSmart](https://github.com/Mikasmarthome/ThermoSmart) Home Assistant integration.

## Features

- **Temperature history chart** – inline SVG sparkline of the last 3 hours (current vs. target, no external dependencies, auto-refreshed every 5 min)
- **Drag-to-set temperature** – drag directly on the arc ring to set the target temperature (mouse & touch)
- **Temperature ring** – current vs. target temperature with visual arc
- **6 heating modes** – Auto / Komfort / Eco / Nacht / Abwesend / Urlaub switchable in one tap
- **Status indicator** – Heizt / Hält Temp / Aus / Beobachtung
- **Window banner** – prominent warning bar when heating is paused due to open window
- **Humidity readout** – shows `current_humidity` in the header and as a chip (if available)
- **Low-battery banner** – warning when the TRV battery drops below a configurable threshold
- **Info chips** – weather correction, TRV boost, forecast suppression, preheat timer
- **Learning confidence bar** – shows how well ThermoSmart knows your home
- **Display toggles** – hide humidity, history chart, mode buttons or info chips per card
- **Compact layout** – optional 2-line version for dashboards with many zones
- **8 languages** – DE, EN, FR, NL, ES, IT, PL, SV (auto-detected from HA user language)
- **HACS compatible**

## Installation

### HACS (recommended)

1. Open HACS → Frontend
2. Add custom repository: `https://github.com/Mikasmarthome/thermosmart-card`
3. Install **ThermoSmart Card**
4. Reload browser

### Manual

Copy `thermosmart-card.js` to `config/www/` and add to your Lovelace resources:

```yaml
resources:
  - url: /local/thermosmart-card.js
    type: module
```

## Usage

### Minimal config

```yaml
type: custom:thermosmart-card
entity: climate.thermosmart_living_room
```

### All options

```yaml
type: custom:thermosmart-card
entity: climate.thermosmart_living_room
name: Wohnzimmer              # optional – overrides entity friendly name
compact: false               # true = compact 2-line layout
min_temp: 15                 # temperature ring scale minimum (default: 15)
max_temp: 30                 # temperature ring scale maximum (default: 30)
disable_humidity: false      # hide the humidity readout
disable_chart: false         # hide the 3-hour history sparkline
disable_modes: false         # hide the preset/mode buttons
disable_chips: false         # hide the diagnostic info chips
low_battery_threshold: 15    # show a low-battery banner at/below this % (default: 15)
```

### Compact layout

```yaml
type: custom:thermosmart-card
entity: climate.thermosmart_bedroom
compact: true
```

## What the card reads

All data is taken directly from the ThermoSmart climate entity — **no additional sensor configuration needed**.

| Attribute | Shown as |
|---|---|
| `current_temperature` | Current temp (large, center) |
| `current_humidity` | Humidity readout (header + chip) |
| `battery_level` / `battery` | Low-battery banner (below threshold) |
| `temperature` | Target temp (dot on ring + arrow text) |
| `hvac_action` | Status color & pill (Heizt / Hält / Aus) |
| `preset_mode` | Active mode button highlighted |
| `außentemperatur` | Outdoor chip |
| `wetterkorrektur` | Weather offset chip |
| `trv_setpoint` + `boost_delta` | TRV boost chip |
| `vorhersage_unterdrückung` | Forecast suppression chip |
| `vorhersage_konfidenz` | Confidence bar + label |
| `vorheizzeit` | Preheat timer (orange, below ring) |
| `beobachtungsmodus` | Observation mode banner |

## Compatibility

- Requires **ThermoSmart ≥ v0.2.6**
- Home Assistant 2024.1+
- No build step – pure vanilla JS, works without Node.js

## License

MIT
