<template>
  <div :class="$style.container">
    <!-- A. 分组列表 -->
    <section
      v-loading="isTreeLoading"
      element-loading-spinner="sv-loading"
    >
      <sv-tree-tab
        :tab-list="['通讯录', '设备']"
        @switch="handleTreeTabSwitch"
      />
      <sv-input-tree-search
        v-model="treeSearchKeyword"
        style="margin: 10px auto; display: flex;"
        width="calc(100% - 20px)"
        @change="handleSearch"
      />
      <!-- 通讯录树形分组 -->
      <el-tree
        v-show="treeTabIndex === 0"
        ref="tree"
        class="sbs-tree"
        style="height: calc(100% - 100px)"
        node-key="id"
        :data="treeList"
        :highlight-current="true"
        :props="{
          children: 'children',
          label: 'name',
          value: 'id',
        }"
        @node-click="getGroupDetail($event)"
      />
      <!-- 设备树形分组，因为要懒加载，不能与通讯录的树共用一个组件 -->
      <el-tree
        v-show="treeTabIndex === 1"
        ref="deviceTree"
        class="sbs-tree"
        node-key="id"
        :props="{
          children: 'children',
          label: 'name',
          value: 'id',
          isLeaf: '',
        }"
        :load="handleLazyLoad"
        lazy
        @node-click="handleDeviceGroupClick"
      />
    </section>
    <!-- B. 勾选列表 -->
    <section
      v-loading="isGroupDetailLoading"
      element-loading-spinner="sv-loading"
      :class="$style.checkList"
    >
      <header>
        <span class="sbs-title">
          {{ ['联系人列表', '设备列表'][treeTabIndex] }}
        </span>
        <el-checkbox
          :value="isCheckAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAll"
        >全选</el-checkbox>
      </header>
      <!-- 通讯录列表 -->
      <main v-if="treeTabIndex === 0">
        <el-checkbox-group
          v-model="checkList"
          :class="$style.checkGroupList"
        >
          <el-checkbox
            v-for="item in groupDetail"
            :key="item.id"
            :class="$style.checkboxItem"
            :label="item.id"
            border
            @change="handleCheck($event, item)"
          >
            <div :class="$style.contactName">
              {{ item.name || item.mobile1 || item.phone || '暂无名称' }}
              {{ item.position ? `（${item.position}）` : '' }}
            </div>
            <div :class="$style.workUnit">
              {{ item.workUnit || '暂无单位信息' }}
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </main>
      <!-- 设备列表 -->
      <main v-else-if="treeTabIndex === 1">
        <el-checkbox-group
          v-model="deviceCheckList"
          :class="$style.checkGroupList"
        >
          <el-checkbox
            v-for="item in deviceGroupDetail"
            :key="item.id"
            :class="$style.checkboxItem"
            :label="item.id"
            border
            @change="handleCheck($event, item)"
          >
            <div :class="$style.contactName">
              {{ item.name || '暂无名称' }}
            </div>
            <div :class="$style.workUnit">
              {{ item.code || '暂无设备号码' }}
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </main>
      <footer v-if="treeTabIndex === 0">
        <el-pagination
          class="sbs-pagination"
          :page-size="10"
          :current-page.sync="pageIndex"
          small
          layout="prev, pager, next"
          :page-count="pageTotal"
          :pager-count="5"
          @current-change="handlePageChange"
        />
      </footer>
    </section>
    <!-- C. 已选列表 -->
    <section :class="$style.rightList">
      <header>
        <span class="sbs-title">已选会议成员</span>
      </header>
      <el-tabs
        v-model="currentChosenTab"
        class="sbs-tabs"
        :stretch="true"
      >
        <el-tab-pane
          v-for="tab in chosenTabs"
          :key="tab.name"
          :label="`${tab.name} ${tab.count}`"
          :name="tab.name"
        />
      </el-tabs>
      <ul :class="$style.resultList">
        <template v-if="['全部', '联系人'].includes(currentChosenTab)">
          <li
            v-for="item in Array.from(checkNodeList.values())"
            :key="`contact_${item.id}`"
            :class="$style.checkedItem"
          >
            <i :class="[$style.icon, $style.LianXiRen]" />
            <span>
              {{ item.name }}（{{ item.workUnit || '暂无单位' }}/{{ item.position || '暂无职务' }}）
              <span v-if="!item.type" style="color: red;">【缺少入会方式】</span>
            </span>
            <el-select
              v-show="item.type"
              :value="item.type"
              class="sbs-select"
              placeholder="请选择入会方式"
              @change="changeJoinType($event, item)"
            >
              <el-option
                v-for="way in calcValidMeetingApproach(item)"
                :key="way.label"
                :label="way.name"
                :value="way.value"
              />
            </el-select>
            <i :class="['el-icon-error', $style.closeBtn]" @click="uncheckContact(item.id)" />
          </li>
        </template>
        <template v-if="['全部', '视频监控'].includes(currentChosenTab)">
          <li
            v-for="item in Array.from(deviceCheckNodeList.values()).filter((i) => i.type === 0)"
            :key="`device_${item.id}`"
            :class="$style.checkedItem"
          >
            <i :class="[$style.icon, $style.ShiPinJianKong]" />
            <span>{{ item.name }}（{{ item.meetingCode || item.code || '暂无号码' }}）</span>
            <i :class="['el-icon-error', $style.closeBtn]" @click="uncheckDevice(item.id)" />
          </li>
        </template>
        <template v-if="['全部', '会场终端'].includes(currentChosenTab)">
          <li
            v-for="item in Array.from(deviceCheckNodeList.values()).filter((i) => i.type === 1)"
            :key="`device_${item.id}`"
            :class="$style.checkedItem"
          >
            <i :class="[$style.icon, $style.HuiChangZhongDuan]" />
            <span>{{ item.name }}（{{ item.meetingCode || item.code || '暂无号码' }}）</span>
            <i :class="['el-icon-error', $style.closeBtn]" @click="uncheckDevice(item.id)" />
          </li>
        </template>
        <template v-if="['全部', '集群'].includes(currentChosenTab)">
          <li
            v-for="item in Array.from(deviceCheckNodeList.values()).filter((i) => i.type === 2)"
            :key="`device_${item.id}`"
            :class="$style.checkedItem"
          >
            <i :class="[$style.icon, $style.JiQun]" />
            <span>{{ item.name }}（{{ item.meetingCode || item.code || '暂无号码' }}）</span>
            <i :class="['el-icon-error', $style.closeBtn]" @click="uncheckDevice(item.id)" />
          </li>
        </template>
        <template v-if="['全部', 'APP 终端'].includes(currentChosenTab)">
          <li
            v-for="item in Array.from(deviceCheckNodeList.values()).filter((i) => i.type === 4)"
            :key="`device_${item.id}`"
            :class="$style.checkedItem"
          >
            <i :class="[$style.icon, $style.APP]" />
            <span>{{ item.name }}（{{ item.meetingCode || item.code || '暂无号码' }}）</span>
            <i :class="['el-icon-error', $style.closeBtn]" @click="uncheckDevice(item.id)" />
          </li>
        </template>
        <template v-if="['全部', '其他'].includes(currentChosenTab)">
          <li
            v-for="(item, index) in otherNum"
            :key="`other_${item.id}`"
            :class="$style.checkedItem"
          >
            <i :class="[$style.icon, $style.QiTa]" />
            <span>{{ item.name }}</span>
            <i :class="['el-icon-error', $style.closeBtn]" @click="uncheckOther(index)" />
          </li>
        </template>
        <li
          v-if="deviceCheckList.length === 0 && checkList.length === 0"
          :class="$style.empty"
        >
          请从左侧勾选
        </li>
      </ul>
      <div style="text-align: right; padding-right: 10px;">
        <el-button
          class="sbs-button"
          type="text"
          @click="uncheckAll"
        >全部清空</el-button>
        <el-button
          class="sbs-button"
          type="text"
          @click="addNumber"
        >添加号码</el-button>
      </div>
      <div :class="$style.footer">
        <el-button
          class="sbs-button"
          type="primary"
          :loading="isCreating"
          :disabled="checkList.length === 0 && deviceCheckList.length === 0 && otherNum.length === 0"
          @click="startMeeting"
        >发起会议</el-button>
      </div>
      <!-- 拨号盘 -->
      <DialPopup
        ref="DialPopupRef"
        style="right: 10px; bottom: 95px;"
      />
    </section>
  </div>
</template>

<script>
import DialPopup from './DialPopup/DialPopup.vue';

export default {
  name: 'MeetingDispatch',
  components: {
    DialPopup,
  },
  inject: [
    'combined',
  ],
  data() {
    return {
      // 分组数据加载中
      isTreeLoading: false,
      // 详情列表加载中
      isGroupDetailLoading: false,
      // 0-通讯录，1-设备
      treeTabIndex: 0,
      // 树形搜索关键词
      treeSearchKeyword: '',
      // 树形分组列表
      treeList: [],
      // 分组详情
      groupDetail: [],
      // 设备分组详情
      deviceGroupDetail: [],
      // 当前页
      pageIndex: 1,
      // 总页数
      pageTotal: 1,
      // 勾选的 id 列表
      checkList: [],
      // 勾选的对象列表
      checkNodeList: new Map(),
      // 设备勾选的 id 列表
      deviceCheckList: [],
      // 设备勾选的对象列表
      deviceCheckNodeList: new Map(),
      // 是否全选
      isCheckAll: false,
      // 是否半全选
      isIndeterminate: false,
      // 已选列表的 tab
      currentChosenTab: '全部',
      chosenTabs: [
        { name: '全部', count: 0 },
        { name: '联系人', count: 0 },
        { name: '监控视频', count: 0 },
        { name: '会场终端', count: 0 },
        { name: '集群', count: 0 },
        { name: 'APP 终端', count: 0 },
        { name: '其他', count: 0 },
      ],
      // 正在创建会议，10秒后会超时
      isCreating: false,
      otherNum: [],
    };
  },
  watch: {
    checkList: {
      deep: true,
      handler() {
        this.refreshTab();
      },
    },
    deviceCheckList: {
      deep: true,
      handler() {
        this.refreshTab();
      },
    },
    otherNum: {
      deep: true,
      handler() {
        this.refreshTab();
      },
    }
  },
  mounted() {
    // 因为涉及树形组件操作，需要在 mounted 后执行
    this.getTreeList(true);
  },
  methods: {
    /**
     * 刷新 tab 统计
     */
    refreshTab() {
      const deviceList = Array.from(this.deviceCheckNodeList.values());
      this.chosenTabs = [
        { name: '全部', count: this.checkNodeList.size + deviceList.length + this.otherNum.length },
        { name: '联系人', count: this.checkNodeList.size },
        { name: '视频监控', count: deviceList.reduce((prev, cur) => prev + (cur.type === 0 ? 1 : 0), 0) },
        { name: '会场终端', count: deviceList.reduce((prev, cur) => prev + (cur.type === 1 ? 1 : 0), 0) },
        { name: '集群', count: deviceList.reduce((prev, cur) => prev + (cur.type === 2 ? 1 : 0), 0) },
        { name: 'APP 终端', count: deviceList.reduce((prev, cur) => prev + (cur.type === 4 ? 1 : 0), 0) },
        { name: '其他', count: this.otherNum.length },
      ];
    },
    /**
     * 重置分页状态
     */
    resetPageState() {
      this.pageIndex = 1;
      this.pageTotal = 1;
      this.groupDetail = [];
    },
    /**
     * 切换分组
     * @param {Number} treeTabIndex 分组下标
     */
    handleTreeTabSwitch(treeTabIndex) {
      this.treeTabIndex = treeTabIndex;
      this.treeSearchKeyword = '';
      this.getTreeList(true);
      this.refreshCheckStatus();
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.getTreeList(false);
      this.getGroupDetail(undefined, this.treeSearchKeyword);
    },
    /**
     * 获取树形分组数据
     */
    getTreeList(isInit) {
      this.resetPageState();
      switch (this.treeTabIndex) {
        // 联系人
        case 0: {
          this.$refs.tree.setCurrentKey(null);
          this.getContactGroup(isInit);
          break;
        }
        // 设备
        case 1: {
          // 设备数据量大，采用懒加载，因此不在切换 tab 的时候刷新数据
          break;
        }
        default:
      }
    },
    /**
     * 获取通讯录分组
     * @param {boolean} isInit 初始化，获取第一个分组的数据
     */
    getContactGroup(isInit) {
      this.isTreeLoading = true;
      const request = {
        method: 'GET',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/mail/mailgroup/list',
        params: {
          search: this.treeSearchKeyword,
        },
      };
      this.$http(request).then((response) => {
        if (response.data.code === 0) {
          const treeList = response.data.data || [];
          for (let i = 0; i < treeList.length; i += 1) {
            treeList[i].memberType = 1;
          }
          this.treeList = treeList;
          if (isInit && this.treeList.length) {
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.treeList[0].id);
            });
            this.getGroupDetail(this.treeList[0]);
          }
        } else {
          this.$message.error(`获取通讯录分组失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取通讯录分组失败，错误信息：${error}`);
      }).finally(() => {
        this.isTreeLoading = false;
      });
    },
    /**
     * 获取设备分组
     */
    getDevice(deviceType, groupId, searchKeyword) {
      return new Promise((resolve) => {
        const request = {
          method: 'GET',
          baseURL: window.SITE_CONFIG.cloudUrl,
          url: '/device/device/appdevicegroup/tree',
          params: {
            key: searchKeyword,
            groupId,
            deviceType,
          },
        };
        this.$http(request).then((response) => {
          if (response.data.code !== 0) {
            this.$message.error(`获取设备数据失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
          }
          resolve(response.data.data);
        });
      });
    },
    /**
     * 获取分组详情
     * @param {Object} node 树节点数据
     * @param {string} searchKeyword 搜索关键词
     */
    async getGroupDetail(node, searchKeyword) {
      switch (this.treeTabIndex) {
        case 0: {
          this.getContactList(node ? [node.id] : undefined, searchKeyword);
          break;
        }
        case 1: {
          if (searchKeyword) {
            this.$refs.deviceTree.setCurrentKey(null);
            this.isGroupDetailLoading = true;
            const searchResult = await Promise.all([
              this.getDevice(0, undefined, searchKeyword),
              this.getDevice(1, undefined, searchKeyword),
              this.getDevice(2, undefined, searchKeyword),
              this.getDevice(3, undefined, searchKeyword),
            ]);
            this.deviceGroupDetail = searchResult.map(({ devices }) => devices).flat(1);
            this.refreshCheckStatus();
            this.isGroupDetailLoading = false;
          }
          break;
        }
        default:
      }
    },
    /**
     * 获取通讯录分组详情
     * @param {number[]} groupId 分组 id 集合
     * @param {string} searchKeyword 搜索关键词
     */
    getContactList(groupId = [], searchKeyword = '') {
      this.isGroupDetailLoading = true;
      const request = {
        method: 'POST',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/mail/mailcontactor/list',
        data: {
          limit: 10,
          page: this.pageIndex,
          groupId,
          search: searchKeyword,
        },
      };
      this.$http(request).then(({ data: response }) => {
        if (response.code === 0) {
          this.pageTotal = response.data.totalPage;
          const list = response.data.list || [];
          for (let i = 0; i < list.length; i += 1) {
            list[i].type = '';
          }
          this.groupDetail = list;
          this.refreshCheckStatus();
        } else {
          this.$message.error(`获取通讯录分组详情失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取通讯录分组详情失败，错误信息：${error}`);
      }).finally(() => {
        this.isGroupDetailLoading = false;
      });
    },
    /**
     * 换页
     */
    handlePageChange() {
      this.getGroupDetail(this.$refs.tree.getCurrentNode(), this.treeSearchKeyword);
    },
    /**
     * 勾选、取消勾选当前项
     * @param {boolean} isChecked 是否勾选
     * @param {object} item 列表项
     */
    handleCheck(isChecked, item) {
      const list = this.treeTabIndex === 0 ? this.checkNodeList : this.deviceCheckNodeList;
      if (isChecked) {
        list.set(item.id, item);
      } else {
        list.delete(item.id);
      }
      this.refreshCheckStatus();
    },
    /**
     * 全选、反全选当前页
     * @param {boolean} isChecked 是否全选
     */
    handleCheckAll(isChecked) {
      if (this.treeTabIndex === 0) {
        this.groupDetail.forEach((item) => {
          if (isChecked) {
            this.checkNodeList.set(item.id, item);
          } else {
            this.checkNodeList.delete(item.id);
          }
        });
        this.checkList = [...this.checkNodeList.keys()];
      } else if (this.treeTabIndex === 1) {
        this.deviceGroupDetail.forEach((item) => {
          if (isChecked) {
            this.deviceCheckNodeList.set(item.id, item);
          } else {
            this.deviceCheckNodeList.delete(item.id);
          }
        });
        this.deviceCheckList = [...this.deviceCheckNodeList.keys()];
      }
      this.refreshCheckStatus();
    },
    /**
     * 刷新全选、半选状态
     */
    refreshCheckStatus() {
      let groupDetail;
      let checkNodeList;
      if (this.treeTabIndex === 0) {
        groupDetail = this.groupDetail;
        checkNodeList = this.checkNodeList;
      } else {
        groupDetail = this.deviceGroupDetail;
        checkNodeList = this.deviceCheckNodeList;
      }
      this.$nextTick(() => {
        if (groupDetail.length) {
          let hasCheck = false;
          let hasUncheck = false;
          for (const item of groupDetail) {
            if (checkNodeList.has(item.id)) {
              hasCheck = true
            } else {
              hasUncheck = true
            }
          }
          if (hasCheck && hasUncheck) {
            this.isCheckAll = false;
            this.isIndeterminate = true;
          } else if (!hasUncheck && hasCheck) {
            this.isCheckAll = true;
            this.isIndeterminate = false;
          } else {
            this.isCheckAll = false;
            this.isIndeterminate = false;
          }
        } else {
          this.isCheckAll = false;
          this.isIndeterminate = false;
        }
      });
    },
    /**
     * 懒加载设备分组
     */
    handleLazyLoad(node, resolve) {
      // 初始化设备分组列表
      if (node.level === 0) {
        resolve([
          {
            id: -111,
            groupId: 0,
            deviceType: 0,
            name: '视频监控',
            children: [],
          },
          {
            id: -222,
            groupId: 0,
            deviceType: 1,
            name: '会场终端',
            children: [],
          },
          {
            id: -333,
            groupId: 0,
            deviceType: 2,
            name: '集群',
            children: [],
          },
          {
            id: -444,
            groupId: 0,
            deviceType: 4,
            name: 'APP 终端',
            children: [],
          },
        ]);
        return;
      }

      // 后续懒加载
      const { data } = node;
      this.getDevice(
        data.deviceType,
        data.groupId,
      ).then((res) => {
        data.devices = res.devices;
        // 数据预处理，为每个分组设置设备类型和分组id，对齐懒加载时接口的参数
        for (let i = 0; i < res.groups.length; i += 1) {
          res.groups[i].deviceType = data.deviceType;
          res.groups[i].groupId = res.groups[i].id;
        }
        resolve(res.groups);
        this.refreshCheckStatus();
      });
    },
    /**
     * 点击设备分组，懒加载结束后设置右边设备列表
     * @param {object} node 分组节点数据
     */
    handleDeviceGroupClick(node) {
      // 该分组是第一次点击，需要等待懒加载数据结束后设置
      if (!node.devices) {
        this.isGroupDetailLoading = true;
        const timer = setInterval(() => {
          if (node.devices) {
            this.deviceGroupDetail = node.devices;
            this.isGroupDetailLoading = false;
            clearInterval(timer);
          }
        }, 100);
      } else {
        // 已经加载过，直接设置
        this.deviceGroupDetail = node.devices;
      }
    },
    /**
     * 取消勾选单个联系人
     * @param {number} id 联系人 id
     */
    uncheckContact(id) {
      this.checkNodeList.delete(id);
      this.checkList.splice(this.checkList.indexOf(id), 1);
      this.refreshCheckStatus();
    },
    /**
     * 取消勾选单个设备
     * @param {number} id 设备 id
     */
    uncheckDevice(id) {
      this.deviceCheckNodeList.delete(id);
      this.deviceCheckList.splice(this.deviceCheckList.indexOf(id), 1);
      this.refreshCheckStatus();
    },
    /**
     * 清除所有勾选
     */
    uncheckAll() {
      this.checkNodeList.clear();
      this.checkList = [];
      this.deviceCheckNodeList.clear();
      this.deviceCheckList = [];
      this.refreshCheckStatus();
      this.otherNum = [];
    },
    calcValidMeetingApproach(contact) {
      const ans = [];
      if (contact.mobile) {
        ans.push({ name: '手机号码', label: 'mobile', value: `mobile::${contact.mobile}` });
      }
      if (contact.mobile1) {
        ans.push({ name: '手机号码1', label: 'mobile1', value: `mobile1::${contact.mobile1}` });
      }
      if (contact.mobile2) {
        ans.push({ name: '手机号码2', label: 'mobile2', value: `mobile2::${contact.mobile2}` });
      }
      if (contact.otherTel) {
        ans.push({ name: '其他电话', label: 'otherTel', value: `otherTel::${contact.otherTel}` });
      }
      if (contact.officeTel) {
        ans.push({ name: '办公室电话', label: 'officeTel', value: `officeTel::${contact.officeTel}` });
      }
      if (contact.homeTel) {
        ans.push({ name: '家庭电话', label: 'homeTel', value: `homeTel::${contact.homeTel}` });
      }
      if (contact.resources && contact.resources.length) {
        contact.resources
        // 只取设备，type 大于等于 9
          .filter((device) => device.type >= 9)
          .forEach((device) => {
            device.data.forEach((item) => {
              ans.push({
                label: device.name,
                name: `${device.name}-${item.entity.name}`,
                value: `${device.type}::${item.entity.name}::${item.entity.code}::${item.entity.id}`,
              });
            });
          });
      }
      if (ans.length && !contact.type) {
        this.$set(contact, 'type', ans[0].value);
      }
      return ans;
    },
    /**
     * 启动会议
     */
    startMeeting() {
      const memberList = [];
      /* eslint-disable no-restricted-syntax */
      for (const contact of this.checkNodeList.values()) {
        if (contact.type) {
          const key = contact.type.split('::');
          if (key.length === 2) {
            // 普通电话
            memberList.push({
              Id: contact.id,
              Name: contact.name,
              Number: key[1],
              Type: 1,
            });
          } else {
            // 设备
            memberList.push({
              Id: key[3],
              Name: key[2],
              Number: key[1],
              Type: key[0] == 0 ? 9 : key[0] == 2 ? 4 : 8,
            });
          }
        } else {
          this.$message.error(`联系人${contact.name}没有可供入会的方式`);
        }
      }
      for (const device of this.deviceCheckNodeList.values()) {
        memberList.push({
          Id: device.id,
          Name: device.name,
          Number: device.meetingCode || device.code,
          Type: device.type == 0 ? 9 : device.type === 2 ? 4 : 8,
        });
      }
      for (const other of this.otherNum) {
        memberList.push({
          Id: other.name,
          Name: other.name,
          Number: other.name,
          Type: 1,
        });
      }
      const refresh = (message) => {
        if (message && message.cmd && message.cmd.SubCmd == 103) {
          this.$message.success('创建会议成功');
          this.uncheckAll();
          this.combined.uds.removeUDSListener(refresh);
          this.isCreating = false;
        }
      };
      this.combined.uds.addUDSListener(refresh);
      setTimeout(() => {
        if (this.isCreating) {
          this.$message.error('创建会议超时，请重试');
          this.combined.uds.removeUDSListener(refresh);
          this.isCreating = false;
        }
      }, 10 * 1000);
      this.isCreating = true;
      this.combined.uds.createMeeting(`${this.$cookie.get('userName')}发起的会议`, memberList, 0);
    },
    /**
     * 修改联系人入会方式
     */
    changeJoinType(type, contact) {
      this.$nextTick(() => {
        this.checkNodeList.set(contact.id, { ...contact, type });
        this.$forceUpdate();
      });
    },
    /**
     * 删除其他号码
     * @param {number} index 所在数组下标
     */
    uncheckOther(index) {
      this.otherNum.splice(index, 1);
    },
    /**
     * 添加号码
     */
    addNumber() {
      this.$refs.DialPopupRef.open().then((newNum) => {
        const request = {
          method: 'POST',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/message/messageinfor/getContactorByPhone',
          data: {
            phone: newNum,
          },
        };
        this.$http(request).then((response) => {
          if (
            response.data.code === 0
            && response.data.data
            && response.data.data.length
            && response.data.data[0].id > 0
          ) {
            const newContact = response.data.data[0];
            newContact.type = '';
            this.checkList.push(newContact.id);
            this.checkNodeList.value.set(newContact.id, newContact);
          } else {
            const newContact = {
              memberType: 4,
              memberCode: newNum,
              name: newNum,
              joinType: 1,
              id: newNum,
            };
            this.otherNum.push(newContact);
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" module src="./MeetingDispatch.scss" />
