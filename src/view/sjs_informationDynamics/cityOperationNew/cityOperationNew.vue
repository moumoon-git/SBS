<template>
  <div class="cityOperationNewWrap" v-show="wrapFlag">
    <!-- 导航栏 -->
    <div class="cityOperation_tab">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="城市运行管理"
          name="General"
          v-if="tabAdmin.General"
        >
          <cityDev
            ref="cityDev"
            :cityListDatas="cityListData"
            @outOffinif="cityOutOffinif"
            @cityMonthVal="cityMonthVal"
            @newEduce="newEduce"
          ></cityDev>
        </el-tab-pane>
        <el-tab-pane
          label="空气质量"
          name="airQuality"
          v-if="tabAdmin.airQuality"
        >
          <skyTemplat
            ref="skyTemplat"
            :litsData="qualityData"
            @outOffinfo="outOffinfo"
            @SkyTemplateMonthVal="SkyTemplateMonthVal"
            @newEduce="newEduce"
          ></skyTemplat>
        </el-tab-pane>
        <el-tab-pane label="天气情况" name="weather" v-if="tabAdmin.weather">
          <skyTemplat2
            :litsData="weatherData"
            @outOffinfo="weatherOutOffinfo"
            ref="skyTemplat2"
            @SkyTemplateMonthVal="SkyTemplateMonthVal"
            @newEduce="newEduce"
          ></skyTemplat2>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 页脚 -->
    <div class="foolter">
      <div class="paging">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="limt"
          layout="prev, pager, next, jumper"
          :page-count="pageCount"
        ></el-pagination>
      </div>
      
      <!-- 任务296 城市运行已经迁到ebs qinjiaqi 20210329 -->
      <!--<div class="btnWrap">
        <el-button type="primary" @click="issue">下发填报任务</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>-->
    </div>

    <div>
      <popout
        ref="popout"
        @focus="focusLxr"
        @educe="educeRequery"
        @setMould="setMould"
      ></popout>
    </div>

    <selectMansDialog
      ref="selectMansDialog"
      selectTitle="选择联系人"
      :selectData="outerVisible"
      @close="outerVisible = false"
      @closeDialog="outerVisible = false"
      @addMans="change"
    ></selectMansDialog>
  </div>
</template>

<script>
import selectMansDialog from "@/view/eventManagement/eventReports/dialog/selectMansDialog";
import cityDev from "./template/cityDev";
import skyTemplat from "./template/skyTemplat";
import skyTemplat2 from "./template/skyTemplat";
import popout from "./template/popout";

export default {
  name: "cityOperationNew",
  data() {
    return {
      // 根据用户权限判断是否显示
      wrapFlag: false,
      outerVisible: false,
      activeName: "General",
      currentPage: 1,
      totalElements: 0,
      pageCount: 0,
      limt: 10,
      cityListData: [],
      qualityData: [],
      weatherData: [],
      dateStr: "",
      issueFlag: false,
      selectIndex: 0,
      tabAdmin: {
        General: false,
        airQuality: false,
        weather: false,
      },
    };
  },
  components: {
    cityDev,
    skyTemplat,
    skyTemplat2,
    popout,
    selectMansDialog,
  },
  methods: {
    // 空气质量和天气情况月份选择
    SkyTemplateMonthVal(data) {
      this.dateStr = data;
      if (this.activeName === "airQuality") {
        this.limt = 5;
        this.requeryListQuality();
      } else if (this.activeName === "weather") {
        this.limt = 5;
        this.requeryListWeather();
      }
    },
    // 获取单前点击菜单
    getMenuId(getIDname, allData) {
      let promise = new Promise((reslove, reject) => {
        function getMenu(getIDname, allData) {
          if (allData.length != 0) {
            allData.forEach((ele) => {
              if (ele.name == getIDname) {
                return reslove(ele);
              } else if (ele.child && ele.child.length != 0) {
                return getMenu(getIDname, ele.child);
              }
            });
          }
        }
        getMenu(getIDname, allData);
      });
      return promise;
    },
    // 初始化
    loading() {
      let date = new Date();
      let str =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1);
      this.dateStr = str;
      this.currentPage = 1;
    },
    /*
     *@Description: 保存模板
     *@MethodAuthor:  XRY
     *@param: {}
     *@Date: 2021-01-07 16:53:30
     */
    setMould(params) {
      this.$refs.popout.popoutFlag = false;
      let data = {};
      data.data = params;
      let jsonData = JSON.parse(JSON.stringify(data));
      this.$api.setMould(jsonData).then((res) => {
        if (res.errorcode == 0) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /*
     *@Description: 新的导出方式
     *@MethodAuthor:  XRY
     *@date 勾选中的时间数组
     *@Date: 2021-01-07 17:02:48
     */
    newEduce(date) {
      if(date.length == 0) {
        this.$message({
          message: '请选择导出日期',
          type: "warning",
        });
        return ;
      }
      let dateList = date;
      const that = this;
      this.$api.getMould().then((res) => {
        if (res.errorcode == 0) {
          dateList.forEach((ele) => {
            let exportData = {};
            exportData = JSON.parse(JSON.stringify(res.data));
            if (exportData.id) {
              delete exportData.id;
            }
            exportData.date = ele;
            that.educeRequery(exportData);
          });
        }
      });
    },
    // 导出报告
    educeRequery(parmas) {
      console.log(parmas);
      const that = this;
      this.$api.outputWord(parmas).then((res) => {
        if (res.errorcode == 0) {
          this.$message({
            message: res.msg,
            type: "warning",
          });
          return;
        } else {
          // 进行流的下载
          // this.$refs.popout.popoutFlag = false;
          let str = "";
          for (const key in parmas) {
            str += key + "=" + parmas[key] + "&";
          }
          str = str.substring(0, str.length - 1);
          var xhr = new XMLHttpRequest();
          xhr.open(
            "GET",
            window.g.ApiUrl + "/eos/appCity/outputWord?" + str,
            true
          ); // 也可以使用POST方式，根据接口
          xhr.withCredentials = true;
          // xhr.setRequestHeader('Access-Control-Allow-Origin', "*")
          xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
          xhr.responseType = "blob"; // 返回类型blob
          // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
          xhr.onload = function () {
            // 请求完成
            if (this.status === 200) {
              // 返回200
              var blob = this.response;
              var reader = new FileReader();
              reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
              reader.onload = function (e) {
                // 转换完成，创建一个a标签用于下载
                var a = document.createElement("a");
                a.download = parmas.date + "城市运行综合情况.docx";
                a.setAttribute("target", "_blank");
                a.setAttribute("target", "_self");
                a.href = e.target.result;
                document.body.append(a); // 修复firefox中无法触发click
                console.log(a);
                a.click();
                // document.body.remove(a);
              };
            }
          };
          // 发送ajax请求
          xhr.send();
        }
      });

      // this.$api.outputWord(params).then(data =>{
      //     console.log(data)
      //     const blob = new Blob([data],{ type: 'application/*' });
      //     console.log(blob)
      //     const fileName = `${new Date()
      //         .toLocaleDateString()
      //         .replace(/\\/g, '-')}.docx`
      //     if ('download' in document.createElement('a')) {
      //         const elink = document.createElement('a')
      //         elink.download = fileName
      //         elink.style.display = 'none'
      //         elink.href = window.URL.createObjectURL(blob)
      //         document.body.appendChild(elink)
      //         elink.click()
      //         URL.revokeObjectURL(elink.href) // 释放URL对象
      //         document.body.removeChild(elink)
      //     } else {
      //         // IE10+下载
      //         navigator.msSaveBlob(blob, fileName)
      //     }
      // })
    },
    // 下发短信
    issue() {
      this.issueFlag = true;
      this.outerVisible = true;
    },
    // 聚焦
    focusLxr(index) {
      this.selectIndex = index;
      this.outerVisible = true;
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 分页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.activeName === "weather") {
        this.limt = 5;
        this.requeryListWeather();
      } else if (this.activeName === "airQuality") {
        this.limt = 5;
        this.requeryListQuality();
      } else {
        this.limt = 10;
        this.requeryListWaters();
      }
    },
    // 选择联系人
    change(checkboxGroup, mansList) {
      console.log(checkboxGroup, mansList);
      if (this.issueFlag) {
        // 下发短信
        this.issueFlag = false;
        this.appReportH5Sms(checkboxGroup);
      } else {
        if (this.selectIndex == 0) {
          this.$refs.popout.options = JSON.parse(JSON.stringify(mansList));
          this.$refs.popout.selectValue = JSON.parse(
            JSON.stringify(checkboxGroup)
          );
        } else if (this.selectIndex == 1) {
          this.$refs.popout.options1 = JSON.parse(JSON.stringify(mansList));
          this.$refs.popout.selectValue1 = JSON.parse(
            JSON.stringify(checkboxGroup)
          );
        } else if (this.selectIndex == 2) {
          this.$refs.popout.options2 = JSON.parse(JSON.stringify(mansList));
          this.$refs.popout.selectValue2 = JSON.parse(
            JSON.stringify(checkboxGroup)
          );
        }
      }
      this.outerVisible = false;
      this.$refs.selectMansDialog.getChechbox();
      this.$refs.selectMansDialog.checkboxGroup = [];
      this.$refs.selectMansDialog.checkboxData = [];
      this.$refs.selectMansDialog.mansList = [];
    },
    // 下发短信请求
    appReportH5Sms(data) {
      let type = this.activeName;
      let parmas = {
        contactorIds: data,
        type,
      };
      this.$api.appCityReportH5Sms(parmas).then((res) => {
        console.log(res.data);
        if (res.errorcode !== 0) {
          return;
        }
      });
    },
    // 城市运行导出报表
    cityOutOffinif() {
      console.log("城市运行导出报表");
      this.$refs.popout.popoutFlag = true;
      this.$refs.popout.getMouldData();
      // this.$refs.popout.loading()
    },
    cityMonthVal(data) {
      this.dateStr = data;
      console.log("cityMonthVal", data);
      this.requeryListWaters();
    },
    // 空气质量
    outOffinfo() {
      console.log("空气质量");
      this.$refs.popout.popoutFlag = true;
      // this.$refs.popout.loading()
    },
    weatherOutOffinfo() {
      console.log("天气质量");
      this.$refs.popout.popoutFlag = true;
      // this.$refs.popout.loading()
    },
    // 城市
    requeryListWaters() {
      let parmas = {
        page: this.currentPage,
        size: this.limt,
        date: this.dateStr,
      };
      this.$api.listWaters(parmas).then((res) => {
        console.log("this.$api.listWaters res", res);
        if (res.errorcode !== 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        let data = res.data.data;
        let year = new Date(data[0].date ? data[0].date : "").getFullYear(); //  lastEditor:xuchuagxing lastUpdateTime:2021/2/1 修复禅道 10410 修改判断区分为 获取第一条数据的年份
        console.log(year)
        let max = new Date(year + "-11-14").getTime();
        let min = new Date((year) + "-03-16").getTime();
        data.forEach((ele) => {
          let nowDate = new Date(ele.appCityEnergyStatuses[1].date).getTime();
          if (!ele.appCityEnergyStatuses[1].description) {
            //  lastEditor:xuchuagxing lastUpdateTime:2021/2/1 修复禅道 10410 修改判断区分为 第一条数据的年份-03-14<数据的日期<第一条数据的年份-11-16 => 今年3-16 —— 11-14期间为非供暖期
            if (nowDate >= min && nowDate <= max) {
              ele.appCityEnergyStatuses[1].description = "非供暖季";
            } else {
              ele.appCityEnergyStatuses[1].description = "供暖季";
            }
          }
        });
        this.cityListData = data;
        console.log("this.cityListData: ", this.cityListData);
        // this.totalElements = res.data.totalElements;
        this.pageCount = res.data.totalPages;

        // bug11227 勾选后不影响分页后数据样式，且保留该页面的勾选 author：husiyue date：2021.04.07
        let isCheckFlag = [] // 存储已被勾选过&&已判断过数据，避免二次判断覆盖样式
        // 当前页数据
        this.cityListData.forEach((ele, index) => {
          setTimeout(() => {
            // 循环勾选数组数据与当前页数据比较，如果相同，添加勾选样式，否则取消勾选样式
            this.$refs.cityDev.$data.checkDateList.forEach((checkItem, index2) => {
              if(ele.date == checkItem) {
                // 勾选样式
                this.$refs.cityDev.$refs.isCheck[index].innerText = "✓";
                this.$refs.cityDev.$refs.isCheck[index].style.color = "green";
                isCheckFlag.push(ele.date)
              }else{
                // console.log(isCheckFlag,ele.date,isCheckFlag.indexOf(ele.date))
                // 如该数据已做过判断，则不重复判断
                if(isCheckFlag.indexOf(ele.date) != -1) {
                  console.log(ele.date + "已判断过在选中列表中，不再判断")
                }else{
                  // 取消勾选样式
                  this.$refs.cityDev.$refs.isCheck[index].innerText = ".";
                  this.$refs.cityDev.$refs.isCheck[index].style.color = "#fff";
                }
              }
            })
          }, 50)
        })
      });
    },
    //空气
    requeryListQuality() {
      let parmas = {
        date: this.dateStr,
        page: this.currentPage,
        size: this.limt,
      };
      console.log(parmas);
      this.$api.listQuality(parmas).then((res) => {
        this.qualityData = res.data.data;
        // this.totalElements = res.data.totalElements;
        this.pageCount = res.data.totalPages;
        if (res.errorcode !== 0) {
          return;
        }

        // bug11227 勾选后不影响分页后数据样式，且保留该页面的勾选 author：husiyue date：2021.04.07
        let isCheckFlag = [] // 存储已被勾选过&&已判断过数据，避免二次判断覆盖样式
        // 当前页数据
        this.qualityData.forEach((ele, index) => {
          setTimeout(() => {
            // 循环勾选数组数据与当前页数据比较，如果相同，添加勾选样式，否则取消勾选样式
            this.$refs.skyTemplat.$data.checkDateList.forEach((checkItem, index2) => {
              if(ele.date == checkItem) {
                // 勾选样式
                this.$refs.skyTemplat.$refs.isCheck[index].innerText = "✓";
                this.$refs.skyTemplat.$refs.isCheck[index].style.color = "green";
                isCheckFlag.push(ele.date)
              }else{
                // console.log(isCheckFlag,ele.date,isCheckFlag.indexOf(ele.date))
                // 如该数据已做过判断，则不重复判断
                if(isCheckFlag.indexOf(ele.date) != -1) {
                  console.log(ele.date + "已判断过在选中列表中，不再判断")
                }else{
                  // 取消勾选样式
                  this.$refs.skyTemplat.$refs.isCheck[index].innerText = ".";
                  this.$refs.skyTemplat.$refs.isCheck[index].style.color = "#fff";
                }
              }
            })
          }, 50)
        })
      });
    },
    // 空气保存接口
    listQualitysaveOrUpdates(data) {
      data.forEach((ele) => {
        this.$api.listQualitysaveOrUpdate({ data: ele }).then((res) => {
          this.infoTs(res);
        });
      });
    },
    //天气
    requeryListWeather() {
      let parmas = {
        date: this.dateStr,
        page: this.currentPage,
        size: this.limt,
      };
      this.$refs.skyTemplat2.titleName = "天气情况";
      this.$api.listWeather(parmas).then((res) => {
        this.weatherData = res.data.data;
        // this.totalElements = res.data.totalElements;
        this.pageCount = res.data.totalPages;
        if (res.errorcode !== 0) {
          return;
        }

        // bug11227 勾选后不影响分页后数据样式，且保留该页面的勾选 author：husiyue date：2021.04.07
        let isCheckFlag = [] // 存储已被勾选过&&已判断过数据，避免二次判断覆盖样式
        // 当前页数据
        this.weatherData.forEach((ele, index) => {
          setTimeout(() => {
            // 循环勾选数组数据与当前页数据比较，如果相同，添加勾选样式，否则取消勾选样式
            this.$refs.skyTemplat2.$data.checkDateList.forEach((checkItem, index2) => {
              if(ele.date == checkItem) {
                // 勾选样式
                this.$refs.skyTemplat2.$refs.isCheck[index].innerText = "✓";
                this.$refs.skyTemplat2.$refs.isCheck[index].style.color = "green";
                isCheckFlag.push(ele.date)
              }else{
                // console.log(isCheckFlag,ele.date,isCheckFlag.indexOf(ele.date))
                // 如该数据已做过判断，则不重复判断
                if(isCheckFlag.indexOf(ele.date) != -1) {
                  console.log(ele.date + "已判断过在选中列表中，不再判断")
                }else{
                  // 取消勾选样式
                  this.$refs.skyTemplat2.$refs.isCheck[index].innerText = ".";
                  this.$refs.skyTemplat2.$refs.isCheck[index].style.color = "#fff";
                }
              }
            })
          }, 50)
        })
      });
    },
    // 天气
    saveOrUpdateweathers(data) {
      data.forEach((ele) => {
        this.$api.saveOrUpdateweather({ data: ele }).then((res) => {
          this.infoTs(res);
        });
      });
    },
    // 城市
    savewaterOrUpdates(data) {
      this.$api.savewaterOrUpdate({ data }).then((res) => {
        this.infoTs(res);
        this.requeryListWaters();
      });
    },
    infoTs(res) {
      if (res.errorcode != 0) {
        this.$message.error(res.msg);
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success",
      });
    },
    // 保存
    saveData() {
      // 城市运行保存
      if (this.activeName == "General") {
        this.savewaterOrUpdates(this.$refs.cityDev.cityListDatas);
      } else if (this.activeName == "airQuality") {
        // 空气质量
        this.listQualitysaveOrUpdates(this.$refs.skyTemplat.changeData);
      } else {
        this.saveOrUpdateweathers(this.$refs.skyTemplat2.changeData);
      }
    },
    // 进行数据赋值操作
    valuation(valuationVal, val) {
      if (val) {
        valuationVal = val;
      } else {
        val = valuationVal;
      }
    },
  },
  mounted() {
    console.log(this.$store.state.navTree, this.$store.state.defaultactive);
    this.getMenuId(this.$store.state.defaultactive, this.$store.state.navTree)
      .then((res) => {
        if (res.btnArray && res.btnArray.length != 0) {
          const that = this;
          // res.child =[{name:'airQuality'},{name:'weather'}]
          res.btnArray.forEach((ele) => {
            for (const key in that.tabAdmin) {
              if (ele.name == key) {
                that.tabAdmin[key] = true;
              }
            }
          });
          this.activeName = res.btnArray[0].name;
          this.wrapFlag = true;
          this.loading();
          document.getElementsByClassName(
            "cityOperationNewWrap"
          )[0].parentNode.style.height = "100%";
          document.getElementsByClassName(
            "el-pagination__jump"
          )[0].firstChild.nodeValue = "跳至";
          this.requeryListWaters();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  watch: {
    activeName(newVal, oldVal) {
      // this.loading()
      if (newVal === "weather") {
        this.valuation(this.dateStr, this.$refs.skyTemplat2.monthValStr);
        this.$refs.skyTemplat2.monthVal = new Date(this.dateStr);
        this.limt = 5;
        this.requeryListWeather();
      } else if (newVal === "airQuality") {
        this.valuation(this.dateStr, this.$refs.skyTemplat.monthValStr);
        this.$refs.skyTemplat.monthVal = new Date(this.dateStr);
        this.limt = 5;
        this.requeryListQuality();
      } else {
        this.valuation(this.dateStr, this.$refs.cityDev.monthValStr);
        this.$refs.cityDev.monthVal = new Date(this.dateStr);
        this.limt = 10;
        this.requeryListWaters();
      }
    },
  },
};
</script>

<style scoped>
.cityOperationNewWrap {
  height: calc(100% - 10px);
  display: flex;
  flex-direction: column;
}
.foolter {
  flex: 1;
  background: #fff;
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 10px;
  width: calc(100% - 20px);
  border-radius: 0 0 3px 3px;
}
.cityOperation_tab {
  height: 80%;
}
/* 修改tab样式 */
.cityOperation_tab /deep/ .el-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.cityOperationNewWrap /deep/ .el-tabs__header {
  background: #fff;
  padding-left: 16px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.cityOperationNewWrap /deep/ .el-tabs__item {
  font-size: 17px;
  color: #666666;
}
.cityOperationNewWrap /deep/ .el-tabs__item.is-active {
  color: #323232;
  font-weight: 600;
}
.cityOperationNewWrap /deep/ .el-tabs__nav-wrap::after {
  display: none;
}
.cityOperation_tab /deep/ .el-tabs__content {
  flex: 1;
  background: #fff;
  margin: 0 10px;
  width: calc(100% - 20px);
  border-radius: 3px 3px 0 0;
}
.cityOperation_tab /deep/ .el-tab-pane {
  width: 100%;
  height: 100%;
}
/* 分页 */
.foolter /deep/ .el-pager li,
.foolter /deep/ .btn-next,
.foolter /deep/ .btn-prev {
  background: #fff;
  border: 1px solid rgba(221, 222, 225, 1);
  font-size: 12px;
  border-radius: 3px;
  font-weight: 400;
  padding: 0px;
  line-height: 4px;
  width: 42px;
  height: 42px;
  line-height: 42px;
  text-align: center;
}
.foolter /deep/ .el-pagination__jump {
  margin-left: 9px;
}
.foolter /deep/ .el-pagination__editor.el-input {
  width: 42px;
  height: 42px;
  padding: 0;
  margin: 0 8px;
}
.foolter /deep/ .el-pager .more::before {
  line-height: 2px;
}
.foolter /deep/ .el-pagination__editor.el-input .el-input__inner {
  width: 42px;
  height: 42px;
  padding: 0;
}
.paging {
  padding-right: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
}
.foolter /deep/ .el-button + .el-button {
  margin-left: 15px;
}
</style>

