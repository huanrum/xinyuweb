
var common = require('../../../common');
var service = require('../../../service');

var totalChart = require('./components/total-chart');
var latestData = require('./components/latestData');

module.exports = {
    template: `
    <div class="landing-page">
        <div>
            <totalChart ></totalChart>
        </div>
        <div class="latest-data-panel">
            <latestData v-for="type in types" :type="type"></latestData>
        </div>
    </div>`,
    components: {
        totalChart: totalChart,
        latestData: latestData
    },
    data:function(){
        return {
            types: []
        }
    },
    created () {
        service.msgTotal();
        this.getTypes();
    },
    methods: {
        getTypes() {
            service.organ().then(res => {
                this.types = (res||[]).map(i => Object.assign(i,{title:i.name}))
            });
        }
    }
};