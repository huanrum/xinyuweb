
var service = require('../../../service');

module.exports = {
    props: ['type'],
    template: `<div class="total-chart">
        <div>
            <span>{{type.name}}</span>
            <a @click="latestData">刷新</a>
        </div>
        <ul>
            <li v-for="item in items">
                {{item}}
            </li>
        </ul>
    </div>`,
    data:function(){
        return {
            items: []
        }
    },
    created () {
        this.latestData();
    },
    methods: {
        latestData() {
            service.latestData(this.type.name).then(data => this.items = data)
        }
    }
};