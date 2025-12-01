import type { Plugin } from 'vite';

/**
 * Placeholder Vite plugin for meta images.
 * Does nothing, included so Vite config still works.
 */
export function metaImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-meta-images',
    transformIndexHtml(html) {
      // No-op
      return html;
    },
  };
}
