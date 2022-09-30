<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="110px"
    >
      <el-form-item label="相机名称" prop="name">
        <el-input
          v-model="dataForm.name"
          placeholder="请输入相机名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择分组" prop="groupName">
        <el-dialog
          title="请选择要新增到的分组节点"
          :visible.sync="treeDialogVisible"
          width="30%"
          append-to-body
        >
          <el-tree
            :data="eventTypeList"
            :props="eventTypeListTreeProps"
            node-key="id"
            ref="eventTypeTree"
            @current-change="eventTypeListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="treeDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="treeDialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.groupName"
          placeholder="请选择要添加到的分组名称"
          @focus="gettingfocus"
          readonly
          style="width: 90%"
        ></el-input>
        <el-input v-show="false" v-model="dataForm.groupId" :readonly="true">
        </el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address" style="position: relative">
        <el-input
          v-model="dataForm.address"
          placeholder="请定位地址"
          readonly
          style="width: 90%"
        ></el-input>
        <el-button
          @click="mapDialogVisible = true"
          style="width: 8%"
          type="text"
          icon="el-icon-location-outline"
          >定位</el-button
        >
      </el-form-item>
      <el-form-item label="摄像头类型" style="position: relative">
        <el-select v-model="cameraValue" placeholder="请选择">
          <el-option
            v-for="item in cameraOptions"
            :key="item.value"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="经度" prop="longitude">
        <el-input v-model="dataForm.longitude" placeholder="请输入经度"></el-input>
        <el-button @click="mapDialogVisible = true" style="width:8%"  type="text" icon="el-icon-location-outline">定位</el-button>
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="dataForm.latitude" placeholder="请输入纬度"></el-input>
        <el-button @click="mapDialogVisible = true" style="width:8%"  type="text" icon="el-icon-location-outline">定位</el-button>
      </el-form-item> -->
      <el-dialog title="地图" :visible.sync="mapDialogVisible" append-to-body>
        <div style="height: 580px">
          <div :style="{ width: '100%', height: '500px', float: 'right' }">
            <el-amap-search-box
              style="border: 1px solid #333333"
              :search-option="searchOption"
              :on-search-result="onSearchResult"
            ></el-amap-search-box>
            <el-amap
              id="amapDemo"
              :center="center"
              :zoom="12"
              class="amap-demo"
              :events="events"
              :plugin="plugin"
              v-if="mapDialogVisible"
            >
              <el-amap-marker
                :position="position"
                :events="events"
              ></el-amap-marker>
              <!-- <el-amap-marker v-for="(position,index) in markers" :position="position" :key="index"></el-amap-marker> -->
            </el-amap>
            <div class="toolbar">
              position: [{{ lng }}, {{ lat }}] address: {{ address }}
              <div style="text-align: center">
                <el-button @click="mapDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="LongitudeandLatitude()"
                  >确定</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-form-item label="设备编号" prop="indexCode">
        <el-input
          v-model="dataForm.indexCode"
          placeholder="请输入设备编号"
        ></el-input>
      </el-form-item>
      <!-- v-if="cameraValue == '1'" -->
      <el-form-item label="卡口编码" prop="crossingId">
        <el-input
          v-model="dataForm.crossingId"
          placeholder="请输入卡口编码"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item
        v-if="cameraValue == '2'"
        label="视频预览编码"
        prop="videoCode"
      >
        <el-input
          v-model="dataForm.videoCode"
          placeholder="请输入视频预览编码"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="业务编码" prop="businessCode">
        <el-input
          v-model="dataForm.businessCode"
          placeholder="请输入业务编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="硬件编码" prop="hardwareCode">
        <el-input
          v-model="dataForm.hardwareCode"
          placeholder="请输入硬件编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    let self = this;
    return {
      address: "",
      lng: 0,
      lat: 0,
      treeDialogVisible: false,
      eventTypeList: [],
      eventTypeListTreeProps: {
        label: "name",
        children: "children",
      },
      cameraValue: "",
      cameraOptions: [],
      // [
      //   {
      //     value: "",
      //     label: "所有摄像头",
      //   },
      //   {
      //     value: "0",
      //     label: "人的摄像头",
      //   },
      //   {
      //     value: "1",
      //     label: "车的摄像头",
      //   },
      //   {
      //     value: "2",
      //     label: "预览的摄像头",
      //   },
      // ]
      plugin: [{ pName: "Geolocation" }],
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
                self.$nextTick();
              }
            }
          });
        },
      },
      center: [113.3245904, 23.1066805],
      position: [113.3245904, 23.1066805],
      searchOption: {
        city: "广州",
        citylimit: false,
      },
      mapDialogVisible: false,
      options: [
        { value: 1, label: "可用" },
        { value: 0, label: "不可用" },
      ],
      visible: false,
      dataForm: {
        id: 0,
        name: "",
        address: "",
        longitude: "",
        latitude: "",
        indexCode: "",
        crossingId: "",
        videoCode: "",
        businessCode: "",
        hardwareCode: "",
        status: "",
        groupName: "",
        groupId: "",
      },
      dataRule: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        address: [{ required: true, message: "不能为空", trigger: "change" }],
        longitude: [
          { required: true, message: "经度不能为空", trigger: "blur" },
        ],
        latitude: [
          { required: true, message: "纬度不能为空", trigger: "blur" },
        ],
        indexCode: [
          { required: true, message: "设备编号不能为空", trigger: "blur" },
        ],
        crossingId: [
          { required: true, message: "卡口编码不能为空", trigger: "blur" },
        ],
        videoCode: [
          { required: true, message: "视频预览编码不能为空", trigger: "blur" },
        ],
        status: [
          {
            required: true,
            message: "状态不能为空",
            trigger: "change",
          },
        ],
        groupId: [
          { required: true, message: "分组选择不能为空", trigger: "change" },
        ],
        groupName: [
          { required: true, message: "分组选择不能为空", trigger: "change" },
        ],
      },
      treeGroupName: '', // 树节点的分组名字
      treeGroupId: '', // 树节点的分组Id
    };
  },
  methods: {
    /**
     * @description: 当前选中节点变化时触发
     * @param {*}
     * @return {*}
     */
    eventTypeListTreeCurrentChangeHandle(data, node) {
      // console.log(data,node);
      this.dataForm.groupName = data.name;
      this.dataForm.groupId = data.id;
    },
    /**
     * @description: 当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
     * @param {}
     * @return {}
     */
    gettingfocus() {
      this.treeDialogVisible = true;
      this.$http({
        url: this.$http.adornUrl(`/risk/riskcameragroup/tree`),
        method: "get",
      }).then((data) => {
        this.eventTypeList = treeDataTranslate(data.data.data, "id");
      });
    },
    //获取摄像头类型
    getCameraType() {
      this.cameraOptions = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=VIDEO_CAMERA_TYPE`
        ),
        method: "get",
      }).then(({ data }) => {
        // data.data.forEach((item) => {
        //   this.cameraOptions.push({ value: item.code, label: item.name });
        // });
        this.cameraOptions = data.data;
      });
    },
    recursion(temporaryArray, id) {
      console.log("csshuzu", temporaryArray, id);
      var item;
      for (let i = 0; i < temporaryArray.length; i++) {
        if (temporaryArray[i].children) {
          console.log(
            "temporaryArray[i].children",
            temporaryArray[i].name,
            temporaryArray[i].children
          );
          item = this.recursion(temporaryArray[i].children, id);
        }
        if (temporaryArray[i].id == id) {
          item = temporaryArray[i];
          break;
        }
      }
      return item;
    },
    init(id) {
      this.$http({
        url: this.$http.adornUrl(`/risk/riskcameragroup/tree`),
        method: "get",
      }).then((data) => {
        // this.eventTypeList = treeDataTranslate(data.data.data, "id");
        this.eventTypeList = data.data.data;
      });
      // this.getCameraType();
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.getCameraType();
        this.dataForm.indexCode = "";
        this.dataForm.crossingId = "";
        this.dataForm.groupName = this.treeGroupName; //获取树节点分组的名字
        this.dataForm.groupId = this.treeGroupId; //获取树节点分组的名字
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/risk/riskcamera/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              if (!data.riskCamera.groupId) {
                this.dataForm.groupName = "";
              } else {
                // this.dataForm.groupName = this.recursion(
                //   this.eventTypeList,
                //   data.riskCamera.groupId
                // );
                this.dataForm.groupName = data.riskCamera.groupName;
              }

              console.log(
                "xxxxxxxxxxxx",
                this.cameraOptions,
                this.dataForm.groupName
              );
              this.dataForm.name = data.riskCamera.name;
              this.dataForm.address = data.riskCamera.address;
              this.dataForm.longitude = data.riskCamera.longitude;
              this.dataForm.latitude = data.riskCamera.latitude;
              this.dataForm.indexCode = data.riskCamera.indexCode;
              this.dataForm.crossingId = data.riskCamera.crossingId;
              this.dataForm.videoCode = data.riskCamera.videoCode;
              this.dataForm.businessCode = data.riskCamera.businessCode;
              this.dataForm.hardwareCode = data.riskCamera.hardwareCode;
              this.dataForm.groupId = data.riskCamera.groupId;
              this.cameraValue = data.riskCamera.cameraType + "";

              this.dataForm.status = data.riskCamera.status;
            }
          });
        }
      });
    },
    //地图提交
    LongitudeandLatitude() {
      this.dataForm.longitude = this.lng;
      this.dataForm.latitude = this.lat;
      this.dataForm.address = this.address;
      this.mapDialogVisible = false;
    },
    //地图搜索回调事件
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
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/risk/riskcamera/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              address: this.dataForm.address,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              indexCode: this.dataForm.indexCode,
              crossingId: this.dataForm.crossingId,
              videoCode: this.dataForm.videoCode,
              businessCode: this.dataForm.businessCode,
              hardwareCode: this.dataForm.hardwareCode,
              status: this.dataForm.status,
              cameraType: this.cameraValue,
              groupId: this.dataForm.groupId,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
