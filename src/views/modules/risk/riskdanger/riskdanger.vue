<template>
  <!-- 风险隐患 -->
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <div style="margin-top: -11px;">
          <grade-dropDown
            :plat-show="true"
            :merge-node="true"
            @operationChange="operationChange"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.name"
          style="width: 200px"
          placeholder="输入隐患名称搜索"
          clearable
          size="small"
          @change="pageIndex = 1;getDataList()"
        >
          <i
            slot="suffix"
            class="sv-input-search__icon"
            @click="pageIndex = 1;getDataList()"
          />
        </el-input>
        <!-- <el-select
          v-model="dataForm.dangerTypeId"
          placeholder="请选择隐患类型筛选"
          clearable
          size="small"
        >
          <el-option
            v-for="item in typeData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select> -->
        <el-cascader
          ref="caseClassId"
          v-model.trim="dataForm.dangerTypeId"
          :options="typeData"
          :props="{
            value: 'id',
            label: 'name',
            children: 'children',
            checkStrictly: true,
          }"
          clearable
          :show-all-levels="false"
          placeholder="请选择隐患类型筛选"
        />
        <!-- <el-select v-model="dataForm.rectificationType" placeholder="请选择整顿情况筛选" clearable>
          <el-option v-for="item in rectificationData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>-->
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isAuth('risk:riskdanger:save') && isPlatformRoot"
          style="background: #409eff; color: #fff; margin-left: initial"
          type="primary"
          size="small"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
        <el-button
          style="background: #409eff; color: #fff; margin-left: initial"
          type="primary"
          size="small"
          @click="pageIndex = 1;getDataList()"
        >
          查询
        </el-button>
        <!-- 导入 -->
        <el-upload
          ref="importData"
          style="display: inline-block"
          action
          :http-request="uploadSectionFile"
          :show-file-list="false"
        >
          <el-button
            v-show="isPlatformRoot"
            style="background: #409eff; color: #fff; margin-left: initial"
            type="primary"
            size="small"
          >
            导入风险隐患数据
          </el-button>
        </el-upload>
        <!-- 导出 -->
        <el-button
          style="background: #409eff; color: #fff; margin-left: initial"
          type="primary"
          size="small"
          @click="exportExcel()"
        >
          导出模板
        </el-button>
        <el-button
          style="background: #409eff; color: #fff; margin-left: initial"
          type="primary"
          size="small"
          @click="planpdf()"
        >
          导出数据
        </el-button>
        <el-button
          v-if="isAuth('risk:riskdanger:delete') && isPlatformRoot"
          style="background: #409eff; color: #fff; margin-left: initial"
          :disabled="dataListSelections.length <= 0"
          type="primary"
          size="small"
          @click="deleteHandle()"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="source"
        header-align="center"
        align="center"
        label="隐患源"
      />
      <el-table-column
        width="200"
        prop="address"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="隐患地址"
      />
      <el-table-column
        prop="controllability"
        header-align="center"
        align="center"
        label="可控程度"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.controllability == 1">
            可控
          </p>
          <p v-if="scope.row.controllability == 2">
            基本可控
          </p>
          <p v-if="scope.row.controllability == 3">
            较难控制
          </p>
          <p v-if="scope.row.controllability == 4">
            基本失控
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="typeName"
        header-align="center"
        align="center"
        label="隐患类型"
      />
      <el-table-column
        prop="contacts"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="联系人"
      >
        <!--<template slot-scope="scope">-->
        <!--<p>{{scope.row.contacts}}</p>-->
        <!--<p>{{scope.row.contactTelephone}}</p>-->
        <!--</template>-->
      </el-table-column>
      <!--<el-table-column prop="possibleImpact" header-align="center" align="center" :show-overflow-tooltip="true" label="可能造成的影响"></el-table-column>-->
      <!--<el-table-column prop="disposingCapacityOrResourceReserve" header-align="center" align="center" label="处理能力/资源储备"></el-table-column>-->
      <!--<el-table-column prop="rectificationMeasuresSituation" header-align="center" :show-overflow-tooltip="true" align="center" label="整改措施情况"></el-table-column>-->
      <!--<el-table-column prop="reasonsForNotCompleted" header-align="center" align="center" :show-overflow-tooltip="true" label="未完成的原因"></el-table-column>-->
      <!--<el-table-column prop="notificationObjectName" header-align="center" align="center" label="通知人"></el-table-column>-->
      <el-table-column
        prop="rectificationMeasuresSituation"
        :show-overflow-tooltip="true"
        header-align="center"
        align="center"
        label="整改措施"
      />
      <el-table-column
        prop="rectificationMeasuresSituation"
        :show-overflow-tooltip="true"
        header-align="center"
        align="center"
        label="整改情况"
      >
        <template slot-scope="scope">
          <span v-html="filterSpan(scope)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="deadlineForRectification"
        :formatter="formatDate"
        header-align="center"
        align="center"
        label="整改期限"
      />
      <el-table-column
        prop="platformName"
        header-align="center"
        align="center"
        label="数据来源"
      />
      <!--<el-table-column prop="rectificationTime" header-align="center" align="center" label="整改时间"></el-table-column>-->
      <el-table-column
        header-align="center"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <sv-table-operation
            :display="isPlatformRoot? [
              'view',
              'edit',
              'delete'
            ]: ['view']"
            @view="viewHandle(scope.row.id)"
            @edit="addOrUpdateHandle(scope.row.id)"
            @delete="deleteHandle(scope.row.id)"
          />
          <!-- <el-button
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
          >
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 查看详情弹窗 -->
    <RiskDangerSeeDialog ref="RiskDangerSeeDialog" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    />
    <Resource-importError
      ref="resourceImportError"
    />
    <importDataDialog
      ref="importDataDialogRef"
      :down-load-url="downLoadUrl"
      @reUpload="reUpload"
    />
  </div>
</template>

<script>
import axios from 'axios';
import importDataDialog from '@/views/modules/importDataDialog/importDataDialog.vue';
import AddOrUpdate from './riskdanger-add-or-update';
// 查看详情弹窗
import RiskDangerSeeDialog from './RiskDangerSeeDialog/RiskDangerSeeDialog.vue';
import ResourceImportError from '../../resource/equipmentImportError.vue';
import GradeDropDown from '../../../common/GradeDropDown.vue';

export default {
  components: {
    AddOrUpdate,
    RiskDangerSeeDialog,
    ResourceImportError,
    GradeDropDown,
    importDataDialog,
  },
  data() {
    return {
      downLoadUrl: 'ser/risk/riskdanger/xlsOutputError',
      regionOptions: [],
      flag: true, // 是否是点击全部
      isPlatformRoot: true,
      platformId: '',
      // 可控程度:可控、基本可控、较难控制、基本失控
      controllabilityData: [
        { value: '1', label: '可控' },
        { value: '2', label: '基本可控' },
        { value: '3', label: '较难控制' },
        { value: '4', label: '基本失控' },
      ],
      rectificationData: [
        { value: '1', label: '未整顿' },
        { value: '2', label: '已经整顿' },
        { value: '3', label: '过期未整顿' },
      ],
      // 隐患类型:卡口管理、人员管理、预警默认类型、巡检事件类型、专题报告、专项整治行动。
      typeData: [],
      dataForm: {
        name: '',
        dangerTypeId: '',
        rectificationType: '',
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      // 导入错误提示表头
      errorTableColumn: [
        {
          prop: 'id',
          label: '序号',
        },
        {
          prop: 'source',
          label: '隐患源',
        },
        {
          prop: 'deadlineForRectification',
          label: '整改期限（限期整顿时间）',
          width: 120,
        },
        {
          prop: 'rectificationTime',
          label: '整改时间',
          width: 120,
        },
        {
          prop: 'workUnit',
          label: '可控程度',
        },
        {
          prop: 'typeName',
          label: '隐患类型',
        },
        {
          prop: 'nowNumber',
          label: '隐患等级',
        },
        {
          prop: 'contacts',
          label: '联系人',
        },
        {
          prop: 'contactTelephone',
          label: '手机号',
        },
      ],
      // 导入错误底部提示信息s
      errorTips: [
        '1、不能在该Excel表中对防护目标进行删除或修改；',
        '2、Excel中红色字段为必填字段,黑色字段为选填字段，字段值里请不要填入特殊字符；',
        '3、联系人：联系人可以为空。如果输入联系人的名字以及电话号码,若通讯录中不存在该联系人将不会保存。',
      ],
      // 导入错误表格必填项
      errorRequired: ['隐患源', '隐患类型'],
    };
  },
  beforeMount() {
    this.handleEventType();
  },
  created() {
    // this.getDataList();
    this.getJurisdictionData();
  },

  methods: {
    // 导入数据
    reUpload() {
      this.$refs.importData.$children[0].$refs.input.click();
    },
    // 整改情况row
    filterSpan(scope) {
      const tagMap = {
        reform: '<font color="#000">待整改</font>',
        hasReform: '<font color="#76CC7F">已整改</font>',
        outTimeNoReform: '<font color="#EE8D99">超时未整改</font>',
        outTimeHasReform: '<font color="#F6A439">超时整改</font>',
      };

      const { rectificationTime, deadlineForRectification } = scope.row;
      const _rectificationTime = rectificationTime ? new Date(rectificationTime) : rectificationTime;
      const _deadlineForRectification = deadlineForRectification ? new Date(deadlineForRectification) : deadlineForRectification;
      const now = new Date().getTime();
      // 逻辑请看摹客https://app.mockplus.cn/app/MMTxo0f2TP/specs/9aJhWqt-wY/v1RflZEFHUEC
      if (!_rectificationTime) {
        if (!_deadlineForRectification) {
          return tagMap.reform;
        }
        if (now <= _deadlineForRectification) {
          return tagMap.reform;
        }
        return tagMap.outTimeNoReform;
      }
      if (!_deadlineForRectification) {
        if (_rectificationTime <= now) {
          return tagMap.hasReform;
        }
      } else {
        if (_rectificationTime > _deadlineForRectification) {
          return tagMap.outTimeHasReform;
        }
        return tagMap.hasReform;
      }
      return '-';
    },

    // 是否选择的是本平台
    operationChange(isPlatformRoot, platformId) {
      // 换平台的时候清空搜索字
      this.dataListSelections = [];
      this.pageIndex = 1;
      this.pageSize = 10;
      this.totalPage = 0;
      this.dataForm.name = '';
      this.dataForm.dangerTypeId = [];
      this.dataForm.rectificationType = '';
      // 本平台的一些按钮显隐
      this.isPlatformRoot = isPlatformRoot;
      this.platformId = platformId;
      if (platformId === -1) {
        this.flag = true;
        this.platformId = null;
      } else {
        this.flag = false;
      }
      this.getDataList();
    },
    /**
     * @description 获取辖区范围
     */
    getJurisdictionData() {
      this.$api.getJurisdiction({}).then((res) => {
        if (res.errorcode === 0) {
          this.$refs.RiskDangerSeeDialog.jurisdictionData = res.list;
        }
      });
    },
    /**
     * @description 查看详情
     */
    viewHandle(id) {
      this.$refs.RiskDangerSeeDialog.init(id);
    },
    checkTime(i) {
      if (i < 10) {
        i = `0${i}`;
      }
      return i;
    },

    // 时间格式化
    formatDate(value) {
      // 时间为空时，返回空串
      if (!value.deadlineForRectification) return '';
      const date = new Date(value.deadlineForRectification);
      const str = `${date.getFullYear()}-${this.checkTime(
        date.getMonth() + 1,
      )}-${this.checkTime(date.getDate())}`;
      return str;
    },

    // 获取隐患类型
    handleEventType() {
      // this.$http({
      //   url: this.$http.adornUrl('/event/eventType/selectTypeList'),
      //   method: 'get',
      //   params: this.$http.adornParams({ typeFlag: 2, isTree: '0' }),
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     // console.log("获取隐患类型",data)
      //     this.typeData = data.list;
      //   } else {
      //     this.$message.error(data.code);
      //   }
      // });
      this.$http({
        url: this.$http.adornUrl('/riskDangerType/tree'),
        method: 'get',
      }).then(({ data }) => {
        console.log('getTree', data);
        if (data.errorcode === 0) {
          this.typeData = data.data;
        }
      });
    },
    // 导出数据
    planpdf() {
      if (!this.dataListSelections.length) {
        this.$message({
          message: '请选择一个人隐患进行导出',
          type: 'warning',
        });
      } else {
        const request = {
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/risk/riskdanger/output-excel',
          headers: {
            token: this.$cookie.get('token'),
          },
          params: {
            ids: String(this.dataListSelections),
            flag: this.flag,
          },
          responseType: 'arraybuffer',
        };
        axios(request).then((response) => {
          if (response.data) {
            if (navigator.msSaveOrOpenBlob) {
              // 兼容ie
              navigator.msSaveOrOpenBlob(
                new Blob([response.data], { type: 'application/vnd.ms-excel' }),
                '导出隐患数据.xls',
              );
            } else {
              const str = decodeURI(
                escape(response.headers['content-disposition']),
              ).indexOf('filename') > -1 ? 'filename=' : 'fileName=';
              // 获取文件名
              // 返回数据大小写可能不同，因此需要区分
              const fileName1 = decodeURI(
                escape(response.headers['content-disposition']),
              ).split('fileName%3D')[1];
              const fileName2 = decodeURI(
                escape(response.headers['content-disposition']),
              ).split('filename%3D')[1];
              const fileName = fileName1 || fileName2;
              console.log(fileName);
              const a = document.createElement('a');
              a.href = window.URL.createObjectURL(
                new Blob([response.data], { type: 'application/vnd.ms-excel' }),
              );
              a.download = fileName || '导出隐患数据.xls';
              document.body.appendChild(a); // 兼容Firefox浏览器
              a.click();
              a.remove();
            }
          }
        });
        // 注释原因：标题需要由后端返回
        // this.$http(request).then((response) => {
        //   if (response.data) {
        //     const a = document.createElement('a');
        //     a.target = '_blank';
        //     a.download = '导出隐患数据.xls';
        //     a.href = window.URL.createObjectURL(new Blob([response.data]));
        //     a.click();
        //   }
        // });
      }
    },
    // 导出模板
    exportExcel() {
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/risk/riskdanger/get-template',
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      axios(request).then((response) => {
        if (response.data) {
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
              '导出隐患模板.xls',
            );
          } else {
            const str = decodeURI(
              escape(response.headers['content-disposition']),
            ).indexOf('filename') > -1 ? 'filename=' : 'fileName=';
            // 获取文件名
            const fileName = decodeURI(
              escape(response.headers['content-disposition']),
            ).split('fileName%3D')[1];
            console.log(fileName);
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
            );
            a.download = fileName || '导出隐患模板.xls';
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
        }
      });
      // 注释原因：标题需要由后端返回
      // this.$http(request).then((response) => {
      //   if (response.data) {
      //     const a = document.createElement('a');
      //     a.target = '_blank';
      //     a.download = '隐患导入模板.xls';
      //     a.href = window.URL.createObjectURL(new Blob([response.data]));
      //     a.click();
      //   }
      // });
    },
    // 自定义文件上传行为
    uploadSectionFile(param) {
      const form = new FormData();
      console.log('parma////////', param)
      form.append('file', param.file);
      this.$http({
        url: this.$http.adornUrl('/risk/riskdanger/input-excel'),
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: form,
      })
        .then(({ data }) => {
          if (data.errorData.length === 0) {
            this.$message({
              message: '风险隐患导入成功!',
              type: 'success',
            });
            this.dataForm.enclosure = data.filePath;
            this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            // this.$emit('planData')
            this.getDataList();
          } else if (data.errorData.length > 0) {
            this.getDataList();
            this.$nextTick(() => {
              this.$refs.importDataDialogRef.open(data);
              // this.$refs.resourceImportError.init(data.errorData);
              // this.$refs.resourceImportError.tableColumn = this.errorTableColumn;
              // this.$refs.resourceImportError.tips = this.errorTips;
              // this.$refs.resourceImportError.required = this.errorRequired;
            });
          } else {
            this.$message.error('只支持导入风险隐患模板文件');
          }
        })
        .catch((err) => {
          // alert(err)
        });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl('/risk/riskdanger/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name,
          dangerTypeId: this.dataForm.dangerTypeId[this.dataForm.dangerTypeId.length - 1],
          platformId: this.platformId,
          flag: this.flag,
          townId: this.townId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // data.page.list.forEach((item, index, arr) => {
          //   arr[index]['deadlineFor'] = item.deadlineForRectification.substring(0, item.deadlineForRectification.indexOf('T'))
          //   arr[index]['controllabilityName'] =
          //     this.controllabilityData.find(items => {
          //       return items.value == item.controllability
          //     }).label || ''
          // })
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val.map((item) => item.id);
      // console.log(this.dataListSelections)
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections;
      this.$confirm(
        // `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        `确定进行${id ? '删除' : '批量删除'}操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/risk/riskdanger/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.pageIndex = 1;
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
  },
};
</script>

<style lang="less">
  .sv-input-search__icon {
    margin: 10px 0 0 5px;
    padding: 0;
    display: inline-block;
    width: 16px;
    height: 16px;
    background: no-repeat url('./search.svg') center/100% 100%;
  }
</style>
