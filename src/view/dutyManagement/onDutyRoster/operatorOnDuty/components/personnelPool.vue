<!---人员池 personnelPool-->
<template>
  <div>
    <el-tabs
      v-model="activeClassId"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in classList"
        :key="item.id"
        :label="item.name"
        :name="item.id"
      >
        <div
          :class="
            'personnel-pool ' + (type === 'big' ? 'big-pool' : 'small-pool')
          "
        >
          <div v-if="mansList.length > 0">
            <el-checkbox-group
              v-model="checkList"
              style="display: flex; flex-wrap: wrap; align-content: flex-start"
              :class="
                'checkbox-wrapper ' +
                  (type === 'big'
                    ? 'big-checkbox-wrapper'
                    : 'small-checkbox-wrapper')
              "
              @change="checkChange"
            >
              <!-- <transition-group name="el-zoom-in-center"> -->
              <div
                v-for="(el, index) in mansList"
                :key="el.id"
                class="allPeople"
              >
                <el-checkbox
                  :key="el.name"
                  :label="el.contactorId"
                  :disabled="type === 'small' && isEdit === 'edit'"
                  class="checkbox-style"
                >
                  <span class="checkbox-txt">{{ el.name }}</span>
                  <span
                    v-if="el.sex === '女'"
                    class="checkbox-txt"
                  >
                    {{
                      '(' + el.sex + ')'
                    }}
                  </span>
                  <i
                    v-if="type === 'big'"
                    class="el-icon-error checkbox-del"
                    @click.stop="deletePersonnel(index, el)"
                  />
                </el-checkbox>
                <div
                  v-if="type === 'big'"
                  class="relaySequence"
                >
                  <i
                    v-if="index != 0"
                    class="el-icon-top move"
                    style="margin-right: 5px"
                    @click="moveUp(el, index)"
                  />
                  <i
                    v-if="index != mansList.length - 1"
                    class="el-icon-bottom move"
                    @click="moveDown(el, index)"
                  />
                </div>
              </div>
              <!-- </transition-group> -->
            </el-checkbox-group>
          </div>
          <div
            v-else
            class="noList"
          >
            暂无值班人员
          </div>
          <div class="button-group-style">
            <el-button
              v-if="type === 'big'"
              type="text"
              @click="addPersonnel"
            >
              新增
            </el-button>
            <el-button
              v-if="type === 'big'"
              type="text"
              @click="deletPersonnel"
            >
              删除
            </el-button>
            <el-button
              type="text"
              @click="allCheck"
            >
              全选
            </el-button>
            <el-button
              type="text"
              @click="cancelAllCheck"
            >
              取消全选
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'personnelPool',
  components: {},
  props: [
    'personnelPool',
    'type',
    'classList',
    'activeClass',
    'selectedContactors',
    'isEdit',
  ],
  data() {
    return {
      checkList: [], // 选中的人员
      mansList: [], // 人员池
      classId: 0, // 班次id
      activeClassId: '',
      defaultCheckContactorId: [], // 值班人员配置下，默认勾选的人
    };
  },
  mounted() {
    if (this.type === 'small') {
      this.checkList = this.selectedContactors;
      // console.log('人员池->已选人员：', this.checkList)
    }
    this.mansList = this.personnelPool;
    this.activeClassId = this.activeClass;
    this.classId = parseInt(this.activeClass);
  },
  watch: {
    personnelPool: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.defaultCheckContactorId = [];
        this.mansList = newVal;
        console.log('监听->人员列表：', this.mansList);
        if (this.type === 'big') {
          newVal.forEach((item) => {
            if (
              item.startTime !== '' ||
              item.endTime !== '' ||
              item.startDate !== '' ||
              item.endDate !== '' ||
              item.day.length > 0
            ) {
              this.defaultCheckContactorId.push(item.contactorId);
            }
          });
          this.checkList = this.defaultCheckContactorId;
        }
      },
    },
    activeClass: {
      handler: function (newVal, oldVal) {
        this.activeClassId = newVal;
        console.log('!!监听->班次id：', this.activeClassId);
      },
      deep: true,
    },
  },
  methods: {
    /**
     * @description 删除值班人员
     */
    deletPersonnel() {
      let arr1 = [];
      this.checkList.forEach((item) => {
        const filterArr = this.mansList.filter((el) => el.contactorId === item);
        if (filterArr.length > 0) {
          arr1.push(filterArr[0]);
        }
      });
      const arr2 = arr1.map((item) => item.id);
      this.deleteDutyContactor(arr2).then(() => {
        this.$emit('delete', this.mansList);
      });
    },
    // 多选框选中
    checkChange(val) {
      console.log('多选框选中的联系人：', val)
      this.checkList = val;
      this.$emit('checkChange', this.checkList);
    },
    // 新增值班人员
    addPersonnel() {
      let idList = [];
      this.mansList.forEach((item) => {
        // console.log(item)
        idList.push(item.contactorId);
      });
      console.log('新增联系人id：', idList);
      setTimeout(() => {
        this.$emit('add', idList);
      }, 100);
    },
    // 全选
    allCheck() {
      let idList = [];
      this.mansList.forEach((item) => {
        idList.push(item.contactorId);
      });
      this.checkList = idList;
      // console.log('全选', this.checkList)
      this.$emit('allCheck', this.checkList);
    },
    // 取消全选
    cancelAllCheck() {
      console.log('this.type: ', this.type);
      this.checkList = [];
      // if (this.type === 'big') {
      //   this.checkList = this.defaultCheckContactorId
      // } else {
      //   this.checkList = []
      // }
      this.$emit('cancelAllCheck', this.checkList);
    },
    /**
     * @description 删除值班人员
     */
    deleteDutyContactor(id) {
      return new Promise((resolve) => {
        const data = {
          id,
        };
        this.$api.deleteDutyContactor(data).then((res) => {
          if (res.errorcode === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            resolve();
          }
        });
      });
    },
    // 从人员池里删除人员
    deletePersonnel(index, item) {
      if (
        item.startTime === '' &&
        item.endTime === '' &&
        item.startDate === '' &&
        item.endDate === '' &&
        item.day.length === 0
      ) {
        this.deleteDutyContactor([item.id]).then(() => {
          this.mansList.splice(index, 1);
          if (
            this.checkList.filter((el) => el.contactorId === item.contactorId)
              .length > 0
          ) {
            this.checkList.splice(item.contactorId, 1);
          }
          this.$emit('delete', this.mansList);
          console.log('删除人员：', this.mansList);
        });
      } else {
        this.$confirm(
          '是否确认删除人员（该人员所涉及的班次规则也将清除）？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        )
          .then(() => {
            this.deleteDutyContactor(index, item);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
            this.checkList.push(item.contactorId);
          });
      }
    },
    handleClick(val) {
      // console.log('当前选中班次：', val.name)
      this.classId = parseInt(val.name);
      this.$emit('changeClass', val.name);
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
      this.mansList[idx] = this.mansList[moveIdx];
      this.mansList[moveIdx] = obj;
      this.$forceUpdate();
      this.$emit('sort', this.mansList);
      console.log('this.mansList: ', this.mansList);
    },
  },
};
</script>
<style scoped>
/deep/ .el-tabs__item {
  background: rgba(249, 251, 255, 1);
  color: rgba(153, 153, 153, 1);
  border-bottom: 1px solid rgba(221, 221, 221, 1) !important;
}
/deep/ .small .el-tabs__item {
  width: 100px !important;
  height: 30px !important;
}
/deep/ .el-tabs__item.is-active {
  background: #ffffff;
  border-bottom: 1px solid transparent !important;
}
/deep/ .el-tabs__header {
  margin: 0;
}
.personnel-pool {
  border-left: 1px solid rgba(221, 221, 221, 1);
  border-right: 1px solid rgba(221, 221, 221, 1);
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  padding: 30px 18px 10px 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.big-pool {
  width: calc(100% - 40px);
  min-height: 372px;
}
.small-pool {
  /* width: 449px; */
  min-height: 146px;
}
.checkbox-txt {
  color: rgba(51, 51, 51, 1);
}
.checkbox-del {
  color: rgba(153, 153, 153, 1);
  margin-right: 5px;
}
.checkbox-wrapper {
  overflow-y: scroll;
}
/* .checkbox-style {
  margin: 0 5px 20px 0;
} */
.big-checkbox-wrapper {
  height: 314px;
}
.small-checkbox-wrapper {
  height: 106px;
}

.allPeople {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px 20px 0;
  border: 1px solid #ccc;
  height: 25px;
  padding: 5px;
  border-radius: 3px;
}

.allPeople .relaySequence {
  padding-top: 2px;
  display: flex;
}
.allPeople .relaySequence .move {
  font-size: 12px;
  cursor: pointer;
  display: block;
  /* color: #ffffff; */
  border: 1px solid #999;
  /* background: #999; */
  border-radius: 50%;
  text-align: center;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  line-height: 14px
}

.button-group-style {
  width: 100%;
  text-align: right;
}
.button-group-style .el-button {
  padding: 0 !important;
}
.big-pool .noList {
  background-image: url(/static/img/nullList.png);
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  text-align: center;
  line-height: 440px;
  font-size: 12px;
  font-weight: bold;
  color: #cad5e8;
  height: 80%;
}
.small-pool .noList {
  background-image: url(/static/img/nullList.png);
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  text-align: center;
  line-height: 230px;
  font-size: 12px;
  font-weight: bold;
  color: #cad5e8;
  height: 60%;
}
</style>
