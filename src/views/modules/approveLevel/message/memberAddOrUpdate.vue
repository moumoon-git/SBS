<!--authorName chenbin-->
<template>
  <!-- 编辑入职信息 -->
  <el-dialog
    width="60%"
    title="编辑入职信息"
    :append-to-body="true"
    :visible.sync="dialogFormVisibleWatch"
    style="textalign: left"
    class="editDialog"
  >
    <!-- 基本信息模块 -->
    <!-- 该注释行用于左右分布的情况 -->
    <!-- <div style="display:flex"> -->
    <div class="editDialog_left">
      <div class="titleBorder">基本信息</div>
      <div style="display: flex">
        <div @click.stop="beforeUpLoadClick(0, 'detailData')">
          <el-upload
            class="avatar-uploader"
            action
            :auto-upload="false"
            :file-list="fileList"
            :on-change="imgHandleChange"
            :show-file-list="false"
          >
            <img
              v-if="detailData.urlList[0].url"
              :src="backgroundURL + detailData.urlList[0].url"
              class="avatar"
            />
            <!-- <i v-else class="avatar-uploader-icon">上传相片</i> -->
            <i v-else class="avatar-uploader-icon">
              <span>上传照片</span>
              <img src="../../../../assets/img/uploadPhoto.png" alt />
            </i>
          </el-upload>
        </div>
        <div @click.stop="beforeUpLoadClick(1, 'detailData')">
          <el-upload
            class="avatar-uploader"
            action
            :auto-upload="false"
            :file-list="fileList"
            :on-change="imgHandleChange"
            :show-file-list="false"
          >
            <img
              v-if="detailData.urlList[1].url"
              :src="backgroundURL + detailData.urlList[1].url"
              class="avatar_id"
            />
            <!-- <i v-else class="avatar-uploader-icon">上传相片</i> -->
            <i v-else class="avatar-uploader-icon-idFront">
              <span>身份证(人像面)</span>
              <img src="../../../../assets/img/idFront.png" alt />
              <img
                class="upload"
                src="../../../../assets/img/uploadPhoto.png"
                alt
              />
            </i>
          </el-upload>
        </div>
        <div @click.stop="beforeUpLoadClick(2, 'detailData')">
          <el-upload
            class="avatar-uploader"
            action
            :auto-upload="false"
            :file-list="fileList"
            :on-change="imgHandleChange"
            :show-file-list="false"
          >
            <img
              v-if="detailData.urlList[2].url"
              :src="backgroundURL + detailData.urlList[2].url"
              class="avatar_idBack"
            />
            <!-- <i v-else class="avatar-uploader-icon">上传相片</i> -->
            <i v-else class="avatar-uploader-icon-idBack">
              <span>身份证(国徽面)</span>
              <img src="../../../../assets/img/idBack.png" alt />
              <img
                class="upload"
                src="../../../../assets/img/uploadPhoto.png"
                alt
              />
            </i>
          </el-upload>
        </div>
      </div>
      <el-form
        :model="form"
        style="display: flex; margintop: 21px; marginbottom: 28px"
      >
        <div class="formLeft">
          <el-form-item label="成员类型" :label-width="formLabelWidth">
            <el-select v-model="detailData.memberType" placeholder="请选择">
              <el-option
                v-for="item in memberTypeData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item required label="姓名" :label-width="formLabelWidth">
            <el-input v-model="detailData.name"></el-input>
          </el-form-item>
          <el-form-item label="出生年月" :label-width="formLabelWidth">
            <el-date-picker
              v-model="detailData.birth"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="民族" :label-width="formLabelWidth">
            <el-input v-model="detailData.nation"></el-input>
          </el-form-item>
          <el-form-item label="学历" :label-width="formLabelWidth">
            <el-select v-model="detailData.education" placeholder="请选择">
              <el-option
                v-for="item in educationData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="所属村委" :label-width="formLabelWidth">
                      <el-select v-model="detailData.villageCommittee" placeholder="请选择">
                        <el-option
                          v-for="item in villageCommitteeData"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>-->
          <!-- <el-form-item label="毕业学校" :label-width="formLabelWidth">
                        <el-input v-model="detailData.graduationSchool"></el-input>
                    </el-form-item>-->
          <el-form-item label="政治面貌" :label-width="formLabelWidth">
            <el-select
              v-model="detailData.politicalOutlook"
              placeholder="请选择"
            >
              <el-option
                v-for="item in politicalOutlookData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="formLabelWidth">
            <el-input v-model="detailData.credentialsNum"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" :label-width="formLabelWidth">
            <el-input v-model="detailData.phone"></el-input>
          </el-form-item>
          <!-- <el-form-item label="户口地址" :label-width="formLabelWidth">
                        <el-input v-model="detailData.nationPlace"></el-input>
                    </el-form-item>-->
          <el-form-item label="健康情况" :label-width="formLabelWidth">
            <el-input v-model="detailData.health"></el-input>
          </el-form-item>
          <el-form-item
            label="有无从事群防群治经验"
            :label-width="formLabelWidth"
          >
            <el-select v-model="detailData.isExperience" placeholder="请选择">
              <el-option
                v-for="item in experienceType"
                :key="'experienceType' + item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否退伍军人" :label-width="formLabelWidth">
            <el-select v-model="detailData.isVeteran" placeholder="请选择">
              <el-option
                v-for="item in veteran"
                :key="'veteran' + item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formRight">
          <el-form-item required label="性别" :label-width="formLabelWidth">
            <el-select v-model="detailData.sex" placeholder="请选择">
              <el-option
                v-for="item in sexType"
                :key="'sexType' + item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身高（cm）" :label-width="formLabelWidth">
            <el-input v-model="detailData.height"></el-input>
          </el-form-item>
          <el-form-item label="体重（kg）" :label-width="formLabelWidth">
            <el-input v-model="detailData.weight"></el-input>
          </el-form-item>
          <el-form-item label="籍贯" :label-width="formLabelWidth">
            <el-tooltip
              class="item"
              effect="dark"
              content="如：广州增城"
              placement="top"
            >
              <el-input v-model="detailData.nativePlace"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="出生地" :label-width="formLabelWidth">
            <el-tooltip
              class="item"
              effect="dark"
              content="如：广东增城"
              placement="top"
            >
              <el-input v-model="detailData.birthPlace"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="毕业学校" :label-width="formLabelWidth">
            <el-input v-model="detailData.graduationSchool"></el-input>
          </el-form-item>
          <!-- <el-form-item label="所属村委" :label-width="formLabelWidth">
                        <el-select v-model="detailData.villageCommittee" placeholder="请选择">
                          <el-option
                            v-for="item in villageCommitteeData"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                          ></el-option>
                        </el-select>
                    </el-form-item>-->
          <el-form-item label="毕业时间" :label-width="formLabelWidth">
            <el-date-picker
              v-model="detailData.graduationTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="专业" :label-width="formLabelWidth">
            <el-input v-model="detailData.major"></el-input>
          </el-form-item>
          <el-form-item label="户口地址" :label-width="formLabelWidth">
            <el-input v-model="detailData.nationPlace"></el-input>
          </el-form-item>
          <el-form-item
            v-show="hide"
            label="户口性质"
            :label-width="formLabelWidth"
          >
            <el-select v-model="detailData.natureAccount" placeholder="请选择">
              <el-option
                v-for="item in natureAccountData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="驾驶证类别" :label-width="formLabelWidth">
            <el-select
              v-model="detailData.driverTypeStringList"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in driverTypeData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="家庭电话" :label-width="formLabelWidth">
            <el-input v-model="detailData.homePhone"></el-input>
          </el-form-item>
          <el-form-item
            v-show="hide"
            label="邮编"
            :label-width="formLabelWidth"
          >
            <el-input v-model="detailData.zipCode"></el-input>
          </el-form-item>
          <!-- <el-form-item label=" " :label-width="formLabelWidth"></el-form-item> -->
          <!-- <div style="height:36px;lineHeight:36px;marginLeft:50px">
                    是否退伍军人/有无从事群防群治经验
                    <label style="marginRight:20px;marginLeft:12px">
                      <input
                        @click="experienceRadio"
                        :checked="detailData.isExperience == '是'"
                        type="radio"
                        name="experience"
                        value="是"
                      /> 是
                    </label>
                    <label>
                      <input
                        @click="experienceRadio"
                        :checked="detailData.isExperience == '否'"
                        type="radio"
                        name="experience"
                        value="否"
                      /> 否
                    </label>
                    </div>-->
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
                  ></showProcess>
                  </div>-->
      </el-form>
      <!-- 基本信息模块 -->

      <!-- 个人简历模块 -->
      <div class="titleBorder">个人简历</div>
      <div class="addResume" @click="addPersonalResume('detailData')">
        <span>+</span>添加简历
      </div>
      <div
        class="grayBox"
        v-for="(item, index) in detailData.curriculumVitaeEntities"
        :key="'detailData.curriculumVitaeEntities' + index"
      >
        <div>
          <!-- <i
                    style="color:#0091ff;fontSize:20px;float:right;marginRight:100px"
                    class="el-icon-delete"
                    @click="delectPersonalResume(index,'detailData')"
                    ></i>-->
          <img
            style="cursor: pointer"
            class="el-icon-delete"
            @click="delectPersonalResume(index, 'detailData')"
            src="../../../../assets/img/del2.svg"
            alt
          />
        </div>
        <div style="display: flex">
          <div style="marginleft: 20px">
            <div class="grayBoxHeight">开始及结束时间</div>
            <el-date-picker
              v-model="detailData.curriculumVitaeEntities[index].startEndTime"
              type="monthrange"
              range-separator="-"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              value-format="yyyy-MM"
            ></el-date-picker>
          </div>
          <div style="marginleft: 20px; width: 270px">
            <div class="grayBoxHeight">在何单位学习或工作</div>
            <el-input
              v-model="detailData.curriculumVitaeEntities[index].study"
            ></el-input>
          </div>
          <div style="marginleft: 20px; width: 270px">
            <div class="grayBoxHeight">职务</div>
            <el-input
              v-model="detailData.curriculumVitaeEntities[index].post"
            ></el-input>
          </div>
        </div>
      </div>
      <!-- 个人简历模块 -->

      <!-- 家庭情况模块 -->
      <div class="titleBorder">家庭情况</div>
      <el-form :model="form">
        <div style="display: flex; margin-bottom: 28px">
          <div class="formLeft">
            <el-form-item label="配偶姓名" :label-width="formLabelWidth">
              <el-input v-model="detailData.homeSpousename"></el-input>
            </el-form-item>
            <el-form-item
              v-show="hide"
              label="现住址"
              :label-width="formLabelWidth"
            >
              <el-input v-model="detailData.homeAddress"></el-input>
            </el-form-item>
            <!-- <el-form-item label="联系电话" :label-width="formLabelWidth">
                        <el-input v-model="detailData.homeSpousephone"></el-input>
                      </el-form-item>-->
          </div>
          <div class="formRight">
            <!-- <el-form-item label="户籍所在地" :label-width="formLabelWidth">
                      <el-input v-model="detailData.homeNation"></el-input>
                      </el-form-item>-->
            <el-form-item label="联系电话" :label-width="formLabelWidth">
              <el-input v-model="detailData.homeSpousephone"></el-input>
            </el-form-item>
            <el-form-item
              v-show="hide"
              label="工作单位"
              :label-width="formLabelWidth"
            >
              <el-input v-model="detailData.homespouseunit"></el-input>
            </el-form-item>
          </div>
        </div>
        <!-- <el-form-item label="家庭其他成员" :label-width="formLabelWidth">
                  <div
                    style="width:136px;height:40px;lineHeight:40px;border:1px dashed #d7d7d7;textAlign:center"
                    @click="addFamilySituation('detailData')"
                  >添加</div>
                  </el-form-item>-->
        <div class="addMember" @click="addFamilySituation('detailData')">
          <span>+</span>添加成员
        </div>
        <div
          class="grayBox"
          v-for="(item, index) in detailData.homeMemberEntities"
          :key="index"
        >
          <div>
            <!-- <i
                      style="color:#0091ff;fontSize:20px;float:right;margin-top:10px"
                      class="el-icon-delete"
                      @click="addFamilySituation(index,'detailData')"
                      ></i>-->
            <img
              style="cursor: pointer"
              class="el-icon-delete"
              @click="delectFamilySituation(index, 'detailData')"
              src="../../../../assets/img/del2.svg"
              alt
            />
          </div>
          <div style="display: flex">
            <div style="marginleft: 20px; width: 300px">
              <div class="grayBoxHeight">关系</div>
              <el-input
                v-model="detailData.homeMemberEntities[index].relationship"
              ></el-input>
            </div>
            <div style="marginleft: 20px; width: 270px">
              <div class="grayBoxHeight">姓名</div>
              <el-input
                v-model="detailData.homeMemberEntities[index].name"
              ></el-input>
            </div>
            <div v-show="hide" style="marginleft: 20px; width: 432px">
              <div class="grayBoxHeight">工作单位</div>
              <el-input
                v-model="detailData.homeMemberEntities[index].workUnit"
              ></el-input>
            </div>
            <div style="marginleft: 20px; width: 270px">
              <div class="grayBoxHeight">联系电话</div>
              <el-input
                v-model="detailData.homeMemberEntities[index].phone"
              ></el-input>
            </div>
          </div>
        </div>
      </el-form>

      <!-- 家庭情况模块 -->

      <!-- 个人特长模块 -->
      <div class="titleBorder" style="marginbottom: 14px">个人特长</div>
      <el-input
        type="textarea"
        v-model="detailData.personalSpecialty"
        class="special"
        resize="none"
      ></el-input>

      <!-- 个人特长模块 -->

      <!-- 附件模块 -->
      <div class="titleBorder">附件</div>
      <el-upload
        class="avatar-uploader"
        action
        :on-change="documentHandleChange"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false"
        :file-list="fileList"
      >
        <!-- <i class="avatar-uploader-icon-resume" style="marginLeft:120px">上传附件</i> -->
        <i class="addDocument"> <span>+</span>上传附件 </i>
      </el-upload>
      <div v-if="detailData.documents">
        <a
          style="display: block; height: 31px; maxwidth: 382px; margintop: 15px"
          v-for="(item, index) in detailData.documents"
          :href="backgroundURL + item.url"
          :key="index"
          >{{ item.documentName }}</a
        >
      </div>

      <!-- 附件模块 -->

      <!-- <div>
              <approveEdit
                v-if="type=='shenhe'&&showshenhe"
                ref="approveEdit"
                @cancel="dialogFormVisibleWatch = false;"
                @refreshTable="search()"
                :nextPlatformId="nextPlatformId"
                :id="dataForm.id"
                :processid="processId"
                :tikutype="tikuType"
              ></approveEdit>
                </div>-->
    </div>
    <!-- <div style="width:400px;marginLeft:20px"> -->
    <div style="width: 400px; marginleft: 56px; marginbottom: 30px">
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
    </div>
    <!-- </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleWatch = false">取 消</el-button>
      <el-button type="primary" @click="confirmEditEntryApply">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 编辑入职信息 -->
</template>

<script>
import historyRecord from "@/views/modules/approveLevel/resourceManage/historyRecord.vue";
import showProcess from "../../groupControl/showProcess";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  components: {
    showProcess,
    historyRecord,
  },
  created() {
    this.nowPlatForm = this.$cookie.get("platformId");
    //获取成员类型
    this.getMemberType();
    //获取所属村委类型
    this.getVillageCommittee();
    //获取学历类型
    this.getEducation();
    //获取政治面貌类型
    this.getPoliticalOutlook();
    //获取户口性质类型
    this.getNatureAccount();
    //获取驾驶证类型
    this.getDriverType();
    this.documenttoken = `${httpaddress}/approve/approveMemberEntity/xlsInput?token=${this.$cookie.get(
      "token"
    )}`;
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
        // this.search();
        this.dialogFormVisibleWatch = false;
        this.$emit("refresh");
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
        console.log("thismanageid", this.manageId);
        this[dialog] = true;
        console.log("1111111");
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
      console.log("111111", type);
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
    //图片上传
    imgHandleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, fileList.length - 1);
      }
      console.log(file, fileList);
      let formData = new FormData();
      fileList.forEach((v) => {
        formData.append("files", v.raw);
      });
      console.log(formData);
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/upload//file`),
        method: "post",
        headers: {
          "content-type": "multipart/form-data",
        },
        data: formData,
      }).then((data) => {
        console.log(data);
        if (this.beforeUpLoadIndex == 0) {
          this[this.operationName].urlList.splice(0, 1, {
            name: data.data.filestr[0],
            url: data.data.filestr[0],
          });
        }
        if (this.beforeUpLoadIndex == 1) {
          this[this.operationName].urlList.splice(1, 1, {
            name: data.data.filestr[0],
            url: data.data.filestr[0],
          });
        }
        if (this.beforeUpLoadIndex == 2) {
          this[this.operationName].urlList.splice(2, 1, {
            name: data.data.filestr[0],
            url: data.data.filestr[0],
          });
        }
        console.log(this[this.operationName].urlList);
        // this.addApplication.faceUrl.push({
        //   name: data.data.filestr[0],
        //   url: data.data.filestr[0],
        // });
        // this.addApplication.faceUrl = data.data.filestr[0];
      });
    },
    //文件上传
    documentHandleChange(file, fileList) {
      console.log(file, fileList);
      let formData = new FormData();
      fileList.forEach((v) => {
        formData.append("files", v.raw);
      });
      console.log(formData);
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/upload//file`),
        method: "post",
        headers: {
          "content-type": "multipart/form-data",
        },
        data: formData,
      }).then((data) => {
        console.log(data);
        // this.addApplication.documents = data.data.filestr[0];
        let arr = [];
        data.data.filestr.forEach((v, i) => {
          arr.push({
            url: v,
            documentName: data.data.fileName[i],
          });
        });
        this.addApplication.documents = arr;
        console.log(this.addApplication.documents);
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
  margin: 20px 0;
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