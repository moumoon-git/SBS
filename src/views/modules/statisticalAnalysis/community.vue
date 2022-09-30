<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <!--分组-->
      <div>
        <!--<el-tree :data="platformTreeList"
                 :props="platformTreeProps"
                 :default-expand-all="true"
                 @node-click="handleNodeClick">
        </el-tree>-->
        <div>
          <el-input
            placeholder="请输入小区名称"
            prefix-icon="el-icon-search"
            v-model="platformNameSearchKey"
            @change="platformNameSearch"
            @input="realTimePlatformNameSearch"
            filterable
            clearable
          >
          </el-input>
          <!--<el-button slot="append" icon="el-icon-search"></el-button>-->
        </div>

        <div class="schoolPlatformGroup"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="scrollDisabled">
          <!--<div id="schoolProgress" style="margin-top: 250px">
            <el-progress  style="margin-left: 80px" type="circle" :percentage="percentageCount"></el-progress>
            <el-button style="margin-left: 52px" type="warning" plain>数据加载中，请稍等...</el-button>
          </div>-->

          <ul style="list-style-type:none" v-for="data in platformTreeList">
            <el-tag  style="float: left;color: #409eff;z-index: 999;margin-top: 2px;">{{data.num}}</el-tag>
            <li :id="'platform'+data.platformId" class="platformNameTag"  style="padding: 4px;margin-left: 40px;margin-right: 10px;"
                @click="clickPlatform(data.platformId)">{{data.platformName}}</li>
          </ul>

          <el-button v-if="loading" style="margin-left: 90px;margin-bottom: 10px" type="warning" plain>数据加载中...</el-button>
          <el-button v-if="noMore" style="margin-left: 80px;margin-bottom: 10px" type="warning" plain>没有更多数据了</el-button>

        </div>
      </div>
    </el-col>
    <el-col :span="20">
      <!--联系人-->
      <div>
        <div style="box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
          <!--第一行-->
          <div style="margin-left: 10px;position: relative;z-index:2;">
            <el-row>
              <el-col :span="24">
                <!--头部组件-->
                <el-header
                  style="height: initial;padding: 0 0 0 0; clear: both; margin-top: 6px"
                  class="left">
                  <school-header ref="header"
                                 @clickAllHandle="clickAllHandle"
                                 @searchHandle="searchHandle">
                  </school-header>
                </el-header>
              </el-col>
            </el-row>
          </div>

          <!--第二行-->
          <div>
            <el-row>
              <el-col :span="12">
                <div style="display: flex;justify-content: center;width: 100%;">
                  <!--卡片-->
                  <!-- 
                    * @Author tanjinfeng
                    * @Desc 后台数据结构发生改变，改成动态生成
                    * @Date 2020-11-13
                  -->
                  <!-- ***原来的代码*** -->
                  <!-- <div style="height: 140px;flex:1;padding-left: 10px;">
                    <el-card shadow="always" style="height: 100%;background: rgba(96, 172, 255, 1);box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                      <div style="text-align: center;font-size: 18px;color: #FFFFFF">
                        <p style="margin-top: 25px;font-weight:bold; ">
                          <span>{{dangerTotal}}</span>
                        </p>
                        <p style="font-size: 18px;">
                          <span>总数</span>
                        </p>
                      </div>
                    </el-card>
                  </div> -->

                  <!-- <div style="height: 140px;width: 16%;padding-left: 10px;">
                    <el-card shadow="always" style="height: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                      <div style="text-align: center;font-size: 16px;">
                        <p style="margin-top: 32px;font-weight: bold ">
                          <span>{{fire}}</span>
                        </p>
                        <p style="">
                          <span>消防隐患</span>
                        </p>
                      </div>
                    </el-card>
                  </div> -->

                  <!-- <div style="height: 140px;width: 25%;padding-left: 10px;">
                    <el-card shadow="always" style="height: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                      <div style="text-align: center;font-size: 16px;">
                        <p style="margin-top: 32px;font-weight: bold ">
                          <span>{{security}}</span>
                        </p>
                        <p style="">
                          <span>安全隐患</span>
                        </p>
                      </div>
                    </el-card>
                  </div> -->

                  <!-- <div style="height: 140px;flex:1;padding-left: 10px;" v-for="(item,index) in manager" :key="index" >
                    <el-card shadow="always" style="height: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                      <div style="text-align: center;font-size: 16px;">
                        <p style="margin-top: 32px;font-weight: bold ">
                          <span>{{item.allCount}}</span>
                        </p>
                        <p style="">
                          <span>{{item.name}}</span>
                        </p>
                      </div>
                    </el-card>
                  </div> -->

                  <!-- <div style="height: 140px;width: 16%;padding-left: 10px;">
                    <el-card shadow="always" style="height: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                      <div style="text-align: center;font-size: 16px;">
                        <p style="margin-top: 32px;font-weight: bold ">
                          <span>{{trafficSafety}}</span>
                        </p>
                        <p style="">
                          <span>交通隐患</span>
                        </p>
                      </div>
                    </el-card>
                  </div> -->

                 <!-- <div style="height: 140px;flex:1;padding-left: 10px;">
                    <el-card shadow="always" style="height: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                      <div style="text-align: center;font-size: 16px;">
                        <p style="margin-top: 32px;font-weight: bold ">
                          <span>{{manager}}</span>
                        </p>
                        <p style="">
                          <span>管理隐患</span>
                        </p>
                      </div>
                    </el-card>
                  </div>

                  <div style="height: 140px;width: 25%;padding-left: 10px;">
                    <el-card shadow="always" style="height: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);">
                      <div style="text-align: center;font-size: 16px;">
                        <p style="margin-top: 32px;font-weight: bold ">
                          <span>{{other}}</span>
                        </p>
                        <p style="">
                          <span>矛盾纠纷</span>
                        </p>
                      </div>
                    </el-card>
                  </div> -->
                  <!-- ***修改后的代码*** -->
                  <div
                    class="community__card-item"
                    v-for="(card, cardIndex) in cardData"
                    :key="`communityCardItem_${cardIndex}`"
                  >
                    <div class="community__card-item__count">{{ card.allCount }}</div>
                    <div class="community__card-item__name">{{ card.name }}</div>
                  </div>
                  <!-- ***结束*** -->
                </div>
              </el-col>

              <el-col :span="4">
                <!--饼状图-->
                <div style="height: 250px;margin-top: -35%;">
                  <div ref="schoolPieEchart"  style="width:100%; height: 100%;" ></div>
                </div>
              </el-col>

              <el-col :span="8">
                <!--拆线图-->
                <div style="height: 250px;margin-top: -18%;">
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
                  prop="platformName"
                  label="小区名称"
                  align="center"
                >
                </el-table-column>

                <el-table-column
                  prop="eventTypeName"
                  label="隐患类型"
                  align="center"
                >
                </el-table-column>

                <el-table-column
                  width="400px"
                  prop="eventDescription"
                  :show-overflow-tooltip="true"
                  label="隐患描述"
                  align="center"
                >
                </el-table-column>

                <el-table-column
                  prop="gmtCreate"
                  label="上报时间"
                  align="center"
                >
                </el-table-column>

                <el-table-column
                  prop="status"
                  label="隐患状态"
                  align="center"
                >

                  <template slot-scope="scope">
                    <span v-if="scope.row.status == '1'" style="color: #cece00">待核实</span>
                    <span v-else-if="scope.row.status == '2'" style="color: #ffb269">核实中</span>
                    <span v-else-if="scope.row.status == '3'" style="color: #479DFF">待处理</span>
                    <span v-else-if="scope.row.status == '4'" style="color: #785DFF">处理中</span>
                    <span v-else-if="scope.row.status == '5'" style="color: #76D672">已处理</span>
                    <span v-else-if="scope.row.status == '6'" style="color: #76D672">超出范围</span>
                    <span v-else style="color: #83b8c2">未知</span>
                  </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  label="操作"
                  width="150"
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
    <!--点击查看，弹出查看窗口-->
    <community-word-manager-view :visible.sync="communityWordMangerViewVisible" ref="communityWordManagerView" append-to-body z-index="2"></community-word-manager-view>
  </el-row>

</template>

<script>

import { treeDataTranslate } from "@/utils";
import schoolHeader from "./header";
import echarts from "echarts";
import $ from "jquery";
import CommunityWordManagerView from '../word/manager/wordmanager-view2';

export default {
  data() {
    return {
      //隐患类型
      flagType: 5,
      //平台类型
      platformTypeId: 5,
      //平台列表
      selectedNode: [],
      //本平台
      platformId: this.$store.state.user.platformId,

      //左边平台列表
      platformNameSearchKey: '',
      copyPlatformTreeList: [],
      platformTreeList: [],
      //滚动条件
      scrollbarPage: 1,
      scrollbarLimit: 30,
      scrollbarTotal: 30,
      scrollbarTotalIndex: 30,
      loading: false,

      //搜索
      startTime: '',
      endTime: '',

      //面板
      dangerTotal: 0,
      fire: 0,
      manager: 0,
      other: 0,
      security: 0,
      trafficSafety: 0,

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

      //标志到底要不要共享平台,初始化时，需要0，1不需要
      sharePlatformFlagType: 0,

      cardData: [], // 上方卡片数据
    };
  },

  components: {
    "school-header": schoolHeader,
    'community-word-manager-view': CommunityWordManagerView,
  },

  computed: {
    noMore () {
      return this.scrollbarTotal === 0
    },
    scrollDisabled () {
      //scrollDisabled == false,可以滚动
      return this.loading || this.noMore
    }
  },

  // watch: {
  //   statusCode(newV, oldV) {
  //     console.log("请求状态",newV)
  //     if(newV != 0){
  //       //开启循环：每秒出现一次提示框
  //       let that = this;
  //       this.timer = setInterval(function()
  //       {
  //         console.log("请求状态加载中")
  //         that.$nextTick(() => {
  //           if(that.percentageCount < 100){
  //             that.percentageCount = that.percentageCount + 10;
  //           }
  //         })
  //       },500);
  //     }else{
  //       //请求完毕
  //       console.log("请求完毕")
  //       clearInterval(this.timer);
  //       $('#schoolProgress').css("display","none");
  //     }
  //   }
  // },

  mounted() {
    //请求树形列表
    this.getDataTreeList();
    this.getSharePlatformData();

  },
  methods: {

    loadMore() {
      this.loading = true
      setTimeout(() => {
        // console.log("loadloadloadloadloadloadloadloadloadloadloadloadloadloadloadload")
        this.scrollbarPage = this.scrollbarPage + 1
        //请求相机列表
        this.getDataTreeList();
        this.loading = false
      }, 2000)

    },

    // 请求平台树形数据
    getDataTreeList(){
      this.$http({
        url: this.$http.adornUrl(`/sys/platform/platformTotalRankList`),
        method: 'get',
        params: this.$http.adornParams({
          platformTypeId: this.platformTypeId,
          pageIndex: this.scrollbarPage,
          pageSize: this.scrollbarLimit,
        })
      }).then(({ data }) => {
        // console.log("请求平台统计数据",data)
        if(data!=null){

          //列表
          let list = data.data
          this.scrollbarTotal = list.length
          //动态添加，不是直接赋值
          for(let i=0; i<list.length; i++){
            this.copyPlatformTreeList.push(list[i]);
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
          this.copyPlatformTreeList = (this.copyPlatformTreeList.sort(compare('num'))).reverse();

          this.platformTreeList = this.copyPlatformTreeList;
        }
      })
    },

    //左边平台搜索
    platformNameSearch(){
      // console.log("左边平台搜索",this.platformNameSearchKey)
      if(this.platformNameSearchKey){
        this.platformTreeList = []
        //过滤
        this.copyPlatformTreeList.filter((value)=>{
          if(value.platformName.indexOf(this.platformNameSearchKey) > -1){
            this.platformTreeList.push(value)
          }
        });

      }else{
        this.platformTreeList = this.copyPlatformTreeList;
      }

      this.$nextTick(() => {
        $('.platformNameTag').css('background','');
        $('.platformNameTag').css('color','');
        //重新赋值
        if(this.selectedNode.length > 0){
          let clickPlatformId = this.selectedNode[0];
          $('#platform'+clickPlatformId).css('background','#38adff');
          $('#platform'+clickPlatformId).css('color','#ffffff');
        }
      })

    },

    //在 Input 值改变时触发，实时触发
    realTimePlatformNameSearch(){

      if(this.platformNameSearchKey){
        this.platformTreeList = []
        //过滤
        this.copyPlatformTreeList.filter((value)=>{
          if(value.platformName.indexOf(this.platformNameSearchKey) > -1){
            this.platformTreeList.push(value)
          }
        });

      }else{
        this.platformTreeList = this.copyPlatformTreeList;
      }

      this.$nextTick(() => {
        $('.platformNameTag').css('background','');
        $('.platformNameTag').css('color','');
        //重新赋值
        if(this.selectedNode.length > 0){
          let clickPlatformId = this.selectedNode[0];
          $('#platform'+clickPlatformId).css('background','#38adff');
          $('#platform'+clickPlatformId).css('color','#ffffff');
        }
      })

    },

    //获取本平台与共享平台数据
    getSharePlatformData(){

      // 查出本平台的共享平台
      let selectPlatformId;
      if(this.selectedNode.length === 0){
        selectPlatformId = this.platformId;
      }else{
        selectPlatformId = this.selectedNode[0];
      }

      if(this.sharePlatformFlagType === 0){
        //全部的，要共享
        this.$http({
          async: false,
          url: this.$http.adornUrl(
            "/event/eventShare/selectShareMenuPlatformByMenuId"
          ),
          method: "post",
          params: this.$http.adornParams({
            myPlatformId: selectPlatformId
          })
        }).then(({ data }) => {
          // 说明有共享数据
          if (data.list.length > 0) {
            // 先清空
            this.selectedNode = [];

            for (var i = 0; i < data.list.length; i++) {
              var id = data.list[i].linkagePlatformId;
              this.selectedNode.push(id);
            }
            //面板，饼状图
            this.initPanelData();
            //拆线图
            this.initLineData();
            //调用全部表格数据
            this.initTableData();
          }
        });
      }else{

        //面板，饼状图
        this.initPanelData();
        //拆线图
        this.initLineData();
        //调用全部表格数据
        this.initTableData();

      }

    },

    //点击平台
    clickPlatform(clickPlatformId){
      //标志到底要不要共享平台,初始化时，需要0，1不需要
      this.sharePlatformFlagType = 1

      // console.log(clickPlatformId)
      $('.platformNameTag').css('background','');
      $('.platformNameTag').css('color','');
      $('#platform'+clickPlatformId).css('background','#38adff');
      $('#platform'+clickPlatformId).css('color','#ffffff');

      this.selectedNode = [];
      this.selectedNode.push(clickPlatformId)
      //调用
      this.getSharePlatformData()

    },

    //头部条件搜索
    searchHandle (objTime, objContent){
      // console.log("搜索搜索搜索",objTime, objContent)

      var startTime;
      var endTime;
      if(objTime != null && objTime != ''){
        // 时间不为空
        startTime = objTime[0]
        endTime = objTime[1]
      }else{
        startTime = ''
        endTime = ''
      }

      this.startTime = startTime;
      this.endTime = endTime;
      //this.shareTownId = shareTownId;
      //面板，饼状图
      //this.initPanelData();
      //拆线图
      //this.initLineData();
      //表格
      //this.initTableData();
      this.getSharePlatformData()
    },

    //点击全部
    clickAllHandle(){
      //标志到底要不要共享平台,初始化时，需要0，1不需要
      this.sharePlatformFlagType = 0

      this.$nextTick(() => {
        $('.platformNameTag').css('background','');
        $('.platformNameTag').css('color','');
        $('#platform'+this.platformId).css('background','#38adff');
        $('#platform'+this.platformId).css('color','#ffffff');
      })
      this.selectedNode = []
      this.getSharePlatformData()
    },

    //初始化面板数据
    initPanelData(){
      let selectPlatformId;
      if(this.selectedNode.length === 0){
        //默认登录平台
        selectPlatformId = this.platformId;
      }else{
        //点击的平台
        selectPlatformId = this.selectedNode[0];
      }
      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsTypeCount"),
        method: "get",
        params: this.$http.adornParams({
          platformId: selectPlatformId,
          townId: this.townId,
          platformTypeId: 5,
          startTime: this.startTime,
          endTime: this.endTime,
          sharePlatformFlagType: this.sharePlatformFlagType,
        })
      }).then(res => {
        /**
         * @Author tanjinfeng
         * @Description 后台数据结构发生改变
         * @Date 2020-11-13
         */
        // ***原来的代码***
        //   console.log("/event/eventShare/statisticsTypeCount",res.data.map);
        //   // this.fire = res.data.map.fire;
        //  // 测试数据 let str = '{"msg":"success","code":0,"map":{"manager":[{"id":51,"parentId":138,"name":"投诉","platformId":null,"platformTypeId":5,"typeFlag":5,"children":null,"parentName":null,"createUserId":null,"gmtCreate":"2019-10-05 22:26:19","modifiedUserId":null,"gmtModified":null,"deleted":0,"childs":null,"allCount":11,"deCount":null,"delPencent":null},{"id":52,"parentId":138,"name":"举报","platformId":null,"platformTypeId":5,"typeFlag":5,"children":null,"parentName":null,"createUserId":null,"gmtCreate":"2019-10-05 22:26:19","modifiedUserId":null,"gmtModified":null,"deleted":0,"childs":null,"allCount":12,"deCount":null,"delPencent":null}]}}'
        //   //测试数据 res.data = JSON.parse(str)
        //   // console.log(res.data)
        //   this.manager = res.data.map.manager;
        //   this.other = res.data.map.other;
        //   this.security = res.data.map.security;
        //   this.trafficSafety = res.data.map.trafficSafety;
        //   this.fire = res.data.map.fire;
        //   this.dangerTotal = this.manager + this.other + this.security
        //   // let pieData = {
        //   //   x:[],
        //   //   y:[],
        //   //   allNum:0
        //   // }
        //   // if (res.data.map.manager) {
        //   //   res.data.map.manager.forEach(ele=>{
        //   //     let obj = {
        //   //       value:ele.allCount,
        //   //       name:ele.name
        //   //     }
        //   //     pieData.allNum += ele.allCount
        //   //     pieData.x.push(ele.name)
        //   //     pieData.y.push(obj)
        //   //   })
        //   // }
        //   // this.fire = pieData.allNum
        //   //构造饼图的数据
        //   let x = ['安全','管理','纠纷'];
        //   let y = [
        //     // {value:this.fire, name:'举报'},
        //     {value:this.security, name:'安全'},
        //     {value:this.manager, name:'管理'},
        //     {value:this.other, name:'纠纷'},
        //     // {value:this.trafficSafety, name:'交通'}
        //     ]
        //   //饼状图
        //   this.iniPieChart(x,y);
        // ***修改后的代码***
        if (res.data.code === 0) {
          this.cardData = res.data.map

          // 隐患总数
          let total = {
            allCount: 0,
            name: '隐患总数'
          }

          // 初始化饼图数据
          let x = [], y = []
          this.cardData.forEach(
            element => {
              x.push(element.name)
              y.push({
                value: element.allCount,
                name: element.name
              })
              total.allCount += element.allCount // 累加隐患数
            }
          )
          this.iniPieChart(x, y)

          this.cardData.unshift(total)
        }
        // ***结束***

      })
    },

    //初始化饼状图数据

    //初始化饼状图echart
    iniPieChart(x, y){
      this.chart = echarts.init(this.$refs.schoolPieEchart, "macarons");

      this.chart.setOption({
        legend: {
          icon:"circle",
          right: '0%',
          top: '35%',
          // bottom: '15%',
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
            //radius: ['30%', '60%'],
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

      let selectPlatformId;
      if(this.selectedNode.length === 0){
        selectPlatformId = this.platformId;
      }else{
        selectPlatformId = this.selectedNode[0];
      }

      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsByTime"),
        method: "get",
        params: this.$http.adornParams({
          platformId: selectPlatformId,
          townId: this.townId,
          platformTypeId: 5,
          startTime: this.startTime,
          endTime: this.endTime,
          sharePlatformFlagType: this.sharePlatformFlagType,
        })
      }).then(res => {
        // console.log("/event/eventShare/statisticsByTime", res);

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
          //top: "30%",
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
      let eventInfoConditionEntity = {
        platformTypeId: this.platformTypeId,
        flagType: this.flagType,
        validFlag: 1,
        keyword: this.searchTitle,
        startTime: this.startTime,
        endTime: this.endTime,
        eventTypeId: this.eventTypeId,
        townId: this.shareTownId,
        platformIds: this.selectedNode,
        status: this.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };

      this.$http({
        url: this.$http.adornUrl("/event/eventinfo/listByConditions"),
        method: "post",
        data: this.$http.adornData(eventInfoConditionEntity, false)
      }).then(({ data }) => {
        // console.log("初始化表格数据", data);
        this.tableData = data.list;
        this.totalPage = data.totalPage;
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
      this.communityWordMangerViewVisible = true
      this.$nextTick(() => {
        this.$refs.communityWordManagerView.init(row)
      })
    },


  }


};
</script>

<style lang="scss">
  .schoolPlatformGroup {
    min-width:220px;
    height: 920px;
    overflow-y: auto;
    margin-top: 10px;
    margin-left: -23px;
  }
  .schoolPlatformGroup::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }
  .schoolPlatformGroup::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(52, 163, 242, 0.48);
  }
  .schoolPlatformGroup::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
  }

  .el-tooltip__popper{
    max-width:40%;
  }

  /*.schoolTable{
    .el-tooltip__popper{
      max-width:45%;
    }
  }*/

/**
 * @Author tanjinfeng
 * @Description 新的上方卡片样式
 */
// ***开始***
.community__card-item {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.21);
  background: white;
  width: 100%;
  height: 140px;
  margin: 0 5px;
  flex-shrink: 1;
  align-self: center;
  text-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  &__count {
    font-size: 32px;
    font-weight: bold;
  }
  &__name {
    font-size: 16px;
  }
  &:first-child {
    color: white;
    background: #38ADFF;
  }
}
// ***结束***

</style>
