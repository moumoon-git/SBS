<template>
  <div>
    <el-dialog
      title="响应参数"
      center
      class="sbs-dialog"
      width="800px"
      :visible.sync="isVisible1"
      :close-on-click-modal="false"
    >
      <div class="frame">
        <div style="margin-bottom: 10px;">
          <el-button
            class="sbs-button"
            @click="addRelation"
          >
            添加
          </el-button>
          <el-button
            class="sbs-button"
            @click="setRelation"
          >
            设置关系
          </el-button>
        </div>
        <el-table
          :data="tableData"
          height="400"
          class="sbs-table"
          :cell-style="{ textAlign: 'center' }"
        >
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="valueType"
            label="类型"
          />
          <el-table-column
            prop="compareType"
            label="关系"
          />
          <el-table-column
            prop="compareValue"
            label="值"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleUpdate(scope.row,scope.$index)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                @click="handleDelete(scope.row,scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom">
        <el-button
          type="primary"
          class="sbs-button"
          @click="submit1"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="自定义参数"
      :visible.sync="isVisible2"
      width="410px"
      center
      append-to-body
      class="sbs-dialog"
      :close-on-click-modal="false"
    >
      <div class="frame">
        <el-form label-width="80px">
          <el-form-item
            label="名称:"
            required
          >
            <el-select
              v-model="parameterID"
              placeholder="请选择"
              value-key="id"
              :disabled="parameterdisabled"
              style="width: 100%;"
              @change="choiceName"
            >
              <el-option
                v-for="item in parameterData"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="关系:"
            required
          >
            <el-select
              v-model="Symbol"
              :disabled="disabled"
              style="width: 100%;"
            >
              <el-option
                v-for="item in SymbolData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="show === '文本'"
            label="数值:"
            required
          >
            <el-input
              v-model="numericalValue"
            />
          </el-form-item>
          <el-form-item
            v-else-if="show === '数字'"
            label="数值:"
            required
          >
            <el-input
              v-model="numericalValue"
            />
          </el-form-item>
          <el-form-item
            v-else-if="show === '时间'"
            label="数值:"
            required
          >
            <el-date-picker
              v-model="numericalValue"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            v-else-if="show === '选择'"
            label="数值:"
            required
          >
            <el-select
              v-model="numericalValue"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="item in numberData"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <span
            v-if="unitShow"
            class="unit"
          >单位：{{ unit }}</span>
        </el-form>
      </div>
      <div class="bottom">
        <el-button
          type="plain"
          class="sbs-button"
          @click="isVisible2 = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          class="sbs-button"
          @click="submit2"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="设置条件"
      :visible.sync="isVisible3"
      width="800px"
      center
      append-to-body
      class="sbs-dialog"
      :close-on-click-modal="false"
    >
      <div class="frame">
        <el-form label-width="60px">
          <el-form-item
            label="条件:"
            required
          >
            <el-input
              v-model="relations"
              type="textarea"
              :rows="6"
              readonly
            />
            <div
              class="bottom"
              style="border-top: none;"
            >
              <el-button
                type="primary"
                class="sbs-button"
                @click="clearRelation"
              >
                清除
              </el-button>
              <el-button
                type="primary"
                class="sbs-button"
                :disabled="disableds"
                @click="revokeRelation"
              >
                撤销
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-form label-width="60px">
          <el-form-item label="参数项:">
            <section class="flex">
              <div class="bord">
                <div
                  v-for="(item ,index) in parameter"
                  :key="index"
                  :class="{ listItemChoosed: index === parameterindex }"
                  @click="parameterChoice(item,index)"
                >
                  {{ item.name }}
                </div>
              </div>
              <div class="bord">
                <div
                  v-for="(item ,index) in Expression"
                  :key="index"
                  :class="{ listItemChoosed: index === levelsindex}"
                  @click="expressionChoice(item,index)"
                >
                  {{ item }}
                </div>
              </div>
            </section>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom">
        <el-button
          type="primary"
          class="sbs-button"
          @click="submit3"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['parameterData', 'relation', 'userCreate'],
  data() {
    return {
      isVisible1: false, // 是否开窗
      isVisible2: false,
      isVisible3: false,
      disableds: false,
      parameterdisabled: false,
      unitShow: false, // 单位
      parameterName: '', // 参数名称
      parameterID: '', // 参数ID
      parameterType: '', // 参数类型
      Symbol: '', // 参数关系
      numericalValue: '', // 参数数值
      SymbolData: [{
        id: '<',
        name: '<',
      },
      {
        id: '>',
        name: '>',
      },
      {
        id: '=',
        name: '=',
      },
      {
        id: '>=',
        name: '>=',
      },
      {
        id: '<=',
        name: '<=',
      },
      ], // 关系数组
      tableData: [],
      show: '',
      numberData: [],
      disabled: false,
      type: '', // 判断新增还是修改
      tableDataIndex: '',
      relations: '', // 判断条件
      backups: '', // 备份
      relationarray: [],
      Expression: ['AND ', 'OR ', '( ', ') '],
      parameter: [],
      levelsindex: -1,
      parameterindex: -1,
      errortype: '', // 错误后，点击确定按钮不能通过验证
      unit: '', // 单位
    };
  },
  methods: {
    responseclear(data) {
      this.tableData = JSON.parse(JSON.stringify(data));
      this.relations = '';
      this.levelsindex = -1;
      this.parameterindex = -1;
      this.backups = '';
      this.relationarray = [];
      this.isVisible1 = true;
    },
    addRelation() {
      this.isVisible2 = true;
      this.parameterID = '';
      this.Symbol = '';
      this.numericalValue = '';
      this.disabled = false;
      this.type = '';
      this.show = '';
      this.unitShow = false;
      this.unit = '';
      this.parameterdisabled = false;
    },
    setRelation() {
      this.errortype = '';
      if (this.tableData.length >= 1) {
        this.isVisible3 = true;
        this.parameter = [];
        for (const i in this.tableData) {
          const data = {};
          if (this.tableData[i].valueType === '数字') {
            data.name = `{${this.tableData[i].name}}` + ` ${this.tableData[i].compareType} ${this.tableData[i].compareValue}`;
          } else {
            data.name = `{${this.tableData[i].name}}` + ` ${this.tableData[i].compareType} ` + `"${this.tableData[
              i].compareValue}"`;
          }
          this.parameter.push(data);
        }
        if (this.backups === '') {
          if (this.relation !== '') {
            let textID = this.relation;
            const regular = textID.match(/\{(.+?)\}/g); // 找出花括号的内容，包括{}
            const deleteArray = []; // 匹配参数不存在数组
            for (const i in regular) {
              let count = 0;
              for (const j in this.parameterData) {
                const name = `{${this.parameterData[j].name}}`;
                const ID = `{${this.parameterData[j].id}}`;
                if (ID === regular[i]) {
                  count = 1;
                  textID = textID.replace(regular[i], name);
                  break;
                }
              }
              if (count === 0) {
                deleteArray.push(regular[i]);
              }
            }
            if (deleteArray.length > 0) {
              let name = '';
              // 参数
              for (const i in deleteArray) {
                name += deleteArray[i];
                if (i < deleteArray.length - 1) {
                  name += ',';
                }
              }
              setTimeout(() => {
                this.$message({
                  message: `${name}参数不存在，请重新生成条件！`,
                  type: 'warning',
                });
              }, 100);
              this.errortype = 1; // 错误后，点击确定按钮不能通过验证
            }
            this.relations = textID;
          } else {
            this.relations = this.relation;
          }
        } else {
          let textID = this.backups;
          const regular = textID.match(/\{(.+?)\}/g); // 找出花括号的内容，包括{}
          for (const i in regular) {
            for (const j in this.parameterData) {
              const name = `{${this.parameterData[j].name}}`;
              const ID = `{${this.parameterData[j].id}}`;
              if (ID === regular[i]) {
                textID = textID.replace(regular[i], name);
                break;
              }
            }
          }
          this.relations = textID;
        }
        if (this.relationarray.length === 0) {
          this.disableds = true;
        } else {
          this.disableds = false;
        }
      } else {
        this.$message({
          message: '响应参数必须有一条以上才能设置条件！',
          type: 'warning',
        });
      }
    },
    parameterChoice(item, index) {
      this.errortype = '';
      this.disableds = false;
      this.parameterindex = index;
      this.relationarray.push(`${item.name} `);
      this.relations = '';
      for (const i in this.relationarray) {
        this.relations += this.relationarray[i];
      }
    },
    expressionChoice(item, index) {
      this.errortype = '';
      this.levelsindex = index;
      this.disableds = false;
      this.relationarray.push(item);
      this.relations = '';
      for (const i in this.relationarray) {
        this.relations += this.relationarray[i];
      }
    },
    choiceName(Id) {
      let obj = {};
      obj = this.parameterData.find((item) => item.id === Id);
      this.parameterName = obj.name;
      this.parameterType = obj.valueType;
      this.show = obj.valueType;
      this.unit = obj.unit;
      if (obj.unit !== '') {
        this.unitShow = true;
      } else {
        this.unitShow = false;
      }
      if (obj.valueType === '选择') {
        this.numberData = obj.values;
        this.Symbol = '=';
        this.disabled = true;
        this.numericalValue = '';
      } else if (obj.valueType === '文本') {
        this.numberData = [];
        this.Symbol = '=';
        this.disabled = true;
        this.numericalValue = '';
      } else {
        this.numberData = [];
        this.Symbol = '';
        this.disabled = false;
        this.numericalValue = '';
      }
    },
    handleUpdate(row, index) {
      this.type = 'Update';
      this.unitShow = false;
      this.tableDataIndex = index;
      this.isVisible2 = true;
      this.parameterName = row.name;
      this.parameterID = row.id;
      this.parameterType = row.valueType;
      this.show = row.valueType;
      this.parameterdisabled = true;
      this.Symbol = row.compareType;
      this.numericalValue = row.compareValue;
      if (row.valueType === '文本' || row.valueType === '选择') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    handleDelete(row, index) {
      this.$confirm('确定删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.tableData.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    submit1() {
      let relation;
      if (this.backups === '') {
        relation = this.relation;
      } else {
        relation = this.backups;
      }
      const data = {
        relation,
        tableData: this.tableData,
      };
      this.isVisible1 = false;
      this.$emit('parameterSetting', data);
      this.backups = '';
      this.$message({
        message: '设置成功',
        type: 'success',
      });
    },
    submit2() {
      if (this.show === '数字') {
        if (isNaN(this.numericalValue) === true) {
          this.$message({
            message: '请填写数字类型！',
            type: 'warning',
          });
          return;
        }
      }
      if (this.parameterName === '' || this.Symbol === '' || this.numericalValue === '') {
        this.$message({
          message: '名称、关系、数值必填！',
          type: 'warning',
        });
        return;
      }

      if (this.type === 'Update') {
        this.tableData[this.tableDataIndex].id = this.parameterID;
        this.tableData[this.tableDataIndex].compareValue = this.numericalValue;
        this.tableData[this.tableDataIndex].compareType = this.Symbol;
        this.tableData[this.tableDataIndex].name = this.parameterName;
        this.tableData[this.tableDataIndex].valueType = this.parameterType;
        this.tableData[this.tableDataIndex].userCreate = this.userCreate;
      } else {
        const data = {
          name: this.parameterName,
          compareType: this.Symbol,
          compareValue: this.numericalValue,
          id: this.parameterID,
          valueType: this.parameterType,
          userCreate: this.userCreate,
        };
        this.tableData.push(data);
      }
      this.isVisible2 = false;
    },
    submit3() {
      if (this.errortype === 1) {
        this.$message({
          message: '表达式有误,请清除重新生成表达式',
          type: 'warning',
        });
        return;
      }
      if (this.relations === '') {
        this.$message({
          message: '表达式不能为空',
          type: 'warning',
        });
        return;
      }
      let textID = this.relations;
      const regular = textID.match(/\{(.+?)\}/g); // 找出花括号的内容，包括{}
      for (const i in regular) {
        for (const j in this.parameterData) {
          const name = `{${this.parameterData[j].name}}`;
          const ID = `{${this.parameterData[j].id}}`;
          if (name === regular[i]) {
            textID = textID.replace(regular[i], ID);
          }
        }
      }
      const data = {
        relation: textID,
      };
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/verifyLevelRelation',
        baseURL: window.g.ApiUrl,
        data,
      }).then((res) => {
        if (res.data.errorcode === 0 || res.data.code === 0) {
          this.$message({
            message: '格式正确',
            type: 'success',
          });
          this.backups = textID;
          this.isVisible3 = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error',
          });
        }
      });
    },
    clearRelation() {
      this.relations = '';
      this.errortype = '';
      this.relationarray = [];
      this.disableds = true;
    },
    revokeRelation() {
      this.relationarray.splice(this.relationarray.length - 1, 1);
      this.relations = '';
      for (const i in this.relationarray) {
        this.relations += this.relationarray[i];
      }
      if (this.relationarray.length === 0) {
        this.disableds = true;
      }
    },
  },
};
</script>

<style scoped>
.frame {
  padding: 10px 20px;
}
.bord {
  border: 1px solid #E9ECF1;
  width: 47%;
}
.flex {
  display: flex;
  justify-content: space-evenly;
}
.listItemChoosed {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.bottom {
  border-top: 1px solid #E9ECF1;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 15px 10px;
}
.unit {
  margin-left: 36px;
}
</style>
