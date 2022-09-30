<template>
  <el-dialog
    :title="!dataForm.id ? '新增装备' : '修改装备'"
    :close-on-click-modal="false"
    width="750px"
    :visible.sync="visible"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item
        label="装备名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          placeholder="装备名称"
        />
      </el-form-item>

      <el-form-item
        label="装备类别"
        prop="className"
      >
        <el-dialog
          title="请选择要新增到的分组节点"
          :visible.sync="articleTypeVisible"
          width="30%"
          append-to-body
        >
          <el-tree
            ref="eventTypeTree"
            :data="articleTypeList"
            :props="articleTypeListTreeProps"
            node-key="id"
            :default-expand-all="true"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
            @current-change="articleTypeListTreeCurrentChangeHandle"
          />
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              plain
              size="small"
              @click="articleTypeVisible = false"
            >取 消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="articleTypeVisible = false"
            >确 定</el-button>
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.className"
          v-popover:eventTypeListPopover
          placeholder="请选择装备类别"
          @focus="articleTypeGettingFocus"
        />
        <el-input
          v-show="false"
          v-model="dataForm.classId"
        />
      </el-form-item>

      <el-form-item
        label="所属装备库"
        prop="groupName"
      >
        <el-dialog
          title="请选择要新增到的分组节点"
          :visible.sync="articleStorehouseVisible"
          width="30%"
          append-to-body
        >
          <el-tree
            ref="eventHouseTree"
            :data="articleStorehouseList"
            :props="articleStorehouseListTreeProps"
            node-key="id"
            :default-expand-all="true"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
            @current-change="articleStorehouseListTreeCurrentChangeHandle"
          />
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              plain
              size="small"
              @click="articleStorehouseVisible = false"
            >取 消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="articleStorehouseVisible = false"
            >确 定</el-button>
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.groupName"
          v-popover:eventTypeListPopover
          placeholder="请选择所属装备库"
          :readonly="true"
          @focus="articleStorehouseGettingFocus"
        />
        <el-input
          v-show="false"
          v-model="dataForm.groupId"
          :readonly="true"
        />
      </el-form-item>

      <el-form-item
        label="规格型号"
        prop="specification"
      >
        <el-input
          v-model="dataForm.specification"
          placeholder="请输入规格型号"
        />
      </el-form-item>

      <el-form-item
        label="装备数量"
        prop="number"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <el-input
          v-model="dataForm.number"
          placeholder="请输入装备数量"
        />
      </el-form-item>

      <el-form-item
        label="应急类别"
        style="width: 45%"
        prop="caseClassId"
      >
        <el-cascader
          ref="caseClassId"
          v-model.trim="dataForm.caseClassId"
          :options="eventTypeData"
          :props="propsObj"
          clearable
          style="float: left; width: 100%"
          :show-all-levels="false"
          placeholder="请选择应急类别"
        />
      </el-form-item>

      <el-form-item
        label="有效期"
        prop="quaguaPeriod"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <template>
          <div class="block">
            <span class="demonstration" />
            <el-date-picker
              v-model="dataForm.quaguaPeriod"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </div>
        </template>
      </el-form-item>

      <el-form-item
        label="需要更换时间"
        style="width: 45%"
        prop="renewTime"
      >
        <template>
          <div class="block">
            <span class="demonstration" />
            <el-date-picker
              v-model="dataForm.renewTime"
              unlink-panels
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </div>
        </template>
      </el-form-item>

      <el-form-item
        label="当前占用状态"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <el-select
          v-model="dataForm.nowStatus"
          prop="nowStatus"
          placeholder="请选择当前占用状态"
          style="width: 220px;"
        >
          <el-option
            v-for="item in nowStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="主要性能参数"
        style="width: 45%"
        prop="capabilityParam"
      >
        <el-input
          v-model="dataForm.capabilityParam"
          placeholder="请输入主要性能参数"
        />
      </el-form-item>

      <el-form-item
        label="负责人"
        style="width: 45%"
        prop="contactor"
      >
        <el-input
          v-model="dataForm.contactor"
          placeholder="请选择负责人"
          @focus="handleInform()"
        />
      </el-form-item>

      <el-form-item label="装备图片:">
        <el-upload
          class="picture-card"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <img
            v-if="dataForm.picPath"
            :src="cloudUrl + dataForm.picPath"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />
        </el-upload>
      </el-form-item>

      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          resize="none"
        />
      </el-form-item>
    </el-form>

    <div
      slot="footer"
      class="dialog-footer"
      style="text-align:center;"
    >
      <el-button
        plain
        size="small"
        @click="visible = false"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="dataFormSubmit()"
      >
        确定
      </el-button>
    </div>
    <!-- 单选联系人弹窗 -->
    <LinkmanRadio
      v-show="showcommonLink"
      ref="commonLink"
      @OnchildByValue="handelLinkdata"
    />
  </el-dialog>
</template>

<script>
import LinkmanRadio from '@/views/common/LinkmanRadio';

export default {
  components: {
    LinkmanRadio,
  },
  data() {
    const checkName = (rule, value, callback) => {
      console.log(this.dataForm.groupId);
      if (value && this.dataForm.groupId) {
        this.$http({
          url: `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipment/nameIsPresent`,
          method: 'get',
          params: this.$http.adornParams({
            id: this.dataForm.id,
            name: value,
            groupId: this.dataForm.groupId,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data);
            if (data.data) {
              callback(new Error('当前仓库已有该装备'));
            } else {
              callback();
            }
          }
        });
      }
    };
    return {
      diviceShow: false,
      eventTypeData: [], // 事件类型
      propsObj: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
      },
      nowStatus: [
        {
          value: 0,
          label: '正常',
        },
        {
          value: 1,
          label: '损坏待维修',
        },
        {
          value: 2,
          label: '报废',
        },
      ],
      articleTypeVisible: false,
      articleStorehouseVisible: false,
      articleTypeList: [],
      articleStorehouseList: [],
      articleTypeListTreeProps: {
        label: 'name',
        children: 'children',
      },
      articleStorehouseListTreeProps: {
        label: 'name',
      },
      visible: false,
      showcommonLink: false,
      dataForm: {
        id: '',
        name: '',
        className: '',
        classId: '',
        groupId: '',
        groupName: '',
        nowStatus: '', // zhuangtai
        caseClassId: [], // leibie
        specification: '', // 规格型号
        number: '', // 数量
        quaguaPeriod: '', // baozhiqi
        renewTime: '', // genghuan
        capabilityParam: '', // 主要性能参数
        contactor: '',
        contactorId: '',
        picPath: '',
        remark: '', // 备注
      },
      operationFlag: 0,
      dataRule: {
        name: [
          { required: true, message: '装备名称不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' },
        ],
        groupName: [
          { required: true, message: '请选择所属装备库', trigger: 'blur' },
        ],
        className: [{ required: true, message: '请选择装备类别', trigger: 'blur' }],
        caseClassId: [{ required: true, message: '请选择应急类别', trigger: 'blur' }],
        number: [
          { required: true, message: '装备数量不能为空', trigger: 'blur' },
          { validator: this.checkNumber, trigger: ['change', 'blur'] },
        ],
      },
      cloudUrl: window.SITE_CONFIG.cloudUrl,
    };
  },
  beforeMount() {
    this.incidentType();
  },
  methods: {
    checkNumber(rule, value, callback) {
      if ((!/^(([+]\d+)|\d*)$/.test(value)) || (value.length > 1 && /^(0[0-9]*)$/.test(value)) || (value.length > 2 && /^([+-]0[0-9]*)$/.test(value))) {
        callback(new Error('请输入0或者不是0开头的正整数'));
      } else {
        callback();
      }
    },
    init(id, type) {
      this.operationFlag = type;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
      });
      if (type === 1) {
        this.dataForm.id = '';
      }
      if (type === 2) {
        this.dataForm.id = id;
        this.$http({
          url: `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipment/info/${id}`,
          method: 'get',
          params: this.$http.adornParams(),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = data.resoureEquipment;
            this.dataForm.contactor = data.resoureEquipment.mailContactorEntity.name;
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    incidentType() {
      const params = {};
      this.$api.getTree(params).then((res) => {
        if (res.errorcode === 0) {
          this.eventTypeData = res.data;
        }
      });
    },
    // 触发单选组件
    handleInform() {
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        '/mail/mailgroup/list',
        '请选择',
        this.dataForm.notificationMethod,
      );
    },
    handelLinkdata({ linkman }) {
      this.dataForm.contactorId = linkman[0].id;
      this.dataForm.contactor = linkman[0].name;
      this.$forceUpdate();
    },
    // 装备分组树设置当前选中节点
    articleTypeListTreeSetCurrentNode() {
      // console.log("123");
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.classId);
      this.dataForm.className = (this.$refs.eventTypeTree.getCurrentNode()
        || {}).name;
    },
    // 装备库分组树设置当前选中节点
    articleStorehouseListTreeSetCurrentNode() {
      this.$refs.eventHouseTree.setCurrentKey(this.dataForm.groupId);
      this.dataForm.groupName = (this.$refs.eventHouseTree.getCurrentNode()
        || {}).name;
    },
    // 装备类型分组树选中
    articleTypeListTreeCurrentChangeHandle(data, node) {
      this.dataForm.classId = data.id;
      this.dataForm.className = data.name;
    },
    // 装备库分组树选中
    articleStorehouseListTreeCurrentChangeHandle(data, node) {
      this.dataForm.groupId = data.id;
      this.dataForm.groupName = data.name;
    },
    // 装备类型，当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    articleTypeGettingFocus(event) {
      this.articleTypeVisible = true;
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureequipmentclass/treeList'),
        method: 'get',
        params: {
          apiVersion: '0.0.2',
        },
      }).then((data) => {
        if (data.data && data.data.code === 0) {
          this.articleTypeList = data.data.data;
        } else {
          this.$message.error(data.msg);
        }
      })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name=''
          // this.dataForm.gmtCreate=''
          this.articleTypeListTreeSetCurrentNode();
        });
    },
    // 装备库类型，当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    articleStorehouseGettingFocus(event) {
      this.articleStorehouseVisible = true;
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureequipmentgroup/list'),
        method: 'get',
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.articleStorehouseList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name=''
          // this.dataForm.gmtCreate=''
          this.articleStorehouseListTreeSetCurrentNode();
        });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const urlPath = this.operationFlag === 1
            ? `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipment/save`
            : `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipment/update`;
          const params = {
            name: this.dataForm.name,
            groupId: this.dataForm.groupId,
            classId: this.dataForm.classId,
            caseClassId: this.dataForm.caseClassId[this.dataForm.caseClassId.length - 1],
            nowStatus: this.dataForm.nowStatus,
            specification: this.dataForm.specification,
            number: this.dataForm.number,
            quaguaPeriod: this.dataForm.quaguaPeriod,
            renewTime: this.dataForm.renewTime,
            capabilityParam: this.dataForm.capabilityParam,
            contactorId: this.dataForm.contactorId,
            picPath: this.dataForm.picPath,
            remark: this.dataForm.remark,
          };
          if (this.operationFlag === 2) {
            params.id = this.dataForm.id;
          }
          this.$http({
            url: urlPath,
            method: 'post',
            data: params,
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit('refreshDataList');
                  this.$emit('close');
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === ("image/jpeg" || "image/png");
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
      const that = this;
      const form = new FormData();
      form.append('file', file);
      this.$http({
        baseURL: window.SITE_CONFIG.fileupload,
        url: '/scgMailContactor/uploadImg',
        method: 'post',
        data: form,
      })
        .then(({ data }) => {
          if (data && data.errorcode === 0) {
            // console.log(data);
            this.dataForm.picPath = data.data.url;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
