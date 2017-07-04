<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
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
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-all;
}
video, audio, img{
    max-width: 100%;
}
img{
    height: auto;
}
blockquote{
    border-left: 5px solid #EEE;
    color: #666;
    margin: 16px 0;
    padding: 10px 20px;
}
pre{
    background-color: rgba(0, 0, 0, 0.05);
    font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
    font-size: 16px;
    margin: 10px 0;
    padding: 20px;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
</head>
<body>
<div class="container">
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