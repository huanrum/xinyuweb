var Vue = require('./../../lib/vue/vue');

module.exports = (function(){

    var template = `<div class="dialog-panel">
        <div class="dialog" :class="dialogclass" :style="{width:width,height:height}">
            <div class="dialog-head">
                <label>{{title|language}}</label>
                <a @click="$close">&times;</a>
            </div>
            <div class="dialog-content" :class="level">
                @html@
            </div>
            <div class="dialog-footer">
                <a v-for="ac in actions" class="btn" :class="ac.class||'btn-primary'" @click="ac.fn(entity)">{{ac.title|language}}<a>
            </div>
        </div>
    </div>`;
    
    return function(data,html,interval){
        var dialogPanel = document.createElement('div');
        var _data = {}, _methods = {};
        document.body.appendChild(dialogPanel);

        Object.keys(data).forEach(function(k){
            if(typeof data[k] === 'function'){
                if(k === 'actions'){
                    _data[k] = [{title:'确定',class:'ok',fn:function(i){data[k](i);}},{title:'取消',class:'cancel',fn:function(i){document.body.removeChild(dialog.$el);}}];
                }else{
                    _methods[k] = data[k];
                }
            }else{
                _data[k] = data[k];
            }
        });

        if(interval){
            setTimeout(function(){
                if(dialog.$el.parentNode){
                    dialog.$el.parentNode.removeChild(dialog.$el)
                }
            },interval);
        }

        var dialog = new Vue({
            template:template.replace('@html@',html),
            data:Object.assign({
                dialogclass:'',
                level:'',
                width:'800px',
                height:'auto',
                title:'提示消息',
                entity:{},
                actions:[]
            },_data),
            created:function(){
                this.actions.forEach(a=>a.fn.bind(this));
            },
            methods:Object.assign(_methods,{
                $close:()=>document.body.removeChild(dialog.$el)
            })
        }).$mount(dialogPanel);

        drag(dialog.$el.children[0],dialog.$el);

        return function(){
            document.body.removeChild(dialog.$el);
        };
    };

    function drag(element, toParent) {
        var temp = {},dragElement = element,canDrag = function(){return true;};
       
        if (element instanceof Array) {
            dragElement = element[1];
            element = element[0];
        }

        dragElement = element.getElementsByClassName('dialog-head')[0];
        
        if (typeof toParent === 'function') {
            canDrag = toParent;
            toParent = null;
        }

        dragElement.addEventListener('mousedown', function (e) {
            var style = window.getComputedStyle(element);
            if (e.clientX < (parseInt(style.left) || 0) + (parseInt(style.width) || 0) - 15 ||
                e.clientY < (parseInt(style.top) || 0) + (parseInt(style.height) || 0) - 15) {
                mousedown(e);
            }
        });

        window.addEventListener('mouseup', function () {
            temp.e = null;
            element.style.cursor = 'default';
            Array.prototype.forEach.call(element.children, function (child) {
                child.style.cursor = element.style.cursor;
            });
            window.removeEventListener('mousemove', mousemove);
            if (toParent && toParent !== element.parentNode) {
                toParent.appendChild(element);
            }
            if (element.recycle && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        return function (e, recycle) {
            element.style.position = 'fixed';
            element.style.left =  e.clientX - 10 + 'px';
            element.style.top = e.clientY - 10 + 'px';
            mousedown(e);
            if (recycle) {
                window.addEventListener('mousemove', recycleOverlap);
            }
            function recycleOverlap() {
                if (!element.parentNode) {
                    window.removeEventListener('mousemove', recycleOverlap);
                }
                if(!temp.e){return;}
                element.recycle = overlap(element, recycle);
                element.style.cursor = element.recycle ? 'url(resource/delete.ico),move' : 'default';
                Array.prototype.forEach.call(element.children, function (child) {
                    child.style.cursor = element.style.cursor;
                });
            }
        };

        function overlap(element, recycle) {
            var containerRect = recycle.getBoundingClientRect();
            var selfRect = element.getBoundingClientRect();
            return !(beyond(containerRect.left, containerRect.right, selfRect.left) ||
                beyond(containerRect.left, containerRect.right, selfRect.right) ||
                beyond(containerRect.top, containerRect.bottom, selfRect.top) ||
                beyond(containerRect.top, containerRect.bottom, selfRect.bottom));

            function beyond(a, b, num) {
                return num < Math.min(a, b) || num > Math.max(a, b);
            }
        }

        function mousedown(e) {
            var style = window.getComputedStyle(element);
            temp.e = e;
            temp.x = e.clientX - (parseInt(style.left) || 0);
            temp.y = e.clientY - (parseInt(style.top) || 0);
            element.style.cursor = 'move';
            window.addEventListener('mousemove', mousemove);
        }
        function mousemove(e) {
            if(canDrag(e)){
                element.style.left = e.clientX - temp.x + 'px';
                element.style.top = e.clientY - temp.y + 'px';
            }
        }
    };

})();