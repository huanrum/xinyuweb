
var common = require('../common');
var service = require('../service');

var changepassword = require('./main/components/changepassword');

var home = require('./main/home');
var detail = require('./main/detail');

/**
 * 承载所有页面的容器
 */
module.exports = {
    routers: [
        { name: 'home', path: '/home', component: home, children: home.routers },
        { name: 'detail', path: '/detail', component: detail },
    ],
    components: {
        changepassword: changepassword
    },
    template: `<div class="home-page">
                    <div class="header">
                        <span  @click="godefault"><logo></logo></span>
                        <span class="right">
                            <a tabIndex="1">
                                <img src="source/images/main/image.png"  @click="account">
                            </a>
                            <a tabIndex="1">
                                <span  @click="logout">[退出]</span>
                            </a>
                        </span>
                    </div>
                    <div class="right-page" :style="{maxHeight:height}">
                        <div class="content" ref="content">
                            <transition :name="transitionName" mode="out-in">
                                <router-view></router-view>
                            </transition>
                        </div>
                        <changepassword v-show="showChangePassword" @oncancel="account"></changepassword>
                    </div>
                </div>`,
    data: function () {
        return {
            height: '',
            username:common.account().name || common.storage('username') || '  ',
            transitionName: '',
            routers: [],
            showChangePassword: false
        }
    },
    created:function(){
        if(common.storage('token')){
            /**
             * 如果没有选中页面就进入第一个菜单
             */
            if(!/#\/.+/.test(location.hash)){
                this.$router.push({name:'landing'});
            }
            common.account(()=>{
                this.username = common.account().name || common.storage('username') || '  ';
            });
        }else {
            this.$router.push({name:'login'});
        }
    },
    mounted :function(){
        this.resize();
        window.addEventListener('resize', this.resize);
    },
    destroyed () {
        window.removeEventListener('resize', this.resize);
    },
    methods: {
        resize:function(){
            this.$refs.content.style.minHeight = window.innerHeight - 140 + 'px';
        },
        path:function(){
            var paths = this.$route.path.split('/');
            var result = [];
            for(var i=0;i<paths.length;i++){
                var find = this.routers.filter(r=>r.path === paths.slice(0,i+1).join('/'));
                if(find.length){
                    result.push(find.pop());
                }
            }
            return result;
        },
        account:function(){
            this.showChangePassword = !this.showChangePassword;
        },
        logout:function(){
            this.$router.push({name:'login'});
        },
        godefault:function(){
            this.$router.push({name:'landing'});
        }
    }
};