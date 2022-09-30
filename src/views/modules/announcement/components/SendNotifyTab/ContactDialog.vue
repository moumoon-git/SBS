<template lang="">
  <el-dialog
    title="请选择联系人"
    :visible.sync="dialogVisible"
    width="944px"
    :class="$style.contactDialog"
    append-to-body
    destroy-on-close
  >
    <div
      :class="$style.dialogWrap"
    >
      <div :class="$style.treeBox">
        <el-tree
          :class="$style.tree"
          :data="contactList"
          :props="defaultProps"
          node-key="id"
          :current-node-key="0"
          @node-click="handleNodeClick"
        /> <div
          :class="$style.middle"
        >
          <el-input
            v-model="contactSearch"
            placeholder="按enter搜索"
            suffix-icon="el-icon-search"
            @keyup.enter.native="handleSearch"
          />
          <el-checkbox-group
            v-model="checkList"
            @change="handleCheckChange"
          >
            <div
              v-for="item in
                contactCheckList"
              :key="item.id"
              style="margin: 10px 5px"
            >
              <el-checkbox
                :label="item.id"
              >
                {{ item.name }}
              </el-checkbox>>
            </div>
          </el-checkbox-group> <el-pagination
            style="margin-top: 20px"
            background
            small
            layout="prev, pager, next"
            :total="totalCount"
            :page-size="10"
            @current-change="handleCurrentChange"
          />
        </div> <ul
          :class="$style.right"
        >
          <li
            v-for="item in contactRightList"
            :key="item.id"
          >
            {{ item.name }}
            <i class="el-icon-close" />
          </li>
        </ul>
      </div>
    </div> <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogVisible = false">
        取 消
      </el-button> <el-button
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
  name: 'ContactDialog',
  data() {
    return {
      dialogVisible: false,
      contactSearch: '',
      contactList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      checkList: [],
      contactCheckList: [],
      contactRightList: [],
      contactMap: {},
      totalCount: 1,
      groupId: [],
    };
  },
  methods: {
    // 搜索
    handleSearch() {
      this.getContactCheckList(1, null, this.contactSearch);
    },
    handleCurrentChange(val) {
      this.getContactCheckList(val);
    },
    handleNodeClick(data) {
      this.groupId = [data.id];
      this.getContactCheckList(1);
    },
    getContactCheckList(page, value, search = '') {
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'POST',
        data: this.$http.adornData({
          groupId: this.groupId,
          limit: 10,
          page,
          search,
        }),
      }).then(({ data: data1 }) => {
        if (data1 && data1.code === 0) {
          this.totalCount = data1.data.totalCount;
          // this.currPage = data1.data.currPage;
          // this.pageSize = data1.data.pageSize;
          data1.data.list.forEach((item) => {
            if (!this.contactMap[item.id]) {
              this.contactMap[item.id] = item;
            }
          });
          this.contactCheckList = data1.data.list;
          this.$nextTick(() => {
            if (value) {
              this.contactRightList = value;
            }
          });
        }
      });
    },
    // 一来就请求树形和列表
    getDataList(value) {
      this.$http({
        url: this.$http.adornUrl('/mail/mailgroup/list'),
        method: 'get',
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // this.modifiedUserList = treeDataTranslate(data.data, "id");
            this.contactList = data.data;
            this.checkList = value.map((item) => item.id);
            this.getContactCheckList(1, value);
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.dialogVisible = true;
        });
    },
    handleCheckChange(value) {
      this.contactRightList.length = 0;
      value.forEach((item) => {
        this.contactMap[item] && this.contactRightList.push(this.contactMap[item]);
      });
    },
    confirm() {
      this.$emit('contactSelect', this.contactRightList);
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" module>
.contactDialog {
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
      .middle {
        padding: 0 10px;
        flex: 1;
        border-left: 1px solid #aaaaaa;
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
