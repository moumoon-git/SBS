<template>
  <div class="contingency-plan-detail">
    <div class="contingency-plan-detail__navigator">
      <span
        :class="{ 'contingency-plan-detail__navigator__active': activeName === '预案信息' }"
        @click="tabsTitle({ label: '预案信息' })"
      >预案信息</span>
      <span
        :class="{ 'contingency-plan-detail__navigator__active': activeName === '预案文档' }"
        @click="tabsTitle({ label: '预案文档' })"
      >预案文档</span>
      <span
        :class="{ 'contingency-plan-detail__navigator__active': activeName === '组织架构' }"
        @click="tabsTitle({ label: '组织架构' })"
      >组织架构</span>
    </div>
    <div class="contingency-plan-detail__content">
      <PlanInformation v-show="activeName === '预案信息'" />
      <preplan-document v-show="activeName === '预案文档'"></preplan-document>
      <organizational-structure v-show="activeName === '组织架构'"></organizational-structure>
    </div>
  </div>
</template>

<script>
import PlanInformation from './PlanInformation/PlanInformation'
import PreplanDocument from "./PreplanDocument";
import OrganizationalStructure from "./OrganizationalStructure/OrganizationalStructure";
import bus from "@/views/common/js/eventBus";

export default {
  components: {
    PlanInformation,
    PreplanDocument,
    OrganizationalStructure,
  },
  data() {
    return {
      activeName: '预案信息',
      detailData: {}, // 当前预案所有联系人
    };
  },
  mounted() {
    bus.$off("showDetail");
    bus.$on("showDetail", val => {
      this.getContactGroup(val);
    });
  },
  watch: {
    activeName(newV) {
      if (newV === "组织架构") {
        setTimeout(() => {
          bus.$emit("getContactGroup", this.detailData);
          // 将预案信息传递给部门列表
          bus.$emit("getContactList", this.detailData);
          if (
            this.detailData &&
            this.detailData.incidentMailgroup &&
            this.detailData.incidentMailgroup[0].rpIncidentUnitEntityList
          ) {
            // console.log(this.detailData);
            bus.$emit(
              "addContact",
              {
                id: this.detailData.incidentMailgroup[0].rpIncidentUnitEntityList[0].id,
                name: this.detailData.incidentMailgroup[0].rpIncidentUnitEntityList[0].name
              }
            );
          }
        });
        // 初始话默认加载第一个分组的第一个单位的中的联系人
      }else if (this.activeName === "预案文档") {
          console.log(this.detailData)
           bus.$emit("documentPreview", this.detailData.document);
        }
    }
  },
  methods: {
    tabsTitle(value) {
      this.activeName = value.label;
    },

    getContactGroup(id) {
      // 向预案信息传递预案id的值
      // bus.$emit('getPlanInformation', id);
      this.$http({
        url: this.$http.adornUrl(`/incidentplan/rpIncidentPlan/getOneAndLink`),
        method: "get",
        params: this.$http.adornParams({
          id
        })
      }).then(({ data }) => {
        if (data.code===0) {
          this.detailData = data.data;
          // 将预案详情传递给预案信息
          bus.$emit('getPlanInformation', data.data);
          // 将预案详情传递给部门列表
          bus.$emit('getContactList', data.data);
          // console.log('this.detailData: ', this.detailData);
          // 将文档传给预案编辑
          bus.$emit("getDocument", this.detailData.documentList);
          // console.log(this.activeName === "预案文档")
          if (this.activeName === "组织架构") {
            // console.log(this.detailData)
            setTimeout(() => {
              bus.$emit("getContactGroup", this.detailData);
              if (
                // this.detailData.incidentMailgroup.length !== 0 &&
                this.detailData.incidentMailgroup
                && this.detailData.incidentMailgroup[0].rpIncidentUnitEntityList
                  .length !== 0
              ) {
                bus.$emit(
                  "addContact",
                  {
                    id: this.detailData.incidentMailgroup[0].rpIncidentUnitEntityList[0].id,
                    name: this.detailData.incidentMailgroup[0].rpIncidentUnitEntityList[0].name
                  }
                );
              } else {
                bus.$emit("addContact", "");
              }
            });
            // 初始话默认加载第一个分组的第一个单位的中的联系人
          }else if (this.activeName === "预案文档") {
            // console.log(this.detailData)
            // console.log(this.detailData.document)
             bus.$emit("documentPreview", this.detailData.document);
          }
        }else{
            this.$message.error(data.msg)
            bus.$emit("documentPreview", {});
        }
      }).catch(()=>{
        if (this.activeName === "组织架构") {
            // console.log(this.detailData)
            setTimeout(() => {
              bus.$emit("getContactGroup", this.detailData);
              bus.$emit("addContact", "");
            });
            // 初始话默认加载第一个分组的第一个单位的中的联系人
          }else if (this.activeName === "预案文档") {
             bus.$emit("documentPreview", null);
          }
      })
    }
  }
};
</script>

<style lang="scss">
.contingency-plan-detail {
  flex-grow: 1;
  margin-left: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__navigator {
    height: 50px;
    line-height: 50px;
    background: #F9FBFF;

    & > span {
      display: inline-block;
      height: 100%;
      line-height: 50px;
      color: #666666;
      padding: 0 20px;
      border-bottom: 2px solid transparent;
      cursor: pointer;

      &:hover {
        border-bottom-color: #0091FF;
      }
    }

    &__active {
      border-bottom-color: #0091FF !important;
      color: #333333 !important;
      font-weight: bold;
    }
  }

  &__content {
    width: 100%;
    height: calc(100% - 50px);
    flex-grow: 1;
  }
}
</style>
