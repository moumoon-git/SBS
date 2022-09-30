<template>
  <div class="sms-tree" style="background-color: white;margin-right: 5px;padding:5px 0 10px;">
    <div>
      <header class="serchWrap">
        <img src="data:image/svg+xml;base64,PHN2ZyB0PSIxNTczMDE4OTAxNTE3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MDgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODQ1LjMxNjgxIDgwNC4yNzkwMzMgNjY5LjgwNjExNiA2MjguNzY4MzM5YzM5LjI5ODAyMS00Ny43OTIxMjUgNjAuNjg2Nzg4LTEwNy4yNTA4NDkgNjAuNjg2Nzg4LTE2OS45ODQ0MDkgMC03MS42MzcwMTgtMjcuOTM4NDM3LTEzOC45NzU4MTUtNzguNDkzNzA0LTE4OS42MzM0Mi01MC42NTc2MDUtNTAuNjU3NjA1LTExNy45OTY0MDItNzguNDkzNzA0LTE4OS42MzM0Mi03OC40OTM3MDRzLTEzOC45NzU4MTUgMjcuOTM4NDM3LTE4OS42MzM0MiA3OC40OTM3MDRjLTUwLjY1NzYwNSA1MC42NTc2MDUtNzguNDkzNzA0IDExNy45OTY0MDItNzguNDkzNzA0IDE4OS42MzM0MnMyNy45Mzg0MzcgMTM4Ljk3NTgxNSA3OC40OTM3MDQgMTg5LjYzMzQyYzUwLjY1NzYwNSA1MC42NTc2MDUgMTE3Ljk5NjQwMiA3OC40OTM3MDQgMTg5LjYzMzQyIDc4LjQ5MzcwNCA2NS4zOTQzNjMgMCAxMjcuMjA2ODc2LTIzLjIzMDg2MSAxNzYuMDIyMzg3LTY1LjkwNjA1NmwxNzQuOTk5MDAxIDE3NC45OTkwMDFjNC40MDA1NiA0LjQwMDU2IDEwLjEzMTUyMSA2LjU0OTY3IDE1Ljk2NDgyMSA2LjU0OTY3czExLjU2NDI2MS0yLjE0OTExMSAxNS45NjQ4MjEtNi41NDk2N0M4NTQuMTE3OTI5IDgyNy4zMDUyMTcgODU0LjExNzkyOSA4MTMuMDgwMTUyIDg0NS4zMTY4MSA4MDQuMjc5MDMzek0yMzkuMjY3NjM5IDQ1OC43ODM5M2MwLTEyMy4wMTA5OTMgMTAwLjA4NzE0OC0yMjMuMDk4MTQxIDIyMy4wOTgxNDEtMjIzLjA5ODE0MXMyMjMuMDk4MTQxIDEwMC4wODcxNDggMjIzLjA5ODE0MSAyMjMuMDk4MTQxLTEwMC4wODcxNDggMjIzLjA5ODE0MS0yMjMuMDk4MTQxIDIyMy4wOTgxNDFTMjM5LjI2NzYzOSA1ODEuNzk0OTIzIDIzOS4yNjc2MzkgNDU4Ljc4MzkzeiIgcC1pZD0iMzUwOSIgZmlsbD0iIzhhOGE4YSI+PC9wYXRoPjwvc3ZnPg==" class="searchIcon" alt />
        <input
          type="text"
          placeholder="请输入关键字搜索"
          v-model="keyword"
          class="search"
          @input="searchResult"
        />
      </header>

      <div class="tab">
        <ul>
          <!-- <li class="active">
                联系人分组
              </li>
              <li>
                短信分组
              </li>
              <li>
                应急分组
          </li>-->
          <li
            v-for="(item,index) in tabs"
            :key="index"
            @click="changeData(index)"
            :class="{'active':idx==index}"
          >{{item}}</li>
        </ul>
      </div>

      <!--           <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
      <!-- <div>
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:60%"></el-input>
      </div>-->
      <div
        id="tree"
        style="height:715px;padding: 0 30px;"
        v-if="idx === 0 && !keyword"
      >
        <div class="contact">
          <div>
            <img src="../../../../../../../assets/img/star.png" class="contactIcon" alt />
            <span style="font-size:13px;font-family:MicrosoftYaHei;" @click="commonlyUsed(1)">常用联系人</span>
          </div>
        </div>

        <div class="contact">
          <div>
            <img src="../../../../../../../assets/img/clock.png" class="contactIcon" alt />
            <span style="font-size:13px;font-family:MicrosoftYaHei;" @click="commonlyUsed(2)">最近联系人</span>
          </div>
        </div>
           
        <el-scrollbar
          wrap-class="list"
          wrap-style="color: red;height:100%;"
          view-class="view-box"
          :native="false"
        >
          <el-tree
            class="treeContact"
            draggable
            :default-expand-all="false"
            :data="list"
            :props="listProps"
            :default-checked-keys="checkedIds"
            node-key="id"
            style="padding-top: 10px;"
            current-node-key
            highlight-current
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree"
            v-if="!keyword"
          ></el-tree>
        </el-scrollbar>
      </div>

      <div
        id="tree"
        style="height:685px;padding: 0 30px"
        v-if="idx === 1 && !keyword"
      >
        <!-- <div class="contact">
          <div>
            <img src="../../../../../../../assets/img/star.png" class="contactIcon" alt />常用联系人
          </div>
          <el-checkbox></el-checkbox>
        </div>

        <div class="contact">
          <div>
            <img src="../../../../../../../assets/img/clock.png" class="contactIcon" alt />最近联系人
          </div>
          <el-checkbox></el-checkbox>
        </div>-->
          
        <div style="text-align:center">
        
          <el-button type="default" class="addGroup" @click="addGroup" v-if="operGroupVisiable" >新建分组</el-button>
        </div>

        <el-scrollbar
          wrap-class="list"
          wrap-style="color: red;max-height:572px;"
          view-class="view-box"
          :native="false"
        >
          <el-tree
            class="treeGroup"
            draggable
            :default-expand-all="false"
            :data="list"
            :props="listProps"
            :default-checked-keys="checkedIds"
            node-key="id"
            style="padding-top: 10px;"
            current-node-key
            highlight-current
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree"
          ></el-tree>
        </el-scrollbar>
      </div>

      <!-- 列表数据 -->
      <ul class="searchList">
        <template v-if="idx === 0">
          <li
            class="oneList"
            v-for="(item,index) in addressSearchArr"
            :class="{'bgc':listIdx==index}"
            @click="oneListHandle(index,item)"
            :key="index"
          >{{item.name}}</li>
        </template>
        <template v-if="idx === 1">
          <li
            class="oneList"
            v-for="(item,index) in SMSSearchArr"
            :class="{'bgc':listIdx==index}"
            @click="oneListHandle(index,item)"
            :key="index"
          >{{item.name}}</li>
        </template>
      </ul>

      <div style="text-align:center">
        <el-button
          class="setGrout"
          v-if="idx === 1 && !operGroupVisiable && !keyword"
          @click="operGroupVisiable = true"
        >修改短信分组</el-button>
        <el-button class="setGrout" v-if="idx===1 && operGroupVisiable" @click="back">返回</el-button>
      </div>
      <!-- <div class="drafts" @click="draftsHandle">
        <img src="../../../../../../../assets/img/drafts.png" style="width:28px;height:30px;" /> 草稿箱（
        <span style="color:red;">{{draftsArray.length}}</span> ）
      </div> -->
    </div>

    <!-- 新增 编辑 删除-->
    <add-edit-del-group ref="addGroupView" v-on="$listeners"></add-edit-del-group>

    <drafts ref="draftsView" @initDrafts="draftsInitData"></drafts>
  </div>
</template>

<script>
import drafts from "./drafts";
import bus from "@/views/common/js/eventBus";
import $ from "jquery";
import addEditDelGroup from "./add-edit-del-group";
import common from "@/views/common/js/debounce";
export default {
  name: "sms_send_tree",
  props: ["list", "listProps", "Treeexpansion"],
  components: {
    drafts,
    "add-edit-del-group": addEditDelGroup
  },
  data() {
    return {
      keyword: "", //关键字
      listIdx: "", //搜索索引值
      addressSearchArr: [], //搜索结果数据
      SMSSearchArr: [], //搜索结果数据
      exitContact: [], //组里联系人
      checkedIds: [], //当前选中的id数组
      tabs: ["通讯录分组", "短信分组"],
      idx: 0,

      addressessAllCheckArr: [], //存储所有通讯录分组全选的节点
      SMSAllCheckArr: [], //存储所有短信分组全选的节点

      clickTree: {}, //当前点中的树

      middleAllCheckedArr: [], //存储所有联系人全选的节点

      middleHalfCheckedArr: [], //存储所有联系人半选的节点

      operGroupVisiable: false ,//修改分组

      draftsArray: [],//草稿箱数组
    };
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree.filter(val);
    // }
  },
  created() {
    // 编辑
    window.editGroup = this.editGroup;
    // 删除
    window.del = this.del;

    this.searchDebounce = common._debounce(() => {
      if (this.keyword) {
        this.$http({
          url: this.$http.adornUrl("/message/messageGroup/searchAll"),
          method: "GET",
          params: this.$http.adornParams({
            search: this.keyword
          })
        }).then(({ data }) => {
          if (data.code === 0) {
            this.addressSearchArr = data.result.mailGroupList;
            this.SMSSearchArr = data.result.messageGroupList;
            bus.$emit("searchContact", data.result.mailContactorList);
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        this.$emit("changeData");
      }
    });

    this.draftsInitData() //初始化草稿箱
  },
  mounted() {
    bus.$off("allCheck")
    bus.$on("allCheck", () => {
      // this.middleAllCheckedArr.push(this.clickTree.id)
      let currentNode = this.$refs.tree.getNode(this.clickTree);
      let checkNum = currentNode.childNodes.filter(v => {
        return v.checked;
      }).length;
      if (
        currentNode.childNodes.length == 0 ||
        checkNum === currentNode.childNodes.length
      ) {
        this.allCheckStyle(currentNode.data);
        currentNode.checked = true;
      } else if (checkNum === 0) {
        this.halfCheckStyle(this.clickTree);
        this.selectedHalfParent(this.clickTree);
      } else if (checkNum > 0 && checkNum < currentNode.childNodes.length) {
        currentNode.checked = false;
        if (this.idx === 0) {
          this.addressessAllCheckArr.push(currentObj);
          this.addressessAllCheckArrWay();
        } else if (this.idx === 1) {
          this.SMSAllCheckArr.push(currentObj);
          this.SMSAllCheckArrWay();
        }
      }
    });

    bus.$off("noOrHalfCheck")
    bus.$on("noOrHalfCheck", newV => {
      let currentNode = this.$refs.tree.getNode(this.clickTree);
      let checkNum = currentNode.childNodes.filter(v => {
        return v.checked;
      }).length;
      if (newV) {
        this.middleHalfCheckedArr.push(this.clickTree.id);
        this.halfCheckStyle(currentNode.data);
        this.selectedHalfParent(currentNode.data, 1);
      } else {
        this.middleHalfCheckedArr = this.middleHalfCheckedArr.filter(
          v => v !== this.clickTree.id
        );
        if (checkNum === 0) {
          this.noCheckStyle(currentNode.data);
          this.noSelectedBrother(this.clickTree);
        } else if (checkNum == currentNode.childNodes.length) {
          this.halfCheckStyle(currentNode.data);
        }
      }
    });

    bus.$off('initDrafts')
    bus.$on('initDrafts',()=>{
      this.draftsInitData()
    })
  },
  methods: {
    addressessAllCheckArrWay() {
      let topGroup = this.addressessAllCheckArr.filter(v => {
        let currentNode = this.$refs.tree.getNode(v);
        // console.log(
        //   "currentNode++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
        //   currentNode
        // );
        return !currentNode.parent.checked;
      });
      bus.$emit("getAllCheck", topGroup, 0);
    },
    SMSAllCheckArrWay() {
      let topGroup = this.SMSAllCheckArr.filter(v => {
        let currentNode = this.$refs.tree.getNode(v);
        // console.log(
        //   "currentNode++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
        //   currentNode
        // );
        return !currentNode.parent.checked;
      });
      bus.$emit("getAllCheck", topGroup, 1);
    },
    clickDeal(currentObj, treeStatus) {
      let currentNode = this.$refs.tree.getNode(currentObj);
      // if(currentNode.checked && this.middleAllCheckedArr.indexOf(currentObj.id) !== -1){
      //       alert(currentNode.checked)
      //       currentNode.checked = false
      //       // treeStatus.checkedKeys.splice(treeStatus.checkedKeys.indexOf(currentObj.id),1);
      // }
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中
      // 选中本级节点
      if (selected !== -1) {
        for (let i = 0; i < $(".el-tree-node__label").length; i++) {
          if (
            $(".el-tree-node__label")
              .eq(i)
              .text() === currentNode.data.name
          ) {
            if (
              $($(".el-tree-node__label")[i])
                .siblings()
                .eq(1)
                .children("span")
                .children("span")
                .hasClass("half-check-style")
            ) {
              $($(".el-tree-node__label")[i])
                .siblings()
                .eq(1)
                .children("span")
                .children("span")
                .removeClass("half-check-style")
                .removeClass("no-check-style")
                .removeClass("no-bgc")
                .addClass("all-check-style");
            } else {
              $($(".el-tree-node__label")[i])
                .siblings()
                .eq(1)
                .children("span")
                .children("span")
                .removeClass("no-check-style")
                .removeClass("no-bgc")
                .addClass("all-check-style");
            }
          }
        }
        // 节点选中父节点选中状态
        this.selectedBrother(currentObj);
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true);
      } else {
        // 本级未选中
        for (let i = 0; i < $(".el-tree-node__label").length; i++) {
          if (
            $(".el-tree-node__label")
              .eq(i)
              .text() === currentNode.data.name
          ) {
            $($(".el-tree-node__label")[i])
              .siblings()
              .eq(1)
              .children("span")
              .children("span")
              .addClass("no-check-style")
              .addClass("no-bgc");
            if (this.idx === 0) {
              this.addressessAllCheckArr = this.addressessAllCheckArr.filter(
                v => v.id !== currentNode.data.id
              );
              this.addressessAllCheckArrWay();
            } else if (this.idx === 1) {
              this.SMSAllCheckArr = this.SMSAllCheckArr.filter(
                v => v.id !== currentNode.data.id
              );
              this.SMSAllCheckArrWay();
            }
          }
        }
        // 子节点不选中父节点状态改变
        this.selectedParent(currentObj);
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, false);
      }

      // 触发树型数据更新
      this.$emit("handleNodeClick", currentObj);
    },

    // 节点选中时兄弟节点状态
    selectedBrother(treeList) {
      let currentNode = this.$refs.tree.getNode(treeList);
      let childNodes = currentNode.parent.childNodes;
      let checkNum = childNodes.filter(v => {
        return v.checked;
      }).length;
      if (this.idx === 0) {
        if (
          checkNum > 0 &&
          checkNum <= childNodes.length &&
          !this.addressessAllCheckArr.find(
            v => v.id == currentNode.parent.data.id
          )
        ) {
          this.selectedHalfParent(treeList, 2);
        } else if (
          checkNum === childNodes.length &&
          this.addressessAllCheckArr.find(
            v => v.id == currentNode.parent.data.id
          )
        ) {
          this.selectedCheckParent(treeList, 2);
        }
      } else if (this.idx === 1) {
        if (
          checkNum > 0 &&
          checkNum <= childNodes.length &&
          !this.SMSAllCheckArr.find(v => v.id == currentNode.parent.data.id)
        ) {
          this.selectedHalfParent(treeList, 2);
        } else if (
          checkNum === childNodes.length &&
          this.SMSAllCheckArr.find(v => v.id == currentNode.parent.data.id)
        ) {
          this.selectedCheckParent(treeList, 2);
        }
      }
    },

    // 节点取消时兄弟节点状态
    noSelectedBrother(treeList) {
      let currentNode = this.$refs.tree.getNode(treeList);
      let childNodes = currentNode.parent.childNodes;
      let checkNum = childNodes.filter(v => {
        return v.checked;
      }).length;
      if (checkNum === 0) {
        this.selectedNoParent(treeList, 1);
      } else if (checkNum > 0 && checkNum <= childNodes.length) {
        this.selectedHalfParent(treeList, 1);
      }
    },

    // 节点取消时改变父节点状态
    selectedParent(treeList) {
      let currentNode = this.$refs.tree.getNode(treeList);
      let childNodes = currentNode.parent.childNodes;
      let checkNum = childNodes.filter(v => {
        return v.checked;
      }).length;
      if (this.idx === 0) {
        if (
          checkNum === 0 &&
          !this.addressessAllCheckArr.find(
            v => v.id === currentNode.parent.data.id
          )
        ) {
          this.selectedNoParent(treeList, 1);
        } else {
          this.selectedHalfParent(treeList, 1);
        }
      } else if (this.idx === 1) {
        if (
          checkNum === 0 &&
          !this.SMSAllCheckArr.find(v => v.id === currentNode.parent.data.id)
        ) {
          this.selectedNoParent(treeList, 1);
        } else {
          this.selectedHalfParent(treeList, 1);
        }
      }
    },

    // 父节点击时子节点的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.tree.setChecked(treeList.id, isSelected);
      // this.addressessAllCheckArr.push(`{${treeList.id}: true}`)
      // console.log(this.addressessAllCheckArr)
      if (isSelected) {
        this.selectedCheckChild(treeList);
      } else {
        this.selectedNoChild(treeList);
      }
      if (treeList.children) {
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected);
        }
      }
    },
    // 节点选中时父节点是否为全选状态
    selectedCheckParent(currentObj, type) {
      let currentNode = this.$refs.tree.getNode(currentObj);
      if (currentNode.parent.key !== undefined) {
        this.allCheckStyle(currentNode.parent.data);
        if (type === 1) {
          this.selectedCheckParent(currentNode.parent.data);
        } else if (type === 2) {
          this.selectedBrother(currentNode.parent.data);
        }
      }
    },

    allCheckStyle(nodeData) {
      for (let i = 0; i < $(".el-tree-node__label").length; i++) {
        if (
          $(".el-tree-node__label")
            .eq(i)
            .text() === nodeData.name
        ) {
          $($(".el-tree-node__label")[i])
            .siblings()
            .eq(1)
            .children("span")
            .children("span")
            .css({
              "background-color": "#0091FF",
              border: "1px solid #0091FF"
            })
            .removeClass("half-check-style")
            .removeClass("no-check-style")
            .removeClass("no-bgc")
            .addClass("all-check-style");
          if (this.idx === 0) {
            this.addressessAllCheckArr.push(nodeData);
            this.addressessAllCheckArrWay();
          } else if (this.idx === 1) {
            this.SMSAllCheckArr.push(nodeData);
            this.SMSAllCheckArrWay();
          }
        }
      }
    },

    // 节点选中时父节点是否为半选状态
    selectedHalfParent(currentObj, type) {
      let currentNode = this.$refs.tree.getNode(currentObj);
      if (currentNode.parent.key !== undefined) {
        this.halfCheckStyle(currentNode.parent.data);
        currentNode.parent.checked = false;
        if (type === 1) {
          this.selectedHalfParent(currentNode.parent.data);
        } else {
          this.selectedHalfParent(currentNode.parent.data);
        }
      }
    },
    halfCheckStyle(nodeData) {
      for (let i = 0; i < $(".el-tree-node__label").length; i++) {
        if (
          $(".el-tree-node__label")
            .eq(i)
            .text() === nodeData.name
        ) {
          $($(".el-tree-node__label")[i])
            .siblings()
            .eq(1)
            .children("span")
            .children("span")
            .css({
              "background-color": "#0091FF",
              border: "1px solid #0091FF"
            })
            .addClass("half-check-style")
            .removeClass("all-check-style")
            .removeClass("no-check-style")
            .removeClass("no-bgc");
        }
      }
    },

    // 节点选中时父节点是否为不选状态
    selectedNoParent(currentObj, type) {
      let currentNode = this.$refs.tree.getNode(currentObj);
      if (currentNode.parent.key !== undefined) {
        this.noCheckStyle(currentNode.parent.data);
        if (type === 1) {
          this.selectedNoParent(currentNode.parent.data, 1);
        } else {
          this.selectedBrother(currentNode.parent.data);
        }
      }
    },

    noCheckStyle(nodeData) {
      for (let i = 0; i < $(".el-tree-node__label").length; i++) {
        if (
          $(".el-tree-node__label")
            .eq(i)
            .text() === nodeData.name
        ) {
          $($(".el-tree-node__label")[i])
            .siblings()
            .eq(1)
            .children("span")
            .children("span")
            .addClass("no-check-style")
            .addClass("no-bgc")
            .removeClass("half-check-style");
          if (this.idx === 0) {
            this.addressessAllCheckArr = this.addressessAllCheckArr.filter(
              v => v.id !== nodeData.id
            );
            this.addressessAllCheckArrWay();
          } else if (this.idx === 1) {
            this.SMSAllCheckArr = this.SMSAllCheckArr.filter(
              v => v.id !== nodeData.id
            );
            this.SMSAllCheckArrWay();
          }
        }
      }
    },

    //父节点选中时子节点为全选状态
    selectedCheckChild(currentObj, type) {
      for (let i = 0; i < $(".el-tree-node__label").length; i++) {
        if (
          $(".el-tree-node__label")
            .eq(i)
            .text() === currentObj.name
        ) {
          $($(".el-tree-node__label")[i])
            .siblings()
            .eq(1)
            .children("span")
            .children("span")
            .css({
              "background-color": "#0091FF",
              border: "1px solid #0091FF"
            })
            .removeClass("half-check-style no-check-style no-bgc")
            .addClass("all-check-style");
          if (this.idx === 0) {
            this.addressessAllCheckArr.push(currentObj);
            this.addressessAllCheckArrWay();
          } else if (this.idx === 1) {
            this.SMSAllCheckArr.push(currentObj);
            this.SMSAllCheckArrWay();
          }
        }
      }
    },

    // 父节点取消时子节点为不选状态
    selectedNoChild(currentObj) {
      for (let i = 0; i < $(".el-tree-node__label").length; i++) {
        if (
          $(".el-tree-node__label")
            .eq(i)
            .text() === currentObj.name
        ) {
          $($(".el-tree-node__label")[i])
            .siblings()
            .eq(1)
            .children("span")
            .children("span")
            .addClass("no-check-style no-bgc")
            .removeClass("half-check-style");
          if (this.idx === 0) {
            this.addressessAllCheckArr = this.addressessAllCheckArr.filter(
              v => v.id !== currentObj.id
            );
            this.addressessAllCheckArrWay();
          } else if (this.idx === 1) {
            this.SMSAllCheckArr = this.SMSAllCheckArr.filter(
              v => v.id !== currentObj.id
            );
            this.SMSAllCheckArrWay();
          }
        }
      }
    },

    filterNode(value, data) {
      // console.log(value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //点击树形更新表格
    handleNodeClick(obj) {
      if ($(".opearation")) {
        $(".opearation").remove();
      }
      this.clickTree = obj;
      if (this.addressessAllCheckArr.find(v => v.id === obj.id)) {
        setTimeout(() => {
          // bus.$emit("handleCheckAllChange", true);
        }, 300);
      } else {
        setTimeout(() => {
          // bus.$emit("handleCheckAllChange", false);
        }, 300);
      }
      this.$emit("handleNodeClick", obj);
      this.currentTreeId = obj.id;

      setTimeout(() => {
        if (this.operGroupVisiable) {
          $(
            ".el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content"
          ).prepend(
            `<span style="position:absolute;right:35px;" class="opearation">
                  <i class="el-icon-edit edit"></i>
                  <i class="el-icon-delete del"></i>
              </span>`
          );
        }
        $(".edit").click(() => {
          this.$refs.addGroupView.getDataList(obj);
          $(".opearation").remove();
          event.stopPropagation();
        });
        $(".del").click(() => {
          this.$refs.addGroupView.delView(obj.id);
          event.stopPropagation();
        });
      });
    },
    changeData(index) {
      this.idx = index;
      this.$emit("changeData", index);
    },

    // 初始化草稿箱
    draftsInitData(){
       this.$http({
        url: this.$http.adornUrl(`/message/messagedraft/listdarft`),
        method: 'POST',
        data: this.$http.adornData({})
        }).then(({ data }) => {
            if(data.code === 0){
              this.draftsArray = data.data
            } else {
              this.$message.error(data.msg);
            }
        })
    },
    // 草稿箱试图
    draftsHandle() {
     this.$refs.draftsView.init()
    },

    // 隐藏编辑删除
    back() {
      this.operGroupVisiable = false;
      $(".opearation").remove();
    },

    // 新增
    addGroup() {
      $(".opearation").remove();
      this.$refs.addGroupView.getDataList("");
    },
    // 联系人搜索
    searchResult() {
      this.searchDebounce();
    },
    oneListHandle(idx, obj) {
      this.$emit("handleNodeClick", obj);
    },
    // 常用联系人
    commonlyUsed(type){
      this.$emit("getCommonlyUsed",type);
    }
  }
};
</script>

<style scoped lang="scss">
// 半选状态
/deep/ .half-check-style::after {
  top: 7px;
  background-color: white;
  height: 2px !important;
  border: none;
  left: 2px;
  width: 12px !important;
  content: "";
  display: block;
  position: absolute;
  transform: none !important;
}
// 全选状态
/deep/ .all-check-style::after {
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 7px !important;
  left: 5px;
  position: absolute;
  top: 1px;
  -webkit-transform: rotate(45deg) scaleY(1);
  transform: rotate(45deg) scaleY(1);
  width: 3px !important;
}
// 空选状态
/deep/ .no-check-style::after {
  content: "";
  border: none;
  border-left: 0;
  border-top: 0;
  height: 0;
  left: 0;
  position: absolute;
  top: 0;
  /* -webkit-transform: rotate(45deg) scaleY(0); */
  /* transform: rotate(45deg) scaleY(0); */
  width: 0px;
}
/deep/ .no-bgc {
  background: none !important;
  border: 1px solid rgba(0, 0, 0, 0.5) !important;
}

* {
  margin: 0;
  padding: 0;
}

.active {
  background-color: #01a9f2;
  color: #d1f9fb;
}
.tab {
  ul {
    width: 60%;
    list-style: none;
    display: flex;
    margin: 1vh auto;
    background-color: #eceff4;
    li {
      text-align: center;
      flex: 1;
      // height: 3.5vh;
      height: 35px;
      // min-height: 35px;
      // line-height: 3.5vh;
      line-height: 35px;
      font-size: 0.8vw;
      border-right: 1px solid lightblue;
      &:nth-child(1) {
        border: 1px solid lightblue;
        border-radius: 5px 0 0 5px;
      }
      &:last-child {
        border: 1px solid lightblue;
        border-left: 0;
        border-radius: 0 5px 5px 0;
      }
    }
  }
}

.bgc {
  background-color: #eceff4;
}

.serchWrap {
  padding: 10px 10px 3px;
  // min-height: 60px;
  // height: 7vh;
  display: flex;
  justify-content: space-between;
  position: relative;
  .searchIcon {
    width: 14px;
    position: absolute;
    top: 17px;
    right: 20px;
    z-index: 1;
  }
  .search {
    width: 100%;
    height: 24px;
    border: 1px solid #F4F4F4;
    background-color: #F4F4F4;
    border-radius: 12px;
    outline: none;
    padding-left: 8px;
    &::placeholder {
      color: #999999;
      font-size: 13px;
      font-family: MicrosoftYaHei;
    }
  }
  /deep/ .el-input--medium .el-input__inner {
    padding-left: 35px;
  }
}
.contact {
  display: flex;
  justify-content: space-between;
  padding: 0 15px 0 25px;
  .contactIcon {
    width: 20px;
    margin-right: 10px;
  }
}
.searchList {
  padding: 0 10px;
  list-style: none;
  .oneList {
  }
}

/deep/ .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0091FF;
  border-color: #0091FF;
}
/deep/ .el-checkbox .el-checkbox__inner {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  &::after {
    border-width: 3px;
    height: 9px;
    width: 4px;
  }
}

.el-tree {
  // background-color: #f9f9f9;
}

/deep/ .treeGroup .el-tree-node .el-tree-node__content .el-tree-node__label {
  font-size: 13px;
  width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &::before {
    content: "";
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 8px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAmUlEQVQ4T+2TMQ4BYRCFv5e4gt0b2JtwAEdxAOfQ6DUS5WrcwNYShYZCFDqC7BMSksXm/yNK086bb15eZuS8tQU1EcbeISagvtqLDREl51kJqKr1HsqeOsthiFEDeI6tgGMtRF7L02z27iC099H3RS7S8dcA3wDz9EMGsQ44/QG/ySA5gxrRuVeFB7lIBlhd9HrOAaTvvzO6Ap8dRlHswtTSAAAAAElFTkSuQmCC') no-repeat;
    background-size: 24px 24px;
    vertical-align: top;
  }
}
/deep/
  .treeGroup
  .el-tree-node
  .el-tree-node__content
  .el-tree-node__expand-icon.expanded ~ span::before {
  content: "";
  display: inline-block;
  width: 17px;
  height: 17px;
  margin-right: 8px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAADJ7fe0AAABGklEQVQ4T53OTygEcRjG8e+7Wyal9mLmphxkXNdSTsphW44O7o5KObgpxeYu5eQsN2057karXMlFm2wc/RllKZtGs79Xv9gobc3Me36ez/uI1vxnlEFAQe9ROcDJbslM452YJ1r19X9W71AWZfbmLI7TA7FV7YA0vhf2OGPKMtes/EUegDDO59+M2ZZSc7eLROTaBZxoKBlid5qwi9RxW5cgq4kROPlBzAre2zIqfgpkTbQ6auhvFxmIjlMAQGfSLjnHe91H2UmBvJB/ci2yjtuaBikmR/RQxoMF0frwFLmPU8BJjKguSSHYE73w5hGpJAZsweiITAS3FtlEZCMxIlqTfFCyPdEr+gi9MTKaiQ1p9pOjx2spY2znC9T+cke3vo5WAAAAAElFTkSuQmCC') no-repeat;
  background-size: 17px 17px;
  vertical-align: middle;
}
  /deep/
  .treeContact
  .el-tree-node
  .el-tree-node__content
  .el-tree-node__label{
    font-size: 13px;
    width: 65%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &::before {
      content: "";
      display: inline-block;
      width: 17px;
      height: 17px;
      margin-right: 8px;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAmUlEQVQ4T+2TMQ4BYRCFv5e4gt0b2JtwAEdxAOfQ6DUS5WrcwNYShYZCFDqC7BMSksXm/yNK086bb15eZuS8tQU1EcbeISagvtqLDREl51kJqKr1HsqeOsthiFEDeI6tgGMtRF7L02z27iC099H3RS7S8dcA3wDz9EMGsQ44/QG/ySA5gxrRuVeFB7lIBlhd9HrOAaTvvzO6Ap8dRlHswtTSAAAAAElFTkSuQmCC') no-repeat;
      background-size: 17px 17px;
      vertical-align: middle;
    }
  }

/deep/
  .treeContact
  .el-tree-node
  .el-tree-node__content
  .el-tree-node__expand-icon.expanded ~ span::before {
  content: "";
  display: inline-block;
  width: 17px;
  height: 17px;
  margin-right: 8px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAADJ7fe0AAABJklEQVQ4T53RPUgDQRAF4PcS8BCENOY6wUI82xgFK8EiREsLe0tBsLATBCP2IlhZi52ksDMoEWwVK0MwaOnPCf6AQSOXHWfRoAiB25tii2Xet8MOpRI8QtAP6Am5hXAPXnqDU7U3vYtVlMNAw/9LbpSc5/TVaRylC2Kj0gZY+56wSxmzzplG+S9yp62tOC//9phNFhvbHSRCppmHFw24IXZOaXWQKrLPFzr+sjMCHP8gZgn+66JuJkiArCgybNDbLKAvOkoAaKQ9bic5g/+yqzvYSoA8IfeQtciq/sek/kfBHZF9joZzlOrgBDLvJwp4zojIAvPhDuXcnwVZdgZswMgQx8Jri5QUWXNGKBXmwqLNUS7Rgw9/BClJxYYk/YmD+zpLMDbzBdd1ckiv8q08AAAAAElFTkSuQmCC') no-repeat;
  background-size: 17px 17px;
  vertical-align: middle;
}

/deep/
  .el-tree
  .el-tree-node
  .el-tree-node__content
  .el-checkbox
  .el-checkbox__input.is-checked
  .el-checkbox__inner {
  background-color: #0091FF;
  border-color: #0091FF;
}

/deep/
  .el-tree
  .el-tree-node
  .el-tree-node__content
  .el-checkbox
  .el-checkbox__input
  .el-checkbox__inner {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  &::after {
    border-width: 3px;
    height: 9px;
    width: 4px;
  }
}

/deep/ .el-tree .el-tree-node .el-tree-node__content > .el-checkbox {
  position: absolute;
  right: 15px;
  margin: 0;
}

/deep/
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #01a9f2;
  color: #d1f9fb;
}

.el-tree-node__expand-icon {
  color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
}

.addGroup {
  width: 100%;
  padding: 8px;
}

.drafts {
  text-align: center;
  margin: 10px 10px 0;
  background-color: rgba(245, 245, 245, 1);
  border-radius: 3px;
}
.setGrout {
  padding: 10px;
  background-color: #01a9f2;
  color: white;
  margin: 0 auto;
}
</style>
