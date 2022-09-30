<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="1000px"
    :visible.sync="visible"
  
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="80px"

    >
      <!--新增的-->
      <el-form-item label="上级平台" v-if="!dataForm.id" style="margin:10px 0px 10px 50px">
        <el-popover
          ref="myPlatFormListPopover"
          placement="bottom-start"
          trigger="click"
        >
          <el-tree
            class="parent_platform"
            :data="myPlatFormList"
            :props="myPlatFormListTreeProps"
            node-key="id"
            ref="myPlatFormListTree"
            @current-change="myPlatFormListTreeCurrentChangeHandle"
            
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="true"
          >
          </el-tree>

          <el-input
            v-model="dataForm.myPlatformName"
            slot="reference"
            :readonly="true"
            placeholder="点击上级平台"
            class="menu-list__input"
          ></el-input>
        </el-popover>
      </el-form-item>

      <!--修改的,不让它修改了-->
      <el-form-item label="上级平台" v-else style="margin:10px 0px 10px 50px">
        <el-input
          v-model="dataForm.myPlatformName"
          :readonly="true"
          placeholder="上级平台"
            
        ></el-input>
      </el-form-item>

      <!--新增的-->
      <!-- <el-form-item label="下级平台" v-if="!dataForm.id">
        <el-popover
          ref="linkagePlatFormListPopover"
          placement="bottom-start"
          trigger="click">
        

          <el-input type="textarea"
                    :rows="2"
                    v-model="linkagePlatformNameStr"
                    slot="reference"
                    :readonly="true"
                    placeholder="下级平台"
                    class="menu-list__input">
          </el-input>
        </el-popover>
      </el-form-item> -->

      <!--修改的,不让它修改了-->
      <!-- <el-form-item label="下级平台" v-else>
        <el-input v-model="dataForm.linkagePlatformName"
                  placeholder="下级平台"
                  :readonly="true">
        </el-input>
      </el-form-item> -->

      <el-form-item size="mini">
        <div class="tree_display">
          <div style="width: 400px; margin: 5px">
            <span class="tree_title">菜单</span>
            <el-tree
              class="tree_left"
              :data="menuList"
              :props="menuListTreeProps"
              node-key="menuId"
              ref="menuListTree"
              show-checkbox
            >
            </el-tree>
          </div>
          <div style="width: 400px; margin: 5px">
            <span class="tree_title">下级平台</span>
            <el-tree
              class="tree_right"
              show-checkbox
              :check-strictly="false"
              :data="linkagePlatFormList"
              :props="linkagePlatFormListTreeProps"
              node-key="id"
              ref="linkagePlatFormListTree"
              @current-change="linkagePlatFormListTreeCurrentChangeHandle"
              @check="linkagePlatFormCheckHandle"
              :default-expanded-keys="platformIdArray"
              :auto-expand-parent="true"
              :highlight-current="true"
            >
            </el-tree>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import Icon from "@/icons";
export default {
  data() {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error("菜单URL不能为空!"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      //菜单数据
      dataForm: {
        id: 0,
        type: 1,
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
        icon: "",
        iconList: [],

        //本级终端数据
        myPlatformId: 0,
        myPlatformTypeId: "",
        myPlatformName: "",
        myPlatformParentId: 0,
        myPlatformParentName: "",

        //联动终端数据
        linkagePlatformId: 0,
        linkagePlatformTypeId: "",
        linkagePlatformName: "",
        linkagePlatformParentId: 0,
        linkagePlatformParentName: "",
      },

      dataRule: {
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        /* parentName: [
             { required: true, message: '上级菜单不能为空', trigger: 'change' }
           ],*/
        url: [{ validator: validateUrl, trigger: "blur" }],
      },
      //菜单权限数据
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children",
      },

      //本级终端非树形数据
      linkagePlatformNameStr: "",
      platformIdArray: [],

      //本级终端树形数据
      myPlatFormList: [],
      myPlatFormListTreeProps: {
        label: "platformName",
        children: "children",
      },
      //联动终端数据
      linkagePlatFormList: [],
      linkagePlatFormListTreeProps: {
        label: "platformName",
        children: "children",
      },
    };
  },
  created() {
    this.iconList = Icon.getNameList();
  },
  actived() {
    document
      .querySelectorAll("div[role=tooltip]")
      [document.querySelectorAll("div[role=tooltip]").length - 1].setAttribute(
        "style",
        "height: 500px;overflow: auto;transform-origin: center top;z-index: 2147;position: fixed;top: 419px;left: 527px;"
      );
  },
  methods: {
    init(id, myPlatformId, linkagePlatformId) {
      //alert(id+"==="+myPlatformId+"===="+linkagePlatformId)
      this.dataForm.id = id || 0;
      this.$http({
        url: this.$http.adornUrl(`/sys/platformShare/list`),
        method: "get",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            console.log("本平数据", data);
            //本平台转成树形
            this.myPlatFormList = data.platformList;

            //其他平台转成树形
            this.linkagePlatFormList = data.platformList;
             console.log("this.linkagePlatFormList", this.linkagePlatFormList);
             if(this.dataForm.id){
            for (let i = 0; i < this.linkagePlatFormList.length; i++) {
              this.linkagePlatFormList[i].disabled = true;
              let tempChildren = this.linkagePlatFormList[i];
              hasChildren(tempChildren);
              function hasChildren(tempChildren) {
                if (tempChildren.children != null) {
                  tempChildren.children.forEach(item =>{
                    item.disabled =true
                     if(item.children != null) 
                     hasChildren(item);
                  })
                 
                }
                tempChildren.disabled = true;
              }
            }}
            console.log("this.linkagePlatFormList", this.linkagePlatFormList);
            //权限数据
            this.menuList = treeDataTranslate(data.menuList, "menuId");
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            //菜单表格
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (!this.dataForm.id) {
            //如果是新增
            // this.$nextTick(() => {
            //   //菜单表格
            //   this.$refs['dataForm'].resetFields()
            // })

            //本级终端
            this.dataForm.myPlatformId = "";
            this.dataForm.myPlatformTypeId = "";
            this.dataForm.myPlatformName = "";
            this.dataForm.myPlatformParentId = 0;
            this.dataForm.myPlatformParentName = "";

            //联动终端
            this.platformIdArray = [];
            this.dataForm.linkagePlatformId = "";
            this.dataForm.linkagePlatformTypeId = "";
            this.dataForm.linkagePlatformName = "";
            this.dataForm.linkagePlatformParentId = 0;
            this.dataForm.linkagePlatformParentName = "";

            this.linkagePlatformNameStr = "";

            //本级终端
            this.myPlatFormListTreeSetCurrentNode();
            //联动终端
            this.linkagePlatFormListTreeSetCurrentNode();
            //菜单
            this.menuListTreeSetCurrentNode();
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(
                `/sys/platformShare/info/${myPlatformId}/${linkagePlatformId}`
              ),
              method: "get",
              params: this.$http.adornParams(),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                //本级终端
                this.dataForm.myPlatformId = data.myPlatformEntity.id;
                this.dataForm.myPlatformTypeId =
                  data.myPlatformEntity.platformTypeId;
                this.dataForm.myPlatformName =
                  data.myPlatformEntity.platformName;
                this.dataForm.myPlatformParentId =
                  data.myPlatformEntity.parentId;
                this.dataForm.myPlatformParentName =
                  data.myPlatformEntity.platformParentName;
                //this.myPlatFormListTreeSetCurrentNode()

                //联动终端
                this.platformIdArray = [];
                this.dataForm.linkagePlatformId = data.linkagePlatformEntity.id;
                this.platformIdArray.push(data.linkagePlatformEntity.id);
                this.dataForm.linkagePlatformTypeId =
                  data.linkagePlatformEntity.platformTypeId;
                this.dataForm.linkagePlatformName =
                  data.linkagePlatformEntity.platformName;
                this.dataForm.linkagePlatformParentId =
                  data.linkagePlatformEntity.parentId;
                this.dataForm.linkagePlatformParentName =
                  data.linkagePlatformEntity.platformParentName;
                //this.linkagePlatFormListTreeSetCurrentNode()
                console.log("this.platformIdArray", this.platformIdArray);
                //权限菜单
                let menuIdList = data.menuIdList;

                let menuIdArray = [];

                for (let i = 0; i < menuIdList.length; i++) {
                  let getMenuId = menuIdList[i].menuId;
                  if (
                    getMenuId != null &&
                    getMenuId != "" &&
                    getMenuId != undefined
                  ) {
                    //解决同级出现问题
                    this.$refs.menuListTree.setChecked(getMenuId, true, false);
                    menuIdArray.push(getMenuId);
                  }
                }
                this.$refs.linkagePlatFormListTree.setChecked(
                  this.platformIdArray[0],
                  true,
                  false
                );
                // for(let i=0; i<this.linkagePlatFormList.length;i++)
                // {           let tempList = this.linkagePlatFormList[i]
                //          if(tempList.children!=null)
                //           {
                //             tempList.children.forEach(item =>{
                //                     if(item.id != this.platformIdArray[0])
                //                     {
                //                       this.disabledFn = false
                //                     }
                //                     else
                //                     this.disabledFn=true
                //             })
                //           }

                // }
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
    },

    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})["name"];
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.menuId;
      this.dataForm.parentName = data.name;
    },

    // 本级终端菜单树设置当前选中节点 (修改、增加时调用)
    myPlatFormListTreeSetCurrentNode() {
      this.$refs.myPlatFormListTree.setCurrentKey(this.dataForm.myPlatformId);
      this.dataForm.myPlatformName = (this.$refs.myPlatFormListTree.getCurrentNode() ||
        {})["platformName"];
    },

    // 本级终端菜单树选中
    myPlatFormListTreeCurrentChangeHandle(data, node) {
      this.dataForm.myPlatformId = data.id;
      this.dataForm.myPlatformName = data.platformName;
    },

    //联动终端菜单树设置当前选中节点
    linkagePlatFormListTreeSetCurrentNode() {
      this.$refs.linkagePlatFormListTree.setCurrentKey(
        this.dataForm.linkagePlatformId
      );
      this.dataForm.linkagePlatformName = (this.$refs.linkagePlatFormListTree.getCurrentNode() ||
        {})["platformName"];
    },

    // 联动终端菜单树选中
    linkagePlatFormListTreeCurrentChangeHandle(data, node) {
      // console.log(data);
      this.dataForm.linkagePlatformId = data.id;
      this.dataForm.linkagePlatformName = data.platformName;
      if (document.querySelectorAll("div[role=tooltip]")) {
        document
          .querySelectorAll("div[role=tooltip]")
          [
            document.querySelectorAll("div[role=tooltip]").length - 1
          ].setAttribute("style", "display:none;");
      }
    },

    //当复选框被点击的时候触发
    linkagePlatFormCheckHandle(data) {
      if (this.linkagePlatformNameStr.indexOf(data.platformName) > -1) {
        this.linkagePlatformNameStr = this.linkagePlatformNameStr.replace(
          data.platformName + "、",
          ""
        );
      } else {
        this.linkagePlatformNameStr =
          this.linkagePlatformNameStr + data.platformName + "、";
      }

      this.platformIdArray = [].concat(
        this.$refs.linkagePlatFormListTree.getCheckedKeys(),
        this.$refs.linkagePlatFormListTree.getHalfCheckedKeys()
      );
      console.log("this.platformIdArray", this.platformIdArray);
    },

    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/platformShare/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              //终端数据
              id: this.dataForm.id || undefined,
              myPlatformId: this.dataForm.myPlatformId,
              linkagePlatformIdArr: this.platformIdArray,

              //菜单数据
              platformMenuIdList: [].concat(
                this.$refs.menuListTree.getCheckedKeys(),
                this.$refs.menuListTree.getHalfCheckedKeys()
              ),
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>

/deep/ .el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 23px 3px rgba(201, 201, 201, 0.27);
  }
  //弹窗表头样式
  /deep/ .el-dialog__header {
    height: 40px;
    line-height: 40px;
    background-color: #f1f4f6;
    border-radius: 5px 5px 0px 0px;
    padding:0px;
   /deep/ .el-dialog__title{
      font-size:14px;
      padding-left:20px;
    }
    /deep/.el-dialog__headerbtn{
     top:0px;
    }
  }
  /deep/ .el-dialog__body {
    padding: 0px;
    /deep/.el-input {
      width:800px;
    }
    /deep/.el-input--medium .el-input__inner{
      height:30px;
      line-height: 30px;
      width:800px;
    }
  
  }

  .parent_platform{
      height: 400px;
    overflow: auto;
        &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
.tree_display {
  margin-left:-80px;
  display: flex;
  justify-content: space-around;
  .tree_title {
    text-align: center;
    display: inline-block;
    width: 400px;
    background-color: #409eff;
    color: #fff;
    border-radius: 4px 4px 0px 0px;
  }
  .tree_left {
    border: 1px solid #ebeef5;
    padding: 10px;
    height: 600px;
    overflow: auto;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
  .tree_right {
    border: 1px solid #ebeef5;
    padding: 10px;
    height: 600px;
    overflow: auto;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
}
// .el-tree {
//   // overflow-y: auto;
//   // overflow-x: scroll;
//   // height: 500px;
//   //border: 1px solid blue;
// }
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
  #el-popover-7226 {
    height: 500px !important;
    overflow: auto !important;
  }
}
</style>
