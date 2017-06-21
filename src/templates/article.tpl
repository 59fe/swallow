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
    background-color: #fff;
}
body{
    position: relative;
    max-width: 1024px;
    overflow: auto;
}
.container{
    min-height: 100%;
    overflow: hidden;
}
video, audio{
    max-width: 100%;
    height: auto;
}
</style>
</head>
<body>
<div class="container">
<h1 class="title"><%=title%></h1>
<div class="content">
<!--EDITOR_CONTENT-->
<%=html%>
<!--EDITOR_CONTENT-->
</div>
</div>
<script>
var videos = document.querySelectorAll('video');
var audios = document.querySelectorAll('audio');
[].forEach.call(videos, function(video) {
    video.setAttribute('controls', 'controls');
});
[].forEach.call(audios, function(audio) {
    audio.setAttribute('controls', 'controls');
});
</script>
</html>