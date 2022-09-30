<template>
  <div class="informationToVerify_wrap">
    <div
      style="
        padding-top: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
      "
    >
      <div
        style="
          display: flex;
          align-items: center;
          position: relative;
          flex-wrap: wrap;
          justify-content: flex-start;
          flex: 7;
        "
      >
        <div
          ref="flow"
          class="aLink"
          v-for="(list, index) in buttons"
          @click="missPlan(list, index)"
          :key="index"
        >
          <div class="divButton" :class="{ red: changeRed == index }">
            <el-tooltip
              :content="list.content"
              placement="bottom"
              effect="light"
            >
              <el-button size="big">{{ list.name }}</el-button>
            </el-tooltip>
            <!--                <el-popover-->
            <!--                  title="说明:"-->
            <!--                  width="200"-->
            <!--                  trigger="hover"-->
            <!--                 >-->
            <!--                  <div class="popover-content"></div>-->

            <!--                </el-popover>-->
          </div>
          <div v-if="buttons[index].dynamicContactor.code === 'yes'">
            <!--                <i class="el-icon-user-solid" style="font-size: 18px"  @click="setClick(index)" ></i>-->
            <!--                <i class="el-icon-warning" style="font-size: 18px"   ></i>-->
          </div>
          <div v-else-if="buttons[index].dynamicContactor === 'no'"></div>
        </div>
      </div>
      <!-- 提示-->
      <div
        v-if="tipData"
        class="tips-box"
      >
        <el-card
          shadow="hover"
          class="tips-box-card"
        >
          <!-- 现在3.0不需要此功能了，显隐藏 20210624 -->
          <!-- <div
            class="tips-box-card-item"
            :class="{ backCoror: indexBook == '联系人' }"
            @click="clickBookType"
          >
            <div class="img-contactor"></div>
            <div class="img-label">联系人</div>
          </div> -->
          <div
            class="tips-box-card-item"
            :class="{ backCoror: indexBook == '配置' }"
            @click="clickStiggeType"
          >
            <div class="img-setting"></div>
            <div class="img-label">配置</div>
          </div>
        </el-card>
        <div
          v-if="tipData"
          class="triangle"
        ></div>
      </div>

      
    </div>
    <el-main style="padding: 10px" v-if="rorcedToRefreshAll" class="informationToVerify_wrap_main">
      <el-row>
        <el-scrollbar style="height: 310px">
          <el-col :span="11">
            <el-card shadow="always">
              <div style="padding: 5px; width: 100%">
                <el-row>
                  <el-col :span="20" id="setting" class="row-left">
                    <div style="width: 100%" v-if="settingInput">
                      <el-input
                        size="big"
                        style="width: 100%"
                        placeholder="请输入内容"
                        v-model="search"
                        class="input-with-select"
                      >
                        <el-button slot="append" @click="findContact"
                          >查找</el-button
                        >
                      </el-input>
                    </div>
                    <div style="width: 100%" v-if="settingSelect">
                      <el-select
                        style="width: 100%"
                        size="big"
                        v-model="flowSetting"
                        placeholder="请选择"
                        @change="processForm"
                      >
                        <el-option
                          v-for="item in flowSettingArr"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="4" class="row-right">
                    <el-button
                      type="primary"
                      icon="el-icon-refresh"
                      size="big"
                      id="iconButton"
                      @click="settingButton"
                      title="切换"
                    ></el-button>
                  </el-col>
                </el-row>
                <div>
                  <!--表格-->
                  <div>
                    <my-table
                      ref="tableEvent"
                      @handleCurrentChange="handleCurrentChange"
                      @handleDialPhone="handleDialPhone"
                      @handleDialsSpecialPlane="handleDialsSpecialPlane"
                      @handleDialsFax="handleDialsFax"
                      :tableColumn="tableColumn"
                      :tableData="tableData"
                    ></my-table>
                  </div>
                </div>
                <!--表格分页-->
                <div style="overflow-y: auto">
                  <el-pagination
                    :small="pagingSize"
                    :page-size="pageSize"
                    :total="total"
                    :current-page="currentPage"
                    @current-change="pageMode"
                    layout="total, prev, pager, next, jumper"
                  ></el-pagination>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="2">
            <div style="width: 100%; height: 60px; margin-top: 110px">
              <div class="rightIcon"></div>
            </div>
          </el-col>
          <el-col :span="11">
            <el-tabs type="border-card" v-model="msgTable" class="tabs-wrap" @tab-click="msg">
              <!--                <el-tab-pane label="H5短信" name="H5短信">-->
              <el-tab-pane
                :label="msgTableLabel ? '短信' : 'H5短信'"
                :name="msgTableLabel ? '短信' : 'H5短信'"
              >
                <note-check
                  ref="noteCheck"
                  @verificationRecords="verificationRecords"
                ></note-check>
              </el-tab-pane>
              <el-tab-pane label="电话" name="电话">
                <phone-disposition ref="phoneDisposition"></phone-disposition>
              </el-tab-pane>
              <el-tab-pane label="传真" name="传真">
                <fax-check
                  ref="faxCheck"
                  @clearFaxList="clearFaxList"
                ></fax-check>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-scrollbar>
      </el-row>

      <el-row style="height: 300px; margin-top: 20px">
        <div v-if="nameType == '短信'" style="height: 235px">
          <el-input
            v-model="smsContent"
            type="textarea"
            placeholder=""
            resize="none"
            class="smsTextarea"
            show-word-limit
            :style="backSms"
            :maxlength="maxlength"
            :autosize="{ minRows: 10, maxRows: 10 }"
          />
          <div class="bottomRow">
            <!-- bug12442 短信签名隐藏 -->
            <!-- <div class="leftSelect">
              <label class="export">签名:</label>
              <el-select
                v-model="signature"
                filterable
                clearable
                placeholder="请选择"
                @blur="selectBlur"
              >
                <el-option
                  v-for="item in signatureOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div> -->
            <div class="rightButton">
              <el-button type="primary" size="mini" @click="clcikSend"
                >发送</el-button
              >
            </div>
          </div>
        </div>
        <div v-if="nameType == '电话'" style="height: 235px">
          <div style="border-radius: 5px; width: 100%; height: 100%">
            <div style="height: 100%">
              <div class="dialpad">
                <div class="peopleList">
                  <el-scrollbar style="height: 100%">
                    <template v-for="(items, index) in callQueue">
                      <div
                        class="showPhone"
                        @click="clickPhone(items, index)"
                        @dblclick="openCallWindow(items)"
                        :class="{ blue: changeColor === items.mobile }"
                        :key="index"
                      >
                        <div class="showPhoneLeft">
                          <div>{{ items.mobile }}</div>
                          <div style="text-align: center"></div>
                        </div>
                        <div class="showPhoneRight">
                          <div @click="release(items, index)">
                            <i class="el-icon-video-pause"></i>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="nameType == '传真'"
          style="height: 270px; border: 1px solid #ddd"
        >
          <div id="uploadListDom" style="border-radius: 5px; width: 100%">
            <div
              style="
                display: flex;
                justify-content: flex-end;
                border-bottom: 1px solid #ddd;
              "
            >
              <!-- <div
                style="
                  width: 100%;
                  text-align: right;
                  margin: 10px 0px;
                  padding-right: 10px;
                "
              >
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="string"
                  :headers="{
                    Authorization: $window.localStorage.getItem('token')
                      ? $window.localStorage.getItem('token')
                      : '',
                  }"
                  accept=".jpg, .jpeg, .png, .pdf, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                  :limit="1"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :before-upload="beforeUpload"
                  auto-upload
                  with-credentials
                  :show-file-list="false"
                  :on-exceed="onExceed"
                >
                  <i
                    style="
                      position: absolute;
                      left: 26px;
                      top: 20px;
                      font-size: 20px;
                    "
                    class="el-icon-full-screen"
                    @click="fullScreen"
                  ></i>
                  <el-button slot="trigger" size="small" type="primary"
                    >选择</el-button
                  >
                  <el-button size="small" type="primary" @click="expEmpty"
                    >清空</el-button
                  >
                  <el-button size="small" type="primary" @click="submitUpload"
                    >发送</el-button
                  >
                </el-upload>
              </div> -->

              <div
                style="
                  width: 100%;
                  text-align: right;
                  margin: 10px 0px;
                  padding-right: 10px;
                "
              >
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action=""
                  :headers="{
                    Authorization: $window.localStorage.getItem('token')
                      ? $window.localStorage.getItem('token')
                      : '',
                  }"
                  accept=".jpg, .jpeg, .png, .pdf, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                  :limit="1"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :before-upload="beforeUpload"
                  :show-file-list="false"
                  :on-exceed="onExceed"
                  :http-request="httpRequest"
                >
                  <i
                    style="
                      position: absolute;
                      left: 26px;
                      top: 20px;
                      font-size: 20px;
                    "
                    class="el-icon-full-screen"
                    @click="fullScreen"
                  ></i>
                  <el-button slot="trigger" size="small" type="primary"
                    >选择</el-button
                  >
                  <el-button size="small" type="primary" @click="expEmpty"
                    >清空</el-button
                  >
                  <el-button size="small" type="primary" @click="submitUpload"
                    >发送</el-button
                  >
                </el-upload>
              </div>
            </div>
          </div>
          <div :style="backFax" style="width: 100%; height: 215px">
            <iframe
              :src="previewPath"
              id="fpxIframe"
              width="100%"
              height="100%"
              frameborder="no"
              border="0"
              marginwidth="0"
              marginheight="0"
              scrolling="no"
              allowtransparency="yes"
            ></iframe>
          </div>
        </div>
        <div class="heDivWrap">
          <div class="heDivTitle">
            <img
              src="../../../../../../static/img/emergencyContact_img/hsb.png"
              alt
            />
            核实记录
          </div>
          <div class="heDivContent">
            <el-table height="465" :data="hstableData" style="width: 100%">
              <el-table-column
                prop="flowName"
                label="核实流程"
                align="center"
              ></el-table-column>
              <!-- 扬州需求 时间精确到分钟 -->
              <div v-if="isYangZhouProject">
                <el-table-column prop label="发送核实时间" align="center">
                  <template slot-scope="scope">
                    <div
                      v-for="(item, index) in scope.row.contactor"
                      :key="index"
                      :style="{
                        borderBottom:
                          index == scope.row.contactor.length - 1
                            ? 'none'
                            : '1px solid #DDDDDD',
                      }"
                    >
                      {{
                        scope.row.send
                          ? scope.row.send.substring(
                              0,
                              scope.row.send.length - 5
                            )
                          : ""
                      }}
                    </div>
                  </template>
                </el-table-column>
              </div>
              <div v-else>
                <el-table-column prop label="发送核实时间" align="center">
                  <template slot-scope="scope">
                    <div
                      v-for="(item, index) in scope.row.contactor"
                      :key="index"
                      :style="{
                        borderBottom:
                          index == scope.row.contactor.length - 1
                            ? 'none'
                            : '1px solid #DDDDDD',
                      }"
                    >
                      {{
                        scope.row.send
                          ? scope.row.send.substring(
                              0,
                              scope.row.send.length - 2
                            )
                          : ""
                      }}
                    </div>
                  </template>
                </el-table-column>
              </div>
              <el-table-column prop="contacts" label="核实对象联系人" align="center">
                <template slot-scope="scope">
                  <div
                    v-for="(item, index) in scope.row.contactor"
                    :key="index"
                    :style="{
                      borderBottom:
                        index == scope.row.contactor.length - 1
                          ? 'none'
                          : '1px solid #DDDDDD',
                    }"
                  >
                    {{
                      item.contactorId
                        ? item.contactorName
                        : item.contactorMobile
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="endtimes" label="核实反馈时间" align="center">
                <template slot-scope="scope">
                  <div
                    v-for="(item, index) in scope.row.contactor"
                    :key="index"
                    :style="{
                      borderBottom:
                        index == scope.row.contactor.length - 1
                          ? 'none'
                          : '1px solid #DDDDDD',
                    }"
                  >
                    {{
                      item.time
                        ? item.time.substring(0, item.time.length - 2)
                        : ""
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop label="核实反馈内容" align="center">
                <template slot-scope="scope">
                  <div
                    v-for="(item, index) in scope.row.contactor"
                    :key="index"
                    :style="{
                      borderBottom:
                        index == scope.row.contactor.length - 1
                          ? 'none'
                          : '1px solid #DDDDDD',
                    }"
                  >
                    <el-button
                      type="text"
                      size="small"
                      @click="hsexamine(item)"
                      v-if="item.result.length != 0"
                      >查看</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      @click="calling(item)"
                      v-else
                      >一键呼叫</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <div class="heDivPage" >
                    <span @click="augment" ><</span>
                    <input type="number" v-model="hePage"  :max="allhePage" >
                    /
                    <span style="margin-left:13px;" >{{allhePage}}</span>
                    <span @click="subtract" >></span> 
          </div>-->
        </div>
      </el-row>
    </el-main>

    <!-- 全屏预览传真 -->
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
      :close-on-click-modal="false"
    >
      <iframe
        :src="previewPath"
        id="iframe"
        width="100%"
        height="900px"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      ></iframe>
    </el-dialog>

    <el-dialog
      :visible.sync="configurationDialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="1200px"
      top="30px"
    >
      <configuration
        ref="configuration"
        @confirmDialog="confirmDialog"
        @updateFlow="updateFlow"
      ></configuration>
    </el-dialog>

    <!-- 信息核实 -->
    <aside class="hePoputWarp" v-if="hsPoput">
      <div class="hePoputTitle">
        <span>核实反馈内容</span>
        <img
          @click="hsPoput = false"
          src="../../../../../../static/img/emergencyContact_img/close.png"
          alt
        />
      </div>
      <div class="hePoputContent">
        <div>
          <ul class="fromList">
            {{
              selectData.smsContent
            }}
            <!-- <li>【事件起因】：</li>  
                  <li>【事件性质】：</li>  
                  <li class="tsfromListLi" >【死亡人数】：</li>
                  <li class="tsfromListLi" >【受伤人数】：</li>
                  <li class="tsfromListLi" >【失踪人数】：</li>
                  <li class="tsfromListLi" >【受困人数】：</li>
                  <li class="tsfromListLi" >【受灾人数】：</li>
                  <li class="tsfromListLi" >【影响人数】：</li>
                  <li>【已造成后果】：</li>
                  <li>【事件发展趋势】：</li>
            <li>【已采取措施或办理情况】：</li>-->
          </ul>
          <!-- v-for="(item,index) in selectData" :key="index" -->
          <div>
            <div
              v-for="(items, indexs) in selectData.result"
              :key="indexs"
              :class="indexs != 0 ? 'margin20' : 'margin10'"
            >
              <p class="hePoputContentTime">
                {{
                  items.distributionResultTime.substring(
                    0,
                    items.distributionResultTime.length - 2
                  )
                }}
              </p>
              <div class="hePoputMap_wrap">
                <ul class="hePoputMap_wrap_ul">
                  <li class="hePoputMap_wrap_li">
                    <div class="hePoputMap_wrap_li_div">
                      <span>上报位置</span>
                      <span>{{
                        items.distributionResultAddress
                          ? items.distributionResultAddress
                          : "无"
                      }}</span>
                    </div>
                    <span
                      v-if="items.distributionResultAddress && items.flag"
                      @click="serMapArttr(items)"
                      >定位为事发地点</span
                    >
                    <span
                      v-if="items.distributionResultAddress && !items.flag"
                      @click="repeal(items)"
                      >撤销替换</span
                    >
                  </li>
                  <li class="hePoputMap_wrap_li">
                    <div class="hePoputMap_wrap_li_div">
                      <span>现场情况反馈</span>
                      <span>{{ items.distributionResultTxtContent }}</span>
                    </div>
                    <span></span>
                  </li>
                </ul>
                <!-- 如果图片小于5张，不显示上、下一张图片图标，否则显示 -->
                <div class="hePoputImg" v-if="items.pics.length < 5">
                  <div class="heVispons">
                    <ul>
                      <li
                        class="heVispons_li"
                        v-for="(itemc, indexc) in items.pics"
                        :key="indexc"
                      >
                        <!-- <img :src="FileUrls+itemc" alt /> -->
                        <!-- <div class="heVispons_li_mover" @click="setImgSrc(itemc)">
                                                <img src="../../../../../../static/img/emergencyContact_img/moverEye.png" />
                                            </div> -->
                        <!-- 
                                                *@Description: 👇新的图片渲染,点击后可操作预览大图
                                                *@EditAuthor:  XRY
                                                *@Date: 2020-11-26 11:08:51
                                             -->
                        <el-image
                          :src="FileUrls + itemc"
                          alt
                          @mouseenter="imgOnLoad(FileUrls + itemc)"
                          :preview-src-list="previewSrc"
                        ></el-image>
                        <div class="heVispons_li_mover">
                          <img
                            src="../../../../../../static/img/emergencyContact_img/moverEye.png"
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="hePoputImg" v-else>
                  <img
                    class="prevBtn"
                    src="../../../../../../static/img/emergencyContact_img/prev.png"
                    @click="prevImg($event)"
                  />
                  <div class="heVispons">
                    <ul>
                      <li
                        class="heVispons_li"
                        v-for="(itemc, indexc) in items.pics"
                        :key="indexc"
                      >
                        <!-- <img :src="FileUrls+itemc" alt /> -->
                        <!-- <div class="heVispons_li_mover" @click="setImgSrc(itemc)">
                                                <img src="../../../../../../static/img/emergencyContact_img/moverEye.png" />
                                            </div> -->
                        <!-- 
                                                *@Description: 👇新的图片渲染,点击后可操作预览大图
                                                *@EditAuthor:  XRY
                                                *@Date: 2020-11-26 11:08:51
                                             -->
                        <el-image
                          :src="FileUrls + itemc"
                          alt
                          @mouseenter="imgOnLoad(FileUrls + itemc)"
                          :preview-src-list="previewSrc"
                        ></el-image>
                        <div class="heVispons_li_mover">
                          <img
                            src="../../../../../../static/img/emergencyContact_img/moverEye.png"
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                  <img
                    class="nextBtn"
                    src="../../../../../../static/img/emergencyContact_img/next.png"
                    @click="nextImg($event)"
                  />
                </div>
                <div
                  class=""
                  style="
                    margin-top: 10px;
                    text-align: left;
                    display: flex;
                    flex-wrap: wrap;
                  "
                >
                  <video
                    style="
                      width: 280px;
                      height: 200px;
                      object-fit: cover;
                      margin-right: 5px;
                    "
                    controls
                    :src="FileUrls + itemd"
                    v-for="(itemd, indexd) in items.videos"
                    :key="indexd"
                  ></video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <div class="bigImgWrap" v-if="bigImgFlag">
      <div class="bigImgTitle">
        <span>图片预览</span>
        <img
          src="../../../../../../static/img/emergencyContact_img/close.png"
          @click="bigImgFlag = false"
          alt
        />
      </div>
      <img :src="FileUrls + heBigImgSrc" alt />
    </div>
  </div>
</template>

<script>
import mixin from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin.js";
import myTable from "@/view/yz_eventManagement/eventReports/dialog/tableCopy";
import noteCheck from "@/view/yz_eventManagement/eventReports/Plan/iphoneCopy/noteCheckCopy"; //短信
import faxCheck from "@/view/yz_eventManagement/eventReports/Plan/faxCheck"; //传真
import phoneDisposition from "@/view/yz_eventManagement/eventReports/Page/share/phoneDisposition"; //电话
import bus from "@/yz_components/common/js/eventBus";
import axios from 'axios';
import configuration from "@/view/yz_eventManagement/eventReports/Page/share/configuration";
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js'
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  mixins: [mixin, mixin2],
  name: "informationToVerify",
  components: {
    myTable,
    noteCheck,
    faxCheck,
    phoneDisposition,
    configuration,
  },
  data() {
    return {
      FileUrls: "",
      imgData: [
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
        {
          src:
            "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg",
        },
      ],
      previewSrc: [], // 预览图片src
      tipData: false,
      buttons: [], //按钮内容
      changeRed: -1, //切换按钮颜色
      search: "", //搜索
      hePage: 1,
      allhePage: 18,
      hsPoput: false,
      bigImgFlag: false,
      heBigImgSrc: "",
      hstableData: [],
      selectData: {},
      tableColumn: [
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "position",
          label: "职务",
        },
      ], //表头
      tableData: [], //表格数据
      total: 0, //总数据
      pageSize: 10, //每页多少条数据
      currentPage: 1, //第几页
      pagingSize: true, //分页大小
      caseId: "", //事件caseID
      flowSetting: "", //流程设置下拉选中
      flowSettingArr: [], //流程设置数组
      settingInput: false,
      settingSelect: true,
      folwId: "", //流程设置ID
      eventId: "", //事件ID
      areaId: "", //区域ID
      area: "", //区域名字
      sorter: "", //判断是表格还是查找
      // msgTable:'H5短信',
      msgTable:
        window.g.IsNanShanProject || window.g.IsYangZhouProject
          ? "短信"
          : "H5短信", // tab name
      msgTableLabel: window.g.IsNanShanProject || window.g.IsYangZhouProject, // tab name
      rorcedToRefreshAll: true,
      indexBook: "", //流程点击
      backSms: {
        background: "",
        backgroundSize: "",
      },
      backFax: {
        background: "",
        backgroundSize: "",
      },
      nameType: "短信", //现在使用的类型
      smsContent: "", //短信内容
      signatureOptions: [], //签名
      // options: [
      //   {value: '办公室', label: '办公室'},
      //   {value: '财务室', label: '财务室'},
      //   {value: '总裁办', label: '总裁办'},
      // ],//所有签名都是一样的数据
      // heightSms:{
      //   height:'300px'
      // }
      signature: "", //短信签名内容
      uploadForm: [], //上传成功的存储
      string: window.g.ApiUrl + "/eos/communication/fax/convertPDF", //传真默认上传路径
      fileList: [], //上传的文件的列表
      previewPath: "", //文件预览路径
      pdfPath: "", //PDF路径
      dialogVisible: false, //全屏预览传真弹窗
      linkman: "", //每次点击赋值的流程数据
      configurationDialogVisible: false, //配置弹窗
      isYangZhouProject: window.g.IsYangZhouProject,
      // 上传传真后拼接的数据，上传接口要用到
      faxForm: {
        faxId: '', // 传真Id
        faxUrl: '', // 传真url
        faxName: '', // 传真名字
      },
      ApiUrl: window.g.ApiUrl,
      maxlength: 500, // 短信字数
    };
  },
  mounted() {
    this.FileUrls = window.g.FileUrl;
    this.getButton();
    this.backSms.background =
      "url(" + "/static/img/none.png" + ")center no-repeat";
    this.backSms.backgroundSize = "220px";
    this.backFax.background =
      "url(" + "/static/img/faxBack.png" + ")center no-repeat";
    this.backFax.backgroundSize = "220px";
    this.getFindSmsSign(); // 获取签名
    this.requersListData();
    document.getElementsByClassName(
      "informationToVerify_wrap"
    )[0].parentNode.style.height = "100%";

    // H5提交核实，刷新列表
    bus.$off("informationVerification");
    bus.$on("informationVerification", (msgData) => {
      this.requersListData();
      this.openInformationTips(msgData.contactorName,
      msgData.SubCmd,msgData.datetime,msgData.eventName)
    });
    // this.faxWebSokect()
  },
  computed: {
    //计算属性监听全局变量进行数组操作
    callQueue() {
      return this.$store.getters.getCallQueue;
    },
  },
  watch: {
    hePage(val) {
      if (val > this.allhePage) {
        this.hePage = this.allhePage;
      }
    },
    smsContent: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backSms.background =
            "url(" + "/static/img/none.png" + ")center no-repeat";
          this.backSms.backgroundSize = "220px";
        } else {
          this.backSms.background = "none";
          this.backSms.backgroundSize = "220px";
        }
      },
      deep: true,
    },
    previewPath: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backFax.background =
            "url(" + "/static/img/faxBack.png" + ")center no-repeat";
          this.backFax.backgroundSize = "220px";
        } else {
          this.backFax.background = "none";
          this.backFax.backgroundSize = "220px";
        }
      },
      deep: true,
    },
    msgTable: {
      handler(newV) {
        let type = newV;
        console.log(newV);
        switch (type) {
          case "电话":
            this.$refs.tableEvent.eventshowPhone();
            break;
          // case 'H5短信':
          case "短信" || "H5短信":
            this.$refs.tableEvent.eventshowline();
            break;
          case "传真":
            break;
          default:
            break;
        }
      },
      deep: true,
    },
    changeRed: {
      handler(newV, oldV) {
        console.log(newV, oldV);
        if (newV != oldV) {
          this.rorcedToRefreshAll = false;
          this.tableData = [];
          // this.flowSetting=''
          this.total = 0;
          this.pageSize = 10;
          (this.currentPage = 1), //第几页
            setTimeout(() => {
              this.rorcedToRefreshAll = true;
            }, 10);
        }
      },
      deep: true,
    },
  },

  created() {
    console.log(this.msgTableLabel);
    // console.log('msg tab name -------------');
    // console.log(this.$store.state.msgTabName)
    // console.log(window.g.IsNanShanProjectName);
    // if (window.g.IsNanShanProject) { // 判断是否为南山项目
    // this.$store.commit('SET_MsgTabName', '普通短信')
    // console.log(this.$store.state.msgTabName)
    // } else {
    //   this.$store.commit('SET_MsgTabName', 'H5短信')
    // console.log(this.$store.state.msgTabName)
    // }
    // this.msgTabName = this.$store.state.msgTabName // 获取store的短信 tab 名称
  },
  beforeDestroy() {
    sessionStorage.removeItem("store");
  },
  methods: {
    //打开信息核实/报送审核回执提醒
    openInformationTips(message, informationcdrid, date, event) {
      // this.closeAllNotification();
      let type = "";
      let title = "";
      let tyleData = [
        { id: 130, type: "审核", title: "报送审核回执" },
        { id: 131, type: "核实", title: "信息核实回执" },
        { id: 132, type: "指示", title: "领导指示回执" }
      ];
      tyleData.map(v => {
        if (v.id == informationcdrid) {
          type = v.type;
          title = v.title;
        }
      });
      let notify = this.$notify({
        title,
        position: "bottom-right",
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: this.$createElement("div", null, [
          this.$createElement(
            "span",
            {
              style: {
                color: "red",
                paddingRight: "10px"
              }
            },
            `${message}`
          ),
          this.$createElement(
            "span",
            null,
            `于 ${date} 反馈关于事件————【${event}】的【${type}流程】${type}任务`
          ),
          this.$createElement("span", {
            style: {
              padding: "10px 18px",
              textDecoration: "none",
              display: "inline-block",
              webkitTransitionDuration: "0.4s",
              transitionDuration: "0.4s",
              cursor: "pointer",
              color: "black"
            },
          })
        ]),
        duration: 5000
      });
    },
    //传真短信事件推送的方法
    faxWebSokect() {
      let _this = this;
      // 建立连接对象
      console.log(_this.$window.SITE_CONFIG["websocket"])
      let faxSocket = new SockJS(_this.$window.SITE_CONFIG["websocket"]);
      console.log(faxSocket)
      // 获取STOMP子协议的客户端对象
      this.faxClient = Stomp.over(faxSocket);
      console.log(this.faxClient)
      // 定义客户端的认证信息,按需求配置
      let headers = {
        Authorization: ""
      };
      // 向服务器发起websocket连接
      this.faxClient.connect(
        headers,
        () => {
          this.faxClient.subscribe(
            "/topic/icp/CtiNotify",
            msg => {
              //根据返回来的信息分别处理
              let message = msg;
              let msgBody = JSON.parse(message.body);
              console.log(message);
              console.log(msgBody);
              //事件通知弹窗
              // 信息处置-事件接报-信息核实-刷新核实列表
              if (msgBody.cmd && msgBody.cmd.SubCmd == "131") {
                bus.$emit("informationVerification");
                this.openInformationTips(
                  msgBody.contactorName,
                  msgBody.cmd.SubCmd,
                  msgBody.datetime,
                  msgBody.eventName
                );
              }
             
             
            },
            headers
          );
        },
        () => {}
      );
    },
    // 把数据存到previewSrc,组件要求该字段为数组
    imgOnLoad(src) {
      this.previewSrc = [];
      this.previewSrc[0] = src;
    },
    // 传真加入发送队列后，清空传真内容 author:hexinting
    clearFaxList() {
      this.expEmpty();
    },
    // 核实的查看
    hsexamine(item) {
      this.hsPoput = true;
      this.selectData = item;
      console.log(item);
    },
    // 追呼
    calling(spoe) {
      console.log(spoe, spoe.contactorMobile);
      if (spoe.contactorMobile) {
        // this.talkCall(
        //   {
        //     number: spoe.contactorMobile,
        //   },
        //   "",
        //   ""
        // );
        // this.$icp19.MakeCall(
        //   Number(sessionStorage.getItem("agent_id")),
        //   spoe.Mobile,
        //   sessionStorage.getItem("seat")
        // );
        this.makePhoneCall(spoe.contactorMobile, spoe.contactorId, null, sessionStorage.getItem('newID'));
      }
      console.log(spoe);
    },
    serMapArttr(item) {
      // console.log(item)
      item.flag = false;
      this.$emit("serMapArttr", item);
    },
    repeal(item) {
      item.flag = true;
      this.$emit("repeal", "");
    },
    prevImg(e) {
      //返回元素节点之后的兄弟元素节点
      let visponsEle = e.target.nextElementSibling;
      let headEle = visponsEle.children[0];
      if (headEle.style.left) {
        let num = parseInt(headEle.style.left);
        if (num < 0) {
          if (Math.abs(num + headEle.children[1].offsetWidth) > 0) {
            headEle.style.left = headEle.children[1].offsetLeft + num + "px";
          } else {
            headEle.style.left = "0px";
          }
        }
      }
    },
    nextImg(e) {
      let visponsEle = e.target.previousElementSibling;
      let headEle = visponsEle.children[0];
      if (headEle.style.left) {
        if (
          headEle.style.left.indexOf("-") != -1 ||
          headEle.style.left == "0px"
        ) {
          // 负数
          let num = Math.abs(parseInt(headEle.style.left));
          if (
            num + headEle.children[1].offsetWidth <
            headEle.offsetWidth - visponsEle.offsetWidth
          ) {
            headEle.style.left =
              (headEle.children[1].offsetLeft + num) * -1 + "px";
          }
        }
      } else {
        // 第一次向左移动
        if (headEle.offsetWidth > visponsEle.offsetWidth) {
          headEle.style.left = headEle.children[1].offsetLeft * -1 + "px";
        }
      }
    },
    setImgSrc(item) {
      this.bigImgFlag = true;
      this.heBigImgSrc = item;
    },
    augment() {
      this.hePage = parseInt(this.hePage);
      if (this.hePage - 1 > 0) {
        this.hePage -= 1;
        return;
      }
      this.hePage = 1;
    },
    subtract() {
      this.hePage = parseInt(this.hePage);
      if (this.hePage + 1 < this.allhePage) {
        this.hePage += 1;
        return;
      }
      this.hePage = this.allhePage;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-10-22
     * @description
     */
    requersListData() {
      // bug 7734
      if (
        sessionStorage.getItem("newID") === null ||
        sessionStorage.getItem("newID") === undefined
      ) {
        return false;
      }
      let parmas = {
        eventId: sessionStorage.getItem("newID"),
      };
      this.$api.getConfirmList(parmas).then((res) => {
        if (res.errorcode !== 0) {
          return;
        }
        let data = res.data;
        data.map((x) => {
          x.contacts = "";
          x.endtimes = "";
          x.Mobile = "";
          x.contactorId = "";
          x.callFlag = false;
          if (x.contactor && x.contactor.length != 0) {
            if (x.contactor[x.contactor.length - 1]) {
              if (x.contactor[x.contactor.length - 1].contactorId) {
                x.contacts = x.contactor[x.contactor.length - 1].contactorName
                  ? x.contactor[x.contactor.length - 1].contactorName
                  : "";
                x.Mobile = x.contactor[x.contactor.length - 1].contactorMobile
                  ? x.contactor[x.contactor.length - 1].contactorMobile
                  : "";
                x.contactorId = x.contactor[x.contactor.length - 1].contactorId
                  ? x.contactor[x.contactor.length - 1].contactorId
                  : "";
              } else {
                x.contacts = x.contactor[x.contactor.length - 1].contactorMobile
                  ? x.contactor[x.contactor.length - 1].contactorMobile
                  : "";
                x.Mobile = x.contactor[x.contactor.length - 1].contactorMobile
                  ? x.contactor[x.contactor.length - 1].contactorMobile
                  : "";
              }
              if (
                x.contactor[x.contactor.length - 1].result &&
                x.contactor[x.contactor.length - 1].result.length != 0
              ) {
                let arr =
                  x.contactor[x.contactor.length - 1].result[
                    x.contactor[x.contactor.length - 1].result.length - 1
                  ];
                x.endtimes = arr.distributionResultTime
                  ? arr.distributionResultTime
                  : "";
                x.callFlag = true;
              } else {
                x.callFlag = false;
              }
              // 时间轴
              let datas = x.contactor;
              datas.map((s) => {
                s.smsContent = x.smsContent;
                s.time = "";
                if (s.result && s.result.length != 0) {
                  s.time = s.result[s.result.length - 1].distributionResultTime;
                  s.result.map((d) => {
                    d.flag = true;
                    return d;
                  });
                  console.log(s.result);
                }
                return s;
              });
            }
          }
          return x;
        });
        console.log(res.data);
        this.hstableData = res.data;
      });
    },
    //获取短信签名
    getFindSmsSign() {
      let data;
      this.$api.findSmsSign(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.signatureOptions = res.data;
      });
    },
    selectBlur(e) {
      this.signature = e.target.value;
    },
    msg(tab) {
      console.log(tab.label);
      this.msgTable = tab.label;
      // if(tab.label=='H5短信'){
      if (tab.label == "短信" || tab.label == "H5短信") {
        this.nameType = "短信";
        // this.heightSms.height=300+'px'
      }
      if (tab.label == "电话") {
        this.nameType = "电话";
      }
      if (tab.label == "传真") {
        this.nameType = "传真";
      }
      // this.nameType='传真';//先隐藏掉下面的内容
      // let h = document.documentElement.clientHeight || document.body.clientHeight
      // // this.heightSms.height=h-(68+350)+'px'
    },
    getButton() {
      //获取流程设置按钮
      this.area = sessionStorage.getItem("area");
      this.areaId = sessionStorage.getItem("areaId");
      this.caseId = sessionStorage.getItem("caseID");
      this.eventId = sessionStorage.getItem("newID");
      if (this.caseId == "" || this.caseId == null) {
        return;
      }
      if (this.eventId == "newID") {
        return;
      }
      let data = {
        code: "Confirm",
        caseId: this.caseId,
      };
      this.$api.getFlow(data).then((res) => {
        if (res.errorcode == 0) {
          this.buttons = res.data;
          this.tipData = true;
          if (res.data == [] || res.data == null || res.data == "") {
            this.tipData = false;
            // 初始化无子流程默认选项 author: 许创兴 bug 8653
            this.area = sessionStorage.getItem("area");
            if (this.area) {
              this.flowSettingArr.push(
                {
                  name: this.area + "(属地负责人)",
                  id: 0,
                },
                {
                  name: "预设人员",
                  id: 1,
                }
              );
              this.flowSetting = 0;
              this.processFormTwo();
            } else {
              this.flowSettingArr.push({
                name: "预设人员",
                id: 1,
              });
            }
          } else {
            this.$nextTick(() => {
              console.log(this.$refs.flow);
              if (this.$refs.flow) {
                // 解决控制台报错
                this.$refs.flow[0].click();
              }
            });
          }
        }
      });
    },
    missPlan(list, index) {
      this.linkman = list;
      this.changeRed = index;
      this.areaId = sessionStorage.getItem("areaId");
      this.area = sessionStorage.getItem("area");
      this.folwId = list.id;
      this.flowSettingArr = [];
      if (this.buttons[index].dynamicContactor.code === 'yes') {
        if (this.area) {
          this.flowSettingArr.push(
            {
              name: this.area + "(属地负责人)",
              id: 0,
            },
            {
              name: "预设人员",
              id: 1,
            },
            {
              name: "动态设置人员",
              id: 2,
            }
          );
          this.flowSetting = 0;
          this.processFormTwo();
        } else {
          this.flowSettingArr.push(
            {
              name: "预设人员",
              id: 1,
            },
            {
              name: "动态设置人员",
              id: 2,
            }
          );
        }
      } else {
        if (this.area) {
          this.flowSettingArr.push(
            {
              name: this.area + "(属地负责人)",
              id: 0,
            },
            {
              name: "预设人员",
              id: 1,
            }
          );
          this.flowSetting = 0;
          this.processFormTwo();
        } else {
          this.flowSettingArr.push({
            name: "预设人员",
            id: 1,
          });
        }
      }
    },
    setClick(index) {
      //设置点击按钮
      console.log(index);
      let name = [
        {
          name: "事件联系人",
        },
      ];
      if (this.buttons[index].dynamicContactor.code === 'yes') {
        console.log(index, name, this.buttons);
        let caseName = sessionStorage.getItem("caseName");
        let caseId = sessionStorage.getItem("caseID");
        this.$emit("setClick", index, name, this.buttons, caseName, caseId);
      }
    },
    processForm(value) {
      console.log(value);
      console.log(this.flowSetting);
      this.tableData = [];
      this.total = 0;
      if (this.msgTable == "电话") {
        this.$refs.tableEvent.eventshowPhone();
      }
      // else if(this.msgTable=='H5短信'){
      else if (this.msgTable == "短信" || this.msgTable == "H5短信") {
        this.$refs.tableEvent.eventshowline();
      } else if (this.msgTable == "传真") {
      }
      this.sorter = "表格";
      this.currentPage = 1;
      if (this.flowSetting === 0) {
        let data = {
          areaId: this.areaId,
          page: this.currentPage,
          size: this.pageSize,
        };
        this.$api.areaList(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      } else if (this.flowSetting === 1) {
        let data = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
        };
        this.$api.structList(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      } else if (this.flowSetting === 2) {
        let update = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
          eventId: this.eventId,
        };
        this.$api.getFlowList(update).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      }
    },
    settingButton() {
      //点击图标切换
      this.area = sessionStorage.getItem("area");
      this.areaId = sessionStorage.getItem("areaId");
      // this.flowSettingArr=[]
      // this.flowSetting=''
      console.log(this.flowSettingArr)
      this.flowSetting = "";
      if (this.settingInput) {
        this.settingInput = false;
      } else {
        this.settingInput = true;
      }
      if (this.settingSelect) {
        this.settingSelect = false;
      } else {
        this.settingSelect = true;
        if (this.area) {
          if (this.flowSettingArr.filter(el => el.id === 0).length === 0) {
            this.flowSettingArr.push({
              name: this.area + "(属地负责人)",
              id: 0,
            });
          }
        }
      }
    },
    findContact() {
      //查找联系人
      if (this.search.trim() == "" || this.search == null) {
        this.$message({
          message: "请先输入查找内容",
          type: "warning",
        });
        return;
      }
      if (this.msgTable == "电话") {
        this.$refs.tableEvent.eventshowPhone();
      }
      // else if(this.msgTable=='H5短信'){
      else if (this.msgTable == "短信" || this.msgTable == "H5短信") {
        this.$refs.tableEvent.eventshowline();
      } else if (this.msgTable == "传真") {
      }
      this.sorter = "查找";
      this.currentPage = 1;
      let grouping = {
        groupId: "",
        page: this.currentPage,
        size: this.pageSize,
        searchText: this.search,
        dictType: "governmentAffairs",
      };

      this.$api.contactorList(grouping).then((res) => {
        console.log(res)
        if (res.errorcode == "0") {
          if (res.data == []) {
            this.tableData = [];
            this.total = 0;
          } else {
            this.tableData = res.data.list;
            this.total = res.data.totalCount;
          }
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    handleCurrentChange(row) {
      //表格点击事件
      // this.$refs.noteCheck.get(row);
    },
    pageMode(val) {
      //监听第几页
      this.currentPage = val;
      let type = this.sorter;
      switch (type) {
        case "表格":
          this.processFormTwo();
          break;
        case "查找":
          this.findContactTwo();
          break;
        default:
          break;
      }
    },
    processFormTwo() {
      if (this.flowSetting === 0) {
        let data = {
          areaId: this.areaId,
          page: this.currentPage,
          size: this.pageSize,
        };
        this.$api.areaList(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      } else if (this.flowSetting === 1) {
        let data = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
        };
        this.$api.structList(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      } else if (this.flowSetting === 2) {
        let update = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
          eventId: this.eventId,
        };
        this.$api.getFlowList(update).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      }
    },
    findContactTwo() {
      let grouping = {
        groupId: "",
        page: this.currentPage,
        size: this.pageSize,
        searchText: this.search,
        dictType: "governmentAffairs",
      };

      this.$api.contactorList(grouping).then((res) => {
        if (res.errorcode == "0") {
          if (res.data == []) {
            this.tableData = [];
            this.total = 0;
          } else {
            this.tableData = res.data.list;
            this.total = res.data.totalCount;
          }
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    handleDialPhone(row) {
      if (
        !row.mobile &&
        !row.mobile1 &&
        !row.mobile2 &&
        !row.otherTel &&
        !row.officeTel &&
        !row.homeTel &&
        !row.otherTel2 &&
        !row.temobile
      ) {
        this.$message({
          message: "该位联系人暂无联系号码",
          type: "warning",
        });
        return;
      }
      this.msgTable = "电话";
      this.nameType = "电话";
      console.log(row);
      this.$refs.phoneDisposition.ruleForm.inputMobile =
        row.mobile ||
        row.mobile1 ||
        row.mobile2 ||
        row.otherTel ||
        row.officeTel ||
        row.homeTel ||
        row.otherTel2 ||
        row.temobile;
      this.$refs.phoneDisposition.assignment(row);
    },
    handleDialsSpecialPlane(row) {
      // this.msgTable='H5短信'
      this.msgTable = this.msgTableLabel ? "短信" : "H5短信";
      this.nameType = "短信";
      this.$refs.noteCheck.get(row);
    },
    handleDialsFax(row) {
      if (row.fax == "" || row.fax == null) {
        this.$message({
          message: "该位联系人暂无传真号码!",
          type: "warning",
        });
        return;
      }
      this.msgTable = "传真";
      this.nameType = "传真";
      this.$refs.faxCheck.getFax(row);
    },
    clickBookType() {
      //联系人点击
      if (this.linkman) {
        let setting = this.linkman.dynamicContactor.code;
        if (setting === "yes") {
          this.indexBook = "联系人";
          let name = [
            {
              name: "事件联系人",
            },
          ];
          let caseName = sessionStorage.getItem("caseName");
          let caseId = sessionStorage.getItem("caseID");
          if (this.changeRed == "-1") {
            this.$message({
              message: "请先选择流程",
              type: "warning",
            });
            return;
          } else {
            let index = this.changeRed;
            console.log(index);
            this.$emit("setClick", index, name, this.buttons, caseName, caseId);
          }
        } else {
          this.$emit("closeContact");
          this.$message({
            message: "该流程不能设置人员！",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "请先选择流程",
          type: "warning",
        });
      }
    },
    clcikSend() {
      //短信发送
      if (this.smsContent.length > this.maxlength) {
        this.$message.warning(`短信内容不能超过${this.maxlength}个字`);
        return;
      }
      this.$refs.noteCheck.report = this.smsContent;
      this.$refs.noteCheck.signature = this.signature;
      this.$refs.noteCheck.sendData(this.folwId);
    },
    clickStiggeType() {
      //配置点击
      console.log("配置");
      this.indexBook = "配置";
      this.configurationDialogVisible = true;
    },
    giveDataClass() {
      this.nameType = "短信";
      if (this.smsContent.length === 0) {
        this.smsContent = `${this.$store.getters.getOverallEvent}`;
        return;
      }
      this.$confirm(
        '信息核实-短信框已有内容, 是否覆盖?点击【取消】则自动生成的内容到末尾',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        },
      )
        .then(() => {
          this.smsContent = `${this.$store.getters.getOverallEvent}`;
        })
        .catch(() => {
          this.smsContent = `${this.smsContent}${this.$store.getters.getOverallEvent}`;
        });
    },
    clickPhone(data) {
      this.clickPhoneData = data;
      this.changeColor = data.mobile;
      this.$store.commit("setCallee", data.mobile);
      this.$store.commit("setCallClass", data.callClass);
      this.$store.commit("setCallConn", data.conn);
    },
    //重新打开callwindows方法
    openCallWindow(items) {
      this.$refs.CallWindow.callIsVisible = true;
      this.$refs.CallWindow.cid = items.cid;
      this.$store.commit("setCallee", items.mobile);
      this.$store.commit("setCallClass", items.callClass);
      this.$store.commit("setCallConn", items.conn);
    },
    release(items, key) {
      this.$confirm("是否结束当前通话?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      }).then(() => {
        let self = this;
        if (self.HWICP_Version == "HWICP-19.0") {
          this.$icp19.DropCall(Number(self.agent_id), Number(items.conn), key);
        }
      });
    },

    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },

    //传真文件移除时触发
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.pdfPath = "";
      this.previewPath = "";
      this.$refs.upload.clearFiles();
    },

    /**
     * @param {Object} file 获取到文件的一些信息
     * @author hexinting
     * @date 2021-02-07
     * @description 自定义上传方法 上传到文件服务器
     */
    httpRequest(file) {
      console.log(file)
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('type', '6'); // 任务附件传3
      this.$http({
        url: window.SITE_CONFIG["fileupload"] + '/appAttachment/fileUploadAttachment',
        method: 'post',
        data: formData,
        header: {
          'Content-Type': 'multipart/form-data ',
        }
      }).then(res => {
        console.log(res)
        if(res.data.errorcode === 0) {
          this.onSuccess(res.data.data);
        }
      })
    },

    /**
     * @author hxt
     * @param {string} fileName 带有后缀名的文件名
     * @returns {string} extension 文件后缀
     * @description 根据带有后缀名的文件名，获取文件后缀
     */
    getExtensions(fileName) {
      const extension = fileName.slice(fileName.lastIndexOf('.') + 1, fileName.length);
      return extension;
    },

    /**
     * @param {obj} response 后端返回的参数
     * @lastEditor: hexinting
     * @lastDate: 2020-9-16
     * @description 上传成功
     */
    onSuccess(response) {
      // 3.0的新逻辑 start
      this.faxForm = {
        faxId: response.id, // 传真Id
        faxUrl: `${window.SITE_CONFIG["cloudUrl"]}${response.url}`, // 传真url
        faxName: response.filename, // 传真名字
      };
      if(this.getExtensions(response.filename) !== 'pdf') {
        // 因为iframe不能预览除pdf类型的文件，所以要通过接口去转换成pdf，再预览
        this.toPdf(response.id).then((res) => {
          this.pdfPath = res;
          this.previewPath = `${window.SITE_CONFIG["cloudUrl"]}${res}`;
        })
      } else {
        this.pdfPath = response.url;
        this.previewPath = `${window.SITE_CONFIG["cloudUrl"]}${response.url}`;
      }
      // 3.0的新逻辑 end

      // 注释原因：3.0接口变更，所以上传后收到的参数也不一样了
      // this.pdfPath = response.data;
      // this.previewPath = `${window.g.ApiUrl}/fax/${response.data}`;
      console.log("传真显示路径：", this.previewPath);
      console.log("上传传真成功-传真名字：", response.data);
    },

    /**
     * @description 非pdf文件通过后端转换成pdf预览(因为iframe不能预览除pdf类型的文件，所以要通过接口去转换成pdf，再预览)
     * @param {string | number} 上传接口返回的文件id
     */
    toPdf(id) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: window.SITE_CONFIG["event"] + '/fax/previewFax',
          method: 'get',
          params: this.$http.adornParams({
            attachmentId: id,
          }),
        }).then(({ data }) => {
          console.log('/event/fax/previewFax', data);
          if (data.errorcode === 0) {
            resolve(data.data);
          } else {
            reject(data.data)
          }
        });
      })
    },

    //文件提前上传失败
    onError(err) {
      console.log(err);
      this.$message({
        message: "请重新选择文件",
        type: "warning",
      });
    },

    //利用假上传获取文件判断格式
    beforeUpload(file) {
      this.uploadForm.push(file);
      console.log(file);
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "jpeg";
      const extension3 = testmsg === "png";
      const extension4 = testmsg === "pdf";
      const extension5 = testmsg === "ppt";
      const extension6 = testmsg === "pptx";
      const extension7 = testmsg === "doc";
      const extension8 = testmsg === "docx";
      const extension9 = testmsg === "txt";
      const extension10 = testmsg === "xlsx";
      const extension11 = testmsg === "xls";
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5 &&
        !extension6 &&
        !extension7 &&
        !extension8 &&
        !extension9 &&
        !extension10 &&
        !extension11
      ) {
        this.$message({
          message: "请上传正确的文件格式",
          type: "warning",
        });
      }

      // if(!isLt2M) {
      //     this.$message({
      //         message: '上传文件大小不能超过 10MB!',
      //         type: 'warning'
      //     });
      // }
      // return extension || extension2 && isLt2M
      return (
        extension ||
        extension2 ||
        extension3 ||
        extension4 ||
        extension5 ||
        extension6 ||
        extension7 ||
        extension8 ||
        extension9 ||
        extension10 ||
        extension11
      );
    },

    //文件超出个数限制时的钩子
    onExceed() {
      this.$message({
        message: "请先删除已选择的文件再进行上传!",
        type: "warning",
      });
    },

    //清空文件
    expEmpty() {
      this.pdfPath = "";
      this.previewPath = "";
      this.$refs.upload.clearFiles();
    },

    //全屏预览
    fullScreen() {
      if (this.previewPath == "" || this.previewPath == null) {
        this.$message({
          message: "请先选择传真文件在进行预览",
          type: "warning",
        });
        return;
      }
      this.dialogVisible = true;
    },

    /**
     * @lastEditor: hexinting
     * @lastDate: 2020-9-16
     * @description 发送传真
     */
    submitUpload() {
      // this.$refs.faxCheck.submitUpload(this.uploadForm, this.pdfPath);
      // 注释原因：3.0接口变更，所以上传后收到的参数也不一样了
      this.$refs.faxCheck.submitSendFax({
        appAttachmentId: this.faxForm.faxId,
        faxName: this.faxForm.faxName,
        faxFileUrl: this.faxForm.faxUrl,
      })
    },

    //配置弹窗关闭事件
    handleClose() {
      this.configurationDialogVisible = false;
    },

    //配置弹窗确定
    confirmDialog() {
      this.configurationDialogVisible = false;
    },
    // 更新配置
    updateFlow() {
      this.getButton();
    },
    // 信息核实发送后回调
    verificationRecords(){
        this.smsContent = ""
        this.requersListData() //刷新列表
    }
  },
};
</script>

<style scoped>
.aLink {
  cursor: pointer;
  padding: 0 10px;
  margin: 10px 0;
}

.aLink .red >>> .el-button {
  /* color: white !important; */
  border: 1px solid #2d8cf0;
}

.divButton {
  color: #7e7f83;
  border-radius: 5px;
  height: 40px;
  font-size: 14px;
  cursor: pointer;
}

.setting >>> .el-select {
  width: 100%;
}

.aLink >>> .el-button {
  border: 1px solid #ddd;
}

>>> .el-card__body {
  display: flex;
  padding: 0;
  width: 100%;
}

.backCoror {
  background-color: #f9fbff;
  flex: 1; 
  text-align: center; 
  cursor: pointer
}

.bottomRow {
  width: 100%;
  display: flex;
  height: 50px;
  line-height: 50px;
}

.export {
  color: #909399;
  vertical-align: middle;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  white-space: nowrap;
  font-size: 14px;
}

.leftSelect {
  flex: 2;
  text-align: left;
}

.rightButton {
  flex: 1;
  text-align: right;
}

.leftSelect >>> .el-input {
  width: 100px;
}

.leftSelect >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
}

.rightIcon {
  width: 100%;
  height: 100%;
  background: url("/static/img/svg/row.svg") center no-repeat;
  background-size: 44px 35px;
}

#iconButton {
  height: 40px !important;
  padding: 0px 6px;
}

#iconButton >>> .el-icon-refresh {
  font-size: 20px;
}

.row-left {

}
.row-right {
  display: flex;
  justify-content: flex-end;
}

.peopleList {
  height: 235px;
  border: 1px solid #ddd;
}

.showPhone {
  font-size: 0px;
  color: #fff;
  height: 30px;
  display: flex;
}

.showPhoneLeft {
  height: 30px;
  flex: 8;
  background: rgb(69, 69, 69);
}

.showPhoneRight {
  flex: 2;
  height: 30px;
  background: rgb(37, 37, 37);
}

.showPhoneLeft div {
  font-size: 14px;
  line-height: 30px;
  width: 45%;
  padding-left: 5%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.showPhoneRight i {
  font-size: 20px;
  cursor: pointer;
}

.showPhoneRight div {
  font-size: 20px;
  padding: 0 10px;
  display: inline-block;
}

/* 核实 */
.heDivWrap {
  height: 500px;
  margin-top: 70px;
  display: flex;
  flex-direction: column;
}

.heDivTitle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 10px;
}

.heDivTitle > img {
  width: 20px;
  height: 16px;
  margin-right: 10px;
}

.heDivContent {
  flex: 1;
  overflow-y: hidden;
  overflow-x: hidden;
  border: 1px solid rgba(221, 221, 221, 1);
}

.heDivContent /deep/ tr > td:first-child .cell,
.heDivContent /deep/ tr > th:first-child .cell {
  padding-left: 10px;
}

.heDivContent /deep/ .cell {
  padding: 0;
}

.heDivContent /deep/ .cell div {
  /* min-height: 46px; */
}

.heDivContent /deep/ thead tr {
  background: #f5f7fa;
  font-weight: 600;
  color: #333333;
}

.heDivPage {
  display: flex;
  font-family: "黑体";
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.heDivPage > input::-webkit-outer-spin-button,
.heDivPage > input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.heDivPage > input {
  width: 40px;
  height: 18px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 11px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  outline: none;
  margin-right: 13px;
  text-align: center;
}

.heDivPage > span:first-child {
  margin-right: 15px;
}

.heDivPage > span:last-child {
  margin-left: 15px;
}

.heDivPage > span:first-child,
.heDivPage > span:last-child {
  cursor: pointer;
}

.informationToVerify_wrap {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 滚动条 */
.informationToVerify_wrap >>> ::-webkit-scrollbar {
  background: transparent;
  width: 5px;
  height: 5px;
}
.informationToVerify_wrap >>> ::-webkit-scrollbar-thumb {
  background: #d5d5d5;
  border-radius: 5px;
}

.informationToVerify_wrap .el-pagination {
  margin-top: 0;
}

.hePoputWarp {
  width: 600px;
  position: absolute;
  top: 25px;
  right: 5px;
  z-index: 99;
  background: #fff;
  border-radius: 5px;
  height: 527px;
  box-shadow: 0px 3px 10px 2px rgba(44, 45, 46, 0.16);
  display: flex;
  flex-direction: column;
}

.hePoputTitle {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  height: 40px;
  background: rgba(241, 244, 246, 1);
  border-radius: 5px 5px 0px 0px;
  align-items: center;
}

.hePoputTitle > span {
  font-size: 13px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}

.hePoputTitle > img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.hePoputContent {
  overflow-y: auto;
  flex: 1;
  padding: 0px 12px 0px;
  box-sizing: border-box;
}

.fromList {
  border-bottom: 1px solid #ddd;
  padding: 0;
  margin: 0px 0 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 10px;
}

.fromList > li {
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  text-align: left;
  margin-top: 10px;
}

.fromList > .tsfromListLi {
  width: 50%;
}

.hePoputMap_wrap {
  background: #f9fbff;
  margin: 6px 5px 0px;
  padding-bottom: 10px;
}

.hePoputMap_wrap_ul {
  border-radius: 3px;
  padding: 0 10px;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0;
}

.hePoputMap_wrap_li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
}

.hePoputMap_wrap_li > span {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 145, 255, 1);
  cursor: pointer;
}

.hePoputMap_wrap_li_div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hePoputMap_wrap_li_div > span {
  font-size: 12px;
}

.hePoputMap_wrap_li_div > span:nth-child(1) {
  color: #323232;
  margin-bottom: 5px;
  font-weight: 600;
}

.hePoputMap_wrap_li_div > span:nth-child(2) {
  color: #666666;
}

.hePoputImg {
  margin: 0 5px;
  display: flex;
  align-items: center;
  position: relative;
}

.hePoputImg > img {
  position: absolute;
  width: 20px;
  height: 20px;
  cursor: pointer;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 9999;
}

.prevBtn {
  left: 6px;
}

.nextBtn {
  right: 6px;
}

.heVispons {
  width: 100%;
  height: 74px;
  overflow: hidden;
  position: relative;
}

.heVispons > ul {
  margin: 0;
  padding: 0;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s;
}

.heVispons > ul li:last-child {
  margin: 0;
}

.heVispons_li {
  list-style: none;
  width: 130px;
  height: 74px;
  margin-right: 9px;
  position: relative;
}

.heVispons_li > img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.heVispons_li:hover .heVispons_li_mover {
  height: 100%;
}

.heVispons_li_mover {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 5, 5, 0.62);
  border-radius: 3px;
  transition: all 0.1s;
  overflow: hidden;
  cursor: pointer;
  pointer-events: none;
}

.heVispons_li_mover > img {
  width: 30px;
  height: 22px;
}

.bigImgWrap {
  position: fixed;
  top: 243px;
  left: 30%;
  width: 600px;
  height: 415px;
  border-radius: 5px;
  background: rgba(241, 244, 246, 1);
  z-index: 9999999999;
}

.bigImgWrap > img {
  width: 100%;
  height: 376px;
}

.bigImgTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 20px;
  height: 40px;
}

.bigImgTitle > span {
  font-size: 13px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

.bigImgTitle > img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.hePoputContentTime {
  margin: 0px 0 6px 0;
  padding: 0 5px;
  box-sizing: border-box;
  text-align: left;
  color: #666666;
  font-size: 12px;
}

.margin10 {
  margin-top: 10px;
}

.margin20 {
  margin-top: 20px;
}

.tips-box {
  height: 76px; 
  flex: 1.2; 
  width: 78px;
  /* width: 156px;  */
  display: flex;
  position: relative;
}
.tips-box .tips-box-card {
  display: flex; 
  font-size: 14px; 
  /* width: 156px; */
  width: 78px;
  border: none;
  box-shadow: 0px -3px 10px 0px rgba(0,0,0,0.18);
}

.tips-box .tips-box-card .tips-box-card-item {
  flex: 1; 
  text-align: center; 
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.tips-box .tips-box-card .img-contactor {
  background: url("/static/img/svg/contactor.svg") center no-repeat;
  width: 28px;
  height: 20px;
}
.tips-box .tips-box-card .img-setting {
  background: url('/static/img/svg/st.svg') center no-repeat;
  width: 28px;
  height: 20px;
}

.tips-box .tips-box-card .img-label {
  height: 42px;
  line-height: 42px;
  color: #999999;
}

.tips-box .triangle {
  width: 0;
  height: 0;
  position: absolute;
  left: -16px;
  top: 38%;
  border: 8px solid #ebeef5;
  border-color: transparent #ffffff transparent transparent;
}

.informationToVerify_wrap .tabs-wrap >>> .el-tabs__header {
  height: 52px !important;
  background: #F9FBFF;
  border: none;
}
.informationToVerify_wrap .tabs-wrap >>> .el-tabs__nav-scroll,
.informationToVerify_wrap .tabs-wrap >>> .el-tabs__nav-wrap,
.informationToVerify_wrap .tabs-wrap >>> .el-tabs__nav,
.informationToVerify_wrap .tabs-wrap >>> .el-tabs__item {
  height: 52px;
  line-height: 52px;
}
.informationToVerify_wrap  .tabs-wrap >>> .el-tabs__item.is-active {
  border: none !important;
  border-bottom: 3px solid #3F92FE !important;
  font-weight: 400;
  color: #6e5858 !important;
}
.informationToVerify_wrap  .tabs-wrap >>> .el-tabs__item {
  border: none !important;
  border-bottom: 3px solid transparent !important;
  font-weight: 400;
  color: #999999 !important;
  background: transparent;
}
.smsTextarea >>> .el-textarea__inner {
  background: transparent;
}
>>> .el-tabs__header.is-top {
  padding: 0px;
}
</style>
