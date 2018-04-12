<template>
  <div id="repair">
      <div class="title">
        <label class="title-text">维修管理</label>
        <div class="title-tools" @keydown="searchData($event)">
            <el-input placeholder="请输入村庄名称" class="input-with-select" v-model="queryCorrelation.like.village_name" >
                <el-button slot="append" icon="el-icon-search"  @click="searchData($event)">搜索</el-button>
            </el-input>
            <el-button @click="addRepairs">添加</el-button>
        </div>
    </div>
     <div class="content">
            <el-table
                :data="repairs.rows"
                style="width: 100%"
                @row-click='clickRow'>
                <el-table-column
                    prop="village_name"
                    label="村庄名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="设备类型"
                    :formatter="formatType"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="pub_data_name"
                    label="部件"
                    width="170">
                </el-table-column>
                <el-table-column
                    prop="start_time"
                    label="时间"
                    width="120"
                    :formatter="formatDate">
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="故障内容">
                </el-table-column>
                <el-table-column
                    prop="end_time"
                    label="完成日期"
                    width="120"
                    :formatter="formatDate">
                </el-table-column>
                <el-table-column
                    prop="record"
                    label="结果">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改维修记录" placement="top" >
                            <span class="iconfont icon-xiugai" @click="editRepairs($event,scope)"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除维修记录" placement="top">
                            <span class="iconfont icon-shanchu1" @click="deleteRepairs($event,scope)"></span>
                        </el-tooltip> 
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
                :total="repairs.total">
            </el-pagination>
        </div>


            <!-- ----------------维修信息的新增、修改Dialog------------------ -->
        <el-dialog :title="repairDialog.title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="repairDialog.visible" @close="closeDialog">
            <repair-form ref="repairFrom" :isEdit="repairDialog.isEdit" :repairInfo="repairDialog.repair" @update="update" v-if="repairDialog.dialogDestroy"></repair-form>
        </el-dialog>

             <!-- ----------------维修信息的查看Dialog--------------------- -->
        <el-dialog title="维修信息" :visible.sync="lookRepair.visible" width="700px">
            <repair-info ref="repairInfo" :repairInfo="lookRepair.repair"></repair-info>
        </el-dialog>
  </div>
</template>
<script>
export default {
    components: {
        RepairForm: () => import('./RepairForm.vue'),
        RepairInfo: () => import('./RepairInfo.vue')
    },
    data() {
        return {
            page: 1,
            repairs: {
                total: 0,
                rows: []
            },
            newReapir: {
                content: '',
                cost: 0,
                pub_data_id: '',
                // type: 1,
                end_time: '',
                record: '',
                start_time: '',
                village_id: '',
                maintainer: '',
                pub_company_id: ''
            },
            repairDialog: {
                title: '',
                dialogDestroy: false,
                visible: false,
                isEdit: false,
                repair: {}
            },
            lookRepair: {
                visible: false,
                repair: {}
            },
            queryCorrelation: {       //查询参数
                limit: 10,
                offset: 0,
                like: {
                    village_name: ''
                },
                where: {
                    pub_company_id: '',
                    available: true
                }
            },
            editInde: 0
        };
    },
    methods: {
        searchData(ev) {
            if (ev.type === 'click' || ev.keyCode === 13) {
                if (this.page === 1) {
                    this.getRepairs();
                }
                this.page = 1;
            }
        },
        async getRepairs() {
            const res = await this.$http({ url: '/recordsMaintain', method: 'GET', data: { 'opts': this.queryCorrelation } });
            this.repairs = res.result;
        },
        addRepairs() {
            this.repairDialog.title = '新增维修记录';
            this.repairDialog.dialogDestroy = true;
            this.repairDialog.visible = true;
            this.repairDialog.isEdit = false;
            this.repairDialog.repair = JSON.parse(JSON.stringify(this.newReapir));
        },
        formatType(row, column, val) {
            let typeName = val === 1 ? '供水设备' : '污水处理设备';
            return typeName;
        },
        formatDate(row, column, val) {
            return val.split('T')[0];
        },
        editRepairs(ev, val) {
            ev.stopPropagation();
            this.repairDialog.title = '编辑维修记录';
            this.repairDialog.visible = true;
            this.repairDialog.dialogDestroy = true;
            this.repairDialog.isEdit = true;
            this.editInde = val.$index;
            this.repairDialog.repair = JSON.parse(JSON.stringify(this.repairs.rows[val.$index]));
        },
        async deleteRepairs(ev, val) {
            ev.stopPropagation();
            const index = val.$index;
            const self = this;
            const confirm = await this.$confirm('此操作将永久删除该记录, 是否继续?', '确认删除？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(() => { });
            if (confirm === 'confirm') {
                const res = await this.$http({ url: 'recordsMaintain/' + val.row.id, method: 'DELETE' });
                this.$message({
                    type: 'success',
                    message: res.message,
                    duration: 1500,
                    onClose() {
                        self.repairs.rows.splice(index, 1);
                        self.repairs.total--;
                        if (self.repairs.rows.length === 0) {
                            self.page--;
                        }
                    }
                });
            }
        },
        handleSizeChange(limit) {
            this.queryCorrelation.limit = limit;
            this.getRepairs();
        },
        handleCurrentChange(pageNumber) {
            this.page = pageNumber;
            this.queryCorrelation.offset = this.queryCorrelation.limit * (pageNumber - 1);
            this.getRepairs();
        },
        update(val) {
            this.repairDialog.visible = val;
            this.getRepairs();
        },
        closeDialog() {
             this.repairDialog.dialogDestroy = false;
        },
        clickRow(row) {
            this.lookRepair.visible = true;
            this.lookRepair.repair = row;
        }
    },
    mounted() {
        this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
        this.newReapir.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
        this.getRepairs();
    }
};
</script>
<style>
#repair {
  height: calc(100% - 80px);
  width: 100%;
  background: #ffffff;
  color: #3b3b3b;
}
#repair .title {
  height: 80px;
  width: 100%;
  padding: 15px 20px;
  line-height: 45px;
}
#repair .title > .title-text {
  font-size: 18px;
}
#repair .title > .title-tools {
  width: 30%;
  float: right;
}
#repair > .title > .title-tools > .el-input-group {
  width: calc(100% - 130px);
}
#repair > .title > .title-tools > .el-button {
  width: 105px;
  margin-left: 20px;
  background: #1e8dbb;
  color: #ffffff;
}
#repair > .title > .title-tools > .el-button:hover {
  background: #1e8dbb;
  color: #ffffff;
  opacity: 0.7;
}
#repair .el-input-group__append button.el-button,
#repair .el-input-group__prepend button.el-button {
  background-color: #1e8dbb;
  border-radius:0 4px 4px 0;
  color: #ffffff;
}
#repair > .content {
  width: calc(100% - 40px);
  margin: 0 20px;
  border: 1px solid #f0f2f7;
  background: #ffffff;
  padding: 20px;
}
#repair .iconfont {
  font-size: 18px;
}
#repair .cell > span {
  margin-right: 10px;
  cursor: pointer;
}
</style>
