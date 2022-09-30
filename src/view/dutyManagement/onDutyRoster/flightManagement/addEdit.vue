<template>
  <div class="flight-management-add-edit">
    <el-form ref="form" :model="formData" label-width="107px">
      <div style="display: flex; margin-bottom: 10px">
          <el-form-item
            label="班次名称"
            prop="name"
            label-width="72px"
            style="width: 700px; margin: 0 10px 0 0"
          >
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
        <div :span="4" v-if="activeTab !== '连续时间段'">
          <el-form-item
            label="班次值班人数"
            prop="name"
            label-width="98px"
            style="width: 160px; margin: 0 10px 0 0"
          >
            <el-input v-model="formData.maxNumble"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="短信通知：" label-width="83px">
          <el-tooltip :content="formData.smsSwicth" placement="top">
            <el-switch
              v-model="formData.smsSwicth"
              active-value="开"
              inactive-value="关"
            >
            </el-switch>
          </el-tooltip>
        </el-form-item>
      </div>
      <div>
      </div>
       <template v-if="formData.smsSwicth == '开'">
         <div style="display:flex">
                   <el-form-item label="开始日期：" label-width="88px">
          <el-date-picker
            v-model="formData.notifyBeginTime"
            type="date"
            placeholder="选择日期"
            style="width: 135px"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提前天数：" label-width="88px">
          <el-select
            v-model="formData.advanceDay"
            placeholder="天数"
            style="width: 75px"
          >
            <el-option
              v-for="item in daysOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知时间：" label-width="88px">
          <el-time-picker
            v-model="formData.notifyTime"
            placeholder="时间"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 97px"
          >
          </el-time-picker>
        </el-form-item>
        <div
          style="
            margin-left: 10px;
            color: #0091ff;
            cursor: pointer;
            margin-top: 10px;
          "
          class="edit_content"
          @click="editContentHandle()"
        >
          编辑内容
        </div>
         </div>
        </template>
      <div
        style="
          margin-bottom: 10px;
          text-align: left;
          display: flex;
          justify-content: space-between;
        "
      >
        <div>
          <el-checkbox v-model="formData.seat">坐席班次</el-checkbox>
        </div>
        <div style="color: #0091ff" v-if="formData.smsSwicth == '开'">
          通知说明：下一次通知时间为{{
            nextTime + " " + formData.notifyTime
          }}，将发送{{ futureDate(formData.advanceDay) }}的值班信息。
        </div>
      </div>

      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane
          v-for="tab in tabPane"
          :key="tab.id"
          :label="tab.label"
          :name="tab.label"
        >
          <template v-if="tab.id === 1">
            <el-form-item label="班次值班人数" prop="maxNumble">
              <el-col :span="20">
                <el-input v-model="formData.maxNumble"></el-input>
              </el-col>
              <!-- <el-col :span="3" v-if="tab.id === 2" style="text-align: right">
                <el-button type="text" style="color: #0091ff" @click="handleAdd"
                  >新增</el-button
                >
              </el-col> -->
            </el-form-item>
          </template>
          <div class="time-period" v-for="(item, index) in timeList">
            <template v-if="tab.id === 1">
              <el-form-item label="时间段">
                <!--              <el-col :span="9">-->
                <!--                <el-time-picker style="width: 100%" placeholder="选择时间" v-model="item.startTime"></el-time-picker>-->
                <!--              </el-col>-->
                <!--              <el-col class="line" :span="1">-</el-col>-->
                <!--              <el-col :span="9">-->
                <!--                <el-time-picker style="width: 100%" placeholder="选择时间" v-model="item.endTime"></el-time-picker>-->
                <!--              </el-col>-->
                <el-col :span="20">
                  <el-time-picker
                    placeholder="起始时间"
                    v-model="item.startTime"
                    @change="changeTime(index)"
                    value-format="HH:mm"
                    format="HH:mm"
                  ></el-time-picker>
                  <el-time-picker
                    placeholder="结束时间"
                    v-model="item.endTime"
                    :picker-options="{ selectableRange: minStartTime }"
                    value-format="HH:mm"
                    format="HH:mm"
                  ></el-time-picker>
                  <!-- <el-time-picker style="width: 100%" is-range v-model="item.timeRange" range-separator="至" start-placeholder="开始时间"
                  end-placeholder="结束时间"></el-time-picker>-->
                </el-col>
                <el-col :span="4">
                  <el-checkbox
                    v-model="item.toTomorrowStatus"
                    @change="changeTime(index)"
                    >跨日值班</el-checkbox
                  >
                </el-col>
              </el-form-item>
              <el-form-item label="值班日类型" style="text-align: left">
                <el-col :span="23">
                  <el-radio-group v-model="item.type">
                    <el-radio :label="0">节假日</el-radio>
                    <el-radio :label="1">工作日</el-radio>
                  </el-radio-group>
                </el-col>
              </el-form-item>
            </template>
          </div>

          <template v-if="tab.id === 2">
            <div class="intervalShift">
              <div class="changeShift">
                <el-radio-group
                  v-model="selectShiftTypes"
                  class="shiftTypesStyle"
                >
                  <el-radio
                    :label="item.id"
                    v-for="item in shiftTypes"
                    :key="item.id"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>

                <el-button type="primary" size="medium" @click="addHandle"
                  >新增</el-button
                >
              </div>

              <el-row class="allShiftList">
                <el-col :span="16">
                  <el-table :data="timeList" border height="370px">
                    <el-table-column
                      label="分时段班次名称"
                      prop="name"
                      align="center"
                    ></el-table-column>
                    <el-table-column label="班次类型" align="center">
                      <template slot-scope="scope">
                        {{ !scope.row.type ? "节假日" : "工作日" }}
                      </template>
                    </el-table-column>
                    <el-table-column label="时间段" align="center">
                      <template slot-scope="scope">
                        {{ scope.row.startTime + "~" + scope.row.endTime }}
                      </template>
                    </el-table-column>
                    <el-table-column label="是否跨天" align="center">
                      <template slot-scope="scope">
                        {{ !scope.row.toTomorrowStatus ? "否" : "是" }}
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="center" width="150px">
                      <template slot-scope="scope">
                        <div
                          style="display: flex; justify-content: space-around"
                        >
                          <span
                            @click="delShift(scope.$index)"
                            style="cursor: pointer"
                            >删除</span
                          >
                          <span
                            @click="editShift(scope.$index)"
                            style="cursor: pointer"
                            >编辑</span
                          >
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="8">
                  <div class="operationShift">
                    <el-form-item label="分时段班次名称" label-width="110px">
                      <el-input v-model="submitData.name"></el-input>
                      <!-- <el-col :span="3" style="text-align: right">
                          <el-button
                            type="text"
                            style="color: #f46666"
                            @click="handleRemove(index)"
                            >删除</el-button
                          >
                        </el-col> -->
                    </el-form-item>

                    <el-form-item label="值班日类型" style="text-align: left">
                      <el-col :span="24">
                        <el-radio-group v-model="submitData.type">
                          <el-radio :label="0">节假日</el-radio>
                          <el-radio :label="1">工作日</el-radio>
                        </el-radio-group>
                      </el-col>
                    </el-form-item>

                    <el-form-item label="时间段">
                      <el-row class="timeSlot">
                        <el-col :span="11">
                          <el-time-picker
                            placeholder="起始"
                            v-model="submitData.startTime"
                            @change="changeTime(idx)"
                            value-format="HH:mm"
                            format="HH:mm"
                          ></el-time-picker>
                        </el-col>
                        <el-col :span="2" class="interval">-</el-col>
                        <el-col :span="11">
                          <el-time-picker
                            placeholder="结束"
                            v-model="submitData.endTime"
                            :picker-options="{
                              selectableRange: minStartTime,
                            }"
                            value-format="HH:mm"
                            format="HH:mm"
                          ></el-time-picker>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="是否跨天">
                      <el-radio-group
                        v-model="submitData.toTomorrowStatus"
                        @change="changeTime(idx)"
                      >
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <div class="submitShift">
                      <el-button
                        type="primary"
                        size="medium"
                        @click="submitShift"
                        >确定</el-button
                      >
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 编辑内容 -->
    <el-dialog
      title="编辑内容"
      :visible.sync="editContentVisible"
      width="350px"
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="editContent"
    >
      <div>
        <div ref="toolbar" style="display: none"></div>
        <div ref="editor"></div>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0px 0px;
        "
      >
        <div>备注：{}大括号内容不可修改</div>
        <el-button type="primary" size="small" @click="saveEditContent"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deletedClassesTime } from "@/assets/interface/interface";
import wangeditor from "wangeditor";

export default {
  name: "flightManagementAddEdit",
  data() {
    return {
      formData: {
        date: "",
        seat: false,
        maxNumble: "",
        name: "",
        appSjsDutyClassesTimeList: [],
        order: 0,
        type: 1,
        delete: [],
        smsSwicth: "关", // 短信通知开关
        notifyBeginTime: null, // 短信通知开始日期
        advanceDay: 1, //提前天数
        notifyTime: null, // 通知时间
        notifyTxt: null, // 编辑内容
      },
      tabPane: [
        {
          id: 1,
          label: "连续时间段",
        },
        {
          id: 2,
          label: "间隔时间段",
        },
      ],
      activeTab: "连续时间段",
      minStartTime: "",
      storageShiftData: [], // 原始班次数据
      selectShiftTypes: 2, //选中班次类型
      shiftTypes: [
        {
          id: 2,
          name: "全部",
        },
        {
          id: 1,
          name: "工作日",
        },
        {
          id: 0,
          name: "节假日",
        },
      ], //所有班次类型
      submitData: {
        name: "",
        type: 1,
        startTime: "",
        endTime: "",
        toTomorrowStatus: false,
      },
      idx: 0, // 表格当前索引值
      addOrEdit: false, // 新增/编辑开关
      isYangZhou: window.g.IsYangZhouProject,
      daysOption: [
        { label: "一天", value: 1 },
        { label: "二天", value: 2 },
        { label: "三天", value: 3 },
        { label: "四天", value: 4 },
        { label: "五天", value: 5 },
      ],
      editContentVisible: false, //编辑内容弹窗
      editContent: {
        dutyName: "{值班员姓名}",
        arrange: "您好，您的值班安排如下：",
        interval1: "\n",
        date: "{日期}",
        slash1: "/",
        shiftName: "{班次名称}",
        slash2: "/",
        time: "{时间段}",
        interval2: "\n",
        arrangeTip: "请做好工作安排，按时到岗。",
      },
      editor: "",
      temporaryData: "", // 保存上次编辑的数据
      nextTime: new Date().formatDate("yyyy-MM-dd"),
    };
  },
  props: {
    // 判断组件是新增（add）还是编辑（edit）
    type: {
      type: String,
      default: "add",
    },
    date: {
      default: "",
    },
  },
  computed: {
    timeList() {
      // 连续时间段仅显示数组的第一项
      let list = this.formData.appSjsDutyClassesTimeList;
      let filterType = list.filter((m, i) => m.type == this.selectShiftTypes);
      return this.activeTab === "间隔时间段"
        ? this.selectShiftTypes != 2
          ? filterType
          : list
        : list.filter((m, i) => i < 1);
    },
    futureDate() {
      return function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期
        var d = dd.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + d;
      };
    },
  },
  watch: {
    timeList() {
      this.editShift(0); // 默认显示第一条数据
    },
    "formData.smsSwicth": {
      handler(newVal, oldVal) {
        if (newVal == "开") {
          this.formData.notifyBeginTime = !!this.formData.notifyBeginTime
            ? this.formData.notifyBeginTime
            : new Date().formatDate("yyyy-MM-dd");
          this.formData.notifyTime = !!this.formData.notifyTime
            ? this.formData.notifyTime
            : new Date().formatDate("hh:mm");
            this.editContentHandle();
        } else {
          this.formData.notifyBeginTime = null;
          this.formData.notifyTime = null;
        }
      },
    },
  },
  created() {
    // 新增的时候默认加一条数据

    if (this.type === "add") {
      this.handleAdd();
    }
    this.$set(this.formData, "date", this.date);
    console.log("this.formData: ", this.formData);
  },
  methods: {
    initWangEditor() {
      this.editor = new wangeditor(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.menus = [];
      this.editor.customConfig.onchange = (html) => {};
      // 创建富文本编辑器
      this.editor.create();
      this.editor.$textContainerElem
        .css("border", "1px solid #DCDFE6")
        .css("border-radius", "4px")
        .css("position", "relative")
        .css("overflow", "auto")
        .css("text-align", "left")
        .css("font-size", "13px")
        .css("width", "100%")
        .css("height", "107px")
        .css("color", "#666")
        .css("cursor", "text");
    },
    // 获取编辑的表单数据
    getFormData(formData) {
      let timeList = formData.appSjsDutyClassesTimeList;
      console.log("formData: ", formData);
      if (timeList && timeList.length > 1) {
        this.activeTab = "间隔时间段";
      } else if (timeList.length === 1) {
        this.activeTab = timeList[0].name ? "间隔时间段" : "连续时间段";
      }
      this.$set(this, "formData", JSON.parse(JSON.stringify(formData)));
      this.$set(this, "storageShiftData", JSON.parse(JSON.stringify(formData)));
    },
    find(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    insertStr(soure, start, newStr) {
      return soure.slice(0, start) + newStr + soure.slice(start);
    },
    // 保存
    async handleSave() {
      try {
        let params = JSON.parse(JSON.stringify(this.formData));
        // console.log("params: ", params);
        // params.notifyTxt =  params.notifyTxt.replace(/'</p><p>/g, '\n')
        params.date = new Date(params.date).formatDate("yyyy-MM");
        params.appSjsDutyClassesTimeList.forEach((m) => {
          if (
            params.appSjsDutyClassesTimeList.length === 1 &&
            this.activeTab === "连续时间段"
          ) {
            m.name = "";
          }
          // console.log('m: ', m);
          m.toTomorrowStatus = !!m.toTomorrowStatus ? 1 : 0;
        });
        params.seat = params.seat ? 1 : 0;
        params.smsSwicth = params.smsSwicth == "开" ? 1 : 0;
        // console.log("params: ", params);
        let res = await this.$api.saveOrUpdate({
          data: params,
        });
        if (res.errorcode === 0) {
          this.$emit("saveSuccess", res);
          this.$message.success('保存成功');
        } else {
          this.$message.warning(res.msg);
          this.$emit.warning(res.msg);
        }
      } catch (e) {
        console.log(`handleSave: ${e}`);
      }
      
    },
    // 新增
    handleAdd() {
      let array = this.formData.appSjsDutyClassesTimeList
        ? this.formData.appSjsDutyClassesTimeList
        : [];
      let obj = {
        name: "",
        startTime: "",
        endTime: "",
        toTomorrowStatus: false,
        type: 1,
      };
      array.push(obj);
      this.$set(this.formData, "appSjsDutyClassesTimeList", array);
    },
    // 删除
    handleRemove(index) {
      if (this.formData.appSjsDutyClassesTimeList.length <= 1) {
        this.$message.error("时间段至少大于一个");
        return;
      }
      let array = this.formData.appSjsDutyClassesTimeList
        ? this.formData.appSjsDutyClassesTimeList
        : [];
      let item = array[index];
      if (item.id) {
        this.$confirm("确认删除该班次, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            try {
              let params = {
                data: {
                  id: item.id,
                },
              };
              let { data } = await this.$api.deletedClassesTime(params);
              if (data.errorcode === 0) {
                array.splice(index, 1);
                this.$set(this.formData, "appSjsDutyClassesTimeList", array);
              }
            } catch (e) {
              console.log(`handleRemove: ${e}`);
            }
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      } else {
        array.splice(index, 1);
        this.$set(this.formData, "appSjsDutyClassesTimeList", array);
      }
    },
    // 添加班次
    changeTime(idx) {
      // console.log('this.formData: ', this.formData);
      // console.log("this.formData: ", this.formData.appSjsDutyClassesTimeList);
      if (
        this.activeTab == "连续时间段"
          ? this.formData.appSjsDutyClassesTimeList[idx].toTomorrowStatus
          : this.submitData.toTomorrowStatus
      ) {
        //跨天
        // 时间范围
        this.minStartTime = "00:00:00 - 23:59:59";
        // console.log("时间范围", this.minStartTime);
      } else {
        // 时间范围
        this.minStartTime =
          (this.activeTab == "连续时间段"
            ? this.formData.appSjsDutyClassesTimeList[idx].startTime
            : this.submitData.startTime) + ":00 - 23:59:59";
        // console.log(this.minStartTime)
      }
      if (typeof idx == "number")
        if (this.activeTab == "连续时间段") {
          this.formData.appSjsDutyClassesTimeList[idx].endTime = "";
        } else {
          this.submitData.endTime = "";
        }
    },
    submitShift() {
      if (!this.submitData.name) {
        this.$message.warning("请输入分时段班次名称");
        return;
      } else if (!this.submitData.startTime) {
        this.$message.warning("请选择起始时间");
        return;
      } else if (!this.submitData.endTime) {
        this.$message.warning("请输入结束时间");
        return;
      } else {
        console.log("this.addOrEdit: ", this.addOrEdit);
        if (!this.addOrEdit) {
          // 删除初始化的第一条数据
          if (!this.formData.appSjsDutyClassesTimeList[0].name) {
            this.formData.appSjsDutyClassesTimeList = [];
          }
          let array = this.formData.appSjsDutyClassesTimeList
            ? this.formData.appSjsDutyClassesTimeList
            : [];
          array.push({ ...this.submitData });
          this.$set(this.formData, "appSjsDutyClassesTimeList", array);
        } else {
          this.$set(this.formData.appSjsDutyClassesTimeList, this.idx, {
            ...this.submitData,
          });
        }

        this.clearSubmitData();
      }
    },
    delShift(idx) {
      if (this.formData.appSjsDutyClassesTimeList.length == 1) {
        this.$message.warning("数据至少大于一天");
        return;
      }
      let delItem = this.formData.appSjsDutyClassesTimeList[idx];
      const _tar1 = JSON.stringify(delItem);
      const _tar2 = JSON.stringify(this.submitData);
      if (!!delItem.id) {
        this.formData.delete.push(delItem.id);
      }
      if (_tar1 == _tar2) {
        this.clearSubmitData();
      }
      this.formData.appSjsDutyClassesTimeList.splice(idx, 1);
    },
    editShift(idx) {
      this.idx = idx;
      this.addOrEdit = true;
      this.submitData = { ...this.timeList[idx] };
      for (const key in this.timeList[idx]) {
        if (this.submitData.hasOwnProperty(key)) {
          this.submitData[key] = this.timeList[idx][key];
        }
      }
    },
    clearSubmitData() {
      for (const key in this.submitData) {
        console.log('key != "type": ', key != "type");
        if (key == "type") {
          this.submitData.type = 1;
        } else if (key == "toTomorrowStatus") {
          this.submitData.toTomorrowStatus = false;
        } else {
          this.submitData[key] = "";
        }
      }
    },
    addHandle() {
      this.addOrEdit = false;
      this.clearSubmitData();
    },
    closeShifyVisible() {
      let isTrue = this.isEqual(this.formData, this.storageShiftData);
      if (this.type == "add" || !isTrue) {
        this.$confirm("数据还没保存, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$emit("sureClose");
        });
      } else {
        this.$emit("sureClose");
      }
    },
    //判断两个对象是否相等
    isEqual(objA, objB) {
      //相等
      if (objA === objB) return objA !== 0 || 1 / objA === 1 / objB;
      //空判断
      if (objA == null || objB == null) return objA === objB;
      //类型判断
      if (
        Object.prototype.toString.call(objA) !==
        Object.prototype.toString.call(objB)
      )
        return false;

      switch (Object.prototype.toString.call(objA)) {
        case "[object RegExp]":
        case "[object String]":
          //字符串转换比较
          return "" + objA === "" + objB;
        case "[object Number]":
          //数字转换比较,判断是否为NaN
          if (+objA !== +objA) {
            return +objB !== +objB;
          }

          return +objA === 0 ? 1 / +objA === 1 / objB : +objA === +objB;
        case "[object Date]":
        case "[object Boolean]":
          return +objA === +objB;
        case "[object Array]":
          //判断数组
          for (let i = 0; i < objA.length; i++) {
            if (!this.isEqual(objA[i], objB[i])) return false;
          }
          return true;
        case "[object Object]":
          //判断对象
          let keys = Object.keys(objA);
          for (let i = 0; i < keys.length; i++) {
            if (!this.isEqual(objA[keys[i]], objB[keys[i]])) return false;
          }

          keys = Object.keys(objB);
          for (let i = 0; i < keys.length; i++) {
            if (!this.isEqual(objA[keys[i]], objB[keys[i]])) return false;
          }

          return true;
        default:
          return false;
      }
    },
    /**
     * @description: 打开编辑内容弹窗，富文本数据回显
     * @param {*}
     * @return {*}
     */
    editContentHandle() {
      this.editContentVisible = true;
      this.$nextTick(() => {
        this.initWangEditor(); // 加载富文本插件
        if (!this.temporaryData) {
          let defaultText = `<p>{值班员姓名}您好，您的值班安排如下：<br>{日期}/{班次名称}/{时间段}<br>请做好工作准备，按时到岗</p>`; // 默认初始模板
          if (this.type == "add") {
            document.getElementsByClassName("w-e-text")[0].innerHTML = ""; // 清空富文本 默认的P标签
            this.editor.txt.append(defaultText);
          } else {
            this.editor.txt.clear();
            document.getElementsByClassName("w-e-text")[0].innerHTML = "";
            this.formData.notifyTxt = this.formData.notifyTxt.replace(
              /\n/g,
              "<br>"
            ); // 修改数据时转换一下 符合富文本换行的格式
            this.editor.txt.append(
              this.formData.notifyTxt
                ? "<p>" + this.formData.notifyTxt + "</p>"
                : defaultText // 不带上P标签富文本框会报错
            );
            this.saveEditContent();
            this.editContentVisible = true; // 重新打开编辑内容窗口
          }
        } else {
          this.editor.txt.clear();
          document.getElementsByClassName("w-e-text")[0].innerHTML = "";
          this.editor.txt.append(this.temporaryData); // 富文本显示上次保存的数据
        }
      });
    },
    saveEditContent() {
      this.editContentVisible = false;
      this.temporaryData = this.editor.txt.html(); // 保存上次富文本的原始数据，方便下次重新渲染
      let filtersData = this.editor.txt.html();
      filtersData = filtersData.replace(/<br>/g, "\n"); // 转换成符合下发短信时换行的格式
      filtersData = filtersData.replace(/<.*?>/gi, ""); // 去除所有标签
      this.formData.notifyTxt = filtersData;
    },
  },
};
</script>

<style lang="scss" scoped>
.flight-management-add-edit {
  /deep/ .el-tabs__content {
    max-height: 460px;
    overflow-y: auto;
  }

  .intervalShift {
    border: 1px solid;
    padding: 5px;
    .changeShift {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .allShiftList {
      display: flex;
      .operationShift {
        border: 1px solid;
        padding: 10px;
        margin-left: 10px;
        .timeSlot {
          .el-date-editor {
            width: 100% !important;
          }
        }
        .interval {
          text-align: center;
        }
        .submitShift {
          text-align: center;
        }
      }
    }
  }

  /deep/ .editContent {
    padding: 123px;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  .edit_content::before {
    content: '*';
    color: #F56C6C;
  }
}
</style>
