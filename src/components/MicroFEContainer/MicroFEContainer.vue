<template>
  <div class="micro-front-end__container">
    <div :id="uuid" style="width:100%;height:100%;"/>
  </div>
</template>

<script>
import { loadMicroApp } from 'qiankun';

export default {
  name: 'MicroFEContainer',
  props: {
    /**
     * 指定微应用的模块名
     */
    module: {
      type: String,
      required: true,
    },
    /**
     * 附加给微应用的参数，可以是任何类型
     */
    data: {
      type: [String, Array, Object, Number, Boolean],
      default: undefined,
    },
  },
  data() {
    return {
      microApp: null,
      uuid: `qiankun_container_${Math.floor(Math.random() * 10000)}`,
    };
  },
  methods: {
    loadMicro() {
      if (this.module) {
        this.microApp = loadMicroApp({
          name: 'micro',
          entry: window.SITE_CONFIG.micro,
          container: `#${this.uuid}`,
          props: {
            ...window.config,
            module: this.module,
            baseURL: window.SITE_CONFIG.cloudUrl,
            token: this.$cookie.get('token'),
            data: this.data,
          },
        }, {
          sandbox: {
            // 此选项开启后，样式会进行类似 vue style scoped 的处理，
            // 添加外层的类，来限定样式作用范围，
            // 但是对于 el-overlay 这种直接插入到 body 的弹窗组件，样式就会因此失效
            // 因此最终决定不使用这个，对 sbs 中被影响的样式单独处理
            // experimentalStyleIsolation: true,
          },
        });
      } else {
        setTimeout(() => {
          this.loadMicro();
        }, 100);
      }
    }
  },
  mounted() {
    this.loadMicro();
  },
  beforeDestroy() {
    // qiankun 微应用是单例模式，需要卸载后才能重新生成新的实例
    this.microApp.unmount();
  },
};
</script>

<style lang="scss" scoped>
.micro-front-end__container {
  width: 100%;
  height: 100%;
}
</style>
