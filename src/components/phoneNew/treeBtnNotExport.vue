<!-- Authory xry
@date 2020-9-14
@goal 隐藏导出分组联系人-->
<template>
    <div>
      <div class="icpVIdeo-btn-box">
        <div style="display: flex;align-items: center;cursor: pointer;" @click="addGroup">
          <img :src="require('@/assets/icpImg/addTreeBtn.png')" style="width:1.3vw;" />
          <span
            style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left:3px;"
          >新增</span>
        </div>
  
        <div style="display: flex;align-items: center;cursor: pointer;" @click="multipleDeleteGroup">
          <img :src="require('@/assets/icpImg/deleteTreeBtn.png')" style="width:1.3vw;" />
          <span
            style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left:3px;"
          >删除</span>
        </div>
  
        <!-- <div style="display: flex;align-items: center;cursor: pointer;" @click="updateGroup">
          <img :src="require('@/assets/icpImg/editTreeBtn.png')" style="width:1.3vw;">
          <span style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left:3px;">编辑</span>
        </div>-->
  
        <!-- 2020.6.14导出功能先隐藏 -->
        <!-- <div style="display: flex;align-items: center;cursor: pointer;" @click="exportGroup">
          <img :src="require('@/assets/icpImg/exportTreeBtn.png')" style="width:1.3vw;" />
          <span
            style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left:3px;"
          >导出分组联系人</span>
        </div> -->
        <!-- 2020.6.14导出功能先隐藏 -->
        <!-- <el-button size="small" type="primary" @click="addGroup">新增</el-button>
        <el-button size="small" type="primary" @click="updateGroup">修改</el-button>
        <el-button size="small" type="primary" @click="deleteGroup">删除</el-button>-->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      tabPosition: {
        //切换的tab序列
        type: String,
        default: () => {
          return "";
        }
      },
      treeDataItems: {
        //多选勾选的项
        type: Array,
        default: () => {
          return [];
        }
      },
      treeDataItem: {
        //被选中的项
        type: Object,
        default: () => {
          return {};
        }
      },
      treeData: {
        //当前tree列表
        type: Array,
        default: () => {
          return [];
        }
      },
      formData: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        title: "",
        currentTreeData: JSON.stringify(this.treeData)
      };
    },
    created() {
      this.currentTreeData = JSON.parse(this.currentTreeData);
      this.currentTreeData.splice(0, 0, {
        id: 0,
        name: "顶级分组节点",
        parentId: 0
      });
    },
    mounted() {
      document
        .querySelector(".my-tree-box")
        .addEventListener("scroll", function(e) {
          document.querySelector(".icpVIdeo-btn-box").style.bottom =
            -document.querySelector(".my-tree-box").scrollTop + "px";
          // console.log("我滚动了",e,document.querySelector(".icpVIdeo-btn-box").parentElement.offsetTop,document.querySelector('.my-tree-box').scrollTop,document.querySelector(".icpVIdeo-btn-box").style.bottom)
        });
    },
    methods: {
      addGroup() {
        //新增
        let data = {
          key: true,
          title: "新增分组",
          data: this.treeDataItem,
          formData: this.formData,
          treeData: this.currentTreeData
        };
        this.$emit("changeDialog", data);
      },
      updateGroup() {
        //修改
        console.log(this.treeDataItem);
        if (
          this.treeDataItem.groupId == null ||
          this.treeDataItem.groupId == ""
        ) {
          this.$message({
            message: "请选中需要修改的分组!",
            type: "warning"
          });
          return;
        }
        if (this.treeDataItem.groupId == -1) {
          this.$message({
            message: "当前所选分组名称不能修改",
            type: "warning"
          });
          return;
        }
        let data = {
          key: true,
          title: "修改分组",
          data: this.treeDataItem,
          formData: this.formData,
          treeData: this.treeData
        };
        this.$emit("changeDialog", data);
      },
      deleteGroup() {
        //删除
        if (
          this.treeDataItem.groupId == null ||
          this.treeDataItem.groupId == ""
        ) {
          this.$message({
            message: "请选中需要删除的分组!",
            type: "warning"
          });
          return;
        }
        if (this.treeDataItem.groupId == -1) {
          this.$message({
            message: "当前所选分组名称不能删除",
            type: "warning"
          });
          return;
        }
        this.$confirm("删除当前分组?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let data = {
              id: this.treeDataItem.groupId,
              code: this.formData.code,
              operate: 2
            };
            this.$api.updateGroup(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.$emit("refreshData");
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!"
            });
          });
      },
      multipleDeleteGroup() {
        //删除
        if (this.treeDataItems.length == 0) {
          this.$message({
            message: "请勾选需要删除的分组!",
            type: "warning"
          });
          return;
        }
        console.log("删除操作："+JSON.stringify(this.treeDataItems))
        if(this.treeDataItems.length === 1 && this.treeDataItems[0].id === -1){
          this.$message({
            message: "当前所选分组名称不能删除",
            type: "warning"
          })
          return
        }
        // if (this.treeDataItem.groupId == -1) {
        //   this.$message({
        //     message: "当前所选分组名称不能删除",
        //     type: "warning"
        //   });
        //   return;
        // }
        this.$confirm("是否删除当前勾选分组?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if (
              this.tabPosition == "zhengwulianluowang" ||
              this.tabPosition == "duanxinfenzu" ||
              this.tabPosition == "chuanzhenfenzu" ||
              this.tabPosition == "jicenglianluowang" ||
              this.tabPosition == "beiqinlianluowang" ||
              this.tabPosition == "ziyuanlianluowang"
            ) {
              this.$http({
                url:
                  window.g.ApiUrl +
                  "/emergency/preparation/contactorGroup/delete",
                method: "post",
                data: {
                  ids: this.treeDataItems.map(item => {
                    return item.id;
                  })
                }
              }).then(({ data }) => {
                console.log("/emergency/preparation/contactorGroup/delete", data);
                if (data.errorcode != 0) {
                  this.$message({
                    message: data.msg,
                    type: "error"
                  });
                  return;
                }
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$emit("refreshData");
              });
            }
  
            if (this.tabPosition == "jiankongshipin") {
              this.$http({
                url: window.g.ApiUrl + "/eos/communication/video/deleteGroup",
                method: "post",
                data: {
                  groupIds: this.treeDataItems.map(item => {
                    return item.id;
                  })
                }
              }).then(({ data }) => {
                console.log("/eos/communication/video/deleteGroup", data);
                if (data.errorcode != 0) {
                  this.$message({
                    message: data.msg,
                    type: "error"
                  });
                  return;
                }
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$emit("refreshData");
              });
            }
  
            if (this.tabPosition == "huichangzhongduan") {
              this.$http({
                url: window.g.ApiUrl + "/eos/communication/terminal/deleteGroup",
                method: "post",
                data: {
                  groupIds: this.treeDataItems.map(item => {
                    return item.id;
                  })
                }
              }).then(({ data }) => {
                console.log("/eos/communication/terminal/deleteGroup", data);
                if (data.errorcode != 0) {
                  this.$message({
                    message: data.msg,
                    type: "error"
                  });
                  return;
                }
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$emit("refreshData");
              });
            }
  
            if (this.tabPosition == "jiqunfenzu") {
              this.$http({
                url: window.g.ApiUrl + "/eos/communication/groupTalk/deleteGroup",
                method: "post",
                data: {
                  groupIds: this.treeDataItems.map(item => {
                    return item.id;
                  })
                }
              }).then(({ data }) => {
                console.log("/eos/communication/groupTalk/deleteGroup", data);
                if (data.errorcode != 0) {
                  this.$message({
                    message: data.msg,
                    type: "error"
                  });
                  return;
                }
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$emit("refreshData");
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!"
            });
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .icpVIdeo-btn-box {
    background: rgba(249, 252, 255, 1);
    border-radius: 0px 0px 3px 3px;
    padding: 10px 0;
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    bottom: 0%;
    left: 0%;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    z-index: 30;
  }
  </style>
  