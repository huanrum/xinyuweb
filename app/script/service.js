
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
            return http('/user/changpassword', { password: password, newpassword: newpassword });
        },
        /**
         * 登入 //type 0普通登录，1微信登录
         */
        login: function (username, password) {
            return new Promise(function (resole) {
                http('/user/login', { username, password }).then(function (data) {
                    data = data || {username:username, token: username + Date.now()};
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
            return http('/statistical/msgTotal');
        },
        /**
         * 一级类型
         */
        organ:function(){
            return new Promise(function(resolve){
                http('/statistical/organ').then(res => {
                    common.cache('cata_ones', res);
                    resolve(res);
                });
            });
        },
        /**
         * 某段时间范围的统计数据
         */
        organ1:function(startDate, endDate){
            return new Promise(function(resolve){
                http('summary/typeList').then(function(columns){
                    http('statistical/organ2', {startDate:startDate, endDate:endDate}).then(res => {
                        res.table = (common.cache('cata_ones') || []).map(cata => {
                            var t = res.table.filter(i => i.cata_one === cata.cata_one).pop();
                            return Object.assign({},cata,t||{count:0})
                        });
                        res.table.forEach(i => {
                            var items = i.items || [];
                            i.items = columns.map(c => items.filter(m => m.src_name === c.src_name).pop() || {src_name:c.src_name,count:0});
                        });
                        resolve(res);
                    });
                });
            });
        },
        /**
         * 分类信息
         */
        latestData(organType){
            var parms = {organType};
            if(common.storage('latestData-date')){
                parms.date = common.storage('latestData-date')
            }
            return http('/summary/latestData', parms);
        },
        /**
         * 分类信息
         */
        organList(organType, pageNo, pageSize, startDate, endDate, isAccurate, keyword){
            return http('/summary/organList', {organType, pageNo, pageSize, startDate, endDate, isAccurate, keyword});
        },
        /**
         * 修改是否为热点
         */
        updatetag(id,tag){
            return http('summary/updatetag', {id,tag});
        },
        /**
         * 详情
         */
        detail(id){
            return http('summary/detail', {id});
        }
    };
})();