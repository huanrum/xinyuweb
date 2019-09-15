var moment = require('../../../../../lib/moment');
var service = require('../../../../service');

module.exports = {
    props: ['type'],
    template: `<div class="list-card">
        <div class="list-card-title">
            <span>{{type.name}}</span>
            <span v-show="!!totalToday()">[今日 {{totalToday()}}]</span>
            <a @click="latestData">刷新</a>
        </div>
        <ul class="list-card-content">
            <li class="list-card-content-item" v-for="item in items" @click="openDetail(item)">
                <div class="row1" :title="item.summary">
                    <a>[{{item.src_name}}]</a><span>{{item.title}}</span><i>{{item.data_rksj_create|date}}</i>
                </div>
                <div class="row2">
                    <span>机构 {{item.cata_one|cata_one}}</span>
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
            service.latestData(this.type.name).then(data => this.items = data.rows)
        },
        totalToday(){
            var today = moment().format('YYYY-MM-DD');
            return this.items.filter(i=>i.pub_time === today).length;
        },
        openDetail(item){
            window.open(location.href.replace(location.hash, '#/detail?id=' + item.id));
        }
    }
};