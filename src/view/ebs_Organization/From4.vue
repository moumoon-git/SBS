<template>
  <div>
    <div class="back">
      <div class="left">
        <section class="grayStyle1">
          响应级别
          <img
            src="/static/img/reversePlan/memberUnit.svg"
            style="width: 20px; cursor: pointer;"
            @click="addlevel"
          >
        </section>
        <div
          v-for="level in levels"
          :key="level.id"
          class="leftItemStyle"
          :style="levelId === level.id ? 'color: #0091FF;' : ''"
          @click="clickLevel(level)"
        >
          {{ level.name }}
          <img
            src="/static/img/reversePlan/close.svg"
            style="width:20px;cursor: pointer;"
            @click="deleteLevel(level.id)"
          >
        </div>
      </div>
      <div class="right">
        <section class="grayStyle2">
          响应级别详情
          <el-button
            type="text"
            style="padding: 0;position: absolute;right: 100px;color: #969799;"
            @click="isShowRight = false"
          >
            取消
          </el-button>
          <div class="vline" />
          <el-button
            type="text"
            style="padding: 0;position: absolute;right: 28px;"
            @click="levelMsgSave"
          >
            保存
          </el-button>
        </section>
        <div class="padd1">
          <el-form
            v-if="isShowRight"
            label-width="100px"
          >
            <el-form-item
              label="等级名称:"
              required
            >
              <el-input
                v-model="name"
                size="mini"
                class="rightInput"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="响应信号:"
              required
            >
              <el-select
                v-model="signalId"
                placeholder="请选择"
                size="mini"
                style="width: 100%;"
                @change="change_signal"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="事件等级:"
              required
            >
              <el-select
                v-model="emtlevelID"
                placeholder="请选择"
                size="mini"
                style="width: 100%;"
                @change="change_emtlevel"
              >
                <el-option
                  v-for="item in emtlevelData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="等级描述:"
              required
            >
              <el-input
                v-model="remark"
                type="textarea"
                class="rightInput"
                :rows="6"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
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
          @click="next"
        >
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'From4',
  data() {
    return {
      preplanId: '',
      versionId: '',
      name: '', // 等级信息名称
      remark: '', // 等级信息描述
      options: [], // 响应信号数组
      emtlevelData: [], // 事件等级数组
      levels: [], // 新增级别数组
      signalId: '', // 响应信号ID双向绑定
      emtlevelID: '', // 事件等级ID
      levelId: '', // 新增响应等级ID
      levelIds: '', // 响应等级第一个id
      parameterData: [], // 参数数据
      tableData: [], // 参数表格数据
      relation: '', // 判断表达式
      isShowRight: false,
    };
  },
  created() {
    this.versionId = Number(sessionStorage.getItem('preplanVersionId')); // 获取预案版本ID
    this.preplanId = Number(sessionStorage.getItem('preplanId')); // 获取预案ID
    this.getLevels();
    this.eventLevel();
    this.pcode();
    this.getParams();
  },
  methods: {
    // 新增新级别数组
    addlevel() {
      this.name = '';
      this.remark = '';
      this.signalId = '';
      this.levelId = '';
      this.tableData = [];
      this.emtlevelID = '';
      this.relation = '';
      this.getParams();
      this.isShowRight = true;
    },
    // 删除预案响应等级级别
    deleteLevel(id) {
      this.levelId = id;
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = {
          id: this.levelId,
        };
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/deleteLevel',
          baseURL: window.g.ApiUrl,
          data,
        }).then((res) => {
          if (res) {
            this.$message({
              message: '已删除',
              type: 'success',
            });
            this.levelId = '';
            this.getLevels();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 点击级别获取预案响应等级信息
    clickLevel(level) {
      this.levelId = level.id;
      this.Leveldefault(); // 默认加载第一条数据
    },
    // 默认加载第一条数据
    Leveldefault() {
      if (this.levelId === '') {
        this.levelId = this.levelIds;
      }
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getLevelInfo',
        baseURL: window.g.ApiUrl,
        data: {
          id: this.levelId,
        },
      }).then((res) => {
        const { data } = res.data;
        this.name = data.name;
        this.remark = data.remark;
        this.signalId = data.signalId;
        this.emtlevelID = data.eventLevelId;
        this.isShowRight = true;
        this.tableData = data.params;
        this.relation = data.relation;
      });
    },
    // 选择响应信号返回值
    change_signal(signalId) {
      this.signalId = signalId;
    },
    // 选择事件等级返回值
    change_emtlevel(id) {
      this.emtlevelID = id;
    },
    // 响应信号获取
    pcode() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/dictionary/getByParentCode',
        baseURL: window.g.ApiUrl,
        data: {
          pcode: 'level_signal',
        },
      }).then((res) => {
        this.options = res.data.data;
      });
    },
    // 获取预案响应等级列表
    getLevels() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getLevels',
        baseURL: window.g.ApiUrl,
        data: {
          versionId: this.versionId,
          type: 0,
        },
      }).then((res) => {
        const { data } = res.data;
        if (data.length > 0) {
          this.levels = data;
          this.levelIds = data[0].id;
          this.emtlevelID = data[0].eventLevelId;
          this.Leveldefault(); // 默认加载第一条数据
        } else {
          this.levels = [];
        }
      });
    },
    // 获取事件等级
    eventLevel() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/dictionary/getByParentCode',
        baseURL: window.g.ApiUrl,
        data: {
          pcode: 'emtlevel',
        },
      }).then((res) => {
        this.emtlevelData = res.data.data;
      });
    },
    // 响应参数获取
    getParams() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getParams',
        baseURL: window.g.ApiUrl,
        data: {
          id: this.preplanId,
        },
      }).then((res) => {
        const { data } = res.data;
        const array = [];
        for (let i = 0; i < data.length; i += 1) {
          if (data[i].type === 0) {
            array.push(data[i]);
          }
        }
        this.parameterData = array;
      });
    },
    // 等级信息保存
    levelMsgSave() {
      if (this.name && this.remark && this.signalId && this.emtlevelID) {
        if (this.levelId) { // 修改预案响应等级信息
          this.$http({
            method: 'post',
            url: '/emergency/preparation/preplan/updateLevelInfo',
            baseURL: window.g.ApiUrl,
            data: {
              data: {
                id: this.levelId, // 响应ID
                name: this.name, // 等级名称
                remark: this.remark, // 等级描述
                signalId: this.signalId, // 响应信号ID
                params: [], // 响应等级参数
                relation: '',
                eventLevelId: this.emtlevelID,
              },
            },
          }).then((res) => {
            if (res) {
              this.$message({
                message: '修改成功',
                type: 'success',
              });
              this.levelId = res.data.data.id;
              this.getLevels();
              this.eventLevel();
              this.pcode();
              this.getParams();
            }
          });
        } else { // 保存预案响应等级信息
          this.$http({
            method: 'post',
            url: '/emergency/preparation/preplan/addLevelInfo',
            baseURL: window.g.ApiUrl,
            data: {
              data: {
                name: this.name, // 等级名称
                remark: this.remark, // 等级描述
                versionId: this.versionId, // 预案版本ID
                signalId: this.signalId, // 响应信号ID
                type: 0, // 响应类型
                params: [], // 响应等级参数
                relation: '',
                eventLevelId: this.emtlevelID,
              },
            },
          }).then((res) => {
            if (res) {
              this.$message({
                message: '保存成功',
                type: 'success',
              });
              this.levelId = res.data.data.id;
              this.getLevels();
              this.eventLevel();
              this.pcode();
              this.getParams();
            }
          });
        }
      } else {
        this.$message({
          message: '名称、响应信号、事件等级、描述必填！！',
          type: 'warning',
        });
      }
    },
    prev() {
      this.$emit('refprev');
    },
    next() {
      this.$emit('refreshList');
    },
  },
};
</script>

<style scoped>
.back {
  display: flex;
  height: 72vh;
  overflow: auto;
  position: relative;
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
.left {
  width: 24%;
  height: 72vh;
  overflow: auto;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
  margin: 0 10px 0 0;
}
.right {
  position: relative;
  width: 76%;
  height: 72vh;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
}
.leftItemStyle {
  padding: 8px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.leftItemStyle:hover {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.rightInput {
  width: 100%;
}
.grayStyle1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: #EAEAEA;
  border-radius: 4px 4px 0px 0px;
  font-weight: 550;
}
.grayStyle2 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  background: #EAEAEA;
  border-radius: 4px 4px 0px 0px;
  font-weight: 550;
  position: relative;
}
.padd1 {
  padding: 56px 188px 0 188px;
  text-align: right;
}
.vline {
  width: 1px;
  height: 17px;
  background: #CCCCCC;
  position: absolute;
  right: 76px;
}
</style>
