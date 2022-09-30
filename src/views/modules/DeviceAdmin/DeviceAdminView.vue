<template>
  <div :class="$style.DeviceAdmin">
    <div :class="$style.DeviceAdminView">
      <sv-template
        ref="template"
        :tree-setting="treeSetting"
        :use-plat-form-all="true"
        :title="tabType"
        :date-select="false"
        :overload="{ getTableList, getTree }"
        :search-setting="{
          width: '280px',
          placeholder: '请输入设备名称/号码',
        }"
        :table-request="tableRequest"
        @tree-click="handleTreeClick"
      >
        <template #grade__dropDown>
          <grade-dropDown
            :plat-show="true"
            :merge-node="true"
            @operationChange="operationChange"
          />
        </template>
        <template #middle__operation__button>
          <sv-button
            type="primary"
            @click="handleLabel"
          >
            批量设置标签
          </sv-button>
          <sv-button
            type="primary"
            @click="batchSubsribe('show')"
          >
            批量订阅
          </sv-button>
          <sv-button
            type="primary"
            v-show="isPlatformRoot"
            @click="addOrModifyHandle('add', {})"
          >
            新增终端
          </sv-button>
          <sv-button
            v-if="type !== '4'"
            type="primary"
            :style="{
              pointerEvents: syncingTips && 'none',
              filter: syncingTips && 'grayscale(1)',
            }"
            @click="handleSyncDevice"
          >
            同步终端
          </sv-button>
        </template>
        <template #middle__table>
          <el-table-column
            header-align="center"
            align="center"
            label="标签"
          >
            <template slot-scope="scope">
              <div :class="$style.outsideDiv">
                <div
                  :class="[
                    $style.labelStyle,
                    {[$style.dropDownStyle]:scope.row.dropDown},
                    {[$style.multiLabelStyle]:scope.row.dropDown}
                  ]"
                >
                  <span
                    v-for="item in partialLabels(scope.row.dropDown,scope.row.labels)"
                    :key="item.id"
                    :style="{'border-color':item.labelStyle}"
                    style="width:43%;border:1px dashed #DCDFEA;border-radius: 5px;margin:5px;"
                  >
                    <span :style="{color:item.labelStyle}">{{ item.name }}</span>
                  </span>
                </div>
                <i
                  :class="[
                    'el-icon-caret-bottom',
                    {[$style.caretStyle]:scope.row.dropDown}
                  ]"
                  v-if="scope.row.labels&&scope.row.labels.length>2"
                  @click="dropDownHandle(scope.$index)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="设备名称"
          >
            <template slot-scope="scope">
              <sv-table-tooltip :content="scope.row.name" />
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="设备编号"
          >
            <template slot-scope="scope">
              {{ scope.row.code }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="调用编号"
          >
            <template slot-scope="scope">
              {{ scope.row.number }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="type !== '4'"
            header-align="center"
            align="center"
            label="关联对象数"
          >
            <template slot-scope="scope">
              {{ scope.row.countObject }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="type !== '4'"
            header-align="center"
            align="center"
            label="轨迹订阅"
          >
            <template slot-scope="scope">
              {{ scope.row.subscription === 1 ? '启用' : '关闭' }}
            </template>
          </el-table-column>

          <!-- 软终端新增的 -->
          <el-table-column
            v-if="type === '4'"
            header-align="center"
            align="center"
            label="设备关联对象"
          >
            <template slot-scope="scope">
              {{
                ((resources) => {
                  if (resources && resources.length) {
                    const [resource] = resources;
                    if (resource.type === 1) {
                      const { data } = resource;
                      if (data && data.length && data[0].entity) {
                        return `${data[0].entity.name}(${data[0].entity.mobile1})`;
                      }
                    }
                  }
                  return '';
                })(scope.row.resources)
              }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="来源单位"
          >
            <template slot-scope="scope">
              {{ scope.row.platformName }}
            </template>
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="操作"
            width="170px"
          >
            <template slot-scope="scope">
              <sv-table-operation
                :display="isPlatformRoot ? ['view', 'edit', 'delete'] : ['view']"
                @view="seeHandle(scope.row.id)"
                @edit="addOrModifyHandle('modify', scope.row)"
                @delete="
                  deleteIds = [scope.row.id];
                  $refs.delete_hint.visible = true;
                "
              />
            </template>
          </el-table-column>
        </template>
      </sv-template>
      <AddDevice
        :deviceType="type"
        ref="AddDeviceEl"
        @refreshDataList="getTableList"
      />
    </div>
    <div>
      <sv-dialog-hint
        ref="delete_hint"
        type="delete"
        @confirm="batchDelete(deleteIds)"
      />
    </div>
    <div>
      <sv-dialog
        ref="normal_hint"
        type="normal"
        @confirm="batchSubsribe('submit')"
        @cancel="batchSubsribe('cancel')"
      >
        <div :class="$style.batchComfiem">
          <div>已选设备：{{ checkedList.length }}</div>
          <div>是否对已选设备启用轨迹订阅？</div>
        </div>
      </sv-dialog>
    </div>
    <div>
      <DeviceSee
        :deviceType="type"
        ref="deviceSee"
      />
    </div>
    <div>
      <SetLabel
        v-if="setLabelVisible"
        ref="setLabel"
        labelTitle="批量设置标签"
        @submitData="submitData"
        @parentVisible="setLabelVisible=false"
        @refreshDataList="getTableList"
      />
    </div>
  </div>
</template>

<script>
// 添加设备
import AddDevice from './AddDevice.vue';
import DeviceSee from './DeviceSee.vue';
import SetLabel from './SetLabel.vue';
import GradeDropDown from '@/views/common/GradeDropDown.vue';

export default {
  components: {
    AddDevice,
    DeviceSee,
    SetLabel,
    GradeDropDown,
  },
  props: {
    title: {
      type: String,
      default: '监控视频管理',
    },
    type: {
      type: String,
      default: '0',
    },
    uds: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tabType: '',
      isPlatformRoot: true, // 是否是本平台
      treeSetting: {
        tab: [], // 最上方可切换标签的列表，不需要则传空数组
        api: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/tree/all`, // 后台接口列表
        searchAdd: true, // 是否显示搜索框旁的加号
        // edit: ['add', 'edit', 'delete'],
        otherTreeParams: {
          type: this.type,
        },
        edit: {
          add: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/save`,
          update: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/update`,
          delete: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/deleted`,
        }, // 是否显示操作按钮，可以是一个对象（add, update, delete对应三种操作的url）
        delete: true, // 是否显示删除按钮
        params: {
          deviceType: this.type,
          pid: '',
          type: this.type,
        },
      },
      // 表格数据接口
      tableRequest: {
        api: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevice/page`,
        params: {
          groupIds: [],
          flag: false,
        },
      },
      titleObj: {
        监控视频管理: '0',
        会场终端管理: '1',
        集群终端管理: '2',
        // WeComm管理: '3',
        会议软终端管理: '4',
      },
      checkedList: [],
      visible: false,
      showChecked: false,
      // 同步中提示
      syncingTips: null,
      setLabelVisible:false,
    };
  },
  watch: {
    title(newVal) {
      this.tabType = newVal;
      this.getTableList();
    },
  },
  computed: {
    partialLabels(type,labels){
      return function (type,labels) {
        let partialLabels = []
        if (labels&&labels.length>0) {
          if (type) {
            partialLabels = labels
          }else{
            partialLabels = labels.slice(0,2)
          }
          return partialLabels
        }else{
          return []
        }
      }
    }
  },
  methods: {
    /**
     * 选择平台
     */
    operationChange(isPlatformRoot, platformId) {
      // 换平台的时候清空搜索字
      const that = this.$refs.template;
      that.treeKeyWord = '';
      that.keyword = '';
      // 换平台的时候分页重置
      that.paginationConfig.currentIndex = 1;
      that.paginationConfig.totalCount = 0;
      that.paginationConfig.pageSize = 10;
      // 本平台的一些按钮显隐
      if (isPlatformRoot) {
        this.treeSetting.edit = {
          add: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/save`,
          update: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/update`,
          delete: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/deleted`,
        };
        this.treeSetting.isPlatformRoot = true;
      } else {
        this.treeSetting.edit = false;
        this.treeSetting.isPlatformRoot = false;
      }
      this.isPlatformRoot = isPlatformRoot
      this.$refs.template.PlatName = false;
      // 如果点击的是全部
      if (platformId === -1) {
        this.$refs.template.PlatName = true;
        this.tableRequest.params.platformId = null;
        this.tableRequest.params.flag = true;
        this.tableRequest.params.groupId = [];
        this.tableRequest.params.groupIds = [];
        this.treeSetting.api = `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/tree/all`;
        this.getTree();
      } else {
        this.tableRequest.params.flag = false;
        // this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId
        this.tableRequest.params.platformId = platformId;
        this.tableRequest.params.groupId = [];
        this.tableRequest.params.groupIds = [];
        this.treeSetting.api = `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/tree/all?platformId=${platformId}`;
        new Promise((resolve, reject) => {
          this.getGroupTree();
          resolve();
        }).then(() => {
          // this.$refs.template.getTableList(this.tableRequest)
        });
      }
    },
    /**
     * @description: 获得左侧平台的树结构
     */
    async getTree() {
      const that = this.$refs.template;
      if (that) {
        if (this.tableRequest.params.platformId < 2) {
          that.tableLoading = true;
          const req = {
            method: 'get',
            url: this.treeSetting.api,
            baseURL: window.SITE_CONFIG.baseUrl,
            params: {
              name: that.treeKeyWord,
              flag: this.tableRequest.params.flag,
              type: this.type,
            },
          };
          try {
            const response = await this.$http(req);
            if (response.data.code === 0) {
              const findChilden = (obj) => {
                if (obj.platformName !== null && obj.platformName !== undefined) {
                  obj.name = obj.platformName;
                }
                const { children } = obj;
                if (children) {
                  children.forEach((item) => {
                    findChilden(item);
                  });
                }
              }
              [response.data.data].forEach((obj) => {
                findChilden(obj);
              });
              that.treeList = [
                {
                  id: 0,
                  name: '全部',
                  platformName: '全部',
                  platformTitle: '全部',
                  children: null,
                },
                response.data.data,
              ];
              this.$refs.template.getTreeAllValue();
              this.$refs.template.getTableList(this.tableRequest);
            } else {
              throw Error(`代码${response.data.code}，${response.data.msg}`);
            }
          } catch (error) {
            this.$message.error(`获取平台树失败！${error}`);
          } finally {
            that.tableLoading = false;
          }
        } else this.getGroupTree();
      }
    },
    /**
     * @description: 获得左侧平台的树结构
     */
    async getGroupTree() {
      const that = this.$refs.template;
      if (that) {
        that.tableLoading = true;
        const req = {
          method: 'get',
          url: this.treeSetting.api,
          baseURL: window.SITE_CONFIG.baseUrl,
          params: {
            name: that.treeKeyWord,
            type: this.type,
            flag: this.tableRequest.params.flag,
          },
        };
        try {
          const response = await this.$http(req);
          if (response.data.code === 0) {
            that.treeList = [
              {
                id: 0,
                name: '全部',
                children: null,
              },
              ...response.data.data,
            ];
            this.$refs.template.getTreeAllValue();
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            throw Error(`代码${response.data.code}，${response.data.msg}`);
          }
        } catch (error) {
          this.$message.error(`获取组树失败！${error}`);
        } finally {
          that.tableLoading = false;
        }
      }
    },
    /**
     * 批量订阅
     */
    batchSubsribe(type) {
      console.log(this.$refs.template.tableCheck);
      this.checkedList = this.$refs.template.getTableChecked() || [];
      // 展示选择框
      if (type === 'show') {
        this.$refs.template.tableCheck = true;
        if (this.checkedList.length === 0) {
          this.$message.info('请勾选表格设备，然后再次点击');
        } else {
          this.$refs.normal_hint.visible = true;
        }
        this.showChecked = this.$refs.template.tableCheck;
      }
      // 提交订阅
      if (type === 'submit') {
        if (this.showChecked) {
          // const checkedList = this.$refs.template.getTableChecked() || [];
          if (this.checkedList.length) {
            const request = {
              method: 'POST',
              baseURL: window.SITE_CONFIG.cloudUrl,
              url: '/device/device/appdevice/updateBatch',
              data: this.checkedList.map((device) => ({
                id: device.id,
                subscription: 1,
              })),
            };
            this.$http(request).then((response) => {
              if (response.data.code === 0 || response.data.errorcode === 0) {
                this.$refs.template.tableCheck = false;
                this.getTableList();
                // this.visible = false;
                this.$refs.normal_hint.visible = false;
              } else {
                this.$message.error(`批量订阅失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
              }
            });
          } else {
            this.$message.error('请先勾选表格设备');
          }
        } else {
          this.$refs.template.tableCheck = true;
          this.$message.info('请勾选表格设备，然后再次点击');
        }
      }
      // 取消订阅
      if (type === 'cancel') {
        this.$refs.normal_hint.visible = false;
      }
    },
    /**
     * @description 同步终端
     */
    handleSyncDevice() {
      if (this.syncingTips) {
        this.syncingTips.close();
      }
      this.syncingTips = this.$message.info({
        message: '正在同步中，请等待',
        duration: 0,
        showClose: true,
        onClose: () => {
          this.syncingTips = null;
        },
      });
      let deviceType;
      switch (this.type) {
        case '0':
          // 监控
          deviceType = 0;
          break;
        case '1':
          // 会场终端
          deviceType = 8;
          break;
        case '2':
          // 集群终端
          deviceType = 2;
          break;
        default:
          throw Error('错误的设备类型');
      }
      this.uds.syncDevice(deviceType).then(() => {
        this.syncingTips.close();
        this.syncingTips = null;
        this.$message.success('同步成功');
        this.$refs.template.getTree();
        this.$refs.template.getTableList();
      });
    },
    /**
         * @method
         * @desc 点击树形，获取表格数据
         */
    handleTreeClick(obj, tabIndex) {
      this.currentNode = obj;
      console.log(obj)
      if (obj.platformName) { // 如果是平台
        // 换平台的时候清空搜索字
        const that = this.$refs.template;
        // that.treeKeyWord = '';
        that.keyword = '';
        // 换平台的时候分页重置
        that.paginationConfig.currentIndex = 1;
        that.paginationConfig.totalCount = 0;
        that.paginationConfig.pageSize = 10;
        // 相当于点击了组的全部
        // this.tableRequest.params.groupIds && delete this.tableRequest.params.groupIds;
        this.tableRequest.params.platformId = obj.id;
        // this.tableRequest.params.groupId = [];
        this.tableRequest.params.groupIds = [];
        if (obj.id === 0) {
          this.tableRequest.params.platformId = '';
          this.tableRequest.params.flag = true;
        } else {
          this.tableRequest.params.flag = false;
        }
        this.$refs.template.getTableList(this.tableRequest);
        return;
      } // 如果点击分组的全部
      if (obj.id === 0) {
        this.tableRequest.params.groupIds = null;
        this.tableRequest.params.flag = false;
        this.$refs.template.getTableList(this.tableRequest);
        return;
      }
      this.tableRequest.params.groupIds = obj ? [obj.id] : [];
      this.getTableList();
    },
    /**
         * @method
         * @desc 获取表格数据
         */
    getTableList(tableRequest, vm) {
      const that = vm === undefined ? this.$refs.template : vm;
      const table = tableRequest === undefined ? this.tableRequest : tableRequest;
      // this.$refs.template.getTableList(this.tableReques, this);
      that.tableLoading = true;
      const data = {
        search: that.keyword,
        page: that.paginationConfig.currentIndex,
        size: that.paginationConfig.pageSize,
        type: this.titleObj[this.title],
        ...table.params,
      };
      if (this.type === '4') {
        data.selectRelated = 1;
      } else {
        data.countObject = 1;
      }
      const request = {
        method: 'post',
        url: that.tableRequest.api,
        baseURL: that.tableRequest.api.startsWith('http') ? undefined : window.SITE_CONFIG.baseUrl,
        data,
      };
      this.$http(request).then((response) => {
        if (response.data.code === 0) {
          // 表格内容
          response.data.data.list.forEach((v) => {
            v.dropDown = false;
          });
          that.tableList = response.data.data.list;
          that.paginationConfig.totalCount = response.data.data.totalCount;
        }
        that.tableLoading = false;
      });
    },
    // 删除终端
    batchDelete(id) {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevice/delete`,
        method: 'post',
        data: id,
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getTableList();
            },
          });
        } else {
          this.$message.error('删除失败');
        }
      });
    },
    addOrModifyHandle(type, row) {
      const flag = this.type;
      this.$refs.AddDeviceEl.init(type, row, flag);
    },
    seeHandle(id) {
      this.$refs.deviceSee.init(id);
    },
    handleLabel() {
      this.$refs.template.tableCheck = true;
      this.checkedList = this.$refs.template.getTableChecked() || [];
      if (this.checkedList.length === 0) {
        this.$message.info('请勾选表格设备，然后再次点击');
      } else {
        this.setLabelVisible = true;
        this.$nextTick(() => {
          this.$refs.setLabel.init();
        });
      }
    },
    submitData(savedata) {
      const labelIds = savedata.map((v) => v.id);
      const deviceIds = this.checkedList.map((v) => v.id);
      const request = {
        method: 'post',
        url: '/device/device/applabeldevice/saveAll',
        baseURL: window.SITE_CONFIG.cloudUrl,
        data: {
          deviceIds,
          labelIds,
          isDelete: false,
        },
      };
      this.$http(request)
        .then(({ data }) => {
          if (data.code === 0) {
            this.getTableList();
          } else {
            this.$message.error(`错误代码：${data.code}`);
          }
          this.$emit('refreshDataList');
        });
    },
    dropDownHandle(idx) {
      this.$refs.template.tableList.forEach((v, index) => {
        v.dropDown = idx === index ? !v.dropDown : false;
      });
    },
  },
};

</script>

<style lang="scss" module>
.DeviceAdmin {
  height: 100%;
  .DeviceAdminView{
    width:100%;
    height:100%;
    &>div{
      height: 100%;
    }
    .outsideDiv{
      display:flex;
      align-content: baseline;
    }
    .multiLabelStyle{
      position: absolute;
      top: 15px;
      left: 0;
      z-index: 1;
      background-color: white;
      box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    }
  }
  .batchComfiem {
    width: 425px;
    height: 110px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    div {
      margin: 15px 0;
    }
  }
}
.dropDownStyle{
  border:1px solid #DCDFEA;
  max-height:200px;
  overflow:auto;
}
.labelStyle{
  width:90%;
  flex-wrap:wrap;
  display:flex;
  align-content: baseline;
}
.caretStyle{
  position: absolute;
  top: 15px;
  right: 0;
}
</style>
