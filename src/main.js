// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import service from './public/server.js';
import store from '@/public/store';
import AMap from 'vue-amap';

Vue.prototype.$http = service;
Vue.config.productionTip = false; //设置为 false 以阻止 vue 在启动时生成生产提示
Vue.use (ElementUI);
Vue.use (AMap);

router.beforeEach ((to, from, next) => { //拦截器
    if (to.path === '/' || to.path === '/screen') {
        next ();
    }
    else {
        if (!sessionStorage.getItem ('userInfo')) {
            router.replace ('/');
        }
        else {
            next ();
        }
    }
});

AMap.initAMapApiLoader ({ //地图配置
    key : '943f4b880449c4e4d9ebd29f26e997a0',
    plugin : ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});

new Vue ({
    el : '#app',
    router,
    store,
    components : {
        App
    },
    template : '<App/>',
});
