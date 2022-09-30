// 导出页面为PDF格式
import Vue from 'vue'
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
/*
  执行方式  参数 (导出的容器id,导出pdf文件名 )
  <button @click="getPdf('#pdfDom','test')">导出</button>
*/

const htmlToPdf = {
  install (Vue, options) {
    Vue.prototype.getPdf = function (id,pdfTitle) {
      let title = pdfTitle;
      let c = document.createElement("canvas")
      let opts = {
        scale: 2,
        canvas: c,
        logging: true,
        width: document.querySelector(id).width,
        height: document.querySelector(id).height
      };
      c.width = document.querySelector(id).width * 2
      c.height = document.querySelector(id).height * 2
      c.getContext("2d").scale(2, 2);
      html2Canvas(document.querySelector(id), {
        allowTaint: true,
        logging: false
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      })
    }
  }
}

Vue.use(htmlToPdf)//注册组件
