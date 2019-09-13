
require('./script/compatible');

var Vue = require('./lib/vue/vue');
var VueRouter = require('./lib/vue/vue-router');

Vue.use(VueRouter);

//在这里定义一些公用的变量或方法
var common = require('./script/common');
var service = require('./script/service');
var store = require('./script/store');
var routers = require('./script/routers');
var register = require('./script/register');

/***------------------------APP------------------*/
var APP = new Vue({
	router: new VueRouter({
		mode: 'hash',
		routes: routers()
	}),
	store: store,
	created: function () {
		var parameter = {};
        location.search.split('?').pop().split('&').forEach(i=>parameter[i.split('=')[0]]=i.split('=')[1]);
		common.root(this);
		//如果code和state存在就是微信登录，如果token已经存在就是已经登录过，否者跳转到登录页面
		if(parameter.token){
			service.login_byToken(parameter.token).then(()=>{
				location.href = location.href.split('?').shift();
			});
        }else if(!common.storage('token')){ 
			//如果token不存在就需要渠道登录页面
			this.$router.push({name:'login'});
		}
	},
	data: function () {
		return {
			transitionName: ''
		}
	},
	methods: {

	},
	template: `
		<div class="viewport">
			<transition :name="transitionName" mode="out-in">
				<router-view></router-view>
			</transition>
		</div>`,
}).$mount('#app');

