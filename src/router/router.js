import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('./views/index.vue'),
            meta: {
                title: '首页',
                showHeaderFooter: true
            }
        },
        {
            path: '/games',
            name: 'games',
            component: () => import('./views/games.vue'),
            meta: {
                title: '游戏合集',
                showHeaderFooter: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/login.vue'),
            meta: {
                title: '登录',
                showHeaderFooter: true
            }
        },
        {
            path: '/blocklyGame',
            name: 'blocklyGame',
            component: () => import('./views/blocklyGame.vue'),
            meta: {
                showHeaderFooter: false
            }
        }
    ]
})