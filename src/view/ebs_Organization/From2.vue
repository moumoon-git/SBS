<template>
  <div>
    <div class="back">
      <div>
        <div>
          <div class="sbs-title">
            基础参数
          </div>
        </div>
        <span
          v-for="item in reserveplandefaultData"
          :key="item.id"
          class="defaultParamsItem"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="flex1">
        <div>
          <div class="sbs-title">
            类型参数
          </div>
        </div>
        <el-button
          type="text"
          class="sbs-button"
          @click="reservePlan"
        >
          新增
        </el-button>
      </div>
      <div class="flex2">
        <ul
          v-if="reserveplanData.length > 0"
          class="parameterList"
        >
          <li
            v-for="(reserveplan, i) in reserveplanData"
            :key="i"
          >
            <i
              class="el-icon-close"
              @click="deleteParameter(i)"
            />
            <el-form label-width="70px">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-form-item
                    label="名称:"
                    required
                  >
                    <el-input
                      v-model="reserveplan.name"
                      class="input"
                      :maxlength="50"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    label="类型:"
                    required
                  >
                    <el-select
                      v-model="reserveplan.valueType"
                      placeholder="请选择"
                      @change="choiceType(reserveplan.valueType, i)"
                    >
                      <el-option
                        v-for="item in reserveplanType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-form-item label="单位:">
                    <el-input
                      v-model="reserveplan.unit"
                      class="input"
                      :maxlength="20"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <ul
                  v-if="reserveplan.values.length > 0 && reserveplan.valueType === '选择'"
                  class="choice"
                >
                  <li
                    v-for="(value, index) in reserveplan.values"
                    :key="index + 10000"
                  >
                    <el-form-item
                      v-if="index === 0"
                      label="选项值:"
                      required
                    >
                      <el-input
                        v-model="reserveplan.values[index]"
                        class="input"
                        style="float: left;width: 294px;"
                        :maxlength="100"
                        show-word-limit
                      />
                      <el-button
                        type="small"
                        class="sbs-button"
                        icon="el-icon-plus"
                        style="float: left;padding: 11px 10px;"
                        @click="addoptionValue(i)"
                      />
                    </el-form-item>
                  </li>
                  <li
                    v-for=" (value,index) in reserveplan.values"
                    :key="index + 20000"
                  >
                    <el-form-item
                      v-if="index > 0"
                      label="选项值:"
                      required
                    >
                      <el-input
                        v-model="reserveplan.values[index]"
                        class="input"
                        style="float: left;width: 294px;"
                        :maxlength="100"
                        show-word-limit
                      />
                      <el-button
                        type="small"
                        class="sbs-button"
                        icon="el-icon-delete"
                        style="float: left;padding: 11px 10px;"
                        @click="deleteoptionValue(index,i)"
                      />
                    </el-form-item>
                  </li>
                </ul>
              </el-row>
            </el-form>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <el-button
        type="plain"
        class="sbs-button"
        @click="$router.push({
          path: '/organization',
          name: 'organization'
        });"
      >
        返回
      </el-button>
      <div>
        <el-button
          type="plain"
          class="sbs-button"
          @click="prev"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          class="sbs-button"
          @click="saveReserveplan"
        >
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preplanId: 0,
      reserveplanType: [{
        value: '数字',
        label: '数字',
      }, {
        value: '选择',
        label: '选择',
      }, {
        value: '文本',
        label: '文本',
      }, {
        value: '时间',
        label: '时间',
      }],
      reserveplanChoice: '', // 预案参数选择
      reserveplanData: [], // 预案参数列表
      reserveplandefaultData: [], // 预案参数列表
      show: false,
      optionValue: true, // 选项值显示隐藏
      maxlength: [],
    };
  },
  created() {
    this.getParams(); // 调用获取参数
    this.getDefaultParams();
  },
  methods: {
    // 获取预案参数
    getParams() {
      this.preplanId = Number(sessionStorage.getItem('preplanId')); // 获取预案ID
      const data = {
        id: this.preplanId,
      };
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getParams',
        baseURL: window.g.ApiUrl,
        data,
      }).then((res) => {
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].type === 3) {
            this.reserveplanData.push(res.data.data[i]);
          }
        }
      });
    },
    // 获取预案基本参数
    getDefaultParams() {
      this.$http({
        method: 'post',
        url: '/eos/event/param/list',
        baseURL: window.g.ApiUrl,
        data: {
          caseId: '0',
        },
      }).then((res) => {
        this.reserveplandefaultData = res.data.data;
      });
    },
    // 新增预案参数
    reservePlan() {
      const data = {
        name: '',
        valueType: '',
        type: 3,
        values: [],
      };
      this.reserveplanData.push(data);
    },
    // 删除预案参数
    deleteParameter(index) {
      this.reserveplanData.splice(index, 1);
    },
    // 获取当前选中的类型值
    choiceType(value, index) {
      if (value === '选择') {
        this.reserveplanData[index].values.push('');
      } else {
        this.reserveplanData[index].values = [];
      }
    },
    // 添加选项值
    addoptionValue(index) {
      this.reserveplanData[index].values.push('');
    },
    // 当前选项值删除 参数index:当前选项值的索引，index1：当前数据的索引
    deleteoptionValue(index, index1) {
      this.reserveplanData[index1].values.splice(index, 1);
    },
    // 保存预案参数
    saveReserveplan() {
      const nameArray = [];
      for (const i in this.reserveplanData) {
        nameArray.push(this.reserveplanData[i].name);
        if (this.reserveplanData[i].name == '') {
          this.$message({
            message: '名称不能为空！',
            type: 'warning',
          });
          return;
        } if (this.reserveplanData[i].valueType == '') {
          this.$message({
            message: '类型不能为空！',
            type: 'warning',
          });
          return;
        }
        if (this.reserveplanData[i].valueType == '选择') {
          if (this.reserveplanData[i].values.length < 2) {
            this.$message({
              message: `${this.reserveplanData[i].name}的选项值不能少于两个！`,
              type: 'warning',
            });
            return;
          }
          const reserveplanData = this.reserveplanData[i];
          const s = `${reserveplanData.values.join(',')},`;
          for (const j in reserveplanData.values) {
            if (reserveplanData.values[j] == '') {
              this.$message({
                message: `${reserveplanData.name}的选项值不能为空！`,
                type: 'warning',
              });
              return;
            }
            if (s.replace(`${reserveplanData.values[j]},`, '').indexOf(`${reserveplanData.values[j]},`) > -1) {
            }
          }
          // 判断选项值是否相同
          const ary = JSON.parse(JSON.stringify(this.reserveplanData[i])).values.sort();
          for (let i = 0; i < ary.length - 1; i++) {
            if (ary[i] === ary[i + 1]) {
              this.$message({
                message: `${reserveplanData.name}的选项值‘${ary[i]}’重复！`,
                type: 'warning',
              });
              return;
            }
          }
        }
      }
      // 判断名称是否相同
      const reserveplanDataAry = JSON.parse(JSON.stringify(nameArray)).sort();
      for (let i = 0; i < reserveplanDataAry.length - 1; i++) {
        if (reserveplanDataAry[i] === reserveplanDataAry[i + 1]) {
          this.$message({
            message: `名称‘${reserveplanDataAry[i]}’重复！`,
            type: 'warning',
          });
          return;
        }
      }
      const data = {
        id: this.preplanId,
        params: this.reserveplanData,
      };
      if (window.g.isYangZhouProject) {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/setParamsForYangzhou',
          baseURL: window.g.ApiUrl,
          data,
        }).then((res) => {
          if (res) {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
            this.getParams();
            this.$emit('refreshList');
          }
        });
      } else {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/setParams',
          baseURL: window.g.ApiUrl,
          data,
        }).then((res) => {
          if (res) {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
            this.getParams();
            this.$emit('refreshList');
          }
        });
      }
    },
    // 上一步
    prev() {
      this.$emit('refprev');
    },
  },
};
</script>

<style scoped>
.back {
  height: 72vh;
  overflow: auto;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
  padding: 10px;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 0px 0px 4px 4px;
}
.flex1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex2 {
  overflow: auto;
  height: 61vh;
}
.defaultParamsItem {
  font-size: 16px;
  color: #646566;
  border-right: 1px solid #646566;
  padding: 0 5px 0 10px;
}
.defaultParamsItem:last-child {
  border-right: 0;
  padding-right: 0;
}
.parameterList {
  padding: 0;
}
.parameterList>li {
  width: 416px;
  padding: 25px 6px 6px 6px;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  min-height: 60px;
  float: left;
  margin-right: 20px;
  margin-bottom: 10px;
}
.parameterList>li i {
  position: absolute;
  right: 0;
  font-style: normal;
  top: 0;
  font-size: 16px;
  cursor: pointer;
}
li {
  list-style-type: none;
}
.choice {
  padding: 0;
  margin-left: 12px;
}
</style>
