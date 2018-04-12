
<template>
  <!-- 维修分析饼图 -->
  <div class="pie-lists">
    <ul class="maintain-pie">
      <li>
        <div class="village-maintain"></div>
        <h5>村庄</h5>
      </li>
      <li>
        <div class="equipment-maintain"></div>
        <h5>设备</h5>
      </li>
      <li>
        <div class="parts-maintain"></div>
        <h5>部件</h5>
      </li>
    </ul>
  </div>
</template>

<script>
  import {pieCharts} from '@/public/charts';
  export default{
    data () {
      return {
        villagesName: [],
        villagesMaintain: [],
        equipmentMaintain: [],
        partsMaintain: [],
        villagesMaintainPie: null,
        equipmentMaintainPie: null,
        partsMaintainPie: null
      };
    },
    methods: {
      addResize () {
        this.villagesMaintainPie.resize();
        this.equipmentMaintainPie.resize();
        this.partsMaintainPie.resize();
      }
    },
    mounted () {
      this.$http({ url: '/villages', method: 'get' })
        .then(res => {
          const result = res.result.rows;
          for (let i = 0;i < result.length;i ++) {
            this.villagesMaintain[i] = {};
            this.villagesMaintain[i].name = result[i].name;
            this.villagesMaintain[i].value = result[i].area;
          }
          //维修分析、村庄
          const villagesMaintainBox = document.getElementsByClassName('village-maintain')[0];
          this.villagesMaintainPie = pieCharts(villagesMaintainBox, this.villagesMaintain,'#fff',false,'#00d4f1',['40%','60%'],['50%','45%']);

          //维修分析、设备
          const equipmentMaintainBox = document.getElementsByClassName('equipment-maintain')[0];
          this.equipmentMaintainPie = pieCharts(equipmentMaintainBox, this.villagesMaintain,'#fff',false,'#00d4f1',['40%','60%'],['50%','45%']);

          //维修分析、部件
          const partsMaintainBox = document.getElementsByClassName('parts-maintain')[0];
          this.partsMaintainPie = pieCharts(partsMaintainBox, this.villagesMaintain,'#fff',false,'#00d4f1',['40%','60%'],['50%','45%']);

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
  .maintain-pie > li{
    height: 263px;
    float:left;
    position: relative;
  }

  .maintain-pie > li > div{
    width: 100%;
    height: 263px;
    position: absolute;
    left:0;
    top:0;
  }

  .maintain-pie > li > h5{
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

  .maintain-pie > li:nth-child(1) {
    width: 28%;
  }

  .maintain-pie > li:nth-child(2) {
    width: 42%;
  }

  .maintain-pie > li:nth-child(3) {
    width: 30%;
  }


</style>
