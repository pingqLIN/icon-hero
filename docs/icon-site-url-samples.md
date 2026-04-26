# Icon Site URL Parsing Samples

This document records two URL samples for each recommended icon site:

1. A concrete icon detail page, search-focused page, or icon anchor URL.
2. A URL similar to what users may get by dragging or copying the icon image/SVG resource.

Use these samples for manual parser checks and browser smoke tests. Some catalog sites expose direct PNG assets, while SVG libraries usually expose package/CDN SVG files instead of draggable image URLs.

| Site | Detail / focused URL | Drag / image / SVG URL | Public without login | Notes |
| --- | --- | --- | --- | --- |
| Flaticon | `https://www.flaticon.com/free-icon/detail-page_15481` | `https://cdn-icons-png.flaticon.com/512/15/15481.png` | Partial | CDN PNG is public. Automated detail-page requests returned `403 Forbidden`; browser/manual access may still work. |
| Icons8 | `https://icons8.com/icon/23027/html-5` | `https://img.icons8.com/ios7/1200/html-5--v1.jpg` | Yes | Public detail page with direct preview image. |
| The Noun Project | `https://thenounproject.com/icon/example-4935107/` | `https://static.thenounproject.com/png/icons-icon-2457549-512.png` | Yes | Public PNG found through page metadata. |
| Iconfinder | `https://www.iconfinder.com/icons/272704/image_icon` | `https://cdn2.iconfinder.com/data/icons/social-media-8/512/image3.png` | Partial | CDN PNG is public. Automated detail-page requests returned `403 Forbidden`; browser/manual access may still work. |
| Font Awesome | `https://fontawesome.com/v4/icon/search` | N/A | Yes | Documentation/font/SVG driven; no stable standalone draggable image URL was found. |
| Phosphor Icons | `https://phosphoricons.com/?q=star` | `https://unpkg.com/@phosphor-icons/core@latest/assets/regular/star.svg` | Yes | Search-focused official page plus public package SVG. |
| Heroicons | `https://heroicons.com/?trk=public_post-text` | `https://unpkg.com/heroicons@2.2.0/24/outline/academic-cap.svg` | Yes | Catalog site; direct SVG uses public package path. |
| Lucide | `https://studio.lucide.dev/edit?value=%3Cpath+d%3D%22M14.5+3a2+2+0+0+1+1.6.8l.3.4A2+2+0+0+0+18+5h1a2+2+0+0+1+2+2v11a2+2+0+0+1-2+2H5a2+2+0+0+1-2-2V7a2+2+0+0+1+2-2h1a2+2+0+0+0+1.6-.8l.3-.4A2+2+0+0+1+9.5+3z%22+%2F%3E%3Ccircle+cx%3D%2212%22+cy%3D%2212%22+r%3D%224%22+%2F%3E` | `https://unpkg.com/lucide-static@latest/icons/camera.svg` | Yes | Studio/source URL plus public package SVG. |
| Feather Icons | `https://feathericons.com/?query=circle` | `https://unpkg.com/feather-icons@latest/dist/icons/circle.svg` | Yes | Query-focused official page plus public package SVG. |
| Material Icons | `https://fonts.google.com/icons?icon.query=home` | `https://unpkg.com/@material-design-icons/svg@latest/filled/home.svg` | Yes | Google Fonts catalog plus public SVG package path. |

## Parser Expectations

- Direct PNG/JPG/SVG URLs should be attempted first because they are closest to drag/copy behavior.
- Detail pages may still fail in the browser if the target site blocks cross-origin `fetch`; this is expected for a client-only converter.
- For SVG libraries, public package SVG URLs are the most stable parser target because the official UI often renders inline SVG instead of exposing a downloadable image file.
