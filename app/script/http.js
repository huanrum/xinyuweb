
var common = require('./common');

/**
 * API请求的基础方法包括加密、发起请求以及异常返回处理
 */
module.exports = (function () {
    var requestCount = 3;
    var href = location.href.split(/[#\?]/).shift();
    var init = false;
    if(/\/+index\.html$/.test(href)){
        href = href.replace(/\/+index\.html$/,'');
    }

    window.baseurl = common.baseurl;
    
    setTimeout(function () {
        init = true;
    }, 2000);

    //返回信息处理
    var returnMessage = (function(){
        var panel = document.createElement('div');
        panel.className = 'return-message';
        document.body.appendChild(panel);
        return function(type,message){
            var messageElement = document.createElement('div');
            messageElement.className = 'return-message-item';
            panel.appendChild(messageElement);
            messageElement.innerHTML = message;
            setTimeout(function(){
                panel.removeChild(messageElement);
            },3000);
        };
    })();

    //loading显示
    var waitTimeout = (function(){
        var timeout = null;
        return ()=>{
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                togleLoading();
            },10*1000)
        }
    })();

    //loading状态切换管理
    var togleLoading = (function () {
        var icon = '<div class="fa fa-spinner fa-pulse fa-spin fa-5x"></div>';
        var loading = document.createElement('div');
        var loadCount = 0;
        loading.className = 'loading';
        loading.style.display = 'none';
        document.body.appendChild(loading);
        return function (url, add) {
            if(!url){
                loadCount = 0;
                loading.style.display = 'none';
                return;
            }
            if (!/\[noloading\]/.test(url)) {
                if(typeof add === 'number'){
                    loadCount = loadCount + add;
                    if (loadCount) {
                        loading.innerHTML = icon;
                        loading.style.display = '';
                    } else {
                        loading.style.display = 'none';
                    }
                }else{
                    returnMessage(1,`<div class="error"><strong>${add}</strong></div>`);
                    loadCount = loadCount - 1;
                    loading.style.display = 'none';
                }
            }
        };
    })();

    /**
     * API请求
     * url地址，params参数body内容，extendData额外的处理参数的方法
     */
    return Object.assign(function(url, params){
        var paramsStr = Object.keys(params||{}).map(i=>`${i}=${params[i]}`).join('&');
        return httpFn(url + (paramsStr?(/\?/.test(url)?'&':'?'):'') + paramsStr)
    }, {
        post: httpFn
    })
    
    function httpFn(url, params, extendData) {
        togleLoading(url, 1);
        waitTimeout();
        if(/^\?/.test(url)){
            url = href + '/' + url.slice(1);
            return new Promise(function (succ) {
                fetch(url).then(r => r.json()).then(function (res) {
                    togleLoading(url, -1);
                    succ(res);
                });
            });
        }else if (/^\./.test(url)) {
            url = location.origin + '/xinyu/' + url.slice(2);
            return new Promise(function (succ) {
                fetch(url, { method: 'POST', body: JSON.stringify(params) }).then(r => r.json()).then(function (res) {
                    togleLoading(url, -1);
                    succ(res.data);
                });
            });
        } else {
            url = window.baseurl + '/' + url.replace(/\[.*\]/, '');
            return new Promise(function (resole, reject) {
                if (init) {
                    http(url, params, extendData, requestCount).then(resole, reject);
                } else {
                    setTimeout(function () {
                        init = true;
                        http(url, params, extendData, requestCount).then(resole, reject);
                    }, 2000);
                }
            });
        }
    }

    /**
     * 最终的API调用
     */
    function http(url, params, extendData, rCount) {
        return new Promise(function (resole, reject) {
            var bodyData = JSON.stringify(params);
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            if(extendData){
                bodyData = extendData(bodyData,headers);
            }
            try {
                fetch(url, {
                    method: bodyData ? 'POST' : 'GET',
                    headers: headers,
                    body: bodyData
                }).then(r => r.text()).then(function (res) {
                    var respon = JSON.parse(res||'{}');

                    if (!respon.code || respon.code == 1000) {
                        console.log(url, JSON.parse(JSON.stringify(params||null)),respon.data);
                        togleLoading(url, -1);
                        resole(respon.data);
                    }else if(respon.code == 813 && rCount>0){
                        console.log(url, JSON.parse(JSON.stringify(params||null)),respon.message +',重新发起请求');
                        http(url, params, extendData, rCount-1).then(resole, reject);
                    }else {
                        console.log(url, JSON.parse(JSON.stringify(params||null)),respon.message);
                        if (manageError(respon)) {
                            togleLoading(url, respon.message);
                            reject(respon);
                        }else{
                            togleLoading();
                        }
                    }
                },error=>{
                    togleLoading(url, error.message);
                    require('./common').root().$router.push({name:'error',query:{errors:error.message}});
                });
            }
            catch (e) {
                togleLoading(url, -1);
                reject(e);
            }
        });
    };

    /**
     * 返回的错误处理
     */
    function manageError(error) {
        var APP = require('./common').root();
        switch (error.code) {
            case 99:
                APP.$router.push({name:'login'});
                return false;
            default:
                break;
        }
        return true;
    }

})();