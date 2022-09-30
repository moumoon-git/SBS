<template>
  <div class="AddOrEdit">
    <!-- 新增/编辑 -->
    <el-dialog
      :title="type + '风险预警信息'"
      :visible.sync="centerDialogVisible"
      width="500px"
      center
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="预警事项:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="预警依据:">
          <el-input
            type="textarea"
            v-model="form.basisInfo"
            rows="6"
            resize="none"
            v-if="type !== '查看'"
          ></el-input>
          <div class="content" v-if="type === '查看'">{{ form.basisInfo }}</div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer" v-if="type !== '查看'">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button @click="submit" class="submit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      title="删除预警信息"
      :visible.sync="delDialogVisible"
      width="500px"
      center
    >
      <div class="warning">
        是否删除该条预警信息
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button @click="delHandle" class="button">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { types } from "util";
export default {
  name: "AddOrEdit",
  data() {
    return {
      centerDialogVisible: false, //新增/编辑视图窗口
      delDialogVisible: false, //删除视图窗口
      type: "", //判断新增或者编辑
      id: "", //编辑Id

      form: {
        name: "",
        basisInfo: ""
      }
    };
  },
  methods: {
    init(type, id) {
      this.type = type;
      this.centerDialogVisible = true;
      if (id) {
        this.id = id;
        this.$http({
          url: this.$http.adornUrl(`/ty/tyAlarm/info/${id}`),
          method: "get"
        }).then(({ data }) => {
          // console.log(data)
          if (data.TyAlarmEntity) {
            this.form.name = data.TyAlarmEntity.name;
            this.form.basisInfo = data.TyAlarmEntity.basisInfo;
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        this.form.name = "";
        this.form.basisInfo = "";
      }
    },
    delList() {
      this.delDialogVisible = true;
    },
    // 提交
    submit() {
      this.$http({
        url: this.$http.adornUrl(
          `/ty/tyAlarm/${this.type === "新增" ? "save" : "update"}`
        ),
        method: "post",
        data: this.$http.adornData({
          id: this.id || undefined,
          name: this.form.name,
          basisInfo: this.form.basisInfo
        })
      }).then(({ data }) => {
        // console.log(data)
        if (data && data.code == 0) {
          this.$message({
            type: "success",
            message: `${this.type}成功`,
            duration: 1500,
            onClose: () => {
              this.centerDialogVisible = false;
              this.$emit("initData");
            }
          });
        } else {
          this.$message({
            type: "error",
            message: data.msg,
            duration: 1500,
            onClose: () => {
              this.centerDialogVisible = false;
            }
          });
        }
      });
    },
    // 删除
    delHandle() {
      this.$emit("delData");
      this.delDialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.AddOrEdit {
  .button {
    background-color: #00a9f2;
    color: white;
  }
  ul {
    padding: 0;
    list-style: none;
  }
  p {
    margin: 10px 0;
  }
  input {
    outline: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 100px;
  }
  .title {
    font-weight: bold;
  }
  .calculation {
    display: flex;
    justify-content: space-between;
  }
  .el-button:focus,
  .el-button:hover {
  }
  /deep/ .el-dialog--center .el-dialog__footer {
    padding: 0px 20px 20px;
  }
  .warning {
    text-align: center;
  }
  .content {
    width: 100%;
    height: 138px;
    word-break: break-all;
    word-wrap: break-word;
    overflow: scroll;
    &::-webkit-scrollbar {
      width: 0 !important;
      height: 0;
    }
  }
}
</style>
