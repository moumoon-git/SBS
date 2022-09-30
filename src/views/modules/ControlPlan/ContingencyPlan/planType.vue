<template>
  <div class="contingency-plan-plan-type">
    <div class="main">
      <div></div>
      <div class="contingency-plan__title">
        <span>预案类型</span>
        <span
          class="contingency-plan__title__add"
          @click="addPlanType"
        ></span>
      </div>
    </div>

    <div id="tree" class="sv-tree">
      <el-tree
        class="treeGroup"
        draggable
        :default-expand-all="false"
        :data="list"
        :props="listProps"
        :default-checked-keys="checkedIds"
        node-key="id"
        current-node-key
        highlight-current
        @node-click="handleNodeClick"
        ref="tree"
      >
        <template #default="{node}">
          <el-tooltip
            :content="node.label"
            effect="dark"
            placement="top"
          >
            <div class="contingency-plan-plan-type__tree__label">{{ node.label }}</div>
          </el-tooltip>
        </template>
      </el-tree>
    </div>

    <!-- 新增预案类型组 -->
    <add-plan-type ref="addPlanTypeView" @delGroup="delGroup" @saveOrEditGroup="saveOrEditGroup"></add-plan-type>
    <sv-dialog-hint
      ref="fail_updateGroup"
      type="fail"
      text="所属分组不能为自身，请重新选择所属分组"
    />
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import AddPlanType from "./AddPlanType";
import $ from "jquery";
import bus from "@/views/common/js/eventBus";

export default {
  props: {
    list: {
      type: Array
    },
    listProps: {
      type: Object
    }
  },
  components: {
    AddPlanType
  },
  data() {
    return {
      checkedIds: [1],

      currentTreeId: 0, //当前树Id
      parentId: 0 //当前树父节点Id
    };
  },
  methods: {
    handleNodeClick(obj) {
      // console.log(obj);
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
          children.forEach((item, index) => {
            findChilden(item, list);
          });
        }
      }
      // console.log(selectedNode);

      this.$emit("getContingencyPlan", selectedNode);

      setTimeout(() => {
        $(
          ".el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content"
        ).prepend(
          `<span style="position:absolute;right:10px;font-size:0;" class="opearation">
                  <i class="bianji"></i>
                  <i class="del"></i>
              </span>`
        );
        $(".bianji").click(() => {
          this.$refs.addPlanTypeView.getDataList(obj);
          event.stopPropagation();
        });
        $(".del").click(() => {
          this.$refs.addPlanTypeView.delView();
          event.stopPropagation();
        });
      });

      bus.$emit("ContingencyPlanId", obj.id);
    },
    // 添加预案分组
    addPlanType() {
      this.$refs.addPlanTypeView.getDataList();
    },

    // 新增或编辑组
    saveOrEditGroup(obj, id, name) {
      // console.log(obj, id, name);
      // 新增
      if (!obj) {
        this.$http({
          url: this.$http.adornUrl("/incidentplan/rpPlanGroup/save"),
          method: "post",
          data: this.$http.adornData({
            parentId: id ? id : 0,
            name
          })
        }).then(({ data }) => {
          // console.log(data)
          if (data && data.code == 0) {
            this.$message({
              message: "成功新增分组",
              type: "success"
            });
            this.$emit("initPlanType");
            this.currentTreeId = 0;
            //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        // 限制修改的所属分组不能为自身
        if (id === this.currentTreeId) {
          this.$refs.fail_updateGroup.visible = true;
          return;
        }
        // 编辑
        this.$http({
          url: this.$http.adornUrl("/incidentplan/rpPlanGroup/update"),
          method: "post",
          data: this.$http.adornData({
            /**
             * @author tanjinfeng
             * @desc BUG修复：编辑时上传的parentId不正确
             * @date 2020-11-05
             */
            // *****原来的代码
            // parentId: this.parentId,
            // *****修改的代码
            parentId: id ? id : 0,
            // *****结束
            id: this.currentTreeId,
            name
          })
        }).then(({ data }) => {
          // console.log(data)
          if (data && data.code == 0) {
            this.$message({
              message: "成功修改分组",
              type: "success"
            });
            this.$emit("initPlanType");
            //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 删除组
    delGroup() {
      this.$http({
        url: this.$http.adornUrl(`/incidentplan/rpPlanGroup/delete`),
        method: "post",
        data: this.$http.adornData(
          {
            ids: [this.currentTreeId.toString()]
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.$emit("refreshData");
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$emit("initPlanType");
        } else {
          this.$message({
            type: "info",
            message: "删除失败"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.contingency-plan-plan-type {
  width: 50%;

  &__tree__label {
    margin-right: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bianji,
  .del {
    width: 24px;
    height: 24px;
    display: inline-block;
    vertical-align: middle;

    &:active {
      position: relative;
      top: 1px;
    }
  }

  .bianji {
    background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM5My4wMDAwMDAsIC0zMDEuMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibWVudSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDM2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk5LjAwMDAwMCwgMTY3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzkuNzY2Miw1LjExMDggQzM5LjkxNTMxNDksNC45Njg4OTE2NyAzOS45OTk3MjAxLDQuNzcyMDQ3NjEgMzkuOTk5NzIwMSw0LjU2NjIgQzM5Ljk5OTcyMDEsNC4zNjAzNTIzOSAzOS45MTUzMTQ5LDQuMTYzNTA4MzMgMzkuNzY2Miw0LjAyMTYgTDM3Ljk3ODQsMi4yMzM4IEMzNy44MzY0OTE3LDIuMDg0Njg1MDcgMzcuNjM5NjQ3NiwyLjAwMDI3OTkyIDM3LjQzMzgsMi4wMDAyNzk5MiBDMzcuMjI3OTUyNCwyLjAwMDI3OTkyIDM3LjAzMTEwODMsMi4wODQ2ODUwNyAzNi44ODkyLDIuMjMzOCBMMzUuNDg5MiwzLjYzMzggTDM4LjQ0MzIsNi41ODc4IEwzOS43NjYyLDUuMTEwOCBMMzkuNzY2Miw1LjExMDggWiBNMjYsMTMuMDQ2IEwyNiwxNiBMMjguOTU1NCwxNiBMMzcuNTEwOCw3LjM2NjIgTDM0LjU1NjgsNC40MTIyIEwyNiwxMy4wNDMyIEwyNiwxMy4wNDYgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
    
    &:hover {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1NS4wMDAwMDAsIC0xOTYuMDAwMDAwKSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTXlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS4wMDAwMDAsIDg5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk2LjAwMDAwMCwgOS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTM5Ljc2NjIsNS4xMTA4IEMzOS45MTUzMTQ5LDQuOTY4ODkxNjcgMzkuOTk5NzIwMSw0Ljc3MjA0NzYxIDM5Ljk5OTcyMDEsNC41NjYyIEMzOS45OTk3MjAxLDQuMzYwMzUyMzkgMzkuOTE1MzE0OSw0LjE2MzUwODMzIDM5Ljc2NjIsNC4wMjE2IEwzNy45Nzg0LDIuMjMzOCBDMzcuODM2NDkxNywyLjA4NDY4NTA3IDM3LjYzOTY0NzYsMi4wMDAyNzk5MiAzNy40MzM4LDIuMDAwMjc5OTIgQzM3LjIyNzk1MjQsMi4wMDAyNzk5MiAzNy4wMzExMDgzLDIuMDg0Njg1MDcgMzYuODg5MiwyLjIzMzggTDM1LjQ4OTIsMy42MzM4IEwzOC40NDMyLDYuNTg3OCBMMzkuNzY2Miw1LjExMDggTDM5Ljc2NjIsNS4xMTA4IFogTTI2LDEzLjA0NiBMMjYsMTYgTDI4Ljk1NTQsMTYgTDM3LjUxMDgsNy4zNjYyIEwzNC41NTY4LDQuNDEyMiBMMjYsMTMuMDQzMiBMMjYsMTMuMDQ2IFoiIGlkPSLlvaLnirYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
    }
  }

  .del {
    background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2OS4wMDAwMDAsIC0zMDEuMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibWVudSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDM2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTkuMDAwMDAwLCAxNjcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy41MDExNzE0LDYgQzEzLjc3NzcwOTMsNi4wMDA5MTg1NSAxNC4wMDA4Njg3LDYuMjM3MTE3NTYgMTQsNi41Mjg2NzU3MiBMMTQsNi41Mjg2NzU3MiBMMTQsMTQuNDM1ODE0OSBDMTQsMTUuMzA4NjUyMiAxMy4zMjg3NzY3LDE2LjAxODE2NzggMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEwxMi41MDE3OTI0LDE2LjAxODE2NzggTDUuNTAwODM0MjksMTYuMDE4MTY3OCBDNC42NzM4NSwxNi4wMTgxNjc4IDQsMTUuMzA4NjUyMiA0LDE0LjQzNTgxNDkgTDQsMTQuNDM1ODE0OSBMNCw2LjUyMDM3NTk1IEM0LDYuMzc5MjE0MjMgNC4wNTMzOTM5Nyw2LjI0OTEyNDM1IDQuMTQ2MTQ4ODksNi4xNTAzOTY0NCBDNC4yNDA2NjE4Myw2LjA1MjU4NzA5IDQuMzY3NTUwMyw2IDQuNTAwNTY4NTEsNiBMNC41MDA1Njg1MSw2IFogTTEwLjUwMDc3Niw4IEMxMC4yMjM2NDEyLDggMTAsOC4yMDUyMzE4MiAxMCw4LjQ2MDU1MDY3IEwxMCw4LjQ2MDU1MDY3IEwxMCwxMy41NDAyNjgxIEMxMCwxMy43OTU1ODY5IDEwLjIyMzY0MTIsMTQgMTAuNTAwNzc2LDE0IEMxMC43NzYxNjQ2LDE0IDExLjAwMDY3ODksMTMuNzk1NTg2OSAxMS4wMDA2Nzg5LDEzLjU0MDI2ODEgTDExLjAwMDY2MzMsMTMuNTQwMjY4MSBMMTEuMDAwNjYzMyw4LjQ2MDU1MDY3IEMxMS4wMDA2NjMzLDguMjA2MDM2MiAxMC43NzcwMzc3LDggMTAuNTAwNzc2LDggWiBNNy41MDA3NzU5OSw4IEM3LjIyMzY0MTE3LDggNyw4LjIwNTIzMTgyIDcsOC40NjA1NTA2NyBMNyw4LjQ2MDU1MDY3IEw3LDEzLjU0MDI2ODEgQzcsMTMuNzk1NTg2OSA3LjIyMzY0MTE3LDE0IDcuNTAwNzc1OTksMTQgQzcuNzc2MTY0NTgsMTQgOC4wMDA2Nzg4NiwxMy43OTU1ODY5IDguMDAwNjc4ODYsMTMuNTQwMjY4MSBMOC4wMDA2NjMyNywxMy41NDAyNjgxIEw4LjAwMDY2MzI3LDguNDYwNTUwNjcgQzguMDAwNjYzMjcsOC4yMDYwMzYyIDcuNzc3MDM3NjksOCA3LjUwMDc3NTk5LDggWiBNMTEuMzM4MTcxMywyIEMxMi4xNjA5Njg2LDIgMTIuNTA0NjY0NSwyLjM1NTQ2ODkzIDEyLjUwNTUzNjksMy4wNjM2NDUxOSBMMTIuNTA1NTM2OSwzLjA2MzY0NTE5IEwxMi41MDU1MzY5LDMuOTkyNDE5MDggTDE1LjUwOTgzOTksMy45OTI0MTkwOCBDMTUuODM2NjEzMyw0LjA5NDEyNjIzIDE2LDQuMjU5MjY2NzMgMTYsNC40ODc4NDA2IEMxNiw0LjgzMDcwMTQgMTUuNzg0OTg4NCw1IDE1LjUwODk2NzUsNSBMMTUuNTA4OTY3NSw1IEwyLjQ5MTQ4MTEsNSBDMi4yMTU0NjAyMyw1IDIsNC43MjQ4OTk2IDIsNC40ODc4NDA2IEMyLDQuMjUxNTI4NDUgMi4yMTQ1ODc4OCwzLjk5MjQxOTA4IDIuNDkxNDgxMSwzLjk5MjQxOTA4IEwyLjQ5MTQ4MTEsMy45OTI0MTkwOCBMNS40OTg4NTQ2OCwzLjk5MjQxOTA4IEw1LjQ5ODg1NDY4LDMuMDYzNjQ1MTkgQzUuNDk4ODU0NjgsMi4zNTU0Njg5MyA1LjkxMDY3MzEyLDIgNi43Mzg3MjAxNiwyIEw2LjczODcyMDE2LDIgWiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');

    &:hover {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYzMS4wMDAwMDAsIC0xOTYuMDAwMDAwKSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTXlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS4wMDAwMDAsIDg5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTYuMDAwMDAwLCA5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuNTAxMTcxNCw2IEMxMy43Nzc3MDkzLDYuMDAwOTE4NTUgMTQuMDAwODY4Nyw2LjIzNzExNzU2IDE0LDYuNTI4Njc1NzIgTDE0LDYuNTI4Njc1NzIgTDE0LDE0LjQzNTgxNDkgQzE0LDE1LjMwODY1MjIgMTMuMzI4Nzc2NywxNi4wMTgxNjc4IDEyLjUwMTc5MjQsMTYuMDE4MTY3OCBMMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEw1LjUwMDgzNDI5LDE2LjAxODE2NzggQzQuNjczODUsMTYuMDE4MTY3OCA0LDE1LjMwODY1MjIgNCwxNC40MzU4MTQ5IEw0LDE0LjQzNTgxNDkgTDQsNi41MjAzNzU5NSBDNCw2LjM3OTIxNDIzIDQuMDUzMzkzOTcsNi4yNDkxMjQzNSA0LjE0NjE0ODg5LDYuMTUwMzk2NDQgQzQuMjQwNjYxODMsNi4wNTI1ODcwOSA0LjM2NzU1MDMsNiA0LjUwMDU2ODUxLDYgTDQuNTAwNTY4NTEsNiBaIE0xMC41MDA3NzYsOCBDMTAuMjIzNjQxMiw4IDEwLDguMjA1MjMxODIgMTAsOC40NjA1NTA2NyBMMTAsOC40NjA1NTA2NyBMMTAsMTMuNTQwMjY4MSBDMTAsMTMuNzk1NTg2OSAxMC4yMjM2NDEyLDE0IDEwLjUwMDc3NiwxNCBDMTAuNzc2MTY0NiwxNCAxMS4wMDA2Nzg5LDEzLjc5NTU4NjkgMTEuMDAwNjc4OSwxMy41NDAyNjgxIEwxMS4wMDA2NjMzLDEzLjU0MDI2ODEgTDExLjAwMDY2MzMsOC40NjA1NTA2NyBDMTEuMDAwNjYzMyw4LjIwNjAzNjIgMTAuNzc3MDM3Nyw4IDEwLjUwMDc3Niw4IFogTTcuNTAwNzc1OTksOCBDNy4yMjM2NDExNyw4IDcsOC4yMDUyMzE4MiA3LDguNDYwNTUwNjcgTDcsOC40NjA1NTA2NyBMNywxMy41NDAyNjgxIEM3LDEzLjc5NTU4NjkgNy4yMjM2NDExNywxNCA3LjUwMDc3NTk5LDE0IEM3Ljc3NjE2NDU4LDE0IDguMDAwNjc4ODYsMTMuNzk1NTg2OSA4LjAwMDY3ODg2LDEzLjU0MDI2ODEgTDguMDAwNjYzMjcsMTMuNTQwMjY4MSBMOC4wMDA2NjMyNyw4LjQ2MDU1MDY3IEM4LjAwMDY2MzI3LDguMjA2MDM2MiA3Ljc3NzAzNzY5LDggNy41MDA3NzU5OSw4IFogTTExLjMzODE3MTMsMiBDMTIuMTYwOTY4NiwyIDEyLjUwNDY2NDUsMi4zNTU0Njg5MyAxMi41MDU1MzY5LDMuMDYzNjQ1MTkgTDEyLjUwNTUzNjksMy4wNjM2NDUxOSBMMTIuNTA1NTM2OSwzLjk5MjQxOTA4IEwxNS41MDk4Mzk5LDMuOTkyNDE5MDggQzE1LjgzNjYxMzMsNC4wOTQxMjYyMyAxNiw0LjI1OTI2NjczIDE2LDQuNDg3ODQwNiBDMTYsNC44MzA3MDE0IDE1Ljc4NDk4ODQsNSAxNS41MDg5Njc1LDUgTDE1LjUwODk2NzUsNSBMMi40OTE0ODExLDUgQzIuMjE1NDYwMjMsNSAyLDQuNzI0ODk5NiAyLDQuNDg3ODQwNiBDMiw0LjI1MTUyODQ1IDIuMjE0NTg3ODgsMy45OTI0MTkwOCAyLjQ5MTQ4MTEsMy45OTI0MTkwOCBMMi40OTE0ODExLDMuOTkyNDE5MDggTDUuNDk4ODU0NjgsMy45OTI0MTkwOCBMNS40OTg4NTQ2OCwzLjA2MzY0NTE5IEM1LjQ5ODg1NDY4LDIuMzU1NDY4OTMgNS45MTA2NzMxMiwyIDYuNzM4NzIwMTYsMiBMNi43Mzg3MjAxNiwyIFoiIGlkPSLlvaLnirbnu5PlkIgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
    }
  }
}
</style>
