<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import NotFound from './components/NotFound.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!-- Custom themed 404 in place of VitePress's default. -->
    <template #not-found>
      <NotFound />
    </template>
  </Layout>
</template>
