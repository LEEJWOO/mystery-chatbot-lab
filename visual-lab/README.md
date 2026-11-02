# Dynamic SVG Scene Lab (2026-11-02)

Experimental branch based on `fix/mystery-hub-stabilization-20261101`. **Not deployed.** Existing MysteryTestHub gameplay and production Worker remain unchanged.

## Files
- `MysteryVisualProbe.jsx`: UUMMAI component for text animation, moving path, incident diagram, evidence network, optional HTTPS background/portrait, optional Worker SVG image.
- `worker/visual_route.mjs`: isolated public `/visual/v1/health` and `/visual/v1/scene.svg?type=text|route|incident|evidence`.
- `lab13/src/worker.mjs` (branch only): new route imported and dispatched ahead of the existing hub routes.

## UUMMAI registration
Register component as `MysteryVisualProbe`, then show `<MysteryVisualProbe />`. Do **not** replace existing `MysteryTestHub` registration. To check server SVG after deployment, set `workerBase` to the validated HTTPS Worker origin.

## Limits and cautions
- No Base64 art, no fallback character art, no external `fetch`, no `localStorage`.
- HTML external `img` for art; inline SVG for non-image overlays and motion.
- The Worker route is a public sample test; never send private notes or spoiler data in URL queries.
- Check UUMMAI support for SMIL `animateMotion`, ticker, nested SVG and animated external SVG separately. GitHub branch integration is **not** proof of live deployment.

The more complete independently built `MysteryVisualLab.jsx` (with VISUAL_SCENE_V1 state contract and tests) is supplied separately in the user-facing ZIP artifact for importing into the visual redesign stage.
