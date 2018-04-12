<template>
  <!-- 污水处理量柱状图 -->
  <div class="sewage-treatment-box">

  </div>
</template>

<script>
  import {barCharts} from '@/public/charts';
  export default{
    props: ['sewageTreatment'],
    data () {
      return {
        sewageTreatmenBar: null,
        villages: [],
        villagesName: [],
        villagesSewageTreatment: []
      };
    },
    methods: {
      addResize () {
        this.sewageTreatmenBar.resize();
      }
    },
    mounted () {
      this.$http({url: '/villages', method: 'get'})
        .then(res => {
          this.villages = res.result.rows;
          for (let i = 0;i < this.villages.length;i ++) {
            this.villagesName.push(this.villages[i].name);
            this.villagesSewageTreatment.push(this.villages[i].area);
          }
          const sewageTreatmentBox = document.getElementsByClassName('sewage-treatment-box')[0];
          //this.sewageTreatmenBar = this.$parent.buildBarCharts(sewageTreatmentBox, this.villagesName,this.villagesSewageTreatment,'#f6c23b');
          this.sewageTreatmenBar = barCharts(sewageTreatmentBox, this.villagesName,this.villagesSewageTreatment,'#f6c23b','#f2f2f2');
      });
    }
  };
</script>

<style>
  .sewage-treatment-box{
    width: 100%;
    height: 100%;
  }
</style>
