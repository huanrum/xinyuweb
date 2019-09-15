var moment = require('../../../../lib/moment');
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
            <self-tabs :items="searchTypes" v-model="searchType"></self-tabs>
            <input type="text" autocomplete v-model="search" placeholder="输入关键字">
            <button @click="organList">查询</button>
        </div>
        <br>
        <div class="children-list-grid">
            <consumer-grid :columns="columns" :data="items" :datacount="datacount" :pagination="pagesize" :actions="actions" @paging="organList"></consumer-grid>
        </div>
    </div>`,
    data:function(){
        const messageTypes = ["全部","新闻","论坛","微博","微信"].map((v,i)=>({title:v,name:i?v:''}));
        const searchTypes = ['全文匹配','精确匹配'].map((v,i)=>({title:v,name:i}));
        return {
            pagesize: 10,
            startDate: moment().add(-7,'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            message: messageTypes[0].name,
            searchType: searchTypes[0].name,
            search:'',
            messageTypes: messageTypes,
            searchTypes: searchTypes,
            columns:[
                {title:'标题', field:'title',formatter: this.titleHtml, width: '80%',fn: this.titleAction},
                {title:'发布时间', field:'data_rksj_create', filter: 'date'}
            ],
            actions:[
                {title: '热点', fn: (e,item) => this.updatetag(item, '热点')},
                {title: '非热点', fn: (e,item) => this.updatetag(item, '非热点')}
            ],
            datacount: 0,
            items: []
        }
    },
    created () {
        this.organList(1);
    },
    watch: {
        '$route.query.type': function(){
            this.organList();
        }
    },
    methods: {
        organList(page) {
            service.organList(this.$route.query.type, page||1, this.pagesize, this.startDate,this.endDate,this.message,this.searchType,this.search).then(data => {
                this.items = data.rows;
                this.datacount = data.total;
            })
        },
        updatetag(item, tag){
            service.updatetag(item.id,tag).then(() => item.fire = !item.fire);
        },
        titleHtml(item){
            return `
                <div>
                    <h4>${item.title}</h4>
                </div>
                <div>
                    <span>${item.src_name} | ${common.filter('cata_one')(item.cata_one)}</span>
                    <span><a>【详细】</a> <a>【原文】</a></span>
                </div>
            `;
        },
        titleAction(e, item){
            if(e.target.nodeName !== 'A'){return;}
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