
var common = require('../../../common');
var service = require('../../../service');

module.exports = {
    template: `<div class="children-list">
        <div class="children-list-filter">
            <span>
                <span>时间</span>
                <input type="date" v-model="startDate" placeholder="输入开始时间">
                <input type="date" v-model="endDate" placeholder="输入结束时间">
            </span>
            <self-tabs :items="messageTypes" v-model="message"></self-tabs>
            <self-tabs :items="mediaTypes" v-model="media"></self-tabs>
            <self-tabs :items="searchTypes" v-model="searchType"></self-tabs>
            <input type="text" v-model="search" placeholder="输入关键字">
            <button @click="organList">查询</button>
        </div>
        <br>
        <div class="children-list-grid">
            <consumer-grid :columns="columns" :data="items" :datacount="datacount" :actions="actions" @paging="organList"></consumer-grid>
        </div>
    </div>`,
    data:function(){
        return {
            startDate:'',
            endDate:'',
            message:'全部',
            media:'全部',
            searchType:'全文匹配',
            search:'',
            messageTypes: ["全部","新闻","论坛","微博","微信"].map(i=>({title:i,name:i})),
            mediaTypes: ["全部","纸媒","网媒"].map(i=>({title:i,name:i})),
            searchTypes: ['全文匹配','精确匹配'].map(i=>({title:i,name:i})),
            columns:[
                {title:'标题', field:'title',formatter: this.titleHtml},
                {title:'发布时间', field:'date'}
            ],
            actions:[
                {title: item => item.fire ? '非热点' : '热点', fn: this.firePoint}
            ],
            datacount: 0,
            items: []
        }
    },
    created () {
        this.organList();
    },
    watch: {
        '$route.query.type': function(){
            this.organList();
        }
    },
    methods: {
        organList(page) {
            service.organList(this.$route.query.type, page, this.startDate,this.endDate,this.message,this.media,this.searchType,this.search).then(data => {
                this.items = data;
                this.datacount = 34;
            })
        },
        firePoint(item){
            service.firepoint(item.id).then(() => item.fire = !item.fire);
        },
        titleHtml(item, field){
            return `<a>${field}</a><div>${item[field]}</div><div>${item}</div>`;
        }
    }
};