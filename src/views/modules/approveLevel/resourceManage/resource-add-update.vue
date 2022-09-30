<template>
  <div class="resourceAddUpdate">
    <el-dialog
      :visible.sync="showResource"
      width="80%"
      :title="dialogTitle"
      :close-on-click-modal="false"
      custom-class="resource_board"
    >
      <div v-if="tabType == 'first'">
        <div class="left-content-container">
          <div>
            <el-form
              label-position="right"
              label-width="120px"
              :model="dataForm"
              :rules="dataRule"
              ref="dataForm"
            >
              <el-form-item label="车辆照片">
                <!-- <el-upload
                  class="picture-card"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-preview="handlePictureCardPreview"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button
                    size="small"
                    :disabled="type == 'show' ? 'disabled' : false"
                    >上传</el-button
                  >
                </el-upload>
                <span v-for="(item, index) in dataForm.imgList" :key="item.id">
                  <img
                    :src="backgroundURL + item.url"
                    :key="index"
                    style="
                      height: 90px;
                      width: 120px;
                      min-width: 99px;
                      margin-right: 8px;
                    "
                  />
                  <i
                    class="el-icon-close"
                    style="
                      position: relative;
                      bottom: 30px;
                      right: 30px;
                      cursor: pointer;
                    "
                    @click="delImg(index)"
                  ></i>
                </span> -->
                <sv-upload-img v-model="dataForm.imgList" :isView="isShow" />
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="车牌号" prop="carNum">
                    <el-input
                      v-model="dataForm.carNum"
                      :readonly="type == 'show'"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="车辆品牌及型号">
                    <el-input
                      v-model="dataForm.carType"
                      :readonly="type == 'show'"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="车名">
                    <el-input
                      v-model="dataForm.name"
                      :readonly="type == 'show'"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="能源类型">
                    <el-select
                      clearable
                      v-model="dataForm.carSource"
                      style="width: 266px"
                      :disabled="type == 'show' ? 'disabled' : false"
                    >
                      <el-option
                        v-for="item in nengyuanleixing"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="生产日期">
                    <el-date-picker
                      v-model="dataForm.carProduceTime"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期"
                      style="width: 266px"
                      :disabled="type == 'show' ? 'disabled' : false"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用状态">
                    <el-select
                      clearable
                      v-model="dataForm.carStatus"
                      style="width: 266px"
                      :disabled="type == 'show' ? 'disabled' : false"
                    >
                      <el-option
                        v-for="item in shiyongzhuangtai"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="责任人" prop="responsible">
                    <el-input
                      v-model="dataForm.responsible"
                      :readonly="type == 'show'"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="phone">
                    <el-input
                      v-model="dataForm.phone"
                      :readonly="type == 'show'"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item
                    v-if="htmlType != 'account'"
                    label="报废原因"
                    prop="remark"
                  >
                    <el-input v-model="dataForm.remark" readonly></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="附件">
                <sv-upload v-model="dataForm.documentList" :isView="isShow" />
              </el-form-item>

              <!-- <input type="file" /> -->
            </el-form>
            <!-- <tikuShowOrUpdate :questionList="tikuData"></tikuShowOrUpdate> -->
            <!-- 左边表单 -->
            <div class="report-table">
              <el-row :gutter="20">
                <div class="info">
                  <template>
                    <div
                      v-for="(item, index) in tikuData"
                      :key="`question${item.id}`"
                      style="padding: 20px 5px; margin-bottom: 20px"
                    >
                      <el-col :span="3">
                        <span style="margin: 5px; color: #333; float: right">
                          <!-- <span v-if="item.isAnswer=='1'" style="color:red;margin-right:5px;">*</span> -->
                          {{ item.title }}
                        </span>
                      </el-col>
                      <el-col :span="16">
                        <template v-if="item.topicName === '单选题'">
                          <el-radio-group v-model="item.answer">
                            <!-- item.answer?parseInt(item.answer):[] -->
                            <span
                              v-for="v in item.approveSelectList"
                              style="margin-right: 30px"
                              :key="`danxuan${v.id}`"
                            >
                              <el-radio :label="v.id">
                                {{ v.content }}
                                <input
                                  v-if="
                                    v.ifInput === '1' && item.answer == v.id
                                  "
                                  type="text"
                                  class="content"
                                  v-model="item.remark"
                                />
                              </el-radio>
                            </span>
                          </el-radio-group>
                        </template>
                        <template v-if="item.topicName === '混答+多选'">
                          <el-checkbox-group v-model="item.answer">
                            <!-- item.answer?item.answer.substring(0,item.answer.indexOf('#')).split(',').map(item => {  return +item;  }):[] -->
                            <span
                              v-for="v in item.approveSelectList"
                              style="margin-right: 20px"
                              :key="`hundaduoxuan${v.id}`"
                            >
                              <el-checkbox
                                :label="v.id"
                                :key="`hundaduoxuan2${v.id}`"
                              >
                                {{ v.content }}
                                <!-- item.answer?item.answer.substring(item.answer.indexOf('#')+2,item.answer.length).split(','):'' -->
                                <input
                                  v-if="
                                    v.ifInput === '1' && item.answer == v.id
                                  "
                                  v-model="item.remark"
                                  type="text"
                                  class="content"
                                />
                              </el-checkbox>
                            </span>
                          </el-checkbox-group>
                        </template>
                        <template v-if="item.topicName === '多选题'">
                          <el-checkbox-group v-model="item.answer">
                            <!-- item.answer?item.answer.substring(0,item.answer.indexOf('#')).split(',').map(item => {  return +item;  }):[] -->
                            <span
                              v-for="v in item.approveSelectList"
                              style="margin-right: 20px"
                              :key="`duoxuan${v.id}`"
                            >
                              <el-checkbox
                                :label="v.id"
                                :key="`duoxuan2${v.id}`"
                              >
                                {{ v.content }}
                                <!-- item.answer?item.answer.substring(item.answer.indexOf('#')+2,item.answer.length).split(','):'' -->
                                <!-- <input
                                v-if="v.ifInput==='1' && item.answer==v.id"
                                v-model="item.remark"
                                type="text"
                                class="content"
                                />-->
                              </el-checkbox>
                            </span>
                          </el-checkbox-group>
                        </template>
                        <template v-if="item.topicName === '混答+单选'">
                          <el-radio-group v-model="item.answer">
                            <!-- item.answer?parseInt(item.answer.split('##')[0]):[] -->
                            <span
                              v-for="v in item.approveSelectList"
                              :key="`hundadanxuan${v.id}`"
                              style="margin-right: 30px"
                            >
                              <el-radio :label="v.id">
                                {{ v.content }}
                                <!-- item.answer?item.answer.split('##')[1]:'' -->
                                <input
                                  v-if="
                                    v.ifInput === '1' && item.answer == v.id
                                  "
                                  v-model="item.remark"
                                  type="text"
                                  class="content"
                                />
                              </el-radio>
                            </span>
                          </el-radio-group>
                        </template>
                        <template v-if="item.topicName === '简答-输入'">
                          <input
                            type="text"
                            class="content"
                            v-model="item.answer"
                          />
                        </template>
                        <template v-if="item.topicName === '简答-文本'">
                          <el-input
                            type="textarea"
                            style="width: 450px"
                            resize="none"
                            v-model="item.answer"
                          ></el-input>
                        </template>
                        <!-- <template v-if="item.topicName==='图片'">
                        <el-upload
                          action="https://jsonplaceholder.typicode.com/posts/"
                          list-type="picture-card"
                          :on-remove="function(res){return handleRemove(res,index)}"
                          :before-upload="beforeUpload"
                          :http-request="function(file){return beforeAvatarUpload(file,index)}"
                          :limit="2"
                          :file-list="item.answer"
                          :on-exceed="overFile"
                          multiple
                        >
                          <i class="el-icon-plus" style="line-height:5"></i>
                        </el-upload>
                        </template>-->
                      </el-col>
                    </div>
                  </template>
                  <div></div>
                </div>
              </el-row>
            </div>
          </div>
          <!-- 评论审核框 -->
          <approveEdit
            v-if="type == 'shenhe' && showshenhe"
            ref="approveEdit"
            :tikutype="tikuType"
            @refreshTable="refresh"
            @cancel="showResource = false"
            :nextPlatformId="nextPlatformId"
            :id="dataForm.id"
            :processid="processId"
            :accounttype="accountType"
          ></approveEdit>
        </div>
        <div class="right-content-container">
          <!-- 右边流程展示 -->
          <showProcess
            v-if="htmlType != 'account' || type != 'show'"
            ref="showProcess"
            :tabTypeName="tabType"
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
            @queryHistoryRecord="queryHistoryRecord"
          ></showProcess>
        </div>
      </div>

      <div
        v-if="tabType == 'second'"
        class="el-dialog-div"
        style="overflow: auto"
      >
        <el-col :span="16">
          <el-form
            label-position="right"
            label-width="120px"
            :model="dataForm2"
            ref="dataForm2"
            :rules="dataRule2"
          >
            <el-form-item label="岗亭照片">
              <!-- <el-upload
                class="picture-card"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-preview="handlePictureCardPreview2"
                :before-upload="beforeAvatarUpload2"
              >
                <el-button
                  size="small"
                  :disabled="type == 'show' ? 'disabled' : false"
                  >上传</el-button
                >
              </el-upload>
              <img
                v-for="(item, index) in dataForm2.boxImg"
                :src="backgroundURL + item.url"
                :key="index"
                style="
                  height: 90px;
                  width: 120px;
                  min-width: 99px;
                  margin-right: 8px;
                "
              /> -->
              <sv-upload-img v-model="dataForm2.boxImg" :isView="isShow" />
            </el-form-item>
            <el-row>
              <el-col :span="9">
                <el-form-item label="岗亭名称" prop="name">
                  <el-input
                    v-model="dataForm2.name"
                    :readonly="type == 'show'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="编号" prop="buxNum">
                  <el-input
                    v-model="dataForm2.boxNum"
                    :readonly="type == 'show'"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="9">
                <el-form-item label="负责人" prop="responsible">
                  <el-input
                    v-model="dataForm2.responsible"
                    :readonly="type == 'show'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="联系电话" prop="phone">
                  <el-input
                    v-model="dataForm2.phone"
                    :readonly="type == 'show'"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="9">
                <el-form-item label="地址">
                  <el-input
                    v-model="dataForm2.place"
                    :readonly="type == 'show'"
                  ></el-input>
                  <img
                    :src="require('@/assets/img/weizhi.svg')"
                    style="
                      width: 25px;
                      height: 25px;
                      position: relative;
                      bottom: 37px;
                      left: 80%;
                      cursor: pointer;
                    "
                    @click="mapVisible = true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item v-if="htmlType != 'account'" label="报废原因">
                  <el-input v-model="dataForm2.remark" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="13">
                <el-form-item label="执勤人员">
                  <div>
                    <el-button
                      @click="addPoliceMan"
                      :disabled="type == 'show' ? 'disabled' : false"
                      >+添加人员</el-button
                    >
                  </div>
                  <div class="renyuanParent" style="width: 27vw">
                    <div
                      class="renyuan"
                      v-for="(item, index) in dataForm2.policeMan"
                      :key="index"
                    >
                      <div class="renyuanxingming">姓名</div>
                      <el-input
                        class="renyuaninput"
                        v-model="item.name"
                        :readonly="type == 'show'"
                      ></el-input>
                      <div class="renyuanshouji">手机</div>
                      <el-input
                        class="renyuaninput"
                        v-model="item.phone"
                        :readonly="type == 'show'"
                      ></el-input>
                      <img
                        style="
                          width: 35px;
                          height: 35px;
                          margin-top: 17px;
                          margin-left: 5px;
                          cursor: pointer;
                        "
                        :src="require('@/assets/img/zhiqinrenyuanchahao.svg')"
                        @click="removeMember(index)"
                        v-show="type != 'show'"
                      />
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- <tikuShowOrUpdate :questionList="tikuData"></tikuShowOrUpdate> -->
          <!-- 左边表单 -->
          <div class="report-table">
            <el-row :gutter="15">
              <div class="info">
                <template>
                  <div
                    v-for="(item, index) in tikuData"
                    :key="`question${item.id}`"
                    style="padding: 20px 5px; margin-bottom: 20px"
                  >
                    <el-col :span="3">
                      <span style="margin: 5px; color: #333; float: right">
                        <!-- <span v-if="item.isAnswer=='1'" style="color:red;margin-right:5px;">*</span> -->
                        {{ item.title }}
                      </span>
                    </el-col>
                    <el-col :span="16">
                      <template v-if="item.topicName === '单选题'">
                        <el-radio-group v-model="item.answer">
                          <!-- item.answer?parseInt(item.answer):[] -->
                          <span
                            v-for="v in item.approveSelectList"
                            style="margin-right: 30px"
                            :key="`danxuan${v.id}`"
                          >
                            <el-radio :label="v.id">
                              {{ v.content }}
                              <input
                                v-if="v.ifInput === '1' && item.answer == v.id"
                                type="text"
                                class="content"
                                v-model="item.remark"
                              />
                            </el-radio>
                          </span>
                        </el-radio-group>
                      </template>
                      <template v-if="item.topicName === '混答+多选'">
                        <el-checkbox-group v-model="item.answer">
                          <!-- item.answer?item.answer.substring(0,item.answer.indexOf('#')).split(',').map(item => {  return +item;  }):[] -->
                          <span
                            v-for="v in item.approveSelectList"
                            style="margin-right: 20px"
                            :key="`hundaduoxuan${v.id}`"
                          >
                            <el-checkbox
                              :label="v.id"
                              :key="`hundaduoxuan2${v.id}`"
                            >
                              {{ v.content }}
                              <!-- item.answer?item.answer.substring(item.answer.indexOf('#')+2,item.answer.length).split(','):'' -->
                              <input
                                v-if="v.ifInput === '1' && item.answer == v.id"
                                v-model="item.remark"
                                type="text"
                                class="content"
                              />
                            </el-checkbox>
                          </span>
                        </el-checkbox-group>
                      </template>
                      <template v-if="item.topicName === '多选题'">
                        <el-checkbox-group v-model="item.answer">
                          <!-- item.answer?item.answer.substring(0,item.answer.indexOf('#')).split(',').map(item => {  return +item;  }):[] -->
                          <span
                            v-for="v in item.approveSelectList"
                            style="margin-right: 20px"
                            :key="`duoxuan${v.id}`"
                          >
                            <el-checkbox :label="v.id" :key="`duoxuan2${v.id}`">
                              {{ v.content }}
                              <!-- item.answer?item.answer.substring(item.answer.indexOf('#')+2,item.answer.length).split(','):'' -->
                              <!-- <input
                                  v-if="v.ifInput==='1' && item.answer==v.id"
                                  v-model="item.remark"
                                  type="text"
                                  class="content"
                              />-->
                            </el-checkbox>
                          </span>
                        </el-checkbox-group>
                      </template>
                      <template v-if="item.topicName === '混答+单选'">
                        <el-radio-group v-model="item.answer">
                          <!-- item.answer?parseInt(item.answer.split('##')[0]):[] -->
                          <span
                            v-for="v in item.approveSelectList"
                            :key="`hundadanxuan${v.id}`"
                            style="margin-right: 30px"
                          >
                            <el-radio :label="v.id">
                              {{ v.content }}
                              <!-- item.answer?item.answer.split('##')[1]:'' -->
                              <input
                                v-if="v.ifInput === '1' && item.answer == v.id"
                                v-model="item.remark"
                                type="text"
                                class="content"
                              />
                            </el-radio>
                          </span>
                        </el-radio-group>
                      </template>
                      <template v-if="item.topicName === '简答-输入'">
                        <input
                          type="text"
                          class="content"
                          v-model="item.answer"
                        />
                      </template>
                      <template v-if="item.topicName === '简答-文本'">
                        <el-input
                          type="textarea"
                          style="width: 450px"
                          resize="none"
                          v-model="item.answer"
                        ></el-input>
                      </template>
                      <!-- <template v-if="item.topicName==='图片'">
                          <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            :on-remove="function(res){return handleRemove(res,index)}"
                            :before-upload="beforeUpload"
                            :http-request="function(file){return beforeAvatarUpload(file,index)}"
                            :limit="2"
                            :file-list="item.answer"
                            :on-exceed="overFile"
                            multiple
                          >
                            <i class="el-icon-plus" style="line-height:5"></i>
                          </el-upload>
                      </template>-->
                    </el-col>
                  </div>
                </template>
                <div></div>
              </div>
            </el-row>
          </div>
          <!-- 评论审核框 -->
          <approveEdit
            v-if="type == 'shenhe' && showshenhe"
            ref="approveEdit"
            :nextPlatformId="nextPlatformId"
            :id="dataForm2.id"
            :processid="processId"
            :tikutype="tikuType"
            :accounttype="accountType"
            @refreshTable="refresh"
            @cancel="showResource = false"
          ></approveEdit>
        </el-col>
        <el-col :span="8">
          <!-- 右边流程展示 -->
          <showProcess
            ref="showProcess"
            v-if="htmlType != 'account' || type != 'show'"
            :tabTypeName="tabType"
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
            @queryHistoryRecord="queryHistoryRecord"
          ></showProcess>
        </el-col>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
        v-if="type != 'show' && type != 'shenhe'"
      >
        <el-button @click="showResource = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>

    <!--地图弹窗-->
    <el-dialog title="地图" :visible.sync="mapVisible" append-to-body>
      <div style="height: 580px">
        <div :style="{ width: '100%', height: '500px', float: 'right' }">
          <el-amap-search-box
            class="search-box"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
          ></el-amap-search-box>
          <el-amap
            vid="amapDemo"
            :center="center"
            :zoom="zoom"
            class="amap-demo"
            :events="events"
            :plugin="plugin"
          >
            <el-amap-marker
              :position="position"
              :events="events"
            ></el-amap-marker>
            <!-- <el-amap-marker v-for="{position,index} in markers" :position="position" :key="index"></el-amap-marker> -->
          </el-amap>
          <div class="toolbar">
            position: [{{ lng }}, {{ lat }}] address: {{ address }}
            <div style="text-align: center">
              <el-button @click="mapVisible = false">取消</el-button>
              <el-button type="primary" @click="LongitudeandLatitude()"
                >确定</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 查看附件 -->
    <el-dialog
      title="查看附件"
      :visible.sync="dialogDocumentVisible"
      :destroy-on-close="true"
      style="text-align: center"
    >
      <img v-if="getDocumentType" :src="documentUrl" />
      <preplan-document v-else :documentUrl="documentUrl"></preplan-document>
    </el-dialog>

    <historyRecord ref="historyRecord"></historyRecord>
  </div>
</template>

<script>
import historyRecord from "@/views/modules/approveLevel/resourceManage/historyRecord.vue";
import showProcess from "./showProcess";
// import tikuShowOrUpdate from "./tikuShowOrUpdate";
import $ from "jquery";
import approveEdit from "./approveEdit";
export default {
  props: ["tabType", "tkId"],
  components: {
    showProcess,
    approveEdit,
    historyRecord,
    // tikuShowOrUpdate,
  },
  data() {
    let self = this;
    return {
      isShow: false,
      accountType: "",
      clickId: 0,
      //题库数据
      tikuData: [],
      manageId: "",
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      //标签类型
      htmlType: "",
      tikuType: "",
      tab: "",
      //标题名称
      dialogTitle: "",
      //车辆详情
      dataForm: {
        id: "",
        name: "",
        carNum: "",
        carType: "",
        carSource: "",
        carProduceTime: "",
        carStatus: "",
        responsible: "",
        phone: "",
        imgList: [],
        documentList: [],
        place: "",
        remark: "",
        //上传的照片路径
        backgroundImage: "",
        //上传附件路径
        documentImage: "",
      },
      nextPlatformId: "",
      nextPlatformName: "",
      //平台选项
      platformOptions: [
        {
          label: "",
          value: "",
        },
      ],
      image: {
        name: "",
        url: "",
      },
      imageList: [],
      document: {
        name: "",
        url: "",
      },
      tip: "",
      documentUrl: "",
      fileList: [],
      // 附件弹出框
      dialogDocumentVisible: false,
      //岗亭详情
      dataForm2: {
        id: "",
        name: "",
        boxImg: [],
        boxNum: "",
        responsible: "",
        phone: "",
        place: "",
        longitude: "",
        latitude: "",
        remark: "",
        policeMan: [
          {
            name: "",
            phone: "",
          },
        ],
        status: "",
        backgroundImage: "",
      },
      processData1: {
        place: "",
        time: "",
        name: "",
        result: "",
        feedback: "",
      },
      processData2: {
        place: "",
        time: "",
        name: "",
        result: "",
        feedback: "",
      },
      //新增或修改
      type: "",
      //弹出框显示
      showResource: false,
      //能源类型
      nengyuanleixing: [],
      //使用状态
      shiyongzhuangtai: [],
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
      // 报审平台数据
      platformData: [],
      //报审单位
      baoshenData: {
        id: "",
        name: "",
        contactor: { id: "", name: "", role: "", phone: "" },
      },
      //流程Id
      processId: "",
      // baoshenUnit: "",
      // baoshenId: "",
      //流程单位
      unitList: [],
      //类型
      processType: [],
      processList: [],
      showshenhe: false,
      dataRule: {
        carNum: [
          {
            required: true,
            message: "名牌号不能为空",
            trigger: "blur",
          },
        ],
        responsible: [
          {
            required: true,
            message: "责任人不能为空",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "联系电话不能为空",
            trigger: "blur",
          },
        ],
      },

      dataRule2: {
        name: [
          {
            required: true,
            message: "岗亭名称不能为空",
            trigger: "blur",
          },
        ],
        boxNum: [
          {
            required: true,
            message: "岗亭号不能为空",
            trigger: "blur",
          },
        ],
        responsible: [
          {
            required: true,
            message: "责任人不能为空",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "联系电话不能为空",
            trigger: "blur",
          },
        ],
      },
      // 高德地图开始
      markers: [
        [113.3245904, 23.2066805],
        [113.323623, 23.106341],
        [113.325399, 23.106156],
      ],
      searchOption: {
        city: "广州",
        citylimit: false,
      },
      plugin: [
        {
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                // console.log(result)
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  // self.lng=self.$cookie.get("longitude")
                  // self.lat=self.$cookie.get("latitude")
                  self.center = [self.lng, self.lat];
                  self.mapCenter = [self.lng, self.lat];
                  self.position = [self.lng, self.lat];
                  var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all",
                  });
                  geocoder.getAddress([self.lng, self.lat], function (
                    status,
                    result
                  ) {
                    if (status === "complete" && result.info === "OK") {
                      if (result && result.regeocode) {
                        console.log(result.regeocode);
                        self.address = result.regeocode.formattedAddress;

                        // self.$nextTick()
                      }
                    }
                  });
                  self.$nextTick();
                }
              });
            },
          },
        },
      ],
      lng: 0,
      lat: 0,
      count: 1,
      slotStyle: {
        padding: "2px 8px",
        background: "#eee",
        color: "#333",
        border: "1px solid #aaa",
      },
      zoom: 12,
      center: [113.3245904, 23.1066805],
      address: "",
      loaded: false,
      // 标记点的位置
      mapCenter: [113.3245904, 23.1066805],
      position: [113.3245904, 23.1066805],
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.position = [lng, lat];
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all",
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                // console.log(self)

                // self.$nextTick()
              }
            }
          });
        },
      },
      // 地图弹窗
      mapVisible: false,
      //高德地图结束

      //流程图数据
    };
  },
  watch: {
    deep: true,
    immediate: true,
  },
  mounted() {
    this.getCarSource();
    this.getCarStatus();
  },
  computed: {
    getDocumentType() {
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
        ].indexOf(
          this.documentUrl
            .substr(this.documentUrl.lastIndexOf(".") + 1)
            .toLowerCase()
        ) !== -1
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    queryHistoryRecord() {
      console.log("hi", this.clickId, this.tikuType);
      this.$refs.historyRecord.init(this.clickId, this.tikuType);
      this.$refs.historyRecord.dialogVisible = true;
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
            console.log("1111111", this.processList);
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
      let manageId;
      if (this.tabType == "first") {
        manageId = "-100";
      }
      if (this.tabType == "second") {
        manageId = "-200";
      }
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
              console.log("台账记录1111", manageId, this.unitList);
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
      console.log("cscscsId", this.nowPlatForm, id);
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
            let index = this.processType.findIndex((item) => item == "审核中");
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
              this.processList[i].chargeMan.id = data.platform.contactor.id;
              this.processList[i].chargeMan.name = data.platform.contactor.name;
              this.processList[i].chargeMan.position =
                data.platform.contactor.position;
              this.processList[i].chargeMan.mobile1 =
                data.platform.contactor.mobile1;
            }
          }
        }
      });
    },
    init(id, type, manageType) {
      // console.log("审核managetype", manageType);
      console.log("id", id, type, this.tabType);
      this.clearDataForm();
      this.clickId = id;
      this.htmlType = manageType;
      this.type = type;

      this.nextPlatformName = "";
      const user = this.$cookie.get("userId");
      // this.createUser = user.substring(2, user.length);
      this.nowPlatForm = this.$cookie.get("platformId");
      if (this.tabType == "first") {
        this.dataForm.id = id;
      }
      if (this.tabType == "second") {
        this.dataForm2.id = id;
      }

      this.showshenhe = false;
      //判断流程图
      this.processType = ["填报"];
      var processTime = 0;
      // this.createUser = user.substring(2, user.length);
      // this.createUser = 2081;
      // this.nowPlatForm = this.$cookie.get("platformId");
      // if(this.type)
      // this.showResource = true;
      // console.log("标签类型", this.tabType, this.type);
      // this.$nextTick(() => {
      //   this.$refs.showProcess.init(type);
      // });
      switch (type) {
        case "add":
          this.isShow = false;
          if (this.tabType == "first") {
            this.dialogTitle = "新增巡查车辆";
            this.getUnit();
            this.getPlatformById(this.nowPlatForm);
            this.$http({
              url: this.$http.adornUrl(`/approve/approveCarEntity/getTiku`),
              method: "get",
              param: this.$http.adornParams(),
            }).then(({ data }) => {
              // data 是获取到的所有数据
              if (data && data.code === 0) {
                this.tikuData = data.approveTikuEntity.approveQuestionList;
                this.tikuData.map((v) => {
                  if (
                    v.topicName === "单选题" ||
                    v.topicName === "混答+单选" ||
                    v.topicName === "混答+多选" ||
                    v.topicName === "多选题" ||
                    v.topicName === "图片"
                  ) {
                    v.answer = [];
                    v.remark = "";
                  } else if (
                    v.topicName === "简答-文本" ||
                    v.topicName === "简答-输入"
                  ) {
                    v.answer = "";
                    v.remark = "";
                  }
                });
                this.showResource = true;
                this.$nextTick(() => {
                  this.$refs.showProcess.clear();
                });
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
          }
          if (this.tabType == "second") {
            this.dialogTitle = "新增群防岗亭";
            console.log("类型", this.type, this.baoshenData);
            this.getUnit();
            this.getPlatformById(this.nowPlatForm);
            this.$http({
              url: this.$http.adornUrl(`/approve/approveBoxEntity/getTiku`),
              method: "get",
              param: this.$http.adornParams(),
            }).then(({ data }) => {
              // data 是获取到的所有数据
              if (data && data.code === 0) {
                this.tikuData = data.approveTikuEntity.approveQuestionList;
                this.tikuData.map((v) => {
                  if (
                    v.topicName === "单选题" ||
                    v.topicName === "混答+单选" ||
                    v.topicName === "混答+多选" ||
                    v.topicName === "多选题" ||
                    v.topicName === "图片"
                  ) {
                    v.answer = [];
                    v.remark = "";
                  } else if (
                    v.topicName === "简答-文本" ||
                    v.topicName === "简答-输入"
                  ) {
                    v.answer = "";
                    v.remark = "";
                  }
                });
                this.showResource = true;
                this.$nextTick(() => {
                  this.$refs.showProcess.clear();
                });
              } else {
                this.$message({
                  message: `${data.msg}`,
                  type: "error",
                });
              }
            });
          }
          break;

        case "show":
          this.isShow = true;
          if (this.tabType == "first") {
            this.dialogTitle = "查看巡查任务";
            // this.type = "shenhe";
            this.getDataDetail();
          }

          if (this.tabType == "second") {
            this.dialogTitle = "查看群防岗亭";
            this.getDataDetail();
          }
          break;

        case "shenhe":
          this.getDataDetail();
          break;
        case "baoshen":
          this.getDataDetail();
          break;
        case "update":
          this.isShow = false;
          if (this.tabType == "first") {
            this.dialogTitle = "修改巡查车辆";
            this.getDataDetail();
          }

          if (this.tabType == "second") {
            this.dialogTitle = "修改群防岗亭";
            this.getDataDetail();
          }
          break;
        default:
      }
    },
    //获取数据详情
    getDataDetail() {
      let url;
      let id;
      if (this.tabType == "first") {
        url = "/approve/approveCarEntity/info";
        if (this.htmlType == "account") {
          url = "/approve/approveCarAccount/info";
        }
        id = this.dataForm.id;
      } else {
        url = "/approve/approveBoxEntity/info";
        id = this.dataForm2.id;
        if (this.htmlType == "account") {
          url = "/approve/approveBoxAccount/info";
        }
      }

      this.$http({
        url: this.$http.adornUrl(`${url}/${id}`),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tikuType = data.data.approveManageEntity.tikuType;
          if (this.type == "baoshen") {
            this.type = "add";
            this.getPlatformById(this.nowPlatForm);
          }
          if (this.tabType == "first") {
            this.dataForm.name = data.data.name;
            this.dataForm.carNum = data.data.carNum;
            this.dataForm.carType = data.data.carType;
            this.dataForm.carSource = data.data.carSource;
            this.dataForm.carProduceTime = data.data.carProduceTime;
            this.dataForm.carStatus = data.data.carStatus;
            this.dataForm.responsible = data.data.responsible;
            this.dataForm.phone = data.data.phone;
            this.dataForm.imgList = data.data.imgList;
            this.dataForm.documentList = data.data.documentList;
            this.dataForm.place = data.data.place;
            this.dataForm.longitude = data.data.longitude;
            this.dataForm.latitude = data.data.latitude;
            if (this.htmlType != "account") {
              this.dataForm.remark = data.data.remark;
            }

            this.imageList = this.dataForm.imgList;
            this.manageId = data.data.managerId;
            if (this.htmlType == "account" && this.type == "add") {
              this.manageId = -100;
              console.log("1111111111111111111111111111111111", this.manageId);
            }
          }
          if (this.tabType == "second") {
            this.dataForm2.name = data.data.name;
            this.dataForm2.boxNum = data.data.boxNum;
            this.dataForm2.responsible = data.data.responsible;
            this.dataForm2.phone = data.data.phone;
            this.dataForm2.place = data.data.place;
            this.dataForm2.longitude = data.data.longitude;
            this.dataForm2.latitude = data.data.latitude;
            this.dataForm2.policeMan = data.data.policeManList;
            this.dataForm2.status = data.data.status;
            this.dataForm2.boxImg = data.data.imgList;
            if (this.htmlType != "account") {
              this.dataForm2.remark = data.data.remark;
            }
            this.manageId = data.data.managerId;
            if (this.htmlType == "account" && this.type == "add") {
              this.manageId = -200;
            }
          }
          // if (data.data.accountType == 3) {
          //   this.accountType = 1;
          // }
          // if (data.data.accountType == 4) {
          //   this.accountType = 2;
          // }
          this.accountType = data.data.accountType;
          this.tikuData =
            data.data.approveManageEntity.approveTikuEntity.approveQuestionList;
          this.tikuData.map((v) => {
            if (v.topicName === "单选题") {
              v.answer = v.answer ? parseInt(v.answer) : [];
            } else if (v.topicName === "混答+单选") {
              //  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',v.answer.substring(v.answer.indexOf('#'),v.answer.length))
              v.remark = v.answer ? v.answer.split("##")[1] : "";
              v.answer = v.answer ? parseInt(v.answer.split("##")[0]) : [];
            } else if (v.topicName === "混答+多选") {
              let answerIndex = v.answer.indexOf("#");
              if (answerIndex != -1) {
                v.remark = v.answer
                  ? v.answer
                      .substring(v.answer.indexOf("#") + 2, v.answer.length)
                      .split(",")
                  : "";
                v.answer = v.answer
                  ? v.answer
                      .substring(0, v.answer.indexOf("#"))
                      .split(",")
                      .map((item) => {
                        return +item;
                      })
                  : [];
              } else {
                v.remark = "";
                v.answer = v.answer
                  ? v.answer
                      .substring(0, v.answer.length)
                      .split(",")
                      .map((item) => {
                        return +item;
                      })
                  : [];
              }
            } else if (v.topicName === "图片") {
              if (v.answer) {
                v.answer = JSON.parse(v.answer).map((v) => {
                  return {
                    name: v.name,
                    url: v.oldPath,
                    oldPath: v.oldPath,
                    path: v.path,
                  };
                });
                console.log("图片vanswer", v.answer);
              } else {
                v.answer = [];
              }
            } else if (v.topicName === "多选题") {
              v.answer = v.answer
                ? v.answer
                    .substring(0, v.answer.length)
                    .split(",")
                    .map((item) => {
                      return +item;
                    })
                : [];
            }
          });

          console.log("题库数据", this.tikuData);
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

          if (this.htmlType == "account" && this.type == "add") {
            this.getUnit();
          }

          console.log("组件processlist", this.processList, this.processType);
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
          // this.baoshenData.name =
          //   "请选择" + data.data.approveManageEntity.unitList[1].unitIdString;
          this.baoshenData.name = "请选择" + this.processList[1].depName;
          // console.log("报审单位", this.baoshenData.name, this.processList);

          //未填报
          var index = this.processList.findIndex(
            (item) => item.approveApproveEntity.platformIdString == ""
          );
          // console.log("没错", index);
          if (
            //有未填报且没被驳回
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
                    //todo
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
            this.baoshenData.id = this.unitList[0].depId;
          }
          this.getPlatform();

          // console.log("最终结果", this.processList);
          // this.getUnit();
          let lastIndex = this.processType.findIndex(
            (item) => item == "审核中"
          );
          console.log("已审核1111", lastIndex, this.processList);

          // console.log(
          //   "baoshenmingzi",
          //   this.nextPlatformId,
          //   this.nextPlatformName,
          //   this.processList
          // );
          //todo
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
          let z = this.processType.findIndex((item) => item == "审核中");
          if (z > 0) {
            this.nextPlatformId = this.processList[
              z - 1
            ].approveApproveEntity.nextPlatformId;
          }

          if (lastIndex == this.processList.length - 1) {
            this.nextPlatformId = "0";
          }
          console.log("下个平台id", this.nextPlatformId);
          this.$emit("getNextPlatformId", this.nextPlatformId);

          this.showResource = true;
          this.$nextTick(() => {
            this.$refs.showProcess.clear();
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    refresh() {
      console.log("审核后刷新", this.htmlType);
      if (this.htmlType == 4) {
        console.log("审核");
        this.$emit("refreshDataList", "1");
      }
      // if (this.htmltype == 5) {
      else {
        console.log("审核22222");
        this.$emit("refreshDataList", "2");
      }
    },
    submit() {
      let sure = true;
      for (let i in this.tikuData) {
        let v = this.tikuData[i];
        if (v.answer.length === 0 && v.isAnswer == "1") {
          this.$message.warning(`请选择${v.title}`);
          sure = false;
          return;
        }
      }

      if (sure) {
        this.tikuData.map((v) => {
          if (v.topicName == "图片" && v.answer) {
            v.answer.map((v) => {
              if (v.url) {
                this.$delete(v, "url");
                this.$delete(v, "uuid");
                this.$delete(v, "status");
              }
              console.log("url: ", v);
            });
          }
        });
      }

      let index = this.processType.findIndex((item) => item == "已审核");
      let submitManageId;
      let url;
      if (this.tabType == "first") {
        this.$refs["dataForm"].validate((valid) => {
          console.log("提交申请", this.nextPlatformId, index, this.unitList);
          if (valid) {
            if (this.tabType == "first") {
              url = `/approve/approveCarAccount/save`;
              if (this.nextPlatformId == "" && index < this.unitList.length) {
                this.$message.error("请选择下个平台名字");
                return;
              }
              if (this.type == "update") {
                submitManageId = this.manageId;
                url = `/approve/approveCarEntity/update`;
              } else {
                submitManageId = -100;
              }
              if (this.htmlType == "account") {
                url = `/approve/approveCarAccount/updateAccountType`;
              }
              this.$http({
                url: this.$http.adornUrl(url),
                method: "post",
                data: this.$http.adornData({
                  id: this.dataForm.id || undefined,
                  accountType: "1",
                  name: this.dataForm.name,
                  imgList: this.dataForm.imgList,
                  carNum: this.dataForm.carNum,
                  carType: this.dataForm.carType,
                  carSource: this.dataForm.carSource,
                  carProduceTimeString: this.dataForm.carProduceTime,
                  carStatus: this.dataForm.carStatus,
                  responsible: this.dataForm.responsible,
                  phone: this.dataForm.phone,
                  documentList: this.dataForm.documentList,
                  nextPlatformId: this.nextPlatformId,
                  submitType: this.type,
                  managerId: submitManageId,
                  answerList: this.tikuData.map((v) => {
                    return {
                      questionId: v.id,
                      answer: v.answer
                        ? typeof v.answer == "string"
                          ? v.answer + (v.remark ? "##" + v.remark : "")
                          : typeof v.answer == "object" && v.topicName != "图片"
                          ? v.answer.toString()
                          : JSON.stringify(v.answer)
                        : "",
                    };
                  }),
                }),
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: "操作成功",
                    type: "success",
                    duration: 1500,
                  });
                  this.showResource = false;
                  if (this.tabType == "first") {
                    this.$emit("refreshDataList", "1");
                  }
                  if (this.tabType == "second") {
                    this.$emit("refreshDataList", "2");
                  }
                } else {
                  this.$message.error(data.msg);
                }
              });
            }
          }
        });
      }

      if (this.tabType == "second") {
        this.$refs["dataForm2"].validate((valid) => {
          if (valid) {
            if (this.tabType == "second") {
              url = `/approve/approveBoxAccount/save`;
              if (this.nextPlatformId == "" && index < this.unitList.length) {
                this.$message.error("请选择下个平台名字");
                return;
              }
              if (this.type == "update") {
                submitManageId = this.manageId;
                url = `/approve/approveBoxEntity/update`;
              } else {
                submitManageId = -200;
              }
              if (this.htmlType == "account") {
                url = `/approve/approveBoxAccount/updateAccountType`;
              }
              this.$http({
                url: this.$http.adornUrl(url),
                method: "post",
                data: this.$http.adornData({
                  id: this.dataForm2.id || undefined,
                  accountType: "1",
                  name: this.dataForm2.name,
                  imgList: this.dataForm2.boxImg,
                  policeManList: this.dataForm2.policeMan,
                  boxNum: this.dataForm2.boxNum,
                  responsible: this.dataForm2.responsible,
                  phone: this.dataForm2.phone,
                  place: this.dataForm2.place,
                  longitude: this.dataForm2.longitude,
                  latitude: this.dataForm2.latitude,
                  nextPlatformId: this.nextPlatformId,
                  submitType: this.type,
                  managerId: submitManageId,
                  answerList: this.tikuData.map((v) => {
                    return {
                      questionId: v.id,
                      answer: v.answer
                        ? typeof v.answer == "string"
                          ? v.answer + (v.remark ? "##" + v.remark : "")
                          : typeof v.answer == "object" && v.topicName != "图片"
                          ? v.answer.toString()
                          : JSON.stringify(v.answer)
                        : "",
                    };
                  }),
                }),
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: "操作成功",
                    type: "success",
                    duration: 1500,
                  });
                  this.showResource = false;
                  this.$emit("refreshDataList", "2");
                } else {
                  this.$message.error(data.msg);
                }
              });
            }
          }
        });
      }

      // this.$refs.approveEdit.approveSubmit();
      // this.showResource = false;
    },
    changeNextPlatform(val) {
      this.nextPlatformId = val;
      this.UnitChange();
    },
    //获取能源类型
    getCarSource() {
      this.nengyuanleixing = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=car_source`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.nengyuanleixing.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    //获取使用状态
    getCarStatus() {
      this.shiyongzhuangtai = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=car_type`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.shiyongzhuangtai.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    // 地图搜索回调事件
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach((poi) => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.center = [poi.lng, poi.lat];
          this.lng = poi.lng;
          this.lat = poi.lat;
          this.address = pois[0].name;
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length,
        };
        this.position = [center.lng, center.lat];
        this.center = [center.lng, center.lat];
      }
    },
    // 地图事件
    mounted() {
      loadPromise.then(() => {
        // console.log('-----')
        this.map = new AMap.Map("amap-demo1", {
          center: [121.59996, 31.197646],
          zoom: 12,
        });
        AMapUI.loadUI(["overlay/SimpleMarker"], (SimpleMarker) => {
          const marker = new SimpleMarker({
            iconLabel: "A",
            iconStyle: "red",
            map: this.map,
            position: this.map.getCenter(),
          });
        });
      });
    },
    //地图提交
    LongitudeandLatitude() {
      if (this.tabType == "first") {
        // 经度赋值
        this.dataForm.longitude = this.lng;
        // 纬度赋值
        this.dataForm.latitude = this.lat;
        console.log("---------------", this.address);
        this.dataForm.place = this.address;
      }

      if (this.tabType == "second") {
        // 经度赋值
        this.dataForm2.longitude = this.lng;
        // 纬度赋值
        this.dataForm2.latitude = this.lat;
        console.log("---------------", this.address);
        this.dataForm2.place = this.address;
      }
      this.mapVisible = false;
    },
    //上传图片
    //图片上传之前
    beforeAvatarUpload(file) {
      console.log("filename", file.name);
      // this.image.name = file.name;
      var img = {};
      img.name = file.name;
      let form = new FormData();
      form.append("file", file);
      this.$http({
        //url: this.$http.adornUrl(`/upload/platformImages`),
        url: this.$http.adornUrl(`/upload/file`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            //this.imageUrl = window.SITE_CONFIG.baseUrl + "/" + data.url;
            var urlStr = data.url.replace(/\\/g, "/");
            // console.log("platformImages", urlStr);
            this.dataForm.backgroundImage =
              window.SITE_CONFIG.cloudUrl + urlStr;
            // this.image.url = urlStr;
            img.url = urlStr;
            this.dataForm.imgList.push(img);
            // console.log("11111111111", this.dataForm.imgList);
            // this.imageList.push(this.image);
            // this.dataForm.imgList = this.imageList;
            // console.log("上传图片后返回的数据", data, this.dataForm.imgList);
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },
    //图片上传之前
    beforeAvatarUpload2(file) {
      console.log("filename", file.name);
      var img = {};
      img.name = file.name;
      // this.image.name = file.name;
      let form = new FormData();
      form.append("file", file);
      this.$http({
        //url: this.$http.adornUrl(`/upload/platformImages`),
        url: this.$http.adornUrl(`/upload/file`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            //this.imageUrl = window.SITE_CONFIG.baseUrl + "/" + data.url;
            var urlStr = data.url.replace(/\\/g, "/");
            // console.log("platformImages", urlStr);
            this.dataForm2.backgroundImage =
              window.SITE_CONFIG.cloudUrl + urlStr;
            // this.image.url = urlStr;
            img.url = urlStr;
            // console.log("img", img);
            this.dataForm2.boxImg.push(img);
            // console.log("推送后", this.dataForm2.boxImg);
            // this.imageList.push(this.image);
            // console.log("上传图片后返回的数据", data, this.dataForm.imgList);
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },

    //上传图片
    //图片上传之前
    beforeFileUpload(file) {
      // this.document.name = file.name;
      var document = {};
      document.name = file.name;
      let form = new FormData();
      form.append("file", file);
      this.$http({
        //url: this.$http.adornUrl(`/upload/platformImages`),
        url: this.$http.adornUrl(`/upload/file`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
        .then(({ data }) => {
          // console.log("/upload/platformImages",data)
          if (data && data.code === 0) {
            // console.log("上传图片后返回的数据", data);
            //this.imageUrl = window.SITE_CONFIG.baseUrl + "/" + data.url;
            var urlStr = data.url.replace(/\\/g, "/");
            // console.log("platformImages",urlStr);
            this.dataForm.documentImage = window.SITE_CONFIG.cloudUrl + urlStr;
            // this.document.url = urlStr;
            document.url = urlStr;
            this.dataForm.documentList.push(document);
            // this.dataForm.documentList.push(this.document);
            this.fileList = this.dataForm.documentList;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },

    handleAvatarSuccess(res, file) {},

    handleUploading(res, file) {
      // alert("正在上传中");
    },

    handlePictureCardPreview(file, fileList) {
      console.log("23e2ewq", file, fileList);
      this.dataForm.backgroundImage = file.url;
    },
    handlePictureCardPreview2(file, fileList) {
      console.log("23e2ewq", file, fileList);
      this.dataForm2.backgroundImage = file.url;
    },

    handlePreview(file) {
      console.log("上传预览handlePreview file", file);
      let httpaddress = window.SITE_CONFIG.cloudUrl;
      window.open(
        `${httpaddress}/${file.url}?attname=${
          file.name
        }&token=${this.$cookie.get("token")}`
      );
    },
    handleRemove(file, fileList) {
      this.dataForm.documentList = [];
      // console.log("删除上传handleRemove file, fileList",file, fileList);
      fileList.forEach((item) => {
        // this.dataForm.annex.push(item.response.data);
        this.document.name = item.name;
        this.document.url = item.url;
        this.dataForm.push(this.document);
      });

      this.fileList = this.dataForm.document;
    },
    // 预览文件
    previewDocument(file) {
      console.log("aaaaaaaaaaaaaaaaaaaaa", file);

      var index = file.name.lastIndexOf(".");
      var ext = file.name.substr(index + 1);
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
        ].indexOf(ext.toLowerCase()) !== -1
      ) {
        // console.log('该文件是图片')
        this.dialogDocumentVisible = false;
        this.documentUrl =
          this.$window.SITE_CONFIG["cloudUrl"] + "/" + file.url;
        console.log("文件路径1", this.documentUrl);
        return true;
      } else {
        this.dialogDocumentVisible = true;
        this.documentUrl = this.$window.SITE_CONFIG["cloudUrl"] + file.url;
        console.log("文件路径2", this.documentUrl);
        return false;
      }
    },
    // 下载文件
    downloadDocument(file) {
      console.log("asfff", file);

      var index = file.name.lastIndexOf(".");
      var ext = file.name.substr(index + 1);
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
        ].indexOf(ext.toLowerCase()) !== -1
      ) {
        // console.log('该文件是图片')
        this.documentUrl =
          this.$window.SITE_CONFIG["cloudUrl"] + "/" + file.url;
        console.log("文件路径1", this.documentUrl);
        return true;
      } else {
        this.documentUrl = this.$window.SITE_CONFIG["cloudUrl"] + file.url;
        this.tip = "点击下载";
        console.log("文件路径2", this.documentUrl);
        window.open(this.documentUrl, "_blank");
        return false;
      }
    },
    handleError(err, file, fileList) {
      // console.log("上传失败handleError err, file, fileList",err, file, fileList)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    delImg(index) {
      console.log("删除图片", index);
      this.dataForm.imgList.splice(index, 1);
    },
    //清除数据
    clearDataForm() {
      this.dataForm.name = "";
      this.nextPlatformId = "";
      this.platformOptions = [];
      this.dataForm.carNum = "";
      this.dataForm.carType = "";
      this.dataForm.carSource = "";
      this.dataForm.carProduceTime = "";
      this.dataForm.carStatus = "";
      this.dataForm.responsible = "";
      this.dataForm.phone = "";
      this.dataForm.imgList = [];
      this.imageList = [];
      this.dataForm.documentList = [];
      this.dataForm.place = "";
      this.dataForm.longitude = "";
      this.dataForm.latitude = "";

      this.dataForm2.name = "";
      this.dataForm2.boxNum = "";
      this.dataForm2.responsible = "";
      this.dataForm2.phone = "";
      this.dataForm2.place = "";
      this.dataForm2.longitude = "";
      this.dataForm2.latitude = "";
      this.dataForm2.policeMan = [
        {
          name: "",
          phone: "",
        },
      ];
      this.dataForm2.status = "";
      this.dataForm2.boxImg = [];

      this.baoshenData = {
        id: "",
        name: "",
        contactor: { id: "", name: "", role: "", phone: "" },
      };
    },
    //添加人员
    addPoliceMan() {
      console.log("1111111");
      this.dataForm2.policeMan.push({
        name: "",
        phone: "",
      });
      // let a = `<div class="renyuan">
      // <div class="renyuanxingming">姓名</div>
      // <div class="renyuaninput el-input el-input--medium">
      // <input type="text" autocomplete="off" class="el-input__inner">
      // </div>
      // <div class="renyuanshouji">手机</div>
      // <div class="renyuaninput el-input el-input--medium">
      // <input type="text" autocomplete="off" class="el-input__inner">
      // </div>
      // <img style="width:35px;height:35px;margin-top:17px;margin-left:5px;cursor:pointer"
      //     :src="require('@/assets/img/zhiqinrenyuanchahao.svg')"/>
      //     </div>`;
      // this.htmlType = $("" + a + "");
      // $(".renyuanParent").append(this.htmlType);
    },
    removeMember(index) {
      this.dataForm2.policeMan.splice(this.dataForm2[index], 1);
    },
  },
};
</script>

<style lang="less">
// .resourceAddUpdate {
//   .report-table {
//     flex: 1;
//     margin: 20px;
//   }
//   .info {
//     font-size: 14px;
//     padding: 20px;
//     background-color: white;
//     .portrait {
//       width: 120px;
//       height: 200px;
//       border-radius: 10px;
//     }
//     .example {
//       color: #c0c0c0;
//     }
//   }
//   .content {
//     width: 250px;
//     height: 35px;
//     margin-left: 10px;
//     outline: none;
//     border: 1px solid #ccc;
//     border-radius: 5px;
//     padding-left: 10px;
//   }
//   .el-select-dropdown .el-popper {
//     left: 1290px !important;
//   }
//   .check-process-wrapper {
//     margin-left: 15px;
//     max-height: 200px;
//     padding: 0;
//     font-size: 13px;
//   }
//   .check-process {
//     margin: 20px;
//     width: 20vw;
//     border: 1px solid rgba(215, 215, 215, 1);
//     border-radius: 3px;
//     background-color: rgba(249, 251, 255, 1);
//     padding: 10px;
//   }
//   .check-process-head-1 {
//     border: 1px solid #0091ff;
//     border-radius: 3px;
//     color: white;
//     background-color: #0091ff;
//     padding: 5px 15px;
//     display: inline-block;
//     width: 4.6vw;
//     text-align: center;
//   }
//   .check-process-head-grey {
//     border: 1px solid rgba(215, 215, 215, 1);
//     border-radius: 3px;
//     color: white;
//     background-color: rgba(215, 215, 215, 1);
//     padding: 5px 15px;
//     display: inline-block;
//     width: 4.6vw;
//     text-align: center;
//   }
//   .check-process-content-1 {
//     border: 1px solid #0091ff;
//     border-left: none;
//     border-top-right-radius: 5px;
//     border-bottom-right-radius: 5px;
//     padding: 5px 15px;
//     display: inline-block;
//     width: 13vw;
//     text-align: center;
//     .el-input__inner {
//       background-color: #f9fbff;
//       border: 0;
//       height: 28px;
//     }
//   }
//   .check-process-content-grey {
//     border: 1px solid rgba(215, 215, 215, 1);
//     border-left: none;
//     border-top-right-radius: 5px;
//     border-bottom-right-radius: 5px;
//     color: rgba(215, 215, 215, 1);
//     padding: 5px 15px;
//     display: inline-block;
//     width: 13vw;
//     text-align: center;
//   }
//   .check-process-head-2 {
//     border: 1px solid rgba(215, 215, 215, 1);
//     border-radius: 3px;
//     color: white;
//     background-color: rgba(215, 215, 215, 1);
//     padding: 5px 15px;
//     display: inline-block;
//     width: 4.6vw;
//     text-align: center;
//   }
//   .check-process-content-2 {
//     border: 1px solid rgba(215, 215, 215, 1);
//     border-left: none;
//     border-top-right-radius: 5px;
//     border-bottom-right-radius: 5px;
//     color: rgba(215, 215, 215, 1);
//     padding: 5px 15px;
//     display: inline-block;
//     width: 13vw;
//     text-align: center;
//   }
//   .check-process .el-form-item {
//     margin-bottom: 0;
//   }
//   .check-process-main {
//     width: 342px;
//     border: 1px solid rgba(170, 170, 170, 1);
//     border-top: none;
//     border-radius: 3px;
//   }
//   .resource_board {
//     position: relative;
//     // height: 38vw;
//     top: -70px;
//     .resource_dialogHeader {
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       height: 50px;
//       background-color: #f2f2f2;
//       box-sizing: border-box;
//       padding: 15px;
//     }
//   }
//   .renyuan {
//     display: flex;
//     margin-top: 10px;
//     height: 60px;
//     background-color: rgba(241, 244, 246, 1);
//   }
//   .renyuaninput {
//     // border: 1px solid rgba(215, 215, 215, 1);
//     width: 173px;
//     height: 30px;
//     margin-left: 10px;
//     margin-top: 15px;
//   }
//   .renyuanxingming {
//     margin-left: 25px;
//     margin-top: 11px;
//   }
//   .renyuanshouji {
//     margin-left: 15px;
//     margin-top: 11px;
//   }
//   .el-dialog__body {
//     min-height: 700px;
//   }
// }
.resourceAddUpdate {
  .left-content-container,
  .right-content-container {
    display: inline-block;
    width: 800px;
  }
  .right-content-container {
    width: 500px;
  }
  .approve-edit-container .approve-edit-text textarea {
    width: 745px;
  }
  .approve-edit-container .approve-edit-text label {
    bottom: 20px;
  }
}
</style>
