<template>
  <el-dialog
    :title="!dataForm.id ? '新增物资' : '修改'"
    :close-on-click-modal="false"
    width="750px"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="物资名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="物资名称"></el-input>
      </el-form-item>

      <el-form-item label="物资类型" prop="articleTypeName">
        <el-dialog
          title="请选择要新增到的分组节点"
          :visible.sync="articleTypeVisible"
          width="30%"
          append-to-body
        >
          <el-tree
            :data="articleTypeList"
            :props="articleTypeListTreeProps"
            node-key="id"
            ref="eventTypeTree"
            @current-change="articleTypeListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="articleTypeVisible = false">取 消</el-button>
            <el-button type="primary" @click="articleTypeVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.articleTypeName"
          @focus="articleTypeGettingFocus"
          v-popover:eventTypeListPopover
          placeholder="选择分组"
        ></el-input>
        <el-input v-show="false" v-model="dataForm.articleTypeId"></el-input>
      </el-form-item>

      <el-form-item label="物资仓库" prop="articleStorehouseName">
        <el-dialog
          title="请选择要新增到的分组节点"
          :visible.sync="articleStorehouseVisible"
          width="30%"
          append-to-body
        >
          <el-tree
            :data="articleStorehouseList"
            :props="articleStorehouseListTreeProps"
            node-key="id"
            ref="eventTypeTree"
            @current-change="articleStorehouseListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="articleStorehouseVisible = false">取 消</el-button>
            <el-button type="primary" @click="articleStorehouseVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.articleStorehouseName"
          @focus="articleStorehouseGettingFocus"
          v-popover:eventTypeListPopover
          placeholder="选择分组"
          :readonly="true"
        ></el-input>
        <el-input v-show="false" v-model="dataForm.articleStorehouseId" :readonly="true"></el-input>
      </el-form-item>

      <el-form-item label="物资数量" prop="amount" style="width: 45%;position: absolute;right: 20px;">
        <el-input v-model="dataForm.amount" placeholder="物资数量"></el-input>
      </el-form-item>

      <el-form-item label="物资型号" prop="model" style="width: 45%">
        <el-input v-model="dataForm.model" placeholder="物资型号"></el-input>
      </el-form-item>

      <el-form-item
        label="计量单位"
        prop="measureUnit"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <el-input v-model="dataForm.measureUnit" placeholder="计量单位"></el-input>
      </el-form-item>

      <el-form-item label="生产厂家" prop="factory" style="width: 45%">
        <el-input v-model="dataForm.factory" placeholder="生产厂家"></el-input>
      </el-form-item>

      <el-form-item
        label="有效期"
        prop="replaceTime"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <template>
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              unlink-panels
              v-model="dataForm.replaceTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </template>
      </el-form-item>

      <el-form-item label="保质期" prop="expireTime" style="width: 45%">
        <template>
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              unlink-panels
              v-model="dataForm.expireTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </template>
      </el-form-item>

      <el-form-item
        label="维修状态"
        prop="maintainStatus"
        style="width: 45%;position: absolute;right: 20px;"
      >
        <el-select v-model="dataForm.maintainStatus" placeholder="请选择" style="width: 220px;">
          <el-option
            v-for="item in maintainStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="现在状态" prop="nowStatus" style="width: 45%">
        <el-select v-model="dataForm.nowStatus" placeholder="请选择" style="width: 220px;">
          <el-option
            v-for="item in nowStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="保密标准" prop="secret" style="width: 45%;position: absolute;right: 20px;">
        <el-select v-model="dataForm.secret" placeholder="请选择" style="width: 220px;">
          <el-option
            v-for="item in secret"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="物资级别" prop="level" style="width: 45%">
        <el-select v-model="dataForm.level" placeholder="请选择" style="width: 220px;">
          <el-option
            v-for="item in level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!--<el-form-item label="调用方式" prop="transferMethod">
        <el-input v-model="dataForm.transferMethod" placeholder="调用方式"></el-input>
      </el-form-item>-->

      <el-form-item label="是否易耗" prop="consumables">
        <el-select v-model="dataForm.consumables" placeholder="请选择" style="width: 220px;">
          <el-option
            v-for="item in consumables"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="物资图片:">
        <el-upload
          class="picture-card"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <img v-if="dataForm.picPath" :src="dataForm.picPath" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="3" v-model="dataForm.remark" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align:center;margin-top:-50px;">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      nowStatus: [
        {
          value: 0,
          label: "可正常使用"
        },
        {
          value: 1,
          label: "不可正常使用"
        }
      ],

      maintainStatus: [
        {
          value: 0,
          label: "好"
        },
        {
          value: 1,
          label: "良好"
        },
        {
          value: 2,
          label: "差"
        }
      ],

      level: [
        {
          value: 0,
          label: "国家级"
        },
        {
          value: 1,
          label: "省级"
        },
        {
          value: 2,
          label: "市级"
        },
        {
          value: 3,
          label: "县级"
        },
        {
          value: 4,
          label: "乡镇级"
        },
        {
          value: 5,
          label: "其他"
        }
      ],

      secret: [
        {
          value: 0,
          label: "机密"
        },
        {
          value: 1,
          label: "秘密"
        },
        {
          value: 2,
          label: "限制"
        },
        {
          value: 3,
          label: "公开"
        },
        {
          value: 4,
          label: "其他"
        }
      ],

      consumables: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],

      articleTypeVisible: false,
      articleStorehouseVisible: false,
      articleTypeList: [],
      articleStorehouseList: [],
      articleTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      articleStorehouseListTreeProps: {
        label: "name",
        children: "children"
      },
      visible: false,
      dataForm: {
        name: "",
        id: 0,
        articleTypeId: "",
        model: "",
        articleStorehouseId: "",
        amount: "",
        measureUnit: "",
        factory: "",
        expireTime: "",
        replaceTime: "",
        nowStatus: "",
        maintainStatus: "",
        level: "",
        secret: "",
        transferMethod: "",
        remark: "",
        isDeleted: "",
        createUserId: "",
        gmtCreate: "",
        modifiedUserId: "",
        gmtModified: "",
        platformId: "",
        consumables: "",
        articleTypeName: "",
        articleStorehouseName: "",
        picPath: ""
      },
      dataRule: {
        name: [
          { required: true, message: "物资名称不能为空", trigger: "blur" }
        ],
        articleTypeId: [
          { required: true, message: "物资类型id不能为空", trigger: "blur" }
        ],
        articleTypeName: [{ required: true, message: "物资类型名字不能为空" }],
        model: [
          { required: true, message: "物资型号不能为空", trigger: "blur" }
        ],
        articleStorehouseId: [
          { required: true, message: "物资所属库id不能为空", trigger: "blur" }
        ],
        articleStorehouseName: [
          { required: true, message: "物资所属库名字不能为空" }
        ],
        amount: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          {
            type: "number",
            message: "数量必须为整数",
            trigger: "blur",
            transform: function(value) {
              return Number(value);
            }
          }
        ],
        measureUnit: [
          { required: true, message: "计量单位不能为空", trigger: "blur" }
        ],
        factory: [
          { required: true, message: "生产厂家不能为空", trigger: "blur" }
        ],
        expireTime: [
          { required: true, message: "保质期不能为空", trigger: "blur" }
        ],
        replaceTime: [
          { required: true, message: "需要更换的时间不能为空", trigger: "blur" }
        ],
        nowStatus: [
          {
            required: true,
            message: "现状态 :   0:可正常使用 1:不可正常使用不能为空",
            trigger: "blur"
          }
        ],
        maintainStatus: [
          {
            required: true,
            message: "维修保养状态 :   0:好  1:良好   2:差不能为空",
            trigger: "blur"
          }
        ],
        level: [
          {
            required: true,
            message:
              "级别:  0: 国家级  1:省级  2: 市级  3: 县级 4:乡镇级 5:其他不能为空",
            trigger: "blur"
          }
        ],
        secret: [
          {
            required: true,
            message: "保密级别: 0:机密 1:秘密 2:限制 3:公开 4:其他不能为空",
            trigger: "blur"
          }
        ],
        transferMethod: [
          // { required: true, message: '调用方式不能为空', trigger: 'blur' }
        ],
        remark: [
          // { required: true, message: '备注不能为空', trigger: 'blur' }
        ],
        isDeleted: [
          {
            required: true,
            message: "删除 0：未删除  1：已删除不能为空",
            trigger: "blur"
          }
        ],
        createUserId: [
          { required: true, message: "创建者id不能为空", trigger: "blur" }
        ],
        gmtCreate: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        modifiedUserId: [
          { required: true, message: "修改者Id不能为空", trigger: "blur" }
        ],
        gmtModified: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ],
        platformId: [
          { required: true, message: "终端用户id不能为空", trigger: "blur" }
        ],
        consumables: [
          {
            required: true,
            message: "是否易耗品  0:否   1:是不能为空",
            trigger: "blur"
          }
        ]
      },
      cloudUrl: window.SITE_CONFIG.cloudUrl
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourearticle/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.articleTypeId = data.resourearticle.articleTypeId;
              this.dataForm.model = data.resourearticle.model;
              this.dataForm.articleStorehouseId =
                data.resourearticle.articleStorehouseId;
              this.dataForm.amount = data.resourearticle.amount;
              this.dataForm.measureUnit = data.resourearticle.measureUnit;
              this.dataForm.factory = data.resourearticle.factory;
              this.dataForm.expireTime = data.resourearticle.expireTime;
              this.dataForm.replaceTime = data.resourearticle.replaceTime;
              this.dataForm.nowStatus = data.resourearticle.nowStatus;
              this.dataForm.maintainStatus = data.resourearticle.maintainStatus;
              this.dataForm.level = data.resourearticle.level;
              this.dataForm.secret = data.resourearticle.secret;
              this.dataForm.transferMethod = data.resourearticle.transferMethod;
              this.dataForm.remark = data.resourearticle.remark;
              this.dataForm.isDeleted = data.resourearticle.isDeleted;
              this.dataForm.createUserId = data.resourearticle.createUserId;
              this.dataForm.gmtCreate = data.resourearticle.gmtCreate;
              this.dataForm.modifiedUserId = data.resourearticle.modifiedUserId;
              this.dataForm.gmtModified = data.resourearticle.gmtModified;
              this.dataForm.platformId = data.resourearticle.platformId;
              this.dataForm.consumables = data.resourearticle.consumables;
              this.dataForm.picPath = data.resourearticle.picPath
            }else{
              this.$message.error(data.msg)
            }
          });
        }
      });
    },
    //物资分组树设置当前选中节点
    articleTypeListTreeSetCurrentNode() {
      // console.log("123");
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})["name"];
    },
    //物资库分组树设置当前选中节点
    articleStorehouseListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})["name"];
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
    //物资类型，当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    articleTypeGettingFocus(event) {
      this.articleTypeVisible = true;
      this.$http({
        url: this.$http.adornUrl("/resoure/resourearticletype/tree"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code == 0) {
          // data.tree.splice(0,0, {id:0,name: '顶级分组节点'})
            this.articleTypeList = treeDataTranslate(data.tree, "id");
          }else{
            this.$message.error(data.msg)
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
    //物资库类型，当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    articleStorehouseGettingFocus(event) {
      this.articleStorehouseVisible = true;
      this.$http({
        url: this.$http.adornUrl("/resoure/resourearticlestorehouse/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
           if (data && data.code == 0) {
            // data.articleStorehouseList.splice(0,0, {id:0,name: '顶级分组节点'})
              this.articleStorehouseList = treeDataTranslate(
                data.articleStorehouseList,
                "id"
              );
          }else{
            this.$message.error(data.msg)
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
      // console.log(
      //   "this.dataForm.expireTime",
      //   this.dataForm.expireTime,
      //   typeof this.dataForm.expireTime
      // );
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourearticle/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              name: this.dataForm.name,
              // 'id': this.dataForm.id || undefined,
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
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                  this.$emit("close");
                }
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
      let that = this;
      let form = new FormData();
      form.append("file", file);
      this.$http({
        url: this.$http.adornUrl("/upload/file"),
        method: "post",
        data: form
      })
        .then(({ data }) => {
          if (data && data.code == 0) {
            this.dataForm.picPath = this.cloudUrl + data.url;
          }else{
            this.$message.error(data.msg)
          }
          
        })
        .catch(err => {});
    }
  }
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
