<template>
    <div class="supplies-box">

    </div>
</template>

<script>
    import {screenLine} from '@/public/charts';
    export default {
        data () {
            return {
                suppliesLine: null,
                villages: ['五台乡','西辛庄','东窑村','天顶山','王家庄','东岭','和平村','吴嘉玲','西寺','南窑头','幸福村','不幸福村'],
                suppliesNumber: [
                    22452,
                    10213,
                    19562,
                    34324,
                    40323,
                    50000,
                    52200,
                    61234,
                    36546,
                    24545,
                    42312,
                    35511
                ]  
            };
        },
        methods: {
            addResize () {
                this.suppliesLine.resize();
            }
        },
        mounted () {
            this.$http({url: '/villages', method: 'get'}).then(() => {
                //console.log(res);
                const suppliesBox = document.getElementsByClassName('supplies-box')[0];
                this.suppliesLine = screenLine(suppliesBox,this.villages,this.suppliesNumber,'#2a3a6b');
            });
        }
    };
</script>


<style>
    .supplies-box{
        width: 100%;
        height: 100%;
    }
</style>

