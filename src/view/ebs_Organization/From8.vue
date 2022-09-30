<template>
  <div>
    <div class="back">
      <el-button
        type="primary"
        class="sbs-button"
        @click="download"
      >
        导出PDF
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="downloadWord"
      >
        导出Word
      </el-button>
      <el-button
        class="sbs-button"
        type="primary"
        @click="fontSize='huge', changePDF()"
      >
        大
      </el-button>
      <el-button
        class="sbs-button"
        type="primary"
        @click="fontSize='medium', changePDF()"
      >
        中
      </el-button>
      <el-button
        class="sbs-button"
        type="primary"
        @click="fontSize='small', changePDF()"
      >
        小
      </el-button>
      <div class="flow">
        <vuepdf ref="child" />
      </div>
    </div>
    <div class="footer">
      <el-button
        type="plain"
        class="sbs-button"
        @click="$router.push({
          path: '/organization',
          name: 'organization'
        });"
      >
        返回
      </el-button>
      <div>
        <el-button
          type="plain"
          class="sbs-button"
          @click="prev"
        >
          上一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vuepdf from './PDF.vue';

export default {
  components: {
    vuepdf,
  },
  data() {
    return {
      versionId: '', // 预案版本ID
      fontSize: 'medium',
    };
  },
  created() {
    this.init();
  },
  methods: {
    changePDF() {
      this.$refs.child.pdfdata(this.versionId, this.fontSize);
    },
    download() {
      const request = {
        method: 'get',
        baseURL: window.g.ApiUrl,
        url: '/emergency/preparation/preplan/download',
        params: {
          versionId: this.versionId,
          fontSize: this.fontSize,
          ifFlowChart: false,
        },
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = `${sessionStorage.getItem('preplanName')}.pdf`;
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    downloadWord() {
      const request = {
        method: 'get',
        baseURL: window.g.ApiUrl,
        url: '/emergency/preparation/preplan/getWord',
        params: {
          versionId: this.versionId,
          ifFlowChart: false,
        },
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = `${sessionStorage.getItem('preplanName')}.docx`;
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    init() {
      this.versionId = Number(sessionStorage.getItem('preplanVersionId')); // 获取预案版本ID
      setTimeout(() => {
        this.$refs.child.pdfdata(this.versionId, this.fontSize);
      }, 10);
    },
    // 上一步
    prev() {
      this.$emit('refprev');
    },
  },
};
</script>

<style scoped>
.back {
  height: 72vh;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
  padding: 10px;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 0px 0px 4px 4px;
}
.flow {
  height: 66vh;
  overflow: auto;
}
</style>
