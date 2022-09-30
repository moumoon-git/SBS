<template>
    <el-dialog title="请选择部门" :visible.sync="newgroups" width="30%" append-to-body>
      <el-tree
        :data="choiceTreeList"
        :props="choiceTreeProps"
        node-key="id"
        ref="eventTypeTree"
        @current-change="choiceTreeCurrentChangeHandle"
        :auto-expand-parent="true"
        :highlight-current="true"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newgroups = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="submitChoice" size="small">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            newgroups: false,
        }
    }
}
</script>