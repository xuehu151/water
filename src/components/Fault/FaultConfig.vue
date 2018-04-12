<template>
  <div id="faultConfig">
        <div class="title">
            <label class="title-text">告警配置</label>
            <hr>
        </div>
        <div class="content">
            <div class="supplies">
                <div class="title">
                    <b>供水设备</b>
                </div>
                <div class="content-datas">
                    <el-card :class="{offClass:data.usable === '0'}" v-for="(data,index) in ruleNames"
                             :key="data.pub_data_id" class="box-card" 
                             v-if="data.type===1"
                            >
                        <div slot="header" class="clearfix">
                            <span v-text="data.pub_data_name"></span>
                            <el-switch style="float: right; padding: 3px 0"  v-model="data.usable" :active-value="1" active-text="启用" inactive-text="停用" :inactive-value="0" @change="updateusable(data)"></el-switch>
                        </div>
                        <div class="datas-body"  @click="editRule(index)" v-if="data.pub_port_type==='AI'">
                                {{data.critical}}    {{data.value}}
                        </div>
                         <div class="datas-body"  @click="editRule(index)" v-if="data.pub_port_type==='DI'">
                             <div v-if="data.critical">
                                 {{data.critical}}    {{data.value === 1 ?data.pub_high_battery:data.pub_low_battery}}
                             </div>
                        </div>
                    </el-card>
                </div>
            </div>
            <div class="treatment">
                <div class="title">
                    <b>污水处理设备</b>
                </div>
                <div class="content-datas">
                    <el-card :class="{offClass:data.usable === '0'}" v-for="(data,index) in ruleNames" :key="data.pub_data_id" class="box-card" v-if="data.type===2">
                        <div slot="header" class="clearfix">
                            <span>{{data.pub_data_name}}</span>
                            <el-switch style="float: right; padding: 3px 0"  v-model="data.usable" :active-value="1" active-text="启用" inactive-text="停用" :inactive-value="0" @change="updateusable(data)"></el-switch>
                        </div>
                        <div class="datas-body"  @click="editRule(index)" v-if="data.pub_port_type==='AI'">
                                {{data.critical}}    {{data.value}}
                        </div>
                         <div class="datas-body"  @click="editRule(index)" v-if="data.pub_port_type==='DI'">
                             <div v-if="data.critical">
                                 {{data.critical}}    {{data.value === 1 ?data.pub_high_battery:data.pub_low_battery}}
                             </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>

        <el-dialog :title="ruleDialog.rule.pub_data_name" :visible.sync="ruleDialog.visible" width="430px" @close="dialogClose">
            <div class="dialog-content">
                <el-form :model="ruleDialog.rule" :label-position="'right'" ref="ruleDialog" label-width="65px" :rules="ruleInfo">
                    <el-row>
                        <el-col :span="23">
                        <el-form-item label="比较符" prop="critical">
                            <el-select v-model="ruleDialog.rule.critical" :disabled="selectDisable">
                                <el-option v-for="symbol in symbols" :key="symbol" :value="symbol" ></el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                        <el-col :span="23">
                        <el-form-item label="比较值" prop="value" >
                            <el-input v-model.number="ruleDialog.rule.value" placeholder="请输入比较值" v-if="ruleDialog.rule.pub_port_type==='AI'"></el-input>
                            <el-select v-model.number="ruleDialog.rule.value" v-if="ruleDialog.rule.pub_port_type==='DI'">
                                <el-option v-for="battery in batterys" :key="battery.label" :value="battery.value" :label="battery.label"></el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                        <el-col :span="23">
                        <el-form-item label="状态">
                            <el-switch v-model="ruleDialog.rule.usable" :active-value="1" active-text="启用" inactive-text="停用" :inactive-value="0"></el-switch>
                        </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateRule" :loading="buttonusable">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<script>
export default {
    data() {
        return {
            selectDisable: true,
            ruleNames: [],
            queryCorrelation: {       //查询参数
                where: {
                    pub_company_id: ''
                }
            },
            buttonusable: false,
            ruleDialog: {       //对话框状态及需要渲染的数据
                visible: false,
                rule: {}
            },
            srcRule: {      //备份编辑的数据及其下标
                editIndex: 0,
                rule: {}
            },
            batterys: [{ value: 0, label: '低电平' }, { value: 1, label: '高电平' }],
            symbols: ['>', '=', '<'],
            isSuccess: false,
            ruleInfo: {   //表单规则
                critical: [
                    { required: true, message: '请选择比较符', trigger: 'blur' },
                ],
                value: [
                    { required: true, message: '请输入比较值' },
                    { type: 'number', message: '比较值必须为数字值' }
                ],
            },
        };
    },
    methods: {
        async getRulesName() {
            const res = await this.$http('/rules', { data: { 'opts': this.queryCorrelation } });
            res.result.rows.forEach(item => {
                if (item.pub_data_name.includes('故障') || item.pub_data_name.includes('仪')) {
                    item.pub_data_name = item.pub_data_name.replace(/\u6545\u969c/, '');
                    this.ruleNames.push(item);
                }
            });
        },
        editRule(index) {
            this.ruleDialog.visible = true;    //显示dialog
            this.isSuccess = false;             //提交状态初始化为false
            this.srcRule.editIndex = index;     //记录修改数据的index
            this.srcRule.rule = JSON.parse(JSON.stringify(this.ruleNames[index]));      //拷贝当前修改的规则做备份
            this.ruleDialog.rule = this.ruleNames[index];                   //提出当前点击的rule，dialog中渲染
            this.dialogConfig(this.ruleDialog.rule);
        },
        dialogConfig(rule) {
            rule.usable = '1';
            if (rule.pub_port_type === 'AI') {
                this.selectDisable = false;
            } else {
                rule.critical = '=';
                this.batterys[0].label = rule.pub_low_battery;
                this.batterys[1].label = rule.pub_high_battery;
                rule.value = rule.value ? rule.value : 0;
                this.selectDisable = true;
            }
        },
        updateRule() {
            this.$refs.ruleDialog.validate(async (valid) => {
                if (valid) {
                    this.buttonusable = true;
                    const { id, usable, critical, value } = this.ruleDialog.rule;
                    const rule = { id, usable, critical, value };
                    this.buttonusable = true;
                    const res = await this.$http.put('/rules', rule);
                    this.isSuccess = true;  //提交成功
                    this.ruleDialog.visible = false;
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.buttonusable = false;
                    return true;
                } else {
                    return false;
                }
            });
        },
        dialogClose() {
            if (!this.isSuccess) {        //没有提交成功
                this.ruleNames[this.srcRule.editIndex] =  this.srcRule.rule;    //回复修改前的数据
            }
        },
        async updateusable(data) {
            if (!data.critical) {
                data.usable = '0';
                this.$message({
                    message: '请先编写告警规则',
                    type: 'error'
                });
            } else {
                const { id, usable } = data;
                const rule = { id, usable };
                const res = await this.$http.put('/rules', rule);
                this.$message({
                    message: res.message,
                    type: 'success'
                });
            }
        }
    },
    mounted() {
        this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
        this.getRulesName();
    }
};
</script>
<style>
@import "FaultConfig.css";
</style>
