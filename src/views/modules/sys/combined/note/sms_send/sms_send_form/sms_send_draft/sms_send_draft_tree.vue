<template>
  <div >
            <ul class="operation">
                <li>

                </li>
            </ul>

            <div>
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:60%"></el-input>
          </div>
        <div id="tree" style="background-color:#ddd;height:600px;min-height:60vh;">
          <el-scrollbar
            wrap-class="list"
            wrap-style="color: red;max-height:596px;"
            view-class="view-box"
            :native="false"
          >
            <el-tree
          class="treeboxbotten"
              show-checkbox
              draggable
              :default-expand-all="false"
              :data="list"
              :props="listProps"
              :default-checked-keys="checkedIds"
              node-key="id"
              style="padding-top: 10px;"
              current-node-key
              highlight-current
              ref="tree"
            >
            </el-tree>
          </el-scrollbar>
        </div>
  </div>
</template>

<script>
  export default {
    props: ['list', 'listProps'],
    data () {
      return {
          centerDialogVisible:true,
          checkedIds: [], //当前选中的id数组
          filterText: "",
      }
    },
    components: {
    
    },
    computed: {
      

    },
     watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
    created () {
    },
    mounted () {

    },
    methods: {
       
        //点击树形更新表格
    handleNodeClick(obj) {
      this.$emit("handleNodeDraft", obj);
      this.currentTreeId = obj.id;
      // console.log(this.currentTreeId)
      /*let groupId = obj.id
        //请求表格数据
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/list`),
          method: 'POST',
          params: this.$http.adornParams({
            groupId: groupId
          })
        }).then(({data}) => {
          this.platShareMenuList = data.data
        })*/
    },
    }
  }
</script>
<style lang="scss" scoped>
*{
    padding: 0;
    margin: 0;
}

    .operation{
        list-style: none;
        height: 40px;
        background-color: #ccc;
        margin-bottom: 10px;
    }
</style>
