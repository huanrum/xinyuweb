var moment = require('../../../lib/moment');
var common = require('../../common');
var service = require('../../service');

module.exports = {
    template: `<div class="error-page">
        <div class="error-page-title">
            <h4>服务器异常，请稍后再试！</h2>
            <div @click="refsh">重试</div>
        </div>
        <div class="error-page-content">
            <div v-for="error in errors">{{error}}</div>
        </div>
    </div>`,
    data:function(){
        return {
        };
    },
    computed: {
        errors: function(){
            return this.$route.query.errors;
        }
    },
    methods: {
        refsh(){
            this.$route.query.errors.length;
            this.$router.go(-1);
        }
    }
};