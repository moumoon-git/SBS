<template>
  <div>
    <el-dialog
      title="派发工单"
      :close-on-click-modal="false"
      @close="imgDialogVisible=false"
      :visible.sync="visible"
      width="600px"
    >
      <el-form class="formStyle" ref="form" :model="orderData" label-width="80px">
        <p>抓拍图片</p>
        <img
          v-if="orderData.picAbbreviate != null && orderData.picAbbreviate != '' && orderData.picAbbreviate.indexOf('http')>-1"
          :src="orderData.picAbbreviate"
          alt
          style="width:100px;height:100px"
        />
        <img
          v-if="orderData.picPlate != null && orderData.picPlate != '' && orderData.picPlate.indexOf('http')>-1"
          :src="orderData.picPlate"
          alt
          style="width:100px;height:100px"
        />
        <img
          v-if="orderData.bkgPicUrl && orderData.bkgPicMinUrl != '' && orderData.bkgPicUrl.indexOf('http')>-1"
          :data-original="orderData.bkgPicUrl"
          :src="orderData.bkgPicMinUrl"
          alt
          style="width:100px;height:100px"
        />
        <img
          id="image"
          v-if="orderData.facePicUrl != null && orderData.facePicUrl != '' && orderData.facePicUrl.indexOf('http')>-1"
          :src="orderData.facePicUrl"
          alt
          style="width:100px;height:100px"
        />

        <p>过程描述</p>
        <el-input
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
          v-model="orderData.desc"
          resize="none"
        ></el-input>
        <p>通报人员</p>
        <el-row style="margin-bottom:2vh">
          <el-col :span="8">
            <el-input placeholder="请添加人员" v-model="contacts[0]"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button
              icon="el-icon-plus"
              style="background: rgba(255, 255, 255, 1);
                  border: 1px solid rgba(211, 215, 219, 1);
                  border-radius: 2px;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: 400;
                  color: rgba(163, 163, 163, 1);
                  "
              @click="invitedToJoin()"
            >派发联系人</el-button>
          </el-col>
        </el-row>
        <el-row style="text-align:center">
          <el-button
            type="primary"
            size="small"
            v-if="isAuth('mail:mailgroup:save')"
            @click="submit()"
          >提交</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <riskvehiclealarm-contacts
      v-if="riskvehiclealarmContactsVisible"
      ref="riskvehiclealarmContacts"
      @getOrderData="comeData"
    ></riskvehiclealarm-contacts>
  </div>
</template>

<script>
import riskvehiclealarmContacts from "./riskvehiclealarm-contacts";
import Viewer from "viewerjs";

export default {
  props:['index'],
  components: {
    "riskvehiclealarm-contacts": riskvehiclealarmContacts
  },
  data() {
    return {
      imgDialogVisible: false,
      riskvehiclealarmContactsVisible: false,
      visible: false,
      orderData: {
        desc: ""
      },
      contacts: "",
      eventType: ""
    };
  },

  methods: {
     // 预览图片
    initImageTools() {
      //初始化 viewerjs
      const ViewerDom = document.querySelectorAll("#image");
      for (let i in ViewerDom) {
        if(typeof ViewerDom[i]==='object'){
          const viewer = new Viewer(ViewerDom[i], {
            url: "data-original"
          });
        }  
      }
    },
    init(row, eventType, flagType) {
      // console.log(row);
      this.eventType = eventType;
      this.flagType = flagType;
      this.orderData = row;
      this.visible = true;
       this.$nextTick(() => {
            this.initImageTools();
          });
      //   console.log('dflajsdal2132',this.orderData.picAbbreviate)
    },
    invitedToJoin() {
      this.riskvehiclealarmContactsVisible = true;
      this.$nextTick(() => {
        this.$refs.riskvehiclealarmContacts.init(true);
      });
    },
    comeData(data) {
      this.contacts = data;
      // console.log(this.contacts)
    },
    submit() {
      if (this.orderData.desc === "") {
        this.$message({
          message: "请输入过程描述",
          type: "error"
        });
        return;
      } else if (this.contacts[0] === "") {
        this.$message({
          message: "请选择联系人",
          type: "error"
        });
        return;
      } else {
        // console.log("this.contacts",this.contacts)
        this.$confirm("此操作将上传工单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl("/weChatHandleTaskPC/monitoringSendSingle"),
            method: "POST",
            data: this.$http.adornData({
              platformId: this.$store.state.user.platformId,
              platformName: this.$store.state.user.platformName,
              platformTypeId: this.$store.state.user.platformTypeId,
              contactorName: this.contacts[0],
              performTaskOpenId: this.contacts[1],
              performTaskContactorId: this.contacts[2],
              imageUrl: this.orderData.picAbbreviate,
              eventDescription: this.orderData.desc,
              longitude: this.orderData.longitude,
              latitude: this.orderData.latitude,
              title: this.eventType,
              eventTypeName: this.eventType,
              alarmId: this.orderData.id,
              flagType: this.flagType
            })
          })
            .then(({ data }) => {
              if (data.code == 0) {
                this.$message({
                  type: "success",
                  message: "派单成功!"
                });
                this.$emit('upDataTable',this.index)
              } else {
                this.$message({
                  type: "info",
                  message: "派单失败!"
                });
              }
            })
        }).catch(() => {});
      }
    }
  }
};
</script>

<style lang="scss">
.el-dialog__body {
  padding-top: 0;
}
.el-input {
  width: 100%;
}
</style>
