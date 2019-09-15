var Vue = require('./../../lib/vue/vue');
var common = require('./../common');

/**
 * 表格组件
 */
module.exports = {
    props:['hasno','columns','data','actions','pagination','datacount','message'],
    template:`<div class="consumer-grid">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th v-if="!!hasno"><span>{{'序号'|language}}</span></th>
                        <th v-for="column in columns" :width="column.width"><span>{{column.title|language}}</span></th>
                        <th v-if="!!actions.length"><span>{{'操作'|language}}</span></th>
                    </tr>
                </thead>
            <tbody>
                <tr v-for="(item,$index) in items" @dblclick="$emit('dblclick',item)" :class="{select:select===item}">
                    <td v-if="!!hasno"><div>{{$index+1}}</div></td>
                    <td v-for="column in columns">
                        <div>
                            <span v-html="value(item,column)" :class="getclass(column,item)" @click="action($event,column,item)"></span>
                            <span v-if="!!column.actions">
                                <a class="action" v-for="ac in column.actions" :class="getclass(ac,item)" @click="action($event,ac,item)">{{gettitle(ac,item)|language}}</a>
                            </span>
                        </div>
                    </td>
                    <td v-if="!!actions.length">
                        <div>
                            <a class="action" v-for="ac in actions" :class="getclass(ac,item)" @click="action($event,ac,item)">{{gettitle(ac,item)|language}}</a>
                        </div>
                    </td>
                </tr>
                
            </tbody>
        </table>
        <div class="no-data" v-if="!items.length">
            <span v-html="message||'没有任何数据'"></span>
        </div>
        <self-pagination v-model="page" :pageCount="pageCount"></self-pagination>
    </div>`,
    data:function(){
        this.actions = this.actions || [];
        return {
            page:1,
            select:null,
        }
    },
    watch: {
        data:function(){
            this.data.forEach(i=>i._selected_ = false);
        },
        page:function(){
            this.$emit('paging', this.page);
        }
    },
    computed:{
        lines:function(){
            return +this.pagination || 10;
        },
        pageCount:function(){
            return Math.ceil((this.datacount || this.data.length) / this.lines);
        },
        items:function(){
            if(this.datacount){
                return this.data;
            }
            return this.data.slice(this.page*this.lines-this.lines,this.page*this.lines);
        }
    },
    methods:{
        gettitle:function(action,item){
            return typeof action.title === 'function'? action.title(item) : action.title || '';
        },
        getclass:function(action,item){
            var disabled = typeof action.disabled === 'function'? action.disabled(item) : action.disabled;
            var _class = typeof action.class === 'function'? action.class(item) : action.class;
            return (_class || '') + ' ' + (disabled?'disabled':'')
        },
        action:function(e, action,item){
            var disabled = typeof action.disabled === 'function'? action.disabled(item) : action.disabled;
            this.select = item;
            if(!disabled && action.fn){
                action.fn(e,item,this);
            }
        },
        value:function(item,column){
            if(!column.field){
                return column.default || '';
            }else if(column.formatter){
                return column.formatter(item,column.field,this);
            }else if(column.filter){
                return Vue.filter(column.filter)(item[column.field]);
            }else{
                return typeof item[column.field] === undefined ? '' : item[column.field];
            }
        }
    }
}