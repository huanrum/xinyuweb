
var common = require('../../common');
var service = require('../../service');

var landing = require('./home/landing');
var list = require('./home/list');

module.exports = {
    routers: [
        { name: 'landing', path: '/landing', component: landing },
        { name: 'list', path: '/list', component: list },
    ],
    template: `<div class="landing-page">
            <div class="landing-msgTotal">
                <span>24 小时监测到</span>
                <span class="landing-msgTotal-item" v-for="mt in msgTotals">
                    <span>{{mt.titel}}</span>
                    <a>{{mt.count}}</a>
                    <span>条</span>
                </span>
            </div>
            <br>
            <div class="tabs">
                <div v-for="menu in types" @click="gotoList(menu.name)" :class="{'active':menu.name==active}">
                    <i :class="'tab-'+menu.name"></i><span>{{menu.name|language}}</span>
                </div>
            </div>
            <div>
                <transition :name="transitionName" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>`,
    data:function(){
        return {
            transitionName:'',
            active: this.$route.query.type,
            msgTotals: [],
            types: []
        }
    },
    created () {
        this.msgTotal();
        this.getTypes();
    },
    methods: {
        msgTotal() {
            service.msgTotal().then(res => {
                this.msgTotals = res
            });
        },
        getTypes() {
            service.organ().then(res => {
                this.types = res;
            });
        },

        gotoList(type) {
            this.active = type;
            this.$router.push({name:'list', query: {type: type}});
        }
    }
};