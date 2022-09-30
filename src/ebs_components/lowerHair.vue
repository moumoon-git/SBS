<template>
    <div>
      <el-button type="success" size="medium" icon="el-icon-bottom-right" style="display: inline-block;" @click="lowerHairTypeBtn" v-if='lowerHair && linkageBtn'>下发</el-button>
      <el-dialog :visible.sync="Modal" width="500px" center append-to-body :close-on-click-modal="false">
        <div slot="title">{{title}}</div>
        <el-scrollbar style="height: 400px;width: 460px;">
          <el-tree :data="treeData"
                   :check-on-click-node='true'
                   :check-strictly="true"
                   :props="props" ref="tree" node-key="id"
                   :render-content="renderContent"
                   default-expand-all
                   show-checkbox
                   :default-checked-keys="checkedKeys"></el-tree>
        </el-scrollbar>
        <div style="margin-top: 10px; text-align: center;">
          <el-button type="primary" size="medium" @click="lowerHairBtn" style="margin: 0 auto;">下发</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import {
    getlocalStorage
  } from '../assets/js/common'
    export default {
        props: ['LinkageType','arrayID', 'reportType'],
        name: "lowerHair",
        data () {
          return {
            lowerHair:true,
            linkageBtn:false,
            Modal: false,
            title:'选择下发',
            props: {
              label: 'name',
              children: 'children'
            },
            treeData: [],
            checkedKeys:[],//勾选数组
            arrId:[],
          }
        },
        watch: {
          arrayID(data) {
            this.arrId = data;
          }
        },
      created() {
        this.lowerHair = window.g.lowerHair;
        this.linkageBtn=this.$store.state.modular.linkage;
      },
        methods:{
          lowerHairTypeBtn(){
            if (this.arrId.length == 0) {
              this.$message({
                message: '请勾选数据',
                type: 'warning'
              });
              return;
            }
            this.Modal=true;
            let data={
                  deptId:getlocalStorage('deptId')
            }
            this.$http('/emergency/preparation/report/getSubDept', data).then(res => {
              this.treeData=res.data;
            })

          },
          lowerHairBtn(){
            let treeData=this.$refs.tree.getCheckedNodes();
            let arrCode=[];
            for (let i in treeData){
              arrCode.push(treeData[i].code);
            }
            if(arrCode.length==0){
              this.$message({
                message: '请选择数据再下发',
                type: 'warning'
              });
              return;
            }
            this.$confirm('确认下发？', '提示', {
              type: 'warning',
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              let ids = []
              for (let i in this.arrId) {
                ids.push(this.arrId[i].id)
              }
              let data={
                arrId: ids,
                arrCode:arrCode,
                linkageType: this.LinkageType,
                type: this.reportType
              }
              let CallbackReload = this;
              this.$http('/emergency/preparation/report/reporting', data,CallbackReload).then(res => {
                console.log(res)
                this.$message({
                  message: '下发成功',
                  type: 'success'
                })
                this.Modal=false;

              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消下发'
              })
            })

          },
          renderContent(h, { //树形控件title提示
            node,
            data,
            store
          }) {
            return ( <span class = "custom-tree-node" >
              <span title = {node.data.name}
          class = "el-tree-node__label" > {node.data.name}
          </span> </span > );
          },
        },
    }
</script>

<style scoped>
  .el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content .el-tree-node__label {
    background-color: #ccc;
  }

  .el-scrollbar>>>.el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
