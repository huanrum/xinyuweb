
/**
 * 表单组件
 */
module.exports = {
    props: {
        data:Object,
        rows:Array,
        actions:Array
    },
    template:`<div class="consumer-form">
        <div class="rows">{{rows}}</div>
        <div class="actions btn-group"> 
            <a  class="btn" v-for="ac in buttons" :class="ac.class" :disabled="ac.disabled" @click="click(ac)">{{ac.title|language}}</a>
        </div>
    </div>`,
    data:function(){
        var entity = this.data,errors = {};
        this.rows.map((row,index)=>{
            errors[row.field] = '';
            entity[row.field] = this.data[row.field] || '';
        });
        return {
            errors:errors,
            entity:entity,
            buttons:(this.actions||[]).map(i=>{
                if(typeof i === 'object'){
                    return Object.assign({
                        name:'',
                        title:'',
                        class:'',
                        disabled:false,
                    },i);
                }else{
                    return {
                        name:i.replace(/\[.*\]/g,'').trim(),
                        title:i.replace(/\[.*\]/g,'').trim(),
                        class:/\[(((?!]).)*)\]/.exec(i)&&/\[(((?!]).)*)\]/.exec(i)[1],
                        disabled:false
                    };
                }
            })
        }
    },
    created () {
        var editor = (row,index)=>{
            row.placeholder = row.placeholder || '';
            if(!row.type){
                return `<span>${this.entity[row.field]}</span>`;
            }else if(typeof row.type === 'number'){
                return `<textarea  rows="${row.type}" v-model="entity.${row.field}" placeholder="${row.placeholder}"></textarea>`;
            }else if(row.type instanceof Array){
                return `<select  v-model="entity.${row.field}"  @change="$emit('change',rows[${index}],entity)" placeholder="${row.placeholder}"><option v-for="op in rows[${index}].type" :value="op.id" :disabled="!!op.disabled">{{op.title}}</option></select>`;
            }else if(/^\s*(text|date|number|tel|email|password)\s*$/.test(row.type)){
                return `<input type="${row.type}" v-model="entity.${row.field}" @change="change(rows[${index}])" placeholder="${row.placeholder}">`;
            }else{
                return `<${row.type} :data="entity.${row.field}" v-model="entity.${row.field}" placeholder="${row.placeholder}"></${row.type}>`;
            }
        };

        this.$options.template = this.$options.template.replace('{{rows}}',()=>{
            return this.rows.map((row,index)=>{
                return `<div class="row">
                    <label>{{rows[${index}].title | language}}</label>
                    <span>${editor(row,index)}</span>
                    <span><i>{{errors.${row.field}|language}}</i></span>
                </div>
                `;
            }).join('');
        })
    },
    methods:{
        validator:function(row){
            var error = '';
            if(row.required && !this.entity[row.field]){
                error = row.title + '不可为空';
            }else{
                error = row.validator && row.validator(this.entity[row.field]);
            }
            if(!error){
                this.errors[row.field] = '';
            }else{
                this.errors[row.field] = error;
            }
            return !error;
        },
        click:function(ac){
            if(/!/.test(ac.name) || !this.rows.filter(r=>!this.validator(r)).length){
                this.$emit(ac.name.replace(/!/,''),this.entity,ac);
            }
        },
        change:function(row){
            if(this.validator(row)){
                this.data[row.field] = this.entity[row.field];
                this.$emit('change',row,this.entity);
            } 
        }
    }
};