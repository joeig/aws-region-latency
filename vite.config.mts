import { defineConfig } from 'vite';
import { createViteLicensePlugin } from 'rollup-license-plugin';

export default defineConfig({
    plugins: [createViteLicensePlugin()]
});
