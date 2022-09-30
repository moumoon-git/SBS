<template>
  <div>
    <el-dialog
      title="类型管理"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      width="700px"
      :close-on-click-modal="false"
    >
      <div style="height: 600px;">
        <!-- <el-scrollbar style="height: 100%;"> -->
        <el-row style="margin-bottom:10px;">
          <el-col :span="24">
            <el-tabs v-model="activeName" type="card" @tab-click="show">
              <el-tab-pane
                :label="item.label"
                :name="item.name"
                v-for="item in typeArray"
                :key="item.id"
                style="border-bottom:#ddd"
              ></el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" v-show="activeName!='addType'">
            <div
              :style="{padding: '0 10px',backgroundColor:'#F8F8F8',overflow: 'scroll',height:this.typeListHeight+'px'}"
            >
              <div
                v-for="item in typeList"
                :key="item.id"
                style="padding: 10px 0;color:#B3B3B3;"
                :class="{typeClass: typeId == item.id}"
                @click="typeHandle(item)"
              >
                <span style="cursor:pointer;">{{item.name}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="activeName!='addType'?19:24" class="right">
            <el-form
              ref="workForm"
              :model="workForm"
              :rules="rules"
              label-position="right"
              label-width="100px"
            >
              <el-row v-show="activeName!='delType'">
                <el-form-item prop="name" label="类型名称">
                  <el-col :span="24">
                    <el-input v-model="workForm.name" placeholder="长度限100字符以内"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="初始化标题">
                  <el-col :span="24">
                    <el-input
                      v-model="workForm.title"
                      placeholder="长度限100字符以内"
                      maxlength="100"
                      :disabled="activeName=='delType'"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="初始化内容">
                  <!--当数据获取且存在后再渲染标签-->
                  <el-col :span="24">
                    <el-input
                      type="textarea"
                      resize="none"
                      placeholder="长度限10000字符以内"
                      v-model="workForm.content"
                      rows="6"
                      :disabled="activeName=='delType'"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <!-- qinjiaqi && hexinting -->
              <el-row>
                <div style="position: relative;text-align: left;">
                  <el-form-item label="回复表单">
                    <el-col :span="24">
                      <template v-if="activeName !== 'delType'">
                        <span style="display: inline-block;">属性名称</span>
                        <i
                          class="el-icon-circle-plus-outline"
                          size="mini"
                          style="cursor:pointer;display: inline-block;"
                          @click="addPropTableData"
                        ></i>
                      </template>
                      <div style="height:222px; overflow: auto">
                        <el-table
                          :data="propTableData"
                          highlight-current-row
                          :header-cell-style="{background:'rgba(249,251,255,1)',color:'#333',height:'50px',padding:'0'}"
                        > 
                          <el-table-column
                            prop="name"
                            width="200px"
                            :resizable="false"
                            label="属性名称"
                            align="center"
                          >
                            <template slot-scope="scope">
                              <el-input v-if="activeName !== 'delType'" v-model="scope.row.name"></el-input> 
                              <span v-else>{{ scope.row.name }}</span> 
                            </template>
                          </el-table-column>
                          <el-table-column
                            v-if="activeName !== 'delType'"
                            width="200px"
                            :resizable="false"
                            label="操作"
                            align="center"
                          >
                            <template slot-scope="scope">
                              <el-button
                                @click="deletePropTableData(scope.row)"
                                type="text"
                                size="small"
                                >删除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-col>
                  </el-form-item>
                </div>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <!-- </el-scrollbar> -->
      </div>
      <el-row style="padding:13px 20px 12px 0;border-top:1px solid #F1F4F6;text-align:right">
        <el-col :span="24">
          <el-button type="default" @click="closeDialog" size="medium">取消</el-button>
          <el-button
            type="primary"
            @click="submit()"
            size="medium"
          >{{activeName!='delType'?'保存':'删除'}}
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {debounce} from '@/utils/common.js'
import axios from '@/assets/api/api'

  export default {
    name: "appDutyPopup",
    data() {
      return {
        title: "", //标题
        workForm: {
          id: "",
          name: "",
          title: "",
          content: ""
        }, //表单数据
        activeName: "addType",
        typeArray: [
          {id: 1, label: "新增类型", name: "addType"},
          {id: 2, label: "编辑类型", name: "editType"},
          {id: 3, label: "删除类型", name: "delType"}
        ],
        typeList: [],
        typeId: "", // 当前类型Id
        typeListHeight: "", // 类型列表高度
        rules: {
          name: [
            {required: true, message: "类型名称不能为空", trigger: "blur"},
            {
              max: 100,
              message: "类型名称不能超过100字"
            }
          ],
          content: [
            {required: true, message: "内容不能为空", trigger: "blur"},
            {
              max: 10000,
              message: "内容不能超过10000字"
            }
          ]
        }, //验证规则
        isDialogVisible: false, //是否显示弹窗
        currentList: null,
        propTableData: [], // 属性名称
      };
    },
    created() {
      this.initTypeData();
    },
    methods: {
      /**
       * @createTime 2021-04-09
       * @author: qinjiaqi
       * @param {Object} 当前行
       * @return {type} undefined
       * @Description 在属性名称里加新行
       */
      addPropTableData(){
        // 新行
        this.propTableData.push({ 
          name: ''
        });
        // 刷新table
        this.$set(this.propTableData)
      },
      /**
       * @createTime 2021-04-09
       * @author: qinjiaqi
       * @lastEditor hexinting
       * @lastEditedDate 2021-04-19
       * @param {Object} row:当前行
       * @return {type} undefined
       * @Description 在属性名称里删除行
       */
      deletePropTableData(row) {
        let _index = this.propTableData.findIndex(item => item.name === row.name)
        this.propTableData.splice(_index, 1);
      },
      // 初始化类型列表
      async initTypeData() {
        // let res = await this.$api.affairsTypeList();
        let res = await axios({ //备忘录，查找表格
          url: window.SITE_CONFIG['event'] + '/app/sjs/affairsType/list',
          method: 'get',
        })
        if (res.errorcode !== 0) {
          this.$message.error(res.msg);
          return;
        }
        this.typeList = res.data;
        if (this.activeName == 'editType') {
          this.typeHandle(this.currentList?this.typeList.find(v=>v.id == this.currentList.id):res.data[0])
        }else if (this.activeName == 'delType'){
          this.typeHandle(res.data[0])
        }
      },
      closeDialog() {
        //清空表单内容以及校验信息
        this.$nextTick(() => {
          this.workForm.name = "";
          this.workForm.title = "";
          this.workForm.content = "";
          this.isDialogVisible = false;
        });
      },
      /**
       * @createTime 2021-04-09
       * @author: qinjiaqi
       * @param {Object} 当前行
       * @return {type} undefined
       * @Description 
       */
      typeHandle(obj) {
        setTimeout(() => {
          this.currentList = obj
          this.typeId = obj.id
          this.workForm.name = obj.name
          this.workForm.title = obj.title
          this.workForm.content = obj.content
          // 属性名称表格赋值
          this.propTableData = []
          if(obj.params.length > 0) {
            for(var i = 0; i < obj.params.length; i ++) {
              this.propTableData.push({name: obj.params[i].name})
            }
          }
        }, 100);
      },
      submit:debounce( function () {
        //operate	操作类型 0->新增 1-> 更新 2->删除
        if (this.activeName == "addType" || this.activeName == "editType") {
          this.addOrEditType();
        }else {
          this.delType();
        }
      },1000),
      /**
       * @createTime 2021-04-09
       * @author: qinjiaqi
       * @param {Object} 当前行
       * @return {type} undefined
       * @Description 新增/编辑类型
       */
      addOrEditType() {
        this.$refs.workForm.validate(valid => {
          if (!valid) return;
          let {name, title, content} = this.workForm;
          let data = {
            name,
            title,
            content,
            id: this.typeId,
            sysIStatus: 0,
          };
          let params = this.propTableData; // 保存时加入属性名称表格的值
          // this.$api.addOrEditType({data, params})
          axios({ //备忘录，查找表格
            url: window.SITE_CONFIG['event'] + '/app/sjs/affairsType/saveOrUpdate',
            method: 'post',
            data:{data, params}
          })
          .then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.$message({
              message: "保存成功!",
              type: "success"
            });
            this.propTableData = [] // 清空
            this.initTypeData()
            this.closeDialog();
            this.activeName = "editType"
          });
        });
      },
      // 删除类型
      delType() {
        let data = {
          id: this.typeId
        };
        // this.$api.delType({data})
        axios({ //备忘录，查找表格
          url: window.SITE_CONFIG['event'] + '/app/sjs/affairsType/deleted',
          method: 'post',
          data:{data},
        })
        .then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.$message({
            message: "删除成功!",
            type: "success"
          });
          this.initTypeData();
          this.closeDialog();
        });
      },
      /**
       * @createTime 2021-04-09
       * @author: qinjiaqi
       * @param {Object} 当前行
       * @return {type} undefined
       * @Description 新增/编辑类型
       */
      show(obj) {
        this.propTableData = [] // 切换tab清空
        this.typeId = undefined
        if (obj.name != "addType") {
          this.typeListHeight = document.getElementsByClassName(
            "right"
          )[0].offsetHeight;
          if (this.typeList.length > 0) {
            this.typeHandle(this.currentList || this.typeList[0])
          }
        }else{
          this.workForm.name = "";
          this.workForm.title = "";
          this.workForm.content = "";
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .typeClass {
    color: #0091ff !important;
  }

  /deep/ .el-dialog__header {
    background-color: #f1f4f6;
    border-radius: 5px 5px 0px 0px;
    padding: 10px 0 10px 20px;
    text-align: left;
  }

  /deep/ .el-dialog__title {
    color: #333;
    font-size: 15px;
  }

  /deep/ .el-dialog__headerbtn {
    top: 12px;
    font-size: 20px;
  }

  /deep/ .el-dialog__headerbtn .el-dialog__close {
    color: #adb6c2;
  }

  /deep/ .el-dialog__body {
    padding: 20px 20px 0;
  }

  /deep/ .el-form-item {
    margin-bottom: 15px;
  }

  // tab标签页边框样式
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 1px solid #ddd;
    border-bottom: none;
  }

  // tab标签页字体样式
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    color: #999;
  }

  // tab标签页点击后的样式
  /deep/ .el-tabs__item.is-active {
    color: #333 !important;
    background-color: white !important;
  }

  //  文本域样式
  .el-textarea__inner {
    height: 100%;
  }
</style>
