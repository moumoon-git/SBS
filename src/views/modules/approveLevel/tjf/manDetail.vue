<template>
  <el-dialog
    class="membership-dialog"
    title="查看成员信息"
    :visible.sync="dialogVisible"
    append-to-body
    width="60%"
    :close-on-click-modal="false"
  >
    <!-- <div class="membership-dialog-header">
      <span :class="tab==1?'active':''" @click="tab=1">成员信息</span>
      <span
                  :class="tab==2?'active':''"
                  @click="tab=2"
              >
                  奖励记录
      </span>
    </div>-->
    <div class="man-info" v-if="tab == 1">
      <div class="basic-info">
        <div class="membership-content-title">
          <div class="title-inner">基本信息</div>
        </div>
        <div class="basic-info-picture-container">
          <div
            class="basic-info-picture"
            v-for="(img, index) in JSON.parse(manDetailData.faceUrl)"
            :key="`img_${index}`"
          >
            <img
              :alt="img.name"
              :src="$window.SITE_CONFIG['cloudUrl'] + img.url"
            />
          </div>
        </div>
        <el-form
          class="membership-content"
          :model="manDetailData"
          label-width="168px"
        >
          <div class="basic-info-left-side">
            <el-form-item label="成员类型">{{
              manDetailData.memberTypeString
            }}</el-form-item>
            <el-form-item label="姓名">{{ manDetailData.name }}</el-form-item>
            <el-form-item label="身高"
              >{{ manDetailData.height }}cm</el-form-item
            >
            <el-form-item label="出生年月">{{
              manDetailData.birth
            }}</el-form-item>
            <el-form-item label="民族">{{ manDetailData.nation }}</el-form-item>
            <el-form-item label="学历">{{
              manDetailData.educationString
            }}</el-form-item>
            <el-form-item label="毕业学校">{{
              manDetailData.graduationSchool
            }}</el-form-item>
            <el-form-item label="政治面貌">{{
              manDetailData.politicalOutlookString
            }}</el-form-item>
            <el-form-item label="身份证号">{{
              manDetailData.credentialsNum
            }}</el-form-item>
            <el-form-item label="联系电话">{{
              manDetailData.phone
            }}</el-form-item>
            <el-form-item label="户口地址">{{
              manDetailData.nationPlace
            }}</el-form-item>
            <el-form-item label="健康情况">{{
              manDetailData.health
            }}</el-form-item>
            <el-form-item label="有无从事群防共治经验"
              >{{ manDetailData.isExperience == 1 ? "有" : null
              }}{{
                manDetailData.isExperience == 0 ? "无" : null
              }}</el-form-item
            >
          </div>
          <div class="basic-info-right-side">
            <el-form-item label="性别">{{
              manDetailData.sex == "0" ? "男" : "女"
            }}</el-form-item>
            <el-form-item label="籍贯">{{
              manDetailData.nativePlace
            }}</el-form-item>
            <el-form-item label="体重">{{ manDetailData.weight }}</el-form-item>
            <el-form-item label="出生地">{{
              manDetailData.birthPlace
            }}</el-form-item>
            <el-form-item label="所属村委">{{
              manDetailData.villageCommitteeString
            }}</el-form-item>
            <el-form-item label="毕业时间">{{
              manDetailData.graduationTime
            }}</el-form-item>
            <el-form-item label="专业">{{ manDetailData.major }}</el-form-item>
            <el-form-item label="户口性质">{{
              manDetailData.natureAccountString
            }}</el-form-item>
            <el-form-item label="驾驶证类别">{{
              manDetailData.driverTypeString
            }}</el-form-item>
            <el-form-item label="家庭电话">{{
              manDetailData.homePhone
            }}</el-form-item>
            <el-form-item label="邮编">{{
              manDetailData.zipCode
            }}</el-form-item>
            <el-form-item label="是否退伍军人"
              >{{ manDetailData.isVeteran == 1 ? "有" : null
              }}{{ manDetailData.isVeteran == 0 ? "无" : null }}</el-form-item
            >
          </div>
        </el-form>
      </div>
      <div class="resume">
        <div class="membership-content-title">
          <div class="title-inner">个人简历</div>
        </div>
        <div class="resume-table">
          <span>
            <div>开始及结束时间</div>
            <div
              class="table-item"
              v-for="(exp, index) in manDetailData.curriculumVitaeEntities"
              :key="`exp_time_${index}`"
            >
              {{ exp.startEndTime }}
            </div>
          </span>
          <span>
            <div>在何单位学习或工作</div>
            <div
              class="table-item"
              v-for="(exp, index) in manDetailData.curriculumVitaeEntities"
              :key="`exp_unit_${index}`"
            >
              {{ exp.study }}
            </div>
          </span>
          <span>
            <div>职务</div>
            <div
              class="table-item"
              v-for="(exp, index) in manDetailData.curriculumVitaeEntities"
              :key="`exp_job_${index}`"
            >
              {{ exp.post }}
            </div>
          </span>
        </div>
      </div>
      <div class="family-situation">
        <div class="membership-content-title">
          <div class="title-inner">家庭情况</div>
        </div>
        <el-form class="content" :model="manDetailData" label-width="90px">
          <div class="top-container">
            <div class="left">
              <el-form-item label="配偶姓名">{{
                manDetailData.homeSpousename
              }}</el-form-item>
              <el-form-item label="现住址">{{
                manDetailData.homeAddress
              }}</el-form-item>
              <el-form-item label="户籍所在地">{{
                manDetailData.homeNation
              }}</el-form-item>
            </div>
            <div class="right">
              <el-form-item label="联系电话">{{
                manDetailData.homeSpousephone
              }}</el-form-item>
              <el-form-item label="工作单位">{{
                manDetailData.homespouseunit
              }}</el-form-item>
            </div>
          </div>
          <div class="other-members">
            <div class="members-table">
              <div>其他成员</div>
              <span>
                <div>关系</div>
                <div
                  class="table-item"
                  v-for="(member, index) in manDetailData.homeMemberEntities"
                  :key="`member_relationship_${index}`"
                >
                  {{ member.relationship }}
                </div>
              </span>
              <span>
                <div>姓名</div>
                <div
                  class="table-item"
                  v-for="(member, index) in manDetailData.homeMemberEntities"
                  :key="`member_name_${index}`"
                >
                  {{ member.name }}
                </div>
              </span>
              <span>
                <div>单位</div>
                <div
                  class="table-item"
                  v-for="(member, index) in manDetailData.homeMemberEntities"
                  :key="`member_unit_${index}`"
                >
                  {{ member.workUnit }}
                </div>
              </span>
              <span>
                <div>联系电话</div>
                <div
                  class="table-item"
                  v-for="(member, index) in manDetailData.homeMemberEntities"
                  :key="`member_phone_${index}`"
                >
                  {{ member.phone }}
                </div>
              </span>
            </div>
          </div>
        </el-form>
      </div>
      <div class="specialty">
        <div class="membership-content-title">
          <div class="title-inner">个人特长</div>
        </div>
        <div>
          <div>{{ manDetailData.personalSpecialty }}</div>
        </div>
      </div>
      <div class="attachment">
        <div class="membership-content-title">
          <div class="title-inner">附件</div>
        </div>
        <div class="attachment-content">
          <div
            class="attachment-item"
            v-for="(file, index) in manDetailData.documents"
            :key="`file_${index}`"
          >
            <img
              alt="附件icon"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAxhJREFUSA2VlcdPFVEcRh/NggWRYCWKBewtrDWaWHGDWOLGnf+cG0VNXLhRYje6IYIxdIGIFSuJFc+5zIVxMiDvS87MnXvvzPd+ZeaVFYpTLdvPQzX0F3NraRGbV7D3HGhSWcR9YWv5HG9Yyb4zsABG4CYUpbI57NbkLESTy4x/ZO5byrWRzkvWJjLrhZLsROZ6FddGMh+GQZOfoHxoE+yCJRDleg88gLE4OZvRajZp4gOH4ApEkxrGp6AKoj4zWAQxS78Zm+IumDGiNaydBk1eQhtEk3S9vjF/C/qSdZvLpjkIa0Fdg+7oHmaSgxtiJIOMNfmVrKXrZSovwWv4k6xbm6/QCXamqV8PHVmjOiaNpAIG4CpEE2+yKaxXTGW2KViakploBOs3njaKNdGkHww5mrgWTbKpZClXRunrUw+l5lTp2gKamO90JNYrm8pYL5aCbG/rmZVpVVXR6BAX5nQUroMdo9L1GuA63RSuq+1wEVq9yChmbMLQ7JIGMNQbENNl4WeqF0tBOzgeT8amNCufocY02hKGhcILJ5Kx882QV69kS3hRjyYXTznfjwvJ2abZm4x7faDtp3omT+Fohy0HW9VUxigZBu3meCQZP+HcnozjqYSB64vhC3Rq5IX6MHkKR4ur3kC28HuYO+wiegx3wmj6oImRmqmpctgMpkelf/X7yamCHednJWofg2jyiHGeyTHmd4ImZmMYQp/7GbE1jewjKCNxQx1cgG5YBvWgHsK9MJo+GMkJ2Aaa+B72QpDt58Nq4BMEd85qCIzIWlkzjYz6NpiytMxMNPHV0KQvvUGjcmgA69IBfq/Ud3gGr8BUPod2GIS0sia+7H5Z/pFGtrTvg598Cz8CaZlO50yn5mlp0gxbwUhyTZgP/x3mcxyMah28hXQHcpkrM3ESGsGUajIAuTIi9Q4Wgh9Pf52FHQV/RJ6saQv4DmrSBtmUMjUtHxhlGg5AUzJhN/q1sCl8cSugGjbCJlDuMRLrOKvSRnHjZgb7wW6bSTZMF9wFf8R/lWfkTc7XwwaohUowRT7UCHvAJpmz/gLdl7T+7ODnCQAAAABJRU5ErkJggg=="
            />
            <a :href="`${cloudUrl}/${file.url}`">{{ file.documentName }}</a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tab == 2"></div>
  </el-dialog>
</template>

<script>
export default {
  name: "manDetail",
  components: {},
  props: ["manDetailData"],
  data() {
    return {
      // 弹窗可见
      dialogVisible: false,
      // 顶部标签切换，取值1或2
      tab: 1,
      cloudUrl: window.SITE_CONFIG.cloudUrl
    };
  },
  methods: {}
};
</script>

<style lang="less">
.membership-dialog {
  * {
    font-size: 14px;
  }
  /deep/.el-dialog {
    border-radius: 7px;
    max-width: 1076px;
    min-width: 800px;
    /deep/.el-dialog__header {
      background: #f1f4f6;
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
        top: 14px;
        right: 14px;
        i {
          font-size: 20px;
          font-weight: bolder;
        }
      }
    }
    /deep/.el-dialog__body {
      padding: 0;
    }
  }
  .membership-content-title {
    background: #f0f5ff;
    padding: 16px 28px;
    .title-inner {
      border-left: 2px solid #3f92fe;
      padding-left: 14px;
      font-size: 16px;
      color: #333333;
      line-height: 16px;
      height: 16px;
    }
  }
  /deep/.el-form-item__content {
    color: #333333;
  }
  /deep/.el-form-item__label {
    color: #999999;
  }
}
.man-info {
  .basic-info {
    position: relative;
    .basic-info-picture-container {
      position: absolute;
      left: 40px;
      top: 70px;
      .basic-info-picture {
        img {
          width: 164px;
          margin-bottom: 14px;
        }
      }
    }
    .membership-content {
      display: flex;
      padding: 10px;
      .basic-info-left-side {
        margin: 0;
        margin-left: 160px;
        display: inline-block;
        width: 50%;
      }
      .basic-info-right-side {
        margin: 0;
        display: inline-block;
        width: 50%;
      }
    }
  }
  .resume {
    .resume-table {
      display: flex;
      justify-content: center;
      & > span {
        margin: 20px 7px;
        color: #000000;
        width: 30%;
        & > div:first-child {
          margin: 5px;
        }
      }
      .table-item {
        color: #666666;
        width: 100%;
        min-height: 42px;
        background: rgb(248, 248, 248);
        border: 1px solid #dedede;
        border-radius: 4px;
        text-align: left;
        padding: 9px 14px;
        margin-bottom: 5px;
      }
    }
  }
  .family-situation {
    .content {
      padding: 28px;
      .top-container {
        display: flex;
        padding: 0 100px;
        justify-content: center;
        .left,
        .right {
          width: 40%;
        }
      }
    }
    .other-members {
      .members-table {
        display: flex;
        justify-content: center;
        margin-left: 70px;
        position: relative;
        & > div {
          position: absolute;
          left: -70px;
          top: 42px;
          color: #333333;
        }
        & > span {
          margin: 0px 7px;
          color: #000000;
          & > div:first-child {
            margin: 5px;
          }
          &:nth-child(3) {
            flex: 1;
          }
        }
        .table-item {
          color: #666666;
          width: 100%;
          min-height: 42px;
          background: rgb(248, 248, 248);
          border: 1px solid #dedede;
          border-radius: 4px;
          text-align: left;
          padding: 9px 14px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .specialty {
    & > div:last-child {
      padding: 28px 56px;
      div {
        color: #666666;
        width: 100%;
        min-height: 42px;
        background: rgb(248, 248, 248);
        border: 1px solid #dedede;
        border-radius: 4px;
        text-align: left;
        padding: 9px 14px;
      }
    }
  }
  .attachment {
    .attachment-content {
      padding: 11px 63px 20px;
      min-height: 52px;
      .attachment-item {
        img {
          width: 14px;
          height: 14px;
          position: relative;
          bottom: 2px;
        }
        a {
          color: #0091ff;
        }
      }
    }
  }
}
</style>