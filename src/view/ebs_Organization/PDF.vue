<template>
  <div style="position:relative;">
    <div class="pdf">
      <div id="canvasIDpdfs" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numPages: '', // 页数
      pdfDoc: '', // pdf文件
    };
  },
  methods: {
    pdfdata(versionId, fontSize = 'medium') {
      const root = window.g.ApiUrl;
      const that = this;
      const canvasID = document.getElementById('canvasIDpdfs');
      const url = `${root}/emergency/preparation/preplan/view?versionId=${versionId}&fontSize=${fontSize}&ifFlowChart=false`;
      PDFJS.getDocument({
        url,
        httpHeaders: {
          token: that.$cookie.get('token'),
        },
      }).then((pdfDoc_) => {
        that.pdfDoc = pdfDoc_;
        const pdfDoc = pdfDoc_;
        canvasID.innerHTML = '';
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          that.renderPage(i, canvasID);
        }
      });
    },
    renderPage(num, canvasID) {
      this.pdfDoc.getPage(num).then((page) => {
        const canvasList = canvasID;
        const canvas = document.createElement('canvas');
        canvasList.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const viewport = page.getViewport(1.5);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: ctx,
          viewport,
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
        });
      });
    },
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.arrow {
  text-align: center;
}
.pdf {
  text-align: center;
}
</style>
