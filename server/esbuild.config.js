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

// esbuild.build({
//   entryPoints: ['src/server.js'],  // main entry
//   bundle: true,
//   platform: 'node',                // Node.js environment
//   target: ['node20'],              // match your Docker Node version
//   outfile: 'dist/server.js',       // single output file
//   minify: isProd,
//   sourcemap: !isProd,
//   plugins: [nodeExternalsPlugin()], // exclude node_modules (bcrypt, mongoose, etc.)
//   define: {
//     'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
//   },
// }).then(() => {
//   console.log('✅ Backend built successfully');
// }).catch(() => process.exit(1));