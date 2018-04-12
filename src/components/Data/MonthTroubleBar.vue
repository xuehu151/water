<template>
  <div class="month-trouble-box">

  </div>
</template>

<script>
  import {barCharts} from '@/public/charts';
  export default {
    data () {
      return {
        monthTroubleBar: null,
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
        monthsData: [11, 22, 33, 44, 55, 66, 77, 88]
      };
    },
    methods: {
        addResize () {
          this.monthTroubleBar.resize();
        }
    },
    mounted () {
        this.$http({ url: '/villages', method: 'get' })
          .then(() => {
            const monthTroubleBox = document.getElementsByClassName('month-trouble-box')[0];
            //this.monthTroubleBar = this.$parent.buildBarCharts(monthTroubleBox, this.months, this.monthsData, '#f3c21d');
            this.monthTroubleBar = barCharts(monthTroubleBox, this.months, this.monthsData, '#f3c21d','#f2f2f2');
          });
    }
  };
</script>

<style>
    .month-trouble-box{
        width: 100%;
        height: 100%;
    }
</style>
