

/**
 * tab组件
 */
module.exports = {
    props: ['items'],
    template:`<div class="tabs">
                <div v-for="menu in items" @click="tab(menu.name)" :class="{'active':menu.name==active}">
                    <i :class="'tab-'+menu.name"></i><span>{{menu.title|language}}</span>
                </div>
            </div>`,
    data:function(){
        return {
            active:(this.items[0] || {name:''}).name
        }
    },
    methods:{
        tab:function(name){
            this.active = name;
            this.$emit('input',name);
            this.$emit('tab',name);
        }
    }
};