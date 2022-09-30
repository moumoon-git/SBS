<!--
 * @Author: xuchuangxing
 * @Date: 2020-09-01 16:22:39
 * @LastEditTime: 2021-08-10 15:49:17
 * @LastEditors: Please set LastEditors
 * @Description: 采集单位管理模块
 * @FilePath: \SZEos2.7.1.ucse:\xuchuangxing\SJSEos2.7.1.ucs\src\view\dutyManagement\onDutyRoster\AdministrativeDuty\UnitManagement.vue
-->
<template>
  <!-- 选择人员弹窗 -->
  <el-dialog
    :title="selectTitle"
    width="600px"
    class="popoxwrap"
    :visible.sync="selectData"
    append-to-body
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <div>
      <div class="main">
        <div class="left">
          <el-scrollbar style="height: 100%">
            <!-- <el-checkbox-group v-model="checkList" v-if="unitGroup.length>0">
              <div v-for="item in unitGroup" :key="item.id" style="margin :5px">
                <el-checkbox :label="item.id" >{{item.name}}</el-checkbox>
              </div>
            </el-checkbox-group> -->
            <el-tree
              :data="data2"
              ref="tree"
              node-key="id"
              highlight-current
              show-checkbox
              @check="handleCheckChange"
              :default-expanded-keys="expandedKeys"
              :props="defaultProps"
              :check-strictly="true"
            ></el-tree>
            <!-- <div class="p_" v-else>
              <span>暂无数据</span>
            </div> -->
          </el-scrollbar>
        </div>

        <div class="right">
          <el-scrollbar style="height: 100%">
            <div v-if="checkUnitGroup.length > 0">
              <div
                v-for="(item, index) in checkUnitGroup"
                :key="item.id"
                class="everyUnitGroup"
              >
                <div class="unitTop">
                  <span>{{ item.platformName || item.name }}</span>
                  <i
                    class="el-icon-close closeDepart"
                    style="cursor: pointer"
                    @click="delUnit(item.id, index)"
                  ></i>
                </div>
                <div class="unitBottom">
                  <div class="scheduling">
                    <label>排班次数</label>
                    <el-input
                      style="width: 100px"
                      size="small"
                      v-model="item.number"
                    ></el-input>
                  </div>
                  <div class="relaySequence">
                    <i
                      class="iconfont icon-cangpeitubiao_shangyi move"
                      @click="moveUp(item, index)"
                      v-if="index != 0"
                    ></i>
                    <i
                      class="iconfont icon-cangpeitubiao_xiayi move"
                      @click="moveDown(item, index)"
                      v-if="index != checkUnitGroup.length - 1"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="p_" v-else>
              <span>暂无数据</span>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div style="text-align: right">
        <el-button type="primary" @click="addMans" size="medium"
          >保 存</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { platformTreeDataTranslate } from "@/utils";

export default {
  name: "unitManagement",
  props: ["selectTitle", "selectData"], //maxSelect 可限制选中联系人的个数，无限制可不传这个参数
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "platformName",
      },
      data2: [],
      checkboxData: [],
      checkList: [],
      unitGroup: [],
      checkUnitGroup: [],
      expandedKeys: [], // 默认展开选中值
    };
  },
  mounted() {
    this.getPhoneTree();
    this.getUnitData();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    getPhoneTree() {
      // 渲染弹窗左侧列表
      // let params = { data: {} };
      // this.$api.deptTree(params).then((res) => {
      //   console.log(res);
      //   if (res.errorcode != 0) {
      //     this.$message({
      //       message: res.msg,
      //       type: "error",
      //     });
      //     return;
      //   }
      //   this.data2 = res.data;
      // });
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/platform/getChildrenPlatform`)
        .then((response) => {
          if (response.data.code === 0) {
            const data = response.data.data;
            data.forEach((item) => {
              item.deptId = item.id;
              // item.id = undefined;
              // item.name = item.platformName;
            });
            this.data2 = platformTreeDataTranslate(data);
          }
        });
    },
    /**
     * @description: 渲染弹窗右侧单位列表
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201016 18:02
     * @param {}
     * @return {}
     */
    getUnitData() {
      this.$api.collectionUnitList().then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg || res.message,
            type: "error",
          });
          return;
        }
        if (res.data) {
          this.checkUnitGroup = res.data;
          if (this.checkUnitGroup.length > 0) {
            let checkUnitIds = this.checkUnitGroup.map((v) => {
              return v.contactorGroupId;
            }); // 选中所有Id
            this.$refs.tree.setCheckedKeys(checkUnitIds);
            this.expandedKeys = checkUnitIds;
          }
        }
      });
    },
    /**
     * @description: 选择部门时触发添加或删除右侧数据
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201016 18:02
     * @param {}
     * @return {}
     */
    handleCheckChange(data, checkedKeys, indeterminate) {
      console.log('checkUnitGroup获取值新增删除：checkUnitGroup,data,checkKeys', this.checkUnitGroup, data, checkedKeys);
      // 判断是新增还是删除
      if (checkedKeys["checkedKeys"].length > this.checkUnitGroup.length) {
        // 新增时id为空，直接push会导致id赋值，无法判断新增/修改
        // this.checkUnitGroup.push(data); 
        this.checkUnitGroup.push({
          contactorGroupId: data.id, // 平台id
          id: undefined, // 新增时还没有id
          name: data.platformName, // 平台名字
          number: '', // 排班次数
        });
      } else {
        // 获取当前取消勾选的组在列表中的索引值
        let delUnitIdx = this.checkUnitGroup.findIndex(
          (v) => (v.id || v.contactorGroupId || v.deptId) == data.id || data.deptId
        );
        // 判断是之前的数据调用删除接口  是新增的数据就做逻辑删除
        if (this.checkUnitGroup[delUnitIdx].id) {
          this.delUnitFunction(delUnitIdx).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error",
              });
              return;
            }
            this.checkUnitGroup.splice(delUnitIdx, 1);
          });
        } else {
          this.checkUnitGroup.splice(delUnitIdx, 1);
        }
      }
    },
    checkChange(val) {
      this.checkboxData = val;
    },
    // 删除当前单位
    delUnit(id, idx) {
      // console.log('this.checkUnitGroup[idx]: ', this.checkUnitGroup[idx]);
      // console.log('id: ', id);
      // let delUnitIdx = this.checkUnitGroup.findIndex( v=> (v.contactorGroupId || v.id) == id) // 删除当前的索引值
      // console.log('delUnitIdx: ', delUnitIdx);

      if (this.checkUnitGroup[idx].contactorGroupId) {
        this.delUnitFunction(idx).then((res) => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this.delIdenticalUnit(idx);
        });
      } else {
        this.delIdenticalUnit(idx);
      }
    },
    // 调用删除接口
    delUnitFunction(delUnitIdx) {
      let data = {
        id: this.checkUnitGroup[delUnitIdx].id,
      };
      return this.$api.delUnit(data);
    },
    delIdenticalUnit(delUnitIdx) {
      this.checkUnitGroup.splice(delUnitIdx, 1); // 删除单位列表数据
      let delUnitArr = this.checkUnitGroup.map((v) => {
        return v.id || v.contactorGroupId || v.deptId;
      }); // 要选中的单位组
      this.$refs.tree.setCheckedKeys(delUnitArr); //获取已经设置的资源后渲染
    },
    // 上移
    moveUp(obj, idx) {
      this.moveWay(idx, idx - 1, obj);
    },
    // 下移
    moveDown(obj, idx) {
      this.moveWay(idx, idx + 1, obj);
    },
    // 执行移动方法
    moveWay(idx, moveIdx, obj) {
      this.checkUnitGroup[idx] = this.checkUnitGroup[moveIdx];
      this.checkUnitGroup[moveIdx] = obj;
      this.$forceUpdate();
    },
    /**
     * @description: 点击确定添加单位
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201018 10:29
     * @param {}
     * @return {}
     */
    addMans() {
      if (this.checkUnitGroup.length == 0) {
        this.$message.warning("请选择单位");
        return;
      }
      let recombinationUnitGroup = [];
      console.log("this.checkUnitGroup: ", this.checkUnitGroup);
      for (let i = 0; i < this.checkUnitGroup.length; i++) {
        //  console.log('v: ', v);
        if (!this.checkUnitGroup[i].hasOwnProperty("number")) {
          this.$message.warning("请输入排班次数");
          return;
        }
        recombinationUnitGroup.push({
          id: this.checkUnitGroup[i].id || undefined, // 列表id
          contactorGroupId: this.checkUnitGroup[i].contactorGroupId || this.checkUnitGroup[i].id, // 平台id
          order: i, // 排序位置
          number: this.checkUnitGroup[i].number || '', // 排班次数
        });
        if (this.checkUnitGroup[i].id) {
          recombinationUnitGroup[i].id = this.checkUnitGroup[i].id;
        }
      }
      console.log("recombinationUnitGroup: ", recombinationUnitGroup);
      this.$emit("saveUnitHandle", recombinationUnitGroup);
    },
  },
  watch: {
    // checkUnitGroup(newV, oldV){
    //   if (newV.length>oldV.length) {
    //     let addData = [...newV].filter(x => [...oldV].every(y => y !== x))
    //     if (this.unitGroup.filter(el => el.id === addData[0]).length > 0) {
    //       this.checkUnitGroup.push(this.unitGroup.find(el => el.id == addData[0]))
    //     }
    //   }else{
    //     let delData = [...oldV].filter(x => [...newV].every(y => y !== x))
    //     this.checkUnitGroup.splice(this.checkUnitGroup.findIndex(el =>  el.id == delData[0] ),1)
    //   }
    //   console.log('this.checkUnitGroup: ', this.checkUnitGroup);
    // }
  },
};
</script>

<style scoped>
@import "//at.alicdn.com/t/font_1629034_25m4xpgyyn6.css";
>>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
>>> .el-dialog__body {
  padding: 20px;
}
.selectInput {
  width: 77%;
  margin-right: 15px;
}
.main {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: space-between;
}
.left {
  width: 48%;
  height: 480px;
  border: 1px solid rgba(211, 215, 219, 1);
  padding: 5px;
}
.right {
  width: 48%;
  height: 480px;
  border: 1px solid rgba(211, 215, 219, 1);
  padding: 5px;
}
.right .everyUnitGroup {
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
.right .everyUnitGroup .unitTop {
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}
.right .everyUnitGroup .unitBottom {
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 5px;
}
.right .everyUnitGroup .unitBottom .scheduling {
}
.right .everyUnitGroup .unitBottom .relaySequence {
  padding-top: 5px;
}
.right .everyUnitGroup .unitBottom .relaySequence .move {
  font-size: 21px;
  cursor: pointer;
}
/* .el-checkbox {
  width: 80%;
  margin: 15px;
} */
/* .el-checkbox div {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;
}
.el-checkbox div:first-child,
.el-checkbox div:nth-child(2) {
  width: 150px;
} */
.p_ {
  padding: 10px 30px 10px 30px;
  text-align: left;
}
</style>
