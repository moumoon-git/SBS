<template>
  <div>
    <el-dialog
      title="请选择"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        :default-expand-all='true'
        @node-click="handleNodeClick"
        :data="commonSetList"
        :props="commonSetListProps"

        node-key="id"
        style="background: #cccccc47;
            margin-top: 18px;
            height: calc(100vh - 350px);
            padding-top: 10px;"
        current-node-key
        highlight-current
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree"
      >
      </el-tree>
      <div style="text-align: center;margin-top: 20px;">
        <el-button type="primary" style="padding: 12px 20px;" @click="onSubmit">确定</el-button>
        <el-button style="padding: 12px 20px;" @click="onCancel">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'commonSet',
    data () {
      return {
        filterText: '',
        visible: false,//窗口是否可见
        commonSetList: [],//树形列表
        commonSetListProps: {
          children: 'children',
          label: 'name'
        },
        selectObject: ''//选中的对象
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      init (url) {
        this.visible = true
        this.selectObject=''
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'get',
          param: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            data.data.splice(0, 0, {id: 0, name: '顶级节点'})
            this.commonSetList = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },

      //点击树形结点事件
      handleNodeClick (obj) {
        // console.log('点击树形结点事件')
        this.selectObject = obj
      },

      //点击确定
      onSubmit () {
        if (this.selectObject == null||this.selectObject==='') {
          this.$message({
            message: '请选择',
            type: 'warning'
          });
          return
        }else{
          this.$emit("onSubmit",this.selectObject)
          this.filterText=''
          this.visible=false
        }
      },
      //点击取消
      onCancel () {
        this.filterText=''
        this.visible=false
      }
    }
  }
</script>

<style scoped>

</style>
