<template>
  <div>
    <div class="send">
      <div class="title">模板内容</div>
    </div>
    <fieldset>
      <legend>添加模板替换元素</legend>
      <ul>
        <li>【事件标题】</li>
        <li>【事件内容】</li>
        <li>【收信人职位】</li>
        <li>【总值电话】</li>
        <li>【应急预案】</li>
        <li>【事发地点导航】</li>
      </ul>选择事件：
      <el-select :value="event" placeholder="请选择事件">
        <el-option label="123" value="456"></el-option>
      </el-select>
    </fieldset>

    <el-form :model="templateData" style="margin-top:8px;">
      <el-form-item label="模板名：">
        <el-input type="text" style="width:70%" v-model="templateData.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="textarea"
          rows="18"
          resize="none"
          v-model="templateData.content"
          class="text"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="opearation">
      <el-button type="primary" @click="saveTemplate" size="small">保存模板</el-button>
      <el-button type="primary" size="small">选取模板</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "template_content",
  components: {},
  data() {
    return {
      event: "",
      templateData: {
        content: "",
        name: "",
        id: ""
      }
    };
  },
  watch: {},
  created() {},
  methods: {
    getContent(templateData) {
      this.templateData = { ...templateData };
      // console.log(
      //   "this.templateData+++++++++++++++++++++++++++++",
      //   this.templateData
      // );
    },
    // 保存模板
    saveTemplate() {
      this.$confirm("此操作将更新该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/message/messagetemple/updatetemple`),
            method: "POST",
            data: this.$http.adornData({
              id: this.templateData.id,
              name: this.templateData.name,
              content: this.templateData.content
            })
          }).then(({ data }) => {
            if (data && data.code == 0) {
              this.$emit("upData");
              this.$message({
                type: "success",
                message: "更新成功!"
              });
            }else{
              this.$message({
                type: "info",
                message: "更新失败"
              });
            }
          });
        })
    }
  }
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
.send {
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  text-align: center;
  .title {
    font-size: 16px;
  }
}
fieldset {
  padding: 10px;
  width: 100%;
  color: #333;
  border: #06c dashed 1px;
  legend {
    color: #06c;
    font-weight: 800;
    background: #fff;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    margin: 8px 0 4px 0;
    li {
      margin: 0 5px 10px 0;
      border: 1px solid black;
      margin-top: 4px;
    }
  }
}
.text {
  margin: 10px 0px;
}
.opearation {
  display: flex;
  justify-content: space-between;
  button {
    padding: 10px 15px;
  }
}
.el-select-dropdown__item {
  padding: 0 20px !important;
}
</style>
