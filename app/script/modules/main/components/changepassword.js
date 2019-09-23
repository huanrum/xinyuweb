
var common = require('../../../common');
var service = require('../../../service');

module.exports = {
    template: `<div class="account-page">
        <div class="page-title">
            <img src="source/images/changepassword/changepassword.png"><span>修改密码</span>
        </div>
        <div class="page-form">
            <div class="page-form-item">
                <label>账号：</label>
                <input v-model="entity.username" placeholder="请输入手机号或邮箱" disabled>
            </div>
            <div class="page-form-item">
                <label>原密码：</label>
                <input type="password" name="password" style="display:none;">
                <input type="password" v-model="entity.oldpassword" placeholder="输入旧密码">
            </div>
            <div class="page-form-item">
                <label>密码：</label><input type="password" v-model="entity.password" placeholder="输入新密码">
            </div>
            <div class="page-form-item">
                <label>确认密码：</label><input type="password" v-model="entity.password2" placeholder="请确认新密码">
            </div>
            <div class="page-form-item">
                <a class="btn" @click="cancel()">取消</a>
                <a class="btn" @click="modifypwd(entity)">保存</a>
            </div>
        </div>
    </div>`,
    data:function(){
        return {
            senddisabled:'',
            sendmessage:'发送验证码',
            entity:{
                username:common.storage('username'),
                oldpassword:'',
                password:'',
                password2:'',
            }
        }
    },
    methods: {
        cancel() {
            this.$emit('oncancel');
        },
        modifypwd(entity) {
            if(entity.oldpassword && entity.password && entity.password2){
                if(entity.password !== entity.password2){
                    common.dialog({title:'参数错误',width:'400px'},'<div>两次输入密码不一致</div>',3000);
                }else{
                    service.modifypwd(entity.oldpassword, entity.password).then(() => {
                        this.$router.push({ name: 'login' });
                    });
                }
            }else{
                common.dialog({title:'参数错误',width:'400px'},'<div>参数不可为空</div>',3000);
            }
        }
    }
};