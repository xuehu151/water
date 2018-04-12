<template>
    <div id = "app">
        <router-view />
    </div>
</template>

<script>
    export default {
        name : 'App',
    };
</script>

<style>
    html, body {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }

    body * {
        box-sizing: border-box;
    }

    html {
        font-size: 12px;
    }

    img {
        display: block;
    }

    ul, ol {
        list-style: none;
    }

    body, div, h1, h2, h3, h4, h5, ul, ol, dl, li, dt, dd {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        width: 100%;
        height: 100%;
    }

    table {
        font-size: 16px;
    }

    .el-table th {
        color: #A0A3AA;
        font-size: 15px;
        font-weight: 700;
    }

    .el-table td, .el-table th {
        padding: 10px 0;
    }

    .el-pagination {
        text-align: center;
        margin-top: 25px;
    }

    .el-button--success {
        margin-top: 40px;
        width: 100%;
        /* background: #1e8dbb; */
        border: none;
        color: #ffffff;
        font-size: 16px;
        height: 35px;
        padding: 0;
    }

    .el-button--success > span {
        letter-spacing: 14px;
    }

    .el-button--success:focus,
    .el-button--success:hover {
        /* background: #1e8dbb;
        border-color: #1e8dbb; */
        color: #ffffff;
        opacity: 0.7;
    }

    .el-button--success.is-active,
    .el-button--success:active {
        /* background: #1e8dbb;
        border-color: #1e8dbb; */
        color: #ffffff;
    }
</style>
