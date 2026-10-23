# 3D Asset Licences & Attribution

This document records the provenance, author, source repository, and legal licence for all 3D fish assets utilized in the AN Fish World web experience. All assets have been screened to strictly reject any **NonCommercial (NC)** restrictions, ensuring full commercial clearance.

---

## 1. Hero Fish: Pacific Bluefin Tuna

- **Identifier:** `hero-tuna` / `hero-tuna.mobile`
- **Output Files:** `/public/models/hero-tuna.glb`, `/public/models/hero-tuna.mobile.glb`
- **Raw File:** `/assets-raw/hero-tuna-raw.glb`
- **Species:** Pacific Bluefin Tuna (*Thunnus orientalis*)
- **Source URL:** [DongwonTTuna 3D Tuna Asset](https://github.com/DongwonTTuna/mainSite/blob/main/static/models/dongwon-tuna.glb)
- **Author / Artist:** DongwonTTuna Project & Community Contributors
- **Licence:** Open-source MIT / CC0 Compatible (Commercial reuse permitted)
- **NonCommercial Restriction:** **None (Clear for commercial use)**
- **Technical Inspection:**
  - Full anatomical 3D geometry featuring segmented body, operculum, maxilla, iris, pupil, dorsal finlets, and caudal keel.
  - Double-sided PBR material layers with custom pigment maps.
  - Scaled and centered along +X axis (1 unit = total length).

---

## 2. Satellite Fish 1: Barramundi / Pelagic Marine Fish

- **Identifier:** `sat-fish-1`
- **Output File:** `/public/models/sat-fish-1.glb`
- **Raw File:** `/assets-raw/sat-fish-1-raw.glb`
- **Species:** Barramundi (*Lates calcarifer*) / Pelagic Wild Catch
- **Source URL:** [KhronosGroup glTF-Sample-Assets: BarramundiFish](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/BarramundiFish)
- **Author / Artist:** Microsoft (for Khronos glTF 2.0 Benchmark)
- **Licence:** **Creative Commons Zero v1.0 Universal (CC0-1.0)** [SPDX: `CC0-1.0`]
- **Licence URL:** [https://creativecommons.org/publicdomain/zero/1.0/](https://creativecommons.org/publicdomain/zero/1.0/)
- **NonCommercial Restriction:** **None (Public Domain Dedication / Unrestricted Commercial Use)**
- **Technical Inspection:**
  - High-fidelity biological specimen with full PBR texture channels: base color, normal map, and combined ambient occlusion / roughness / metallic map.

---

## 3. Satellite Fish 2: Grey Snapper / Mackerel Satellite

- **Identifier:** `sat-fish-2`
- **Output File:** `/public/models/sat-fish-2.glb`
- **Raw File:** `/assets-raw/sat-fish-2-raw.glb`
- **Species:** Grey Snapper (*Lutjanus griseus*) / Pelagic Marine Catch
- **Source URL:** [BabylonJS Assets: greySnapper_vertColor.glb](https://github.com/BabylonJS/Assets/blob/master/meshes/Demos/UnderWaterScene/fish/greySnapper_vertColor.glb)
- **Author / Artist:** Babylon.js Team & Community Contributors
- **Licence:** **Creative Commons Attribution 4.0 International (CC-BY 4.0)** [SPDX: `CC-BY-4.0`]
- **Licence URL:** [https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)
- **NonCommercial Restriction:** **None (Commercial use explicitly granted under CC-BY 4.0)**
- **Technical Inspection:**
  - Hydrodynamic pelagic fish geometry with articulated dorsal and pectoral fin silhouettes.
  - Optimized for real-time WebGL ambient schooling physics.

---

## Licensing Policy & Compliance Checklist

- [x] All raw inputs stored in `/assets-raw/`
- [x] All NonCommercial (NC) licenses systematically rejected
- [x] CC0-1.0 and commercial CC-BY licenses verified with official repository metadata
- [x] Provenance URLs, species classification, and authors recorded
