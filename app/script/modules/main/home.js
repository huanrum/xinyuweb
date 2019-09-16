
var common = require('../../common');
var service = require('../../service');

var landing = require('./home/landing');
var list = require('./home/list');
var detail = require('./detail');

module.exports = {
    routers: [
        { name: 'landing', path: '/landing', component: landing },
        { name: 'list', path: '/list', component: list },
    ],
    template: `<div class="home-page">
            <div class="home-msgTotal" v-if="!!msgTotals.length">
                <span>24 小时监测到</span>
                <span class="home-msgTotal-item" v-for="mt in msgTotals">
                    <span>{{mt.name}}</span>
                    <a>{{mt.count}}</a>
                    <span>条</span>
                </span>
            </div>
            <div class="tabs type-tabs">
                <div v-for="menu in types" @click="gotoList(menu.cata_one)" :class="{'active':menu.cata_one==active}">
                    <i :class="'tab-'+menu.name"></i><span>{{menu.name|language}}</span><sup v-if="!!menu.count">{{menu.count}}</sup>
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
            active: this.$route.query.type || '',
            msgTotals: [],
            types: []
        }
    },
    created () {
        this.msgTotal();
        this.getTypes();
        common.event('cata_one', type => this.active = type);
    },
    beforeDestroy () {
        common.event('cata_one', null);
    },
    methods: {
        msgTotal() {
            service.msgTotal().then(res => {
                this.msgTotals = res || [];
            });
        },
        getTypes() {
            service.organ().then(res => {
                this.types = [{name:'首页',cata_one:''}].concat(res || []);
            });
        },

        gotoList(type) {
            this.active = type;
            if(type){
                this.$router.push({name:'list', query: {type: type}});
            }else{
                this.$router.push({name:'landing'});
            }
        }
    }
};