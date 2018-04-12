<template>
  <div id="repairInfo">
      <el-row :gutter="24"> 
          <el-col :span="11">
              <label>村庄名称：</label>
              <span>{{repairInfo.village_name}}</span>
          </el-col>
          <el-col :span="11">
              <label>维修费用：</label>
              <span>{{repairInfo.cost}}</span>
          </el-col>
      </el-row>
      <el-row :gutter="24"> 
          <el-col :span="11">
              <label>设备类型：</label>
              <span>{{dataTypeStr}}</span>
          </el-col>
          <el-col :span="11">
              <label>部件名称：</label>
              <span>{{repairInfo.pub_data_name}}</span>
          </el-col>
      </el-row>
      <el-row :gutter="24"> 
          <el-col :span="11">
              <label>开始时间：</label>
              <span>{{repairInfo.start_time.split('T')[0]}}</span>
          </el-col>
          <el-col :span="11">
              <label>完成时间：</label>
              <span>{{repairInfo.end_time.split('T')[0]}}</span>
          </el-col>
      </el-row>
      <el-row :gutter="24"> 
          <el-col :span="11">
              <label>维修厂家：</label>
              <span>{{repairInfo.maintainer?repairInfo.maintainer:'-'}}</span>
          </el-col>
          <el-col :span="11">
              <label>联系电话：</label>
              <span>{{repairInfo.phone?repairInfo.phone:'-'}}</span>
          </el-col>
      </el-row>
      <el-row :gutter="24"> 
          <el-col :span="11">
              <label>故障内容：</label>
          </el-col>
          <el-col :span="24">
              <span class="text-box">{{repairInfo.content}}</span>
          </el-col>
      </el-row>
      <el-row :gutter="24"> 
          <el-col :span="11">
              <label>维修结果：</label>
          </el-col>
          <el-col :span="24">
              <span class="text-box">{{repairInfo.record}}</span>
          </el-col>
      </el-row>
  </div>
</template>
<script>
export default {
    props: ['repairInfo'],
    data(){
        return{
            dataTypeStr: ''
        };
    },
    methods: {
      deviceTypeStr(){
          this.dataTypeStr = this.repairInfo.type === 1 ? '供水设备' : '污水处理设备';
      }  
    },
    mounted () {
        this.deviceTypeStr();
    },
    updated () {
       this.deviceTypeStr();
    }
};
</script>
<style>
#repairInfo label,
#repairInfo span{
    display: inline-block;
    font-size: 16px;
    height: 35px;
    line-height: 35px;
}
#repairInfo label{
    width: 90px;
    text-align: right;
    color: #BFBFBF;
}
#repairInfo span{
    padding-left: 10px;
    width: calc(100% - 95px);
}
#repairInfo .text-box{
    height: 100px;
    width: calc(100% - 40px);
    margin-left: 20px;
    border:#ECECEC 1px solid;
}
</style>
