<template>
  <div id="deviceInfo">
      <breadcrumb :title="title"></breadcrumb>
       <div class="content">
           <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="供水设备信息" name="suppliesInfo" :disabled="tabDisabled">
                    <div class="content-infoBox">
                        <el-col :span="8" class="content-dataInfo" v-for="(data,index) in suppliesData" :key="index" v-if="data.pub_data_name.indexOf('故障')===-1">
                            <label>部件名称</label>
                            <el-input v-model="data.pub_data_name" :disabled="true"></el-input>
                            <label>供货厂商</label>
                            <el-input v-model="data.supplier"></el-input>
                            <label>负责人</label>
                            <el-input v-model="data.user"></el-input>
                            <label>联系电话</label>
                            <el-input v-model="data.phone"></el-input>
                        </el-col>
                    </div>
                    <el-col :span="8" class="content-save">
                        <el-button type="success" :loading="suppliesButtonStatus" @click="saveDeviceInfo">保存</el-button>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="污水处理设备信息" name="treatmentInfo" :disabled="tabDisabled">
                    <div class="content-infoBox">
                        <el-col :span="8" class="content-dataInfo" v-for="(data,index) in treatmentData" :key="index" v-if="data.pub_data_name.indexOf('故障')===-1">
                            <label>部件名称</label>
                            <el-input v-model="data.pub_data_name" :disabled="true"></el-input>
                            <label>供货厂商</label>
                            <el-input v-model="data.supplier"></el-input>
                            <label>负责人</label>
                            <el-input v-model="data.user"></el-input>
                            <label>联系电话</label>
                            <el-input v-model="data.phone"></el-input>
                        </el-col>
                    </div>
                    <el-col :span="8" class="content-save">
                        <el-button type="success" :loading="treatmentButtonStatus" @click="saveDeviceInfo">保存</el-button>
                    </el-col>
                </el-tab-pane>
            </el-tabs>
       </div>
  </div>
</template>
<script>
import Breadcrumb from '../Home/Breadcrumb';    //面包屑子组件
export default {
    components: {
        Breadcrumb 
    },
    data() {
        return {
            title: ['基础配置', '设备信息'],  
            activeName: 'suppliesInfo',
            villageId: '',
            tabDisabled: false,
            suppliesButtonStatus: false,
            treatmentButtonStatus: false,
            suppliesData: [],
            treatmentData: []
        };
    },
    methods: {
        async getDeviceInfo() {
            let requestData = {
                where: {},
                columns: ['id', 'type', 'pub_data_name', 'supplier', 'user', 'phone']
            };
            requestData.where.village_id = this.villageId;
            const res = await this.$http('/datasInfo', { data: { 'opts': requestData } });
            for (let data of res.result.rows) {
                if (data.type === 1) {
                    this.suppliesData.push(data);
                } else if (data.type === 2) {
                    this.treatmentData.push(data);
                }
            }
        },
        async saveDeviceInfo() {
            let sendData;
            this.tabDisabled = true;
            if (this.activeName === 'suppliesInfo') {
                sendData = this.suppliesData;
                this.suppliesButtonStatus = true;
            } else {
                sendData = this.treatmentData;
                this.treatmentButtonStatus = true;
            }

            const res = await this.$http.put('/datasInfo', sendData);
            this.$message({
                message: res.message,
                type: 'success'
            });
            this.tabDisabled = false;
            this.suppliesButtonStatus = false;
            this.treatmentButtonStatus = false;
        },
        handleClick() {
            this.suppliesButtonStatus = false;
            this.treatmentButtonStatus = false;
        }
    },
    mounted() {
        this.villageId = this.$route.params.villageId;
        this.getDeviceInfo();
    }
};
</script>
<style>
@import "DeviceInfo";
</style>
