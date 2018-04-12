<template>
    <div class="charts-box-ai">

    </div>
</template>

<script>
    import {lineCharts} from '@/public/charts';
    export default {
        
        data () {
            return {
                dataX: [1,2,3,4,5],
                dataY: [11,22,33,44,55]
            };
        },
        methods: {
            buildLineCharts (dom) {
                lineCharts(dom,this.dataX,this.dataY);
            }
        },
        mounted () {
            
            const el = document.getElementsByClassName('charts-box-ai')[0];
            this.buildLineCharts(el);
            
        }
    };
</script>

<style>

    .charts-box-ai{
        width:800px;
        height: 460px;
    }

</style>
