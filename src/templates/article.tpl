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
</style>
</head>
<body>
<div class="container">
<h1 class="title"><%=title%></h1>
<div class="content"><%=html%></div>
</div>
</html>