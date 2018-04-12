
<template>
  <!-- 故障次数饼图 -->
  <div class="pie-lists">
    <ul class="trouble-pie">
      <li>
        <div class="village-trouble"></div>
        <h5>村庄</h5>
      </li>
      <li>
        <div class="equipment-trouble"></div>
        <h5>设备</h5>
      </li>
      <li>
        <div class="parts-trouble"></div>
        <h5>部件</h5>
      </li>
    </ul>
  </div>
</template>

<script>
  import {pieCharts} from '../../public/charts';
  export default{
    data () {
      return {
        villagesName: [],
        villagesTroubleCounts: [],
        equipmentTroubleCounts: [],
        partsTroubleCount: [],
        villagesTroublePie: null,
        equipmentTroublePie: null,
        partsTroublePie: null
      };
    },
    methods: {
      addResize () {
        this.villagesTroublePie.resize();
        this.equipmentTroublePie.resize();
        this.partsTroublePie.resize();
      }
    },
    mounted () {
      this.$http({ url: '/villages', method: 'get' })
        .then(res => {
          const result = res.result.rows;
          for (let i = 0;i < result.length;i ++) {
            this.villagesTroubleCounts[i] = {};
            this.villagesTroubleCounts[i].name = result[i].name;
            this.villagesTroubleCounts[i].value = result[i].area;
          }
          //故障次数、村庄
          const villagesTroubleBox = document.getElementsByClassName('village-trouble')[0];
          this.villagesTroublePie = pieCharts(villagesTroubleBox, this.villagesTroubleCounts,'#fff',false,'#F4C11F',['40%','60%'],['50%','45%']);

          //故障次数、设备
          const equipmentTroubleBox = document.getElementsByClassName('equipment-trouble')[0];
          this.equipmentTroublePie = pieCharts(equipmentTroubleBox, this.villagesTroubleCounts,'#fff',false,'#F4C11F',['40%','60%'],['50%','45%']);

          //故障次数、部件
          const partsTroubleBox = document.getElementsByClassName('parts-trouble')[0];
          this.partsTroublePie = pieCharts(partsTroubleBox, this.villagesTroubleCounts,'#fff',false,'#F4C11F',['40%','60%'],['50%','45%']);
        });
    }
  };
</script>

<style>
  .pie-lists{
    height: 263px;
    width: 56%;
    float: left;
  }

  .pie-lists > ul{
    width: 100%;
    height: 263px;
  }
  .trouble-pie > li{
    height: 263px;
    float:left;
    position: relative;
  }

  .trouble-pie > li > div{
    width: 100%;
    height: 263px;
    position: absolute;
    left:0;
    top:0;
  }

  .trouble-pie > li > h5{
    width: 100%;
    height: 50px;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center;
    font-weight: 100;
    color: #7c7c7c;
    font-size: 15px;
  }

  .trouble-pie > li:nth-child(1) {
    width: 28%;
  }

  .trouble-pie > li:nth-child(2) {
    width: 42%;
  }

  .trouble-pie > li:nth-child(3) {
    width: 30%;
  }


</style>
