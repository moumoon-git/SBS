<template>
  <div>
    <div v-if="disFlag" class="move">
      <div class="content_wrap">
        <header class="header">
          联系人信息
          <img
            class="colse"
            src="data:image/png;base64,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"
            alt=""
            @click="disFlag = false"
          />
        </header>
        <div class="content">
          <div class="minWarp">
            <div><span>姓</span><span>名：</span></div>
            <span class="disField">{{ detl.name ? detl.name : '' }}</span>
          </div>
          <div class="minWarp">
            <div><span>性</span><span>别：</span></div>
            <span class="disField">{{
              detl.sex === 0
                ? '男'
                : detl.sex === 1
                  ? '女'
                  : '未知'
            }}</span>
          </div>
          <div class="minWarp">
            <div>单位：</div>
            <span class="disField">{{
              detl.workUnit ? detl.workUnit : ''
            }}</span>
          </div>
          <div class="minWarp">
            <div>
              <span>职</span>
              <span class="disField">务：</span>
            </div>
            <span class="disField">{{
              detl.position ? detl.position : ''
            }}</span>
          </div>
          <div class="minWarp">
            <div>所属分组：</div>
            <span class="disField">{{ detl.group ? detl.group : '' }}</span>
          </div>
          <div class="minWarp">
            <div class="phoneNum">手机号码：</div>
            <span class="disField">{{ detl.mobile1 ? detl.mobile1 : '' }}</span>
            <img
              v-if="detl.mobile1"
              class="disImg"
              src="data:image/png;base64,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"
              alt=""
              @click="callPhones(detl.mobile1)"
            />
          </div>
          <div class="minWarp">
            <div>办公电话：</div>
            <span class="disField">{{
              detl.officeTel ? detl.officeTel : ''
            }}</span>
            <img
              v-if="detl.officeTel"
              class="disImg"
              src="data:image/png;base64,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"
              alt=""
              @click="callPhones(detl.officeTel)"
            />
          </div>
          <div class="minWarp">
            <div>家庭电话：</div>
            <span class="disField">{{ detl.homeTel ? detl.homeTel : '' }}</span>
            <img
              v-if="detl.homeTel"
              class="disImg"
              src="data:image/png;base64,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"
              alt=""
              @click="callPhones(detl.homeTel)"
            />
          </div>
          <!-- <div class="minWarp"><div>传真号码：</div>
                  <span class="disField">{{detl.fax?detl.fax:''}}</span>
                </div> -->
          <!-- <div class="minWarp">
            <div>电子邮箱：</div>
            <span class="disField">{{ detl.email ? detl.email : '' }}</span>
          </div> -->
        </div>
        <img
          class="positiAbs"
          :src="
            detl.images
              ? (detl.images.toLowerCase().startsWith('http')
                ? detl.images : $window.SITE_CONFIG.cloudUrl + detl.images)
              : 'data:image/png;base64,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'
          "
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script>
import url from '@/mock/modules/url';

export default {
  name: 'LookDetails',
  inject: ['combined'],
  data() {
    return {
      disFlag: false,
      detl: {},
    };
  },
  mounted() {},
  methods: {
    init(data) {
      //  渲染数据的方法
      // console.log('查看联系人', data)
      this.$http({
        url: this.$http.adornUrl(
          `${url.phoneUserInfo.url}/${
            data.id || data.i_contact_id || data.i_id
          }`,
        ),
        method: url.phoneUserInfo.method,
        data: this.$http.adornParams(),
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          // console.log(res.data.mailContactor)
          this.detl = res.data.mailContactor;
          this.detl.phoneNum = res.data.mailContactor.mobile1;
          this.detl.unit = res.data.mailContactor.workUnit;
          this.detl.duty = res.data.mailContactor.position;
          this.detl.type = 1;
          this.disFlag = true;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    callPhones(number) {
      // console.log(this.detl);
      this.callPhone(this.detl);
      this.combined.uds.makePhoneCall({
        phone: number,
        type: 1,
        name: this.detl.name,
        id: this.detl.id,
      });
    },
  },
};
</script>

<style scoped>
.move {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content_wrap {
  width: 423px;
  border-radius: 8px;
  background-color: #ffffff;
  box-sizing: border-box;
  font-family: '微软雅黑';
  color: #333333;
  text-align: center;
  line-height: normal;
  overflow: hidden;
  position: relative;
}
.header {
  display: flex;
  background: rgba(241, 244, 246, 1);
  width: 100%;
  height: 40px;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  position: relative;
  font-weight: bolder;
  border-radius: 5px 5px 0px 0px;
}
.colse {
  position: absolute;
  width: 17px;
  height: 15px;
  top: 12px;
  right: 20px;
  cursor: pointer;
}
.content {
  padding: 37px 35px 25px;
}
.minWarp {
  width: 100%;
  display: flex;
  font-size: 14px;
  position: relative;
}
.minWarp > div {
  width: 80px;
  min-width: 80px;
  display: flex;
  justify-content: space-between;
  margin-right: 10px;
  margin-bottom: 32px;
  color: #999;
}
.positiAbs {
  position: absolute;
  top: 59px;
  right: 25px;
  width: 128px;
  height: 157px;
}
.phoneNum {
  position: relative;
}
.phoneNum:before {
  content: '*';
  position: absolute;
  color: #f56c6c;
  left: -10px;
}
.disField {
  display: inline-block;
  margin-right: 10px;
  /*width: 100px;*/
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*white-space: nowrap;*/
  /*text-align: left;*/
}
.disImg {
  width: 18px;
  height: 18px;
  margin-top: 3px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
