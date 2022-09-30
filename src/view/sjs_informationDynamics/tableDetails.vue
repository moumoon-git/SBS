<template>
  <div class="details">
    <!--有数据时候显示-->
    <template v-if="id">
      <el-row class="title">
        <div class="title-btn-box">
          <el-button
            size="mini"
            type="default"
            @click="handleShowAtt"
            style="padding: 2px 8px"
            v-show="attList.length"
            ><i
              class="icon-clip"
              size="mini"
              style="vertical-align: middle; margin-right: 7px"
            ></i
            ><span>附件{{ attList.length }}个</span></el-button
          >
          <el-button
            size="mini"
            type="default"
            style="padding: 2px 8px; margin-left: 0"
            v-show="!attList.length"
            ><i
              class="icon-clip"
              size="mini"
              style="vertical-align: middle; margin-right: 7px"
            ></i
            ><span>暂无附件</span></el-button
          >
        </div>
        <div class="tittle tittle-box">{{ title }}</div>
      </el-row>

      <el-row
        id="inputs"
        style="
          margin-top: 26px;
          margin-left: 36px;
          color: rgba(162, 162, 162, 1);
          font-size: 14px;
        "
      >
        <el-col :span="18">
          <el-row>
            <el-col
              :span="12"
              style="overflow: hidden; padding-right: 10px"
              :title="unit"
            >
              <template v-if="type === 373 || type === 371">
                <span class="detailDescTitle"
                  >{{ type === 373 ? "负责单位" : "发布单位" }}:</span
                >
                <el-input
                  style="width: 200px"
                  v-model="unit"
                  placeholder="请输入内容"
                  disabled
                ></el-input>
              </template>
            </el-col>
            <el-col
              :span="12"
              style="overflow: hidden; padding-right: 10px"
              :title="principal"
            >
              <template v-if="type === 373">
                <span class="detailDescTitle"> 负责人:</span>
                <el-input
                  style="width: 200px"
                  v-model="principal"
                  placeholder="请输入内容"
                  disabled
                ></el-input>
              </template>
            </el-col>
          </el-row>
          <el-row style="margin-top: 24px">
            <el-col :span="12" style="overflow: hidden; padding-right: 10px">
              <template v-if="type === 373 || type === 371">
                <span class="detailDescTitle">执行时间:</span>
                <el-input
                  style="width: 200px"
                  v-model="time"
                  placeholder="请输入内容"
                  disabled
                ></el-input>
              </template>
            </el-col>
            <el-col
              :span="12"
              v-show="type === 373"
              style="overflow: hidden; padding-right: 10px"
              :title="status"
            >
              <template v-if="type === 373">
                <span class="detailDescTitle">执行情况:</span>
                <el-input
                  style="width: 200px"
                  v-model="status"
                  placeholder="请输入内容"
                  disabled
                ></el-input>
              </template>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row
        style="
          margin-top: 30px;
          padding: 20px;
          margin-left: 32px;
          margin-right: 32px;
          height: 472px;
          overflow-y: scroll;
          border: 1px solid #ccc;
        "
      >
        <!--      <el-scrollbar style="height: 100%;border: 1px solid #ccc;padding: 20px;box-sizing: border-box">-->
        <!--        <el-col>-->
        <p
          style="
            white-space: pre-wrap;
            text-indent: 2em;
            margin: 0;
            word-break: break-all;
            text-align: left;
          "
          v-for="(item, index) in content"
          :key="index"
        >
          {{ item }}
        </p>
        <!--        </el-col>-->
        <!--      </el-scrollbar>-->
      </el-row>
    </template>
    <!--无数据的时候提醒-->
    <template v-if="flag">
      <el-row style="margin-top: 300px">
        暂无数据,请点击上方 <b style="color: red">新增</b> 按钮添加数据
      </el-row>
    </template>
    <attachment-popup ref="AttachmentPopup"></attachment-popup>
  </div>
</template>

<script>
import attachmentPopup from "@/view/sjs_informationDynamics/attachmentPopup";

export default {
  name: "tableDetails",
  components: { attachmentPopup },
  data() {
    return {
      id: "",
      title: "", //标题
      unit: "", //责任单位
      principal: "", //负责人
      time: "", //执行时间
      status: "", //执行情况
      content: "", //内容
      attList: [], //附件列表
      type: "", //信息动态类型
      flag: false, //是否提醒无消息指示旗
    };
  },
  methods: {
    showData(row) {
      if (row) {
        this.id = row.id;
        this.title = row.title;
        this.unit = row.unit;
        this.principal = row.extend1;
        this.time = row.time;
        this.status = row.extend2;
        this.type = row.type;
        this.getAtt(this.id);
        this.flag = false;
        this.content = row.content.split("\n");
        // console.log(this.content)
      } else {
        this.id = "";
        this.title = "";
        this.unit = "";
        this.principal = "";
        this.time = "";
        this.status = "";
        this.content = "";
        this.type = "";
        this.attList = [];
        this.flag = true;
      }
    },
    getAtt(id) {
      //获取附件数量
      this.$api.appDutyInformationReleasDetail({ id }).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.attList = res.attachment;
      });
    },
    //点击显示附件下载框
    handleShowAtt() {
      this.$nextTick(() => {
        this.$refs.AttachmentPopup.isDialogVisible = true;
        this.$refs.AttachmentPopup.showAtt(this.attList);
      });
    },
    //如果没有附件点击下载框就弹出添加框
    handleAddAtt() {
      //该功能暂时废止
      if (this.id) {
        this.$emit("handleAddAtt");
      }
    },
  },
  mounted() {
    // if(this.unit==''&&this.principal==''&&this.time==''&&this.status==''){
    //     console.log(this.unit,this.principal,this.time,this.status)
    //     let aa=document.getElementById("inputs")
    //     aa.removeAttribute()
    //     console.log(aa)
    // }
    // else{
    //     console.log(this.unit,this.principal,this.time,this.status)
    // }
  },
};
</script>

<style scoped>
.details {
  margin-left: 10px;
  margin-top: 16px;
  margin-right: 30px;
  height: 790px;
  background-color: white;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
  overflow: auto;
  box-sizing: border-box;
  padding-bottom: 20px;
}

.title {
  margin-top: 16px;
  min-height: 53px;
  font-size: 24px;
  font-family: Microsoft YaHei, sans-serif;
  font-weight: 400;
  color: rgba(50, 50, 50, 1);
}

>>> .el-col {
  text-align: left;
}

>>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
.detailDescTitle {
  color: #000;
  font-weight: 700;
  padding-right: 10px;
}
.title {
  text-align: right;
  padding: 0 20px 20px 0;
  /*background-color: #ccc;*/
  border-bottom: 1px solid #ccc;
}
.tittle-box {
  margin-right: 120px;
  text-align: center;
  padding: 0 20px;
  word-break: break-all;
}
.title-btn-box {
  float: right;
}

>>> .el-input.is-disabled .el-input__inner {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
