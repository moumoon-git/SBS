<template>
  <div class="list">
    <!-- 一个卡片单位 -->
    <div class="colStaff" v-for="item in tableData" :key="item.alarmId">
      <div>
        <div
          class="left"
          v-if="
            item.picUrl != null &&
            item.picUrl != '' &&
            item.picUrl.indexOf('http') == -1
          "
        >
          <viewer :images="item.picUrl.split(',')">
            <img
              v-for="(item, index) in item.picUrl.split(',')"
              :src="backgroundURL + item"
              :key="index"
              style="height: 15vh; width: 8vw; min-width: 99px"
            />
          </viewer>
          <img
            id="image"
            :data-original="backgroundURL + item.picUrl"
            :src="backgroundURL + item.thumbnailUrl"
            style="height: 15vh; width: 8vw; min-width: 99px"
          />
        </div>

        <div
          class="left"
          v-if="
            item.picUrl != null &&
            item.picUrl != '' &&
            item.picUrl.indexOf('http') != -1
          "
        >
          <img
            id="image"
            :data-original="item.picUrl.split(',')[0]"
            :src="
              item.thumbnailUrl != null ? item.thumbnailUrl.split(',')[0] : ''
            "
            style="height: 15vh; width: 8vw; min-width: 99px"
          />
        </div>

        <div class="right">
          <ul>
            <li>
              <label>地点:{{ item.orgName }}</label>
              <!--<span style="font-size:14px; color: #fff;background-color: #f56c6c;border-color: #f56c6c;border-radius: 50%;padding: 5px;">
                    <i class="el-icon-close"></i>
              </span>-->
              <!-- <span style="background-color: red"><i class="el-icon-close"></i></span>-->
            </li>
            <li v-if="item.intelligentType">
              <label>类型:{{ item.intelligentType }}</label>
              <span></span>
            </li>
            <li v-if="item.finishedTime">
              <label>时间:{{ item.finishedTime }}</label>
              <span></span>
            </li>
            <li v-if="item.eventDescription">
              <!-- <label>描述:{{item.eventDescription}}</label> -->
              <span></span>
            </li>
            <li v-if="item.status">
              <!-- <label>状态:{{item.status}}</label> -->
              <span></span>
            </li>
            <li>
              <!-- <label>名单库:{{item.listLibName}}</label> -->
              <!-- <span></span> -->
            </li>
            <li>
              <el-button
                type="text"
                size="small"
                v-if="item.eventInfoId"
                @click="formFindHandleClick(item)"
                style="
                  border: none;
                  background: none;
                  color: #479dff;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: bold;
                "
                >查看</el-button
              >

              <!--<el-button type="text" size="small" @click="formUpdateHandleClick(item)"
                       style="border:none;background:none;color:#76D672;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;">编辑
              </el-button>-->

              <el-button
                type="text"
                size="small"
                v-else
                @click="formManuaVerifylHandleClick(item)"
                style="
                  border: none;
                  background: none;
                  color: #76d672;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: bold;
                "
                >派单</el-button
              >

              <!--<span v-if="item.validFlag == 2" @click="updateValidlHandleClick(item)"  style="cursor: pointer;font-size:12px; margin-left:10px; color: #fff;background-color: #f56c6c;border-color: #f56c6c;border-radius: 50%;padding: 3px;">
                    <i class="el-icon-close"></i>
              </span>-->

              <!--<el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top" v-if="item.validFlag == 1">-->
              <!--<span v-if="item.validFlag == 1" @click="updateValidlHandleClick(item)"  style="cursor: pointer;font-size:12px; margin-left:10px; color: #fff;background-color: #85CB61;border-color: #85CB61;border-radius: 50%;padding: 3px;">
                      <i class="el-icon-check"></i>
              </span>-->
              <!--</el-tooltip>-->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import campusPeripheryHeader from "@/views/modules/word/manager/wordheader";
import Viewer from "viewerjs";

export default {
  props: ["tableData"],
  data() {
    return {
      imageUrl: require("../../../../assets/img/load (1).jpg"),
      backgroundURL: window.SITE_CONFIG.cloudUrl,
    };
  },

  methods: {
    // 预览图片
    initImageTools() {
      //初始化 viewerjs
      setTimeout(() => {
        const ViewerDom = document.querySelectorAll("#image");

        for (let i in ViewerDom) {
          if (typeof ViewerDom[i] === "object") {
            // console.log("ViewerDom[i]", ViewerDom[i]);
            const viewer = new Viewer(ViewerDom[i], {
              url: "data-original",
            });
          }
        }
      });
    },
    //查看
    formFindHandleClick(val) {
      //alert("子组件点击查看，触发父组件方法")
      this.$emit("formFindHandleClick", val);
    },
    //编辑
    formManuaVerifylHandleClick(val) {
      this.$emit("formManuaVerifylHandleClick", val);
    },
    //改变有效性
    updateValidlHandleClick(val) {
      this.$emit("updateValidlHandleClick", val);
    },
    reconvert(str) {
      str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
        return String.fromCharCode(
          parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2"))
        );
      });
      return str;
    },
  },
};
</script>
<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}
ul li {
  list-style: none;
}
.list {
  display: flex;
  // justify-content: space-between;
  // align-content: space-between;
  // padding: 0px 5px 0px 10px;
  flex-wrap: wrap;
  min-width: 1207px;
}
// .list:after {
//   content: "";
//   width: 33%;
//   border: 1px solid transparent;
// }
.colStaff {
  width: 24.6%;
  min-width: 293px;
  padding: 13px 10px;
  height: 18vh;
  position: relative;
  margin-top: 5px;
  border: 1px solid #555;
  // display: flex;
  box-sizing: border-box;
  margin-right: 0.3vw;
  // background-color: rgb(231, 240, 190);
  border-radius: 5px;
  box-sizing: border-box;
  overflow: hidden;
  > div {
    display: flex;
    margin-left: 10px;
  }
  .right {
    ul {
      height: 100%;
      padding: 0px 10px 0 15px;
      //   padding-top: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      li {
        font-size: 0.73vw;
        line-height: 3vh;
        text-align: left;
        margin-left: 10px;
        label {
          overflow: hidden; /*自动隐藏文字*/
          text-overflow: ellipsis; /*文字隐藏后添加省略号*/
          white-space: nowrap; /*强制不换行*/
          width: 15em;
          min-width: 143px;
          display: inline-block;
        }
      }
    }
  }
  .left {
    // margin-top: 18px;
    // border: 1px solid #555;
    .el-image {
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
