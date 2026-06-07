<script setup lang="ts">
import { withBase } from 'vitepress'

const home = withBase('/')
const start = withBase('/getting-started')
</script>

<template>
  <div class="nf">
    <p class="nf-code">404</p>
    <h1 class="nf-title">You've wandered off the map</h1>
    <p class="nf-quote">This page doesn't exist; it may have been moved or renamed.</p>
    <div class="nf-actions">
      <a class="nf-link" :href="home">Take me home</a>
      <a class="nf-link nf-link--alt" :href="start">Getting started</a>
    </div>
  </div>
</template>

<style scoped>
.nf {
  text-align: center;
  padding: 96px 24px 128px;
}
.nf-code {
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  color: var(--vp-c-brand-1);
  letter-spacing: 2px;
}
.nf-title {
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0 8px;
  border: none;
}
.nf-quote {
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
}
.nf-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.nf-link {
  display: inline-block;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  transition: opacity 0.2s;
}
.nf-link:hover {
  opacity: 0.85;
}
.nf-link--alt {
  background: transparent;
  color: var(--vp-c-brand-1);
}
</style>
