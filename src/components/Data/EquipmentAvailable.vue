<template>
<!-- 设备可用率折线图 -->
  <div class="available-box">

  </div>
</template>

<script>
  import {lineCharts} from '@/public/charts';
  export default{
    data () {
      return {
        villagesName: [],
        availableScale: [],
        availableLine: null
      };
    },
    methods: {
      addResizeEvent() {
        this.availableLine.resize();
      }
    },
    mounted () {
      this.$http({ url: '/villages', method: 'get' })
        .then(res => {
          const villages = res.result.rows;
          for (let i = 0;i < villages.length;i ++) {
            this.villagesName.push(villages[i].name);
            this.availableScale.push(villages[i].area);
          }
          const availableBox = document.getElementsByClassName('available-box')[0];
          this.availableLine = lineCharts(availableBox, this.villagesName, this.availableScale);
        });
    }
  };
</script>

<style>
  .available-box{
    width: 100%;
    height: 100%;
  }
</style>
