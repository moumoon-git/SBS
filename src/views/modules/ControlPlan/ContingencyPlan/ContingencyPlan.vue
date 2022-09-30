<template>
  <div class="contingency-plan">
    <div class="contingency-plan__left">
      <!-- 预案类型 -->
      <plan-type
        :list="modifiedUserList"
        :list-props="modifiedUserProps"
        @getContingencyPlan="getContingencyPlan"
        @initPlanType="initTree"
      />
      <!-- 预案列表 -->
      <reserve-plan
        :one-list="platShareMenuList"
        @getContingencyPlan="getContingencyPlan"
      />
    </div>
    <!-- 预案文档/组织架构 -->
    <detail />
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import bus from '@/views/common/js/eventBus';
import PlanType from './planType';
import ReservePlan from './ReservePlan';
import Detail from './Detail/Detail';

export default {
  components: {
    PlanType,
    ReservePlan,
    Detail,
  },
  data() {
    return {
      // 树形数据
      modifiedUserList: [],
      modifiedUserProps: {
        children: 'children',
        label: 'name',
      },

      // 分页
      page: 1,
      pageSize: 10,
      total: 0,

      platShareMenuList: [], // 节点列表数据
    };
  },
  created() {
    this.initTree();
  },
  mounted() {
    bus.$off('initTree');
    bus.$on('initTree', () => {
      this.$http({
        url: this.$http.adornUrl('/incidentplan/rpPlanGroup/listTree'),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.modifiedUserList = treeDataTranslate(data.data, 'id');
          // 初始化第一个分组的预案
          this.getContingencyPlan(this.modifiedUserList[0].id);
        } else {
          this.$message.error(data.msg);
        }
      });
    });
  },
  methods: {
    // 初始化树形数据
    initTree() {
      this.$http({
        url: this.$http.adornUrl('/incidentplan/rpPlanGroup/listTree'),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.modifiedUserList = treeDataTranslate(data.data, 'id');
          // 初始化第一个分组的预案
          this.getContingencyPlan(this.modifiedUserList[0].id);
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 获取预案列表
    getContingencyPlan(selectedNode) {
    //   console.log(selectedNode);
      this.$http({
        url: this.$http.adornUrl('/incidentplan/rpIncidentPlan/list'),
        method: 'post',
        data: this.$http.adornData({
          groupId: Array.isArray(selectedNode) ? selectedNode : [selectedNode],
        }),
      }).then(({ data }) => {
        // console.log(data)
        if (data && data.code == 0) {
          this.platShareMenuList = data.data;
          //
          // if (data.data.length>0) {
          bus.$emit('showDetail', this.platShareMenuList.length > 0 ? this.platShareMenuList[0].id : '');
          // }
        } else {
          this.platShareMenuList = [];
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.contingency-plan {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    font-size: 14px;

    & > div {
        height: 100%;
        overflow: hidden;
        background: white;
        border-radius: 4px;
        box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
    }

    &__left {
        display: flex;
        width: 600px;
        flex-grow: 0;
        flex-shrink: 0;
    }

    &__title {
        font-weight: bold;
        font-size: 16px;
        line-height: 16px;
        color: #333333;
        border-left: 3px solid #0091FF;
        padding-left: 10px;
        margin: 15px 10px;

        &__add {
            display: inline-block;
            float: right;
            width: 16px;
            height: 16px;
            cursor: pointer;
            background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTIgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5b2i54q257uT5ZCIPC90aXRsZT4KICAgIDxnIGlkPSLnu7zlkIjkv53pmpwiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLlupTmgKXpooTmoYjlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MDMuMDAwMDAwLCAtMTEwLjAwMDAwMCkiIHN0cm9rZT0iIzlGQzhGRSIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIzMy4wMDAwMDAsIDEyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDYgTDEyLDYgTTYsNy4xMDU0MjczNmUtMTUgTDYsMTIiIGlkPSLlvaLnirbnu5PlkIgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');

            &:hover {
                background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTIgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5b2i54q257uT5ZCIPC90aXRsZT4KICAgIDxnIGlkPSLnu7zlkIjkv53pmpwiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLlupTmgKXpooTmoYjlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02NjYuMDAwMDAwLCAtMTEwLjAwMDAwMCkiIHN0cm9rZT0iIzAwOTFGRiIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ5Ni4wMDAwMDAsIDEyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDYgTDEyLDYgTTYsNy4xMDU0MjczNmUtMTUgTDYsMTIiIGlkPSLlvaLnirbnu5PlkIgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
            }

            &:active {
                position: relative;
                top: 1px;
            }
        }
    }
}
</style>
