import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

const isProd = process.env.NODE_ENV === 'production';

esbuild.build({
  entryPoints: ['src/server.js'],
  bundle: true,
  platform: 'node',
  target: ['node20'],
  outfile: 'dist/server.js',
  format: 'esm',              // ← add this
  minify: isProd,
  sourcemap: !isProd,
  plugins: [nodeExternalsPlugin()],
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
  },
}).then(() => {
  console.log('✅ Backend built successfully');
}).catch(() => process.exit(1));