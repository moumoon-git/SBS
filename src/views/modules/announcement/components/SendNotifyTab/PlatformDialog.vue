<template lang="">
  <el-dialog
    title="请选择平台"
    :visible.sync="dialogVisible"
    width="794px"
    :class="$style.PlatformDialog"
    append-to-body
  >
    <div :class="$style.dialogWrap">
      <el-input
        v-model="platformSearch"
        placeholder="请输入平台名称搜索"
        suffix-icon="el-icon-search"
      />
      <div :class="$style.treeBox">
        <el-tree
          :class="$style.tree"
          :data="platFormList"
          :props="defaultProps"
          check-strictly
          show-checkbox
          default-expand-all
          node-key="id"
          :current-node-key="0"
          :default-checked-keys="checkedKeys"
          @check-change="handleCheckChange"
        />
        <ul :class="$style.right">
          <li
            v-for="item in platFormRightList"
            :key="item.id"
          >
            {{ item.platformName }}
            <i class="el-icon-close" />
          </li>
        </ul>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogVisible = false">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'PlatformDialog',
  data() {
    return {
      dialogVisible: false,
      platformSearch: '',
      platFormList: [],
      defaultProps: {
        children: 'children',
        label: 'platformName',
      },
      checkedKeys: [],
      platFormRightList: [],
    };
  },
  methods: {
    getTree(platformIds) {
      this.$http({
        url: this.$http.adornUrl('/sys/platform/treeList'),
        method: 'get',
      }).then(({ data }) => {
        this.platFormList = data.data;

        this.dialogVisible = true;
        this.$nextTick(() => {
          this.checkedKeys = platformIds || [];
        });
      });
    },
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.platFormRightList.push(data);
      } else {
        const i = this.platFormRightList.findIndex((item) => item.id);
        this.platFormRightList.splice(i, 1);
      }
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', data, checked, indeterminate);
    },
    confirm() {
      this.$emit('platformSelect', this.platFormRightList);
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" module>
  .PlatformDialog{
    .dialogWrap {
      padding: 2px 2px 15px 2px;
      border: 1px solid #aaaaaa;
      .treeBox {
        margin-top: 10px;
        display: flex;
        .tree {
          flex: 1;
          height: 535px;
          overflow-y: auto;
          margin-right: 3px;
          &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
            background: transparent;
          }
          &::-webkit-scrollbar-thumb {
            background: #d5d5d5;
            border-radius: 5px;
          }
          &::-webkit-scrollbar-corner {
            background: transparent;
          }
        }
        .right {
          list-style: none;
          flex: 1;
          border-left: 1px solid #aaaaaa;
        }
      }
    }
  }
</style>
