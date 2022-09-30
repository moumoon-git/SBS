<template>
  <!--新增联系人弹窗-->
  <el-dialog
    title="应急职位选择"
    center
    :visible.sync="addone"
    width="1000px"
    style="min-height: 600px;"
    :close-on-click-modal="false"
  >
    <el-row
      :gutter="20"
      style="min-height: 600px;"
    >
      <el-col :span="8">
        <div class="candidate">
          <el-scrollbar style="height: 500px;">
            <el-tree
              ref="tree"
              :data="datatree"
              highlight-current
              :props="proptree"
              node-key="id"
              :render-content="renderContent"
              @node-click="nodeClick"
            />
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="candidate">
          <el-scrollbar style="height: 500px;">
            <el-checkbox-group v-model="nameList">
              <el-checkbox
                v-for="person in personList"
                :key="person.id"
                :label="person.id"
                style="text-align: left;"
                @change="nameChanged(person.id)"
              >
                {{ person.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="candidate">
          <div class="header">
            <span>选择结果</span>
          </div>
          <div style="padding-left: 10px; margin-top: 10px;text-align: left;">
            <el-scrollbar style="height: 438px;">
              <el-tag
                v-for="choose in chooseList"
                :key="choose.id"
                closable
                style="text-align: left;padding: 0 10px;margin-right: 10px;margin-top: 10px;"
                @close="chooseChanged(choose)"
              >
                {{ choose.names }}
              </el-tag>
            </el-scrollbar>
          </div>
        </div>
        <div class="submit-btn">
          <el-button
            class="sbs-button"
            type="primary"
            style="padding: 6px 14px;"
            @click="handleCommit"
          >
            确定
          </el-button>
        </div>
        <!--<el-button size="small" type="text" class="create-btn">新增联系人</el-button>-->
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  inject: ['reload'],
  props: ['dynamicTag'],
  data() {
    return {
      addone: false,
      datatree: [], // 联系人树
      proptree: {
        children: 'children',
        label: 'name',
      },
      childValue: [],
      versionId: '', // 预案版本id
      nameList: [], // 选中联系人id数组
      topTreeID: '', // 当前树ID
      chooseList: [],
      positionchoose: '', // 选择职位
      personList: [], // 所有联系人对象数组
    };
  },
  created() {

  },
  methods: {
    childFn() {
      this.addone = true;
      this.versionId = Number(sessionStorage.getItem('preplanVersionId'));
      const data = {
        id: this.versionId,
      };
      const CallbackReload = this;
      this.$http('/emergency/preparation/preplan/getStructDeptTree', data, CallbackReload).then((res) => {
        this.datatree = res.data;
        this.topTreeID = res.data[0].id;
        this.positionchoose = res.data[0].name;
        this.getList();
        this.chooseList = JSON.parse(JSON.stringify(this.dynamicTag));
        if (this.dynamicTag) {
          const arrays = [];
          this.dynamicTag.forEach((data) => {
            arrays.push(data.id);
          });
          this.nameList = arrays;
        }
      });
    },
    // 获取职位
    getList() {
      const id = this.topTreeID;
      const test = {
        id,
      };
      const CallbackReload = this;
      this.$http('/emergency/preparation/preplan/getStructDeptPositionDetail', test, CallbackReload).then((res) => {
        this.personList = res.data.position;
      });
    },
    // 点击树节点触发事件
    nodeClick(data) {
      this.topTreeID = data.id;
      this.positionchoose = data.name;
      this.getList();
    },
    nameChanged(id) {
      const index = this.nameList.indexOf(id); // 判断是复选框取消选项还是选中选项
      if (index == -1) { // 该名字从选中项中删除
        for (const i in this.chooseList) {
          if (this.chooseList[i].id == id) {
            this.chooseList.splice(i, 1);
            break;
          }
        }
      } else { // 该名字添加到选中项中
        for (const i in this.personList) {
          if (this.personList[i].id == id) {
            const data = JSON.parse(JSON.stringify(this.personList[i])); // 复制姓名列表中的对象保存在选中人对象数组中

            const arrays = {};
            arrays.id = data.id;
            arrays.names = `${this.positionchoose}->${data.name}`;
            this.chooseList.push(arrays);
            return;
          }
        }
      }
    },
    // 点击标签删除按钮时删除标签
    chooseChanged(tag) {
      this.chooseList.splice(this.chooseList.indexOf(tag), 1);
      const index = this.nameList.indexOf(tag.id);
      if (index !== -1) {
        this.nameList.splice(index, 1);
      }
    },
    // 新增联系人确定
    handleCommit() {
      this.$emit('childByValue', this.chooseList);
      this.addone = false;
    },
    dynamicTags() {
      this.chooseList = [];
      this.personList = [];
      this.nameList = [];
    },
    renderContent(h, { // 树形控件title提示
      node,
      data,
      store,
    }) {
      return (`<
					span class = "custom-tree-node" >
					<
					span title = {
						${node.data.name}
					}
					class = "el-tree-node__label" > {
						${node.data.name}
					} < /span> <
					/span>`);
    },
  },
};
</script>

<style scoped>
	.candidate {
		height: 500px;
		border-radius: 5px;
		padding-top: 10px;
		border: 1px solid #ebeef5;
		background-color: #fff;
		color: #303133;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}

	.selected {
		min-height: 380px;
		margin-bottom: 20px;
		margin-top: 10px;
	}

	.submit-btn {
		margin-top: 20px;
		text-align: center;
	}

	.create-btn {
		float: right;
		margin-top: 10px;
	}

	.el-checkbox-group>>>.el-checkbox {
		display: block;
		margin-top: 5px;
		margin-left: 10px;
	}

	.el-scrollbar__wrap {
		overflow-x: hidden;
	}

	.el-tree {
		min-width: 100%;
		display: inline-block !important;
	}

	.el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content {
		background-color: #C0C0C0;
	}

	.header {
		border-bottom: 1px solid #ebeef5;
		box-sizing: border-box;
		padding: 12px 18px;
		color: #303133;
		font-size: 14px;
	}
</style>
