import fs from 'fs';
import path from 'path';
import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/background/index.ts',
    output: {
      file: 'dev/background/index.js',
      format: 'es',
    },
    plugins: getPlugins(true),
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/contentScript/index.ts',
    output: {
      file: 'dev/contentScript/index.js',
      format: 'iife',
    },
    plugins: getPlugins(),
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'rollup.unused.js',
    output: {
      file: 'dev/rollup.unused.js',
    },
    plugins: [
      symlinkPlugin(),
    ],
    watch: false,
    watch: {
      clearScreen: false,
    },
  },
];

function getPlugins(isBackground = false) {
  return [
    commonjs(),
    nodeResolve({
      browser: true,
    }),
    json({
      namedExports: false,
    }),
    ts({
      tsconfig: {
        resolveJsonModule: true,
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
      },
    }),
    replace({
      preventAssignment: true,
      'process.env.FOR_ENV': '"dev"',
      'process.env.IS_BACKGROUND': isBackground ? 'true' : 'false',
    })
  ];
}

function symlinkPlugin() {
  function symlinkSync(src, dst, type) {
    const absSrc = path.resolve(__dirname, src);
    const absDst = path.resolve(__dirname, dst);
    if (!fs.existsSync(absDst)) {
      fs.symlinkSync(absSrc, absDst, type);
    }
  }
  let done = false;
  return {
    name: 'symlink',
    buildStart() {
      if (done) {
        return;
      }
      symlinkSync('src/manifest.json', 'dev/manifest.json', 'file');
      symlinkSync('src/main/build', 'dev/main', 'dir');
      symlinkSync('src/asset', 'dev/asset', 'dir');
      done = true;
    },
  };
}
