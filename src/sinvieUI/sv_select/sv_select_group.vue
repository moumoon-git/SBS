<template>
  <div
    ref="container"
    class="sv-select-group"
  >
    <sv-input-search
      v-model="selectedGroup"
      :suffix="false"
      :readonly="true"
      width="100%"
      :placeholder="placeholder"
      class="sv-select-group__button"
      :clearable="false"
      @click="openTreeDialog"
    />
    <!-- 弹窗 -->
    <sv-dialog
      ref="dialog"
      :title="title"
      @cancel="cancel"
      @modal="cancel"
      @confirm="confirm"
    >
      <div class="sv-select-group__dialog">
        <!-- 树形搜索框 -->
        <sv-input-tree-search
          width="calc(100% - 20px)"
          @change="getTree($event)"
        />
        <!-- 树形 -->
        <div
          v-loading="treeLoading"
          class="sv-tree sv-select-group__dialog__tree"
          element-loading-spinner="sv-loading"
        >
          <el-tree
            ref="tree"
            node-key="id"
            :data="treeList"
            :props="treeProps"
            :highlight-current="true"
            @node-click="treeClick"
          >
            <div
              slot-scope="{node}"
              class="sv-tree-node"
            >
              <div class="label">
                {{ node.label }}
              </div>
            </div>
          </el-tree>
        </div>
      </div>
    </sv-dialog>
    <!-- 提示弹框 -->
    <sv-dialog-hint
      ref="dialog_hint"
      text="请点击选择分组！"
      type="normal"
    />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SvSelectGroup',
  model: {
    prop: 'id',
    event: 'change',
  },
  props: {
    // 按钮的宽度
    width: {
      type: String,
      default: '100%',
    },

    // 树形数据请求接口
    api: {
      type: String,
      required: true,
      default: '/garbage/garbageSortpointGroup/list',
    },

    // 额外参数
    params: {
      type: Object,
      default: () => ({}),
    },

    // 树形数据结构配置
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'id',
      }),
    },

    // 是否显示顶级分组
    top: {
      type: Boolean,
      default: false,
    },

    // 分组的id
    id: {
      type: [Number, String],
      default: '',
    },

    // 分组的名字
    name: {
      type: String,
      default: '',
    },

    // 占位符
    placeholder: {
      type: String,
      default: '请选择分组',
    },

    // 弹窗标题
    title: {
      type: String,
      default: '请选择分组',
    },
  },

  data() {
    return {
      treeList: [],
      treeLoading: false,
      selectedNode: {},
      selectedGroup: '',
    };
  },

  watch: {
    id(val) {
      if (!val && val !== 0) {
        this.selectedGroup = '';
      } else {
        // selectedNode为空的时候，说明是父组件中id改变
        if (Object.keys(this.selectedNode).length === 0) {
          this.selectedGroup = this.name;
        }
      }
    },
  },

  mounted() {
    this.$refs.container.style.width = this.width;
    this.selectedGroup = this.name;
  },

  methods: {
    /**
     * @method
     * @desc 获取树形数据，打开弹窗
     */
    openTreeDialog() {
      this.getTree();
      this.$refs.dialog.visible = true;
    },

    /**
     * @method
     * @desc 获取树形数据
     * @param {String} name 搜索栏关键词
     */
    getTree(name = '') {
      this.treeLoading = true;
      const request = {
        method: 'get',
        url: this.api,
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          token: this.$cookie.get('token'),
          name,
          ...this.params,
        },
      };
      axios(request).then(
        (response) => {
          if (response.data.code === 0) {
            // 插入顶级分组
            if (this.top) {
              const topNode = {};
              topNode[this.treeProps.label] = '顶级分组';
              topNode[this.treeProps.value] = 0;
              topNode[this.treeProps.children] = null;
              this.treeList = [topNode, ...response.data.data];
            } else {
              this.treeList = response.data.data || response.data.list || [];
            }
            this.treeLoading = false;
          } else {
            this.$message.error(`获取树形数据失败！错误信息：${response}`);
          }
        },
      )
        .catch((error) => {
          this.$message.error(`获取树形数据失败！错误信息：${error}`);
        });
    },

    /**
     * @method
     * @desc 树节点点击
     * @param {Object} nodeObj 点击的树节点对象
     */
    treeClick(nodeObj, node){
      this.$emit('clickParentCallBackObj',node);
      this.selectedNode = nodeObj;
    },

    /**
     * @method
     * @desc 确定提交所选节点，节点为空则提示弹框
     * @emit 所选节点的id，节点完整数据
     */
    confirm() {
      if (Object.keys(this.selectedNode).length && Object.keys(this.selectedNode).length > 0) {
        this.$emit('change', this.selectedNode[this.treeProps.value]);
        this.$emit('allData', this.selectedNode);
        this.$refs.dialog.visible = false;
        // 显示选择的节点名
        this.selectedGroup = this.selectedNode[this.treeProps.label];
        this.$nextTick(() => {
          this.selectedNode = {};
        });
      } else {
        // 弹框提示选择
        this.$refs.dialog_hint.visible = true;
      }
    },

    /**
     * @method
     * @desc 关闭弹窗
     */
    cancel() {
      this.$refs.dialog.visible = false;
      this.selectedNode = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.sv-select-group {
    &__button {
        cursor: pointer;
    }
    &__dialog{
        padding-top: 10px;
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    &__dialog__tree {
        margin-top: 10px;
        width: 100%;
        min-height: 200px;
        max-height: 500px;
        height: 200px;
    }
}
</style>
