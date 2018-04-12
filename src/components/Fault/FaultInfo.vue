<template>
  <div id="faultInfo">
      <div class="title">
            <label class="title-text">告警信息</label>
            <div class="title-tools" @keydown="searchData($event)">
                <el-input placeholder="请输入村庄名称" class="input-with-select" v-model="queryCorrelation.like.village_name" >
                    <el-button slot="append" icon="el-icon-search"  @click="searchData($event)">搜索</el-button>
                </el-input>
            </div>
        </div>
        <div class="content">
            <el-checkbox-group :min="1" v-model="queryCorrelation.where.status" @change="getFaults">
                <el-checkbox :class="{redCheck:item.status === 0,yellowCheck:item.status === 1,greenCheck:item.status === 2,blackCheck:item.status === 3}" v-for="item in checkStatus" :key="item.status" :label="item.status">{{item.label}}</el-checkbox>
            </el-checkbox-group>
            <el-table
                :data="faults.rows"
                style="width: 100%">
                <el-table-column
                    prop="village_name"
                    label="村庄名称"
                    width="280">
                </el-table-column>
                <el-table-column
                    prop="pub_data_name"
                    label="设备名称"
                    :formatter="formatDataName">
                </el-table-column>
                <el-table-column
                    prop="create_at"
                    label="告警时间"
                    :formatter="formatDate">
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="内容">
                </el-table-column>
                <el-table-column
                    prop="fullname"
                    label="维护人员">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status===0" class="red-text" @click="show(scope.$index)">未处理</span>
                        <span v-if="scope.row.status===1" class="yellow-text" @click="show(scope.$index)">已分配</span>
                        <span v-if="scope.row.status===2" class="green-text" @click="show(scope.$index)">已反馈</span>
                        <span v-if="scope.row.status===3" class="black-text" @click="show(scope.$index)">已处理</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                :page-sizes="[10, 15, 25]"  
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                background 
                :current-page="page"
                layout="total,sizes,prev, pager, next"  
                :page-size="queryCorrelation.limit"
                :total="faults.total">
            </el-pagination>
        </div>

        <el-dialog :title="faultDialog.title" :visible.sync="faultDialog.visible" width="560px">
            <fault-dialog ref="faultDialog" :faultInfo="faultDialog.fault" @closeDialog="closeDialog"></fault-dialog>
        </el-dialog>
  </div>
</template>
<script>
const allStatus = [
    {
        label: '未处理',
        status: 0
    },
    {
        label: '已分配',
        status: 1
    },
    {
        label: '已反馈',
        status: 2
    },
    {
        label: '已处理',
        status: 3
    }
];
import moment from 'moment';
export default {
    components: {
        FaultDialog: () => import('./FaultDialog.vue')
    },
    data() {
        return {
            page: 1,
            faults: {
                total: 0,
                title: '',
                rows: []
            },
            faultDialog: {
                visible: false,
                fault: {}
            },
            checkStatus: allStatus,
            queryCorrelation: {
                limit: 10,
                offset: 0,
                like: {
                    village_name: ''
                },
                where: {
                    pub_company_id: '',
                    status: [0, 1, 2]
                },
            }
        };
    },
    methods: {
        async getFaults() {
            const res = await this.$http('/recordsAlarm', { data: { 'opts': this.queryCorrelation } });
            this.faults = res.result;
        },
        formatDataName(row, column, val) {
            return val.replace(/\u6545\u969c/,'');      //‘故障’ 移除
        },
        formatDate(row, column, val) {
            return moment(val).format('YYYY-MM-DD hh:mm');
        },
        searchData(ev) {
            if (ev.type === 'click' || ev.keyCode === 13) {
                if (this.page === 1) {
                    this.getFaults();
                }
                this.page = 1;
            }
        },
        show(index) {
            this.faultDialog.visible = true;
            this.faultDialog.fault = this.faults.rows[index];
            switch (this.faultDialog.fault.status) {
                case 0:
                    this.faultDialog.title = '故障分配';
                    break;
                case 1:
                    this.faultDialog.title = '等待反馈';
                    break;
                case 2:
                    this.faultDialog.title = '故障反馈';
                    break;
                case 3:
                    this.faultDialog.title = '历史查看';
                    break;
            }
        },
        handleSizeChange(limit) {
            this.queryCorrelation.limit = limit;
            this.getFaults();
        },
        handleCurrentChange(pageNumber) {
            this.page = pageNumber;
            this.queryCorrelation.offset = this.queryCorrelation.limit * (pageNumber - 1);
            this.getFaults();
        },
        closeDialog() {
            this.faultDialog.visible = false;
        }
    },
    mounted() {
        this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
        this.getFaults();
    }
};
</script>
<style>
#faultInfo {
  height: calc(100% - 80px);
  width: 100%;
  background: #ffffff;
  color: #3b3b3b;
  padding: 20px;
}
#faultInfo .title {
  height: 60px;
  width: 100%;
  line-height: 45px;
}
#faultInfo .title > .title-text {
  font-size: 18px;
}
#faultInfo .title > .title-tools {
  width: 20%;
  float: right;
}
#faultInfo .el-input-group__append button.el-button,
#faultInfo .el-input-group__prepend button.el-button {
  background-color: #1e8dbb;
  border-radius: 0 4px 4px 0;
  color: #ffffff;
}
#faultInfo > .content {
  border: 1px solid #f0f2f7;
  padding: 20px;
}
#faultInfo
  > .content
  .redCheck
  .el-checkbox__input.is-checked
  .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #e5242e;
  border-color: #e5242e;
}
#faultInfo
  > .content
  .redCheck
  .el-checkbox__input.is-checked
  + .el-checkbox__label {
  color: #e5242e;
}
#faultInfo
  > .content
  .yellowCheck
  .el-checkbox__input.is-checked
  .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #e7a536;
  border-color: #e7a536;
}
#faultInfo
  > .content
  .yellowCheck
  .el-checkbox__input.is-checked
  + .el-checkbox__label {
  color: #e7a536;
}
#faultInfo
  > .content
  .greenCheck
  .el-checkbox__input.is-checked
  .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #2bbcbd;
  border-color: #2bbcbd;
}
#faultInfo
  > .content
  .greenCheck
  .el-checkbox__input.is-checked
  + .el-checkbox__label {
  color: #2bbcbd;
}
#faultInfo
  > .content
  .blackCheck
  .el-checkbox__input.is-checked
  .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #000000;
  border-color: #000000;
}
#faultInfo
  > .content
  .blackCheck
  .el-checkbox__input.is-checked
  + .el-checkbox__label {
  color: #000000;
}
#faultInfo > .content > .el-table {
  margin-top: 20px;
  border-top: 1px solid #f0f2f7;
}
#faultInfo > .content > .el-table .red-text,
#faultInfo > .content > .el-table .yellow-text,
#faultInfo > .content > .el-table .green-text,
#faultInfo > .content > .el-table .black-text {
  display: inline-block;
  width: 90px;
  height: 23px;
  line-height: 23px;
  cursor: pointer;
}
#faultInfo > .content > .el-table .red-text {
  color: #e5242e;
}
#faultInfo > .content > .el-table .yellow-text {
  color: #e7a536;
}
#faultInfo > .content > .el-table .green-text {
  color: #2bbcbd;
}
</style>
