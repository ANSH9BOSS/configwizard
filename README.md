# ConfigWizard 🧙‍♂️
Intelligent Minecraft server configuration assistant & performance optimizer for [Pterodactyl Panel](https://pterodactyl.io) built on the [Blueprint Framework](https://blueprint.zip).

Developed by **ANSH9BOSS**.

## Features
- ⚡ **Performance Impact Scores:** Instant visual indicators (LOW, MEDIUM, HIGH) for every configuration setting.
- 🎯 **Curated Presets:** One-click presets for Maximum Performance, Vanilla, Creative, and PvP servers.
- 🔍 **Diff & Review Modal:** Visual confirmation of exact changes before writing to server files.
- 📘 **Tooltips & Plain-English Guides:** Easy to understand descriptions for complex YAML and properties files.

## 📦 Direct Installation

Download the `.blueprint` extension directly from [GitHub Releases](https://github.com/ANSH9BOSS/configwizard/releases/tag/v1.0.0) or run in terminal:

```bash
wget https://github.com/ANSH9BOSS/configwizard/releases/download/v1.0.0/configwizard.blueprint
blueprint -install configwizard.blueprint
```

## Structure
- `conf.yml` — Extension manifest
- `app/` — Laravel Controllers (PHP API logic)
- `routes/` — Client API routes
- `resources/` — React UI components (TSX)
