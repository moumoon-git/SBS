<!-- 筛选器 -->
<template>
  <div class="search-condition-container">
    <el-form class="search-condition-container_form">
      <el-form-item label="事发时间" class="form-item">
        <el-date-picker
          v-model="condition.incidentTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="big"
        />
      </el-form-item>

      <el-form-item label="事件标题" class="form-item">
        <el-input
          v-model="condition.title"
          placeholder="请输入事件标题"
          size="big"
          clearable
        />
      </el-form-item>

      <el-form-item label="上报平台" class="form-item">
        <el-cascader
          ref="platformRef"
          v-model.trim="condition.platformId"
          :options="platformOptions"
          :props="{
            value: 'id',
            label: 'platformName',
            checkStrictly: true,
            children: 'children'
          }"
          :show-all-levels="false"
          size="big"
          clearable
          filterable
        />
      </el-form-item>

      <el-button
        size="big"
        type="primary"
        @click="handleSearch"
      >
        搜索
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SearchCondition',
  data() {
    return {
      condition: {
        incidentTime: [], // 事发时间
        title: '', // 标题
        platformId: '', // 上报平台
      },
      platformOptions: [], // 上报平台
    };
  },
  watch: {
    condition: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.$emit('change', newVal);
      },
    },
    // 解决级联选择器点击不关闭的问题
    'condition.platformId': {
      deep: true,
      immediate: true,
      handler() {
        if (this.$refs.platformRef) {
          const children = this.$refs.platformRef.getCheckedNodes();
          if (children.length > 0 && children[0].children.length < 1) {
            // 判断有没有下级
            this.$refs.platformRef.dropDownVisible = false; // 监听值发生变化就关闭它
          }
        }
      },
    },
  },
  mounted() {
    // 获取下级平台列表
    this.getChildrenPlatform();
  },
  methods: {
    /**
     * @description 搜索
     */
    handleSearch() {
      this.$emit('search', this.condition);
    },
    /**
     * @description 获取下级平台列表
     */
    getChildrenPlatform() {
      const request = {
        method: 'get',
        baseURL: `${window.SITE_CONFIG.baseUrl}`,
        url: '/sys/platform/getChildrenPlatform',
      };
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          this.platformOptions = response.data.data || [];
        } else {
          this.$message.error(`获取下级平台列表失败，错误代码${response.data.errorcode}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取下级平台列表失败，错误信息：${error}`);
      });
    },
  },
};
</script>

<style lang="scss">
.search-condition-container {

  &_form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .form-item {
      display: flex !important;
      align-items: center !important;
      margin: 10px 10px 10px 0 !important;
      box-sizing: border-box;
    }
  }
}

</style>

<style>
.search-condition-container >>> .el-form-item {
  display: flex !important;
  align-items: center !important;
  margin-right: 20px !important;
  margin-bottom: 10px !important;
  box-sizing: border-box;
}
</style>
