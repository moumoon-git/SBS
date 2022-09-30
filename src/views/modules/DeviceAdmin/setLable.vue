<template>
  <div :class="$style.setLable">
    <sv-dialog ref="svdialog" @cancel="closePopup" @confirm="submitData">
      <!-- 头部居中 -->
      <template #title>
        <div :class="$style.setLableTitle">
          <span>{{ lableTitle }}</span>
          <span @click="closePopup" />
        </div>
      </template>
      <div :class="$style.setLableContent">
        <!-- 标签 -->
        <div :class="$style.lable">
          <span>标签：</span>
          <div :class="$style.searchLable">
            <el-input
              placeholder="请输入标签名称"
              v-model="inputTitle"
              :class="$style.lableInput"
              @input="lableList"
            />
            <template :class="$style.searchButton" v-if="inputTitle">
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                size="mini"
                @click="addOrUpdateLable()"
              />
              <el-button
                type="danger"
                icon="el-icon-close"
                circle
                size="mini"
                @click.stop="inputTitle = '';searchResultVisible = false;"
              />
            </template>
          </div>
          <div
            id="searchResult"
            :class="$style.searchResult"
            v-if="searchResultVisible"
            @blur="searchResultVisible = false"
          >
            <div
              v-for="(item, index) in searchResultList"
              :key="item.id"
              :class="$style.everyLable"
              @click="lableHandle(item, index)"
              @mouseenter="currentLableName = item.name"
              @mouseleave="currentLableName = ''"
            >
              <template v-if="!item.edit">
                <div
                  :class="$style.lableName"
                  :style="{ color: item.check ? '#0091ff' : 'black' }"
                >
                  {{ item.name }}
                </div>
                <div v-if="currentLableName == item.name">
                  <span :class="$style.lableEdit" @click.stop="editLable(index)"
                    >编辑</span
                  >
                  <span
                    :class="$style.lableDel"
                    @click.stop="delLable(item, index)" >删除</span
                  >
                </div>
              </template>
              <template v-else>
                <div :class="$style.searchLable" @click.stop="">
                  <el-input
                    placeholder="请输入标签名称"
                    v-model="item.name"
                    :class="$style.lableInput"
                  />
                  <template :class="$style.searchButton">
                    <el-button
                      type="success"
                      icon="el-icon-check"
                      circle
                      size="mini"
                      @click.stop="addOrUpdateLable(item, index)"
                    />
                    <el-button
                      type="danger"
                      icon="el-icon-close"
                      circle
                      size="mini"
                      @click.stop="cancelLable(index)"
                    />
                  </template>
                </div>
              </template>
            </div>
            <div
              v-if="searchResultList.length == 0"
              style="padding: 10px; text-align: center"
            >
              暂无数据
            </div>
          </div>
        </div>
        <div :class="$style.selectLable">
          <span
            v-for="item in selectLableList"
            :key="item.id"
            :class="$style.oneLable"
            :style="{ 'border-color': item.labelStyle }"
          >
            <span :style="{ color: item.labelStyle }">{{ item.name }}</span>
            <i
              class="el-icon-error"
              :class="$style.lableClose"
              @click="lableClose(item.id)"
            />
          </span>
        </div>

        <el-divider />

        <!-- 最近使用 -->
        <div>最近使用</div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 15px">
          <span
            v-for="(item, index) in recentLableList"
            :key="item.id"
            :class="$style.oneLable"
            :style="{
              'border-color': item.labelStyle,
              'background-color': item.check ? '#f5f7fa' : 'white',
              color: item.check ? '#00c1de' : 'black',
            }"
            @click="handleLable(recentLableList, commonLableList, item, index)"
          >
            <span :style="{ color: item.labelStyle }">{{ item.name }}</span>
          </span>
        </div>

        <!-- 常用标签 -->
        <div>常用标签</div>
        <div style="display: flex; flex-wrap: wrap">
          <span
            v-for="(item, index) in commonLableList"
            :key="item.id"
            :style="{
              'border-color': item.labelStyle,
              'background-color': item.check ? '#f5f7fa' : 'white',
              color: item.check ? '#00c1de' : 'black',
            }"
            :class="$style.oneLable"
            @click="handleLable(commonLableList, recentLableList, item, index)"
          >
            <span :style="{ color: item.labelStyle }">{{ item.name }}</span>
          </span>
        </div>
      </div>
    </sv-dialog>
  </div>
</template>

<script>
export default {
  name: 'SetLable',
  props: {
    // 标签弹窗标题
    lableTitle: {
      type: String,
      default: '设置标签',
    },
  },
  data() {
    return {
      inputTitle: '', // 搜索内容
      searchResultList: [], // 搜索结果数据
      currentLableName: '', // 存储选中标签名称用于显隐 编辑 删除
      currentLableId: '', // 选中标签id
      searchResultVisible: false, // 标签搜索结果显示
      selectLableList: [], // 所有选中标签列表
      recentLableList: [], // 所有最近使用列表
      commonLableList: [], // 所有常用标签列表
      cacheLabel: '', // 保存上次编辑的当前编辑的标签明名
    };
  },
  watch: {
    inputTitle(val) {
      if (val) {
        this.searchResultVisible = true;
      }
    },
    selectLableList: {
      handler(newVal, oldVal) {
        let addCheck = [];
        if (
          (newVal.length > 0 && oldVal.length === 0) || newVal.length === oldVal.length
        ) {
          this.selectLableList.forEach((item) => {
            this.echoSelectedLabels(item, true);
          });
        } else if (newVal.length > oldVal.length) {
          if (newVal.length > 0 && oldVal.length === 0) {
            addCheck.push(newVal[0]);
          } else if (newVal.length > oldVal.length) {
            addCheck = newVal.filter((v) => oldVal.every((item) => v.id !== item.id));
          }
          this.echoSelectedLabels(addCheck[0], true);
        } else {
          addCheck = oldVal.filter((v) => newVal.every((item) => v.id !== item.id));
          this.echoSelectedLabels(addCheck[0], false);
        }
      },
      deep: true,
    },
  },
  created() {
    // 标签搜索结果列表点击列表外隐藏结果列表
    document.addEventListener('click', (e) => {
      const labelResult = document.getElementById('searchResult');
      if (labelResult) {
        if (!labelResult.contains(e.target)) {
          this.searchResultVisible = false;
          this.inputTitle = '';
        }
      }
    });

    this.getRecentLableList(); // 获取最近使用
    this.getCommonLableList(); // 获取常用标签
  },
  methods: {
    lableStyle() {
      const colorArr = ['#f2b626', '#f66e6e', '#0091ff', '#56e9ff'];
      const index = Math.floor(Math.random() * colorArr.length);
      return colorArr[index];
    },
    // 进入页面重新显示选中或新增选中/取消标签
    echoSelectedLabels(item, type) {
      const recentLableIdx = this.recentLableList.findIndex(
        (v) => v.id === item.id,
      );
      const commonLableIdx = this.commonLableList.findIndex(
        (v) => v.id === item.id,
      );
      if (recentLableIdx !== -1) {
        this.recentLableList[recentLableIdx].check = type;
      }
      if (commonLableIdx !== -1) {
        this.commonLableList[commonLableIdx].check = type;
      }
    },
    async init(labels) {
      this.loadingPopup();
      await this.getRecentLableList(); // 获取最近使用
      await this.getCommonLableList(); // 获取常用标签
      this.inputTitle = '';
      this.selectLableList = labels || [];
    },
    // 加载弹窗
    loadingPopup() {
      if (this.$refs.svdialog) {
        this.$refs.svdialog.visible = true;
      } else {
        setTimeout(() => {
          this.loadingPopup();
        }, 200);
      }
    },
    async getRecentLableList() {
      const request = {
        method: 'get',
        url: '/device/applabel/frequentlyUsedList',
        baseURL: window.SITE_CONFIG.cloudUrl,
        params: {
          type: 1,
        },
      };
      const { data } = await this.$http(request);
      try {
        if (data.code === 0) {
          data.data.forEach((v) => {
            v.check = false;
          });
          this.recentLableList.forEach((item) => {
            const checkLableIdx = data.data.findIndex((v) => v.id === item.id);
            if (checkLableIdx !== -1 && item.check) {
              data.data[checkLableIdx].check = true;
            }
          });
          this.recentLableList = data.data;
        } else {
          this.$message.error(`错误代码：${data.code}`);
        }
      } catch (error) {
        this.$message.error(`接口请求报错：${error}`);
      }
    },
    async getCommonLableList() {
      const request = {
        method: 'get',
        url: '/device/applabel/frequentlyList',
        baseURL: window.SITE_CONFIG.cloudUrl,
        params: {
          type: 1,
        },
      };
      const { data } = await this.$http(request);
      try {
        if (data.code === 0) {
          data.data.forEach((v) => {
            v.check = false;
          });
          this.commonLableList.forEach((item) => {
            const checkLableIdx = data.data.findIndex((v) => v.id === item.id);
            if (checkLableIdx !== -1 && item.check) {
              data.data[checkLableIdx].check = true;
            }
          });
          this.commonLableList = data.data;
        } else {
          this.$message.error(`错误代码：${data.code}`);
        }
      } catch (error) {
        this.$message.error(`接口请求报错：${error}`);
      }
    },
    // 关闭弹窗
    closePopup() {
      // this.ruleForm = this.defaultForm();
      // for (const k in this.showDeviceData) {
      //   this.showDeviceData[k] = [];
      // }
      this.$refs.svdialog.visible = false;
      this.$emit('parentVisible');
    },
    lableHandle(currentLable, index) {
      this.inputTitle = '';
      this.currentLableId = currentLable.id;
      this.searchResultList[index].check = !this.searchResultList[index].check;
      const selectLable = this.selectLableList.find(
        (v) => v.id === currentLable.id,
      );
      this.searchResultVisible = false;
      if (!selectLable) {
        this.selectLableList.push(currentLable);
      } else {
        this.$message.error('请勿重复添加');
      }
    },
    editLable(idx) {
      this.searchResultList[idx].edit = true;
      this.cacheLabel = this.searchResultList[idx].name;
      this.$forceUpdate();
    },
    async addOrUpdateLable(item, idx) {
      const request = {
        method: 'post',
        url: `/device/applabel/${!item ? 'save' : 'update'}`,
        baseURL: window.SITE_CONFIG.cloudUrl,
        data: {
          id: item ? item.id : undefined,
          labelStyle: item ? item.labelStyle : this.lableStyle(),
          labelType: 1,
          name: item ? item.name : this.inputTitle,
        },
      };
      const { data } = await this.$http(request);
      if (data.code === 0) {
        if (!item) {
          this.inputTitle = '';
          const addLable = data.data.entity;
          this.selectLableList.push(addLable);
        } else {
          this.searchResultList[idx].edit = false;
          const checkLableIdx = this.selectLableList.findIndex(
            (v) => v.id === item.id,
          );
          if (checkLableIdx !== -1) {
            this.selectLableList[checkLableIdx].name = item.name;
          }
          this.getRecentLableList(); // 获取最近使用mi
          this.getCommonLableList(); // 获取常用标签
        }
        this.$message.success(`标签${!item ? '新增' : '编辑'}成功`);
      } else {
        this.$message.error(`错误代码：${data.code}`);
      }
    },
    async delLable(item) {
      const request = {
        method: 'post',
        url: '/device/applabel/delete',
        baseURL: window.SITE_CONFIG.cloudUrl,
        data: [item.id],
      };
      const { data } = await this.$http(request);
      console.log('data: ', data);
      if (data.code === 0) {
        this.$message.success('标签删除成功');
        this.lableList();
        const checkLableIdx = this.selectLableList.findIndex(
          (v) => v.id === item.id,
        );
        if (checkLableIdx !== -1) {
          this.selectLableList.splice(checkLableIdx, 1);
        }
        this.getRecentLableList(); // 获取最近使用
        this.getCommonLableList(); // 获取常用标签
      } else {
        this.$message.error(`错误代码：${data.code}`);
      }
    },
    cancelLable(idx) {
      this.searchResultList[idx].name = this.cacheLabel;
      this.searchResultList[idx].edit = false;
      this.$forceUpdate();
    },
    lableClose(id) {
      this.selectLableList = this.selectLableList.filter((v) => v.id !== id);
    },
    handleLable(data1, data2, item, idx) {
      const dataOne = data1;
      const dataTwo = data2;
      dataOne[idx].check = !dataOne[idx].check;
      const checkIdx = dataTwo.findIndex((v) => v.id === item.id);
      if (checkIdx !== -1) {
        dataTwo[checkIdx].check = !dataTwo[checkIdx].check;
      }
      if (dataOne[idx].check) {
        this.selectLableList.push(dataOne[idx]);
      } else {
        const selectLableIdx = this.selectLableList.findIndex(
          (v) => v.id === dataOne[idx].id,
        );
        if (selectLableIdx !== -1) {
          this.selectLableList.splice(selectLableIdx, 1);
        }
      }
      this.$forceUpdate();
    },
    // 查询所有标签列表
    async lableList() {
      const request = {
        method: 'get',
        url: '/device/applabel/list',
        baseURL: window.SITE_CONFIG.cloudUrl,
        params: {
          type: 1,
          key: this.inputTitle,
        },
      };
      const { data } = await this.$http(request);
      try {
        if (data.code === 0) {
          this.searchResultList = data.data;
          this.searchResultList.forEach((v) => {
            v.check = false;
            v.edit = false;
          });
        } else {
          this.$message.error(`错误代码：${data.code}`);
        }
      } catch (error) {
        this.$message.error(`接口请求报错：${error}`);
      }
    },
    // 点击了确定
    submitData() {
      this.$emit('submitData', [...this.selectLableList]);
      this.$refs.svdialog.visible = false;
      this.$emit('parentVisible');
    },
  },
};
</script>

<style lang="scss" module>
.setLableTitle {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  width: 100%;
  height: 40px;
  background: #f1f4f6;
  line-height: 40px;
  color: #333;

  & > span {
    &:last-child {
      position: absolute;
      right: 14px;
      top: 10px;
      width: 15px;
      height: 15px;
      background: url('./assets/close.svg') 100%/100% no-repeat;
      cursor: pointer;
    }
  }
}
.setLableContent {
  padding: 10px;
  width: 400px;
  .lable {
    display: flex;
    align-items: center;
    position: relative;
    .searchLable {
      width: 235px;
      border: 1px solid #dcdfea;
      border-radius: 4px;
      background-color: white;
      .lableInput {
        width: 73%;
      }
    }
    & :global(.el-button--mini.is-circle) {
      padding: 1px;
    }
    & :global(.el-input__inner) {
      border: none;
      height: 26px;
      line-height: 26px;
    }
  }
  .searchResult {
    border: 1px solid #dcdfea;
    width: 235px;
    height: 200px;
    overflow: auto;
    background-color: white;
    position: absolute;
    top: 36px;
    left: 45px;
    z-index: 1;
    .everyLable {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      padding: 2px 10px;
      height: 32px;
      line-height: 25px;
      &:hover {
        background-color: rgb(245, 247, 250);
        .lableName {
          color: black !important;
        }
      }
      .lableEdit {
        &:hover {
          opacity: 0.7;
        }
      }
      .lableDel {
        color: #f66e6e;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .selectLable {
    margin: 15px 0 0 40px;
    display: flex;
    flex-wrap: wrap;
  }
  .oneLable {
    border: 1px dashed #dcdfea;
    border-radius: 5px;
    margin: 5px;
    position: relative;
    cursor: pointer;
    .lableClose {
      position: absolute;
      top: -11px;
      font-size: 17px;
      right: -7px;
      background-color: white;
      cursor: pointer;
      &:hover {
        color: #56e9ff;
      }
    }
  }
}
</style>
