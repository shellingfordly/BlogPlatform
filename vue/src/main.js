import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/index.styl'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';
import './assets/css/iconfont.css';
import HighLight from './assets/js/highlight'
import marked from "marked";
marked.setOptions({
  highlight: function (code) {
    return require("highlight.js").highlightAuto(code).value;
  }
});

Vue.use(HighLight);
Vue.use(vuescroll);
Vue.use(ElementUI);

Vue.prototype.marked = marked

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')