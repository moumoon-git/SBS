<template>
  <div
    class="resoureteam-table-wrap"
    style="padding:3px;height:725px;width:100%;margin: 0px;"
  >
    <el-row :gutter="20" style="height:650px;">
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="路由类型">
            <el-select v-model="form.type" placeholder="请选择路由类型" disabled>
              <el-option label="短信" :value="0"></el-option>
              <el-option label="传真" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.userId"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="链接地址">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="说明信息">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
      </el-col>

      <!--平台树-->
      <el-col :span="12">
        <div class="treeClass">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          ></el-input>
          <el-scrollbar
            wrap-class="list"
            wrap-style="color: red;max-height:596px;"
            view-class="view-box"
            :native="false"
          >
            <el-tree
              show-checkbox
              :check-strictly="true"
              :default-expand-all="false"
              :expand-on-click-node="true"
              :default-expanded-keys="arr"
              @check-change="handleCheckChange"
              :data="platformList"
              :props="listProps"
              node-key="id"
              ref="platFormListTree"
              :filter-node-method="filterNode"
            >
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    <div style="text-align:center">
      <el-button @click="preseprvation">保存</el-button>
    </div>
  </div>
</template>

<script>
import { platformTreeDataTranslate } from "@/utils";

export default {
  props: ["dataList"],
  //表格内容
  data() {
    return {
      filterText: "",
      listProps: {
        children: "children",
        label: "platformName"
      },

      checkedIds: [],
      arr:[],
      //平台列表
      platformList: [],
      // tempPlatform: [],

      form: {
        name: "",
        userId: "",
        password: "",
        url: "",
        remark: "",
        id: 0,
        type:null,

        //平台
        platformId: 0,
        platformName: "",
        platformParentId: 0,
        platformParentName: ""
      },

      platformIdArray: [],
      initList: {}
    };
  },
  created() {
    this.treeData();
  },
  watch: {
    filterText(val) {
      this.$refs.platFormListTree.filter(val);
    }
    // dataList(newV) {
    //   this.form.name = newV.name;
    //   this.form.userId = newV.userId;
    //   this.form.password = newV.password;
    //   this.form.url = newV.url;
    //   this.form.remark = newV.remark;
    //   this.form.parentId = newV.id;
    //   this.form.platformList = newV.platformList;
    // }
  },

  methods: {
    /**
     * @description: 获取所有被勾选的树形节点数据
     * @param {type}
     * @return {type}
     */
    handleCheckChange() {
      this.arr= this.$refs.platFormListTree.getCheckedNodes().concat(this.$refs.platFormListTree.getHalfCheckedNodes())
},


    init(list) {
      console.log("list-list-list", list);
      //this.initList = list;
      this.form.name = list.name;
      this.form.userId = list.userId;
      this.form.password = list.password;
      this.form.url = list.url;
      this.form.remark = list.remark;
      this.form.id = list.id;
      this.form.type = list.type;
      //先清空
      this.$refs.platFormListTree.setCheckedKeys([]);
      this.cancelDisabledNode(this.platformList);
      // this.platformList = this.tempPlatform;

      //渲染平台
      this.platformIdArray = [];
      if (list.platformList.length > 0) {
        for (let i = 0; i < list.platformList.length; i++) {
          let platformId = list.platformList[i].id;

          if (
            platformId != null &&
            platformId != "" &&
            platformId != undefined
          ) {
            this.platformIdArray.push(platformId);
            //解决同级出现问题
            if (this.$refs.platFormListTree) {
              this.$nextTick(() => {
              this.$refs.platFormListTree.setChecked(platformId, true, false);

              });
            }
          }

        }
      } else {
        this.$nextTick(() => {
          this.$refs.platFormListTree.setCheckedKeys([]);
        });
      }

      let unShow = list.unPlatformIds;
      // for (let i = 0; i < list.unPlatformIds.length; i++) {
      //   let idx = this.platformList.findIndex(

      //     item => {
      //       if(item.children)
      //       item.id == list.unPlatformIds[i]
      //   );
      //   console.log(this.platformList);
      //   // this.$set(this.platformList[idx], "disabled", true);
      // }
      if (unShow) {
        unShow.forEach(temp => {
          // let idx = this.tempPlatform.findIndex(item => item.id == temp);
          // if (idx < 0) {
          // }
          // this.$set(this.tempPlatform[idx], "disabled", true);
          // this.platformList = platformTreeDataTranslate(
          //   this.tempPlatform,
          //   "id"
          // );
          console.log(temp);
          this.eidtTreeNode(this.platformList, temp);
          console.log("树更新结果", this.platformList);
        });
      }

    },

    // 递归遍历树形结构修改目标子节点
    eidtTreeNode(tree, id) {
      for (let i = 0; i < tree.length; i++) {
        // tree[i]["disabled"] = false;

        if (tree[i].id === id) {
          tree[i]["disabled"] = true;
          // this.$set(this.platformList[i], "disabled", true);
        }
        else {
          // tree[i]["disabled"] = false;
          if (tree[i].children) {
            this.eidtTreeNode(tree[i].children, id);
          }
        }

      }

    },

    // 递归初始化树结构的不可选节点
    cancelDisabledNode(tree) {
      for (let i = 0; i < tree.length; i++) {
        tree[i]["disabled"] = false;
        if (tree[i].children && tree[i].children.length > 0) {
          this.cancelDisabledNode(tree[i].children);
        }
      }
    },

    // 筛选树
    filterNode(value, data) {
      if (!value) return true;
      return data.platformName.indexOf(value) !== -1;
    },

    // 加载短信平台树
    treeData() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform/allList`),
        method: "GET"
      }).then(({ data }) => {
        if (data && data.code == 0) {
          // this.platformList = platformTreeDataTranslate(data.data, "id");
          let nativeData = data.data;
          nativeData.forEach(item => {
            item["disabled"] = false;
          });
          this.platformList = platformTreeDataTranslate(nativeData, "id");

          // this.tempPlatform = this.platformList = platformTreeDataTranslate(
          //   nativeData,
          //   "id"
          // );
        }
      });
    },

    //通过节点点击，本想自己写，算了，有方法了
    nodeClick(data, node, value) {
      var dataId = data.id;

      if (this.platformIdArray.indexOf(dataId) == -1) {
        console.log("不存在就增加", dataId);
        this.platformIdArray.push(dataId);
      } else {
        //存在就删除
        console.log("存在就删除", dataId);
        this.platformIdArray.forEach(function(item, index, arr) {
          if (item == dataId) {
            arr.splice(index, 1);
          }
        });
      }

      console.log(this.platformIdArray);

      //去重
      this.platformIdArray = Array.from(new Set(this.platformIdArray));

      this.$refs.platFormListTree.setCheckedKeys([]);

      if (this.platformIdArray.length > 0) {
        for (let i = 0; i < this.platformIdArray.length; i++) {
          let platformId = this.platformIdArray[i];
          if (
            platformId != null &&
            platformId != "" &&
            platformId != undefined
          ) {
            //解决同级出现问题
            if (this.$refs.platFormListTree) {
              this.$nextTick(() => {
                this.$refs.platFormListTree.setChecked(platformId, true, false);
              });
            }
          }
        }

      } else {
        this.$nextTick(() => {
          this.$refs.platFormListTree.setCheckedKeys([]);
        });
      }
    },

    // 保存
    preseprvation() {
      if (this.form.id) {
        this.$http({
          url: this.$http.adornUrl(
            `/message/messageSetting/addPlatToMessageSetting`
          ),
          method: "POST",
          data: this.$http.adornData({
            name: this.form.name,
            userId: this.form.userId,
            password: this.form.password,
            url: this.form.url,
            remark: this.form.remark,
            id: this.form.id,
            platformIds: this.$refs.platFormListTree
              ? [].concat(
                  this.$refs.platFormListTree.getCheckedKeys(),
                  this.$refs.platFormListTree.getHalfCheckedKeys()
                )
              : this.platformIdArray
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              type: "success",
              message: "保存成功",
              duration: 1000
            });
            //仅做刷新
            //this.init(this.initList);
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        this.$message.warning("请选择平台组");
      }
    }
  }
};
</script>

<style lang="less">
.resoureteam-table-wrap {
  .desc {
    border: 1px solid #ccc;
    padding: 5px 10px;
  }
}
</style>
