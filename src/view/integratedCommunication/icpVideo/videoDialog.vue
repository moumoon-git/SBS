<!--@author：llp-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-form
        ref="videoForm"
        :model="videoForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-form-item label="设备信息:" prop="name">
            <el-input v-model="videoForm.name"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="设备号码:" prop="indexCode">
            <el-input v-model="videoForm.indexCode"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="显示名称:" prop="deviceName">
            <el-input v-model="videoForm.deviceName"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地点:" prop="incidentSite">
            <el-input
              type="text"
              v-model.trim="videoForm.incidentSite"
              show-word-limit
              :title="videoForm.incidentSite"
            >
              <template slot="append">
                <el-button style="letter-spacing: 6px" @click="location">
                  <i class="el-icon-location-outline"></i>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row> 选择分组 </el-row>
      <el-row>
        <div class="tree">
          <el-scrollbar style="height: 100%">
            <el-tree
              :data="treeData"
              ref="tree"
              show-checkbox
              :check-on-click-node="true"
              node-key="id"
              :default-checked-keys="groupIds"
              :props="defaultProps"
            >
            </el-tree>
          </el-scrollbar>
        </div>
      </el-row>
      <el-row>
        <el-button type="primary" @click="saveVideo">保存并关闭</el-button>
      </el-row>
    </el-dialog>

    <!--选择地点-->
    <location ref="loction" :mapframe="mapId"></location>
  </div>
</template>

<script>
import Location from "@/components/loction/loction"; //定位
export default {
  name: "videoDialog",
  data() {
    return {
      title: "视频设备信息",
      isDialogVisible: false,
      treeData: [],
      isUpdateName: "false", //控制显示名称是否可以进行编辑
      isSave: true, //是否展示保存并关闭按钮
      videoForm: {
        id: "", //设备id
        name: "", //设备信息
        indexCode: "", //设备号码
        deviceName: "", //显示名称
        incidentSite: "", // 地点
      }, //视频详细信息
      rules: {
        name: [{ required: true, message: "请输入设备信息", trigger: "blur" }],
        indexCode: [
          { required: true, message: "请输入设备号码", trigger: "blur" },
        ],
        incidentSite: [
          { required: true, message: "请选择地点", trigger: "blur" },
        ],
      }, //视频验证规则
      groupIds: [], //选中的树分组
      defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true,
      },
      mapId: "informId",
      longitude: "",
      latitude: "",
    };
  },
  components: {
    Location,
  },
  created() {
    window.addEventListener("message", this.locationCallback);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.locationCallback);
  },
  mounted() {
    this.getVideoGroupTree();
  },
  methods: {
    //获取视频分组树
    getVideoGroupTree() {
      let data = {
        displayDefault: false,
      };
      this.$api.videoGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.treeData = res.data;
      });
    },
    //获取视频分组树并禁用
    getDisableVideoGroupTree() {
      let data = {
        displayDefault: false,
      };
      this.$api.videoGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        res.data.forEach((item) => {
          item["disabled"] = true;
          if (item.children.length !== 0) {
            item.children.forEach((item) => {
              item["disabled"] = true;
            });
          }
        });
        this.treeData = res.data;
      });
    },
    //显示视频详细信息
    showData(row) {
      this.videoForm.id = row.id;
      this.videoForm.name = row.name;
      this.videoForm.indexCode = row.indexCode;
      this.videoForm.deviceName = row.deviceName;
      this.videoForm.incidentSite = row.address;
      if (row.groupIds != 0) {
        this.groupIds = row.groupIds;
      }
    },
    //关闭模态框方法
    closeDialog() {
      this.isSave = true; //关闭模态框时重置保存与关闭按钮的状态
      this.isDialogVisible = false;
      this.$nextTick(() => {
        this.$refs["videoForm"].resetFields();
        this.$refs.tree.setCheckedKeys([]);
      });
    },
    //保存视频方法
    saveVideo() {
      this.$refs["videoForm"].validate((valid) => {
        if (valid) {
          let data = {
            id: this.videoForm.id,
            groupId: this.$refs.tree.getCheckedKeys(),
            displayName: this.videoForm.deviceName,
            name: this.videoForm.name,
            number: this.videoForm.indexCode,
            address: this.videoForm.incidentSite,
            longitude: this.longitude,
            latitude: this.latitude,
          };
          this.$api.videoEditVideoInfo(data).then((res) => {
            if (res.errorcode != 0) {
              this.$message.error(res.msg);
              return;
            }
            this.$message.success("保存成功");
            this.isDialogVisible = false;
            this.$emit("getVideoList");
          });
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 打开定位弹窗
     * @author: xuchuangxing
     * @lastEditor xuchuangxing
     * @updateTime 20200925
     * @param {type}
     * @return {type}
     */
    location() {
      this.$refs.loction.visible = false;
      this.$refs.loction.rushLocation = false;
      this.$nextTick(() => {
        this.$refs.loction.visible = true;
        this.$refs.loction.rushLocation = true;
      });
    },
    /**
     * @description: 获取选中的地理位置信息
     * @author: xuchuangxing
     * @lastEditor xuchuangxing
     * @updateTime 20200925
     * @param {obj} 地理位置信息
     * @return {type}
     */
    locationCallback(obj) {
      if (obj.data.action && obj.data.action == "retpoint") {
        let latlon = obj.data.object.point.split(",");
        this.longitude = latlon[0];
        // console.log(latlon[0], latlon[1]);
        this.latitude = latlon[1];
        this.videoForm.incidentSite = obj.data.object.address;
        this.$refs.loction.visible = false;
      }
    },
  },
};
</script>

<style scoped>
.tree {
  height: 240px;
  background-color: white;
  border: 1px solid rgba(211, 215, 219, 1);
}
</style>
