
//所有component和filter都在这里注册
var Vue = require('./../lib/vue/vue');

var logo = require('./components/logo');
var leftMenu = require('./components/left-menu');
var selfTabs = require('./components/self-tabs');
var consumerGrid = require('./components/consumer-grid');
var consumerForm = require('./components/consumer-form');
var consumerVideo = require('./components/consumer-video');
var pagination = require('./components/self-pagination');
var selectInput = require('./components/select-input');

var language = require('./filters/language');
var date = require('./filters/date');
var cata_one = require('./filters/cata_one');

Vue.component('logo',logo);
Vue.component('left-menu',leftMenu);
Vue.component('self-tabs',selfTabs);
Vue.component('self-pagination',pagination);
Vue.component('consumer-grid',consumerGrid);
Vue.component('consumer-form',consumerForm);
Vue.component('consumer-video',consumerVideo);
Vue.component('select-input',selectInput);

Vue.filter('language',language);
Vue.filter('date',date);
Vue.filter('cata_one',cata_one);