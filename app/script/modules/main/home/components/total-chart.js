var Chartjs = require('../../../../../lib/Chart');
var service = require('../../../../service');

var canvasNum = Date.now();
var table = `
            <table border="1">
                <tr>
                    <th>区域</th>
                    <th>新闻</th>
                    <th>论坛</th>
                    <th>微博</th>
                    <th>微信</th>
                    <th>预警</th>
                    <th>总数</th>
                </tr>
                <tr v-for="t in table">
                    <td>{{t.name}}</td>
                    <td>{{t.count[0]}}</td>
                    <td>{{t.count[1]}}</td>
                    <td>{{t.count[2]}}</td>
                    <td>{{t.count[3]}}</td>
                    <td>{{t.count[4]}}</td>
                    <td>{{t.count[5]}}</td>
                </tr>
            </table>
`

module.exports = {
    template: `
    <div class="total-chart">
        <div>
            <div>
                <input type="date" v-model="startDate" placeholder="输入开始时间">
                <input type="date" v-model="endDate" placeholder="输入结束时间">
                <button @click="getTotal">查询</button>
            </div>
            <div>
                自 {{startDate|date}} 至 {{endDate|date}} 
                新余市检察院_环境 共采集 {{total.total}} 数据，
                比上期增长了 {{total.increase}} ，
                平均舆情态势值为 {{total.average}} 条，
                其中舆情高峰出现在 {{total.peakDate}} ，峰值为 {{total.peakData}} 条。
            </div>
        </div>
        <div>
            ${table}
        </div>
        <div>
            <canvas id="bar${canvasNum}"></canvas>
        </div>
        <div>
            <canvas id="pie${canvasNum}"></canvas>
        </div>
    </div>`,
    data:function(){
        return {
            type: '表',
            types: ['表','柱','饼'], 
            startDate: Date.now(),
            endDate: Date.now(),
            table: [],
            total: {
                "total": 100,
                "increase": 10,
                "average": 12,
                "peakDate": "2019/9/19",
                "peakData": 20
            }
        }
    },
    mounted () {
        this.pie = Chartjs.Doughnut(document.getElementById(`pie${canvasNum}`), {});
        this.bar = Chartjs.Bar(document.getElementById(`bar${canvasNum}`), {scaleShowGridLines : true});
        this.getTotal();
    },
    methods: {
        getTotal() {
            const sum = (...args) => {
                var result = 0;
                args.forEach(i=>result+=i);
                return result;
            }
            service.organ1(this.startDate, this.endDate).then(data => {
                this.total = data.total;
                this.table = data.table;
                
                this.bar.data.labels = data.table.map(i=>i.name);
                this.bar.data.datasets[0] = {label:'信息数量分布图', data:data.table.map(i=>sum(...i.count))};
                this.bar.update();

                this.pie.data.datasets[0] = {label:'信息类型分布图', data: ['新闻','论坛','微博','微信','预警'].map((v,i)=>({
                    value: sum(...data.table.map(t=>t.count[i])),
                    color:"#F7464A",
                    highlight: "#FF5A5E",
                    label: v
                }))};
                this.pie.update();
            })
        },
        changeType(type) {
            this.type = type;
        }
    }
};