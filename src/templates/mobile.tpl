<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title><%=title%></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<script>!function(e){function h(){var a=f.getBoundingClientRect().width;640<a/b&&(a=640*b);a/=16;f.style.fontSize=a+"px";e.rem=a}function k(a,b,c,e){var d;return function(){var f=e||this,g=arguments,h=c&&!d;clearTimeout(d);d=setTimeout(function(){d=null;c||a.apply(f,g)},b);h&&a.apply(f,g)}}var b,a,d,c=e.document,g=e.navigator,f=c.documentElement,i=c.querySelector('meta[name="viewport"]');d=c.querySelector('meta[name="flexible"]');i?(d=i.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/))&&(a=parseFloat(d[2]),b=parseInt(1/a)):d&&(d=d.getAttribute("content").match(/initial\-dpr=(["']?)([\d\.]+)\1?/))&&(b=parseFloat(j[2]),a=parseFloat((1/b).toFixed(2)));!b&&!a&&(b=e.devicePixelRatio,b=g.appVersion.match(/android/gi)||g.appVersion.match(/iphone/gi)?3<=b?3:2<=b?2:1:1,a=1/b);f.setAttribute("data-dpr",b);i||(a='<meta name="viewport" content="width=device-width, initial-scale='+a+", maximum-scale="+a+", minimum-scale="+a+', user-scalable=no" />',f.firstElementChild?(g=c.createElement("div"),g.innerHTML=a,f.firstElementChild.appendChild(g.firstChild)):c.write(a));e.dpr=b;e.addEventListener("resize",k(h,50),!1);e.addEventListener("pageshow",k(function(a){a.persisted&&h()},300),!1);"complete"===c.readyState?c.body.style.fontSize=12*b+"px":c.addEventListener("DOMContentLoaded",function(){c.body.style.fontSize=12*b+"px"},!1);h()}(window);</script>
<style>
html,body{
    height: 100%;
    margin: 0 auto;
    padding: 0;
    background-color: <%=backgroundColor%>;
}
body{
    position: relative;
    max-width: 16rem;
    overflow: auto;
}
.container{
    min-height: 100%;
    overflow: hidden;
}
.background-image{
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
}
.link-element{
    position: absolute;
    z-index: 889;
}
.statistics{
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
}
</style>
</head>
<body>
<div class="container">
    <div class="elements">
        <%background.forEach(function(img) {%><img src="<%=getBackgroundImageUrl(img, release)%>" alt="<%=img.name%>" class="background-image"><%})%>
        <%elements.links.forEach(function(link){ %><a class="link-element" style="<%=parseStyle(link)%>" href="<%=link.url%>" data-href="<%=link.url%>" target="<%=link.target%>"></a><% })%>
    </div>
</div>
<%
var includeAPPLinks = elements.links.filter(function(link) {
    return ['PAGE_RECHARGE', 'PAGE_COUPONS', 'PAGE_WALLET', 'PAGE_INVITE'].includes(link.url)
}).length > 0
var needShare = shareTitle + shareDesc + shareImage
%>
<%
if (includeAPPLinks || needShare) {
%>
<script>
~function() {

    var token = $get('token');
    var browser = null;
    var ua = navigator.userAgent.toLowerCase();

    if (
        ua.indexOf(encodeURIComponent('骑电').toLowerCase()) !== -1 ||
        ua.indexOf('59store') !== -1 ||
        ua.indexOf('qeebike') !== -1 ||
        ua.indexOf('qeek') !== -1 ||
        ua.indexOf('qiji') !== -1 ||
        token
    ) {
        browser = 'APP'
    }

    ua.indexOf('micromessenger') !== -1 && (browser = 'WEIXIN');

    if (window.__wxjs_environment && window.__wxjs_environment === 'miniprogram') {
        browser = 'WeAPP'
    }

<%
    if (includeAPPLinks) {
%>
    var links = document.querySelectorAll('a');

    var appLinkMap = {
        PAGE_RECHARGE: "qeebike://wallet/recharge",
        PAGE_COUPONS: "qeebike://personal/coupon",
        PAGE_WALLET: "qeebike://personal/my_wallet",
        PAGE_INVITE: "qeebike://personal/invite_friend"
    }

    var h5LinkMap = {
        PAGE_RECHARGE: "//m.qeebike.com/#/user/recharge",
        PAGE_COUPONS: "//m.qeebike.com/#/user/coupons",
        PAGE_WALLET: "//m.qeebike.com/#/user/wallet",
        PAGE_INVITE: "//m.qeebike.com/"
    }

    var weappLinkMap = {
        PAGE_RECHARGE: "redirect?authorize=1&url=recharge",
        PAGE_COUPONS: "redirect?authorize=1&url=coupons",
        PAGE_WALLET: "redirect?authorize=1&url=wallet",
        PAGE_INVITE: "redirect?authorize=1&url=invite"
    }

    ;[].forEach.call(links, function(link) {

        var href = link.dataset.href;

        if (!href) {
            return;
        }

        if (appLinkMap[href]) {
            includeAppLink = true
            if (browser === 'WeAPP') {
                link.onclick = function () {
                    wx.miniProgram.navigateTo({url: weappLinkMap[href]})
                    return false
                }
            } else {
                href = browser === 'APP' ? appLinkMap[href] : h5LinkMap[href]
            }
        }

        if (href === 'javascript:void(0);') {
            return;
        }

        if (browser !== 'APP' && browser !=='WeAPP' && href.indexOf('token=') === -1) {

            if (href.indexOf('?') === -1) {

                if (href.indexOf('#') === -1) {
                    href = href + '?token=' + token;
                } else {
                    href = href.replace('#', '?token=' + token + '#');
                }

            } else {
                href = href.replace('?', '?token=' + token + '&');
            }

        }

        link.setAttribute('href', href);

    });

<%
    }
%>

    if (browser === 'APP') {

        var appSDKScript = document.createElement('scrpt')

        appSDKScript.onload = function () {

            if (typeof HXSJSBridge !== 'undefined') {
                HXSJSBridge.setNavigationButton({
                    type: null,
                    title: null,
                    image: null,
                    link: null
                });
<%
    if (needShare) {
%>
                HXSJSBridge.setShareInfo({
                    type: [1,2,3,4],
                    title: '<%=shareTitle%>' || document.title,
                    content: '<%=shareDesc%>' ? '<%=shareDesc%>'.substr(0, 45) : '暂无介绍',
                    image: '<%=shareImage%>',
                    link: location.href.replace('token=' + token, '')
                });
<%
    }
%>
            }

        }

        document.body.appendChild(appSDKScript)
        appSDKScript.src = '//fecdn.qeebike.com/sdk/hxsjssdk_1.0.js?v20180913'

    } else if (browser === 'WEIXIN' || browser === 'WeAPP') {

        var wxSDKScript = document.createElement('script');

        wxSDKScript.onload = function () {

            var wxConfigScript = document.createElement('script');

            wxConfigScript.onload = function () {
                typeof wx !== 'undefined' && wx.ready(function() {
<%
    if (needShare) {
%>
                    wx.onMenuShareAppMessage({
                        title: '<%=shareTitle%>' || document.title,
                        desc: '<%=shareDesc%>' ? '<%=shareDesc%>'.substr(0, 45) : '暂无介绍',
                        imgUrl: '<%=shareImage%>',
                        link: location.href.replace('token=' + token, '')
                    });
                    wx.onMenuShareTimeline({
                        title: '<%=shareTitle%>' || document.title,
                        imgUrl: '<%=shareImage%>',
                        link: location.href.replace('token=' + token, '')
                    });
<%
    }
%>
                })
            }

            document.body.appendChild(wxConfigScript)
            wxConfigScript.src = '//wx.qeebike.com/wechat/jsconfig?mpName=qeebike&url=' + encodeURIComponent(location.href.split('#')[0])

        }

        document.body.appendChild(wxSDKScript)
        wxSDKScript.src = '//res.wx.qq.com/open/js/jweixin-1.3.0.js'
    }

    function $get(name){

        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);

        if (r != null) {
            return unescape(r[2]);
        }

        return null;

    }

}();
</script>
<%
}
%>
<div class="statistics">
<%=statisticsCode%>
</div>
</body>
</html>
