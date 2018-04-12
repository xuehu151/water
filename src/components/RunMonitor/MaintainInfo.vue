<template>
    <div id="maintain">
            <el-table 
            :data="maintains.rows"
            
            stripe
            style="width: 100%">>
                <el-table-column
                    prop="pub_data_name"
                    label="设备名称"
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="start_time"
                    label="时间"
                    width="120"
                    :formatter="formatDate">
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="故障">
                </el-table-column>
                <el-table-column
                    prop="end_time"
                    label="完成日期"
                    width="120"
                    :formatter="formatDate">
                </el-table-column>
                <el-table-column
                    prop="cost"
                    label="费用"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="record"
                    label="结果"
                    width="100">
                </el-table-column>
            </el-table>
            <el-pagination 
                :page-sizes="[10, 15, 25]"  
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                layout="total,prev, pager, next"  
                :page-size="queryCorrelation.limit"
                :total="maintains.total">
            </el-pagination>
    </div>   
</template>
<script>
export default {
    props: ['villageId'],
    data() {
        return {
            maintains: {
                total: 0,
                rows: []
            },
            queryCorrelation: {       //查询参数
                limit: 8,
                offset: 0,
                where: {
                    village_id: this.villageId
                }
            }
        };
    },
    methods: {
        async getMaintainInfo() {
            const res = await this.$http({ url: '/recordsMaintain', method: 'GET', data: {'opts': this.queryCorrelation}  });
            this.maintains = res.result;
        }, 
        formatDate(row, column, val) {
            return val.split('T')[0];
        },
        handleSizeChange(limit) {
            this.queryCorrelation.limit = limit;
            this.getMaintainInfo();
        },
        handleCurrentChange(offset) {
            this.queryCorrelation.offset = this.queryCorrelation.limit * (offset - 1);
            this.getMaintainInfo();
        },
    },
    mounted() {
        this.getMaintainInfo();
    }
};
</script>
<style>
#maintain .el-table th {
  background: #cde4f2;
  color: #000000;
  font-weight: 100;
}
#maintain .el-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>
