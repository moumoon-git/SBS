<template>
  <div>
    <vxe-grid size="mini" :toolbar="toolbar" :data.sync="tableData" border height="300">
      <vxe-table-column width="80px" field="name" title="Name"></vxe-table-column>
      <vxe-table-column width="80px" field="sex" title="Sex"></vxe-table-column>
      <vxe-table-column width="80px" field="age" title="Sex"></vxe-table-column>
    </vxe-grid>
     <!-- 操作 -->
  </div>
</template> 
<script>
export default {
  data () {
    return {
      tableData: [
        { name: 'aaaa', sex: '男', age: 18 },
        { name: 'bbbb', sex: '男', age: 18 },
        { name: 'cccc', sex: '男', age: 18 }
      ],
      toolbar: {
        buttons: [
          { code: 'reloadColumn', name: '刷新列配置' },
          { code: 'reload', name: '刷新数据' }
        ],

        setting: true
      }
    }
  },
  created () {},
  methods: {
    aabbcc () {
      this.$XMsg.alert('value')
    }
  }
}
</script>