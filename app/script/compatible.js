
/**
 * 这里是处理简单的浏览器兼容，由于项目使用了一个非所有浏览器支持的特性
 */
(function () {
    window.Promise = window.Promise || $Promise;
    window.fetch = window.fetch || $fetch;
    window.document.addEventListener = window.document.addEventListener || $addEventListener
    Object.assign = Object.assign || $assign;
    Array.prototype.fill = Array.prototype.fill || arrayFill;
    Array.prototype.map = Array.prototype.map || arrayMap;
    Array.prototype.forEach = Array.prototype.forEach || arrayForeach

    function $addEventListener(key,fn){
        window.document.attachEvent('on'+key,fn);
    }

    function $fetch(url, option) {
        var xhr = null,
            callBack = [],
            errorBack = [];
        option = option || {};
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/xml');
            }
        } else {
            xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        
        xhr.onreadystatechange = onreadystatechange;
        xhr.open(option.method||'GET', url, true);
        if(option.headers){
            for(var key in option.headers){
                xhr.setRequestHeader(key, option.headers[key]);
            }
        }
        xhr.send(option.body);

        return {
            then: then,
            error: error
        };

        function onreadystatechange() {
            var data = {
                status: 200,
                headers: {
                    get: function (name) {
                        return xhr.getResponseHeader(name);
                    }
                },
                text: function () {
                    return xhr.responseText;
                },
                json: function () {
                    return JSON.parse(xhr.responseText);
                }
            };
            if (xhr.readyState === 4 && xhr.status === 200) {
                callBack.forEach(function (fn) {
                    data = fn(data) || data;
                });
            } else if (xhr.readyState === 3 && xhr.status !== 200) {
                errorBack.forEach(function (fn) {
                    data = fn(data) || data;
                });
            }
        }

        function then(fn) {
            callBack.push(fn);
            return this;
        }

        function error(fn) {
            errorBack.push(fn);
            return this;
        }
    }



    function $Promise(init) {
        var resloveList = [],
            rejectList = [];
        this.then = function (reslove, reject) {
            resloveList.push(reslove);
            rejectList.push(reject);
            return this;
        };
        this.reslove = function (req) {
            setTimeout(function () {
                resloveList.forEach(function (reslove) {
                    reslove && reslove(req);
                });
            }, 10);
        }
        this.reject = function (err) {
            setTimeout(function () {
                rejectList.forEach(function (reject) {
                    reject && reject(err);
                });
            }, 10);
        }

        init(this.reslove, this.reject);
    }

    $Promise.resolve = function(){
        var args = arguments;
        var promise = new $Promise(function(){});
        setTimeout(function(){
            promise.reslove.apply(promise,args);
        });
        return promise;
    }

    $Promise.all = function(promiseList){
        var count = 0,promise = new $Promise(function(){});
        for(var i=0,length = promiseList.length;i<length;i++){
            if(promiseList[i] && promiseList[i].then){
                count = count + 1;
                promiseList[i].then(function(){
                    count = count - 1;
                    if(!count){
                        setTimeout(promise.reslove);
                    }
                });
            }
        }
        return promise;
    }

    function $assign(obj){
        var args = arguments;
        obj = obj || {};
        for(var i=1,length = args.length;i<length;i++){
            Object.keys(args[i]||{}).forEach(function(key){
                obj[key] = args[i][key];
            })
        }
        return obj;
    }

    function arrayFill(value){
        for(var i=0,length=this.length;i<length;i++){
            this[i] = value;
        }
        return this;
    }

    function arrayMap(fn){
        var list = [];
        for(var i=0,length=this.length;i<length;i++){
            list(fn(this[i],i,this));
        }
        return list;
    }

    function arrayForeach(fn){
        for(var i=0,length=this.length;i<length;i++){
            list(fn(this[i],i,this));
        }
    }

    if((function(){
        //var userAgent = navigator.userAgent;
        //判断是否火狐浏览器
        // if (userAgent.indexOf("Firefox") > -1) {
        //     return "FF";
        // }
        //判断是否IE浏览器
        // if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        //     return "IE";
        // }
        // //判断是否Edge浏览器
        // if (userAgent.indexOf("Trident") > -1) {
        //     return "Edge";
        // }
        return true;
    })()){
        var laydate = require('../lib/laydate');
        laydate.render({
            format:'yyyy/MM/dd',
            elem: '' //指定元素
        });
        var fireEvent = (target,type)=>{
            if(document.createEvent){
                var evObj = document.createEvent('HTMLEvents');
                evObj.initEvent(type, true, true );
                target.dispatchEvent(evObj);
            }else if( document.createEventObject){
                target.fireEvent('on' + type);
            }
        };

        document.addEventListener('click',function(e){
            if(/^\s*date\s*$/.test(e.target.getAttribute('type')) && e.target.nodeName === 'INPUT' && !e.target.getAttribute('lay-key')){
                e.target.type = '';
                e.target.blur();
                laydate.render({
                    format:'yyyy/MM/dd',
                    elem: e.target //指定元素
                });
                e.target.addEventListener('blur',function(){
                    setTimeout(function(){
                        fireEvent(e.target,'input');
                        fireEvent(e.target,'change');
                    },500);
                });
                setTimeout(()=>{
                    e.target.focus();
                },10);
            }
        });
    }
    
})();