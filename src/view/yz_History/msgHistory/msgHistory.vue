<!--@author：wzm-->
<template>
  <div class="out">
    <!--    <el-tabs type="border-card" class="card">-->
    <div class="all">
      <div class="left">
        <!--          <nav-bar style="width:300px;height:42px;background: white;margin: 0"  ref="navBar" :selectedName="selectedName" :navBarList="navBarList" class="narBar"-->
        <!--                   @changTab="changTab" type="card"></nav-bar>-->
        <el-tabs
          v-model="statusActive"
          type="card"
          @tab-click="changTab"
          class="tab"
        >
          <el-tab-pane label="全部" name="msgAll"></el-tab-pane>
          <el-tab-pane label="发送记录" name="sendHistory"></el-tab-pane>
          <el-tab-pane label="联系人记录" name="contactRecords"></el-tab-pane>
        </el-tabs>
        <div style="background: white; height: 735px; padding-top: 10px">
          <el-form label-width="80px" style="">
            <!--            <span>短信类型</span>-->
            <!--            <el-select style="width:80px" v-model="one">-->
            <!--              <el-option v-for="(item,key) in options" :key="key" :label="item.name" :value="item.id">-->
            <!--              </el-option>-->
            <!--            </el-select>-->
            <!--              选择器切换-->
            <!--              <div style="display: inline-block;">-->
            <!--                <el-select style="width: 141px;padding-left: 10px" class="sty" v-model="statusActive">-->
            <!--                  <el-option v-for="(item,key) in msgList"-->
            <!--                             :key="key"-->
            <!--                             :label="item.label"-->
            <!--                             :value="item.value">-->
            <!--                  </el-option>-->
            <!--                </el-select>-->
            <!--              </div>-->
            <!-- 全部 -->
            <div
              v-if="statusActive == 'msgAll'"
              style="
                display: inline-block;
                padding-left: 33px;
              "
            >
              <div style="display: inline-block; transform: translateY(-10px)">
                <span class="sty">收/发</span>
                <el-select
                  style="width: 90px"
                  class="sty"
                  v-model="nowType"
                  clearable
                >
                  <el-option
                    v-for="(item, key) in typeList"
                    :key="key"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="display: inline-block; transform: translateY(-10px)">
                <span class="sty">状态</span>
                <el-select
                  style="width: 112px"
                  class="sty"
                  v-model="nowStatus"
                  clearable
                >
                  <el-option
                    v-for="(item, key) in statusoptions"
                    :key="key"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="display: inline-block; transform: translateY(-10px)">
                <span class="sty">类型</span>
                <el-select
                  style="width: 90px"
                  class="sty"
                  v-model="sms_type"
                  clearable
                >
                  <el-option
                    v-for="(item, key) in smsTypeList"
                    :key="key"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div
                style="
                  display: inline-block;
                  padding-right: 10px;
                  transform: translateY(2px);
                  width: 30%;
                "
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="date"
                  type="daterange"
                  start-placeholder="请选择日期范围"
                  range-separator=" "
                >
                </el-date-picker>
              </div>
              <div style="display: inline-block; width: 23%;position: relative;transform: translateY(-10px);">
                <el-input
                  v-model="searchText"
                  style="width: 95%"
                  class="sty"
                  placeholder="请输入姓名、电话等关键字"
                >
                </el-input>
                <div
                  style="
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    transform: translate(-10px, 0);position: absolute;right:0%;top:0%;
                  "
                >
                  <el-button
                    @click="lookupAll(1)"
                    type="primary" style="position: absolute;right: 0%;top: 0%;"
                    class="search el-icon-search"
                  >
                  </el-button>
                </div>
              </div>

                <el-button
                style="background: #0091FF;font-size:14px;color: white;border: none" @click="onbatchEvents"
              >{{tableConfig.selection?'完成关联':'批量关联事件'}}</el-button>
              <el-popover width="150px" v-if="tableConfig.selection"
                    placement="bottom"
                    v-model="tablePopoverVisible"
                    popper-class="eventOptions"
                    >
                    <div class="eventSearch">
                        <el-input
                        v-model="searchText"
                        placeholder="请输入关键字"
                        size="small"
                        >
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-search"
                            @click="searchEvent"
                        ></i>
                        </el-input>
                    </div>
                    <template v-if="EventList.length > 0">
                        <ul class="eventList">
                        <li
                            v-for="item in EventList"
                            :key="item.id"
                            class="evenyEvent"
                            @click="selectLeftTableEvent(item)"
                            :style="selectEventStyle(item.id)"
                        >
                            {{ item.title }}
                        </li>
                        <div class="loadMore">
                            <el-button
                            round
                            icon="iconfont icon-loadMore"
                            size="mini"
                            @click="loadMoreHandle"
                            v-if="loadMore"
                            >加载更多</el-button
                            >
                            <div v-else>暂无更多数据</div>
                        </div>
                        </ul>
                    </template>
                    <template v-else>
                        <div style="text-align: center; margin-top: 10px">暂无数据</div>
                    </template>

                    <el-input
                        slot="reference"
                        v-model="left_form.eventTitle"
                        readonly
                        placeholder="请选择关联事件"
                    ></el-input>
                </el-popover>

            </div>
            <!-- 发送记录 -->
            <div
              v-if="statusActive == 'sendHistory'"
              style="display: inline-block; padding-left: 25px"
            >
              <div style="display: inline-block;">
                <el-input
                  v-model="searchText"
                  style="width: 325px"
                  class="sty"
                  placeholder="请输入短信内容关键字"
                >
                </el-input>
                <div
                  style="
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    transform: translate(-10px, 0);
                  "
                >
                  <el-button
                    @click="lookup(1)"
                    type="primary"
                    class="search el-icon-search"
                  >
                  </el-button>
                </div>
              </div>
              <div
                style="display: inline-block; padding-right: 10px;"
              >
                <el-date-picker
                  style="width: 281px"
                  v-model="date"
                  type="daterange"
                  start-placeholder="请选择日期范围"
                  range-separator=" "
                >
                </el-date-picker>
              </div>
              <div style="display: inline-block;transform: translateY(-10px);">
                <span class="sty">发送类型</span>
                <el-select
                  style="width: 112px"
                  class="sty"
                  v-model="sendType"
                  clearable
                >
                  <el-option
                    v-for="(item, key) in sendTypeList"
                    :key="key"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>

               <el-button
                style="background: #0091FF;font-size:14px;color: white;border: none" @click="onbatchEvents"
              >{{tableConfig.selection?'完成关联':'批量关联事件'}}</el-button>
              <el-popover width="150px" v-if="tableConfig.selection"
                    placement="bottom"
                    v-model="tablePopoverVisible"
                    popper-class="eventOptions"
                    >
                    <div class="eventSearch">
                        <el-input
                        v-model="searchText"
                        placeholder="请输入关键字"
                        size="small"
                        >
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-search"
                            @click="searchEvent"
                        ></i>
                        </el-input>
                    </div>
                    <template v-if="EventList.length > 0">
                        <ul class="eventList">
                        <li
                            v-for="item in EventList"
                            :key="item.id"
                            class="evenyEvent"
                            @click="selectLeftTableEvent(item)"
                            :style="selectEventStyle(item.id)"
                        >
                            {{ item.title }}
                        </li>
                        <div class="loadMore">
                            <el-button
                            round
                            icon="iconfont icon-loadMore"
                            size="mini"
                            @click="loadMoreHandle"
                            v-if="loadMore"
                            >加载更多</el-button
                            >
                            <div v-else>暂无更多数据</div>
                        </div>
                        </ul>
                    </template>
                    <template v-else>
                        <div style="text-align: center; margin-top: 10px">暂无数据</div>
                    </template>

                    <el-input
                        slot="reference"
                        v-model="left_form.eventTitle"
                        readonly
                        placeholder="请选择关联事件"
                    ></el-input>
                </el-popover>

            </div>
            <!-- 联系人记录 -->
            <div
              v-if="statusActive == 'contactRecords'"
              style="display: inline-block; padding-left: 33px"
            >
              <div style="display: inline-block; padding-right: 10px">
                <el-date-picker
                  style="width: 281px"
                  v-model="date"
                  type="daterange"
                  start-placeholder="请选择日期范围"
                  range-separator=" "
                >
                </el-date-picker>
              </div>
              <div style="display: inline-block">
                <el-input
                  v-model="searchText"
                  style="width: 325px"
                  class="sty"
                  placeholder="请输入姓名、单位、职务、电话关键字"
                >
                </el-input>
                <div
                  style="
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    transform: translate(-10px, 0);
                  "
                >
                  <el-button
                    @click="lookupContacts(1)"
                    type="primary"
                    class="search el-icon-search"
                  >
                  </el-button>
                </div>
              </div>

              <!-- <el-button
                style="background: #0091FF;font-size:14px;color: white;border: none" @click="onbatchEvents"
              >{{tableConfig.selection?'完成关联':'批量关联事件'}}</el-button> -->
              <el-popover width="150px" v-if="tableConfig.selection"
                    placement="bottom"
                    v-model="tablePopoverVisible"
                    popper-class="eventOptions"
                    >
                    <div class="eventSearch">
                        <el-input
                        v-model="searchText"
                        placeholder="请输入关键字"
                        size="small"
                        >
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-search"
                            @click="searchEvent"
                        ></i>
                        </el-input>
                    </div>
                    <template v-if="EventList.length > 0">
                        <ul class="eventList">
                        <li
                            v-for="item in EventList"
                            :key="item.id"
                            class="evenyEvent"
                            @click="selectLeftTableEvent(item)"
                            :style="selectEventStyle(item.id)"
                        >
                            {{ item.title }}
                        </li>
                        <div class="loadMore">
                            <el-button
                            round
                            icon="iconfont icon-loadMore"
                            size="mini"
                            @click="loadMoreHandle"
                            v-if="loadMore"
                            >加载更多</el-button
                            >
                            <div v-else>暂无更多数据</div>
                        </div>
                        </ul>
                    </template>
                    <template v-else>
                        <div style="text-align: center; margin-top: 10px">暂无数据</div>
                    </template>

                    <!-- <el-input
                        slot="reference"
                        v-model="left_form.eventTitle"
                        readonly
                        placeholder="请选择关联事件"
                    ></el-input> -->
                </el-popover>
            </div>
          </el-form>
          <!--          <el-button @click="handleAdd" type="primary" style="margin-top: 10px;">添加到联系人</el-button>-->
          <!--          <my-table height='685px' @handleCurrentChange="test" :tableColumn="tableColumn"-->
          <!--                    :tableData="tableData"></my-table>-->
          <!-- 全部 -->
          <msg-all
            v-show="statusActive == 'msgAll'"
            ref="refTableMsgAll"
            @selectrow="selectrow"
            @selectallrow="selectallrow"
            :tableConfig="tableConfig"
            :sendTable="allTableData"
            :clickQueryAll="clickQueryAll"
            @getStatusOptions="getStatusOptions"
            @changeALL="changeALL"
            :nowType="nowType"
            :nowStatus="nowStatus"
            :searchText="searchText"
            :size="allSize"
            style="padding-top: 0; max-height: 590px; overflow: auto"
          ></msg-all>
          <el-pagination
            v-show="statusActive == 'msgAll'"
            background
            layout="total,prev, pager, next, sizes, jumper"
            @size-change="allSizeChange"
            :total="totalElementsAll"
            @current-change="lookupAll"
            :current-page="parseInt(nowPage)"
            style="text-align: right; background: white; padding: 8px 5px"
          ></el-pagination>
          <!-- 发送记录 -->
          <send-history
            ref="sendHistory"
            v-show="statusActive == 'sendHistory'"
            @selectrow="selectrow"
              @selectallrow="selectallrow"
            :tableConfig="tableConfig"
            :sendTable="sendTableData"
            @changeSMS="changeSMS"
            @lookup="lookup"
            :size="allSize"
            style="padding-top: 0; max-height: 590px; overflow: auto"
          ></send-history>
          <el-pagination
            v-show="statusActive == 'sendHistory'"
            background
            layout="total,prev, pager, next, sizes, jumper"
            @size-change="sendSizeChange"
            :total="totalElementsSend"
            @current-change="lookup"
            :current-page="parseInt(nowPage)"
            style="text-align: right; background: white; padding: 8px 5px"
          ></el-pagination>
          <!-- 联系人记录 -->
          <contact-records
            v-show="statusActive == 'contactRecords'"
            ref="contactRecords"
            @selectrow="selectrow"
              @selectallrow="selectallrow"
            :tableConfig="tableConfig"
            :sendTable="contactsTableData"
            @changeCon="changeCon"
            @lookupContacts="lookupContacts"
            :size="allSize"
            style="padding-top: 0; max-height: 590px; overflow: auto"
          ></contact-records>
          <el-pagination
            v-show="statusActive == 'contactRecords'"
            background
            layout="total,prev, pager, next, sizes, jumper"
            @size-change="contactsSizeChange"
            :total="totalElementsCon"
            @current-change="lookupContacts"
            :current-page="parseInt(nowPage)"
            style="text-align: right; background: white; padding: 8px 5px"
          ></el-pagination>
        </div>

        <!-- 分页器 -->
        <!--          <el-pagination :small="pagingSize" :page-size="pageSize" :total="total" @current-change="handleCurrentChange"-->
        <!--                         :current-page.sync="currentPage" layout="total, prev, pager, next, jumper"></el-pagination>-->
      </div>
      <div class="right">
        <!--          <el-form ref="form" label-width="80px">-->
        <!--            <el-form-item label="关联事件">-->
        <!--              <el-select v-model="todolist" filterable  placeholder="" clearable-->
        <!--                         @change="eventReport = {id:0,title:''}">-->
        <!--                <el-option v-for="item in eventOptions" :key="item.id" :label="item.title" :value="item.id">-->
        <!--                </el-option>-->
        <!--              </el-select>-->
        <!--              <el-button type="primary" size="mini" @click="selectEvent">选择</el-button>-->
        <!--            </el-form-item>-->
        <!--            <el-form-item label="事件续报">-->
        <!--              <el-input v-model="eventReport.title" style="width:217px" placeholder=""></el-input>-->
        <!--              <el-button type="primary" @click="selectEventDeal" size="mini">选择</el-button>-->
        <!--            </el-form-item>-->
        <!--            <el-form-item>-->
        <!--              <el-input type="textarea" v-model="content" :autosize="{ minRows: 15, maxRows: 20}"-->
        <!--                        placeholder="请输入内容"></el-input>-->
        <!--            </el-form-item>-->
        <!--            <el-form-item>-->
        <!--              <el-button type="primary" @click="save" size="mini">保存</el-button>-->
        <!--              <el-button type="primary" @click="reply" size="mini">回复</el-button>-->
        <!--              <el-button type="primary" @click="forward" size="mini">转发</el-button>-->
        <!--              <el-button type="primary" @click="repeat" size="mini">重发</el-button>-->
        <!--              <el-button type="primary" @click="called" size="mini">呼叫</el-button>-->
        <!--            </el-form-item>-->
        <!--            -->
        <!--          </el-form>-->
        <!--全部-->
        <el-form
          v-if="statusActive == 'msgAll'"
          ref="formAll"
          label-width="80px"
          style="padding: 17px 17px 7px; position: relative; background: white"
        >
          <h2 class="title">短信详情</h2>
          <div class="container">
            <span style="position: absolute">短信内容</span>
            <el-form-item>
              <!--                <el-input-->
              <!--                  type="textarea"-->
              <!--                  placeholder="请输入内容"-->
              <!--                  v-model="textareaAll"-->
              <!--                  maxlength="500"-->
              <!--                  show-word-limit-->
              <!--                  class="textContent"-->
              <!--                >-->
              <!--                </el-input>-->
              <div
                style="
                  border: 1px solid #dcdfe6;
                  height: 464px;
                  width: 100%;
                  border-radius: 4px;
                  padding: 5px 15px 30px;
                  position: relative;
                  box-sizing: border-box;
                "
              >
                <div
                  style="
                    overflow: auto;
                    height: 430px;
                    line-height: 20px;
                    overflow-wrap: break-word;
                    width: 100%;
                  "
                >
                  {{ textareaAll }}
                </div>
                <div style="line-height: 14px; color: rgba(153, 153, 153, 1)">
                  {{ textareaAll ? textareaAll.length : "0" }}/500
                </div>
              </div>
            </el-form-item>
            <span style="position: absolute; line-height: 42px">事件关联</span>
            <el-form-item>
              <el-popover
                placement="bottom"
                v-model="visible"
                popper-class="eventOptions"
              >
                <div class="eventSearch">
                  <el-input
                    v-model="searchText"
                    placeholder="请输入关键字"
                    size="small"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      @click="searchEvent"
                    ></i>
                  </el-input>
                </div>
                <!-- <div class="recentOptions">
                <div class="recentTitle">近期选择：</div>
                <ul class="recentList">
                  <li class="eachRecent">08.27天河区自然灾害</li>
                </ul>
              </div> -->
                <template v-if="EventList.length > 0">
                  <ul class="eventList">
                    <li
                      v-for="item in EventList"
                      :key="item.id"
                      class="evenyEvent"
                      @click="selectEvent(item)"
                      :style="selectEventStyle(item.id)"
                    >
                      {{ item.title }}
                    </li>
                    <div class="loadMore">
                      <el-button
                        round
                        icon="iconfont icon-loadMore"
                        size="mini"
                        @click="loadMoreHandle"
                        v-if="loadMore"
                        >加载更多</el-button
                      >
                      <div v-else>暂无更多数据</div>
                    </div>
                  </ul>
                </template>
                <template v-else>
                  <div style="text-align: center; margin-top: 10px">
                    暂无数据
                  </div>
                </template>

                <el-input
                  slot="reference"
                  style="width: 100%;"
                  v-model="eventTitle"
                  readonly
                  placeholder="请选择"
                ></el-input>
              </el-popover>
              <!--                <div class="add-event" >-->
              <!--                  <span class="el-icon-plus"></span>-->
              <!--                </div>-->
            </el-form-item>
            <span style="position: absolute; line-height: 42px">通信单位</span>
            <el-form-item>
              <!--                <el-select style="width: 382px;height: 42px;" class="sty" v-model="sendType">-->
              <!--                  <el-option v-for="(item,key) in sendTypeList" :key="key" :label="item.name" :value="item.id">-->
              <!--                  </el-option>-->
              <!--                </el-select>-->

              <!--                <el-input v-model="comUnit" style="width:100%;height: 42px;" class="sty" placeholder="如：应急局" :disabled="!checked"></el-input>-->
              <el-input
                v-model="comUnit"
                style="width: 100%; height: 42px"
                class="sty"
                placeholder="如：应急局"
              ></el-input>
            </el-form-item>
            <div style="text-align: right">
              <el-checkbox v-model="checked" :disabled="isSend"
                >存为事件续报</el-checkbox
              >
            </div>
            <el-button
              type="primary"
              style="position: absolute; top: -30px; right: 40px"
              @click="save"
              >保存</el-button
            >
          </div>
          <div class="icons">
            <div
              style="display: inline-block; margin: 15px 10px 15px 0"
              @click="talkCall(contactReply)"
            >
              <!--                <span v-show="true" style="position: absolute;top:30px;">呼叫</span>-->
              <!--                <div style="height: 35px;width: 37px;margin-top: 50px" slot="reference">-->
              <!--                  <img src="/static/img/msgIcon/phone.png" width="37px" height="35px">-->
              <!--                </div>-->
              <el-tooltip
                class="item"
                effect="dark"
                content="呼叫"
                placement="top"
                style="cursor: pointer"
              >
                <el-button style="height: 35px; width: 37px" class="icon phone">
                </el-button>
              </el-tooltip>
            </div>
            <div
              style="display: inline-block; margin-right: 10px"
              @click="showZhuanfa"
            >
              <!--                <span v-show="true" style="position: absolute;top:30px;">转发</span>-->
              <!--                <div style="height: 35px;width: 37px;margin-top: 50px;vertical-align: top">-->
              <!--                  <img src="/static/img/msgIcon/zhuanfa.png" width="37px" height="35px">-->
              <!--                </div>-->
              <el-tooltip
                class="item"
                effect="dark"
                content="转发"
                placement="top"
                style="cursor: pointer"
              >
                <el-button
                  style="height: 35px; width: 37px"
                  class="icon zhuanfa"
                >
                </el-button>
              </el-tooltip>
            </div>
            <div
              style="display: inline-block; margin-right: 10px"
              v-if="direct == '接收'"
              @click="showReply"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="回复"
                placement="top"
                style="cursor: pointer"
              >
                <el-button style="height: 35px; width: 37px" class="icon huifu">
                </el-button>
              </el-tooltip>
            </div>
            <div
              style="display: inline-block; margin-right: 10px"
              v-if="direct == '发送'"
              @click="showRetransmission"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="重发"
                placement="top"
                style="cursor: pointer"
              >
                <el-button
                  style="height: 35px; width: 37px"
                  class="icon chongfa"
                >
                </el-button>
              </el-tooltip>
            </div>
            <div
              style="display: inline-block; margin-right: 10px"
              @click="doBlackList"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="blackListDetail.title"
                placement="top"
                style="cursor: pointer"
                v-model="toolTip"
              >
                <el-button
                  style="height: 35px; width: 37px"
                  class="icon fangsaorao"
                  :class="{ 'fangsaorao-active': inBlacklist }"
                >
                </el-button>
              </el-tooltip>
            </div>
            <div
              style="display: inline-block; margin-right: 10px"
              @click="addMailList"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="加入通讯录"
                placement="top"
                style="cursor: pointer"
              >
                <el-button
                  style="height: 35px; width: 37px"
                  class="icon addressBook"
                >
                </el-button>
              </el-tooltip>
            </div>
            <!--              <div style="display: inline-block;margin-right: 10px;">-->
            <!--                <span v-show="true" style="position: absolute;top:10px;width:40px;text-align: center">登记事件</span>-->
            <!--                <div style="height: 35px;width: 37px;margin-top: 50px">-->
            <!--                  <img src="/static/img/msgIcon/dengji.png" width="37px" height="35px">-->
            <!--                </div>-->
            <!--                <el-tooltip class="item" effect="dark" content="登记事件" placement="top" style="cursor: pointer">-->
            <!--                  <el-button style="height: 35px;width: 37px;" class="icon dengji">-->
            <!--                  </el-button>-->
            <!--                </el-tooltip>-->
            <!--              </div>-->
          </div>
        </el-form>
        <!--发送记录-->
        <el-form
          v-if="statusActive == 'sendHistory'"
          ref="formSend"
          label-width="80px"
          style="position: relative"
        >
          <div class="top">
            <h2 class="title">短信详情</h2>
            <!--              <el-button type="primary" style="position:absolute;top:13px;right: 17px;">撤回</el-button>-->
            <!--              <el-input v-model="selcetedRow.content" type="textarea"-->
            <!--                        placeholder="请输入内容" style="margin: 28px 0 17px 0;"-->
            <!--                        class="detail" maxlength="500" show-word-limit></el-input>-->

            <div
              style="
                box-sizing: border-box;
                height: 235px;
                width: 100%;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                padding: 5px 15px 30px;
                margin-top: 40px;
              "
            >
              <div
                style="
                  overflow: auto;
                  height: 210px;
                  line-height: 20px;
                  overflow-wrap: break-word;
                  width: 100%;
                "
              >
                {{ selcetedRow.content }}
              </div>
              <div style="line-height: 14px; color: rgba(153, 153, 153, 1)">
                {{ selcetedRow.content ? selcetedRow.content.length : 0 }}/500
              </div>
            </div>
            <div class="info">
              <p class="info-text" style="margin: 5px 0 0 0; width: 130px">
                发送时间：<strong style="color: #333333">{{
                  selcetedRow.sendTime | timeFormat
                }}</strong>
              </p>
              <!--                <p class="info-text">发送次数：<strong style="color: #333333">{{selcetedRow.total}}</strong></p>-->
              <!--                <p class="info-text">发送间隔：<strong style="color: #333333">.....</strong></p>-->
              <!--                <p class="info-text">已发次数：<strong style="color: #333333">5次</strong></p>-->
              <p class="info-text">
                &emsp;收信人：<strong style="color: #333333"
                  >{{ selcetedRow.total || 0 }}人</strong
                >
              </p>
              <p class="info-text">
                发送成功：<strong style="color: #333333"
                  >{{ selcetedRow.success || 0 }}人</strong
                >
              </p>
              <p class="info-text">
                发送失败：<strong style="color: #333333"
                  >{{ selcetedRow.failed || 0 }}人</strong
                >
              </p>
            </div>
          </div>
          <div class="bottom">
            <!--              <div style="padding: 17px">-->
            <!--                <h2 class="title">短信队列</h2>-->
            <!--              </div>-->
            <msg-queue :groupNum="groupNum" @failSms="failSms"></msg-queue>
            <!--              <my-samll-pagination :samllPageConfig="samllPageConfig" @samllCurrentChange="samllCurrentChange"></my-samll-pagination>-->
            <div class="bottom-icon">
              <div
                style="display: inline-block; margin: 17px 10px"
                @click="showSendZhuanfa"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转发"
                  placement="top"
                  style="cursor: pointer"
                >
                  <el-button
                    style="height: 35px; width: 37px"
                    class="icon zhuanfa"
                  >
                  </el-button>
                </el-tooltip>
              </div>
              <div
                style="display: inline-block"
                v-if="resendFlag"
                @click="resend"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="重发"
                  placement="top"
                  style="cursor: pointer"
                >
                  <el-button
                    style="height: 35px; width: 37px"
                    class="icon chongfa"
                  >
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-form>
        <!--联系人记录-->
        <div
          v-if="statusActive == 'contactRecords'"
          style="
            position: relative;
            height: 750px;
            padding: 17px 17px 14px 17px;
            background: white;
          "
        >
          <h2 class="title" style="margin-bottom: 12px">短信详情</h2>
          <div class="box-card" v-for="(item, key) in smsList" :key="key">
            <div class="ball greenball" v-if="item.direct == '发送'"></div>
            <div class="ball blueball" v-if="item.direct == '接收'"></div>
            <span style="margin-left: 7px">{{ item.direct }}</span>
            <span style="margin-left: 28px">{{ isYangZhouProject?item.sendTime.substring(0,item.sendTime.lastIndexOf(':')):item.sendTime }}</span>
            <el-button
              v-if="item.status == '发送失败'"
              style="
                position: absolute;
                top: 8px;
                right: 14px;
                padding: 4px 8px;
                cursor: default;
              "
              type="danger"
              round
              plain
              >发送失败</el-button
            >
            <el-button
              v-if="item.status == '发送成功'"
              style="
                position: absolute;
                top: 8px;
                right: 14px;
                padding: 4px 8px;
                cursor: default;
              "
              type="success"
              round
              plain
              >发送成功</el-button
            >
            <el-button
              v-if="item.status == '已发送'"
              style="
                position: absolute;
                top: 8px;
                right: 14px;
                padding: 4px 8px;
                cursor: default;
              "
              type="success"
              round
              plain
              >已发送</el-button
            >
            <el-button
              v-if="item.status == '已读'"
              style="
                position: absolute;
                top: 8px;
                right: 14px;
                padding: 4px 8px;
                cursor: default;
              "
              type="primary"
              round
              plain
              >已读</el-button
            >
            <el-button
              v-if="item.status == '未读'"
              style="
                position: absolute;
                top: 8px;
                right: 14px;
                padding: 4px 8px;
                cursor: default;
              "
              type="warning"
              round
              plain
              >未读</el-button
            >
            <div style="margin: 5px 0 30px 0; overflow: auto; max-height: 80px">
              <p style="margin: 0">{{ item.content }}</p>
            </div>
            <div style="position: absolute; bottom: 5px; right: 0">
              <!-- 联系人转发 -->
              <div
                style="display: inline-block; cursor: pointer"
                @click="contactsZhuanfa(item)"
              >
                <!--                <img src="/static/img/msgIcon/zhuanfa_active.png" width="24" height="24"/>-->
                <!--                <img src="/static/img/msgIcon/zhuanfa.png" width="24" height="24"/>-->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转发短信"
                  placement="top"
                  style="cursor: pointer"
                >
                  <el-button
                    style="height: 24px; width: 24px"
                    class="icon zhuanfa small"
                  >
                  </el-button>
                </el-tooltip>
              </div>
              <!-- 联系人回复 -->
              <div
                style="display: inline-block; cursor: pointer"
                @click="contactsReply(item)"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="回复短信"
                  placement="top"
                  style="cursor: pointer"
                >
                  <el-button
                    style="height: 24px; width: 24px"
                    class="icon huifu small"
                  >
                  </el-button>
                </el-tooltip>
              </div>
              <!-- 联系人重发 -->
              <div
                style="display: inline-block; cursor: pointer"
                @click="contactsRetransmission(item)"
                v-if="item.direct != '接收'"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="重发短信"
                  placement="top"
                  style="cursor: pointer"
                >
                  <el-button
                    style="height: 24px; width: 24px"
                    class="icon chongfa small"
                  >
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
          <my-samll-pagination
            :samllPageConfig="contactPageConfig"
            @samllCurrentChange="samllCurrentChange"
            style="
              position: absolute;
              left: 50%;
              bottom: 25px;
              transform: translateX(-50%);
            "
          ></my-samll-pagination>
        </div>
      </div>
    </div>
    <!--  吸引焦点工具人  -->
    <!--    <input type="text" ref="focus" style="position:absolute;top: 0;left: 0;z-index: -99"/>-->
    <!--    </el-tabs>-->
    <!--弹窗-->
    <!--    <dialog-forward v-if="zhuanfaFlag"  @closeDialog="closeDialog"></dialog-forward>-->
    <!--    <dialog-forward1 ref="forward" v-if="zhuanfaFlag" @closeDialog="closeDialog"></dialog-forward1>-->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="zhuanfaFlag"
      width="1460px"
      top="3vh"
      append-to-body
    >
      <forward
        ref="forward"
        v-if="zhuanfaFlag"
        @closeDialog="closeDialog"
      ></forward>
    </el-dialog>
    <!--    <el-dialog title="新增联系人" :close-on-click-modal="false" :visible.sync="contactAddFlag" width="1200px" top="3vh" append-to-body>-->
    <!--      <contact-add-details ref="contactAddDetails" v-if="contactAddFlag"></contact-add-details>-->
    <!--    </el-dialog>-->

    <!--    <test :zhuanfaFlag="zhuanfaFlag" @closeDialog="closeDialog"></test>-->
    <!--    &lt;!&ndash;联系人弹窗&ndash;&gt;-->
    <contact-details-popup ref="ContactDetailsPopup"></contact-details-popup>
    <!--    &lt;!&ndash; //弹框 &ndash;&gt;-->
    <!--    <el-dialog class="msg_box" top='0' :close-on-click-modal="false" :modal='false' width='890px' title="选择事件"-->
    <!--               :visible.sync="dialogTableVisible">-->
    <!--      <el-row>-->
    <!--        <el-col :span="13">-->
    <!--          <span>查询时间：</span>-->
    <!--          <el-date-picker v-model="data1" type="daterange" range-separator="至" start-placeholder="开始日期"-->
    <!--                          end-placeholder="结束日期"></el-date-picker>-->
    <!--        </el-col>-->
    <!--        <el-col :span="11">-->
    <!--          <el-input class="ipt" placeholder="请输入搜索内容" v-model="box_ipt" clearable></el-input>-->
    <!--          <el-button type="primary" @click="box_lookup(0)">查询</el-button>-->
    <!--        </el-col>-->
    <!--      </el-row>-->

    <!--      <my-table @handleCurrentChange="click" :tableColumn="tableColumn1" :tableData="tableData1"></my-table>-->
    <!--      &lt;!&ndash; 分页器 &ndash;&gt;-->
    <!--      <el-pagination :small="pagingSize" :total="selectTotal" @current-change="box_lookup"-->
    <!--                     :current-page.sync="selectPage"-->
    <!--                     layout="total, prev, pager, next, jumper">-->
    <!--      </el-pagination>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogTableVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="succees">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->

    <!--    &lt;!&ndash; //选择关联接报弹框 &ndash;&gt;-->
    <!--    <el-dialog class="msg_box" top='0' :close-on-click-modal="false" :modal='false' width='890px' title="选择关联接报"-->
    <!--               :visible.sync="reportDialog">-->
    <!--      <el-row>-->
    <!--        <el-col :span="13">-->
    <!--          <span>报送单位：</span>-->
    <!--          <el-select v-model="reportUnit" filterable placeholder="" @change='changeSelectReport'>-->
    <!--            <el-option v-for="item in reportUnits" :key="item.value" :label="item.label" :value="item.value">-->
    <!--            </el-option>-->
    <!--          </el-select>-->
    <!--        </el-col>-->
    <!--      </el-row>-->

    <!--      <my-table @handleCurrentChange="clickReportRow" :tableColumn="tableColumn2" :tableData="tableData2"></my-table>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="reportDialog = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="addReport">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import mixin from "@/yz_integratedCommunication/icpPhone/icpPhonePage/mixin";
import navBar from "../components/navBar";
import myTable from "@/yz_components/tables/tables";
import msgAll from "../components/msgAll";
import sendHistory from "../components/sendHistory";
import contactRecords from "../components/contactRecords";
import msgQueue from "../components/msgQueue";
import dialogForward from "../components/dialogForward";
import dialogForward1 from "../components/dialogForward1";
import forward from "./dialog/forward";
import contactAddDetails from "./dialog/contactAddDetails";
import ContactDetailsPopup from "@/view/yz_integratedCommunication/contactDetailsPopup";
import myPagination from "../components/myPagination";
import mySamllPagination from "../components/mySamllPagination";
import test from "../components/test";
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

export default {
  name: "msgHistory",
  mixins: [mixin, mixin2],
  components: {
    navBar,
    myTable,
    ContactDetailsPopup,
    msgAll,
    sendHistory,
    contactRecords,
    msgQueue,
    myPagination,
    mySamllPagination,
    dialogForward,
    dialogForward1,
    forward,
    contactAddDetails,
    test,
  },
  watch: {
    eventId: function (val) {
      // console.log(val)
    },
    statusActive: function (newVal) {
      this.nowPage = 1;
    },
    nowType: function (newVal) {
      //收/发改变
      this.getStatusOptions(false);
    },

    "$route.query.type"(val) {
      if (val) {
        this.statusActive = "msgAll";
        this.nowStatus = "5";
        this.lookupAll(1, true); //表格数据
      }
    },
  },
  computed: {
    blackListDetail: function () {
      if (this.inBlacklist) {
        return {
          title: "移出黑名单",
          content: "是否将该号码从黑名单移出",
          cancel: "取消移出黑名单",
        };
      } else {
        return {
          title: "加入黑名单",
          content: "是否将该号码加入黑名单，加入后将无法接收该号码来电！",
          cancel: "取消加入黑名单",
        };
      }
    },
    selectEventStyle() {
      return function (eventId) {
        if (this.eventId == eventId) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  filters: {
    timeFormat: function (value) {
      if (!value) return "";
      value = value.toString();
      // 扬州需求 时间精确到分钟
      if(window.g.IsYangZhouProject){
        return value.slice(11,16);
      }else{
        return value.slice(11);
      }
      
    },
  },
  //新data
  data() {
    return {
        selectionrows:[],
        tableConfig: {
        selection: false
      },
        // 左边表单
      left_form: {
          eventTitle:'',
        eventId: "" 
      },
        tablePopoverVisible:false,
      smsTypeList: [], // 短信类型列表
      sms_type: "", // 短信类型（全部）
      toolTip: false,
      selectedName: "全部", //默认选中导航条
      navBarList: [
        {
          name: "全部",
        },
        {
          name: "发送记录",
        },
        {
          name: "联系人记录",
        },
        // {
        //   name: "会议历史"
        // },
      ], //导航条模块
      //切换
      statusActive: "msgAll",
      msgList: [
        {
          value: "msgAll",
          label: "全部",
        },
        {
          value: "sendHistory",
          label: "发送记录",
        },
        {
          value: "contactRecords",
          label: "联系人记录",
        },
      ],
      //发送记录->发送类型
      sendType: "0",
      sendTypeList: [
        {
          value: "0",
          label: "全部",
        },
        {
          value: "1",
          label: "即时发送",
        },
        {
          value: "2",
          label: "定时发送",
        },
        {
          value: "3",
          label: "催报发送",
        },
      ],
      searchText: "",
      date: "",
      sendTableMsg: {},
      sendTableSend: {},
      sendTableData: [],
      groupNum: "",
      // textarea:'',
      selcetedRow: {},
      clickQuerySend: [],
      resendFlag: false,
      failList: [],

      //  All
      typeList: [
        { id: "all", name: "全部" },
        { id: "send", name: "发送" },
        { id: "receive", name: "接收" },
      ],
      nowType: "",
      statusoptions: [],
      nowStatus: "",
      textareaAll: "",
      allTableData: [],
      clickQueryAll: [],
      EventList: [],
      smsId: "",
      eventId: "",
      eventTitle: "",
      comUnit: "", //通讯单位
      checked: false,
      direct: "",
      contactReply: {},
      inBlacklist: false,
      // comUnitList:[],

      // Contacts
      contactsTableData: [],
      smsList: [],
      userId: undefined,
      clickQueryContacts: [],
      contactPageConfig: {
        totalPages: 1,
        currentPage: 1,
        total: 0,
        pageSize: 4,
      },

      // dangqianPageAll:0,
      totalElementsAll: 0,
      totalPagesAll: 1,
      totalElementsSend: 0,
      totalPagesSend: 1,
      totalElementsCon: 0,
      totalPagesCon: 1,

      //默认分页size
      allSize: 10,
      nowPage: 1,

      // 二级功能
      zhuanfaFlag: false,
      dialogTitle: "转发短信",
      contactAddFlag: false,
      // samllPageConfig: {
      //   total: 0,
      //   currentPage: 1,
      //   totalPages: 0,
      //   pageSize: 10,
      // }

      //保存
      isSend: false,
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
      isYangZhouProject: window.g.IsYangZhouProject,
      eventList_totalElements: 0 // 事件列表总数
    };
  },
  methods: {
      selectrow(data){
          console.log("selectrow接收到了",data)
         this.selectionrows=data 
      },
      selectallrow(data){
          console.log("selectallrow接收到了",data)
         this.selectionrows=data 
      },
      onbatchEvents(){
        
        if(this.tableConfig.selection){
            if(!this.left_form.eventId){
                this.$message({
                    type: "warning",
                    message: "请选择关联事件"
                });
                this.tableConfig.selection=!this.tableConfig.selection
                return false
            }
            if(this.selectionrows.length==0){
                this.$message({
                    type: "warning",
                    message: "请勾选列表"
                });
                this.tableConfig.selection=!this.tableConfig.selection
                return false
            }
            var selectionrows=[]
            this.selectionrows.forEach(item=>{
                selectionrows.push({
                    eventId: this.left_form.eventId,
                    id:item.smsId,
                    isDeal: false,
                    unit:item.workUnit,
                    dealPhone:item.call,
                    dealName:item.contactor
                })
            })
            this.$http({
                method: 'post',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'  
                },
                url: window.g.ApiUrl + '/eos/history/updatesmsAll',
                data: {
                    data:selectionrows
                }
                
            }).then(({data}) => {
                console.log("/eos/history/updatesmsAll",data)
                if(data.errorcode==0){
                    this.$message({
                        type: "success",
                        message: '批量关联成功'
                    });
                    this.lookupAll(1) // 刷新短信历史全部表格
                    this.lookup(1) // 刷新短信历史发送记录表格
                    this.searchEvent()
                    this.selectionrows=[]
                }else{
                    this.$message({
                        type: "error",
                        message: data.msg
                    });
                }
                console.log(this.$refs.refTableMsgAll.multipleSelection)
                this.$refs.refTableMsgAll.multipleSelection = []
                this.$refs.sendHistory.multipleSelection = []
                this.left_form.eventTitle = ''
            })
        }
        this.tableConfig.selection=!this.tableConfig.selection
      },
      selectLeftTableEvent(obj) {
      this.tablePopoverVisible=false;
      this.left_form.eventTitle = obj.title;
      this.left_form.eventId = obj.id;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-01-19
     * @description 保存短信详情
     */
    save() {
      let txt = ''; // 错误提醒
      // 判断事件关联和通信单位是否为空
      if (this.checked) {
        if (this.eventId === undefined || !this.eventId || this.eventId === '') {
          txt = '事件关联';
        }
        if (this.comUnit === undefined || !this.comUnit || this.comUnit === '') {
          txt = txt !== '' ? txt + '或通信单位' : '通信单位';
        }
      }
      if (txt !== '') {
        this.$message.error(txt + '不能为空');
        return;
      }
      // 点击保存
      let data = {
        id: this.smsId,
        eventId: this.eventId,
        isDeal: this.checked,
        unit: this.comUnit,
        dealName: this.dealName == "" ? "-" : this.dealName,
        dealPhone: this.dealPhone,
      };

      this.$api.msg_table(data).then((res) => {
        console.log(data, 4644);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
        } else {
          this.$message({
            message: "保存成功！",
            type: "success",
          });
          this.lookupAll(1);
        }
      });
    },
    // 全部 转发
    showZhuanfa() {
      this.zhuanfaFlag = !this.zhuanfaFlag; //显示转发弹窗
      this.$nextTick(() => {
        this.dialogTitle = "转发短信";
        let text = this.textareaAll; //短信内容
        let eventId = this.eventId; //关联事件
        this.$refs.forward.textContent = text;
        this.$refs.forward.relationEvent = eventId;
        this.$refs.forward.successText = "短信转发成功";
        this.$refs.forward.type = "转发";
      });
    },
    // 全部 回复
    showReply() {
      this.zhuanfaFlag = !this.zhuanfaFlag;
      this.$nextTick(() => {
        this.dialogTitle = "回复短信";
        let contact = this.contactReply; //联系人
        console.log(this.contactReply);
        let eventId = this.eventId; //关联事件
        this.$refs.forward.tags.push(contact);
        this.$refs.forward.relationEvent = eventId;
        this.$refs.forward.successText = "短信回复成功";
      });
    },
    // 全部 重发
    showRetransmission() {
      this.zhuanfaFlag = !this.zhuanfaFlag;
      this.$nextTick(() => {
        let text = this.textareaAll; //短信内容
        let data = { phoneNum: this.contactReply.call };
        this.$api.findContactorByMobile(data).then((res) => {
          if (res.errorcode == 0) {
            let contact = res.data; //联系人
            let eventId = this.eventId; //关联事件
            this.dialogTitle = "重发短信";
            this.$refs.forward.textContent = text;
            this.$refs.forward.tags.push(contact);
            this.$refs.forward.relationEvent = eventId;
            this.$refs.forward.successText = "短信重发成功";
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    // 防骚扰 确认是否加入黑名单
    doBlackList() {
      this.$confirm(this.blackListDetail.content, this.blackListDetail.title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // type: 'warning'
      })
        .then(() => {
          if (this.inBlacklist) {
            this.doRemoveBlackList();
          } else {
            this.doAddBlackList();
          }
          // this.$refs.focus.focus()
          setTimeout(() => (this.toolTip = false));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.blackListDetail.cancel,
          });
          setTimeout(() => (this.toolTip = false));
          // this.$refs.focus.focus()
        });
    },
    // 加入黑名单操作
    doAddBlackList() {
      let data = {
        type: 0, //添加进黑名单
        phoneNumber: this.contactReply.number,
      };
      this.$api.doBlacklist(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          type: "success",
          message: "加入黑名单成功",
        });
        // 更新当前图标
        this.inBlacklist = true;
      });
    },

    // 移出黑名单操作
    doRemoveBlackList() {
      let data = {
        type: 2, // 移出进黑名单
        phoneNumber: this.contactReply.number,
      };
      this.$api.doBlacklist(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          type: "success",
          message: "移出黑名单成功",
        });
        // 更新当前图标
        this.inBlacklist = false;
      });
    },
    // 加入通讯录
    addMailList() {
      // console.log(this.contactReply)
      if (this.contactReply.number) {
        //新增联系人方法
        this.$nextTick(() => {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "新增联系人";
          this.$refs.ContactDetailsPopup.getTree();
          // this.$refs.ContactDetailsPopup.setMobile(this.contactReply.number);
          this.$refs.ContactDetailsPopup.setNewNumber(this.contactReply.number);
          // 传入联系人id获取历史变更
          this.$refs.ContactDetailsPopup.contactForm.id = this.contactReply.contactorId;
          // this.$refs.ContactDetailsPopup.showData(this.contactReply)
        });
      } else {
        this.$message({
          message: "未识别到有效号码，请确认已点击选中表格行",
          type: "warning",
        });
      }
    },
    // 发送记录 转发
    showSendZhuanfa() {
      this.zhuanfaFlag = !this.zhuanfaFlag;
      this.$nextTick(() => {
        console.log(this.selcetedRow);
        this.dialogTitle = "转发短信";
        let text = this.selcetedRow.content; //短信内容
        let eventId = this.selcetedRow.eventId; //关联事件
        this.$refs.forward.textContent = text;
        this.$refs.forward.relationEvent = eventId;
        this.$refs.forward.type = "转发";
        this.$refs.forward.successText = "短信转发成功";
      });
    },
    // 发送记录 确认是否重发
    resend() {
      this.$confirm("是否对发送失败的联系人进行重发?", "失败重发", {
        confirmButtonText: "重发",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.showSendRetransmission();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重发",
          });
        });
    },
    // 发送记录重发
    showSendRetransmission() {
      let phoneNum = "";
      let ids = "";
      this.failList.forEach((item) => {
        if (item.phone) {
          phoneNum = phoneNum + item.phone + ",";
          ids = ids + item.contactorId + ",";
        }
      });
      let data = {
        data: {
          content: this.selcetedRow.content,
          caseId: this.selcetedRow.eventId,
          phoneNum: phoneNum,
          contactorIds: ids,
          groupNum: this.groupNum,
        },
      };
      this.$api.addSmsQueue(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          message: "短信重发成功！",
          type: "success",
        });
      });
    },
    // 联系人转发
    contactsZhuanfa(item) {
      this.zhuanfaFlag = !this.zhuanfaFlag;
      this.$nextTick(() => {
        this.dialogTitle = "转发短信";
        let text = item.content; //短信内容
        let eventId = item.eventId; //关联事件
        this.$refs.forward.textContent = text;
        this.$refs.forward.relationEvent = eventId;
        this.$refs.forward.type = "转发";
        this.$refs.forward.successText = "短信转发成功";
      });
    },
    // 联系人回复
    contactsReply(item) {
      console.log(item);
      this.zhuanfaFlag = !this.zhuanfaFlag;
      this.$nextTick(() => {
        this.dialogTitle = "回复短信";
        let contact = item; //联系人
        let eventId = item.eventId; //关联事件
        this.$refs.forward.tags.push(contact);
        this.$refs.forward.relationEvent = eventId;
        this.$refs.forward.successText = "短信回复成功";
      });
    },
    // 联系人记录 重发
    contactsRetransmission(item) {
      console.log("item: ", item);
      this.zhuanfaFlag = !this.zhuanfaFlag;
      this.$nextTick(() => {
        let text = item.content; //短信内容
        let contact = item; //联系人
        let eventId = item.eventId; //关联事件
        this.dialogTitle = "重发短信";
        this.$refs.forward.textContent = text;
        this.$refs.forward.tags.push(contact);
        this.$refs.forward.relationEvent = eventId;
        this.$refs.forward.successText = "短信重发成功";
      });
    },
    //分页size改变
    allSizeChange(val) {
      this.allSize = val;
      this.lookupAll(1);
    },
    sendSizeChange(val) {
      // this.sendSize = val
      this.allSize = val;
      this.lookup(1);
    },
    contactsSizeChange(val) {
      // this.contactsSize = val
      this.allSize = val;
      this.lookupContacts(1);
    },
    changTab() {
      this.searchText = "";
      this.date = "";
      this.nowType = "";
      this.nowStatus = "";
      // this.$router.push({path: '/messageHistory'}) // 注释原因：在本页面跳转本页面会报错（hexinting）
      this.nowStatus = "";
    },
    /**
     * @lastDate 2021-02-04
     * @lastEditor hexinting
     */
    lookup(page) {
      this.nowPage = page;
      // 判断选没选时间（没选会弹出警告后边的else）如果选了进行下一步
      if (this.date == undefined || this.date == null || this.date == "") {
        // 因为后台数据从0开始  所以请求之前-1
        let data = {
          startTime: "",
          endTime: "",
          type: this.sendType,
          searchText: this.searchText,
          page: page,
          size: this.allSize,
        };

        this.clickQuerySend = ["", "", this.sendType, this.searchText];
        this.$api.smsSendRecord(data).then((res) => {
          // 返回的数据赋值给table
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          if (!res.data) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this.totalElementsSend = res.data.totalElements;
          this.totalPagesSend = res.data.totalPages;
          this.sendTableData = res.data;
          console.log(
            "刚跳转过来获得的默认第一个数据是：",
            this.sendTableData.data[0].groupNum
          ); //在input搜索时,传输的groupNum,进行删除
          this.groupNum = this.sendTableData.data[0].groupNum; // 把默认第一个数据传给msgQueue里进行检查
        //  this.$refs.msgQueue.groupNum = this.sendTableData.data[0].groupNum; // 把默认第一个数据传给msgQueue里进行检查
          let first = this.sendTableData.data[0];
          if (first) {
            // this.changeSMS(first.groupNum, first);
            this.changeSMS(first);
          } else {
            let obj = {
              content: "",
              total: "",
              success: "",
              failed: "",
              sendTime: "",
            };
            // this.changeSMS("", obj);
            this.changeSMS(obj);
          }
          //  let dataBox = res.data.data||[];
          //   dataBox.forEach(o=>{
          //     let read = o.read=='是'?'已读':'未读';
          //     o.status = o.direct=='接收'?read:o.status;
          //     o.receipt = o.direct=='接收'?'':o.receipt;
          //   })
          //   this.tableData = dataBox;
          // // 把数据赋值给总共的数据总数total
          // this.total = res.data.totalElements;
          // // console.log(res.data.data[1].remark)
          // // 赋值备注
          // // this.formLabelAlign.name = res.data.data.remark
          // // console.log(res.data.data.remark);
        });
      } else {
        // 把标准时间转为2018-01-01格式
        // console.log(this.date)
        var time = this.date[0];

        function formatDateTime(time) {
          var date = time;
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          m = m < 10 ? "0" + m : m;
          var d = date.getDate();
          d = d < 10 ? "0" + d : d;
          return y + "-" + m + "-" + d;
        }
        let time1 = formatDateTime(this.date[0]);
        let time2 = formatDateTime(this.date[1]);
        //运用方法转换时间
        console.log(time1);
        console.log(time2);
        // 因为后台数据从0开始  所以请求之前-1
        // 请求发送后台的参数
        let data = {
          startTime: time1,
          endTime: time2,
          type: this.sendType,
          searchText: this.searchText,
          page: page,
          size: this.allSize,
        };
        this.clickQuerySend = [time1, time2, this.sendType, this.searchText];
        // this.quaryData = data;
        this.$api.smsSendRecord(data).then((res) => {
          // 返回的数据赋值给table
          console.log(res);
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          if (!res.data) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this.totalElementsSend = res.data.totalElements;
          this.totalPagesSend = res.data.totalPages;
          this.sendTableData = res.data || [];

          let first = this.sendTableData.data[0];
          if (first) {
            // this.changeSMS(first.groupNum, first);
            this.changeSMS(first);
          } else {
            let obj = {
              content: "",
              total: "",
              success: "",
              failed: "",
              sendTime: "",
            };
            // this.changeSMS("", obj);
            this.changeSMS(obj);
          }
          //this.tableData = res.data.data;

          // console.log(res.data.data[1].remark)
          // 赋值备注
          // this.formLabelAlign.name = res.data.data.remark
          // console.log(res.data.data.remark);
        });
      }
      if (this.$refs.sendHistory) {
        this.$refs.sendHistory.changePage() // 滚动条自动回顶 qinjiaqi
      }
    },
    /**
     * @lastEditor hexinting
     * @lastdate 2021-02-04
     * @description 改变选中发送记录
     */
    changeSMS(row) {
      this.groupNum = row.groupNum ? row.groupNum : ''; // 获取到groupNum 发送记录-短信详情要用到
      this.selcetedRow = row;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-03-01
     * @description 切换行
     */
    changeALL(row) {
      console.log(row, 545454);
      let content = row["content"];
      let smsId = row["smsId"];
      let eventId = row["eventId"];
      let eventName = row["eventName"];
      let comUnit = row["unit"] !== '' ? row["unit"] : row["workUnit"];
      let direct = row["direct"];
      let dealName = row["contactor"]; //报送人
      let dealPhone = row["call"]; //报送人号码
      //防止多次点击
      if (this.smsId == smsId) {
        return;
      }
      this.checked = false;
      this.isSend = row.direct == "发送";
      this.textareaAll = content;
      this.eventId = eventId
      // 如果信息evenId不存在事件列表中则置为空
      if (this.eventList_totalElements === this.EventList.length) {
        this.EventList.some((item) => {
          return item.id == eventId;
        })
          ? (this.eventId = eventId)
          : (this.eventId = "");
      }
      this.comUnit = comUnit;
      this.direct = direct;
      this.smsId = smsId;
      this.dealName = dealName;
      this.dealPhone = dealPhone;
      this.contactReply = row;
      this.dealName = dealName;
      this.dealPhone = dealPhone;
      this.eventTitle = eventName;
      // 检查是否该联系人是否在黑名单中
      if (row.number) {
        let data = { phoneNumber: row.number };
        this.$api.checkBlacklist(data).then((res) => {
          this.inBlacklist = res != (null || undefined || "");
        });
      }

      // console.log(row,111111)
    },
    /**
     * @description 获取短信类型
     */
    getComUnitList() {
      this.$api.msg({}).then((res) => {
        if (res.errorcode === 0) {
          this.smsTypeList = res.data.reverse();
        }
      });
    },

    failSms(failList) {
      if (failList.length == 0 || failList == undefined || failList == null) {
        this.resendFlag = false;
      } else {
        this.resendFlag = true;
        this.failList = failList;
      }
    },

    getTypeList() {
      let data = { pcode: "sms_type" };
      this.$api.typeList(data).then((res) => {
        if (!res.data) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        console.log(res.data);
        this.typeList = res.data;
      });
    },
    getStatusOptions(iconRead) {
      let data = { direct: this.nowType };
      this.$api.statusList(data).then((res) => {
        if (!res.data) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        console.log(res.data);
        this.statusoptions = res.data;
        //重置状态
        this.nowStatus = "";
        if (iconRead) {
          this.lookupAll(1, true); //表格数据
        }
      });
    },
    /**
     * @lastEditor hexinting
     * @lastEditorDate 2021-02-26
     * @description 获取事件
     */
    getAllEventList() {
      let ipData = {
        dtStart: "",
        dtEnd: "",
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          console.log(res)
          this.EventList.push(...res.data.data);
          this.eventList_totalElements = res.data.totalElements; // 事件总数
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    lookupAll(page, iconRead) {
      console.log("11d11d1dd1d1d1d1ddd1d1d1");
      if (iconRead && this.$route.query.type) {
        this.nowStatus = "5";
      }
      this.nowPage = page;
      // 判断选没选时间（没选会弹出警告后边的else）如果选了进行下一步
      if (this.date == undefined || this.date == null || this.date == "") {
        // 因为后台数据从0开始  所以请求之前-1
        let data = {
          id: "",
          dtStart: "",
          dtEnd: "",
          smsType: this.sms_type,
          page: page,
          size: this.allSize,
          status: this.nowStatus,
          smsId: "",
          searchText: this.searchText,
          direct: this.nowType,
        };
        this.clickQueryAll = [
          "",
          "",
          this.nowType,
          this.nowStatus,
          this.searchText,
        ];
        this.$api.lishijilu(data).then((res) => {
          // 返回的数据赋值给table
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          if (!res.data) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          // console.log(res.data,'0000000')
          // 区分发送和接受的号码
          // res.data.data.forEach(item=>{
          //   if(item['direct']=='发送'){
          //     item['number'] = item['called']
          //   }else if(item['direct']=='接收'){
          //     item['number'] = item['calling']
          //   }
          // })
          res.data.data.forEach((item) => {
            item["number"] = item["call"];
          });
          this.totalElementsAll = res.data.totalElements;
          this.totalPagesAll = res.data.totalPages;
          this.allTableData = res.data;
          if (this.allTableData.data[0]) {
            this.changeALL(this.allTableData.data[0]);
          } else {
            let obj = {
              content: "",
              smsId: "",
              eventId: "",
              eventTitle: "",
              workUnit: "",
              direct: "",
            };
            this.changeALL(obj);
          }
          //  let dataBox = res.data.data||[];
          //   dataBox.forEach(o=>{
          //     let read = o.read=='是'?'已读':'未读';
          //     o.status = o.direct=='接收'?read:o.status;
          //     o.receipt = o.direct=='接收'?'':o.receipt;
          //   })
          //   this.tableData = dataBox;
          // // 把数据赋值给总共的数据总数total
          // this.total = res.data.totalElements;
          // // console.log(res.data.data[1].remark)
          // // 赋值备注
          // // this.formLabelAlign.name = res.data.data.remark
          // // console.log(res.data.data.remark);
        });
      } else {
        // 把标准时间转为2018-01-01格式
        // console.log(this.date)
        var time = this.date[0];

        function formatDateTime(time) {
          var date = time;
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          m = m < 10 ? "0" + m : m;
          var d = date.getDate();
          d = d < 10 ? "0" + d : d;
          return y + "-" + m + "-" + d;
        }
        let time1 = formatDateTime(this.date[0]);
        let time2 = formatDateTime(this.date[1]);
        //运用方法转换时间
        // console.log(time1)
        // console.log(time2)
        // 因为后台数据从0开始  所以请求之前-1
        // 请求发送后台的参数
        let data = {
          id: "",
          dtStart: time1,
          dtEnd: time2,
          smsType: this.sms_type,
          page: page,
          size: this.allSize,
          status: this.nowStatus,
          smsId: "",
          searchText: this.searchText,
          direct: this.nowType,
        };
        this.clickQueryAll = [
          time1,
          time2,
          this.nowType,
          this.nowStatus,
          this.searchText,
        ];
        this.$api.lishijilu(data).then((res) => {
          // 返回的数据赋值给table
          console.log(res);
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          if (!res.data) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          // 区分发送和接受的号码
          // res.data.data.forEach(item=>{
          //   if(item['direct']=='发送'){
          //     item['number'] = item['called']
          //   }else if(item['direct']=='接收'){
          //     item['number'] = item['calling']
          //   }
          // })
          res.data.data.forEach((item) => {
            item["number"] = item["call"];
          });
          this.totalElementsAll = res.data.totalElements;
          this.totalPagesAll = res.data.totalPages;
          this.allTableData = res.data;
          if (this.allTableData.data[0]) {
            this.changeALL(this.allTableData.data[0]);
          } else {
            let obj = {
              content: "",
              smsId: "",
              eventId: "",
              eventTitle: "",
              workUnit: "",
              direct: "",
            };
            this.changeALL(obj);
          }
        });
      }
      this.$refs.refTableMsgAll.changePage() // 滚动条自动回顶 qinjiaqi
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2021-02-04
     * @description
     */
    lookupContacts(page) {
      this.nowPage = page;
      if (this.date == undefined || this.date == null || this.date == "") {
        // 因为后台数据从0开始  所以请求之前-1
        // console.log(this.searchText)
        let data = {
          startTime: "",
          endTime: "",
          page: page,
          size: this.allSize,
          searchText: this.searchText,
        };
        this.$api.getContacts(data).then((res) => {
          if (res.errorcode != 0 || !res.data) {
            this.totalElementsCon = 0;
            this.totalPagesCon = 1;
            this.contactsTableData = [];
            return;
          }
          this.totalElementsCon = res.data.totalElements;
          this.totalPagesCon = res.data.totalPagesCon;
          this.contactsTableData = res.data;

          if (this.contactsTableData.data[0]) {
            this.changeCon(this.contactsTableData.data[0]);
          } else {
            this.smsList = [];
            this.contactPageConfig.totalPages = 1;
          }
        });
      } else {
        var time = this.date[0];
        function formatDateTime(time) {
          var date = time;
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          m = m < 10 ? "0" + m : m;
          var d = date.getDate();
          d = d < 10 ? "0" + d : d;
          return y + "-" + m + "-" + d;
        }
        let time1 = formatDateTime(this.date[0]);
        let time2 = formatDateTime(this.date[1]);
        let data = {
          startTime: time1,
          endTime: time2,
          page: page,
          size: this.allSize,
          searchText: this.searchText,
        };
        this.$api.getContacts(data).then((res) => {
          // 返回的数据赋值给table
          if (res.errorcode != 0 || !res.data) {
            this.totalElementsCon = 0;
            this.totalPagesCon = 1;
            this.contactsTableData = [];
            return;
          }
          this.totalElementsCon = res.data.totalElements;
          this.totalPagesCon = res.data.totalPagesCon;
          this.contactsTableData = res.data;

          if (this.contactsTableData.data[0]) {
            this.changeCon(this.contactsTableData.data[0]);
          } else {
            this.smsList = [];
            this.contactPageConfig.totalPages = 1;
          }
        });
      }
      if (this.$refs.contactRecords) {
        this.$refs.contactRecords.changePage() // 滚动条自动回顶 qinjiaqi
      }
    },
    changeCon(row) {
      if (row != null) {
        // 防止重复点击
        // if(this.userId == row.id){
        //   return
        // }
        // 点击新的联系人切换id重置分页页数
        this.userId = row.id;
        this.contactPageConfig.currentPage = 1;
      }
      if (this.date == undefined || this.date == null || this.date == "") {
        // 因为后台数据从0开始  所以请求之前-1
        let data = {
          size: this.contactPageConfig.pageSize,
          page: this.contactPageConfig.currentPage,
          id: this.userId,
          startTime: "",
          endTime: "",
        };
        this.$api.findSmsListByContactId(data).then((res) => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          if (!res.data) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this.smsList = res.data.data;
          this.contactPageConfig.total = res.data.totalElements;
          this.contactPageConfig.totalPages = res.data.totalPages;

          // 分页测试数据
          // this.contactPageConfig.total = 20
          // this.contactPageConfig.totalPages = 5
          // console.log(this.smsList,'000000000000000000000')
        });
      } else {
        var time = this.date[0];
        function formatDateTime(time) {
          var date = time;
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          m = m < 10 ? "0" + m : m;
          var d = date.getDate();
          d = d < 10 ? "0" + d : d;
          return y + "-" + m + "-" + d;
        }
        let time1 = formatDateTime(this.date[0]);
        let time2 = formatDateTime(this.date[1]);
        let data = {
          startTime: time1,
          endTime: time2,
          size: this.contactPageConfig.pageSize,
          page: this.contactPageConfig.currentPage,
          id: this.userId,
        };
        this.$api.findSmsListByContactId(data).then((res) => {
          // 返回的数据赋值给table
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          if (!res.data) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this.smsList = res.data.data;
          this.contactPageConfig.total = res.data.totalElements;
          this.contactPageConfig.totalPages = res.data.totalPages;
        });
      }
    },

    //  关闭弹窗
    closeDialog(val) {
      // console.log(val)
      this.zhuanfaFlag = val;
    },

    // 小分页
    samllCurrentChange(val) {
      this.changeCon();
    },
    /**
     * @description: 选中的事件
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 20201119 14:56
     * @param {obj} 选中的事件信息
     * @return {*}
     */
    selectEvent(obj) {
      this.visible = false;
      this.eventTitle = obj.title;
      this.eventId = obj.id;
    },
    /**
     * @description: 搜索事件
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    searchEvent() {
      this.currentPage = 1;
      this.EventList = [];
      this.getAllEventList();
    },
    /**
     * @description: 每次追加10条事件列表
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    loadMoreHandle() {
      this.currentPage++;
      this.getAllEventList();
    },
  },
  // data() {
  //   return {
  //     statusActive:'msgAll',
  //     msgList:[{
  //       value:'msgAll',
  //       label:'全部'
  //     },{
  //       value:'sendHistory',
  //       label:'发送记录'
  //     },{
  //       value:'contactRecords',
  //       label:'联系人记录'
  //     }],
  //
  //     test:false,
  //     statusone: '',
  //     checked:true,
  //     statusoptions: [{
  //       name: '全部',
  //       id: ''
  //     }, {
  //       name: '未读',
  //       id: '5'
  //     }, {
  //       name: '已读',
  //       id: '6'
  //     }, {
  //       name: '已发送',
  //       id: '228'
  //     }],
  //     view: true,
  //     textareaAll:'',
  //     //弹框的搜索内容
  //     box_ipt: '',
  //     data: '',
  //     one2: '',
  //     left2: '',
  //     searchText: "", //搜索
  //     //第一行选择器
  //     one: -1,
  //     content: '', //右边内容
  //     options: [],
  //     // 弹窗
  //     data1: '', //弹框时间
  //     modal: false,
  //     //点击确认之后发送的数据
  //     id: '',
  //     eventId_box: '',
  //     content_box: '',
  //     //todolist双向绑定
  //     todolist: '',
  //     tableColumn1: [
  //       {
  //         prop: "eventCode",
  //         label: "事件编号"
  //       },
  //       {
  //         prop: "title",
  //         label: "事件标题"
  //       }, {
  //         prop: "eventTypeName",
  //         label: "事件类型"
  //       }, {
  //         prop: "occurTime",
  //         label: "事发时间"
  //       }, {
  //         prop: "areaName",
  //         label: "事发区域"
  //       }, {
  //         prop: "eventLevelName",
  //         label: "事件等级"
  //       }, {
  //         prop: "operatorName",
  //         label: "接报人"
  //       }
  //     ], //表头
  //     tableColumn2: [
  //       {
  //         prop: "department",
  //         label: "报送单位"
  //       }, {
  //         prop: "datasyncTime",
  //         label: "报送时间"
  //       }, {
  //         prop: "description",
  //         label: "报送内容"
  //       },
  //     ],
  //     tableData1: [],
  //     dialogTableVisible: false,
  //     dialogFormVisible: false,
  //     // 表格数据
  //     tableColumn: [{
  //       prop: "direct",
  //       label: "收发方向"
  //     },
  //       {
  //         prop: "contactor",
  //         label: "联系人"
  //       }, {
  //         prop: "workUnit",
  //         label: "工作单位"
  //       }, {
  //         prop: "position",
  //         label: "职务"
  //       }, {
  //         prop: "call",
  //         label: "联系号码"
  //       }, {
  //         prop: "sendTime",
  //         label: "发送时间"
  //       }, {
  //         prop: "status",
  //         label: "状态"
  //       }, {
  //         prop: "receipt",
  //         label: "回执"
  //       },
  //       {
  //         prop: "type",
  //         label: "类型"
  //       }
  //     ], //表头
  //     tableData: [], //表格数据
  //     total: 0, //数据总数
  //     pageSize: 10, //总页数
  //     currentPage: 1, //当前页数
  //     pagingSize: true, //分页大小
  //     call: '',
  //     contactor: '',
  //     telephoneGrouping: '/icpSms',
  //     // remarks:'',
  //     eventboxId: "",
  //     clickQuery: false, //判断查询按钮是否被点击
  //     quaryData: '',
  //     eventOptions: [],
  //     selectTotal: 0, //弹框数据总数
  //     selectPage: 1, //弹框当前页数
  //     pagingSize: false, //分页大小
  //     clickQurey: [],
  //     row: '',
  //     reportDialog: false,
  //     reportUnit: '0',
  //     reportUnits: [],
  //     tableData2: [],
  //     allTableData2: [],//存放当前事件的所有关联接报
  //     ReportRow: '',
  //     eventReport: {id: 0, title: ''},
  //     contactorId: ''//联系人id
  //   }
  // },
  // methods: {
  //   //新增联系人方法
  //   handleAdd() {
  //     console.log(this.row)
  //     console.log(this.call)
  //     if (this.row) {
  //       console.log(this.row.contactorId)
  //       if (this.row.contactorId > 0) {
  //         console.log(this.row.contactorId)
  //         this.$message({
  //           message: '该联系人已在联系人列表',
  //           type: 'warning'
  //         });
  //       } else {
  //         console.log(this.row.contactorId)
  //         let data = {
  //           type: 'sms',
  //           number: this.row.call,
  //           id: this.row.id
  //         };
  //         this.$api.addContactor(data).then((res) => {
  //           console.log(res);
  //           if (res.errorcode != 0) {
  //             this.$message({
  //               message: res.msg,
  //               type: "error"
  //             });
  //           } else {
  //             this.$message({
  //               message: '新增成功！',
  //               type: 'success'
  //             });
  //             this.lookup();
  //           }
  //         })
  //       }
  //     } else {
  //       this.$message({
  //         message: '请单击选中要新增的联系人',
  //         type: 'warning'
  //       });
  //     }
  //     /* if(this.call){
  //        //新增联系人方法
  //        this.$nextTick(() => {
  //          this.$refs.ContactDetailsPopup.isDialogVisible = true;
  //          this.$refs.ContactDetailsPopup.title = "新增联系人";
  //          this.$refs.ContactDetailsPopup.getTree();
  //          this.$refs.ContactDetailsPopup.setMobile(this.call);
  //        });
  //     }else{
  //        this.$message({
  //          message: '未识别到有效号码，请确认已点击选中表格行',
  //          type: 'warning'
  //        });
  //     } */
  //
  //   },
  //   //获取未办结事件
  //   getEventOptions() {
  //     let data;
  //     this.$api.allEventlist(data).then(res => {
  //       console.log(res)
  //       if (res.errorcode != 0) {
  //         this.$message({
  //           message: res.msg,
  //           type: "error"
  //         });
  //         return;
  //       }
  //       this.eventOptions = res.data;
  //       console.log(this.eventOptions);
  //       for (let i = 0; i < this.eventOptions.length; i++) {
  //         if (this.eventOptions[i].id == 237) {
  //           console.log(this.eventOptions[i].title);
  //           console.log(111)
  //         }
  //       }
  //       /*for (let i = 0; i < res.data.data.length; i++) {
  //         this.eventOptions.push({
  //           value: res.data.data[i].id,
  //           label: res.data.data[i].title
  //         })
  //       }*/
  //     })
  //   },
  //   axios() {
  //     //需要传递的参数
  //     var cpage = this.currentPage;
  //     // console.log(cpage)
  //     let data = {
  //       page: cpage,
  //       size: 10
  //     };
  //     this.$api.msg_box(data).then((res) => {
  //       console.log(res)
  //       // 返回的数据赋值给table
  //       this.total = res.data.totalElements;
  //       let dataBox = res.data.data||[];
  //       dataBox.forEach(o=>{
  //        let read = o.read=='是'?'已读':'未读';
  //         o.status = o.direct=='接收'?read:o.status;
  //         o.receipt = o.direct=='接收'?'':o.receipt;
  //       })
  //       this.tableData = dataBox;
  //       //console.log(dataBox)
  //       // this.options= res.data.data;
  //       // console.log(res.data.data);
  //       this.clickQuery = false;
  //     })
  //   },
  //   test(row) {
  //     console.log(row)
  //     this.row = row;
  //     //this.todolist=row.eventName
  //     //this.todolist = row.eventId && row.eventName != ''? row.eventId:'';
  //     //后台存在event事件删除后id任然存在，以下接口来校验
  //     if (row.eventId === 0) {
  //       this.todolist = '';
  //     } else {
  //       let data = {
  //         id: row.eventId
  //       };
  //       this.$api.findById(data).then((res) => {
  //         console.log(res)
  //         if (res.errorcode != 0) {
  //           this.todolist = '';
  //         } else {
  //           this.todolist = row.eventId;
  //         }
  //         console.log(this.todolist)
  //       })
  //     }
  //     this.eventReport = {id: 0, title: ''};
  //     if (row.eventDeal != 0) { //事件接报id
  //       let data = {'eventDealId': row.eventDeal};
  //       this.$api.findEventDealById(data).then((res) => {
  //         console.log(res);
  //         if (res.errorcode == 0) {
  //           this.eventReport = {id: res.data.id, title: res.data.description};
  //         }
  //       })
  //     }
  //     this.contactorId = row.contactorId;
  //     this.content = row.content;
  //     // this.remarks=row.content;
  //     this.content = row.content,
  //       this.call = row.call;
  //     this.contactor = row.contactor;
  //     this.id = row.id
  //
  //     //将未读信息标记为已读;
  //     if (row.status == '未读'){
  //       row.status = '已读'
  //       let data={
  //         id:row.id
  //       };
  //       this.$api.smsRead(data).then(res=>{
  //
  //       });
  //     }
  //   },
  //   //点击事件接报
  //   selectEventDeal() {
  //     console.log(this.todolist);//事件id
  //     if (this.todolist) {
  //       let data = {
  //         eventId: this.todolist
  //       };
  //       this.$api.eventReport(data).then((res) => {
  //         console.log(res);
  //         if (res.errorcode != 0) {
  //           this.$message({
  //             message: res.msg,
  //             type: "error"
  //           });
  //         } else {
  //           this.reportDialog = true;
  //           this.tableData2 = res.data.list;
  //           this.allTableData2 = res.data.list;
  //           this.reportUnit = 0;
  //           this.reportUnits = [];
  //           this.ReportRow = '';//解除初始点击table行
  //           for (let i = 0; i < res.data.workUnit.length; i++) {
  //             this.reportUnits.push({value: i, label: res.data.workUnit[i] == '' ? '全部' : res.data.workUnit[i]})
  //           }
  //         }
  //       })
  //     } else {
  //       this.$message({
  //         message: '必须选择事件后才能关联接报哦！',
  //         type: 'warning'
  //       });
  //     }
  //   },
  //   changeSelectReport(index) {
  //     let name = this.reportUnits[index].label;
  //     console.log(name);
  //     if (name == '全部') {
  //       this.tableData2 = this.allTableData2;
  //     } else {
  //       this.tableData2 = [];
  //       for (let i = 0; i < this.allTableData2.length; i++) {
  //         if (name == this.allTableData2[i].department) {
  //           this.tableData2.push(this.allTableData2[i])
  //         }
  //       }
  //     }
  //   },
  //   clickReportRow(row) {
  //     this.ReportRow = row;
  //   },
  //   addReport() {
  //     console.log(this.ReportRow);
  //     if (this.ReportRow) {
  //       this.eventReport = {id: this.ReportRow.id, title: this.ReportRow.description};//接报id，内容
  //       this.reportDialog = false;
  //     } else {
  //       this.$message({
  //         message: '你还未点击选中报送内容呢！',
  //         type: 'warning'
  //       });
  //     }
  //   },
  //   save() {
  //     console.log(this.row)
  //     if (this.id) {
  //       let data = {
  //         id: this.row.id,
  //         eventId: this.todolist,
  //         content: this.content,
  //         eventDealId: this.eventReport.id
  //       };
  //       console.log(data)
  //       this.$api.msg_table(data).then((res) => {
  //         console.log(res)
  //         if (res.errorcode != 0) {
  //           this.$message({
  //             message: res.msg,
  //             type: "error"
  //           });
  //         } else {
  //           this.$message({
  //             message: '保存成功！',
  //             type: 'success'
  //           });
  //           this.lookup();
  //         }
  //       })
  //     } else {
  //       this.$message({
  //         message: '请单击选中要修改的保存的列表行',
  //         type: 'warning'
  //       });
  //     }
  //   },
  //   formatDateTime(time) {
  //     console.log(time)
  //     var date = time;
  //     var y = date.getFullYear();
  //     var m = date.getMonth() + 1;
  //     m = m < 10 ? ('0' + m) : m;
  //     var d = date.getDate();
  //     d = d < 10 ? ('0' + d) : d;
  //     return y + '-' + m + '-' + d;
  //   },
  //   //事件选择弹框
  //   selectEvent() {
  //     this.dialogTableVisible = true;
  //     this.eventboxId = ''; //初始绑定的事件id，当用户没有选择时点击了确定，不会改变原来的选中
  //     this.clickQurey = [];
  //     this.box_ipt = '';
  //     this.data1 = '';
  //     this.selectPage = 1;
  //     this.box_lookup();
  //   },
  //   formatDateTime(time) {
  //     console.log(time)
  //     var date = time;
  //     var y = date.getFullYear();
  //     var m = date.getMonth() + 1;
  //     m = m < 10 ? ('0' + m) : m;
  //     var d = date.getDate();
  //     d = d < 10 ? ('0' + d) : d;
  //     return y + '-' + m + '-' + d;
  //   },
  //   searchApi() {
  //     // 把标准时间转为2018-01-01格式
  //     console.log('000')
  //     let time1 = this.formatDateTime(this.data[0]);
  //     let time2 = this.formatDateTime(this.data[1]);
  //     //运用方法转换时间
  //     // 因为后台数据从0开始  所以请求之前-1
  //     var tim = this.currentPage;
  //     // 请求发送后台的参数
  //     console.log(tim)
  //     let data = {
  //       dtStart: time1,
  //       dtEnd: time2,
  //       smsType: this.one,
  //       searchText: this.searchText,
  //       page: tim,
  //       size: 10
  //     };
  //
  //     this.$api.msg_box(data).then((res) => {
  //       // 返回的数据赋值给options
  //       // console.log(res.data);
  //       //this.tableData = res.data.data;
  //        let dataBox = res.data.data||[];
  //           dataBox.forEach(o=>{
  //             let read = o.read=='是'?'已读':'未读';
  //             o.status = o.direct=='接收'?read:o.status;
  //             o.receipt = o.direct=='接收'?'':o.receipt;
  //           })
  //           this.tableData = dataBox;
  //       // 把数据赋值给总共的数据总数tableData1
  //       this.total = res.data.totalElements;
  //     })
  //   },
  //   //点击分页
  //   handleCurrentChange() {
  //     console.log(this.currentPage)
  //     // this.currentPage=val;
  //     if (this.clickQuery) {
  //       this.lookup2(this.currentPage);
  //     } else {
  //       this.axios(this.currentPage);
  //     }
  //     /*if (this.data[0] !== undefined && this.data[1] !== undefined) {
  //      this.searchApi();
  //     } else {
  //      this.axios();
  //     }*/
  //   },
  //   lookup2(page) {
  //     this.quaryData.page = page;
  //     console.log(this.quaryData)
  //     this.$api.msg_box(this.quaryData).then((res) => {
  //       // 返回的数据赋值给table
  //       console.log(res);
  //       if (res.errorcode != 0) {
  //         this.$message({
  //           message: res.msg,
  //           type: "error"
  //         });
  //         return
  //       }
  //       //this.tableData = res.data.data;
  //        let dataBox = res.data.data||[];
  //           dataBox.forEach(o=>{
  //             let read = o.read=='是'?'已读':'未读';
  //             o.status = o.direct=='接收'?read:o.status;
  //             o.receipt = o.direct=='接收'?'':o.receipt;
  //           })
  //           this.tableData = dataBox;
  //       this.total = res.data.totalElements;
  //     })
  //   },
  //   lookup(page) {
  //     console.log(this.data)
  //     this.clickQuery = true;
  //     if (page == 0) {
  //       this.currentPage = 1;
  //     }
  //
  //     // 判断选没选时间（没选会弹出警告后边的else）如果选了进行下一步
  //     if (this.data == undefined || this.data == null || this.data == '') {
  //       // 因为后台数据从0开始  所以请求之前-1
  //       let data = {
  //         dtStart: '',
  //         dtEnd: '',
  //         smsType: this.one,
  //         searchText: this.searchText,
  //         page: page,
  //         size: 10,
  //         status: this.statusone
  //       };
  //       this.quaryData = data;
  //       this.$api.msg_box(data).then((res) => {
  //         // 返回的数据赋值给table
  //         console.log(res);
  //         if (res.errorcode != 0) {
  //           this.$message({
  //             message: res.msg,
  //             type: "error"
  //           });
  //           return
  //         }
  //          let dataBox = res.data.data||[];
  //           dataBox.forEach(o=>{
  //             let read = o.read=='是'?'已读':'未读';
  //             o.status = o.direct=='接收'?read:o.status;
  //             o.receipt = o.direct=='接收'?'':o.receipt;
  //           })
  //           this.tableData = dataBox;
  //         // 把数据赋值给总共的数据总数total
  //         this.total = res.data.totalElements;
  //         // console.log(res.data.data[1].remark)
  //         // 赋值备注
  //         // this.formLabelAlign.name = res.data.data.remark
  //         // console.log(res.data.data.remark);
  //       })
  //     } else {
  //       // 把标准时间转为2018-01-01格式
  //       console.log(11111111)
  //       var time = this.data[0]
  //
  //       function formatDateTime(time) {
  //         var date = time;
  //         var y = date.getFullYear();
  //         var m = date.getMonth() + 1;
  //         m = m < 10 ? ('0' + m) : m;
  //         var d = date.getDate();
  //         d = d < 10 ? ('0' + d) : d;
  //         return y + '-' + m + '-' + d;
  //       };
  //       let time1 = formatDateTime(this.data[0])
  //       let time2 = formatDateTime(this.data[1])
  //       //运用方法转换时间
  //       console.log(time1)
  //       console.log(time2)
  //       // 因为后台数据从0开始  所以请求之前-1
  //       // 请求发送后台的参数
  //       let data = {
  //         dtStart: time1,
  //         dtEnd: time2,
  //         smsType: this.one,
  //         searchText: this.searchText,
  //         page: page,
  //         size: 10,
  //         status: this.statusone
  //       };
  //       this.quaryData = data;
  //       this.$api.msg_box(data).then((res) => {
  //         // 返回的数据赋值给table
  //          let dataBox = res.data.data||[];
  //           dataBox.forEach(o=>{
  //             let read = o.read=='是'?'已读':'未读';
  //             o.status = o.direct=='接收'?read:o.status;
  //             o.receipt = o.direct=='接收'?'':o.receipt;
  //           })
  //           this.tableData = dataBox;
  //         //this.tableData = res.data.data;
  //         // 把数据赋值给总共的数据总数total
  //         this.total = res.data.totalElements;
  //         // console.log(res.data.data[1].remark)
  //         // 赋值备注
  //         // this.formLabelAlign.name = res.data.data.remark
  //         // console.log(res.data.data.remark);
  //       })
  //       console.log(this.quaryData)
  //     }
  //
  //   },
  //   box_lookup(page) {
  //     let time1 = '';
  //     let time2 = '';
  //     if (page == 0) {
  //       this.selectPage = 1;
  //       if (this.data1) {
  //         time1 = this.formatDateTime(this.data1[0]);
  //         time2 = this.formatDateTime(this.data1[1]);
  //       }
  //       this.clickQurey = [time1, time2, this.box_ipt];
  //     }
  //
  //     let data = {
  //       callType: 0,
  //       dtStart: this.clickQurey[0],
  //       dtEnd: this.clickQurey[1],
  //       searchText: this.clickQurey[2],
  //       page: this.selectPage - 1,
  //       size: ''
  //     };
  //     this.$api.todolist(data).then((res) => {
  //       // 返回的数据赋值给options
  //       console.log(res);
  //       // this.options = res.data.data;
  //       // 把数据赋值给总共的数据总数tableData1
  //       this.tableData1 = res.data.data;
  //       this.selectTotal = res.data.totalElements;
  //     })
  //   },
  //   click(row) {
  //     this.eventboxId = row.id;
  //   },
  //   succees() {
  //     if (this.eventboxId) this.todolist = this.eventboxId;
  //     this.dialogTableVisible = false;
  //   },
  //   /* click(row) {
  //     console.log(row)
  //     this.eventboxId = row.id
  //     this.eventId_box = row.iCaseId,
  //       // this.content_box =row.content,
  //       this.todolist = row.title
  //   },
  //   succees() {
  //     let data = {
  //       id: this.id,
  //       eventId: this.eventboxId,
  //       content: this.content
  //     };
  //     console.log(data)
  //     this.$api.msg_table(data).then((res) => {
  //       if (res.errorcode != 0) {
  //         this.$message({
  //           message: res.msg,
  //           type: "error"
  //         });
  //         return
  //       }
  //       this.dialogTableVisible = false
  //       this.todelist()
  //       this.axios()
  //     })
  //   }, */
  //   called() {
  //     if (this.call == '' || this.call == undefined || this.call == null) {
  //       this.$message({
  //         message: '选择的人员无效',
  //         type: "error"
  //       });
  //     } else {
  //       sessionStorage.setItem('phoneCall', this.call);
  //       this.$router.push({
  //         path: '/icpPhone'
  //       });
  //     }
  //   },
  //   // 回复
  //   reply() {
  //     if (this.call == '' || this.call == undefined || this.call == null) {
  //       this.$message({
  //         message: '选择的人员无效',
  //         type: "error"
  //       });
  //     } else {
  //       sessionStorage.setItem('mobile', this.call);
  //       sessionStorage.removeItem('remark');
  //       sessionStorage.setItem('name', this.contactor);
  //       sessionStorage.setItem('historyContactor', this.contactorId);
  //       this.$router.push({
  //         path: this.telephoneGrouping
  //       });
  //     }
  //   },
  //   // 转发
  //   forward() {
  //     if (this.call == '' || this.call == undefined || this.call == null) {
  //       this.$message({
  //         message: '选择的人员无效',
  //         type: "error"
  //       });
  //     } else {
  //       sessionStorage.removeItem('mobile');
  //       sessionStorage.removeItem('name');
  //       sessionStorage.setItem('remark', this.content);
  //       sessionStorage.setItem('historyContactor', this.contactorId);
  //       this.$router.push({
  //         path: this.telephoneGrouping
  //       });
  //     }
  //   },
  //   // 重发
  //   repeat() {
  //     if (this.call == '' || this.call == undefined || this.call == null) {
  //       this.$message({
  //         message: '选择的人员无效',
  //         type: "error"
  //       });
  //     } else {
  //       console.log(this.todolist, this.eventOptions)
  //       /*if(!this.todolist){
  //          console.log(1)
  //          sessionStorage.setItem('eventId', 0);
  //       }else if(typeof this.todolist === "number"){
  //          console.log(2)
  //          sessionStorage.setItem('eventId', this.todolist);
  //       }else{
  //         console.log(3);
  //         for(let i=0; i<this.eventOptions.length; i++){
  //           if(this.todolist == this.eventOptions[i].label){
  //              sessionStorage.setItem('eventId', this.eventOptions[i].value);
  //              break;
  //           }
  //         }
  //       }*/
  //       sessionStorage.setItem('mobile', this.call);
  //       sessionStorage.setItem('name', this.contactor);
  //       sessionStorage.setItem('remark', this.content);
  //       sessionStorage.setItem('historyContactor', this.contactorId);
  //       this.$router.push({
  //         path: this.telephoneGrouping
  //       });
  //     }
  //   }
  // },
  created() {
    this.lookup(1);
    this.lookupContacts(1);
    this.getStatusOptions(true);
    this.getComUnitList();
  },
  mounted() {
    this.getAllEventList(); // 获得关联事件id数据
  },
};
</script>

<style scoped>
.el-input{
    width: initial;
}
.narBar {
  margin: 20px 0px;
}

.out {
  /*margin: 20px 30px;*/
  margin: 0 10px;
}
.card >>> .el-tabs__content {
  padding: 0;
}
.all {
  display: flex;
  height: calc(100vh - 150px);
  font-size: 12px;
  background: #e3e9f4;
}

.left {
  width: 67%;
  text-align: left;
  /*padding: 14px 0;*/
  margin-right: 10px;
  /*background: white;*/
  border-radius: 2px;
  /*padding-top: 10px;*/
  /*padding-left: 10px;*/
  vertical-align: top;
}
/*>>>.tab.el-tabs--card>.el-tabs__header .el-tabs__item{*/
/*  width: 120px;*/
/*  text-align: center;*/
/*  font-size: 14px;*/
/*  color:#999999;*/
/*  font-family:PingFangSC-Regular,PingFang SC;*/
/*  font-weight:400;*/
/*}*/
/*>>>.tab.el-tabs--card>.el-tabs__header .el-tabs__item.is-active{*/
/*  color: #333333;*/
/*}*/
.tab >>> .el-tabs__item {
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  color: #999;
  padding: 0px 44px !important;
  background: #fbfcff;
  border: 1px solid #dddee1 !important;
}
>>> .tab.el-tabs {
  background: white;
}
>>> .el-tabs__header {
  margin-bottom: 0px;
}
>>> .el-tabs__nav .is-active {
  color: #333;
  background: white;
  border-bottom: 1px solid white !important;
}
>>> .el-tabs__nav .el-tabs__item:first-child {
  border-radius: 4px 0 0 0;
}
>>> .el-tabs__nav .el-tabs__item:last-child {
  border-radius: 0 4px 0 0;
}

.sty {
  padding-right: 14px;
  height: 40px;
  line-height: 40px;
  vertical-align: top;
  font-size: 14px;
}
.detail >>> .el-textarea__inner {
  min-height: 235px !important;
  max-height: 235px !important;
}
.textContent >>> .el-textarea__inner {
  min-height: 464px !important;
  max-height: 464px !important;
}
.search {
  width: 40px;
  height: 40px;
  margin-left: -8px;
  font-size: 14px;
  padding: 7px 8px 8px 8px;
}
.right {
  /*padding-top: 20px;*/
  /*padding-right: 20px;*/
  width: 33%;
  height: 788px;
  float: right;
  text-align: left;
  font-size: 14px;
  background: #e3e9f4;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  border-radius: 5px;
}
.right .title {
  position: relative;
  padding-left: 11px;
  font-size: 20px;
  line-height: 28px;
  margin: 0;
}
.right .title::before {
  content: "";
  position: absolute;
  top: 4px;
  left: 0;
  background: rgba(0, 145, 255, 1);
  width: 3px;
  height: 20px;
}
.container {
  position: relative;
  padding: 28px 35px 0 11px;
}
.add-event {
  display: inline-block;
  border: 1px solid #dcdfe6;
  width: 38px;
  height: 38px;
  text-align: center;
  border-radius: 5px;
}
.add-event:hover {
  border-color: #c0c4cc;
  cursor: pointer;
}

/*>>>.el-textarea__inner{*/
/*  min-height: 464px!important;*/
/*}*/

/*>>>.el-input__inner{*/
/*  height: 42px;*/
/*}*/
/*>>>.el-checkbox__inner{*/
/*  width: 22px;*/
/*  height: 22px;*/
/*  border-radius: 3px;*/
/*  border:1px solid rgba(221,221,221,1);*/
/*  background:rgba(255,255,255,1);*/
/*  font-size: 17px;*/
/*}*/
/*>>>.el-checkbox__inner::after{*/
/*  height: 15px;*/
/*  left: 8px;*/
/*}*/
/*>>>.el-checkbox__label{*/
/*  font-size: 17px;*/
/*}*/
.ipt {
  width: 300px;
}
.icons {
  position: relative;
  left: 0;
  bottom: 0;
  width: 548px;
  height: 70px;
  border-radius: 0px 0px 4px 4px;
}
.icon {
  position: relative;
  border: 0;
}
.icon.small {
  background-size: 24px 24px !important;
}
.icon.phone {
  background-image: url("/static/img/msgIcon/phone.png");
  background-repeat: no-repeat;
  background-size: 37px 35px;
}
.icon.phone:hover {
  background-image: url("/static/img/msgIcon/phone_active.png");
}
.icon.zhuanfa {
  background-image: url("/static/img/msgIcon/zhuanfa.png");
  background-repeat: no-repeat;
  background-size: 37px 35px;
}
.icon.zhuanfa:hover {
  background-image: url("/static/img/msgIcon/zhuanfa_active.png");
}
.icon.huifu {
  background-image: url("/static/img/msgIcon/huifu.png");
  background-repeat: no-repeat;
  background-size: 37px 35px;
}
.icon.huifu:hover {
  background-image: url("/static/img/msgIcon/huifu_active.png");
}
.icon.chongfa {
  background-image: url("/static/img/msgIcon/chongfa.png");
  background-repeat: no-repeat;
  background-size: 37px 35px;
}
.icon.chongfa:hover {
  background-image: url("/static/img/msgIcon/chongfa_active.png");
}
.icon.fangsaorao {
  background-image: url("/static/img/msgIcon/fangsaorao.png");
  background-repeat: no-repeat;
  background-size: 37px 35px;
}
.icon.fangsaorao:hover {
  background-image: url("/static/img/msgIcon/fangsaorao_active.png");
}
.icon.fangsaorao-active {
  background-image: url("/static/img/msgIcon/fangsaorao_active.png");
}
.icon.addressBook {
  background-image: url("/static/img/msgIcon/addressBook.png");
  background-repeat: no-repeat;
  background-size: 37px 35px;
}
.icon.addressBook:hover {
  background-image: url("/static/img/msgIcon/addressBook_active.png");
}
.icon.dengji_active {
  background-image: url("/static/img/msgIcon/dengji_active.png");
  background-repeat: no-repeat;
  background-size: 37px 35px;
}
.top {
  width: 100%;
  height: 400px;
  background: white;
  padding: 17px 17px 0 17px;
  box-sizing: border-box;
}
.top .info {
  margin-top: 10px;
  font-size: 14px;
}
.info-text {
  /*border: 1px solid red;*/
  display: inline-block;
  margin: 5px 0 0 0;
  height: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
  text-align: right;
}
.bottom {
  position: relative;
  box-sizing: border-box;
  /*margin-top: 14px;*/
  width: 100%;
  height: 385px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  border-radius: 4px;
}
.bottom .bottom-icon {
  height: 70px;
  position: relative;
  left: 0;
  bottom: 13px;
}
.box-card {
  position: relative;
  margin-bottom: 14px;
  /*width:514px;*/
  height: 155px;
  padding: 13px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 6px 0px rgba(187, 211, 230, 0.5);
  border-radius: 4px;
  border: 1px solid rgba(237, 237, 237, 1);
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 20px;
  box-sizing: border-box;
}
.box-card:hover {
  border: 1px solid #3f92fe;
  background: #f5faff;
}
.ball {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.blueball {
  background: #3f92fe;
}
.greenball {
  background: #0bd295;
}
.msg_box {
  position: fixed;
  z-index: 9999;
}

>>> .el-dialog__header {
  padding: 10px 20px;
  background: #f1f4f6;
  font-size: 16px;
  font-weight: 400;
  color: #333;
}
>>> .el-dialog__body {
  padding: 0;
}
</style>
