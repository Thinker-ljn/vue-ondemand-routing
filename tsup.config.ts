import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    plugin: 'src/plugin.ts',
    hooks: 'src/client-code/hooks.ts',
    emitter: 'src/client-code/emitter.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  external: [
    'vue-ondemand-routing/emitter',
    'vue-ondemand-routing/hooks',
    'vue-ondemand-routing/auto-routes',
  ],
  onSuccess: 'cp ./src/*.d.ts ./dist',
})
