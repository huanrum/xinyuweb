
var service = require('../../../service');

module.exports = {
    template: `<div class="total-chart">
        <div>
            <input type="date" v-model="startDate" placeholder="输入开始时间">
            <input type="date" v-model="endDate" placeholder="输入结束时间">
            <button @click="getTotal">查询</button>
        </div>
        <ul>
            <li v-for="type in types" @click="changeType(type)">
                <img>
                <span>{{type}}</span>
            </li>
        </ul>
        <div>
            <consumer-grid v-show="type==='表'" :data="data" :columns="columns"></consumer-grid>
            <!--trend-chart v-show="type===' 柱'"></self-table>
            <trend-chart v-show="type==='饼'"></self-table-->
        </div>
        <div>
            自 {{startDate|date}} 至 {{endDate|date}} 
            新余市检察院_环境 共采集 {{total.total}} 数据，
            比上期增长了 {{total.increase}} ，
            平均舆情态势值为 {{total.average}} 条，
            其中舆情高峰出现在 {{total.peakDate}} ，峰值为 {{total.peakData}} 条。
        </div>
    </div>`,
    data:function(){
        return {
            type: '',
            types: ['表','柱','饼'], 
            startDate: Date.now(),
            endDate: Date.now(),
            columns: [],
            data: [],
            total: {
                "total": 100,
                "increase": 10,
                "average": 12,
                "peakDate": "2019/9/19",
                "peakData": 20
            }
        }
    },
    created () {
        this.getTotal();
    },
    methods: {
        getTotal() {
            var colomns = ['新闻','论坛','微博','微信','预警','总数'];
            service.organ1(this.startDate, this.endDate).then(data => {
                this.columns = [{title:'区域', field: name}].concat(colomns.map((v,i) => ({
                    title: v,
                    field: i
                })));
                this.data = data.table.map(it => ({...it,...it.count}));
                this.total = data.totla;
            })
        },
        changeType(type) {
            this.type = type;
        }
    }
};