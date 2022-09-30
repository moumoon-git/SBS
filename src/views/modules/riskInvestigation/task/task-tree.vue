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
   <div class="warning-tree-search">
            <div
              class="el-icon-search warning-tree-search-icon"
              @click="searchTree"
            >
            </div>
            <input
              class="warning-tree-search-inner"
              placeholder="按enter搜索"
              v-model="dataForm.searchName"
              @keyup.enter="searchTree()"
            >
            <div
              class="warning-tree-search-cancel el-icon-close"
              v-if="dataForm.searchName"
              @click="dataForm.searchName='';searchTree();"
            >
            </div>
              <img v-if="!showOperationButton" class="taskTree-add"  src="../../../../assets/img/addTask.svg" @click="addTree" >
          </div>
    
    
    
    <div
      v-if="!type"
      style="margin-top: -19px;margin-bottom: 18px;cursor:pointer !important;height:31px;lineHeight:31px"
      @click="getAll"
      :class="selectAll?'selectAllColor':'paddingLeft'"
    >全部({{dataSelectedCount}})</div>
    <div class="treeClass">
      <!--<div
        v-if="type"
        @click="getAll"
        :class="selectAll?'selectAllColor':'paddingLeft'"
        style="padding-left: 46px;cursor: pointer;height:31px;lineHeight:31px"
      >全部</div>-->

      <!-- show-checkbox -->
      <!-- :expand-on-click-node="false" -->
      <el-tree
        
        :default-expanded-keys="[0]"
        @node-click="handleNodeClick"
        :data="list"
        :show-checkbox="boxVisible"
        :props="listProps"
        :default-checked-keys="checkedIds"
        node-key="id"
        :current-node-key="0"
        highlight-current
        @check="checkGroupNode"
        :filter-node-method="filterNode"
        ref="tree"
      >
        <span   style="width:500px;display:inline-block;margin-left:-70px;padding-left:70px;height:45px;line-height:45px" slot-scope="{ node }" 
         @mouseenter="hoverIndex=node.id" @mouseleave="hoverIndex=currentTreeId"> 
        <span>{{ node.label }}</span>
        <span style="position:absolute;right:0px;width:18px;padding-top:15px">
          
           <div v-if="hoverIndex==node.id && !showOperationButton" 
               @click="deleteTree()" 
               class="img1-hover"></div>
          <div   v-if="hoverIndex==node.id && !showOperationButton"  @click="updateTree()"  class="img2-hover"></div>
                  
        <!--  <div v-if="hoverIndex==node.id"    @click="addTree()" class="img3-hover"></div>-->
        </span>
      </span>
      
      </el-tree>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import bus from "@/views/common/js/eventBus";
export default {
  props: [
    "list",
    "listProps",
    "Treeexpansion",
    "type",
    "dataSelectedCount",
    "isAdd",
    "boxVisible",
    "showOperationButton"
  ],
  watch: {
    "dataForm.name": {
      handler: function (val) {
        console.log(val);
        this.$refs.tree.filter(val);
      },
    },
  },
  data() {
    return {
      leftCollaspe: false,
       hoverIndex:'',
      selectAll: true, //全部是否被选中
      dataForm: {
        name: "",
        searchName:"",
      },

      // v-if="btnVisible"
      // btnVisible: type,
      groupingcheckbox: [],
      currentTreeId: 0,
      parentId: 0,
      checkedIds: [], //当前选中的id数组
    };
  },
  methods: {
    //过滤器
    filterNode(value, data) {
      console.log("检查项目树过滤", value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //获取全部数据
    getAll() {
      this.selectAll = true;
      this.$emit("getAll", this.dataForm.name);
      this.$emit("getTreeList");
    },
    //搜索Tree
    searchTree() {
      this.$emit("searchTree", this.dataForm.searchName);
    },
    //添加Tree
    addTree() {
      this.$emit("addTree");
    },
    //修改Tree
    updateTree() {
      if (!this.currentTreeId) {
        this.$message.error("请选择一个分组!");
        return;
      }
      this.$emit("updateTree");
    },
    //删除Tree
    deleteTree() {
      if (this.groupingcheckbox.length == 0) {
        this.$message({
          message: "请选择要删除的分组!",
          type: "error",
          offset: 100,
        });
        return;
      }
      this.$emit("deleteTree", this.groupingcheckbox);
    },
    //监听树形复选框的勾选id
    checkGroupNode(id, arr) {
      this.groupingcheckbox = arr.checkedKeys;
      // console.log("监听树形复选框的勾选id",this.groupingcheckbox,arr,id);
      this.$emit("setCheckedIds", arr.checkedKeys, arr.checkedNodes);
    },
    //点击树形更新表格
    handleNodeClick(obj) {
      //this.isClick = false;
      // this.$emit("handleNodeClick", obj);
      this.selectAll = false;
      this.currentTreeId = obj.id;
      this.parentId = obj.parentId;
      if ($(".opearation")) {
        $(".opearation").remove();
      }
      let selectedNode = [];

      findChilden(obj, selectedNode);

      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        if (children != null) {
          console.log("chilren", children);
          children.forEach((item, index) => {
            findChilden(item, list);
          });
        }
      }

      this.groupingcheckbox = selectedNode;
      console.log("1111111111", selectedNode);
      this.$emit("handleNodeClick", obj);
      //if (this.type) {
       // setTimeout(() => {
       //   $(
       //     ".el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content"
       //   ).prepend(
        //    `<span style="position:absolute;right:35px;width:18px" class="opearation" >
           
        //      <img src="${require("../../../../assets/img/treeDel.svg")}" class="del"/>
        //          <img src="${require("../../../../assets/img/cmTreeEdit.svg")}" class="bianji"/>
       //     </span>`
        //  );
          //这里获取图片的路径要使用这种方式，否则打包会出现无法显示的问题
          // <img src="src//assets//img//treeDel.png" class="del"/>
          // <img src="src//assets//img//treeEdit.svg" class="bianji/>
          // $(".el-tree--highlight-current .el-tree-node__children").append(
          //   `
          //   <div style="position:absolute;right:35px;" class="opearation">

          //           <i class="el-icon-edit bianji">编辑</i>
          //           <i class="el-icon-delete del"></i>
          //       </div>`
          // );
        //  $(".bianji").click(() => {
            // this.$refs.addPlanTypeView.getDataList(obj);
            // event.stopPropagation();
       //     this.updateTree();
       //   });
      //    $(".del").click(() => {
            // this.$refs.addPlanTypeView.delView();
            // event.stopPropagation();
       ////     this.deleteTree();
      //    });
       // });
     // }

      bus.$emit("ContingencyPlanId", obj.id);
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
  },
};
</script>

<style lang="less" scoped >

.treebox {
  position: relative;
  transition: width 0.3s ease;
   background: white;
    height: 100%;
    width: 300px;
    box-shadow:0px 4px 14px 3px rgba(54, 121, 225,0.09);
    border-radius: 4px;
    font-family: PingFangSC-Regular, PingFang SC;
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
            background: no-repeat url('../../../../sinvieUI/img/tree/left_collapse_hover.svg') center/60% 20%;
        }
        &:hover::after{
            background-image: url('../../../../sinvieUI/img/tree/left_collapse.svg');
        }
  }
  
 .warning-tree-search {
      &:hover {
        border-color: #C0C4CC;
      }
      &:focus-within {
        border-color:rgba(0, 145, 255, 1);
      }
      
      height: 40px;
      width: calc(100% - 48px);
      border-radius: 21px;
      border:1px solid rgba(232,236,240,1);
      position: relative;
      margin: 20px 0px 20px 10px;
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
        width: calc(100% - 90px);
        font-size: 14px;
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
      .taskTree-add{
     position:absolute;
        width:17px;
        height:17px;
       margin-left:63px;
       margin-top:10px;
       cursor: pointer;
      }
      
      }
  .treeClass::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    .treeClass::-webkit-scrollbar-thumb {
      background: rgba(153, 153, 153, 1);
      border-radius: 20px;
    }
    .treeClass {
      overflow: auto;
       height: calc(100vh - 290px);
       .img1-hover{
            margin: 0 0;
              width: 18px;
              height: 19px;
              cursor: pointer;
              position:absolute;
              right:25px;
              background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwICg4ODEwMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aOO6Zmp5o6S5p+lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5qOA5p+l6aG555uuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzY3LjAwMDAwMCwgLTMxMi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibGVmdCI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Im1lbnUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTcuMDAwMDAwLCAxNjguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i5Yig6ZmkaWNvbiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1LjUwOTgzOTksMy45OTI0MTkwOCBMMTIuNTA1NTM2OSwzLjk5MjQxOTA4IEwxMi41MDU1MzY5LDMuMDYzNjQ1MTkgQzEyLjUwNDY2NDUsMi4zNTU0Njg5MyAxMi4xNjA5Njg2LDIgMTEuMzM4MTcxMywyIEw2LjczODcyMDE2LDIgQzUuOTEwNjczMTIsMiA1LjQ5ODg1NDY4LDIuMzU1NDY4OTMgNS40OTg4NTQ2OCwzLjA2MzY0NTE5IEw1LjQ5ODg1NDY4LDMuOTkyNDE5MDggTDIuNDkxNDgxMSwzLjk5MjQxOTA4IEMyLjIxNDU4Nzg4LDMuOTkyNDE5MDggMiw0LjI1MTUyODQ1IDIsNC40ODc4NDA2IEMyLDQuNzI0ODk5NiAyLjIxNTQ2MDIzLDUgMi40OTE0ODExLDUgTDE1LjUwODk2NzUsNSBDMTUuNzg0OTg4NCw1IDE2LDQuODMwNzAxNCAxNiw0LjQ4Nzg0MDYgQzE2LDQuMjU5MjY2NzMgMTUuODM2NjEzMyw0LjA5NDEyNjIzIDE1LjUwOTgzOTksMy45OTI0MTkwOCBaIE0xMy41MDExNzE0LDYgTDQuNTAwNTY4NTEsNiBDNC4zNjc1NTAzLDYgNC4yNDA2NjE4Myw2LjA1MjU4NzA5IDQuMTQ2MTQ4ODksNi4xNTAzOTY0NCBDNC4wNTMzOTM5Nyw2LjI0OTEyNDM1IDQsNi4zNzkyMTQyMyA0LDYuNTIwMzc1OTUgTDQsMTQuNDM1ODE0OSBDNCwxNS4zMDg2NTIyIDQuNjczODUsMTYuMDE4MTY3OCA1LjUwMDgzNDI5LDE2LjAxODE2NzggTDEyLjUwMTc5MjQsMTYuMDE4MTY3OCBDMTMuMzI4Nzc2NywxNi4wMTgxNjc4IDE0LDE1LjMwODY1MjIgMTQsMTQuNDM1ODE0OSBMMTQsNi41Mjg2NzU3MiBDMTQuMDAwODY4Nyw2LjIzNzExNzU2IDEzLjc3NzcwOTMsNi4wMDA5MTg1NSAxMy41MDExNzE0LDYgTDEzLjUwMTE3MTQsNiBaIiBpZD0iQ29tYmluZWQtU2hhcGUiIGZpbGw9IiM5RkM4RkUiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS4wMDA2Nzg5LDEzLjU0MDI2ODEgQzExLjAwMDY3ODksMTMuNzk1NTg2OSAxMC43NzYxNjQ2LDE0IDEwLjUwMDc3NiwxNCBDMTAuMjIzNjQxMiwxNCAxMCwxMy43OTU1ODY5IDEwLDEzLjU0MDI2ODEgTDEwLDguNDYwNTUwNjcgQzEwLDguMjA1MjMxODIgMTAuMjIzNjQxMiw4IDEwLjUwMDc3Niw4IEMxMC43NzcwMzc3LDggMTEuMDAwNjYzMyw4LjIwNjAzNjIgMTEuMDAwNjYzMyw4LjQ2MDU1MDY3IEwxMS4wMDA2NjMzLDEzLjU0MDI2ODEgTDExLjAwMDY3ODksMTMuNTQwMjY4MSBaIiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjAwMDY3ODg2LDEzLjU0MDI2ODEgQzguMDAwNjc4ODYsMTMuNzk1NTg2OSA3Ljc3NjE2NDU4LDE0IDcuNTAwNzc1OTksMTQgQzcuMjIzNjQxMTcsMTQgNywxMy43OTU1ODY5IDcsMTMuNTQwMjY4MSBMNyw4LjQ2MDU1MDY3IEM3LDguMjA1MjMxODIgNy4yMjM2NDExNyw4IDcuNTAwNzc1OTksOCBDNy43NzcwMzc2OSw4IDguMDAwNjYzMjcsOC4yMDYwMzYyIDguMDAwNjYzMjcsOC40NjA1NTA2NyBMOC4wMDA2NjMyNywxMy41NDAyNjgxIEw4LjAwMDY3ODg2LDEzLjU0MDI2ODEgWiIgaWQ9IlBhdGgtQ29weSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
              background-size: 100% 100%;          
       &:hover {                
               background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTU8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTguMDAwMDAwLCAtMzMwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzNC4wMDAwMDAsIDk4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTflpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2LjAwMDAwMCwgMTg2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzg0LjAwMDAwMCwgNDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUuNTA5ODM5OSwzLjk5MjQxOTA4IEwxMi41MDU1MzY5LDMuOTkyNDE5MDggTDEyLjUwNTUzNjksMy4wNjM2NDUxOSBDMTIuNTA0NjY0NSwyLjM1NTQ2ODkzIDEyLjE2MDk2ODYsMiAxMS4zMzgxNzEzLDIgTDYuNzM4NzIwMTYsMiBDNS45MTA2NzMxMiwyIDUuNDk4ODU0NjgsMi4zNTU0Njg5MyA1LjQ5ODg1NDY4LDMuMDYzNjQ1MTkgTDUuNDk4ODU0NjgsMy45OTI0MTkwOCBMMi40OTE0ODExLDMuOTkyNDE5MDggQzIuMjE0NTg3ODgsMy45OTI0MTkwOCAyLDQuMjUxNTI4NDUgMiw0LjQ4Nzg0MDYgQzIsNC43MjQ4OTk2IDIuMjE1NDYwMjMsNSAyLjQ5MTQ4MTEsNSBMMTUuNTA4OTY3NSw1IEMxNS43ODQ5ODg0LDUgMTYsNC44MzA3MDE0IDE2LDQuNDg3ODQwNiBDMTYsNC4yNTkyNjY3MyAxNS44MzY2MTMzLDQuMDk0MTI2MjMgMTUuNTA5ODM5OSwzLjk5MjQxOTA4IFogTTEzLjUwMTE3MTQsNiBMNC41MDA1Njg1MSw2IEM0LjM2NzU1MDMsNiA0LjI0MDY2MTgzLDYuMDUyNTg3MDkgNC4xNDYxNDg4OSw2LjE1MDM5NjQ0IEM0LjA1MzM5Mzk3LDYuMjQ5MTI0MzUgNCw2LjM3OTIxNDIzIDQsNi41MjAzNzU5NSBMNCwxNC40MzU4MTQ5IEM0LDE1LjMwODY1MjIgNC42NzM4NSwxNi4wMTgxNjc4IDUuNTAwODM0MjksMTYuMDE4MTY3OCBMMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEMxMy4zMjg3NzY3LDE2LjAxODE2NzggMTQsMTUuMzA4NjUyMiAxNCwxNC40MzU4MTQ5IEwxNCw2LjUyODY3NTcyIEMxNC4wMDA4Njg3LDYuMjM3MTE3NTYgMTMuNzc3NzA5Myw2LjAwMDkxODU1IDEzLjUwMTE3MTQsNiBMMTMuNTAxMTcxNCw2IFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuMDAwNjc4OSwxMy41NDAyNjgxIEMxMS4wMDA2Nzg5LDEzLjc5NTU4NjkgMTAuNzc2MTY0NiwxNCAxMC41MDA3NzYsMTQgQzEwLjIyMzY0MTIsMTQgMTAsMTMuNzk1NTg2OSAxMCwxMy41NDAyNjgxIEwxMCw4LjQ2MDU1MDY3IEMxMCw4LjIwNTIzMTgyIDEwLjIyMzY0MTIsOCAxMC41MDA3NzYsOCBDMTAuNzc3MDM3Nyw4IDExLjAwMDY2MzMsOC4yMDYwMzYyIDExLjAwMDY2MzMsOC40NjA1NTA2NyBMMTEuMDAwNjYzMywxMy41NDAyNjgxIEwxMS4wMDA2Nzg5LDEzLjU0MDI2ODEgWiIgaWQ9IlBhdGgiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjAwMDY3ODg2LDEzLjU0MDI2ODEgQzguMDAwNjc4ODYsMTMuNzk1NTg2OSA3Ljc3NjE2NDU4LDE0IDcuNTAwNzc1OTksMTQgQzcuMjIzNjQxMTcsMTQgNywxMy43OTU1ODY5IDcsMTMuNTQwMjY4MSBMNyw4LjQ2MDU1MDY3IEM3LDguMjA1MjMxODIgNy4yMjM2NDExNyw4IDcuNTAwNzc1OTksOCBDNy43NzcwMzc2OSw4IDguMDAwNjYzMjcsOC4yMDYwMzYyIDguMDAwNjYzMjcsOC40NjA1NTA2NyBMOC4wMDA2NjMyNywxMy41NDAyNjgxIEw4LjAwMDY3ODg2LDEzLjU0MDI2ODEgWiIgaWQ9IlBhdGgtQ29weSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
              }
       }
       .img2-hover{
            margin: 0 0;
              width: 18px;
              height: 19px;
              cursor: pointer;
              position:absolute;
              right:5px;
             background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwICg4ODEwMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aOO6Zmp5o6S5p+lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5qOA5p+l6aG555uuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzkzLjAwMDAwMCwgLTMxMi4wMDAwMDApIiBmaWxsPSIjOUZDOEZFIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i5bem5L6nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzAuMDAwMDAwLCA5OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJsZWZ0Ij4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0ibWVudSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDQ2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5Ny4wMDAwMDAsIDE2OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00MS43NjYyLDUuMTEwOCBDNDEuOTE1MzE0OSw0Ljk2ODg5MTY3IDQxLjk5OTcyMDEsNC43NzIwNDc2MSA0MS45OTk3MjAxLDQuNTY2MiBDNDEuOTk5NzIwMSw0LjM2MDM1MjM5IDQxLjkxNTMxNDksNC4xNjM1MDgzMyA0MS43NjYyLDQuMDIxNiBMMzkuOTc4NCwyLjIzMzggQzM5LjgzNjQ5MTcsMi4wODQ2ODUwNyAzOS42Mzk2NDc2LDIuMDAwMjc5OTIgMzkuNDMzOCwyLjAwMDI3OTkyIEMzOS4yMjc5NTI0LDIuMDAwMjc5OTIgMzkuMDMxMTA4MywyLjA4NDY4NTA3IDM4Ljg4OTIsMi4yMzM4IEwzNy40ODkyLDMuNjMzOCBMNDAuNDQzMiw2LjU4NzggTDQxLjc2NjIsNS4xMTA4IEw0MS43NjYyLDUuMTEwOCBaIE0yOCwxMy4wNDYgTDI4LDE2IEwzMC45NTU0LDE2IEwzOS41MTA4LDcuMzY2MiBMMzYuNTU2OCw0LjQxMjIgTDI4LDEzLjA0MzIgTDI4LDEzLjA0NiBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
              background-size: 100% 100%;          
       &:hover {                
               background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTQ8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyNzQuMDAwMDAwLCAtMzMwLjAwMDAwMCkiIGZpbGw9IiMwMDkxRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0LjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtN+Wkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTYuMDAwMDAwLCAxODYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3ODQuMDAwMDAwLCA0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Ljc2NjIsNS4xMTA4IEMxNS45MTUzMTQ5LDQuOTY4ODkxNjcgMTUuOTk5NzIwMSw0Ljc3MjA0NzYxIDE1Ljk5OTcyMDEsNC41NjYyIEMxNS45OTk3MjAxLDQuMzYwMzUyMzkgMTUuOTE1MzE0OSw0LjE2MzUwODMzIDE1Ljc2NjIsNC4wMjE2IEwxMy45Nzg0LDIuMjMzOCBDMTMuODM2NDkxNywyLjA4NDY4NTA3IDEzLjYzOTY0NzYsMi4wMDAyNzk5MiAxMy40MzM4LDIuMDAwMjc5OTIgQzEzLjIyNzk1MjQsMi4wMDAyNzk5MiAxMy4wMzExMDgzLDIuMDg0Njg1MDcgMTIuODg5MiwyLjIzMzggTDExLjQ4OTIsMy42MzM4IEwxNC40NDMyLDYuNTg3OCBMMTUuNzY2Miw1LjExMDggTDE1Ljc2NjIsNS4xMTA4IFogTTIsMTMuMDQ2IEwyLDE2IEw0Ljk1NTQsMTYgTDEzLjUxMDgsNy4zNjYyIEwxMC41NTY4LDQuNDEyMiBMMiwxMy4wNDMyIEwyLDEzLjA0NiBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
              }
       }
        .img3-hover{
            margin: 0 0;
              width: 18px;
              height: 19px;
              cursor: pointer;
              position:absolute;right:0px;
              background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+R3JvdXAgMTI8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2MS4wMDAwMDAsIC0zMTIuMDAwMDAwKSIgc3Ryb2tlPSIjOUZDOEZFIiBzdHJva2Utd2lkdGg9IjIiPgogICAgICAgICAgICA8ZyBpZD0i5bem5L6nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzAuMDAwMDAwLCA5OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJtZW51IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTEuMDAwMDAwLCAxNjguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLDkgTDE2LDkgTTksMiBMOSwxNiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
              background-size: 100% 100%;          
       &:hover {                
             background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+R3JvdXAgMTI8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM4OS4wMDAwMDAsIC0zMTIuMDAwMDAwKSIgc3Ryb2tlPSIjMDA5MUZGIiBzdHJva2Utd2lkdGg9IjIiPgogICAgICAgICAgICA8ZyBpZD0i5bem5L6nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzAuMDAwMDAwLCA5OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJtZW51IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTEy5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTkuMDAwMDAwLCAxNjguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLDkgTDE2LDkgTTksMiBMOSwxNiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
              }
       }
      /deep/.el-tree-node__content {
        height: 45px;
      }
      /deep/.el-tree-node__label {
        font-size: 14px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
      }
      /deep/.is-current  > .el-tree-node__content{
       background: rgba(0, 145, 255, 0.1);
        border-left: 2px solid rgba(0, 145, 255, 1);
        color: rgba(0, 145, 255, 1);
      }
      /deep/.el-tree-node__content:hover {
        background: rgba(0, 145, 255, 0.1);
      }
    }


}
.left__collapse {
        width: 0px ;
        margin-right: 0;
        // 除了折叠按钮，隐藏其余所有元素
        &>*:not(.left__collapse__button) {
            display: none;
        }
        .left__collapse__button {
            margin-right: -10px;
            z-index: 2;
            border-radius: 0;
            border-top-left-radius: 30px  50px  ;
            border-bottom-left-radius: 30px 50px  ;
            border-top-right-radius: 0px ;
            border-bottom-right-radius: 0px  ;
            transform: rotate(180deg);
            box-shadow: -1px 0px 5px rgba(54, 121, 225, 0.15);
            // margin-top: 400px;
        }
    }
.selectAllColor {
  background-color: #ebf6ff;
  border-left: 2px solid #0091ff;
  color:#0091ff;
}
.selectAllTreeColor {
  background-color: #ffffff;
  border-left: none;
}
</style>
