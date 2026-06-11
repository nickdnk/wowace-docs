<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import NotFound from './components/NotFound.vue'
import { onMounted, onUnmounted } from 'vue'

const { Layout } = DefaultTheme

let debounceTimer = 0
let hashNavAt = 0

function updateHash() {
  if (Date.now() - hashNavAt < 1000) return
  const active = document.querySelector<HTMLAnchorElement>('.outline-link.active')
  if (!active?.hash) {
    if (location.hash) history.replaceState(null, '', location.pathname)
    return
  }
  if (active.hash === location.hash) return
  history.replaceState(null, '', active.hash)
}

function onScroll() {
  clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(updateHash, 200)
}

function onHashChange() { hashNavAt = Date.now() }

onMounted(() => {
  setTimeout(() => window.addEventListener('scroll', onScroll, { passive: true }), 1000)
  window.addEventListener('hashchange', onHashChange)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('hashchange', onHashChange)
  clearTimeout(debounceTimer)
})
</script>

<template>
  <Layout>
    <!-- Custom themed 404 in place of VitePress's default. -->
    <template #not-found>
      <NotFound />
    </template>
  </Layout>
</template>
