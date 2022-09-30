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
        ref="terminalForm"
        :model="terminalForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-form-item label="终端名称:" prop="name">
            <el-input v-model="terminalForm.name"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="终端号码:" prop="uri">
            <el-input v-model="terminalForm.uri"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="视频点名:">
            <el-col :span="1">
              <el-checkbox-group v-model="terminalForm.roll">
                <el-checkbox :true-label="1" :false-label="0"></el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="23" style="text-align: left">(勾选后才可以在视频点名中邀请此成员)</el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地点:" prop="incidentSite">
            <el-input
              type="text"
              v-model.trim="terminalForm.incidentSite"
              show-word-limit
              :title="terminalForm.incidentSite"
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
      <el-row>选择分组</el-row>
      <el-row>
        <div class="tree">
          <el-scrollbar style="height: 100%">
            <el-tree
              :data="treeData"
              ref="tree"
              show-checkbox
              node-key="id"
              :default-checked-keys="groupIds"
              :props="defaultProps"
            ></el-tree>
          </el-scrollbar>
        </div>
      </el-row>

      <el-row>
        <el-button type="primary" @click="submit">保存并关闭</el-button>
      </el-row>
    </el-dialog>
    <!--选择地点-->
    <location ref="loction" :mapframe="mapId"></location>
  </div>
</template>

<script>
import Location from "@/yz_components/loction/loction"; //定位
export default {
  name: "terminalDialog",
  data() {
    return {
      title: "",
      isDialogVisible: false,
      treeData: [],
      terminalForm: {
        id: "", //id
        name: "", //终端名称
        uri: "", //终端好吗
        roll: "", //是否视频点名
        incidentSite: "", //地点
      }, //终端详细信息
      rules: {
        name: [{ required: true, message: "请输入终端名称", trigger: "blur" }],
        uri: [{ required: true, message: "请输入终端号码", trigger: "blur" }],
        incidentSite: [
          { required: true, message: "请选择地点", trigger: "blur" },
        ],
      }, //验证规则
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
    this.getTerminalGroupListData();
  },
  methods: {
    //获取终端分组
    getTerminalGroupListData() {
      let data = {
        displayDefault: false,
      };
      this.$api.terminalGroupList(data).then((res) => {
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
    //关闭模态框
    closeDialog() {
      this.isDialogVisible = false;
      this.$nextTick(() => {
        this.$refs["terminalForm"].resetFields();
        this.terminalForm = {
          id: "", //id
          name: "", //终端名称
          uri: "", //终端好吗
          roll: "", //是否视频点名
          incidentSite: "", //地点
        }; //终端详细信息
        this.$refs.tree.setCheckedKeys([]);
      });
    },
    //模态框确认方法
    submit() {
      this.$refs["terminalForm"].validate((valid) => {
        if (valid) {
          if (this.title == "新增终端信息") {
            this.addTalkGroupInfo();
          }
          if (this.title == "修改终端信息") {
            this.editTalkGroupInfo();
          }
        } else {
          return false;
        }
      });
    },
    //把表格内属性显示到列表中
    showData(row) {
      this.terminalForm.id = row.id;
      this.terminalForm.name = row.name;
      this.terminalForm.uri = row.uri;
      this.terminalForm.roll = row.roll;
      this.terminalForm.incidentSite = row.address;
      if (row.groupIds != 0) {
        this.groupIds = row.groupIds;
      }
    },
    //添加终端信息
    addTalkGroupInfo() {
      let data = {
        groupId: this.$refs.tree.getCheckedKeys(),
        displayName: this.terminalForm.name,
        number: this.terminalForm.uri,
        tiRoll: this.terminalForm.roll,
        longitude: this.longitude,
        latitude: this.latitude,
        address: this.terminalForm.incidentSite,
      };
      this.$api.addTalkGroupInfo(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.$message.success("新增成功");
        this.closeDialog();
        this.$emit("getTerminalListData");
      });
    },
    //修改终端信息
    editTalkGroupInfo() {
      let data = {
        id: this.terminalForm.id,
        groupId: this.$refs.tree.getCheckedKeys(),
        displayName: this.terminalForm.name,
        number: this.terminalForm.uri,
        tiRoll: this.terminalForm.roll,
        dLongitude: this.longitude,
        dLatitude: this.latitude,
        vcAddress: this.terminalForm.incidentSite,
      };
      this.$api.editTalkGroupInfo(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.$message.success("修改成功");
        this.closeDialog();
        this.$emit("getTerminalListData");
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
        this.terminalForm.incidentSite = obj.data.object.address;
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
