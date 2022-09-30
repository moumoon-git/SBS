<template>
  <div class="faxRoot">
    <div class="faxRoot__leftTree">
      <fax-tree
        @handleNodeClick="handleNodeClick"
        @addTree="addEventType"
        @getCheckedIds="getCheckedIds"
        ref="faxTree"
      ></fax-tree>
    </div>
    <div class="faxRoot__center">
      <div class="faxRoot__selections">
        <div class="faxRoot__tags">
          <el-tag
            v-for="(item, idx) in checkedNodes"
            :key="idx"
            type="info"
            effect="plain"
            closable
            size="small"
            @close="deleteSelection(item)"
            disable-transitions
            style="margin-right: 10px;margin-bottom: 10px;"
          >
            {{ item.name }}
          </el-tag>
        </div>
        <div class="faxRoot__selectionsBottom">
          <div>
            <span style="color:#666666">收件人</span>&nbsp;&nbsp;<span
              style="display:inline-block;width:24px;height:22px;background:#F3F3F7;border-radius:4px;color:#333333;font-weight:600"
              >{{ checkedNodes.length }}</span
            >
          </div>

          <div style="font-size: 12px;">
            <el-button type="text" style="" @click="clearup">清空</el-button
            ><span style="color:#D8D8D8">&nbsp;&nbsp;|&nbsp;&nbsp;</span
            ><el-button type="text" @click="addNumber">添加号码</el-button>
          </div>
        </div>
      </div>
      <div class="faxRoot__uploadFax">
        <div class="faxRoot__file">
          <h4>
            <span style="color:red">*</span><span style="">传真文件</span>
          </h4>
          <el-upload
            class="faxRoot__upload"
            action="#"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-error="handleError"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :http-request="upload"
          >
            <el-button
              class="faxRoot__uploadBtn"
              plain
              size="small"
              icon="el-icon-upload"
              >上传文件</el-button
            >
          </el-upload>
        </div>

        <div class="faxRoot__preview">
          <el-tooltip effect="dark" content="预览文件" placement="top">
            <el-image
              class="faxRoot__image"
              :src="require('../../../../assets/img/previewDocument.png')"
              @click="previewDocument"
            ></el-image> </el-tooltip
          ><el-button class="faxRoot__btn" type="primary" size="mini"
            >发送</el-button
          >
        </div>
      </div>
      <div class="faxRoot__faxTable">
        <div class="faxRoot__tableTitle">
          <div
            style="width:2px;height:13px;background:rgba(0,145,255,1);margin-right:8px"
          ></div>
          <span style="font-weight:500;font-size:14px;color:rgba(51,51,51,1);"
            >传真队列</span
          >
        </div>
        <el-table
          :data="tableData"
          height="250"
          border
          style="width: 100%;margin-top:9px;"
        >
          <el-table-column prop="date" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="name" label="总数" align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="成功"
            class-name="faxRoot__table-success"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="失败"
            class-name="faxRoot__table-fail"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="待发"
            class-name="faxRoot__table-await"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="address" label="状态" align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleCheck(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                type="text"
                @click="handleDelete(scope.$index, scope.row)"
                >撤销</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="faxRoot__right">
      <div class="faxRoot__pretitle">
        <div
          style="width:2px;height:13px;background:rgba(0,145,255,1);margin-right:8px"
        ></div>
        <span style="font-weight:500;font-size:14px;color:rgba(51,51,51,1);"
          >传真预览</span
        >
      </div>
      <div v-if="fileList.length > 0" style="margin-top:20px;width: 95%">
        <fax-preview :document="fileList[0]"></fax-preview>
      </div>
      <div class="faxRoot__image" v-else>
        <el-image :src="require('@/assets/img/noFile.png')"></el-image>
        <div style="color:#CAD5E8">暂无预览</div>
      </div>
    </div>

    <fax-state ref="faxState"></fax-state>
  </div>
</template>

<script>
import faxTree from "./faxComponents/faxTree";
import faxPreview from "./faxComponents/previewFax";
import faxState from "./faxComponents/faxState";
// import faxAddOrUpdate from "./faxComponents/fax-add-or-update";

export default {
  components: {
    "fax-tree": faxTree,
    "fax-preview": faxPreview,
    "fax-state": faxState
    // "fax-add-or-update": faxAddOrUpdate
  },
  data() {
    return {
      checkedIds: {}, // 当前变化的复选框
      checkedNodes: [], // 选择的传真对象

      fileList: [], //发送文件列表

      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    // 点击树形节点事件
    handleNodeClick(obj) {
      console.log(obj);
      //   function findChilden(obj, list) {
      //     list.push(obj.id);
      //     let children = obj.children;
      //     // console.log(list)
      //     if (children != null) {
      //       children.forEach((item, index) => {
      //         // console.log(item)
      //         findChilden(item, list);
      //       });
      //     }
      //   }

      //   // console.log('树形结点点击事件', obj)
      //   this.selectedNode = [];
      //   this.currentTreeObject = obj.id;
      //   this.treeForm.currentTreename = obj.name;
      //   this.search = "";
      //   // 分组描述
      //   this.treeForm.groupingdescription = obj.remark;
      //   this.treeForm.type = obj.type;
      //   this.currentTreeplatformId = obj.platformId;
      //   this.currentTreeparentId = obj.parentId;
      //   this.currentTreeancestors = obj.ancestors;

      //   findChilden(obj, (this.selectedNode = []));

      //   // console.log('selectedNode:' + this.selectedNode)
      //   // console.log(this.currentTreeObject)
      //   // console.log(this.treeForm.currentTreename)
      //   // 查询树形关联的联系人
      //   this.$http({
      //     url: this.$http.adornUrl(`/mail/mailcontactor/list`),
      //     method: "POST",
      //     data: this.$http.adornData({
      //       limit: this.pageSize,
      //       page: 1,
      //       groupId: this.selectedNode,
      //       platformId: String(this.sharedPlatform.platformId)
      //     })
      //   }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       // console.log(data)
      //       this.totalCount = data.data.totalCount;
      //       this.currPage = data.data.currPage;
      //       this.pageSize = data.data.pageSize;
      //       this.platShareMenuList = data.data.list;
      //     } else {
      //       this.$message.error(data.msg);
      //     }
      //   });
    },

    // 添加分组
    addEventType() {
      this.eventtypeAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(null, null, 2); // 代表新增
      });
    },
    // 树形复选框勾选ID
    getCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      this.checkedNodes = checkedNodes.checkedNodes;

      // console.log("接收到的数据1", checkedIds);
      // console.log("接收到的数据2", checkedNodes);
    },

    // 删除选择的传真对象
    deleteSelection(item) {
      let selectIdx = this.checkedNodes.findIndex(e => e.id == item.id);
      this.checkedNodes.splice(selectIdx, 1);
      this.$refs.faxTree.setCheckedKeys(this.checkedNodes.map(item => item.id));
    },

    // 清空传真对象数组
    clearup() {
      this.checkedNodes = [];
      this.$refs.faxTree.setCheckedKeys(this.checkedNodes);
    },

    // 添加号码
    addNumber() {},

    /**
          以下为文件上传相关函数
     */
    previewDocument() {
      let { url } = this.fileList;
    },

    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleError(file) {
      this.$message.error("上传失败");
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    //上传文件
    upload(files) {
      // console.log('fileList: ', fileList);
      // console.log('files: ', files);
      console.log("上传的文件", files.file);
      let form = new FormData();
      form.append("files", files.file);
      // form.append('token',this.$cookie.get('token'))
      this.$http({
        url: this.$http.adornUrl("/faxes/faxesfiles/upload"),
        method: "post",
        data: form
      })
        .then(({ data }) => {
          console.log("data: ", data);
          if (data.code == 0) {
            for (let i in data.filestr) {
              this.fileList.push({
                name: data.fileName[i],
                url: data.filestr[i]
              });
            }
            // console.log("这里面有什么鬼", this.fileList);
          } else {
            this.$message.error("上传失败");
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err);
        });
    },

    /** 
      以下为传真队列 
    */

    // 获取传真队列表格数据
    getFaxListForm() {
      this.$http({
        url: this.$http.adornUrl("/faxes/faxesgroup/list"),
        method: "get",
        params: this.$http.adornParams({
          // token: "PC_27151df5610118f1a41b71bbc5ca975c"
        })
      });
    },

    // 查看传真传送状态
    handleCheck() {
      this.$refs.faxState.checkFaxState = true;
    }
  }
};
</script>

<style lang="less" scope>
.faxRoot {
  width: 100%;
  min-width: 1000px;
  background: #f4f4f4;
  display: flex;
  justify-content: space-between;

  .faxRoot__leftTree {
    // width: 18.67%;
    // width: 21.85%;
    width: 21%;
    height: 85vh;
    // width: 255px;

    min-width: 255px;
    min-height: 612px;
    background: #fff;
    box-sizing: border-box;
    // border: 1px solid red;
  }

  .faxRoot__center {
    // width: 33.38%;
    // width: 39.07%;
    width: 39%;
    // width: 456px;

    min-width: 456px;
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
    // border: 1px solid blue;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;

    .faxRoot__selections {
      height: 40.75%;
      border-radius: 3px;
      border: 1px solid rgba(234, 230, 230, 1);
      box-sizing: border-box;
      padding: 7px 9px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .faxRoot__tags {
        display: flex;
        flex-wrap: wrap;
      }

      .faxRoot__selectionsBottom {
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
      }
    }

    .faxRoot__uploadFax {
      margin-top: 10px;

      height: 18.33%;
      border-radius: 3px;
      border: 1px solid rgba(234, 230, 230, 1);

      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .faxRoot__file {
        display: flex;
        align-items: center;
        margin: 12px 10px;

        .el-upload-list,
        .el-upload-list--text {
          position: absolute !important;
          transform: translate(70%, -110%);
        }

        .faxRoot__uploadBtn {
          width: 94px;
          height: 32px;
          margin-left: 20px;
        }
      }

      .faxRoot__preview {
        display: flex;
        height: 50px;
        background: #f9fcff;
        justify-content: space-between;
        align-items: center;
        padding-left: 15px;
        padding-right: 10px;
      }
    }

    .faxRoot__faxTable {
      margin-top: 10px;
      height: 34.86%;
      border-radius: 3px;
      border: 1px solid rgba(234, 230, 230, 1);
      box-sizing: border-box;
      padding: 8px 0;
      color: #666666;

      .faxRoot__tableTitle {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 0 12px;
      }

      .faxRoot__table-success {
        color: #0bd295;
      }

      .faxRoot__table-fail {
        color: #f66e6e;
      }

      .faxRoot__table-await {
        color: #f2b626;
      }
    }
  }

  .faxRoot__right {
    // width: 33.38%;
    // width: 39.07%;
    width: 39%;
    // width: 456px;
    min-width: 456px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .faxRoot__pretitle {
      width: 100%;
      display: flex;
      align-items: center;
      // margin: 0 12px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .faxRoot__image {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 100px;
    }
  }
}
</style>
