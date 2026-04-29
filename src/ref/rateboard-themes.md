# Rateboard Theme Inventory

This file documents the active theme set after merging the two reference files into the app.

## Active Themes

| Theme | Source | Notes |
| --- | --- | --- |
| Graphite Pro | Existing app | Kept as a unique dark graphite option. |
| Obsidian & Gold | `Rateboard Designs.html` | Replaces the old Amber Ledger slot to avoid a duplicate dark gold theme. |
| Navy & Rose Gold | `Rateboard Designs.html` | Added from reference. |
| Ivory & Gold | `Rateboard Designs.html` | Replaces the old Pearl Pro slot to avoid a duplicate light neutral theme. |
| Emerald & Gold | `Rateboard Designs.html` | Replaces the old Emerald Hall slot to avoid duplicate green themes. |
| Burgundy & Champagne | `Rateboard Designs.html` | Replaces the old Ruby Chamber slot to avoid duplicate red/burgundy themes. |
| Arctic Mint | Existing app | Kept as a unique dark cyan option. |
| Warm Sand | `Soft Palette Rateboards designs.html` | Added from reference. |
| Blush Rose | `Soft Palette Rateboards designs.html` | Added from reference. |
| Sage Mist | `Soft Palette Rateboards designs.html` | Added from reference. |
| Soft Lavender | `Soft Palette Rateboards designs.html` | Added from reference. |
| Powder Blue | `Soft Palette Rateboards designs.html` | Added from reference. |
| Cream & Terracotta | `Soft Palette Rateboards designs.html` | Added from reference. |

## Duplicate Handling

The app keeps one theme per visual direction. Similar older themes were not kept as separate choices:

| Old Theme | Merged Into | Reason |
| --- | --- | --- |
| Amber Ledger | Obsidian & Gold | Both are dark gold display themes. |
| Pearl Pro | Ivory & Gold | Both are bright neutral/light premium themes. |
| Emerald Hall | Emerald & Gold | Both are green luxury themes. |
| Ruby Chamber | Burgundy & Champagne | Both are deep warm red themes. |

## Layout Notes

The live board now follows the reference layout:

- Full-bleed theme background
- Three-column header for date, title/live status, and time
- Thin accent divider
- Compact three-column table header
- Alternating rate rows with a first-row accent bar
- Rupee-prefixed sale and purchase values

The implementation remains responsive and uses live API data instead of the fixed sample values in the reference HTML.
