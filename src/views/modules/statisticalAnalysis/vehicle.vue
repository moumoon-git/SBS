<template>
  <el-row :gutter="20">
    <!--左侧内容-->
    <el-col :span="4" style="background: #f3f3f3;">
      <!--分组-->
      <div>
        <!--时间插件-->
        <div style="margin-top: 10px">
          <!--<el-date-picker
            @change="submitDaterange"
            style="width: 254px"
            v-model="objTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>-->

          <el-date-picker
            @change="submitDaterange"
            style="width: 254px"
            v-model="objTime"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>

        <div style="margin-top: 10px;margin-bottom: 10px;">
          <el-input
            placeholder="请输入相机名称"
            prefix-icon="el-icon-search"
            v-model="cameraNameSearchKey"
            @change="cameraNameSearch"
            @input="realTimeCameraNameSearch"
            filterable
            clearable
          >
          </el-input>
        </div>

        <div id="all-statistics" @click="clickAllHandle(0)">
          <span>综合统计</span>
        </div>

        <div class="vehiclePlatformGroup"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="scrollDisabled"
        >

          <ul style="list-style-type:none"
              v-for="(data,index) in cameraList">
            <el-tag style="color:#000000; float: right;z-index: 999;margin-right: 10px;">{{data.num}}次</el-tag>
            <li :id="'camera'+data.cameraId" class="cameraNameTag"
                style="padding: 4px;margin-right: 10px;background: #ffffff;"
                @click="clickPlatform(data.cameraId,data.crossingId)">【{{index+1}}】{{data.cameraName}}</li>
          </ul>

          <el-button v-if="loading" style="margin-left: 90px;margin-bottom: 10px" type="warning" plain>数据加载中...</el-button>
          <el-button v-if="noMore" style="margin-left: 80px;margin-bottom: 10px" type="warning" plain>没有更多数据了</el-button>

        </div>
      </div>
    </el-col>

    <!--中间内容-->
    <el-col :span="16">
      <!--联系人-->
      <div>
        <div style="box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">

          <!--第二行-->
          <div style="margin-left: 10px;">
            <el-row>
              <el-col :span="14">
                <el-row style="margin-top: 10px;">
                  <!--总数-->
                  <el-col :span="4">
                    <div style="height: 180px">
                      <el-card shadow="always" style="height: 100%;background: rgba(96, 172, 255, 1);box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                        <div style="text-align: center;font-size: 24px;color: #FFFFFF">
                          <p style="margin-top: 35px;font-weight:bold; ">
                            <span>{{dangerTypeTotal}}</span>
                          </p>
                          <p style="font-size: 18px;">
                            <span>抓拍总数</span>
                          </p>
                        </div>
                      </el-card>
                    </div>
                  </el-col>
                  <!--swiper切换-->
                  <el-col :span="20">
                    <div style="width: 100%;" class="swiperVehicle">
                      <swiper :options="swiperOption">

                        <swiper-slide :key="index" v-for="(item,index) in dangerTypeList">
                          <div style="height: 180px;padding-left: 10px;">
                            <el-card shadow="always" style="height: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                              <div style="text-align: center;">
                                <p style="margin-top: 45px;font-weight: bold ">
                                  <span style="font-size: 24px;">{{item.typeCount}}</span>
                                </p>
                                <p style="font-size: 18px;">
                                  <span>{{item.typeName}}</span>
                                </p>
                              </div>
                            </el-card>
                          </div>
                        </swiper-slide>

                        <div class="swiper-pagination" slot="pagination"></div>
                        <!--前后页面切换-->
                        <div class="swiper-button-prev" slot="button-prev"></div>
                        <div class="swiper-button-next" slot="button-next"></div>

                      </swiper>
                    </div>
                  </el-col>
                </el-row>
              </el-col>

              <!--<el-col :span="4">
                &lt;!&ndash;饼状图&ndash;&gt;
                <div style="height: 250px;margin-top: -18%;">
                  <div ref="schoolPieEchart"  style="width:100%; height: 100%;" ></div>
                </div>
              </el-col>-->

              <el-col :span="10">
                <!--拆线图-->
                <div style="height: 250px;margin-top: -6%;">
                  <div ref="schoolLinePeriod"  style="width:100%; height: 100%;"></div>
                </div>
              </el-col>

            </el-row>
          </div>
        </div>

        <!--第三行-->
        <div style="margin-top: 15px;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);padding: 10px;">
          <!--表格-->
          <el-row  class="schoolTable">
            <el-col :span="24">
              <!-- <el-button style="background: #38ADFF;color: #fff;width: 156px;margin-bottom: 10px;">查看热力图</el-button> -->
              <el-table
                :data="tableData"
                border
                style="width: 100%"
                :header-cell-style="{background:'#555555',color:'#ffffff'}"
              >

                <el-table-column
                  prop="plateInfo"
                  label="车牌号码"
                  align="center"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>

                <el-table-column
                  prop="controlName"
                  label="车辆类型"
                  align="center"
                >
                </el-table-column>

                <el-table-column
                  width="350px"
                  prop="cameraName"
                  :show-overflow-tooltip="true"
                  label="摄相枪位置"
                  align="center"
                >
                </el-table-column>

                <el-table-column
                  prop="alarmTime"
                  label="抓拍时间"
                  width="200"
                  align="center"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>


                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100"
                  header-align="center"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button type="text" size="small"  @click="formFindHandleClick(scope.row)"
                               style="border:none;background:none;color:#479DFF;font-size: 12px;
                       font-family: MicrosoftYaHei;font-weight: bold;">查看
                    </el-button>

                  </template>
                </el-table-column>

              </el-table>
            </el-col>
          </el-row>

          <!--分页-->
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage"
          ></el-pagination>

        </div>

      </div>
    </el-col>

    <!--右侧排行版-->
    <el-col :span="4" style="background: #f3f3f3;">
      <!--分组-->
      <div style="margin-top: 10px;">
        <el-select v-model="vehicleTypeId"
                   clearable
                   placeholder="全部类型"
                   style="width: 245px"
                   @change="selectVehicleType">
          <el-option
            v-for="item in vehicleTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <!--车辆类型抓拍排行版-->
      <div style="margin-top: 20px;">
        <div class="vehicle-snap"><span style="color: #ffffff;">{{vehicleTypeName}}—类型抓拍排行版</span></div>
        <div class="vehicle-snap-list" :key="index" v-for="(item,index) in vehicleRankingList">
          <el-row style="background: white;margin: 10px;padding: 5px;">
            <el-col :span="5" style="margin-top: 12px">
              <div><span>【{{index+1}}】</span></div>
            </el-col>
            <el-col :span="13">
              <div>{{item.carNum}}</div>
              <div style="margin: 5px;"></div>
              <div>{{item.controlName}}</div>
            </el-col>
            <el-col :span="6" style="margin-top: 10px">
              <el-tag  style="color: #000000;z-index: 999;">{{item.num}}</el-tag>
            </el-col>
          </el-row>

        </div>
      </div>

      <!--车辆类型摄像枪抓拍排行版-->
      <div style="margin-top: 30px;">
        <div class="camera-snap"><span style="color: #ffffff;">{{vehicleTypeName}}—摄像枪抓拍排行版</span></div>
        <div class="camera-snap-list" v-for="(item,index) in cameraRankingList">
          <ul style="list-style-type:none">
            <el-tag  style="float: right;color: #000000;z-index: 999;margin-right: 20px;margin-top: 4px;">{{item.num}}</el-tag>
            <li class="platformNameTag"
                style="padding: 4px;margin-right: 20px;background: #ffffff;">【{{index+1}}】{{item.cameraName}}</li>
          </ul>
        </div>
      </div>

    </el-col>

    <!-- 查看弹窗 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></add-or-update>

  </el-row>

</template>

<script>

import { treeDataTranslate } from "@/utils";
import vehicleHeader from "./vehicleHeader";
import echarts from "echarts";
import $ from "jquery";
import AddOrUpdate from "../risk/riskvehiclealarm/riskvehiclealarm-add-or-update.vue";
// import 'swiper/dist/css/swiper.css'
import 'swiper/css/swiper.css'
//切换组件
import { swiper, swiperSlide } from 'vue-awesome-swiper'


export default {
  data() {
    return {
      //隐患类型，3人，4车
      flagType: 4,
      //平台类型
      platformTypeId: 3,
      //本平台
      platformId: this.$store.state.user.platformId,

      //左边平台列表
      objTime: [], //时间搜索
      startTime: '',
      endTime: '',

      cameraNameSearchKey: '',
      cameraId: 0,
      crossingId: 0,

      //滚动条分页
      copyCameraList: [], //这个值是滚动条实时的值
      cameraList: [], //这个值是根据搜索列表的值
      scrollbarPage: 1,
      scrollbarLimit: 30,
      scrollbarTotal: 30,
      scrollbarTotalIndex: 30,
      loading: false,

      //面板
      dangerTypeList: [],
      dangerTypeTotal: 0,


      //表格
      tableData: [],
      //表格请求条件
      searchTitle: '',
      eventTypeId: '',
      shareTownId: '',
      status: '',

      //分页
      pageIndex: 1,
      pageSize: 10,
      totalPage: 100,

      //请求百分比
      statusCode: 500,
      percentageCount: 0,
      timer: null,

      //查看工单组件弹窗
      communityWordMangerViewVisible: false,

      //切换组件
      swiperOption: {
        //effect: 'flip',
        slidesPerView: 5,
        spaceBetween: 0,
        slidesPerGroup: 5,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          //grabCursor: true,
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },

      //右侧
      vehicleTypeList: [],
      vehicleTypeId: '',
      vehicleTypeName: '全部类型',

      //车辆排行版
      vehicleRankingList: [],

      //相机排行版
      cameraRankingList: [],

      addOrUpdateVisible: false,

    };
  },

  components: {
    "vehicle-header": vehicleHeader,
    AddOrUpdate,
    swiper,
    swiperSlide
  },

  computed: {
    noMore () {
      return this.scrollbarTotal < 30
    },
    scrollDisabled () {
      //scrollDisabled == false,可以滚动
      return this.loading || this.noMore
    }
  },

  watch: {

  },

  mounted() {
    //请求相机列表
    this.getCameraDataList();
    this.getSharePlatformData();
    //车辆的类型列表
    this.initVehicleTypeData();
    //车辆排行版
    this.vehicleRanking();

    //相机排行版
    this.cameraRankinig();
  },

  methods: {
    loadMore() {
      this.loading = true
      setTimeout(() => {
        // console.log("loadloadloadloadloadloadloadloadloadloadloadloadloadloadloadload")
        this.scrollbarPage = this.scrollbarPage + 1
        //请求相机列表
        this.getCameraDataList();
        this.loading = false
      }, 2000)

    },

    //相机列表
    getCameraDataList(){
      this.$http({
        url: this.$http.adornUrl(`/statisticApi/vehicleApi/vehicleaCameraTotalRankList`),
        method: 'get',
        params: this.$http.adornParams({
          page: this.scrollbarPage,
          limit: this.scrollbarLimit,
        })
      }).then(({ data }) => {
        // console.log("相机列表1",data)
        if(data.data != null){
          //列表
          let list = data.data
          this.scrollbarTotal = list.length
          //动态添加，不是直接赋值
          for(let i=0; i<list.length; i++){
            this.copyCameraList.push(list[i]);
          }

          //排序
          function compare(property){
            return function(a,b){
              var value1 = a[property];
              var value2 = b[property];
              return value1 - value2;
            }
          }
          //反转
          this.copyCameraList = (this.copyCameraList.sort(compare('num'))).reverse();

          this.cameraList = this.copyCameraList;

        }
      })
    },

    //左边搜索
    cameraNameSearch(){
      // console.log("左边搜索",this.cameraNameSearchKey)
      if(this.cameraNameSearchKey){
        this.cameraList = []
        //过滤
        this.copyCameraList.filter((value)=>{
          if(value.cameraName.indexOf(this.cameraNameSearchKey) > -1){
            this.cameraList.push(value)
          }
        });

      }else{
        this.cameraList = this.copyCameraList;
      }

      this.$nextTick(() => {
        $('.cameraNameTag').css('background','');
        $('.cameraNameTag').css('color','');
        //重新赋值给原来点击的值
        let clickCameraId = this.cameraId;

        if(clickCameraId != 0){
          $('#camera'+clickCameraId).css('background','#38adff');
          $('#camera'+clickCameraId).css('color','#ffffff');
        }
      })

    },

    //在 Input 值改变时触发，实时触发
    realTimeCameraNameSearch(){

      if(this.cameraNameSearchKey){
        this.cameraList = []
        //过滤
        this.copyCameraList.filter((value)=>{
          if(value.cameraName.indexOf(this.cameraNameSearchKey) > -1){
            this.cameraList.push(value)
          }
        });

      }else{
        this.cameraList = this.copyCameraList;
      }

      this.$nextTick(() => {
        $('.cameraNameTag').css('background','');
        $('.cameraNameTag').css('color','');
        //重新赋值给原来点击的值
        let clickCameraId = this.cameraId;
        if(clickCameraId != 0){
          $('#camera'+clickCameraId).css('background','#38adff');
          $('#camera'+clickCameraId).css('color','#ffffff');
        }
      })

    },

    getSharePlatformData(){
      //面板，饼状图
      this.initPanelData();
      //拆线图
      this.initLineData();
      //调用全部表格数据
      this.initTableData();
    },

    //点击li
    clickPlatform(cameraId,crossingId){
      // console.log("点击li==cameraId===crossingId",cameraId,crossingId)
      $('.cameraNameTag').css('background','#ffffff');
      $('.cameraNameTag').css('color','');
      //这个是全部点击值
      $('#all-statistics').css('background','#ffffff');
      $('#all-statistics').css('color','');
      //这个是li的点击值
      $('#camera'+cameraId).css('background','#38adff');
      $('#camera'+cameraId).css('color','#ffffff');

      //相机的id
      this.cameraId = cameraId;
      this.crossingId = crossingId;

      //调用
      this.getSharePlatformData()

    },

    //时间选择
    submitDaterange(){
      // console.log("时间选择",this.objTime)
      if(this.objTime){
        this.startTime = this.objTime[0];
        this.endTime = this.objTime[1];
      }else{
        this.startTime = '';
        this.endTime = '';
      }

      //调用
      this.getSharePlatformData()
    },

    //点击全部
    clickAllHandle(val){
      this.cameraId = val;

      this.$nextTick(() => {
        //这个是li的点击值
        $('.cameraNameTag').css('background','#ffffff');
        $('.cameraNameTag').css('color','');
        //这个是全部点击值
        $('#all-statistics').css('background','#38adff');
        $('#all-statistics').css('color','#ffffff');
      })

      //相机的id
      this.cameraId = null;
      this.crossingId = null;
      this.getSharePlatformData()
    },

    //初始化面板数据
    initPanelData(){

      this.$http({
        url: this.$http.adornUrl("/statisticApi/vehicleApi/vehicleTypeTotalRankList"),
        method: "get",
        params: this.$http.adornParams({
          platformId: this.platformId,
          crossingId: this.crossingId,//摄像机路口标志
          startAt: this.startTime,
          endAt: this.endTime
        })
      }).then(res => {
        // console.log("初始化面板数据",res);
        this.dangerTypeList = [];
        this.dangerTypeTotal = 0;
        if(res.data.data != null){
          let arr = res.data.data;
          for(let i=0; i<res.data.data.length; i++){
            let typeName = arr[i].typeName;
            let typeCount = 0;
            let countArr = arr[i].typeList;
            if(countArr.length != null && countArr.length != 0){
              for(let j=0; j<countArr.length;j++){
                typeCount =typeCount + countArr[j].num;
                //总量
                this.dangerTypeTotal = this.dangerTypeTotal + countArr[j].num
              }
            }
            let obj = {'typeName': typeName,'typeCount':typeCount}
            this.dangerTypeList.push(obj);

            //排序
            function compare(property){
              return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
              }
            }
            //反转
            this.dangerTypeList = (this.dangerTypeList.sort(compare('typeCount'))).reverse();
            //let obj = {'controlTypeId':}
          }
        }

      })
    },
    //初始化饼状图echart
    iniPieChart(x, y){
      this.chart = echarts.init(this.$refs.schoolPieEchart, "macarons");

      this.chart.setOption({
        legend: {
          icon:"circle",
          right: '10%',
          top: '0%',
          bottom: '0%',
          //orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: 'vertical',
          //x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          //x: 'right',
          //y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          //y: 'center',
          //itemWidth: 24,   // 设置图例图形的宽
          //itemHeight: 18,  // 设置图例图形的高
          textStyle: {
            color: '#666'  // 图例文字颜色
          },
          backgroundColor: '#eee',  // 设置整个图例区域背景颜色
          data: x
        },

        series: [
          {
            name: '类型占比',
            type: 'pie',
            radius: '50%',
            //radius: ['30%', '60%'],//调整左右，上下
            center: ['35%', '60%'],
            data: y,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(30, 144, 255，0.5)'
              }
            },
            // 设置值域的那指向线
            labelLine: {
              normal: {
                show: false
              }
            },
            // 设置值域的标签
            label: {
              normal: {
                position: 'inner',
                formatter: '{d}%'
              }
            }
          }
        ],
      });
    },

    //初始化拆线图数据、按年月日统计,初始化数据
    initLineData() {
      var x = [];
      var y = [];

      this.$http({
        url: this.$http.adornUrl("/statisticApi/vehicleApi/vehicleStatisticsByTime"),
        method: "get",
        params: this.$http.adornParams({
          crossingId: this.crossingId,
          platformId: this.platformId,
          startAt: this.startTime,
          endAt: this.endTime,
        })
      }).then(res => {
        // console.log("按年月日统计,初始化数据", res);

        if(res.data.data != null && res.data.data.length > 0){

          if( res.data.data[0].column <200 && res.data.data.length === 12){
            //月
            var i = 1;
            for (let j = 0; j < res.data.data.length; j++) {
              res.data.data.forEach(item => {
                if (item.column === i) {
                  x.push(item.column+"月")
                  y.push(item.count);
                  ++i;
                }
              });
            }

            this.$nextTick(() => {
              this.initLineChart(x,y);
            });

          }else if(res.data.data[0].column <200 && res.data.data.length === 30){
            //天
            var i = 1;
            for (let j = 0; j < res.data.data.length; j++) {
              res.data.data.forEach(item => {
                if (item.column === i) {
                  x.push(item.column+"号")
                  y.push(item.count);
                  ++i;
                }
              });
            }

            this.$nextTick(() => {
              this.initLineChart(x,y);
            });

          }else if(res.data.data[0].column > 300){
            //年
            for (let j = 0; j < res.data.data.length; j++) {
              x.push(res.data.data[j].column);
              y.push(res.data.data[j].count);

            }

            this.$nextTick(() => {
              this.initLineChart(x,y);
            });

          }
        }

      });
    },

    //初始化拆线图echart
    initLineChart(x,y) {
      this.chart = echarts.init(this.$refs.schoolLinePeriod, "macarons");

      this.chart.setOption({
        color: ['#3398DB'],

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          left: "1%",
          right: "5%",
          top: "25%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            //name: "月份",
            type: "category",
            boundaryGap: false,
            data: x
          }
        ],
        yAxis: [
          {
            type: "value",
            //name: "隐患数量"
          }
        ],
        series: [
          {
            name: "隐患数量",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: y
          }
        ]
      });
    },

    //初始化表格数据
    initTableData(){

      this.$http({
        url: this.$http.adornUrl("/statisticApi/vehicleApi/vehicleaListByCrossingId"),
        method: "get",
        params: this.$http.adornParams({
          platformId: this.platformId,
          crossingId: this.crossingId,
          startAt: this.startTime,
          endAt: this.endTime,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        })
      }).then(({ data }) => {
        // console.log("初始化表格数据", data);
        this.tableData =[];
        this.totalPage = data.total;

        for(let i=0; i<data.list.length; i++){
          for(let j=0; j<this.vehicleTypeList.length; j++){
            if(data.list[i].controlTypeId === this.vehicleTypeList[j].id){
              let obj = {
                'id':data.list[i].id,
                'crossingId':data.list[i].crossingId,
                'plateInfo':data.list[i].plateInfo,
                'alarmTime':data.list[i].alarmTime.split('.')[0],
                'cameraName':data.list[i].cameraName,
                'controlName':this.vehicleTypeList[j].name
              };
              this.tableData.push(obj);
            }
          }
        }

      });

    },

    //初始化车辆类型
    initVehicleTypeData(){
      this.$http({
        url: this.$http.adornUrl("/event/eventType/selectTypeList"),
        method: "get",
        params: this.$http.adornParams({
          typeFlag: this.flagType
        })
      }).then(({ data }) => {
        // console.log("event/eventType/selectTypeList",data)
        this.vehicleTypeList = [];
        this.vehicleTypeList = data.list;
      });
    },

    //选择车辆类型
    selectVehicleType(){
      // console.log("selectVehicleType",this.vehicleTypeId)
      if(this.vehicleTypeId){
        this.vehicleTypeList.forEach((item,index)=>{
          if(item.id === this.vehicleTypeId){
            this.vehicleTypeName = item.name;
          }
        })
      }else{
        this.vehicleTypeName = '全部类型';
      }

      //排行版
      this.vehicleRanking();
      this.cameraRankinig();

    },

    //车辆排行版
    vehicleRanking(){
      this.$http({
        url: this.$http.adornUrl("/statisticApi/vehicleApi/vehicleRankList"),
        method: "get",
        params: this.$http.adornParams({
          controlTypeId: this.vehicleTypeId,
          platformId: this.platformId,
          startAt: this.startTime,
          endAt: this.endTime,
          limit: 5
        })
      }).then(({ data }) => {
        // console.log("车辆排行版", data);
        this.vehicleRankingList = [];
        for(let i=0; i<data.data.length; i++){
          for(let j=0; j<this.vehicleTypeList.length; j++){
            if(data.data[i].controlTypeId === this.vehicleTypeList[j].id){
              let obj = {'num':data.data[i].num,'carNum':data.data[i].carNum,'controlTypeId':data.data[i].controlTypeId,'controlName':this.vehicleTypeList[j].name};
              this.vehicleRankingList.push(obj);
            }
          }
        }
      });
    },

    //相机排行版
    cameraRankinig(){
      this.$http({
        url: this.$http.adornUrl("/risk/riskcamera/queryVehicleCameraRank"),
        method: "get",
        params: this.$http.adornParams({
          platformId: this.platformId,
          controlTypeId: this.vehicleTypeId,
          startAt: this.startTime,
          endAt: this.endTime,
          limit: 5,
        })
      }).then(({ data }) => {
        // console.log("相机排行版", data);
        if(data.data != null){
          for(let i=0; i<data.data.length; i++){

          }
        }
        this.cameraRankingList = data.data;
      });
    },

    // 当前显示条数
    sizeChangeHandle(val) {
      // console.log("当前显示条数", val);
      this.pageSize = val;
      this.pageIndex = 1;
      this.initTableData();
    },
    // 当前页
    currentChangeHandle(val) {
      // console.log("当前页当前页当前页", val);
      this.pageIndex = val;
      this.initTableData();
    },

    // 查看
    formFindHandleClick (row) {
      // console.log("点击查看",row)
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row.plateInfo);
      });
    },


  }

};
</script>

<style lang="scss">
  /*摄像机统计*/
  #capture-statistics{
    height: 36px;
    text-align: center;
    font-size: 16px;
    border-radius: 4px;
    padding: 4px;
    margin: 10px 0px;
    border: 1px solid #dcdfe6;
  }

  /*综合统计*/
  #all-statistics{
    height: 36px;
    text-align: center;
    font-size: 16px;
    border-radius: 4px;
    background: #ffffff;
    padding: 4px;
    margin: 10px 0px;
    border: 1px solid #dcdfe6;
  }

  /*滚动条*/
  .vehiclePlatformGroup {
    min-width:220px;
    height: 760px;
    overflow-y: auto;
    margin-top: 10px;
    margin-left: -23px;
  }
  .vehiclePlatformGroup::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }
  .vehiclePlatformGroup::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(52, 163, 242, 0.48);
  }
  .vehiclePlatformGroup::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
  }

  .el-tooltip__popper{
    max-width:40%;
  }

  .vehicle-snap{
    height: 36px;
    text-align: left;
    font-size: 16px;
    border-radius: 4px;
    background: #60acff;
    padding: 4px;
    margin: 10px 0px;
    border: 1px solid #dcdfe6;
    margin-right: 8px;
  }

  .camera-snap{
    height: 36px;
    text-align: left;
    font-size: 16px;
    border-radius: 4px;
    background: #60acff;
    padding: 4px;
    margin: 10px 0px;
    border: 1px solid #dcdfe6;
    margin-right: 8px;
  }

  .camera-snap-list{
    min-width:220px;
    margin-top: 10px;
    margin-left: -28px;
  }

  .vehicle-snap-list{
    margin-right: 10px;
  }

  /*.swiper-container{

  }*/
  .swiperVehicle {
    .swiper-button-next:after, .swiper-button-prev:after {
      display: none;
    }
  }
  .swiperVehicle{
    .swiper-button-prev{
      border-radius: 50%;
      background-size: 12px 24px;
      background-color: #38adffcf;
      top: 58%;
      height: 30px;
      background-position: 8px;
      background-repeat: no-repeat;
      background-image:url('../../../assets/img/left.svg')
    }
  }

  .swiperVehicle{
    .swiper-button-next{
      border-radius: 50%;
      background-size: 12px 24px;
      background-color: #38adffcf;
      top: 58%;
      height: 30px;
      right: 0px;
      background-position: 8px;
      background-repeat: no-repeat;
      background-image:url('../../../assets/img/right.svg')
    }
  }



</style>

