<template>
  <div class="contairdaDada">
    <el-form class="formStyle" ref="form" :model="form" label-width="80px">
      <!-- <el-button
          type="primary"
          @click="kscreenshot()"
          style="margin-bottom:10px"
      >截图视频</el-button>-->
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :http-request="uploadSectionFile"
        :before-remove="removePictureCard"
        :before-upload="beforeAvatarUpload"
        :file-list="imageUrl"
        :on-error="handleError"
        multiple
      >
        <i class="el-icon-plus"></i>
        <span>请上传图片</span>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="80%" :src="dialogImageUrl" alt />
      </el-dialog>
      <p>过程描述</p>
      <el-input
        type="textarea"
        :rows="6"
        placeholder="请输入内容"
        v-model="form.desc"
        resize="none"
      ></el-input>
      <p>通报人员</p>
      <!-- <el-input
        type="textarea"
        :rows="6"
        placeholder="请添加人员"
        :value="selectContact"
        resize="none"
        readonly
      ></el-input> -->
      <el-row>
        <!-- <el-button
          icon="el-icon-plus"
          style="
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(211, 215, 219, 1);
            border-radius: 2px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: rgba(163, 163, 163, 1);
            margin: 1vh 0;
          "
          @click="invitedToJoin()"
          >新增联系人</el-button
        > -->
        <sv-select-contact
          v-model="infoMembers"
          title="通报人员"
          :multiple="true"
          :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
        />
      </el-row>
      <el-row>
        <el-input
          @input="ttt"
          v-model="workPlace"
          style="width: 80%; margin-bottom: 1vh"
          placeholder="请输入定点或手动定位"
        ></el-input>
        <!-- <input v-model="workPlace" type="text"> -->
        <!--
          @author tanjinfeng
          @date 2020-11-28
          @description 图标重做
        -->
        <!-- *** 原来的代码 *** -->
        <!-- <img
          class="location-icon"
          src="./img/location-active.png"
          alt="定位icon"
          @click="mapShow"
          v-if="workPlace"
        />
        <img
          class="location-icon"
          src="./img/location-inactive.png"
          alt="定位icon"
          @click="mapShow"
          v-else
        /> -->
        <!-- *** 修改后的代码 *** -->
        <div
          :class="['location-icon', { 'location-icon--active': !!workPlace }]"
          @click="location"
        ></div>
        <!-- *** 结束 *** -->
      </el-row>
      <el-row>
        <el-select v-model="eventTypeName" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          v-if="isAuth('mail:mailgroup:save')"
          @click="submit"
          >提交</el-button
        >
      </el-row>
    </el-form>

    <!-- 地图弹窗 -->
    <LocationDialog ref="LocationDialogRef" />
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import bus from "../../../common/js/eventBus";
import LocationDialog from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';

export default {
  props: ["selectInvitedToJoinList", "reportParams"],
  components: {
    LocationDialog,
  },
  created() {
    this.chooseType();
  },
  data() {
    return {
      form: {
        desc: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      selectContact: "",
      imageUrl: [],
      workPlace: "",
      dataForm: {
        id: 0,
      },
      visible: false,
      type: 0,
      options: [], //类型选项
      eventTypeName: "", //事件类型名字
      // 通报人员
      infoMembers: [],
      longitude:"",
      latitude:"",
      cgcsLatitude: '',
      cgcsLongitude: '',
    };
  },
  watch: {
    selectInvitedToJoinList(newV) {
      console.log("newV: ", newV);
      this.selectContact = "";
      newV.map((v) => {
        this.selectContact += v.name + ",";
      });
      this.selectContact = this.selectContact.substring(
        0,
        this.selectContact.length - 1
      );
      console.log("this.selectInvitedToJoinList: ", newV);
    },
  },
  methods: {
    ttt(val) {
      console.log(val);
    },
    init(id, currenTreeObject, type) {
      var that = this;
      this.dataForm.id = id || 0;
      this.visible = true;
      this.type = type;
    },

    // 新增联系人
    invitedToJoin() {
      this.$emit("invitedToJoin");
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // console.log('this.dialogImageUrl++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++',this.dialogImageUrl)
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
        console.log('file: ', file);
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif' && file.type !== 'image/svg+xml') {
        this.$message.error('请选择图片进行上传');
        return false;
      }
    },
    uploadSectionFile(param) {
        console.log('param: ', param);
      // console.log(this.reportParams.townId)
      let form = new FormData();
      form.append("file", param.file);
      // console.log(param.file)
      // console.log(param.file);
      this.$api.uploadMeetingImg(form)
        .then(({ data }) => {
        //   console.log('data++++++++++++++++++++++++++++++++++++++',data)
          if (data) {
            this.imageUrl.push({ name: data.fileName, url: data.allUrl ,filePath:data.url});
          } else {
              this.imageUrl = this.imageUrl.filter(v=>v.name != param.file.name)
            this.$message.error("上传失败");
          }
        })
        .catch((err) => {
            console.log('err: ', err);

        });
    },
    removePictureCard(file) {
      // console.log('file: ', file);
      this.imageUrl.map((v, index) => {
        if (v.name == file.name) {
          this.imageUrl.splice(index, 1);
          this.$emit('delSelectImg', file.name);
        }
      });
      console.log(this.imageUrl);
    },
    submit() {
      // 上传多张图片
      let imageUrl = "";
      this.imageUrl.map((v) => {
        imageUrl += v.filePath + ",";
      });
      imageUrl = imageUrl.substring(0, imageUrl.length - 1);
      // console.log(imageUrl)
      // console.log(this.selectInvitedToJoinList)
      if (this.form.desc === "") {
        this.$message({
          message: "请输入过程描述",
          type: "error",
        });
        return;
      } else if (this.infoMembers.length === 0) {
        this.$message({
          message: "请选择联系人",
          type: "error",
        });
        return;
      } else {
        this.$confirm("此操作将上传工单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
              let data = {
                platformId: this.$store.state.user.platformId,
                platformName: this.$store.state.user.platformName,
                platformTypeId: this.$store.state.user.platformTypeId,
                contactorName: this.infoMembers[0].name || "",
                performTaskOpenId: this.infoMembers[0].openId || "",
                performTaskContactorId:
                  this.infoMembers[0].id || "",
                mailContactorIds: this.infoMembers.map((v) => v.id),
                imageUrl,
                eventDescription: this.form.desc,
                // townId: this.reportParams.parentId,
                // townName: this.reportParams.parentName,
                // longitude: this.reportParams.longitude,
                // latitude: this.reportParams.latitude,
                // eventPosition: this.reportParams.eventPosition,
                title: "视频监控",
                eventTypeName: this.eventTypeName == ""? "视频监控" : this.eventTypeName,
                first: "您被分配了一个任务",
                content: "cs",
                remark: "请尽快核实并处置",
                flagType: 9,
                alarmId: 10081,
                eventPosition: this.workPlace,
                cgcsLatitude: this.dataForm.cgcsLatitude,
                cgcsLongitude: this.dataForm.cgcsLongitude,
              }
            this.$api.saveMeetingRecord(data).then(( res ) => {
                console.log('res: ', res);
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: "派单成功!",
                });
                this.form.desc = "";
                this.infoMembers = "";
              } else {
                this.$message({
                  type: "info",
                  message: "派单失败!",
                });
              }
            });
          })
          .catch(() => {});
      }
    },
    kscreenshot() {
      // bus.$emit('snap')
      bus.$emit("snap");
    },
    location() {
      this.$refs.LocationDialogRef.open({
        longitude: this.longitude,
        latitude: this.latitude,
        address: this.workPlace,
        cgcsLongitude: this.cgcsLongitude,
        cgcsLatitude: this.cgcsLatitude
      }).then(({
        longitude,
        latitude,
        address,
        cgcsLongitude,
        cgcsLatitude
      }) => {
        this.longitude = longitude;
        this.latitude = latitude;
        this.workPlace = address;
        this.cgcsLatitude = cgcsLatitude;
        this.cgcsLongitude = cgcsLongitude;
      });
    },
    //类型选择
    chooseType(){
      this.$http({
        url: this.$http.adornUrl("/sys/sysdictionary/getSysDictionaryListByCode?code=JTYHLX"),
         method: "get",
         params: this.$http.adornParams({}),
      }).then(data=>{
        console.log('选择类型',data);
        this.options = data.data.data
      })
    },
    handleError(err){
        console.log('err: ', err);
    }
  },
};
</script>
<style lang="scss">
  .contairdaDada {
    .el-form.formStyle {
      height: 677px;
      width: 22vw;
      border: 1px solid #ccc;
      margin-top: 1vh;
      padding: 1vh 1vw 0;
      box-sizing: border-box;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      & {
        -ms-overflow-style: none;
      }
      & {
        overflow: -moz-scrollbars-none;
      }
      /deep/ .el-row{
        /deep/ .el-select{
          width: 300px;
        }
      }
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .demonstration {
      display: block;
      color: #8492a6;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .wrapper {
      #divUL {
        div {
          margin: 0.2vh 0.2vw 0.2vh 0;
        }
      }
    }
  }
.location-icon {
  vertical-align: middle;
  display: inline-block;
  width: 36px;
  height: 38px;
  background: no-repeat center/100% 100% url('./img/location-inactive.png');
  cursor: pointer;
  &--active {
    background-image: url('./img/location-active.png');
  }
}
</style>
