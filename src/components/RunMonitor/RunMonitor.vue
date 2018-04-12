<template>
  <div id="myMap">
    <div class="myMap-search" @keydown="searchVillages($event,1)">
      <el-input placeholder="请输入内容" v-model="searchVillageName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchVillages($event,1)"></el-button>
      </el-input>
      <div class="boxCard" v-if="villagesPageConfig.showCard">
        <el-card class="boxCard-content">
          <div v-for="(village,index) in showVillagePage" :key="index" class="content-item" @click="chioseSearchVillage(village)">
            <label class="item-name">{{village.name}}</label>
            <div class="item-value-group">
              <div class="group-item">
                <label>出水流量:</label>
                <span>{{village.value?village.value:'-'}}t/h</span>
              </div>
              <div class="group-item">
                <label>出水流量:</label>
                <span>{{village.value?village.value:'-'}}t/h</span>
              </div>
            </div>
          </div>
          <div class="boxCard-content-footer">
            <el-pagination layout="total,prev, pager, next" :page-size="villagesPageConfig.pageSize" :total="villagesPageConfig.total" @current-change="handleCurrentChange"></el-pagination> 
          </div>
        </el-card> 
      </div>
    </div>
      <el-amap :resizeEnable="true" ref="map" class="amap-box" :vid="'amap-vue'" :center="map.center" :zoom="map.zoom" :events="map.events">
        <el-amap-marker v-for="(village, index) in villages" :key="index" :position="village.location" :vid="index" >
            <div v-if="village.status===0" :style="[map.markerCircle,map.gray]" @click="showInfoBox(village)">
               {{index}}
            </div>
            <div v-if="village.status===1" :style="[map.markerCircle,map.green]" @click="showInfoBox(village)">
               {{index}}
            </div>
            <div v-if="village.status===2" :style="[map.markerCircle,map.pink]" @click="showInfoBox(village)">
               {{index}}
               <b class="notice"></b>
            </div>
        </el-amap-marker>

        <el-amap-info-window 
          :position="infoBox.location" 
          :offset="['6','-35']" 
          :visible="infoBox.visible" 
           isCustom="true">
           <map-info-window-vue :faultData="faultData" :chiose-village="chioseVillage" @showDialog="showDialog" ></map-info-window-vue>
        </el-amap-info-window>
      </el-amap>

      <!-- ------------------------------静态信息窗口-------------------------------------------- -->
      <el-dialog :title="chioseVillage.name" class="basisInfoDialog" :visible.sync="toolsDialog.infoTab" width="670px" @close="infoDialogClosed">
          <village-info-dialog ref="basisInfo" :chiose-village="chioseVillage" v-if="toolsDialog.dialogDestroy"></village-info-dialog>
      </el-dialog>

       <!-- ------------------------------维修记录窗口-------------------------------------------- -->
      <el-dialog :title="chioseVillage.name" class="maintainDialog" :visible.sync="toolsDialog.maintain" width="870px"  @open="maintainDialogOpen">
        <maintain-info ref="maintainInfo" :villageId="chioseVillage.id" v-if="toolsDialog.dialogDestroy"></maintain-info>
      </el-dialog>


       <!-- ------------------------------污泥外送记录窗口-------------------------------------------- -->
      <el-dialog :title="chioseVillage.name" class="sludgeDialog" :visible.sync="toolsDialog.sludge" width="455px" >
          <span class="iconfont icon-tiaoduzhong"></span>
          是否记录污泥调度外送？
          <span slot="footer" class="dialog-footer">
            <el-button @click="toolsDialog.sludge = false">取 消</el-button>
            <el-button type="primary" @click="recordSludge">确 定</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  components: {
    VillageInfoDialog: () => import('./VillageInfoDialog.vue'),
    MaintainInfo: () => import('./MaintainInfo.vue'),
    MapInfoWindowVue: () => import('./MapInfoWindow.vue')
  },
  data() {
    return {
      toolsDialog: {
        infoTab: false,
        maintain: false,
        sludge: false,
        dialogDestroy: false
      },
      chioseVillage: {}, //点击marker或搜索列表村庄选定的村庄
      faultData: [],
      villages: [], //获取到所有的村庄列表
      searchVillageList: [], //根据条件搜索到的所有村庄列表
      showVillagePage: [], //搜索列表中分页所显示的村庄列表
      searchVillageName: '', //搜索框的内容
      villagesPageConfig: {
        //分页器初始配置
        pageSize: 6,
        pageNumber: 1,
        total: 1,
        showCard: false
      },
      infoWindow: '',
      infoBox: {
        template: '',
        visible: false,
        location: [114.32099, 37.565623]
      },
      map: {
        center: [114.32099, 37.565623],
        zoom: 12,
        markers: [],
        infoVisible: false,
        events: {
          //事件
          init: () => { },
          complete: () => {
            this.$refs.map.$$getInstance().setFitView();
          },
          moveend: () => { },
          zoomchange: () => { },
          click: () => {
            this.infoBox.visible = false;         //marker的信息窗体隐藏
            this.villagesPageConfig.showCard = false;   //搜索列表框隐藏
          }
        },
        markerCircle: {
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          textAlign: 'center',
          lineHeight: '35px',
          zIndex: '19'
        },
        pink: {
          border: '1px solid #F79C9B',
          background: '#F79C9B',
          boxShadow: '0 0 0 6px rgba(247, 156, 155,.6)'
        },
        green: {
          border: '1px solid #D4E78E',
          background: '#D4E78E',
          boxShadow: '0 0 0 6px rgba(212,231,142,.6)'
        },
        gray: {
          border: '1px solid #C0BEBF',
          background: '#C0BEBF',
          boxShadow: '0 0 0 6px rgba(192,190,191,.6)'
        },
        infoStyle: {
          top: '-5px'
        }
      },
      queryCorrelation: {
        where: {
          pub_company_id: '',
          available: true
        }
      }
    };
  },
  methods: {
    async getVillages() {
      const res = await this.$http('/villages', {
        data: { 'opts': this.queryCorrelation }
      });
      this.villages = res.result.rows;
      for (let village of this.villages) {
        village.location = village.location.split(',');
      }
    },
    async showInfoBox(village) {      // 地图信息窗体
      this.chioseVillage = village;
      const res = await this.$http('/datasInfo',{data: {opts: {where: {village_id: village.id,status: 2}}}});
      // console.log(res);
      this.faultData = res.result.rows;
      this.infoBox.location = this.chioseVillage.location;
      this.infoBox.location = village.location;
      this.infoBox.visible = true;
    },
    setMapHeight() {
      let mapHeight = window.innerHeight - 80 + 'px';
      const mapBox = document.getElementsByClassName('amap-box')[0];
      if (mapBox) {
        mapBox.style.height = mapHeight;
      }
    },
    searchVillages(ev, pageNumber) {
      if (ev.type === 'click' || ev.keyCode === 13) {
        this.searchVillageList = [];
        let infoNumber = 0; //计算符合当前搜索条件数据的总数

        for (let i = 0; i < this.villages.length; i++) {
          if (this.villages[i].name.indexOf(this.searchVillageName) !== -1) {
            this.searchVillageList.push(this.villages[i]);
            infoNumber++;
          }
        }
        this.villagesPageConfig.total = infoNumber;
        this.handleCurrentChange(pageNumber);
        this.villagesPageConfig.showCard = true;
      }
    },
    handleCurrentChange(pageNumber) {
      let i = (pageNumber - 1) * this.villagesPageConfig.pageSize; //数组的minIndex
      let current = pageNumber * this.villagesPageConfig.pageSize; //数组的maxIndex
      this.showVillagePage = [];
      while (i < current && i < this.searchVillageList.length) {
        this.showVillagePage.push(this.searchVillageList[i]);
        i++;
      }
    },
    chioseSearchVillage(village) {    //选择搜索列表的村庄
      this.$refs.map.$$getInstance().setCenter(village.location);
      this.showInfoBox(village);
      this.villagesPageConfig.showCard = false;
    },
    showDialog(val) {
      this.toolsDialog.dialogDestroy = true;
      this.toolsDialog[val] = true;
    },
    async recordSludge() {      //记录污泥外送数据
      const res = await this.$http.post('/recordsTransport', {
        'village_id': this.chioseVillage.id
      });
      this.$message({
        message: res.message,
        type: 'success'
      });
    },
    infoDialogClosed() {
      this.toolsDialog.dialogDestroy = false;
      this.$refs.basisInfo.activeName = 'villageInfo';
    },
    maintainDialogOpen() {
      if (this.$refs.maintainInfo) {
        this.$refs.maintainInfo.getMaintainInfo();
      }
    }
  },
  created() {
    this.getVillages();
  },
  mounted() {
    this.setMapHeight();
    this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
    window.onresize = () => {
      this.setMapHeight();
    };
  }
};
</script>
<style>
@import "RunMonitor.css";
</style>

