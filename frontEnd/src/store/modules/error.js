/**
 * Created by  on 2016/4/1.
 */
import * as types from '../mutation-types'

const state  = {
		errCode: "",
		errMsg: ""
}

// mutations
const mutations = {
    [types.SET_ERROR] (state, {errCode, errMsg}) {
      state.errCode = errCode
      state.errMsg = errMsg
    }
}

export default {
    state,
    mutations
}
