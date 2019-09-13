
var service = require('../../../../service');

module.exports = {
    props: ['type'],
    template: `<div class="list-card">
        <div class="list-card-title">
            <span>{{type.name}}</span>
            <a @click="latestData">刷新</a>
        </div>
        <ul class="list-card-content">
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