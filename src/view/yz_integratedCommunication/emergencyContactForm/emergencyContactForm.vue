<template>
  <div class="emergency-contact-form">
    <div class="navBar">
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first"></el-tab-pane>
          <el-tab-pane label="配置管理" name="second"></el-tab-pane>
          <el-tab-pane label="角色管理" name="third"></el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="manage-button">
        <div class="manage-icon"></div>
        <span class="manage">管理</span>
      </div>
      <div class="operation-style">
        <el-input
          placeholder="支持姓名、单位、职业、号码"
          class="search-input-style"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-radio-group
          v-model="radio1"
        >
          <el-radio-button label="卡片"></el-radio-button>
          <el-radio-button label="表格"></el-radio-button>
        </el-radio-group>
        <div>
          <span>分管领导</span>
          <el-switch
            v-model="value"
            active-color="#0091FF"
            active-value="100"
            inactive-value="0">
          </el-switch>
        </div>
      </div>
    </div>
    <div id="contactor-cards">
      <contactor-card>
      </contactor-card>
    </div>
    <div class="add"></div>
  </div>
</template>
<script>
import ContactorCard from '@/view/yz_integratedCommunication/emergencyContactForm/components/contactorCard'
import AddContactorDialog from '@/view/yz_integratedCommunication/emergencyContactForm/components/addContactorDialog'
export default {
  name: '',
  components: {
    ContactorCard,
    AddContactorDialog
  },
  data() {
    return {
      radio1: '',
      value: 0,
      activeName: 'second'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>
<style scoped>
.emergency-contact-form {
  width: 1688px;
  height: calc(100vh - 72px);
  overflow: scroll;
}
.add {
  position: fixed;
  background: url("../../../../static/img/ConvergedCommunication/add.png") no-repeat;
  background-size: 100% 100%;
  width: 62px;
  height: 62px;
  bottom: 122px;
  right: 28px;
}
.navBar {
  height:70px;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 14px 3px rgba(54,121,225,0.09);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
.tabs {
  width: 980px;
  height: 72px;
  line-height: 72px;
  border-right: 1px solid rgba(240,240,240,1);
  padding-left: 30px;
}
/deep/ .tabs .el-tabs__item {
  height: 70px;
  line-height: 70px;
  font-size:18px;
  color:rgba(153,153,153,1);
}
/deep/ .tabs .el-tabs__item.is-active {
  color: #333333;
}
.manage-button {
  width: 98px;
  height: 70px;
  line-height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-right: 1px solid rgba(240,240,240,1);
  cursor: pointer;
}
.manage-icon {
  background: url("../../../../static/img/ConvergedCommunication/manage.png") no-repeat;
  background-size: 100% 100%;
  width: 24px;
  height: 18px;
}
.manage {
  font-size: 17px;
}
.search-input-style {
  width: 263px;
  height:42px;
}
.operation-style {
  width: 614px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 14px;
}
#contactor-cards {
  height: calc(100% - 70px);
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
}

</style>