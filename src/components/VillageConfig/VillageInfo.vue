<template>
  <div id="villageInfo">
      <breadcrumb :title="title"></breadcrumb>
      <div class="content">
        <div class="content-title">
          <span class="title-text">基础信息</span>
        </div>
        <el-form :model="villageInfo" :label-position="'right'" ref="villageInfo" :rules="formRules" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="村庄名称" prop="name">
                <el-input v-model="villageInfo.name" placeholder="请输入村庄名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属乡镇" prop="town">
                <el-input v-model="villageInfo.town" placeholder="请输入乡镇名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="所属地势" >
                <el-input v-model="villageInfo.terrain" placeholder="请输入所属地势"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维护人员"  prop="pub_user_id">
                <el-input @focus="showMaintainer=true" v-model="fullname" placeholder="请选择维护人员"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="人口"  prop="population">
                <el-input placeholder="请输入人口" v-model.number="villageInfo.population" :controls='false'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="户数" prop="households">
                <el-input placeholder="请输入户数" v-model.number="villageInfo.households" :controls='false'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="村负责人" prop="principal">
                <el-input placeholder="请输入村负责人" v-model="villageInfo.principal"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话" prop="phone">
                <el-input placeholder="请输入村负责人电话" v-model="villageInfo.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="面积" prop="area">
                <el-input placeholder="请输入面积" v-model.number="villageInfo.area">
                   <template slot="append">㎡</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="坐标" prop="location">
                <el-input placeholder="请选择坐标" v-model="villageInfo.location" @focus="showMapBox" suffix-icon="el-icon-location"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item >
                <el-button type="success" @click="submitForm('villageInfo')" :loading="buttonStatus">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!---------------------地图窗口------------------------>
      <el-dialog  title="选择村庄位置" :visible.sync="showMap">
        <el-amap-search-box class="search-box" :search-option="map.searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
         <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center="map.center" :zoom="map.zoom" :events="map.events">
            <el-amap-marker vid="component-marker" :position="map.marker.position"></el-amap-marker>
         </el-amap>
      </el-dialog>

      <!---------------------维护人员窗口------------------------>
      <el-dialog title="选择维护人员" :visible.sync="showMaintainer">
        <div class="userBox">
          <div class="userBox-content" v-for="(user,index) in users" :key="index" @click="chioseUser(index)">
              {{user.fullname}}
          </div>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { validPhone, validInteger } from '@/public/validate';
// import Breadcrumb from '../Home/Breadcrumb';
export default {
  components: {
    Breadcrumb: () => import('../Home/Breadcrumb'),
  },
  data() {
    return {
      title: ['基础配置', '新增村庄'],
      villageInfo: {
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
      },
      fullname: '',
      companyId: '',
      showMap: false, //地图窗口显示状态
      showMaintainer: false, //维护人员列表窗口状态
      buttonStatus: false,
      users: [], //维护人员列表
      formRules: {   //表单规则
        name: [
          { required: true, message: '请输入村庄名称', trigger: 'blur' },
        ],
        town: [
          { required: true, message: '请输入所属城镇', trigger: 'blur' },
        ],
        terrain: [
          { required: true, message: '请输入所属地势', trigger: 'blur' },
        ],
        maintainer: [
          { required: true, message: '请选择维护人员' },
        ],
        population: [
          { required: true, trigger: 'blur', validator: validInteger },
        ],
        households: [
          { required: true, trigger: 'blur', validator: validInteger },
        ],
        principal: [
          { required: true, message: '请输入村负责人', trigger: 'blur' },
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone },
        ],
        area: [
          { required: true, message: '请输入村庄面积', trigger: 'blur' },
          { type: 'number', message: '面积必须为数字值' }
        ],
        location: [
          { required: true, message: '请选择村庄坐标' },
        ],
      },
      map: {
        //地图的数据和绑定事件
        center: [114.32099, 37.565623],
        zoom: 12,
        marker: {
          //点标记
          position: [114.32099, 37.565623]
        },
        events: {
          //事件
          init: () => {
          },
          complete: () => {
            // let mapObj = this.$refs.map.$$getInstance();
            // mapObj.setFitView();
          },
          moveend: () => { },
          zoomchange: () => { },
          click: e => {
            this.map.marker.position = [e.lnglat.lng, e.lnglat.lat];
            this.villageInfo.location = this.map.marker.position.toString();
            this.showMap = false;
          }
        },
        searchOption: {
          city: '1096',
          citylimit: true
        }
      },
      queryCorrelation: {
        where: {
          id: ''
        }
      }
    };
  },
  methods: {
    async getVillage() {
      const res = await this.$http('/villages', { data: { 'opts': this.queryCorrelation } });
      this.villageInfo = res.result.rows[0];
      this.getUsers();
    },
    async getUsers() {
      let queryCorrelation = {};
      queryCorrelation.company_id = this.companyId;
      const res = await this.$http.get('/public/user', { data: queryCorrelation });
      this.users = res.result.rows;
      this.fullname = this.getFullName(this.villageInfo.pub_user_id);
    },
    getFullName(userId) {           //根据villageInfo中的pub_user_id 再users中获取fullname,做页面渲染
      let fullName;
      for (let user of this.users) {
        if (userId === user._id) {
          fullName = user.fullname;
          break;
        }
      }
      return fullName;
    },
    showMapBox() {     //显示地图
      this.showMap = true;
    },
    onSearchResult(pois) {    //地图搜索的回调
      if (pois.length > 0) {
        let res = pois[0];
        this.map.marker.position = [res.lng, res.lat];
        this.$refs.map.$$getInstance().setCenter(this.map.marker.position);
        const msg = '是否定位到' + res.address + '的' + res.name;
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.villageInfo.location = this.map.marker.position.toString();
            this.showMap = false;
          })
          .catch(() => { });
      } else {
        this.$message({
          message: this.map.searchOption.city + '内未搜索到该地址',
          type: 'error',
        });
      }
    },
    submitForm(villageInfo) {
      const self = this;
      let methodType;
      if (this.villageInfo.id) {
        methodType = 'put';
      } else {
        methodType = 'post';
      }
      this.villageInfo.pub_company_id = this.companyId;
      this.$refs[villageInfo].validate((valid) => {
        if (valid) {
          this.buttonStatus = true;
          this.$http({
            url: '/villages',
            method: methodType,
            data: this.villageInfo
          })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success',
                onClose() {
                  self.$router.go(-1);
                }
              });
            });
          return true;
        } else {
          return false;
        }
      });
    },
    chioseUser(index) {
      this.fullname = this.users[index].fullname;
      this.villageInfo.pub_user_id = this.users[index]._id;
      this.showMaintainer = false;
    }
  },
  mounted() {
    this.companyId = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
    this.map.searchOption.city = JSON.parse(sessionStorage.getItem('userInfo')).address;
    if (this.$route.params.villageId) {
      this.title.splice(1, 1, '编辑村庄');
      this.queryCorrelation.where.id = Number(this.$route.params.villageId);
      this.getVillage();
    } else {
      this.getUsers();
    }
    if (this.villageInfo.location && this.villageInfo.location !== '') {
      this.map.marker.position = this.villageInfo.location.split(',');
    }
  },
  computed: mapState(['villagePage'])
};
</script>
<style>
@import "VillageInfo.css";
</style>
