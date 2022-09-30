<!--@author：llp-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
    <div class="seTop">
    <div class="selectLeft">
        <div class="selectLL">
            <el-scrollbar class="my-tree-scroll">
            <!-- <el-input placeholder="输入关键字进行搜索" v-model="filterTextVideo"></el-input> -->
            <el-input
                placeholder="输入关键字进行搜索"
                v-model="myData1.filterTree"
                class="treeSearch"
                style="padding: 10px; box-sizing: border-box"
            >
            
            </el-input>
            <el-tree
                :data="myData1.treeData"
                @node-click="handleNodeClick"
                node-key="id"
                ref="tree1"
                highlight-current
                :filter-node-method="filterNode"
                :props="defaultProps"
                show-checkbox
                @check-change="handleCheckChange"
                @check="handleTreeCheck"
            >
            
            </el-tree>
            </el-scrollbar>
        </div>
        <div class="selectLR">
                <el-table
          v-loading="loading"
          element-loading-text="更新中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          ref="elTable1"
          :data="myData1.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-click="handleRowClick"
   
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData1.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
        </el-table>
         <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData1.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData1.total"
            :current-page="myData1.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
        </div>

    </div>
    <div class="selectRight">
        <div class="selectTop">已选设备</div>
        <div class="selectBot">
            <div @click="myDelete(item.id)" v-for="(item,index) in myData1.tableMultipleSelection" :key="index" class="selectItem">{{item.name}}  <span class="el-icon-close"></span></div>
        </div>
    </div>
    </div>


    <div class="saveSelectBtn" @click="saveVideoToGroup()">保存</div>

    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "videoDialog",
  data() {
    return {
      title: "视频设备信息",
      isDialogVisible: false,
      treeData: [],
        defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true,
      },
      loading: false, // 是否在加载中 更新分组，更新终端
      myData1: {
        //视频分组
        tableColumn: [
          {
            prop: "name",
            label: "设备名称",
          },
          {
            prop: "indexCode",
            label: "号码",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: -1,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
        tabPosition: 1,
    };
  },
  components: {
    Location,
  },
  created() {
    window.addEventListener("message", this.locationCallback);
    this.getVideoGroupTree();
        this.getVideoList()
  },
  beforeDestroy() {
    window.removeEventListener("message", this.locationCallback);
  },
  mounted() {
    this.getVideoGroupTree();
        this.$nextTick(() => {
      setTimeout(() => {
        this.$refs["tree" + this.tabPosition].setCheckedNodes(
          this.meetingTreeList["tree" + this.tabPosition]
        );
        console.log(
          "this.videoList是什么",
          this.$store,
          this.meetingTreeList,
          this.videoList
        );
        this.videoList.forEach((item) => {
          // console.log(
          //   "mounted里勾选表格item",
          //   item,
          //   this["myData" + this.tabPosition].tableData.filter(element => {
          //     return element.id == item.id;
          //   }),
          //   this["myData" + this.tabPosition].tableData
          // );
          if (
            this["myData" + this.tabPosition].tableData.filter((element) => {
              return element.id == item.id;
            }).length != 0
          ) {
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              })[0],
              true
            );
          }
        });
      }, 800);
    });
         this.getVideoList()
  },
  methods: {
      saveVideoToGroup(){
          let that = this
          let tempIdArr = []
            let tempArr = this.myData1.tableMultipleSelection
            for(let i = 0;i<tempArr.length;i++){
                tempIdArr.push(tempArr[i].id)
            }
            let data = {
                groupId:"-13",
                videoIds:[tempIdArr.toString()]
            }
          this.$http({
            url:
              window.g.ApiUrl +
              "/eos/communication/video/batchMoveInGroup?groupId=-13&videoIds="+tempIdArr.toString(),
            method: "get",
            // data:JSON.parse(JSON.stringify(data)) ,
          }).then((res) => {
                this.closeDialog()
             this.$message({
                message: "添加成功",
                type: "success",
                });
          })
      
      },
      
      /*
       *@Description: 删除
       *@MethodAuthor:  DGT
       *@param: {}
       *@Date: 2021-02-27 16:07:50
      */
     myDelete(id){
         let tempData = this.myData1.tableMultipleSelection
         for(let i = 0;i<tempData.length;i++){
             if(id == tempData[i].id){
                 this.myData1.tableMultipleSelection.splice(i,1)
             }
         }
            this.$store.commit("SET_COMEMBER", this.myData1.tableMultipleSelection);
     },
          handCurrentChange(val) {
      this["myData" + this.tabPosition].currentPage = val;
   this.getVideoList();
    },
    handSizeChange(val) {
      this["myData" + this.tabPosition].currentPage = 1; //跳转到第一页
      this["myData" + this.tabPosition].pageSize = val;
        this.getVideoList();
    },
       handleSelectionChange(val) {
      console.log("列表选中了什么", val, this.videoList);
      this.seletecdContacList = val;
      this["myData" + this.tabPosition].tableMultipleSelection = val;
    },
    handleSelect(selection, row) {
      console.log("---当前列表行勾选了什么selection, row", selection, row);
      console.log(this.videoList);
        if (
          selection.filter((item) => {
            return item.id == row.id;
          }).length == 0
        ) {
          //证明取消勾选
          var temporaryVideoList = this.videoList.filter((item) => {
            return item.id != row.id;
          });
          console.log("--长度--", temporaryVideoList.length);
          if (window.g.IsOpenLabProject) {
            let agentCode = sessionStorage.getItem("seat");
            temporaryVideoList.forEach((ele, ind) => {
              if (ele.agentCode) {
                temporaryVideoList.splice(ind, 1);
              }
            });
          }

          this.$store.commit("SET_COMEMBER", temporaryVideoList);
        } else {
          var temporaryVideoList = this.videoList;
          if (
            temporaryVideoList.filter((item) => {
              return item.id == row.id;
            }).length == 0
          ) {
            if (this.tabPosition == 1) {
              row.meetingType = "1";
              console.log("row: ", row);
            } else if (this.tabPosition == 2) {
              row.meetingType = "2";
            } else if (this.tabPosition == 7) {
              row.meetingType = "7";
            } else {
              row.meetingType = "";
            }
            row.isTableSelect = true;
            // temporaryVideoList.push(row)
            // this.$store.commit("SET_COMEMBER", temporaryVideoList);
          }
        }
      
    },
        selectAll(selection) {
      console.log("---tab", this.tabPosition);
      console.log("列表全选selection", selection);
      if (this.manageVisible) {
        if (
          this.tabPosition === 3 ||
          this.tabPosition === 4 ||
          this.tabPosition === 5 ||
          this.tabPosition === 6 ||
          this.tabPosition === 8
        ) {
          this.toggleRowSelection();
          this.disposeNumber(this["myData" + this.tabPosition].tableData);
        }
        var temporaryVideoList = this.videoList;
        if (selection.length != 0) {
          selection.forEach((item) => {
            if (this.tabPosition == 10) {
              if (!item.number) {
                this.$message.warning(
                  `${item.name || item.contactor}联系号码为空`
                );
                return;
              }
              if (
                temporaryVideoList.filter((element) => {
                  return (element.number || element.call) == item.call;
                }).length == 0
              ) {
                item.isTableSelect = true;
                temporaryVideoList.push(item);
                this.$store.commit("SET_COMEMBER", temporaryVideoList);
              }
            } else {
              if (
                temporaryVideoList.filter((element) => {
                  return element.id == item.id;
                }).length == 0
              ) {
                if (this.tabPosition == 1) {
                  item.meetingType = "1";
                  console.log("item: ", item);
                } else if (this.tabPosition == 2) {
                  item.meetingType = "2";
                } else if (this.tabPosition == 7) {
                  item.meetingType = "7";
                } else {
                  item.meetingType = "";
                }
                item.isTableSelect = true;
                this.talkCall1(item);
                // temporaryVideoList.push(item)
                // this.$store.commit("SET_COMEMBER", temporaryVideoList);
              }
            }
          });
        } else {
          if (this.tabPosition == 10) {
            this["myData" + this.tabPosition].tableData.forEach((item) => {
              temporaryVideoList = temporaryVideoList.filter((element) => {
                return (element.number || element.call) != item.id;
              });
              this.$store.commit("SET_COMEMBER", temporaryVideoList);
            });
          } else {
            this["myData" + this.tabPosition].tableData.forEach((item) => {
              temporaryVideoList = temporaryVideoList.filter((element) => {
                return element.id != item.id;
              });
              this.$store.commit("SET_COMEMBER", temporaryVideoList);
            });
          }
        }
      }
    },
       //表格行内单机方法
    handleRowClick(row) {
      this["myData" + this.tabPosition].rowData = row;
    },
          filterNode(value, data) {
      if (!value) return true;
      console.log(data.name);
      return data.name.indexOf(value) !== -1;
    },
       handleNodeClick(data, node) {
      console.log("----", data, node, this.tabPosition);
      if (this.tabPosition === 9 || this.tabPosition === 10) {
        this.tabPosition = 3;
      }
      this["myData" + this.tabPosition].currentPage = 1; //跳转到第一页
      this["myData" + this.tabPosition].groupId = data.id;
      this["myData" + this.tabPosition].treeDataItem = {
        groupId: data.id,
        currentGroupName: data.name,
      };
        this.getVideoList();
      this.$store.commit("setGroupId", data.id);
      this.groupId = data.id;
      sessionStorage.setItem("PID", data.parentId); // 修改分组要使用到
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(
        "---handleCheckChange树状分组选中了什么",
        data,
        checked,
        indeterminate
      );
      if (checked) {
        this["myData" + this.tabPosition].treeMultipleSelection.push(data);
        this.tableCheckStatus(true);
      } else {
        this["myData" + this.tabPosition].treeMultipleSelection = this[
          "myData" + this.tabPosition
        ].treeMultipleSelection.filter(function (elem) {
          return elem.id != data.id;
        });
        console.log(
          'this["myData" + this.tabPosition].treeMultipleSelection: ',
          this["myData" + this.tabPosition].treeMultipleSelection
        );
        // if (this['myData' + this.tabPosition].treeMultipleSelection.length === 0) {
        //   this.$store.commit('SET_COMEMBER',[]) //当树状分组未被选中时，清空选中的数据
        // }
        if (
          this["myData" + this.tabPosition].treeMultipleSelection.length === 0
        ) {
          this.$store.commit("SET_COMEMBER", []);
        }
        this.tableCheckStatus(false);
        return;
      }

      if (this.manageVisible) {
        console.log(
          "this['myData' + this.tabPosition].treeMultipleSelection是什么",
          this["myData" + this.tabPosition].treeMultipleSelection
        );
        // this.$bus.$emit('clearNumber')
        if (
          this["myData" + this.tabPosition].treeMultipleSelection.length == 0
        ) {
          // setTimeout(()=>{
          //   this.$bus.$emit('clearNumber')
          // },500)
          return false;
        }
        if (
          this.tabPosition == 3 ||
          this.tabPosition == 4 ||
          this.tabPosition == 8 ||
          this.tabPosition == 5 ||
          this.tabPosition == 11 ||
          this.tabPosition == 12
        ) {
          this.$http({
            url:
              window.g.ApiUrl +
              "/eos/communication/group/findAllContactorInGroupAndLowerGroup",
            method: "post",
            data: {
              type: "meeting",
              groupIds: this[
                "myData" + this.tabPosition
              ].treeMultipleSelection.map(function (elem) {
                return elem.id;
              }),
            },
          }).then((res) => {
            console.log(
              "/eos/communication/group/findAllContactorInGroupAndLowerGroup",
              res
            );
            if (res.data.data && res.data.data.length != 0) {
              // var temporaryVideoList = this.videoList.filter(item => {
              //   return item.isTableSelect == true;
              // });
              var temporaryVideoList = this.videoList;
              console.log("temporaryVideoList:", temporaryVideoList);
              res.data.data.forEach((item) => {
                // if(item.mobile){
                // this.talkCall1(item)
                // }
                if (
                  temporaryVideoList.filter((element) => {
                    return element.id == item.id;
                  }).length == 0
                ) {
                  if (this.tabPosition == 1) {
                    item.meetingType = "1";
                    console.log("item: ", item);
                  } else if (this.tabPosition == 2) {
                    item.meetingType = "2";
                  } else if (this.tabPosition == 7) {
                    item.meetingType = "7";
                  } else {
                    item.meetingType = "";
                  }
                  console.log("------item:", item);
                  this.talkCall1(item);
                  // temporaryVideoList.push(item)
                  // this.$store.commit("SET_COMEMBER", temporaryVideoList);
                }
              });
            }
          });
        }
        if (this.tabPosition == 1) {
          this.$http({
            url:
              window.g.ApiUrl + "/eos/communication/video/findAllVideoInGroup",
            method: "post",
            data: {
              groupIds: this[
                "myData" + this.tabPosition
              ].treeMultipleSelection.map(function (elem) {
                return elem.id;
              }),
            },
          }).then((res) => {
            console.log("/eos/communication/video/findAllVideoInGroup", res);
            if (res.data.data && res.data.data.length != 0) {
              // var temporaryVideoList = this.videoList.filter(item => {
              //   return item.isTableSelect == true;
              // });
              var temporaryVideoList = this.videoList;
              res.data.data.forEach((item) => {
                // this.talkCall1(item)
                if (
                  temporaryVideoList.filter((element) => {
                    return element.id == item.id;
                  }).length == 0
                ) {
                  if (this.tabPosition == 1) {
                    item.meetingType = "1";
                    console.log("item: ", item);
                  } else if (this.tabPosition == 2) {
                    item.meetingType = "2";
                  } else if (this.tabPosition == 7) {
                    item.meetingType = "7";
                  } else {
                    item.meetingType = "";
                  }
                  this.talkCall1(item);
                  // temporaryVideoList.push(item)
                  // this.$store.commit("SET_COMEMBER", temporaryVideoList);
                }
              });
            }
          });
        }
      }
    },
    //获取视频分组树
    getVideoGroupTree() {
      let data = {
        displayDefault: true,
      };
      this.$api.videoGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData1.treeData = res.data || [];
        console.log(this.myData1.treeData)
      });
    },
        handleTreeCheck(data, node) {
      console.log("handleTreeCheck树状分组选中了什么", data, node);
      this.getContactor(data, node);
      var temporaryMeetingTreeList = this.meetingTreeList;
      temporaryMeetingTreeList["tree" + this.tabPosition] = node.checkedNodes;
      this.$store.commit("setMeetingTreeList", temporaryMeetingTreeList);
    },
        //获取设备信息
    getVideoList() {
      this.myData1.rowData = null;
      let data = {};

      data = {
        groupId: this.myData1.groupId,
        page: this.myData1.currentPage,
        size: this.myData1.pageSize,
        searchText: this.myData1.searchText,
      };

      this.$api.getVideoList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }

        this.myData1.tableData = res.data.data || [];
        this.myData1.total = res.data.totalElements || 0;
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    //获取视频分组树并禁用
    getDisableVideoGroupTree() {
      let data = {
        displayDefault: false,
      };
      this.$api.videoGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        res.data.forEach((item) => {
          item["disabled"] = true;
          if (item.children.length !== 0) {
            item.children.forEach((item) => {
              item["disabled"] = true;
            });
          }
        });
        this.treeData = res.data;
      });
    },
    //显示视频详细信息
    showData(row) {
      this.videoForm.id = row.id;
      this.videoForm.name = row.name;
      this.videoForm.indexCode = row.indexCode;
      this.videoForm.deviceName = row.deviceName;
      this.videoForm.incidentSite = row.address;
      if (row.groupIds != 0) {
        this.groupIds = row.groupIds;
      }
    },
    //关闭模态框方法
    closeDialog() {
      this.isSave = true; //关闭模态框时重置保存与关闭按钮的状态
      this.isDialogVisible = false;
      this.$refs["elTable" + this.tabPosition].clearSelection();

    //   this.$nextTick(() => {
    //     this.$refs["videoForm"].resetFields();
    //     this.$refs.tree.setCheckedKeys([]);
    //   });
    },
  },
    computed: {
    ...mapGetters({
      videoList: "getConfMemberStatus1",
      videoNumber: "getvideoNumber",
      myVdcConfId: "getConfId",
      confStatus: "getConfStatus", //会议状态
      confType: "getVideoType", //会议类型
      meetingTreeList: "getMeetingTreeList", //会议树状分组队列
    }),
  },
    watch: {
    videoList(val) {
      console.log("清空列表勾选");
      this.$refs["elTable" + this.tabPosition].clearSelection();
      if (this.tabPosition == 10) {
        this.videoList.forEach((item) => {
          if (
            this["myData" + this.tabPosition].tableData.filter((element) => {
              return element.call == (item.number ? item.number : item.call);
            }).length != 0
          ) {
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.call == (item.number ? item.number : item.call);
              })[0],
              true
            );
          }
        });
      } else {
        this.videoList.forEach((item) => {
          if (
            this["myData" + this.tabPosition].tableData.filter((element) => {
              return element.id == item.id;
            }).length != 0
          ) {
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              })[0],
              true
            );
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.seTop{
    display: flex;
        width: 100%;
}
.saveSelectBtn{
    width: 80px;
    line-height: 30px;
    text-align: center;
    margin: 10px 10px;
    cursor: pointer;
    background-color: #409EFF;
    color: #fff;
    border-radius: 5px;
    float: right;
}
.selectItem{
    width: 45%;
    height: 30px;
    float: left;
    margin: 5px 8px;
    text-align: center;
    line-height: 30px;
    background: rgb(234, 234, 234);
    border-radius: 5px;
    cursor: pointer;
    position: relative;
}
.el-icon-close{
    position: absolute;
    right: 7px;
    top: 9px;
}
.selectTop{
height: 30px;
    border-bottom: 1px solid #DCDFE6;
    text-align: center;
    line-height: 30px;
}
.selectBot{
    height: 360px;
    overflow: auto
}
/deep/ .el-dialog__body{
    /* display: flex */
}
.selectLeft{
width: 60%;
    border: 1px solid #DCDFE6;
    display: flex;
    max-height: 400px;
    overflow-y: auto
}
.selectLL{
    width: 50%;
    height: 100%;
    border-right: 1px solid #DCDFE6;
}
.selectLR{
    width: 50%;
    height: 100%;
    overflow-x: hidden;
}
.selectRight{
    width: 40%;
    border: 1px solid #DCDFE6;
    min-height: 400px;
}
.tree {
  height: 240px;
  background-color: white;
  border: 1px solid rgba(211, 215, 219, 1);
}
.el-icon-preview {
  background: url(~@/assets/icpImg/preview.png) center no-repeat;
  background-size: cover;
}
.el-icon-preview:before {
  content: "替";
  font-size: 16px;
  visibility: hidden;
}
/deep/ [role="treeitem"] {
  margin: 6px 0px;
}
.treeSearch /deep/ .el-input__inner {
  background: rgb(234, 234, 234);
  border-radius: 12px;
  opacity: 0.52;
  height: 3vh;
}
.el-table /deep/ thead th,
.el-table /deep/ thead tr {
  background: rgba(249, 252, 255, 1) !important;
}
.treeSearch /deep/ .el-input__suffix {
  height: initial;
  right: 16px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}
.my-radio-box {
  height: 100%;
  position: relative;
}
.el-radio-button {
}
/*.my-radio-box .el-radio-button >>> .el-radio-button__inner {*/
/*  padding: 15px 30px;*/
/*  border-bottom: none;*/
/*}*/
.my-radio-box-main {
  position: relative;
  z-index: 30;
  margin-bottom: 10px;
  background: white;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
}
.my-radio-box >>> .el-radio-button__inner {
  padding: 14px 22px;
  font-size: 14px;
  color: #999999;
  border: none;
  border-bottom: 2px white solid;
  background: white !important;
  box-shadow: none !important;
}

.my-radio-box .is-active >>> .el-radio-button__inner {
  border-bottom: 2px #0091ff solid;
  color: #0091ff;
  border-radius: 0;
}
>>> .el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
}

.my-phone-main {
  box-sizing: border-box;
  height: calc(100vh - 175px);
  overflow: auto;
  display: flex;
}

.my-tree-box {
  height: initial;
  background-color: #fff;
  border-top: 1px solid rgba(211, 215, 219, 1);
  border-right: 1px solid rgba(211, 215, 219, 1);
  border-bottom: 1px solid rgba(211, 215, 219, 1);
  width: 26%;
  position: relative;
  min-width: 200px;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
}

.my-tree-scroll {
  height: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 20;
  max-height: 715px;
  padding-bottom: 40px;
}
.my-table-box {
  flex: 1;
  border-left: 10px solid #ebeef5;
  background: white;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
}
.el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content {
  background: #e5f4ff;
}
.pagination {
  padding: 16px 0;
  text-align: center;
}
.my-tree-input-box {
  padding: 10px 5px;
  position: absolute;
  top: -4px;
  left: 0;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  z-index: 30;
}

.filter-tree {
  width: 100%;
  box-sizing: border-box;
  padding-left: 10px;
  flex: 1;
}
.filter-tree /deep/ .el-tree-node__content {
  height: 32px !important;
}
.filter-tree /deep/ .el-tree-node__expand-icon {
  font-size: 17px;
  color: #8a8a8a;
  margin-right: 10px;
}
.filter-tree /deep/ .is-leaf.el-tree-node__expand-icon.el-icon-caret-right {
  margin-right: initial;
}
.filter-tree
  /deep/
  .el-tree-node
  .el-tree-node__content
  .el-tree-node__expand-icon:before {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  background: url("data:image/png;base64,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");
  background-size: 100% 100%;
}

.filter-tree
  /deep/
  .el-tree-node
  .el-tree-node__content
  .el-tree-node__expand-icon.is-leaf:before {
  width: 0;
}
/*一级菜单收缩显示*/
/deep/
  .filter-tree
  > .el-tree-node
  > .el-tree-node__content
  > .el-tree-node__expand-icon.is-leaf:before {
  margin-right: 20px;
}
/deep/ .filter-tree > .el-tree-node > .el-tree-node__content {
  background: none !important;
}
/deep/ .filter-tree .el-tree-node__label {
  font-size: 12px;
  letter-spacing: 1px;
  margin-top: -2px;
}
/deep/
  .filter-tree
  > .el-tree-node
  > .el-tree-node__content
  > .el-tree-node__label {
  margin-left: 25px;
  position: relative;
  font-size: 12px;
  letter-spacing: 1px;
}
/deep/
  .filter-tree
  > .el-tree-node
  > .el-tree-node__content
  > .el-tree-node__label::before {
  content: "";
  position: absolute;
  left: -25px;
  width: 17px;
  height: 17px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAmUlEQVQ4T+2TMQ4BYRCFv5e4gt0b2JtwAEdxAOfQ6DUS5WrcwNYShYZCFDqC7BMSksXm/yNK086bb15eZuS8tQU1EcbeISagvtqLDREl51kJqKr1HsqeOsthiFEDeI6tgGMtRF7L02z27iC099H3RS7S8dcA3wDz9EMGsQ44/QG/ySA5gxrRuVeFB7lIBlhd9HrOAaTvvzO6Ap8dRlHswtTSAAAAAElFTkSuQmCC");
  background-size: 100% 100%;
}
/deep/
  .filter-tree
  > .el-tree-node
  > .el-tree-node__content
  > .el-tree-node__expand-icon.expanded
  ~ span::before {
  content: "";
  position: absolute;
  left: -25px;
  width: 17px;
  height: 17px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAmUlEQVQ4T+2TMQ4BYRCFv5e4gt0b2JtwAEdxAOfQ6DUS5WrcwNYShYZCFDqC7BMSksXm/yNK086bb15eZuS8tQU1EcbeISagvtqLDREl51kJqKr1HsqeOsthiFEDeI6tgGMtRF7L02z27iC099H3RS7S8dcA3wDz9EMGsQ44/QG/ySA5gxrRuVeFB7lIBlhd9HrOAaTvvzO6Ap8dRlHswtTSAAAAAElFTkSuQmCC")
    no-repeat;
  background-size: 100% 100%;
}

.filter-tree /deep/ .changeImgOften:before {
  content: "";
  position: absolute;
  top: 0;
  left: -25px;
  width: 23px;
  height: 23px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAEXElEQVRYCe1Wz09UVxQ+586bARuJtSXVNnRTgQhC66pNRGustv+Alsamv3ZEURpIsQODeB0ydJQEI4iGrmqjJkW76KKbpk2jqQu7qRHGJjK2C0yVpmBttTAM795+58FMAGcYBhdNE8l37v3OuefXu+/O5RE9/vs/70C4t7NGH49uepRncB4l2LLqUMpa5NgOWRZ4WVEI0ieir7K1F0HJMm/V+4KXhOcrKt+AlD8e/GCKszVtKZ7vzPkGiL/uOfIys7kCPgSRHBusVa/oho9/hJ4XlrUDik3HbBVNRIcgxOyGZc5XpPu8YuTkW+IfyNK19v3BjRIc7o1eJaYXmezm9v2tl8W2VFFLdUz5oXhIOCuOMDPOH8NEnWIj4taZeeljzh2w1nLkZKTEneZS9vFLULuRfrhizbrK2tpaF5wGBgZ8P4/evA5ehiYaybjXfI6Nh/aGbkmTsGdFuoHIscizSZ/aoJhKDfE6bE2pJVuKSJFCzGngud9vbwh+njaAhHui71m2p0HnYhJKnInjhiiOvYoj502/a2KhxtBtrJEjg0jS4VVMdNoSPYd3iVcsVk9GMV7BdTOM9Ruk+IYZm/watnkw45PnuLjwHhlbjhzlzITdoPVwqkLRKsRiczz8hlrbYfca8OxQPHQcP1pmlPsdlOex8E0gwLXBuuA96MuGPqafZCcwgNKvI8mIVfSarm+Jg3tQ3jg7HPzwwLBPuTVQh/EUbySm7CmtdXqXYM8LEstOwcnZ4l7uucUl2bwGxNBW3zbiuGYLeAyym58uOCOJwPNCf3+/n54KnEXQbsiQ5JTc4POAnZ6npxV9qusZnp7+FoZqnOQLa/yr366rq0tCzwkpPpq8ew6/oF1wHrSOs0Pvaf4d/CFkbUA8dd/RtWy8M1EJ/Qs7lngHuzENnhVS/HZi7AyaroVTzCrfDl1/4A54RqiM1lmjBKL7bVDvQt6iVbQS86IYd8dXzhS3435rt0mOxQIWbcALHH3wJ2YpPKIbtXCo2dGyt0WavYWDVzQ1PpXzF5S7gdX+cpTzQ4YgSwJbEl+/Ki4syxWQswHl88n7xwPR9YXJwj2dW3RfdPNCO25SzxeHcCZ2ocMc3ZnDM1JDphpXKdbsIAYPKLzVKu7E7biJjaXDvZ9cxtdRqL2h9aI4KLKDuEeEVmM4D8mKnA0oqypxlZK1vlhH35EKPFUYshN3NSNrqqka/Fv8Ho1cgG87KYoRLn+s59yBnK8ACauQiMi6zcaYQRTfBf1X7Mq7+FluFBEuNsib4EPGtR+By2ubifWUzIM8ReYVWLu7u1f87U/cB001+gt4EEW/xH1gwNOArnBr7oQhCnkBInCLkgVFTU1NE6JkkkVfwV+BiQq2SiHwDv67HTJ/JD7TWk9BfwiwS0PnMX+ligs+wPk4DKe1953Eesw/QTJi0QbwvV2CT63gExPOiebm5gcZMywwogFp8NOurq6z/6yY3ocPmBK4ZG0Aa4/x3+7AvwS4jOUcrgwDAAAAAElFTkSuQmCC") !important;
  background-size: 90% 90% !important;
}
.filter-tree /deep/ .changeImgLately:before {
  content: "";
  position: absolute;
  top: 0;
  left: -25px;
  width: 23px;
  height: 23px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAADeklEQVRYCe1WbUtUQRQ+Z3ZdBUkJCkoLyvIHGPQDKhGMwDfyW0G/IPalFXW3ru6uYu4q+QOEom/mS1EEYdSHPlbQp6DCpFKCgigtXdc70zM3da97d7fVrU96ec6dM2fOOXNm5swL0e6302eAtzIBseHYQVOpFlLURMSHYbsfpPEFvw9MfNc03ZNGMPgZ9YJQUADGUP9xl1J9ilQbvApQPkgEMm4ydxm+znf5FHXbXwPoSUTb4PAmlMtBSdCYYjWh2PWqdJm+oU7JMtrL0qwTJFoQ5HnIPKBFVnwhHOiaAp8TnLMFDb2JqA9THQfLCGLMFBw0vJ2zlOczhvtrhJKDWKZWqElW5AsHum+Az4qcAUTifc0Y6TisUJA/m5PeREyhna76ux1+IvGYVzENol0H3xT2d90H70DW9TQGBg6h11vQFkQqmK1ztOUFbIbRcyeUBJbltk5g8A6gA4eMhHs1Auke0ORVf2gI5bYQ8nZh+ZQeeaUpqTebE5EpxBoeIaKLoBUpRADltsGMNDSVDw5SoEvRRFRvXbBpOAJwmbIJzQJJNIGEmwFfFMLB8FsksN4JLuxP7XuTP0cASJxGrYEc0EaaLZrSvvhspjNHAFA4BiLs8xe6/BfEQv7xJakm0587U4D6ARBRabLg43R9O1p2az/71vQkPfNJ9yqOFKpaa94oxAaXZqw9Xf6r3NrjafH/4ZwzwDSPBKz9KVLV6PINKCfso8yphIYll1m9NtI5VDdhTW6TKbIyn0nW2aRFsUKoE5YDpvdWafs5A2Dr4CDs4GabXnGs1Nc3UkDRg0xHjgBkqmQKSqvE1IpDqQZ8UYhcj9TCVzOcmEzqHspNEJtqqBgdHZ9gMArWI6RMKIWTAZXtQNsqF+uj3IPOR0P+0MdMP44AtIJMuXtQLoCaI4l+faGA3TqiQ30hTPw5WH4Xgq+hdMDlkEDwdHp64XRD/WtiagedOdVQn3zy6PEzNBUEPXJXZSk6ty4gTCG3h3zdL7MZczbhusz+IEEgdySLK7gfZinPp/MGSxeHSgtI4jr34kYdAZ8VeQPQFo4nmaJJBPNQKn5OiyszFRUV/EMuH2VBJ3HxN+Lu1wlXCtvin2RwYsGIG/uYSwKI9jIEZaB8WFJEI0ql4kbA+JpPUbfBpy4KI/2qsT3La2FVBdKYw09fu1t+lsNuFzt8Bn4DN8klCcjCu9UAAAAASUVORK5CYII=") !important;
  background-size: 90% 90% !important;
}
.filter-tree /deep/ .el-tree-node__expand-icon.is-leaf {
  color: transparent;
  cursor: default;
}
.filter-tree /deep/ .el-tree-node {
  margin-bottom: 5px;
}
.filter-tree /deep/ .el-tree-node__children .is-current::before {
  content: "";
  display: inline-block;
  width: 2px;
  height: 32px;
  background-color: #0091ff;
  position: absolute;
}
.filter-tree /deep/ .is-current > div:first-child {
  background: #ebf4fe;
  color: #0091ff;
}
.filter-tree /deep/ .is-current .changeImgOften:before {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAARCAYAAADHeGwwAAACRElEQVQ4T52UzW/ScBjHR2mBvq0da6GE4ODgBIziFk08ycX4ssR40Zh48LCb0X/Cv2A3/Qd208SbUS/EkwlyWZRkLotgxA4KAn0D0pXi89NgGIHS+Ts1/X2f5/O8/R7fksdTLpcDmUxm4PP5lmRZXovH4z+8mPq8iJBmOBy2ul3zjuP4q6urZBXDsKAXW08AXdcjDMPUIXrsL8xROx39uiBwnxZBPAFQ9B3D2BI4rogcVpvN2JogVAG4MIuFgHr919VoNPxh2hmCQmaPeZ5/6ZbFCcBoNPL3B4NdMhR6AEZ/7mzb/gKOHobD4c+TjjRNE0Ik+ZbA8c2x1rKOP1Yq326m02l9rD0BcOBomvmE59kXi2o7616WlWuxmIiy/ed3OgOnYRiSxLLK/wAURWFEUdTnAhqNRjQSiRy1Wq00CA9OA6lUFCmZFOWmpq1HOO5wZonQzzJEkRVFTVXVW9DA914g7bZxYWWF3jMMI8qybHPSZuYUoWaD6Njo9Z6yNP3cDaKq5u3lZeoNZM9IkmROa+eOqWVZOzCKXZIkn7kBdL13LxAgtoNBYmuWbi4AxvNnrVa7nEwmj9wApVKJ2NjY1P1+LHQqAJRpNDkNbhA37dwMpo2ggTdomn6HQP1+/z5FUa/GUKSFbwICsj31oFAo4Pl83oKNicHDu8uy1Ouh43z/ur9/LpvNQvXsPRzHz5um+QiW4C70yoAVfiaRSLQ9AZAInn2RIPAr4OwAepFLpVKDSWNU+4u5XBFWxSUAHALw7Kwy/gYs3/8SzCPghAAAAABJRU5ErkJggg==") !important;
  background-repeat: no-repeat;
  height: 17px !important;
}
.my-tree-box >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}

>>> .el-dropdown-menu__item {
  font-size: 12px;
}

.dropdownDiv {
  max-width: 250px;
  text-align: left;
}
</style>
