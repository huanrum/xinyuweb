var Chartjs = require('../../../../../lib/Chart');
var moment = require('../../../../../lib/moment');
var common = require('../../../../common');
var service = require('../../../../service');

const sum = (args) => {
    var result = 0;
    args.forEach(i=>result+=i);
    return result;
};
const color = (args, opacity = 1) => {
    return args.map((v,i) => {
        var num = sum(Array.prototype.map.call(JSON.stringify(v),s=>s.charCodeAt()));
        var color = parseInt(new Date(10000).setYear(num%200000).toString(16).slice(-8, -2),16);
        return `rgb(${[Math.floor(color/256/256),Math.floor(color/256)%256,color%256,opacity].join()})`;
    });
};
var canvasNum = Date.now();
var table = `
            <table border="1" v-if="!!table.length" class="total-chart-table">
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
        <div class="total-chart-grid" v-show="!!table.length">
            <div v-show="type===0">
                ${table}
            </div>
            <div v-show="type===1">
                <canvas class="bar" id="bar${canvasNum}"></canvas>
            </div>
            <div v-show="type===2">
                <canvas class="pie" id="pie${canvasNum}" width="400" height="270"></canvas>
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
            table: [],
            total: null
        }
    },
    mounted () {
        this.pie = new Chartjs(document.getElementById(`pie${canvasNum}`), {
            type: 'pie',
            options:{
                legend: {
                    position: 'right'
                }
            }
            
        });
        this.bar = new Chartjs(document.getElementById(`bar${canvasNum}`), {
            type: 'horizontalBar',
            options:{
                legend: {
                    display: false
                },
                title:{
                    position: 'bottom'
                }
            }
        });
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
                    this.bar.data.labels = this.items.map(i=>i.typename);
                    this.bar.data.datasets[0] = {backgroundColor:color(this.items,0.6), data:this.items.map(i=>i.count)};
                    this.bar.options.scales.xAxes[0].ticks.suggestedMax = 1.1 * Math.max.apply(Math,this.items.map(i=>i.count))
                    this.bar.update();
                    break;
                case 2:
                    this.pie.data.labels = this.items[0].items.map(i=>i.src_name);
                    this.pie.data.datasets[0] = {backgroundColor: color(this.pie.data.labels), data: this.pie.data.labels.map((v,i)=>sum(this.items.map(t=>t.items[i].count)))};
                    this.pie.update();
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