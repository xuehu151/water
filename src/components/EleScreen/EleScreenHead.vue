<template>
  <div class="screen-header">
    <div class="screen-header-logo">
      <a href="javascript:;">
        <img src="../../assets/image/screen_logo.png" alt="">
      </a>
    </div>
    <div class="screen-header-tit">
      <span class="screen-tit-line"></span>
      <h1 class="screen-tit-text"></h1>
      <span class="screen-tit-line"></span>
    </div>
    <div class="screen-header-right">
      <div class="screen-weather">
        <div class="weather-logo">
          <h3 class="weather-icon"></h3>
        </div>
        <div class="weather-info">
          <dl>
            <dt><span>{{weathers.weather}}</span>&nbsp;&nbsp;&nbsp;<span>今天</span></dt>
            <dd>{{weathers.templow}}&nbsp;~&nbsp;{{weathers.temphigh}}°C</dd>
          </dl>
        </div>
      </div>
      <div class="go-platform-btn" @click="goPlatform">
        进入平台
      </div>
      <!-- <router-link to="/runMonitor" class="go-platform-btn">
        进入平台
      </router-link> -->
    </div>
  </div>
</template>

<script>
export default{
    name: 'screenHeader',
    data () {
      return {
        weathers: {},
        queryCorrelation: {
          where: {
            city_id: ''
          }
        }
      };
    },
    methods: {
      async getWeathers (dom) {
        const res = await this.$http( '/public/weather',{data: this.queryCorrelation.where });
        this.weathers = res.result;
        dom.style.backgroundPosition = '0px ' + (this.weathers.img) * -56 + 'px';
      },
      goPlatform(){
        sessionStorage.setItem('menuActive',1);
        this.$router.push({path: '/runMonitor'});
      }
    },
    mounted () {
      //this.queryCorrelation.where.city_id = JSON.parse(sessionStorage.getItem('userInfo')).city_id;
      this.queryCorrelation.where.city_id = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')).city_id : '1096';
      const weatherIcon = document.getElementsByClassName('weather-icon')[0];
      this.getWeathers(weatherIcon);
    }
  };
</script>


<style>
  .screen-header{
    width: 100%;
    height:7.5%;
    background: rgba(4,144,217,.25);
    position: relative;
    z-index: 100;
  }
  .screen-header > .screen-header-logo{
    width: 35.4%;
    height: 100%;
    border-bottom: 1px solid #005b7e;
    float: left;
  }

  .screen-header-logo > a{
    display: block;
    width: 31.6%;
    height: 70%;
    margin-left: 4%;
    margin-top: 2%;
  }

  .screen-header-logo > a > img{
    width: 100%;
    height: 100%;
  }

  .screen-header > .screen-header-tit{
    width: 29.2%;
    height: 100%;
    float: left;
  }

  .screen-header-tit span{
    display: block;
    width: 13%;
    height: 2px;
    background: #ced7df;
    float: left;
    margin-top: 7%;
  }

  .screen-header-tit span:nth-child(1) {
    margin-left: 3.5%;
  }

  .screen-header-tit > h1{
    width: 63.6%;
    height: 42.9%;
    float: left;
    background: url("../../assets/image/screen_tit.png") no-repeat center;
    background-size: contain;
    margin: 5% 2% 0 2%;
  }

  .screen-header > .screen-header-right{
    width: 35.4%;
    height: 100%;
    float: left;
    position: relative;
    border-bottom: 1px solid #005b7e;
  }

  .screen-header-right > .go-platform-btn{
    display: block;
    width: 15%;
    height: 33px;
    border: 1px solid #ffffff;
    color: #ffffff;
    border-radius: 5px;
    text-align: center;
    line-height: 33px;
    text-decoration: none;
    position: absolute;
    right: 5%;
    top:25%;
    font-size: 15px;
    transition: all .5s linear;
    cursor: pointer;
  }
  .screen-header-right > .go-platform-btn:hover{
    background: rgba(255, 255, 255, .3);
  }

  @media screen and (min-width : 1366px) and (max-width: 1500px) {
    .screen-header-right >.go-platform-btn{
      font-size: 8px;
      height: 20px;
      line-height: 20px
    }
  }

  @media screen and (max-width : 1366px){
    .screen-header-right >.go-platform-btn{
      font-size: 12px;
    }
  }

  .screen-header-right > .screen-weather{
    width: 33.3%;
    height: 100%;
    margin-left: 15.3%;
    border-left: 1px solid #005b7e;
    border-right:1px solid #005b7e;
  }
  .screen-weather > .weather-logo{
    width: 40%;
    height: 100%;
    float: left;
    position: relative;
  }
  .screen-weather > .weather-logo > h3{
    width: 56px;
    height: 56px;
    position: absolute;
    left:0;
    top:0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: url("../../assets/image/weather.png");
    transition: all 0.3s linear;
    /*background-position: left -56px;*/
    /*background: url("../../assets/image/weather/1.png");*/
  }

  .screen-weather > .weather-info{
    width: 59%;
    height: 100%;
    float: left;
  }

  .weather-info > dl{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .weather-info > dl > dt{
    color: #fff;
    font-size: 13px;
    margin-top: 13%;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .weather-info > dl > dd{
    color: #02b1cb;
    font-size: 20px;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

</style>
