import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Dashboard from './components/Dashboard.vue';
import Myfiles from './components/Myfiles.vue';
import { createPinia } from 'pinia'
import UsersList from './components/UsersList.vue';
const pinia = createPinia()

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    {
        path: '/dashboard', component: Dashboard, name: 'dashboard',
        children: [
            { path: '/files', component: Myfiles, name: 'my-files' },
            { path: '/users', component: UsersList, name: 'users' }
        ]
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(pinia).use(router).mount('#app')
