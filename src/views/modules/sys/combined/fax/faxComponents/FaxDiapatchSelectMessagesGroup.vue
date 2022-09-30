<template>
  <div ref="container">
    <sv-input-search
      v-model="selectedGroup"
      :class="$style.button"
      class="sv-select-group__button"
      :clearable="false"
      placeholder="请选择分组"
      :readonly="true"
      :suffix="false"
      width="100%"
      @click="openTreeDialog"
    />
    <!-- 弹窗 -->
    <sv-dialog
      ref="dialog"
      title="请选择分组"
      @cancel="cancel"
      @confirm="confirm"
      @modal="cancel"
    >
      <div :class="$style.container">
        <!-- 树形搜索框 -->
        <sv-input-tree-search
          width="calc(100% - 20px)"
          @change="getTree"
        />
        <!-- 树形 -->
        <div
          v-loading="treeLoading"
          element-loading-spinner="sv-loading"
          :class="['sv-tree', $style.tree]"
        >
          <el-tree
            ref="tree"
            node-key="id"
            :data="treeList"
            :props="treeProps"
            :highlight-current="true"
            @node-click="treeClick"
          />
        </div>
      </div>
    </sv-dialog>
  </div>
</template>

<script>
export default {
  name: 'FaxDiapatchSelectMessagesGroup',

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

    // 分组的id
    id: {
      type: [Number, String],
      default: 0,
    },

    // 分组的名字
    name: {
      type: String,
      default: '顶级分组',
    },
  },

  data() {
    return {
      // 树形数据
      treeList: [],
      // 正在请求树形数据
      treeLoading: false,
      // 选中的分组节点
      selectedNode: {},
      // 选中的分组名
      selectedGroup: '',
      // 树形数据结构配置
      treeProps: {
        children: 'children',
        label: 'groupName',
        value: 'id',
      },
    };
  },

  mounted() {
    this.$refs.container.style.width = this.width;
    this.selectedGroup = this.name;
  },

  methods: {
    /**
     * @description 获取树形数据，打开弹窗
     */
    openTreeDialog() {
      this.getTree();
      this.$refs.dialog.visible = true;
    },

    /**
     * @description 获取树形数据
     * @param { String } search 搜索关键词
     */
    getTree(search) {
      this.treeLoading = true;
      const request = {
        method: 'GET',
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/cdrFaxGroup/getCdrFaxGroupList',
        params: {
          groupName: search,
        },
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.errorcode === 0) {
            // 插入顶级分组
            const topNode = {
              groupName: '顶级分组',
              id: 0,
              children: null,
            };
            this.treeList = [topNode, ...response.data];
          }
        })
        .finally(() => { this.treeLoading = false; });
    },

    /**
     * @description 树节点点击
     * @param { Object } nodeObj 点击的树节点对象
     */
    treeClick(nodeObj) {
      this.selectedNode = nodeObj;
    },

    /**
     * @method
     * @description 确定提交所选节点，节点为空则提示弹框
     * @emit 所选节点的id，节点完整数据
     */
    confirm() {
      if (
        Object.keys(this.selectedNode).length
        && Object.keys(this.selectedNode).length > 0
      ) {
        this.$emit('change', this.selectedNode.id);
        this.$refs.dialog.visible = false;
        // 显示选择的节点名
        this.selectedGroup = this.selectedNode.groupName;
        // 清空选择节点
        this.selectedNode = {};
      } else {
        // 弹框提示选择
        this.$message.error('请点击选择分组！');
      }
    },

    /**
     * @description 关闭弹窗
     */
    cancel() {
      this.$refs.dialog.visible = false;
      this.selectedNode = {};
    },
  },
};
</script>

<style lang="scss" module>
.button { cursor: pointer; }

.container {
  padding-top: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tree {
  margin-top: 10px;
  width: 100%;
  min-height: 200px;
  max-height: 500px;
  height: 200px;
}
</style>
