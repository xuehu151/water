<template>
    <div class="charts-box-di">

    </div>
</template>

<script>
    import {barCharts} from '@/public/charts';
    export default {
       
        data () {
            return {
                dataX: [1,2,3,4,5],
                dataY: [11,22,33,44,55]
            };
        },
        methods: {
            buildLineCharts (dom) {
                barCharts(dom,this.dataX,this.dataY);
            }
        },
        mounted () {
            
            const el = document.getElementsByClassName('charts-box-di')[0];
            this.buildLineCharts(el);

        }

    };
</script>

<style>

    .charts-box-di{
        width:800px;
        height: 460px;
    }

</style>
