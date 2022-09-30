<template>
  <!-- 查看工单弹窗 :before-close="handleClose"-->
  <div
    class="viewSheet"
  >
    <div class="main-content">
      <!-- 左侧内容 -->
      <div class="left-side">
        <div
          style="
              width: 250px;
              height: 250px;
              position: absolute;
              left: 22%;
            "
        >
          <img
            v-if="dataList.status == -1"
            src="../img/status-cancel.png"
            alt="已取消"
          >
          <img
            v-if="dataList.status == 0"
            src="../img/status-handling.png"
            alt="处置中"
          >
          <img
            v-if="dataList.status == 1"
            src="../img/status-handled.png"
            alt="已处置"
          >
        </div>
        <div class="left--side__item">
          <span>发布时间：</span>
          <span>{{ dataList.gmtCreate ? dataList.gmtCreate : '' }}</span>
        </div>
        <div class="left--side__item">
          <span>工单名称：</span>
          <span>{{ dataList.name ? dataList.name : '' }}</span>
        </div>
        <div class="left--side__item">
          <span>工单类型：</span>
          <span>
            <span v-if="dataList.workType == 0">自定义工单</span>
            <span v-if="dataList.workType == 1">巡查工单</span>
          </span>
        </div>
        <div class="left--side__item">
          <span>工单属性：</span>
          <span>{{ dataList.workPropertyString ? dataList.workPropertyString : '' }}</span>
        </div>
        <div class="left--side__item">
          <span>处置对象：</span>
          <span>{{ dataList.handleTarget ? dataList.handleTarget : '' }}</span>
        </div>
        <div class="left--side__item">
          <span>工单地点：</span>
          <span>
            <img
              src="../img/location-active.png"
              alt="工单地点"
            >
            {{ dataList.workPlace ? dataList.workPlace : '' }}
          </span>
        </div>
        <div class="left--side__item">
          <span>完成时限：</span>
          <span>
            {{ dataList.endDate ? dataList.endDate : '' }}
          </span>
        </div>
        <div class="left--side__item">
          <span>情况说明：</span>
          <span>{{ dataList.remark ? dataList.remark : '' }}</span>
        </div>

        <div class="left--side__item">
          <span>附件：</span>
          <span
            v-for="(item, index) in dataList.documentList"
            :key="index"
            style="
                border: 1px solid #999999;
                height: 30px;
                width: 60px;
                display: inline-block;
                overflow: hidden;
              "
          >
            <!-- <viewer>
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
              }}</a></viewer> -->
            <!-- <img v-if="isImg(item.url)" alt="index" :src="item.url" width="60" height="60"/>
                            <a v-else :href="item.url">{{item.documentName}}</a> -->
          </span>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="right-side">
        <el-collapse v-model="activeNames">
          <!-- 参与人员 dataList.allContactorList.length - copyManListLength-->
          <el-collapse-item name="participants">
            <template slot="title">
              工单处置人员（共{{
                dataList.allContactorList ? dataList.allContactorList.length - copyManListLength : ''
              }}人）
              <span
                class="view-tag-department"
              >主责部门：{{
                dataList.mailGroupName ? dataList.mailGroupName : ''
              }}</span>
            </template>
            <div style="position: relative">
              <!-- 负责人 -->
              <span style="position: relative">
                <span class="view-tag view-tag-responsibility">
                  <img src="src\assets\img\wenjian.svg">
                  {{ dataList.chargeMan ? dataList.chargeMan.name : '' }}
                  （{{
                       dataList.allContactorList
                        ? dataList.allContactorList[0].mailGroupName
                        : ''
                  }}
                  {{
                    dataList.chargeMan ? dataList.chargeMan.position : ''
                  }}）
                </span>
              </span>
              <!-- 参与人 -->
              <span
                v-for="(item, index) in dataList.allContactorList"
                :key="index"
              >
                <span
                  v-if="item.type == 2"
                  class="view-tag"
                >
                  <img src="src\assets\img\wenjian.svg">
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
              v-for="(item, index) in dataList.allContactorList"
              :key="index"
            >
              <span
                v-if="item.type == 3"
                class="view-tag"
              >
                <img src="src\assets\img\wenjian.svg">
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
            <template slot="title">
              所有动态
            </template>
            <statusMoment
              ref="statusMoment"
              class="statusMoment"
              :handle-response-entities="viewForm.handleResponseEntities"
              :work-id="viewWhich"
              :get-single-data="getSingleData"
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
      </div>
    </div>
    <el-button
      class="close-button"
      size="small"
      @click="$router.back(-1)"
    >
      关 闭
    </el-button>
  </div>
</template>

<script>
import statusMoment from '../statusMoment/statusMoment';

export default {
  name: 'ViewSheet',
  components: {
    statusMoment,
  },
  props: {
    sheetData: {
      type: Object,
      defalut: () => ({
      }),
      required: true,
    },
  },
  data() {
    return {
      dataList: {},
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
      // this.$http({
      //   url: this.$http.adornUrl(`/work/workSheet/info/${id}`),
      //   method: 'post',
      //   data: this.$http.adornData({
      //   }),
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.dataList = data.workSheetEntity;
      //     this.getSingleData(this.dataList.id);
      //     this.viewWhich = this.dataList.id;
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
      // this.activeNames = ['participants', 'copyto', 'allstatus'];
      // this.viewSheetVisible = true;
      this.getSingleData(id);
    },
    // 获取表单详情
    getSingleData(id) {
      const url = `${window.SITE_CONFIG.baseUrl}/work/workSheet/info/${id}`;
      const that = this;
      this.$http.get(url).then(
        (res) => {
          this.dataList = res.data.data;
          this.viewWhich = this.dataList.id;
          console.log('查看表单详情：', res.data.data);
          that.viewForm = JSON.parse(JSON.stringify(res.data.data));
          let count = 0;
          for (const item of that.viewForm.allContactorListList) {
            if (item.type == 3) {
              count++;
            }
          }
          that.copyManListLength = count;
        },
        (res) => {
          console.log('获取单个表单失败！\n错误信息：\n', res);
        },
      );
    },
    // 弹窗关闭提示
    handleClose(done) {
      const that = this;
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
      const res = url.slice(-4);
      if (
        res == '.png'
        || res == '.jpg'
        || res == 'jpeg'
        || res == '.gif'
        || res == '.bmp'
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>

.viewSheet {
  background: #f4f4f4;
    height:700px;
    .main-content {
    // border-bottom: 1px solid #999999;
    display: flex;
    width:1400px;
    justify-content: space-around;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .left-side {
        border: none;
        // border-right:  1px solid #999999;
        background: #fff;
        margin: 0;
        width:500px;
        padding-top: 20px;
        .left--side__item{
          padding:10px;
        }
        .el-form-item__css{
            margin:20px 0px;
        }
    }
    .right-side {
        border: none;
        margin: 0;
        width:1000px;
        .statusMoment {
          height:400px;
          overflow: auto;
        }
        .el-form-item__css{
        padding:5px
        }
    }
    }
    .close-button {
      position:absolute;
      top:2%;
      right:5%;
    }
}
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
</style>
