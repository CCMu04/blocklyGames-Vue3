import {createApp} from 'vue';
import App from './App.vue';

const app = createApp(App);

import axios from 'axios';

app.config.globalProperties.$axios = axios;

import router from './router/router';

router.beforeEach((to, from, next) => {
    if (to.meta.title !== undefined)
        document.title = to.meta.title;
    next();
})
app.use(router);

import ElementPlus, {ElMessage} from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'

app.use(ElementPlus);

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {myLocalStorage} from "@/store/myLocalStorage";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app');