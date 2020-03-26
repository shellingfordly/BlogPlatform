import Vue from 'vue'
import Router from 'vue-router'
import Initial from './views/Initial.vue'
import Home from './views/Home.vue'
import User from './views/User.vue'
import OtherUser from './views/OtherUser.vue'
import About from './views/About.vue'
import Login from './views/Login.vue'
import UserInformation from './views/UserInformation.vue'
import AddAriticle from './views/AddAriticle.vue'
import Article from './views/Article.vue'


Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'initial',
      component: Initial,
      meta: {
        title: 'myWeb'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/user',
      name: 'user',
      component: User,
    },
    {
      path: '/otherUser',
      name: 'otherUser',
      component: OtherUser,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/userInformation',
      name: 'userInformation',
      component: UserInformation
    },
    {
      path: '/addAriticle',
      name: 'addAriticle',
      component: AddAriticle
    },
    {
      path: '/article',
      name: 'article',
      component: Article
    }
  ]
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router