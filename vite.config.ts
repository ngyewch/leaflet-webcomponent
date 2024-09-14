import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        minify: true,
        sourcemap: true,
        lib: {
            entry: './src/index.ts',
            name: 'leaflet-webcomponent',
            formats: ['es', 'umd', 'cjs'],
        },
    },
    plugins: [
        dts({
            rollupTypes: true,
        }),
    ],
});
