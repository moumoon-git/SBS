<template>
  <div class="cyglOutSide">
    <div class="cygl">
      <!-- <div class="message-tree">
        <div class="message-tree-search">
          <div
            class="el-icon-search message-tree-search-icon"
            @click="searchTree"
          ></div>
          <input
            class="message-tree-search-inner"
            placeholder="按enter搜索"
            v-model="search.searchTreeName"
            @keyup.enter="searchTree"
          />
          <div
            class="message-tree-search-cancel el-icon-close"
            v-if="search.searchTreeName"
            @click="
              search.searchTreeName = '';
              searchTree();
            "
          ></div>
        </div>
        <div class="message-tree-scroll">
          <el-tree
            ref="tree"
            :highlight-current="true"
            @node-click="handleNodeClick"
            :data="treeList"
            :props="treeProps"
            :show-checkbox="exportVisible"
            node-key="id"
            :default-expanded-keys="[0]"
            :current-node-key="0"
          ></el-tree>
        </div>
      </div> -->
      <div class="header">
        <!-- <div class="headerText">
          <div>
            总人数：
            <span style="color: #333333; font-size: 16px; font-weight: bold">{{
              total.memberCount
            }}</span>
          </div>
          <div>
            待审核：
            <span style="color: #f2b626; font-size: 16px; font-weight: bold">{{
              total.waitCheckCount
            }}</span>
          </div>
          <div>
            已审核审核：
            <span style="color: #0bd295; font-size: 16px; font-weight: bold">{{
              total.checkedCount
            }}</span>
          </div>
          <div>
            已驳回：
            <span style="color: #f66e6e; font-size: 16px; font-weight: bold">{{
              total.rejectCount
            }}</span>
          </div>
          <div>
            待提交：
            <span style="color: #666666; font-size: 16px; font-weight: bold">{{
              total.waitCommitCount
            }}</span>
          </div>
        </div> -->
        <el-select
          @change="search"
          clearable
          v-model="queryCondition.entryStatus"
          placeholder="请选择入职状态"
        >
          <el-option
            v-for="item in options"
            :key="'options' + item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          @change="search"
          v-model="queryCondition.searchTimeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="dateSelect"
          style="marginleft: 10px; width: 340px"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-input
          clearable
          suffix-icon="el-icon-search"
          v-model="queryCondition.condition"
          style="marginleft: 10px; width: 330px"
          placeholder=" 请输入申请人姓名、村居、身份证、电话关键字"
          @change="search"
        ></el-input>
        <!-- <el-button class="search" type="primary" style="marginLeft:10px" @click="search">查询</el-button> -->
        <!-- 隐藏的按钮 -->
        <div style="z-index: -1; position: absolute">
          <el-upload
            :with-credentials="true"
            :show-file-list="false"
            :on-progress="beforeUploadFile"
            :on-error="handleError"
            :on-success="handleAvatarSuccess"
            :action="documenttoken"
            style="display: inline-flex; margin: 0 10px"
          >
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                请填写我们提供
                <br />的模板进行导入
              </div>
              <el-button
                ref="importButton"
                v-loading.fullscreen.lock="fullscreenLoading"
                element-loading-text="正在导入通讯录，可能需要几分钟时间，请耐心等待.."
                v-if="
                  isAuth('mail:mailgroup:xlsInput') &&
                  !sharedPlatform.noticeBarVisible
                "
                plain
              >
                <img src="../../../assets/img/upload.svg" />
                导入
              </el-button>
            </el-tooltip>
          </el-upload>
          <el-button
            ref="exportTemplateBtn"
            class="search"
            type="primary"
            style="margin-right: 10px"
            @click="downloadtemplate()"
            >导出模板</el-button
          >
          <el-dropdown style="margin-right: 10px">
            <el-button plain>
              <img src="../../../assets/img/download.svg" />导出
            </el-button>
            <el-dropdown-menu slot="dropdown" split-button="true">
              <el-dropdown-item
                ref="conditionExportBtn"
                @click.native="conditionExport"
                >条件导出</el-dropdown-item
              >
              <el-dropdown-item
                ref="unconditionExportBtn"
                @click.native="unConditionExport"
                >无条件导出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <el-button
          class="search"
          type="primary"
          v-if="!shgl || shgl < 1"
          @click="addEntryApplicationButtonClick('add')"
          >新增入职申请</el-button
        >
        <!-- 更多按钮 -->
        <div
          class="more-button-container"
          :class="moreBtnIsFocus ? 'more-button-focus' : 'more-button-unfocus'"
        >
          <div @click="moreBtnIsFocus = !moreBtnIsFocus">
            <span>更多</span>
            <!-- <i :class="moreBtnIsFocus?'el-icon-caret-top':'el-icon-caret-bottom'"></i> -->
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="more-button-content">
            <div class="more-button-content-item-header">导出</div>
            <div class="more-button-content-item" @click="moreClick(1)">
              导出模板
            </div>
            <div class="more-button-content-item" @click="moreClick(2)">
              条件导出
            </div>
            <div class="more-button-content-item" @click="moreClick(3)">
              无条件导出
            </div>
            <div class="more-button-content-line"></div>
            <div class="more-button-content-item" @click="moreClick(4)">
              导入
            </div>
          </div>
        </div>
        <!-- 更多按钮 -->
        <!-- 左右分布的时候width设置为80% -->
        <el-dialog
          width="60%"
          title="新增入职申请"
          :close-on-click-modal="closeClickModal"
          :visible.sync="dialogFormVisible"
          class="addDialog"
        >
          <!-- 基本信息模块 -->

          <!-- 该注释行用于左右分布的情况 -->
          <!-- <div style="display:flex"> -->
          <div class="addDialog_left">
            <div class="titleBorder">
              基本信息
              <el-tooltip
                class="item"
                effect="dark"
                content="一键清空数据"
                placement="top"
              >
                <span
                  @click="closeAddEntryApplication"
                  class="clearformData el-icon-refresh"
                ></span>
              </el-tooltip>
              <!-- <el-button @click="closeAddEntryApplication" class="clearformData el-icon-refresh">清空数据</el-button> -->
            </div>
            <div style="display: flex">
              <div @click.stop="beforeUpLoadClick(0, 'addApplication')">
                <el-upload
                  class="avatar-uploader"
                  action
                  :show-file-list="false"
                  :auto-upload="false"
                  :file-list="fileList"
                  :on-change="imgHandleChange"
                >
                  <img
                    v-if="addApplication.urlList[0].url"
                    :src="backgroundURL + addApplication.urlList[0].url"
                    class="avatar"
                  />
                  <i v-else class="avatar-uploader-icon">
                    <span>上传照片</span>
                    <img src="../../../assets/img/uploadPhoto.png" alt />
                  </i>
                </el-upload>
              </div>
              <div @click.stop="beforeUpLoadClick(1, 'addApplication')">
                <el-upload
                  class="avatar-uploader"
                  action
                  :show-file-list="false"
                  :auto-upload="false"
                  :file-list="fileList"
                  :on-change="imgHandleChange"
                >
                  <img
                    v-if="addApplication.urlList[1].url"
                    :src="backgroundURL + addApplication.urlList[1].url"
                    class="avatar_id"
                  />
                  <i v-else class="avatar-uploader-icon-idFront">
                    <span>身份证(人像面)</span>
                    <img src="../../../assets/img/idFront.png" alt />
                    <img
                      class="upload"
                      src="../../../assets/img/uploadPhoto.png"
                      alt
                    />
                  </i>
                </el-upload>
              </div>
              <div @click.stop="beforeUpLoadClick(2, 'addApplication')">
                <el-upload
                  class="avatar-uploader"
                  action
                  :show-file-list="false"
                  :auto-upload="false"
                  :file-list="fileList"
                  :on-change="imgHandleChange"
                >
                  <img
                    v-if="addApplication.urlList[2].url"
                    :src="backgroundURL + addApplication.urlList[2].url"
                    class="avatar_idBack"
                  />
                  <i v-else class="avatar-uploader-icon-idBack">
                    <span>身份证(国徽面)</span>
                    <img src="../../../assets/img/idBack.png" alt />
                    <img
                      class="upload"
                      src="../../../assets/img/uploadPhoto.png"
                      alt
                    />
                  </i>
                </el-upload>
              </div>
            </div>
            <el-form
              border
              :model="addApplication"
              ref="baseInformation"
              style="display: flex; margintop: 21px; marginbottom: 28px"
            >
              <div class="formLeft">
                <el-form-item label="成员类型" :label-width="formLabelWidth">
                  <el-select
                    v-model="addApplication.memberType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in memberTypeData"
                      :key="'memberType' + item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  required
                  label="姓名"
                  prop="name"
                  :label-width="formLabelWidth"
                >
                  <el-input v-model="addApplication.name"></el-input>
                </el-form-item>
                <el-form-item label="出生年月" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="addApplication.birth"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="民族" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.nation"></el-input>
                </el-form-item>
                <el-form-item label="学历" :label-width="formLabelWidth">
                  <el-select
                    v-model="addApplication.education"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in educationData"
                      :key="'education' + item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="所属村委" :label-width="formLabelWidth">
                  <el-select v-model="addApplication.villageCommittee" placeholder="请选择">
                    <el-option
                      v-for="item in villageCommitteeData"
                      :key="'villageCommitteeData'+item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>-->
                <!-- <el-form-item label="毕业学校" :label-width="formLabelWidth">
                    <el-input v-model="addApplication.graduationSchool"></el-input>
                </el-form-item>-->
                <el-form-item label="政治面貌" :label-width="formLabelWidth">
                  <el-select
                    v-model="addApplication.politicalOutlook"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in politicalOutlookData"
                      :key="'politicalOutlookData' + item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="身份证号" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.credentialsNum"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.phone"></el-input>
                </el-form-item>
                <!-- <el-form-item label="户口地址" :label-width="formLabelWidth">
                    <el-input v-model="addApplication.nationPlace"></el-input>
                </el-form-item>-->
                <el-form-item label="健康情况" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.health"></el-input>
                </el-form-item>
                <el-form-item
                  label="有无从事群防群治经验"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    v-model="addApplication.isExperience"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in experienceType"
                      :key="'experienceType' + item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="是否退伍军人"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    v-model="addApplication.isVeteran"
                    placeholder="请选择"
                  >
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
                <el-form-item
                  required
                  label="性别"
                  prop="sex"
                  :label-width="formLabelWidth"
                >
                  <el-select v-model="addApplication.sex" placeholder="请选择">
                    <el-option
                      v-for="item in sexType"
                      :key="'sexType' + item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="身高（cm）" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.height"></el-input>
                </el-form-item>
                <el-form-item label="体重（kg）" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.weight"></el-input>
                </el-form-item>
                <el-form-item label="籍贯" :label-width="formLabelWidth">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="如：广州增城"
                    placement="top"
                  >
                    <el-input v-model="addApplication.nativePlace"></el-input>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="出生地" :label-width="formLabelWidth">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="如：广东增城"
                    placement="top"
                  >
                    <el-input v-model="addApplication.birthPlace"></el-input>
                  </el-tooltip>
                </el-form-item>

                <el-form-item label="毕业学校" :label-width="formLabelWidth">
                  <el-input
                    v-model="addApplication.graduationSchool"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item label="所属村委" :label-width="formLabelWidth">
                    <el-select v-model="addApplication.villageCommittee" placeholder="请选择">
                      <el-option
                        v-for="item in villageCommitteeData"
                        :key="'villageCommitteeData'+item.code"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="毕业时间" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="addApplication.graduationTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="专业" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.major"></el-input>
                </el-form-item>
                <el-form-item label="户口地址" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.nationPlace"></el-input>
                </el-form-item>
                <el-form-item
                  v-show="hide"
                  label="户口性质"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    v-model="addApplication.natureAccount"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in natureAccountData"
                      :key="'natureAccount' + item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="驾驶证类别" :label-width="formLabelWidth">
                  <el-select
                    v-model="addApplication.driverTypeList"
                    multiple
                    placeholder="请选择"
                  >
                    <!-- <el-option
                      v-for="item in driverTypeData"
                      :key="'driverTypeData'+item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>-->
                    <el-option
                      v-for="item in driverTypeData"
                      :key="'driverTypeData' + item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="家庭电话" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.homePhone"></el-input>
                </el-form-item>
                <el-form-item
                  v-show="hide"
                  label="邮编"
                  :label-width="formLabelWidth"
                >
                  <el-input v-model="addApplication.zipCode"></el-input>
                </el-form-item>
                <!-- <el-form-item label=" " :label-width="formLabelWidth"></el-form-item> -->
              </div>
            </el-form>
            <!-- 基本信息模块 -->

            <!-- 个人简历模块 -->
            <div class="titleBorder">个人简历</div>
            <div class="addResume" @click="addPersonalResume('addApplication')">
              <span>+</span>添加简历
            </div>
            <div
              class="grayBox"
              v-for="(item, index) in addApplication.curriculumVitaeEntities"
              :key="'curriculumVitaeEntities' + index"
            >
              <div>
                <img
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="delectPersonalResume(index, 'addApplication')"
                  src="../../../assets/img/del2.svg"
                  alt
                />
                <!-- <i
                style="color:#0091ff;fontSize:20px;float:right;marginRight:10px"
                class="el-icon-delete"
                @click="delectPersonalResume(index,'addApplication')"
                ></i>-->
              </div>
              <div style="display: flex">
                <div style="marginleft: 20px">
                  <div>开始及结束时间</div>
                  <el-date-picker
                    v-model="
                      addApplication.curriculumVitaeEntities[index].startEndTime
                    "
                    type="monthrange"
                    range-separator="-"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    value-format="yyyy-MM"
                  ></el-date-picker>
                </div>
                <div style="marginleft: 20px; width: 270px">
                  <div>在何单位学习或工作</div>
                  <el-input
                    v-model="
                      addApplication.curriculumVitaeEntities[index].study
                    "
                  ></el-input>
                </div>
                <div style="marginleft: 20px; width: 270px">
                  <div>职务</div>
                  <el-input
                    v-model="addApplication.curriculumVitaeEntities[index].post"
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
                    <el-input
                      v-model="addApplication.homeSpousename"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    v-show="hide"
                    label="现住址"
                    :label-width="formLabelWidth"
                  >
                    <el-input v-model="addApplication.homeAddress"></el-input>
                  </el-form-item>
                </div>
                <div class="formRight">
                  <!-- <el-form-item label="户籍所在地" :label-width="formLabelWidth">
                  <el-input v-model="addApplication.homeNation"></el-input>
                  </el-form-item>-->
                  <el-form-item label="联系电话" :label-width="formLabelWidth">
                    <el-input
                      v-model="addApplication.homeSpousephone"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    v-show="hide"
                    label="工作单位"
                    :label-width="formLabelWidth"
                  >
                    <el-input
                      v-model="addApplication.homespouseunit"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <!-- <el-form-item label="家庭其他成员" :label-width="formLabelWidth"> -->
              <!-- <div
              style="width:136px;height:40px;lineHeight:40px;border:1px dashed #d7d7d7;textAlign:center"
              @click="addFamilySituation('addApplication')"
              >添加</div>-->
              <!-- </el-form-item> -->
              <div
                class="addMember"
                @click="addFamilySituation('addApplication')"
              >
                <span>+</span>添加成员
              </div>
              <div
                class="grayBox"
                v-for="(item, index) in addApplication.homeMemberEntities"
                :key="'homeMemberEntities' + index"
              >
                <div>
                  <img
                    style="cursor: pointer"
                    class="el-icon-delete"
                    @click="delectFamilySituation(index, 'addApplication')"
                    src="../../../assets/img/del2.svg"
                    alt
                  />
                  <!-- <i
                  style="color:#0091ff;fontSize:20px;float:right;marginRight:10px"
                  class="el-icon-delete"
                  @click="delectFamilySituation(index,'addApplication')"
                  ></i>-->
                </div>
                <div style="display: flex">
                  <!-- <div style="marginLeft:20px;width:84px"> -->
                  <div style="marginleft: 20px; width: 300px">
                    <div>关系</div>
                    <el-input
                      v-model="
                        addApplication.homeMemberEntities[index].relationship
                      "
                    ></el-input>
                  </div>
                  <div style="marginleft: 20px; width: 270px">
                    <div>姓名</div>
                    <el-input
                      v-model="addApplication.homeMemberEntities[index].name"
                    ></el-input>
                  </div>
                  <div v-show="hide" style="marginleft: 20px; width: 432px">
                    <div>工作单位</div>
                    <el-input
                      v-model="
                        addApplication.homeMemberEntities[index].workUnit
                      "
                    ></el-input>
                  </div>
                  <div style="marginleft: 20px; width: 270px">
                    <div>联系电话</div>
                    <el-input
                      v-model="addApplication.homeMemberEntities[index].phone"
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
              v-model="addApplication.personalSpecialty"
              class="special"
              resize="none"
            ></el-input>

            <!-- 个人特长模块 -->

            <!-- 附件模块 -->
            <div class="titleBorder">毛发检测结果</div>
            <el-upload
              class="avatar-uploader"
              action
              :on-change="documentHandleChange"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :file-list="fileList"
            >
              <!-- <i class="avatar-uploader-icon-resume">
              <span>+</span>上传附件
              </i>-->
              <i class="addDocument"> <span>+</span>上传附件 </i>
            </el-upload>
          </div>
          <!-- 附件模块 -->
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
              @getNextPlatform="changeNextPlatform"
              @queryHistoryRecord="queryHHistoryRecord"
              @changeManage="changeManage"
            ></showProcess>
          </div>
          <!-- </div> -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmAddEntryApply"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>

      <div class="content">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          :header-row-class-name="titleColor"
          @select="selectCheckBox"
          @select-all="selectAllCheckBox"
          border
          height="calc(100vh - 240px)"
        >
          <el-table-column
            align="center"
            v-if="moreBtnIsFocus"
            type="selection"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="姓名"
          ></el-table-column>
          <el-table-column align="center" prop="sex" label="性别" type="index">
            <template slot-scope="scope">{{
              scope.row.sex == "0" ? "男" : scope.row.sex == "1" ? "女" : ""
            }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="birthPlace"
            label="籍贯"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="villageCommitteeString"
            label="所属村居"
          ></el-table-column>
          <el-table-column
            align="center"
            width="200"
            prop="credentialsNum"
            label="身份证号码"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="phone"
            label="联系电话"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="memberTypeString"
            label="成员类型"
          ></el-table-column>
          <el-table-column
            align="center"
            width="200"
            prop="gmtCreate"
            label="申请时间"
          ></el-table-column>
          <!-- <el-table-column align="center" prop="status" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">待提交</span>
              <span
                v-if="scope.row.status == 1"
                :class="scope.row.status == 1 ? 'orangeStatus' : ''"
                >待审核</span
              >
              <span
                v-if="scope.row.status == 2"
                :class="scope.row.status == 2 ? 'greenStatus' : ''"
                >已审核</span
              >
              <span
                v-if="scope.row.status == 3"
                :class="scope.row.status == 3 ? 'redStatus' : ''"
                >已驳回</span
              >
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="accountType" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.accountType == 1">在职</span>
              <span
                v-if="scope.row.accountType == 2"
                :class="scope.row.accountType == 2 ? 'redStatus' : ''"
                >离职</span
              >
            </template>
          </el-table-column>
          <el-table-column align="right" width="300" label="操作">
            <template slot-scope="scope">
              <!-- 重新入职 -->
              <!-- <el-tooltip
                v-show="scope.row.accountType == '2'"
                class="item"
                effect="dark"
                content="重新入职"
                placement="top"
              >
                <img
                  src="../../../assets/img/sh2.svg"
                  @click="
                    editEntryInformation(
                      scope.$index,
                      'dialogFormVisibleEdit',
                      'baoshen'
                    )
                  "
                  style="cursor: pointer; width: 20px; margin-right: 10px"
                  class="sh"
                  @mouseenter="mouseEnterImg('sh', scope.$index)"
                  @mouseleave="mouseLeaveImg('sh', scope.$index)"
                />
              </el-tooltip> -->
              <el-button
                v-if="scope.row.accountType == '2'"
                size="mini"
                type="primary"
                @click="
                  editEntryInformation(
                    scope.$index,
                    'dialogFormVisibleEdit',
                    'baoshen'
                  )
                "
                >重新入职</el-button
              >
              <!-- 查看成员信息 -->
              <!-- <el-tooltip
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <img
                  src="../../../assets/img/eye.svg"
                  @click="
                    watchDetail(scope.$index, 'dialogFormVisibleWatch', 'show')
                  "
                  style="cursor: pointer; width: 20px; margin-right: 10px"
                  class="eye"
                  @mouseenter="mouseEnterImg('eye', scope.$index)"
                  @mouseleave="mouseLeaveImg('eye', scope.$index)"
                />
              </el-tooltip> -->
              <el-button
                size="mini"
                type="primary"
                @click="
                  watchDetail(scope.$index, 'dialogFormVisibleWatch', 'show')
                "
                >查看</el-button
              >
              <el-button
                v-if="scope.row.accountType == '1'"
                size="mini"
                type="primary"
                @click="showApprove(scope.row.id)"
                >离职登记</el-button
              >
              <!-- 离职登记 -->
              <!-- <el-tooltip
                v-show="scope.row.accountType == '1'"
                class="item"
                effect="dark"
                content="离职登记"
                placement="top"
              >
                <img
                  src="../../../assets/img/sh2.svg"
                  @click="baoshen(scope.row.id)"
                  style="cursor: pointer; width: 20px; margin-right: 10px"
                  class="sh"
                  @mouseenter="mouseEnterImg('sh', scope.$index)"
                  @mouseleave="mouseLeaveImg('sh', scope.$index)"
                />
              </el-tooltip> -->
              <el-button
                v-if="scope.row.accountType == '2'"
                size="mini"
                type="danger"
                style="height: 36px"
                @click="delectInformation(scope.$index)"
                >删除</el-button
              >
              <!-- <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                v-show="scope.row.accountType == '2'"
              >
                <img
                  src="../../../assets/img/del2.svg"
                  @click="delectInformation(scope.$index)"
                  style="cursor: pointer; width: 20px; margin-right: 20px"
                  class="del"
                  @mouseenter="mouseEnterImg('del', scope.$index)"
                  @mouseleave="mouseLeaveImg('del', scope.$index)"
                />
              </el-tooltip> -->
            </template>

            <!-- 查看成员信息 -->
            <el-dialog
              width="80%"
              class="watch_information"
              title="查看成员信息"
              :visible.sync="dialogFormVisibleWatch"
              :append-to-body="true"
              :close-on-click-modal="closeClickModal"
            >
              <div style="display: flex">
                <div style="width: 1090px; borderright: 1px solid #f0f0f0">
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
                        src="../../../assets/img/member_dtj.svg"
                        alt
                      />
                      <img
                        v-if="detailData.status == 1"
                        src="../../../assets/img/member_dsh.svg"
                        alt
                      />
                      <img
                        v-if="detailData.status == 2"
                        src="../../../assets/img/member_ysh.svg"
                        alt
                      />
                      <img
                        v-if="detailData.status == 3"
                        src="../../../assets/img/member_ybh.svg"
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
                            src="../../../assets/img/avatar.png"
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
                        <el-form-item
                          label="成员类型"
                          :label-width="formLabelWidth"
                          >{{ detailData.memberTypeString }}</el-form-item
                        >
                        <el-form-item
                          label="姓名"
                          required
                          :label-width="formLabelWidth"
                          >{{ detailData.name }}</el-form-item
                        >
                        <el-form-item
                          label="出生年月"
                          :label-width="formLabelWidth"
                          >{{ detailData.birth }}</el-form-item
                        >
                        <el-form-item
                          label="民族"
                          :label-width="formLabelWidth"
                          >{{ detailData.nation }}</el-form-item
                        >
                        <el-form-item
                          label="学历"
                          :label-width="formLabelWidth"
                          >{{ detailData.educationString }}</el-form-item
                        >
                        <!-- <el-form-item
                          label="所属村委"
                          :label-width="formLabelWidth"
                        >{{detailData.villageCommitteeString}}</el-form-item>-->
                        <!-- <el-form-item
                          label="毕业学校"
                          :label-width="formLabelWidth"
                        >{{detailData.graduationSchool}}</el-form-item>-->
                        <el-form-item
                          label="政治面貌"
                          :label-width="formLabelWidth"
                          >{{ detailData.politicalOutlookString }}</el-form-item
                        >
                        <el-form-item
                          label="身份证号"
                          :label-width="formLabelWidth"
                          >{{ detailData.credentialsNum }}</el-form-item
                        >
                        <el-form-item
                          label="联系电话"
                          :label-width="formLabelWidth"
                          >{{ detailData.phone }}</el-form-item
                        >
                        <!-- <el-form-item
                          label="户口地址"
                          :label-width="formLabelWidth"
                        >{{detailData.nationPlace}}</el-form-item>-->
                        <el-form-item
                          label="健康情况"
                          :label-width="formLabelWidth"
                          >{{ detailData.health }}</el-form-item
                        >
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
                        <el-form-item
                          label="性别"
                          :label-width="formLabelWidth"
                          >{{
                            detailData.sex == "0"
                              ? "男"
                              : detailData.sex == "1"
                              ? "女"
                              : ""
                          }}</el-form-item
                        >
                        <el-form-item
                          label="身高"
                          :label-width="formLabelWidth"
                          >{{ detailData.height }}</el-form-item
                        >
                        <el-form-item
                          label="体重"
                          :label-width="formLabelWidth"
                          >{{ detailData.weight }}</el-form-item
                        >
                        <el-form-item
                          label="籍贯"
                          :label-width="formLabelWidth"
                          >{{ detailData.nativePlace }}</el-form-item
                        >
                        <el-form-item
                          label="出生地"
                          :label-width="formLabelWidth"
                          >{{ detailData.birthPlace }}</el-form-item
                        >
                        <el-form-item
                          label="毕业学校"
                          :label-width="formLabelWidth"
                          >{{ detailData.graduationSchool }}</el-form-item
                        >
                        <!-- <el-form-item
                          label="所属村委"
                          :label-width="formLabelWidth"
                        >{{detailData.villageCommitteeString}}</el-form-item>-->
                        <el-form-item
                          label="毕业时间"
                          :label-width="formLabelWidth"
                          >{{ detailData.graduationTime }}</el-form-item
                        >
                        <el-form-item
                          label="专业"
                          :label-width="formLabelWidth"
                          >{{ detailData.major }}</el-form-item
                        >
                        <el-form-item
                          label="户口地址"
                          :label-width="formLabelWidth"
                          >{{ detailData.nationPlace }}</el-form-item
                        >
                        <el-form-item
                          v-show="hide"
                          label="户口性质"
                          :label-width="formLabelWidth"
                          >{{ detailData.natureAccountString }}</el-form-item
                        >
                        <el-form-item
                          label="驾驶证类别"
                          :label-width="formLabelWidth"
                          >{{ detailData.driverTypeString }}</el-form-item
                        >
                        <el-form-item
                          label="家庭电话"
                          :label-width="formLabelWidth"
                          >{{ detailData.homePhone }}</el-form-item
                        >
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
                      v-for="(item,
                      index) in detailData.curriculumVitaeEntities"
                      :key="'detailCurriculumVitaeEntities' + index"
                    >
                      <div style="display: flex; height: 100%">
                        <div style="margin: 0 20px; flex: 1">
                          <div>开始及结束时间</div>
                          <span>{{
                            detailData.curriculumVitaeEntities
                              ? detailData.curriculumVitaeEntities[index]
                                  .startEndTime &&
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
                                ? detailData.curriculumVitaeEntities[index]
                                    .study
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
                    <el-form
                      :model="form"
                      style="display: flex; marginleft: 200px"
                    >
                      <div class="watch_information_left" style="width: 455px">
                        <el-form-item
                          label="配偶姓名"
                          :label-width="formLabelWidth"
                          >{{ detailData.homeSpousename }}</el-form-item
                        >
                        <!-- <el-form-item
                          label="现住址"
                          :label-width="formLabelWidth"
                        >{{detailData.homeAddress}}</el-form-item>-->
                      </div>
                      <div
                        class="watch_information_center"
                        style="width: 230px"
                      >
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
                    <el-form
                      :model="form"
                      style="display: flex; marginleft: 200px"
                    >
                      <div
                        v-show="hide"
                        class="watch_information_left"
                        style="width: 455px"
                      >
                        <el-form-item
                          label="现住址"
                          :label-width="formLabelWidth"
                          >{{ detailData.homeAddress }}</el-form-item
                        >
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
                        style="width: 230px"
                      >
                        <el-form-item label="工作单位" label-width="140px">{{
                          detailData.homespouseunit
                        }}</el-form-item>
                      </div>
                    </el-form>
                    <el-form class="otherMember">
                      <el-form-item
                        label="其他成员"
                        :label-width="formLabelWidth"
                      >
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
                                    ? detailData.homeMemberEntities[index]
                                        .relationship
                                      ? detailData.homeMemberEntities[index]
                                          .relationship
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
                                      ? detailData.homeMemberEntities[index]
                                          .name
                                      : ""
                                    : ""
                                }}</span>
                              </div>
                            </div>
                            <div
                              v-show="hide"
                              style="margin: auto 7px; flex: 1"
                            >
                              <div>单位</div>
                              <div>
                                <span style="width: 491px">{{
                                  detailData.homeMemberEntities
                                    ? detailData.homeMemberEntities[index]
                                        .workUnit
                                      ? detailData.homeMemberEntities[index]
                                          .workUnit
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
                                      ? detailData.homeMemberEntities[index]
                                          .phone
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

                    <!-- 评论审核框 -->
                    <!-- <div>sssssssssssssssssssssssssssssssssss</div> -->
                    <div>
                      <approveEdit
                        v-if="type == 'shenhe' && showshenhe"
                        ref="approveEdit"
                        @cancel="dialogFormVisibleWatch = false"
                        @refreshTable="search()"
                        :nextPlatformId="nextPlatformId"
                        :id="dataForm.id"
                        :processid="processId"
                        :tikutype="tikuType"
                      ></approveEdit>
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
                              item.approveManageEntity.approveTikuEntity
                                .registerName
                            }}
                          </div>
                          <div class="title_time">
                            获奖时间：{{ item.gmtCreate }}
                          </div>
                        </div>
                        <p class="reward_text">
                          奖项说明：{{
                            item.approveManageEntity.approveTikuEntity.remark
                          }}
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
                              v-for="(data, i) in item.approveManageEntity
                                .processList"
                              :key="i"
                            >
                              <p v-if="i > 0">
                                {{ data.depName }}意见：{{
                                  data.approveApproveEntity != null
                                    ? data.approveApproveEntity.approveResult ==
                                      "0"
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
                  </div>
                </div>
                <div style="width: 400px; marginleft: 20px">
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
              </div>
            </el-dialog>
            <!-- 查看成员信息 -->

            <!-- 编辑入职信息 -->
            <el-dialog
              width="60%"
              title="编辑入职信息"
              :append-to-body="true"
              :visible.sync="dialogFormVisibleEdit"
              style="textalign: left"
              class="editDialog"
              :close-on-click-modal="closeClickModal"
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
                        <img src="../../../assets/img/uploadPhoto.png" alt />
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
                        <img src="../../../assets/img/idFront.png" alt />
                        <img
                          class="upload"
                          src="../../../assets/img/uploadPhoto.png"
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
                        <img src="../../../assets/img/idBack.png" alt />
                        <img
                          class="upload"
                          src="../../../assets/img/uploadPhoto.png"
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
                    <el-form-item
                      label="成员类型"
                      :label-width="formLabelWidth"
                    >
                      <el-select
                        v-model="detailData.memberType"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in memberTypeData"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      required
                      label="姓名"
                      :label-width="formLabelWidth"
                    >
                      <el-input v-model="detailData.name"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="出生年月"
                      :label-width="formLabelWidth"
                    >
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
                      <el-select
                        v-model="detailData.education"
                        placeholder="请选择"
                      >
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
                    <el-form-item
                      label="政治面貌"
                      :label-width="formLabelWidth"
                    >
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
                    <el-form-item
                      label="身份证号"
                      :label-width="formLabelWidth"
                    >
                      <el-input v-model="detailData.credentialsNum"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="联系电话"
                      :label-width="formLabelWidth"
                    >
                      <el-input v-model="detailData.phone"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="户口地址" :label-width="formLabelWidth">
                        <el-input v-model="detailData.nationPlace"></el-input>
                    </el-form-item>-->
                    <el-form-item
                      label="健康情况"
                      :label-width="formLabelWidth"
                    >
                      <el-input v-model="detailData.health"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="有无从事群防群治经验"
                      :label-width="formLabelWidth"
                    >
                      <el-select
                        v-model="detailData.isExperience"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in experienceType"
                          :key="'experienceType' + item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="是否退伍军人"
                      :label-width="formLabelWidth"
                    >
                      <el-select
                        v-model="detailData.isVeteran"
                        placeholder="请选择"
                      >
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
                    <el-form-item
                      required
                      label="性别"
                      :label-width="formLabelWidth"
                    >
                      <el-select v-model="detailData.sex" placeholder="请选择">
                        <el-option
                          v-for="item in sexType"
                          :key="'sexType' + item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="身高（cm）"
                      :label-width="formLabelWidth"
                    >
                      <el-input v-model="detailData.height"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="体重（kg）"
                      :label-width="formLabelWidth"
                    >
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
                    <el-form-item
                      label="毕业学校"
                      :label-width="formLabelWidth"
                    >
                      <el-input
                        v-model="detailData.graduationSchool"
                      ></el-input>
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
                    <el-form-item
                      label="毕业时间"
                      :label-width="formLabelWidth"
                    >
                      <el-date-picker
                        v-model="detailData.graduationTime"
                        type="date"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="专业" :label-width="formLabelWidth">
                      <el-input v-model="detailData.major"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="户口地址"
                      :label-width="formLabelWidth"
                    >
                      <el-input v-model="detailData.nationPlace"></el-input>
                    </el-form-item>
                    <el-form-item
                      v-show="hide"
                      label="户口性质"
                      :label-width="formLabelWidth"
                    >
                      <el-select
                        v-model="detailData.natureAccount"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in natureAccountData"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="驾驶证类别"
                      :label-width="formLabelWidth"
                    >
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
                    <el-form-item
                      label="家庭电话"
                      :label-width="formLabelWidth"
                    >
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
                      src="../../../assets/img/del2.svg"
                      alt
                    />
                  </div>
                  <div style="display: flex">
                    <div style="marginleft: 20px">
                      <div class="grayBoxHeight">开始及结束时间</div>
                      <el-date-picker
                        v-model="
                          detailData.curriculumVitaeEntities[index].startEndTime
                        "
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
                        v-model="
                          detailData.curriculumVitaeEntities[index].study
                        "
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
                      <el-form-item
                        label="配偶姓名"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          v-model="detailData.homeSpousename"
                        ></el-input>
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
                      <el-form-item
                        label="联系电话"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          v-model="detailData.homeSpousephone"
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        v-show="hide"
                        label="工作单位"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          v-model="detailData.homespouseunit"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <!-- <el-form-item label="家庭其他成员" :label-width="formLabelWidth">
                  <div
                    style="width:136px;height:40px;lineHeight:40px;border:1px dashed #d7d7d7;textAlign:center"
                    @click="addFamilySituation('detailData')"
                  >添加</div>
                  </el-form-item>-->
                  <div
                    class="addMember"
                    @click="addFamilySituation('detailData')"
                  >
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
                        src="../../../assets/img/del2.svg"
                        alt
                      />
                    </div>
                    <div style="display: flex">
                      <div style="marginleft: 20px; width: 300px">
                        <div class="grayBoxHeight">关系</div>
                        <el-input
                          v-model="
                            detailData.homeMemberEntities[index].relationship
                          "
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
                          v-model="
                            detailData.homeMemberEntities[index].workUnit
                          "
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
                <div class="titleBorder" style="marginbottom: 14px">
                  个人特长
                </div>
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
                    style="
                      display: block;
                      height: 31px;
                      maxwidth: 382px;
                      margintop: 15px;
                    "
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
                <el-button @click="dialogFormVisibleEdit = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="confirmEditEntryApply"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <!-- 编辑入职信息 -->
          </el-table-column>
        </el-table>
      </div>
      <div class="bottomPagination">
        <el-pagination
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, prev, pager, next, sizes, jumper"
          background
          :total="Number(total.memberCount)"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="approveVisible">
      <div class="approve-edit-container">
        <!-- <div class="approve-edit-title">审批</div> -->
        <div>
          <label>姓名:</label>
          <label>{{ detailData.name }}</label>
          <label style="position: absolute; left: 12vw">性别:</label>
          <label style="position: absolute; left: 14vw">{{
            detailData.sex == "0" ? "男" : detailData.sex == "1" ? "女" : ""
          }}</label>
          <label style="position: absolute; left: 20vw">籍贯:</label>
          <label style="position: absolute; left: 23vw">{{
            detailData.nativePlace
          }}</label>
          <label style="position: absolute; left: 30vw">所属单位:</label>
          <label style="position: absolute; left: 33vw">{{
            detailData.villageCommittee
          }}</label>
        </div>
        <div>
          <label>身份证号码:</label>
          <label>{{ detailData.credentialsNum }}</label>
          <label style="position: absolute; left: 12vw">成员类型:</label>
          <label style="position: absolute; left: 15vw">{{
            detailData.memberTypeString
          }}</label>
          <label style="position: absolute; left: 20vw">联系电话:</label>
          <label style="position: absolute; left: 23vw">{{
            detailData.phone
          }}</label>
          <label style="position: absolute; left: 30vw">入职时间:</label>
          <label style="position: absolute; left: 33vw">{{
            detailData.villageCommittee
          }}</label>
        </div>

        <div class="approve-edit-text">
          <label>离职原因:</label>
          <textarea v-model="accountRemark"></textarea>
        </div>
        <div>
          <label>报审单位：</label>
          <el-select clearable v-model="accountPlatformId">
            <el-option
              v-for="(item, index) in accountOptions"
              :key="`platform1${index}`"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <!-- <div class="approve-edit-result">
          <label>报审单位</label>
          <el->
        </div> -->
        <div class="approve-edit-footer">
          <!-- <el-button @click="closeDialog">取消</el-button> -->
          <el-button type="primary" @click="approveSubmit">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <historyRecord ref="historyRecord"></historyRecord>
  </div>
</template>

<script>
import historyRecord from "@/views/modules/approveLevel/resourceManage/historyRecord.vue";
import showProcess from "./showProcess";
import approveEdit from "../approveLevel/resourceManage/approveEdit";
import tikuDetail from "../approveLevel/tjf/tikuDetail";
import qs from "qs";
import Cookies from "js-cookie";
import $ from "jquery";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  name: "cygl",
  components: {
    showProcess,
    approveEdit,
    historyRecord,
    tikuDetail,
  },
  props: ["shgl"],
  data() {
    // var validateSex = (rule, value, callback) => {
    //   if (this.addApplication.sex == "") {
    //     callback(new Error("性别不能为空"));
    //   } else {
    //     callback(new Error("1"));
    //   }
    // };
    // var validateName = (rule, value, callback) => {
    //   if (this.addApplication.name == "") {
    //     callback(new Error("姓名不能为空"));
    //   } else {
    //     callback(new Error("2"));
    //   }
    // };
    return {
      search: {
        searchTreeName: "",
      },
      treeList: [],
      treeProps: {
        children: "children",
        label: "platformName",
      },
      treeIds: [],
      accountOptions: [],
      accountRemark: "",
      accountPlatformId: "",
      dataId: "",
      approveVisible: false,
      closeClickModal: false, //禁止点击model关闭dialog
      beforeUpLoadIndex: "", //上传前接受到的索引
      manageId: "",
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      sharedPlatform: {
        noticeBarVisible: false,
      },
      documenttoken: "", // 获取到的token
      fullscreenLoading: false, //导入加载提示
      filename: "", // 上传文件的文件名
      dialogFormVisible: false, //新增入职信息
      dialogFormVisibleWatch: false, //查看入职信息
      dialogFormVisibleEdit: false, //编辑入职信息
      isSelect: true,
      idNum: "", //保存当前编辑页面的id
      value: "",
      value1: "",
      personalResumeData: [1], //个人简历模块数组
      //查询条件参数
      queryCondition: {
        entryStatus: "",
        searchTimeDate: "",
        currentPage: "1",
        pageItems: "10",
        condition: "",
      },
      //统计数据参数
      total: {
        memberCount: "",
        waitCheckCount: "",
        checkedCount: "",
        rejectCount: "",
        waitCommitCount: "",
      },
      input: "",
      toggleInformation: true,
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
      //列表数据
      tableData: [],
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
      formLabelWidth: "195px",
      formLabelWidth_watch: "170px",
      formLabelWidth1: "250px",

      monthTime: "",
      //新增入职申请参数
      addApplication: {
        isVeteran: "",
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
        driverTypeList: [],
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
      dataForm: {
        id: "",
      },
      showshenhe: false,
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
        driverTypeList: [],
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
      multipleSelection: [], //被选中的列表数据
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
      //新增或修改
      type: "",
      tikuType: "",
      selectionData: [], //复选框被选中的数据
      // “更多”按钮触发
      moreBtnIsFocus: false,
      managelist: [],
      hide: false,
    };
  },

  mounted() {
    // this.getTreeList();
  },
  methods: {
    searchTree() {
      this.pageIndex = 1;
      this.getTreeList();
    },
    handleNodeClick(obj) {
      this.pageIndex = 1;
      this.treeIds = [];
      obj.id == 0 ? (this.treeIds = []) : (this.treeIds = [obj.id]);
      if (obj.children != null) {
        this.getChildren(obj.children);
      }
      this.getDataList();
    },
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.treeIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d);
          }
        });
      }
    },
    //获取树
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl("/sys/platform/getPlatformTreeByPlatformId"),
        method: "get",
        params: this.$http.adornParams({
          name: this.search.searchTreeName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("treedata", data);
          this.treeList = [
            // {
            //   id: 0,
            //   platformName: "全部",
            //   children: null,
            // },
            ...data.data,
          ];
          this.treeIds = [this.treeList[0].id];
          this.search();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 离职申请确定
    approveSubmit() {
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveMemberAccount/updateAccountType`
        ),
        method: "post",
        data: this.$http.adornData({
          id: this.dataId,
          accountType: "2",
          urlList: [
            { name: "", url: "" },
            { name: "", url: "" },
            { name: "", url: "" },
          ],
          driverTypeList: [],
          curriculumVitaeEntities: [{ post: "", startEndTime: "", study: "" }],
          homeMemberEntities: [
            { name: "", phone: "", relationship: "", workUnit: "" },
          ],
          nextPlatformId: this.accountPlatformId,
          remark: this.accountRemark,
          documents: [{ docamentName: "", url: "" }],
          managerId: this.manageId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
          });
          this.approveVisible = false;
          this.search();
          this.totalData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    //离职申请
    showApprove(id) {
      this.manageId = -700;
      this.type = "add";
      this.getUnit();
      this.getPlatform();
      this.dataId = id;
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberAccount/info/${id}`),
        method: "get",
      }).then((data) => {
        this.detailData = data.data.data;
        // this.detailData.curriculumVitaeEntities.forEach((v, i) => {
        //   if (v.startEndTime) {
        //     let timeString = v.startEndTime.split("-");
        //     let beginTime = timeString[0] + "-" + timeString[1];
        //     let endTime = timeString[2] + "-" + timeString[3];
        //     let timeArr = [];
        //     timeArr.push(beginTime);
        //     timeArr.push(endTime);
        //     this.detailData.curriculumVitaeEntities[i].startEndTime = timeArr;
        //   }
        // });
        this.approveVisible = true;
      });
    },
    //设置点击阴影
    setBoxShadow(index) {
      console.log(index);
      let tableBody = document.getElementsByClassName("el-table__body")[0];
      tableBody
        .getElementsByTagName("tr")
        [index].setAttribute(
          "style",
          "box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1)"
        );
      let tableTr = tableBody.getElementsByTagName("tr")[index];
      tableTr
        .getElementsByTagName("td")[0]
        .setAttribute("style", "border-left: 3px solid #0091ff");
      //重新设置悬浮阴影
      $(".el-table__body tr:eq(" + index + ")").hover(function () {
        $(".el-table__body tr:eq(" + index + ")").css(
          "box-shadow",
          "0px 0px 11px 3px rgba(67, 85, 114, 0.1)"
        );
      });
    },
    //取消点击阴影
    cancelBoxShadow(index) {
      let tableBody = document.getElementsByClassName("el-table__body")[0];
      tableBody
        .getElementsByTagName("tr")
        [index].setAttribute("style", "box-shadow: none");
      let tableTr = tableBody.getElementsByTagName("tr")[index];
      tableTr.getElementsByTagName("td")[0].setAttribute("style", "none");
      //重新设置悬浮阴影
      $(".el-table__body tr:eq(" + index + ")").hover(
        function () {
          $(".el-table__body tr:eq(" + index + ")").css(
            "box-shadow",
            "0px 0px 11px 3px rgba(67, 85, 114, 0.1)"
          );
        },
        function () {
          $(".el-table__body tr:eq(" + index + ")").css("box-shadow", "none");
        }
      );
    },
    //被选中
    isCheck(index) {
      document
        .getElementsByClassName("edit")
        [index].setAttribute("src", require("../../../assets/img/edit.svg"));
      document
        .getElementsByClassName("del")
        [index].setAttribute("src", require("../../../assets/img/del.svg"));
      document
        .getElementsByClassName("sh")
        [index * 2].setAttribute("src", require("../../../assets/img/sh.svg"));
      document
        .getElementsByClassName("sh")
        [index * 2 + 1].setAttribute(
          "src",
          require("../../../assets/img/sh.svg")
        );
      document
        .getElementsByClassName("eye")
        [index].setAttribute("src", require("../../../assets/img/eye2.svg"));
    },
    //取消选中
    noCheck(index) {
      document
        .getElementsByClassName("edit")
        [index].setAttribute("src", require("../../../assets/img/edit2.svg"));
      document
        .getElementsByClassName("del")
        [index].setAttribute("src", require("../../../assets/img/del2.svg"));
      document
        .getElementsByClassName("sh")
        [index * 2].setAttribute("src", require("../../../assets/img/sh2.svg"));
      document
        .getElementsByClassName("sh")
        [index * 2 + 1].setAttribute(
          "src",
          require("../../../assets/img/sh2.svg")
        );
      document
        .getElementsByClassName("eye")
        [index].setAttribute("src", require("../../../assets/img/eye.svg"));
    },
    //复选框被选中事件
    selectCheckBox(selection, row) {
      console.log("复选框被选中", selection, row);
      this.selectionData = selection.slice(0);
      //最后一个复选框被取消的情况
      if (selection.length == 0) {
        this.tableData.forEach((val, index) => {
          if (val.id == row.id) {
            console.log("index", index);
            this.noCheck(index);
            // this.cancelBoxShadow(index);
          }
        });
        // this.noCheck(row);
        return;
      }
      //判断是否被选中
      selection.forEach((v) => {
        if (v.id == row.id) {
          //被选中
          this.tableData.forEach((val, index) => {
            if (val.id == row.id) {
              this.isCheck(index);
              // this.setBoxShadow(index);
            }
          });
        } else {
          //取消选中
          this.tableData.forEach((val, index) => {
            if (val.id == row.id) {
              this.noCheck(index);
              // this.cancelBoxShadow(index);
            }
          });
        }
      });
    },
    //复选框全选事件
    selectAllCheckBox(selection) {
      this.selectionData = selection;
      console.log("selection", selection);
      for (let index = 0; index < this.tableData.length; index++) {
        if (selection.length == 0) {
          console.log("反选情况");
          this.noCheck(index);
          // this.cancelBoxShadow(index);
        } else {
          this.isCheck(index);
          // this.setBoxShadow(index);
        }
      }
    },
    //鼠标移入事件
    mouseEnterImg(val, index) {
      //判断数据是否存在，存在则不执行后面代码
      if (this.selectionData) {
        for (let v in this.selectionData) {
          if (this.selectionData[v].id == this.tableData[index].id) {
            return;
          }
        }
      }
      if (val == "edit") {
        document
          .getElementsByClassName("edit")
          [index].setAttribute("src", require("../../../assets/img/edit.svg"));
      }
      if (val == "del") {
        document
          .getElementsByClassName("del")
          [index].setAttribute("src", require("../../../assets/img/del.svg"));
      }
      if (val == "sh") {
        let shElements = document.getElementsByClassName("sh");
        shElements[index * 2 + 1].setAttribute(
          "src",
          require("../../../assets/img/sh.svg")
        );
        shElements[index * 2].setAttribute(
          "src",
          require("../../../assets/img/sh.svg")
        );
      }
      if (val == "eye") {
        document
          .getElementsByClassName("eye")
          [index].setAttribute("src", require("../../../assets/img/eye2.svg"));
      }
    },
    //鼠标离开事件
    mouseLeaveImg(val, index) {
      //判断数据是否存在，存在则不执行后面代码
      if (this.selectionData) {
        for (let v in this.selectionData) {
          if (this.selectionData[v].id == this.tableData[index].id) {
            return;
          }
        }
      }
      if (val == "edit") {
        document
          .getElementsByClassName("edit")
          [index].setAttribute("src", require("../../../assets/img/edit2.svg"));
      }
      if (val == "del") {
        document
          .getElementsByClassName("del")
          [index].setAttribute("src", require("../../../assets/img/del2.svg"));
      }
      if (val == "sh") {
        let shElements = document.getElementsByClassName("sh");
        shElements[index * 2].setAttribute(
          "src",
          require("../../../assets/img/sh2.svg")
        );
        shElements[index * 2 + 1].setAttribute(
          "src",
          require("../../../assets/img/sh2.svg")
        );
      }
      if (val == "eye") {
        document
          .getElementsByClassName("eye")
          [index].setAttribute("src", require("../../../assets/img/eye.svg"));
      }
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
    // 每页输出多少条数据
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryCondition.pageItems = val;
      this.search();
    },
    // 当前页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryCondition.currentPage = val;
      this.search();
      //切换页数的时候取消所有选中
      for (let index = 0; index < this.tableData.length; index++) {
        this.noCheck(index);
      }
    },
    // 信息查询
    search() {
      let request = {
        status: this.queryCondition.entryStatus,
        startTime:
          this.queryCondition.searchTimeDate == null
            ? ""
            : this.queryCondition.searchTimeDate[0],
        endTime:
          this.queryCondition.searchTimeDate == null
            ? ""
            : this.queryCondition.searchTimeDate[1],
        page: this.queryCondition.currentPage,
        limit: this.queryCondition.pageItems,
        search: this.queryCondition.condition,
      };
      if (this.shgl > 0) {
        request["tikuType"] = "6";
      }
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberAccount/list`),
        method: "post",
        data: this.$http.adornData(request),
      }).then((data) => {
        if (data.data.code === 0) {
          this.tableData = data.data.page.list;
          this.getCount();
          this.total.memberCount = data.data.page.totalCount;
        } else {
          this.$message.error("查询出错");
        }
        console.log(this.tableData);
      });
    },
    //遍历数据状态
    getCount() {
      let request = {
        status: this.queryCondition.entryStatus,
        startTime:
          this.queryCondition.searchTimeDate == null
            ? ""
            : this.queryCondition.searchTimeDate[0],
        endTime:
          this.queryCondition.searchTimeDate == null
            ? ""
            : this.queryCondition.searchTimeDate[1],
        page: "1",
        limit: "100000",
        search: this.queryCondition.condition,
      };
      if (this.shgl > 0) {
        request["tikuType"] = "6";
      }
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberEntity/list`),
        method: "post",
        data: this.$http.adornData(request),
      }).then((data) => {
        if (data.data.code === 0) {
          let waitCheckCount = 0;
          let checkedCount = 0;
          let rejectCount = 0;
          let waitCommitCount = 0;
          for (let i = 0; i < data.data.page.list.length; i++) {
            // 待审核：1
            if (data.data.page.list[i].status == "1") {
              waitCheckCount++;
            }
            // 已审核：2
            if (data.data.page.list[i].status == "2") {
              checkedCount++;
            }
            // 已驳回：3
            if (data.data.page.list[i].status == "3") {
              rejectCount++;
            }
            // 待提交：0
            if (data.data.page.list[i].status == "0") {
              waitCommitCount++;
            }
          }
          this.total.waitCheckCount = waitCheckCount;
          this.total.checkedCount = checkedCount;
          this.total.rejectCount = rejectCount;
          this.total.waitCommitCount = waitCommitCount;
        } else {
          this.$message.error("查询出错");
        }
        console.log(this.tableData);
      });
    },
    // getCount() {
    //   // this.total.memberCount = this.tableData.length;
    //   let waitCheckCount = 0;
    //   let checkedCount = 0;
    //   let rejectCount = 0;
    //   let waitCommitCount = 0;
    //   for (let i = 0; i < this.tableData.length; i++) {
    //     // 待审核：1
    //     if (this.tableData[i].status == "1") {
    //       waitCheckCount++;
    //     }
    //     // 已审核：2
    //     if (this.tableData[i].status == "2") {
    //       checkedCount++;
    //     }
    //     // 已驳回：3
    //     if (this.tableData[i].status == "3") {
    //       rejectCount++;
    //     }
    //     // 待提交：0
    //     if (this.tableData[i].status == "0") {
    //       waitCommitCount++;
    //     }
    //   }
    //   this.total.waitCheckCount = waitCheckCount;
    //   this.total.checkedCount = checkedCount;
    //   this.total.rejectCount = rejectCount;
    //   this.total.waitCommitCount = waitCommitCount;
    // },
    //统计数据
    totalData() {
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberEntity/count`),
        method: "post",
      }).then((data) => {
        console.log(data);
        this.total = data.data.data;
      });
    },
    //删除成员信息
    delectInformation(index) {
      this.$confirm("确定要进行[删除]操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .then(() => {
          console.log(index);
          let id = this.tableData[index].id;
          this.$http({
            url: this.$http.adornUrl(`/approve/approveMemberAccount/delete`),
            method: "post",
            data: this.$http.adornData({
              ids: [id],
            }),
          }).then((data) => {
            console.log(data);
            //更新数据
            this.search();
            this.totalData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //新增入职申请-获取性别
    sexRadio(e) {
      console.log(e.target.value);
      this.addApplication.sex = this.detailData.sex = e.target.value;
    },
    //新增入职申请-是否退伍军人/有无从事群防群治经验
    experienceRadio(e) {
      this.addApplication.isExperience = this.detailData.isExperience =
        e.target.value;
    },
    // 新增入职申请按钮被点击
    addEntryApplicationButtonClick(type) {
      // //清空个人简历模块数据
      // this.addApplication.curriculumVitaeEntities = [
      //   {
      //     startEndTime: "",
      //     study: "",
      //     post: "",
      //   },
      // ];
      // //清空家庭其他成员模块数据
      // this.addApplication.homeMemberEntities = [
      //   {
      //     relationship: "",
      //     name: "",
      //     workUnit: "",
      //     phone: "",
      //   },
      // ];
      this.init(type);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.showProcess.clear();
      });
    },
    //新增入职申请
    addEntryApplication() {
      // let index = this.processType.findIndex((item) => item == "已审核");
      // if (this.nextPlatformId == "" && index < this.unitList.length) {
      //   this.$message.error("请选择下个平台名字");
      //   return;
      // }
      this.addApplication.curriculumVitaeEntities.forEach((v, index) => {
        if (v.startEndTime) {
          this.addApplication.curriculumVitaeEntities[
            index
          ].startEndTime = v.startEndTime.join("-");
        }
      });
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberAccount/save`),
        method: "post",
        data: this.$http.adornData({
          accountType: "1",
          name: this.addApplication.name,
          memberType: this.addApplication.memberType,
          sex: this.addApplication.sex,
          height: this.addApplication.height,
          weight: this.addApplication.weight,
          nativePlace: this.addApplication.nativePlace,
          birth: this.addApplication.birth,
          birthPlace: this.addApplication.birthPlace,
          nation: this.addApplication.nation,
          villageCommittee: this.addApplication.villageCommittee,
          education: this.addApplication.education,
          graduationSchool: this.addApplication.graduationSchool,
          graduationTime: this.addApplication.graduationTime,
          major: this.addApplication.major,
          politicalOutlook: this.addApplication.politicalOutlook,
          credentialsNum: this.addApplication.credentialsNum,
          driverType: this.addApplication.driverType,
          driverTypeList: this.addApplication.driverTypeList,
          phone: this.addApplication.phone,
          homePhone: this.addApplication.homePhone,
          nationPlace: this.addApplication.nationPlace,
          zipCode: this.addApplication.zipCode,
          health: this.addApplication.health,
          isExperience: this.addApplication.isExperience,
          isVeteran: this.addApplication.isVeteran,
          urlList: this.addApplication.urlList,
          curriculumVitae: "",
          curriculumVitaeEntities: this.addApplication.curriculumVitaeEntities,
          homeAddress: this.addApplication.homeAddress,
          homeNation: this.addApplication.homeNation,
          homeSpousename: this.addApplication.homeSpousename,
          homeSpousephone: this.addApplication.homeSpousephone,
          homespouseunit: this.addApplication.homespouseunit,
          homeMember: "",
          homeMemberEntities: this.addApplication.homeMemberEntities,
          personalSpecialty: this.addApplication.personalSpecialty,
          documents: this.addApplication.documents,
          natureAccount: this.addApplication.natureAccount,
          nextPlatformId: this.nextPlatformId,
          managerId: this.manageId,
        }),
      }).then((data) => {
        this.search();
        this.totalData();
        this.dialogFormVisible = false;
      });
    },
    //确认新增入职申请
    confirmAddEntryApply() {
      let index = this.processType.findIndex((item) => item == "已审核");
      if (this.nextPlatformId == "" && index < this.unitList.length) {
        this.$message.error("请选择下个平台名字");
        return;
      } else if (this.addApplication.sex == "") {
        this.$message.error("请选择性别");
        return;
      } else if (this.addApplication.name == "") {
        this.$message.error("请填写姓名");
        return;
      }
      this.addEntryApplication();
      // Promise.resolve(this.addEntryApplication()).then(() => {
      //   this.search();
      // });
      // this.totalData();
      // this.dialogFormVisible = false;
    },
    //确认编辑入职申请信息
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
          id: this.idNum,
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
    getDetail(index, dialog) {
      let id = this.tableData[index].id;
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
        console.log("thismanageid", this.manageId, this.detailData);
        if (this.type == "add") {
          this.$nextTick(() => {
            // this.$refs.showProcess.manageid = this.manageId;
            // this.$refs.showProcess.clear();
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
    //查看详情信息
    watchDetail(index, dialog, type) {
      this.init(type, index);
      this.getDetail(index, dialog);
    },
    //重新报审
    newbaoshen(index, dialog, type) {
      this.init(type, index);
      this.getDetail(index, dialog);
    },
    //编辑入职信息
    editEntryInformation(index, dialog, type) {
      this.init(type, index);
      this.getDetail(index, dialog); //获取详情信息
    },
    //上传前的点击事件
    beforeUpLoadClick(index, name) {
      this.beforeUpLoadIndex = index;
      this.operationName = name; //判断当前是新增还是编辑操作
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
    //条件导出
    conditionExport() {
      // let request = {
      //   status: this.queryCondition.entryStatus,
      //   startTime:
      //     this.queryCondition.searchTimeDate == null
      //       ? ""
      //       : this.queryCondition.searchTimeDate[0],
      //   endTime:
      //     this.queryCondition.searchTimeDate == null
      //       ? ""
      //       : this.queryCondition.searchTimeDate[1],
      //   page: this.queryCondition.currentPage,
      //   limit: this.queryCondition.pageItems,
      //   search: this.queryCondition.condition,
      // };
      if (this.shgl > 0) {
        request["tikuType"] = "6";
      }
      // let params = new Map();
      // for (let k of Object.keys(request)) {
      //   params.set(k, request[k]);
      // }
      // console.log(
      //   "条件导出",
      //   params,
      //   this.queryCondition.searchTimeDate,
      //   "111111111",
      //   this.queryCondition.searchTimeDate[0]
      // );
      window.open(
        window.SITE_CONFIG["baseUrl"] +
          `/approve/approveMemberEntity/xlsOutputCondition?status=${
            this.queryCondition.entryStatus
          }&startTime=${
            this.queryCondition.searchTimeDate == ""
              ? ""
              : this.queryCondition.searchTimeDate[0]
          }&endTime=${
            this.queryCondition.searchTimeDate == ""
              ? ""
              : this.queryCondition.searchTimeDate[1]
          }&page=${this.queryCondition.currentPage}&limit=${
            this.queryCondition.pageItems
          }&search=${this.queryCondition.condition}&tikuType=${
            this.shgl
          }&token=${this.$cookie.get("token")}`
      );
      // console.log(
      //   "第一个",
      //   typeof this.queryCondition.searchTimeDate,
      //   "第二个",
      //   this.queryCondition.searchTimeDate == null ||
      //     this.queryCondition.searchTimeDate == ""
      //     ? ""
      //     : this.queryCondition.searchTimeDate[0]
      // );
      // console.log(
      //   "window.SITE_CONFIG['baseUrl']",
      //   window.SITE_CONFIG["baseUrl"]
      // );

      // this.$http({
      //   url: this.$http.adornUrl(
      //     `/approve/approveMemberEntity/xlsOutputCondition`
      //   ),
      //   // headers:{responseType:'blob'},
      //   method: "post",
      //   data: this.$http.adornData({
      //     status: this.queryCondition.entryStatus,
      //     startTime:
      //       this.queryCondition.searchTimeDate == null ||
      //       this.queryCondition.searchTimeDate == ""
      //         ? ""
      //         : this.queryCondition.searchTimeDate[0],
      //     endTime:
      //       this.queryCondition.searchTimeDate == null ||
      //       this.queryCondition.searchTimeDate == ""
      //         ? ""
      //         : this.queryCondition.searchTimeDate[1],
      //     page: this.queryCondition.currentPage,
      //     limit: this.queryCondition.pageItems,
      //     search: this.queryCondition.condition,
      //     tikuType: this.shgl > 0 ? "6" : "",
      //   }),
      // }).then((data) => {
      //   console.log("gasfa", data.data);
      //   const blob = new Blob([data.data], {
      //     type: "application/vnd.ms-excel;charset=utf-8",
      //   }); //,{type: 'application/vnd.ms-excel;charset=utf-8'}

      //   let fileName = "aaa.xlsx";

      //   const elink = document.createElement("a");

      //   elink.download = fileName;

      //   elink.style.display = "none";

      //   elink.href = URL.createObjectURL(blob);

      //   document.body.appendChild(elink);

      //   elink.click();

      //   URL.revokeObjectURL(elink.href); // 释放URL 对象

      //   document.body.removeChild(elink);
      // });
    },
    //无条件导出
    unConditionExport() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.id);
      });
      console.log("ids==>", ids);
      var checkedIds = ids;
      window.open(
        window.SITE_CONFIG["baseUrl"] +
          `/approve/approveMemberEntity/xlsOutputSelect?checkedIds=${checkedIds.join()}&token=${this.$cookie.get(
            "token"
          )}`
      );
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      this.fullscreenLoading = true;
    },
    // 上传失败的回调
    handleError(err, file, fileList) {},
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      this.filename = file.name;
      this.search();
      if (file.response.errorData.length == 0) {
        this.$message({
          message: "导入成功!",
          type: "success",
        });
      } else if (file.response.errorData.length > 0) {
      } else {
        this.$message.error({
          type: "error",
          message: `${file.response.msg}`,
        });
      }
    },
    //关闭新增入职申请
    closeAddEntryApplication() {
      this.$data.addApplication = this.$options.data().addApplication;
      // this.addApplication.faceUrl = "";
      this.fileList = [];
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
          console.log("报审单位平台数据", data, this.baoshenData.id);
          this.platformData = data.data;
          data.data.forEach((item) => {
            this.platformOptions.push({
              value: item.id,
              label: item.platformName,
            });
            this.accountOptions.push({
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
              console.log("审核zzzzz", this.processList, data);
              if (data.platform.contactor != null) {
                this.processList[index].chargeMan.id =
                  data.platform.contactor.id;
                this.processList[index].chargeMan.name =
                  data.platform.contactor.name;
                this.processList[index].chargeMan.position =
                  data.platform.contactor.position;
                this.processList[index].chargeMan.mobile1 =
                  data.platform.contactor.mobile1;
              }
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
    init(type, index) {
      this.clearDataForm();
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
          this.getDataDetail(index);
          break;

        case "shenhe":
          this.getDataDetail(index);
          break;
        case "baoshen":
          this.getManage();
          this.getDataDetail(index);
          break;
        case "update":
          this.getDataDetail(index);
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
    //审核流程下拉框确定
    changeManage(manageId) {
      console.log("成员管理流程id", manageId);
      this.manageId = manageId;
      this.getUnit();
      this.getPlatformById(this.nowPlatForm);
    },
    //获取数据详情
    getDataDetail(index) {
      let id = this.tableData[index].id;
      this.dataForm.id = id;
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberAccount/info/${id}`),
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
    //导出模板
    downloadtemplate() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie;
      window.location.href = `${httpaddress}/approve/approveMemberEntity/gettemplate?token=${Cookies.get(
        "token"
      )}`;
    },
    /**
     * @method
     * @desc 点击更多里的选项，链接到对应已经做好的但隐藏的按钮
     * @param {number} option 按钮类型
     */
    moreClick(option) {
      switch (option) {
        case 1:
          this.$refs.exportTemplateBtn.$el.click();
          break;
        case 2:
          this.$refs.conditionExportBtn.$el.click();
          break;
        case 3:
          this.$refs.unconditionExportBtn.$el.click();
          break;
        case 4:
          this.$refs.importButton.$el.click();
          break;
      }
    },
  },
  created() {
    this.nowPlatForm = this.$cookie.get("platformId");
    //页面创建时获取所有数据
    this.search();
    //页面创建时获取所有统计数据
    this.totalData();
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
};
</script>

<style scoped lang="less">
* {
  font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
    Roboto-Regular, SourceHanSansCN-Regular;
}
// .cyglOutSide{
//   overflow: hidden;
// }
.approve-edit-text {
  padding: 22px 0 10px 53px;
  label {
    position: relative;
    bottom: -22px;
    left: -52px;
  }
  textarea {
    margin-left: 10px;
    resize: none;
    width: 800px;
    height: 111px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    outline: none;
    &:hover {
      border-color: #dddddd;
    }
    &:focus {
      border-color: #0091ff;
    }
  }
}
.cygl {
  background-color: #ffffff;
  height: calc(100vh - 112px);
  overflow: hidden;
  border-radius: 4px;
  .header {
    padding: 10px;
    height: 56px;
    display: flex;
    line-height: 36px;
  }
}

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