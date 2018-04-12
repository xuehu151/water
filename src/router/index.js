import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login/Login';
import Home  from '@/components/Home/Home';
import EleScreen from '@/components/EleScreen/EleScreen.vue';
Vue.use (Router);
export default new Router ({
    // mode: 'history',
    routes : [
        {
            path : '/',
            name : 'Login',
            component : Login,
        },
        {
            path : '/home',
            name : 'Home',
            component : Home,
            children : Home.children
        },
        {
            path : '/screen',
            name : 'EleScreen',
            component : EleScreen
        }
    ],
});

