<template>
  <div id="village">
        <div class="title">
            <label class="title-text">{{title}}</label>
            <div class="title-tools" @keydown="searchData($event)">
                <el-input placeholder="请输入村庄名称" class="input-with-select" v-model="queryCorrelation.like.name" >
                    <el-button slot="append" icon="el-icon-search"  @click="searchData($event)">搜索</el-button>
                </el-input>
                <el-button @click="addVillage">添加</el-button>
            </div>
        </div>
        <div class="content">
            <el-table
                :data="villages.rows"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="村庄名称"
                    width="280">
                </el-table-column>
                <el-table-column
                    prop="town"
                    label="所属乡镇">
                </el-table-column>
                <el-table-column
                    prop="principal"
                    label="村负责人">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="负责人电话">
                </el-table-column>
                <el-table-column
                    prop="focused"
                    label="重点监测">
                     <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.focused"
                            :active-value="1" active-text="是" inactive-text="否" :inactive-value="0" @change="updateFocused(scope.row)">
                        </el-switch>
                     </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="400">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="绑定设备" placement="top">
                            <span class="iconfont icon-jiagebiaoqian" @click="bindDevices(scope.row)"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="配置村庄组态" placement="top">
                            <span class="iconfont icon-d" @click="villageSacda(scope.row)"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="配置供水设备组态" placement="top">
                            <span class="iconfont icon-d" @click="wraterScada(scope.row)"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="配置污水处理设备组态" placement="top">
                            <span class="iconfont icon-d" @click="sewageScada(scope.row)"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="修改村庄信息" placement="top" >
                            <span class="iconfont icon-xiugai" @click="editVillage(scope.row)"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑设备信息" placement="top">
                            <span class="iconfont icon-shebeixinxi" @click="deviceInfo(scope.row)"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除村庄" placement="top">
                            <span class="iconfont icon-shanchu1" @click="deleteVillage(scope)"></span>
                        </el-tooltip> 
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                :page-sizes="[10, 15, 25]"  
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                background 
                :current-page.sync ="page"
                layout="total,sizes,prev, pager, next"  
                :page-size="queryCorrelation.limit"
                :total="villages.total">
            </el-pagination>
        </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            page: 1,
            title: '基础配置',
            villages: {       //请求回来的所有村庄
                total: 0,
                rows: []
            },
            queryCorrelation: {       //查询参数
                limit: 10,
                offset: 0,
                like: {
                    name: ''
                },
                where: {
                    pub_company_id: '',
                    available: true
                }
            }
        };
    },
    methods: {
        searchData(ev) {
            if (ev.type === 'click' || ev.keyCode === 13) {
                if (this.page === 1) {
                    this.getVillages();
                }
                this.page = 1;
            }
        },
        async getVillages() {
            const res = await this.$http({
                url: '/villages',
                method: 'GET',
                data: { 'opts': this.queryCorrelation }
            });
            this.villages = res.result;
        },
        async updateFocused(data) {     //改变关注状态
            let flag = true;
            if (data.focused) {         //关注
                const result = await this.getVillageScada(data.id);     //查询是否已配置村庄组态
                if (!result) {
                    this.$message({
                        message: '请先配置该村庄组态',
                        type: 'error',
                    });
                    data.focused = 0;
                    flag = false;
                }
            }
            if(flag){
                const res = await this.$http.put('/villages', { id: data.id, focused: data.focused });
                this.$message({
                    message: res.message,
                    type: 'success'
                });
            }
        },
        async getVillageScada(villageId) {      //根据村庄ID获取村庄组态
            const { result: { total } } = await this.$http('/scadas', { data: { opts: { where: { village_id: villageId, type: 0 } } } });
            return Boolean(total);
        },
        addVillage() {
            this.$router.push({ name: 'Village', params: { villageId: 0 } });
        },
        handleSizeChange(limit) {
            this.queryCorrelation.limit = limit;
            this.getVillages();
        },
        handleCurrentChange(offset) {
            this.page = offset;
            this.queryCorrelation.offset = this.queryCorrelation.limit * (offset - 1);
            this.getVillages();
        },
        bindDevices(val) {
            this.$router.push({ name: 'BindDevices', params: { villageId: val.id } });
        },
        editVillage(val) {
            this.$router.push({ name: 'Village', params: { villageId: val.id } });
        },
        deviceInfo(val) {
            this.$router.push({ name: 'DeviceInfo', params: { villageId: val.id } });
        },

        //配置村庄组态
        villageSacda(val) {
            sessionStorage.setItem('scada_type',0);
            this.$router.push({ name: 'EditScada', params: { villageId: val.id } });
        },
        //配置供水设备组态 
        wraterScada(val) {
            sessionStorage.setItem('scada_type',1);
            this.$router.push({ name: 'EditScada', params: { villageId: val.id } });
        },
        //配置污水处理设备组态 
        sewageScada(val) {
            sessionStorage.setItem('scada_type',2);
            this.$router.push({ name: 'EditScada', params: { villageId: val.id } });
        },
        async deleteVillage(val) {
            const index = val.$index;
            const self = this;
            const confirm = await this.$confirm('此操作将永久删除该村庄, 是否继续?', '确认删除？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(() => { });
            if (confirm === 'confirm') {
                const res = await this.$http({ url: 'villages/' + val.row.id, method: 'DELETE' });
                this.$message({
                    type: 'success',
                    message: res.message,
                    onClose() {
                        self.villages.rows.splice(index, 1);
                        self.villages.total--;
                        if (self.villages.rows.length === 0) {
                            self.page--;
                        }
                    }
                });
            }
        }
    },
    mounted() {
        this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
        this.getVillages();
    }
};
</script>

<style>
@import "VillageConfig.css";
</style>
