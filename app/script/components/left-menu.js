


module.exports = {
    props:{
        routers:Array
    },
    template:`<div class="menu">
        <div class="menu-item" v-for="item in items">
            <div class="menu-content" @click="click(item)" :title="item.title" :class="{selected:selected(item)}">
                <img :src="'source/images/main/'+item.name+(selected(item)?'_sel':'')+'.png'">
                <a v-html="item.title"></a>
                <img v-if="!!item.children.length" :src="src(item)" :style="style(item)">
            </div>
            <div class="menu-child" v-show="item.show">
                <div class="menu-item" v-for="child in item.children">
                    <div class="menu-content" :class="{'_sel':active.path==child.path}" @click="click(child)" :title="child.title">
                        <i class="i-circle" aria-hidden="true"></i><a v-html="child.title"></a>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data(){
        return {
            items:this.routers.filter(i=>/^\/+((?!\/).)*$/.test(i.path)).map(i=>{
                return Object.assign({title:i.name,icon:'',class:'',show:i.show||false,children:[]},i,{
                    children:this.routers.filter(c=>new RegExp('^'+i.path+'\\/+((?!\\/).)+').test(c.path))
                        .map(c=>Object.assign({title:c.name,icon:'',class:'',show:c.show||false,children:[]},c))
                });
            })
        };
    },
    computed: {
        active :function(){
            var active = {path:''};
            var items = Array.prototype.concat.apply([],this.items.map(i=>i.children).concat([this.items]));
            var paths = this.$route.path.split('/');
            for(var i=0;i<paths.length;i++){
                var find = items.filter(r=>r.path === paths.slice(0,i+1).join('/'));
                if(find.length){
                    active = find.pop();
                    active.show = true;
                }
            }
            return active;
        }
    },
    methods:{
        selected:function(item){
            return !item.children.length && this.active.path.indexOf(item.path)!==-1;
        },
        style:function(item){
            return this.active.path.indexOf(item.path)!==-1?'margin-top:10px':''
        },
        src:function(item){
            return `source/images/main/fx_${this.active.path.indexOf(item.path)!==-1?'down':'right'}.png`;
        },
        click:function(item){
            this.active = item;
            if(item.children && item.children.length){
                item.show = !item.show;
            }else{
                this.$emit('goto',item);
            }
        }
    }
};