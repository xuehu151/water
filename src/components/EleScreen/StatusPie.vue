<template>
    <!-- 设备状态饼图 -->
    <div class="status-box">

    </div>
</template>

<script>
    import {screenPie} from '@/public/charts';
    export default {
        data () {
            return {
                statusPie: null,
                initData: [
                    { value: 50, name: '离线' },
                    { value: 100, name: '正常' },
                    { value: 200, name: '故障' }
                ]
            };
        },
        methods: {
            addResize() {
                this.statusPie.resize();
            }
        },
        mounted () {
            this.$http({url: '/villages', method: 'get'}).then(()=> {
                const statusBox = document.getElementsByClassName('status-box')[0];
                this.statusPie = screenPie(statusBox,this.initData);
            });
        }
    };
</script>

<style>
    .status-box{
        width: 100%;
        height: 100%;
    }
</style>


