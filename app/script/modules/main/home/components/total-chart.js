var Chartjs = require('../../../../../lib/Chart');
var moment = require('../../../../../lib/moment');
var common = require('../../../../common');
var service = require('../../../../service');

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
            <self-tabs :items="types" v-model="type"></self-tabs>
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
                <button @click="getTotal" class=""><i class="fa fa-search"></i> <span>查询</span></button>
            </div>
        </div>
        <div class="total-chart-grid" v-show="!!table.length">
            <div v-show="type===0">
                ${table}
            </div>
            <div v-show="type===1">
                <canvas class="bar" id="bar${canvasNum}"></canvas>
                <div style="position: absolute;width: 120px;height: 25px;background: #ffffff;top: 12px;left: 323px;"></div>
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
        this.pie = Chartjs.Doughnut(document.getElementById(`pie${canvasNum}`), {
            responsive: true,
            legend: {position: 'right'}
        });
        this.bar = Chartjs.Bar(document.getElementById(`bar${canvasNum}`), {
            legend:{display:false}, 
            scaleShowGridLines : true,//柱状条边框的宽度
        });
        this.getTotal();
    },
    methods: {
        getTotal() {
            const sum = (args) => {
                var result = 0;
                args.forEach(i=>result+=i);
                return result;
            }
            const color = (args) => {
                return args.map((v,i) => '#' + new Date(10000).setYear(i).toString(16).slice(-8, -2));
            }
            service.organ1(this.startDate, this.endDate).then(data => {
                this.total = data.total;
                this.table = data.table;
                
                this.bar.data.labels = data.table.map(i=>i.typename);
                this.bar.data.datasets[0] = {backgroundColor:'#333333', data:data.table.map(i=>i.count)};
                this.bar.update();

                this.pie.data.labels = data.table[0].items.map(i=>i.src_name);
                this.pie.data.datasets[0] = {backgroundColor: color(this.pie.data.labels), data: this.pie.data.labels.map((v,i)=>sum(data.table.map(t=>t.items[i].count)))};
                this.pie.update();
            })
        },
        changeType(type) {
            this.type = type;
        },
        gotoList(type) {
            common.event('cata_one', type);
            this.$router.push({name:'list', query: {type: type,start:this.startDate,end:this.endDate}});
        }
    }
};