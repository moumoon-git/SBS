<template>
  <div class="cityDev_wrap">
    <!-- 头部 -->
    <div class="cityDev_header">
      <h3>城市水电气热运营情况</h3>
      <div>
        <el-date-picker
          v-model="monthVal"
          @change="monthValchange"
          type="month"
          placeholder="月份范围"
        >
        </el-date-picker>
        <el-button type="primary" @click="outOffinif">模板管理</el-button>
        <el-button type="primary" @click="exportDoc">导出</el-button>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="cityDev_contetnt">
      <table
        border="0"
        :height="tableHeight"
        cellspacing="0"
        class="cityDev_table"
      >
        <!-- colspan="2" rowspan="2" -->
        <thead class="cityDev_thead">
          <tr>
            <!-- 复选 -->
            <td rowspan="3"><div style="width:40px"></div></td>
            <!--  -->
            <td rowspan="3"><div style="width:80px">日期</div></td>
            <td
              style="width:208px;color:rgba(0,145,255,1);"
              colspan="4"
              rowspan="2"
            >
              供水
            </td>
            <td
              style="width:206px;color:rgba(250,227,74,1);"
              colspan="4"
              rowspan="2"
            >
              排水
            </td>
            <td
              style="width:169px;color:rgba(255,119,119,1);"
              colspan="2"
              rowspan="2"
            >
              燃气运行情况
            </td>
            <td
              style="width:169px;color:rgba(255,187,85,1);"
              colspan="2"
              rowspan="2"
            >
              供暖情况
            </td>
            <td
              style="width:145px;color:rgba(11,210,149,1);"
              colspan="2"
              rowspan="2"
            >
              电力
            </td>
            <td
              style="width:109px;color:rgba(123,132,255,1);"
              colspan="2"
              rowspan="2"
            >
              生活垃圾清转运
            </td>
            <td style="width:619px;color:rgba(50,197,255,1);" colspan="10">
              供水渣土运输规范管理
            </td>
          </tr>
          <tr>
            <td colspan="6">联合管理执法情况</td>
            <td colspan="4">本月累计</td>
          </tr>
          <tr>
            <td>
              <div style="width:95px">计划量(万立方米)</div>
            </td>
            <td>
              <div style="width:95px">实际量(万立方米)</div>
            </td>
            <td>
              <div style="width:35px">能力</div>
            </td>
            <td>
              <div style="width:49px">状态</div>
            </td>
            <td>
              <div style="width:95px">计划量(万立方米)</div>
            </td>
            <td>
              <div style="width:95px">实际量(万立方米)</div>
            </td>
            <td>
              <div style="width:35px">能力</div>
            </td>
            <td>
              <div style="width:49px">状态</div>
            </td>
            <td>
              <div style="width:49px">状态</div>
            </td>
            <td>
              <div style="width:120px">描述</div>
            </td>
            <td>
              <div style="width:49px">状态</div>
            </td>
            <td>
              <div style="width:123px">描述</div>
            </td>
            <td>
              <div style="width:96px">最大负荷(万千瓦）</div>
            </td>
            <td>
              <div style="width:49px">状态</div>
            </td>
            <td>
              <div style="width:90px">运量(吨）</div>
            </td>
            <td>
              <div style="width:49px">状态</div>
            </td>
            <td>
              <div style="width:66px">检查次数</div>
            </td>
            <td>
              <div style="width:62px">违规车辆</div>
            </td>
            <td>
              <div style="width:62px">检查工地</div>
            </td>
            <td>
              <div style="width:62px">申报车辆</div>
            </td>
            <td>
              <div style="width:63px">运输车次</div>
            </td>
            <td>
              <div style="width:94px">土方运量(方）</div>
            </td>
            <td>
              <div style="width:62px">执法次数</div>
            </td>
            <td>
              <div style="width:62px">出动人员</div>
            </td>
            <td>
              <div style="width:62px">出动车辆</div>
            </td>
            <td>
              <div style="width:62px">查处车辆</div>
            </td>
          </tr>
        </thead>
        <div :style="{ width: cityDev_theadWid + 'px' }">
          <tr v-for="(eleData, index) in cityListDatas" :key="index">
            <!-- 勾选 -->
            <td valign="middle" style="width:51px;">
              <div
                style="margin-top: 6px;text-align:center;width:14px;height:14px;margin-left:13px;color:transparent;font-size:16px;border:1px solid #ccc;border-radius: 2px;overflow:initial;cursor:pointer"
                @click="getCheckDate(eleData.date, index)"
                ref="isCheck"
              >
                .
              </div>
            </td>
            <!--  -->
            <td valign="middle">
              <div style="width:80px">{{ eleData.date }}</div>
            </td>
            <!-- 供水 -->
            <td valign="middle">
              <div style="width:95px">
                <input
                  v-if="eleData.appCityWaterStatuses.length != 0"
                  v-model="eleData.appCityWaterStatuses[0].plannedNum"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:95px">
                <input
                  v-if="eleData.appCityWaterStatuses.length != 0"
                  v-model="eleData.appCityWaterStatuses[0].actualNum"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <!-- v-if="index>3||index==1" :rowspan="index==1?'3':''" -->
            <td valign="middle">
              <div style="width:35px">
                <input
                  v-if="eleData.appCityWaterStatuses.length != 0"
                  v-model="eleData.appCityWaterStatuses[0].level"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:49px">
                <el-select
                  v-model="eleData.appCityWaterStatuses[0].runningStatus"
                  v-if="eleData.appCityWaterStatuses.length != 0"
                  disabled
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </td>
            <!-- 排水 -->
            <td valign="middle">
              <div style="width:95px">
                <input
                  v-if="eleData.appCityWaterStatuses.length != 0"
                  v-model="eleData.appCityWaterStatuses[1].plannedNum"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:95px">
                <input
                  v-if="eleData.appCityWaterStatuses.length != 0"
                  v-model="eleData.appCityWaterStatuses[1].actualNum"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:35px">
                <input
                  v-if="eleData.appCityWaterStatuses.length != 0"
                  v-model="eleData.appCityWaterStatuses[1].level"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:49px">
                <el-select
                  v-if="eleData.appCityWaterStatuses.length != 0"
                  v-model="eleData.appCityWaterStatuses[1].runningStatus"
                  placeholder=""
                  disabled
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </td>
            <!-- 燃气 -->
            <td valign="middle">
              <div style="width:49px">
                <el-select
                  v-model="eleData.appCityEnergyStatuses[0].runningStatus"
                  placeholder=""
                  v-if="eleData.appCityEnergyStatuses.length != 0"
                  disabled
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </td>
            <td valign="middle">
              <div style="width:120px">
                <textarea
                  class="allTextInput"
                  v-if="eleData.appCityEnergyStatuses.length != 0"
                  v-model="eleData.appCityEnergyStatuses[0].description"
                  disabled
                ></textarea>
              </div>
            </td>
            <!-- 供暖 -->
            <td valign="middle">
              <div style="width:49px">
                <el-select
                  v-model="eleData.appCityEnergyStatuses[1].runningStatus"
                  v-if="eleData.appCityEnergyStatuses.length != 0"
                  placeholder=""
                  disabled
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </td>
            <td valign="middle">
              <div style="width:123px">
                <textarea
                  v-if="eleData.appCityEnergyStatuses.length != 0"
                  v-model="eleData.appCityEnergyStatuses[1].description"
                  class="allTextInput"
                  disabled
                ></textarea>
              </div>
            </td>
            <!-- 电力 -->
            <td valign="middle">
              <div style="width:96px">
                <input
                  v-if="eleData.appCityEnergyStatuses.length != 0"
                  v-model="eleData.appCityEnergyStatuses[2].actualNum"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:49px">
                <el-select
                  v-model="eleData.appCityEnergyStatuses[2].runningStatus"
                  placeholder=""
                  v-if="eleData.appCityEnergyStatuses.length != 0"
                  disabled
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </td>
            <!-- 生活垃圾 -->
            <td valign="middle">
              <div style="width:90px">
                <input
                  class="allTextInput"
                  v-model="eleData.actualNum"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:49px">
                <el-select v-model="eleData.runningStatus" disabled>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </td>
            <!-- 渣土 -->
            <!-- 联合管理 -->
            <td valign="middle">
              <div style="width:66px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].checkCar"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:62px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].checkIllegalCar"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:62px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].checkConstruction"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:62px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].transportCar"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:63px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].transportTime"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:94px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].transportNum"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <!-- 月累计 -->
            <td valign="middle">
              <div style="width:62px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].executeNum"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:62px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].executePeople"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:62px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].executeCar"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
            <td valign="middle">
              <div style="width:62px">
                <input
                  v-if="eleData.appCityMuckStatuses.length != 0"
                  v-model="eleData.appCityMuckStatuses[0].executeIllegalCar"
                  class="allTextInput"
                  type="text"
                  disabled
                />
              </div>
            </td>
          </tr>
        </div>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "cityDev",
  data() {
    return {
      // 月份的val
      monthVal: "",
      monthValStr: "",
      // table
      tableHeight: 608,
      cityDev_theadWid: 0,
      options: [
        {
          value: 0,
          label: "平稳"
        },
        {
          value: 1,
          label: "异常"
        }
      ],
      changeData: [],
      checkDateList: []
    };
  },
  props: ["cityListDatas"],
  methods: {
    outOffinif() {
      this.$emit("outOffinif", "");
    },
    monthValchange() {
      let dateVal = new Date(this.monthVal);
      let str =
        dateVal.getFullYear() +
        "-" +
        (dateVal.getMonth() + 1 < 10
          ? "0" + (dateVal.getMonth() + 1)
          : dateVal.getMonth() + 1);
      console.log(str, this.monthVal);
      this.monthValStr = str;
      this.$emit("cityMonthVal", str);
    },
    filtration(data, datas) {
      for (let key in data) {
        if (data[key].constructor == Object) {
          this.observe(data[key], datas);
          this.filtration(data[key], datas);
        } else if (data[key].constructor == Array) {
          // console.log(data[key]);
          if (data[key].length != 0) {
            data[key].forEach(ele => {
              this.observe(ele, data);
            });
          }
        }
      }
    },
    observe(data, bigData) {
      const that = this;
      for (let key in data) {
        // console.log(data);
        let val = data[key];
        let outermostData = bigData;
        Object.defineProperty(data, key, {
          enumerable: true,
          get() {
            return val;
          },
          set(newVal) {
            if (val !== newVal) {
              val = newVal;
              let flag = true;
              that.changeData.forEach(eles => {
                if (eles.id == outermostData.id) {
                  flag = false;
                }
              });
              if (flag) {
                that.changeData.push(outermostData);
              }
              console.log(that.changeData, that.cityListDatas);
            }
          }
        });
      }
    },
    /*
     *@Description:
     *@MethodAuthor:  XRY
     *@date: 点击的行时间
     *@index: 点击的行索引
     *@Date: 2021-01-06 16:08:17
     */
    getCheckDate(date, index) {
      let nowDate = date;
      if (this.$refs.isCheck[index].innerText == "✓") {
        this.$refs.isCheck[index].innerText = ".";
        this.$refs.isCheck[index].style.color = "transparent";
        this.checkDateList.forEach((ele, index, arr) => {
          if (ele == nowDate) {
            arr.splice(index, 1);
          }
        });
      } else {
        this.$refs.isCheck[index].innerText = "✓";
        this.$refs.isCheck[index].style.color = "green";
        this.checkDateList.push(nowDate);
      }
      console.log(this.checkDateList)
    },
    /*
     *@Description: 导出
     *@MethodAuthor:  XRY
     *@param: {}
     *@Date: 2021-01-06 16:38:25
     */
    exportDoc() {
      // 排序
      this.checkDateList.sort((a, b) => {
        return new Date(a) - new Date(b);
      });
      console.log(this.checkDateList);
      this.$emit("newEduce", this.checkDateList);
    }
  },
  watch: {
    cityListDatas: function(val) {
      this.changeData = [];
      // this.filtration(val)
    }
  },
  mounted() {
    const _that = this;
    setTimeout(() => {
      _that.tableHeight = document.getElementsByClassName(
        "cityDev_contetnt"
      )[0].offsetHeight;
      _that.cityDev_theadWid = document.getElementsByClassName(
        "cityDev_thead"
      )[0].offsetWidth;
      // console.log(document.getElementsByClassName('cityDev_contetnt')[0],_that.tableHeight)
    }, 10);
  }
};
</script>

<style scoped>
.cityDev_wrap {
  width: 100%;
  height: 100%;
}
/* 头部 */
.cityDev_header {
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px 0 21px;
  box-sizing: border-box;
  margin-bottom: 3px;
}
.cityDev_header > h3 {
  font-size: 14px;
}
.cityDev_header /deep/ .el-button {
  padding: 12px 20px;
}
.cityDev_header /deep/ .el-input__inner {
  height: 40px;
}
.cityDev_header /deep/ .el-input__icon {
  line-height: 40px;
}
.cityDev_contetnt {
  height: calc(100% - 46px);
  overflow-x: auto;
}
.cityDev_table {
  overflow-y: hidden;
  width: auto;
  position: relative;
  border-top: 1px solid #ebeef5;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.cityDev_table thead {
  position: absolute;
  top: 0;
  left: 0;
  background: #f9fbff;
}
.cityDev_table div div {
  box-sizing: border-box;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.cityDev_table div {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.cityDev_table thead td div,
.cityDev_table thead td {
  font-weight: 600 !important;
  white-space: nowrap;
}
.cityDev_table td,
.cityDev_table thead td {
  font-size: 12px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  padding: 5px;
  box-sizing: border-box;
}
.cityDev_table /deep/ .el-input--suffix .el-input__inner {
  padding: 0;
  border: none;
}
.cityDev_table /deep/ .el-input__suffix {
  right: -3px;
}
.allTextInput {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 10px 0;
  text-align: center;
  color: #666666;
  resize: none;
  font-size: 12px;
  font-weight: 500;
}
</style>
