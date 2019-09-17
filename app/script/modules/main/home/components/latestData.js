var moment = require('../../../../../lib/moment');
var common = require('../../../../common');
var service = require('../../../../service');

module.exports = {
    props: ['type'],
    template: `<div class="list-card">
        <div class="list-card-title">
            <span>{{type.name}}</span>
            <span>(今日 {{totalToday()}} 条)</span>
            <a @click="latestData">刷新</a>
            <a @click="gotoList">更多</a>
        </div>
        <div class="list-card-noitem" v-show="!items.length"><span>没有数据</span></div>
        <ul class="list-card-content">
            <li class="list-card-content-item" v-for="item in items.slice(0,10)" @click="openDetail(item)">
                <div class="row1" :title="item.summary">
                    <a>[{{item.src_name}}]</a><span>{{item.title}}</span>
                </div>
                <div class="row2">
                    <small>机构 {{item.cata_one|cata_one}}</small><i>{{item.pub_time|date('MM-DD HH:mm')}}</i>
                </div>
            </li>
        </ul>
    </div>`,
    data:function(){
        return {
            items: []
        }
    },
    created () {
        this.latestData();
    },
    methods: {
        latestData() {
            service.latestData(this.type.cata_one).then(data => this.items = data.rows)
        },
        totalToday(){
            var today = moment().format('YYYY-MM-DD');
            return this.items.filter(i=>i.pub_time === today).length;
        },
        openDetail(item){
            window.open(location.href.replace(location.hash, '#/detail?id=' + item.id));
        },
        gotoList() {
            common.event('cata_one', this.type.cata_one);
            this.$router.push({name:'list', query: {type: this.type.cata_one}});
        }
    }
};