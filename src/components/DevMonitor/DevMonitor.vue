<template>
    <div id='dev-monitor-main'>
        <div class="title">
            <label class="title-text">{{title}}</label>
            <div class="title-tools" @keydown="searchData($event)">
                <el-input placeholder="请输入村庄名称" class="input-with-select" v-model="queryCorrelation.like.name" >
                    <el-button slot="append" icon="el-icon-search"  @click="searchData($event)">搜索</el-button>
                </el-input>
            </div>
        </div>
        <div class="content">
            <el-table
                :data="villages.rows"
                style="width:100%">
                <el-table-column
                    prop='name'
                    label='村庄名称'
                    width='280'>
                </el-table-column>
                <el-table-column
                    prop='town'
                    label='所属乡镇'>
                </el-table-column>
                <el-table-column
                    prop='principal'
                    label='村负责人'>
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="负责人电话">
                </el-table-column>   
                <el-table-column
                    align="center"
                    label="村庄组态">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看村庄组态" placement="top">
                            <span class="iconfont icon-d" @click="villageSacda(scope.row)"></span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="供水设备组态">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看供水设备组态" placement="top">
                            <span class="iconfont icon-d" @click="waterSacda(scope.row)"></span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="污水处理设备组态">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看污水处理设备组态" placement="top">
                            <span class="iconfont icon-d" @click="sewageSacda(scope.row)"></span>
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
        data () {
            return {
                page: 1,
                title: '设备监控',
                sendVillageMsg: {
                    //跳转组件时传递的参数
                    title: '', //标题
                    village: {
                        //村庄信息
                        name: '',
                        town: '',
                        terrain: '',
                        pub_user_id: '',
                        population: 0,
                        households: 0,
                        principal: '',
                        phone: '',
                        area: 0,
                        location: '114.32099, 37.565623'
                    }
                },
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
                },
                scada: []
            };
        },
        methods: {
            async getVillages() {
                const res = await this.$http('/villages',{
                    data: {'opts': this.queryCorrelation}
                });
                this.villages = res.result;
            },
            searchData (ev) {
                if (ev.type === 'click' || ev.keyCode === 13) {
                    if (this.page === 1) {
                        this.getVillages();
                    }
                    this.page = 1;
                }
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

            getScadas (villageId,type) {
                this.$http('/scadas',{
                    data: {'opts': {where: {village_id: villageId,type: type}}}
                }).then(res=>{
                    this.scada = res.result.rows;
                });
            },
            villageSacda (val) {
                this.$http('/scadas',{
                    data: {'opts': {where: {village_id: val.id,type: 0}}}
                }).then(res=>{
                    this.goScadaPage(res.result.rows,'该村庄暂无村庄组态，请先配置',val.name,0,val.id);    
                });
                        
            },
            waterSacda (val) {
                this.$http('/scadas',{
                    data: {'opts': {where: {village_id: val.id,type: 1}}}
                }).then(res=>{
                    this.goScadaPage(res.result.rows,'该村庄暂无供水设备组态，请先配置',val.name,1,val.id);      
                });
            },
            sewageSacda (val) {
                this.$http('/scadas',{
                    data: {'opts': {where: {village_id: val.id,type: 2}}}
                }).then(res=>{
                    this.goScadaPage(res.result.rows,'该村庄暂无污水处理设备组态，请先配置',val.name,2,val.id);    
                });
            },
            goScadaPage(data,msg,name,type,id) {
                if (data.length === 0) {
                    this.$message({
                        message: msg,
                        type: 'warning',
                    });
                }else if (data.length === 1) {
                    sessionStorage.setItem('village_name',name);  
                    sessionStorage.setItem('scada_type',type);
                    this.$router.push({ name: 'CheckScada', params: { villageId: id } });  
                }
            }
        },
        mounted () {
            this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
            this.getVillages();
        }
    };
</script>

<style>
   @import "DevMonitor.css";
</style>
