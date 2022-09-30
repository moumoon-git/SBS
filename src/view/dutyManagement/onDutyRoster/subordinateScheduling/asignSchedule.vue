<!--
    * @description
    * @author yangqingdong
    * @lastEditors yangqingdong
    * @lastEditTime 2020/9/8 18:11
    -->
<template>
  <el-dialog id="asignSchedule" :visible.sync="dialogVisible" width="1147px" :close-on-click-modal="false">
    <el-container style="height: 590px">
      <el-header style="height: 100px">
        <h3 class="title">选择联系人</h3>
        <div style="text-align: left">
          <el-input style="width: 85%" placeholder="输入姓名/单位/职位/号码" v-model="searchKey"></el-input>
          <el-button type="primary">查询</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside style="padding-left: 20px">
          <el-table
            :data="groupList"
            :show-header="false"
            :row-class-name="rowClassName"
            @row-click="handleRowClick"
            :row-style="handleStyle"
            style="width: 100%"
            height="520px"
          >
            <el-table-column prop="label"></el-table-column>
          </el-table>
        </el-aside>
        <el-main style="padding-top: 0;">
          <div class="personBlock">
            <el-checkbox-group v-model="selectedId">
              <el-checkbox
                v-for="(item, index) in currentPersonData"
                :key="index"
                :label="item.name"
                @change="handleCheck(item)"
              >
                <span>{{item.name}}</span>
                <span style="position: absolute;left: 400px;">{{item.mobile}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="historyBlock">
            <p class="title">历史记录：</p>
            <el-checkbox-group v-model="selectedId">
              <el-checkbox
                v-for="(item, index) in currentHistoryData"
                :key="index"
                :label="item.name"
                @change="handleCheck(item)"
              >{{item.name+'——鲁谷街道'}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="selectedBlock">
            <p class="title">已选人员：</p>
            <div class="selectedPersonBlock" v-for="(item, index) in selected" :key="index">
              <div class="selectedPerson">
                <span>{{item.name+'——鲁谷街道'}}</span>
                <i class="el-icon-delete" @click="deletePerson(item, index)"></i>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <el-button class="sendButton" type="primary" @click="dialogVisible = false">下发</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "AsignSchedule",
  props: ["dialogAsignSchedule", "groupList"],
  data() {
    return {
      dialogVisible: true,

      currentRowIndex: 0,

      // groupList: [
      //   {
      //     name: "老山街道",
      //   },
      //   {
      //     name: "金顶街道",
      //   },
      //   {
      //     name: "鲁谷街道",
      //   },
      // ],

      searchKey: "",

      currentPersonData: [
        {
          name: "熊涛",
          mobile: "15322241060",
        },
        {
          name: "陈磊",
          mobile: "13766532123",
        },
        {
          name: "熊涛2",
          mobile: "15322241060",
        },
        {
          name: "陈磊2",
          mobile: "13766532123",
        },
        {
          name: "熊涛3",
          mobile: "15322241060",
        },
        {
          name: "陈磊3",
          mobile: "13766532123",
        },
      ],

      selectedId: [],
      selected: [],

      currentHistoryData: [
        {
          name: "熊涛",
          mobile: "15322241060",
        },
        {
          name: "陈磊",
          mobile: "13766532123",
        },
        {
          name: "熊涛2",
          mobile: "15322241060",
        },
        {
          name: "陈磊2",
          mobile: "13766532123",
        },
        {
          name: "熊涛3",
          mobile: "15322241060",
        },
        {
          name: "陈磊3",
          mobile: "13766532123",
        },
      ],
    };
  },
  methods: {
    handleCheck(item) {
      let index = this.selectedId.indexOf(item.name);
      if (index != -1) {
        this.selected.push(item);
      } else {
        this.selected.splice(index, 1);
      }
    },
    deletePerson(item, index) {
      for (let i = 0; i < this.selectedId.length; i++) {
        if (this.selectedId[i] == item.name) {
          this.selectedId.splice(i, 1);
          break;
        }
      }
      this.selected.splice(index, 1);
    },
    rowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    handleRowClick(row, column, event){
      this.currentRowIndex = row.index;
    },
    handleStyle({row, rowIndex}){
      if(this.currentRowIndex == rowIndex){
        return {"color": "rgba(0, 153, 255, 1)"}
      }
    },
  },
  watch: {
    dialogVisible: {
      handler(newValue) {
        this.$emit("update:dialogAsignSchedule", newValue);
      },
    },
  },
};
</script>
<style scoped>
#asignSchedule .title {
  text-align: left;
}
#asignSchedule .el-table {
  border: 1px solid rgba(188, 188, 188, 1);
}
#asignSchedule .el-main > div {
  /* box-sizing: border-box; */
  padding-left: 15px;
}
#asignSchedule .personBlock {
  width: 100%;
  height: 245px;
  border: 1px solid rgba(188, 188, 188, 1);
  overflow-y: auto;
}
#asignSchedule .historyBlock {
  width: 100%;
  height: 125px;
  border: 1px solid rgba(188, 188, 188, 1);
  overflow-y: auto;
}
#asignSchedule .selectedBlock {
  width: 100%;
  height: 140px;
  border: 1px solid rgba(188, 188, 188, 1);
  overflow-y: auto;
  text-align: left;
}
#asignSchedule .sendButton {
  position: relative;
  right: 92%;
}
#asignSchedule .personBlock .el-checkbox {
  display: block;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
}
#asignSchedule .historyBlock .el-checkbox-group {
  text-align: left;
}
#asignSchedule .historyBlock .el-checkbox {
  width: 25%;
  margin-top: 10px;
  margin-bottom: 10px;
}
#asignSchedule .selectedPersonBlock {
  width: 25%;
  display: inline-block;
}
#asignSchedule .selectedPerson {
  padding: 8px;
  margin-right: 30px;
  margin-bottom: 15px;
  display: inline-block;
  background: rgba(0, 153, 255, 1);
  color: whitesmoke;
  position: relative;
}
#asignSchedule .selectedPerson .el-icon-delete {
  position: absolute;
  left: 95%;
  top: -7px;
  color: rgba(0, 153, 255, 1);
  font-size: 16px;
}
#asignSchedule .selectedPerson .el-icon-delete:hover {
  cursor: pointer;
}
</style>
