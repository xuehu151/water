<template>
    <div class="available-box">

    </div>
</template>

<script>
    import {screenLine} from '../../public/charts';
    export default {
        data () {
            return {
                availableLine: null,
                villages: ['五台乡','西辛庄','东窑村','天顶山','王家庄','东岭','和平村','吴嘉玲','西寺','南窑头','幸福村','不幸福村'],
                availableScale: [11, 22, 33, 22, 33, 44, 55, 43, 67, 45, 23, 45]  
            };
        },
        mounted () {
            this.$http({url: '/villages', method: 'get'}).then(() => {
                //console.log(res);
                const availableBox = document.getElementsByClassName('available-box')[0];
                this.availableLine = screenLine(availableBox,this.villages,this.availableScale);
            });
        },
        methods: {
            addResize () {
                this.availableLine.resize();
            }
        }

    };
</script>

<style>
    .available-box{
        width: 100%;
        height: 100%;
    }
</style>


