
var common = require('../../../common');
var service = require('../../../service');

var totalChart = require('./components/total-chart');
var latestData = require('./components/latestData');

module.exports = {
    template: `
    <div class="landing-page">
        <div>
            <totalChart></totalChart>
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
            msgTotals: [],
            types: []
        }
    },
    created () {
        this.msgTotal();
        this.getTypes();
    },
    methods: {
        msgTotal() {
            service.msgTotal().then(res => {
                this.msgTotals = res
            });
        },
        getTypes() {
            service.organ().then(res => {
                this.types = res.map(i => ({...i, title:i.name}))
            });
        },

        gotoList(type) {
            this.$router.push({name:'list', query: {type: type}});
        }
    }
};