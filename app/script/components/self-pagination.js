

/**
 * 分页导航栏组件
 */
module.exports = {
    props: ['pageCount','page'],
    template:`<div v-if="!!pageCount && pageCount>1" class="paginations">
                <a @click="pagination(1)"><img src="source/images/common/prev2.png"></a>
                <a @click="pagination(false)"><img src="source/images/common/prev1.png"></a>
                <a><input v-model="value"><span>共{{pageCount}}页<span></a>
                <a @click="pagination(true)"><img src="source/images/common/next1.png"></a>
                <a @click="pagination(pageCount)"><img src="source/images/common/next2.png"></a>
                <select v-model="value"><option v-for="p in pageCount" :value="p">{{p}}</option></select>
            </div>`,
    data:function(){
        return {
            value:this.page || 1,
            pagecountCount:10
        };
    },
    watch: {
        value:function(){
            this.$emit('input',this.value);
        }
    },
    methods:{
        pages:function(last){
            var count = Math.ceil(Math.min(this.pagecountCount,this.pageCount)/2);
            if(!last){
                return Array(count).fill(1).map((v,i)=>i+1);
            }else{
                return Array(count).fill(1).map((v,i)=>this.pageCount-i).reverse();
            }
        },
        pagination:function(page){
            if(typeof page === 'boolean'){
                if(page && this.value<this.pageCount){
                    this.value += 1;
                }else if(!page && this.value>0){
                    this.value -= 1;
                }
            }else if(this.value != page){
                this.value = page;
            }
        }
    }
};