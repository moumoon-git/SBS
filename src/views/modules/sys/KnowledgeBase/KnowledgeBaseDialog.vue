<template>
  <div>
    <el-dialog
      :title="`${
        type==='add' ? '新增'
        :type==='edit'? '编辑'
          :'查看'}知识`"
      :visible.sync="dialogVisible"
      center
      append-to-body
      class="sbs-dialog"
      destroy-on-close
    >
      <div
        v-loading="isLoading"
        element-loading-spinner="sv-loading"
      >
        <el-form
          ref="dataFormRef"
          :model="dataForm"
          :rules="dataRule"
          label-width="100px"
        >
          <el-form-item label="知识名称" prop="title">
            <el-input
              v-model="dataForm.title"
              placeholder="请输入知识名称"
              class="sbs-input"
              :disabled="type === 'see'"
              :class="$style.width"
            />
          </el-form-item>
          <el-form-item label="所属分组" prop="group">
            <el-cascader
              v-model="dataForm.group"
              placeholder="请选择"
              :options="typeGroup"
              clearable
              collapse-tags
              :props="typeProps"
              :show-all-levels="false"
              class="sbs-cascader"
              :class="$style.width"
              :disabled="type === 'see'"
            />
          </el-form-item>
          <el-form-item label="应急类型">
            <el-cascader
              v-model="dataForm.type"
              placeholder="请选择"
              :options="eventOptions"
              clearable
              collapse-tags
              :props="eventProps"
              :show-all-levels="false"
              class="sbs-cascader"
              :class="$style.width"
              :disabled="type === 'see'"
              @change="changeCascader"
            />
          </el-form-item>
          <el-form-item label="知识标签">
            <el-button
              v-if="type !== 'see'"
              class="sbs-button"
              type="primary"
              @click="openTab"
            >
              +
            </el-button>
            <el-tag
              v-for="item in dataForm.labels"
              :key="Number(item.id)"
              :closable="type !== 'see'"
              :disable-transitions="false"
              :class="[$style.labelItem]"
              :style="`background: ${item.label_style}`"
              @close="handleClose(item)"
            >
              {{ item.name }}
            </el-tag>
            <EntityLabel
              ref="EntityLabelRef"
              @submitData="submitData"
            />
          </el-form-item>
        </el-form>
        <editor-bar
          ref="editorBar"
          v-model="dataForm.text"
          :height-editor="{ height: '368px' }"
          :none-display="{ display: 'flex'}"
          :is-clear="false"
        />
        <div :class="$style.footer">
          <el-button
            class="sbs-button"
            type="plain"
            @click="dialogVisible = false"
          >
            取消
          </el-button>
          <el-button
            class="sbs-button"
            type="primary"
            :disabled="type === 'see'"
            @click="save"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EditorBar from '@/view/eventManagement/informationDisposal/editorChint.vue';
import EntityLabel from '../../DeviceAdmin/SetLabel.vue';

export default {
  components: {
    EntityLabel,
    EditorBar,
  },
  props: {
    platformId: {
      type: String,
      default: '0',
    },
  },
  data() {
    return {
      type: '',
      editor: '',
      dialogVisible: false,
      isLoading: 0,
      eventOptions: [],
      typeGroup: [],
      typeProps: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
        multiple: false,
      },
      eventProps: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
        multiple: true,
      },
      dataForm: {
        id: '', // id
        labels: [], // 标签
        type: [], // 类型
        group: '', // 组
        title: '', // 标题
        text: '', // 富文本
      },
      dataRule: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        group: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    /**
     * @param {String} type edit编辑 see查看 add新增
     * @param {Number} id 当前知识id
     * @description: 初始化弹窗
     */
    init(type, id) {
      this.type = type;
      this.dataForm = {
        id: '', // id
        labels: [], // 标签
        type: [], // 类型
        group: '', // 组
        title: '', // 标题
        text: '',
      };
      this.getTypeGroup();
      this.getEventOptions();
      if (type !== 'add') this.getDetail(id);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.editorBar.setHtml();
        if (this.type === 'see') {
          this.$refs.editorBar.disabled();
        } else {
          // this.$refs.editorBar.active();
        }
      });
    },
    /**
     * @description: 获得详细
     * @param {Number} id 当前数据id
     */
    async getDetail(id) {
      const request = {
        method: 'post',
        url: `/resoure/resourceKnowledgeBase/info/${id}`,
        baseURL: window.SITE_CONFIG.baseUrl,
      };
      this.isLoading = 1;
      try {
        const response = await this.$http(request);
        if (response.data.code === 0) {
          this.dataForm = {
            id: response.data.data.resourceKnowledge.id || 0, // id
            labels: JSON.parse(response.data.data.resourceKnowledge.labels) || [], // 标签
            type: response.data.data.resourceKnowledge.classIdList || [], // 类型
            group: response.data.data.resourceKnowledge.groupId || '', // 组
            title: response.data.data.resourceKnowledge.name || '', // 标题
            text: response.data.data.resourceKnowledge.content || '',
          };
          this.$nextTick(() => {
            this.$refs.editorBar.setHtml();
            if (this.type === 'see') {
              this.$refs.editorBar.disabled();
            } else {
              // this.$refs.editorBar.active();
            }
          });
        } else {
          throw Error(`代码${response.data.code}，${response.data.msg}`);
        }
      } catch (error) {
        this.$message.error(`获取知识详情失败：${error}`);
      } finally {
        this.isLoading = 0;
      }
    },
    /**
     * @description: 获得所属分组数据
     */
    async getTypeGroup() {
      const request = {
        method: 'get',
        url: '/resoure/resourceKnowledgeBaseGroup/list',
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          name: '',
          platformId: String(this.platformId),
        },
      };
      this.isLoading = 1;
      try {
        const response = await this.$http(request);
        if (response.data.code === 0) {
          this.typeGroup = [
            {
              id: 0,
              name: '全部',
              children: null,
            },
            ...response.data.data,
          ];
        } else {
          throw Error(`代码${response.data.code}，${response.data.msg}`);
        }
      } catch (error) {
        this.$message.error(`获取分组数据失败：${error}`);
      } finally {
        this.isLoading = 0;
      }
    },
    /**
     * @description: 获得应急类型数据
     */
    async getEventOptions() {
      const request = {
        method: 'post',
        url: '/eos/caseClass/getTree',
        baseURL: window.g.ApiUrl,
        data: {},
      };
      this.isLoading = 1;
      try {
        const response = await this.$http(request);
        if (response.data.code === 0) {
          this.eventOptions = response.data.data;
        } else {
          throw Error(`代码${response.data.code}，${response.data.msg}`);
        }
      } catch (error) {
        this.$message.error(`获取应急类型失败：${error}`);
      } finally {
        this.isLoading = 0;
      }
    },
    /**
     * @param {Array} val 已选应急类型
     * @description: 获得已选应急类型
     */
    changeCascader(val) {
      this.dataForm.type = val;
    },
    /**
     * @description: 打开标签窗口
     */
    openTab() {
      this.$refs.EntityLabelRef.loadingPopup();
      this.$refs.EntityLabelRef.searchResultList = this.dataForm.labels;
    },
    /**
     * @param {Array} val 已选标签
     * @description: 标签窗口中点击确定的回调
     */
    submitData(val) {
      this.dataForm.labels = val;
    },
    /**
     * @param {Array} item 删除哪一标签
     * @description: 删除标签
     */
    handleClose(item) {
      this.dataForm.labels = this.dataForm.labels.filter((el) => el.id !== item.id);
    },
    /**
     * @description: 点击保存按钮
     */
    save() {
      let request;
      const arr = [];
      if (this.dataForm.type.length) {
        this.dataForm.type.forEach((el) => {
          arr.push(el[el.length - 1]);
        });
      }
      if (this.type === 'add') {
        request = {
          url: '/ser/resoure/resourceKnowledgeBase/save',
          baseURL: window.SITE_CONFIG.cloudUrl,
          method: 'post',
          data: {
            groupId: this.dataForm.group ? this.dataForm.group[this.dataForm.group.length - 1] : '', // 组
            name: this.dataForm.title, // 标题
            content: this.dataForm.text,
            caseClassIds: arr, // 类型
            labelIds: this.dataForm.labels.length ? this.dataForm.labels.map((el) => el.id) : [], // 标签
          },
        };
      } else {
        request = {
          url: '/ser/resoure/resourceKnowledgeBase/update',
          baseURL: window.SITE_CONFIG.cloudUrl,
          method: 'post',
          data: {
            id: this.dataForm.id, // id
            groupId: this.dataForm.group ? this.dataForm.group[this.dataForm.group.length - 1] : '', // 组
            name: this.dataForm.title, // 标题
            content: this.dataForm.text,
            caseClassIds: arr, // 类型
            labelIds: this.dataForm.labels.length ? this.dataForm.labels.map((el) => el.id) : [], // 标签
          },
        };
      }
      this.submit(request);
    },
    /**
     * @param {Object} request 接口参数
     * @description: 接口调用
     */
    async submit(request) {
      try {
        const response = await this.$http(request);
        if (response.data.code === 0) {
          this.$message.success(`${this.type === 'add' ? '新增' : '编辑'}知识成功！`);
          this.dialogVisible = false;
          this.$emit('refresh');
        } else {
          throw Error(`代码${response.data.code}，${response.data.msg}`);
        }
      } catch (error) {
        this.$message.error(`${this.type === 'add' ? '新增' : '编辑'}知识失败！${error}`);
      }
    },
  },
};
</script>

<style lang="scss" module>
  .leftStyle {
    float: left;
    width: 49%;
    padding: 14px;
    border-right: 1px solid #cfcfcf;
    position: relative;
    height: 500px;
    overflow-y: auto;
  }
  .rightStyle {
    float: left;
    width: 49%;
    padding: 14px;
    position: relative;
    height: 500px;
    overflow-y: auto;
    .right {
      float: right;
    }
  }
  .footer {
    margin: 14px;
    text-align: right;
    display: inline-block;
    width: 95%;
  }
  .width {
    width: 200px;
  }
// 标签项
.labelItem {
  color: #FFF;
  vertical-align: middle;
  height: 24px;
  line-height: 24px;
  padding: 0 16px;
  margin: 0 5px 5px 0;
  font-size: 12px;
  border-radius: 16px;
  position: relative;
  max-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:nth-child(4n) {
    background: #f2b626;
  }
  &:nth-child(4n + 1) {
    background: #f66e6e;
  }
  &:nth-child(4n + 2) {
    background: #0091ff;
  }
  &:nth-child(4n + 3) {
    background: #56e9ff;
  }
}
</style>
