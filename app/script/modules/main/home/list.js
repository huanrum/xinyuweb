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
            <self-tabs :items="searchTypes" v-model="searchType"></self-tabs>
            <span class="search-input-button">
                <input type="password" name="password" style="display:none;">
                <input type="text" autocomplete="off" v-model="search" placeholder="输入关键字">
                <a @click="organList"><i class="fa fa-search"></i> <span>查询</span></a>
            </span>
        </div>
        <br>
        <div class="children-list-grid">
            <consumer-grid :columns="columns" :data="items" :datacount="datacount" :pagination="pagesize" :actions="actions" @paging="organList"></consumer-grid>
        </div>
    </div>`,
    data:function(){
        const searchTypes = ['全文匹配','精确匹配'].map((v,i)=>({title:v,name:i}));
        const switchTag = tag => tag!=='热点'?'热点':'非热点';
        return {
            pagesize: 10,
            startDate: this.$route.query.start || moment().add(-7,'days').format('YYYY-MM-DD'),
            endDate: this.$route.query.end || moment().format('YYYY-MM-DD'),
            searchType: searchTypes[0].name,
            search:'',
            searchTypes: searchTypes,
            columns:[
                {title:'标题', field:'title',formatter: this.titleHtml, width: '70%',fn: this.titleAction},
                {title:'采集时间', field:'data_rksj_create', filter: 'date'},
                {title:'发布时间', field:'pub_time', filter: 'date'}
            ],
            actions:[
                {
                    title: i=>` 标记${switchTag(i.tag)}`, 
                    class: i=>`self-icon ${ switchTag(i.tag) !=='热点' ? 'flag-fire': 'flag-unfire'}`,
                    fn: (e,item) => this.updatetag(item, switchTag(item.tag))}
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
            service.organList(this.$route.query.type, page||1, this.pagesize, this.startDate,this.endDate,this.searchType,this.search).then(data => {
                this.items = data.rows.map(i=>Object.assign(i,{tag:i.tag||null}));
                this.datacount = data.total;
            })
        },
        updatetag(item, tag){
            service.updatetag(item.id,tag).then(() => {
                item.tag = tag;
                setTimeout(common.dialog({width:'200px'},'<div>标记为' + tag + '成功</div>'), 2000);
            });
        },
        titleHtml(item){
            return `<div style="text-align: left;">
                        <div>
                            <h4>${item.title}</h4>
                        </div>
                        <div>
                            <span>${item.src_name} | ${common.filter('cata_one')(item.cata_one)}</span>
                            <span><a>【详细】</a> <a>【原文】</a></span>
                        </div>
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