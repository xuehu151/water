<template>
<!-- 月维修分析柱状图 -->
  <div class="month-maintain-box">

  </div>
</template>

<script>
  import {barCharts} from '@/public/charts';
  export default {
    data () {
      return {
          monthMaintainBar: null,
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '10月'],
          monthsData: [11, 22, 33, 44, 55, 66, 77, 88]
      };
    },
    methods: {
        addResize () {
          this.monthMaintainBar.resize();
        }
    },
    mounted () {
        this.$http({ url: '/villages', method: 'get' })
          .then(() => {
            //const result = res.result.rows;
            //console.log(res);
            const monthMaintainBox = document.getElementsByClassName('month-maintain-box')[0];
            this.monthMaintainBar = barCharts(monthMaintainBox, this.months, this.monthsData, '#00d4f1','#f2f2f2');
          });
    }
  };
</script>

<style>
    .month-maintain-box{
        width: 100%;
        height: 100%;
    }
</style>
