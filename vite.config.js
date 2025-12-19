import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // 相対パスでリソースを参照させる（GitHub Pages等でサブディレクトリ配置に対応）
    build: {
        outDir: 'docs', // 出力先ディレクトリ
        emptyOutDir: true, // ビルド時にディレクトリを空にする
        rollupOptions: {
            input: {
                main: 'index.html',
            },
        },
        minify: 'esbuild', // Minifyを有効化
    },
});
