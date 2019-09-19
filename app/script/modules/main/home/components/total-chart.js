var Chart = require(['../../../../../lib/highcharts']);
var moment = require('../../../../../lib/moment');
var common = require('../../../../common');
var service = require('../../../../service');

require(['../../../../../lib/highcharts-3d']);

var canvasNum = Date.now();
var table = `
            <table border="1" v-if="!!table && table.length" class="total-chart-table">
                <tr>
                    <th>区域</th>
                    <th v-for="column in table[0].items">{{column.src_name}}</th>
                    <th>总数</th>
                </tr>
                <tr v-for="t in table">
                    <td>{{t.typename}}</td>
                    <td v-for="it in t.items" @click="gotoList(t.cata_one)"><a>{{it.count}}</a></td>
                    <td><a>{{t.count}}</a></td>
                </tr>
            </table>
`

module.exports = {
    template: `
    <div class="total-chart">
        <div class="total-chart-left">
            <self-tabs :items="types" @tab="changeType"></self-tabs>
            <div class="total-chart-info" v-if="!!total">
                自 <a>{{startDate|date}}</a> 至 <a>{{endDate|date}}</a>
                新余市检察院_环境 共采集 <a>{{total.total}}</a> 数据，
                比上期增长了 <a>{{total.increase}}</a> ，
                平均舆情态势值为 <a>{{total.average}}</a> 条，
                其中舆情高峰出现在 <a>{{total.peakDate}}</a> ，峰值为 <a>{{total.peakData}}</a> 条。
            </div>
            <div class="total-chart-search">
                <input type="date" v-model="startDate" placeholder="输入开始时间">
                <input type="date" v-model="endDate" placeholder="输入结束时间">
                <a @click="getTotal" class=""><i class="fa fa-search"></i> <span> 查询</span></a>
            </div>
        </div>
        <div class="total-chart-grid" v-show="!!items.length">
            <div v-show="type===0">
                ${table}
            </div>
            <div v-show="type===1">
                <div class="bar" id="bar${canvasNum}"></div>
            </div>
            <div v-show="type===2">
                <div class="pie" id="pie${canvasNum}"></div>
            </div>
        </div>
    </div>`,
    data:function(){
        var types = ['信息统计表格','信息数量分布图','信息类型分布图'];
        return {
            type: 0,
            types: types.map((t,i)=>({title:t,name:i,class:['fa fa-table','fa fa-bar-chart','fa fa-codiepie'][i]})), 
            startDate: moment().add(-7,'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            items: [],
            table: [],
            total: null
        }
    },
    mounted () {
        this.pie = {
            title:{ text: null },
            legend: { reversed: true },
            credits: { enabled: false },
            chart: {
                options3d: {
                    enabled: true,       //显示图表是否设置为3D
                    alpha: 45,           //图表视图旋转角度
                    beta: 0              //图表视图旋转角度
                },
                type: 'pie'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            }
        };

        this.bar = {
            chart: { type: 'bar' },
            title:{ text: null },
            legend: { reversed: true },
            credits: { enabled: false },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    depth: 40
                }
            },
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                viewDistance: 25,
                depth: 40
            },
            marginTop: 80,
            marginRight: 40
        };
        this.getTotal();
    },
    methods: {
        getTotal() {
            service.organ1(this.startDate, this.endDate).then(data => {
                this.total = data.total;
                this.items = data.table;
                this.refeshUi();
            })
        },
        refeshUi(){
            switch(this.type){
                case 0:
                    this.table = this.items;
                break;
                case 1:
                    Chart.chart(document.getElementById(`bar${canvasNum}`), Object.assign(this.bar, {
                        xAxis: {
                            categories: this.items.map(i=>i.typename)
                        },
                        series: this.items[0].items.map((v,i)=>({name:v.src_name,data:this.items.map(it=>it.items[i].count)}))
                    }));
                    break;
                case 2:
                    Chart.chart(document.getElementById(`pie${canvasNum}`), Object.assign(this.pie, {
                    series: [{
                            name: 'Brands',
                            colorByPoint: true,
                            data: this.items[0].items.map((v,i)=>({
                                name: v.src_name,
                                y: common.sum(this.items.map(t=>t.items[i].count))
                            }))
                        }]
                    }));
                    break;
            }
        },
        changeType(type) {
            this.type = type;
            setTimeout(() => this.refeshUi(), 100);
        },
        gotoList(type) {
            common.event('cata_one', type);
            this.$router.push({name:'list', query: {type: type,start:this.startDate,end:this.endDate}});
        }
    }
};