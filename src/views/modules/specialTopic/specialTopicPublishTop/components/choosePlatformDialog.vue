<template>
    <div class="choosePlatformDialog">
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <div class="searchWrapper">
                <input type="text">
                <div class="chooseNumber">已选择2平台</div>
            </div>
            <div class="platformContainer">
                <el-checkbox-group v-model="checkList">
                    <el-checkbox label="复选框 A"></el-checkbox>
                    <el-checkbox label="复选框 B"></el-checkbox>
                    <el-checkbox label="复选框 C"></el-checkbox>
                    <el-checkbox label="禁用" disabled></el-checkbox>
                    <el-checkbox label="选中且禁用" disabled></el-checkbox>
                </el-checkbox-group>    
            </div>
            <div class="yesButton">确定</div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'choosePlatformDialog',
    data() {
        return {
            dialogVisible: true,
            checkList: ['选中且禁用','复选框 A']
        }
    }
}
</script>
<style lang="less" scoped>
.choosePlatformDialog {
  .el-dialog {
    .searchWrapper {
      input {
 
      }

      .chooseNumber {

      }
    }

    .platformContainer {
      .el-checkbox-group {
        .el-checkbox {
            display: block;
        }
      }
    }
  }
}
</style>