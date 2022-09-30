<template>
  <div class="resourceAddUpdate">
    <el-dialog
      :visible.sync="showResource"
      width="1300px"
      :close-on-click-modal="false"
      custom-class="resource_board"
    >
      <div slot="title" class="resource_dialogHeader">{{dialogTitle}}</div>
      <div v-if="tabType=='first'">
        <el-row>
          <el-col :span="16">
            <div>
              <el-form
                label-position="right"
                label-width="120px"
                :model="dataForm"
                :rules="dataRule"
                ref="dataForm"
              >
                <el-form-item label="车辆照片">
                  <el-upload
                    class="picture-card"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePictureCardPreview"
                    :before-upload="beforeAvatarUpload"
                  >
                    <el-button size="small">上传</el-button>
                  </el-upload>
                  <img
                    v-for="(item,index) in dataForm.imgList"
                    :src="backgroundURL+item.url"
                    :key="index"
                    style="height:90px;width:120px;min-width:99px;margin-right:8px"
                  />
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="车牌号" prop="carNum">
                      <el-input v-model="dataForm.carNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="车辆品牌及型号">
                      <el-input v-model="dataForm.carType"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="车名">
                      <el-input v-model="dataForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="能源类型">
                      <el-select clearable v-model="dataForm.carSource" style="width:266px">
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
                        style="width:266px"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="使用状态">
                      <el-select clearable v-model="dataForm.carStatus" style="width:266px">
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
                      <el-input v-model="dataForm.responsible"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系电话" prop="phone">
                      <el-input v-model="dataForm.phone"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="附件">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :before-upload="beforeFileUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-error="handleError"
                    :before-remove="beforeRemove"
                    multiple
                    :on-exceed="handleExceed"
                    :show-file-list="false"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <!-- <div slot="tip" class="el-upload__tip" style="width:100%;">
                      <div>
                        <div
                          v-for="(item, index) in dataForm.documentList"
                          :key="index"
                          style="display: inline-block;box-sizing:border-box;width:99%;margin-right: 5px;margin-bottom: 5px;position:relative;"
                        >
                          <div class="fileList__show">
                            <div class="fileList__name">
                              <i class="el-icon-document"></i>
                              <span
                                style="margin-left: 5px;cursor: pointer"
                                @click="downloadDocument(item)"
                                :title="tip"
                              >{{ item.name }}</span>
                            </div>
                            <div
                              class="fileList__button"
                              style="height:100%;display:flex;align-items:center"
                            >
                              <el-button
                                type="success"
                                size="mini"
                                style="height: 80%;line-height:80%;"
                                @click="previewDocument(item)"
                              >预览</el-button>

                              <i
                                class="el-icon-success"
                                style="color:#67c23a;margin-left:15px;margin-right: 5px"
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>-->
                  </el-upload>
                  <img
                    v-for="(item,index) in dataForm.documentList"
                    :src="backgroundURL+item.url"
                    :key="index"
                    style="height:90px;width:120px;min-width:99px;margin-right:8px"
                  />
                </el-form-item>

                <!-- <input type="file" /> -->
              </el-form>
            </div>
          </el-col>
          <el-col :span="8">
            <!-- 右边流程展示 -->
            <div class="check-process">
              <span style="font-weight:bold;">审批流程</span>
              <el-button type="text" style="float:right;padding:3px;">查看政策文件</el-button>
              <el-button type="text" style="float:right;padding:3px;">历史申报记录</el-button>
              <!-- 新增 -->
              <div v-if="type == 'add'">
                <div class="check-process-wrapper">
                  <!-- 填报单位 -->
                  <span class="check-process-head-1">填报</span>

                  <span class="check-process-content-1">{{tianbaoUnit}}</span>
                  <div class="check-process-main">
                    <el-form ref="form" label-width="100px">
                      <el-form-item label="负责人：">
                        <span>{{createUser.name}}{{(createUser.role)}}</span>
                        <span style="float:right;margin-right:5%">{{createUser.phone}}</span>
                      </el-form-item>
                    </el-form>
                  </div>
                  <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <!-- 定义灰色箭头 -->
                      <marker
                        id="arrow-grey"
                        markerUnits="strokeWidth"
                        markerWidth="12"
                        markerHeight="12"
                        viewBox="0 0 12 12"
                        refX="6"
                        refY="6"
                        orient="auto"
                      >
                        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: lightgrey;" />
                      </marker>
                    </defs>
                    <svg
                      width="100%"
                      height="100%"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="50"
                        y1="00"
                        x2="50"
                        y2="50"
                        stroke="lightgrey"
                        stroke-width="2"
                        marker-end="url(#arrow-grey)"
                      />
                    </svg>
                  </svg>
                </div>
                <div class="check-process-wrapper">
                  <span class="check-process-head-1">报审单位</span>
                  <span>
                    <el-select
                      class="check-process-content-1"
                      v-model="dataForm.nextPlatformId"
                      :placeholder="baoshenData.name"
                      @change="UnitChange"
                    >
                      <el-option
                        v-for="item in platformOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </span>
                  <div class="check-process-main">
                    <el-form ref="form" label-width="100px">
                      <el-form-item label="负责人：">
                        <span>{{baoshenData.contactor.name==''?'-':baoshenData.contactor.name}}{{baoshenData.contactor.role==''?'':(baoshenData.contactor.role)}}</span>
                        <span
                          style="float:right;margin-right:5%"
                        >{{baoshenData.contactor.phone==''?'':baoshenData.contactor.phone}}</span>
                      </el-form-item>
                    </el-form>
                  </div>

                  <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <line
                      x1="50"
                      y1="00"
                      x2="50"
                      y2="50"
                      stroke="lightgrey"
                      stroke-width="2"
                      marker-end="url(#arrow-grey)"
                    />
                  </svg>
                </div>
                <div v-for="(item,index) in unitList" :key="index">
                  <div v-if="index>1" class="check-process-wrapper">
                    <span class="check-process-head-2">待审批</span>
                    <span class="check-process-content-2">{{item.depName}}</span>
                    <svg
                      width="100%"
                      height="100%"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="50"
                        y1="00"
                        x2="50"
                        y2="50"
                        stroke="lightgrey"
                        stroke-width="2"
                        marker-end="url(#arrow-grey)"
                        v-if="index < unitList.length-1"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <!-- 查看修改 -->
              <div v-if="type!='add'">
                <div class="check-process-wrapper" v-for="(item,index) in processList" :key="index">
                  <span
                    :class="!item.approveApproveEntity.platformId?'check-process-head-grey':'check-process-head-1'"
                  >{{processType[index]}}</span>

                  <span
                    :class="!item.approveApproveEntity.platformId?'check-process-content-grey':'check-process-content-1'"
                  >{{item.approveApproveEntity.platformIdString==''?item.depName:item.approveApproveEntity.platformIdString}}</span>
                  <div class="check-process-main">
                    <el-form ref="form" label-width="100px">
                      <!-- <el-form-item label="填报时间：">{{createUser.name}}</el-form-item> -->
                      <el-form-item
                        v-if="item.approveApproveEntity.sysUserVo.name!=''"
                        label="填报人："
                      >
                        <span>{{item.approveApproveEntity.sysUserVo.name}}({{item.approveApproveEntity.sysUserVo.role}})</span>
                        <span
                          style="float:right;margin-right:5%"
                        >{{item.approveApproveEntity.sysUserVo.phone}}</span>
                      </el-form-item>
                      <el-form-item v-if="item.chargeMan.name!=''" label="负责人：">
                        <span>{{item.chargeMan.name}}({{item.chargeMan.position}})</span>
                        <span style="float:right;margin-right:5%">{{item.chargeMan.mobile1}}</span>
                      </el-form-item>
                      <!-- <el-form-item label="审批结果：">
                      <span
                        v-if="processData1.result==='同意'"
                        style="color:#70B603"
                      >{{processData1.result}}</span>
                    </el-form-item>
                      <el-form-item label="审批意见：">{{processData1.feedback}}</el-form-item>-->
                    </el-form>
                  </div>
                  <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <!-- 定义默认蓝色箭头 -->
                      <marker
                        id="arrow-blue"
                        markerUnits="strokeWidth"
                        markerWidth="12"
                        markerHeight="12"
                        viewBox="0 0 12 12"
                        refX="6"
                        refY="6"
                        orient="auto"
                      >
                        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: lightskyblue;" />
                      </marker>
                      <!-- 定义灰色箭头 -->
                      <marker
                        id="arrow-grey"
                        markerUnits="strokeWidth"
                        markerWidth="12"
                        markerHeight="12"
                        viewBox="0 0 12 12"
                        refX="6"
                        refY="6"
                        orient="auto"
                      >
                        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: lightgrey;" />
                      </marker>
                    </defs>
                    <line
                      x1="50"
                      y1="0"
                      x2="50"
                      y2="50"
                      stroke="lightskyblue"
                      stroke-width="2"
                      marker-end="url(#arrow-blue)"
                      v-if="item.approveApproveEntity.nextPlatformId!=''&&item.approveApproveEntity.approveResult!=1"
                    />
                    <svg
                      width="100%"
                      height="100%"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="50"
                        y1="00"
                        x2="50"
                        y2="50"
                        stroke="lightgrey"
                        stroke-width="2"
                        marker-end="url(#arrow-grey)"
                        v-if="index<processList.length-1 && processList[index+1].approveApproveEntity.platformId==''"
                      />
                    </svg>
                  </svg>
                </div>
              </div>

              <!-- <div class="check-process-wrapper">
                <span class="check-process-head-1">已审批</span>
                <span class="check-process-content-1">{{processData2.place}}</span>
                <div class="check-process-main">
                  <el-form ref="form" :model="processData2" label-width="100px">
                    <el-form-item label="审批时间：">{{processData2.time}}</el-form-item>
                    <el-form-item label="审批人：">{{processData2.name}}</el-form-item>
                    <el-form-item label="审批结果：">
                      <span
                        v-if="processData2.result==='同意'"
                        style="color:#70B603"
                      >{{processData2.result}}</span>
                    </el-form-item>
                    <el-form-item label="审批意见：">{{processData2.feedback}}</el-form-item>
                  </el-form>
                </div>
                <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <line
                    x1="50"
                    y1="0"
                    x2="50"
                    y2="50"
                    stroke="lightskyblue"
                    stroke-width="2"
                    marker-end="url(#arrow-blue)"
                  />
                </svg>
              </div>
              <div class="check-process-wrapper">
                <span class="check-process-head-1">审批中</span>
                <span class="check-process-content-1">镇街综治办</span>
                <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <line
                    x1="50"
                    y1="00"
                    x2="50"
                    y2="50"
                    stroke="lightgrey"
                    stroke-width="2"
                    marker-end="url(#arrow-grey)"
                  />
                </svg>
              </div>
              <div class="check-process-wrapper">
                <span class="check-process-head-2">待审批</span>
                <span class="check-process-content-2">区住建局</span>
              </div>-->
            </div>
          </el-col>
        </el-row>
      </div>

      <div v-if="tabType=='second'">
        <el-form
          label-position="right"
          label-width="120px"
          :model="dataForm2"
          ref="dataForm2"
          :rules="dataRule2"
        >
          <el-form-item label="岗亭照片">
            <el-upload
              class="picture-card"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-preview="handlePictureCardPreview2"
              :before-upload="beforeAvatarUpload2"
            >
              <el-button size="small">上传</el-button>
            </el-upload>
            <img
              v-for="(item,index) in dataForm2.boxImg"
              :src="backgroundURL+item"
              :key="index"
              style="height:90px;width:120px;min-width:99px;margin-right:8px"
            />
          </el-form-item>
          <el-row>
            <el-col :span="9">
              <el-form-item label="岗亭名称" prop="name">
                <el-input v-model="dataForm2.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="编号" prop="buxNum">
                <el-input v-model="dataForm2.boxNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="9">
              <el-form-item label="负责人" prop="responsible">
                <el-input v-model="dataForm2.responsible"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="dataForm2.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="9">
              <el-form-item label="地址">
                <el-input v-model="dataForm2.place"></el-input>
                <img
                  :src="require('@/assets/img/weizhi.svg')"
                  style="width: 25px;height: 25px;position: relative;bottom: 37px;left: 280px;cursor:pointer"
                  @click="mapVisible=true"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="13">
              <el-form-item label="执勤人员">
                <div>
                  <el-button @click="addPoliceMan">+添加人员</el-button>
                </div>
                <div class="renyuanParent">
                  <div class="renyuan" v-for="(item,index) in dataForm2.policeMan" :key="index">
                    <div class="renyuanxingming">姓名</div>
                    <el-input class="renyuaninput" v-model="item.name"></el-input>
                    <div class="renyuanshouji">手机</div>
                    <el-input class="renyuaninput" v-model="item.phone"></el-input>
                    <img
                      style="width:35px;height:35px;margin-top:17px;margin-left:5px;cursor:pointer"
                      :src="require('@/assets/img/zhiqinrenyuanchahao.svg')"
                      @click="removeMember(index)"
                    />
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showResource = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>

    <!--地图弹窗-->
    <el-dialog title="地图" :visible.sync="mapVisible" append-to-body>
      <div style="height:580px;">
        <div :style="{width:'100%',height:'500px',float: 'right'}">
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
            <el-amap-marker :position="position" :events="events"></el-amap-marker>
            <!-- <el-amap-marker v-for="{position,index} in markers" :position="position" :key="index"></el-amap-marker> -->
          </el-amap>
          <div class="toolbar">
            position: [{{ lng }}, {{ lat }}] address: {{ address }}
            <div style="text-align: center">
              <el-button @click="mapVisible = false">取消</el-button>
              <el-button type="primary" @click="LongitudeandLatitude()">确定</el-button>
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
      style="text-align:center;"
    >
      <img v-if="getDocumentType" :src="documentUrl" />
      <preplan-document v-else :documentUrl="documentUrl"></preplan-document>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["tabType"],
  data() {
    let self = this;
    return {
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      //标签类型
      htmlType: "",
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
        //上传的照片路径
        backgroundImage: "",
        //上传附件路径
        documentImage: "",
        nextPlatformId: ""
      },
      //平台选项
      platformOptions: [
        {
          label: "",
          value: ""
        }
      ],
      image: {
        name: "",
        url: ""
      },
      imageList: [],
      document: {
        name: "",
        url: ""
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
        policeMan: [
          {
            name: "",
            phone: ""
          }
        ],
        status: "",
        backgroundImage: ""
      },
      processData1: {
        place: "",
        time: "",
        name: "",
        result: "",
        feedback: ""
      },
      processData2: {
        place: "",
        time: "",
        name: "",
        result: "",
        feedback: ""
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
        role: ""
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
        contactor: { id: "", name: "", role: "", phone: "" }
      },
      // baoshenUnit: "",
      // baoshenId: "",
      //流程单位
      unitList: [],
      //类型
      processType: [],
      processList: [],
      dataRule: {
        carNum: [
          {
            required: true,
            message: "名牌号不能为空",
            trigger: "blur"
          }
        ],
        responsible: [
          {
            required: true,
            message: "责任人不能为空",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "联系电话不能为空",
            trigger: "blur"
          }
        ]
      },

      dataRule2: {
        name: [
          {
            required: true,
            message: "岗亭名称不能为空",
            trigger: "blur"
          }
        ],
        boxNum: [
          {
            required: true,
            message: "岗亭号不能为空",
            trigger: "blur"
          }
        ],
        responsible: [
          {
            required: true,
            message: "责任人不能为空",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "联系电话不能为空",
            trigger: "blur"
          }
        ]
      },
      // 高德地图开始
      markers: [
        [113.3245904, 23.2066805],
        [113.323623, 23.106341],
        [113.325399, 23.106156]
      ],
      searchOption: {
        city: "广州",
        citylimit: false
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
                    extensions: "all"
                  });
                  geocoder.getAddress([self.lng, self.lat], function(
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
            }
          }
        }
      ],
      lng: 0,
      lat: 0,
      count: 1,
      slotStyle: {
        padding: "2px 8px",
        background: "#eee",
        color: "#333",
        border: "1px solid #aaa"
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
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                // console.log(self)

                // self.$nextTick()
              }
            }
          });
        }
      },
      // 地图弹窗
      mapVisible: false
      //高德地图结束

      //流程图数据
    };
  },
  watch: {
    deep: true,
    immediate: true
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
          "tiff"
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
    }
  },
  methods: {
    UnitChange() {
      let index = this.platformData.findIndex(
        item => item.id == this.dataForm.nextPlatformId
      );
      // console.log("下拉框改变", index, this.platformData[index]);
      if (this.platformData[index].contactor != null) {
        this.baoshenData.id = this.platformData[index].id;
        this.baoshenData.name = this.platformData[index].name;
        this.baoshenData.contactor.id = this.platformData[index].contactor.id;

        this.baoshenData.contactor.name = this.platformData[
          index
        ].contactor.name;
        this.baoshenData.contactor.role = this.platformData[
          index
        ].contactor.position;
        this.baoshenData.contactor.phone = this.platformData[
          index
        ].contactor.mobile1;
      } else {
        this.baoshenData = {
          id: "",
          name: "",
          contactor: { id: "", name: "", position: "", mobile1: "" }
        };
      }
      // console.log("下拉框改变", this.platformData[index], this.baoshenData);
    },
    getPlatform() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//info/${this.nowPlatForm}`),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tianbaoUnit = data.platForm.platformName;
          // this.console.log("当前平台名称", data);
          // data.data.forEach(item => {
          //   this.platformOptions.push({ value: item.code, label: item.name });
          // });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getPlatForm?id=${this.baoshenData.id}`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("报审单位平台数据", data, this.baoshenData.id);
          this.platformData = data.data;
          data.data.forEach(item => {
            this.platformOptions.push({
              value: item.id,
              label: item.platformName
            });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    getUnit() {
      this.$http({
        url: this.$http.adornUrl(`/approve/approveProcess/getUnit?id=-100`),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.unitList = data.data;
          if (this.unitList.length > 1) {
            this.baoshenData.id = this.unitList[1].depId;
            this.baoshenData.name = "请选择" + this.unitList[1].depName;
            this.tianbaoUnit = this.unitList[0].depName;
            console.log("新增", this.unitList, this.baoshenData.name);
          }
          this.getPlatform();
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    getPlatformById(id) {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//infoById/${id}`),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("byId", data);
          if (this.type == "add") {
            this.createUser.id = data.platform.contactor.id;
            this.createUser.name = data.platform.contactor.name;
            this.createUser.phone = data.platform.contactor.mobile1;
            this.createUser.role = data.platform.contactor.position;
          } else {
            this.processList[index].chargeMan.id = data.platform.contactor.id;
            this.processList[index].chargeMan.name =
              data.platform.contactor.name;
            this.processList[index].chargeMan.position =
              data.platform.contactor.position;
            this.processList[index].chargeMan.mobile1 =
              data.platform.contactor.mobile1;
          }
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    init(id, type) {
      this.clearDataForm();
      const user = this.$cookie.get("userId");
      // this.createUser = user.substring(2, user.length);
      this.nowPlatForm = this.$cookie.get("platformId");
      this.dataForm.id = id;
      this.type = type;

      //判断流程图
      this.processType = ["填报"];
      var processTime = 0;
      // this.createUser = user.substring(2, user.length);
      // this.createUser = 2081;
      // this.nowPlatForm = this.$cookie.get("platformId");
      // if(this.type)
      // this.showResource = true;
      console.log("标签类型", this.tabType, this.type);
      switch (type) {
        case "add":
          if (this.tabType == "first") {
            this.dialogTitle = "新增巡查车辆";
            this.getUnit();
            this.getPlatformById(this.nowPlatForm);
            this.showResource = true;
          }
          if (this.tabType == "second") {
            this.dialogTitle = "新增群防岗亭";
            this.showResource = true;
          }

          break;

        case "show":
          if (this.tabType == "first") {
            this.dialogTitle = "查看巡查任务";
            this.$http({
              url: this.$http.adornUrl(
                `/approve/approveCarEntity/info/${this.dataForm.id}`
              ),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                console.log("data.data", data.data);
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
                this.imageList = this.dataForm.imgList;

                // console.log("11111", user);
                // if (
                //   this.createUser ==
                //   data.data.approveManageEntity.processList[0]
                //     .approveApproveEntity.sysUserVo.id
                // ) {
                this.processList = data.data.approveManageEntity.processList;
                this.processList.forEach(item => {
                  if (item.chargeMan == null) {
                    item.chargeMan = {
                      id: "",
                      name: "",
                      position: "",
                      mobile1: ""
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
                      tikuType: ""
                    };
                  }
                });
                this.baoshenData.name =
                  "请选择" +
                  data.data.approveManageEntity.unitList[1].unitIdString;
                console.log(
                  "报审单位",
                  this.baoshenData.name,
                  this.processList
                );
                // console.log("当前是填报人", this.processList);
                // }
                // if (this.type == "add") {
                //   this.processList.forEach(item => {
                //     item.approveApproveEntity = this.approveData;

                //     this.processList.splice(0, 2);
                //     console.log("新增流程", this.processList);
                //   });
                // } else {
                var index = this.processList.findIndex(
                  item => item.approveApproveEntity.platformIdString == ""
                );
                console.log("没错", index);
                // this.processList[1].approveApproveEntity.platformIdString = this.processList[0].approveApproveEntity.nextPlatformIdString;
                if (
                  index > 0 &&
                  this.processList[index - 1].approveApproveEntity
                    .approveResult != 1
                ) {
                  this.processList[
                    index
                  ].approveApproveEntity.platformId = this.processList[
                    index - 1
                  ].approveApproveEntity.nextPlatformId;
                  this.processList[
                    index
                  ].approveApproveEntity.platformIdString = this.processList[
                    index - 1
                  ].approveApproveEntity.nextPlatformIdString;
                  console.log(
                    "审核中",
                    this.processList[index].approveApproveEntity
                      .platformIdString,
                    this.processList[index - 1].approveApproveEntity
                      .nextPlatformIdString
                  );
                  let choosePlatformid = this.processList[index]
                    .approveApproveEntity.platformId;
                  this.getPlatformById(choosePlatformid);
                }
                // if (index == -1) {
                //   for (
                //     let i = 1;
                //     i < data.data.approveManageEntity.processList.length;
                //     i++
                //   ) {
                //     data.data.approveManageEntity.processList[
                //       i
                //     ].approveApproveEntity = this.approveData;
                //     this.processType.push("待审核");
                //   }
                //   this.processList = data.data.approveManageEntity.processList;
                //   // this.processList.push(this.processType);

                //   console.log("当前是群众", this.processList, this.processType);
                // // }
                // else if (index == 0) {
                // this.processList = data.data.approveManageEntity.processList;
                for (let i = 1; i < this.processList.length; i++) {
                  if (
                    this.processList[i].approveApproveEntity.sysUserVo.name ==
                    ""
                  ) {
                    // if (processTime == 0) {
                    //   this.processType.push("审核中");
                    //   processTime += 1;
                    // } else {
                    //   this.processType.push("待审核");
                    // }
                    if (
                      this.processList[i].approveApproveEntity
                        .nextPlatformIdString == "" &&
                      this.processList[i].approveApproveEntity
                        .platformIdString != ""
                    ) {
                      this.processType.push("审核中");
                      console.log("type", "审核中");
                    } else {
                      this.processType.push("待审核");
                    }
                  } else {
                    this.processType.push("已审核");
                  }
                }
                // } else if (
                //   index > 0 &&
                //   this.nowPlatForm ==
                //     data.data.approveManageEntity.processList[index - 1]
                //       .approveApproveEntity.nextPlatformId
                // ) {
                //   for (let i = 1; i < index + 1; i++) {
                //     this.processType.push("已审核");
                //   }
                //   for (
                //     let j = index + 1;
                //     j < data.data.approveManageEntity.processList.length;
                //     j++
                //   ) {
                //     data.data.approveManageEntity.processList[
                //       j
                //     ].approveApproveEntity = this.approveData;
                //     this.processList =
                //       data.data.approveManageEntity.processList;
                //     this.processType.push("待审核");
                //     console.log("当前是审核人", this.processList);
                //   }
                // }
                // }
                console.log("最终结果", this.processList);
                // this.processList.forEach(item => {
                //   item.approveApproveEntity;
                // });
                this.showResource = true;
              } else {
                this.$message.error(data.msg);
              }
            });
          }

          break;
        case "update":
          if (this.tabType == "first") {
            this.dialogTitle = "修改巡查车辆";
            this.$http({
              url: this.$http.adornUrl(
                `/approve/approveCarEntity/info/${this.dataForm.id}`
              ),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
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
                this.imageList = this.dataForm.imgList;
                this.showResource = true;
              } else {
                this.$message.error(data.msg);
              }
            });
          }

          if (this.tabType == "second") {
            this.dialogTitle = "修改群防岗亭";
            this.$http({
              url: this.$http.adornUrl(
                `/approve/approveBoxEntity/info/${this.dataForm.id}`
              ),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
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

                this.showResource = true;
              } else {
                this.$message.error(data.msg);
              }
            });
          }
          break;
        default:
      }
    },
    submit() {
      if (this.tabType == "first") {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            if (this.tabType == "first") {
              if (this.dataForm.nextPlatformId == "") {
                this.$message.error("请选择下个平台名字");
                return;
              }
              this.$http({
                url: this.$http.adornUrl(
                  `/approve/approveCarEntity/${
                    !this.dataForm.id ? "save" : "update"
                  }`
                ),
                method: "post",
                data: this.$http.adornData({
                  id: this.dataForm.id || undefined,
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
                  nextPlatformId: this.dataForm.nextPlatformId
                })
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: "操作成功",
                    type: "success",
                    duration: 1500
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
        this.$refs["dataForm2"].validate(valid => {
          if (valid) {
            if (this.tabType == "second") {
              this.$http({
                url: this.$http.adornUrl(
                  `/approve/approveBoxEntity/${
                    !this.dataForm.id ? "save" : "update"
                  }`
                ),
                method: "post",
                data: this.$http.adornData({
                  id: this.dataForm2.id || undefined,
                  name: this.dataForm2.name,
                  imgList: this.dataForm2.boxImg,
                  policeManList: this.dataForm2.policeMan,
                  boxNum: this.dataForm2.boxNum,
                  responsible: this.dataForm2.responsible,
                  phone: this.dataForm2.phone,
                  place: this.dataForm2.place,
                  longitude: this.dataForm2.longitude,
                  latitude: this.dataForm2.latitude
                })
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: "操作成功",
                    type: "success",
                    duration: 1500
                  });
                  this.showResource = false;
                  this.$emit("refreshDataList");
                } else {
                  this.$message.error(data.msg);
                }
              });
            }
          }
        });
      }
    },
    //获取能源类型
    getCarSource() {
      this.nengyuanleixing = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=car_source`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.nengyuanleixing.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
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
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.shiyongzhuangtai.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    // 地图搜索回调事件
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
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
          lat: latSum / pois.length
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
          zoom: 12
        });
        AMapUI.loadUI(["overlay/SimpleMarker"], SimpleMarker => {
          const marker = new SimpleMarker({
            iconLabel: "A",
            iconStyle: "red",
            map: this.map,
            position: this.map.getCenter()
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
      this.image.name = file.name;
      let form = new FormData();
      form.append("file", file);
      this.$http({
        //url: this.$http.adornUrl(`/upload/platformImages`),
        url: this.$http.adornUrl(`/upload/file`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            //this.imageUrl = window.SITE_CONFIG.baseUrl + "/" + data.url;
            var urlStr = data.url.replace(/\\/g, "/");
            // console.log("platformImages", urlStr);
            this.dataForm.backgroundImage =
              window.SITE_CONFIG.cloudUrl + urlStr;
            this.image.url = urlStr;
            this.dataForm.imgList.push(this.image);
            console.log("11111111111", this.dataForm.imgList);
            this.imageList.push(this.image);
            // this.dataForm.imgList = this.imageList;
            console.log("上传图片后返回的数据", data, this.dataForm.imgList);
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {});
    },
    //图片上传之前
    beforeAvatarUpload2(file) {
      console.log("filename", file.name);
      this.image.name = file.name;
      let form = new FormData();
      form.append("file", file);
      this.$http({
        //url: this.$http.adornUrl(`/upload/platformImages`),
        url: this.$http.adornUrl(`/upload/file`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            //this.imageUrl = window.SITE_CONFIG.baseUrl + "/" + data.url;
            var urlStr = data.url.replace(/\\/g, "/");
            // console.log("platformImages", urlStr);
            this.dataForm2.backgroundImage =
              window.SITE_CONFIG.cloudUrl + urlStr;
            this.image.url = urlStr;
            this.dataForm2.boxImg.push(this.image);
            console.log("11111111111", this.dataForm2.boxImg);
            this.imageList.push(this.image);
            console.log("上传图片后返回的数据", data, this.dataForm.imgList);
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {});
    },

    //上传图片
    //图片上传之前
    beforeFileUpload(file) {
      this.document.name = file.name;
      let form = new FormData();
      form.append("file", file);
      this.$http({
        //url: this.$http.adornUrl(`/upload/platformImages`),
        url: this.$http.adornUrl(`/upload/file`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          // console.log("/upload/platformImages",data)
          if (data && data.code === 0) {
            console.log("上传图片后返回的数据", data);
            //this.imageUrl = window.SITE_CONFIG.baseUrl + "/" + data.url;
            var urlStr = data.url.replace(/\\/g, "/");
            // console.log("platformImages",urlStr);
            this.dataForm.documentImage = window.SITE_CONFIG.cloudUrl + urlStr;
            this.document.url = urlStr;
            this.dataForm.documentList.push(this.document);
            this.fileList = this.dataForm.documentList;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {});
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
      fileList.forEach(item => {
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
          "tiff"
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
          "tiff"
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
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //清除数据
    clearDataForm() {
      this.dataForm.name = "";
      this.dataForm.nextPlatformId = "";
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
          phone: ""
        }
      ];
      this.dataForm2.status = "";
      this.dataForm2.boxImg = [];
    },
    //添加人员
    addPoliceMan() {
      console.log("1111111");
      this.dataForm2.policeMan.push({
        name: "",
        phone: ""
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
    }
  }
};
</script>

<style lang="less">
.resourceAddUpdate {
  .el-select-dropdown .el-popper {
    left: 1290px !important;
  }
  .check-process-wrapper {
    margin-left: 15px;
    max-height: 200px;
    padding: 0;
    font-size: 13px;
  }
  .check-process {
    margin: 20px;
    width: 20vw;
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    background-color: rgba(249, 251, 255, 1);
    padding: 10px;
  }
  .check-process-head-1 {
    border: 1px solid #0091ff;
    border-radius: 3px;
    color: white;
    background-color: #0091ff;
    padding: 5px 15px;
    display: inline-block;
    width: 4.6vw;
    text-align: center;
  }
  .check-process-head-grey {
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    color: white;
    background-color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 4.6vw;
    text-align: center;
  }
  .check-process-content-1 {
    border: 1px solid #0091ff;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 5px 15px;
    display: inline-block;
    width: 13vw;
    text-align: center;
    .el-input__inner {
      background-color: #f9fbff;
      border: 0;
      height: 28px;
    }
  }
  .check-process-content-grey {
    border: 1px solid rgba(215, 215, 215, 1);
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 13vw;
    text-align: center;
  }
  .check-process-head-2 {
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    color: white;
    background-color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 4.6vw;
    text-align: center;
  }
  .check-process-content-2 {
    border: 1px solid rgba(215, 215, 215, 1);
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 13vw;
    text-align: center;
  }
  .check-process .el-form-item {
    margin-bottom: 0;
  }
  .check-process-main {
    width: 342px;
    border: 1px solid rgba(170, 170, 170, 1);
    border-top: none;
    border-radius: 3px;
  }
  .resource_board {
    position: relative;
    // height: 38vw;
    top: -70px;
    .resource_dialogHeader {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50px;
      background-color: #f2f2f2;
      box-sizing: border-box;
      padding: 15px;
    }
  }
  .renyuan {
    display: flex;
    margin-top: 10px;
    height: 60px;
    background-color: rgba(241, 244, 246, 1);
  }
  .renyuaninput {
    // border: 1px solid rgba(215, 215, 215, 1);
    width: 173px;
    height: 30px;
    margin-left: 10px;
    margin-top: 15px;
  }
  .renyuanxingming {
    margin-left: 25px;
    margin-top: 11px;
  }
  .renyuanshouji {
    margin-left: 15px;
    margin-top: 11px;
  }
}
</style>
