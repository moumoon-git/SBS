import { createClient } from '@/assets/js/uds/useUDS.js';

export default {
  data() {
    return {
      uds: null, // 与调度台通信方法
    };
  },
  created() {
    this.uds = createClient();
  },
  beforeDestroy() {
    this.uds.disconnect();
  },
  methods: {
    /**
     * @description 拨打电话
     * @param { string | number } contactorId 联系人ID
     * @param { string | number } phoneNum 电话号码
     * @param { string | number } eventId 事件ID
     */
    makePhoneCall(phoneNum, contactorId, contactorName, eventId) {
      console.log('调用uds打电话：', phoneNum, contactorId, contactorName, eventId);
      // 坐席信息
      if (this.$cookie.get('seatInformation') === 'null') {
        this.$message.warning('请先登录坐席');
        return false;
      }
      let contactor = {
        phone: phoneNum,
        type: 1, // 类型1普通电话，类型8视频电话
        name: contactorName || '',
        id: contactorId || '',
      };
      // params 字段为前端自助存储的字段，传什么字段，接口就保存什么字段到数据库。
      const params = [
        {
          key: 'eventId',
          value: eventId,
          type: 1, // 类型1普通电话，类型8视频电话
        },
      ];
      // 没有联系人id时候，通过接口查询
      if (!contactorId) {
        this.findContactorByMobile(phoneNum).then((res) => {
          if (res) {
            contactor.id = res.id;
            contactor.name = res.name;
          } else {
            contactor.id = '';
            contactor.name = '';
          }
          this.uds.makePhoneCall(contactor, params);
        });
      } else {
        this.uds.makePhoneCall(contactor, params);
      }
    },

    /**
     * @description 根据电话查找联系人信息
     * @param {string | number} phone
     */
    findContactorByMobile(phone) {
      return new Promise((resolve, reject) => {
        this.$api.findContactorByMobile({ phoneNum: phone }).then((res) => {
          if (res.errorcode !== 0) {
            this.$message.error(res.msg);
            return;
          }
          resolve(res.mailContactor);
        }).catch((error) => {
          reject(error);
        });
      });
    },
  },
};
