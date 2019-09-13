
module.exports = {
    props: ['options','value','placeholder'],
    template:`<div class="input select-input">
                <select v-model="select" @change="change">
                    <option v-for="op in items" :value="op.id">{{op.title|language}}</option>
                </select>
                <input v-model="search" :placeholder="placeholder">
            </div>`,
    data:function(){
        var op =  this.options.filter(i=>i.id == this.value).pop();
        return {
            select:this.value,
            search:op&&op.title || ''
        }
    },
    computed:{
        items:function(){
            return this.options.filter(i=>i.title.indexOf(this.search.trim())!==-1);
        }
    },
    watch: {
        search:function(){
            this.select = '';
            this.$emit('input',this.select);
        }
    },
    methods:{
        change:function(){
            var op =  this.options.filter(i=>i.id == this.select).pop();
            this.search = op&&op.title || '';
            this.$emit('input',this.select);
        } 
    }
};