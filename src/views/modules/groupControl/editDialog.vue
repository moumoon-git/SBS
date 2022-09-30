<template>
  <el-dialog :title="editTitle" :visible="true" :before-close="beforeClose">
    <el-form :model="editData">
      <el-form-item required label="流程名称" :label-width="formLabelWidth">
        <div>{{editData.name}}</div>
      </el-form-item>
      <el-form-item label="流程说明" :label-width="formLabelWidth" width="300px">
        <div>{{editData.remark}}</div>
      </el-form-item>
      <el-form-item
        style="position:relative"
        required
        label="填报单位类型"
        :label-width="formLabelWidth"
        prop="name"
      >
        <el-button @click="addUnit" class="addUnitButton">
          <span class="crossArrow">+</span>添加填报单位
        </el-button>
        <div
          class="addUnit"
          style="position:absolute;minWidth:150px;backgroundColor:white"
          v-show="addUnitButton"
        >
          <el-checkbox-group v-model="$parent.carUnitList" v-if="editData.id == -100">
            <div v-for="(item,index) in unitType" :key="index">
              <el-checkbox :label="item.id+'&'+item.typeName">{{item.typeName}}</el-checkbox>
            </div>
          </el-checkbox-group>
          <el-checkbox-group v-model="$parent.sentryBoxUnitList" v-if="editData.id == -200">
            <div v-for="(item,index) in unitType" :key="index">
              <el-checkbox :label="item.id+'&'+item.typeName">{{item.typeName}}</el-checkbox>
            </div>
          </el-checkbox-group>
          <el-checkbox-group v-model="$parent.memberUnitList" v-if="editData.id == -300">
            <div v-for="(item,index) in unitType" :key="index">
              <el-checkbox :label="item.id+'&'+item.typeName">{{item.typeName}}</el-checkbox>
            </div>
          </el-checkbox-group>
          <!-- <el-button 
            style="marginBottom:10px"
            @click="confirmAddUnitType('editShowUnitListId','editShowUnitListName','editShowUnitList')"
          >确定添加</el-button>-->
          <el-button style="marginBottom:10px" @click="confirmAddUnitType">确定添加</el-button>
        </div>
        <div class="showAddUnit" v-if="acceptUnit.length!=0">
          <span class="showUnit" v-for="(item,index) in editShowUnitListName" :key="index">
            {{item}}
            <!-- <span
              class="el-icon-error"
              @click="delectUnitType(index,'editShowUnitListId','editShowUnitListName','editShowUnitList')"
            ></span>-->
            <span class="delect-error" @click="delectUnitType(index)">×</span>
          </span>
        </div>
      </el-form-item>
      <el-form-item required label="审核流程" :label-width="formLabelWidth" prop="name">
        <el-button
          class="addProcessButton"
          @click="addProcess('editData',editData.processList.length)"
        >
          <span class="crossArrow">+</span>添加流程
        </el-button>
        <div class="showProcess" v-if="editData.processList.length!=0">
          <span class="processBox" v-for="(item,index) in editData.processList" :key="index">
            <span class="processLeft">
              {{index + 1}}
              <!-- <span @click="editDelectAuditProcess(index)" class="el-icon-error"></span> -->
              <img
                style="width:22px"
                src="../../../assets/img/del2.svg"
                @click="editDelectAuditProcess(index,'process')"
                alt
              />
            </span>
            <div class="boxProcessSelect">
              <el-select
                class="processSelect"
                @change="processChange(index)"
                v-model="editData.processList[index].depId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in unitType"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </span>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogForm">取 消</el-button>
      <el-button type="primary" @click="updataApplyForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: [
    "editTitle",
    "editData",
    "editShowUnitListId",
    "editShowUnitListName",
    "acceptUnit",
  ],
  data() {
    return {
      formLabelWidth: "120px",
      addUnitButton: false,
      unitType: [], //单位类型
    };
  },
  methods: {
    //关闭前的回调
    beforeClose() {
      this.$emit("beforeClose");
    },
    //关闭/打开添加填报单位类型
    addUnit() {
      console.log("我被触发了");
      this.addUnitButton = !this.addUnitButton;
    },
    //填报单位类型跟审核流程选单位
    getUnitType() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platformtype/listAll`),
        method: "get",
      }).then((data) => {
        console.log("填报单位类型跟审核流程选单位data===>", data);
        this.unitType = data.data.data;
      });
    },
    //确定添加单位类型
    confirmAddUnitType() {
      this.$emit("confirmAddUnitType");
      this.addUnitButton = !this.addUnitButton;
    },
    //删除单位类型
    delectUnitType(index) {
      this.$emit("delectUnitType", index);
    },
    //新增添加流程
    addProcess(val, len) {
      console.log("输出this[val].processList===>", this[val]);
      this[val].processList.push({
        depId: "",
        depName: "",
        sortNum: len + 1,
      });
      return;
      console.log(this[val]);
    },
    //编辑流程进行修改
    processChange(index) {
      console.log(this.editData.processList[index].depId);
      this.editData.processList[index].depName = this.unitType.filter((v) => {
        return this.editData.processList[index].depId == v.id;
      })[0].typeName;
      console.log(this.editData.processList);
    },
    //更新修改申请表单
    updataApplyForm() {
      let unitId = [];
      this.editShowUnitListId.forEach((v) => {
        unitId.push(v);
      }),
        this.$http({
          url: this.$http.adornUrl(`/approve/approveManage/update`),
          method: "post",
          data: this.$http.adornData({
            id: this.editData.id,
            name: this.editData.name,
            tikuId: this.editData.tikuId,
            tikuType: this.editData.tikuType,
            remark: this.editData.remark,
            unitTypes: unitId,
            processList: this.editData.processList,
          }),
        }).then((data) => {
          console.log("我是修改申请表单返回的data===》", data);
          this.closeDialogForm();
        });
    },
    //删除流程
    editDelectAuditProcess(index) {
      this.$emit("editDelectAuditProcess", index);
    },
    //关闭窗口
    closeDialogForm() {
      this.$emit("closeDialogForm");
    },
  },
  created() {
    this.getUnitType(); //获取填报单位类型跟审核流程选单位
  },
};
</script>

<style lang="less" scoped>
.addUnit {
  border: 1px solid #ccc;
  padding: 0 20px;
  z-index: 10000;
}
.crossArrow {
  color: #3f92fe;
  font-size: 16px;
  font-weight: bold;
  margin-right: 4px;
}
.showAddUnit {
  margin-left: -20px;
  .showUnit {
    display: inline-block;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    background-color: #fafafa;
    color: #9a9a9a;
    text-align: center;
    margin: 20px 0 0 20px;
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    .delect-error {
      display: inline-block;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      color: #979797;
      margin: 0 4px;
    }
  }
}
.addUnitButton {
  padding: 10px;
}
.addProcessButton {
  border: 1px solid #d9d9d9;
  padding: 10px;
}
.showProcess {
  min-height: 75px;
  position: relative;
  padding-bottom: 20px;
  .processBox {
    display: inline-block;
    position: relative;
    width: 160px;
    height: 43px;
    line-height: 41px;
    border: 1px solid #d9d9d9;
    margin-top: 20px;
    margin-right: 60px;
    border-radius: 4px;
    background-color: #f1f6ff;
  }
  .processSelect {
    width: 98px;
    position: absolute;
    top: -1px;
    left: 30px;
  }
  /deep/ .el-input__inner {
    height: 33px;
  }
}
.processBox {
  img {
    position: absolute;
    right: 4px;
    top: 10px;
    z-index: 1000;
    cursor: pointer;
  }
  .el-icon-error {
    color: #3595f3;
    font-size: 15px;
    position: absolute;
    right: -5px;
    top: -5px;
    z-index: 1000;
    cursor: pointer;
  }
  .processLeft {
    display: inline-block;
    width: 25px;
    height: 41px;
    color: white;
    text-align: center;
    background-color: #9bc4fc;
  }
}
.boxProcessSelect {
  /deep/ .el-icon-arrow-up::before {
    margin-top: 6px;
  }
}
</style>