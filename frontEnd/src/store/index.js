import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import error from "./modules/error"

Vue.use(Vuex)

// A Vuex instance is created by combining the state, the actions,
// and the mutations. Because the actions and mutations are just
// functions that do not depend on the instance itself, they can
// be easily tested or even hot-reloaded (see counter-hot example).
export default new Vuex.Store({
  actions,
  getters,
  modules: {
    error
  }
})
