<template>
  <div class="paibanSearch_wrap">
    <el-dialog
      :visible.sync="visible"
      width="1100px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <div slot="title">{{ title }}</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-tabs v-model="activePart" type="card">
            <el-tab-pane label="通讯联络网" name="first">
              <el-scrollbar style="height: 500px">
                <el-tree
                  v-if="visible"
                  :data="treeData"
                  @node-click="nodeClick"
                  node-key="id"
                  highlight-current
                  :default-expanded-keys="[indexKey]"
                ></el-tree>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>

          <!-- <div class="submit-btn">
          <el-button size="small" type="primary" @click="groupAppend"
            >新增分组</el-button
          >
        </div> -->
        </el-col>
        <el-col :span="9">
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
          <div class="candidate">
            <el-scrollbar style="height: 440px">
              <el-checkbox-group v-model="nameList">
                <el-checkbox
                  v-for="(person, index) in personList"
                  :disabled="checkedStatus"
                  :label="person.id"
                  :key="index"
                  @change="nameChanged(person)"
                  style="text-align: left"
                >
                  <span v-if="person.mobile != null">{{
                    person.name + '<' + person.mobile + '>'
                  }}</span>
                  <span v-else>{{ person.name }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </el-scrollbar>
            <el-pagination
              small
              @current-change="handleCurrentChange"
              :page-size="pageSize"
              :current-page="currentPage"
              layout="total, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
          <!-- <div class="submit-btn">
          <el-button size="small" type="primary" @click="handleAppend"
            >新增联系人</el-button
          >
        </div> -->
        </el-col>
        <el-col :span="7">
          <div class="candidate result" style="height: 540px">
            <div class="header">
              <span>选择结果</span>
            </div>
            <div style="padding-left: 10px; margin-top: 10px; text-align: left">
              <el-scrollbar style="height: 468px">
                <el-tag
                  v-for="choose in chooseList"
                  :key="choose.id"
                  closable
                  @close="chooseChanged(choose)"
                  style="text-align: left"
                >
                  <span v-if="choose.mobile != null || choose.mobile1 != null"
                    >{{ choose.name + '<'
                    }}{{ (choose.mobile || choose.mobile1) + '>' }}</span
                  >
                  <span v-else>{{ choose.name }}</span>
                </el-tag>
              </el-scrollbar>
            </div>
          </div>
          <div class="submit-btn">
            <el-button size="small" type="primary" @click="handleCommit"
              >确定</el-button
            >
            <el-button size="small" type="info" @click="visible = false"
              >取消</el-button
            >
          </div>
        </el-col>
      </el-row>

      <my-form
        ref="mychild"
        @fatherMethod="getList"
        :treeData="treeData"
      ></my-form>
      <Liaison-netSide ref="child" @childMethod="childMethod"></Liaison-netSide>
    </el-dialog>
  </div>
</template>

<script>
import Form from './LiaisonNetForm';
import LiaisonNetSide from './LiaisonNetSide';
export default {
  props: ['title', 'dynamicTag', 'limitNum', 'limitmenbers'],
  inject: ['reload'],
  components: {
    'my-form': Form,
    'Liaison-netSide': LiaisonNetSide,
  },
  data() {
    return {
      visible: false,
      activePart: 'first',
      search: '', //搜索
      topTreeID: 0, //树ID
      TreeName: '',
      parentID: '',
      parentName: '',
      treeData: [],
      chooseList: [],
      personList: [], // 所有联系人对象数组
      nameList: [], // 选中联系人id数组
      total: 0, //总条数
      currentPage: 1, // 当前页
      pageSize: 10,
      indexKey: 0,
      selectedNum: 0, // 联系人选中项
      checkedStatus: false, //选中状态
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-16
     * @description 联系人搜索
     */
    onSearch() {
      // bug8417 author:hexinting date:20201116
      this.currentPage = 1;
      this.pageSize = 10;
      this.getList(this.search,true);
      // this.searchGetList()
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
          this.$message.warning('联系人手机号码不能为空');
        }
      });
      this.nameList = value;
    },
    handleCommit() {
      this.$emit('childByValue', this.chooseList);
      this.visible = false;
    },
    nameChanged(obj) {
      obj.contacotrId = obj.id;
      console.log(this.chooseList);
      console.log(this.selectedNum, this.limitNum);
      //   石景山需求不能号码为空
      let id = obj.id;
      if (!obj.mobile1 && !obj.mobile2) {
        this.nameList = this.nameList.filter((v) => v != obj.id);
        this.$message.warning('联系人手机号码不能为空');
        return;
      }
      /* @limitNum  获取到的排班人员限制数
           @selectedNum 勾选的人数
           @checkedStatus 勾选状态
           @lastEditor  xry
           @lastDate   2020-9-17
        */
      // console.log(this.limitNum)
      // console.log(this.checkedStatus)
      let index = this.nameList.indexOf(id); // 判断是复选框取消选项还是选中选项
      if (index == -1) {
        // 该名字从选中项中删除
        for (let i in this.chooseList) {
          if (this.chooseList[i].id == id) {
            this.chooseList.splice(i, 1);
            this.selectedNum -= 1;
            console.log(this.selectedNum);
            break;
          }
        }
      } else {
        // 该名字添加到选中项中
        console.log(this.selectedNum);
        if (this.selectedNum < this.limitNum) {
          for (let i in this.personList) {
            if (this.personList[i].id == id) {
              let data = JSON.parse(JSON.stringify(this.personList[i])); // 复制姓名列表中的对象保存在选中人对象数组中
              this.chooseList.push(data);
              this.selectedNum += 1;
              console.log(this.selectedNum);
              // 当选中数等于限制数时禁用勾选
              if (this.selectedNum == this.limitNum) {
                this.checkedStatus = true;
                this.$message({
                  type: 'success',
                  message: '排班人员已达到要求,如有需要请在选择结果修改',
                });
              }
              return;
            }
          }
        }
      }
    },
    /*
     *@Description: 接收父组件传递过来的数据
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-09-27 16:40:23
     */

    // 点击标签删除按钮时删除标签
    chooseChanged(tag) {
      console.log(this.selectedNum, this.limitNum);
      this.chooseList.splice(this.chooseList.indexOf(tag), 1);
      let index = this.nameList.indexOf(tag.contacotrId);
      if (index !== -1) {
        this.nameList.splice(index, 1);
      }
      this.selectedNum -= 1;
      // 当选中数小于限制数时可以重新勾选
      if (this.selectedNum < this.limitNum) {
        this.checkedStatus = false;
      }
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-16
     * @description 点击树节点触发事件
     */
    nodeClick(data, node) {
      let id = data.id;
      this.topTreeID = id;
      this.TreeName = data.name;
      this.parentID = node.parent.data.id;
      this.parentName = node.parent.data.name;
      this.search = '';
      // bug8417 author:hexinting date:20201116
      this.currentPage = 1;
      this.pageSize = 10;
      this.getList();
    },
    searchGetList() {
      let id = this.topTreeID;
      let data = {
        groupId: id,
        key: this.search,
        page: '',
        size: '',
        type: 'phone',
        menuId: this.$store.state.menu.menuID,
      };
      let CallbackReload = this;
      this.$http(
        '/emergency/preparation/contactor/getList',
        data,
        CallbackReload,
      ).then((res) => {
        this.personList = res.data.data;
        this.total = res.data.totalElements;
      });
    },
    getList(search,isSearch=false) {
      let id = this.topTreeID;
      let params = {
        groupId: [id],
        limit: this.pageSize,
        page: this.currentPage,
        platformId: '',
      };
      if (search) {
        params.search = search;
      }
      if(isSearch&&isSearch===true){
        params.groupId = []
      }
      let CallbackReload = this;
      this.$http
        .post(
          window.SITE_CONFIG['baseUrl'] + '/mail/mailcontactor/list',
          params,
          CallbackReload,
        )
        .then((res) => {
          this.personList = res.data.data.list;
          this.total = res.data.data.totalPage;
        });
    },
    childFn() {
      this.dynamicTags();
      console.log('进入了子界面');
      console.log('子界面的接收数据：');
      console.log(this.limitmenbers);
      this.chooseList = [];

      // if (this.limitNum != 0) {
      //   this.limitNum = this.limitNum;
      // } else {
      //   this.limitNum = 0;
      // }
      this.checkedStatus = false;

      // this.$emit('changeLimit');
      this.selectedNum = 0;
      this.topTreeID = 0;
      this.currentPage = 1;
      let data = {
        platformId: '',
      };
      let CallbackReload = this;
      this.$http
        .get(
          window.SITE_CONFIG['baseUrl'] + '/mail/mailgroup/list',
          { params: data },
          CallbackReload,
        )
        .then((res) => {
          let data = [...res.data.data];
          data = JSON.parse(JSON.stringify(data).replace(/name/g, 'label'));
          this.treeData = data;
          this.topTreeID = data[0].id;
          this.getList();
          if (this.dynamicTag) {
            this.chooseList = JSON.parse(JSON.stringify(this.dynamicTag));
            let arrays = [];
            this.dynamicTag.forEach(function (data) {
              arrays.push(data.id);
            });
            this.nameList = arrays;
          }
        });
      // 进来时默认添加已选择的人员
      let tempdialoglimitMenbers = JSON.parse(
        localStorage.getItem('dialoglimitMenbers'),
      );
      console.log(tempdialoglimitMenbers);
      let tempChooseList = tempdialoglimitMenbers.appDutySubordinates;
      console.log(tempChooseList);
      if (tempChooseList) {
        for (let i = 0; i < tempChooseList.length; i++) {
          let obj = {
            name: tempChooseList[i].contacotrName,
            mobile: tempChooseList[i].contacotrMobile,
            ...tempChooseList[i],
          };
          this.chooseList.push(obj);
        }
      } else {
        this.chooseList = [];
      }
      if (tempChooseList && tempChooseList.length > 0) {
        this.selectedNum = tempChooseList.length;
        if (tempChooseList.length >= this.limitNum) {
          this.checkedStatus = true;
        }
      } else {
        this.checkedStatus = false;
        this.selectedNum = 0;
      }
      this.nameList = this.chooseList.reduce((pre, ele) => {
        pre.push(ele.contacotrId);
        return pre;
      }, []);
      console.log(this.chooseList);
    },
    dynamicTags() {
      this.chooseList = [];
      this.personList = [];
      this.nameList = [];
    },
    handleAppend() {
      //新增
      if (this.topTreeID == 0) {
        this.$message({
          type: 'warning',
          message: '请选择一个分组进行新增联系人',
        });
        return;
      }
      let data = {
        groups: [
          {
            id: this.topTreeID,
            name: this.TreeName,
          },
        ],
      };
      this.$refs.mychild.openModal(data, 'add');
    },
    groupAppend() {
      if (this.topTreeID == 0) {
        this.TreeName = this.treeData[0].name;
        this.parentID = '';
        this.parentName = '';
      }
      let data = {
        treeName: this.TreeName,
        treeID: this.topTreeID,
        parentID: this.parentID,
        parentName: this.parentName,
      };
      this.$refs.child.openModal(data, 'add');
    },
    childMethod(data) {
      this.childFn();
      this.topTreeID = data.treeID;
      this.indexKey = data.treeID;
      this.TreeName = data.treeName;
      this.parentName = data.parentName;
      this.treeName = data.treeName;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.paibanSearch_wrap {
  box-sizing: border-box;
}
.el-input >>> .el-input__inner {
  padding: 0 4px;
}

.candidate {
  height: 500px;
  border-radius: 5px;
  padding-top: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #303133;
  margin-top: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.selected {
  min-height: 380px;
}

.submit-btn {
  margin-top: 20px;
  text-align: center;
}

.create-btn {
  float: right;
  margin: 10px;
}

.el-checkbox-group >>> .el-checkbox {
  display: block;
  margin-top: 5px;
  margin-left: 10px;
}

.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-scrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}

.el-tree {
  min-width: 100%;
  display: inline-block !important;
}

.el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #c0c0c0;
}

.header {
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  padding: 12px 18px;
  color: #303133;
  font-size: 14px;
}
.result {
  margin: 0;
}
</style>