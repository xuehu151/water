<template>
  <div id="repairForm">
        <el-form :model="repairInfo" :label-position="'right'" ref="repairInfo" :rules="formRules" label-width="100px">
            <el-row :gutter="24">
                <el-col :span="11">
                <el-form-item label="村庄名称" prop="village_id" >
                    <el-select
                        v-model="renderData.villageName"
                        filterable
                        remote
                        placeholder="请输入村庄名称关键词"
                        :remote-method="searchVillages"
                        @change="chioseVillage">
                        <el-option
                            v-for="village in showVillages"
                            :key="village.id"
                            :label="village.name"
                            :value="village.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="11">
                <el-form-item label="费用" prop="cost">
                    <el-input v-model.number="repairInfo.cost" placeholder="请输入维修费用"></el-input>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="11">
                <el-form-item label="设备类型">
                    <el-select v-model="renderData.type" placeholder="请选择" @change="filterDats">
                        <el-option
                        v-for="item in device_type"
                        :key="item.type"
                        :label="item.label"
                        :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="11">
                <el-form-item label="部件名称" prop="pub_data_id">
                    <el-select v-model="renderData.dataName" placeholder="请选择" @change="chioseData">
                         <el-option
                            v-for="data in showDatas.datas"
                            :key="data.pub_data_id"
                            :label="data.pub_data_name"
                            :value="data.pub_data_id">
                            </el-option>
                    </el-select>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="11">
                <el-form-item label="维修厂家" prop="maintainer">
                    <el-input v-model="repairInfo.maintainer" placeholder="请输入维修厂家"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="11">
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="repairInfo.phone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="11">
                <el-form-item label="开始时间" prop="start_time">
                    <el-date-picker v-model="repairInfo.start_time" type="date" placeholder="开始日期"></el-date-picker>
                </el-form-item>
                </el-col>
                <el-col :span="11">
                <el-form-item label="完成时间" prop="end_time">
                    <el-date-picker v-model="repairInfo.end_time" type="date" placeholder="完成日期"></el-date-picker>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="11">
                <el-form-item label="故障内容" prop="content">
                    <el-input :rows="3" resize="none" type="textarea" v-model="repairInfo.content" placeholder="请输入故障内容"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="11">
                <el-form-item label="维修结果" prop="record">
                    <el-input :rows="3" resize="none" type="textarea" v-model="repairInfo.record" placeholder="请输入维修结果"></el-input>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :offset="11" :span="11">
                <el-form-item >
                    <el-button type="success" @click="submitForm()" :loading="buttonStatus">提交</el-button>
                </el-form-item>
                </el-col>
            </el-row>
        </el-form>
  </div>
</template>
<script>
import { validPhone, validCost } from '@/public/validate';
export default {
    props: ['repairInfo', 'isEdit'],
    data() {
        return {
            buttonStatus: false,        //按钮状态
            device_type: [                 //设备类型
                { type: 1, label: '供水设备' },
                { type: 2, label: '污水处理设备' }
            ],
            formRules: {   //表单规则
                village_id: [
                    { required: true, message: '请选择村庄' },
                ],
                cost: [
                    { required: true, validator: validCost, trigger: 'blur' },
                ],
                data_name: [
                    { required: true, message: '请选择部件' },
                ],
                maintainer: [
                    { required: true, message: '请输入维修厂家' },
                ],
                pub_data_id: [
                    { required: true, message: '请选择部件' },
                ],
                record: [
                    { required: true, message: '请输入维修结果', trigger: 'blur' },
                ],
                start_time: [
                    { required: true, message: '请输入完成时间', trigger: 'blur' },
                ],
                end_time: [
                    { required: true, message: '请输入完成时间', trigger: 'blur' },
                ],
                phone: [
                    { required: true, validator: validPhone },
                ],
            },
            renderData: {       //页面渲染的数据，不发送
                villageName: '',
                dataName: '',
                type: ''
            },
            queryCorrelation: {       //查询参数
                where: {
                    pub_company_id: '',
                    available: true
                }
            },
            allVillages: [],        //所有的村庄列表
            showVillages: [],       //渲染的村庄列表
            allDatas: [],
            showDatas: {
                visible: false,
                datas: []
            }
        };
    },
    methods: {
        async getVillages() {
            const res = await this.$http('/villages', { data: { 'opts': this.queryCorrelation } });
            this.allVillages = res.result.rows;
        },
        searchVillages(val) {
            this.showVillages = this.allVillages.filter(item => {
                return item.name.includes(val);
            });
        },
        chioseVillage(val) {
            this.repairInfo.village_id = val;
            this.getDatas();
        },
        async getDatas() {
            let requestData = {
                where: {
                    village_id: this.repairInfo.village_id
                }
            };
            const res = await this.$http({ url: '/datasInfo', method: 'GET', data: { 'opts': requestData } });

            this.allDatas = res.result.rows.filter(item => {
                return !item.pub_data_name.includes('故障');
            });
            this.filterDats();
        },
        filterDats() {
            this.showDatas.datas = this.allDatas.filter(item => {
                return item.type === Number(this.renderData.type);
            });
        },
        chioseData(val) {
            this.repairInfo.pub_data_id = Number(val);
        },
        submitForm() {
            const self = this;
            let methodType;
            if (this.isEdit) {
                methodType = 'put';
                delete this.repairInfo.village_name;
                delete this.repairInfo.pub_data_name;
                delete this.repairInfo.type;
            } else {
                methodType = 'post';
            }
            this.$refs.repairInfo.validate((valid) => {
                if (valid) {
                    this.buttonStatus = true;
                    this.$http[methodType]('/recordsMaintain', this.repairInfo)
                        .then(response => {
                            this.repairInfo.id = response.result.id;
                            this.$message({
                                message: response.message,
                                type: 'success',
                                duration: 1500,
                                onClose() {
                                    self.$emit('update', false);
                                }
                            });
                        });
                    return true;
                } else {
                    return false;
                }
            });
        },
    },
    mounted() {
        this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
        this.getVillages();
        this.renderData.villageName = this.repairInfo.village_name;
        this.renderData.dataName = this.repairInfo.pub_data_name;
        this.renderData.type = this.repairInfo.type;
        if (this.isEdit) {
            this.getDatas();
        }
    }
};
</script>
<style>
#repairForm .el-select {
  width: 100%;
}
#repairForm .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
#repairForm .box-card {
  position: absolute;
  width: 100%;
  z-index: 999;
}
#repairForm .el-card__body {
  padding: 10px;
  max-height: 240px;
  overflow-y: scroll;
}
#repairForm .el-card__body > .villageInfo {
  height: 35px;
  line-height: 35px;
  cursor: pointer;
}
#repairForm .el-card__body > .villageInfo:hover {
  background: #f6f7fb;
}
</style>
