import * as esbuild from 'esbuild';
import path from 'node:path';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({path: path.resolve(process.cwd(), envFile)});

const define = {};

for (const k in process.env) {
  if (!/[()]/.test(k)) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k]);
  }
}

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/mitoman.js',
  platform: 'node',
  format: 'cjs',
  treeShaking: true,
  bundle: true,
  minify: true,
  keepNames: true,
  define,
  external: ['canvas', 'ssh2'],
});
