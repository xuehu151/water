<template>
	<div id="home">
		<div class="menu">
		<div class="menu-logo">
			<img src="../../assets/image/sy_logo_01.png">
		</div>
		<span class="menu-vertical-left"></span>
		<label class="menu-title">分布式水处理系统</label>
		<div class="menu-list">
			<div :class="{menuActive:menuActive === index}" class="menu-item" v-for="(menu,index) in menuList" :key="index" @click="goUrl(index,$event)">
				<span  class="iconfont" :class="menu.icon"></span>
				<span>{{menu.menu_name}}</span>
				<div v-if="menu.children_menu.length>0" class="childMenu">
					<div :menuUrl="children.menu_url" v-for="children in menu.children_menu" :key="children.menu_name" @click="goUrl(index,$event)">
						{{children.menu_name}}
					</div>
				</div>
			</div>
		</div>

		<div class="menu-info">
			<label>欢迎您：</label>
			<label v-text="userInfo.fullname"></label>
			<el-tooltip class="item" effect="dark" content="修改密码" placement="bottom">
				<span class="iconfont icon-xiugai" @click="passwd"></span>
			</el-tooltip>
			<el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
				<span class="iconfont icon-tuichu" @click="logout"></span>
			</el-tooltip>
		</div>
			<span class="menu-vertical-right"></span>
		</div>

	<el-dialog
		title="修改密码"
		:visible.sync="passwdDialog.visible"
		width="450px">
		<el-form :model="passwdDialog" :label-position="'right'" ref="passwdDialog" :rules="formRules" label-width="94px">
			<el-form-item label="原密码" prop="old_password"> 
				<el-input type="password" v-model="passwdDialog.old_password" placeholder="请输入原密码"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="new_password">
				<el-input type="password" v-model="passwdDialog.new_password" placeholder="请输入新密码"></el-input>
			</el-form-item>
			<el-form-item label="重复新密码" prop="confirm_password">
				<el-input type="password" v-model="passwdDialog.confirm_password" placeholder="请再次输入新密码"></el-input>
				<span>{{passwdDialog.errorText}}</span>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="passwdDialog.visible = false">取 消</el-button>
			<el-button type="primary" :loading="passwdDialog.buttonStatus" @click="updatePassword">确 定</el-button> 
		</span>
	</el-dialog>

	<transition mode="out-in">
		<router-view  class="center"/>
	</transition>
  </div>
</template>


<script>
import RunMonitor from '../RunMonitor/RunMonitor'; //运行监控
import DevMonitor from '../DevMonitor/DevMonitor'; //设备监控
import CheckScada from '../DevMonitor/CheckScada'; //查看组态
import VillageConfig from '../VillageConfig/VillageConfig'; //村庄配置
import Village from '../VillageConfig/VillageInfo'; //村庄信息
import BindDevices from '../VillageConfig/BindDevices';  //绑定设备
import EditScada from '../VillageConfig/EditScada'; //新增或编辑组态
import DeviceInfo from '../VillageConfig/DeviceInfo'; //设备信息
import RepairManage from '../RepairManage/RepairManage'; //维修管理
import FaultConfig from '../Fault/FaultConfig';  //告警配置
import FaultInfo from '../Fault/FaultInfo';//告警信息
import Data from '../Data/Data';//统计分析

import { validPassword } from '../../public/validate';
export default {
	data() {
		let validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.passwdDialog.new_password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			menuIcon: {
				'/screen': 'icon-tiyanjiankong',
				'/runMonitor': 'icon-1ditugenzong',
				'/devMonitor': 'icon-zhihuinengyuanyunhoutaiku-qitatubiao-shebeiceshi',
				'/basisManage': 'icon-peizhi',
				'/faultManage': 'icon--guzhangtongji',
				'/repairManage': 'icon-shigongrenyuan',
				'/data': 'icon-navicon-tjb',
				'/basisInfo': '',
				'/userInfo': ''
			},
			passwdDialog: {
				buttonStatus: false,
				visible: false,
				old_password: '',
				new_password: '',
				confirm_password: '',
				errorText: ''
			},
			menuActive: 0,
			menuList: [],
			userInfo: {},
			formRules: {   //表单规则
				old_password: [
					{ required: true, trigger: 'blur', validator: validPassword },
				],
				new_password: [
					{ required: true, trigger: 'blur', validator: validPassword },
				],
				confirm_password: [
					{ required: true, trigger: 'blur', validator: validatePass2 },
				],
			}
		};
	},
	methods: {
		async getMenu() {   //获取菜单
			const res = await this.$http.get('/public/root');
			this.menuList = res.result.rows;

			console.info(res);
			console.info(this.menuList);
			this.menuList.forEach(menu => {
				menu.icon = this.menuIcon[menu.menu_url];
			});
			sessionStorage.setItem('menus', JSON.stringify(res.result.rows));   //将菜单保存至session，刷新后不再发送请求
		},
		goUrl(index, event) {   //页面跳转
			let element = event.target;
			let toUrl = '';
			this.menuActive = index;
			sessionStorage.setItem('menuActive', index);    //暂存当前点击的菜单，放置页面刷新后数据初始化
			if (element.className === '' && element.getAttribute('menuurl')) {
				toUrl = element.getAttribute('menuurl');
				this.$router.push({ path: toUrl });
			} else {
				let menu = this.menuList[index];
				if (menu.children_menu.length === 0) {
					this.$router.push({ path: menu.menu_url });
				}
			}
		},
		passwd() {
			const passwdDialog = {
				buttonStatus: false,
				visible: false,
				old_password: '',
				new_password: '',
				confirm_password: '',
				errorText: ''
			};
			this.passwdDialog = JSON.parse(JSON.stringify(passwdDialog));
			this.passwdDialog.visible = true;
		},
		async updatePassword() {
			this.$refs.passwdDialog.validate((valid) => {
				if (valid) {
					this.passwdDialog.buttonStatus = true;
					let { old_password, new_password } = this.passwdDialog;
					const update = { old_password, new_password };
					this.$http.put('/public/password', update)
						.then(response => {
							this.passwdDialog.visible = false;
							this.$message({
								message: response.message,
								type: 'success'
							});
						});
					return true;
				} else {
					return false;
				}
			});
		},
		logout() {
			this.$router.push('/');
		}
	},
	created() {
		if (!sessionStorage.getItem('menus')) {
			this.getMenu();
		} else {
			this.menuList = JSON.parse(sessionStorage.getItem('menus'));
		}
	},
	mounted() {
		this.userInfo = JSON.parse(sessionStorage.userInfo);
		if (sessionStorage.getItem('menuActive')) {
			this.menuActive = JSON.parse(sessionStorage.getItem('menuActive'));
		}
	},
	children: [
    {
      path: 'runMonitor',
      name: 'RunMonitor',
      component: RunMonitor,
      alias: '/runMonitor'
    },
    {
      path: 'devMonitor',
      name: 'DevMonitor',
      component: DevMonitor,
      alias: '/devMonitor'
    },
    {
      path: 'checkScada/:villageId',
      name: 'CheckScada',
      component: CheckScada,
      alias: './checkScada/:villageId'
    },
    {
      path: 'villageConfig',
      name: 'VillageConfig',
      component: VillageConfig,
      alias: '/villageConfig'
    },
    {
      path: 'village/:villageId',
      name: 'Village',
      component: Village,
      alias: '/village/:villageId'
    },
    {
      path: 'bindDevices/:villageId',
      name: 'BindDevices',
      component: BindDevices,
      alias: '/bindDevices/:villageId'
    },
    {
      path: 'editScada/:villageId',
      name: 'EditScada',
      component: EditScada,
      alias: './editScada/:villageId'
    },
    {
      path: 'deviceInfo/:villageId',
      name: 'DeviceInfo',
      component: DeviceInfo,
      alias: '/deviceInfo/:villageId'
    },
    {
      path: 'repairManage',
      name: 'RepairManage',
      component: RepairManage,
      alias: '/repairManage'
    },
    {
      path: 'data',
      name: 'Data',
      component: Data,
      alias: '/data'
    },
    {
      path: 'faultConfig',
      name: 'FaultConfig',
      component: FaultConfig,
      alias: '/faultConfig'
    },
    {
      path: 'faultInfo',
      name: 'FaultInfo',
      component: FaultInfo,
      alias: '/faultInfo'
    }
  ]
};
</script>
<style scoped>
@import "Home.css";
</style>


