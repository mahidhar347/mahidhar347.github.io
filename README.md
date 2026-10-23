# Personal portfolio

A One Piece inspired static portfolio prepared for GitHub Pages, featuring original anime seascape artwork, a bounty poster, a career voyage log, an interactive Log Pose navigation map, and motion that respects reduced-motion preferences. Open `index.html` in a browser to preview it. No installation or build step is needed. Google Fonts supplies the typography; system fonts act as fallbacks. Artwork and prompt details are documented in `ASSETS.md`.

## Personalize before publishing

Content is personalized from S Mahidhar’s supplied network engineering résumé. Review the experience dates, achievements, email, and LinkedIn before publishing. The phone number and original résumé PDF are intentionally not included in the website files. Add a GitHub profile link once the username is available.

## Publish on GitHub Pages

1. Create a public repository named `mahidhar347.github.io` for the personal homepage. Check for an existing repository before creating it; preserve existing content if one exists.
2. Upload only the contents of this `personal-website` folder to the repository root. Include `.nojekyll`.
3. In the repository, open **Settings → Pages**.
4. Choose **GitHub Actions** as the publishing source. The included `.github/workflows/deploy.yml` publishes the website automatically on pushes to `main`.
5. Run the publishing workflow from the Actions tab if the initial push happened before Pages was enabled. After a successful deployment, the expected homepage is `https://mahidhar347.github.io/`.

## Animation controls

## Hourly ocean moods

Automatic mode rotates Dawn Voyage, Grand Line, Golden Sunset, and Midnight Seas at each India Standard Time hour boundary, repeating every four hours. Everyone in automatic mode sees the same mood. An open page updates without a reload and resynchronizes when brought back into focus. The Ocean Mood selector can pin a mood; that preference is saved on the visitor's device when storage is available. Select Automatic to resume rotation. Palettes, original seascape lighting, and midnight stars change together; profile content stays consistent. Reduced-motion preferences remove transitions. No hourly server job or GitHub commit is required.

The page includes cursor-responsive ocean movement and compass rotation, floating light particles, subtle perspective tilt on cards, and a ship that follows scroll progress through the career section. All decorative motion can be paused with the fixed control. Reduced-motion system preferences disable these effects by default. Pointer effects run only for fine pointers.

## Verification

## Weather and cinematic audio

Live weather is the default for new visitors; earlier manually pinned moods are preserved. Hourly rotation and fixed moods remain selectable. Open-Meteo supplies modeled current conditions for Bengaluru, refreshed every 15 minutes while weather mode is active. Rain, snow, mist, cloud, and wind visuals follow WMO codes; strong wind begins at 30 km/h. API failures, invalid units, or data more than two hours from the current clock revert to hourly themes and stop weather audio.

Weather & sound opens controls for Bengaluru or optional browser geolocation. Visitor coordinates are rounded to one decimal degree and used in memory only, with a clear notice before permission is requested. They are sent only to Open-Meteo, not to GitHub or a tracking service. The displayed location is “Your area.” The original portfolio's Bengaluru label continues to describe Mahidhar's professional home, not the visitor.

Sound is opt-in each visit, synthesized locally with Web Audio: low ocean surf, band-limited wind, rain, and occasional low-pass thunder. It starts at 35% adjustable volume with output compression. It pauses in background tabs, stops on leaving weather mode or page navigation, and never records audio. Reduced-motion and Pause Motion suppress weather particles and mist; there are no lightning flashes. Audio cannot be verified by appearance alone; listen at a comfortable volume on the target device.

Data documentation and attribution: https://open-meteo.com/en/docs

The site is deployed at https://mahidhar347.github.io/ through GitHub Actions. Run regression checks with `node --test tests/*.test.cjs` from this folder. Tests cover weather mapping, forecast failures and stale data, hourly scheduling, pinned themes, asynchronous sound toggles, and background audio suspension. Public-site browser checks include desktop and mobile layouts, modal navigation, weather retrieval, theme selection and audio controls. Audio quality still needs human listening on the target device.

Mobile Ocean Controls expands on demand, keeping content clear. All fixed phone controls have 44px targets; the weather panel closes back to its launcher. Weather filters preserve night lighting. New forecasts show a loading status before falling back on failure. Page-sharing metadata and an original compass favicon are included.

Deployments run `node build.cjs` to create `_site/`. Every local stylesheet, script, and favicon gets a content hash in its URL so updated pages cannot accidentally use older cached code. The original source still opens directly for local previews. No dependencies need to be installed. Build artifacts, source tests, and original full-resolution artwork are excluded from the public deployment.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Audio-only background music

Ocean controls → Play background music starts The Buccaneer's Haul by Shane Ivers, sourced from Silverman Sound Studios under CC BY 4.0. This is pirate-adventure background music, not an official One Piece recording. Attribution and provenance are in `assets/MUSIC-LICENSE.md` and displayed by the music controls. The soundtrack is served with the site in AAC/M4A format, loops, and has pause and volume controls. There is no video or third-party player. Only volume is remembered; playback starts after the visitor clicks Play. It pauses when the tab is hidden, on navigation, or when weather ambience is enabled. Playing music mutes weather ambience.
# Live ocean scene

The hero uses Three.js 0.180.0 (loaded from jsDelivr) to render wave geometry,
a curved sailing-ship hull, wind-billowed sails, distant cliffs, and a continuously
flowing waterfall with spray. CPU buoyancy samples the same wave parameters as
the ocean vertex shader. Mood changes alter scene lighting rather than filtering
the artwork. The original illustration is retained if WebGL or the CDN fails.
Motion-off freezes the scene; hidden tabs and an offscreen hero suspend rendering.
The canvas is decorative and does not replace any accessible portfolio content.

