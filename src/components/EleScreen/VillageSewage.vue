<template>
    <!-- 污水处理量柱状图 -->
    <div class="sewage-box">

    </div>
</template>

<script>
    import {barCharts} from '../../public/charts';
    export default {
        data () {
            return {
                sewageBar: null,
                villages: ['五台乡','西辛庄','东窑村','天顶山','王家庄','东岭','和平村','吴嘉玲','西寺','南窑头','幸福村','不幸福村'],
                sewageNumber: [
                    13452,
                    10213,
                    20321,
                    34324,
                    44323,
                    50000,
                    60000,
                    70000,
                    16546,
                    24545,
                    32312,
                    65511
                ]  
            };
        },
        methods: {
            addResize () {
                this.sewageBar.resize();
            }
        },
        mounted () {
            this.$http({url: '/villages', method: 'get'}).then(() => {
                const sewageBox = document.getElementsByClassName('sewage-box')[0];
                this.sewageBar = barCharts(sewageBox,this.villages,this.sewageNumber,'rgba(179, 162, 49, .95)');
            });
        }
    };
</script>

<style>
    .sewage-box{
        width: 100%;
        height: 100%;
    }
</style>
