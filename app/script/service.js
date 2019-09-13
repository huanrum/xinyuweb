
var common = require('./common');
var http = require('./http');



//所有的API请求请写在这里便于管理
//API以./开始的都是没有真实API的，需要确认
module.exports = (function () {

    return {
        /**
         * 获取data里面的json文件内容
         */
        json: function(name){
            return http('?/source/data/'+name+'.json?'+Date.now());
        },
        http: function () {
            //传入对应的URL和参数，返回解密后的数据对象
            return http.apply(this, arguments);
        },
        /**
         * 修改密码
         */
        modifypwd: function (password, newpassword) {
            return http('changpassword', { password: password, newpassword: newpassword });
        },
        /**
         * 登入 //type 0普通登录，1微信登录
         */
        login: function (username, password) {
            return new Promise(function (resole) {
                http('login', { login: username, password: password }).then(function (data) {
                    common.storage('token', data.token);
                    common.account(data);
                    resole(data);
                });
            });
        },
        /**
         * 24小时有效信息
         */
        msgTotal: function(){
            return http('msgTotal');
        },
        /**
         * 一级类型
         */
        organ:function(){
            return http('organ');
        },
        /**
         * 某段时间范围的统计数据
         */
        organ1:function(startDate, endDate){
            return http('organ1', {startDate:startDate, endDate:endDate});
        },
        /**
         * 分类信息
         */
        latestData(organType){
            return http('latestData', {organType:organType});
        },
        /**
         * 分类信息
         */
        organList(startDate, endDate, organType, keyword, inforType, page){
            return http('organList', {startDate, endDate, organType, keyword, inforType, page});
        },

        firepoint(id){
            return http('firepoint', {id});
        }
    };
})();