var Vue = require('./../lib/vue/vue');

/**
 * 一些公用的功能方法
 */
module.exports = (function(){
    var dialog = null,root = null,cache = {},accountRefshList = [];
    var isvalue = v=>typeof v !== 'undefined';
    var fullKey = key => '[xinyu]/'+key;
    var getBaseUrl = () => {
        if(localStorage[fullKey('baseUrl')]){
            return localStorage[fullKey('baseUrl')];
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
         * 时间处理
         */
        event:(function(){
            var events = {};
            return function(type, fn){
                if(typeof fn === 'function'){
                    events[type] = events[type] || [];
                    events[type].push(fn);
                }else if(fn === null){
                    events[type] = null;
                }else {
                    (events[type] || []).forEach(fn => {
                        fn.apply(this, Array.prototype.slice.call(arguments,1));
                    });
                }
            };
        })(),
        /**
         * 存取账号信息
         */
        account:function(value){
            if(typeof value === 'function'){
                accountRefshList.push(value);
            }else if(isvalue(value)){
                value.user_id = value?value.token.split('|').pop():'';
                this.storage('account',JSON.stringify(value));
                accountRefshList.forEach(i=>i());
            }else{
                return JSON.parse(this.storage('account')||'{}')||{};
            }
        },
        log:function(){
            if(/^(localhost|127.0.0.1)$/.test(location.hostname)){
                console.log.apply(console, arguments);
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
            var $fullKey = fullKey(key);
            if(local){
                if(value){
                    localStorage[$fullKey] = value;
                }else{
                    delete localStorage[$fullKey];
                }
            }
            if(isvalue(value)){
                sessionStorage[$fullKey] = value;
            }else{
                return sessionStorage[$fullKey] || localStorage[$fullKey];
            }
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
        sum: function(args){
            var result = 0;
            args.forEach(i=>result+=i);
            return result;
        },
        color: function(args, opacity = 1){
            if(args instanceof Array){
                return args.map(i => this.color(i, opacity));
            }else{
                var num = this.sum(Array.prototype.map.call(JSON.stringify(args),s=>s.charCodeAt()));
                var color = parseInt(new Date(10000).setYear(num%200000).toString(16).slice(-8, -2),16);
                return `rgb(${[Math.floor(color/256/256),Math.floor(color/256)%256,color%256,opacity].join()})`;
            }
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