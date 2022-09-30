<template>
    <div class="lookClanDetailDialog">
         <sv-dialog
        ref="dialog"
        title="集群终端详情"
        @cancel="quitDialog"
        >
        <div class="clanDetail">
            <div class="clanNameWrapper">
                <div class="clanNameText">
                    <span class="star">*</span>
                    集群名称：
                </div>
                <div class="clanName">
                    后勤保障组
                </div>
            </div>
        </div>
        <div class="clanDetail">
            <div class="clanNameWrapper">
                <div class="clanNameText">
                    <span class="star">*</span>
                    集群类型：
                </div>
                <div class="clanName">
                    集群终端
                </div>
            </div>
        </div>
        <div class="clanDetail">
            <div class="clanNameWrapper">
                <div class="clanNameText">
                    <span class="star">*</span>
                    集群号码：
                </div>
                <div class="clanName">
                    110
                </div>
            </div>
        </div>
        <div class="clanDetail">
            <div class="clanNameWrapper">
                <div class="clanNameText">
                    <span class="star">*</span>
                    所属分组：
                </div>
                <div class="clanName">
                    顶级分组
                </div>
            </div>
        </div>
        <div class="clanDetail">
            <div class="clanNameWrapper">
                <div class="clanNameText">
                    备注信息：
                </div>
                <div class="clanName">
                    备注
                </div>
            </div>
        </div>
         </sv-dialog>
    </div>
</template>
<script>
export default {
    name: 'lookClanDetailDialog',
    data() {

    },
    methods: {
        quitDialog() {

        },

    }
}
</script>
<style lang="less" scoped>
  .clanDetail {
  .clanNameWrapper {
      display: flex;
    .clanNameText {
        display: flex;
      span.star {
          color: #ff0000;
      }
    }

    .clanName {

    }
  }
}
</style>