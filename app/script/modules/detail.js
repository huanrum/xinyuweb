var moment = require('../../lib/moment');
var common = require('../common');
var service = require('../service');

module.exports = {
    template: `<div class="children-list">
        详细
        {{subInfo}}
        {{lightKeywords}}
        {{originalData}}
    </div>`,
    data:function(){
        return {
            subInfo: {},
            lightKeywords: '',
            originalData: {}
        }
    },
    created () {
        this.detail();
    },
    methods: {
        detail(){
            service.detail(this.$route.query.id).then(res=>{
                Object.assign(this, res);
                document  
            });
        }
    }
};