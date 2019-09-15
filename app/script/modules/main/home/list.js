var moment = require('../../../../lib/moment');
var common = require('../../../common');
var service = require('../../../service');

module.exports = {
    template: `<div class="children-list">
        <div class="children-list-filter">
            <span>
                <span>时间</span>
                <input type="datetime" v-model="startDate" placeholder="输入开始时间">
                <input type="datetime" v-model="endDate" placeholder="输入结束时间">
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
            startDate: moment().add(-7,'days').format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            message:'全部',
            media:'全部',
            searchType:'全文匹配',
            search:'',
            messageTypes: ["全部","新闻","论坛","微博","微信"].map(i=>({title:i,name:i})),
            mediaTypes: ["全部","纸媒","网媒"].map(i=>({title:i,name:i})),
            searchTypes: ['全文匹配','精确匹配'].map(i=>({title:i,name:i})),
            columns:[
                {title:'标题', field:'title',formatter: this.titleHtml, width: '80%',fn: this.titleAction},
                {title:'发布时间', field:'data_rksj_create', filter: 'date'}
            ],
            actions:[
                {title: item => item.fire ? '非热点' : '热点', fn: this.updatetag}
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
                this.items = data.rows;
                this.datacount = data.pageSize;
            })
        },
        updatetag(item){
            service.updatetag(item.id,item.fire ? '非热点' : '热点').then(() => item.fire = !item.fire);
        },
        titleHtml(item){
            return `
                <div>
                    <a>${item.title}</a>
                </div>
                <div>
                    <span>${item.src_name} | ${common.filter('cata_one')(item.cata_one)}</span>
                    <span><a>【详细】</a> <a>【原文】</a></span>
                </div>
            `;
        },
        titleAction(e, item){
            if(/原文/.test(e.target.innerHTML)){
                window.open(item.src_url);
            }else{
                window.open(location.href.replace(location.hash, '#/detail?id=' + item.id));
            }
        },
        openDetail(item){
            alert(item);
        }
    }
};