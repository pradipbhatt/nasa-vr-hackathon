// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    react(), // Required for React/JSX support
    glsl({
      include: ['**/*.glsl', '**/*.vs', '**/*.fs'], // Include shader file extensions
      watch: true, // Enable HMR for shader files during development
      minify: process.env.NODE_ENV === 'production', // Minify shaders in production only
      sourcemap: true, // Generate sourcemaps for debugging
      warnDuplicatedImports: false, // Avoid warnings for duplicated shader imports
    }),
  ],
  assetsInclude: ['**/*.glsl'], // Ensure Vite treats .glsl files as assets
});