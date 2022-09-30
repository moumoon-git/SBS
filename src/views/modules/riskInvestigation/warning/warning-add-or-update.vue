<template>
  <div class="warningShow">
    <el-dialog
      :title="dataForm.name"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="1012px"
      @closed="clearDialog"
    >
      <el-form v-if="type=='show'" :model="dataForm" ref="dataForm" label-width="164px">
        <div class="line-1">
          <div class="line-1-1">
            <el-form-item label="检查时间:">
              {{dataForm.gmtCreate}}
            </el-form-item>
          </div>

          <div class="line-1-2">
            <el-form-item label="检查人:">
              <span>{{dataForm.patrolContactorString}}</span>
            </el-form-item>
          </div>

          <div class="line-1-3">
            <el-form-item label="处置部门:">
              {{dataForm.handleDepString}}
            </el-form-item>
          </div>

          <div class="line-1-4">
            <el-form-item label="处置负责人:">
              {{dataForm.handleContactorString}}
            </el-form-item>
          </div>
        </div>

        <el-form-item label="检查内容:" class="line-2">
          {{dataForm.content}}
        </el-form-item>

        <el-form-item label="检查结果:" class="line-3">
          <span :class="dataForm.status=='0'?'errorResult':''">
            {{dataForm.statusName}}
          </span>
        </el-form-item>

        

        <el-form-item label="情况说明:" class="line-4">
          {{dataForm.remark}}
        </el-form-item>

        <el-form-item label="拍照说明:" class="line-5">
          <viewer>
            <img
              v-for="(item,index) in dataForm.imgUrl"
              :src="backgroundURL+item.url"
              :key="index"
            >
          </viewer>
        </el-form-item>

        <div class="warningShow-status">
          <img v-if="dataForm.isNotice == '0'" src="../../../../assets/img/yitongzhi.svg" style="width:120px" />
          <img v-if="dataForm.isNotice == '1'" src="../../../../assets/img/weitongzhi.svg" style="width:120px" />
        </div>

        <div class="warningShow-footer">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAiCAYAAABBY8kOAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGqADAAQAAAABAAAAIgAAAADdmEVNAAADNUlEQVRIDa2WTUhUURTHe48ZZwakgmAiR0cdFxKBiygqKhdJ4qIgCXfhIgxpUYQQEbmQoEUFWRStjKJVFCQSRItWhRm5sJW0GXVmtBZakLVxPvudiTvemXl3njrz4HHOPR///7nnnffetba5XLFYbF8mkzmTy+W6CG2yLKsBPYX8jlxAvvX5fBOhUChRCcoyOefn5w9ns9m7+I+ZYnQ7hK88Hs/1cDgc1e1KLyOiyjpIHiEvqKBNyJRt28Otra13SnOKiBYXF3clk8lxSI6XBm5mze6eQzaATKk8WymAeyF5XS2J4IHRPzc391BhiywQ4XhAQKfurFIf5BEMKox86+Lx+IF0Ov0FoqJWqqAq5CoTGWlsbPyZ31Eqlbq9QRIZ6xnub9y5DRSwHewbEmfTsnbkiUpJgGaZptFAILAzEons596LrYGc8Up54uMVGWATdRZEV1HKxlEHAPQW4MO6TenkvyH/lFo7SYrskdZ1Ozk12wqjelNbF6kUcanI4LCgkJNC1OTg003TgCV1g65TxALrJd3moIdt2KTXxguSjNG57siuq+UaHHtkR24jfZBAT3n6f0sikQihuXXFsqm44rYh2c2Ld81ExPiOmnzKLhzSuillMEliRqLR6AjSq2JY72DinmHrUzaThGhKxruP4JemoBL7H5JmsAXI6UD6SvymZbtFgg+yOBFBU1Q1dgr7yDvYKc9ojRfqcTVglXLBvyd+mTr5TNxHLIteywuS6ZaWlgnBzBO1tbX9lj9jjUlyEF3mzn9880RCAPMY4lMNycb4anxWeAUimLNer7cfx1/lrEJG6+vrh/T8ApEY5QQD4RU9YAt6msdwLhgMFhVcRCSgjOITyKSNW7rIHdJbpkAcv3O8W3Lk+oA8pAI3KJ8yWOedYst2JEFUlWT7vciYU5LBNkk3Lhp866eg0gCm8AdEPdy/Sn0O61lOqaeJXXPw5U2OrdODOXsf5ez9njb6dbumL/n9/iNuZ2/H1mkg25qbmyeptBebU7XL7KTbjUTwXIkkiCl6B5n8DgpHXPQV7i4KmUW6Xq6t0xH4B51l/QLSVe4uCviq+2uq80vpgDBcU9Bagv0D5fklJIM6aFwAAAAASUVORK5CYII="
            alt="定位icon"
          >
          <span>{{dataForm.place}}</span>
        </div>
      </el-form>
      
      <el-form v-else :model="dataForm" ref="dataForm" label-width="90px">
        <el-row :gutter="3" style="background-color:#F9FBFF" class="warningInput">
          <el-col :span="8">
            <el-form-item label="检查时间:" prop="gmtCreate">
              <el-input readonly v-model="dataForm.gmtCreate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="检查人:" prop="patrolContactorString">
              <el-input
                readonly
                v-model="dataForm.patrolContactorString"
                class="blue"
                style="color:#269CF3"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="处置部门:" prop="handleDepString">
              <el-input readonly v-model="dataForm.handleDepString"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="处置负责人:" prop="handleContactorString">
              <el-input
                readonly
                v-model="dataForm.handleContactorString"
                class="blue"
                style="color:#269CF3"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8"></el-col> -->
          <!-- <el-col :span="8">
            <span>
              <i class="el-icon-circle-check" style="color:#70B603;font-size:20px"></i>
              <span style="color:#70B603">已通知处置人员</span>
              <i class="el-icon-circle-close" style="color:#D9001B;font-size:20px"></i>
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU5ICg4NjEyNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+UmVjdGFuZ2xlIDIyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IumCgOivt+mTvuaOpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Iuafpeeci+aJgOacieWIh+WbvuWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc0LjAwMDAwMCwgLTgxMC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Imxhbmh1LWljb24tU2xpY2luZyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzQuMDAwMDAwLCA4MTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uEIj4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yMiIgeD0iMCIgeT0iMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS44MTM4NzIyLDQuMTU2NDM1NiBDMTIuMTI0ODQxOSw0LjQ1NTEwOTU1IDEyLjA0NjE1MTMsNC44NzY0NjU5NiAxMS41Nzc4MDAzLDUuNDIwNTA0ODEgTDkuOTU3LDcuMjkyIEw5Ljk2MjA4NTA3LDcuMjk3ODUxOTUgTDkuMzQzODEwNTYsNy45NzcwNTUzMyBMMTAuNTI3NTY0MSw5LjI5OTU1NDIxIEM5LjYyMTAzNTc3LDEwLjE5NDg3OTcgOC42ODM4MDUxMywxMC45MTEwNjc3IDcuNzE1ODcyMTgsMTEuNDQ4MTE3OSBDNi43NDc5MzkyMiwxMS45ODUxNjgyIDUuNTA5MzE1MTYsMTIuMTMwMjU1NyA0LDExLjg4MzM4MDMgTDguODk1LDYuMzQyIEw4Ljg5MjA1ODUsNi4zMzk0OTgxNCBMMTAuNTU2NjExNyw0LjU0MzQ1Nzk0IEMxMS4wODM4MTU2LDMuOTg2NzY5MSAxMS41MDI5MDI0LDMuODU3NzYxNjUgMTEuODEzODcyMiw0LjE1NjQzNTYgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgOC4wMDAwMDApIHJvdGF0ZSgyLjAwMDAwMCkgdHJhbnNsYXRlKC04LjAwMDAwMCwgLTguMDAwMDAwKSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
                alt
              />
              <span style="color:#D9001B">未通知处置人员</span>
            </span>
          </el-col>-->
        </el-row>

        <el-form-item label="检查内容:" prop="content" class="warningInput2">
          <el-input readonly v-model="dataForm.content"></el-input>
        </el-form-item>

        <el-form-item label="检查结果:" prop="statusName" class="warningInput2">
          <el-input
            readonly
            v-model="dataForm.statusName"
            :class="dataForm.status=='0'?'errorResult':''"
          >
            <!-- <template slot-scope="scope">
              <span v-if="scope.row.status == '0'" style="color：#D9001B">异常</span>
              <span v-if="scope.row.status == '1'">正常</span>
            </template>-->
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item label="情况说明:" prop="remark" class="warningInput2">
              <el-input readonly v-model="dataForm.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <div v-if="dataForm.isNotice == '0'" style="padding-left:100px">
                <img src="../../../../assets/img/yitongzhi.svg" style="width:100px" />
                <!--<span style="color:#70B603;font-size:14px">已通知处置人员</span> -->
              </div>
              <div v-if="dataForm.isNotice == '1'" style="padding-left:100px;">
                <img src="../../../../assets/img/weitongzhi.svg" style="width:100px" />
                <!--<span style="color:#D6001B;font-size:14px">未通知处置人员</span>-->
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="拍照说明:" prop="imgUrl" class="warningInput2">
          <!-- <el-input readonly v-model="dataForm.imgUrl"></el-input> -->
          <!-- <span ></span>
          <img :src="backgroundURL+'/fastdfs/group1/M00/00/33/rBBk7l5xz0SASsBDAALgbYJpeSg370.png'" />-->
          <viewer>
          <img
            v-for="(item,index) in dataForm.imgUrl"
            :src="backgroundURL+item.url"
            :key="index"
            style="height:130px;width:120px;min-width:99px;"
          /> </viewer>
        </el-form-item>
     
        <img
          src="../../../../assets/img/weizhi.svg"
          style="margin-left: 30px;margin-right:10px;width:20px"
        />
        <span>{{dataForm.place}}</span>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // backgroundURL: window.SITE_CONFIG.cloudUrl,
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      visible: false,
      dataForm: {
        id: "",
        remark: "",
        imgUrl: [],
        status: "",
        statusName: "",
        place: "",
        longitude: "",
        latitude: "",
        gmtCreate: "",
        isNotice: "",
        handleContactorString: "",
        patrolContactorString: "",
        patrolDepString: "",
        handleDepString: "",
        content: "",
        name:"",
      },
      disabled: true,
      type: ""
    };
  },

  methods: {
    clearDialog() {
      this.$refs["dataForm"].resetFields();
    },
    init(id, type) {
      this.dataForm.id = id;
      this.type = type;
      switch (type) {
        //新增
        case "add":
          this.visible = true;
          break;
        //查看
        case "show":
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/instanceInfor/instanceInfo/${this.dataForm.id}`
            ),
            method: "post",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              if (data.data.imgUrl != null && data.data.imgUrl.length > 0) {
                this.dataForm.imgUrl = JSON.parse(data.data.imgUrl);
              }
              this.dataForm.remark = data.data.remark;
              console.log(
                "图片路径",
                this.dataForm.imgUrl,
                JSON.parse(data.data.imgUrl)
              );
              this.dataForm.status = data.data.status;
              if (this.dataForm.status == "0") {
                this.dataForm.statusName = "异常";
              } else {
                this.dataForm.statusName = "正常";
              }
              this.dataForm.place = data.data.place;
              this.dataForm.longitude = data.data.longitude;
              this.dataForm.latitude = data.data.latitude;
              this.dataForm.gmtCreate = data.data.gmtModified;
              this.dataForm.isNotice = data.data.isNotice;
              this.dataForm.handleContactorString =
                data.data.taskInstanceEntity.taskEntity.handleContactorString;
              this.dataForm.patrolContactorString =
                data.data.contactorEntity ? data.data.contactorEntity.name : '';
              this.dataForm.patrolDepString =
                data.data.taskInstanceEntity.taskEntity.patrolDepString;
              this.dataForm.handleDepString =
                data.data.taskInstanceEntity.taskEntity.handleDepString;
              if (data.data.inforEntity != null) {
                this.dataForm.content = data.data.inforEntity.content;
                this.dataForm.name = data.data.inforEntity.name;
              }
              this.visible = true;
            } else {
              this.$message.error(data.msg);
            }
          });
          break;
        default:
      }
    }
  }
};
</script>

<style lang="less">
* {
  font-family: PingFangSC-Regular, PingFang SC;
}
.warningShow {
  .el-input.is-disabled {
    .el-input__inner {
      border: 0;
      background-color: white;
      border-color: white;
    }
  }
  .warningInput {
    .el-input--medium {
      .el-input__inner {
        border: 0;
        background-color: #f9fbff;
      }
    }
  }

  .warningInput2 {
    .el-input--medium {
      .el-input__inner {
        border: 0;
        background-color: white;
      }
    }
  }
  .errorResult {
    color: rgba(246, 110, 110, 1);
    .el-input__inner {
      color: rgba(246, 110, 110, 1);
    }
  }
  .warningInput .blue .el-input__inner {
    color: #269cf3;
  }

  /deep/.el-dialog {
    border-radius: 7px;
    /deep/.el-dialog__header {
      background: #F1F4F6;
      border-radius: 7px;
      padding: 15px 28px;
      .el-dialog__title {
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
      }
      .el-dialog__headerbtn {
        height: 21px;
        width: 21px;
        line-height: 21px;
        text-align: center;
        position: absolute;
        top: 17px;
        right: 14px;
        i {
          font-size: 20px;
          font-weight: bolder;
        }
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  .el-form-item {
    margin: 0;
  }
  label {
    font-size: 14px;
    color: rgba(85, 85, 85, 1);
  }
  .el-form-item__content {
    font-size: 14px;
    color: rgba(85, 85, 85, 1);
    margin-right: 89px;
  }
  .line-1 {
    background: rgba(249, 251, 255, 1);
    height: 66px;
    line-height: 66px;
    margin-bottom: 10px;
    .el-form-item__content {
      font-family: PingFangSC-Regular, PingFang SC;
      margin-right: 0;
    }
    >* {
      display: inline-block;
      margin: 0;
    }
    .line-1-1 {
      width: 367px;
    }
    .line-1-2 {
      padding: 0;
      width: 170px;
      span {
        color: rgba(0, 145, 255, 1);
      }
      label {
        width: auto !important;
      }
      .el-form-item__content {
        margin-left: 67.5px !important;
      }
    }
    .line-1-3 {
      width: 188px;
      label {
        width: auto !important;
      }
      .el-form-item__content {
        margin-left: 84.5px !important;
      }
    }
    .line-1-4 {
      label {
        width: auto !important;
      }
      .el-form-item__content {
        margin-left: 101.5px !important;
        color: rgba(0, 145, 255, 1);
      }
    }
  }
  .warningShow-status {
    position: absolute;
    right: 69px;
    bottom: 150px;
  }
  .line-5 {
    img {
      height: 190px;
      margin-right: 18px;
    }
    /deep/.el-form-item__content {
      margin-top: 10px;
      margin-right: 200px;
    }
  }
  .warningShow-footer {
    border-top: 1px solid rgba(221, 221, 221, 1);
    margin-top: 27px;
    padding: 18px 28px 20px 28px;
    img {
      height: 23px;
      position: relative;
      bottom: 3px;
      margin-right: 5px;
    }
    span {
      font-size:14px;
      color: rgba(102,102,102,1);
    }
  }
}
.viewer-container {
  z-index: 999999 !important;
}
</style>