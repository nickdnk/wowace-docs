<script setup>
import { withBase } from 'vitepress'
const href = withBase('/api/ace-addon#creating-an-addon-object')
</script>

<template>
  <span class="embeddable">
    <span class="embeddable__chip" tabindex="0" role="note" aria-describedby="embeddable-tip">embeddable</span>
    <span id="embeddable-tip" class="embeddable__pop" role="tooltip">
      This library can be <strong>embedded</strong> into your addon as a mixin; list it when you
      create the addon and its methods become available directly on your addon object (called via <code>self</code>).
      <a :href="href">Creating an addon object →</a>
    </span>
  </span>
</template>

<style scoped>
.embeddable {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.embeddable__chip {
  display: inline-block;
  font-size: 11px;
  line-height: 1.4;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 5px 9px;
  border-radius: 999px;
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
  cursor: help;
  user-select: none;
}
.embeddable__pop {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: auto;
  z-index: 20;
  width: 300px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-elv, var(--vp-c-bg-soft));
  box-shadow: var(--vp-shadow-3);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  text-transform: none;
  letter-spacing: normal;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
}
.embeddable:hover .embeddable__pop,
.embeddable:focus-within .embeddable__pop {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.embeddable__pop a {
  display: inline-block;
  margin-top: 8px;
  font-weight: 600;
}
</style>
