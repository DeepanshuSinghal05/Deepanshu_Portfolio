import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const siteUrl=loadEnv(mode,'.','VITE_').VITE_SITE_URL?.trim();
  const canonical=siteUrl?new URL(siteUrl):undefined;
  if(canonical&&!['https:','http:'].includes(canonical.protocol))throw new Error('VITE_SITE_URL must be an HTTP(S) URL.');
  return {
  plugins: [react(),{name:'portfolio-metadata',transformIndexHtml(html:string){
    if(!canonical)return html;
    const url=canonical.href.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    return html.replace('content="/images/deepanshu-avatar.png"',`content="${new URL('images/deepanshu-avatar.png',canonical).href}"`).replace('</head>',`<link rel="canonical" href="${url}" /><meta property="og:url" content="${url}" /></head>`);
  }}],
  // Playwright rewrites locked trace files on Windows; generated evidence is not source.
  server: { watch: { ignored: ['**/playwright-report/**', '**/test-results/**', '**/artifacts/**'] } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/three/')) return 'three';
          if (id.includes('/gsap/') || id.includes('/lenis/')) return 'motion';
        },
      },
    },
  },
};});
