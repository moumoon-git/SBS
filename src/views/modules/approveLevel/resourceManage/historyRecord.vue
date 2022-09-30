<template>
  <div class="historyRecord">
    <el-dialog
      title="查看历史申报记录"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      append-to-body
      width="60%"
      :close-on-click-modal="closeClickModal"
    >
      <div class="processContainer">
        <div class="processWrapper" v-for="(item,index) in recordList" :key="index">
          <div class="process">
            <div class="procedureProcessContainer">
              <div class="handleProcessTitle">所属流程：</div>
              <div class="handleProcess">{{item.processName}}</div>
            </div>
            <div class="personContainer">
              <div class="personTitle">审批人:</div>
              <div class="person">{{item.userName}}</div>
            </div>
            <!-- <div class="procedureContainer">
            <div class="procedureTitle">审批步骤:</div>
            <div class="procedure">{{item.approveComments}}</div>
            </div>-->
            <div class="procedureTimeContainer">
              <div class="handleTimeTitle">处置时间：</div>
              <div class="handleTime">{{item.gmtCreate}}</div>
            </div>
            <div class="procedureCommentContainer">
              <div class="handleCommentTitle">审批意见：</div>
              <div class="handleComment">{{item.approveComments}}</div>
            </div>
            <div class="procedureResultContainer">
              <div class="handleResultTitle">审批结果：</div>
              <div class="handleResult">{{item.approveResult == "0"? '同意':'驳回'}}</div>
            </div>
            <div class="pictureContainer">
              <div class="picture">
                <img
                  :src="item.qrcodeImg"
                  alt
                  class="imgStyle"
                  @click="previewPicture(item.qrcodeImg)"
                />
              </div>
            </div>
          </div>
          <div class="processArrow" v-if="index !== recordList.length -1">
            <img src="~@/assets/img/downArrow.png" alt />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="cancelDialog">确 定</el-button>
      </span>
    </el-dialog>
    <previewPicture :isShow="isShow" ref="preview" @closePreview="closePreview"></previewPicture>
  </div>
</template>
<script>
import previewPicture from "./previewPicture.vue";
export default {
  name: "historyRecord",
  data() {
    return {
      dialogVisible: false,
      isShow: false,
      recordList: [],
      closeClickModal: false, //禁止点击model关闭dialog
    };
  },
  created() {},
  components: {
    previewPicture,
  },
  methods: {
    cancelDialog() {
      //取消弹框
      console.log("hello");
      this.dialogVisible = false;
    },
    previewPicture(src) {
      console.log("isshow", this.isShow);
      this.$refs.preview.imgSrc = src;
      this.isShow = true;
    },
    closePreview() {
      this.isShow = false;
    },
    init(id, tikuType) {
      this.$http({
        url: this.$http.adornUrl("/approve/approveHistory/list"),
        method: "post",
        data: this.$http.adornData({
          id: id,
          tikuType: parseInt(tikuType),
        }),
      }).then(({ data }) => {
        console.log("得到的记录数据为", data);
        if (data && data.code === 0) {
          this.recordList = data.data;
        }
      });
    },
  },
};
</script>
<style lang="less">
  //  .historyRecord {
  .el-dialog {
    .processContainer {
      padding-left: 200px;
      .processWrapper {
        position: relative;
        &:nth-child(n + 2) {
          margin-top: 1px;
        }
        .process {
          border: 1px solid #d9d9d9;
          width: 500px;
          border-radius: 32px;
          padding-left: 30px;
          .procedureProcessContainer {
            display: flex;
            .handleProcessTitle {
            }

            .handleProcess {
            }
          }
          .personContainer {
            display: flex;
            .personTitle {
            }

            .person {
            }
          }

          .procedureContainer {
            display: flex;
            .procedureTitle {
            }

            .procedure {
            }
          }
          .procedureTimeContainer {
            display: flex;
            .handleTimeTitle {
            }

            .handleTime {
            }
          }

          .procedureCommentContainer {
            display: flex;
            .handleCommentTitle {
            }

            .handleComment {
            }
          }

          .procedureResultContainer {
            display: flex;
            .handleResultTitle {
            }

            .handleResult {
            }
          }
          .pictureContainer {
            .pictureTitle {
            }

            .picture {
              display: flex;
              flex-wrap: wrap;
              img.imgStyle {
                width: 50px;
                height: 50px;
              }
            }
          }
        }

        .processArrow {
          // position: absolute;
          // bottom: -80%;
          // left: 35%;
          // transform: translateX(-50%);
          margin-top: 10px;
          margin-left: 200px;
          img {
            width: 40px;
            height: 80px;
          }
        }
      }
    }
  }
  // }
</style>