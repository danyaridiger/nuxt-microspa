// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  modules: ["@pinia/nuxt"],
  css: ["bootstrap/dist/css/bootstrap.min.css", "~/assets/scss/main.scss"],
  imports: {
    autoImport: true,
    dirs: ["stores"],
  },
  app: {
    head: {
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
          tagPosition: "bodyClose",
        },
      ],
    },
  },
  nitro: {
    preset: "node-server",
  },
});
