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

The page includes cursor-responsive ocean movement and compass rotation, floating light particles, subtle perspective tilt on cards, and a ship that follows scroll progress through the career section. All decorative motion can be paused with the fixed control. Reduced-motion system preferences disable these effects by default. Pointer effects run only for fine pointers.

## Verification

JavaScript syntax, HTML section links, unique IDs, and local asset references have been checked. A visual browser check is still needed: the in-app browser blocked local file previews during development. GitHub publishing requires account access and a successful Pages deployment; the expected address above is not a claim that the site is live.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
