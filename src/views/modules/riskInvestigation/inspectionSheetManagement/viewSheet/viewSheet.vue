<template>
  <!-- 查看工单弹窗 :before-close="handleClose"-->
  <el-dialog
    title="查看工单"
    :visible.sync="viewSheetVisible"
    width="1289px"
  >
    <el-form
      ref="form"
      :model="viewForm"
      label-width="80px"
    >
      <el-row :gutter="20">
        <!-- 左侧内容 -->
        <el-col :span="10">
          <!-- <div style="border:1px solid #0091FF;border-radius:9000px;width:50px;height:50px;background:#0091FF;color:white;float:right;text-align:center;padding-top:12px;">{{viewForm.sheetStatus}}</div> -->
          <div
            style="
              width: 500px;
              height: 250px;
              position: absolute;
              top: -2%;
              left: 25%;
            "
            class="imgWrapper"
          >
            <img
              v-if="viewForm.status == -1"
              src="../img/status-cancel.png"
              alt="已取消"
            >
            <img
              v-if="viewForm.status == 0"
              src="../img/status-handling.png"
              alt="处置中"
            >
            <img
              v-if="viewForm.status == 1"
              src="../img/status-handled.png"
              alt="已处置"
            >
          </div>
          <el-form-item label="发布时间">
            {{ viewForm.gmtCreate ? viewForm.gmtCreate : '' }}
          </el-form-item>
          <el-form-item label="工单名称">
            {{ viewForm.name ? viewForm.name : '' }}
          </el-form-item>
          <el-form-item label="工单类型">
            <span v-if="viewForm.workType == 0">自定义工单</span>
            <span v-if="viewForm.workType == 1">巡查工单</span>
          </el-form-item>
          <el-form-item label="工单属性">
            {{ viewForm.workPropertyString ? viewForm.workPropertyString : '' }}
          </el-form-item>
          <el-form-item label="处置对象">
            {{ viewForm.handleTarget ? viewForm.handleTarget : '' }}
          </el-form-item>
          <el-form-item label="工单地点">
            <img
              src="../img/location-active.png"
              alt="工单地点"
            >
            {{ viewForm.workPlace ? viewForm.workPlace : '' }}
          </el-form-item>
          <el-form-item label="完成时限">
            <!-- {{viewForm.endTime}} -->
            <span v-if="viewForm.isEndtime == 1">
              {{ viewForm.endDate ? viewForm.endDate : '' }}
              {{ viewForm.endTime ? viewForm.endTime : '' }}
            </span>
            <span v-else>无限制</span>
          </el-form-item>
          <el-form-item label="情况说明">
            {{ viewForm.remark ? viewForm.remark : '' }}
          </el-form-item>

          <el-form-item label="附件">
            <span
              v-for="(item, index) in viewForm.documentList"
              :key="index"
              style="
                border: 1px solid #999999;
                height: 30px;
                width: 60px;
                display: inline-block;
                overflow: hidden;
              "
            >
              <viewer>
                <img
                  v-if="isImg(item.allUrl)"
                  alt="index"
                  :src="item.allUrl"
                  width="60"
                  height="60"
                >
                <a
                  v-else
                  :href="item.allUrl"
                  :download="item.name"
                >{{
                  item.documentName
                }}</a></viewer>
              <!-- <img v-if="isImg(item.url)" alt="index" :src="item.url" width="60" height="60"/>
                            <a v-else :href="item.url">{{item.documentName}}</a> -->
            </span>
          </el-form-item>
        </el-col>
        <!-- 右侧内容 -->
        <el-col :span="13">
          <el-collapse v-model="activeNames">
            <!-- 参与人员 -->
            <el-collapse-item name="participants">
              <template slot="title">
                工单处置人员（共{{
                  viewForm.allContactorList.length - copyManListLength
                }}人）
                <span
                  class="view-tag-department"
                >主责部门：{{
                  viewForm.mailGroupName ? viewForm.mailGroupName : ''
                }}</span>
              </template>
              <div style="position: relative">
                <!-- 负责人 -->
                <span style="position: relative">
                  <span class="view-tag view-tag-responsibility">
                    <img src="src\assets\img\wenjian.svg" >
                    {{ viewForm.chargeMan ? viewForm.chargeMan.name : '' }}
                    （{{
                      viewForm.allContactorList[0]
                        ? viewForm.allContactorList[0].mailGroupName
                        : ''
                    }}
                    {{
                      viewForm.chargeMan ? viewForm.chargeMan.position : ''
                    }}）
                  </span>
                </span>
                <!-- 参与人 -->
                <span
                  v-for="(item, index) in viewForm.allContactorList"
                  :key="index"
                >
                  <span
                    v-if="item.type == 2"
                    class="view-tag"
                  >
                    <img src="src\assets\img\wenjian.svg" >
                    {{ item.contactorIdString ? item.contactorIdString : '' }}
                    （{{ item.mailGroupName ? item.mailGroupName : '' }}
                    {{ item.position ? item.position : '' }}）
                  </span>
                </span>
              </div>
            </el-collapse-item>
            <!-- 抄送人员 -->
            <el-collapse-item name="copyto">
              <template slot="title">
                已抄送（共{{ copyManListLength }}人）
              </template>
              <span
                v-for="(item, index) in viewForm.allContactorList"
                :key="index"
              >
                <span
                  v-if="item.type == 3"
                  class="view-tag"
                >
                  <img src="src\assets\img\wenjian.svg" >
                  {{ item.contactorIdString ? item.contactorIdString : '' }}
                  （{{ item.mailGroupName ? item.mailGroupName : '' }}
                  {{ item.position ? item.position : '' }}）
                </span>
              </span>
            </el-collapse-item>
            <!-- </el-collapse>
                    <el-collapse> -->
            <!-- 历史状态 -->
            <el-collapse-item name="allstatus">
              <template slot="title"> 所有动态 </template>
              <statusMoment
                ref="statusMoment"
                :handleResponseEntities="this.viewForm.handleResponseEntities"
                :workId="this.viewWhich"
                :getSingleData="this.getSingleData"
              />
              <!-- <div class="history-container">
                    <div v-for="item in historyStatus" :key="item.id" class="history-item">
                      <span style="float:left">
                        <span class="history-avatar">{{item.name}}</span>
                        <span class="history-avatar-job" v-if="item.job">{{item.job}}</span>
                        <span class="history-avatar-job history-avatar-nojob" v-else>{{item.job}}</span>
                      </span>
                      气泡框内容
                      <span class="history-content-wrapper">
                          <span>{{item.type}}</span>
                          <span class="history-content-time">{{item.time}}</span>
                          <el-row class="history-content-comment">{{item.content}}</el-row>
                          <el-row class="history-content-attachments" v-for="att in item.attachments" :key="att">
                              <img v-if="att.type=='image'" :src="att.url" :alt="att.name" class="history-content-image"/>
                          </el-row>
                          
                          <el-row class="history-content-location"><i class="el-icon-location" style="color:blue"></i>{{item.location}}</el-row>
                          <el-button type="text" class="history-content-reply">回复</el-button>
                      </span>
                    </div>
                </div>
                <el-row class="reply-wrapper">
                    <textarea class="reply-input" rows="2" placeholder="请输入工单处置情况"></textarea>
                    <i class="el-icon-picture"></i>
                    <i class="el-icon-picture"></i>
                    <el-button type="text" class="reply-submit">提交</el-button>
                </el-row> -->
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import statusMoment from '../statusMoment/statusMoment';
export default {
  name: 'viewSheet',
  components: {
    statusMoment,
  },
  props: [
    // "viewWhich",
    // "sheetTableData",
    // "currentRow",
  ],
  watch: {
    // viewWhich(id) {
    //     this.getSingleData(id);
    // }
    // 每次打开弹窗时更新数据
    // viewSheetVisible: function() {
    //     this.viewForm = JSON.parse(JSON.stringify(this.sheetTableData[this.currentRow]));
    // }
  },
  mounted() {
    // 初始化时把传进来的数据暂存在新的编辑变量中
    // this.viewForm = JSON.parse(JSON.stringify(this.sheetTableData[this.currentRow]));
  },
  methods: {
    init(id) {
      this.activeNames = ['participants', 'copyto', 'allstatus'];
      this.getSingleData(id);
      this.viewSheetVisible = true;
      this.viewWhich = id;
    },
    // 获取表单详情
    getSingleData(id) {
      let url = window.SITE_CONFIG['baseUrl'] + '/work/workSheet/info/' + id;
      let that = this;
      this.$http.get(url).then(
        function (res) {
          console.log('查看表单详情：', res.data.data);
          that.viewForm = JSON.parse(JSON.stringify(res.data.data));
          let count = 0;
          for (let item of that.viewForm.allContactorList) {
            if (item.type == 3) {
              count++;
            }
          }
          that.copyManListLength = count;
        },
        function (res) {
          console.log('获取单个表单失败！\n错误信息：\n', res);
        }
      );
    },
    // 弹窗关闭提示
    handleClose(done) {
      var that = this;
      this.$confirm('确认关闭？')
        .then((_) => {
          that.viewSheetVisible = false;
          that.getSingleData(that.viewWhich);
          that.$refs.statusMoment.replyClose();
          done();
        })
        .catch((_) => {});
    },
    // 提交修改
    viewSheetSubmit() {
      this.viewSheetVisible = false;
    },
    // 判断是图片还是文档
    isImg(url) {
      let res = url.slice(-4);
      if (
        res == '.png' ||
        res == '.jpg' ||
        res == 'jpeg' ||
        res == '.gif' ||
        res == '.bmp'
      ) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      viewSheetVisible: false,
      viewForm: {
        gmtCreate: '',
        name: '',
        workType: '',
        workPropertyString: '',
        handleTarget: '',
        workPlace: '',
        endTime: '',
        remark: '',
      },
      copyManListLength: '',
      // 右侧展开的collapse栏的列表
      activeNames: ['participants', 'copyto', 'allstatus'],
      viewWhich: '',
    };
  },
};
</script>

<style>
.el-dialog__header {
  background: rgba(241, 244, 246, 1);
}
.view-tag {
  display: inline-block;
  /* width: 80px; */
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid rgba(35, 181, 244, 1);
  border-radius: 4px;
  margin: 10px;
}
/* .view-tag-department::after {
    content: '处置部门';
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    display: inline-block;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    width: 60px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    top: 0;
    left: 30px;
} */
.view-tag-responsibility::after {
  content: '主责人';
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  display: inline-block;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  width: 50px;
  height: 20px;
  line-height: 20px;
  position: absolute;
  top: -20px;
  right: 10px;
}
  .imgWrapper img {
    height: 66px;
    object-fit: cover;
    position: absolute;
    top: -8px;
    left: 10px;
  }
</style>
