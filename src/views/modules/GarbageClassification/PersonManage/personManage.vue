<!--
 * @Author: yanghaohao
 * @Date: 2020-09-16 09:59:41
 * @LastEditTime: 2020-11-23 09:53:36
 * @LastEditors: liukanglin
 * @Description: 垃圾分类的人员管理页面
 * @FilePath: \product_SBS\src\views\modules\GarbageClassification\PersonManage\personManage.vue
-->
<template>
  <div>
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-click="handleTreeNodeClick"
     
      title="人员管理"
      :dateSelect="false"
      :tableRequest="tableRequest"
      :searchSetting="{
        width:'310px',
        placeholder:'请输入人员姓名、单位、职务、电话关键字'
        }"
      :importDataConfig="{
        api: '/garbage/garbageMember/xlsInput',
      }"
      
      :exportSelectConfig="{
        api: '/garbage/garbageMember/xlsOutputSelectGm',
        params: {},
      }"
      :exportQueryConfig="{
        api: '/garbage/garbageMember/xlsOutputCondition',
        params: {   townId: communityType,
          roleId: characterType,
          isParty: partyType,},
      }"
    
      :downloadTemplateConfig="{
        api: '/garbage/garbageMember/gettemplate',
      }"
       :deleteSelectedConfig="{ api: '/garbage/garbageMember/delete' }"
    >
      <template #middle__operation__select>
        <sv-select
          placeholder="请选择社区"
          v-model="communityType"
          :options="communityOptions"
          @change="typeChange"
        ></sv-select>
        <sv-select
          class="header-select"
          v-model="characterType"
          placeholder="请选择角色"
          :options="characterOptions"
          @change="typeChange"
        ></sv-select>
        <sv-select
          class="header-select"
          v-model="partyType"
          placeholder="是否为党员"
          :options="options3"
          @change="typeChange"
        ></sv-select>
      </template>
      <template #middle__operation__button>
        <sv-button class="header-select" @click="addHuman()" type="primary"
          >新增人员</sv-button
        >
        <span class="content-header-char">注册口令：</span>
        <span class="content-header-num">{{ randomValue }}</span>
        <sv-button
          class="content-header-btn"
          type="primary"
          @click="resetVerify"
          >重置</sv-button
        >
        <sv-button class="content-header-btn" type="primary" @click="sendCode"
          >发送校验口令</sv-button
        >
      </template>
      <template #middle__table>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="姓名"
        ></el-table-column>
        <el-table-column
          prop="townIdString"
          header-align="center"
          align="center"
          label="所属社区"
        ></el-table-column>
        <el-table-column
          prop="unit"
          header-align="center"
          align="center"
          label="单位"
        ></el-table-column>
        <el-table-column
          prop="position"
          header-align="center"
          align="center"
          label="职位"
        ></el-table-column>
        <el-table-column
          prop="phone"
          header-align="center"
          align="center"
          label="联系电话"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="是否为党员"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isParty == 2">否</span>
            <span v-if="scope.row.isParty == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column
         
          header-align="center"
          align="center"
          label="角色"
        >
        <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.roleNameList" :key='index'>
            {{item}}<span v-if="index !=scope.row.roleNameList.length - 1">,</span>
            </span>
        </template>

        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['edit', 'delete']"
              @edit="editContent(scope.row)"
              @delete="deleteIds = [scope.row.id]
               $refs.delete_hint.visible = true
             "
            ></sv-table-operation>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <el-dialog
      width="300px"
      :title="type === 0 ? '新增人员' : '编辑人员'"
      :visible.sync="dialogFormVisible"
      class="add-human-dialog"
      @closed="closeDialog"
    >

   
      <el-form
        :model="dataFormAdd"
        :rules="dataRuleAdd"
        ref="dataFormAdd"
        label-width="100px"
        class="dialog_form"
      >
      <el-form-item prop="imageUrl" >
    
         <el-upload
        class="avatar-uploader"
        action
        :show-file-list="false"
        :auto-upload="false"
        :file-list="filelist"
        :on-change="imgHandleChange"
      >
        <img v-if="dataFormAdd.imageUrl"   :src="backgroundURL + dataFormAdd.imageUrl" class="avatar" />

        <img
          v-else
          src="../../../../assets/img/uploadImag.svg"
          class="avatar-uploader-icon"
          alt
        />
       <span class="avatar_upload_tip">{{imageLoading ? '上传中...' : '上传头像' }}</span>
      </el-upload>
     
      </el-form-item>
           <el-form-item label="请选择分组" prop="selectTreeNodeName">
          <el-input
            v-model="dataFormAdd.selectTreeNodeName"
            @focus="selectTreeNode()"
            placeholder="选择分组"
            :readonly="true"
          ></el-input>
          <el-dialog
            title="请选择要新增到的分组节点"
            :visible.sync="selectTreeNodeVisible"
            append-to-body
            width="300px"
            class="selectGroupDialog"
          >
             <el-input
               clearable
               style="margin:10px;"
              placeholder="输入关键字进行过滤"
              v-model="filterText">
          </el-input>
            <el-tree
              :data="selectTreeList"
              :props="treeProp"
              node-key="id"
              ref="tree"
              :filter-node-method="filterNode"
              @current-change="treeChangeHandle"
              :highlight-current="true"
              :auto-expand-parent="true"
            ></el-tree>
           <div class="selectGroup_footer">
              <sv-button
                @click="selectTreeNodeVisible = false"
                >取消</sv-button
              >
              <sv-button
                @click="selectTreeNodeVisible = false"
                 type="primary"
                >确定</sv-button
              >
            </div>
          </el-dialog>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="dataFormAdd.name"
            placeholder="请填写姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            clearable
            v-model="dataFormAdd.sex"
            placeholder="请选择性别"
          >
            <el-option
              v-for="item in sexOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属社区" prop="communityName">
          <el-select
            clearable
            v-model="dataFormAdd.communityName"
            placeholder="请选择社区"
          >
            <el-option
              v-for="item in communityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input
            v-model="dataFormAdd.unit"
            placeholder="请填写单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="job">
          <el-input
            v-model="dataFormAdd.job"
            placeholder="请填写职务"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model.number="dataFormAdd.phone"
            placeholder="请输入手机号码"
           
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色" prop="character">
          <el-select
            clearable
            v-model="dataFormAdd.character"
            placeholder="请选择角色"
          > -->
        <!-- 2020-11-05 tanjinfeng 角色修改为多选 -->
        <el-form-item label="角色" prop="roleIdList">
          <el-select
            clearable
            v-model="dataFormAdd.roleIdList"
            placeholder="请选择角色"
            multiple
          >
            <el-option
              v-for="item in characterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为党员" prop="isParty">
          <el-select
            clearable
            v-model="dataFormAdd.isParty"
            placeholder="选择是否为党员"
          >
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="footer_button">
        <sv-button @click="closeDialog">取 消</sv-button>
        <sv-button  type="primary" @click="addSubmit"
          >确 定</sv-button
        >
      </div>
    </el-dialog>
    <!-- 口令校验 -->
    <el-dialog
      title="重置口令"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
      custom-class="resetStyle"
      class="resetDialog"
    >
  
        <div class="reset_tip">
          <img src="../../../../sinvieUI/img/dialog/hint_alert.svg"    />
          <span class="tip_char">重置口令后，原口令将失效，请谨慎操作</span>
        </div>
        <div class="reset_password">
          登录密码：
          <sv-input-search :suffix="false" v-model="password"></sv-input-search>
        </div>
        <p style="color: red; height: 33px">{{ tip }}</p>
    
      <div class="dialog_footer">
        <sv-button @click="centerDialogVisible = false" width="52px">取 消</sv-button>
        <sv-button type="primary" @click="sureReset" width="52px">确 定</sv-button>
      </div>
    </el-dialog>
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="deleteContent(deleteIds)"
    />

    <add-contact v-if="AddContactView" ref="AddContactView"></add-contact>
  </div>
</template>
<script>
import AddContact from "../PersonManage/addContact/AddContact";
import Cookies from "js-cookie";
export default {
  components: {
    AddContact,
  },
  data() {
       //校验手机号是否合法
       const rulesloginId = (rule, value, callback) => {
      if (!/^1[34578]\d{9}$/.test(value)) {
        callback('手机号信息有误')
      } else {
        callback()
      }
    }
    return {
      imageLoading:false,
      //分组过滤关键字
      filterText:'',
      deleteIds:[],
      filelist: [],
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      taskList:[],
      dataForm: {
       
        //已选择的分组名
        name: "",
        //树的搜索值
        searchName: "",
        //树Id
        treeId: 0,
        //分组描述
        groupDesc: "",
        //父Id
        parentId: 0,
      },
      //新增人员弹窗的数据
      dataFormAdd: {
         //选择的分组名称，这个是保存在选择分组时在弹窗里选择的值
         imageUrl: "",
        selectTreeNodeName: "",
        name: "",
        sex: "",
        phone: "",
        isParty: "",
        character: "",
        roleIdList: "",
        job: "",
        unit: "",
        communityName: "",
        id: "",
      },
      //树形控件数据
      selectTreeList: [],
      treeProp: {
        label: "name",
        children: "children",
      },

      //上传图片地址
    
      imgList: [
        {
          name: "",
          url: "",
        },
      ],
      //表格上方选择框数据
      communityType: "",
      characterType: "",
      partyType: "",
      searchContentName: "",
      treeAddorUpdateDialogVisible: false,
      selectTreeNodeVisible: false,
      //校验口令弹窗布尔值
      centerDialogVisible: false,
      password: "",
      tip: "",
      AddContactView: false,
      //新增人员弹窗布尔值
      dialogFormVisible: false,
      pageIndex: 1,
      //四位随机数
      randomValue: 0,
      //树的组Id
      groupIds: [],
      //当前选中的树节点的数据
      currentNode: "",
      //判断是新增还是编辑，为1是编辑,为0是新增
      type: 0,
      //新增编辑人员弹窗的表单规则
    
      dataRuleAdd: {
           imageUrl: [
          { required: true, message: "请上传头像", trigger: "blur" },
        ],
          selectTreeNodeName: [
          {
            required: true,
            message: "请输入分组名称",
            trigger: "blur,change",
          },
        ],
        name: [
          { required: true, message: "抱歉，名字不能为空", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        communityName: [
          { required: true, message: "请选择所属社区", trigger: "blur,change" },
        ],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" },
                {  validator: rulesloginId, trigger: 'blur' }],
        // 2020-11-05 tanjinfeng 角色修改为多选
        // character: [
        roleIdList: [
          { required: true, message: "请选择角色", trigger: "change,blur" },
        ],
        isParty: [
          {
            required: true,
            message: "请选择是否为党员",
            trigger: "blur,change",
          },
        ],
      },
      //新增树分组的验证规则
      dataFormRule: {
      
        name: [
          {
            required: true,
            message: "请输入分组名称",
            trigger: "blur",
          },
        ],
      },

      //使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        api: "/garbage/garbageMemberGroup/list",
        edit: {
          add:"/garbage/garbageMemberGroup/save",
          update:"/garbage/garbageMemberGroup/update",
          delete:"/garbage/garbageMemberGroup/delete"
        },
      },
      tableRequest: {
        api: "/garbage/garbageMember/list",
        params: {
          townId: this.communityType,
          roleId: this.characterType,
          isParty: this.partyType,
          groupIds:[]
        },
      },
      communityOptions: [],
      characterOptions: [],
      sexOption: [
        {
          label: "男",
          value: "1",
        },
        {
          label: "女",
          value: "2",
        },
      ],
      options3: [
        {
          label: "是",
          value: 1,
        },
        {
          label: "否",
          value: 2,
        },
      ],
    };
  },
  created() {
    this.getRandomValue();
  },
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  mounted() {
    this.getCommunityType();
    this.getCharacterType();
    this.getTreeData()
  },
  methods: {
  
     /**
       * @description: 选择分组时可以进行关键字过滤搜索
       * @param {*} value：获取到的输入框的值
       * @param {*} data：树的结构数据
       * @return {*}
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    ,
    /**
     * @description: 上传图片，通过接口获取的相关数据
     * @param {type} param
     * @return {type} return
     */
    // imgHandleChange(file, fileList) {
    //    this.imageLoading = true;
    //   let formData = new FormData();
    //   fileList.forEach((v) => {
    //     formData.append("files", v.raw);
    //   });
    //   this.$http({
    //     url: this.$http.adornUrl(`/level/levelPublish/upload//file`),
    //     method: "post",
    //     headers: {
    //       "content-type": "multipart/form-data",
    //     },
    //     data: formData,
    //   }).then((data) => {
    //     this.dataFormAdd.imageUrl = data.data.filestr[data.data.filestr.length - 1];

    //     this.imgList[0].url = data.data.filestr[data.data.filestr.length - 1];

    //     this.imgList[0].name = data.data.fileName[data.data.filestr.length - 1];
    //   });
    //   //this.imageLoading = false;
    // },
    /**
     * @method
     * @author tanjinfeng
     * @desc 图片上传方法重构，上传前压缩图片
     * @param {Object} 上传的文件
     */
    imgHandleChange(file) {
      this.imageLoading = true;
      new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target.result;
        }
        reader.readAsDataURL(file.raw);
        img.onload = function() {
          resolve(img)
        }
      }).then(img => {return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const { width: originWidth, height: originHeight } = img
        // 最大尺寸限制
        const maxWidth = 1000
        const maxHeight = 1000
        // 目标尺寸
        let targetWidth = originWidth
        let targetHeight = originHeight
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > 1) {
                // 宽图片
                targetWidth = maxWidth
                targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            } else {
                // 高图片
                targetHeight = maxHeight
                targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            }
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        context.clearRect(0, 0, targetWidth, targetHeight)
        // 图片绘制
        context.drawImage(img, 0, 0, targetWidth, targetHeight)
        canvas.toBlob(function(blob) {
            // blob转换file
            resolve(new File([blob], file.name))
        }, 'image/png')
      })}).then(compressFile => {
        console.log(compressFile)
        let formData = new FormData();
        formData.append("files", compressFile);
        this.$http({
          url: this.$http.adornUrl(`/level/levelPublish/upload//file`),
          method: "post",
          headers: {
            "content-type": "multipart/form-data;charset=UTF-8;",
          },
          data: formData
        }).then((data) => {
          this.dataFormAdd.imageUrl = data.data.filestr[data.data.filestr.length - 1];

          this.imgList[0].url = data.data.filestr[data.data.filestr.length - 1];

          this.imgList[0].name = data.data.fileName[data.data.filestr.length - 1];
        });
      })
    },
    /**
     * @description:树节点的点击事件
     * @param {传入当前点击的树节点数据}
     * @return {type}
     */
    handleTreeNodeClick(obj) {
      if (obj == null) {
        this.groupIds = [];
        this.tableRequest.params.groupIds = this.groupIds;
        this.dataForm.treeId = 0;
      } else {
        this.currentNode = obj;
        this.groupIds = [];
        this.tableRequest.params.groupIds = this.groupIds;
        this.pageIndex = 1;
        if (obj.id == 0) {
          this.groupIds = [];
          this.tableRequest.params.groupIds = this.groupIds;
        } else {
          this.groupIds = [obj.id];
          this.tableRequest.params.groupIds = this.groupIds;
        }

        if (obj.children != null) this.getChildren(obj.children);

        this.dataForm.treeId = obj.id;
      }
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 点击树结点获取相应的子节点
     * @param {}
     * @return {}
     */
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.groupIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d.children);
          }
        });
      }
    },

    /**
     * @description:选择分组
     * @param {type}
     * @return {type}
     */
    selectTreeNode() {
      this.selectTreeNodeVisible = true;
      this.$http({
        url: this.$http.adornUrl("/garbage/garbageMemberGroup/list"),
        method: "get",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.selectTreeNodeName = "";
            data.data.splice(0, 0, { id: 0, name: "顶级分组节点" });
            this.selectTreeList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          //this.treeAddorUpdateDialogVisible = true;
        })
        .then(() => {
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    /**
     * @description: 获取社区下拉框列表数据
     * @param {type}
     * @return {type}
     */
    getCommunityType() {
      this.$http({
        url: this.$http.adornUrl("/sys/systown/treeList"),
        method: "post",
        params: this.$http.adornParams({
          module: "1",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.forEach((item) => {
            item.children.forEach((item) => {
              this.communityOptions.push({
                value: item.id,
                label: item.townName,
              });
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 获取角色类型列表
     * @param {type}
     * @return {type}
     */
    getCharacterType() {
      this.$http({
        url: this.$http.adornUrl("/garbage/garbageRole/list"),
        method: "post",
        params: this.$http.adornParams({
          module: "1",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.page.forEach((item) => {
            this.characterOptions.push({ value: item.id, label: item.name });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 选择下拉框后更新表格
     * @param {type}
     * @return {type}
     */
    typeChange() {
      this.tableRequest.params.townId = this.communityType;
      this.tableRequest.params.isParty = this.partyType;
      this.tableRequest.params.roleId = this.characterType;
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 回车搜索
     * @param {type}
     * @return {type}
     */
    keyupSearch() {
      this.tableRequest.params.search = this.searchContentName;
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description:关闭新增，编辑树节点弹窗
     * @param {type}
     * @return {type}
     */
    clearDialog() {
      this.treeAddorUpdateDialogVisible = false;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
    },
    /**
     * @description:选择分组节点的数据处理
     * @param {type}
     * @return {type}
     */
    treeChangeHandle(data, node) {
      this.dataForm.parentId = data.id;

      this.dataFormAdd.selectTreeNodeName = data.name;
    },
    /**
     * @description: 分组树设置当前选中节点
     * @param {type}
     * @return {type}
     */
    eventTypeListTreeSetCurrentNode() {
      this.$refs.tree.setCurrentKey(this.dataForm.treeId);
      this.dataFormAdd.selectTreeNodeName = (this.$refs.tree.getCurrentNode() ||
        {})["name"];
    },
    /**
     * @description: 删除树节点
     * @param {type}
     * @return {type}
     */
    deleteTree(ids) {
      var that = this;
      if (this.$refs.template.tableList.length > 0) {
        this.$alert("请先删除分组里的内容", "提醒", {
          confirmButtonText: "确定",
        });
        return;
      }
      this.$confirm(`确定要进行[删除]操作?`, "提示", {
        customClass: "message-del",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var checkedNames = "";
        if (that.groupIds.length > 0) {
          that.groupIds.forEach((item) => {
            if (item.system === 1) {
              checkedNames += item.name;
            }
          });
        }
        setTimeout(() => {
          if (checkedNames) {
            that.$message({
              message: `${checkedNames}删除失败`,
              type: "error",
              duration: 1500,
            });
            return 0;
          }
          that
            .$http({
              url: that.$http.adornUrl(`/garbage/garbageMemberGroup/delete`),
              method: "post",
              data: this.$http.adornData({
                ids: that.groupIds,
              }),
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                });
                that.getTreeList();
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },

    /**
     * @description: 编辑树节点
     * @param {type}
     * @return {type}
     */
    editTree() {
      this.type = 1;
      this.treeAddorUpdateDialogVisible = true;
      this.dataForm.name = this.currentNode.name;
      this.dataForm.parentId = this.currentNode.parentId;
      this.dataForm.groupDesc = this.currentNode.remark;
      //this.dataForm.selectTreeNodeName = this.currentNode.name;
    },
    /**
     * @description:点击添加人员按钮触发，弹出新增的弹框
     * @param {type}
     * @return {type}
     */
    addHuman() {
      this.dialogFormVisible = true;
      this.imageLoading = false;
      this.type = 0;
       if (this.currentNode.name == undefined) {
        this.dataFormAdd.selectTreeNodeName = "顶级分组节点";
      } else {
        this.dataFormAdd.selectTreeNodeName = this.currentNode.name;
      }
      this.dataFormAdd.sex = "";
      this.dataFormAdd.name = "";
      this.dataFormAdd.phone = "";
      this.dataFormAdd.isParty = "";
      // this.dataFormAdd.character = "";
      this.dataFormAdd.roleIdList = "";
      this.dataFormAdd.job = "";
      this.dataFormAdd.unit = "";
      this.dataFormAdd.communityName = "";
      this.dataFormAdd.imageUrl = "";
      this.dataForm.parentId = this.currentNode.id;
      this.imgList = [
        {
          name: "",
          url: "",
        },
      ];
    },
    /**
     * @description:新增树节点，一般需要回显所在分组
     * @param {type}
     * @return {type}
     */
    addTree() {
      this.type = 0;
      this.treeAddorUpdateDialogVisible = true;
      this.dataForm.name = "";
      this.dataForm.groupDesc = "";
      this.dataForm.parentId = this.currentNode.id;
     // this.dataForm.selectTreeNodeName = this.currentNode.name;
    },
    /**
     * @description:搜索框右边的新增，默认是新增顶级分组节点
     * @param {type}
     * @return {type}
     */
    addTreeNode() {
      this.type = 0;
      this.treeAddorUpdateDialogVisible = true;
      this.dataForm.name = "";
      this.dataForm.parentId = 0;
     // this.dataForm.selectTreeNodeName = "顶级分组节点";
    },
      /**
     * @description: 循环获得tree的Id,用来回显所属分组名称
     * @param data 为点击行的行数据，目的是获得其id进行匹配，list则是原始tree结构 
     * @return {type} 
     */
    getAllId(data,list) {
      if (list != null && list.length > 0) {
        try {
          list.forEach((d) => {
            if (data.groupId === d.id) {
              this.dataFormAdd.selectTreeNodeName = d.name;
              throw Error();
            }
            if (d.children != null && d.children.length > 0) {
              this.getAllId(data,d.children);
            }
          });
        } catch (err) {}
      }
    },
    /**
     * @description: 编辑选择的表格行数据
     * @param {传入当前行的id}
     * @return {type}
     */
    editContent(data) {
      this.imageLoading = false;
       this.dataFormAdd.selectTreeNodeName = "顶级分组";
      this.getAllId(data,this.taskList);
      (this.dataFormAdd.imageUrl = ""),
        this.$http({
          url: this.$http.adornUrl(`/garbage/garbageMember/info/${data.id}`),
          method: "get",
          params: this.$http.adornParams(),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataFormAdd.roleIdList = data.data.roleIdList
            this.imgList =
              data.data.imgList.length != 0
                ? data.data.imgList
                : [
                    {
                      name: "",
                      url: "",
                    },
                  ];
            this.dataFormAdd.imageUrl =
              data.data.imgList.length != 0 ? data.data.imgList[0].url : "";
          } else {
            this.$message.error(data.msg);
          }
        });
      this.dialogFormVisible = true;
      this.type = 1;
      this.dataForm.parentId = data.groupId;
      this.dataFormAdd.id = data.id;
      this.dataFormAdd.sex = data.sex;
      this.dataFormAdd.name = data.name;
      this.dataFormAdd.phone = data.phone;
      this.dataFormAdd.isParty = data.isParty;
      // this.dataFormAdd.character = data.roleId;
      this.dataFormAdd.job = data.position;
      this.dataFormAdd.unit = data.unit;
      this.dataFormAdd.communityName = data.townId;
    },
        /**
     * @description: 获取树节点的相关数据
     * @param {type}
     * @return {type}
     */
    getTreeData() {
      this.$http({
        url: this.$http.adornUrl("/garbage/garbageMemberGroup/list"),
        method: "get",
        params: this.$http.adornParams({
          name: "",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.taskList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description:删除选中的表格的行数据
     * @param {传入当前行id}
     * @return {type}
     */
    deleteContent(ids) {
       const request = {
        method: "post",
        url: "/garbage/garbageMember/delete",
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code == 0) {
            // 提交成功后，刷新表格
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            console.log("删除失败！错误信息：【\n", response, "\n】");
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          console.log("删除失败！错误信息：【\n", error, "\n】");
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
    /**
     * @description: 通过后台获取四位随机数
     * @param {type}
     * @return {type}
     */
    getRandomValue() {
      this.$http({
        url: this.$http.adornUrl("/pass/passCode/getCode"),
        method: "post",
      }).then(({ data }) => {
        if (data.msg === "success") {
          this.randomValue = data.code;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description:新增修改树节点的表单提交
     * @param {type}
     * @return {type}
     */
    treeDataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid && (this.type === 0 || this.type === 1)) {
          this.$http({
            url: this.$http.adornUrl(
              `/garbage/garbageMemberGroup/${
                this.type === 0 ? "save" : "update"
              }`
            ),

            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.treeId || undefined,
              parentId: this.dataForm.parentId,
              name: this.dataForm.name,
              remark: this.dataForm.treeRemark,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.treeAddorUpdateDialogVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.$refs.template.getTree();
            } else {
              this.$message.error("请选择您要新增到的分组");
            }
          });
        }
      });
    },
    /**
     * @description:新增人员弹窗的确认提交
     * @param {type}
     * @return {type}
     */
    addSubmit() {
      this.$refs["dataFormAdd"].validate((vaild) => {
        if (vaild) {
          this.$http({
            url: this.$http.adornUrl(
              `/garbage/garbageMember/${
                this.type === 0 ? "pcSave" : "pcUpdate"
              }`
            ),

            method: "post",
            data: this.$http.adornData({
              id: this.dataFormAdd.id || undefined,
              name: this.dataFormAdd.name,
              sex: this.dataFormAdd.sex,
              townId: this.dataFormAdd.communityName,
              // 2020-11-05 tanjinfeng 角色修改为多选
              // roleId: this.dataFormAdd.character,
              roleIdList: this.dataFormAdd.roleIdList,
              isParty: this.dataFormAdd.isParty,
              unit: this.dataFormAdd.unit,
              position: this.dataFormAdd.job,
              phone: this.dataFormAdd.phone,
              groupId: this.dataForm.parentId,
              password: "",
              imgList: this.imgList,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              if (data.resultMsg == -3) {
                this.$message.error("手机号已存在，请更换其他号码");
              } else {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                });
                this.dialogFormVisible = false;

                this.$refs.template.getTableList(this.tableRequest);
              }
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    /**
     * @description:关闭新增弹窗
     * @param {type}
     * @return {type}
     */
    closeDialog() {
      this.dialogFormVisible = false;
      this.$nextTick(() => {
        this.$refs["dataFormAdd"].resetFields();
      });
    },
    /**
     * @description: 重置口令弹窗
     * @param {type}
     * @return {type}
     */
    resetVerify() {
      this.centerDialogVisible = true;
    },
    /**
     * @description: 确认更改口令
     * @param {type}
     * @return {type}
     */
    sureReset() {
      this.$http({
        url: this.$http.adornUrl("/pass/passCode/reupdate"),
        method: "post",
        data: this.$http.adornData({
          password: this.password,
        }),
      }).then(({ data }) => {
        if (data.msg === "success") {
          this.$message({
            type: "success",
            customClass: "message-logout",
            dangerouslyUseHTMLString: true,
            message:
              '<br><div style="margin:20px 0;">原口已令失效，请使用新口令进行相关业务操作。<div>',
          });
          // $(".el-message__icon").after("<span>重置成功</span>");
          this.centerDialogVisible = false;
          this.getRandomValue();
          this.password = "";
        } else {
          this.tip = "重置失败，登录" + data.msg;
        }
      });
    },
    /**
     * @description: 发送校验口令
     * @param {type}
     * @return {type}
     */
    sendCode() {
      this.AddContactView = true;
      this.$nextTick(() => {
        this.$refs.AddContactView.getDataList([]);
      });
    },
  },
};
</script>

<style src="./personManage.less" lang="less">

</style>