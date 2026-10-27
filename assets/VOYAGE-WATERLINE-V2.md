# Thousand Sunny waterline correction v2

Built-in image generation corrected the approved front/rear fan-art sprites for
normal sailing draft and a lower viewing angle; six independent relighting edits
preserve those corrected views for dawn, sunset and midnight. Day is the base.
PNG masters are saved in `previews/waterline-v2/` and alpha-preserving optimized
WebP files in `assets/sunny-{front,rear}-{dawn,day,sunset,midnight}-v2.webp`.
The previous assets remain preserved; the ocean plates are unchanged.

## Projection and anchoring

- Sprite center, not its left edge, is the route anchor.
- Apparent size is inverse distance. Contact height above the horizon uses the same scale.
- Outbound displacement is up/right to agree with the rear sprite; return is down/left.
- Each asset's trailing alpha padding is measured before anchoring the contact foam.
- Wake direction reverses on return and fades as the vessel slows at each turn.
- This is a perspective-aware 2D animation, not a full 3D fluid or buoyancy solver.

Physics/reference background:
[Archimedes and floating draft](https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy).
The artwork represents a partly submerged vessel; no displaced volume is calculated.

## Measured alpha bounds (optimized assets)

```json
{
  "sunny-front-day-v2.webp": {
    "width": 740,
    "height": 768,
    "bottom": 736,
    "gap": 0.040364583333333336
  },
  "sunny-rear-day-v2.webp": {
    "width": 740,
    "height": 768,
    "bottom": 735,
    "gap": 0.041666666666666664
  },
  "sunny-front-dawn-v2.webp": {
    "width": 740,
    "height": 768,
    "bottom": 738,
    "gap": 0.037760416666666664
  },
  "sunny-front-sunset-v2.webp": {
    "width": 740,
    "height": 768,
    "bottom": 737,
    "gap": 0.0390625
  },
  "sunny-front-midnight-v2.webp": {
    "width": 740,
    "height": 768,
    "bottom": 739,
    "gap": 0.036458333333333336
  },
  "sunny-rear-dawn-v2.webp": {
    "width": 740,
    "height": 768,
    "bottom": 739,
    "gap": 0.036458333333333336
  },
  "sunny-rear-sunset-v2.webp": {
    "width": 740,
    "height": 768,
    "bottom": 738,
    "gap": 0.037760416666666664
  },
  "sunny-rear-midnight-v2.webp": {
    "width": 740,
    "height": 768,
    "bottom": 749,
    "gap": 0.0234375
  }
}
```

## Exact generation prompts

### front daylight correction

Use case: precise-object-edit / identity-preserve. Image 1 is the approved Thousand Sunny fan-art ship design. Correct this asset for BELIEVABLE SAILING, not a floating display-model cutout. Keep the exact recognizable Sunny design, colors, lion bow, domed cabins, masts, sails and rigging; polished detailed anime cel shading. Camera is now only 7 degrees ABOVE the sea horizon, not the previous high isometric/product view. Show the front three-quarter view: bow nearest viewer toward LOWER LEFT, stern receding toward UPPER RIGHT. The lion figurehead and Straw Hat sail remain recognizable. Upright masts, coherent perspective, no arbitrary image tilt. CRITICAL WATERLINE: depict ONLY the portion of the vessel naturally ABOVE water when floating at normal sailing draft. Lower underwater hull/keel MUST NOT be shown. Give the visible hull a clean, almost horizontal waterline silhouette (with correct perspective), suggesting displacement into a flat sea plane, not an entire rounded hull hanging in air. Adjust the perspective and visible draft coherently; do not simply chop through the stern cannon or deck structures. A very narrow attached white contact-foam rim is acceptable, but NO sea patch, no oval shadow, no long wake. Neutral daylight suitable for later relighting. Frame whole visible ship including every mast/flag tip with generous space, keep front azimuth and heading as stated. True transparent alpha around the ship and through rigging gaps, no colored fringe speckles, no matte, no sky, no ocean backdrop, no ground, no crew, no text or watermark. Output a single clean transparent ship cutout at realistic sailing waterline.

### rear daylight correction

Use case: precise-object-edit / identity-preserve. Image 1 is the approved Thousand Sunny fan-art ship design. Correct this asset for BELIEVABLE SAILING, not a floating display-model cutout. Keep the exact recognizable Sunny design, colors, lion bow, domed cabins, masts, sails and rigging; polished detailed anime cel shading. Camera is now only 7 degrees ABOVE the sea horizon, not the previous high isometric/product view. Show the stern three-quarter view: stern nearest viewer, bow receding diagonally toward the UPPER RIGHT. The round Coup de Burst stern opening stays ABOVE the natural waterline; the bow lion remains far away and largely occluded. Upright masts, coherent perspective, no arbitrary image tilt. CRITICAL WATERLINE: depict ONLY the portion of the vessel naturally ABOVE water when floating at normal sailing draft. Lower underwater hull/keel MUST NOT be shown. Give the visible hull a clean, almost horizontal waterline silhouette (with correct perspective), suggesting displacement into a flat sea plane, not an entire rounded hull hanging in air. Adjust the perspective and visible draft coherently; do not simply chop through the stern cannon or deck structures. A very narrow attached white contact-foam rim is acceptable, but NO sea patch, no oval shadow, no long wake. Neutral daylight suitable for later relighting. Frame whole visible ship including every mast/flag tip with generous space, keep rear azimuth and heading as stated. True transparent alpha around the ship and through rigging gaps, no colored fringe speckles, no matte, no sky, no ocean backdrop, no ground, no crew, no text or watermark. Output a single clean transparent ship cutout at realistic sailing waterline.

### sunny-front-dawn

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny front view cutout, the edit target. Create its dawn lighting variant for a layered website. Soft predawn illumination: cool diffuse skylight, faint pale peach rim light, subdued sail highlights, wood readable in soft low contrast. No direct midday light. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout. Preserve the corrected low camera angle and normal sailing draft: the submerged lower hull stays invisible. Keep the narrow waterline contact foam attached; adjust its illumination naturally. Do not restore the display-model keel or change the ship perspective.

### sunny-front-sunset

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny front view cutout, the edit target. Create its sunset lighting variant for a layered website. Natural low golden sunset light from the upper right. Physically consistent warm rim highlights on the right-facing sailcloth, wood and cabin, softer shaded left sides. No global orange wash. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout. Preserve the corrected low camera angle and normal sailing draft: the submerged lower hull stays invisible. Keep the narrow waterline contact foam attached; adjust its illumination naturally. Do not restore the display-model keel or change the ship perspective.

### sunny-front-midnight

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny front view cutout, the edit target. Create its midnight lighting variant for a layered website. Genuine dim moonlit exposure: silver moonlight from upper right on sails, railings and hull edges, dark timber and subdued red/yellow paint, a few tiny warm cabin windows or lanterns. No daylight-bright sails. Preserve readable silhouette, no blue global tint. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout. Preserve the corrected low camera angle and normal sailing draft: the submerged lower hull stays invisible. Keep the narrow waterline contact foam attached; adjust its illumination naturally. Do not restore the display-model keel or change the ship perspective.

### sunny-rear-dawn

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny rear view cutout, the edit target. Create its dawn lighting variant for a layered website. Soft predawn illumination: cool diffuse skylight, faint pale peach rim light, subdued sail highlights, wood readable in soft low contrast. No direct midday light. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout. Preserve the corrected low camera angle and normal sailing draft: the submerged lower hull stays invisible. Keep the narrow waterline contact foam attached; adjust its illumination naturally. Do not restore the display-model keel or change the ship perspective.

### sunny-rear-sunset

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny rear view cutout, the edit target. Create its sunset lighting variant for a layered website. Natural low golden sunset light from the upper right. Physically consistent warm rim highlights on the right-facing sailcloth, wood and cabin, softer shaded left sides. No global orange wash. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout. Preserve the corrected low camera angle and normal sailing draft: the submerged lower hull stays invisible. Keep the narrow waterline contact foam attached; adjust its illumination naturally. Do not restore the display-model keel or change the ship perspective.

### sunny-rear-midnight

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny rear view cutout, the edit target. Create its midnight lighting variant for a layered website. Genuine dim moonlit exposure: silver moonlight from upper right on sails, railings and hull edges, dark timber and subdued red/yellow paint, a few tiny warm cabin windows or lanterns. No daylight-bright sails. Preserve readable silhouette, no blue global tint. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout. Preserve the corrected low camera angle and normal sailing draft: the submerged lower hull stays invisible. Keep the narrow waterline contact foam attached; adjust its illumination naturally. Do not restore the display-model keel or change the ship perspective.
