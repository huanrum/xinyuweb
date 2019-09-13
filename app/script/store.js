
var Vue = require('./../lib/vue/vue');
var Vuex = require('./../lib/vue/vuex');

Vue.use(Vuex);

//下面是定义状态管理
module.exports =  new Vuex.Store({
    state: {
        platform: null,
        appVersion:null
    },
    actions:{
        setAppVersion:function(state,version){
            state.commit("setAppVersion",version)
        }
    },
    mutations: {
        platform: function (state, platform) {
            state.platform = platform;
        },
        setAppVersion:function(state,version){
            state.appVersion=version;
        }
    }
});