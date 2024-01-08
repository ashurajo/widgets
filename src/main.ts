import { createApp } from 'vue'
import dayjs from 'dayjs'
import 'element-plus/dist/index.css'
import 'animate.css'
import { WidgetJsPlugin } from '@widget-js/vue3'
import '@widget-js/vue3/dist/style.css'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import ElementPlus from 'element-plus'
import './index.css'
import router from './router'
import 'dayjs/locale/zh-cn.js'
import App from './App.vue'
import 'virtual:uno.css'

dayjs.locale('cn')

const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus)
app.use(WidgetJsPlugin)
app.use(MotionPlugin)
app.use(router)
app.use(pinia)
app.mount('#app')
