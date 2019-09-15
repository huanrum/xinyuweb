
var main = require('./modules/main');
var login = require('./modules/login');
var detail = require('./modules/detail');




//所有的路由信息都写在这里
//name,path,component 是自带的icon,title是用于菜单的,会根据path来进行子菜单分级,目前只有两级
//type为3是获取所有, 2是获取教师, 1是获取学生
module.exports = function routers() {
    return [
        { 
            name: 'login', path: '/login', component: login 
        },
        { 
            name: 'detail', path: '/detail', component: detail 
        },
        { 
            name: 'main', path: '/', component: main, title: '主页', icon: '', children: main.routers 
        }
    ];
}

