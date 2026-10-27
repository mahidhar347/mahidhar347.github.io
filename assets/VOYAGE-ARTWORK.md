# Layered Thousand Sunny voyage artwork

The waterline-corrected v2 ship assets now supersede the original cutouts below.
Current ship files are `sunny-{front,rear}-{dawn,day,sunset,midnight}-v2.webp`.
The background plates remain v1. See `VOYAGE-WATERLINE-V2.md` for correction prompts
and measured waterline alignment. This document retains the original v1 provenance.

Built-in image generation produced the boat-free background plates and independently
relit transparent ship layers. These are AI-generated fan artworks, not official anime
assets or an exact simulation of sea conditions. No CSS colour filtering is used.

First-revision optimized assets are `assets/ocean-empty-{dawn,day,sunset,midnight}-v1.jpg`
and `assets/sunny-{front,rear}-{dawn,day,sunset,midnight}-v1.webp`.
Generated PNG masters are retained in `previews/voyage-moods-v1/`.
The existing approved day cutouts are in `previews/thousand-sunny-v1/`; the sunset
background plate is in `previews/boat-layers-v1/ocean-without-boat.png`.
Only optimized assets are copied to the deployment. WebP exports preserve alpha.

The original illustrated and realistic full-scene images are retained as fallbacks.
Prior identity-generation prompts are recorded in the respective preview READMEs.

## Exact mood-generation prompts

### ocean-dawn

Input edit target: /Users/mahi/Documents/Jobs/personal-website/assets/seascape-real-dawn-v1.png

Use case: precise-object-edit. Image 1 is the edit target. Prepare a boat-free background plate for layered website animation. Remove the entire sailing ship at lower-right, ALL its sails, mast, rigging, flag and hull, together with its distinctive foamy wake, ship shadow and reflections. Seamlessly reconstruct that area with natural continuous ocean waves and reflections matching surrounding water. Preserve precisely the original full landscape framing, camera, horizon, island geography, right cliff and arch, waterfall, vegetation, sun or moon, clouds, dawn lighting and photographic style. Do not recolor, relight, shift objects or alter the rest of the image. No boats anywhere, no water trails shaped like a boat, no text or watermark. Opaque single landscape background, same dimensions.

### ocean-day

Input edit target: /Users/mahi/Documents/Jobs/personal-website/assets/seascape-real-day-v1.png

Use case: precise-object-edit. Image 1 is the edit target. Prepare a boat-free background plate for layered website animation. Remove the entire sailing ship at lower-right, ALL its sails, mast, rigging, flag and hull, together with its distinctive foamy wake, ship shadow and reflections. Seamlessly reconstruct that area with natural continuous ocean waves and reflections matching surrounding water. Preserve precisely the original full landscape framing, camera, horizon, island geography, right cliff and arch, waterfall, vegetation, sun or moon, clouds, day lighting and photographic style. Do not recolor, relight, shift objects or alter the rest of the image. No boats anywhere, no water trails shaped like a boat, no text or watermark. Opaque single landscape background, same dimensions.

### ocean-midnight

Input edit target: /Users/mahi/Documents/Jobs/personal-website/assets/seascape-real-midnight-v1.png

Use case: precise-object-edit. Image 1 is the edit target. Prepare a boat-free background plate for layered website animation. Remove the entire sailing ship at lower-right, ALL its sails, mast, rigging, flag and hull, together with its distinctive foamy wake, ship shadow and reflections. Seamlessly reconstruct that area with natural continuous ocean waves and reflections matching surrounding water. Preserve precisely the original full landscape framing, camera, horizon, island geography, right cliff and arch, waterfall, vegetation, sun or moon, clouds, midnight lighting and photographic style. Do not recolor, relight, shift objects or alter the rest of the image. No boats anywhere, no water trails shaped like a boat, no text or watermark. Opaque single landscape background, same dimensions.

### sunny-front-dawn

Input edit target: /Users/mahi/Documents/Jobs/personal-website/previews/thousand-sunny-v1/thousand-sunny-anime-transparent-v1.png

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny front view cutout, the edit target. Create its dawn lighting variant for a layered website. Soft predawn illumination: cool diffuse skylight, faint pale peach rim light, subdued sail highlights, wood readable in soft low contrast. No direct midday light. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout.

### sunny-front-sunset

Input edit target: /Users/mahi/Documents/Jobs/personal-website/previews/thousand-sunny-v1/thousand-sunny-anime-transparent-v1.png

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny front view cutout, the edit target. Create its sunset lighting variant for a layered website. Natural low golden sunset light from the upper right. Physically consistent warm rim highlights on the right-facing sailcloth, wood and cabin, softer shaded left sides. No global orange wash. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout.

### sunny-front-midnight

Input edit target: /Users/mahi/Documents/Jobs/personal-website/previews/thousand-sunny-v1/thousand-sunny-anime-transparent-v1.png

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny front view cutout, the edit target. Create its midnight lighting variant for a layered website. Genuine dim moonlit exposure: silver moonlight from upper right on sails, railings and hull edges, dark timber and subdued red/yellow paint, a few tiny warm cabin windows or lanterns. No daylight-bright sails. Preserve readable silhouette, no blue global tint. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout.

### sunny-rear-dawn

Input edit target: /Users/mahi/Documents/Jobs/personal-website/previews/thousand-sunny-v1/thousand-sunny-rear-transparent-v1.png

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny rear view cutout, the edit target. Create its dawn lighting variant for a layered website. Soft predawn illumination: cool diffuse skylight, faint pale peach rim light, subdued sail highlights, wood readable in soft low contrast. No direct midday light. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout.

### sunny-rear-sunset

Input edit target: /Users/mahi/Documents/Jobs/personal-website/previews/thousand-sunny-v1/thousand-sunny-rear-transparent-v1.png

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny rear view cutout, the edit target. Create its sunset lighting variant for a layered website. Natural low golden sunset light from the upper right. Physically consistent warm rim highlights on the right-facing sailcloth, wood and cabin, softer shaded left sides. No global orange wash. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout.

### sunny-rear-midnight

Input edit target: /Users/mahi/Documents/Jobs/personal-website/previews/thousand-sunny-v1/thousand-sunny-rear-transparent-v1.png

Use case: lighting-weather. Image 1 is the exact approved Thousand Sunny rear view cutout, the edit target. Create its midnight lighting variant for a layered website. Genuine dim moonlit exposure: silver moonlight from upper right on sails, railings and hull edges, dark timber and subdued red/yellow paint, a few tiny warm cabin windows or lanterns. No daylight-bright sails. Preserve readable silhouette, no blue global tint. Preserve EXACTLY the same ship design, viewing angle, pose, framing, aspect ratio, dimensions, sail and flag shapes, rigging, lion figurehead or stern cannon positioning, deck structures and color identities. Change ONLY illumination, material shading and small light sources appropriate to the time. Keep the polished anime linework and cel shading; do not turn it into a generic pirate ship, toy or photoreal style. Remove isolated erroneous red/yellow/green fringe speckles outside the silhouette without removing legitimate painted ship colors. Truly transparent PNG alpha around the ship and between ropes, no matte, checkerboard, water, wake, sky, islands, ground or cast shadow. No new objects or people, no text or watermark. Single matching isolated ship cutout.
