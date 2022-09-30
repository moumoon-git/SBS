<template>
<!-- 乾坤统一加载页面 -->
<div>
  <MFC
    :module="microModule"
    :data="data"
  />
</div>
</template>

<script>
import MFC from '@/components/MicroFEContainer/MicroFEContainer.vue';

export default {
  name: 'MFE',
  components: {
    MFC,
  },
  data() {
    return {
      microModule: '', // 对应跳转模块
      data: {}, // 传出参数
    }
  },
  mounted() {
    this.microModule = this.$route.meta.microModule.module || '';
    this.getModuleData();
  },
  methods: {
    // 配置不同乾坤模块的传参
    getModuleData() {
      switch(this.microModule) {
        // 任务管理
        case 'TaskManager':
          this.data = {
            ...(this.$route.query.event),
            isJump: (this.$route.query.event!==null)&&(this.$route.query.isJump),
          }
          console.log('模块传参：', this.data);
        break;
        default:
          this.data = {}
        break;
      }
    }
  }
};
</script>
