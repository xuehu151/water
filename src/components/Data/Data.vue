<template>
  <div class="data-wraper">
    <!--污水处理量-->
    <div class="sewage-treatment">
      <ul>
        <li>
          <dl class="charts-content">
            <dt>污水处理量</dt>
            <dd class="sewage-treatment-main">
              <sewage-treatment-chart ref="sewageTreament"></sewage-treatment-chart>
            </dd>
          </dl>
        </li>
        <li>
          <dl class="charts-content">
            <dt>污水处理量各村占比</dt>
            <dd class="sewage-treatment-scale">
              <sewage-scale-pie ref='sewageScale'></sewage-scale-pie>
            </dd>
          </dl>
        </li>
      </ul>
    </div>

    <!--设备可用率/时长-->
    <div class="equipment-info">
      <ul>
        <!--设备可用率-->
        <li>
          <dl class="charts-content">
            <dt>设备可用率</dt>
            <dd class="available-content">
              <equipment-available ref="available"></equipment-available>
            </dd>
          </dl>
        </li>

        <!--设备运行时长-->
        <li>
          <dl class="charts-content">
            <dt>各村设备运行时长</dt>
            <dd class="runtime-wrapper">
              <villages-run-time ref="runTime"></villages-run-time>
            </dd>
          </dl>
        </li>
      </ul>
    </div>

    <!--故障次数-->
    <div class="trouble-counts">
      <dl class="charts-content">
        <dt style="width: 98%">故障次数</dt>
        <dd>
          <trouble-counts ref="troubleCount"></trouble-counts>
          <div class="month-bar">
            <month-trouble-bar ref="monthTrouble"></month-trouble-bar>
          </div>
        </dd>
      </dl>
    </div>

    <!--维修分析-->
    <div class="maintain-analysis">
      <dl class="charts-content">
        <dt style="width: 98%">维修分析</dt>
        <dd>
          <maintain-analy ref="maintainAnaly"></maintain-analy>  
          <div class="month-bar">
            <month-maintain-bar ref="monthMaintain"></month-maintain-bar>
          </div>
        </dd>
      </dl>
    </div>

  </div>
</template>


<script>
  export default{
    data () {
      return {
        
      };
    },
    components: {
      SewageTreatmentChart: () => import('./SewageTreatmentChart.vue'),
      SewageScalePie: () => import('./SewageScalePie.vue'),
      EquipmentAvailable: () => import('./EquipmentAvailable.vue'),
      TroubleCounts: () => import('./TroubleCounts.vue'),
      MaintainAnaly: () => import('./MaintainAnaly'),
      MonthTroubleBar: () => import('./MonthTroubleBar'),
      MonthMaintainBar: () => import('./MonthMaintainBar'),
      VillagesRunTime: () => import('./VillagesRunTime')
    },
    methods: {
      
    },
    created () {
      
    },
    mounted () {
      //const self = this;
      const refs = this.$refs;
      window.onresize = () => {
        refs.available && refs.available.addResizeEvent(); 
        refs.maintainAnaly && refs.maintainAnaly.addResize();
        refs.monthMaintain && refs.monthMaintain.addResize();
        refs.monthTrouble && refs.monthTrouble.addResize();
        refs.sewageScale && refs.sewageScale.addResize();
        refs.sewageTreament && refs.sewageTreament.addResize();
        refs.troubleCount && refs.troubleCount.addResize();
        refs.runTime && refs.runTime.addResize();
      };
    }
  };
</script>

<style>
  @import "Data.css";
</style>
