import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    throttle(fn, delay) {
      let start = 0
      return function (...args) {
        let now = new Date()
        if (now - start >= delay) {
          fn.call(this, ...args)
          start = now
        }
      }
    }
  },
  mutations: {}
})