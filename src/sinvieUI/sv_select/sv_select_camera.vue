<template>
  <div class="sv-select-camera">
    <sv-button
      type="secondary"
      @click="$refs.dialog.visible = true"
    >
      选择摄像头
    </sv-button>
    <sv-dialog
      ref="dialog"
      title="请选择摄像头"
      @cancel="cancel"
      @modal="cancel"
      @confirm="confirm"
    >
      <div class="sv-select-camera__container">
        <sv-input-tree-search
          v-model="searchKeyword"
          width="calc(100% - 20px)"
          @change="
            currentPage = 1;
            getCameraList();
          "
        />
        <div
          v-loading="loading"
          element-loading-spinner="sv-loading"
          class="sv-tree"
        >
          <el-tree
            ref="tree"
            node-key="id"
            :data="cameraList"
            :props="treeProps"
            :highlight-current="true"
            :show-checkbox="true"
            :default-checked-keys="treeCheckedIds"
            :check-on-click-node="true"
            @check-change="handleCheck"
          />
        </div>
        <div
          class="sv-pagination"
        >
          <el-pagination
            :total="totalCount"
            :current-page="currentPage"
            :page-size="10"
            :pager-count="9"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </sv-dialog>
    <div class="sv-select-camera__result">
      <span
        v-for="(item, index) in displayCheckedNodes"
        :key="index"
        class="sv-select-camera__result__item"
      >
        {{ item.name }}
        <span @click="deleteItem(item.id)">×</span>
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SvSelectCamera',

  model: {
    prop: 'indexCodeList',
    event: 'update',
  },

  props: {
    // 树形数据请求接口
    setting: {
      type: Object,
      default: () => ({
        api: 'risk/riskcamera/list',
        params: {},
      }),
      required: true,
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

    // 已选摄像头列表
    indexCodeList: {
      type: Array,
      default: () => [],
    },

    // 已选摄像头详细信息列表
    riskCameraEntities: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      loading: false,
      // 摄像头列表
      cameraList: [],
      currentPage: 1,
      totalCount: 0,
      // 搜索关键词
      searchKeyword: '',
      displayCheckedNodes: [],
      treeCheckedNodes: [],
      treeCheckedIds: [],
    };
  },

  watch: {
    riskCameraEntities: {
      deep: true,
      handler(val) {
        this.treeCheckedIds = [];
        val.forEach((camera) => {
          this.treeCheckedIds.push(camera.id);
        });
        this.treeCheckedNodes = [...val];
        this.displayCheckedNodes = [...val];
        const result = [];
        this.treeCheckedNodes.forEach((camera) => {
          result.push(camera.indexCode);
        });
        this.$emit('update', result);
      },
    },
  },

  mounted() {
    // 获取摄像头列表
    this.getCameraList();
    // 将传参保存
    this.riskCameraEntities.forEach((camera) => {
      this.treeCheckedIds.push(camera.id);
    });
    this.treeCheckedNodes = [...this.riskCameraEntities];
    this.displayCheckedNodes = [...this.treeCheckedNodes];
    const result = [];
    this.treeCheckedNodes.forEach((camera) => {
      result.push(camera.indexCode);
    });
    this.$emit('update', result);
  },

  methods: {
    /**
     * @method
     * @desc 获取摄像头列表
     */
    getCameraList() {
      this.loading = true;
      const request = {
        method: 'get',
        url: this.setting.api,
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          token: this.$cookie.get('token'),
          page: this.currentPage,
          limit: 10,
          key: this.searchKeyword,
          platformId: '',
          cameraType: '',
          ...this.setting.params,
        },
      };
      axios(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.cameraList = response.data.page.list;
            this.totalCount = response.data.page.totalCount;
            // this.$refs.tree.setCheckedKeys(this.treeCheckedIds)
          } else {
            this.$message.error(`获取摄像头列表失败！错误信息：${response}`);
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(`获取摄像头列表失败！错误信息：${error}`);
          this.loading = false;
        });
    },

    /**
     * @method
     * @desc 勾选
     */
    handleCheck(
      nodeObj,
      isSelected,
    ) {
      if (isSelected) {
        this.treeCheckedIds.push(nodeObj.id);
        this.treeCheckedNodes.push(nodeObj);
      } else {
        const index = this.treeCheckedIds.indexOf(nodeObj.id);
        this.treeCheckedIds.splice(index, 1);
        this.treeCheckedNodes.splice(index, 1);
      }
      this.$refs.tree.setCheckedKeys(this.treeCheckedIds);
    },

    /**
     * @method
     * @desc 删除摄像头
     * @param {Number} id 该摄像头的id
     */
    deleteItem(id) {
      const index = this.treeCheckedIds.indexOf(id);
      this.treeCheckedNodes.splice(index, 1);
      this.displayCheckedNodes.splice(index, 1);
      this.treeCheckedIds.splice(index, 1);
      const result = [];
      this.treeCheckedNodes.forEach((camera) => {
        result.push(camera.indexCode);
      });
      this.$emit('update', result);
    },

    /**
     * @method
     * @desc 分页器跳转
     * @param {Number} page 新页数
     */
    handlePageChange(page) {
      this.currentPage = page;
      this.getCameraList();
    },

    /**
     * @method
     * @desc 点击取消，还原数据
     */
    cancel() {
      this.currentPage = 1;
      this.$refs.dialog.visible = false;
      // 勾选节点数据还原为展示数据
      this.treeCheckedNodes = [...this.displayCheckedNodes];
      this.treeCheckedIds = [];
      this.displayCheckedNodes.forEach((camera) => {
        this.treeCheckedIds.push(camera.id);
      });
      this.$refs.tree.setCheckedKeys(this.treeCheckedIds);
    },

    /**
         * @method
         * @desc 点击确定，更新数据
         */
    confirm() {
      this.currentPage = 1;
      const result = [];
      this.treeCheckedNodes.forEach((camera) => {
        result.push(camera.indexCode);
      });
      this.displayCheckedNodes = [...this.treeCheckedNodes];
      this.$emit('update', result);
      this.$refs.dialog.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.sv-select-camera {
    .sv-input-tree-search {
        margin: 10px;
    }
    .sv-tree {
        width: 500px;
        height: 450px;
        overflow-y: auto;
    }
    .sv-pagination {
        margin: 10px;
    }
    &__result {
        &__item {
            white-space: nowrap;
            font-size: 14px;
            display: inline-block;
            height: 30px;
            line-height: 28px;
            border: 1px solid #E0E0E0;
            border-radius: 3px;
            background: #FAFAFA;
            padding: 0 5px;
            margin: 10px 10px 0 0;
            cursor: default;
            color: #999999;
            // 删除按钮
            span {
                cursor: pointer;
                font-size: 18px;
                &:hover {
                    color: #b4b4b4;
                }
            }
        }
    }
}
</style>
