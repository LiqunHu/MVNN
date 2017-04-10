import * as types from './mutation-types'

// 设置错误
export const setError = ({ commit }, errCode, errMsg) => {
    commit(types.SET_ERROR, {errCode: errCode, errMsg: errMsg})
}
