<template>
  <div>
    <div class="back">
      <div class="left">
        <el-tree
          ref="tree"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :data="data4"
          node-key="id"
          :highlight-current="highlight"
          default-expand-all
          :expand-on-click-node="false"
          @node-drop="handleDrop"
          @node-click="handleNodeClick"
        />
      </div>
      <div
        v-if="dataarr.id !== 520 && dataarr.id !== 521"
        class="rightBack"
      >
        <div class="rightInner">
          <div class="rightTop">
            <el-button
              type="text"
              class="buttonNoHeight"
              @click="append"
            >
              +新增
            </el-button>
            <el-button
              type="text"
              class="buttonNoHeight"
              @click="deletebtn"
            >
              -删除
            </el-button>
          </div>
          <el-form label-width="100px">
            <el-form-item
              label="节点名称:"
              required
            >
              <el-input
                v-model="name"
                size="mini"
                :disabled="disableds"
                show-word-limit
                class="rightInput"
              />
            </el-form-item>
            <el-form-item
              label="节点内容:"
            >
              <el-input
                v-model="content"
                type="textarea"
                :rows="8"
                show-word-limit
                class="rightInput"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="saveButton">
          <el-button
            class="sbs-button"
            type="primary"
            @click="Submission"
          >
            保存
          </el-button>
        </div>
      </div>
      <div
        v-else
        class="rightBack"
      >
        <div class="rightInner">
          <div class="uploadFileTop">
            <el-checkbox
              v-model="isShow"
              label="独立显示"
              class="checkbox"
            />
          </div>
          <el-form label-width="100px">
            <el-form-item
              :label="dataarr.id === 520 ? '处置流程:' : '注意事项:'"
            >
              <el-input
                v-model="uploadRemark"
                type="textarea"
                :autosize="{ minRows: 9, maxRows: 9}"
                class="rightInput"
              />
            </el-form-item>
            <el-form-item
              label="上传图片:"
            >
              <el-upload
                action=""
                :headers="{
                  Authorization: $window.localStorage.getItem('token')
                    ? $window.localStorage.getItem('token')
                    : ''
                }"
                :http-request="uploadFileMethod"
                :before-remove="beforeRemove"
                accept=".jpg,.jpeg,.png"
                :file-list="fileList"
                multiple
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="saveButton">
          <el-button
            class="sbs-button"
            type="primary"
            @click="handleUploadSuccess"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button
        type="plain"
        class="sbs-button"
        @click="$router.push({
          path: '/organization',
          name: 'organization'
        });"
      >
        返回
      </el-button>
      <div>
        <el-button
          type="plain"
          class="sbs-button"
          @click="prev"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          class="sbs-button"
          @click="next"
        >
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const data = [{
      id: 0,
      type: 99999,
      label: '预案目录结构',
      children: null,
    }];
    return {
      highlight: true, // 高亮状态
      newID: '', // 判断是否新增
      disableds: false,
      chooseid: '', // 选中节点id
      chooseids: '',
      name: '', // 节点名称
      content: '', // 节点内容
      type: '', // 节点类型
      chooseidone: '',
      types: '',
      dataarr: '', // 判断节点是否能被删除
      dataarrone: '',
      data4: JSON.parse(JSON.stringify(data)),
      parent: null, // 获取父节点文本
      pid: 0, // 获取父节点ID
      versionId: '', // 预案版本ID
      catalogID: '', // 目录ID
      childrenlist: [], // 拖拽后数组ID
      parentPID: '',
      fileList: [],
      uploadRemark: '',
      isShow: true,
    };
  },
  created() {
    this.tree();// 获取文件目录树
  },
  methods: {
    // 获取文件目录树
    tree() {
      this.versionId = Number(sessionStorage.getItem('preplanVersionId')); // 获取预案版本ID
      const data = {
        versionId: this.versionId,
      };
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getCatalogTree',
        baseURL: window.g.ApiUrl,
        data,
      }).then((res) => {
        res.data.data.push({
          children: [], id: 520, label: '应急处置流程图', type: 6,
        }, {
          children: [], id: 521, label: '注意事项', type: 6,
        });
        this.data4[0].children = res.data.data;
        this.chooseids = res.data.data[0].id;
        this.newID = 1; // 用来判断修改还是新增目录，空为新增
        this.dataarrone = res.data.data[0];
        this.types = res.data.data[0].type;
        this.handleNode();
      });
    },
    // 获取预案附件数据的接口
    getVersionAttachmentData() {
      const data = {
        versionId: this.versionId,
        type: this.dataarr.id === 520 ? 0 : 1, // 0:处置流程图，1：注意事项
      };
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getVersionAttachmentDataAndContent',
        baseURL: window.g.ApiUrl,
        data,
      }).then((res) => {
        if (res.data.errorcode === 0) {
          this.isShow = res.data.data.displayStatus === 1;
          sessionStorage.setItem('displayStatus', this.isShow);
          this.uploadRemark = res.data.data.content;
          res.data.data.attachRel.map((v) => {
            v.url = window.SITE_CONFIG.cloudUrl + v.path + v.name + v.extension;
            v.filePath = v.path + v.name + v.extension;
          });
          this.fileList = res.data.data.attachRel;
        }
      });
    },
    // 树点击
    handleNodeClick(data, node) {
      // 初始化
      this.fileList = [];
      this.uploadRemark = '';
      this.isShow = false;
      this.dataarr = data;
      this.chooseid = data.id;
      if (data.type === 99999) {
        return;
      }
      this.type = data.type;
      this.newID = 1; // 用来判断修改还是新增目录，空为新增
      this.catalogID = data.id;
      this.pid = node.parent.data.id;
      this.parent = node.parent.data.label;
      this.handleNode();
    },
    // 树点击 回显
    btns() {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.chooseid);
      });
    },
    // 树点击
    handleNode() {
      if (this.catalogID) {
        this.chooseid = this.catalogID;
      } else if (this.chooseidone) {
        this.chooseid = this.chooseidone;
      } else {
        this.dataarr = this.dataarrone;
        this.chooseid = this.chooseids;
        this.type = this.types;
      }
      if (this.type !== 1) {
        this.disableds = true;
      } else {
        this.disableds = false;
      }
      const id = this.chooseid;
      const test = {
        id,
      };
      if (this.dataarr.id !== 520 && this.dataarr.id !== 521) {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/getCatalogDetail',
          baseURL: window.g.ApiUrl,
          data: test,
        }).then((res) => {
          this.btns();
          this.name = res.data.data.name;
          this.content = res.data.data.content;
        });
      } else {
        this.getVersionAttachmentData();// 获取预案附件数据的接口
      }
    },
    // 新增节点
    append() {
      const data = this.dataarr;
      if (data.type == 2 || data.type == 3 || data.type == 4 || data.type == 5) {
        this.$message({
          message: '该目录结构不能新增节点！',
          type: 'warning',
        });
        return;
      }
      this.newID = '';
      this.name = '';
      this.disableds = false;
      this.content = '';
    },
    // 删除节点
    deletebtn() {
      const datas = this.dataarr;
      if (datas.type == 2 || datas.type == 3 || datas.type == 4 || datas.type == 5 || datas.type == 99999) {
        this.$message({
          message: '该目录结构不能删除！',
          type: 'warning',
        });
        return;
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const test = {
          id: this.chooseid,
        };
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/deleteCatalog',
          baseURL: window.g.ApiUrl,
          data: test,
        }).then((res) => {
          this.$message({
            message: '已删除',
            type: 'success',
          });
          this.catalogID = '';
          this.chooseidone = '';
          this.tree();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 保存按钮
    Submission() {
      if (this.name == '') {
        this.$message({
          message: '节点名称不能为空',
          type: 'warning',
        });
        return;
      }
      if (this.newID) { // newID判断是否进入修改
        const test = {
          id: this.chooseid,
          name: this.name,
          content: this.content,
        };
        const data = {
          data: test,
        };
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/updateCatalog',
          baseURL: window.g.ApiUrl,
          data,
        }).then((res) => {
          this.catalogID = res.data.data.id; // 目录ID
          this.chooseid = res.data.data.id;
          this.tree();
          this.$message({
            message: '修改成功',
            type: 'success',
          });
        });
      } else {
        const test = {
          versionId: this.versionId,
          pid: this.chooseid,
          name: this.name,
          content: this.content,
        };
        const data = {
          data: test,
        };
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/addCatalog',
          baseURL: window.g.ApiUrl,
          data,
        }).then((res) => {
          this.catalogID = res.data.data.id; // 目录ID
          this.chooseid = res.data.data.id;
          this.type = 1;
          this.tree();
          this.$message({
            message: '保存成功',
            type: 'success',
          });
        });
      }
    },
    // 拖拽
    handleDrop(draggingNode, dropNode, dropType, ev) {
      if (this.childrenlist) {
        const arrays = [];
        this.childrenlist.forEach((data) => {
          arrays.push(data.id);
        });
        const data = {
          pid: this.parentPID,
          ids: arrays, // 移动后数组ID
          versionId: this.versionId,
        };
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/updateCatalogOrder',
          baseURL: window.g.ApiUrl,
          data,
        }).then((res) => {
          if (draggingNode.data.data) {
            this.chooseidone = draggingNode.data.data.id;
            this.type = draggingNode.data.data.type;
          } else {
            this.chooseidone = '';
            this.type = '';
          }
          this.tree();
        });
      }
    },
    // 拖拽时判定目标节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      this.childrenlist = draggingNode.parent.data.children;
      this.parentPID = draggingNode.parent.data.id;
      if (draggingNode.parent.data.id == dropNode.data.id) {
        return;
      }
      if (draggingNode.parent.data.id == dropNode.parent.data.id) {
        return type !== 'inner';
      }
    },
    // 判断节点能否被拖拽
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('预案目录结构') === -1;
    },
    // 自定义上传
    uploadFileMethod(param) {
      const fileObject = param.file;
      const formData = new FormData();
      formData.append('file', fileObject);
      this.$http({
        method: 'post',
        url: '/scgMailContactor/uploadImg',
        baseURL: window.SITE_CONFIG.fileupload,
        data: formData,
      }).then((res) => {
        if (res.data.errorcode === 0) {
          const filePath = res.data.data.url;
          const { size } = param.file;
          const data = {
            url: window.SITE_CONFIG.cloudUrl + res.data.data.url,
            filePath,
            size,
            versionId: this.versionId,
          };
          this.fileList.push(data);
          this.$message({
            message: '上传成功',
            type: 'success',
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 上传成功
    handleUploadSuccess() {
      const arr = [];
      this.fileList.forEach((el) => {
        arr.push({
          filePath: el.filePath,
          size: el.size,
          versionId: this.versionId,
        });
      });
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/setVersionAttachmentDataAndContent',
        baseURL: window.g.ApiUrl,
        data: {
          attachRels: arr,
          content: this.uploadRemark,
          displayStatus: this.isShow ? 1 : 0,
          versionId: this.versionId,
          type: this.dataarr.id === 520 ? 0 : 1, // 0:处置流程图，1：注意事项
        },
      }).then((res) => {
        if (res.data.errorcode === 0) {
          this.$message({
            message: '保存成功',
            type: 'success',
          });
          this.getVersionAttachmentData();
        } else {
          this.$message.error(res.data.data.msg);
        }
      });
    },
    // 上传删除
    beforeRemove(file, fileList) {
      this.fileList.map((v, index) => {
        if (v.name == file.name) {
          const data = {
            versionId: this.versionId,
            attachmentIds: [v.id],
          };
          this.$http({
            method: 'post',
            url: '/emergency/preparation/preplan/deleteVersionAttachment',
            baseURL: window.g.ApiUrl,
            data,
          }).then((res) => {
            if (res.data.errorcode === 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.fileList.splice(index, 1);
            } else {
              this.$message.error(res.data.data.msg);
            }
          });
        }
      });
    },
    next() {
      if (localStorage.getItem('preplanType') === 'add') {
        this.$message({
          message: '新增预案成功',
          type: 'success',
        });
      } else {
        this.$message({
          message: '修改预案成功',
          type: 'success',
        });
      }
      this.$emit('refreshList');
    },
    prev() {
      this.$emit('refprev');
    },
  },
};
</script>

<style scoped>
.back {
  display: flex;
  height: 72vh;
  overflow: auto;
  position: relative;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 0px 0px 4px 4px;
}
.left {
  width: 24%;
  height: 72vh;
  overflow: auto;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
  margin: 0 10px 0 0;
}
.rightBack {
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
  width: 76%;
}
.rightInner {
  height: 67vh;
  overflow: auto;
}
.rightTop {
  padding: 10px 30px;
  border-bottom: 1px solid #C0C0C0;
  margin-bottom: 10px;
}
.uploadFileTop {
  padding: 10px 30px;
  border-bottom: 1px solid #C0C0C0;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.rightInput {
  width: 84%;
}
.saveButton {
  text-align: center;
}
.el-tree {
  min-width: 100%;
  display: inline-block !important;
}
.el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.buttonNoHeight {
  padding: 0;
}
</style>
