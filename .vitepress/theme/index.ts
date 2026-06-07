import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import ApiMethod from './components/ApiMethod.vue'
import Embeddable from './components/Embeddable.vue'
import 'virtual:group-icons.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Wraps DefaultTheme.Layout to supply a custom themed 404.
  Layout,
  enhanceApp({ app }) {
    app.component('ApiMethod', ApiMethod)
    app.component('Embeddable', Embeddable)
  },
} satisfies Theme
