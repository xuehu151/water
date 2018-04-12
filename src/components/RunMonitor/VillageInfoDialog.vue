<template>
  <div id="VillageInfoDialog">
      <el-tabs v-model="activeName">
        <el-tab-pane label="村庄信息" name="villageInfo">
          <el-row :gutter="20">
            <el-col :span="12">
              名称：
              {{chioseVillage.name}}
            </el-col>
            <el-col :span="12">
              所属乡镇：
              {{chioseVillage.town}}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              所属地势：
              {{chioseVillage.terrain}}
            </el-col>
            <el-col :span="12">
              维护人员：
              {{chioseVillage.maintainer}}
            </el-col>
          </el-row>
           <el-row :gutter="20">
            <el-col :span="12">
              人口：
              {{chioseVillage.population}}
            </el-col>
            <el-col :span="12">
              户数：
              {{chioseVillage.households}}
            </el-col>
          </el-row>
           <el-row :gutter="20">
            <el-col :span="12">
              村负责人：
              {{chioseVillage.principal}}
            </el-col>
            <el-col :span="12">
              联系电话：
              {{chioseVillage.phone}}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              坐标：
              {{chioseVillage.location.toString()}}
            </el-col>
            <el-col :span="12">
               面积：
              {{chioseVillage.area}}
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="供水设备信息" name="suppliesInfo">
          <el-col :span="12" class="content-dataInfo" v-for="(data,index) in deviceInfo" v-if="data.type===1 && data.pub_data_name.indexOf('故障')===-1" :key="index" >
            <label>部件名称:</label>
            <label v-text="data.pub_data_name" ></label>
            <label>供货厂商:</label>
            <label v-text="data.supplier?data.supplier:'-'"></label>
            <label>负责人:</label>
            <label v-text="data.user?data.user:'-'"></label>
            <label>联系电话:</label>
            <label v-text="data.phone?data.phone:'-'"></label>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="污水处理设备信息" name="treatmentInfo">
          <el-col :span="12" class="content-dataInfo" v-for="(data,index) in deviceInfo" v-if="data.type===2 && data.pub_data_name.indexOf('故障')===-1" :key="index">
            <label>部件名称:</label>
            <label v-text="data.pub_data_name" ></label>
            <label>供货厂商:</label>
            <label v-text="data.supplier?data.supplier:'-'"></label>
            <label>负责人:</label>
            <label v-text="data.user?data.user:'-'"></label>
            <label>联系电话:</label>
            <label v-text="data.phone?data.phone:'-'"></label>
          </el-col>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>
<script>
export default {
  props: ['chioseVillage'],
  data() {
    return {
      activeName: 'villageInfo',
      deviceInfo: []
    };
  },
  methods: {
    async getDeviceInfo() {
      let requestData = {
        where: {}
      };
      requestData.where.village_id = this.chioseVillage.id;
      const res = await this.$http('/datasInfo', {data: { 'opts': requestData } });
      this.deviceInfo = res.result.rows;
    },
  },
  created() {
    this.getDeviceInfo();
  }
};
</script>
<style>
#VillageInfoDialog #pane-villageInfo .el-row {
  height: 35px;
  font-size: 16px;
}
#VillageInfoDialog #pane-suppliesInfo,
#VillageInfoDialog #pane-treatmentInfo {
  max-height: 500px;
  overflow-y: scroll;
}
#VillageInfoDialog .content-dataInfo {
  margin-bottom: 20px;
  padding-left: 40px;
}
#VillageInfoDialog .content-dataInfo:nth-child(even) {
  border-left: #dedde2 1px dashed;
}
#VillageInfoDialog .content-dataInfo > label {
  display: inline-block;
  height: 35px;
  font-size: 14px;
  line-height: 35px;
}
#VillageInfoDialog .content-dataInfo > label:nth-child(odd) {
  width: 70px;
}
#VillageInfoDialog .content-dataInfo > label:nth-child(even) {
  width: calc(100% - 90px);
}
</style>

