<template>
  <div
    :class="[
      'treebox',
      { left__collapse: leftCollaspe }]"
  >
    <div
      class="left__collapse__button"
      @click="leftCollaspe = !leftCollaspe;"
    />
    <!-- <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="searchTree()"
      style="position: relative;"
    >
      <el-form-item style="margin: 14px;">
        <el-input
          class="tree-search"
          prefix-icon="el-icon-search"
          placeholder="按enter搜索"
          v-model="dataForm.name"
          clearable
        ></el-input>
      </el-form-item>
    </el-form> -->
  <div class="warning-tree-search">
    <div
      class="el-icon-search warning-tree-search-icon"
      @click="searchTree"
    >
    </div>
    <input
      class="warning-tree-search-inner"
      placeholder="按enter搜索"
      v-model="dataForm.name"
      @keyup.enter="searchTree"
    >
    <div
      class="warning-tree-search-cancel el-icon-close"
      v-if="dataForm.name"
      @click="dataForm.name='';searchTree();"
    >
    </div>
  </div>

 
        <!-- <div   @click="allNodeClick" class="qqai" ><span  style="margin-left:50px">全部</span></div> -->
      <div class="patrol-tree-scroll">
        <el-tree
          :highlight-current="true"
          :default-expanded-keys="[0]"
          :show-checkbox="exportVisible"
          @node-click="handleNodeClick"
          :data="list"
          :props="listProps"
          :default-checked-keys="checkedIds"
          node-key="id"
          :current-node-key="0"
          @check="checkGroupNode"
          ref="tree"
        ></el-tree>
      </div>
  
  </div>
</template>

<script>
export default {
  props: ["list", "listProps", "Treeexpansion", "type", "exportVisible"],
  data() {
    return {
      leftCollaspe: false,
      isAll: false, // 是否点击全部
      dataForm: {
        name: ""
      },

      // v-if="btnVisible"
      // btnVisible: type,
      groupingcheckbox: [],
      currentTreeId: "",
      checkedIds: [] //当前选中的id数组
    };
  },
  methods: {
    //搜索Tree
    searchTree() {
      this.$emit("searchTree", this.dataForm.name);
    },

    //监听树形复选框的勾选id
    checkGroupNode(id, arr) {
      this.groupingcheckbox = arr.checkedKeys;
      // console.log("监听树形复选框的勾选id",this.groupingcheckbox,arr,id);
      this.$emit("setCheckedIds", arr.checkedKeys, arr.checkedNodes);
    },
    //点击树形更新表格
    handleNodeClick(obj) {
      if(obj.id == 0) {
        this.allNodeClick();
      } else {
        this.isAll = false;
        this.$emit("handleNodeClick", obj);
      }
      this.currentTreeId = obj.id;
      // console.log(this.currentTreeId)
      /*let groupId = obj.id
        //请求表格数据
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/list`),
          method: 'POST',
          params: this.$http.adornParams({
            groupId: groupId
          })
        }).then(({data}) => {
          this.platShareMenuList = data.data
        })*/
    },

    // 点击全部请求为所有节点
    allNodeClick() {
      this.isAll = true;
      this.$emit("getAll");
    }
  }
};
</script>

<style lang="less" scoped>
.left__collapse {
        width: 0px !important;
        margin-right: 0;
        // 除了折叠按钮，隐藏其余所有元素
        &>*:not(.left__collapse__button) {
            display: none;
        }
        .left__collapse__button {
            margin-right: -10px;
            z-index: 2;
            border-radius: 0;
            border-top-left-radius: 30px  50px  !important;
            border-bottom-left-radius: 30px 50px  !important;
            border-top-right-radius: 0px !important;
            border-bottom-right-radius: 0px  !important;
            transform: rotate(180deg);
            box-shadow: -1px 0px 5px rgba(54, 121, 225, 0.15)  !important;
            // margin-top: 400px;
        }
    }
.treebox {
  height: 100%;
  width: 300px;
  //border:1px solid #f4f4f4;
  border-radius: 4px ;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  background-color:#fff;
  font-family: PingFangSC-Regular, PingFang SC;
  position: relative;
  transition: width 0.3s ease;
   .left__collapse__button{
    width: 20px;
        height: 70px;
        background: #ffffff;
        border-top-right-radius: 30px  50px;
        border-bottom-right-radius: 30px 50px;
        box-shadow: 1px 0px 5px rgba(54, 121, 225, 0.15);
        position: absolute;
        right: -20px;
        top: calc(50% - 35px);
        cursor: pointer;
        transition: right 0.3s ease;
        z-index: 1;
        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            background: no-repeat url('../../../../../sinvieUI/img/tree/left_collapse_hover.svg') center/60% 20%;
        }
        &:hover::after{
            background-image: url('../../../../../sinvieUI/img/tree/left_collapse.svg');
        }
  }
  .treebox__wtf-normal {
    margin: 0 auto;
    width: 247px;
    height: 34px;
    box-sizing: border-box;
    padding: 2px 24px;
    text-align: left;
    line-height: 34px;
    color: #333333;
    font-weight: bold;

    &:hover {
      background-color: #f0f0f0;
      color: #666666;
    }
  }

  .treebox__wtf-click {
    margin: 0 auto;
    width: 247px;
    height: 34px;
    box-sizing: border-box;
    padding: 2px 24px;
    text-align: left;
    line-height: 34px;
    // &:extend(.treebox__wtf-normal);
    border-left: 2px solid rgba(0, 145, 255, 1);
    color: #333333;
    font-weight: bold;
    background-color: rgba(229, 244, 255, 1);
  }

 /deep/ input.el-input__inner {
    background-color: #fff !important;
    border-radius: 30px ;
  }
  .treebox__inp {
    width: 100%;
    min-width: 247px;
  }

  /deep/ .el-tree-node:focus > .el-tree-node__content {
   border-left:2px solid #0091FF !important;
  }

  .warning-tree-search {
    &:hover {
      border-color: #C0C4CC;
    }
    &:focus-within {
      border-color:rgba(0, 145, 255, 1);
    }
    margin: 20px auto;
    height: 40px;
    // width: 330px;
    width: calc(100% - 28px);
    border-radius: 21px;
    border:1px solid rgba(232,236,240,1);
    position: relative;
    .warning-tree-search-icon {
      font-size: 17px;
      font-weight: bold;
      width: 17px;
      height: 17px;
      color: rgba(153, 153, 153, 1);
      margin: 10px 0px 11px 18px;
      cursor: pointer;
    }
    .warning-tree-search-inner {
      border: none;
      outline: none;
      // width: 260px;
      width: calc(100% - 70px);
      font-size: 16px;
    }
    .warning-tree-search-cancel {
      width: 17px;
      height: 17px;
      line-height: 15px;
      font-size: 15px;
      text-align: center;
      border: 1px solid rgba(153, 153, 153, 1);
      color:rgba(153, 153, 153, 1);
      border-radius: 50%;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 11px;
    }
    .warning-tree-search-cancel:hover {
      color: rgba(153, 153, 153, 0.5);
      border-color: rgba(153, 153, 153, 0.5);
    }
  }
  .patrol-tree-scroll::-webkit-scrollbar {
    background: transparent;
    width: 5px;
  }
  .patrol-tree-scroll::-webkit-scrollbar-thumb {
    background: rgba(153, 153, 153, 1);
    border-radius: 20px;
  }
  .patrol-tree-scroll {
    overflow: auto;
    height: calc(100vh - 197px);
    /deep/.el-tree-node__content {
      height: 45px;
    }
    /deep/.el-tree-node__label {
      font-size: 14px;
    }
    /deep/.is-current>.el-tree-node__content {
      background: rgba(0, 145, 255, 0.1);
      border-left: 2px solid rgba(0, 145, 255, 1);
      color: rgba(0, 145, 255, 1);
    }
    /deep/.el-tree-node__content:hover {
      background: rgba(0, 145, 255, 0.1);
    }
  }
}
.treeClass {
  height: 720px;
  // margin-top: 8px;
  // border: 1px solid rgba(229, 229, 229, 1);
  background-color: #fff;
}
.treebox > .treeboxtop {
  line-height: 60px;
}
.treebox .el-tree-node__content {
  height: 35px;
  margin-left: 10px;
}


.qqai{
width:250px;  
height:35px;
margin-left:5px;

padding-top:5px;
padding-left:-100px;
cursor: pointer;
color:#333333;
}

.qqai:hover{
  background-color:#f4f4f4;
   border-left:2px solid #0091FF !important;
}
/deep/ .qqai:focus{
  border-left:2px solid #0091FF !important;

}

</style>
