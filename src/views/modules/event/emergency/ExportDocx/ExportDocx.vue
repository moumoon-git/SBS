<template>
  <div style="align-self: center; text-align: center; padding-top: 10px;">
    <sv-button
      type="primary"
      @click="exportDocx"
    >
      导出Word
    </sv-button>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';
import * as Docx from 'docx';

export default {
  name: 'ExportDocx',
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    exportDocx() {
      const doc = new Docx.Document();
      doc.addSection({
        properties: {},
        children: [
          new Docx.Paragraph({
            children: [
              new Docx.TextRun('要情登记表'),
            ],
          }),
        ],
      });
      Docx.Packer.toBlob(doc).then((blob) => {
        saveAs(blob, '要情登记表.docx');
      });
    },
  },
};
</script>
