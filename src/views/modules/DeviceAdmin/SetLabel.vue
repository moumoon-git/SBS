<template>
  <div :class="$style.setLabel">
    <sv-dialog ref="svdialog" @cancel="closePopup" @confirm="submitData">
      <!-- 头部居中 -->
      <template #title>
        <div :class="$style.setLabelTitle">
          <span>{{ labelTitle }}</span>
          <span @click="closePopup" />
        </div>
      </template>
      <div :class="$style.setLabelContent">
        <!-- 标签 -->
        <div :class="$style.label">
          <span>标签：</span>
          <!-- 搜索框 -->
          <div :class="$style.searchLabel">
            <el-input
              placeholder="请输入标签名称"
              v-model="inputTitle"
              :class="$style.labelInput"
              @input="labelList"
              @focus="isEventListener = false;labelList();searchResultVisible = true;"
              @blur="isEventListener = true"
            />
            <template :class="$style.searchButton" v-if="inputTitle">
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                size="mini"
                @click="addOrUpdateLabel()"
              />
              <el-button
                type="danger"
                icon="el-icon-close"
                circle
                size="mini"
                @click.stop="inputTitle = '';labelList();"
              />
            </template>
          </div>

          <!-- 搜索结果列表 -->
          <div
            id="searchResult"
            :class="$style.searchResult"
            v-if="searchResultVisible"
            @blur="searchResultVisible = false"
          >
            <div
              v-for="(item, index) in searchResultList"
              :key="item.id"
              :class="$style.everyLabel"
              @click="labelHandle(item, index)"
              @mouseenter="currentLabelName = item.name"
              @mouseleave="currentLabelName = ''"
            >
              <template v-if="item !== cacheLabel">
                <div
                  :class="$style.labelName"
                  :style="{ color: selectLabelList.find(v=>v.id == item.id) ? '#0091ff' : 'black' }"
                >
                  {{ item.name }}
                </div>
                <div v-if="currentLabelName == item.name">
                  <span
                    :class="$style.labelEdit"
                    @click.stop="cacheLabel = item;EditInput = item.name"
                  >
                    编辑
                  </span>
                  <span
                    :class="$style.labelDel"
                    @click.stop="delLabel(item, index)"
                  >
                    删除
                  </span>
                </div>
              </template>
              <template v-else>
                <div
                  :class="$style.searchLabel"
                  @click.stop=""
                >
                  <el-input
                    placeholder="请输入标签名称"
                    v-model="EditInput"
                    :class="$style.labelInput"
                  />
                  <template :class="$style.searchButton">
                    <el-button
                      type="success"
                      icon="el-icon-check"
                      circle
                      size="mini"
                      @click.stop="addOrUpdateLabel(item, index)"
                    />
                    <el-button
                      type="danger"
                      icon="el-icon-close"
                      circle
                      size="mini"
                      @click.stop="cacheLabel = undefined"
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

        <!-- 选中标签列表 -->
        <div :class="$style.selectLabel">
          <span
            v-for="item in selectLabelList"
            :key="item.id"
            :class="$style.oneLabel"
            :style="{ 'border-color': item.labelStyle }"
          >
            <span :style="{ color: item.labelStyle }">{{ item.name }}</span>
            <i
              class="el-icon-error"
              :class="$style.labelClose"
              @click="labelClose(item.id)"
            />
          </span>
        </div>

        <el-divider />

        <!-- 最近使用 -->
        <div>最近使用</div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 15px">
          <span
            v-for="item in recentLabelList"
            :key="item.id"
            :class="$style.oneLabel"
            :style="{
              'border-color': item.labelStyle,
              'background-color': selectLabelList.find(v=>v.id == item.id) ? '#f5f7fa' : 'white',
              color: selectLabelList.find(v=>v.id == item.id) ? '#00c1de' : 'black',
            }"
            @click="handleLabel(item)"
          >
            <span :style="{ color: item.labelStyle }">{{ item.name }}</span>
          </span>
        </div>

        <!-- 常用标签 -->
        <div>常用标签</div>
        <div style="display: flex; flex-wrap: wrap">
          <span
            v-for="item in commonLabelList"
            :key="item.id"
            :style="{
              'border-color': item.labelStyle,
              'background-color': selectLabelList.find(v=>v.id == item.id) ? '#f5f7fa' : 'white',
              color: selectLabelList.find(v=>v.id == item.id) ? '#00c1de' : 'black',
            }"
            :class="$style.oneLabel"
            @click="handleLabel(item)"
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
  name: 'SetLabel',
  props: {
    // 标签弹窗标题
    labelTitle: {
      type: String,
      default: '设置标签',
    },
  },
  data() {
    return {
      inputTitle: '', // 搜索内容
      searchResultList: [], // 搜索结果数据
      currentLabelName: '', // 存储选中标签名称用于显隐 编辑 删除
      currentLabelId: '', // 选中标签id
      searchResultVisible: false, // 标签搜索结果显示
      selectLabelList: [], // 所有选中标签列表
      recentLabelList: [], // 所有最近使用列表
      commonLabelList: [], // 所有常用标签列表
      cacheLabel: '', // 保存上次编辑的当前编辑的标签明名
      isEventListener: false, // 是否触发document点击
      EditInput: '', // 编辑标签时的输入框值
    };
  },
  watch: {
    inputTitle(val) {
      if (val) {
        this.searchResultVisible = true;
      }
    },
  },
  created() {
    // 标签搜索结果列表点击列表外隐藏结果列表
    document.addEventListener('click', (e) => {
      if (this.isEventListener) {
        const labelResult = document.getElementById('searchResult');
        if (labelResult) {
          if (!labelResult.contains(e.target)) {
            this.searchResultVisible = false;
            this.inputTitle = '';
          }
        }
      }
    });

    this.getRecentLabelList(); // 获取最近使用
    this.getCommonLabelList(); // 获取常用标签
  },
  methods: {
    // 获取随机样式
    labelStyle() {
      const colorArr = ['#f2b626', '#f66e6e', '#0091ff', '#56e9ff'];
      const index = Math.floor(Math.random() * colorArr.length);
      return colorArr[index];
    },
    // 标签弹窗回显数据
    async init(labels) {
      this.loadingPopup();
      await this.getRecentLabelList(); // 获取最近使用
      await this.getCommonLabelList(); // 获取常用标签
      this.inputTitle = '';
      this.selectLabelList = labels || [];
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
    // 获取最近标签
    async getRecentLabelList() {
      const request = {
        method: 'get',
        url: '/device/applabel/frequentlyUsedList',
        baseURL: window.SITE_CONFIG.cloudUrl,
        params: {
          type: 1,
          page: 0,
          size: 5,
        },
      };
      const { data } = await this.$http(request);
      try {
        if (data.code === 0) {
          this.recentLabelList = data.data;
        } else {
          this.$message.error(`错误代码：${data.code}`);
        }
      } catch (error) {
        this.$message.error(`接口请求报错：${error}`);
      }
    },
    // 获取常用标签
    async getCommonLabelList() {
      const request = {
        method: 'get',
        url: '/device/applabel/frequentlyList',
        baseURL: window.SITE_CONFIG.cloudUrl,
        params: {
          type: 1,
          page: 0,
          size: 10,
        },
      };
      const { data } = await this.$http(request);
      try {
        if (data.code === 0) {
          this.commonLabelList = data.data;
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
    // 选中搜索结果标签
    labelHandle(currentLabel) {
      this.inputTitle = '';
      this.currentLabelId = currentLabel.id;
      const selectLabelIdx = this.selectLabelList.findIndex(
        (v) => v.id === currentLabel.id,
      );
      if (selectLabelIdx === -1) {
        this.selectLabelList.push(currentLabel);
      } else {
        this.selectLabelList.splice(selectLabelIdx, 1);
      }
    },
    // 图标勾选保存或编辑
    async addOrUpdateLabel(item, idx) {
      const request = {
        method: 'post',
        url: `/device/applabel/${!item ? 'save' : 'update'}`,
        baseURL: window.SITE_CONFIG.cloudUrl,
        data: {
          id: item ? item.id : undefined,
          labelStyle: item ? item.labelStyle : this.labelStyle(),
          labelType: 1,
          name: this.EditInput || this.inputTitle,
        },
      };
      const { data } = await this.$http(request);
      if (data.code === 0) {
        if (!item) {
          this.inputTitle = '';
          const addLabel = data.data.entity;
          this.selectLabelList.push(addLabel);
        } else {
          this.cacheLabel = undefined;
          this.searchResultList[idx].edit = false;
          const checkLabelIdx = this.selectLabelList.findIndex(
            (v) => v.id === item.id,
          );
          if (checkLabelIdx !== -1) {
            this.selectLabelList[checkLabelIdx].name = this.EditInput;
          }
          this.EditInput = '';
          this.labelList();
          this.getRecentLabelList(); // 获取最近使用
          this.getCommonLabelList(); // 获取常用标签
        }
        this.$message.success(`标签${!item ? '新增' : '编辑'}成功`);
      } else {
        this.$message.error(`错误代码：${data.code}`);
      }
    },
    // 删除按钮
    delLabel(item) {
      this.isEventListener = false;
      this.$confirm('是否删除该标签，删除后所有应用该标签的任务都将自动移除该标签！', '删除标签', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const request = {
          method: 'post',
          url: '/device/applabel/delete',
          baseURL: window.SITE_CONFIG.cloudUrl,
          data: [item.id],
        };
        const { data } = await this.$http(request);
        if (data.code === 0) {
          this.$message.success('标签删除成功');
          this.labelList();
          const checkLabelIdx = this.selectLabelList.findIndex(
            (v) => v.id === item.id,
          );
          if (checkLabelIdx !== -1) {
            this.selectLabelList.splice(checkLabelIdx, 1);
          }
          this.getRecentLabelList(); // 获取最近使用
          this.getCommonLabelList(); // 获取常用标签

          this.$emit('refreshDataList'); // 刷新表格
        } else {
          this.$message.error(`错误代码：${data.code}`);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 删除选中标签
    labelClose(id) {
      this.selectLabelList = this.selectLabelList.filter((v) => v.id !== id);
    },
    // 选中最近或常用标签
    handleLabel(item) {
      console.log('item: ', item);
      const selectLabelIdx = this.selectLabelList.findIndex((v) => v.id === item.id);
      console.log('selectLabelIdx: ', selectLabelIdx);
      if (selectLabelIdx === -1) {
        this.selectLabelList.push(item);
      } else {
        this.selectLabelList.splice(selectLabelIdx, 1);
      }
      this.$forceUpdate();
    },
    // 查询所有标签列表
    async labelList() {
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
        } else {
          this.$message.error(`错误代码：${data.code}`);
        }
      } catch (error) {
        this.$message.error(`接口请求报错：${error}`);
      }
    },
    // 点击了确定
    submitData() {
      this.$emit('submitData', [...this.selectLabelList]);
      this.$refs.svdialog.visible = false;
      this.$emit('parentVisible');
    },
  },
};
</script>

<style lang="scss" module>
.setLabelTitle {
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
.setLabelContent {
  padding: 10px;
  width: 400px;
  .label {
    display: flex;
    align-items: center;
    position: relative;
    .searchLabel {
      width: 235px;
      border: 1px solid #dcdfea;
      border-radius: 4px;
      background-color: white;
      .labelInput {
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
    .everyLabel {
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
        .labelName {
          color: black !important;
        }
      }
      .labelEdit {
        &:hover {
          opacity: 0.7;
        }
      }
      .labelDel {
        color: #f66e6e;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .selectLabel {
    margin: 15px 0 0 40px;
    display: flex;
    flex-wrap: wrap;
  }
  .oneLabel {
    border: 1px dashed #dcdfea;
    border-radius: 5px;
    margin: 5px;
    position: relative;
    cursor: pointer;
    .labelClose {
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
