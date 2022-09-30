<template>
  <div class="areapublishresponse">
    <div class="header">
      <!-- <el-row class="qqtang"> -->
      <span class="header_title">区发布响应</span>

      <!-- 下拉框开始 -->

      <el-select
        v-model="value"
        placeholder="请选择发布状态"
        style="margin-left:32%;margin-right:5px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- 下拉框结束 -->
      <!-- 日期选择开始 -->
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <!-- 日期选择结束 -->
      <!-- 输入框开始 -->
      <el-input
        v-model="input"
        placeholder="请输入响应名称、单位关键字"
        class="inputClass"
      />
      <el-button
        type="primary"
        class="buttonstyle"
        @click="queryresponse"
      >
        查询
      </el-button>

      <!-- 输入框结束 -->

      <el-button
        type="primary"
        style="margin-left:2px;"
        @click="publishresponse"
      >
        发布响应
      </el-button>
      <!-- </el-row> -->
    </div>
    <!-- <el-main> -->
    <div class="content">
      <el-table
        :header-cell-style="{background:'#f1f5ff',textAlign: 'center',height: '60px'}"
        :row-style="{textAlign: 'center',height: '60px', boxSizing: 'border-box'}"
        :cell-style="cellStyle"
        :data="tableData"
        border
        height="calc(100vh - 240px)"
      >
        <el-table-column
          align="center"
          prop="name"
          label="响应名称"
          width="180"
        />
        <el-table-column
          align="center"
          prop="remark"
          label="响应说明"
          width="350"
        />
        <el-table-column
          align="center"
          prop="responseunit"
          label="响应单位"
        />
        <el-table-column
          align="center"
          prop="gmtCreate"
          label="发布时间"
        />
        <el-table-column
          align="center"
          label="状态"
          prop="status"
        >
          <template slot-scope="scope">
            {{ scope.row.status == 1? '已发布': '已停用' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <!-- v-if="nowPlatForm==scope.row.nextPlatformId" -->
            <el-tooltip
              class="item"
              effect="dark"
              content="停用"
              placement="top"
            >
              <img
                v-if="scope.row.status=='1'"
                src="../../../assets/img/qu1.svg"
                style="cursor:pointer"
                class="status"
                @click="handleChangeState(scope.$index,scope.row)"
                @mouseenter="mouseEnterImg('status',scope.$index)"
                @mouseleave="mouseLeaveImg('status',scope.$index)"
              >
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="启用"
              placement="top"
            >
              <img
                v-if="scope.row.status!='1'"
                src="../../../assets/img/qu2.svg"
                style="cursor:pointer"
                class="status"
                @click="handleChangeState(scope.$index,scope.row)"
                @mouseenter="mouseEnterImg('status',scope.$index)"
                @mouseleave="mouseLeaveImg('status',scope.$index)"
              >
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
            >
              <img
                src="../../../assets/img/eye.svg"
                style="cursor:pointer"
                class="eye"
                @click="handleLook(scope.$index,scope.row)"
                @mouseenter="mouseEnterImg('eye',scope.$index)"
                @mouseleave="mouseLeaveImg('eye',scope.$index)"
              >
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <img
                src="../../../assets/img/edit2.svg"
                style="cursor:pointer"
                class="edit"
                @click="handleEdit(scope.$index,scope.row)"
                @mouseenter="mouseEnterImg('edit',scope.$index)"
                @mouseleave="mouseLeaveImg('edit',scope.$index)"
              >
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <img
                src="../../../assets/img/qudel.svg"
                style="cursor:pointer"
                class="del"
                @click="handleDelete(scope.$index,scope.row)"
                @mouseenter="mouseEnterImg('del',scope.$index)"
                @mouseleave="mouseLeaveImg('del',scope.$index)"
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-main> -->

      <!-- <el-footer> -->
      <div class="page">
        <el-pagination
          :current-page="currPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total,  prev, pager, next, sizes,jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- </el-footer> -->
    </div>
    <!-- 新增等级响应的弹框 -->
    <div class="dialogheaderstyle">
      <el-dialog
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form">
          <el-form-item
            label="响应名称:"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.responsename"
              autocomplete="off"
              class="inputname"
            />
          </el-form-item>
          <el-form-item
            label="响应周期:"
            :label-width="formLabelWidth"
          >
            <!-- 日期选择开始 -->
            <el-date-picker
              v-model="form.responseDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <!-- 日期选择结束 -->
          </el-form-item>
          <el-form-item
            label="响应说明:"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.responsedesc"
              type="textarea"
              resize="none"
              :rows="5"
            />
          </el-form-item>
          <el-form-item
            label="响应单位:"
            style="margin-bottom:0"
            :label-width="formLabelWidth"
          >
            <!-- <el-button type="primary" class="buttonstyle" @click="chooseResponseUnit">选择响应单位</el-button> -->
            <el-button
              class="select_response_unit_button"
              @click="chooseResponseUnit"
            >
              <span class="crossArrow">+</span>选择响应单位
            </el-button>
          </el-form-item>
          <el-form-item>
            <!-- <el-scrollbar>
              <div class="responseunit">
                <template v-if="unitArray.length !== 0">
                  <el-button plain v-for="(item,index) in unitArray" :key="index">
                    {{item.platformName}}
                    <i class="el-icon-close" @click="deleteUnit(item.id)"></i>
                  </el-button>
                </template>
                <div v-else>暂无响应单位</div>
              </div>
            </el-scrollbar>-->
            <div class="responseunit">
              <template v-if="unitArray.length !== 0">
                <span
                  v-for="(item,index) in unitArray"
                  :key="index"
                  class="responseunit_showUnit"
                >
                  {{ item.platformName }}
                  <span
                    class="delect-error"
                    @click="deleteUnit(item.id)"
                  >×</span>
                </span>
              </template>
            </div>
          </el-form-item>
          <!-- 上传附件 -->
          <el-form-item
            label="附件:"
            :label-width="formLabelWidth"
          >
            <el-upload
              action
              class="upload-demo"
              :auto-upload="false"
              :on-change="uploadFile"
              multiple
              :limit="5"
              :file-list="fileList"
            >
              <el-button class="uploadbutton">
                <span class="crossArrow">+</span>点击上传
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <template slot="title">
          <div class="titleStyle">
            新增等级响应
          </div>
        </template>
        <!-- <div slot="footer" class="dialog-footer"> -->
        <div slot="footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            class="buttonstyle"
            @click="confirmAddResponse"
          >
            确认
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 新增等级响应弹框结束 -->
    <!-- 查看等级响应弹框 -->
    <div class="queryresponsedialog">
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="1060px"
        :close-on-click-modal="closeClickModal"
        @close="closeWatchDialog"
      >
        <template slot="title">
          <div
            class="titleStyle"
            style="margin-left:-10px"
          >
            查看等级响应
          </div>
        </template>
        <div class="formcontent">
          <el-form
            ref="ruleForm"
            status-icon
            label-width="100px"
            class="demo-ruleForm"
            style="background-color:#F5F8FF;"
          >
            <el-form-item>
              <img src="../../../assets/img/tip5.svg">
              <el-form-item
                label="响应说明："
                style="margin-top:-35px"
              >
                {{ remark }}
              </el-form-item>
            </el-form-item>
            <el-form-item
              label="附件："
              style="margin-left:3px"
            >
              <a
                v-for="(item,index) in fileArr"
                :key="index"
                :href="item.url"
                :download="item.documentName"
              >{{ item.documentName }}</a>
            </el-form-item>
          </el-form>
        </div>
        <el-header style="margin-top: 20px;text-align: center;border-bottom: 1px solid #E9ECF1">
          <div class="changebutton">
            <el-radio-group
              v-model="radio1"
              @change="changeshowcontent"
            >
              <el-radio-button label="响应情况" />
              <el-radio-button label="监督整改" />
            </el-radio-group>
          </div>
        </el-header>
        <!-- 响应情况内容 -->
        <div
          v-if="isResponseShow"
          class="responsecondition"
        >
          <el-container>
            <!-- 侧边栏部分 -->
            <el-aside style="width:32%;height:800px;padding: 0 10px;">
              <div class="asidecontent">
                <el-input
                  v-model="responsename"
                  placeholder="请输入平台名称或响应负责人进行查询"
                  prefix-icon="el-icon-search"
                  style="marginTop:12px"
                  @change="responseConditionQuery"
                />

                <!-- 日期选择开始 -->
                <el-date-picker
                  v-model="responsetime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="responseConditionQuery"
                />
                <!-- 日期选择结束 -->
                <!-- <el-button
                  type="primary"
                  style="width:320px;margin:10px 5px"
                  @click="queryResponseMany"
                >筛选</el-button>
                <div class="line"></div>-->
                <div class="responseNumber">
                  <span>
                    响应单位数：
                    <b>{{ responseUnitsNumber }}/{{ this.unitlist? this.unitlist.length : 0 }}</b>
                  </span>
                  <span>
                    响应人数：
                    <b>{{ responseTotalNumber }}</b>
                  </span>
                </div>
                <div class="chooseunit">
                  <ul style="list-style:none;padding:0;">
                    <li
                      :class="{active: allChecked}"
                      class="listyle"
                      @click="checkAllUnit"
                    >
                      全部单位
                    </li>
                    <li
                      v-for="(item,index) in unitlist"
                      :key="index"
                      :class="{active: currentindex == index}"
                      class="listyle"
                      @click="changeunit(index,item.id,item)"
                    >
                      {{ item.name }}
                      <b
                        v-if="item.arr.length != 0"
                        class="green_button"
                      >已响应</b>
                      <b
                        v-else
                        class="gray_button"
                      >未响应</b>
                    </li>
                  </ul>
                </div>
              </div>
            </el-aside>
            <!-- 侧边栏结束 -->
            <!-- 主体部分 -->
            <el-main
              style="width:95%;height:800px;padding-left:5px;padding-top:15px;padding-right:15px"
            >
              <div class="responsecontainer">
                <!-- 响应块 -->
                <div
                  v-for="(item,index) in responseContentList"
                  :key="index"
                  class="responseline"
                >
                  <div class="responseslide">
                    <!-- 响应内容 -->
                    <div class="responsemaincontent">
                      <el-row
                        style="background-color:#F0F6FF;height:50px;line-height:50px;margin-top:0px"
                      >
                        <span
                          style="left:0;background-color:#9CC6FE;color:#FFFFFF;font-size:16px;margin-left:0px;display:inline-block;width:45px;text-align: center;"
                        >响应</span>

                        <span
                          style="margin-left:20px;color:#555555;font-weight:bold"
                        >{{ item.gmtCreate }}</span>
                        <span
                          style="position:absolute;right:10px;color:#555555;font-weight:bold"
                        >响应单位： {{ item.platformName }}</span>
                      </el-row>
                      <el-row class="rowstyle">
                        响应人数：
                        <span style="color:#555555">{{ item.responNum?item.responNum:0 }}人</span>
                      </el-row>
                      <el-row class="rowstyle">
                        响应负责人：
                        <a href="#">{{ item.person }} ({{ item.personPhone }})</a>
                      </el-row>
                      <el-row class="rowstyle">
                        响应情况：
                        <span style="color:#555555">{{ item.remark }}</span>
                      </el-row>
                      <el-row class="rowstyle">
                        <viewer>
                          <img
                            v-for="(item2,index2) in item.documentVoList"
                            :key="index2"
                            :src="item2.allUrl"
                            alt
                            class="imgstyle"
                          >
                        </viewer>
                      </el-row>
                    </div>
                  </div>
                </div>
                <!-- 响应块结束 -->

                <!--    UI没有，暂时注释
         <el-pagination
      @size-change="handleResponseSizeChange"
      @current-change="handleResponseCurrentChange"
      :current-page="responsecurrPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="responsepageSize"
      layout="total,  prev, pager, next, sizes,jumper"
      :total="responsetotalCount">
                </el-pagination>-->
              </div>
            </el-main>
          </el-container>
          <!-- 主体结束 -->
        </div>
        <!-- 响应情况结束 -->
        <!-- 监督整改内容开始 -->
        <div
          v-else
          class="supervisioncontent"
        >
          <el-container>
            <!-- 侧边栏部分 -->
            <el-aside
              style="width: 479px;height: 937px;padding: 15px 10px;box-sizing: border-box;"
              class="asidestyle"
            >
              <!-- 侧边栏切换 -->
              <!--
              * @Author: liukanglin
              * @Date: 2020-09-07
              -->
              <div class="aside_option">
                <div
                  :class="showall == '全部'?'aside_option_active':''"
                  @click="changeSuperviseStatus('全部')"
                >
                  全部
                  <span />
                </div>
                <div
                  :class="showall == '待整改'?'aside_option_active':''"
                  @click="changeSuperviseStatus('待整改')"
                >
                  待整改
                  <span />
                </div>
                <div
                  :class="showall == '已整改'?'aside_option_active':''"
                  @click="changeSuperviseStatus('已整改')"
                >
                  已整改
                  <span />
                </div>
              </div>
              <div
                v-for="(item,index) in superviseList"
                :key="index"
                class="supervisionall"
                @click="querySuperviseDetail(item.id)"
              >
                <el-row
                  style="height: 50px;background-color: #F0F6FF;font-size: 14px;padding-left:25px;line-height: 50px"
                >
                  <el-col :span="8">
                    {{ item.name }}
                  </el-col>
                  <el-col
                    :span="8"
                    :offset="8"
                  >
                    {{ item.gmtCreate }}
                  </el-col>
                </el-row>
                <el-row class="rowstyle">
                  整改说明：
                  <span style="color:#555555">{{ item.remark }}</span>
                </el-row>
                <el-row class="rowstyle">
                  整改单位：
                  <span style="color:#555555">{{ item.superviseUnit }}</span>
                </el-row>
                <el-row
                  v-for="(imgitem,index) in item.documentVoList"
                  :key="index"
                  class="rowstyle"
                >
                  <viewer>
                    <img
                      :src="imgitem.allUrl"
                      alt
                      class="supervisionimgstyle"
                    >
                  </viewer>
                </el-row>
                <div style="position:absolute;left:330px;top:115px">
                  <img
                    v-if="item.status === 0"
                    style="width:100px"
                    src="../../../assets/img/daizg.svg"
                  >
                  <img
                    v-if="item.status !== 0"
                    style="width:100px"
                    src="../../../assets/img/yizg.svg"
                  >
                </div>
              </div>

              <!--<el-pagination
      @size-change="handleSuperviseSizeChange"
      @current-change="handleSuperviseCurrentChange"
      :current-page="SupervisecurrPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="SupervisepageSize"
      layout="total,  prev, pager, next, sizes,jumper"
      :total="SupervisetotalCount">
              </el-pagination>-->
            </el-aside>
            <!-- 侧边栏部分结束 -->
            <!-- 主体部分 -->

            <el-main
              style="width: 878px;height: 939px;border-left:1px solid #d7d7d7;box-sizing:border-box;padding-left: 20px;padding-right:0px!important"
            >
              <div class="dage">
                整改部门
              </div>
              <div
                v-for="(item,index) in superviseDetailList"
                :key="index"
                class="supervisionright"
              >
                <div
                  v-if="item.id != superviseId"
                  class="rightcontent"
                >
                  <el-row style="margin-top: 8px;margin-bottom:8px">
                    <span style="color:#666666">{{ item.platformString }}</span>
                    <span style="color:#999999;padding-left:10px">{{ item.gmtCreate }}</span>
                  </el-row>
                  <div class="box_row">
                    <el-row class="rowstyle">
                      整改情况：
                      <span style="color:#555555">{{ item.remark }}</span>
                    </el-row>
                    <el-row class="rowstyle">
                      整改负责人：
                      <a href="#">{{ item.handerPeople }} ({{ item.peoplePhone }})</a>
                    </el-row>
                    <el-row class="rowstyle">
                      <viewer>
                        <img
                          v-for="(imgitem,index) in item.documentVos"
                          :key="index"
                          :src="imgitem.allUrl"
                          alt
                          class="imgstyle"
                        >
                      </viewer>
                    </el-row>
                  </div>
                  <div style="clear:both;" />
                </div>
                <div
                  v-else
                  class="rightcontent"
                >
                  <el-row style="margin-top:8px;padding-left:400px">
                    <span style="color:#999999;font-size:14px">{{ item.gmtCreate }}</span>
                    <span
                      style="color#555555;font-size:17px;padding-left:10px"
                    >{{ item.platformString }}</span>
                  </el-row>
                  <div
                    style="width: 702px;height: 287px;border: 1px solid #d7d7d7;padding: 0px;
                                box-sizing: border-box;border-radius: 5px;position: relative;
                                margin-left: 114px;background-color:#9FC8FE"
                  >
                    <el-row class="rowstyle">
                      整改情况：
                      <span style="color:#555555">{{ item.remark }}</span>
                    </el-row>
                    <el-row class="rowstyle">
                      整改负责人：
                      <a href="#">{{ item.handerPeople }} ({{ item.peoplePhone }})</a>
                    </el-row>
                    <el-row class="rowstyle">
                      <viewer>
                        <img
                          v-for="(imitem,index) in item.documentVos"
                          :key="index"
                          :src="imitem.allUrl"
                          alt
                          class="imgstyle"
                        >
                      </viewer>
                    </el-row>
                  </div>
                  <div style="clear:both;" />
                </div>
              </div>
            </el-main>

            <!-- 主体部分结束 -->
          </el-container>
        </div>
        <!-- 监督整改内容结束 -->
      </el-dialog>
    </div>
    <!-- 查看等级弹框结束 -->
    <!-- 修改等级响应的弹框 -->
    <div class="dialogheaderstyle">
      <el-dialog
        :visible.sync="changeResponsedialogFormVisible"
        :close-on-click-modal="closeClickModal"
      >
        <el-form :model="responseform">
          <el-form-item
            label="响应名称:"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="responseform.responsename"
              autocomplete="off"
              class="inputname"
            />
          </el-form-item>
          <el-form-item
            label="响应说明:"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="responseform.responsedesc"
              type="textarea"
              resize="none"
              :rows="5"
            />
          </el-form-item>
          <el-form-item
            label="响应单位:"
            style="margin-bottom:0"
            :label-width="formLabelWidth"
          >
            <el-button
              class="select_response_unit_button"
              @click="chooseResponseUnit"
            >
              <span class="crossArrow">+</span>选择响应单位
            </el-button>
          </el-form-item>
          <el-form-item>
            <!-- <el-scrollbar>
              <div class="responseunit">
                <template v-if="unitArray.length !== 0">
                  <el-button plain v-for="(item,index) in unitArray" :key="index">
                    {{item.platformName}}
                    <i
                      style="padding-left:5px"
                      class="el-icon-close"
                      @click="deleteUnit(item.id)"
                    ></i>
                  </el-button>
                </template>
                <div v-else>暂无响应单位</div>
              </div>
            </el-scrollbar>-->
            <div class="responseunit">
              <template v-if="unitArray.length !== 0">
                <span
                  v-for="(item,index) in unitArray"
                  :key="index"
                  class="responseunit_showUnit"
                >
                  {{ item.platformName }}
                  <span
                    class="delect-error"
                    @click="deleteUnit(item.id)"
                  >×</span>
                </span>
              </template>
            </div>
          </el-form-item>
          <!-- 上传附件 -->
          <el-form-item
            label="附件:"
            :label-width="formLabelWidth"
          >
            <el-upload
              action
              class="upload-demo"
              :auto-upload="false"
              :on-change="uploadFile"
              multiple
              :limit="5"
              :file-list="fileList"
            >
              <el-button class="uploadbutton">
                <span class="crossArrow">+</span>点击上传
              </el-button>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item
            :label="fileitem.filename"
            :label-width="formLabelWidth"
            v-for="(fileitem,index) in existFile"
            :key="index"
          >
            <img style="width:100px" :src="fileitem.fileurl" alt />
          </el-form-item>-->
          <el-form-item
            v-for="(fileitem,index) in existFile"
            :key="index"
            :label-width="formLabelWidth"
          >
            <div>{{ fileitem.filename }}</div>
            <img
              style="width:100px"
              :src="fileitem.fileurl"
              alt
            >
          </el-form-item>
        </el-form>
        <template slot="title">
          <div
            class="titleStyle"
            style="margin-left:20px"
          >
            修改等级响应
          </div>
        </template>
        <div slot="footer">
          <el-button @click="changeResponsedialogFormVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            class="buttonstyle"
            @click="UpdateResponse"
          >
            确认
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改等级响应弹框结束 -->
    <!-- 选择响应单位弹框 -->
    <el-dialog
      title="选择响应单位"
      :visible.sync="chooseUnitDialogVisible"
      width="30%"
      :close-on-click-modal="closeClickModal"
    >
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />

      <el-tree
        ref="tree"
        class="filter-tree"
        :data="unitdata"
        :props="defaultProps"
        :default-expand-all="false"
        :filter-node-method="filterNode"
        show-checkbox
        node-key="id"
        check-strictly
        @check-change="getCheckedNode"
      />
      <span slot="footer">
        <el-button @click="chooseUnitDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmUnit"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择响应单位弹框结束 -->
  </div>
</template>
<script>
export default {
  name: 'Areapublishresponse',
  components: {},
  data() {
    return {
      throttleFlag: true, // 防止多次点击
      closeClickModal: false, // 禁止点击model关闭dialog
      responsestatus: '0', // 响应状态
      existFile: [], // 编辑响应完整的文件已存在
      existFileName: [], // 编辑响应已经存在的文件名
      existFileStr: [], // 编辑响应已经存在的文件路径
      responseUnitArray: [], // 编辑响应单位列表
      responseform: {
        responsename: '',
        responsedesc: '',
      }, // 修改等级响应的表单
      changeResponsedialogFormVisible: false, // 控制修改等级响应的显示与隐藏
      SupervisecurrPage: 0,
      SupervisepageSize: 0,
      SupervisetotalCount: 0,
      superviseId: 0, // 左侧监督整改的id
      superviseDetailList: [], // 右侧监督整改详情
      superviseList: [], // 整改列表
      play: false, // 控制已发布的状态
      pause: false, // 控制已停用的状态
      responseContentList: [], // 响应内容列表
      responseid: 0, // 响应的id
      responseUnitId: '', // 响应单位的id
      allChecked: true, // 点击全部单位是否添加样式
      remark: '', // 响应说明
      fileArr: [], // 文件列表
      filename: [], // 文件实际名
      filestr: [], // 文件实际路径
      fileList: [], // 上传的文件列表
      unitArray: [],
      chooseUnitDialogVisible: false, // 选择响应单位弹框是否可见
      filterText: '', // 响应单位过滤
      unitdata: [], // 响应单位队列
      defaultProps: {
        children: 'children',
        label: 'platformName',
      }, // 默认设置
      totalCount: 0, // 总条数
      pageSize: 0, // 每页显示的条数
      totalPage: 0, // 总页数，
      currPage: 0, // 当前页数
      responsetotalCount: 0, // 响应内容总条数
      responsepageSize: 0, // 响应内容每页显示的条数
      responsetotalPage: 0,
      responsecurrPage: 0, // 响应当前页数
      responseTotalNumber: 0, // 响应人数
      responseUnitsNumber: 0, // 响应单位数
      options: [
        {
          value: '0',
          label: '已停用',
        },
        {
          value: '1',
          label: '已发布',
        },
        {
          value: '',
          label: '全部',
        },
      ],
      value: '', // 选择框默认值
      value1: [], // 日期选择器默认值
      input: '', // 输入框的值
      tableData: [],
      dialogFormVisible: false, // 控制新增等级响应弹框的显示隐藏
      form: {
        // 表单数据
        responsename: '',
        responsedesc: '',
        responseDate: [],
      },
      formLabelWidth: '120px', // 控制表单标签的宽度
      centerDialogVisible: false, // 控制查看等级响应的弹框
      radio1: '响应情况', // 控制图标切换
      isResponseShow: true, // 控制响应情况内容是否展示
      responsename: '', // 响应单位、单位负责人关键字
      responsetime: '', // 响应日期
      tabPosition: 'left', // 控制tab栏的显示方向
      unitlist: [], // 响应单位列表
      currentindex: -1, // 响应单位的默认选中的下标
      showall: '全部', // 监督整改选择全部或者待整改
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.$http({
      url: this.$http.adornUrl('/level/levelPublish/list'),
      method: 'post',
      data: this.$http.adornData({
        status: this.value,
        search: '',
        page: 1,
        limit: 10,
        startTime: '',
        endTime: '',
        type: 1,
      }),
    }).then(({ data }) => {
      if (data && data.code === 0) {
        this.init(data);
      }
    });
  },
  methods: {
    /**
     * @description: 关闭查看弹窗
     * @param {*}
     * @return {*}
     */
    closeWatchDialog() {
      // 清空响应单位的id
      this.responseUnitId = '';
      // 默认设置一开始打开全部单位被选中
      this.allChecked = true;
    },
    // 鼠标移入事件
    mouseEnterImg(val, index) {
      if (val == 'edit') {
        document
          .getElementsByClassName('edit')
          [index].setAttribute('src', require('../../../assets/img/edit.svg'));
      }
      if (val == 'del') {
        document
          .getElementsByClassName('del')
          [index].setAttribute('src', require('../../../assets/img/del.svg'));
      }
      if (val == 'eye') {
        document
          .getElementsByClassName('eye')
          [index].setAttribute('src', require('../../../assets/img/eye2.svg'));
      }
      if (val == 'status') {
        if (this.tableData[index].status == 0) {
          document
            .getElementsByClassName('status')
            [index].setAttribute('src', require('../../../assets/img/qu3.svg'));
        } else {
          document
            .getElementsByClassName('status')
            [index].setAttribute(
              'src',
              require('../../../assets/img/status_start_active.svg'),
            );
        }
      }
    },
    // 鼠标离开事件
    mouseLeaveImg(val, index) {
      if (val == 'edit') {
        document
          .getElementsByClassName('edit')
          [index].setAttribute('src', require('../../../assets/img/edit2.svg'));
      }
      if (val == 'del') {
        document
          .getElementsByClassName('del')
          [index].setAttribute('src', require('../../../assets/img/del2.svg'));
      }
      if (val == 'eye') {
        document
          .getElementsByClassName('eye')
          [index].setAttribute('src', require('../../../assets/img/eye.svg'));
      }
      if (val == 'status') {
        if (this.tableData[index].status == 0) {
          document
            .getElementsByClassName('status')
            [index].setAttribute('src', require('../../../assets/img/qu2.svg'));
        } else {
          document
            .getElementsByClassName('status')
            [index].setAttribute(
              'src',
              require('../../../assets/img/status_start.svg'),
            );
        }
      }
    },
    init(data) {
      let tablelist = [];
      const responseUnit = '';
      let responseUnitArr = [];
      console.log('块出来：', data);
      tablelist = data.page.list;
      tablelist.forEach((item, index) => {
        responseUnitArr = [];
        if (item.platformList != null) {
          item.platformList.forEach((item2, index) => {
            responseUnitArr.push(item2.platformName);
          });
        }
        // console.log("responseUnitARR", responseUnitArr.toString());
        item.responseunit = responseUnitArr.join('、');
      });
      console.log('tablelist', tablelist);
      this.tableData = tablelist;
      this.totalCount = data.page.totalCount; // 总条数
      this.pageSize = data.page.pageSize; // 每页显示的条数
      this.totalPage = data.page.totalPage; // 总页数，
      this.currPage = data.page.currPage; //
    },
    UpdateResponse() {
      console.log('单位列表为', this.$store.state.responseUnit.unitArr);
      const unitArray = [];
      const treeArr = this.$store.state.responseUnit.unitArr;
      if (treeArr.length === 0) {
        this.$message.error('请选择响应单位');
        return;
      }
      treeArr.forEach((item) => {
        unitArray.push(item.id);
      });
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/update'),
        method: 'post',
        data: this.$http.adornData({
          id: this.responseid,
          name: this.responseform.responsename,
          remark: this.responseform.responsedesc,
          status: this.responsestatus,
          fileName: this.existFileName.concat(this.filename),
          fileUrl: this.existFileStr.concat(this.filestr),
          unitIds: unitArray,
        }),
      }).then(({ data }) => {
        console.log('更新响应为', data);
        if (data && data.code === 0) {
          this.changeResponsedialogFormVisible = false;
          this.$http({
            url: this.$http.adornUrl('/level/levelPublish/list'),
            method: 'post',
            data: this.$http.adornData({
              status: this.value,
              search: '',
              page: 1,
              limit: 10,
              startTime: '',
              endTime: '',
              type: 1,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.init(data);
            }
          });
        }
      });
    },
    handleSuperviseSizeChange(val) {
      this.SupervisepageSize = val;
      this.$http({
        url: this.$http.adornUrl('/levelRectifyPublish/selectPageList'),
        method: 'post',
        data: this.$http.adornData({
          status: '',
          page: this.SupervisecurrPage,
          limit: this.SupervisepageSize,
          search: '',
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        let platformList = [];
        console.log('监督整改数据为', data);
        this.SupervisecurrPage = data.data.currPage;
        this.SupervisepageSize = data.data.pageSize;
        this.SupervisetotalCount = data.data.totalCount;
        data.data.list.forEach((item, index) => {
          platformList = [];
          item.platformList.forEach((platitem, index) => {
            platformList.push(platitem.platformName);
          });
          item.superviseUnit = platformList.join('、');
        });
        this.superviseList = data.data.list;
      });
    },
    handleSuperviseCurrentChange(val) {
      this.SupervisecurrPage = val;
      this.$http({
        url: this.$http.adornUrl('/levelRectifyPublish/selectPageList'),
        method: 'post',
        data: this.$http.adornData({
          status: '',
          page: this.SupervisecurrPage,
          limit: this.SupervisepageSize,
          search: '',
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        let platformList = [];
        console.log('监督整改数据为', data);
        this.SupervisecurrPage = data.data.currPage;
        this.SupervisepageSize = data.data.pageSize;
        this.SupervisetotalCount = data.data.totalCount;
        data.data.list.forEach((item, index) => {
          platformList = [];
          item.platformList.forEach((platitem, index) => {
            platformList.push(platitem.platformName);
          });
          item.superviseUnit = platformList.join('、');
        });
        this.superviseList = data.data.list;
      });
    },
    downloadFile(filename, fileurl) {
      console.log('filenameurl', filename, fileurl);
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/dowload/file'),
        method: 'get',
        //  headers:{
        //    'Access-Control-Allow-Origin': '*',
        //    'Cookie':null
        //  },
        params: this.$http.adornParams({
          fileName: filename,
          fileUrl: fileurl,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.info('下载成功');
        }
      });
    },
    querySuperviseDetail(id) {
      // 查询右侧部门信息
      this.superviseId = id;
      this.$http({
        url: this.$http.adornUrl('/level/levelRectifyInfo/selectPagelist'),
        method: 'post',
        data: this.$http.adornData({
          publishId: id,
        }),
      }).then(({ data }) => {
        console.log('右侧列表数据为', data);
        this.superviseDetailList = data.data;
      });
    },
    checkAllUnit() {
      this.allChecked = true;
      this.currentindex = -1;
    },
    // 根据不同的状态获取不同的数据列表
    changeSuperviseStatus(type) {
      this.showall = type;
      if (this.showall == '待整改') {
        this.$http({
          url: this.$http.adornUrl('/levelRectifyPublish/selectPageList'),
          method: 'post',
          data: this.$http.adornData({
            status: '0',
            page: 1,
            limit: 10,
            search: '',
            publishId: this.responseid,
          }),
        }).then(({ data }) => {
          let platformList = [];
          console.log('监督整改数据为', data);
          data.data.list.forEach((item, index) => {
            platformList = [];
            item.platformList.forEach((platitem, index) => {
              platformList.push(platitem.platformName);
            });
            item.superviseUnit = platformList.join('、');
          });
          this.superviseList = data.data.list;
        });
      }
      if (this.showall == '已整改') {
        this.$http({
          url: this.$http.adornUrl('/levelRectifyPublish/selectPageList'),
          method: 'post',
          data: this.$http.adornData({
            status: '1',
            page: 1,
            limit: 10,
            search: '',
            publishId: this.responseid,
          }),
        }).then(({ data }) => {
          let platformList = [];
          console.log('监督整改数据为', data);
          data.data.list.forEach((item, index) => {
            platformList = [];
            item.platformList.forEach((platitem, index) => {
              platformList.push(platitem.platformName);
            });
            item.superviseUnit = platformList.join('、');
          });
          this.superviseList = data.data.list;
        });
      }
      if (this.showall == '全部') {
        this.$http({
          url: this.$http.adornUrl('/levelRectifyPublish/selectPageList'),
          method: 'post',
          data: this.$http.adornData({
            status: '',
            page: 1,
            limit: 10,
            search: '',
            publishId: this.responseid,
          }),
        }).then(({ data }) => {
          let platformList = [];
          console.log('监督整改数据为', data);
          data.data.list.forEach((item, index) => {
            platformList = [];
            item.platformList.forEach((platitem, index) => {
              platformList.push(platitem.platformName);
            });
            item.superviseUnit = platformList.join('、');
          });
          this.superviseList = data.data.list;
        });
      }
    },
    queryResponseMany() {
      this.$http({
        url: this.$http.adornUrl('/level/levelResponseInfor/list'),
        method: 'post',
        data: this.$http.adornData({
          publishId: this.responseid,
          search: this.responsename,
          page: this.responsecurrPage,
          limit: this.responsepageSize,
          startIime: this.responsetime[0] ? this.responsetime[0] : '',
          endTime: this.responsetime[1] ? this.responsetime[1] : '',
          platformId: this.responseUnitId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('点击某一项获得的数据为', data);
          this.responsetotalCount = data.data.totalCount;
          this.responsepageSize = data.data.pageSize;
          this.responsecurrPage = data.data.currPage;
          this.responsetotalPage = data.data.totalPage;
          this.responseContentList = data.data.list;
        }
      });
    },
    chooseResponseUnit() {
      // 选择响应单位
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/selectSonPlatforms'),
        method: 'get',
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data);
          this.unitdata = data.data;
        }
      });
      this.$store.commit('responseUnit/resetArr', []);
      this.chooseUnitDialogVisible = true;
    },
    handleResponseSizeChange(pageSize) {
      this.ResponsepageSize = pageSize;
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/getUnitAndResponse'),
        method: 'post',
        data: this.$http.adornData({
          serach: '',
          startTime: '',
          endTime: '',
          page: this.responsecurrPage,
          limit: pageSize,
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        console.log('查看等级响应的数据为', data);
        let fileOldArr = [];
        // let filename = data.LevelPublish.fileName? data.LevelPublish.fileName:[]
        // let fileurl = data.LevelPublish.fileUrl? data.LevelPublish.fileUrl:[]

        this.remark = data.LevelPublish.remark;
        // filename.forEach((item,index) => {
        //     fileOldArr.push({"filename": filename[index],"fileurl": fileurl[index]})
        // })
        fileOldArr = data.LevelPublish.publishDocumentList;
        console.log('fileOldArr', fileOldArr);
        this.fileArr = fileOldArr;
        this.unitlist = data.platformList.map((item) => ({ id: item.id, name: item.platformName }));
      });
    },
    handleResponseCurrentChange(currentpage) {
      this.responsecurrPage = currentpage;
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/getUnitAndResponse'),
        method: 'post',
        data: this.$http.adornData({
          serach: '',
          startTime: '',
          endTime: '',
          page: currentpage,
          limit: this.responsepageSize,
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        console.log('查看等级响应的数据为', data);
        let fileOldArr = [];
        // let filename = data.LevelPublish.fileName? data.LevelPublish.fileName:[]
        // let fileurl = data.LevelPublish.fileUrl? data.LevelPublish.fileUrl:[]
        this.remark = data.LevelPublish.remark;
        // filename.forEach((item,index) => {
        //     fileOldArr.push({"filename": filename[index],"fileurl": fileurl[index]})
        // })
        fileOldArr = data.LevelPublish.publishDocumentList;
        console.log('fileOldArr', fileOldArr);
        this.fileArr = fileOldArr;
        this.unitlist = data.platformList.map((item) => ({ id: item.id, name: item.platformName }));
      });
    },
    handleSizeChange(pageSize) {
      console.log('每页大小', pageSize);
      this.pageSize = pageSize;
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/list'),
        method: 'post',
        data: this.$http.adornData({
          status: this.value,
          search: '',
          page: this.currPage,
          limit: pageSize,
          startIime: '',
          endTime: '',
          type: 1,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.init(data);
        }
      });
    },
    handleCurrentChange(currentpage) {
      console.log('page', currentpage);
      this.currPage = currentpage;
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/list'),
        method: 'post',
        data: this.$http.adornData({
          status: this.value,
          search: '',
          page: currentpage,
          limit: this.pageSize,
          startTime: '',
          endTime: '',
          type: 1,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.init(data);
        }
      });
    },
    getCheckedNode() {},
    deleteUnit(id) {
      console.log('id', id);
      this.$store.commit('responseUnit/deteteUnit', id);
    },
    confirmUnit() {
      // 响应单位确认
      const arr = this.$refs.tree.getCheckedNodes();
      console.log('treearr', arr);

      this.$store.commit('responseUnit/addUnit', arr);
      this.unitArray = this.$store.state.responseUnit.unitArr;
      console.log('unitArray', this.unitArray);
      this.chooseUnitDialogVisible = false;
    },
    uploadFile(file, fileList) {
      const fileNewList = [];
      fileList.forEach((item) => {
        fileNewList.push(item.raw);
      });
      const formData = new FormData();
      fileNewList.forEach((item) => {
        formData.append('files', item);
      });
      //  formData.append('files',fileNewList)
      console.log('fileNewList', fileNewList);
      console.log('fileList', fileList);
      console.log('file', file);
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/upload//file'),
        headers: {
          'content-type': 'multipart/form-data',
        },
        processData: false,
        method: 'post',
        data: formData,
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.filename = data.fileName;
          this.filestr = data.filestr;
        } else {
          this.$message.error('上传文件失败');
        }
        console.log('文件数据为', data);
      });
    },
    confirmAddResponse() {
      // 确认新增等级响应
      console.log('响应单位列表为', this.$store.state.responseUnit.unitArr);
      const unitids = this.$store.state.responseUnit.unitArr.map((item) => ({ id: item.id }));
      if (unitids.length == 0) {
        this.$message.error('添加失败，请选择响应单位');
        return;
      }
      const unitNewids = [];
      unitids.forEach((item) => {
        unitNewids.push(item.id);
      });
      console.log('unitids', unitids);
      // 防止多次点击
      if (!this.throttleFlag) {
        return;
      }
      this.throttleFlag = false;
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/save'),
        method: 'post',
        data: this.$http.adornData({
          name: this.form.responsename,
          remark: this.form.responsedesc,
          fileUrl: this.filestr ? this.filestr : [],
          fileName: this.filename ? this.filename : [],
          unitIds: unitNewids,
          status: 1,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$store.commit('responseUnit/resetArr', []);
          this.unitArray = [];
          this.dialogFormVisible = false;
          this.throttleFlag = true;
          this.$message.info('新增成功');
          this.$http({
            url: this.$http.adornUrl('/level/levelPublish/list'),
            method: 'post',
            data: this.$http.adornData({
              status: this.value,
              search: '',
              page: 1,
              limit: 10,
              startTime: '',
              endTime: '',
              type: 1,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.init(data);
            }
          });
        } else {
          this.$message.error('新增失败请重试');
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.platformName.indexOf(value) !== -1;
    },
    handleChangeState(index, row) {
      console.log('改变状态', index, row);
      this.$http({
        url: this.$http.adornUrl(
          `/level/levelPublish/updateSatus/${row.id}/${row.status}`,
        ),
        method: 'get',
        data: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$http({
            url: this.$http.adornUrl('/level/levelPublish/list'),
            method: 'post',
            data: this.$http.adornData({
              status: this.value,
              search: '',
              page: 1,
              limit: 10,
              startTime: '',
              endTime: '',
              type: 1,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.init(data);
            }
          });
        }
      });
    },
    handleLook(index, row) {
      this.responseTotalNumber = 0; // 先将响应人数重新设置为0
      this.responseUnitsNumber = 0; // 先将响应单位数重新设置为0
      this.responsename = '';
      this.responsetime = '';
      this.fileList = [];
      this.responseid = row.id;
      console.log('rowid', row, row.id);
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/getUnitAndResponse'),
        method: 'post',
        data: this.$http.adornData({
          serach: '',
          startTime: '',
          endTime: '',
          page: 1,
          limit: 10,
          publishId: row.id,
        }),
      }).then(({ data }) => {
        console.log('查看等级响应的数据为', data);
        let fileOldArr = [];
        // let filename = data.LevelPublish.fileName? data.LevelPublish.fileName:[]
        // let fileurl = data.LevelPublish.fileUrl? data.LevelPublish.fileUrl:[]
        this.remark = data.LevelPublish.remark;
        // filename.forEach((item,index) => {
        //     fileOldArr.push({"filename": filename[index],"fileurl": fileurl[index]})
        // })
        fileOldArr = data.LevelPublish.publishDocumentList;
        console.log('fileOldArr', fileOldArr);
        this.fileArr = fileOldArr;
        // this.unitlist = data.platformList.map((item) => {
        //   return { id: item.id, name: item.platformName };
        // });
        this.unitlist = data.platformList.map((item) => {
          const arr = [];
          data.responseinfo.list.forEach((val) => {
            if (val.platformId == item.id) {
              console.log(val);
              arr.push(val);
            }
          });
          console.log(arr);
          return { id: item.id, name: item.platformName, arr };
        });
        console.log(this.unitlist);
        this.unitlist.forEach((item) => {
          if (item.arr.length != 0) {
            this.responseUnitsNumber++;
          }
        });
        this.responsetotalCount = data.responseinfo.totalCount;
        this.responsepageSize = data.responseinfo.pageSize;
        this.responsecurrPage = data.responseinfo.currPage;
        this.responsetotalPage = data.responseinfo.totalPage;
        this.responseContentList = data.responseinfo.list;
        this.responseUnitDenominator = data.platformList ? data.platformList.length : 0;
        data.responseinfo.list.forEach((item) => {
          if (item.responNum) {
            this.responseTotalNumber += parseInt(item.responNum);
          }
        });
      });
      this.centerDialogVisible = true;
    },
    handleEdit(index, row) {
      this.$store.commit('responseUnit/resetArr', []);
      this.responseid = row.id;
      console.log('rowid', row, row.id);
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/getUnitAndResponse'),
        method: 'post',
        data: this.$http.adornData({
          serach: '',
          startTime: '',
          endTime: '',
          page: 1,
          limit: 10,
          publishId: row.id,
        }),
      }).then(({ data }) => {
        console.log('编辑响应', data);
        this.responseform.responsename = data.LevelPublish.name;
        this.responseform.responsedesc = data.LevelPublish.remark;
        this.$store.commit('responseUnit/addUnit', data.platformList);
        this.unitArray = this.$store.state.responseUnit.unitArr;
        this.responsestatus = data.LevelPublish.status;
        console.log('this unitarr', this.unitArray);
        const existFileName = [];
        const existFileStr = [];
        data.LevelPublish.publishDocumentList.forEach((item, index) => {
          existFileName.push(item.documentName);
          existFileStr.push(item.url);
        });
        this.existFileName = existFileName;
        this.existFileStr = existFileStr;
        const existFile = [];
        existFileName.forEach((item, index) => {
          existFile.push({
            filename: existFileName[index],
            fileurl: existFileStr[index],
          });
        });
        this.existFile = existFile;
      });
      this.changeResponsedialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('确定执行删除操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log('该行的id为', row.id);
        const ids = [];
        ids.push(row.id);
        this.$http({
          url: this.$http.adornUrl('/level/levelPublish/delete'),
          method: 'post',
          data: this.$http.adornData({
            ids,
          }),
        }).then(({ data }) => {
          console.log('删除返回的数据为', data);
          if (data && data.code === 0) {
            this.$http({
              url: this.$http.adornUrl('/level/levelPublish/list'),
              method: 'post',
              data: this.$http.adornData({
                status: this.value,
                search: '',
                page: 1,
                limit: 10,
                startTime: '',
                endTime: '',
                type: 1,
              }),
            }).then(({ data }) => {
              this.init(data);
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    cellStyle(data) {
      if (data.columnIndex == 4 && data.row.status == 1) {
        return 'color: #0BD295';
      }
      if (data.columnIndex == 4 && data.row.status == 0) {
        return 'color: #F66E6E';
      }
    },
    publishresponse() {
      this.form.responsename = '';
      this.form.responsedesc = '';
      this.dialogFormVisible = true;
      this.unitArray = [];
      this.$store.commit('responseUnit/resetArr', []);
    },
    changeshowcontent() {
      if (this.radio1 === '响应情况') {
        this.isResponseShow = true;
      } else {
        this.isResponseShow = false;
        this.$http({
          url: this.$http.adornUrl('/levelRectifyPublish/selectPageList'),
          method: 'post',
          data: this.$http.adornData({
            status: '',
            page: 1,
            limit: 10,
            search: '',
            publishId: this.responseid,
          }),
        }).then(({ data }) => {
          let platformList = [];
          console.log('监督整改数据为', data);
          this.SupervisecurrPage = data.data.currPage;
          this.SupervisepageSize = data.data.pageSize;
          this.SupervisetotalCount = data.data.totalCount;
          data.data.list.forEach((item, index) => {
            platformList = [];
            item.platformList.forEach((platitem, index) => {
              platformList.push(platitem.platformName);
            });
            item.superviseUnit = platformList.join('、');
          });
          this.superviseList = data.data.list;
        });
      }
    },
    changeunit(index, id, item) {
      console.log(item);
      this.responseUnitId = id;
      this.allChecked = false;
      this.currentindex = index;
      console.log('id', id);
      this.$http({
        url: this.$http.adornUrl('/level/levelResponseInfor/list'),
        method: 'post',
        data: this.$http.adornData({
          search: '',
          page: this.responsecurrPage,
          limit: this.responsepageSize,
          startIime: '',
          endTime: '',
          platformId: id,
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('点击某一项获得的数据为', data);
          this.responsetotalCount = data.data.totalCount;
          this.responsepageSize = data.data.pageSize;
          this.responsecurrPage = data.data.currPage;
          this.responsetotalPage = data.data.totalPage;
          this.responseContentList = data.data.list;
        }
      });
    },
    queryresponse() {
      console.log('value', this.value);
      console.log('value1', this.value1);
      // this.dialogFormVisible = true
      this.$http({
        url: this.$http.adornUrl('/level/levelPublish/list'),
        method: 'post',
        data: this.$http.adornData({
          status: this.value,
          search: this.input,
          page: this.currPage,
          limit: this.pageSize,
          startTime: this.value1 ? (this.value1[0] ? this.value1[0] : '') : '',
          endTime: this.value1 ? (this.value1[1] ? `${(this.value1[1].split('00:00:00'))[0]}23:59:59` : '') : '',
          type: 1,
        }),
      }).then(({ data }) => {
        console.log('data', data);
        if (data && data.code === 0) {
          this.$message.info('查询成功');
          this.init(data);
        } else {
          this.$message.error('查询失败请重试');
        }
      });
    },
    /**
     * @description: 响应条件查询
     * @param {*}
     * @return {*}
     */
    responseConditionQuery() {
      this.$http({
        url: this.$http.adornUrl('/level/levelResponseInfor/list'),
        method: 'post',
        data: this.$http.adornData({
          search: this.responsename,
          startTime: this.responsetime ? this.responsetime[0] : '',
          endTime: this.responsetime ? `${(this.responsetime[1].split('00:00:00'))[0]}23:59:59` : '',
          page: 1,
          limit: 10,
          platformId: this.responseUnitId,
          publishId: this.responseid,
        }),
      }).then((data) => {
        this.$message.info('查询成功');
        console.log('响应记录带条件查询data===》', data);
        this.responseContentList = data.data.data.list;
      });
    },
  },
};
</script>
<style scoped>
  * {
    font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
      Roboto-Regular, SourceHanSansCN-Regular;
  }
  .qqtang {
    top: -2%;
    right: -5%;
  }
  .titleStyle {
    margin-top: -2px;
    margin-left: 20px;
    font-size: 18px;
    color: #333333;
  }
  /* 头部日期选择框 */
  /deep/ .el-date-editor--daterange {
    width: 320px !important;
    /* height: 40px; */
    /* margin-left: 5px !important; */
    /* margin-top: 20px !important; */
  }

  /deep/ .el-button {
    /*background-color: blue;*/
  }
  /* 下拉框及搜索框 */
  /deep/ .el-input--medium .el-input__inner {
    /* height: 40px !important;
                                                                                                                                        line-height: 40px !important; */
  }
  .inputClass {
    width: 300px;
    margin: 0 5px;
  }
  .buttonstyle {
    background-color: #0091ff;
    margin-right: 3px;
  }
  .select_response_unit_button {
    padding: 10px;
  }
  .crossArrow {
    color: #3f92fe;
    font-size: 16px;
    font-weight: bold;
    margin-right: 4px;
  }
  .is-background {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .inputname {
    width: 320px !important;
    height: 35px !important;
  }
  .el-textarea /deep/.el-textarea__inner {
    width: 700px;
  }

  .responseunit {
    width: 700px;
    /* height: 70px; */
    margin-left: 100px;
  }
  .responseunit /deep/ .el-button {
    margin-left: 15px;
    margin-top: 15px;
    position: relative;
  }
  .responseunit /deep/ .deleteicon {
    position: absolute;
    top: -16px;
    right: -18px;
    font-size: 30px;
    color: #d7d7d7;
  }
  .dialog-footer {
    text-align: center;
  }
  .dialog-footer /deep/ .el-button {
    height: 50px;
    width: 150px;
  }
  .dialogheaderstyle /deep/ .el-dialog__header {
    background: #f1f4f6;
    padding-left: 0px;
    height: 59px;
    padding-top: 19px;
  }
  .dialogheaderstyle /deep/ .el-dialog__headerbtn {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 24px !important;
  }
  /* .xiangtingqqai {
                                            font-size: 15px;
                                            text-align: left;
                                            margin-top: 5px;
                                          } */
  .header_title {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    border-left: 3px solid #0091ff;
    padding-left: 10px;
    height: 16px;
    line-height: 16px;
    display: inline-block;
    margin: auto auto auto 0;
    min-width: 109px;
  }
  .queryresponsedialog /deep/ .el-dialog__header {
    background-color: #f1f4f6;
    height: 65px;
    font-size: 18px;
    padding-top: 22px;
    padding-left: 28px;
  }

  .queryresponsedialog /deep/ .el-dialog__headerbtn {
    position: absolute;
    top: 20px;
    right: 10px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 24px !important;
  }
  .queryresponsedialog /deep/ .el-dialog__body {
    padding-left: 0px;
    padding-top: 0px;
    padding-right: 0px;
    padding: 0;
  }
  .formcontent /deep/ .el-form-item {
    margin-bottom: 0px;
  }
  .formcontent /deep/ .el-form-item__content {
    margin-left: 30px !important;
  }

  .changebutton /deep/ .is-active {
    background-color: #0091ff;
  }
  .changebutton
    /deep/
    .el-radio-button__orig-radio:checked
    + .el-radio-button__inner {
    background-color: #0091ff !important;
    color: #ffffff;
  }
  .changebutton /deep/ .el-radio-group {
    width: 230px !important;
    height: 40px;
  }
  .changebutton /deep/ .el-radio-button {
    width: 115px;
    height: 40px;
    border-radius: 5px;
  }
  .changebutton /deep/ .el-radio-button__inner {
    width: 115px;
    height: 40px;
    line-height: 18px;
    color: #999999;
  }
  .page {
    position: relative;
    /* position: absolute; */
    /* bottom: -100px; */
    /* left: 1200px; */
  }
  .choose {
    width: 275px;
    margin-top: 10px;
    margin-left: 22px;
    height: 40px;
    font-size: 13px;
  }
  .line {
    width: 310px;
    border-top: 1px solid #f1f5ff;
    margin-top: 0px;
    margin-left: 10px;
  }
  .active {
    /* background-color: #f1f5ff; */
    background: rgba(0, 145, 255, 0.1);
    border-left: 2px solid #15a6fc;
  }
  .triangle {
    top: 22px;
    left: -22px;
    width: 50px;
    height: 50px;
    position: absolute;
    background: url(../../../assets/img/arrowslide.png) no-repeat;
  }
  /* .asidestyle /deep/ .el-radio-group {
        width: 456px !important;
        margin-bottom: 10px;
        height: 40px;
      }
      .asidestyle /deep/ .el-radio-button {
        width: 152px;
        height: 40px;
      }
      .asidestyle /deep/ .el-radio-button__inner {
        width: 152px;
        height: 40px;
      }
      .asidestyle /deep/ .is-active {
        background-color: #0091ff;
      }
      .asidestyle
        /deep/
        .el-radio-button__orig-radio:checked
        + .el-radio-button__inner {
        background-color: #0091ff !important;
      } */

  .buttoncircle {
    position: absolute;
    left: -19px;
    top: 23px;
    width: 35px;
    height: 35px;
    border-radius: 20px;
    background-color: #15a6fc;
    color: #fff;
    text-align: center;
    line-height: 35px;
  }
  .fontstyle {
    font-size: 14px;
    color: #000;
  }
  .rowstyle {
    margin: 8px 15px;
    color: #999999;
  }
  .supervisionbutton {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background-color: #f59a23;
    position: absolute;
    text-align: center;
    line-height: 58px;
    color: #fff;
    right: 11px;
    top: 57px;
  }
  .arrowpic {
    top: 22px;
    left: -22px;
    width: 50px;
    height: 50px;
    position: absolute;
    background: url(../../../assets/img/arrowslide.png) no-repeat;
  }
  .greenarrowpic {
    top: 26px;
    right: -50px;
    width: 50px;
    height: 50px;
    position: absolute;
    background: url(../../../assets/img/greenarrow.png) no-repeat;
  }
  .rightcontent {
    margin-top: 10px;
  }
  .troop {
    float: right;
    background-color: #70b603;
    width: 85px;
    /* height: 38px; */
    text-align: center;
    box-sizing: border-box;
    font-size: 13px;
    padding: 0px;
    line-height: normal;
    letter-spacing: normal;
    margin-right: 14px;
    margin-top: 18px;
  }
  .unitnamewrapper >>> .el-input--medium .el-input__inner {
    width: 278px;
    height: 40px;
    padding: 10px;
    margin-left: 22px;
  }
  .unitnamewrapper
    >>> .el-input--medium
    .el-input__inner::-webkit-input-placeholder {
    color: #7f7f7f;
    font-size: 14px;
  }
  .unitnamewrapper
    >>> .el-input--medium
    .el-input__inner::-moz-input-placeholder {
    color: #7f7f7f;
    font-size: 14px;
  }
  .unitnamewrapper >>> .el-input--medium .el-input__inner::-ms-input-placeholder {
    color: #7f7f7f;
    font-size: 14px;
  }
  .uploadbutton {
    padding: 10px;
  }
  /* <!--
       * @Author: liukanglin
       * @Date: 2020-09-03
      --> */
  .areapublishresponse {
    position: relative;
    background-color: #ffffff;
    height: calc(100vh - 112px);
    overflow: hidden;
    border-radius: 4px;
  }
  .areapublishresponse .header {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
  }
  /* 自定义悬浮阴影和左边框蓝色线条 */
  .areapublishresponse .content .el-table {
    height: 100%;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-size: 14px;
  }
  .areapublishresponse .content .el-table /deep/ .el-table__body /deep/ td {
    border-left: none;
    border-right: none;
  }
  .areapublishresponse .content .el-table /deep/ .el-table__body /deep/ tr {
    background: none;
  }
  .areapublishresponse .content .el-table /deep/ .el-table__body /deep/ tr:hover {
    box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
  }
  .areapublishresponse
    .content
    .el-table
    /deep/
    .el-table__body
    /deep/
    tr:hover
    td:nth-child(1) {
    border-left: 3px solid #0091ff;
  }
  /* 自定义悬浮阴影和左边框蓝色线条 */
  .bestBigWrap .el-table /deep/ .gutter {
    background-color: #f1f5ff;
  }
  .bestBigWrap .el-table /deep/ th:nth-last-child(2) {
    border-right: none;
  }
  /deep/ .el-pagination {
    height: 72px;
    position: absolute;
    right: 20px;
    top: 5px;
  }
  /deep/ .el-textarea__inner {
    width: 90%;
  }
  /* 选择后展示的响应单位 */
  .responseunit_showUnit {
    display: inline-block;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    background-color: #fafafa;
    color: #9a9a9a;
    text-align: center;
    margin: 20px 0 0 20px;
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-sizing: border-box;
  }
  /* 选择后展示的响应单位删除图标 */
  .responseunit_showUnit .delect-error {
    display: inline-block;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    color: #979797;
    margin: 0 4px;
  }
  /* dialog底部线条 */
  /deep/ .el-dialog__footer {
    border-top: 1px solid #f2f2f2;
    padding: 20px;
  }
  /* 设置附件长度 */
  /deep/ .el-upload-list {
    width: 380px;
  }
  /* 选择响应单位弹框头部颜色 */
  /deep/ .el-dialog__header {
    background-color: #f1f3f6;
  }

  /* 查看等级响应响应情况 */
  /* 响应情况侧边栏 */
  .asidecontent {
    height: 100%;
    border-right: 1px solid #d7d7d7;
  }
  /* 侧边栏搜索框 */
  .asidecontent /deep/ .el-input__inner {
    width: calc(100% - 20px) !important;
    margin: 3px 5px;
    /* padding-left: 25px; */
    margin-bottom: 0px;
    border-radius: 18px;
  }
  .asidecontent /deep/ .el-input__prefix {
    top: 3px;
    left: 10px;
  }
  /* 侧边栏时间选择器 */
  .asidecontent /deep/ .el-date-editor {
    margin-top: 10px;
  }
  /* 侧边栏响应单位数、响应人数 */
  .responseNumber {
    height: 50px;
    line-height: 50px;
    margin-left: -10px;
    padding-left: 27px;
    position: relative;
  }
  /* 侧边栏响应人数 */
  .responseNumber span:nth-last-child(1) {
    position: absolute;
    right: 30px;
  }
  /* 侧边栏响应数字字体 */
  .responseNumber b {
    font-size: 16px;
  }
  /* 侧边栏单位列表 */
  .chooseunit .listyle {
    position: relative;
    padding: 10px 85px 10px 27px;
    font-size: 14px;
    color: #333333;
    width: 330px;
    margin-left: -10px;
    cursor: pointer;
    /* height: 40px; */
  }
  /* 侧边栏单位列表响应标签 */
  .chooseunit .listyle b {
    position: absolute;
    right: 13px;
    top: 50%;
    margin-top: -15px;
    color: #ffffff;
    font-weight: normal;
    padding: 5px;
    border-radius: 4px;
    width: 66px;
    text-align: center;
  }
  /* 侧边栏单位列表响应标签颜色 */
  .chooseunit .listyle b.green_button {
    background-color: #0bd295;
  }
  /* 侧边栏单位列表响应标签颜色 */
  .chooseunit .listyle b.gray_button {
    background-color: #cccccc;
  }
  /* 主体部分响应块 */
  .responseline {
    width: 100%;
    height: 327px;

    position: relative;
    margin-bottom: 10px;
  }
  /* 主体部分响应块 */
  .responseslide {
    width: 100%;
    height: 323px;
    position: relative;
    /* margin-left: 20px; */
    /* margin-top: 15px; */
    border: 1px solid #d7d7d7;
    /* border-radius: 5px; */
  }
  /* 主体部分图片 */
  .imgstyle {
    width: 192px;
    height: 163px;
    margin-right: 13px;
  }

  /* 查看等级响应监督整改 */
  /* 侧边栏tab */
  .asidestyle .aside_option {
    height: 58px;
    line-height: 58px;
    text-align: center;
    display: flex;
    margin: -15px -10px 20px -10px;
    border-bottom: 1px solid #e9ecf1;
  }
  .asidestyle .aside_option div {
    width: 33.33%;
    cursor: pointer;
    position: relative;
  }
  .asidestyle .aside_option .aside_option_active {
    font-weight: bold;
  }
  .asidestyle .aside_option .aside_option_active span {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 1px solid #d7d7d7;
    border-right: none;
    border-bottom: none;
    background-color: #ffffff;
    bottom: -8px;
    left: 50%;
    margin-left: -8px;
    transform: rotate(45deg);
  }
  /* 侧边栏响应块 */
  .supervisionall {
    width: 454px;
    min-height: 258px;
    border: 1px solid #d7d7d7;
    margin-bottom: 10px;
    margin-left: 3px;
    position: relative;
  }
  /* 侧边栏响应块图片 */
  .supervisionimgstyle {
    width: 170px;
    height: 130px;
  }
  /* 主体部分标题 */
  .dage {
    border-left: 2px #3f92fe solid;
    padding-left: 10px;
    color: #333333;
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    font-weight: bold;
  }
  /* 主体部分响应块 */
  .box_row {
    width: 100%;
    min-height: 287px;
    box-shadow: 0px 1px 5px 0px rgba(187, 211, 230, 0.5);
    border: 1px solid #d7d7d7;
    margin-left: -8px;
    padding: 0px;
    box-sizing: border-box;
    float: left;
    border-radius: 7px;
    position: relative;
  }
</style>
