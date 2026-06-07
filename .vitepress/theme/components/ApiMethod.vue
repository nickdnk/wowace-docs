<script setup>
defineProps({
  kind: { type: String, default: 'method' }, // 'method' | 'callback'
  anchor: { type: String, default: '' },     // slug of the (hidden) heading
})
</script>

<template>
  <div class="api-method">
    <div class="api-method__top">
      <span class="api-method__badge" :class="kind">{{ kind }}</span>
      <a
        v-if="anchor"
        class="api-method__anchor"
        :href="'#' + anchor"
        aria-label="Permalink to this entry"
      >#</a>
    </div>
    <!-- Slot: ```lua signature, description, **Parameters** / **Returns** markdown. -->
    <div class="api-method__body"><slot /></div>
  </div>
</template>

<style scoped>
.api-method {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 14px 18px 16px;
  margin: 14px 0 26px;
  background: var(--vp-c-bg-soft);
}
.api-method__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.api-method__badge {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
}
.api-method__badge.callback { background: #8b5cf6; }
.api-method__anchor {
  color: var(--vp-c-brand-1);
  font-weight: 700;
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.2s;
}
.api-method:hover .api-method__anchor,
.api-method__anchor:focus { opacity: 1; }
.api-method__body :deep(div[class*='language-']:first-child) { margin-top: 0; }
.api-method__body :deep(:last-child) { margin-bottom: 0; }
/* Params/returns tables sit flush; keep VitePress's scrollable block table
   (display:block + overflow-x:auto) so wide tables don't overflow on mobile. */
.api-method__body :deep(table) { margin: 12px 0 0; }

/* On mobile VitePress full-bleeds code blocks with negative side margins,
   which would spill past the card border. Keep them inside the card. */
@media (max-width: 639px) {
  .api-method :deep(div[class*='language-']) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 8px;
  }
}
</style>
