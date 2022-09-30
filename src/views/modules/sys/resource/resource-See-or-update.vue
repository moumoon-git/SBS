<template>
  <el-dialog
    :title="!dataForm.id ? '新增物资' : status===1?'修改':'查看'"
    :close-on-click-modal="false"
    width="750px"
    :visible.sync="visible"
    class="resource_article"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item
        label="物资名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          placeholder="物资名称"
          :readonly="status!==1"
        />
      </el-form-item>

      <el-form-item
        label="物资类型"
        prop="articleTypeName"
      >
        <el-dialog
          title="请选择要修改到的分组节点"
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
              plain
              size="small"
              @click="articleTypeVisible = false"
            >确 定</el-button>
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.articleTypeName"
          v-popover:eventTypeListPopover
          placeholder="选择分组"
          :readonly="status!==1"
          @focus="status === 1 ? articleTypeGettingFocus() : ''"
        />
        <el-input
          v-show="false"
          v-model="dataForm.articleTypeId"
        />
      </el-form-item>

      <el-form-item
        label="物资仓库"
        prop="articleStorehouseName"
      >
        <el-dialog
          title="请选择要修改到的分组节点"
          :visible.sync="articleStorehouseVisible"
          width="30%"
          append-to-body
        >
          <el-tree
            ref="eventTypeTree"
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
          v-model="dataForm.articleStorehouseName"
          v-popover:eventTypeListPopover
          placeholder="选择分组"
          :readonly="true"
          @focus="status === 1 ? articleStorehouseGettingFocus() : ''"
        />
        <el-input
          v-show="false"
          v-model="dataForm.articleStorehouseId"
          :readonly="true"
        />
      </el-form-item>

      <el-form-item
        label="物资数量"
        prop="amount"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <el-input
          v-model="dataForm.amount"
          placeholder="物资数量"
          :readonly="status!==1"
        />
      </el-form-item>

      <el-form-item
        label="物资型号"
        style="width: 45%"
      >
        <el-input
          v-model="dataForm.model"
          placeholder="物资型号"
          :readonly="status!==1"
        />
      </el-form-item>

      <el-form-item
        label="计量单位"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <el-input
          v-model="dataForm.measureUnit"
          placeholder="计量单位"
          :readonly="status!==1"
        />
      </el-form-item>

      <el-form-item
        label="生产厂家"
        style="width: 45%"
      >
        <el-input
          v-model="dataForm.factory"
          placeholder="生产厂家"
          :readonly="status!==1"
        />
      </el-form-item>

      <el-form-item
        label="需更换时间"
        class="time_detail"
      >
        <template>
          <div class="block">
            <span class="demonstration" />
            <el-date-picker
              v-model="dataForm.replaceTime"
              unlink-panels
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :readonly="status!==1"
            />
          </div>
        </template>
      </el-form-item>

      <el-form-item
        label="保质期"
        style="width: 45%"
      >
        <template>
          <div class="block">
            <span class="demonstration" />
            <el-date-picker
              v-model="dataForm.expireTime"
              unlink-panels
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :readonly="status!==1"
            />
          </div>
        </template>
      </el-form-item>

      <el-form-item
        label="维修状态"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <el-select
          v-model="dataForm.maintainStatus"
          placeholder="请选择"
          style="width: 220px;"
          :disabled="status!==1"
        >
          <el-option
            v-for="item in maintainStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="现状态"
        style="width: 45%"
      >
        <el-select
          v-model="dataForm.nowStatus"
          placeholder="请选择"
          style="width: 220px;"
          :disabled="status!==1"
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
        label="保密标准"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <el-select
          v-model="dataForm.secret"
          placeholder="请选择"
          style="width: 220px;"
          :disabled="status!==1"
        >
          <el-option
            v-for="item in secret"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="物资级别"
        style="width: 45%"
      >
        <el-select
          v-model="dataForm.level"
          placeholder="请选择"
          style="width: 220px;"
          :disabled="status!==1"
        >
          <el-option
            v-for="item in level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="调用方式"
        prop="transferMethod"
      >
        <el-input
          v-model="dataForm.transferMethod"
          :readonly="status!==1"
          placeholder="调用方式"
        />
      </el-form-item>

      <el-form-item label="是否易耗">
        <el-select
          v-model="dataForm.consumables"
          placeholder="请选择"
          style="width: 220px;"
          :disabled="status!==1"
        >
          <el-option
            v-for="item in consumables"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="物资图片:">
        <el-upload
          v-if="status===1"
          class="picture-card"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <!-- <template v-if="status===1"> -->
          <img
            v-if="dataForm.picPath"
            :src="cloudUrl + dataForm.picPath"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />
        <!-- </template>
        <template v-else>
        </template> -->
        </el-upload>
        <img
          v-else-if="dataForm.picPath"
          :src="cloudUrl + dataForm.picPath"
          class="avatar"
        >
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
          :readonly="status!==1"
          resize="none"
        />
      </el-form-item>
    </el-form>

    <span
      v-if="status===1"
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        plain
        size="small"
        @click="visible = false"
      >取消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="dataFormSubmit()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import { setTimeout } from 'timers';
import deviceDialog from './deviceDialog.vue';

export default {
  components: {
    deviceDialog,
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (value && this.dataForm.articleStorehouseId) {
        this.$http({
          url: `${window.SITE_CONFIG.baseUrl}/resoure/resourearticle/verifyName`,
          method: 'get',
          params: this.$http.adornParams({
            name: value,
            id: this.dataForm.id,
            groupId: this.dataForm.articleStorehouseId,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data);
            // true为不存在重复，false为存在重复
            if (!data.data) {
              callback(new Error('名称重复'));
            } else {
              callback();
            }
          } else {
            // this.$message.error(data.msg);
          }
        });
      }
    };
    return {
      deviceTitle: '',
      nowStatus: [
        {
          value: 0,
          label: '可正常使用',
        },
        {
          value: 1,
          label: '不可正常使用',
        },
      ],

      maintainStatus: [
        {
          value: 0,
          label: '好',
        },
        {
          value: 1,
          label: '良好',
        },
        {
          value: 2,
          label: '差',
        },
      ],

      level: [
        {
          value: 0,
          label: '国家级',
        },
        {
          value: 1,
          label: '省级',
        },
        {
          value: 2,
          label: '市级',
        },
        {
          value: 3,
          label: '县级',
        },
        {
          value: 4,
          label: '乡镇级',
        },
        {
          value: 5,
          label: '其他',
        },
      ],

      secret: [
        {
          value: 0,
          label: '机密',
        },
        {
          value: 1,
          label: '秘密',
        },
        {
          value: 2,
          label: '限制',
        },
        {
          value: 3,
          label: '公开',
        },
        {
          value: 4,
          label: '其他',
        },
      ],

      consumables: [
        {
          value: 0,
          label: '否',
        },
        {
          value: 1,
          label: '是',
        },
      ],
      deviceShowData: [
        {
          type: '监控视频',
          name: 'zhangsan',
        },
        {
          type: '会场终端',
          name: 'wq',
        },
      ],
      status: '',
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
        children: 'children',
      },
      visible: false,
      dataForm: {
        name: '',
        id: '',
        articleTypeId: '',
        model: '',
        articleStorehouseId: '',
        amount: '',
        measureUnit: '',
        factory: '',
        expireTime: '',
        replaceTime: '',
        nowStatus: '',
        maintainStatus: '',
        level: '',
        secret: '',
        transferMethod: '',
        remark: '',
        isDeleted: '',
        createUserId: '',
        gmtCreate: '',
        modifiedUserId: '',
        gmtModified: '',
        platformId: '',
        consumables: '',
        articleTypeName: '',
        articleStorehouseName: '',
        picPath: '',
      },
      dataRule: {
        name: [
          { required: true, message: '物资名称不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' },
        ],
        articleTypeId: [
          { required: true, message: '物资类型id不能为空', trigger: 'blur' },
        ],
        articleTypeName: [
          { required: true, message: '物资类型名字不能为空', trigger: 'blur' },
        ],
        model: [
          { required: true, message: '物资型号不能为空', trigger: 'blur' },
        ],
        articleStorehouseId: [
          { required: true, message: '物资所属库id不能为空', trigger: 'blur' },
        ],
        articleStorehouseName: [
          { required: true, message: '物资所属库名字不能为空', trigger: 'blur' },
        ],
        amount: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          {
            type: 'number',
            message: '数量必须为整数',
            trigger: 'blur',
            transform(value) {
              return Number(value);
            },
          },
        ],
        measureUnit: [
          { required: true, message: '计量单位不能为空', trigger: 'blur' },
        ],
        factory: [
          { required: true, message: '生产厂家不能为空', trigger: 'blur' },
        ],
        expireTime: [
          { required: true, message: '保质期不能为空', trigger: 'blur' },
        ],
        replaceTime: [
          { required: true, message: '需更换时间不能为空', trigger: 'blur' },
        ],
        nowStatus: [
          {
            required: true,
            message: '现状态 :   0:可正常使用 1:不可正常使用不能为空',
            trigger: 'blur',
          },
        ],
        maintainStatus: [
          {
            required: true,
            message: '维修保养状态 :   0:好  1:良好   2:差不能为空',
            trigger: 'blur',
          },
        ],
        level: [
          {
            required: true,
            message:
              '级别:  0: 国家级  1:省级  2: 市级  3: 县级 4:乡镇级 5:其他不能为空',
            trigger: 'blur',
          },
        ],
        secret: [
          {
            required: true,
            message: '保密级别: 0:机密 1:秘密 2:限制 3:公开 4:其他不能为空',
            trigger: 'blur',
          },
        ],
        transferMethod: [
          /* { required: true, message: '调用方式不能为空', trigger: 'blur' } */
        ],
        remark: [
          /* { required: true, message: '备注不能为空', trigger: 'blur' } */
        ],
        isDeleted: [
          {
            required: true,
            message: '删除 0：未删除  1：已删除不能为空',
            trigger: 'blur',
          },
        ],
        createUserId: [
          { required: true, message: '创建者id不能为空', trigger: 'blur' },
        ],
        gmtCreate: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' },
        ],
        modifiedUserId: [
          { required: true, message: '修改者Id不能为空', trigger: 'blur' },
        ],
        gmtModified: [
          { required: true, message: '修改时间不能为空', trigger: 'blur' },
        ],
        platformId: [
          { required: true, message: '终端用户id不能为空', trigger: 'blur' },
        ],
        consumables: [
          {
            required: true,
            message: '是否易耗品  0:否   1:是不能为空',
            trigger: 'blur',
          },
        ],
      },
      cloudUrl: window.SITE_CONFIG.cloudUrl,
    };
  },
  methods: {
    init(id, status) {
      this.status = status;
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourearticle/info/${this.dataForm.id}`,
            ),
            method: 'get',
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            // console.log("/resoure/resourearticle/info", data);
            // console.log("this", this);
            if (data && data.code === 0) {
              this.dataForm.id = data.resoureArticle.id;
              this.dataForm.name = data.resoureArticle.name;
              this.dataForm.articleTypeId = data.resoureArticle.articleTypeId;
              this.dataForm.model = data.resoureArticle.model;
              this.dataForm.articleStorehouseId = data.resoureArticle.articleStorehouseId;
              this.dataForm.amount = data.resoureArticle.amount;
              this.dataForm.measureUnit = data.resoureArticle.measureUnit;
              this.dataForm.factory = data.resoureArticle.factory;
              this.dataForm.expireTime = data.resoureArticle.expireTime;
              this.dataForm.replaceTime = data.resoureArticle.replaceTime;
              this.dataForm.nowStatus = data.resoureArticle.nowStatus;
              this.dataForm.maintainStatus = data.resoureArticle.maintainStatus;
              this.dataForm.level = data.resoureArticle.level;
              this.dataForm.secret = data.resoureArticle.secret;
              this.dataForm.transferMethod = data.resoureArticle.transferMethod;
              this.dataForm.remark = data.resoureArticle.remark;
              this.dataForm.isDeleted = data.resoureArticle.isDeleted;
              this.dataForm.createUserId = data.resoureArticle.createUserId;
              this.dataForm.gmtCreate = data.resoureArticle.gmtCreate;
              this.dataForm.modifiedUserId = data.resoureArticle.modifiedUserId;
              this.dataForm.gmtModified = data.resoureArticle.gmtModified;
              this.dataForm.platformId = data.resoureArticle.platformId;
              this.dataForm.consumables = data.resoureArticle.consumables;
              this.dataForm.articleStorehouseName = data.resoureArticle.storehouseName;
              this.dataForm.articleTypeName = data.resoureArticle.typeName;
              this.dataForm.picPath = data.resoureArticle.picPath;
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 物资分组树设置当前选中节点
    articleTypeListTreeSetCurrentNode() {
      // console.log("123");
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode()
        || {}).name;
    },
    // 物资库分组树设置当前选中节点
    articleStorehouseListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode()
        || {}).name;
    },
    // 物资类型分组树选中
    articleTypeListTreeCurrentChangeHandle(data, node) {
      // this.dataForm.parentId = data.id
      // console.log("data, node", data, node);
      this.dataForm.articleTypeId = data.id;
      // console.log("this.dataForm.articleTypeId", this.dataForm.articleTypeId);
      this.dataForm.articleTypeName = data.name;
    },
    // 物资库分组树选中
    articleStorehouseListTreeCurrentChangeHandle(data, node) {
      // this.dataForm.parentId = data.id
      // console.log("data, node", data, node);
      this.dataForm.articleStorehouseId = data.id;
      this.dataForm.articleStorehouseName = data.name;
    },
    // 物资类型，当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    articleTypeGettingFocus(event) {
      this.articleTypeVisible = true;
      this.$http({
        url: this.$http.adornUrl('/resoure/resourearticletype/businessType/tree'),
        method: 'get',
        params: {
          apiVersion: '0.0.2',
        },
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // console.log('data: ', data);

            // data.tree.splice(0, 0, { id: 0, name: "顶级分组节点" });
            this.articleTypeList = data.data;
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
    // 物资库类型，当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    articleStorehouseGettingFocus(event) {
      this.articleStorehouseVisible = true;
      this.$http({
        url: this.$http.adornUrl('/resoure/resourearticlestorehouse/list'),
        method: 'get',
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            //  data.articleStorehouseList.splice(0, 0, {
            //   id: 0,
            //   name: "顶级分组节点"
            // });
            // this.articleStorehouseList = treeDataTranslate(
            //   data.articleStorehouseList,
            //   "id"
            // );
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
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourearticle/${!this.dataForm.id ? 'save' : 'update'}`,
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id ? this.dataForm.id : undefined,
              name: this.dataForm.name,
              articleTypeId: this.dataForm.articleTypeId,
              model: this.dataForm.model,
              articleStorehouseId: this.dataForm.articleStorehouseId,
              amount: this.dataForm.amount,
              measureUnit: this.dataForm.measureUnit,
              factory: this.dataForm.factory,
              expireTime: this.dataForm.expireTime,
              replaceTime: this.dataForm.replaceTime,
              nowStatus: this.dataForm.nowStatus,
              maintainStatus: this.dataForm.maintainStatus,
              level: this.dataForm.level,
              secret: this.dataForm.secret,
              transferMethod: this.dataForm.transferMethod,
              remark: this.dataForm.remark,
              consumables: this.dataForm.consumables,
              picPath: this.dataForm.picPath,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit('refreshDataList');
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
  .resource_article {
    .time_detail {
      width: 45%;
      position: absolute;
      right: 20px;
    }
  }
</style>
