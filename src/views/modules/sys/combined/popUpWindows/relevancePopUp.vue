<template>
  <div>
    <el-dialog
      :title="selectFlag ? '批量关联事件' : '关联事件'"
      :visible.sync="relevancePopUp_wrpaFlag"
      width="30%"
    >
      <div
        v-if="selectFlag"
        class="selectedx"
      >
        <span>已选电话:{{ selectLength }}</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
      >
        <el-form-item
          label="关联事件："
          prop="idvalue"
        >
          <el-select
            v-model="form.idvalue"
            clearable
          >
            <el-option
              v-for="(item) in selectData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="relevancePopUp_wrpaFlag = false">取 消</el-button>
        <el-button
          type="primary"
          @click="save"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from '@/views/common/js/eventBus';
import url from '../../../../../mock/modules/url';

export default {
  name: 'RelevancePopUp',
  data() {
    return {
      relevancePopUp_wrpaFlag: false,
      selectLength: '',
      selectFlag: false,
      selectData: [],
      form: {
        idvalue: '',
      },
      allId: [],
    };
  },
  mounted() {},
  methods: {
    init(data) {
      this.selectData = [];
      this.form.idvalue = '';
      this.allId = [];
      this.relevancePopUp_wrpaFlag = true;
      if (data.length > 1) {
        this.selectFlag = true;
        this.selectLength = data.length;
        const arr = [];
        data.forEach((ele, index) => {
          arr.push(ele.id);
        });
        this.allId = arr;
      } else {
        this.selectFlag = false;
        this.allId.push(data[0].id);
        this.form.idvalue = data[0].eventId;
      }
      this.requerEmergencyList();
    },
    close() {
      this.relevancePopUp_wrpaFlag = false;
    },
    requerEmergencyList() {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/event/getAll`,
        method: url.emergencyList.method,
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.errorcode === 0) {
          const optionList = [];
          data.data.forEach((item) => {
            optionList.push({
              value: item.id,
              label: `${item.title}`,
            });
          });
          this.selectData = optionList;
        }
      });
    },
    requer() {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/history/phone/updateCdrs`,
        method: 'post',
        data: this.$http.adornParams({
          ids: this.allId,
          eventId: this.form.idvalue,
        }),
      }).then((res) => {
        if (res.data.errorcode === 0) {
          // console.log(res)
          bus.$emit('refsh');
          this.$message.success('关联成功');
        } else {
          this.$message.error(res.data.msg);
        }
        this.relevancePopUp_wrpaFlag = false;
      });
    },
    save() {
      // 取消关联事件id可传空
      // if (this.form.idvalue) {
      this.requer();
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  background: #ccc;
  text-align: center;
}
</style>
