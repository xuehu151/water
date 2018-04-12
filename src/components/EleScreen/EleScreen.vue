<template>
  <div class="screen-wraper">
    <!--header-->
    <screen-head></screen-head>
    <!-- 电子时钟 -->
    <div class="screen-clock">
      <span class="el-icon-time"></span>
      <span>{{nowYear}}.{{10 > nowMonth ? '0' + nowMonth : nowMonth}}.{{ 10 > nowDate ? '0' + nowDate : nowDate}}&nbsp;&nbsp;&nbsp;{{ 10 > nowHour ? '0' + nowHour : nowHour}}:{{ 10 > nowMin  ? '0' + nowMin : nowMin}}:{{ 10 >nowSec ? '0' + nowSec : nowSec}}</span>
    </div>
    <!--地图-->
    <div class="screen-amap-wraper" id="screen-amap-wraper">
      <div class="map-wraper" id="map-wraper">
        <el-amap class="amap-box"
                 ref="map"
                 :vid="'amap-vue'"
                 mapStyle="amap://styles/ad486fbc5af1277aad4196faeba07172"
                 :center="map.center"
                 :zoom="map.zoom"
                 :events="map.events"
                 >
          <el-amap-marker v-for="(marker, index) in map.markerList" :key="marker.index"
                          :position="marker.position">
              <div v-if="marker.status === 0" :style="[map.markerCircle,map.pink]"><span class="marker-text">{{index}}</span></div>
              <div v-if="marker.status === 1" :style="[map.markerCircle,map.green]"><span class="marker-text">{{index}}</span></div>
              <div v-if="marker.status === 2" :style="[map.markerCircle,map.gray]">
                <span class="marker-text">{{index}}</span>
                <b class="notice"></b>
              </div>
          </el-amap-marker>
          <el-amap-info-window v-for="(marker, index) in map.markerList" :key="marker.index"
                          :position="marker.position"
                          :content="marker.content"
                          :visible="marker.visible && index === windowIofoIndex"
                          class="infobox-wraper"
                          isCustom="true"
                          autoMove="true"
                          :offset="['6','-38']">
          </el-amap-info-window>
        </el-amap>
      </div>
    </div>
    <!--mid-->
    <div class="screen-middle">

      <!--信息表-->
      <div class="screen-villages-info">
        <ul class="screen-villages-info-list">
          <li class="village-item-underline screen-villages-info-item">
           <!-- <h4 class="info-tit"><span class="icon-tit"></span><i>污水处理设备</i></h4>-->
            <h4 class="info-tit">
              <span class="iconfont icon-gongchang"></span>
              <i>污水处理设备</i>
              <b></b>
            </h4>
            <ul class="villages-info-num">
              <li v-for="item in shebeiNum.wushui" :key="item.tit">
                <dl>
                  <dt>{{item.tit}}</dt>
                  <dd>{{item.num}}个</dd>
                </dl>
              </li>
            </ul>
          </li>
          <li class="village-item-underline screen-villages-info-item">
            <h4 class="info-tit">
              <span>昨</span>
              <i>供水设备</i>
              <b></b>
            </h4>
            <ul class="villages-info-num">
              <li v-for="item in shebeiNum.gongshui" :key="item.tit">
                <dl>
                  <dt>{{item.tit}}</dt>
                  <dd>{{item.num}}个</dd>
                </dl>
              </li>
            </ul>
          </li>
          <li class="screen-villages-info-item">
            <h4 class="info-tit">
              <span>周</span>
              <i>村庄</i>
              <b></b>
            </h4>
            <ul class="villages-info-num">
              <li v-for="item in shebeiNum.cunzhuang" :key="item.tit">
                <dl>
                  <dt>{{item.tit}}</dt>
                  <dd>{{item.num}}</dd>
                </dl>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--设备故障饼状图-->
      <div class="screen-device-info">
        <h2>
          <img src="../../assets/image/portal_chart_title.png" alt="">
          <span></span>
        </h2>
        <div class="state-scale-charts">
          <div class="charts-center">
            <canvas id="charts-canvas"></canvas>
          </div>
          <div class="state-charts-main">
            <status-pie ref="status"></status-pie>
          </div>
        </div>
        <div class="device-info-border"></div>
      </div>
      <!--3d组态-->
      <div class="screen-3d-banner">
        <div class="screen-3d-banner-main">
          <el-carousel :interval="5000" arrow="never">
            <el-carousel-item v-for="item in villageScadaQuery" :key="item.id">
              <!-- <div class="banner-3d-item">
                <iframe src="" frameborder="0" class="scada-item"></iframe>
              </div> -->
              <screen-scada v-bind:villageID="item.id"></screen-scada>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="screen-3d-banner-border">

        </div>
      </div>
    </div>

    <!--底部2折现图-->
    <div class="screen-line-charts">
      <ul>
        <li class="line-charts-item">
          <div class="charts-border"></div>
          <div class="line-charts-inner"></div>
          <!-- 污水处理量柱状图 -->
          <div class="charts-content">
            <villages-sewage ref="villagesSewage"></villages-sewage>
          </div>
          <!-- 供水量折线图 -->
          <div class="supplies-charts">
            <villages-supplies ref="supplies"></villages-supplies> 
          </div>
          <ul class="chart-point">
            <li style="margin-right: 30px"><b></b><span>供水量</span></li>
            <li><b style="background: #d6ad1b"></b><span style="color: #d6ad1b">污水处理量</span></li>
          </ul>
        </li>
        <li class="line-charts-itme">
          <div class="charts-border"></div>
          <div class="line-charts-inner"  style="height:98.5%;width:99.5%"></div>
          <!-- 可用率折线图 -->
          <div class="charts-content">
            <available-scale ref="availableScale"></available-scale>
          </div>
          <ul class="chart-point">
            <li><b></b><span>可用率</span></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
class DrawStateCharts {
  constructor() {
    this.canvas = document.getElementById('charts-canvas');
    this.parentDom = document.getElementsByClassName('charts-center')[0];
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    this.w = this.parentDom.clientWidth;
    this.h = this.parentDom.clientHeight;
    //中心坐标
    this.centerX = this.w / 2;
    this.centerY = this.h / 2;
    //将圆100等分
    this.rad = Math.PI * 2 / 100;
    //环形图半径
    this.radii = this.w * 0.19;
    //内层修饰半径
    this.radiiInnerLine = this.w * 0.245;
    //外层修饰半径
    this.radiiOuterLine = this.w * 0.285;
    this.setStyle();

    //内层修饰实线圆弧
    this.drawStatePer('#0a67ad',this.w * 0.015,this.radiiInnerLine,-Math.PI / 2 - 25 * this.rad,-Math.PI / 2 + 23 * this.rad);
    //外层修饰实线圆弧
    this.drawStatePer('#0a67ad',this.w * 0.015,this.radiiOuterLine,-Math.PI / 2 + 10 * this.rad,-Math.PI / 2 + 35 * this.rad);
    //内层修饰虚线圆弧
    this.DrawLineDashed('#0a67ad',[10, 5],this.w * 0.015,this.radiiInnerLine,-Math.PI / 2 + 28 * this.rad,-Math.PI / 2 + 68 * this.rad);
    //外层修饰虚线圆弧
    this.DrawLineDashed('#0a67ad',[5, 3],this.w * 0.015,this.radiiOuterLine,-Math.PI / 2 + 40 * this.rad,-Math.PI / 2 + 90 * this.rad);
  }
  setStyle() {
    const w = this.w;
    const h = this.h;
    let canvas = this.canvas;
    canvas.width = w;
    canvas.height = h;
  }
  //百分比绘制设备弧形比例 (线条颜色，线宽，半径，起点，终点)
  drawStatePer(strokeColor, lineWidth, radii, begin, end) {
    const ctx = this.ctx;
    const centerX = this.centerX;
    const centerY = this.centerY;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radii, begin, end, false);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
  //虚线修饰 (线条颜色，虚线点密集度，线宽，半径，起点，终点)
  DrawLineDashed(strokeColor, lineDash, lineWidth, radii, begin, end) {
    const ctx = this.ctx;
    ctx.strokeStyle = strokeColor;
    ctx.setLineDash(lineDash);
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, radii, begin, end, false);
    ctx.stroke();
    ctx.restore();
  }
}

import screenHead from './EleScreenHead.vue';
import screenScada from './ScreenScada';
export default {
  name: 'EleScreen',
  components: {
    screenHead,
    //设备状态饼图
    statusPie: () => import('./StatusPie'),
    //供水量折线图
    villagesSupplies: () => import('./VillageSupplies'),
    //污水处理量柱状图
    villagesSewage: () => import('./VillageSewage'),
    //可用率折线图
    availableScale: () => import('./AvailableScale'),
    screenScada
  },
  data() {
    return {
      nowYear: 0,
      nowMonth: 0,
      nowDate: 0,
      nowHour: 0,
      nowMin: 0,
      nowSec: 0,
      weather: [],
      timer: {
        clockTimer: null,
        mapMarkerTimer: null
      },
      windowIofoIndex: 0,
      map: {
        center: [114.310053, 37.581337],
        zoom: 12,
        markerList: [],
        events: {
          init: () => { },
          complete: () => {
            this.$refs.map.$$getInstance().setFitView();
          }
        },
        markerCircle: {
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          textAlign: 'center',
          lineHeight: '40px',
          zIndex: '19',
          color: '#fff'
        },
        pink: {
          border: '1px solid #929292',
          background: '#929292'
        },
        green: {
          border: '1px solid #0bb3c7',
          background: '#0bb3c7'
        },
        gray: {
          border: '1px solid #f2bf0f',
          background: '#f2bf0f'
        }
      },
      shebeiNum: {
        wushui: [
          { tit: '总数', num: 103 },
          { tit: '在用设备', num: 89 },
          { tit: '故障设备', num: 13 },
          { tit: '掉线设备', num: 20 }
        ],
        gongshui: [
          { tit: '总数', num: 103 },
          { tit: '在用设备', num: 89 },
          { tit: '故障设备', num: 13 },
          { tit: '掉线设备', num: 10 }
        ],
        cunzhuang: [{ tit: '人口', num: '20w' }, { tit: '面积', num: '100w㎡' }]
      },
      villages: [],
      queryCorrelation: {
        where: {
          pub_company_id: '',
          available: true
        }
      },
      villageIdList: [],
      villageScadaQuery: [],  //查询村庄组态条件
    };
  },
  methods: {
    //获取村庄列表
      async getVillages() {
          const res = await this.$http('/villages', {
              data: { 'opts': this.queryCorrelation }
          });
          this.villages = res.result.rows;
          //console.log(res.result.rows);
          for (let i = 0; i < this.villages.length; i++) {
              this.map.markerList.push(this.villages[i]);
              this.map.markerList[i].visible = false;
              this.map.markerList[i].position = this.villages[i].location.split(',');
              this.map.markerList[i].visible = true;
              const normalCont = `<div class="infobox">
                                      <h2>${this.villages[i].name}</h2>
                                      <ul>
                                        <li>出水流量 ：t/h</li>
                                        <li>进水流量 ：t/h</li>
                                      </ul>
                                    <div>`;
              const noticeCont = `<div class="infobox">
                                    <h2>${this.villages[i].name}</h2>
                                    <ul>
                                      <li>出水流量 ：t/h</li>
                                      <li>进水流量 ：t/h</li>
                                    </ul>
                                    <div class="notice-txt"><b class="iconfont icon-gaojing" style="font-size:17px"></b><span>鼓风机故障</span></div>
                                  <div>`;

              this.map.markerList[i].content = this.villages[i].status === 2 ? noticeCont : normalCont;
              this.map.center = this.map.markerList[0].position;
          }
           this.setVillageIdList(res.result.rows);
            //this.getAllScada(this.villageIdList);
          //this.getData(this.villageScadaQuery);
      },
      //查询条件
      setVillageIdList (data) {
          if (data && data.length > 0) {
              for (let value of data) {
                let village_info = {};
                village_info.village_id = value.id;
                village_info.focused = value.focused;
                village_info.name = value.name;
                this.villageIdList.push(village_info);
              }
          }
          //console.log(this.villageIdList);
          this.setScadaCounts(this.villageIdList);
      },
      //总共显示多少个村庄组态
      setScadaCounts (datas) {
        if (datas && datas.length > 0) {
          for (let data of datas) {
            let village = {};
            if (data.focused === 1) {   //正式数据为data.focused === 1,
              village.id = data.village_id;
              village.name = data.name;
              this.villageScadaQuery.push(village);
            }
          }
        }
        //console.log(this.villageScadaQuery);
      },
      setStyle () {
        const chartsItem = document.getElementsByClassName('line-charts-item');
        const chartsinner = document.getElementsByClassName('line-charts-inner');
        for (let i = 0; i < chartsItem.length; i++) {
          const _w = chartsItem[i].clientWidth;
          const _h = chartsItem[i].clientHeight;
          for (let j = 0; j < chartsItem.length; j++) {
            chartsinner[j].style.width = _w - 6 + 'px';
            chartsinner[j].style.height = _h - 6 + 'px';
          }
        }
      }
  },
  created() {
    this.windowIofoIndex = this.map.markerList.length - 1;

    //电子时钟
    const self = this;
    function getNowTime() {
      const date = new Date();
      self.nowYear = date.getFullYear();
      self.nowMonth = date.getMonth() + 1;
      self.nowDate = date.getDate();
      self.nowHour = date.getHours();
      self.nowMin = date.getMinutes();
      self.nowSec = date.getSeconds();
    }
    self.timer.clockTimer = setInterval(getNowTime, 1000);
    getNowTime();

    self.timer.mapMarkerTimer = setInterval(()=> {
      self.windowIofoIndex++;
      if (self.windowIofoIndex >= self.villages.length) {
        self.windowIofoIndex = 0;
      }
      self.map.center = self.map.markerList[self.windowIofoIndex].position;
    }, 5000);
  },
  mounted() {
    //console.log(JSON.parse(sessionStorage.getItem('userInfo')).company_id);
    //alert(document.body.clientWidth + '---' + document.body.clientHeight);
    this.getVillages();
    //环形图外层修饰
    const StateDecorate = new DrawStateCharts();
    StateDecorate.init();
    this.setStyle();
    const refs = this.$refs;
    window.onresize = () => {
      this.setStyle();
      StateDecorate.init();
      refs.status && refs.status.addResize();
      refs.supplies && refs.supplies.addResize();
      refs.availableScale && refs.availableScale.addResize();
      refs.villagesSewage && refs.villagesSewage.addResize();
    };
    //this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;

    if (sessionStorage.getItem('userInfo')) {
      this.queryCorrelation.where.pub_company_id = JSON.parse(sessionStorage.getItem('userInfo')).company_id;
    }else {
      this.queryCorrelation.where.pub_company_id = '5a586c6d584aee0007d04dff';
    }
    
  },
  beforeDestroy () {
    clearInterval(this.timer.clockTimer);
    clearInterval(this.timer.mapMarkerTimer);
  }
};
</script>

<style>
@import "EleScreen.css";
</style>
