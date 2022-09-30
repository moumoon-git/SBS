<template>
  <div>
    <div class="back">
      <section class="grayStyle">
        <div class="sbs-title">
          保障类型
        </div>
        <el-dropdown>
          <el-button
            type="text"
            class="sbs-button"
          >
            设置
          </el-button>
          <el-dropdown-menu
            slot="dropdown"
          >
            <el-checkbox-group v-model="tabListTemp">
              <el-checkbox
                v-for="item in typeList"
                :key="item.name"
                style="margin: 10px"
                class="checkbox"
                :label="item.name"
                @change="clickTypeCheckbox(item)"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </section>
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleTab"
      >
        <el-tab-pane
          v-for="item in tabListTemp"
          :key="item"
          :label="item"
          :name="item"
        />
      </el-tabs>
      <div class="flex">
        <div class="leftStyle">
          <el-button
            type="plain"
            class="sbs-button"
            style="width: 100%"
            @click="addNewType"
          >
            新增物资类型
          </el-button>
          <div
            v-for="(e, i) in leftList"
            :key="i"
            class="leftItemStyle"
            :style="currentItem === e ? 'color: #0091FF;' : ''"
            @click="handleClick(e)"
          >
            {{ e.name }}
          </div>
        </div>
        <div class="rightStyle">
          <section class="headerStyle">
            <div class="sbs-title">
              {{ currentItem.name || '暂无' }}
            </div>
            <div style="color: #999999;margin-left: 28px;">
              库存总数: {{ currentCount }}
            </div>
            <div style="color: #999999;margin-left: 28px;">
              分布地点: {{ currentLocationCount }}
            </div>
          </section>
          <el-table
            v-if="activeName === '防护目标'"
            :data="tableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              prop="name"
              show-overflow-tooltip
              :resizable="false"
              label="目标名称"
            />
            <el-table-column
              align="center"
              prop="canuseNumber"
              show-overflow-tooltip
              :resizable="false"
              label="容纳人数（人）"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="负责人"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.responsiblesList &&
                    scope.row.responsiblesList[0] &&
                    scope.row.responsiblesList[0].name
                    ? scope.row.responsiblesList[0].name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.responsiblesList &&
                    scope.row.responsiblesList[0] &&
                    scope.row.responsiblesList[0].mobile1
                    ? scope.row.responsiblesList[0].mobile1
                    : '-'
                }}</span>
                <img
                  v-if="
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].mobile1
                  "
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].mobile1
                      ? scope.row.responsiblesList[0].mobile1
                      : '',
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].id
                      ? scope.row.responsiblesList[0].id
                      : '',
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].name
                      ? scope.row.responsiblesList[0].name
                      : '',
                  )"
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="位置"
            >
              <template slot-scope="scope">
                <div class="flex">
                  <div class="ellipsis">
                    {{ scope.row.address || scope.row.location || '-' }}
                  </div>
                  <img
                    style="width: 20px; height: 20px; cursor: pointer"
                    src="/static/img/reversePlan/location.svg"
                    @click="handleLocation(scope.row.longitude, scope.row.latitude, scope.row.address || scope.row.location)"
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-if="activeName === '避难场所'"
            :data="tableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              prop="name"
              show-overflow-tooltip
              :resizable="false"
              label="场所名称"
            />
            <el-table-column
              align="center"
              prop="peopleNum"
              show-overflow-tooltip
              :resizable="false"
              label="容纳人数（人）"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="负责人"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.principalList &&
                    scope.row.principalList[0] &&
                    scope.row.principalList[0].name
                    ? scope.row.principalList[0].name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.principalList &&
                    scope.row.principalList[0] &&
                    scope.row.principalList[0].mobile1
                    ? scope.row.principalList[0].mobile1
                    : '-'
                }}</span>
                <img
                  v-if="
                    scope.row.principalList &&
                      scope.row.principalList[0] &&
                      scope.row.principalList[0].mobile1
                  "
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.principalList &&
                      scope.row.principalList[0] &&
                      scope.row.principalList[0].mobile1
                      ? scope.row.principalList[0].mobile1
                      : '',
                    scope.row.principalList &&
                      scope.row.principalList[0] &&
                      scope.row.principalList[0].id
                      ? scope.row.principalList[0].id
                      : '',
                    scope.row.principalList &&
                      scope.row.principalList[0] &&
                      scope.row.principalList[0].name
                      ? scope.row.principalList[0].name
                      : '',
                  )"
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="位置"
            >
              <template slot-scope="scope">
                <div class="flex">
                  <div class="ellipsis">
                    {{ scope.row.address || scope.row.location || '-' }}
                  </div>
                  <img
                    style="width: 20px; height: 20px; cursor: pointer"
                    src="/static/img/reversePlan/location.svg"
                    @click="handleLocation(scope.row.longitude, scope.row.latitude, scope.row.address || scope.row.location)"
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-if="activeName === '专家'"
            :data="tableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              prop="name"
              show-overflow-tooltip
              :resizable="false"
              label="专家名称"
            />
            <el-table-column
              align="center"
              prop="duty"
              show-overflow-tooltip
              :resizable="false"
              label="专家职务"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="专业领域"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.majorArea ? scope.row.majorArea : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.phone ? scope.row.phone : '-'
                }}</span>
                <img
                  v-if="scope.row.phone"
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.phone ? scope.row.phone : '',
                    scope.row.id ? scope.row.id : '',
                    scope.row.name ? scope.row.name : '',
                  )"
                >
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-if="activeName === '队伍'"
            :data="tableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              prop="name"
              show-overflow-tooltip
              :resizable="false"
              label="队伍名称"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="负责人"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.responsiblesList &&
                    scope.row.responsiblesList[0] &&
                    scope.row.responsiblesList[0].name
                    ? scope.row.responsiblesList[0].name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.responsiblesList &&
                    scope.row.responsiblesList[0] &&
                    scope.row.responsiblesList[0].mobile1
                    ? scope.row.responsiblesList[0].mobile1
                    : '-'
                }}</span>
                <img
                  v-if="
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].mobile1
                  "
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].mobile1
                      ? scope.row.responsiblesList[0].mobile1
                      : '',
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].id
                      ? scope.row.responsiblesList[0].id
                      : '',
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].name
                      ? scope.row.responsiblesList[0].name
                      : '',
                  )"
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="位置"
            >
              <template slot-scope="scope">
                <div class="flex">
                  <div class="ellipsis">
                    {{ scope.row.address || scope.row.location || '-' }}
                  </div>
                  <img
                    style="width: 20px; height: 20px; cursor: pointer"
                    src="/static/img/reversePlan/location.svg"
                    @click="handleLocation(scope.row.longitude, scope.row.latitude, scope.row.address || scope.row.location)"
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-if="activeName === '物资'"
            :data="tableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="仓库名称"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.resoureArticleStorehouse
                    ? scope.row.resoureArticleStorehouse.name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="amount"
              show-overflow-tooltip
              :resizable="false"
              label="库存数量（个）"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="负责人"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.resoureArticleStorehouse &&
                    scope.row.resoureArticleStorehouse.contactorList[0] &&
                    scope.row.resoureArticleStorehouse.contactorList[0].name
                    ? scope.row.resoureArticleStorehouse.contactorList[0].name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.resoureArticleStorehouse &&
                    scope.row.resoureArticleStorehouse.contactorList[0] &&
                    scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                    ? scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                    : '-'
                }}</span>
                <img
                  v-if="
                    scope.row.resoureArticleStorehouse &&
                      scope.row.resoureArticleStorehouse.contactorList[0] &&
                      scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                  "
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.resoureArticleStorehouse &&
                      scope.row.resoureArticleStorehouse.contactorList[0] &&
                      scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                      ? scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                      : '',
                    scope.row.resoureArticleStorehouse &&
                      scope.row.resoureArticleStorehouse.contactorList[0] &&
                      scope.row.resoureArticleStorehouse.contactorList[0].id
                      ? scope.row.resoureArticleStorehouse.contactorList[0].id
                      : '',
                    scope.row.resoureArticleStorehouse &&
                      scope.row.resoureArticleStorehouse.contactorList[0] &&
                      scope.row.resoureArticleStorehouse.contactorList[0].name
                      ? scope.row.resoureArticleStorehouse.contactorList[0].name
                      : '',
                  )"
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="位置"
            >
              <template slot-scope="scope">
                <div class="flex">
                  <div class="ellipsis">
                    {{ scope.row.resoureArticleStorehouse
                      ? scope.row.resoureArticleStorehouse.address
                      : '-'
                    }}
                  </div>
                  <img
                    style="width: 20px; height: 20px; cursor: pointer"
                    src="/static/img/reversePlan/location.svg"
                    @click="handleLocation(
                      scope.row.resoureArticleStorehouse ? scope.row.resoureArticleStorehouse.longitude : 0,
                      scope.row.resoureArticleStorehouse ? scope.row.resoureArticleStorehouse.latitude : 0,
                      scope.row.resoureArticleStorehouse ? scope.row.resoureArticleStorehouse.address : 0)"
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="tableOnePage"
            :page-size="tableOneSize"
            layout="prev, pager, next"
            :total="tableOneTotal"
            @current-change="tableOneCurrentChange"
          />
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button
        type="plain"
        class="sbs-button"
        @click="$router.push({
          path: '/organization',
          name: 'organization'
        });"
      >
        返回
      </el-button>
      <div>
        <el-button
          type="plain"
          class="sbs-button"
          @click="prev"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          class="sbs-button"
          @click="next"
        >
          下一步
        </el-button>
      </div>
    </div>
    <sv-dialog
      ref="LocationDialogRef"
      title="定位"
      style="z-index: 2100 !important;"
      @modal="handleClose"
      @cancel="handleClose"
      @confirm="handleClose"
    >
      <div style="min-width: 600px; min-height: 400px; padding: 20px">
        <Location
          :address="address"
          :display-only="true"
          :lng-lat="[longitude, latitude]"
        />
      </div>
    </sv-dialog>
    <!-- 弹窗 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      class="sbs-dialog"
      center
      width="1181px"
      :close-on-click-modal="false"
    >
      <div class="flexDialogStyle">
        <!-- 左 -->
        <div class="leftDialogStyle">
          <section class="headerStyle">
            <div class="sbs-title">
              物资类型
            </div>
          </section>
          <el-tree
            ref="leftTree"
            class="leftTree"
            default-expand-all
            :filter-node-method="filterNode"
            :data="leftTreeList"
            node-key="id"
            highlight-current
            :props="{
              label: 'name',
              children: 'children',
            }"
            :show-checkbox="true"
            :check-strictly="true"
            @check-change="handleCheckChange"
            @node-click="handleLeftNode"
          />
        </div>
        <!-- 右 -->
        <div class="rightDialogStyle">
          <section class="headerStyle">
            <div class="sbs-title">
              {{ currentTreeItem.name || '暂无' }}
            </div>
            <div style="color: #999999;margin-left: 28px;">
              库存总数: {{ currentDialogCount }}
            </div>
            <div style="color: #999999;margin-left: 28px;">
              分布地点: {{ currentDialogLocationCount }}
            </div>
          </section>
          <el-table
            v-if="activeName === '防护目标'"
            :data="dialogTableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              prop="name"
              show-overflow-tooltip
              :resizable="false"
              label="目标名称"
            />
            <el-table-column
              align="center"
              prop="canuseNumber"
              show-overflow-tooltip
              :resizable="false"
              label="容纳人数（人）"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="负责人"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.responsiblesList &&
                    scope.row.responsiblesList[0] &&
                    scope.row.responsiblesList[0].name
                    ? scope.row.responsiblesList[0].name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.responsiblesList &&
                    scope.row.responsiblesList[0] &&
                    scope.row.responsiblesList[0].mobile1
                    ? scope.row.responsiblesList[0].mobile1
                    : '-'
                }}</span>
                <img
                  v-if="
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].mobile1
                  "
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].mobile1
                      ? scope.row.responsiblesList[0].mobile1
                      : '',
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].id
                      ? scope.row.responsiblesList[0].id
                      : '',
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].name
                      ? scope.row.responsiblesList[0].name
                      : '',
                  )"
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="位置"
            >
              <template slot-scope="scope">
                <div class="flex">
                  <div class="ellipsis">
                    {{ scope.row.address || scope.row.location || '-' }}
                  </div>
                  <img
                    style="width: 20px; height: 20px; cursor: pointer"
                    src="/static/img/reversePlan/location.svg"
                    @click="handleLocation(scope.row.longitude, scope.row.latitude, scope.row.address || scope.row.location)"
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-if="activeName === '避难场所'"
            :data="dialogTableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              prop="name"
              show-overflow-tooltip
              :resizable="false"
              label="场所名称"
            />
            <el-table-column
              align="center"
              prop="peopleNum"
              show-overflow-tooltip
              :resizable="false"
              label="容纳人数（人）"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="负责人"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.principalList &&
                    scope.row.principalList[0] &&
                    scope.row.principalList[0].name
                    ? scope.row.principalList[0].name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.principalList &&
                    scope.row.principalList[0] &&
                    scope.row.principalList[0].mobile1
                    ? scope.row.principalList[0].mobile1
                    : '-'
                }}</span>
                <img
                  v-if="
                    scope.row.principalList &&
                      scope.row.principalList[0] &&
                      scope.row.principalList[0].mobile1
                  "
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.principalList &&
                      scope.row.principalList[0] &&
                      scope.row.principalList[0].mobile1
                      ? scope.row.principalList[0].mobile1
                      : '',
                    scope.row.principalList &&
                      scope.row.principalList[0] &&
                      scope.row.principalList[0].id
                      ? scope.row.principalList[0].id
                      : '',
                    scope.row.principalList &&
                      scope.row.principalList[0] &&
                      scope.row.principalList[0].name
                      ? scope.row.principalList[0].name
                      : '',
                  )"
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="位置"
            >
              <template slot-scope="scope">
                <div class="flex">
                  <div class="ellipsis">
                    {{ scope.row.address || scope.row.location || '-' }}
                  </div>
                  <img
                    style="width: 20px; height: 20px; cursor: pointer"
                    src="/static/img/reversePlan/location.svg"
                    @click="handleLocation(scope.row.longitude, scope.row.latitude, scope.row.address || scope.row.location)"
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-if="activeName === '专家'"
            :data="dialogTableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              prop="name"
              show-overflow-tooltip
              :resizable="false"
              label="专家名称"
            />
            <el-table-column
              align="center"
              prop="duty"
              show-overflow-tooltip
              :resizable="false"
              label="专家职务"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="专业领域"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.majorArea ? scope.row.majorArea : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.phone ? scope.row.phone : '-'
                }}</span>
                <img
                  v-if="scope.row.phone"
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.phone ? scope.row.phone : '',
                    scope.row.id ? scope.row.id : '',
                    scope.row.name ? scope.row.name : '',
                  )"
                >
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-if="activeName === '队伍'"
            :data="dialogTableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              prop="name"
              show-overflow-tooltip
              :resizable="false"
              label="队伍名称"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="负责人"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.responsiblesList &&
                    scope.row.responsiblesList[0] &&
                    scope.row.responsiblesList[0].name
                    ? scope.row.responsiblesList[0].name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.responsiblesList &&
                    scope.row.responsiblesList[0] &&
                    scope.row.responsiblesList[0].mobile1
                    ? scope.row.responsiblesList[0].mobile1
                    : '-'
                }}</span>
                <img
                  v-if="
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].mobile1
                  "
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].mobile1
                      ? scope.row.responsiblesList[0].mobile1
                      : '',
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].id
                      ? scope.row.responsiblesList[0].id
                      : '',
                    scope.row.responsiblesList &&
                      scope.row.responsiblesList[0] &&
                      scope.row.responsiblesList[0].name
                      ? scope.row.responsiblesList[0].name
                      : '',
                  )"
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="位置"
            >
              <template slot-scope="scope">
                <div class="flex">
                  <div class="ellipsis">
                    {{ scope.row.address || scope.row.location || '-' }}
                  </div>
                  <img
                    style="width: 20px; height: 20px; cursor: pointer"
                    src="/static/img/reversePlan/location.svg"
                    @click="handleLocation(scope.row.longitude, scope.row.latitude, scope.row.address || scope.row.location)"
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-if="activeName === '物资'"
            :data="dialogTableData"
            highlight-current-row
            :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
            style="height: 446px;overflow: auto;border-radius: 0 !important;"
          >
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="仓库名称"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.resoureArticleStorehouse
                    ? scope.row.resoureArticleStorehouse.name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="amount"
              show-overflow-tooltip
              :resizable="false"
              label="库存数量（个）"
            />
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="负责人"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.resoureArticleStorehouse &&
                    scope.row.resoureArticleStorehouse.contactorList[0] &&
                    scope.row.resoureArticleStorehouse.contactorList[0].name
                    ? scope.row.resoureArticleStorehouse.contactorList[0].name
                    : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="联系电话"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.resoureArticleStorehouse &&
                    scope.row.resoureArticleStorehouse.contactorList[0] &&
                    scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                    ? scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                    : '-'
                }}</span>
                <img
                  v-if="
                    scope.row.resoureArticleStorehouse &&
                      scope.row.resoureArticleStorehouse.contactorList[0] &&
                      scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                  "
                  style="width: 16px; height: 16px; cursor: pointer"
                  src="/static/img/reversePlan/phone.svg"
                  @click="callMobilePhone(
                    scope.row.resoureArticleStorehouse &&
                      scope.row.resoureArticleStorehouse.contactorList[0] &&
                      scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                      ? scope.row.resoureArticleStorehouse.contactorList[0].mobile1
                      : '',
                    scope.row.resoureArticleStorehouse &&
                      scope.row.resoureArticleStorehouse.contactorList[0] &&
                      scope.row.resoureArticleStorehouse.contactorList[0].id
                      ? scope.row.resoureArticleStorehouse.contactorList[0].id
                      : '',
                    scope.row.resoureArticleStorehouse &&
                      scope.row.resoureArticleStorehouse.contactorList[0] &&
                      scope.row.resoureArticleStorehouse.contactorList[0].name
                      ? scope.row.resoureArticleStorehouse.contactorList[0].name
                      : '',
                  )"
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              :resizable="false"
              label="位置"
            >
              <template slot-scope="scope">
                <div class="flex">
                  <div class="ellipsis">
                    {{ scope.row.resoureArticleStorehouse
                      ? scope.row.resoureArticleStorehouse.address
                      : '-'
                    }}
                  </div>
                  <img
                    style="width: 20px; height: 20px; cursor: pointer"
                    src="/static/img/reversePlan/location.svg"
                    @click="handleLocation(
                      scope.row.resoureArticleStorehouse ? scope.row.resoureArticleStorehouse.longitude : 0,
                      scope.row.resoureArticleStorehouse ? scope.row.resoureArticleStorehouse.latitude : 0,
                      scope.row.resoureArticleStorehouse ? scope.row.resoureArticleStorehouse.address : 0)"
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="tableTwoPage"
            :page-size="tableTwoSize"
            layout="prev, pager, next"
            :total="tableTwoTotal"
            @current-change="tableTwoCurrentChange"
          />
        </div>
      </div>
      <div class="bottom">
        <div style="color: #333333;font-weight: 550;">
          已选<span style="color: #0091FF;">{{ leftDialogList.length }}</span>
        </div>
        <div>
          <el-button
            type="plain"
            class="sbs-button"
            @click="dialogVisible = false"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            class="sbs-button"
            @click="submit"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import mixin from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin.js";
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

export default {
  components: {
    Location,
  },
  mixins: [mixin, mixin2],
  data() {
    return {
      longitude: 0,
      latitude: 0,
      address: '',
      versionId: null, // 预案版本ID
      activeName: '', // 激活哪种物资
      activeNameTemp: '', // 临时保存哪种物资
      dialogVisible: false, // 新增弹窗
      currentCode: 0, // 当前的code用来要树数据
      currentItem: '', // 页面左-当前点击
      currentTreeItem: '', // 弹窗左-当前点击
      currentDialogCount: 0,
      currentDialogLocationCount: 0,
      typeList: [],
      tabList: [],
      tabListTemp: [],
      leftTreeList: [],
      tableData: [],
      dialogTableData: [],
      leftList: [],
      leftDialogList: [],
      currentCount: 0,
      currentLocationCount: 0,
      tableOnePage: 1,
      tableOneSize: 10,
      tableOneTotal: 0,
      tableTwoPage: 1,
      tableTwoSize: 10,
      tableTwoTotal: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    handleLocation(lon, lat, addr) {
      if (lon && lat) {
        this.longitude = lon;
        this.latitude = lat;
        this.address = addr;
        this.$refs.LocationDialogRef.visible = true;
      } else {
        this.$message.warning('暂无经纬度信息');
      }
    },
    handleClose() {
      this.$refs.LocationDialogRef.visible = false;
    },
    // 初始化
    init() {
      this.versionId = Number(sessionStorage.getItem('preplanVersionId')); // 获取预案版本ID
      // 设置里typeList初始化
      this.$http({
        method: 'post',
        url: '/emergency/preparation/dictionary/getByParentCode',
        baseURL: window.g.ApiUrl,
        data: {
          pcode: 'preplan_support_type',
        },
      }).then((ress) => {
        this.typeList = ress.data.data;
        // 当前已有tablist
        this.$http({
          method: 'post',
          url: '/preplan/support/getSelectedType',
          baseURL: window.g.ApiUrl,
          data: {
            versionId: this.versionId,
          },
        }).then((res) => {
          if (res.data.data && res.data.data.length > 0) {
            this.activeName = this.activeNameTemp || res.data.data[res.data.data.length - 1].name;
            this.handleTab(); // 点击第一个tab
            const arr = res.data.data;
            if (arr.length > 0) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i]) {
                  this.tabList.push(arr[i]);
                }
              }
              // 回显
              this.tabListTemp = [];
              for (let i = 0; i < this.typeList.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                  if (this.typeList[i].name === arr[j].name) this.tabListTemp.push(arr[j].name);
                }
              }
            }
          }
        });
      });
    },
    // 头部tab-点击
    handleTab() {
      this.tableData = [];
      this.currentCount = 0;
      this.currentLocationCount = 0;
      this.tableOneTotal = 0;
      this.currentItem = '';
      this.tableOnePage = 1;
      for (let i = 0; i < this.typeList.length; i++) {
        if (this.typeList[i].name === this.activeName) this.currentCode = this.typeList[i].code;
      }
      // 左列表初始化
      this.$http({
        method: 'post',
        url: '/preplan/support/getSupportClass',
        baseURL: window.g.ApiUrl,
        data: {
          versionId: this.versionId,
          type: this.currentCode,
        },
      }).then((res) => {
        this.leftList = res.data.data;
        this.leftDialogList = res.data.data;
        if (this.leftList.length) this.handleClick(this.leftList[0]);
      });
      this.activeNameTemp = this.activeName;
    },
    // 头部-设置按钮-勾选
    clickTypeCheckbox(item) {
      if (
        this.tabList.filter((el) => (el.id ? el.id : 0) === item.id).length
        !== 0
      ) {
        this.tabList = this.tabList.filter((el) => el.id !== item.id);
      } else {
        this.tabList.push(item);
      }
      const arr = [];
      for (let i = 0; i < this.tabList.length; i++) {
        arr.push(this.tabList[i].id);
      }
      // 保存当前勾选
      this.$http({
        method: 'post',
        url: '/preplan/support/saveSelectedType',
        baseURL: window.g.ApiUrl,
        data: {
          versionId: this.versionId,
          typeIds: arr,
        },
      }).then((res) => {
        if (res) {
          this.$message.success('当前已勾选类型保存成功');
        }
      });
    },
    // 新增
    addNewType() {
      this.dialogVisible = true;
      this.tableTwoPage = 1;
      this.dialogTableData = [];
      this.tableTwoTotal = 0;
      this.currentDialogCount = 0;
      this.currentDialogLocationCount = 0;
      this.currentTreeItem = '';
      this.leftDialogList = this.leftList;
      this.$nextTick(() => {
        this.$refs.leftTree.setCheckedKeys([]);
      });
      // 弹窗里左树初始化
      this.$http({
        method: 'post',
        url: '/preplan/support/getSupportClassTree',
        baseURL: window.g.ApiUrl,
        data: {
          type: this.currentCode,
        },
      }).then((res) => {
        this.leftTreeList = res.data.data;
        if (this.leftList.length > 0) {
          const arr = [];
          for (let i = 0; i < this.leftList.length; i++) {
            arr.push(this.leftList[i].id);
          }
          this.$nextTick(() => {
            this.$refs.leftTree.setCheckedKeys(arr);
          });
        }
      });
    },
    // 页面左-列表-点击
    handleClick(item) {
      this.currentItem = item;
      this.tableOnePage = 1;
      this.$http({
        method: 'post',
        url: '/preplan/support/getSupportClassDetail',
        baseURL: window.g.ApiUrl,
        data: {
          page: this.tableOnePage,
          size: this.tableOneSize,
          type: this.currentCode,
          classIds: [item.id],
        },
      }).then((res) => {
        this.tableData = res.data.data.list;
        this.currentCount = res.data.data.totalCount;
        this.currentLocationCount = res.data.data.totalCount;
        this.tableOneTotal = res.data.data.totalCount;
      });
    },
    // 页面左-列表-删除
    leftDelete(item) {
      this.leftList = this.leftList.filter((el) => el.name !== item.name);
      this.tableData = [];
    },
    // 页面右-翻页
    tableOneCurrentChange(val) {
      this.tableOnePage = val;
      this.$http({
        method: 'post',
        url: '/preplan/support/getSupportClassDetail',
        baseURL: window.g.ApiUrl,
        data: {
          page: this.tableOnePage,
          size: this.tableOneSize,
          type: this.currentCode,
          classIds: [this.currentItem.id],
        },
      }).then((res) => {
        this.tableData = res.data.data.list;
        this.currentCount = res.data.data.totalCount;
        this.currentLocationCount = res.data.data.totalCount;
        this.tableOneTotal = res.data.data.totalCount;
      });
    },
    // 弹窗左-勾选
    handleCheckChange(data, checked) {
      if (
        this.leftDialogList.filter((el) => el.id === data.id).length !== 0
        && checked
      ) {
        return;
      }
      if (checked) {
        this.leftDialogList.push(data);
      } else {
        this.leftDialogList = this.leftDialogList.filter(
          (el) => el.id !== data.id,
        );
      }
    },
    // 弹窗左-点击
    handleLeftNode(data, node) {
      if (data.platformName) {
        this.currentTreeItem = '';
        this.dialogTableData = [];
        this.currentDialogCount = 0;
        this.currentDialogLocationCount = 0;
        this.tableTwoTotal = 0;
        this.tableTwoPage = 1;
      } else {
        this.currentTreeItem = data;
        this.tableTwoPage = 1;
        this.$http({
          method: 'post',
          url: '/preplan/support/getSupportClassDetail',
          baseURL: window.g.ApiUrl,
          data: {
            page: this.tableTwoPage,
            size: this.tableTwoSize,
            type: this.currentCode,
            classIds: [data.id],
          },
        }).then((res) => {
          this.dialogTableData = res.data.data.list;
          this.currentDialogCount = res.data.data.totalCount;
          this.currentDialogLocationCount = res.data.data.totalCount;
          this.tableTwoTotal = res.data.data.totalCount;
        });
      }
    },
    // 弹窗右-保存
    submit() {
      const arr = [];
      for (let i = 0; i < this.leftDialogList.length; i++) {
        if (this.leftDialogList[i].platformName) {
          // 平台踢出来，不要存进去
        } else {
          arr.push(this.leftDialogList[i].id);
        }
      }
      this.$http({
        method: 'post',
        url: '/preplan/support/saveSupportClass',
        baseURL: window.g.ApiUrl,
        data: {
          data: {
            versionId: this.versionId,
            type: this.currentCode,
            classIds: arr, // 左树id
          },
        },
      }).then((res) => {
        if (res.data.errorcode === 0 || res.data.code === 0) {
          this.activeName = this.activeNameTemp;
          this.dialogVisible = false;
          this.init();
          this.$message({
            message: '保存成功！',
            type: 'success',
          });
        }
      });
      this.currentTreeItem = '';
      this.currentDialogCount = '';
      this.currentDialogLocationCount = '';
    },
    // 弹窗右-翻页
    tableTwoCurrentChange(val) {
      this.tableTwoPage = val;
      this.$http({
        method: 'post',
        url: '/preplan/support/getSupportClassDetail',
        baseURL: window.g.ApiUrl,
        data: {
          page: this.tableTwoPage,
          size: this.tableTwoSize,
          type: this.currentCode,
          classIds: [this.currentTreeItem.id],
        },
      }).then((res) => {
        this.dialogTableData = res.data.data.list;
        this.currentDialogCount = res.data.data.totalCount;
        this.currentDialogLocationCount = res.data.data.totalCount;
        this.tableTwoTotal = res.data.data.totalCount;
      });
    },
    // 打电话
    callMobilePhone(mobile1, id, name) {
      this.makePhoneCall(
        mobile1,
        id,
        name,
        0,
      );
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    prev() {
      this.$emit('refprev');
    },
    next() {
      this.$emit('refreshList');
    },
  },
};
</script>

<style scoped>
.back {
  height: 72vh;
  overflow: auto;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 0px 0px 4px 4px;
}
.grayStyle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background: #EAEAEA;
  border-radius: 4px 4px 0px 0px;
}
.headerStyle {
  display: flex;
  justify-content: start;
  background: #FBFCFF;
  border-bottom: 1px solid #DDDDDD;
  padding: 8px 20px;
  align-items: center;
}
.leftStyle {
  position: relative;
  width: 24%;
  height: 59vh;
  overflow: auto;
  border: 1px solid rgba(221, 221, 221, 1);
  padding: 20px 10px;
  margin: 0 9px 0 20px;
}
.leftItemStyle {
  padding: 6px 0px;
  cursor: pointer;
}
.leftItemStyle:hover {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.rightStyle {
  position: relative;
  width: 68vw;
  height: 59vh;
  overflow: auto;
  border: 1px solid rgba(221, 221, 221, 1);
}
.bottom {
  border-top: 1px solid #E9ECF1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
  align-items: center;
}
.flex {
  display: flex;
}
.flexDialogStyle {
  display: flex;
  padding: 20px;
  justify-content: space-between;
}
.leftDialogStyle {
  position: relative;
  width: 29%;
  height: 59vh;
  overflow: auto;
  border: 1px solid rgba(221, 221, 221, 1);
}
.rightDialogStyle {
  position: relative;
  width: 70%;
  height: 59vh;
  overflow: auto;
  border: 1px solid rgba(221, 221, 221, 1);
}
.ellipsis {
  width: 94%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
