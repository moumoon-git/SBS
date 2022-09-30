<template>
  <div style="min-height:500px;max-height:750px;overflow:scroll;">
    <div style="text-align: left; margin-bottom: 2%;">
      <span style="margin-right: 10px;">单位:</span>
      <el-select v-model="unit" placeholder="请选择" size="small" clearable @change="handleUnitChange">
        <el-option
          v-for="item in unitOptions"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        ></el-option>
      </el-select>
      <!-- <span style="margin: 0 10px;">事件类型:</span> -->
      <!-- <el-radio-group v-model="typeRadio" @change="handleTypeChange">
        <el-radio label="0" style="margin-right: 15px;">全部</el-radio>
        <el-radio label="1" style="margin-right: 15px;">电话</el-radio>
        <el-radio label="2" style="margin-right: 15px;">短信</el-radio>
        <el-radio label="3" style="margin-right: 10px;">传真</el-radio>
      </el-radio-group>-->
      <!-- <span style="margin-right: 10px;">|&nbsp;&nbsp;&nbsp;信息类型</span> -->
      <!-- <el-checkbox-group
        v-model="modeCheckList"
        style="display: inline-block;"
        @change="handleCheckedModeChange"
      >
        <el-checkbox label="1" style="margin-right: 10px;">接收</el-checkbox>
        <el-checkbox label="2" style="margin-right: 10px;">发送</el-checkbox>
      </el-checkbox-group>-->
      <el-checkbox-group
        v-model="typeRadio"
        style="display: inline-block;margin: 0 10px;"
        @change="handleTypeChange"
      >
        <el-checkbox :label="1" style="margin-right: 10px;">电话</el-checkbox>
        <el-checkbox :label="2" style="margin-right: 10px;">短信</el-checkbox>
        <el-checkbox :label="4" style="margin-right: 10px;">传真</el-checkbox>
      </el-checkbox-group>
      <!-- <el-divider direction="vertical"></el-divider>合并显示 -->
      <span>合并显示</span>
      <el-switch
        class="switchStyle"
        v-model="merge"
        active-color="#0091ff"
        active-text="开"
        inactive-color="#ccc"
        inactive-text="关"
        @change="changeTableData"
      ></el-switch>
      <!-- <el-button type="primary" size="small" style="padding: 9px 15px;" @click="getEventDetail">筛选</el-button> -->
      <el-button
        type="primary"
        size="small"
        style="padding: 9px 15px;margin: 0px"
        @click="exportEventDetail"
      >导出</el-button>
    </div>
    <div class="yf_my_Title" style="display: none">{{childTitle}}</div>

    <!-- 事件全景旧版 -->
    <!-- <div style="text-align: left">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    </div>-->

    <!-- <div style="text-align: left; overflow: scroll; max-height: 600px" >
      <el-checkbox-group v-model="checkedEvent" @change="handleCheckedCitiesChange">

        <el-checkbox  v-for="(item,i) in eventData" :label="item" :key="i" style="border-bottom: 1px solid #ddd;font-size: 14px; display: flex;">
          <div v-if="item.type==='fax'" style="padding-bottom: 10px">
            <div style="text-align: left;padding: 10px 0; text-indent: 20px;">
              <span>{{i==0?'事件首报':'事件续报'}}:</span>
              <span style="text-indent: 10px;font-weight: bold">{{item.time}}</span>
            </div>
            <div style="text-align: left;text-indent: 20px;">
              <span>报送单位:</span>
              <span style="text-indent: 10px;font-weight: bold">{{item.workUnit}}</span>
            </div>
            <div style="text-align: left;text-indent: 20px;">
              <span>报送渠道:</span>
              <span style="text-indent: 10px;font-weight: bold">传真</span>
            </div>
            <div style="text-align: left;padding: 10px 0;text-indent: 20px;">
              <span>报送内容:   &nbsp;</span>
              <span style="" class="report-content">{{item.remark}}</span>
            </div>
            <div v-if="item.url!==''&&item.url!=null" style="width: 175px;margin: 25px auto">
              <viewer  style="height:175px;overflow:hidden;">
                <img
                  :src="apiUrl+'/'+item.url"
                  style="height:175px;width:100%;"
                />
              </viewer>
            </div>
          </div>
          <div v-if="item.type==='phone'" style="">
            <div style="text-align: left;padding: 10px 0;text-indent: 20px;">
              <span>{{i==0?'事件首报':'事件续报'}}:</span>
              <span style="text-indent: 10px;font-weight: bold">{{item.time}}</span>
            </div>
            <div style="text-align: left;text-indent: 20px;">
              <span>报送单位:</span>
              <span style="text-indent: 10px;font-weight: bold">{{item.workUnit}}</span>
            </div>
            <div style="text-align: left;text-indent: 20px;display: flex;justify-content: space-between;">
              <div>
                <span>报送渠道:</span>
                <span style="text-indent: 10px;font-weight: bold">电话</span>
              </div>
              <div style="text-align: left;">
                <span>通话时长:</span>
                <span style="text-indent: 10px;font-weight: bold">{{formatSeconds(item.duration)}}</span>
              </div>

            </div>
            <div style="text-align: left;padding: 10px 0;text-indent: 20px;">
              <span>报送内容:</span>
              <span class="report-content">{{item.remark}}</span>
            </div>
          </div>
          <div v-if="item.type==='sms'" style="">
            <div style="text-align: left;padding: 10px 0;text-indent: 20px;">
              <span>{{i==0?'事件首报':'事件续报'}}:</span>
              <span style="text-indent: 10px;font-weight: bold">{{item.time}}</span>
            </div>
            <div style="text-align: left;text-indent: 20px;">
              <span>报送单位:</span>
              <span style="text-indent: 10px;font-weight: bold">{{item.workUnit}}</span>
            </div>
            <div style="text-align: left;text-indent: 20px;">
              <span>报送渠道:</span>
              <span style="text-indent: 10px;font-weight: bold">短信</span>
            </div>
            <div style="text-align: left;padding: 10px 0;text-indent: 20px;">
              <span>报送内容:</span>
              <span class="report-content">{{item.remark}}</span>
            </div>
          </div>
        </el-checkbox>
      </el-checkbox-group>


      <div v-for="(item,i) in eventData" :key="i" style="font-size: 14px; display: none">
        <div v-if="item.type=='fax'" style="border-bottom: 1px solid #ddd;padding-bottom: 10px">
          <div style="text-align: left;padding: 10px 0">
            <span>{{i==0?'事件首报':'事件续报'}}:</span>
            <span style="text-indent: 10px;font-weight: bold">{{item.time}}</span>
          </div>
          <div style="text-align: left;text-indent: 20px;">
            <span>报送单位:</span>
            <span style="text-indent: 10px;font-weight: bold">{{item.workUnit}}</span>
          </div>
          <div style="text-align: left;text-indent: 20px;">
            <span>报送渠道:</span>
            <span style="text-indent: 10px;font-weight: bold">传真</span>
          </div>
          <div style="text-align: left;padding: 10px 0">
            <span>报送内容:</span>
            <span class="report-content" style="font-weight: bold;text-indent: 10px;">{{item.remark}}</span>
          </div>
          <div v-if="item.url!==''&&item.url!=null" style="width: 175px;margin: 25px auto">
            <viewer  style="height:175px;overflow:hidden;">
              <img
                :src="apiUrl+'/'+item.url"
                style="height:175px;width:100%;"
              />
            </viewer>
          </div>
        </div>
        <div v-if="item.type=='phone'" style="border-bottom: 1px solid #ddd">
          <div style="text-align: left;padding: 10px 0">
            <span>{{i==0?'事件首报':'事件续报'}}:</span>
            <span style="text-indent: 10px;font-weight: bold">{{item.time}}</span>
          </div>
          <div style="text-align: left;text-indent: 20px;">
            <span>报送单位:</span>
            <span style="text-indent: 10px;font-weight: bold">{{item.workUnit}}</span>
          </div>
          <div style="text-align: left;text-indent: 20px;display: flex;justify-content: space-between;">
            <div>
              <span>报送渠道:</span>
              <span style="text-indent: 10px;font-weight: bold">电话</span>
            </div>
            <div style="text-align: left;">
              <span>通话时长:</span>
              <span style="text-indent: 10px;font-weight: bold">{{formatSeconds(item.duration)}}</span>
            </div>

          </div>
          <div style="text-align: left;padding: 10px 0">
            <span>报送内容:</span>
            <span class="report-content" style="font-weight: bold;text-indent: 10px;">{{item.remark}}</span>
          </div>
        </div>
        <div v-if="item.type=='sms'" style="border-bottom: 1px solid #ddd">
          <div style="text-align: left;padding: 10px 0">
            <span>{{i==0?'事件首报':'事件续报'}}:</span>
            <span style="text-indent: 10px;font-weight: bold">{{item.time}}</span>
          </div>
          <div style="text-align: left;text-indent: 20px;">
            <span>报送单位:</span>
            <span style="text-indent: 10px;font-weight: bold">{{item.workUnit}}</span>
          </div>
          <div style="text-align: left;text-indent: 20px;">
            <span>报送渠道:</span>
            <span style="text-indent: 10px;font-weight: bold">短信</span>
          </div>
          <div style="text-align: left;padding: 10px 0">
            <span>报送内容:</span>
            <span class="report-content" style="font-weight: bold;text-indent: 10px;">{{item.remark}}</span>
          </div>
        </div>
      </div>
    </div>-->

    <!-- 事件全景新版 -->
    <!-- <div style="display:flex;">
      <div class="date">
        日期
      </div>
      <div class="eventType">
        电话
      </div>
      <div class="eventType">
        短信
      </div>
      <div class="eventType">
        传真
      </div>
    </div>
    <div v-for="item in eventData" :key="item.id" style="display:flex;">
        <div class="date">
          {{item.time}}
        </div>
        <div class="eventType">
          <div v-if="item.time.substring(0,item.time.length-3) ==  && item.type=='phone'">{{item.time}}</div>
        </div>
        <div class="eventType">
          <div v-if="item.time.substring(0,item.time.length-3) && item.type=='sms'">{{item.time}}</div>
        </div>
        <div class="eventType">
          <div v-if="item.time.substring(0,item.time.length-3) && item.type=='fax'">{{item.time}}</div>
        </div>
    </div>-->
    <el-table
      v-if="isCheckFax || isCheckPhone || isCheckSms"
      :data="eventData"
      border
      stripe
      style="width: 100%"
      max-height="700px"
      :header-cell-style="{background:'#F0F5FF',color:'#333',fontWeight:'bold',textAlign:'center'}"
      @selection-change	="handleSelectionChange"
    > 
      <el-table-column
        type="selection"
        width="55"
        align="center"
        >
      </el-table-column>
      <el-table-column prop="time" label="日期" width="180" align="right"></el-table-column>
      <template v-if="!merge">
        <el-table-column v-if="isCheckPhone" label="电话" align="left">
          <template slot-scope="scope">
            <div v-for="item in scope.row.phone" :key="item.id">
              <!-- <div>{{item.directId == '1'?'【来电】':"【去电】"}}{{item.name}} {{item.workUnit?'('+item.workUnit+')':""}} {{item.mobile}} {{item.remark}}</div> -->
              <div>{{item.directId == '1'?'【来电】':"【去电】"}}{{item.name}} {{item.workUnit?'('+item.workUnit+')':""}} {{item.mobile}}</div>
              <div class="remark" style="display: flex;flex-wrap: wrap;" v-if="item.remark" v-html="item.remark">{{item.remark}}</div>
              <!-- <div
                v-if="item.type=='来电'"
              >{{item.type?'【'+item.type+'】':""}}{{item.name}} {{item.workUnit?'('+item.workUnit+')':""}} {{item.mobile}} {{item.remark}}</div>
              <div
                v-if="item.type=='去电'"
              >{{item.type?'【'+item.type+'】':""}}{{item.address}}{{item.workUnit?'：'+item.workUnit:""}}{{item.remark?'：'+item.remark:""}}</div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="isCheckSms" label="短信" align="left">
          <template slot-scope="scope">
            <div
              v-for="item in scope.row.sms"
              :key="item.id"
            >{{item.directId == '1'?'【接收】':"【发送】"}}{{item.workUnit}}{{item.content?'：'+item.content:""}}</div>
            <!-- <div
              v-for="item in scope.row.sms"
              :key="item.id"
            >{{item.type?'【'+item.type+'】':""}}{{item.workUnit}}{{item.remark?'：'+item.remark:""}}</div> -->
          </template>
        </el-table-column>
        <el-table-column v-if="isCheckFax" label="传真" align="left">
          <template slot-scope="scope">
            <div
              v-for="item in scope.row.fax"
              :key="item.id"
            >{{item.directId == '1'?'【接收】':"【发送】"}}{{item.workUnit}}{{item.remark?'：'+item.remark:""}}</div>
            <!-- <div
              v-for="item in scope.row.fax"
              :key="item.id"
            >{{item.type?'【'+item.type+'】':""}}{{item.workUnit}}{{item.remark?'：'+item.remark:""}}</div> -->
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column label="接报记录">
          <template slot-scope="scope">
              <!-- <template v-if="scope.row.type=='phone'">
                {{scope.row.direct=="已接"?'【来电】':scope.row.direct=="已拨"?'【去电】':""}}{{scope.row.direct=="已拨"?scope.row.address:""}}{{scope.row.direct=="已接"?scope.row.contact:""}}{{scope.row.workUnit?'：'+scope.row.workUnit:""}}{{scope.row.direct=="已接"?scope.row.mobile:""}} {{scope.row.remark?'：'+scope.row.remark:""}}
              </template> -->
              <template v-if="scope.row.type=='phone'">
                <div style="display:flex;">
                  <div>{{scope.row.direct=="已接"?'【来电】':scope.row.direct=="已拨"?'【去电】':""}}{{scope.row.direct=="已拨"?scope.row.address:""}}{{scope.row.direct=="已接"?scope.row.contact:""}}{{scope.row.workUnit?'：'+scope.row.workUnit:""}}{{scope.row.direct=="已接"?scope.row.mobile:""}}</div>
                  <div class="remark" style="display: flex;flex-wrap: wrap;" v-if="scope.row.remark" v-html="scope.row.remark">{{scope.row.remark?'：'+scope.row.remark:""}}</div>
                </div>
              </template>
              <template
                v-if="scope.row.type=='sms'"
              >{{scope.row.direct?'【'+scope.row.direct+'】':""}}{{scope.row.workUnit}}{{scope.row.remark?'：'+scope.row.remark:""}}</template>
              <template
                v-if="scope.row.type=='fax'"
              >{{scope.row.direct=="已发"?'【发出】':""}}{{scope.row.workUnit}}{{scope.row.remark?'：'+scope.row.remark:""}}</template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="NoList" v-else>暂无数据</div>
  </div>
</template>

<script>
export default {
  name: "panorama",
  props: ["childEventId", "childTitle"],
  data() {
    return {
      apiUrl: "",
      checkAll: false,
      eventData: [
        {
          time: "",
          phone: [],
          sms: [],
          fax: []
        }
      ],
      // eventData: [
      //   {
      //     time: "15:56",
      //     phone: [
      //       {
      //         id: 1,
      //         type: "来电",
      //         name: "王小虎",
      //         workUnit: "市应急局",
      //         mobile: "13682908337"
      //       },
      //       {
      //         id: 2,
      //         type: "来电",
      //         name: "王小虎",
      //         workUnit: "市应急局",
      //         mobile: "18818675466"
      //       }
      //     ],
      //     sms: [],
      //     fax: []
      //   },
      //   {
      //     time: "16:58",
      //     phone: [],
      //     sms: [],
      //     fax: [
      //       {
      //         id: 5,
      //         type: "发出",
      //         workUnit: "市委、市政府总值班室",
      //         remark:
      //           "(2019-0130期）南湖街道建筑倒塌情况快报。副局长已赶到现场布置，罗湖消防大队和局长已赶到现场布置局长已赶到现场布置局长"
      //       }
      //     ]
      //   },
      //   {
      //     time: "18:36",
      //     phone: [],
      //     sms: [
      //       {
      //         id: 21,
      //         type: "发送",
      //         workUnit: "交通保障组",
      //         remark: "现场拍图编发短信报事故情况"
      //       }
      //     ],
      //     fax: []
      //   },
      //   {
      //     time: "19:47",
      //     phone: [
      //       {
      //         id: 12,
      //         type: "去电",
      //         address: "上海市普陀区",
      //         workUnit: "普陀区消防大队街道办",
      //         remark: "15:56分，上海市普陀区金沙江路"
      //       }
      //     ],
      //     sms: [],
      //     fax: [
      //       {
      //         id: 5,
      //         type: "发送",
      //         workUnit: "事故通报组",
      //         remark: "编发短信报事故情况"
      //       }
      //     ]
      //   }
      // ], // 事件数据
      checkedEvent: [], // 选中的事件
      isIndeterminate: false, // checkbox 不确定状态
      typeRadio: [1],
      modeCheckList: ["1", "2"], // 接收发送多选
      unit: "", // 单位
      unitOptions: [], // 单位选项
      checkedIdx: [],
      tableData: [
        {
          time: "",
          phone: [],
          sms: [],
          fax: []
        }
      ],
      // tableData: [
      //   {
      //     time: "15:56",
      //     phone: [
      //       {
      //         id: 1,
      //         type: "来电",
      //         name: "王小虎",
      //         workUnit: "市应急局",
      //         mobile: "13682908337"
      //       },
      //       {
      //         id: 2,
      //         type: "来电",
      //         name: "王小虎",
      //         workUnit: "市应急局",
      //         mobile: "18818675466"
      //       }
      //     ],
      //     sms: [],
      //     fax: []
      //   },
      //   {
      //     date: "16:58",
      //     phone: [],
      //     sms: [],
      //     fax: [
      //       {
      //         id: 5,
      //         type: "发出",
      //         workUnit: "市委、市政府总值班室",
      //         remark:
      //           "(2019-0130期）南湖街道建筑倒塌情况快报。副局长已赶到现场布置，罗湖消防大队和局长已赶到现场布置局长已赶到现场布置局长"
      //       }
      //     ]
      //   },
      //   {
      //     time: "18:36",
      //     phone: [],
      //     sms: [
      //       {
      //         id: 21,
      //         type: "发送",
      //         workUnit: "交通保障组",
      //         remark: "现场拍图编发短信报事故情况"
      //       }
      //     ],
      //     fax: []
      //   },
      //   {
      //     time: "19:47",
      //     phone: [
      //       {
      //         id: 12,
      //         type: "去电",
      //         address: "上海市普陀区",
      //         workUnit: "普陀区消防大队街道办",
      //         remark: "15:56分，上海市普陀区金沙江路"
      //       }
      //     ],
      //     sms: [],
      //     fax: [
      //       {
      //         id: 5,
      //         type: "发送",
      //         workUnit: "事故通报组",
      //         remark: "编发短信报事故情况"
      //       }
      //     ]
      //   }
      // ],
      merge: false, // 合并显示开关
      multipleSelection: [], // 多选的ID
      isCheckPhone: true,
      isCheckSms: true,
      isCheckFax: true,
      remark: '<p style="float:left">左边</p><p style="float:right">右边</p><p style="float:left">左边</p><p style="float:right">右边</p>' + '<div style="clear:both;"></div>'
    };
  },
  watch: {
    typeRadio: {
      handler: function(newVal, oldVal) {
        if (newVal.indexOf(1) > -1) {
          this.isCheckPhone = true
          console.log("电话勾上")
        } else {
          this.isCheckPhone = false
          console.log("电话关掉")
        }
        if (newVal.indexOf(2) > -1) {
          this.isCheckSms = true
          console.log("短信勾上")
        } else {
          this.isCheckSms = false
          console.log("短信关掉")
        }
        if (newVal.indexOf(4) > -1) {
          this.isCheckFax = true
          console.log("传真勾上")
        } else {
          this.isCheckFax = false
          console.log("传真关掉")
        }
      }
    }
  },
  created() {
    this.apiUrl = window.g.ApiUrl;
  },
  mounted() {
    this.getInitData()
  },
  methods: {
    getInitData() {
      this.$nextTick(() => {
        let unitList = [];
        let multiType = 0
        this.typeRadio.map(v=>{
          multiType += v
        })
        // alert(multiType)
        let data = {
          eventId: this.childEventId,
          cType: multiType==0?7:multiType,
          // iType: this.modeCheckList,
          unit: this.unit,
          mergeShow: this.merge?0:1
        };
        this.$szApi.eventDetail(data).then(res => {
          console.log(res);
          if (res.errorcode == 0) {
            this.eventData = res.data;
            let workunits = [];
            for (let item of this.eventData) {
              if (item.sms) {
                for (let i of item.sms) {
                    workunits.push(i.workUnit);
                }
              }
              if (item.phone) {
                for (let i of item.phone) {
                    workunits.push(i.workUnit);
                }
              }
              if (item.fax) {
                for (let i of item.fax) {
                    workunits.push(i.workUnit);
                }
              }
              
            }
            console.log('hhh', this.eventData)
            console.log('工作单位：', workunits)
            let workUnits = [...new Set(workunits)];
            console.log(workUnits);

            for (let i = 0; i < workUnits.length; i++) {
              if (!!workUnits[i]) {
                let obj = {};
                obj.label = workUnits[i];
                obj.value = i;
                unitList.push(obj);
              }
            }
            if (this.unitOptions.length==0) {
              this.unitOptions = unitList;
            }
            console.log(this.unitOptions);
          } else {
            this.$message.error("数据错误!");
          }
        });
      });
    },
    formatSeconds(endTime) {
      let secondTime = parseInt(endTime); //将传入的秒的值转化为Number
      let min = 0; // 初始化分
      let h = 0; // 初始化小时
      let result = "";
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60); //获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60); //获取秒数，秒数取佘，得到整数秒数
        if (min > 60) {
          //如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60); //获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60); //获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}:${secondTime.toString().padStart(2, "0")}`;
      return result;
    },

    handleCheckAllChange(val) {
      this.checkedEvent = val ? this.eventData : [];
      let idxList = [];
      for (let item of this.checkedEvent) {
        let idx = this.eventData.indexOf(item);
        // console.log(idx)
        idxList.push(idx);
      }
      this.checkedIdx = [...new Set(idxList)];
      this.isIndeterminate = false;
    },

    handleCheckedCitiesChange(value) {
      // console.log(value)
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.eventData.length;
      // console.log(this.checkAll)
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.eventData.length;
      let idxList = [];
      for (let item of value) {
        let idx = this.eventData.indexOf(item);
        // console.log(idx)
        idxList.push(idx);
      }
      this.checkedIdx = [...new Set(idxList)];
      console.log(this.checkedIdx);
    },

    handleCheckedModeChange(value) {
      // 接收 or 发送
      // console.log(value)
      console.log(this.modeCheckList);
      // this.getEventDetail()
    },

    handleTypeChange() {
      // 报道渠道类型改变
      console.log('勾选项：', this.typeRadio);
      this.getEventDetail()
    },

    handleUnitChange() {
      // console.log(this.unit);
      this.getEventDetail()
    },

    // 获取筛选数据
    getEventDetail() {
      console.log("之前的事件列表")
      console.log(this.checkedEvent);

      this.checkedEvent = []; // 重置事件列表
      if(this.checkedEvent.length == 0){
      console.log("重置事件列表完毕，数组长度为0了")
      console.log(this.checkAll);

      let multiType = 0
      this.typeRadio.map(v=>{
        multiType += v
      })
      let data = {
        eventId: this.childEventId,
        cType: multiType==0?7:multiType,
        // iType: this.modeCheckList,
        unit: this.unit,
        mergeShow: this.merge?0:1
      };
      // console.log(data)
      this.$szApi.eventDetail(data).then(res => {
        // console.log(res)
        if (res.errorcode === 0) {
          this.eventData = res.data;
          console.log('this.eventData: ', this.eventData);
          let workunits = [];
          let unitList = [];
            for (let item of this.eventData) {
              console.log('this.eventData: ', this.eventData);
              if (item.sms) {
                for (let i of item.sms) {
                    workunits.push(i.workUnit);
                    console.log('workunits: ', workunits);
                }
              }
              if (item.phone) {
                for (let i of item.phone) {
                    workunits.push(i.workUnit);
                }
              }
              if (item.fax) {
                for (let i of item.fax) {
                    workunits.push(i.workUnit);
                }
              }
              
            }
            console.log('hhh', this.eventData)
            console.log('工作单位：', workunits)
            let workUnits = [...new Set(workunits)];
            console.log(workUnits);

            for (let i = 0; i < workUnits.length; i++) {
              if (!!workUnits[i]) {
                let obj = {};
                obj.label = workUnits[i];
                obj.value = i;
                unitList.push(obj);
              }
            }
            if (this.unitOptions.length==0) {
              this.unitOptions = unitList;
            }
            
            console.log(this.unitOptions);
        } else {
          this.$message.error("数据请求错误!");
        }
      });
      this.checkAll = false;
      }
    },

    // 导出
    exportEventDetail() {
      if (this.multipleSelection.length > 0) {
        let multiType = 0
        this.typeRadio.map(v=>{
          multiType += v
        })
        let eventId = this.childEventId;
        // let data = this.multipleSelection;
        let data = this.multipleSelection.join(',');
        let cType = multiType>0?multiType:7;
        // let iType = this.modeCheckList;
        let unit = this.unit;
        let merge = this.merge?0:1
        // console.log(eventId, data, cType, iType, unit)
        console.log('勾选项', this.multipleSelection, data)
        let eleLink = document.createElement("a");
        eleLink.style.display = "none";
        // window.href = this.g.ApiUrl + '/eos/register/exportEventDetail?=' +
        // eleLink.href =
        //   window.g.ApiUrl +
        //   `/eos/register/exportEventDetail?eventId=${eventId}&data=[${data}]&cType=${cType}&unit=${unit}&merge=${merge}`;
        eleLink.href =
          window.g.ApiUrl +
          `/eos/register/exportEventDetail?eventId=${eventId}&data=${data}&cType=${cType}&unit=${unit}`;
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      } else {
        this.$message.warning("请勾选列表");
      }
    },
    changeTableData(type) {

      this.getEventDetail();
      console.log('this.multipleSelection: ', this.multipleSelection);
      // if (type) {
      //   this.getEventDetail();
      // } else {
      //   this.getEventDetail();
        // this.eventData = this.tableData;
      // }
    },
    handleSelectionChange(val){
      this.multipleSelection = []
      console.log('勾选列表：', val)
      if (this.merge) { // 合并
        val.forEach((item) => {
          this.multipleSelection.push(item.serialNumber)
        })
      } else { // 未合并
        val.forEach((item, index) => {
          // 要根据后端返回的fax->phone->sms的顺序来拼接
          if (item.fax && item.fax.length > 0) {
            item.fax.forEach(el => {
              this.multipleSelection.push(el.serialNumber)
            })
          }
          if (item.phone && item.phone.length > 0) {
            item.phone.forEach(el => {
              this.multipleSelection.push(el.serialNumber)
            })
          }
          if (item.sms && item.sms.length > 0) {
            item.sms.forEach(el => {
              this.multipleSelection.push(el.serialNumber)
            })
          }
        })
      }
      // this.multipleSelection = val.map(v=> {return v.id});
    }
  }
};
</script>

<style scoped lang="scss">
.yf_my_Title:first-child {
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}
/deep/ .el-table__header-wrapper {
  background-color: khaki;
}
/* 偶数列背景色 */
/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f0f6ff;
}
// 分隔线
/deep/ .el-divider--vertical {
  height: 1.5em;
}
// 合并显示开关样式
/deep/ .switchStyle {
  margin: 0 10px;
}
/deep/ .switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/deep/ .switchStyle .el-switch__label--left {
  z-index: 9;
  left: 28px;
}
/deep/ .switchStyle .el-switch__label--right {
  z-index: 9;
  left: 0;
}
/deep/ .switchStyle .el-switch__label.is-active {
  display: block;
}
/deep/ .switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
/deep/ .switchStyle.el-switch .el-switch__core {
  width: 53px !important;
  height: 24px;
  border-radius: 18px;
}
/deep/ .switchStyle.el-switch .el-switch__core::after {
  width: 20px;
  height: 20px;
}
/deep/ .switchStyle.is-checked .el-switch__core::after {
  margin-left: -21px;
}
.NoList{
    background-image: url(/static/img/nullList.png);
    background-repeat: no-repeat;
    background-position: center;
    background-color: white;
    text-align: center;
    line-height: 420px;
    font-size: 12px;
    font-weight: bold;
    color: #cad5e8;
    height: 300px;
}
/deep/ .remark>p {
  margin:0 !important;
  padding:0 !important;
}
/* 旧版样式 */
/* /deep/ .el-checkbox__input {
    height: 100%;
    margin-top: 2%;
  }
  /deep/ .el-select ,el-select--small {
    width: 160px;
  }

  .report-content {
    font-weight: bold;
    text-indent: 10px;
    white-space: normal;
  } */
</style>
