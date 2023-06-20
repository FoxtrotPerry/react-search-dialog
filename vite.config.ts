import { defineConfig } from 'vite';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        port: 3232,
    },
    build: {
        manifest: true,
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: [
                resolve(__dirname, 'react-search-dialog/index.ts'),
                resolve(__dirname, 'react-search-dialog/Search.tsx'),
                resolve(__dirname, 'react-search-dialog/SearchButton.tsx'),
            ],
            name: 'react-search-dialog',
            fileName: (format, entryName) => `${entryName}.js`,
            formats: ['es'],
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                dir: 'dist',
                entryFileNames: '[name].js',
                format: 'es',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
            plugins: [
                typescriptPaths({
                    preserveExtensions: true,
                }),
                typescript({
                    sourceMap: false,
                    declaration: true,
                    outDir: 'dist',
                }),
                visualizer({
                    gzipSize: true,
                    filename: 'rsd-bundle-analysis.html',
                }),
            ],
        },
    },
});
