
var common = require('./../common');
var service = require('./../service');

/**
 * 登录页面
 */
module.exports = {
    template: `
    <div class="login-page">
        <div class="form-group">
            <div class="login-page-outer"><logo></logo></div>
            <div class="title">用户登录</div>
            <div class="form">
                <div>
                    <div class="input">
                        <img src="source/images/login/name.png">
                        <input type="text" placeholder="请输入用户名" v-model="username" @keyup.enter="login">
                    </div>
                    <div class="input">
                        <img src="source/images/login/lock.png">
                        <input type="password" placeholder="请输入密码" v-model="password" @keyup.enter="login">
                    </div>
                    <div class="checkbox" @click="remember = !remember">
                        <img v-show="!remember" src="source/images/login/check_nor.png">
                        <img v-show="!!remember" src="source/images/login/check_sel.png">
                        <label>记住密码</label>
                    </div>
                    <div class="btn btn-default btn-block" @click="login">登录</div>
                </div>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            copyright:common.copyright,
            src:'',
            remember:common.storage('remember')==='true',
            errors:[],
            username: common.storage('username'),//  '13924227737',
            password: common.storage('password'),//'cen123456'
        }
    },
    methods: {
        validator(){
            this.errors.length = 0;
            if(!this.username){
                this.errors.push('用户名不能为空');
            }
            if(!this.password){
                this.errors.push('用户名密码不能为空');
            }
        },
        goto(name){
            this.$router.push({ name: name }); 
        },
        login() {
            this.validator();
            if(!this.errors.length){
                service.login(this.username,this.password,0).then(req => {
                    if(this.remember){
                        common.storage('remember',this.remember,true);
                        common.storage('username',this.username,true);
                        common.storage('password',this.password,true);
                    }else{
                        common.storage('remember',null,true);
                        common.storage('username',null,true);
                        common.storage('password',null,true); 
                    }
                    common.storage('username',this.username);
                    common.storage('password',this.password);
                    this.$router.push({ name: 'landing' });
                },error=>{
                    this.errors.push(error.message);
                });
            }else{
                common.dialog({title:'登录错误',width:200},'<div>' + this.errors.join('<br>')+ '</div>')
            }
        }
    }
};