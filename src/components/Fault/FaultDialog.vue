<template>
  <div id="faultDialog">
      <el-row :gutter="24">
          <el-col :span="12">
              <label>村庄名称：</label>
              <span>{{faultInfo.village_name}}</span>
          </el-col>
          <el-col :span="12">
              <label>设备：</label>
              <span>{{faultInfo.pub_data_name}}</span>
          </el-col>
          <el-col :span="12">
              <label>告警时间：</label>
              <span>{{faultInfo.create_at}}</span>
          </el-col>
          <el-col :span="12">
              <label>维护人员：</label>
              <span>{{faultInfo.fullname}}</span>
          </el-col>
          <div v-if="faultInfo.status!==0 && faultInfo.status!==1">
            <el-col :span="24">
                <label>故障内容：</label>
            </el-col>
            <el-col :span="23">
                <span class="big-text">{{faultInfo.content}}</span>
            </el-col>
          </div>
          <el-col :offset="15" :span="9">
              <el-button v-if="faultInfo.status===0" @click="cancelDialog">取消</el-button>
              <el-button v-if="faultInfo.status===2" type="danger" @click="allot">打回</el-button>
              <el-button v-if="faultInfo.status===0" type="success" @click="allot">分配</el-button>
              <el-button v-if="faultInfo.status===2" type="success" @click="pass">已处理</el-button>
          </el-col>
      </el-row>
  </div>
</template>
<script>
import moment from 'moment';
export default {
    props: ['faultInfo'],
    data() {
        return {

        };
    },
    methods: {
        dateFormat() {
            this.faultInfo.create_at = moment(this.faultInfo.create_at).format('YYYY-MM-DD hh:mm');
        },
        cancelDialog(){
            this.$emit('closeDialog',false);
        },
        allot(){
            
        },
        pass(){

        }
    },
    created() {
        this.dateFormat();
    },
    updated() {
        this.dateFormat();
    }
};
</script>
<style>
#faultDialog > .el-row .el-col > label {
  display: inline-block;
  width: 80px;
  height: 35px;
  line-height: 35px;
  text-align: right;
  color: #9b9b9b;
}
#faultDialog > .el-row .el-col > .big-text {
  padding: 0 10px;
}
#faultDialog .el-button--success{
    width: 40%;
    height: 40px;
}
#faultDialog .el-button--success > span{
    letter-spacing: 0;
}
</style>
