<template>
  <keep-alive>
    <component :is="currentComponent" :isDark="isDark" @change-page="navigateTo" />
  </keep-alive>
</template>

<script setup>
  // Runtime
  import devtools from '@vue/devtools'
  import { ref, computed, onMounted, defineAsyncComponent } from "vue";

  // Components
  const HomePage = defineAsyncComponent(() => import('./components/Home.vue'))
  const SettingsPage = defineAsyncComponent(() => import('./components/Settings.vue'))

  // CSS
  import 'element-plus/theme-chalk/dark/css-vars.css'
  import "utilities-css/dist/utilities-css.css"

  // Enable Vue Devtools on Development
  if (process.env.NODE_ENV === 'development') {
    devtools.connect()
  }

  // Track current component
  const component = ref('HomePage')

  const currentComponent = computed(() => {
    switch(component.value) {
      case 'HomePage':
        return HomePage
      case 'SettingsPage':
        return SettingsPage
      default:
        return HomePage
    }
  })

  const navigateTo = (name) => {
    // Validate Navigation
    if (!['HomePage', 'SettingsPage'].includes(name)) return;

    component.value = name
  }

  // Handle dark mode
  const isDark = ref(window.matchMedia("(prefers-color-scheme: dark)").matches)

  onMounted(async () => {
    const html = document.querySelector("html");

    if (isDark.value) html.setAttribute("class", "dark");

    // Listen for system theme change
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      const colorScheme = e.matches ? "dark" : "light";

      if (colorScheme === "dark") {
        // Set isDark value to true
        isDark.value = true

        // Set html class attribute
        html.setAttribute("class", "dark");
      } else {
        // Set isDark value to false
        isDark.value = false

        // Remove class attribute on html
        html.removeAttribute("class")
      }
    })
  })
</script>

<style scoped>

</style>
