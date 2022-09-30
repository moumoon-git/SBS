<template>
  <el-dialog
    v-dialogDrag
    class="mailList"
    title="人员排序"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="1000px"
    height="1000px">

    <div style="display: flex;">
      <!--分组-->
      <div style="padding-top: 10px;width:15%;min-width:220px;border: 1px solid rgba(229, 229, 229, 1);margin-right: 15px;height: 600px !important;overflow: auto !important;">
        <el-tree :data="modifiedUserList"
                 :props="modifiedUserProps"
                 draggable
                 @node-drag-end="handleDragEnd"
                 :allow-drop="allowDrop"
                 :allow-drag="allowDrag"
                 @node-click="handleNodeClick">
        </el-tree>
        <!--<div style="margin-top: 40px;margin-left: 10px;">-->
          <!--<el-button type="primary" @click="groupResetButton">重置</el-button>-->
          <!--<el-button type="primary" @click="groupSubmitButton" >确定</el-button>-->
        <!--</div>-->
      </div>

      <!--联系人-->
      <div style="width:75%;">
        <vuedraggable
          style="display: flex;flex-wrap: wrap;-ms-flex-wrap: wrap;width: 100%;height: 600px !important;overflow: auto !important;"
          :options="{
            group:'item',
            animation:150,
            ghostClass:'sortable-ghost',
            chosenClass:'chosenClass',
            scroll:false,
            scrollSensitivity:200,
            filter: '.undraggable'
          }"
          v-model="dataList"
          @change="mailMoveChange"
          @start="mailMoveStart"
          @end="mailMoveEnd">
            <div
              :id="'mail'+item.id"
              class="color-box"
              v-for="item in dataList"
              :key="item.id"
            >
              <p style="margin-top: 8px;color: indianred;" v-if="item.personnelMark !=null && item.personnelMark == 1">
                {{item.name}}
                <span style="color: #1890ff;">【负责人】</span>
              </p>
              <p style="margin-top: 8px;color: indianred;" v-else>{{item.name}}</p>
              <p v-if="item.position == null || item.position == ''">
                未知
              </p>
              <p v-else="item.position !=null && item.position.length > 5">
                {{item.position.substring(0,5)}}
              </p>

            </div>
        </vuedraggable>
      </div>
    </div>

    <div slot="footer" class="dialog-footer" style="padding-top: 25px;padding-bottom: 25px">
      <el-button type="primary" @click="resetButton" size="small">重置</el-button>
      <el-button type="primary" @click="submitButton" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>

  import { treeDataTranslate } from "@/utils";
  import $ from "jquery";
  import vuedraggable from 'vuedraggable';

  export default {
    props: {},

    data () {
      return {
        visible: false,
        platformId: this.$store.state.user.platformId,
        // 树形
        modifiedUserList: [],
        modifiedUserProps: {
          children: 'children',
          label: 'name'
        },

        yuanDataList: [],
        dataList: [],
        selectedItem: {},

        //判断是否是从组点击的,1是，0不是
        isGroup: 0,

        //排序的分组
        selectedGroupNode: []
      }
    },
    components: {
      vuedraggable
    },

    created () {
      //请求树形数据
      this.getDataTreeList();
      //请求表格数据
      this.getDataList();
    },
    mounted(){

    },
    methods: {
      init(){
        this.visible = true;
      },
      mailMoveChange(evt) {
        //evt.moved.element.style.cssText = 'background: #e9a86d !important';
        // console.log("mailMoveChange",evt)
        $('#mail'+evt.moved.element.id).css("background:#e9a86d !important")
      },
      mailMoveStart(evt) {
        // console.log("start",evt)
      },
      mailMoveEnd(evt) {
        // console.log("end",evt.item)
        // if(document.getElementsByClassName("color-box").style!= undefined){
        //   document.getElementsByClassName("color-box").style.cssText=""
        // }
        evt.item.style.cssText = 'background: #f2a966a8';
      },

      //拖动结束触发
      handleDragEnd(draggingNode, dropNode, dropType, ev){
        // console.log("handleDragEnd parentId",draggingNode.data.parentId)
        let parentId = draggingNode.data.parentId;

        function findChildenByParent (obj, parentId, list) {
          for(let i=0; i<obj.length; i++){
            if(obj[i].parentId === parentId){
              //说明移动的是最外层
              list.push(obj[i].id);
            }else{
              //不是最底层的,可能存在于孩子节点
              let children = obj[i].children
              if (children != null) {
                //for(let j=0; j<children.length; j++){
                  //分组1，分组2，分组3
                  findChildenByParent(children,parentId,list);
                //}
              }
            }

          }
        }

        //开始调用递归
        this.selectedGroupNode = []
        findChildenByParent(this.modifiedUserList,parentId,this.selectedGroupNode);

        // console.log("开始调用递归结束",this.selectedGroupNode)
        if(this.selectedGroupNode.length > 0){
          this.updateGroupSort();
        }

      },

      //更改分组顺序
      updateGroupSort(){
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/updateGroupSort'),
          method: 'post',
          data: this.$http.adornData(this.selectedGroupNode, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '分组排序成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataTreeList()
              }
            })
          } else {
            this.$message.error("网络受限，请勿频繁操作")
          }
        })
      },

      allowDrop(draggingNode, dropNode, type){
        //不允许向里面拖动
        //return type !== 'inner';
        if (draggingNode.level === dropNode.level) {
          if (draggingNode.parent.id === dropNode.parent.id) {
            // 向上拖拽 || 向下拖拽
            return type === "prev" || type === "next";
          }
        } else {
          // 不同级进行处理
          return false;
        }
      },


      allowDrag(draggingNode) {
        // console.log("allowDrag",draggingNode)
        //false禁止拖拉
        let result = true;
        //console.log("属性",draggingNode.data.name.indexOf('群防共治队伍'))
        return result;
      },


      // 请求树形数据
      getDataTreeList(){
        this.$http({
          url: this.$http.adornUrl(`/mail/mailgroup/list?platformId=${String(this.platformId)}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
              // console.log("请求树形数据",data)
              this.modifiedUserList = treeDataTranslate(data.data, 'id')
          } else {
            this.$message.error(data.msg)
          }
        
        })
      },

      // 请求表格数据
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/mail/mailcontactor/listNoPage'),
          method: 'POST',
          data: this.$http.adornData({
            selectedNode: this.selectedNode,
            platformId: String(this.platformId),
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
              // console.log('请求表格数据', data)
              this.dataList = data.list
              this.yuanDataList = data.list;
            } else {
              this.$message.error(data.msg)
            }
        })
      },

      // 点击树形节点事件
      handleNodeClick (obj) {
        function findChilden (obj, list) {
          list.push(obj.id)
          let children = obj.children
          if (children != null) {
            children.forEach((item, index) => {
              findChilden(item, list)
            })
          }
        }

        // console.log('树形结点点击事件', obj)
        this.selectedNode = []

        findChilden(obj, this.selectedNode = [])
        // 查询树形关联的联系人
        // console.log('最终的分组id', this.selectedNode)
        //从组点击
        this.isGroup = 1;
        this.getDataList();
      },

      //重置
      resetButton(){
        // console.log("重置按钮")
        this.$nextTick(() => {
          this.dataList = []
          this.dataList = this.yuanDataList
        })

      },

      //确认
      submitButton(){
        // console.log("确认按钮",this.dataList)
        let mailIdArray = [];

        if(this.dataList.length > 0){
          for(let i=0; i<this.dataList.length; i++){
            mailIdArray.push(this.dataList[i].id);
          }
        }

        //加入判断
        mailIdArray.push(this.isGroup)
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/updateMailContactorOrderNum`),
          method: 'post',
          data: this.$http.adornData(mailIdArray, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '联系人排序成功',
              type: 'success',
            })
            this.$emit("refreshDataList")
            this.visible = false
          } else {
            this.$message.error(data.msg)
          }
        })

      },

    }
  }
</script>

<style scoped lang="scss">
  /*.mailList {
    .el-dialog{
      .el-dialog__body{
        height: 1000px !important;
        overflow: auto !important;
      }
    }
  }*/

  .color-show{
    height: 600px !important;
    overflow: auto !important;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .color-box{
    /*display: flex;
    flex-direction:row;
    border: 1px solid #565759;
    color: #2e2f31;*/
    border: 1px solid #565759;
    width: 31%;
    height: 4rem;
    color: #2e2f31;
    //line-height: 4rem;
    line-height: 1rem;
    text-align: center;
    transition: transform .3s;
    margin: 7px;
  }

  .dragging{
    background: #e9a86d !important;
  }

  /*#mail1164{
    background: #e9a86d;
  }*/

</style>
