<!--快捷组树组件-->
<template>
  <div>
    <div style="display: flex;align-items: center">

      <el-input placeholder="输入关键字进行查询" v-model="filterText">
        <el-button slot="append" type="primary" size="mini" @click="secherText">查询</el-button>
      </el-input>

    </div>
    <div>
      <el-tree
        style="overflow: hidden"
        :show-checkbox="quickGroupShowCheckbox"
        class="filter-tree"
        :data="data"
        default-expand-all
        :default-expanded-keys="[1]"
        node-key="id"
        @node-click="quickNodeClick"
        @check-change="handleCheckChange"
        :filter-node-method="filterNode"
        ref="tree">
<!--        <span class="custom-tree-node" slot-scope="{ node, data }">-->
<!--          <span>{{ node.label }}</span>-->
<!--          <span v-if="quickGroupShowPhoneIcon">-->
<!--            <i class="el-icon-phone-outline" @click="quickNodeDailPhone(data)"></i>-->
<!--          </span>-->
<!--        </span>-->

        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span  class="span-ellipsis" >
          <span :title="node.label">{{ node.label }}</span>
        </span>
        <span v-if="quickGroupShowPhoneIcon && node.disabled===false"  >
          <i   class="el-icon-phone-outline" style="color: #00a854"  @click="quickNodeDailPhone(data)"></i>
        </span>
      </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  export default {
    name: "quickGroup",
    props: ['quickGroupShowCheckbox', 'quickGroupShowPhoneIcon', 'hiide'],
    data() {
      return {
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        data: [],
        saveData:[]
      }
    },
    mounted(){
      let data = {
        pid: 0,
        code: 'quick' // 添加参数（根据融合通讯的来）
      }
      this.$szApi.phoneGruopList(data).then((res) => {
        console.log(res)
        if (res.errorcode == 0) {
          this.saveData=JSON.parse(JSON.stringify(res.data))
          this.data = JSON.parse(JSON.stringify(res.data))
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    watch: {
      // filterText(val) {
      //   this.$refs.tree.filter(val);
      //
      // }
        filterText:{
            handler(newV,oldV){
                console.log(newV, oldV);
                if(newV==''||newV==null){
                    this.data=this.saveData
                }
            },
            deep:true
        }
    },
    methods: {
      secherText(){
        let data = {
            searchText:this.filterText
        }
        this.$api.searchPhoneGruopList(data).then((res) => {
            if (res.errorcode == 0) {
                this.data=[]
                this.data = JSON.parse(JSON.stringify(res.data))
                console.log(res)
            } else {
                // //this.$message.error(res.msg)
            }
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      quickNodeClick(row,node) {
        this.$emit('quickNodeClick', row, node)
      },
      quickNodeDailPhone(data) {
        console.log(data);
      },
      /**
       * @author hexinting
       * @date 2020-9-29
       * @lastAuthor hexinting
       * @lastDate 2020-9-29
       * @description 获取tree选中的节点
       */
      handleCheckChange(){
        let res = this.$refs.tree.getCheckedNodes(); // 获取选中节点
        console.log(res)
        let arr = []
        res.forEach((item) => { // 拼接数据
          arr.push({
            id:item.id,
            label:item.label,
            fax:item.fax,
            mobile: item.mobile
          })
        })
        this.$emit('handleCheckChange',arr)
      },
      /**
       * @author hexinting
       * @date 2020-9-29
       * @lastAuthor hexinting
       * @lastDate 2020-9-29
       * @description 清空tree勾选节点
       */
      delectAllData(){
        this.$refs.tree.setCheckedKeys([]);
      }
    },
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .span-ellipsis {
    width: 100%;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
</style>
