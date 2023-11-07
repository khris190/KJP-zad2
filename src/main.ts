import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { TestExpresson, Type } from '@/ts/ExpressionHandlerV2'
new TestExpresson('asdfgh+*-*+', Type.Infix)

createApp(App).mount('#app')
