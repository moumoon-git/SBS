<!--authorName chenbin-->
<template>
  <div>
    <div class="message-all-container">
      <div class="message-tree">
        <div class="message-tree-search">
          <div
            class="el-icon-search message-tree-search-icon"
            @click="searchTree"
          />
          <input
            v-model="search.searchTreeName"
            class="message-tree-search-inner"
            placeholder="按enter搜索"
            @keyup.enter="searchTree"
          >
          <div
            v-if="search.searchTreeName"
            class="message-tree-search-cancel el-icon-close"
            @click="
              search.searchTreeName = '';
              searchTree();
            "
          />
        </div>
        <div class="message-tree-scroll">
          <el-tree
            ref="tree"
            :highlight-current="true"
            :data="treeList"
            :props="treeProps"
            :show-checkbox="exportVisible"
            node-key="id"
            :default-expanded-keys="[0]"
            :current-node-key="0"
            @node-click="handleNodeClick"
          />
        </div>
      </div>

      <div class="message-content-wrapper">
        <!-- 1. 顶部功能栏 -->
        <div
          class="message-content-header"
          @keyup.enter.native="getDataList()"
        >
          <div class="message-content-header-title">
            成员信息
          </div>
          <span class="message-content-header-button">
            <el-select
              v-model="queryCondition.entryStatus"
              class="message-content-header-cycle"
              clearable
              placeholder="请选择入职状态"
              @change="searchResult()"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-model="queryCondition.searchTimeDate"
              class="message-content-header-date"
              clearable
              :unlink-panels="false"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="medium"
              value-format="yyyy-MM-dd"
              @change="searchResult()"
            />
            <el-input
              v-model.lazy="queryCondition.condition"
              class="message-content-header-search"
              placeholder="请输入申请人姓名、村居、身份证或电话"
              clearable
              @change="searchResult"
            />
            <el-button
              class="message-content-header-search-button"
              type="primary"
              plain
              @click="searchResult()"
            >查询</el-button>
            <div
              class="sv-button-more"
              :class="isFocus?'sv-button-more__focus':'sv-button-more__unfocus'"
            >
              <div
                @click="isFocus=!isFocus,
                        boxVisible=!boxVisible;dataList[0].disabled = !dataList[0].disabled"
              >
                <span>更多</span>
                <span class="sv-icon-triangle" />
              </div>
              <div class="sv-button-more__content">
                <div
                  class="sv-button-more__content__item-header"
                >
                  导出
                </div>
                <div
                  class="sv-button-more__content__item"
                  @click="exportSelectAll()"
                >
                  选择表格数据导出
                </div>
                <div
                  class="sv-button-more__content__item"
                  @click="exportSearchAll()"
                >
                  查询分组导出
                </div>
              </div>
            </div>
          </span>
        </div>
        <!-- 2. 表格 -->
        <div class="message-content-table">
          <el-table
            v-loading="dataListLoading"
            :data="dataList"
            height="calc(100% - 155px)"
            border
            :header-cell-style="getRowClass"
            @selection-change="dataSelection"
          >
            <el-table-column
              v-if="boxVisible"
              type="selection"
              header-align="center"
              align="center"
            />
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50px"
            />
            <el-table-column
              align="center"
              prop="name"
              label="姓名"
            />
            <el-table-column
              align="center"
              prop="sex"
              label="性别"
            >
              <template slot-scope="scope">
                {{
                  scope.row.sex == "0" ? "男" : scope.row.sex == "1" ? "女" : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="birthPlace"
              label="籍贯"
            />
            <el-table-column
              align="center"
              prop="villageCommitteeString"
              label="所属村居"
            />
            <el-table-column
              align="center"
              width="200"
              prop="credentialsNum"
              label="身份证号码"
            />
            <el-table-column
              align="center"
              prop="phone"
              label="联系电话"
            />
            <el-table-column
              align="center"
              prop="memberTypeString"
              label="成员类型"
            />
            <el-table-column
              align="center"
              width="200"
              prop="gmtCreate"
              label="申请时间"
            />
            <!-- <el-table-column
              prop="status"
              header-align="center"
              align="center"
              label="使用状态"
            >
              <template slot-scope="scope">
                <span
                  :class="
                    options.find((item) => item.value == scope.row.status)
                      .label == '待审核'
                      ? 'yellowFont'
                      : options.find((item) => item.value == scope.row.status)
                          .label == '已审核'
                      ? 'greenFont'
                      : options.find((item) => item.value == scope.row.status)
                          .label == '已驳回'
                      ? 'redFont'
                      : 'blackFont'
                  "
                  >{{
                    options.find((item) => item.value == scope.row.status).label
                  }}</span
                >
              </template>
            </el-table-column> -->
            <el-table-column
              align="center"
              prop="accountType"
              label="状态"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.accountType == 1">入职</span>
                <span
                  v-if="scope.row.accountType == 2"
                  :class="scope.row.accountType == 2 ? 'redStatus' : ''"
                >离职</span>
                <span
                  v-if="scope.row.accountType == 3"
                  style="color: #000000"
                >正在入职</span>
                <span
                  v-if="scope.row.accountType == 4"
                  style="color: #d9001b"
                >正在离职</span>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="right"
              width="260px"
              label="操作"
            >
              <template slot-scope="scope">
                <div>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="
                      showDetail(
                        scope.row.id,
                        'dialogFormVisibleWatch',
                        'shenhe'
                      )
                    "
                  >
                    查看
                  </el-button>
                  <el-button
                    v-if="scope.row.accountType == '2'"
                    size="mini"
                    type="primary"
                    @click="
                      watchDetail(
                        scope.row.id,
                        'dialogFormVisibleWatch',
                        'baoshen'
                      )
                    "
                  >
                    重新入职
                  </el-button>
                  <el-button
                    v-if="scope.row.accountType == '1'"
                    size="mini"
                    type="primary"
                    @click="showApprove(scope.row)"
                  >
                    离职登记
                  </el-button>
                  <el-button
                    v-if="scope.row.accountType == '2'"
                    size="mini"
                    type="danger"
                    style="height: 36px"
                    @click="delectInformation(scope.row.id)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 3. 分页 -->
        <div class="message-content-footer">
          <el-pagination
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, prev, pager, next, sizes, jumper"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
          />
        </div>
      </div>
    </div>
    <!-- 新增修改 -->
    <memberAddOrUpdate
      ref="addOrUpdate"
      :tk-id="tktk"
      @refresh="getDataList"
    />

    <memberShow
      ref="memberShow"
      :tk-id="tktk"
    />

    <el-dialog
      width="960px"
      :visible.sync="approveVisible"
    >
      <div class="approve-edit-container">
        <!-- <div class="approve-edit-title">审批</div> -->
        <!-- <div>
          <label>姓名:</label>
          <label>{{ detailData.name }}</label>
          <label style="position: absolute; left: 12vw">性别:</label>
          <label style="position: absolute; left: 14vw">{{
            detailData.sex == "0" ? "男" : detailData.sex == "1" ? "女" : ""
          }}</label>
          <label style="position: absolute; left: 20vw">籍贯:</label>
          <label style="position: absolute; left: 23vw">{{
            detailData.nativePlace
          }}</label>
          <label style="position: absolute; left: 30vw">所属单位:</label>
          <label style="position: absolute; left: 33vw">{{
            detailData.villageCommittee
          }}</label>
        </div>
        <div>
          <label>身份证号码:</label>
          <label>{{ detailData.credentialsNum }}</label>
          <label style="position: absolute; left: 12vw">成员类型:</label>
          <label style="position: absolute; left: 15vw">{{
            detailData.memberTypeString
          }}</label>
          <label style="position: absolute; left: 20vw">联系电话:</label>
          <label style="position: absolute; left: 23vw">{{
            detailData.phone
          }}</label>
          <label style="position: absolute; left: 30vw">入职时间:</label>
          <label style="position: absolute; left: 33vw">{{
            detailData.villageCommittee
          }}</label>
        </div> -->
        <div>
          <div>
            <div>姓名:</div>
            <div>{{ detailData.name }}</div>
          </div>
          <div>
            <div>性别:</div>
            <div>
              {{
                detailData.sex == "0" ? "男" : detailData.sex == "1" ? "女" : ""
              }}
            </div>
          </div>
          <div>
            <div>籍贯:</div>
            <div>
              {{
                detailData.nativePlace
              }}
            </div>
          </div>
          <div>
            <div>所属单位:</div>
            <div>
              {{
                detailData.villageCommittee
              }}
            </div>
          </div>
        </div>
        <div>
          <div>
            <div>身份证号码:</div>
            <div>{{ detailData.credentialsNum }}</div>
          </div>
          <div>
            <div>成员类型:</div>
            <div>
              {{
                detailData.memberTypeString
              }}
            </div>
          </div>
          <div>
            <div>联系电话:</div>
            <div>
              {{
                detailData.phone
              }}
            </div>
          </div>
          <div>
            <div>入职时间:</div>
            <div>
              {{
                detailData.villageCommittee
              }}
            </div>
          </div>
        </div>
        <div class="approve-edit-text">
          <label>离职原因:</label>
          <textarea v-model="accountRemark" />
        </div>
        <div>
          <label>报审单位：</label>
          <el-select
            v-model="accountPlatformId"
            clearable
          >
            <el-option
              v-for="(item, index) in accountOptions"
              :key="`platform1${index}`"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <!-- <div class="approve-edit-result">
          <label>报审单位</label>
          <el->
        </div> -->
        <div class="approve-edit-footer">
          <!-- <el-button @click="closeDialog">取消</el-button> -->
          <el-button
            type="primary"
            @click="approveSubmit"
          >
            提交
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import memberAddOrUpdate from './memberAddOrUpdate';
import memberShow from './memberShow';

export default {
  components: {
    memberAddOrUpdate,
    memberShow,
  },
  props: ['tktk'],
  data() {
    return {
      type: '',
      manageId: '',
      dataId: '',
      approveVisible: false,
      accountPlatformId: '',
      accountRemark: '',
      accountOptions: [],
      detailData: {},
      baoshenData: { id: '' },
      unitList: [],

      search: {
        searchTreeName: '',
      },
      treeList: [],
      treeProps: {
        children: 'children',
        label: 'platformName',
      },
      treeIds: [],
      // 查询条件参数
      queryCondition: {
        entryStatus: '',
        searchTimeDate: '',
        condition: '',
      },
      // 状态值
      options: [
        {
          value: '1',
          label: '入职',
        },
        {
          value: '2',
          label: '离职',
        },
        {
          value: '3',
          label: '正在入职',
        },
        {
          value: '4',
          label: '正在离职',
        },
      ],
      // 性别
      sexType: [
        { name: '男', code: '0' },
        { name: '女', code: '1' },
      ],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      exportVisible: false,
      dataListLoading: false,
      addOrUpdateVisible: false,
      isFocus: false,
      boxVisible: false,
      tableSelected: [],
    };
  },
  mounted() {
    this.getTreeList();
    this.getDataList();
  },
  methods: {
    delectInformation(id) {
      this.$confirm('确定要进行[删除]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/approve/approveMemberAccount/delete'),
            method: 'post',
            data: this.$http.adornData({
              ids: [id],
            }),
          }).then((data) => {
            console.log(data);
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            // 更新数据
            this.getDataList();
            // this.totalData();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 查看详情信息
    showDetail(id, dialog, type) {
      this.$refs.memberShow.init(type, id);
      this.$refs.memberShow.getDetail(id, dialog);
    },
    watchDetail(id, dialog, type) {
      this.$refs.addOrUpdate.init(type, id);
      this.$refs.addOrUpdate.getDetail(id, dialog);
    },
    // 表头填充
    getRowClass({
      row, column, rowIndex, columnIndex,
    }) {
      if (rowIndex == 0) {
        return 'background:#F0F5FF';
        // return 'background: #0091FF'
      }
      return '';
    },
    searchTree() {
      this.pageIndex = 1;
      this.getTreeList();
    },
    // 获取树
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl('/sys/platform/getPlatformTreeByPlatformId'),
        method: 'get',
        params: this.$http.adornParams({
          name: this.search.searchTreeName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('treedata', data);
          this.treeList = [
            // {
            //   id: 0,
            //   platformName: "全部",
            //   children: null,
            // },
            ...data.data,
          ];
          // this.treeIds = [this.treeList[0].id];
          this.treeIds = [];
          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getDataList() {
      const request = {
        status: this.queryCondition.entryStatus,
        page: this.pageIndex,
        limit: this.pageSize,
        search: this.queryCondition.condition,
        startTime:
          this.queryCondition.searchTimeDate == null
            ? ''
            : this.queryCondition.searchTimeDate[0],
        endTime:
          this.queryCondition.searchTimeDate == null
            ? ''
            : this.queryCondition.searchTimeDate[1],
        groupIds: this.treeIds,
      };
      this.$http({
        url: this.$http.adornUrl('/approve/approveMemberEntity/listByPlatform'),
        method: 'post',
        data: this.$http.adornData(request),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('数据列表data', data);
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    /**
     * @method
     * @desc 树节点勾选操作时触发表格更新
     */
    handleNodeClick(obj) {
      this.pageIndex = 1;
      this.treeIds = [];
      obj.id == 0 ? (this.treeIds = []) : (this.treeIds = [obj.id]);
      if (obj.children != null) {
        this.getChildren(obj.children);
      }
      this.getDataList();
    },
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.treeIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d.children);
          }
        });
      }
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
    // 新增 修改
    addOrUpdateHandle(id, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, 'null');
      });
    },
    // 查询数据
    searchResult() {
      this.pageIndex = 1;
      this.getDataList();
    },
    // 离职申请确定
    approveSubmit() {
      if (this.accountRemark == '' || this.accountPlatformId == '') {
        this.$message({
          message: '离职原因跟报审单位不能为空',
          type: 'warning',
          duration: 1500,
        });
        return;
      }
      // console.log("测试测试测试");
      this.$http({
        url: this.$http.adornUrl(
          '/approve/approveMemberAccount/updateAccountType',
        ),
        method: 'post',
        data: this.$http.adornData({
          id: this.dataId,
          accountType: '2',
          urlList: [
            { name: '', url: '' },
            { name: '', url: '' },
            { name: '', url: '' },
          ],
          driverTypeList: [],
          curriculumVitaeEntities: [{ post: '', startEndTime: '', study: '' }],
          homeMemberEntities: [
            {
              name: '', phone: '', relationship: '', workUnit: '',
            },
          ],
          nextPlatformId: this.accountPlatformId,
          remark: this.accountRemark,
          documents: [{ docamentName: '', url: '' }],
          managerId: this.manageId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
          });
          this.approveVisible = false;
          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 离职申请
    showApprove(row) {
      const { id } = row;
      if (row.manageId == -300) {
        this.manageId = -700;
      }
      if (row.manageId == -400) {
        this.manageId = -800;
      }
      this.type = 'add';
      this.getUnit();
      this.getPlatform();
      this.dataId = id;
      this.$http({
        url: this.$http.adornUrl(`/approve/approveMemberAccount/info/${id}`),
        method: 'get',
      }).then((data) => {
        this.detailData = data.data.data;
        // this.detailData.curriculumVitaeEntities.forEach((v, i) => {
        //   if (v.startEndTime) {
        //     let timeString = v.startEndTime.split("-");
        //     let beginTime = timeString[0] + "-" + timeString[1];
        //     let endTime = timeString[2] + "-" + timeString[3];
        //     let timeArr = [];
        //     timeArr.push(beginTime);
        //     timeArr.push(endTime);
        //     this.detailData.curriculumVitaeEntities[i].startEndTime = timeArr;
        //   }
        // });
        this.approveVisible = true;
      });
    },
    getPlatform() {
      // console.log("报审单位", this.processType[index], this.baoshenData.id);
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getPlatForm?id=${this.baoshenData.id}`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.accountOptions = [];
          // console.log("报审单位平台数据", data, this.baoshenData.id);
          // this.platformData = data.data;
          data.data.forEach((item) => {
            this.accountOptions.push({
              value: item.id,
              label: item.platformName,
            });
          });
          this.getDataList();
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    getUnit() {
      const manageId = -700;
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getUnit?id=${manageId}`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.unitList = data.data;
          if (this.unitList.length > 0) {
            this.baoshenData.id = this.unitList[0].depId;

            // console.log("新增", this.unitList, this.baoshenData.name);
          }
          this.getPlatform();
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    // 表格多选
    dataSelection(selection) {
      this.tableSelected = selection;
    },
    // 导出选中组数据
    exportSelectAll() {
      if (this.tableSelected.length < 1) {
        this.$message({
          message: '请选择相应数据进行导出',
          type: 'warning',
        });
        return;
      }
      this.tableSelected = this.tableSelected.map((item) => item.id);
      this.$http({
        url: this.$http.adornUrl(
          '/approve/approveMemberEntity/xlsOutputSelectInstance',
        ),
        method: 'post',
        data: this.$http.adornData({
          ids: this.tableSelected,
        }),
        responseType: 'arraybuffer',
      }).then(({ data }) => {
        if (this.tableSelected.length < 1) {
          this.$message({
            message: '请选择相应数据进行导出',
            type: 'warning',
          });
          return;
        }
        if (navigator.msSaveOrOpenBlob) {
          // 兼容ie
          navigator.msSaveOrOpenBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), '导出数据.xls');
        } else {
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }));
          a.download = '导出数据.xls';
          document.body.appendChild(a); // 兼容Firefox浏览器
          a.click();
          a.remove();
        }
      }).catch((data) => {
        this.$message.error(data.msg);
      });
    },
    // 查询分组导出
    exportSearchAll() {
      this.$http({
        url: this.$http.adornUrl(
          '/approve/approveMemberEntity/xlsOutputConditionInstance',
        ),
        method: 'post',
        data: this.$http.adornData({
          status: this.queryCondition.entryStatus,
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.queryCondition.condition,
          startTime:
          this.queryCondition.searchTimeDate == null
            ? ''
            : this.queryCondition.searchTimeDate[0],
          endTime:
          this.queryCondition.searchTimeDate == null
            ? ''
            : this.queryCondition.searchTimeDate[1],
          groupIds: this.treeIds,
        }),
        responseType: 'arraybuffer',
      }).then(({ data }) => {
        // if (this.checkedIds.length < 1) {
        //   this.$message({
        //     message: '请选择相应分组进行导出',
        //     type: 'warning',
        //   });
        //   return;
        // }
        if (navigator.msSaveOrOpenBlob) {
          // 兼容ie
          navigator.msSaveOrOpenBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), '导出数据.xls');
        } else {
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }));
          a.download = '导出数据.xls';
          document.body.appendChild(a); // 兼容Firefox浏览器
          a.click();
          a.remove();
        }
      }).catch((data) => {
        this.$message.error(data.msg);
      });
    },
  },
};
</script>
<style lang="less" scoped>
.approve-edit-text {
  padding: 22px 0 10px 53px;
  label {
    position: relative;
    bottom: 98px;
    left: -52px;
  }
  textarea {
    // margin-left: 10px;
    margin-left: -42px;
    resize: none;
    width: 80%;
    height: 111px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    outline: none;
    &:hover {
      border-color: #dddddd;
    }
    &:focus {
      border-color: #0091ff;
    }
  }
}
.message-all-container {
  background: #f4f4f4;
  height: calc(100vh - 112px);
  display: flex;
  .message-tree {
    background: white;
    // height: calc(100vh - 115px);
    height: 100%;
    // max-width: 358px;
    width: 22%;
    min-width: 200px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    border-radius: 4px;
    .message-tree-search {
      &:hover {
        border-color: #c0c4cc;
      }
      &:focus-within {
        border-color: rgba(0, 145, 255, 1);
      }
      margin: 10px auto;
      height: 40px;
      // width: 330px;
      width: calc(100% - 28px);
      border-radius: 21px;
      border: 1px solid rgba(232, 236, 240, 1);
      position: relative;
      margin-bottom: 20px;
      .message-tree-search-icon {
        font-size: 17px;
        font-weight: bold;
        width: 17px;
        height: 17px;
        color: rgba(153, 153, 153, 1);
        margin: 10px 0px 11px 18px;
        cursor: pointer;
      }
      .message-tree-search-inner {
        border: none;
        outline: none;
        // width: 260px;
        width: calc(100% - 70px);
        font-size: 16px;
      }
      .message-tree-search-cancel {
        width: 17px;
        height: 17px;
        line-height: 15px;
        font-size: 15px;
        text-align: center;
        border: 1px solid rgba(153, 153, 153, 1);
        color: rgba(153, 153, 153, 1);
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 11px;
      }
      .message-tree-search-cancel:hover {
        color: rgba(153, 153, 153, 0.5);
        border-color: rgba(153, 153, 153, 0.5);
      }
    }
    .message-tree-scroll::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    .message-tree-scroll::-webkit-scrollbar-thumb {
      background: rgba(153, 153, 153, 1);
      border-radius: 20px;
    }
    .message-tree-scroll {
      overflow: auto;
      height: calc(100vh - 290px);
      /deep/.el-tree-node__content {
        height: 45px;
      }
      /deep/.el-tree-node__label {
        font-size: 14px;
      }
      /deep/.is-current > .el-tree-node__content {
        background: rgba(0, 145, 255, 0.1);
        border-left: 2px solid rgba(0, 145, 255, 1);
        color: rgba(0, 145, 255, 1);
      }
      /deep/.el-tree-node__content:hover {
        background: rgba(0, 145, 255, 0.1);
      }
    }
  }
  .message-content-wrapper {
    border-radius: 4px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    border: 1px solid transparent;
    background: white;
    margin-left: 10px;
    // width: 1360px;
    width: calc(78% - 10px);
    min-width: 1050px;
    // height: calc(100vh - 115px);
    height: 100%;
    position: relative;
    .message-content-header {
      height: 76px;
      .message-content-header-title {
        border-left: 3px solid rgba(0, 145, 255, 1);
        font-size: 16px;
        font-weight: bold;
        display: inline-block;
        height: 16px;
        line-height: 16px;
        padding-left: 14px;
        position: absolute;
        left: 15px;
        top: 30px;
      }
      .sv-button-more {
    display: inline-block;
    position: relative;
     width:57px;
     height: 42px;
    line-height: 42px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
    color: #666666;
    user-select: none;
    cursor: pointer;
    .sv-button-more__content {
        position: absolute;
        top: 30px;
        right: 0;
        width: 160px;
        z-index: 1;
        transform: scaleY(0);
        transform-origin: center top;
        transition: transform 0.5s;
        background: #ffffff;
        box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        padding: 5px 0;
        .sv-button-more__content__item-header {
            color: #999999;
            text-align: left;
            padding: 21px 0 15px 20px;
            line-height: 14px;
            cursor: auto;
        }
        .sv-button-more__content__item {
            text-align: left;
            padding: 13px 20px 15px 20px;
            line-height: 14px;
            &:hover {
                background: rgba(0, 145, 255, 0.1);
            }
        }
        .sv-button-more__content__line {
            border-bottom: 1px solid #e6e6e6;
            width: 132px;
            height: 13px;
            margin: 0 auto;
            margin-bottom: 14px;
            cursor: auto;
        }
    }
    .sv-icon-triangle {
        position: relative;
        bottom: 3px;
        display: inline-block;
        width: 1px;
        height: 1px;
        border: 4px solid #b4b4b4;
        border-top-color: transparent;
        border-left-color: transparent;
        transform: rotate(45deg);
        transition: all 0.5s ease;
    }
    &.sv-button-more__unfocus:hover {
        border-color: #b4b4b4;
    }
    &.sv-button-more__focus {
        border-color: #0091ff;
        .sv-icon-triangle {
            bottom: -1px;
            transform: rotate(-135deg);
        }
        .sv-button-more__content {
            z-index: 100;
            transform: scaleY(1);
        }
    }
}
      .message-content-header-button {
        position: absolute;
        right: 13px;
        top: 17px;
        .message-content-header-cycle,
        .message-content-header-disposer {
          width: 140px;
          height: 42px;
          /deep/.el-input__inner {
            height: 42px;
            line-height: 42px;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 16px;
          }
          /deep/.el-icon-arrow-up::before {
            margin-top: 9px;
          }
          /deep/.el-input__suffix {
            right: 2px;
          }
          /deep/.el-icon-arrow-up::before {
            background: no-repeat
              url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
            background-size: 20px 10px;
            background-position: center;
            transform: rotate(180deg);
          }
          /deep/.el-icon-circle-close {
            font-size: 17px;
          }
        }
        .message-content-header-date {
          height: 42px;
          width: 290px;
          margin-left: 1px;
          /deep/.el-icon-date {
            top: 2px;
          }
          /deep/.el-range-input,
          /deep/.el-range-separator {
            font-size: 16px;
          }
          /deep/.el-range-input {
            margin-left: 20px;
            width: 105px;
          }
          /deep/.el-range-separator {
            margin-top: 5px;
            margin-left: 5px;
            margin-right: -15px;
          }
          /deep/.el-range__icon {
            font-size: 17px;
          }
          /deep/.el-range__close-icon {
            font-size: 17px;
            position: relative;
            top: 1px;
          }
        }
        .message-content-header-search {
          width: 350px;
          /deep/.el-input__inner {
            height: 42px;
            width: 350px;
            font-size: 16px;
          }
          /deep/.el-input__clear {
            font-size: 17px;
            padding-top: 2px;
          }
        }
        .message-content-header-search-button,
        .message-content-header-export-button {
          height: 42px !important;
          position: relative;
          bottom: 1px;
          /deep/span {
            font-size: 16px;
          }
        }
        .message-content-header-export-button {
          padding: 10px;
          margin-left: 1px;
        }
        .message-content-header-export-expand {
          position: absolute;
          border: 1px solid white;
          border-radius: 4px;
          right: 0;
          top: 45px;
          background: white;
          z-index: 999;
          transition: opacity 0.5s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
          color: rgba(85, 85, 85, 1);
          font-size: 16px;
          .message-content-header-export-expand-item {
            cursor: pointer;
            padding: 5px 10px;
            font-size: 16px;
          }
          .message-content-header-export-expand-item:hover {
            background: #e2f5ff;
            color: #0091ff;
          }
        }
        .message-content-header-export-expand-hide {
          opacity: 0;
          z-index: -999;
        }
      }
    }
    .message-content-table {
      height: calc(100% - 155px);
      overflow: hidden;
      /deep/.el-table {
        -webkit-box-shadow: none;
        box-shadow: none;
        border: none;
        position: absolute;
        left: -1px;
        width: calc(100% + 3px);
        max-width: none;
        overflow-y: auto;
        /deep/thead div {
          font-size: 14px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          th {
            height: 56px;
          }
        }
        /deep/tbody {
          /deep/td {
            min-height: 67px;
            height: 67px;
          }
          div {
            font-size: 14px;
            font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
              Roboto-Regular, SourceHanSansCN-Regular;
            font-weight: normal;
            color: rgba(102, 102, 102, 1);
          }
          td {
            border-left: none;
            border-right: none;
            .button-view {
              margin: 0 auto;
              width: 27px;
              height: 25px;
              cursor: pointer;
              background: no-repeat
                url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAEDElEQVRYR+2Wb2hVZRzHv9/nrOlWU5molcSiMoTaIne79zZ7Y0QUQkLLEZTb7k3qTc02rSCDDDKodEvrTWH3bloQswQDKyLyTa57592grUCyohFWOhzO1aZr53zjzhn7c+89z50Vvtjz7pzn+/38vvzO8zznIS7Twcs0F+aC5ftl5jr2v3QsntJKelgLodLzVE5yCYCFE8UHJfUbw14QXTI4FAnw2H8W7JPjmtc/gA2e0ACoPL9C7DXE7sFS7GtYwfM2Xqs1FktoHYlmSDfYQLNqyJ8kNEXDPOjHyRmsvUNFww52S9roB8pnnuSeYhcNNVUcyebLGqwtqcUe8DGkqnyKWmvJDgM8UBfi6UyejMHeTmlh4Ri+BLTKutCshOweLcDdTwQ4ON0+I1i75Awn8ZmgeyxrDQD8CELvuJ4oB1QNoNTGT/CL4hDuqyHdyfoZweJfazuo522goNpGHbPpt0oMXZfCirTnlwCOX9OFkkLX2wWxzoojvhK5k1uzBms7qqDnqgOA4wcUFI+GnWgsoUcJvAro2gse/irguWiY78USboxgxI8FwDUeq+qq2HlR+0/HJLEtiU5BAV+Q0O+5vJEOHiTVmkkvsV4uDhhHP4JIH8A5B8FUXQhBkrqwIiZGW0IPedB+P8C4SXqr7Jxp7CvCCUFLM+8qniobwfK++V6LyCdtuAZcXxfmh1OCxRNeAkDIBkBy45iLbseoO6fe8HYKlZL22HABJCNhE54erAuA1fEgMGqAHkGpXAUJBjygglDMMlh3JGwqpwRrTaha0Hgb/QbBnWcHsLVksX6HsCijnjgzdJpXLyjFdkGb/ZjpecewujbIA1OCpR/iCX0FaLUF5ASW8Sb243F52pVxjRlu0hK8g5P6AcByfyaPRMK866Juyjm296hudV2lP2mhL4hsjoS4OZZUI6WXAJRMeIZEvhgNsSWe1E5ITb4sYNRxWFl7B7/NGCz9MpbQFkKvW8BAaMfZAfPCvKVwCl2Mr41RB13nT8FdUIqXBW2x4Qh8Jhrmjsnamf9Kia2d+EBSjQ0UQh+g941jetJ6z/UqAD4CoszGT7K9PoiHMXF+Ze1YeqK5Q0WLjA4RWGMDn61GwOEzHtc2Zbj+ZL327P1GV3oj2C/o/tkWzuUj+Kkpwvra2/hnxs2Ty7ztsAqun++9JvLpyX+JSwwqSm/8fM48u20Nx7KxrK7WrQndK+hNADdfYqjvCT5VH+bnfhyrYGlI+3cqHB5CvaRGECv9wFPmhWMkW4pL0FpzC0dtvNbBJsP2pbTqrzFvHckghAoAyyZdldIXvpMgeiR1XlFgDm4IMPc/NUPSWQWbwZH47hFclX7/2Gr8MX3r23RouubfCTabyj6euWD5NnWuY/l27G9733k0ycG80wAAAABJRU5ErkJggg==);
              background-size: 100% 100%;
              &:hover {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAADdElEQVRYR+2XW4iMYRjHf4/ZzIp1WDlfKKdcWMUK4YYkUpRFCjkkbtb3rXUqlFUox9357A3JIZScihJJ3LCx2b3AhZzKhXPWYckOOz16v92tmd2Z+d4Zh1zsczff9///n/88877P84zwn4b8p75oN5bpL9NesX9TsQM6HGUmUIhSAPRC6OYnVz4D7xEeADUIl1ktj/6eMU/DKIsRnGYz9rmMScVDOIEjURui3RmL6GxgPzDIRjQN5jlQiisXg3TSG9uvncjBQ1kRJJTRe+EwjTiUyvdUvNTGKrUnMS4BEzJKag+uIsQsiuVDMkpyYwe1G1FuoIy2z5MFUqglzBRWibkwCdHW2BkN8YarKFMtU9UhnEf9WwhCAUoRkG/FF67Tl+nMl1g8vq0xT3egbLIShePk4vKaeroz1Od84gn9yKOBCLDESkfYiSObUxvzdCxKFRCyEDyKK8up0EUIu4D+zZxXKBspkZNE9AiwzEIrhjABR6pbsHEVU8GjGmWMhdB7GhhMLnOAYynwS2ngArk88xtwUAj3cBgLok0noiU8nYtyNojffI4qqWMN+bxE6Z2UI7yjjgHkU45SbKk7D0fOJRqL6B1gnJWA6WsdqEWpTYvPYRQ/KcT0Lbu4iyvjE41VqJlrtu1hOXAfuBeQzxyLkYA5a8FhvmiJFLY2VoTglzEwhH3AZpQ3QPcU+E8IfQFzy9cGaja5KcKRC4nGzCdPb6FMtBB5SVeGUM9K1G8LbUNwyeMQX3gKDAjUFG7jyKQWXGIfi+gI1F9VOgYKmaHuyloqdA2wDSHP5yj1wFZKpJyImsqWBmopPxAKceVhcmPmaUTXAXsCxZoAexG2ECZEFP9sEKaGKDGU7YDRson1uLI3HphkVqoQ4TQw30YReIFwCvEvg6nYSJSFwEBL/hlcFrT0r9QVM2/MuhPiMjDZUjxb2E1izEy2/qRee/ZoZ8KcRZmRbda0POEKUeaxXr4lvzvp2GWaQw92AyUJU+L3nJqRU8FHNlAmjamk7FZrT6ehHACG/Z4nHiOsxpFrQTp2xoxKmXakB0sB0x6GBwm3em/+JZXzkWOUyQ8brr2xeLVKHU0jsxGzDfgjp0/cqmQWvrf+yFKqyeEixZJ+piZxmp2xNkJqNrIu/uONfG199W0q1Brzh4xlkzo9p91YpjVtr1imFfsFaaXrJVm90+MAAAAASUVORK5CYII=);
              }
            }
          }
          tr {
            background: none;
          }
          tr:hover {
            box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
            td:nth-child(1) {
              border-left: 3px solid #0091ff;
            }
          }
        }
      }
    }
    .message-content-footer {
      height: 83px;
      position: relative;
      .el-pagination {
        position: absolute;
        bottom: 15px;
        right: 30px;
        /deep/.el-pagination__total {
          font-size: 16px;
          color: rgba(96, 98, 102, 1);
          vertical-align: center;
          position: relative;
          top: 8px;
          right: 10px;
        }
        /deep/.number,
        /deep/.btn-prev,
        /deep/.btn-next,
        /deep/.more {
          border-radius: 3px;
          height: 42px;
          width: 42px;
          line-height: 42px;
          font-size: 16px;
          font-weight: normal;
          margin: 0;
          margin-right: 14px;
        }
        /deep/.el-pagination__sizes {
          /deep/.el-input__inner {
            border-radius: 3px;
            height: 42px;
            width: 107px;
            line-height: 42px;
            font-size: 16px;
          }
        }
        /deep/.el-pagination__jump {
          height: 42px;
          line-height: 42px;
          font-size: 16px;
          margin-left: 5px;
          /deep/.el-input__inner {
            border-radius: 3px;
            height: 42px;
            width: 38px;
            line-height: 42px;
            font-size: 16px;
          }
        }
      }
    }
  }
  .greenFont {
    color: #70b603;
  }
}
.approve-edit-container{
  >div{
    &:nth-child(1){
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      >div{
        display: flex;
        >div{
          flex-shrink: 0;
          &:nth-child(2n){
            margin-right: 50px;
          }
       }
      }
    }
    &:nth-child(2){
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      >div{
        display: flex;
        >div{
          flex-shrink: 0;
          &:nth-child(2n){
            margin-right: 50px;
          }
        }
      }
    }
  }
}
</style>
