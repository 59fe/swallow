<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title><%=title%></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<script src="http://fecdn.qeebike.com/sdk/hxsjssdk_1.0.js"></script>
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
</style>
</head>
<body>
<div class="container">
    <div class="elements">
        <%background.forEach(function(img) {%><img src="<%=getBackgroundImageUrl(img, release)%>" alt="<%=img.name%>" class="background-image"><%})%>
        <%elements.links.forEach(function(link){ %><a class="link-element" style="<%=parseStyle(link)%>" href="<%=parseAppInnerLink(link.url)%>" target="<%=link.target%>"></a><% })%>
    </div>
</div>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script src="http://wx.qeebike.com/wechat/jsconfig?mpName=qeebike&url=http%3A%2F%2Ffecdn.qeebike.com"></script>
<script>
~function() {

    var token = $get('token');
    var browser = null;
    var ua = navigator.userAgent.toLowerCase();
    var links = document.querySelectorAll('a');
    var appLinks = document.querySelectorAll('[data-app-link]')
    var appLinkFuncs = {
        '优惠券页面': function() {
            HXSJSBridge.pushMyCouponView()
        },
        '订单列表页面': function() {
            HXSJSBridge.openOrderListView(4)
        },
        '信用钱包页面': function() {
            HXSJSBridge.openCreditPayView()
        },
        '花不完页面': function() {
            HXSJSBridge.openCreditCardView()
        }
    }

    ua.indexOf('59store') !== -1 && (browser = 'APP');

    if (token) {
        browser = 'APP';
    }

    ua.indexOf('micromessenger') !== -1 && (browser = 'WEIXIN');

    [].forEach.call(links, function(link) {

        var href = link.href;

        if (link.dataset.appLink) {

            link.addEventListener('click', function() {
                appLinkFuncs[this.dataset.appLink] && appLinkFuncs[this.dataset.appLink]();
            });

            return;

        }

        if (href === 'javascript:void(0);') {
            return;
        }

        if (href.indexOf('token=') === -1) {

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
 
    if (browser === 'APP' && typeof HXSJSBridge !== 'undefined') {

        HXSJSBridge.setNavigationButton({
            type: null,
            title: null,
            image: null,
            link: null
        });

        HXSJSBridge.setShareInfo({
            type: [1,2,3,4],
            title: '<%=shareTitle%>' || document.title,
            content: '<%=shareDesc%>' ? '<%=shareDesc%>'.substr(0, 45) : '暂无介绍',
            image: '<%=shareImage%>',
            link: location.href.replace('token=' + token, '')
        });

    } else if (browser === 'WEIXIN' && typeof wx !== 'undefined') {

        wx.ready(function() {

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

        });

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
<%=statisticsCode%>
</body>
</html>