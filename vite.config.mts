import { defineConfig } from 'vite';
import { createViteLicensePlugin } from 'rollup-license-plugin';

export default defineConfig({
    test: {
        coverage: {
            all: true,
            include: ["src"],
            branches: 90,
            statements: 57,
            functions: 87,
            lines: 57,
        }
    },
    plugins: [createViteLicensePlugin()]
});
