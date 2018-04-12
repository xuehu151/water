<template>
    <div id="bingDevices">
        <breadcrumb :title="title"></breadcrumb>
        <div class="content">
            <div class="content-selected">
                <div class="selected-title">
                    <span class="iconfont icon-xuanzhongduigou"></span>
                    <label>已选数据源</label>
                </div>
                <div class="selected-content">
                    <div class="content-devices">
                        <div class="devices-checked"  v-for="(device,index) in selectedDevices" :key="index" @click="dropDevice(index)">
                            {{device.pub_device_name}}
                            <i class="iconfont icon-iconfontguanbi"></i>
                        </div>
                    </div>
                    <div class="selected-footer">
                        <el-button type="success" @click="saveBindDevice" :loading="buttonStatus">保存数据绑定</el-button>
                    </div>
                </div>
            </div>
            <div class="content-all">
                <div class="all-title">
                    <span class="iconfont icon-zidingyicaidan"></span>
                    <label>已选数据源</label>
                    <el-input placeholder="请输入内容" v-model="searchData.deviceName" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="searchDevices"></el-button>
                    </el-input>
                </div>
                <div class="all-tools">
                    <el-checkbox-group v-model="searchData.checkedKind" @change="searchDevices">
                        <el-checkbox v-for="deviceKind in deviceKinds" :key="deviceKind.value" :label="deviceKind.value">{{deviceKind.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="all-devices">
                    <el-checkbox-group v-model="selectedDevices" @change="chioseDevices">
                    <el-checkbox v-for="(device,index) in showDevices" :key="index" :label="device" border>{{device.pub_device_name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const deviceKindList = [
  { value: 1, name: 'Box接入' },
  { value: 2, name: 'OPC接入' },
  { value: 3, name: '人工录入数值' },
  { value: 4, name: '计算数值' }
];
import Breadcrumb from '../Home/Breadcrumb';
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      title: ['基础配置', '绑定标签'],
      buttonStatus: false,
      villageId: 0,
      customerId: '',
      selectedDevices: [],
      showDevices: [],
      allDevices: [],
      deviceKinds: deviceKindList,
      searchData: {
        deviceName: '',
        checkedKind: [1, 2, 3, 4]
      },
      companyId: ''
    };
  },
  methods: {
    async getDevices() {    //获取该客户下所有设备列表
      let requestData = {
        where: {
        }
      };
      requestData.where.customer_id = this.customerId;
      requestData.where.device_kind = this.searchData.checkedKind;
      const res = await this.$http('/public/device', { data: { 'opts': requestData } });
      this.allDevices = res.result.rows;
      this.getVillageDevices();
      this.searchDevices();
    },
    async getVillageDevices() {     //获取改村庄已绑定的设备
      let opts = {
        where: {}
      };
      opts.where.village_id = this.villageId;
      const res = await this.$http('/devices', { data: { 'opts': opts } });
      let villageDevice = res.result.rows;
      for (let selectedDevice of villageDevice) {   //遍历改村庄绑定的设备
        for (let optionalDevice of this.allDevices) {   //遍历该客户下所有的设备
          if (selectedDevice.pub_device_id === optionalDevice.pub_device_id) {    //如果村庄下设备的id===客户下设备id
            optionalDevice.type = this.addType(selectedDevice.pub_device_name).type;    //为客户下的这个设备添加type属性和Village，放入已选设备组中
            optionalDevice.village_id = this.villageId;
            optionalDevice.pub_company_id = this.companyId;
            this.selectedDevices.push(optionalDevice);
          }
        }
      }
    },
    searchDevices() {
      this.showDevices = [];
      let { deviceName, checkedKind } = this.searchData;
      for (let device of this.allDevices) {
        if (
          device.pub_device_name.indexOf(deviceName) !== -1 &&
          checkedKind.indexOf(device.pub_device_kind) !== -1
        ) {
          this.showDevices.push(device);
        }
      }
    },
    dropDevice(index) {
      this.selectedDevices.splice(index, 1);
    },
    addType(name) {   //根据设备名称返回设备分组和相关名称
      let aboutName, type;
      const name1 = '供水';
      const name2 = '污水';
      if (name.indexOf(name1) !== -1) {
        aboutName = name1;
        type = 1;
      } else if (name.indexOf(name2) !== -1) {
        aboutName = name2;
        type = 2;
      }
      return { aboutName, type };
    },
    chioseDevices() {
      const thisDevice = this.selectedDevices[this.selectedDevices.length - 1];
      if (this.selectedDevices.length > 0) {
        let { aboutName, type } = this.addType(thisDevice.pub_device_name);
        thisDevice.type = type;
        thisDevice.village_id = this.villageId;
        thisDevice.pub_company_id = this.companyId;
        for (let device of this.selectedDevices) {
          if (
            device !== thisDevice &&
            device.pub_device_name.indexOf(aboutName) !== -1
          ) {
            this.selectedDevices.pop();
            this.$message.error({
              message: '已存在同类型设备！！',
              showClose: true
            });
          }
        }
      }
    },
    async saveBindDevice() {
      const self = this;
      if (this.selectedDevices.length > 0) {
        this.buttonStatus = true;
        const res = await this.$http.post('/devices', self.selectedDevices);
        this.$message({
          message: res.message,
          type: 'success',
          onClose() {
            self.$router.go(-1);
          }
        });
      } else {
        this.$message.error({
          message: '请先选择要绑定的设备！',
          showClose: true
        });
      }
    }
  },
  mounted() {
    this.customerId = JSON.parse(sessionStorage.getItem('userInfo')).customer_id;
    this.villageId = Number(this.$route.params.villageId);
    this.companyId = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
    this.getDevices();
    // this.getVillageDevices();
  }
};
</script>
<style>
@import "BindDevices.css";
</style>