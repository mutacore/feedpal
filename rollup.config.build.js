import ts from 'rollup-plugin-ts';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/background/index.ts',
    output: {
      file: 'build/background/index.js',
      format: 'es',
    },
    plugins: getPlugins(true),
  },
  {
    input: 'src/contentScript/index.ts',
    output: {
      file: 'build/contentScript/index.js',
      format: 'iife',
    },
    plugins: getPlugins(),
  },
  {
    input: 'rollup.unused.js',
    output: {
      file: 'unused/copy.js',
    },
    plugins: [
      copy({
        targets: [
          {
            src: 'src/manifest.json',
            dest: 'build',
          },
          {
            src: 'src/asset/*',
            dest: 'build/asset',
          },
          {
            src: 'src/main/build/*',
            dest: 'build/main',
          },
        ],
      }),
    ],
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
      'process.env.FOR_ENV': '"prod"',
      'process.env.IS_BACKGROUND': isBackground ? 'true' : 'false',
    }),
    terser(),
  ];
}
