import vue from '@vitejs/plugin-vue'

export default defineNitroConfig({
  rollupConfig: {
    plugins: [
      vue()
    ]
  },
})