# ConfigWizard 🧙‍♂️
Intelligent Minecraft server configuration assistant & performance optimizer for [Pterodactyl Panel](https://pterodactyl.io) built on the [Blueprint Framework](https://blueprint.zip).

Developed by **ANSH9BOSS**.

## Features
- ⚡ **Performance Impact Scores:** Instant visual indicators (LOW, MEDIUM, HIGH) for every configuration setting.
- 🎯 **Curated Presets:** One-click presets for Maximum Performance, Vanilla, Creative, and PvP servers.
- 🔍 **Diff & Review Modal:** Visual confirmation of exact changes before writing to server files.
- 📘 **Tooltips & Plain-English Guides:** Easy to understand descriptions for complex YAML and properties files.

## Installation
Package as a `.blueprint` extension and install via Blueprint CLI:
```bash
blueprint -install configwizard.blueprint
```

## Structure
- `conf.yml` — Extension manifest
- `app/` — Laravel Controllers (PHP API logic)
- `routes/` — Client API routes
- `resources/` — React UI components (TSX)
