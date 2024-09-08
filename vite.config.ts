import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
    return {
        build: {
            minify: true,
            sourcemap: true,
            lib: {
                entry: './src/index.ts',
                name: 'leaflet-webcomponent',
                fileName: (format) => `leaflet-webcomponent.${format}.js`,
            },
        },
        plugins: [
            dts({
                rollupTypes: true,
            }),
        ],
    };
});
