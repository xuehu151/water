<template>
<!-- 污水处理量占比饼图 -->
  <div class="sewage-scale-box">

  </div>
</template>

<script>
  import {pieCharts} from '@/public/charts';
  export default{
    data () {
      return {
        sewagePieCharts: null,
        villages: [],
        villagesSewageScale: []
      };
    },
    methods: {
      addResize () {
        this.sewagePieCharts.resize();
      }
    },
    mounted () {
      this.$http({url: '/villages', method: 'get'})
        .then(res => {
          
          this.villages = res.result.rows;
          for (let i = 0;i < this.villages.length;i ++) {
            this.villagesSewageScale[i] = {};
            this.villagesSewageScale[i].name = this.villages[i].name;
            this.villagesSewageScale[i].value = this.villages[i].area;
          }
          const sewageSacleBox = document.getElementsByClassName('sewage-scale-box')[0];
          this.sewagePieCharts = pieCharts(sewageSacleBox,this.villagesSewageScale,'#fff',true ,'#00d4f1',['40%','60%'],['50%','50%']);
        });
    }
  };
</script>

<style>
  .sewage-scale-box{
    width: 100%;
    height: 100%;
  }
</style>

