<!--@author：wzm-->
<template>
  <div class="out">
    <div class="left">
      <div class="btn">
        <el-button @click="begin" type="primary">召开会议</el-button>
        <el-button @click="invite" type="primary">邀请成员</el-button>
        <el-button type="primary" @click="EndConf">结束会议</el-button>
      </div>
      <div class="leftbottom">
        <el-scrollbar style="height: 100%">
          <template v-for="(items, index) in addShowPhone">
            <div class="showPhone" :key="index">
              <div
                class="showPhoneLeft"
                @click="clickPhone(items,index)"
                :class="{blue: changeColor === items.id}"
              >
                <div :title="items.name+'      '+items.indexCode">
                  <span style="display: initial;width:150px;">{{items.name}}</span>
                  <span>{{items.indexCode}}</span>
                </div>
              </div>
              <div class="showPhoneRight">
                <div @click="removeNumber(items)">
                  <i class="el-icon-d-arrow-right"></i>
                </div>
              </div>
            </div>
          </template>
        </el-scrollbar>
        <!-- 弹窗 -->
        <el-dialog
          :close-on-click-modal="false"
          title="选择视频会议成员"
          width="50%"
          :visible.sync="outerVisible"
        >
          <div class="top">
            <el-input class="input" placeholder="请输入内容" v-model="name"></el-input>
            <el-button @click="soush">查询</el-button>
            <el-input type="textarea" style="display:none" v-model="none"></el-input>
          </div>
          <div class="main_">
            <div class="left_">
              <el-scrollbar style="height: 100%">
                <el-tree
                  accordion
                  :data="data2"
                  style="max-height: 400px"
                  node-key="id"
                  check-on-click-node
                  @node-click="handleNodeClick"
                  :props="defaultProps"
                ></el-tree>
              </el-scrollbar>
            </div>

            <div class="right_">
              <el-scrollbar style="height: 100%">
                <el-checkbox-group style="max-height: 400px" v-model="checkboxGroup1">
                  <el-checkbox
                    class="checkbox_"
                    v-for="(item,city) in mans"
                    :label="item.id"
                    @change="changeCheckBox(item.id)"
                    :key="city"
                  >
                    <p>
                      <span style="margin-right: 20px">{{item.name}}</span>
                      <span>{{item.indexCode}}</span>
                    </p>
                    <!-- <p>{{item.mobile}}</p> -->
                  </el-checkbox>
                </el-checkbox-group>
                <div class="page_">
                  <!-- //分页器 -->
                  <el-pagination
                    :small="pagingSize1"
                    :page-size="pageSize1"
                    :total="total1"
                    @current-change="handleCurrentChangein"
                    :current-page.sync="currentPage1"
                    layout="total, prev, pager, next, jumper"
                  ></el-pagination>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div slot="footer" class="dialog-footer_">
            <el-button @click="unchange">取 消</el-button>
            <el-button type="primary" @click="change">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="right">
      <div class="content" id="icon">
        <!--        <i @click="icon" class="el-icon-caret-top"></i>-->
        <!--        <i @click="icon2" class="el-icon-caret-bottom"></i>-->
        <div class="contentchild">
          <ul>
            <li v-for="(item, index) in addShowPhone2" :key="index">
              <p>姓名：{{item.id.name}}</p>
              <el-radio v-model="item.arr.radio" label="0">在岗</el-radio>
              <el-radio v-model="item.arr.radio" label="1">离岗</el-radio>
              <el-radio v-model="item.arr.radio" label="2">设备故障</el-radio>
              <p>备注</p>
              <el-input
                class="remark"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 2}"
                placeholder="请输入内容"
                v-model="item.arr.textarea"
              ></el-input>
            </li>
          </ul>
        </div>
      </div>
      <div class="meeting">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="会议纪要">
            <el-input
              class="ipt"
              type="textarea"
              v-model="arr.remark"
              :autosize="{ minRows: 2, maxRows: 2}"
              style="width:600px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="success" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
//import Tree from "../../../../components/tree/tree";
import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";
import { mapGetters } from "vuex";

export default {
  name: "videoCall",
  components: {
    ContactDetailsPopup
    //Tree
  },
  data() {
    return {
      HWICP_Version: window.g.HWICP_Version,
      agent_id: "", //坐席ID
      videoType: 1,
      addShowPhone: [], //左侧数据
      addShowPhone2: [],
      name: "",
      none: 0,
      title: "", //外层弹窗标题
      data2: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      checkboxGroup1: [],
      mans: [],
      // 分页器1(弹窗)
      total1: 0, //数据总数
      pageSize1: 10, //每页条数
      currentPage1: 1, //当前页数
      pagingSize1: true, //分页大小
      dialogFormVisible: false,
      outerVisible: false,
      treeData: [], //电话分组
      clickPhoneData: "",
      changeColor: "",
      label: 0,
      ruleForm: {},
      arr: [
        {
          men: "",
          textarea: "",
          radio: ""
          // remark:''
        }
      ],
      array: [],
      meetingid: "",
      unchange_main: ""
    };
  },
  mounted() {
    this.agent_id = sessionStorage.getItem("agent_id");
    this.getPhoneGroupingTree();
  },
  computed: {
    ...mapGetters({
      myVdcConfId: "getConfId",
    })
  },
  methods: {
    //电话分组树
    getPhoneGroupingTree() {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$api.videoAndTerminalGroupList(data).then(res => {
        console.log(res.data);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.data2 = res.data;
      });
    },
    Click() {
      this.dialogFormVisible = true;
    },

    //  分页器1(弹窗)
    handleCurrentChangein() {
      let currentPage1 = this.currentPage1;
      let data = {
        searchText: this.name,
        page: currentPage1,
        size: 10
      };
      console.log(data);
      this.$api.terminalList(data).then(res => {
        // 返回的数据赋值给options
        // 把数据赋值给总共的数据总数tableData1
        this.total1 = res.data.totalElements;
        this.mans = res.data.data;
      });
    },
    // 请求人员
    handleNodeClick(num) {
      console.log(num.id);
      if (num.name === "视频会议成员") {
        this.mans = [];
        this.total1 = 0;
        return;
      } else if (num.id === -7 || num.id == -8 || num.id == -9) {
        this.mans = [];
        this.total1 = 0;
        if (num.name === "视频监控") {
          this.none = 1;
        } else {
          this.none = 2;
        }
        console.log(this.none);
      } else {
        if (this.none == 0) {
          this.mans = [];
          this.total1 = 0;
          return;
        } else if (this.none == 1) {
          //视频监控
          let page = this.currentPage1;
          console.log(page)
          let id = num.id;
          let data = {
            groupId: id,
            serchText: "",
            page: page,
            size: 10
          };
          this.mans = [];
          this.total1 = 0;
          this.$api.getVideoList(data).then(res => {
            if (res.data == [] || res.data == "") {
              return;
            }
            this.total1 = res.data.totalElements;
            this.mans = res.data.data;
            for (let i = 0; i < this.mans.length; i++) {
              this.mans[i]["call"] = this.mans[i].indexCode;
              this.mans[i]["numType"] = "9";
            }
            // this.data2=res.data
          });
        } else {
          //会场终端
          let page = this.currentPage1;
          let id = num.id;
          let data = {
            groupId: id,
            serchText: "",
            page: page,
            size: 10
          };
          this.mans = [];
          this.total1 = 0;
          this.$api.terminalList(data).then(res => {
            if (res.data == [] || res.data == "") {
              return;
            }
            this.total1 = res.data.totalElements;
            this.mans = res.data.data;
            for (let i = 0; i < this.mans.length; i++) {
              this.mans[i]["call"] = this.mans[i].uri;
              this.mans[i]["numType"] = "8";
            }
          });
        }
      }
    },
    soush() {
      let data = {
        searchText: this.name,
        page: this.currentPage1,
        size: this.pageSize1
      };
      console.log(data);
      this.$api.terminalList(data).then(res => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        this.mans = res.data.data;
        let total = res.data.totalElements;
        this.total1 = total;
      });
    },
    clickPhone(data, index) {
      console.log(data);
      this.clickPhoneData = data;
      this.changeColor = data.id;
      // console.log(this.changeColor)
    },
    removeNumber(phoneNumber) {
      console.log(phoneNumber);
      for (let i = 0; i < this.addShowPhone.length; i++) {
        if (phoneNumber == this.addShowPhone[i]) {
          this.addShowPhone.splice(i, 1);
          this.addShowPhone2.splice(i, 1);
          return;
        }
      }
    },
    unchange() {
      console.log(this.unchange_main);
      console.log(this.addShowPhone);
      this.outerVisible = false;
      this.addShowPhone = this.unchange_main;
      this.array = this.unchange_main;
      // this.addShowPhone2=this.array
    },
    change() {
      console.log(this.array);
      console.log(this.checkboxGroup1);
      let hahaa = [];
      for (let b = 0; b < this.array.length; b++) {
        hahaa.push({
          id: this.array[b],
          name: this.checkboxGroup1[b],
          arr: {
            textarea: "",
            radio: "1",
            remark: "",
            id: this.array[b]
          }
        });
      }
      console.log(hahaa);
      this.addShowPhone = this.array;
      this.addShowPhone2 = hahaa;
      // this.addShowPhone = JSON.parse(JSON.stringify(this.array));//深拷贝
      this.outerVisible = false;
    },
    invite() {
      this.outerVisible = true;
      console.log(this.addShowPhone);
      this.unchange_main = JSON.parse(JSON.stringify(this.addShowPhone));
      console.log(this.unchange_main);
      this.checkboxGroup1 = [];
      for (let i = 0; i < this.addShowPhone.length; i++) {
        this.checkboxGroup1.push(this.addShowPhone[i].id);
      }
      this.name = "";
      this.mans = [];
    },
    // icon() {
    //   let btm = document.getElementById('icon')
    //   var top = document.getElementsByClassName('video');
    //   for (var i = 0; i < top.length; i++) {
    //     top[i].style.height = "149px";
    //   }
    //   btm.style.height = "320px"
    // },
    // icon2() {
    //   let btm = document.getElementById('icon')
    //   let auto = document.getElementById('auto')
    //   var top = document.getElementsByClassName('video');
    //   for (var i = 0; i < top.length; i++) {
    //     top[i].style.height = "245px";
    //   }
    //   btm.style.height = "20px"
    //   auto.style.overflow = "auto"
    // },

    success() {
      // console.log(this.arr.remark)
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let mm = date.getMinutes();
      mm = mm < 10 ? "0" + mm : mm;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      let time = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
      let confDuty = [];
      let info = {
        confId: 1,
        beginTime: time,
        remark: this.arr.remark
      };
      console.log(info);
      console.log(this.array);
      console.log(this.addShowPhone2);
      console.log(this.meetingid);
      // if(this.meetingid.length==''){
      //     for (let x = 0; x < this.addShowPhone2.length; x++) {
      //         confDuty.push({
      //             stieId: this.addShowPhone2[x].id.id,
      //             status: this.addShowPhone2[x].arr.radio,
      //             remark: this.addShowPhone2[x].arr.textarea
      //         });
      //     }
      // }
      // else{
      console.log(this.meetingid);
      for (let x = 0; x < this.addShowPhone2.length; x++) {
        confDuty.push({
          id: this.meetingid[x],
          stieId: this.addShowPhone2[x].id.id,
          status: this.addShowPhone2[x].arr.radio,
          remark: this.addShowPhone2[x].arr.textarea
        });
        // }
      }
      console.log(confDuty);
      let data = {
        confDuty: confDuty,
        info: info
      };
      this.$api.vdioSave(data).then(res => {
        console.log(res);
        console.log(res.data);
        this.meetingid = res.data;
        console.log(this.meetingid);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.$message({
          message: "保存成功",
          type: "success"
        });
      });
      console.log(confDuty);
    },
    changeCheckBox(id) {
      console.log(id, this.mans);
      let flag = 1;
      for (let i = 0; i < this.array.length; i++) {
        if (this.array[i].id === id) {
          this.array.splice(i, 1);
          flag = 0;
          break;
        }
      }
      if (flag) {
        for (let i = 0; i < this.mans.length; i++) {
          if (this.mans[i].id === id) {
            this.array.push(this.mans[i]);
            break;
          }
        }
      }
    },
    begin() {
      console.log(this.addShowPhone);
      if (this.addShowPhone.length == 0) {
        this.$message({
          message: "请添加会议成员！",
          type: "warning"
        });
        return;
      }
      this.$confirm("确认召开会议？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let self = this;
          if (self.HWICP_Version == "HWICP-19.0") {
            let memberNum = "";
            let numType = "";
            console.log('self.addShowPhone: ',self.addShowPhone)
            for (let index = 0; index < self.addShowPhone.length; index++) {
              if (index != self.addShowPhone.length - 1) {
                memberNum =
                  memberNum +
                  (self.addShowPhone[index].call || self.addShowPhone[index].uri) +
                  "|*|" +
                  self.addShowPhone[index].name +
                  ",";
                if (
                  self.videoType == "0" &&
                  (self.addShowPhone[index].numType || 8) == "8"
                )
                  numType = numType + "1" + ",";
                else numType = numType + (self.addShowPhone[index].numType || 8) + ",";
              } else {
                memberNum =
                  memberNum +
                  (self.addShowPhone[index].call || self.addShowPhone[index].uri) +
                  "|*|" +
                  self.addShowPhone[index].name;
                numType = numType + (self.addShowPhone[index].numType || 8);
              }
            }
            if (self.videoType == "0") {
              numType = numType + ",1";
            } else if (self.videoType == "1") {
              numType = numType + ",8";
            }
            console.log(memberNum);
            console.log(numType);
            this.$icp19
              .CreateConfEx(Number(self.agent_id), memberNum, numType)
              .then(data => {
                if (data.data.errorcode == 0) {
                  this.$message.success("已发起创建会议！");
                  // start();
                  // typeof call==='function'&&call(data)
                  //router.push({path: '/icpVideo'});
                  sessionStorage.setItem("videoListMemberNum", memberNum);
                  sessionStorage.setItem("videoListNumType", numType);
                  this.$store.commit("setConfStatus", true); //设置会议状态
                }
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消召开会议"
          });
        });
    },
    //结束会议
    EndConf() {
      this.$confirm("确认结束会议？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let self = this;
          if (self.HWICP_Version == "HWICP-19.0") {
            this.$icp19.DeleteConf(Number(self.agent_id), Number(self.myVdcConfId));
              sessionStorage.removeItem("videoListMemberNum");
              sessionStorage.removeItem("videoListNumType");
          }
          this.$store.commit("setConfStatus", false); //设置会议状态
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消结束会议"
          });
        });
    }
  }
};
</script>

<style scoped>
.out {
  display: flex;
  margin: 16px 30px 0 30px;
}

.left {
  width: 392px;
  margin-right: 16px;
}

.btn {
  width: 392px;
  height: 80px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.leftbottom {
  overflow: hidden;
  text-align: left;
  width: 392px;
  height: 760px;
  font-size: 14px;
  border: 1px solid #ccc;
  background-color: #fff;
}

.leftbottom ul {
  padding: 16px;
  text-align: left;
  list-style: none;
}

.leftbottom ul li {
  margin-bottom: 25px;
  overflow: hidden;
}

.right {
  padding: 0;
  width: 1208px;
  height: 856px;
  /*overflow: auto;*/
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #ccc;
}

.right ul {
  margin-left: 10px;
  padding: 0px 20px;
  list-style: none;
  overflow: hidden;
}

.right ul li {
  float: left;
  margin: 0 5px 5px 0;
  border: 1px solid #ccc;
}

.video {
  width: 360px;
  height: 245px;
  background-color: #fff;
  margin: 6px;
}

.main_ {
  width: 100%;
  display: flex;
}

.left_ {
  width: 50%;
}

.right_ {
  width: 50%;
  height: 620px;
  /* background-color: #ccc; */
  position: relative;
}

.page_ {
  position: absolute;
  margin: 0 auto;
  bottom: 0;
}

.checkbox_ {
  width: 80%;
}

.showPhone {
  font-size: 0px;
  color: #fff;
  height: 30px;
}

.showPhoneLeft {
  width: 90%;
  height: 30px;
  float: left;
  background: rgb(69, 69, 69);
}

.showPhoneRight {
  width: 10%;
  height: 30px;
  float: left;
  background: #686467;
  border-bottom: 1px solid rgb(69, 69, 69);
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
}

.showPhoneLeft div {
  font-size: 14px;
  line-height: 30px;
  padding-left: 5%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.showPhoneRight i {
  font-size: 20px;
  cursor: pointer;
}

.showPhoneRight div {
  font-size: 20px;
  padding: 0 10px;
  display: inline-block;
}

.blue {
  background-color: #338fcc;
}

.content {
  width: 100%;
  height: 700px;
  overflow: auto;
  /*background-color: #ccc;*/
}

contentchild {
  width: 100%;
  overflow: auto;
}

.contentchild > ul {
  list-style: none;
  overflow: hidden;
}

.contentchild > ul > li {
  width: 17%;
  padding: 10px;
  float: left;
  margin: 5px;
  text-align: left;
}

/* .remark {
    width: 200px;
  } */

>>> .el-radio {
  margin: 0;
}

.ipt {
  width: 80%;
}

.meeting > p {
  margin: 0;
  padding: 0;
}

.meeting {
  margin-bottom: 10px;
}

.input {
  width: 300px;
  margin: 0 20px;
}

.dialog-footer {
  text-align: center;
}
</style>
