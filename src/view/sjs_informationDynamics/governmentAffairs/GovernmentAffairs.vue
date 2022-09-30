<template>
  <div>
    <div class="navsBar">
      <el-row style="padding:10px 10px 0 20px;">
        <el-col :span="7">
          <div style="display: flex;">
            <el-input placeholder="请输入标题" v-model="searchText" class="input-with-select" @keyup.enter.native="handleSearch">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
                class="searchButton"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="17">
          <!-- <table-button-group ref="TableButtonGroup" style="float: right;margin-right: 16px" @handleAdd="handleAdd"
          @handleEdit="handleEdit" @handleDelete="handleDelete"></table-button-group>-->
          <div style="float: right;">
            <el-button type="primary" @click="zeroReport">新增零报告</el-button>
            <el-button type="primary" @click="typeMangerHandle">类型管理</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button type="primary" @click="handleEdit">修改</el-button>
            <el-button type="primary" @click="handleDelete">删除</el-button>
            <!-- <el-button type="primary" @click="handleUserUnit">设置用户单位</el-button> -->
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-col :span="15">
        <div class="contentStyle">
          <el-main>
            <div class="tableContainer">
              <el-table
                ref="singleTable"
                :data="tableData"
                highlight-current-row
                height="694px"
                :header-cell-style="{background:'rgba(249,251,255,1)',color:'#333'}"
                @row-click="handleClick"
              >
                <el-table-column
                  prop="id"
                  width="60"
                  :resizable="false"
                  label="序号"
                  style="padding-left: 15px;"
                ></el-table-column>
                <el-table-column
                  v-for="(item,key) in tableColumn"
                  :key="key"
                  :label="item.label"
                  :prop="item.prop"
                  :min-width="item.minWidth"
                  :resizable="false"
                  :show-overflow-tooltip="item.showTip"
                ></el-table-column>

                <el-table-column
                  width="100"
                  :resizable="false"
                  label="状态"
                  style="padding-left: 15px;"
                >
                  <template slot-scope="scope">
                    <span
                      :style="{color:scope.row.send==0?'#FF977A':'#0091FF'}"
                    >{{scope.row.send==0?"未下发":scope.row.send==1?"已下发":"未知"}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="110"
                  :resizable="false"
                  label="操作"
                  style="padding-left: 15px;"
                >
                  <template slot-scope="scope">
                    <!-- 导出 -->
                    <div
                      style="height: 15px; width: 16px;cursor: pointer;display: inline-block"
                      class="zhuanfa"
                      @click.stop="clickExport(scope.row)"
                    ></div>
                    <!-- 未下发 发送 -->
                    <i
                      class="el-icon-s-promotion"
                      v-if="scope.row.send==0"
                      size="mini"
                      @click.stop="issueHandle(scope.row.id)"
                      style="cursor:pointer;height:15px"
                    ></i>
                    <!-- 已下发 查看-->
                    <div v-else-if="scope.row.send==1" style="display:inline-flex;">
                      <i
                        class="el-icon-s-order"
                        size="mini"
                        style="cursor:pointer;height:15px;"
                        @click.stop="seeHandle(scope.row)"
                      ></i>
                      <i
                        class="el-icon-chat-dot-round"
                        size="mini"
                        style="cursor:pointer;height:15px;margin-left:7px;color:rgb(159, 200, 254)"
                        @click.stop="openReportDialog(scope.row,'all')"
                      ></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <!-- 负责人 —— 展开的table -->
                    <div class="responseBox">
                      <el-table :data="props.row.appSjsAffairsContacotrVos" style="color:#777777;"> 
                        <el-table-column
                          prop="appContactorWorkUnit"
                          width="147"
                          :resizable="false"
                          label="部门"
                          align="center"
                        ></el-table-column>
                        <el-table-column
                          prop="appContactorName"
                          width="147"
                          :resizable="false"
                          label="人员"
                          align="center"
                        ></el-table-column>
                        <el-table-column
                          prop="appContactorPosition"
                          width="147"
                          :resizable="false"
                          label="职位"
                          align="center"
                        ></el-table-column>
                        <el-table-column
                          width="120"
                          :resizable="false"
                          label="状态"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <span>{{ scope.row.affairsContactorConfirm == 0 ? "未确认"
                              : scope.row.affairsContactorConfirm == 1 ? "已确认" 
                              : ""}}
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="affairsContactorConfirmTime"
                          width="200"
                          :resizable="false"
                          label="确认时间"
                          align="center"
                        ></el-table-column>
                        <el-table-column
                          width="147"
                          :resizable="false"
                          label="回复内容"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <el-button v-if="scope.row.affairsContactorConfirm==1" @click="openReportDialog(scope.row,'one')" type="text">查看</el-button>
                            <span v-else>暂无</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          width="147"
                          :resizable="false"
                          label="操作"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <span v-if="scope.row.affairsContactorConfirm == 0" class="cellPhoneImg" @click="callPhoneAssign(scope.row)"></span>
                            <span v-else>-</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                class="pagination"
                :page-size="pageSize"
                :page-sizes="[10,20,30,40]"
                :total="total"
                :current-page="currentPage"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                layout="prev, pager, next, sizes"
                width="100"
              ></el-pagination>
            </div>
          </el-main>
        </div>
      </el-col>
      <!--详情信息框-->
      <el-col :span="9">
        <work-details ref="workDetails" @handleAddAtt="handleAddAtt" @updateAffairsDetail="updateAffairsDetail"></work-details>
      </el-col>
    </el-row>

    <!--回复内容弹窗-->
    <el-dialog 
      :visible.sync="reportDialogShow" 
      title="回复内容" 
      :modal="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="reportDialogShow=false"
    >
      <el-form
        ref="replayForm"
        :model="replayForm"
        label-position="left"
        label-width="100px"
      > 
      <el-form-item prop="affairsTypeName" label="类型选择:">
        <el-col :span="23">
          <div style="text-align:left">{{replayForm.affairsTypeName == ''?'暂无数据':replayForm.affairsTypeName}}</div>
        </el-col>
      </el-form-item>
      <el-form-item prop="title" label="标题:">
        <el-col :span="23">
          <div style="text-align:left">{{replayForm.title == ''?'暂无数据':replayForm.title}}</div>
        </el-col>
      </el-form-item>
      <el-form-item prop="content" label="内容:">
        <el-col :span="23">
          <div style="text-align:left">{{replayForm.content == ''?'暂无数据':replayForm.content}}</div>
        </el-col>
      </el-form-item>
      <el-form-item prop="executeTime" label="执行时间:">
        <el-col :span="23">
          <div style="text-align:left">{{replayForm.executeTime == ''?'暂无数据':replayForm.executeTime}}</div>
        </el-col>
      </el-form-item>
      <el-form-item prop="responseTableColumn" label="回复名单:">
        <div class="responseDialogTable" v-if="responseTableColumn.length > 0">
          <!-- 表头 -->
          <el-row :gutter="gutter" class="tableContent th">
            <el-col :span="per" v-for="(item, index) in responseTableColumn" :key="index">
              {{ item.label }}
            </el-col>
          </el-row>
          <!-- 表格内容 -->
          <el-row :gutter="gutter" class="tableContent"  v-for="(item, index) in responseTableData" :key="index">
            <el-col :span="per" v-for="el in item" :key="el">
              {{ el == ''?'暂无数据':el }}
            </el-col>
          </el-row>
        </div>
        <div class="responseDialogTable" v-else style="text-align:left">暂无回复</div>
      </el-form-item>
      </el-form>
      <!-- <div class="responseDialogTable"> -->
        <!-- 表头 -->
        <!-- <el-row :gutter="gutter" class="tableContent th">
          <el-col :span="per" v-for="(item, index) in responseTableColumn" :key="index">
            {{ item.label }}
          </el-col>
        </el-row> -->
        <!-- 表格内容 -->
        <!-- <el-row :gutter="gutter" class="tableContent"  v-for="(item, index) in responseTableData" :key="index">
          <el-col :span="per" v-for="el in item" :key="el">
            {{ el }}
          </el-col>
        </el-row>
      </div> -->
    </el-dialog>
    <!--响应情况弹窗-->
    <response
      ref="response"
      :responseId="responseId"
      v-if="responseVisiable"
      @closeDialog="responseVisiable = false"
    ></response>

    <!--工作安排弹窗-->
    <report-or-work
      ref="reportOrWork"
      @getTableData="getTableData"
      v-if="reportOrWorkVisiable"
      :title="title"
      @closeDialog="reportOrWorkVisiable = false"
    ></report-or-work>

    <!--类型管理-->
    <type-manger ref="typeManger"></type-manger>
  </div>
</template>

<script>
import TableButtonGroup from "@/components/button/tableButtonGroup";
import SearchBar from "@/components/menu/searchBar";
import WorkDetails from "@/view/sjs_informationDynamics/governmentAffairs/WorkDetails";
import ReportOrWork from "@/view/sjs_informationDynamics/governmentAffairs/ReportOrWork";
import response from "@/view/sjs_informationDynamics/governmentAffairs/Response";
import typeManger from "@/view/sjs_informationDynamics/governmentAffairs/TypeManger";
import axios from '@/assets/api/api'
import cookie from "js-cookie";

export default {
  name: "workingArrangement",
  components: {
    WorkDetails,
    SearchBar,
    TableButtonGroup,
    ReportOrWork,
    response,
    typeManger
  },
  data() {
    return {
      placeholder: "输入标题/内容/责任单位/负责人", //搜索框提示
      searchText: "", //搜索内容
      tableData: [], //表格数据
      gutter: 24, // 栅栏格
      per: 0, // 列所占格数
      responseTableColumn: [], // 回复内容-表头
      responseTableData: [], // 回复内容-表格内容
      tableColumn: [
        {
          label: "标题",
          prop: "title",
          minWidth: "130",
          showTip: true
        },
        {
          label: "更新时间",
          prop: "updateTime",
          minWidth: "130",
          showTip: false
        },
        {
          label: "是否零报告",
          prop: "zeroReportStatus",
          minWidth: "60",
          showTip: false
        }
      ], //表头
      total: 0, //数据总数
      pageSize: 10, //每页条数
      currentPage: 1, //当前页
      rowData: null, //当前选中行
      responseVisiable: false, // 响应情况视图
      reportOrWorkVisiable: false, // 新增零报告，新增/修改工作安排，试图
      title: "", // 新增零报告，新增/修改工作安排，标题
      reportDialogShow: false, // 查看回复弹窗
      replayForm: {},
    };
  },
  created() {
    // this.$nextTick(() => {
    //   this.$refs.TableButtonGroup.refreshIsShow = false;
    //   this.$refs.TableButtonGroup.sortIsShow = false;
    //   this.$refs.TableButtonGroup.batchJoinIsShow = false;
    // });
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    /**
     * @createTime: 2021-04-18
     * @author: hexinting
     * @param {Object} row 当前行
     * @return {type} undefined
     * @Description: 更新当前点击行数据
     */
    updateAffairsDetail(row) {
      this.tableData.forEach(item => {
        if (item.id === row.id) {
          item.appSjsAffairsContacotrVos = row.appSjsAffairsContacotrVos; // 负责人appSjsAffairsContacotrVos 查询的联系人是不带分页的，适合放在展开的表格里
        }
      })
    },
    /**
     * @createTime: 2021-04-18
     * @author: hexinting
     * @param {Object} row 当前行
     * @return {type} undefined
     * @Description: 导出按钮
     */
    clickExport(row) {
      console.log('导出excel',window.g.ApiUrl + `/app/sjs/affairs/exportExcel?token=${localStorage.getItem("token") || cookie.get("token")}&affairsId=${row.id}`)
      window.location.href = window.g.ApiUrl + `/app/sjs/affairs/exportExcel?token=${localStorage.getItem("token") || cookie.get("token")}&affairsId=${row.id}`;
      // const iframe = document.createElement("iframe");
      // iframe.style.display = "none";  // 防止影响页面
      // iframe.style.height = 0;  // 防止影响页面
      // iframe.src = window.g.ApiUrl + `/app/sjs/affairs/exportExcel?token=${localStorage.getItem("token") || cookie.get("token")}&affairsId=${row.id}`
      // document.body.appendChild(iframe);  // 这一行必须，iframe挂在到dom树上才会发请求
      // setTimeout(()=>{
      //   //iframe.remove();
      //   document.body.removeChild(iframe);
      // }, 6000);
    },
    /**
     * @createTime 2021-04-09
     * @author: qinjiaqi
     * @lastEditor hexinting
     * @lastEditedDate 2021-04-19
     * @param {Object} 当前行
     * @return {type} undefined
     * @Description 展开函数
     */
    clickCaret(row) {
      this.responseId = row.id; // 工作安排的ID
      // 扩展表格
      let $table = this.$refs.singleTable;
      this.tableData.map(item => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },
    /**
     * @createTime: 2021-04-09
     * @author: qinjiaqi
     * @param {Object} 当前行
     * @return {type} undefined
     * @Description: 打电话
     */
    callPhoneAssign(item) {
      let data = {
        affairsId: this.responseId,
        contactorId: item.appContactorId,
      }
      // this.$api.chasing({data})
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/call',
        method: 'post',
        data
      })
      .then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.$message.success("追呼成功")
      })
    },
    /**
     * @createTime: 2021-04-12
     * @author: hexinting
     * @param {Object} 当前行
     * @return {type} undefined
     * @Description: 查看回复
     */
    getReplyList(row,type) {
      this.responseTableColumn = []; // 回复内容-表头
      this.responseTableData = []; // 回复内容-表格内容
      console.log(this.responseId,row.id)
      let params = {
        affairsId: type == 'all'?row.id:this.responseId, // 工作安排ID
        // affairsId: row.id, // 工作安排ID
        contactorId: type == 'all'?'':row.appContactorId // 联系人ID，当type为all时是查看所有回复
      }
      // this.$api.getReplyList(data)
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairsReply/getReplyList',
        method: 'get',
        params
      })
      .then(res => {
        if (res.errorcode !== 0) {
          return;
        }
        this.replayForm = res.data
        console.log(this.replayForm)
        if (res.data.replies.length > 0) {
          let responseData = []; // 回复内容
          res.data.replies.forEach((item, index) => {
            let content = JSON.parse(item.content); // 回复内容
            responseData.push(content); // 回复内容
          })
          responseData.forEach((item, index) => {
            for(const key in item) {
              if (item.hasOwnProperty(key)) {
                if (index === 0) {
                  // 回复内容——表头
                  this.responseTableColumn.push({
                    label: key,
                    prop: key,
                  })
                }
              }
            }
          })
          this.responseTableData = responseData; // 回复内容
          console.log('回复内容：', this.responseTableData)
          console.log(this.responseTableColumn,this.responseTableData)
          
        }
        this.per = 24 / this.responseTableColumn.length; // 获取表格每列格数
      })
    },
    /**
     * @createTime: 2021-04-09
     * @author: qinjiaqi
     * @param {Object} 当前行
     * @return {type} undefined
     * @Description: 打开回复内容框
     */
    openReportDialog(row,type){
      console.log(row)
      this.reportDialogShow = true // 显示查看回复弹窗
      this.getReplyList(row,type) // 查看回复
    },
    //表格数据
    getTableData() {
      let params = {
        key: this.searchText,
        page: this.currentPage-1,
        size: this.pageSize
      };

      // this.$api.seeAffairs(params)
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/page',
        method: 'get',
        params
      })
      .then(res => {
        console.log('/app/sjs/affairs/page', res)
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.tableData = res.data.appSjsAffairs;
        this.total = res.data.countAll;
        // 判断是否零报告
        for(var i in res.data.appSjsAffairs){
          // console.log(this.tableData[i].affairsTypeId)
          if(this.tableData[i].affairsTypeId == null){
            this.tableData[i].zeroReportStatus = '是'
          }else{
            this.tableData[i].zeroReportStatus = '否'
          }
        }
        //默认显示第一条数据
        this.$nextTick(() => {
          if (this.tableData.length !== 0) {
            this.$refs.workDetails.showData(res.data.appSjsAffairs[0]);
            this.rowData = res.data.appSjsAffairs[0];
            // 默认选中第一行，第一行高亮
            document.getElementsByTagName('tbody')[0].rows[0].classList.add('current-row')
          } else {
            this.$refs.workDetails.showData(null);
          }
        });
      });
    },
    //页数改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    //每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    //表格点击事件
    handleClick(row, column, event) {
      this.tableData.forEach((item, index) => {
        if (row.id === item.id) {
          document.getElementsByTagName('tbody')[0].rows[index].classList.add('current-row')
        } else {
          document.getElementsByTagName('tbody')[0].rows[index].classList.remove('current-row')
        }
      })
      this.$nextTick(() => {
        this.$refs.workDetails.showData(row);
        this.rowData = row;
      });
      this.clickCaret(row); // 点击行
    },
    //新增零报告
    zeroReport() {
      this.$nextTick(() => {
        this.reportOrWorkVisiable = true;
        this.$nextTick(() => {
          this.$refs.reportOrWork.isDialogVisible = true;
          this.title = "新增零报告";
          this.$refs.reportOrWork.typeId = 373;
        });
        // this.$refs.ContactDetailsPopup.treeData = this.treeData;
      });
    },
    //新增工作安排
    handleAdd() {
      this.$nextTick(() => {
        this.reportOrWorkVisiable = true;
        this.$nextTick(() => {
          this.$refs.reportOrWork.isDialogVisible = true;
          this.title = "新增工作安排";
          this.$refs.reportOrWork.typeId = 373;
        });
        // this.$refs.ContactDetailsPopup.treeData = this.treeData;
      });
    },
    // 类型管理
    typeMangerHandle() {
      this.$nextTick(() => {
        this.$refs.typeManger.isDialogVisible = true;
      });
    },
    //修改工作安排
    handleEdit() {
      if (!this.rowData) {
        this.$message({
          message: "请选中表格中任意行进行修改!",
          type: "warning"
        });
        return;
      }else if (this.rowData.send == 1) {
        this.$message.error("工作安排已下发，不能修改");
        return;
      }
      this.reportOrWorkVisiable = true;
      this.$nextTick(() => {
        this.$refs.reportOrWork.isDialogVisible = true;
        this.title = "修改工作安排";
        this.$refs.reportOrWork.showData(this.rowData);
      });
    },
    //删除工作安排
    handleDelete() {
      if (!this.rowData) {
        this.$message({
          message: "请选中表格中任意行进行删除!",
          type: "warning"
        });
        return;
      }else if (this.rowData.send == 1) {
        this.$message.error("工作安排已下发，无法删除");
        return;
      }
      else {
        let data = {
          id: this.rowData.id
        };
        this.$confirm("删除当前信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // this.$api.delAffairs({ data })
            axios({ //备忘录，查找表格
              url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/deleted',
              method: 'post',
              data
            })
            .then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.getTableData();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!"
            });
          });
      }
    },
    //模糊搜索
    handleSearch() {
      this.currentPage = 1;
      this.getTableData();
    },
    handleAddAtt() {
      this.reportOrWorkVisiable = true;
      this.$nextTick(() => {
        this.$refs.reportOrWork.isDialogVisible = true;
        this.title = "添加附件";
        this.$refs.reportOrWork.showData(this.rowData);
      });
    },
    // 下发
    issueHandle(id) {
      let data = {
        id,
      };
      // this.$api.issue({data})
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/send',
        method: 'post',
        data
      })
      .then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.$message({
          message: "下发成功!",
          type: "success"
        });
        this.getTableData();
      });
    },
    // 查看
    seeHandle(row) {
      // let data = {
      //   id: id,
      // }
      // this.$api.response(data).then(res => {
      //   if (res.errorcode != 0) {
      //     this.$message({
      //       message: res.msg,
      //       type: "error"
      //     });
      //     return;
      //   }

      // });
      this.responseVisiable = true;
      this.responseId = row.id;
      this.$nextTick(() => {
        this.$refs.response.dialogVisible = true;
      }, 1000);
    },
  }
};
</script>

<style scoped>
.navsBar {
  margin: 20px 10px 0;
  height: 56px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
}
.searchButton {
  padding: 10px 11px;
  background-color: #3f92fe !important;
  border-color: #3f92fe !important;
  border-radius: 0 3px 3px 0;
  color: white !important;
  font-size: 18px;
}
/* 功能按钮间距 */
>>> .el-button + .el-button {
  margin-left: 3px;
}

.contentStyle {
  margin-left: 10px;
  margin-top: 10px;
  height: 790px;
  background-color: white;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}

>>> .el-main {
  padding: 0;
}

.buttonGroup {
  float: left;
  margin-top: 24px;
  margin-left: 32px;
}
>>> .el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 20px;
}

.tableContainer {
  height: 744px;
  /* padding: 6px;
    margin-right: 16px;
    border: 1px solid rgba(211, 215, 219, 1); */
}

.tree {
  margin-right: 16px;
  margin-bottom: 24px;
}

>>> .el-table::before {
  height: 0;
}

.pagination {
  margin-top: 16px;
  padding: 0;
  text-align: right;
}

/* 鼠标悬停分页背景色 */
>>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #0091ff;
}

/* 分页宽度样式 */
>>> .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  min-width: 32px;
}

/* 分页高度样式 */
>>> .el-pager li {
  height: 32px;
  line-height: 32px;
}

/* 上一页样式 */
>>> .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(221, 222, 225, 1);
}

/* 下一页样式 */
>>> .el-pagination.is-background .btn-prev {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(221, 222, 225, 1);
}
/* 每页样式 */
>>> .el-pagination.is-background .el-pager li {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(221, 222, 225, 1);
}

/* 每页条数样式 */
>>> .el-input--mini .el-input__inner {
  height: 32px;
  line-height: 32px;
}

/* >>> .el-pagination__jump {
  margin-left: 0;
} */

/* 全局主要按钮未悬停样式 */
>>> .el-button--primary {
  background: #0091ff;
  border-color: #0091ff;
}

/* 全局主要按钮悬停样式 */
>>> .el-button--primary:hover {
  background: #5eadff !important;
  border-color: #5eadff !important;
}

/* 全局主要按钮聚焦样式 */
>>> .el-button--primary:focus {
  background: #2776e0 !important;
  border-color: #2776e0 !important;
}

>>> .el-table__expanded-cell[class*=cell] {
  padding: 0px 0px;
}

.zhuanfa {
  background-image: url("/static/img/msgIcon/zhuanfa.png");
  background-repeat: no-repeat;
  background-size: 14px 14px;
}

.cellPhoneImg{
  display: inline-block;
  width: 22px;
  height: 25px;
  background: url("../../../../static/img/Communihistory/cell.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.cellPhoneImg:hover {
  background: url("../../../../static/img/Communihistory/cell1.png") no-repeat;
  background-size: 100% 100%;
}
/* 查看回复弹窗 */
.responseDialogTable {
  height: 300px;
  overflow: scroll;
}
.responseDialogTable .tableContent {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: rgb(51, 51, 51);
  border-bottom: 1px solid #EBEEF5;
  overflow: hidden;
}
/* 表头 */
.responseDialogTable .th {
  /* font-weight: bold; */
  background: rgb(249, 251, 255);
}
.responseDialogTable .tableContent .el-col {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* 展开表格内容——回复内容 */
.responseBox >>> .el-table td, 
.responseBox >>> .el-table th, 
.responseBox >>> .el-table tr {
  background: #f4f7fb;
  color:#777777;
}
</style>