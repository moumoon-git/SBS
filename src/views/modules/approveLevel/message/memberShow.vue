<!--authorName chenbin-->
<template>
  <!-- 查看成员信息 -->
  <el-dialog
    width="1085px"
    class="watch_information"
    title="查看成员信息"
    :visible.sync="dialogFormVisibleWatch"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div style="display: flex">
      <div style="width: 1090px">
        <div class="header_toggle">
          <div
            @click="informationToggle(1)"
            style="borderradius: 4px 0 0 4px; borderright: none"
            :class="isSelect ? 'active' : ''"
          >
            成员信息
          </div>
          <div
            @click="informationToggle"
            style="borderradius: 0 4px 4px 0; borderleft: none"
            :class="!isSelect ? 'active' : ''"
          >
            奖励记录
          </div>
        </div>
        <!-- 成员信息模块 -->
        <div v-show="toggleInformation">
          <!-- <div style="display:flex">
          <div style="width:1078px">-->
          <div class="titleBorder_watch">
            <span>基本信息</span>
            <img
              v-if="detailData.status == 0"
              src="../../../../assets/img/member_dtj.svg"
              alt
            />
            <img
              v-if="detailData.status == 1"
              src="../../../../assets/img/member_dsh.svg"
              alt
            />
            <img
              v-if="detailData.status == 2"
              src="../../../../assets/img/member_ysh.svg"
              alt
            />
            <img
              v-if="detailData.status == 3"
              src="../../../../assets/img/member_ybh.svg"
              alt
            />
          </div>
          <el-form :model="form" style="display: flex">
            <div class="image_watch">
              <el-form-item
                v-if="detailData.urlList[0].url"
                :label-width="formLabelWidth_watch"
              >
                <img
                  :src="backgroundURL + detailData.urlList[0].url"
                  style="width: 101px; height: 125px"
                />
              </el-form-item>
              <!-- 默认头像 -->
              <el-form-item
                v-if="detailData.urlList[0].url == ''"
                :label-width="formLabelWidth_watch"
              >
                <img
                  src="../../../../assets/img/avatar.png"
                  style="width: 101px; height: 125px"
                />
              </el-form-item>
              <el-form-item
                v-if="detailData.urlList[1].url"
                :label-width="formLabelWidth_watch"
              >
                <img
                  :src="backgroundURL + detailData.urlList[1].url"
                  style="width: 164px; height: 105px"
                />
              </el-form-item>
              <el-form-item
                v-if="detailData.urlList[2].url"
                :label-width="formLabelWidth_watch"
              >
                <img
                  :src="backgroundURL + detailData.urlList[2].url"
                  style="width: 164px; height: 105px"
                />
              </el-form-item>
            </div>
            <div class="watch_information_left" style="width: 400px">
              <!-- <el-form-item
                          v-if="detailData.urlList"
                          label="相片"
                          :label-width="formLabelWidth"
                        >
                          <img
                            :src="backgroundURL+detailData.urlList[0].url"
                            style="width:79px;height:79px;border:1px solid #ccc"
                          />
                        </el-form-item>
                        <el-form-item
                          v-if="detailData.urlList"
                          label="相片"
                          :label-width="formLabelWidth"
                        >
                          <img
                            :src="backgroundURL+detailData.urlList[1].url"
                            style="width:79px;height:79px;border:1px solid #ccc"
                          />
                        </el-form-item>
                        <el-form-item
                          v-if="detailData.urlList"
                          label="相片"
                          :label-width="formLabelWidth"
                        >
                          <img
                            :src="backgroundURL+detailData.urlList[2].url"
                            style="width:79px;height:79px;border:1px solid #ccc"
                          />
              </el-form-item>-->
              <el-form-item label="成员类型" :label-width="formLabelWidth">{{
                detailData.memberTypeString
              }}</el-form-item>
              <el-form-item
                label="姓名"
                required
                :label-width="formLabelWidth"
                >{{ detailData.name }}</el-form-item
              >
              <el-form-item label="出生年月" :label-width="formLabelWidth">{{
                detailData.birth
              }}</el-form-item>
              <el-form-item label="民族" :label-width="formLabelWidth">{{
                detailData.nation
              }}</el-form-item>
              <el-form-item label="学历" :label-width="formLabelWidth">{{
                detailData.educationString
              }}</el-form-item>
              <el-form-item label="所属村委" :label-width="formLabelWidth">{{
                detailData.villageCommitteeString
              }}</el-form-item>
              <!-- <el-form-item
                          label="毕业学校"
                          :label-width="formLabelWidth"
              >{{detailData.graduationSchool}}</el-form-item>-->
              <el-form-item label="政治面貌" :label-width="formLabelWidth">{{
                detailData.politicalOutlookString
              }}</el-form-item>
              <el-form-item label="身份证号" :label-width="formLabelWidth">{{
                detailData.credentialsNum
              }}</el-form-item>
              <el-form-item label="联系电话" :label-width="formLabelWidth">{{
                detailData.phone
              }}</el-form-item>
              <!-- <el-form-item
                          label="户口地址"
                          :label-width="formLabelWidth"
              >{{detailData.nationPlace}}</el-form-item>-->
              <el-form-item label="健康情况" :label-width="formLabelWidth">{{
                detailData.health
              }}</el-form-item>
              <el-form-item
                label="有无从事群防群治经验"
                :label-width="formLabelWidth"
                >{{
                  detailData.isExperience == "1"
                    ? "是"
                    : detailData.isExperience == "0"
                    ? "否"
                    : ""
                }}</el-form-item
              >
              <el-form-item
                label="是否退伍军人"
                :label-width="formLabelWidth"
                >{{
                  detailData.isVeteran == "1"
                    ? "是"
                    : detailData.isVeteran == "0"
                    ? "否"
                    : ""
                }}</el-form-item
              >
            </div>
            <div class="watch_information_right" style="width: 400px">
              <el-form-item label="性别" :label-width="formLabelWidth">{{
                detailData.sex == "0" ? "男" : detailData.sex == "1" ? "女" : ""
              }}</el-form-item>
              <el-form-item label="身高" :label-width="formLabelWidth">{{
                detailData.height
              }}</el-form-item>
              <el-form-item label="体重" :label-width="formLabelWidth">{{
                detailData.weight
              }}</el-form-item>
              <el-form-item label="籍贯" :label-width="formLabelWidth">{{
                detailData.nativePlace
              }}</el-form-item>
              <el-form-item label="出生地" :label-width="formLabelWidth">{{
                detailData.birthPlace
              }}</el-form-item>
              <el-form-item label="毕业学校" :label-width="formLabelWidth">{{
                detailData.graduationSchool
              }}</el-form-item>
              <!-- <el-form-item
                          label="所属村委"
                          :label-width="formLabelWidth"
              >{{detailData.villageCommitteeString}}</el-form-item>-->
              <el-form-item label="毕业时间" :label-width="formLabelWidth">{{
                detailData.graduationTime
              }}</el-form-item>
              <el-form-item label="专业" :label-width="formLabelWidth">{{
                detailData.major
              }}</el-form-item>
              <el-form-item label="户口地址" :label-width="formLabelWidth">{{
                detailData.nationPlace
              }}</el-form-item>
              <el-form-item
                v-show="hide"
                label="户口性质"
                :label-width="formLabelWidth"
                >{{ detailData.natureAccountString }}</el-form-item
              >
              <el-form-item label="驾驶证类别" :label-width="formLabelWidth">{{
                detailData.driverTypeString
              }}</el-form-item>
              <el-form-item label="家庭电话" :label-width="formLabelWidth">{{
                detailData.homePhone
              }}</el-form-item>
              <el-form-item
                v-show="hide"
                label="邮编"
                :label-width="formLabelWidth"
                >{{ detailData.zipCode }}</el-form-item
              >
              <!-- <el-form-item
                          label="是否退伍军人/有无从事群防群治经验"
                          :label-width="formLabelWidth1"
              >{{detailData.isExperience}}</el-form-item>-->
            </div>
            <!-- <div style="width:400px;height:557px;marginLeft:20px">
                    <showProcess
                      ref="showProcess"
                      :typeName="type"
                      :processlist="processList"
                      :tianbaounit="tianbaoUnit"
                      :createuser="createUser"
                      :baoshendata="baoshenData"
                      :platformoptions="platformOptions"
                      :unitlist="unitList"
                      :processtype="processType"
                      :nextplatformname="nextPlatformName"
                      @getNextPlatform="changeNextPlatform"
                      @queryH="queryHHistoryRecord"
                      style="marginLeft:170px;marginTop:-20px"
                    ></showProcess>
            </div>-->
          </el-form>
          <div class="titleBorder_watch">
            <span>个人简历</span>
          </div>
          <div
            class="grayBox_watch"
            style="margin: 0 0 0 65px"
            v-for="(item, index) in detailData.curriculumVitaeEntities"
            :key="'detailCurriculumVitaeEntities' + index"
          >
            <div style="display: flex; height: 100%">
              <div style="margin: 0 20px; flex: 1">
                <div>开始及结束时间</div>
                <span>{{
                  detailData.curriculumVitaeEntities
                    ? detailData.curriculumVitaeEntities[index].startEndTime &&
                      detailData.curriculumVitaeEntities[index]
                        .startEndTime instanceof Object
                      ? detailData.curriculumVitaeEntities[
                          index
                        ].startEndTime.join("-")
                      : ""
                    : ""
                }}</span>
              </div>
              <div style="margin: 0 20px; flex: 1">
                <div>在何单位学习或工作</div>
                <span>{{
                  detailData.curriculumVitaeEntities
                    ? detailData.curriculumVitaeEntities[index].study
                      ? detailData.curriculumVitaeEntities[index].study
                      : ""
                    : ""
                }}</span>
              </div>
              <div style="margin: 0 20px; flex: 1">
                <div>职务</div>
                <span>{{
                  detailData.curriculumVitaeEntities
                    ? detailData.curriculumVitaeEntities[index].post
                      ? detailData.curriculumVitaeEntities[index].post
                      : ""
                    : ""
                }}</span>
              </div>
            </div>
          </div>
          <div class="titleBorder_watch">
            <span>家庭情况</span>
          </div>
          <el-form :model="form" style="display: flex; marginleft: 200px">
            <div class="watch_information_left" style="width: 455px">
              <el-form-item label="配偶姓名" :label-width="formLabelWidth">{{
                detailData.homeSpousename
              }}</el-form-item>
              <!-- <el-form-item
                          label="现住址"
                          :label-width="formLabelWidth"
              >{{detailData.homeAddress}}</el-form-item>-->
            </div>
            <div class="watch_information_center" style="width: 400px">
              <el-form-item label="联系电话" label-width="140px">{{
                detailData.homeSpousephone
              }}</el-form-item>
            </div>
            <!-- <div class="watch_information_right">
                        <el-form-item
                          label="户籍所在地"
                          :label-width="formLabelWidth"
                        >{{detailData.homeNation}}</el-form-item>
            </div>-->
          </el-form>
          <el-form :model="form" style="display: flex; marginleft: 200px">
            <div
              v-show="hide"
              class="watch_information_left"
              style="width: 455px"
            >
              <el-form-item label="现住址" :label-width="formLabelWidth">{{
                detailData.homeAddress
              }}</el-form-item>
              <!-- <el-form-item
                          label="配偶姓名"
                          :label-width="formLabelWidth"
              >{{detailData.homeSpousename}}</el-form-item>-->
            </div>
            <!-- <div class="watch_information_center" style="width:230px">
                        <el-form-item
                          label="联系电话"
                          :label-width="formLabelWidth"
                        >{{detailData.homeSpousephone}}</el-form-item>
            </div>-->
            <div
              v-show="hide"
              class="watch_information_right"
              style="width: 600px"
            >
              <el-form-item label="工作单位" label-width="140px">{{
                detailData.homespouseunit
              }}</el-form-item>
            </div>
          </el-form>
          <el-form class="otherMember">
            <el-form-item label="其他成员" :label-width="formLabelWidth">
              <div
                class="grayBox_watch"
                v-for="(item, index) in detailData.homeMemberEntities"
                :key="'detailHomeMemberEntities' + index"
              >
                <div style="display: flex; height: 100%">
                  <div style="margin: auto 20px auto -15px; flex: 1">
                    <div>关系</div>
                    <div>
                      <span style="width: 300px">{{
                        detailData.homeMemberEntities
                          ? detailData.homeMemberEntities[index].relationship
                            ? detailData.homeMemberEntities[index].relationship
                            : ""
                          : ""
                      }}</span>
                    </div>
                  </div>
                  <div style="margin: auto 20px; flex: 1">
                    <div>姓名</div>
                    <div>
                      <span style="width: 270px">{{
                        detailData.homeMemberEntities
                          ? detailData.homeMemberEntities[index].name
                            ? detailData.homeMemberEntities[index].name
                            : ""
                          : ""
                      }}</span>
                    </div>
                  </div>
                  <div v-show="hide" style="margin: auto 7px; flex: 1">
                    <div>单位</div>
                    <div>
                      <span style="width: 491px">{{
                        detailData.homeMemberEntities
                          ? detailData.homeMemberEntities[index].workUnit
                            ? detailData.homeMemberEntities[index].workUnit
                            : ""
                          : ""
                      }}</span>
                    </div>
                  </div>
                  <div style="margin: auto 20px; flex: 1">
                    <div>联系电话</div>
                    <div>
                      <span style="width: 270px">{{
                        detailData.homeMemberEntities
                          ? detailData.homeMemberEntities[index].phone
                            ? detailData.homeMemberEntities[index].phone
                            : ""
                          : ""
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <div class="titleBorder_watch">
            <span>个人特长</span>
          </div>
          <el-input
            type="textarea"
            v-model="detailData.personalSpecialty"
            class="special_watch"
            style="marginleft: 56px"
            resize="none"
            readonly
          ></el-input>
          <div class="titleBorder_watch">
            <span>附件</span>
          </div>
          <p
            style="marginleft: 56px; margintop: -14px"
            v-for="(item, index) in detailData.documents"
            :key="'documents' + index"
          >
            <el-link
              :href="backgroundURL + item.url"
              :underline="false"
              type="primary"
              >{{ item.documentName }}</el-link
            >
          </p>
        </div>
        <!-- 成员信息模块 -->

        <!-- 奖励记录模块 -->
        <div class="reward" v-show="!toggleInformation">
          <div
            class="reward_top"
            v-for="(item, index) in rewardData"
            :key="index"
          >
            <div class="top_title">
              <div>
                获奖类型：{{
                  item.approveManageEntity.approveTikuEntity.registerName
                }}
              </div>
              <div class="title_time">获奖时间：{{ item.gmtCreate }}</div>
            </div>
            <p class="reward_text">
              奖项说明：{{ item.approveManageEntity.approveTikuEntity.remark }}
            </p>
            <div class="top_content">
              <div>
                <tikuDetail :currentId="item.id"></tikuDetail>
              </div>
              <p style="margin-left: 3vw">
                申领奖励金额：{{ item.rewardAmount }}
              </p>
              <div class="top_content_bottom">
                <div
                  v-for="(data, i) in item.approveManageEntity.processList"
                  :key="i"
                >
                  <p v-if="i > 0">
                    {{ data.depName }}意见：{{
                      data.approveApproveEntity != null
                        ? data.approveApproveEntity.approveResult == "0"
                          ? "同意"
                          : "驳回"
                        : ""
                    }}
                    <span>{{
                      data.approveApproveEntity != null
                        ? data.approveApproveEntity.gmtModified
                        : ""
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleWatch = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditEntryApply"
            >确 定</el-button
          >
        </div> -->
      </div>
      <!-- <div style="width:400px;marginLeft:20px;">
        <showProcess
          ref="showProcess"
          :typeName="type"
          :processlist="processList"
          :tianbaounit="tianbaoUnit"
          :createuser="createUser"
          :baoshendata="baoshenData"
          :platformoptions="platformOptions"
          :unitlist="unitList"
          :processtype="processType"
          :nextplatformname="nextPlatformName"
          :manageList="managelist"
          :manageid="manageId"
          @getNextPlatform="changeNextPlatform"
          @queryHistoryRecord="queryHHistoryRecord"
          @changeManage="changeManage"
        ></showProcess>
      </div> -->
    </div>
  </el-dialog>
  <!-- 查看成员信息 -->
</template>

<script>
import historyRecord from "@/views/modules/approveLevel/resourceManage/historyRecord.vue";
import showProcess from "../../groupControl/showProcess";
export default {
  components: {
    showProcess,
    historyRecord,
  },
  data() {
    return {
      dataId: "",
      isSelect: true,
      hide: false,
      dataForm: {
        id: "",
      },
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      formLabelWidth: "195px",
      formLabelWidth_watch: "170px",
      formLabelWidth1: "250px",
      type: "",
      showshenhe: false,
      dialogFormVisibleWatch: false, //查看入职信息
      toggleInformation: true,
      //查看奖励信息参数
      rewardData: [],
      //查看成员信息参数
      detailData: {
        urlList: [
          {
            name: "",
            url: "",
          },
          {
            name: "",
            url: "",
          },
          {
            name: "",
            url: "",
          },
        ],
        faceUrl: "",
        name: "",
        memberType: "",
        sex: "",
        height: "",
        weight: "",
        nativePlace: "",
        birth: "",
        birthPlace: "",
        nation: "",
        villageCommittee: "",
        education: "",
        graduationSchool: "",
        graduationTime: "",
        major: "",
        politicalOutlook: "",
        credentialsNum: "",
        driverType: "",
        phone: "",
        homePhone: "",
        nationPlace: "",
        zipCode: "",
        health: "",
        isExperience: "",
        curriculumVitae: "",
        curriculumVitaeEntities: [
          {
            startEndTime: "",
            study: "",
            post: "",
          },
        ],
        homeAddress: "",
        homeNation: "",
        homeSpousename: "",
        homeSpousephone: "",
        homespouseunit: "",
        homeMember: "",
        homeMemberEntities: [
          {
            relationship: "",
            name: "",
            workUnit: "",
            phone: "",
          },
        ],
        personalSpecialty: "",
        documents: [
          {
            documentName: "",
            url: "",
          },
        ],
        natureAccount: "",
      },
      fileList: [],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      // 报审平台数据
      platformData: [],
      //报审单位
      baoshenData: {
        id: "",
        name: "",
        contactor: { id: "", name: "", role: "", phone: "" },
      },
      //流程单位
      unitList: [],
      //类型
      processType: [],
      processList: [],
      processId: "",
      //填报人
      createUser: {
        id: "",
        name: "",
        phone: "",
        role: "",
      },
      //新增
      //填报单位
      tianbaoUnit: "",
      //当前平台
      nowPlatForm: "",
      nextPlatformName: "",
      nextPlatformId: "",

      //平台选项
      platformOptions: [
        {
          label: "",
          value: "",
        },
      ],
      managelist: [],
      manageId: "",
      //状态值
      options: [
        {
          value: "0",
          label: "待提交",
        },
        {
          value: "1",
          label: "待审核",
        },
        {
          value: "2",
          label: "已审核",
        },
        {
          value: "3",
          label: "已驳回",
        },
      ],
      //性别
      sexType: [
        { name: "男", code: "0" },
        { name: "女", code: "1" },
      ],
      //有无从事群防群治经验
      experienceType: [
        {
          name: "是",
          code: "1",
        },
        {
          name: "否",
          code: "0",
        },
      ],
      //是否退伍军人
      veteran: [
        {
          name: "是",
          code: "1",
        },
        {
          name: "否",
          code: "0",
        },
      ],
      //成员类型
      memberTypeData: [],
      //所属村委类型
      villageCommitteeData: [],
      //学历类型
      educationData: [],
      //政治面貌类型
      politicalOutlookData: [],
      //户口性质类型
      natureAccountData: [],
      //驾驶证类型
      driverTypeData: [],
    };
  },
  methods: {
    confirmEditEntryApply() {
      let submitManageId;
      let index = this.processType.findIndex((item) => item == "已审核");
      console.log("成员提交申请", this.nextPlatformId, this.unitList);
      if (this.nextPlatformId == "" && index < this.unitList.length) {
        this.$message.error("请选择下个平台名字");
        return;
      } else if (this.detailData.sex == "") {
        this.$message.error("请选择性别");
        return;
      } else if (this.detailData.name == "") {
        this.$message.error("请填写姓名");
        return;
      }
      this.detailData.curriculumVitaeEntities.forEach((v, index) => {
        if (v.startEndTime) {
          this.detailData.curriculumVitaeEntities[
            index
          ].startEndTime = v.startEndTime.join("-");
        }
      });
      // if (this.type == "update") {
      //   submitManageId = this.manageId;
      // } else {
      //   submitManageId = -300;
      // }
      console.log(
        "成员管理id",
        submitManageId,
        "1111111manageId",
        this.manageId
      );
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveMemberAccount/updateAccountType`
        ),
        method: "post",
        data: this.$http.adornData({
          id: this.dataId,
          accountType: "1",
          faceUrl: this.detailData.faceUrl,
          urlList: this.detailData.urlList,
          name: this.detailData.name,
          memberType: this.detailData.memberType,
          sex: this.detailData.sex,
          height: this.detailData.height,
          weight: this.detailData.weight,
          nativePlace: this.detailData.nativePlace,
          birth: this.detailData.birth,
          birthPlace: this.detailData.birthPlace,
          nation: this.detailData.nation,
          villageCommittee: this.detailData.villageCommittee,
          education: this.detailData.education,
          graduationSchool: this.detailData.graduationSchool,
          graduationTime: this.detailData.graduationTime,
          major: this.detailData.major,
          politicalOutlook: this.detailData.politicalOutlook,
          credentialsNum: this.detailData.credentialsNum,
          driverType: this.detailData.driverType,
          driverTypeList: this.detailData.driverTypeStringList,
          phone: this.detailData.phone,
          homePhone: this.detailData.homePhone,
          nationPlace: this.detailData.nationPlace,
          zipCode: this.detailData.zipCode,
          health: this.detailData.health,
          isExperience: this.detailData.isExperience,
          isVeteran: this.detailData.isVeteran,
          curriculumVitae: "",
          curriculumVitaeEntities: this.detailData.curriculumVitaeEntities,
          homeAddress: this.detailData.homeAddress,
          homeNation: this.detailData.homeNation,
          homeSpousename: this.detailData.homeSpousename,
          homeSpousephone: this.detailData.homeSpousephone,
          homespouseunit: this.detailData.homespouseunit,
          homeMember: "",
          homeMemberEntities: this.detailData.homeMemberEntities,
          // homeMemberEntities: [
          //   {
          //     relationship: this.detailData.homeMemberEntities[0].relationship,
          //     name: this.detailData.homeMemberEntities[0].name,
          //     workUnit: this.detailData.homeMemberEntities[0].workUnit,
          //     phone: this.detailData.homeMemberEntities[0].phone,
          //   },
          // ],
          personalSpecialty: this.detailData.personalSpecialty,
          documents: this.detailData.documents,
          // documents: [
          //   {
          //     documentName: this.detailData.documents[0].documentName,
          //     url: this.detailData.documents[0].url,
          //   },
          // ],
          natureAccount: this.detailData.natureAccount,
          nextPlatformId: this.nextPlatformId,
          submitType: this.type,
          managerId: this.manageId,
        }),
      }).then((data) => {
        console.log(data);
        this.search();
        this.dialogFormVisibleEdit = false;
      });
    },

    //获取详情信息
    getDetail(i, dialog) {
      let id = i;
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberAccount/info/${id}`),
        method: "get",
      }).then((data) => {
        this.detailData = data.data.data;
        this.detailData.curriculumVitaeEntities.forEach((v, i) => {
          if (v.startEndTime) {
            let timeString = v.startEndTime.split("-");
            let beginTime = timeString[0] + "-" + timeString[1];
            let endTime = timeString[2] + "-" + timeString[3];
            let timeArr = [];
            timeArr.push(beginTime);
            timeArr.push(endTime);
            this.detailData.curriculumVitaeEntities[i].startEndTime = timeArr;
          }
        });
        this.manageId = data.data.data.managerId;
        this.idNum = data.data.data.id; //更新当前编辑页面的id
        this[dialog] = true;
        console.log("thismanageid", this.manageId);
        if (this.type == "add") {
          this.$nextTick(() => {
            // this.$refs.showProcess.manageid = this.manageId;
            this.$refs.showProcess.clear();
            this.unitList = [];
          });
        }
      });
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveMemberEntity/rewardList/${id}`
        ),
        method: "get",
      }).then((data) => {
        this.rewardData = data.data.data;
        console.log("tststts", this.rewardData);
        // this.idNum = data.data.data.id; //更新当前编辑页面的id
        // this[dialog] = true;
      });
    },
    baoshen(id) {
      this.$http({
        url: this.$http.adornUrl("/approve/approveMemberEntity/updateStatus"),
        method: "post",
        data: this.$http.adornData({
          id: id,
        }),
      }).then(({ data }) => {
        console.log("数据列表data", data);
        if (data && data.code === 0) {
          this.search();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    queryHHistoryRecord() {
      // console.log("hi",this.dataForm.id,this.tikuType);
      this.$refs.historyRecord.init(this.dataForm.id, "6");
      this.$refs.historyRecord.dialogVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    titleColor({ row, rowIndex }) {
      if (rowIndex === 0) {
        console.log(row);
        return "title-row";
      }
      return "";
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.addApplication.documents.url = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      let form = new FormData();
      form.append("file", file);
      this.$http({
        url: this.$http.adornUrl(`/upload/file`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      }).then((data) => {
        if (data && data.code === 0) {
          console.log(data);
        }
      });
    },

    //成员类型
    getMemberType() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=member_type`
        ),
        method: "get",
      }).then((data) => {
        this.memberTypeData = data.data.data;
      });
    },
    //所属村委类型
    getVillageCommittee() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=village_committee`
        ),
        method: "get",
      }).then((data) => {
        this.villageCommitteeData = data.data.data;
      });
    },
    //学历类型
    getEducation() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=education`
        ),
        method: "get",
      }).then((data) => {
        this.educationData = data.data.data;
      });
    },
    //政治面貌类型
    getPoliticalOutlook() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=Political_outlook`
        ),
        method: "get",
      }).then((data) => {
        this.politicalOutlookData = data.data.data;
      });
    },
    //户口性质类型
    getNatureAccount() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=nature_account`
        ),
        method: "get",
      }).then((data) => {
        this.natureAccountData = data.data.data;
      });
    },
    //驾驶证类型
    getDriverType() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=driver_type`
        ),
        method: "get",
      }).then((data) => {
        this.driverTypeData = data.data.data;
      });
    },
    //点击添加个人简历
    addPersonalResume(val) {
      this[val].curriculumVitaeEntities.push({
        startEndTime: "",
        study: "",
        post: "",
      }); //添加新数组
    },
    //点击删除个人简历
    delectPersonalResume(index, val) {
      this[val].curriculumVitaeEntities.splice(index, 1);
    },
    //点击添加家庭情况
    addFamilySituation(val) {
      this[val].homeMemberEntities.push({
        relationship: "",
        name: "",
        workUnit: "",
        phone: "",
      }); //添加新数组
    },
    //点击删除家庭情况
    delectFamilySituation(index, val) {
      this[val].homeMemberEntities.splice(index, 1);
    },
    //成员信息切换
    informationToggle(val) {
      if (val == "1") {
        this.isSelect = this.toggleInformation = true;
      } else {
        this.isSelect = this.toggleInformation = false;
      }
      console.log("toggleInformation=======", this.toggleInformation);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    //清除数据
    clearDataForm() {
      this.nextPlatformId = "";
      this.platformOptions = [];
      this.baoshenData = {
        id: "",
        name: "",
        contactor: { id: "", name: "", role: "", phone: "" },
      };
    },
    changeNextPlatform(val) {
      this.nextPlatformId = val;
      console.log("下个平台id", this.nextPlatformId);
      this.UnitChange();
    },
    //审核流程下拉框确定
    changeManage(manageId) {
      console.log("成员管理流程id", manageId);
      this.manageId = manageId;
      this.getUnit();
      this.getPlatformById(this.nowPlatForm);
    },
    queryHHistoryRecord() {
      // console.log("hi",this.dataForm.id,this.tikuType);
      this.$refs.historyRecord.init(this.dataForm.id, "6");
      this.$refs.historyRecord.dialogVisible = true;
    },
    init(type, id) {
      this.clearDataForm();
      this.dataId = id;
      this.showshenhe = false;
      this.nextPlatformName = "";
      const user = this.$cookie.get("userId");
      this.nowPlatForm = this.$cookie.get("platformId");
      // this.dataForm.id = id;
      this.type = type;
      this.tikuType = "6";

      //判断流程图
      this.processType = ["填报"];
      var processTime = 0;
      switch (type) {
        case "add":
          this.getManage();
          console.log("类型", this.type, this.baoshenData);
          this.getUnit();
          this.getPlatformById(this.nowPlatForm);
          break;

        case "show":
          this.getDataDetail(id);
          break;

        case "shenhe":
          this.getDataDetail(id);
          break;
        case "baoshen":
          this.getManage();
          this.getDataDetail(id);
          break;
        case "update":
          this.getDataDetail(id);
          break;
        default:
      }
    },
    getManage() {
      this.managelist = [];
      this.manageId = "";
      // this.$refs.showProcess.manageId = "";
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberEntity/getManage`),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("manage", data);
          data.approveManageList.forEach((item) => {
            this.managelist.push({
              value: item.id,
              label: item.name,
            });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    //获取数据详情
    getDataDetail(i) {
      let id = i;
      this.dataForm.id = id;
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberEntity/info/${id}`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (this.type == "baoshen") {
            this.type = "add";
            this.getPlatformById(this.nowPlatForm);
          }
          // this.getUnit();
          this.processList = data.data.approveManageEntity.processList;

          //获取审批流程
          this.unitList = [];
          for (
            let depIndex = 1;
            depIndex < this.processList.length;
            depIndex++
          ) {
            this.unitList.push({
              depId: this.processList[depIndex].depId,
              depName: this.processList[depIndex].depName,
            });
          }

          this.processList.forEach((item) => {
            if (item.chargeMan == null) {
              item.chargeMan = {
                id: "",
                name: "",
                position: "",
                mobile1: "",
              };
            }
            if (item.approveApproveEntity == null) {
              item.approveApproveEntity = {
                approveComments: "",
                approveResult: "",
                createUserId: "",
                gmtCreate: "",
                gmtModified: "",
                id: "",
                isDeleted: "",
                modifiedUserId: "",
                nextPlatformId: "",
                nextPlatformIdString: "",
                platformId: "",
                platformIdString: "",
                processId: "",
                qrcodeImg: "",
                rewardId: "",
                sysUserVo: { id: "", name: "", phone: "", role: "" },
                tikuType: "",
              };
            }
          });
          //获取tikutype
          this.tikuType = data.data.approveManageEntity.tikuType;
          // this.baoshenData.name =
          //   "请选择" + data.data.approveManageEntity.unitList[1].unitIdString;
          this.baoshenData.name = "请选择" + this.processList[1].depName;
          // console.log("报审单位", this.baoshenData.name, this.processList);

          var index = this.processList.findIndex(
            (item) => item.approveApproveEntity.platformIdString == ""
          );
          // console.log("没错", index);
          if (
            index > 0 &&
            this.processList[index - 1].approveApproveEntity.approveResult != 1
          ) {
            this.processList[
              index
            ].approveApproveEntity.platformId = this.processList[
              index - 1
            ].approveApproveEntity.nextPlatformId;
            // this.nextPlatformName = this.processList[
            //   index - 1
            // ].approveApproveEntity.nextPlatformId;
            this.processList[
              index
            ].approveApproveEntity.platformIdString = this.processList[
              index - 1
            ].approveApproveEntity.nextPlatformIdString;
            // console.log(
            //   "审核中",
            //   this.processList[index].approveApproveEntity.platformIdString,
            //   this.processList[index - 1].approveApproveEntity
            //     .nextPlatformIdString
            // );
            let choosePlatformid = this.processList[index].approveApproveEntity
              .platformId;
            this.getPlatformById(choosePlatformid);
          }

          for (let i = 1; i < this.processList.length; i++) {
            if (this.processList[i].approveApproveEntity.sysUserVo.name == "") {
              if (
                this.processList[i].approveApproveEntity.nextPlatformIdString ==
                  "" &&
                this.processList[i].approveApproveEntity.platformIdString != ""
              ) {
                if (this.type == "update" && i == 1) {
                  this.processType.push("报审单位");
                  this.nextPlatformName = this.processList[0].approveApproveEntity.nextPlatformId;
                  this.nextPlatformId = this.processList[0].approveApproveEntity.nextPlatformId;
                } else {
                  this.processType.push("审核中");
                  if (
                    i < this.processList.length - 1 &&
                    this.type == "shenhe"
                  ) {
                    let nowIndex = this.processType.findIndex(
                      (item) => item == "审核中"
                    );
                    if (nowIndex > 0) {
                      if (
                        this.processList[nowIndex - 1].approveApproveEntity
                          .nextPlatformId == this.nowPlatForm
                      ) {
                        this.showshenhe = true;
                        this.processType.push("报审单位");
                        i += 1;
                      }
                    }
                  }
                }

                // console.log("type", "审核中");
              } else {
                this.processType.push("待审核");
              }
            } else {
              this.processType.push("已审核");
            }
          }

          //显示报审单位名称
          if (this.type == "shenhe" || this.type == "update") {
            // console.log("22222222", this.processType);
            var Unitindex = this.processType.findIndex(
              (item) => item == "报审单位"
            );
            console.log("unitList", this.unitList, Unitindex);
            if (Unitindex > 0) {
              this.baoshenData.id = this.unitList[Unitindex - 1].depId;
              this.baoshenData.name =
                "请选择" + this.unitList[Unitindex - 1].depName;
              console.log("报审id", this.baoshenData.id);
            }
          }
          if (this.type == "add") {
            // this.baoshenData.id = this.unitList[0].depId;
            this.baoshenData.name = "";
          }
          this.getPlatform();

          let lastIndex = this.processType.findIndex(
            (item) => item == "审核中"
          );
          if (lastIndex == this.processList.length - 1) {
            this.nextPlatformId = "0";
          }
          // console.log("最终结果", this.processList);
          // this.getUnit();
          console.log("baoshenmingzi", this.nextPlatformName);
          // this.showResource = true;
          if (this.type == "shenhe") {
            let a = this.processType.findIndex((item) => item == "审核中");
            if (a > 0) {
              this.processId = this.processList[a].id;
              console.log("流程id", this.processId);
              if (
                this.processList[a - 1].approveApproveEntity.nextPlatformId ==
                this.nowPlatForm
              ) {
                this.showshenhe = true;
              }
            }
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    UnitChange() {
      let index = this.platformData.findIndex(
        (item) => item.id == this.nextPlatformId
      );
      // console.log("1234", this.dataForm.nextPlatformId, this.platformData);
      if (index >= 0) {
        // console.log("下拉框改变", index, this.platformData[index]);
        if (this.platformData[index].contactor != null) {
          // console.log("新增报审人", this.baoshenData);
          this.baoshenData.id = this.platformData[index].id;
          this.baoshenData.name = this.platformData[index].name;
          this.baoshenData.contactor.id = this.platformData[index].contactor.id;

          this.baoshenData.contactor.name = this.platformData[
            index
          ].contactor.name;
          ``;
          this.baoshenData.contactor.role = this.platformData[
            index
          ].contactor.position;
          this.baoshenData.contactor.phone = this.platformData[
            index
          ].contactor.mobile1;
          // console.log("新增报审人", this.baoshenData);
          if (this.type == "shenhe" || this.type == "update") {
            let i = this.processType.findIndex((item) => item == "报审单位");
            this.processList[i].chargeMan.id = this.platformData[
              index
            ].contactor.id;

            this.processList[i].chargeMan.name = this.platformData[
              index
            ].contactor.name;
            this.processList[i].chargeMan.position = this.platformData[
              index
            ].contactor.position;
            this.processList[i].chargeMan.mobile1 = this.platformData[
              index
            ].contactor.mobile1;
          }
        } else {
          if (this.type == "shenhe" || this.type == "update") {
            let i = this.processType.findIndex((item) => item == "报审单位");
            // console.log("审核失败1111111111111111", this.processList);
            this.processList[i].chargeMan.name = "-";
            this.processList[i].chargeMan.position = "-";
            this.processList[i].chargeMan.mobile1 = "-";
          }
          this.baoshenData = {
            id: "",
            name: "",
            contactor: { id: "", name: "", position: "", mobile1: "" },
          };
        }
      } else {
        if (this.type == "shenhe") {
          let i = this.processType.findIndex((item) => item == "报审单位");
          this.processList[i].chargeMan.id = "";
          this.processList[i].chargeMan.name = "";
          this.processList[i].chargeMan.position = "";
          this.processList[i].chargeMan.mobile1 = "";
        }
        this.baoshenData = {
          id: "",
          name: "",
          contactor: { id: "", name: "", position: "", mobile1: "" },
        };
      }
      // console.log("下拉框改变", this.platformData[index], this.baoshenData);
    },
    getPlatform() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//info/${this.nowPlatForm}`),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.tianbaoUnit = data.platForm.platformName;
          // this.console.log("当前平台名称", data);
          // data.data.forEach(item => {
          //   this.platformOptions.push({ value: item.code, label: item.name });
          // });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
      // console.log("报审单位", this.processType[index], this.baoshenData.id);
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getPlatForm?id=${this.baoshenData.id}`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("报审单位平台数据", data, this.baoshenData.id);
          this.platformData = data.data;
          data.data.forEach((item) => {
            this.platformOptions.push({
              value: item.id,
              label: item.platformName,
            });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    getUnit() {
      let manageId = this.manageId;
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getUnit?id=${manageId}`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.unitList = data.data;
          if (this.unitList.length > 0) {
            if (this.type == "add") {
              this.baoshenData.id = this.unitList[0].depId;
              this.baoshenData.name = "请选择" + this.unitList[0].depName;
              this.tianbaoUnit = this.unitList[0].depName;
            }

            if (this.type == "shenhe" || this.type == "update") {
              // console.log("22222222", this.processType);
              var Unitindex = this.processType.findIndex(
                (item) => item == "报审单位"
              );
              if (Unitindex > 0) {
                this.baoshenData.id = this.unitList[Unitindex - 1].depId;
                this.baoshenData.name =
                  "请选择" + this.unitList[Unitindex - 1].depName;
              }
            }
            // console.log("新增", this.unitList, this.baoshenData.name);
          }
          this.getPlatform();
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    getPlatformById(id) {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//infoById/${id}`),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("byId", data);
          if (this.type == "add") {
            this.createUser.id = data.platform.contactor.id;
            this.createUser.name = data.platform.contactor.name;
            this.createUser.phone = data.platform.contactor.mobile1;
            this.createUser.role = data.platform.contactor.position;
          } else {
            var index = this.processType.findIndex((item) => item == "审核中");
            if (index > -1) {
              this.processList[index].chargeMan.id = data.platform.contactor.id;
              this.processList[index].chargeMan.name =
                data.platform.contactor.name;
              this.processList[index].chargeMan.position =
                data.platform.contactor.position;
              this.processList[index].chargeMan.mobile1 =
                data.platform.contactor.mobile1;
            }
            let i = this.processType.findIndex((item) => item == "报审单位");
            if (i > -1 && this.type == "update") {
              if (data.platform.contactor != null) {
                this.processList[i].chargeMan.id = data.platform.contactor.id;
                this.processList[i].chargeMan.name =
                  data.platform.contactor.name;
                this.processList[i].chargeMan.position =
                  data.platform.contactor.position;
                this.processList[i].chargeMan.mobile1 =
                  data.platform.contactor.mobile1;
              }
            }
          }
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    //成员类型
    getMemberType() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=member_type`
        ),
        method: "get",
      }).then((data) => {
        this.memberTypeData = data.data.data;
      });
    },
    //所属村委类型
    getVillageCommittee() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=village_committee`
        ),
        method: "get",
      }).then((data) => {
        this.villageCommitteeData = data.data.data;
      });
    },
    //学历类型
    getEducation() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=education`
        ),
        method: "get",
      }).then((data) => {
        this.educationData = data.data.data;
      });
    },
    //政治面貌类型
    getPoliticalOutlook() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=Political_outlook`
        ),
        method: "get",
      }).then((data) => {
        this.politicalOutlookData = data.data.data;
      });
    },
    //户口性质类型
    getNatureAccount() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=nature_account`
        ),
        method: "get",
      }).then((data) => {
        this.natureAccountData = data.data.data;
      });
    },
    //驾驶证类型
    getDriverType() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=driver_type`
        ),
        method: "get",
      }).then((data) => {
        this.driverTypeData = data.data.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.more-button-container {
  margin-left: 2px;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #dddee1;
  border-radius: 4px;
  // font-size: 16px;
  text-align: center;
  color: #666666;
  user-select: none;
  margin-left: 10px;
  cursor: pointer;
  .more-button-content {
    position: absolute;
    top: 50px;
    right: 0;
    width: 160px;
    z-index: 1;
    transform: scaleY(0);
    transform-origin: center top;
    transition: transform 0.5s;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    .more-button-content-item-header {
      color: #999999;
      text-align: left;
      padding: 21px 0 15px 20px;
      line-height: 14px;
      cursor: auto;
    }
    .more-button-content-item {
      text-align: left;
      padding: 13px 0 15px 20px;
      line-height: 14px;
      &:hover {
        background: rgba(0, 145, 255, 0.1);
      }
    }
    .more-button-content-line {
      border-bottom: 1px solid #e6e6e6;
      width: 132px;
      height: 13px;
      margin: 0 auto;
      margin-bottom: 14px;
      cursor: auto;
    }
  }
  i {
    transition: transform 0.5s;
  }
  &.more-button-unfocus:hover {
    border-color: #b4b4b4;
  }
  &.more-button-focus {
    border-color: #0091ff;
    i {
      transform: rotate(-180deg);
    }
    .more-button-content {
      z-index: 1;
      transform: scaleY(1);
    }
  }
}
.addDialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .addDialog_left {
    padding: 30px 56px;
    border-right: 1px solid #f0f0f0;
  }
}
.editDialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .editDialog_left {
    padding: 30px 56px;
    border-right: 1px solid #f0f0f0;
  }
}
/deep/ .el-dialog__body {
  padding: 30px 56px;
}
.bottomPagination {
  position: relative;
}
/deep/ .el-pagination {
  height: 72px;
  position: absolute;
  right: 20px;
  top: 5px;
  // margin-right: 20px;
  // margin-top: 20px;
}
.formLeft {
  width: 475px;
  border: 1px solid rgba(219, 235, 255, 1);
  border-right: none;
  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 280px;
  }
  /deep/ .el-input__inner {
    width: 280px;
    height: 50px;
    line-height: 50px;
    border-left: 1px solid rgba(219, 235, 255, 0);
    border-top: 1px solid rgba(219, 235, 255, 0);
    border-bottom: 1px solid rgba(219, 235, 255, 1);
    border-right: 1px solid rgba(219, 235, 255, 1);
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
    /deep/ .el-form-item__label {
      background-color: #f0f6ff;
      text-align: unset;
      padding-left: 30px;
      height: 50px;
      line-height: 50px;
      color: #999999;
      border-bottom: 1px solid rgba(219, 235, 255, 1);
      border-right: 1px solid rgba(219, 235, 255, 1);
    }
  }
}
.formRight {
  width: 475px;
  border: 1px solid rgba(219, 235, 255, 1);
  border-left: none;
  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 280px;
  }
  /deep/ .el-input__inner {
    width: 280px;
    height: 50px;
    line-height: 50px;
    border-left: 1px solid rgba(219, 235, 255, 0);
    border-top: 1px solid rgba(219, 235, 255, 0);
    border-bottom: 1px solid rgba(219, 235, 255, 1);
    border-right: 1px solid rgba(219, 235, 255, 1);
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
    /deep/ .el-form-item__label {
      background-color: #f0f6ff;
      text-align: unset;
      padding-left: 30px;
      height: 50px;
      line-height: 50px;
      color: #999999;
      border-bottom: 1px solid rgba(219, 235, 255, 1);
      border-right: 1px solid rgba(219, 235, 255, 1);
    }
  }
}
/deep/ .el-dialog__footer {
  border: 1px solid #f2f2f2;
  padding: 20px 27px 20px 20px;
  text-align: right;
}
// .formLeft {
//   border: 1px solid #dbebff;
//   border-right:none;
// }

// .formRight {
//   border: 1px solid #dbebff;
//   border-left: none;
// }
.headerText {
  display: flex;
  min-width: 480px;
}
.headerText div {
  margin-right: 15px;
  color: #999999;
}
.header .search {
  background-color: #0091ff;
  margin-left: 10px;
}
.el-table /deep/.title-row th {
  background: #f1f5ff;
  text-align: center;
}
.content {
  height: calc(100vh - 240px);
  // height: 730px;
}
.content .el-table {
  // height: 100%;
  -webkit-box-shadow: none;
  box-shadow: none;
  font-size: 14px;
  /deep/ .el-table__body {
    /deep/ td {
      border-left: none;
      border-right: none;
    }
    tr {
      background: none;
    }
    tr:hover {
      box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
      td:nth-child(1) {
        border-left: 3px solid #0091ff;
      }
    }
  }
  /deep/ .el-table__row {
    // font-family: PingFangSC-Regular, PingFang SC;
    // font-weight: normal;
  }
}
/deep/ .el-table th > .cell {
  padding: 0;
}
.el-table .el-button--primary {
  background-color: #0091ff;
}
.el-table .el-button--danger {
  background-color: #d9001b;
}
.el-card__body {
  position: relative;
}
.block {
  position: absolute;
  bottom: 50px;
  left: 50%;
  margin-left: -355.5px;
}
.titleBorder {
  border-left: 3px solid #0091ff;
  padding-left: 6px;
  height: 16px;
  line-height: 16px;
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 28px 0;
}
.clearformData {
  cursor: pointer;
}
.addResume {
  width: 100px;
  height: 35px;
  line-height: 33px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 18px;
  cursor: pointer;
  span {
    color: #3f92fe;
    font-weight: bold;
    font-size: 16px;
  }
}
.addMember {
  width: 100px;
  height: 35px;
  line-height: 33px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 18px;
  cursor: pointer;
  span {
    color: #3f92fe;
    font-weight: bold;
    font-size: 16px;
  }
}
.addDocument {
  display: inline-block;
  font-style: normal;
  width: 100px;
  height: 35px;
  line-height: 33px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: center;
  // margin-bottom: 18px;
  cursor: pointer;
  span {
    color: #3f92fe;
    font-weight: bold;
    font-size: 16px;
  }
}
.avatar-uploader /deep/ .el-upload-list__item {
  display: block;
  width: 382px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
// 上传相片的样式
.avatar-uploader-icon {
  display: inline-block;
  font-style: normal;
  width: 113px;
  height: 139px;
  line-height: 139px;
  text-align: center;
  border: 1px dashed #9fc8fe;
  position: relative;
  margin-right: 18px;
  span {
    position: absolute;
    top: 20px;
    left: 28px;
    color: #0091ff;
  }
  img {
    width: 52px;
    position: absolute;
    top: 30px;
    left: 30px;
  }
}
.avatar-uploader-icon-idFront {
  display: inline-block;
  font-style: normal;
  width: 225px;
  height: 139px;
  line-height: 139px;
  text-align: center;
  border: 1px dashed #9fc8fe;
  position: relative;
  margin-right: 18px;
  span {
    position: absolute;
    top: 54px;
    left: 70px;
    color: #0091ff;
  }
  img {
    width: 164px;
    position: absolute;
    top: 8px;
    left: 30px;
    &.upload {
      width: 52px;
      top: 30px;
      left: 87px;
    }
  }
}
.avatar-uploader-icon-idBack {
  display: inline-block;
  font-style: normal;
  width: 225px;
  height: 139px;
  line-height: 139px;
  text-align: center;
  border: 1px dashed #9fc8fe;
  position: relative;
  span {
    position: absolute;
    top: 54px;
    left: 70px;
    color: #0091ff;
  }
  img {
    width: 164px;
    position: absolute;
    top: 8px;
    left: 30px;
    &.upload {
      width: 52px;
      top: 30px;
      left: 87px;
    }
  }
}
// 上传相片的样式
.avatar {
  width: 113px;
  height: 139px;
  display: block;
}
.avatar_id {
  width: 225px;
  height: 139px;
  display: block;
}
.avatar_idBack {
  width: 225px;
  height: 139px;
  display: block;
}
// 上传相片的样式

// 新增入职申请头部背景色
.header /deep/ .el-dialog__header {
  background-color: #f1f4f6;
}
// 查看成员信息头部背景色
.el-dialog__wrapper /deep/ .el-dialog__header {
  background-color: #f1f4f6;
}
// 上传简历的样式
.avatar-uploader-icon-resume {
  display: inline-block;
  font-style: normal;
  color: #8c939d;
  width: 136px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
// 上传简历的样式

// 灰色框样式
.grayBox {
  height: 89px;
  max-width: 950px;
  // border: 1px solid #d7d7d7;
  border-radius: 4px;
  background-color: #f1f6ff;
  margin: 4px 0 28px 0;
  position: relative;
  .el-icon-delete {
    position: absolute;
    right: 18px;
    width: 22px;
    top: 50%;
    margin-top: -11px;
  }
}
.grayBox_watch {
  max-width: 845px;
  height: 89px;
  // border: 1px solid #d7d7d7;
  border-radius: 4px;
  // background-color: #fbfbfb;
  //   margin: 4px 0 0 120px;
  span {
    display: inline-block;
    width: 281px;
    height: 42px;
    line-height: 42px;
    border: 1px solid #dedede;
    border-radius: 4px;
    background-color: #f8f8f8;
    padding-left: 14px;
  }
}
.grayBoxHeight {
  height: 36px;
  line-height: 36px;
}
// 灰色框样式

.special /deep/ .el-textarea__inner {
  max-width: 950px;
  height: 89px;
  margin-bottom: 24px;
}
.special_watch /deep/ .el-textarea__inner {
  max-width: 950px;
  height: 89px;
  margin-bottom: 24px;
  background-color: #f8f8f8;
  // color: #666666;
}
.otherMember {
  /deep/ .el-form-item__label {
    margin-top: 46px;
    color: #333333 !important;
    text-align: right;
    padding-right: 0;
    margin-right: 0 !important;
    // margin-left: 10px;
    width: 70px !important;
  }
  /deep/ .el-form-item__content {
    margin-left: 100px !important;
  }
}

// 查看成员信息

//成员信息
.watch_information .header_toggle {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.titleBorder_watch {
  // border-left: 3px solid #0091ff;
  // padding-left: 6px;
  height: 51px;
  line-height: 51px;
  // font-size: 16px;
  font-weight: bold;
  margin: 0 0 25px 0;
  background-color: #f0f5ff;
  position: relative;
  &:nth-child(1) {
    margin-top: 20px;
  }
  span {
    display: inline-block;
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    border-left: 3px solid #0091ff;
    padding-left: 6px;
    margin-left: 28px;
  }
  img {
    position: absolute;
    width: 102px;
    right: 49px;
    top: 71px;
  }
}
.header_toggle div {
  width: 147px;
  height: 40px;
  border: 1px solid #d7d7d7;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
}
.header_toggle .active {
  background-color: #0091ff;
  color: white;
}
.watch_information {
  /deep/ .el-dialog {
    min-height: 400px;
    /deep/ .el-dialog__body {
      padding: 0;
    }
  }
  /deep/ .el-form-item__label {
    color: #999999;
    margin-right: 32px;
  }
}
.image_watch {
  width: 200px;
  text-align: center;
  padding-left: 44px;
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
}
//成员信息

//奖励记录
.reward .reward_top {
  width: 911px;
  margin: 20px auto;
  //   height: 516px;
  border: 1px solid #0091ff;
}
.top_title {
  height: 40px;
  background-color: #f1f4f6;
  position: relative;
  line-height: 40px;
}
.top_title .title_time {
  position: absolute;
  right: 20px;
  top: 0;
}
.el-icon.delete::before {
  margin: 10px 10px !important;
}
.reward_text {
  border-bottom: 1px solid #d7d7d7;
  margin: 30px 10px 10px 10px;
}
.reward_text_border {
  border: 1px solid #d7d7d7;
  border-top: none;
  padding: 30px 10px 10px 10px;
}
.top_content p {
  margin-left: 10px;
}
// .top_content > p:nth-child(1) {
//   border-bottom: 1px solid #d7d7d7;
//   margin: 30px 10px 10px 10px;
// }
.top_content .top_content_bottom p {
  height: 40px;
  line-height: 40px;
  border: 1px solid #d7d7d7;
  position: relative;
  margin-bottom: 0;
}
.top_content .top_content_bottom span {
  position: absolute;
  right: 20px;
}
//奖励记录
.grayButton {
  color: #d7d7d7;
}
.redButton {
}
.orangeStatus {
  color: #f2b626;
}
.greenStatus {
  color: #0bd295;
}
.redStatus {
  color: #f66e6e;
}
</style>