var moment = require('../../../lib/moment');
var common = require('../../common');
var service = require('../../service');

module.exports = {
    template: `<div class="detail-body">
        <div class="detail-title">
            <h2 v-html="mark(subInfo.title)"></h2>
            <a :href="subInfo.src_url">原网页</a>
        </div>
        <div class="detail-info">
            <div>
                <span>发布时间 <a>{{subInfo.data_rksj_create|date}}</a></span><span>作者 <a>{{subInfo.authors||'###'}}</a></span> <span>来源 <a>{{subInfo.src_name}}</a></span>
            </div>
            <div>
                <span>一级分类 <a>{{subInfo.cata_one|cata_one}}</a></span><span>机构 <a>{{subInfo.cata_one|cata_one}}</a><span>
            </div>
        </div>
        <div class="detail-content" v-html="mark(text)"></div>
    </div>`,
    data:function(){
        return {
            subInfo: {},
            lightKeywords: '',
            text: ''
        }
    },
    created () {
        service.organ().then(() => this.detail());
    },
    methods: {
        detail(){
            service.detail(this.$route.query.id).then(res=>{
                Object.assign(this, res);
                document.title =  res.subInfo.title;
            });
        },
        mark(str){
            return (str || '').replace(/\n/g,'<br>');
        }
    }
};