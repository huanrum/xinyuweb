var Vue = require('./../lib/vue/vue');
var toexel = require('./../lib/toexel');

/**
 * 一些公用的功能方法
 */
module.exports = (function(){
    var dialog = null,root = null,cache = {},accountRefshList = [];
    var isvalue = v=>typeof v !== 'undefined';
    var getBaseUrl = () => {
        if(localStorage['xinyu/baseUrl']){
            return localStorage['xinyu/baseUrl'];
        } else if(location.hostname === '127.0.0.1'){
            return 'http://localhost:8888/xinyu/';
        }else {
            return 'http://218.87.99.93:8080';
        }
    };
    return {
        copyright:'Copyright ©2018 ky51.cn All Rights Reserved.  <a href="http://www.miitbeian.gov.cn" target="_blank">粤ICP备12072665号-4</a>',
        baseurl: getBaseUrl(),
        /**
         * 一次请求的数据条数
         */
        lineCount:999999,
        /**
         * 存取VUE根元素
         */
        root:function(value){
            if(value){
                root = value;
            }else{
                return root;
            }
        },
        /**
         * 异步加载js/css文件
         */
        load:function(url){
            return new Promise(function(succ){
                var callback = function(){setTimeout(succ,1000);};
                setTimeout(function(){
                    if(/\.js/.test(url)){
                        var script = document.createElement('script');
                        script.src = url;
                        script.onload = callback;
                        document.body.appendChild(script);
                    }
                    if(/\.css/.test(url)){
                        var link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = url;
                        link.onload = callback;
                        document.head.appendChild(link);
                    }
                },500);
            });
        },
        /**
         * 存取账号信息
         */
        account:function(value){
            if(typeof value === 'function'){
                accountRefshList.push(value);
            }else if(isvalue(value)){
                value.user_id = value?value.token.split('|').pop():'';
                this.storage('[xinyu]/account',JSON.stringify(value));
                accountRefshList.forEach(i=>i());
            }else{
                return JSON.parse(this.storage('[xinyu]/account')||'{}')||{};
            }
        },
        cache:function(key,value){
            if(isvalue(value)){
                cache[key] = value;
            }else{
                return cache[key];
            }
        },
        storage:function(key,value,local){
            if(local){
                if(value){
                    localStorage['[xinyu]/'+key] = value;
                }else{
                    delete localStorage['[xinyu]/'+key];
                }
            }
            if(isvalue(value)){
                sessionStorage['[xinyu]/'+key] = value;
            }else{
                return sessionStorage['[xinyu]/'+key] || localStorage['[xinyu]/'+key];
            }
        },
        /**
         * 导出表格
         */
        toexel:function(){
            return toexel.apply(this,arguments);
        },
        /**
         * 弹窗
         */
        dialog:function(){
            if(!dialog){
                dialog = require('./components/dialog');
            }
            return dialog.apply(this,arguments);
        },
        date:function(obj){
            if(obj){
                var date =  new Date(obj);
                var y = 1900+date.getYear();
                var m = "0"+(date.getMonth()+1);
                var d = "0"+date.getDate();
                return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
            }
        },
        filter: function(name){
            return Vue.filter(name);
        },
        /**
         * 选择文件
         */
        selectFile:function(accept){
            return new Promise(function(succ){
                var input = document.createElement('input');
                input.type = 'file';
                input.accept = accept;
                input.style.opacity = 0;
                document.body.appendChild(input);
                input.onchange = function(e){
                    document.body.removeChild(input);
                    succ(input.files);
                };
                input.click();
            });
        }
    };
})();