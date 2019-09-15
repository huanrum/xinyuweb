var moment = require('../../../lib/moment');
var common = require('../../common');
var service = require('../../service');

module.exports = {
    props:['errors'],
    template: `<div class="error-page">
        <div class="error-page-title">
            <h4>服务器异常，请稍后再试！</h2>
        </div>
        <div class="error-page-content">
            <div>{{errors}}</div>
        </div>
    </div>`,
    data:function(){
        return {
        };
    },
    methods: {
        back(){
            this.$router.go(-1);
        }
    }
};