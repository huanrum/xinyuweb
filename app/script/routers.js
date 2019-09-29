
var main = require('./modules/main');
var login = require('./modules/login');




//所有的路由信息都写在这里
//name,path,component 是自带的icon,title是用于菜单的,会根据path来进行子菜单分级
module.exports = function routers() {
    return [
        { 
            name: 'login', path: '/login', component: login 
        },
        { 
            name: 'main', path: '/', component: main, title: '主页', icon: '', children: main.routers 
        }
    ];
}

