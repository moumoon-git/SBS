<!--@author：wzm-->
<template>
  <div>
    <el-header class="navsBar" style="height: 80px">
      <el-col :span="12">
        <el-input
          placeholder="请输入姓名/职位/单位/号码"
          prefix-icon="el-icon-search"
          class="searchInput"
          v-model="searchText"
          clearable
        >
          <!--          <template v-if="groupingIsShow" slot="prepend" style="background:rgba(211,215,219,1);">-->
          <!--            <el-button style="color: #606266">分组</el-button>-->
          <!--          </template>-->
        </el-input>
      </el-col>
      <el-button @click="handleSearch(1)">搜索</el-button>
      <el-col :span="8" :offset="4">
        <!-- <el-button type="primary">自动点名</el-button> -->
      </el-col>
    </el-header>
    <el-main class="mainStyle">
      <el-row>
        <div class="automaticRollCall">
          <el-button @click="Refresh" type="primary" icon="el-icon-refresh"
            >刷新</el-button
          >
          <el-button
            @click="allelection"
            type="primary"
            icon="el-icon-circle-check"
            >全选</el-button
          >
        </div>
      </el-row>
      <el-row>
        <!--树形组件-->
        <el-col :span="4">
          <tree
            class="tree"
            node-key="id"
            ref="tree"
            :props="defaultProps"
            highlight-current
            :treeData="treeData"
            @handleNodeClick="handleNodeClick"
          ></tree>
        </el-col>
        <el-col :span="14">
          <div class="center">
            <div class="top_">
              <!-- <ul>
                <li v-for="(item,index) in plateData" :key="index">
                  <div class="lis">
                    <p><i @click="handleRowDbClick(plateData[index])" class="el-icon-info"></i>{{item.name}}</p>
                    <p class="PP"><span>手机：</span><span>5142</span><span @click="tab" class="icon"><i class="el-icon-caret-right"></i></span></p>
                    <p class="PP"><span>电话：</span><span>5142</span></p>
                    <p class="PP"> <span>职位：</span>{{item.position}}</p>
                  </div>
                </li>
              </ul> -->
              <name-plate
                @show="show"
                ref="namePlate"
                :plateData="plateData"
                @phoneChange="phoneChange"
              ></name-plate>
            </div>
            <!-- //分页器 -->
            <!-- <el-pagination :small="pagingSize1" :page-size="pageSize1" :total="total1"
              @current-change="pageChange"
              :current-page.sync="currentPage1"
              layout="total, prev, pager, next, jumper"></el-pagination> -->

            <el-pagination
              class="pagination"
              :page-size="pageSize"
              :total="total"
              :current-page.sync="currentPage"
              @current-change="handCurrentChange"
              layout="total, prev, pager, next, jumper"
            ></el-pagination>
            <!-- @size-change="handSizeChange" -->
          </div>
        </el-col>

        <!--联系人弹窗-->
        <contact-details-popup
          ref="ContactDetailsPopup"
          @getContactorList="refreshNamePlate"
        ></contact-details-popup>
        <el-col :span="6">
          <div class="right">
            <div class="top">
              <el-scrollbar style="height: 100%">
                <template v-for="(items, index) in addShowPhone">
                  <div
                    class="showPhone"
                    @click="clickPhone(items, index)"
                    :key="items.phoneNumber"
                  >
                    <div
                      class="showPhoneLeft"
                      :class="{ blue: changeColor === items.phoneNumber }"
                    >
                      <!-- <div class="showPhone"  :key='items.phoneNumber'>
                         <div class="showPhoneLeft"> -->
                      <div>{{ items.name }}</div>
                      <div>{{ items.phoneNumber }}</div>
                    </div>
                    <div class="showPhoneRight">
                      <div @click="call">
                        <i class="el-icon-phone-outline"></i>
                      </div>
                      <div @click="hangUp"><i class="el-icon-phone"></i></div>
                      <div @click="removeNumber(items.phoneNumber)">
                        <i class="el-icon-d-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </template>
              </el-scrollbar>
            </div>
            <div class="main">
              <p>已选择{{ addShowPhone.length }}人</p>
              <el-button @click="success" class="btn">发送</el-button>
              <el-button @click="unsuccess" class="btn">清空</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <!--来电弹窗-->
    <call-window ref="CallWindow"></call-window>
  </div>
</template>

<script>
import CallWindow from "@/components/CallWindow";
import "@/assets/css/icon.css";
import searchBar from "@/components/menu/searchBar";
import Tree from "../../../../components/tree/tree";
import NamePlate from "@/view/dutyManagement/rollOnDuty/phoneCall/adt/namePlate";
import DetailsAndDialing from "../../../integratedCommunication/icpPhone/detailsAndDialing";
import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";

export default {
  name: "appletCall",
  components: {
    // searchBar,
    CallWindow,
    Tree,
    NamePlate,
    DetailsAndDialing,
    ContactDetailsPopup,
  },
  data() {
    return {
      agent_id: "", //坐席ID
      plateData: [], //电话点名模板数据
      detailsIsShow: false, //是否显示详细信息
      radio2: 1,
      activeName2: "first", //默认卡片
      textfirst: "", //第一个文本域
      groupingIsShow: true, //是否显示分组按钮
      searchText: "",
      treeData: [], //电话分组
      groupId: 0, //分组id
      total: 0, //数据总数
      pageSize: 9, //总页数
      currentPage: 1, //当前页数
      // plateData:[],//大数据
      options1: [], //todolist
      todolist2: "",
      todolist1: "",
      options2: [], //todolist
      startTime: "", //时间
      endTime: "", //时间
      addShowPhone: [],
      clickPhoneData: "",
      changeColor: "",
      defaultProps: {
        children: "children",
        label: "name",
      },
      seatNumber: "",
    };
  },
  mounted() {
    this.agent_id = sessionStorage.getItem("agent_id");
    this.seatNumber = sessionStorage.getItem("seat");
    this.getPhoneGroupingTree();
    this.options1.push();
  },
  methods: {
    //电话分组树
    getPhoneGroupingTree() {
      let data = {};
      this.$api.telephoneGroupingTree(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.treeData = res.data;
        if (this.treeData.length > 0) {
          this.groupId = this.treeData[0]["id"]; //默认展示第一个tree
          this.getContactorList(1);
          console.log(this.treeData[0]["id"]);
          this.$nextTick(function () {
            this.$refs.tree.setCurrentKey(this.groupId); //调用setCurrentKey方法设置当前节点高亮
          });
        }
      });
    },
    //获取联系人数据
    getContactorList(page) {
      console.log(page);
      let data = {
        groupId: this.groupId,
        /*searchText: this.searchText,*/
        page: page,
        size: this.pageSize,
      };
      console.log(data);
      this.$api.contactorList(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        if (res.data == "") {
          this.plateData = [];
          this.total = 0;
        } else {
          this.plateData = res.data.list;
          this.total = res.data.totalCount;
          console.log(this.plateData);
          this.plateDataChange();
        }
      });
    },
    //树点击方法
    handleNodeClick(data, node) {
      this.currentPage = 1; //跳转到第一页
      this.groupId = data.id;
      this.getContactorList(1);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //换页
    handCurrentChange() {
      if (!this.groupId) {
        this.handleSearch(this.currentPage);
      } else {
        console.log(this.currentPage);
        this.getContactorList(this.currentPage);
      }
    },
    //修改选中的联系人后刷新分页查询的联系人列表
    refreshNamePlate() {
      if (this.groupId) {
        //如果是选中tree后的分页
        this.getContactorList(this.currentPage);
      } else {
        //如果是条件查询后的分页
        this.handleSearch(this.currentPage);
      }
    },
    //查询
    handleSearch(page) {
      if (page === 0) {
        this.currentPage = 1;
      }
      this.groupId = "";
      let data = {
        searchText: this.searchText,
        page: page,
        size: this.pageSize,
      };
      console.log(data);
      this.$api.contactorList(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
        this.plateData = res.data.list;
        this.total = res.data.totalCount;
        this.plateDataChange();
      });
    },
    /*调整plateData 下拉框的内容*/
    plateDataChange() {
      for (let i = 0; i < this.plateData.length; i++) {
        //获取手机号码列表
        this.plateData[i].mobileList = [];
        if (this.plateData[i].mobile) {
          this.plateData[i].mobileList.push({
            value: this.plateData[i].mobile,
            labels: this.plateData[i].mobile,
          });
        }
        if (this.plateData[i].otherTel) {
          this.plateData[i].mobileList.push({
            value: this.plateData[i].otherTel,
            labels: this.plateData[i].otherTel,
          });
        }

        //电话号码 this.plateData[i].homeTel officeTel otherTel2
        this.plateData[i].TelList = [];
        if (this.plateData[i].homeTel != "") {
          this.plateData[i].TelList.push({
            value: this.plateData[i].homeTel,
            labels: this.plateData[i].homeTel,
          });
        }
        if (this.plateData[i].officeTel != "") {
          this.plateData[i].TelList.push({
            value: this.plateData[i].officeTel,
            labels: this.plateData[i].officeTel,
          });
        }
        if (this.plateData[i].otherTel2 != "") {
          this.plateData[i].TelList.push({
            value: this.plateData[i].otherTel2,
            labels: this.plateData[i].otherTel2,
          });
        }
      }
      this.$refs.namePlate.resetModel(); //重置下拉框的绑定
    },
    //刷新
    Refresh() {
      // this.getPhoneGroupingTree()
      let data = {};
      this.$api.telephoneGroupingTree(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          message: "联系人分组刷新成功",
          type: "success",
        });
      });
    },
    //全选
    allelection() {
      let a1 = null;
      console.log(this.plateData);
      for (let n = 0; n < this.plateData.length; n++) {
        for (let i = 0; i < this.addShowPhone.length; i++) {
          if (
            this.plateData[n].mobile == this.addShowPhone[i].phoneNumber ||
            this.plateData[n].mobile == ""
          ) {
            a1 = true;
          }
          console.log(this.addShowPhone);
        }
        if (a1) {
          a1 = null;
          continue;
        }
        this.addShowPhone.unshift({
          name: this.plateData[n].name,
          id: this.plateData[n].id,
          phoneNumber: this.plateData[n].mobile,
          nowId: "",
        }); //id记录当前联系人id，nowId记录当前这条记录的id
        console.log(this.addShowPhone);
      }
      console.log(this.addShowPhone);
    },
    //分组查询方法;
    submittedSelect() {
      this.$nextTick(() => {
        this.$refs.searchBar.innerVisible = true;
        this.$refs.searchBar.dataUpdating(this.treeData, typeData);
      });
    },
    //弹窗方法
    show(row) {
      console.log(row);
      this.$nextTick(() => {
        this.$refs.ContactDetailsPopup.isDialogVisible = true;
        this.$refs.ContactDetailsPopup.title = "修改联系人";
        this.$refs.ContactDetailsPopup.getTree();
        this.$refs.ContactDetailsPopup.showData(row);
      });
    },
    //保存
    success() {
      console.log(this.addShowPhone);
      if (this.addShowPhone.length == 0) {
        this.$message({
          message: "请选择联系人",
          type: "error",
        });
        return;
      }
      let confDuty = [];
      for (let i = 0; i < this.addShowPhone.length; i++) {
        confDuty.push({
          contactorId: this.addShowPhone[i].id, //联系人id
          tel: this.addShowPhone[i].phoneNumber, //点名电话
        });
      }
      let data = {
        confDuty: confDuty,
      };
      // let data = {
      //     "data":[
      //     {
      //         distribution: {
      //             contactorId: this.clickPhoneData.id,  //联系人id
      //             conferenceDutyID: this.bigid  //点名id
      //         },
      //         smsTask: {
      //             smsTo: this.clickPhoneData.phoneNumber,  //点名电话
      //             contactorId: this.clickPhoneData.id,  //联系人id
      //         }
      //     }
      // ]
      // }
      console.log(data);
      // if(this.clickPhoneData){
      this.$api.miniProgramSave(data).then((res) => {
        console.log(res);
        //             res.data.id=this.bigid
        if (res.errorcode == 0) {
          this.$message({
            message: "发送成功",
            type: "success",
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
        //     })
        // }else{
        //     this.$message({
        //         message: '请先选择要发送的人员',
        //         type: 'warning'
      });
      // }
    },
    unsuccess() {
      this.addShowPhone = [];
    },

    tab(row) {
      console.log(row);
    },
    //右侧添加新的电话
    phoneChange(name, id, phoneNumber) {
      console.log(this.addShowPhone);
      for (let i = 0; i < this.addShowPhone.length; i++) {
        if (phoneNumber == this.addShowPhone[i].phoneNumber) return;
      }
      this.addShowPhone.unshift({
        name: name,
        id: id,
        phoneNumber: phoneNumber,
        nowId: "",
      }); //id记录当前联系人id，nowId记录当前这条记录的id
      console.log(this.addShowPhone);
    },
    removeNumber(phoneNumber) {
      console.log(phoneNumber);
      for (let i = 0; i < this.addShowPhone.length; i++) {
        if (phoneNumber == this.addShowPhone[i].phoneNumber) {
          this.addShowPhone.splice(i, 1);
          return;
        }
      }
    },
    clickPhone(data, index) {
      console.log(data);
      this.clickPhoneData = data;

      this.changeColor = data.phoneNumber;
      // console.log(this.changeColor)
    },
    // 拨号
    call() {
      this.$store.commit("setCallee", this.changeColor);
      this.$refs.CallWindow.findContactorByMobile();
      this.$store.commit("setIsJumpToIcpPhone", false);
      this.$icp19.MakeCall(
        Number(this.agent_id),
        this.changeColor.toString(),
        this.seatNumber.toString()
      );
    },
    // 挂断
    hangUp() {
      console.log(this.changeColor);
      let seat = JSON.stringify(sessionStorage.getItem("seat"));

      let num = JSON.stringify(this.changeColor);
      this.$icp19.DropCall(Number(this.agent_id), seat, num);
    },
  },

  // mounted(){
  //     this.getPhoneGroupingTree();
  //     this.options1.push();
  //
  // },
  created() {},
};
</script>

<style scoped>
.navsBar {
  margin: 0 30px;
  background-color: white;
  display: flex;
  align-items: center;
  border: 1px solid rgba(219, 219, 219, 1);
  box-sizing: border-box;
  border-radius: 3px;
}

.mainStyle {
  margin: 20px 30px 0 30px;
  background-color: white;
}

.automaticRollCall {
  width: 100%;
  height: 50px;
  text-align: left;
}

.pagination {
  /* position: absolute; */
  margin: 0 auto;
  margin-top: 20px;
  /* bottom: 0; */
}

.top_ {
  width: 100%;
  /* height: 200px; */
}

.top_ ul {
  padding: 15px;
  list-style: none;
  padding: 0;
  overflow: hidden;
  margin: 0;
}

.top_ ul li {
  /* position: relative; */
  width: 200px;
  float: left;
  padding: 0 10px;
  margin: 0 5px 10px 5px;
  /* background-color: #ccc; */
  border: 1px solid #ccc;
}

.input {
  margin-bottom: 15px;
  width: 150px;
}

.left_bom {
  width: 50px;
  color: blue;
}

.PP {
  padding-bottom: 5px;
  text-align: left;
  overflow: hidden;
}

.icon {
  float: right;
}

.top {
  height: 400px;
  background-color: #ccc;
}

/*.btn{*/
/*  position: absolute;*/
/*  bottom: 0;*/
/*  right: 0;*/
/*}*/
.textarea {
  padding-top: 40px;
}

.second {
  height: 15px;
}

.showPhone {
  font-size: 0px;
  color: #fff;
  height: 30px;
}

.showPhoneLeft {
  width: 60%;
  height: 30px;
  float: left;
  background: rgb(69, 69, 69);
}

.showPhoneRight {
  width: 40%;
  height: 30px;
  float: left;
  background: rgb(37, 37, 37);
}

.showPhoneLeft div {
  font-size: 14px;
  line-height: 30px;
  width: 45%;
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

.main {
  /*padding-top: 60px;*/
}
</style>
