import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headNum: ""
  },
  mutations: {
    setHeadNum(state, num) {
      state.headNum = num
    },
  }
})