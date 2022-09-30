<template>
  <div class="eventinfo">
    <el-container id="eventbody">
      <el-header>事件接报信息填写</el-header>
      <el-main>
          <el-form ref="dataForm" :model="dataForm" label-width="100px" :rules="rules">
            <el-row>
              <el-col :span="12" style=""> <el-form-item label="信息标题" prop="title">
                <el-input v-model="dataForm.title" ></el-input>
              </el-form-item></el-col>

            </el-row>
            <el-row>

              <el-col :span="6"><el-form-item label="报送人" prop="reportName">
                <el-input v-model="dataForm.reportName">
                </el-input>
              </el-form-item></el-col>
              <el-col :span="6"><el-form-item label="报送人电话"  prop="reportNameContact" style="width: 100%">
                <el-input v-model="dataForm.reportNameContact"></el-input>
              </el-form-item></el-col>
            </el-row>
            <el-row>

              <el-col :span="6"><el-form-item label="报送时间"  prop="reportTime">
                <el-date-picker
                  unlink-panels
                  style="width: 100%"
                  v-model="dataForm.reportTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="报送方式" prop="reportMethod">
                <el-select v-model="dataForm.reportMethod" placeholder="请选择报送方式" style="width:100%">
                  <el-option
                    v-for="item in reportmethodlist"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>

            </el-row>
            <el-row>

                <el-col :span="12"><el-form-item label="报送单位">
                <el-input v-model="dataForm.reportUnit"></el-input>
                </el-form-item></el-col>
            </el-row>
            <el-row>

              <el-col :span="6"><el-form-item label="回复方式" prop="replyType">
                <el-select v-model="dataForm.replyType" placeholder="请选择回复方式" style="width: 100%">
                  <el-option
                    v-for="(item,index) in replytypelist"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item></el-col>


              <el-col :span="6"><el-form-item label="回复对象">
                <el-input v-model="dataForm.replyName"></el-input>
              </el-form-item>
              </el-col>
            </el-row>


            <el-row>
              <el-col :span="6"><el-form-item label="事件类型"  prop="eventTypeId">
                <el-cascader
                    style="width: 100%"
                    :show-all-levels="false"
                    :props="eventtypeProps"
                    :options="eventtypelist"
                    v-model="dataForm.eventTypeId"
                    @change="handleChange">
                  </el-cascader>
              </el-form-item>
              </el-col>

              <el-col :span="6"><el-form-item label="事发时间" prop="eventTime">
                  <el-date-picker
                  unlink-panels
                  style="width: 100%"
                  v-model="dataForm.eventTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item></el-col>
            </el-row>


            <el-row>
              <el-col :span="12"><el-form-item label="事发区域" prop="eventArealist" >
                <el-input
                  style="width: 100%"
                  placeholder="点击事发地点定位自动获取事发行政区域"
                  v-model=dataForm.eventArealist>
                </el-input>
                <!--<el-cascader-->
                  <!--@focus="gettingfocus"-->
                  <!--style="width: 100%"-->
                  <!--@change="handleItemChange"-->
                  <!--:props="optionsProps1"-->
                  <!--:options="options"-->
                  <!--v-model="dataForm.eventArealist"-->
                  <!--clearable>-->
                <!--</el-cascader>-->
              </el-form-item></el-col>
              <el-col :span="12"><el-form-item label="事发地点" prop="eventPosition" >

                  <el-button @click="dialogVisible = true" style="color:rgba(	192,192,192);position:absolute;right:3%;z-index:999;"  type="text" icon="el-icon-location-outline">定位</el-button>
                  <el-input
                  type="textarea"
                  :rows="1"
                  resize=none
                  style="width: 100%;"
                  placeholder="点击定位自动获取事发位置→"
                  v-model=dataForm.eventPosition>
                  </el-input>

              </el-form-item></el-col>
            </el-row>

            <el-row>
               <el-col :span="24">
                <el-form-item label="涉及范围" class="regionalincidents">
                    <el-cascader
                      @focus="gettingfocus"
                      placeholder="请选择区域范围"
                      style="width: 100%;"
                      @change="handleItemChange"
                      :props="optionsProps"
                      :show-all-levels="false"
                      change-on-select
                      :options="options"
                      v-model="eventAreaInvolvelist"
                      clearable>
                    </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>

              <el-col :span="6"><el-form-item label="预案" prop="planId">
                <el-select
                  v-model="dataForm.planId"
                  :disabled="ProjectedDisappointment"
                  @change="Preplanselection"
                  placeholder="请选择事件类型再选择预案"
                  style="width: 100%">
                  <el-option
                    v-for="item in reserveplanList"
                    :key="item.id"
                    :label="item.planName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>

              <el-col :span="6"><el-form-item label="预案等级"  prop="eventLevel">
                <el-select v-model="dataForm.eventLevel" :disabled="rankban" placeholder="请选择预案再选择等级" style="width: 100%">
                  <el-option
                    v-for="item in eventlevelList"
                    :key="item.id"
                    :label="item.responseName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
            </el-row>

            <el-row>

              <el-col :span="12"><el-form-item label="数据来源单位">
                <el-input v-model="dataForm.fromUnit"></el-input>
              </el-form-item>
              </el-col>
                <el-col :span="12"><el-form-item label="接受单位">
                <el-input v-model="dataForm.acceptUnit"></el-input>
              </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="事件描述">
                  <el-input
                    v-model="dataForm.eventDescription"
                    :rows="3"
                    maxlength="200"
                    show-word-limit
                    resize=none
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="发生原因">
                  <el-input
                    v-model="dataForm.eventReason"
                    :rows="3"
                    maxlength="200"
                    show-word-limit
                    resize=none
                    type="textarea">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

        </el-form>
      </el-main>
      <el-footer>
        <el-button type="primary" @click="formreset" size="small">重置</el-button>
        <el-button type="primary" @click="dataFormSubmit()" size="small">确定</el-button>
      </el-footer>
    </el-container>
    <!--地图弹窗-->
    <el-dialog title="地图" :visible.sync="dialogVisible">
      <div style="height:580px;">
        <div :style="{width:'100%',height:'500px',float: 'right'}">
          <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
          <el-amap  vid="amapDemo" :center="center" :zoom="zoom" class="amap-demo" :events="events" :plugin="plugin">
            <el-amap-marker  :position="position" :events="events"></el-amap-marker>
            <el-amap-marker v-for="{position,index} in markers" :position="position" :key="index"></el-amap-marker>
          </el-amap>
          <div class="toolbar">
            position: [{{ lng }}, {{ lat }}] address: {{ address }}
            <div style="text-align: center">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="LongitudeandLatitude()">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <div>dfhoijhfiodfijhdiojoidjfiodjioj</div>
      <el-button>test</el-button>
    </el-dialog>
    <!--地图弹窗-->

  </div>
</template>

<script>
  import { lazyAMapApiLoaderInstance} from 'vue-amap';
  import { treeDataTranslate } from '@/utils';
  import options from './region'
  import {getRules} from '@/utils/rules'
  export default {
    name: 'incidentreport',
    data() {
      let self = this;
      return {
        //表单验证
        rules:[],
        //级联选择器是否可选择即改变
        changeonselect:true,
        //预案复选框禁选
        ProjectedDisappointment:true,
        //事件等级复选框禁选
        rankban:true,
        dialogVisible: false,
        eventtypeAddOrUpdateVisible: false,

        //回复方式的数组
        replytypelist:[
          {id: 1, name: "短信"},
          {id: 2, name: "电话"},
          {id: 3, name: "公众号"},
        ],

        // 预案数据
        reserveplanList:[],

        //事件等级的模拟数据
        eventlevelList: [],

        //报送方式的数组
        reportmethodlist:[
          {id: 1,name: "短信上报"},
          {id: 2,name: "电话上报"},
          {id: 3,name: "公众号"}
        ],

        //事件类型的模拟数据
        eventtypelist: [],
        eventtypeProps: {
          children: 'children',
          label: 'name',
          value:'id'
        },
        //区域存放数组
        AreaArrayStorage:[],
        //事件行政区域
        options:[],
        //涉及区域默认值
        eventAreaInvolvelist:[],
        optionsProps: {
          checkStrictly: true,
          multiple: true,
          children: 'children',
          label: 'areaName',
          value:'areaCode'
        },
        optionsProps1: {
          children: 'children',
          label: 'areaName',
          value:'areaCode'
        },
        //高德地图
        markers: [
          [113.3245904, 23.1066805]
        ],
        searchOption: {
          city: '广州',
          citylimit: false
        },
        plugin: [{
          pName: 'Geolocation'}],
        lng: 0,
        lat: 0,
        count: 1,
        slotStyle: {
          padding: '2px 8px',
          background: '#eee',
          color: '#333',
          border: '1px solid #aaa'
        },
        zoom: 12,
        center: [113.3245904, 23.1066805],
        address: '',
        //行政编码
        AdministrativeCode:'',
        //行政区域
        Administrativedivision:'',
        loaded: false,
        //标记点的位置
        mapCenter: [113.3245904, 23.1066805],
        position: [113.3245904, 23.1066805],
        events: {
          click(e) {
            // console.log(e);
            let { lng, lat} = e.lnglat;
            self.lng = lng;
            self.lat = lat;
            self.position=[lng,lat];
            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress([lng, lat], function (status, result) {
              // console.log(result);
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  // console.log(result.regeocode)
                  //事发区域
                  self.Administrativedivision = result.regeocode.addressComponent.province + result.regeocode.addressComponent.city + result.regeocode.addressComponent.district + result.regeocode.addressComponent.township
                 //事发行政编码
                  self.AdministrativeCode =result.regeocode.addressComponent.adcode +','+ result.regeocode.addressComponent.township
                  // console.log(self.AdministrativeCode)
                  self.address = result.regeocode.formattedAddress;
                  // console.log(result.regeocode.addressComponent.adcode)
                  self.$nextTick();

                }
              }
            });
          },
        },
        /////////////////////////////////////
        dataForm: {
          //发生区域默认值
          eventArealist:'',
          //事件类型的默认值
          eventTypeId:[],
          //信息标题
          title:"",
          //报送人
          reportName:"",
          //报送单位
          reportUnit:'',
          //事发时间
          eventTime:'',
          //报送方式
          reportMethod:'',
          //报送人联系方式
          reportNameContact:'',
          //事件类型
          eventType:0,
          //事件等级
          eventLevel:'',
          //事发行政区域
          eventArea:'',
          //事发地点
          eventPosition:'',
          //发生原因
          eventReason:'',
          //事件描述
          eventDescription:'',
          //回复方式
          replyType:'',
          //接收单位
          acceptUnit:'',
          //数据来源单位
          fromUnit:'',
          //回复对象名称
          replyName:'',
          //事件涉及范围行政区划
          eventAreaInvolve:'',
          //报送日期
          reportTime:'',
          //预案
          planId:'',
          //经度
          longitude:'',
          //纬度
          latitude:'',

          // //工单负责人id
          // contactorId: '',
          // //处置部门id
          // mailGroup: '',
          // //处置部门名称
          // mailGroupName: '',
          // //参与人数组
          // participantsManList: [],
          // //抄送人数组
          // copyManList: [],
          // //负责人信息
          // chargeMan: {
          //     id: '',
          //     name: ''
          // },
        },
      }
    },
     watch: {
      eventlevelList(val) {
        if(val.length===0){

          this.dataForm.eventLevel=''
        }

      }
    },
    activated () {
      this.getDataList()
    },
    created () {
      this.rules=getRules()
    },

    methods: {
      //获取数据
      getDataList () {

        this.dataListLoading = true
        /*this.$http({
          url: this.$http.adornUrl('/event/eventinfo/selectReportMethodList'),
          method: 'get',
        }).then(({data}) => {
          ///请求的报送方式
          this.reportmethodlist = treeDataTranslate(data.reportMethodList, 'id')
          this.$http({
            url: this.$http.adornUrl('/event/eventinfo/selecTreplyType'),
            method: 'get'
          }).then(({data}) => {
            //请求的回复方式
            this.replytypelist = treeDataTranslate(data.treplyType, 'id')
          })*/

          this.$http({
            url: this.$http.adornUrl('/event/eventType/selectEventTypeList'),
            method: 'post',
            params: this.$http.adornParams({
              platformId: this.$store.state.user.platformId,
            })

          }).then(({data}) => {
            if (data && data.code === 0) {
                //请求的事件类型数据
              this.eventtypelist = data.list;
            } else {
              this.$message.error(data.msg)
            }
          
          })

          //查询事件类型
          /*this.$http({
            url: this.$http.adornUrl("/event/eventType/selectTypeList"),
            method: "post",
            params: this.$http.adornParams({
              typeFlag: 1,
              isTree: 1,
            })
          }).then(({ data }) => {
            console.log(data);
            this.eventtypelist = data;
          });*/

      },
      //级联选择器获取焦点时才给地区数组赋值
      gettingfocus(){
        // console.log(options)
        this.options=options
      },

      //事件类型决定事件等级
      handleChange(){
        this.typearray = this.dataForm.eventTypeId.slice(-1).join(",");
        this.dataForm.eventType=Number(this.typearray)
        // console.log("typeArray:::::"+this.dataForm.eventType)
        if(!this.typearray == ""){
          this.ProjectedDisappointment = false
          this.$http({
            url: this.$http.adornUrl(`/rp/plan/listByEventTypeId`),
            method: 'post',
            params: this.$http.adornParams({
              eventTypeId: this.typearray,
              state: 1
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              // console.log("预案",data)
              this.reserveplanList = treeDataTranslate(data.list, 'id')
            } else {
              this.$message.error(data.msg)
            }
            
          })
        }
      },

      //点击预案打开事件等级
      Preplanselection(){
        // console.log(this.dataForm.planId)
        this.rankban = false
        this.$http({
          url: this.$http.adornUrl(`/event/eventinfo/listByPlanId/${this.dataForm.planId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
              //  console.log("eventLevel::::::::",data)
              //请求的事件等级
              this.eventlevelList = treeDataTranslate(data.list, 'id')
            } else {
              this.$message.error(data.msg)
            }
         

        })
      },

      //地图搜索回调事件
      onSearchResult(pois) {
        // console.log("成功",pois)
        let latSum = 0;
        let lngSum = 0;
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi;
            lngSum += lng;
            latSum += lat;
            this.center=[poi.lng, poi.lat];
            this.lng= poi.lng;
            this.lat=poi.lat;
            this.address=pois[0].name;
          });
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          };
          this.position = [center.lng, center.lat];
          this.center=[center.lng, center.lat]
        }
      },

      //地图事件
      mounted() {
        loadPromise.then(() => {
          // console.log('-----')
          this.map = new AMap.Map('amap-demo1', {
            center: [121.59996, 31.197646],
            zoom: 12
          })
          AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
            const marker = new SimpleMarker({
              iconLabel: 'A',
              iconStyle: 'red',
              map: this.map,
              position: this.map.getCenter()
            });
          });
        })
      },
      //发生区域点击事件
      handleItemChange(){
        // this.dataForm.eventArea=this.dataForm.eventArealist.slice(-1).toString();
        var arr = [];
        for(let i=0;i<this.eventAreaInvolvelist.length;i++){
          arr.push(this.eventAreaInvolvelist[i].slice(-1))
        }
        this.AreaArrayStorage=arr.map(item =>item)
      },

      resetForm(dataForm) {
        this.$refs[dataForm].resetFields();
      },

      //地图提交
      LongitudeandLatitude(){
        // 给事发区域传值
        this.dataForm.eventArea=this.AdministrativeCode
        // 给事发区域的输入框显示值
        this.dataForm.eventArealist=this.Administrativedivision
          //经度赋值
          this.dataForm.longitude=this.lng
          //纬度赋值
          this.dataForm.latitude=this.lat
          this.dataForm.eventPosition=this.address
          this.dialogVisible=false
      },

      //表单重置
      formreset(){
        this.dataForm.eventTypeID=[]
        this.eventAreaInvolvelist=[]
        this.dataForm.eventArealist=[]
        this.dataForm ={}
      },

      //表单提交
      dataFormSubmit(dataForm) {
        // console.log(this.dataForm.eventArea)
        this.dataForm.eventAreaInvolve=this.AreaArrayStorage.toString()
        // console.log(this.dataForm.eventAreaInvolve)
        ///////////////////////
        this.$refs['dataForm'].validate((valid) => {
          this.$http({
            url: this.$http.adornUrl(`/event/eventinfo/save`),
            method: 'post',
            data: this.$http.adornData({
              ...this.dataForm
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (valid) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                })
                this.$emit('refreshDataList')
                this.dataForm.eventTypeID=[]
                this.eventAreaInvolvelist=[]
                this.dataForm.eventArealist=[]
                this.dataForm ={}
              }else {
                this.$message.error("必填项不能为空")
              }
            } else {
              this.$message.error(data.msg)
            }
            
          })
        })
      },
    }
  }
</script>

<style lang="scss">
  .eventinfo{
    #eventbody{
      padding:0 8.39%;
      .el-main{
        box-sizing: border-box;
        overflow:visible;
      }

      .el-row:nth-child(1) .el-col{
        width: 100%;
      }
      .el-row:nth-child(2) .el-col{
        width: 45%;
        &:last-child{
          float: right;
        }
      }
      .el-row:nth-child(3) .el-col{
        width: 45%;
        &:last-child{
          float: right;
        }
      }
      .el-row:nth-child(4) .el-col{
        width: 100%;
      }
      .el-row:nth-child(5) .el-col{
        width: 45%;
        &:last-child{
          float: right;
        }
      }
      .el-row:nth-child(6) .el-col{
        width: 45%;
        &:last-child{
          float: right;
        }
      }
      .el-row:nth-child(7) .el-col{

        width: 45%;
        &:last-child{
          float: right;
        }
      }
      .el-row:nth-child(8) .el-cascader{
        // width: 200%;
        // padding: 0 10px;
      }
      .el-row:nth-child(9) .el-col{
        width: 45%;
        &:last-child{
          float: right;
        }
      }
      .el-row:nth-child(10) .el-col{
        width: 45%;
        &:last-child{
          float: right;
        }
      }
      .el-form-item__label{
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(96,98,102,1);

      }

      .el-header,#eventbody>.el-footer{
        text-align: center;
        height: 40px;
        font-size: 18px;
        line-height: 60px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(50,50,50,1);
      }

      .el-scrollbar__view,.el-cascader-menu__list{
        list-style:none;
        line-height: 30px;
        padding: 5px;
        margin: 0;
      }
      .el-footer{
        position: relative;
        .el-button--default{
          position: absolute;
          left: 40%;
          width:88px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(211,215,219,1);
          border-radius:3px;
          font-family:MicrosoftYaHei;
          font-weight:400;
          color:rgba(163,163,163,1);
        }
        .el-button--primary{
          position: absolute;
          right: 40%;
          width:88px;
          background:linear-gradient(180deg,rgba(71,175,255,1),rgba(71,157,255,1));
          border-radius:3px;
          border-color: transparent;
          font-family:MicrosoftYaHei;
          font-weight:400;
          color:rgba(255,255,255,1);
        }

      }
    }

    .search-box {
      position: absolute;
      top: -480px;
      left: 10px;
    }
  }
  ul>li{
    list-style:none;
    padding: 0;
    margin: 0;
  }
   .el-cascader-menu{
    overflow:hidden;
  }

  .el-select-dropdown__list{
    padding: 25px 0;
  }
</style>
