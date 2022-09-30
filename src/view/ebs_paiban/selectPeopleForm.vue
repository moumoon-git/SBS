<template>
  <!-- 
          @editorName: qinjiaqi
          @editorTime: 2020-10-19 9:52:41
          @description: 弹出框默认可点击区域外关闭，故将:close-on-click-modal设为"false"
      -->
  <el-dialog
    title="联系人选择"
    :visible.sync="visible"
    width="80%"
    :before-close="classClose"
    :close-on-click-modal="false"
  >
    <div class="selectPeopleOut">
      <div class="selectDiv-l">
        <p>通讯录分组</p>
        <el-tree
          :data="contactorTreeData"
          accordion
          node-key="id"
          :default-expanded-keys="[0]"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
      <div class="selectDiv-r">
        <el-input
          v-model="search"
          placeholder="请输入姓名或手机号码搜索"
          @keyup.enter.native="onSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="onSearch"
            style="padding: 12px 12px"
          ></el-button>
        </el-input>
        <el-collapse accordion>
          <el-collapse-item v-for="(item, index) in tableData" :key="index">
            <template slot="title">
              <!-- <el-radio v-model="radio" :label="item">
                                        <span>{{item.name}}</span><span>{{item.position==null?'-':item.position}}</span><span>{{item.groups[0].name}}</span>
                                    </el-radio> -->
              <el-checkbox-group
                class="group"
                v-model="peopleData"
                @change="getValue"
              >
                <el-checkbox :label="item">
                  <span>{{ item.name }}</span
                  ><span>{{ item.position == null ? "-" : item.position }}</span
                  ><span>{{ item.groups ? item.groups[0].name : "" }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <div class="contactInfo">
              <div class="contactName">
                <div class="contactName-l"></div>
                <div class="contactName-r">
                  <p>
                    <span>{{ item.name }}</span
                    >{{ item.position == null ? "-" : item.position }}
                  </p>
                  <p>{{ item.groups ? item.groups[0].name : "" }}</p>
                </div>
              </div>
              <div class="contactItems">
                <div class="contactItem">
                  <div class="contactItem-l">手机</div>
                  <div class="contactItem-r">{{ item.mobile }}</div>
                </div>
                <div class="contactItem">
                  <div class="contactItem-l">办公</div>
                  <div class="contactItem-r">{{ item.officeTel }}</div>
                </div>
                <div class="contactItem">
                  <div class="contactItem-l">家庭</div>
                  <div class="contactItem-r">{{ item.homeTel }}</div>
                </div>
                <div class="contactItem">
                  <div class="contactItem-l">其他</div>
                  <div class="contactItem-r">{{ item.otherTel2 }}</div>
                </div>
                <div class="contactItem">
                  <div class="contactItem-l">邮件</div>
                  <div class="contactItem-r">{{ item.email }}</div>
                </div>
                <div class="contactItem">
                  <div class="contactItem-l">传真</div>
                  <div class="contactItem-r">{{ item.fax }}</div>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          :total="totalElements"
          >
        </el-pagination>
      </div>
      <div class="selectTreeData" @click="addTempData"></div>
      <div class="selectDiv-Tab">
        <div class="tabTop">
          <li
            class="tabli"
            v-for="(key, index) in classMode"
            :key="index"
            v-on:click="addClass(index, key.id)"
            v-bind:class="{ ischeck: index == current }"
          >
            {{ key.name }}
          </li>
        </div>
        <div class="tabBottom">
          <li
            class="bottomLi"
            v-for="(key, index) in tempGroupData"
            :key="index"
          >
            <i @click="deleteOne(key.id)" class="el-icon-close"></i>
            <div class="peopleInfo">
              {{ key.name }} &nbsp;&nbsp;{{ key.workUnit }}&nbsp;&nbsp;{{
                key.position
              }}
            </div>
            <div class="sort">
              <div class="up" @click="upGo(index)"></div>
              <div class="down" @click="downGo(index)"></div>
            </div>
          </li>
          <el-button
            class="saveData"
            type="primary"
            @click="saveModeRoleContactor"
            >保存</el-button
          >
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="classClose()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["visible", "selectDate", "classMode", "tempModeId"],
  data() {
    return {
      clickFlag: true,
      idsArr: [], //当前选中的对应角色的人id数组
      roleId: "", // 当前选中的角色id
      current: "",
      peopleData: [], // 默认选项，要在el-checkbox-group里绑定一个空数组
      // 选中的人
      selectedPeople: {},
      radio: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      contactorTreeData: [],
      tableData: [],
      topTreeID: "",
      search: "", //搜索
      tempGroupData: [], // 右侧分组临时数据
      currentPage:1,//当前页
      nowPageId:1,
      totalElements:0
    };
  },
  methods: {
    /*
     *@Description: 切换页
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-12-08 15:26:32
    */
    handleCurrentChange: function(currentPage) {
            this.currentPage = currentPage;
            this.getTable(this.nowPageId);
        },
    /*
     *@Description: 获取添加联系人的id数组
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-11-06 15:18:33
     */
    getIdsArr() {
      this.idsArr = [];
      for (let i = 0; i < this.tempGroupData.length; i++) {
        this.idsArr.push(this.tempGroupData[i].id);
      }
    },
    /*
     *@Description: 保存设置的排班数据
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-11-06 15:10:40
     */
    saveModeRoleContactor() {
      this.getIdsArr();
      let data = {
        roleId: this.roleId,
        contactorIds: this.idsArr,
      };
      this.$http("/duty/subordinate/saveModeRoleContactor", data).then(
        (res) => {
          let data = res.data;
          // if(data.errorcode == 0){
          //    this.$message({
          //       type: "success",
          //       message: "保存成功"
          //     });
          // }
          this.clickFlag = true;
        }
      );
    },
    /*
    *@Description: 向上移动一格并改变数组数据
    *@MethodAuthor:  DGT
    *@param: {
      index：序号
    }
    *@Date: 2020-11-05 14:31:19
   */
    upGo(index) {
      if (index != 0) {
        this.tempGroupData[index] = this.tempGroupData.splice(
          index - 1,
          1,
          this.tempGroupData[index]
        )[0];
      } else {
        this.tempGroupData.push(this.tempGroupData.shift());
      }
      this.clickFlag = false;
      this.getIdsArr(); //获取ids数组
    },
    /*
     *@Description: 向下移动一格并改变数组数据
     *@MethodAuthor:  DGT
     *@param: {
       index：序号
     }
     *@Date: 2020-11-05 14:32:27
    */
    downGo(index) {
      if (index != this.tempGroupData.length - 1) {
        this.tempGroupData[index] = this.tempGroupData.splice(
          index + 1,
          1,
          this.tempGroupData[index]
        )[0];
      } else {
        this.tempGroupData.unshift(this.tempGroupData.splice(index, 1)[0]);
      }
      this.clickFlag = false;
      this.getIdsArr(); //获取ids数组
    },
    /*
     *@Description: 删除单个选择人员
     *@MethodAuthor:  DGT
     *@param: {
       id:人员id
     }
     *@Date: 2020-11-05 09:37:30
    */
    deleteOne(id) {
      console.log(id);
      for (let i = 0; i < this.tempGroupData.length; i++) {
        if (this.tempGroupData[i].id == id) {
          this.tempGroupData.splice(i, 1);
        }
      }
      console.log(this.tempGroupData);
      this.getIdsArr(); //获取ids数组
    },
    /*
     *@Description: 添加分组选中的数据
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-11-04 16:59:29
     */
    addTempData() {
      if (this.peopleData.length < 1) {
        this.$message({
          type: "failed",
          message: "请选择至少一个人",
        });
        return;
      } else if (this.classMode.length < 1) {
        this.$message({
          type: "failed",
          message: "暂无角色信息，请在值班排班的模式定义中添加排班角色",
        });
        return;
      } else {
        this.clickFlag = false;
        if (this.tempGroupData.length > 0) {
          for (let i = 0; i < this.tempGroupData.length; i++) {
            for (let j = 0; j < this.peopleData.length; j++) {
              if (this.tempGroupData[i].id == this.peopleData[j].id) {
                this.peopleData.splice(j, 1);
              }
            }
          }
          this.tempGroupData = this.tempGroupData.concat(this.peopleData);
        } else {
          this.tempGroupData = this.peopleData;
        }
        this.getIdsArr(); //获取ids数组
      }
    },
    /*
	 *@Description: 切换颜色,并获取角色对应的人
	 *@MethodAuthor:  DGT
	 *@param: {
     index:当前按钮的索引
     roleId:当前选中的角色id
   }
	 *@Date: 2020-11-04 16:56:04
	*/
    addClass: function (index, roleId) {
      if (this.clickFlag == false) {
        this.$message({
          type: "failed",
          message: "队列数据未保存，请保存后再切换",
        });
        return;
      }

      this.tempGroupData = [];
      this.current = index;
      this.roleId = roleId;
      let data = {
        roleId: this.roleId,
      };
      this.$http("/duty/subordinate/getContactorListByRoleId", data).then(
        (res) => {
          console.log(res);
          this.tempGroupData = res.data.data;
        }
      );
    },
    /*
     *@Description: 搜索联系人
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-11-04 16:58:01
     */
    onSearch() {
      this.searchGetList();
    },
    /*
     *@Description: 搜索联系人
     *@ClassAuthor:DGT
     *@Date:
     */
    searchGetList() {
      let id = this.topTreeID;
      let data = {
        groupId: id,
        key: this.search,
        page: this.currentPage,
        size: 10,
        type: "phone",
        includeLowerLevel: 1,
        menuId: this.$store.state.menu.menuID
      };
      let CallbackReload = this;
      this.$http(
        "/emergency/preparation/contactor/getList",
        data,
        CallbackReload
      ).then((res) => {
        // this.personList = res.data.data;
        // this.total = res.data.totalElements;
        let data = res.data;
        this.tableData = data.data;
      });
    },
    /*
     *@Description: 获取对应分组数据
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-11-04 16:59:09
     */
    getTable(id) {
      this.nowPageId = id
      //表格数据
      console.log(this.$store.state.menu.menuID);
      var id = id;
      let key = "";
      let data = {
        groupId: id,
        key: key,
        page: this.currentPage,
        size: 10,
        includeLowerLevel: 1,
        type: "phone",
        menuId: this.$store.state.menu.menuID,
      };
      this.$http("/emergency/preparation/contactor/getList", data).then(res => {
        let data = res.data;
        console.log(data);
        this.tableData = data.data;
        this.totalElements = data.totalElements
      });
    },
    handleNodeClick(data) {
      this.currentPage = 1
      //点击树形菜单
      this.search = "";
      console.log(data);
      this.getTable(data.id);
      this.topTreeID = data.id;
    },
    classClose(done) {
      if (this.clickFlag == false) {
        this.$message({
          type: "failed",
          message: "队列数据未保存，请保存后再提交",
        });
        return;
      }

      this.$emit("update:visible", false); // 直接修改父组件的属性
      this.$emit("addPeopleFather", this.selectedPeople);
    },
    /**
     * @description: 判断勾选联系人手机号码是否存在
     * @author: xuchuangxing
     * @lastUpdateTime : 2020-12-16
     * @param { arr } // 勾选联系人数据
     * @return {*}
     */
    getValue(value) {
      // 石景山需求不能号码为空 author: xuchuangxing lastUpdateTime : 2020-12-16
      value.map((v, index) => {
        if (!v.mobile) {
          value.splice(index, 1);
          this.$message.warning("联系人手机号码不能为空");
        }
      });
      this.peopleData = value;
    },
    getContactTree() {
      this.$http("/emergency/preparation/contactorGroup/topTree", {
        menuId: "",
        type: "phone",
      }).then((result) => {
        let newResult = JSON.parse(
          JSON.stringify(result.data).replace(/name/g, "label")
        ); // 将name替换为title
        this.contactorTreeData.push(newResult);
      });
    },
  },
  mounted() {
    console.log(this.classMode);
    this.getContactTree();
    if (this.classMode && this.classMode.length > 0) {
      this.addClass(0, this.classMode[0].id);
    }
  },
};
</script>
<style scoped>
.saveData {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.ischeck {
  background: #1e9fff;
  color: #fff;
}
.selectTreeData {
  background: url(../../assets/img/right.png) no-repeat;
  background-position-y: 50%;
  cursor: pointer;
  width: 30px;
}
.peopleInfo {
  width: 260px;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/deep/ .el-icon-close {
  line-height: 38px;
  width: 16px;
  cursor: pointer;
  margin-left: 5px;
}
.sort {
  width: 84px;
  height: 100%;
  display: flex;
}
.bottomLi {
  display: flex;
  width: 98%;
  height: 35px;
  line-height: 35px;
  border: 1px solid #e9e9e9;
  margin-bottom: 5px;
}
.up {
  background: url(../../assets/img/up.png) no-repeat;
  cursor: pointer;
  width: 25px;
  height: 25px;
  background-size: 100% 100%;
  margin-top: 6px;
}
.down {
  background: url(../../assets/img/down.png) no-repeat;
  cursor: pointer;
  width: 25px;
  height: 25px;
  background-size: 100% 100%;
  margin-top: 6px;
  margin-left: 10px;
}
.tabli {
  box-sizing: border-box;
  flex: 0 0 25%;
  height: 30px;
  border: 1px dotted grey;
  list-style: none;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  margin-top: 5px;
  border: 1px solid #e9e9e9;
}
.tabBottom {
  width: 95%;
  margin: 0 auto;
  height: 485px;
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
.tabTop {
  width: 95%;
  /* height: 60px; */
  /* border: 1px solid black; */
  margin: 0 auto;
  /* width: 200px; */
  /* height: 150px; */
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  margin-top: 10px;
}
.selectDiv-Tab {
  width: 35%;
  height: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 13px;
  overflow-y: hidden;
  position: relative;
}
/deep/ .el-collapse-item {
  padding-left: 10px;
}

/deep/ .el-tree {
  height: 546px;
  overflow: auto;
}

.contactName-r p {
  margin: 0;
}

.contactName-r p span {
  font-size: 16px;
  font-weight: bold;
  margin-right: 5px;
}

.contactName-l {
  width: 50px;
  height: 50px;
  /* border: 1px solid red; */
  background: #e9e9e9;
  border-radius: 50%;
}

.contactName-r {
  width: 225px;
  height: 50px;
  /* border: 1px solid black; */
  padding-left: 5px;
}

.contactInfo {
}

.contactName {
  width: 94%;
  margin: 0 auto;
  height: 80px;
  /* border: 1px solid black; */
  align-items: center;
  display: flex;
}

.contactItems {
  width: 90%;
  margin: 0 auto;
  padding: 7px;
  border-radius: 5px;
  border: 1px solid #e9e9e9;
  display: flex;
  flex-wrap: wrap;
}

.contactItem {
  width: 50%;
  display: flex;
  flex-wrap: nowrap;
}

.contactItem-l {
  width: 30px;
  font-weight: bold;
  margin-right: 5px;
  white-space: nowrap;
}

.contactItem-r {
  width: 140px;
}

.selectDiv-l p {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  width: 90%;
  margin: 0 auto;
  border-bottom: 1px solid #e9e9e9;
  padding: 10px 0;
}

.selectDiv-r {
  width: 40%;
  height: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 13px;
  margin-right: 10px;
  overflow-y: auto;
}

.selectDiv-l {
  width: 25%;
  height: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 13px;
  margin-right: 10px;
}

.selectPeopleOut {
  width: 96%;
  height: 600px;
  margin: 0 auto;
  display: flex;
}
</style>
