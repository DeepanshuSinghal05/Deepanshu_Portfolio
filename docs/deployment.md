# Production deployment

This is a client-rendered Vite/React static site. No hosting provider, production domain, credentials or deployment pipeline is configured in this workspace. No public deployment was performed.

1. Use a Node version supported by the installed Vite release (Node 20.19+ or 22.12+). Run `npm ci`.
2. Optionally copy `.env.example` to `.env.production` and set `VITE_SITE_URL` to your actual HTTPS root URL, ending in `/`. It is public metadata, not a secret. When absent, the build deliberately omits canonical/og:url tags. A configured build was checked with an example domain solely as a test.
3. Run `npm run build`. Upload the contents of `dist/` to the host's web root. Do not upload `src/`, `project_story_assets/`, `artifacts/`, tests or `.env` files. The character is already emitted as a fingerprinted asset under `dist/assets/`.
4. Serve `.glb` as `model/gltf-binary` (a binary octet-stream also works with GLTFLoader), `.js` as JavaScript, `.css` as CSS and `.woff2` as font/woff2. Serve asset files before the SPA fallback; missing assets must return 404 rather than HTML.
5. Use `Cache-Control: public, max-age=31536000, immutable` for fingerprinted `/assets/*`. Use revalidation for `index.html` and a shorter cache/revalidation for unversioned `/images`, `/worlds`, `/experience`, `/resume` and favicon files. Local Vite preview intentionally uses `no-cache`; it does not configure your hosting cache.
6. This build assumes deployment at `/`. Existing assets use absolute root paths. Subdirectory hosting needs a separate base-path pass; changing Vite `base` alone is insufficient.
7. Query/hash entries such as `?section=contact`, `?section=experience`, `?project=yatralok` and `#selected-work` resolve through the root document. Configure fallback to `index.html` for navigation if required by your host.
8. Before switching a domain, run `npm run preview -- --host 127.0.0.1 --port 4173`, then `node scripts/verify-final-avatar.mjs`. For browser tests use a running dev server and `npm run test:e2e`; development diagnostics intentionally are not shipped in the production bundle.
9. After deployment, check HTTPS, canonical/social URLs, the GLB response, image responses, résumé download, keyboard navigation, reduced motion, mobile touch scrolling, and the complete forward/reverse journey on the actual public origin. Check a physical iOS/Safari and Android device; desktop viewport emulation does not establish their GPU memory or touch performance.

There is no backend, contact form service, analytics key, webcam permission or runtime secret required by the portfolio. Email uses the existing `mailto:` link. External project/profile destinations remain those from the approved content.
