<template>
<!-- 各村设备运行时长折线图 -->
  <div class="run-time-box">

  </div>
</template>

<script>
import {lineChartsWithZoom} from '../../public/charts';
  export default {
      data () {
          return {
              villages: [],
			  runTime: [],
			  runTimeLineCharts: null
          };
      },
      methods: {
		addResize () {
			this.runTimeLineCharts.resize();
		}
      },
      mounted () {
          //console.log(this.$parent);
          this.$http({ url: '/villages', method: 'get' })
            .then(res => {
                const result = res.result.rows;
                for (let i = 0; i < result.length; i++) {
                    this.villages.push(result[i].name);
                    this.runTime.push(result[i].area);
                }
                const runTimeBox = document.getElementsByClassName('run-time-box')[0];
                this.runTimeLineCharts = lineChartsWithZoom(runTimeBox,this.villages,this.runTime);
            });
      }
  };
</script>


<style>
    .run-time-box{
        width: 100%;
        height: 230px;
    }
</style>

