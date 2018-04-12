<template>
  <div class="infoBox">
        <div v-if="chioseVillage.status===0" class="infoBox-title grayTitle">
          {{chioseVillage.name}}
        </div>
        <div v-if="chioseVillage.status===1" class="infoBox-title greenTitle">
          {{chioseVillage.name}}
        </div>
        <div v-if="chioseVillage.status===2" class="infoBox-title redTitle">
          {{chioseVillage.name}}
        </div>
        <div class="infoBox-content">
          <div class="content-main">
            <label>出水流量:{{
              chioseVillage.value ? chioseVillage.value : "-"
            }} t/h</label>
            <label>进水流量:{{
              chioseVillage.value ? chioseVillage.value : "-"
            }} t/h</label>
          </div>
          <div class="content-faults">
              <div class="faults-info" v-for="fault in faultData" :key="fault.id">
                  <img src="../../assets/image/sy_marker_notice.png"/>
                  <label v-text="fault.pub_data_name"></label>
              </div>
          </div>
          <div class="content-tools">
          <el-tooltip class="item" effect="dark" content="村庄信息" placement="top">
            <span class="fa fa-book" @click="openDialog('infoTab')"></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="维修记录" placement="top">
            <span class="fa fa-wrench" @click="openDialog('maintain')"></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="设备监控" placement="top">
            <span class="fa fa-desktop" @click="openDialog('infoTab')"></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="污泥外送" placement="top">
            <span class="fa fa-truck" @click="openDialog('sludge')"></span>
          </el-tooltip>
          </div>
        </div>
      </div>
</template>
<script>
export default {
  props: ['chioseVillage','faultData'],
  data() {
    return {

    };
  },
  methods: {
    openDialog(val) {
      this.$emit('showDialog', val);
    }
  },
};
</script>
<style>
@import "MapInfoWindow.css";
</style>
