<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title><%=title%></title>
<style>
html,body{
    height: 100%;
    margin: 0 auto;
    padding: 0;
    background-color: <%=backgroundColor%>;
}
body{
    position: relative;
    min-width: 1200px;
    overflow: auto;
}
.background-element{
    position: absolute;
    z-index: 0;
    left: 0;
    width: 100%;
    min-width: 1200px;
    background-position: 50% 0;
    background-repeat: no-repeat;
}
.link-element{
    position: absolute;
    z-index: 889;
    left: 50%;
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
<div class="elements">
    <%background.forEach(function(img, index) {%><div class="background-element" style="top:<%=getTop(background, index)%>px;height:<%=img.height%>px;background-image:url(<%=getBackgroundImageUrl(img, release)%>);"></div><% top += img.top;})%>
    <% elements.links.forEach(function(link){ %><a class="link-element" style="<%=parseStyle(link)%>" href="<%=link.url%>" target="<%=link.target%>"></a><% })%>
</div>
<div class="statistics">
<%=statisticsCode%>   
</div>
</body>
</html>