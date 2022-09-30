<template>
  <!-- 发布/编辑工单弹窗 -->
  <el-dialog
    :showClose="false"
    :visible.sync="releaseVisible"
    width="1304px"
    :before-close="handleClose"
  >
    <!-- 弹窗标题 -->
    <div slot="title" class="dialog-title">
      <span class="title-text">{{dialogTitle}}</span>
      <span class="title-cancel-button el-icon-close" @click="handleClose"></span>
    </div>
    <!-- 弹窗主体 -->
    <el-form
      ref="form"
      :model="releaseForm"
      label-width="100px"
      label-position="left"
    >
      <el-row :gutter="20" class="dialog-main">
        <!-- 左侧内容 -->
        <el-col class="left-side">
          <!-- 0. 工单状态更改 -->
          <el-form-item label="工单状态" v-if="statusUpdateShow">
            <el-dropdown trigger="click" placement="bottom-start">
              <span class="el-dropdown-link">
                <span v-if="releaseForm.status==-1">已取消（停用）</span>
                <span v-if="releaseForm.status==0">处置中（重启）</span>
                <span v-if="releaseForm.status==1">已处置（完成）</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-radio-group v-model="statusUpdateForm.responseType">
                  <el-radio-button v-if="releaseForm.status!=-1" label="-1">已取消（停用）</el-radio-button>
                  <el-radio-button v-if="releaseForm.status!=0" label="0">处置中（重启）</el-radio-button>
                  <el-radio-button v-if="releaseForm.status!=1" label="1">已处置（完成）</el-radio-button>
                </el-radio-group>
                <br>
                <el-input
                  placeholder="请输入工单状态变更备注说明"
                  v-model="statusUpdateForm.remark"
                />
                <br>
                <!-- 文件上传 -->
                <input type="file" multiple @change="getFileStatus($event)" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,video/*,audio/*,.xls,.xlsx,.txt,.pdf">
                <span v-for="(item, index) in statusUpdateForm.documentList" :key="`${item.url + index}`" style="border:1px solid black;height:60px;width:160px;display:inline-block;overflow:hidden;">
                  <img v-if="isImg(item.url)" alt="index" :src="hostUrl + item.url" width="60" height="60"/>
                  <a v-else :href="item.url">{{item.name}}</a>
                  <i class="el-icon-close" @click="deleteFile(item.url, statusUpdateForm.documentList)"></i>
                </span>
                <el-button type="text" @click="statusUpdate">确认</el-button>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <!-- 1. 工单名称 -->
          <el-form-item label="工单名称">
            <el-input v-model="releaseForm.name" placeholder="请输入工单名称"></el-input>
          </el-form-item>
          <!-- 2. 工单属性 -->
          <el-form-item label="工单属性" class="work_paper">
            <el-select v-model="releaseForm.workProperty" placeholder="请选择工单属性">
              <el-option
                v-for="item in workPropertyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- 3. 处置对象 -->
          <el-form-item label="处置对象">
            <el-input
              v-model="releaseForm.handleTarget"
              placeholder="请输入处置对象"
            />
          </el-form-item>
          <!-- 4. 工单地点 -->
          <el-form-item label="工单地点">
            <el-input
              class="address"
              v-model="releaseForm.workPlace"
              placeholder="请输入定点或手动定位"
            >
              <template slot="append">
                <img
                  class="location-icon"
                  src="../img/location-active.png"
                  alt="定位icon"
                  @click="mapShow"
                  v-if="releaseForm.workPlace"
                >
                <img
                  class="location-icon"
                  src="../img/location-inactive.png"
                  alt="定位icon"
                  @click="mapShow"
                  v-else
                >
              </template>
            </el-input>
          </el-form-item>
          <!-- 5. 完成时限 -->
          <el-form-item label="完成时限" class="el-input--suffix">
            <el-switch
              v-model="releaseForm.isEndtime"
              active-color="#0091FF"
              inactive-color="#CCCCCC"
              active-value="1"
              inactive-value="0"
            />
            <el-date-picker
              v-model="releaseForm.endDate"
              type="date"
              placeholder="请选择完成日期"
              v-if="releaseForm.isEndtime == 1"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return (
                    time.getTime() < new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate(),
                    )
                  );
                },
              }"
            />
            <el-time-select
              v-model="releaseForm.endTime"
              v-if="releaseForm.isEndtime == 1"
              :picker-options="{
                  start: '08:30',
                  step: '00:30',
                  end: '24:00'
              }"
              placeholder="完成时间"
              value-format="HH-mm"
            />
          </el-form-item>
          <!-- 6. 情况说明 -->
          <el-form-item label="情况说明">
            <el-input
              type="textarea"
              v-model="releaseForm.remark"
              placeholder="简单说明一下情况"
            />
          </el-form-item>

          <!-- 7. 附件上传 -->
          <!-- <el-form-item label="附件">
              <div class="qqtang">
              <input type="file" multiple @change="getFile($event)" style="opacity: 0;"></div>
              <span v-for="(item, index) in releaseForm.documentList" :key="index" style="border:1px solid #999999;height:40px;width:60px;display:inline-block;overflow:hidden;margin:5px;">
                  <viewer > 
                  <img v-if="isImg(item.url)" alt="index" :src="hostUrl + item.url" width="60" height="60"/>
              
                  <a v-else :href="item.url">{{item.documentName}}</a>
                      </viewer>
                  <i class="el-icon-close" @click="deleteFile(item.url, releaseForm.documentList)"></i>
              </span>
          </el-form-item> -->
          <!-- 2020-11-06 tanjinfeng 上传按钮重做 -->
          <el-form-item label="附件">
            <div class="upload-file">
              <div class="upload-file__button" @click="$refs.uploadBtn.click()">
                <img height="20" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTUgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+R3JvdXAgMTgy5aSH5Lu9PC90aXRsZT4KICAgIDxnIGlkPSLpo47pmanmjpLmn6UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNjUiPgogICAgICAgIDxnIGlkPSLnvJbovpHlt6XljZUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNzYuMDAwMDAwLCAtNDk1LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0id2luLWNvcHktNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjc1LjAwMDAwMCwgNTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i5YiG57uELTXlpIfku70tNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCA0MjguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IlVwbG9hZC9fUmVzb3VyY2VzL0J1dHRvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjcuMDAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTgy5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgOS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJ1cGxvYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuODc1MDAwLCAwLjg3NTAwMCkiIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTUuODAzNzEwOTQsMC4xMzgwODU5MzcgQzUuODk1MzEyNSwwLjA0NjQ4NDM3NSA2LjAxNjk5MjE5LDAgNi4xMzg2NzE4OCwwIEM2LjI2MDM1MTU2LDAgNi4zODA2NjQwNiwwLjA0NjQ4NDM3NSA2LjQ3MzYzMjgxLDAuMTM4MDg1OTM3IEw4LjYwMzcxMDk0LDIuMjY5NTMxMjUgQzguNzg4MjgxMjUsMi40NTQxMDE1NiA4Ljc4ODI4MTI1LDIuNzUzNTE1NjIgOC42MDM3MTA5NCwyLjkzODA4NTk0IEM4LjUxNDg0Mzc1LDMuMDI2OTUzMTIgOC4zOTU4OTg0NCwzLjA3NjE3MTg4IDguMjcwMTE3MTksMy4wNzYxNzE4OCBDOC4xNDQzMzU5NCwzLjA3NjE3MTg4IDguMDI1MzkwNjIsMy4wMjY5NTMxMiA3LjkzNjUyMzQ0LDIuOTM4MDg1OTQgTDYuNjExNzE4NzUsMS42MTMyODEyNSBMNi42MTE3MTg3NSw5LjUxMjg5MDYyIEM2LjYxMTcxODc1LDkuNzc0MDIzNDQgNi4zOTk4MDQ2OSw5Ljk4NTkzNzUgNi4xMzg2NzE4OCw5Ljk4NTkzNzUgQzUuODc3NTM5MDYsOS45ODU5Mzc1IDUuNjY1NjI1LDkuNzc0MDIzNDQgNS42NjU2MjUsOS41MTI4OTA2MiBMNS42NjU2MjUsMS42MTMyODEyNSBMNC4zNDA4MjAzMSwyLjkzODA4NTk0IEM0LjE1NjI1LDMuMTIyNjU2MjUgMy44NTY4MzU5NCwzLjEyMjY1NjI1IDMuNjczNjMyODEsMi45MzgwODU5NCBDMy40ODkwNjI1LDIuNzUzNTE1NjIgMy40ODkwNjI1LDIuNDU0MTAxNTYgMy42NzIyNjU2MywyLjI2OTUzMTI1IEw1LjgwMzcxMDk0LDAuMTM4MDg1OTM3IFogTTExLjc3Njk1MzEsNy44ODA0Njg3NSBDMTEuNTE1ODIwMyw3Ljg4MDQ2ODc1IDExLjMwMzkwNjMsOC4wOTIzODI4MSAxMS4zMDM5MDYzLDguMzUzNTE1NjMgTDExLjMwMzkwNjMsMTEuMDI1IEMxMS4zMDM5MDYzLDExLjE3OTQ5MjIgMTEuMTc4MTI1LDExLjMwNjY0MDYgMTEuMDIyMjY1NiwxMS4zMDY2NDA2IEwxLjIyNjM2NzE5LDExLjMwNjY0MDYgQzEuMDcxODc1LDExLjMwNjY0MDYgMC45NDQ3MjY1NjIsMTEuMTgwODU5NCAwLjk0NDcyNjU2MiwxMS4wMjUgTDAuOTQ0NzI2NTYyLDguMzUyMTQ4NDQgQzAuOTQ0NzI2NTYyLDguMDkxMDE1NjMgMC43MzI4MTI1LDcuODc5MTAxNTYgMC40NzE2Nzk2ODgsNy44NzkxMDE1NiBDMC4yMTA1NDY4NzUsNy44NzkxMDE1NiAwLDguMDkyMzgyODEgMCw4LjM1MjE0ODQ0IEwwLDExLjM5OTYwOTQgQzAsMTEuODY4NTU0NyAwLjM4MTQ0NTMxMywxMi4yNDg2MzI4IDAuODQ5MDIzNDM3LDEyLjI0ODYzMjggTDExLjQwMDk3NjYsMTIuMjQ4NjMyOCBDMTEuODY5OTIxOSwxMi4yNDg2MzI4IDEyLjI1LDExLjg2NzE4NzUgMTIuMjUsMTEuMzk5NjA5NCBMMTIuMjUsOC4zNTIxNDg0NCBDMTIuMjUsOC4wOTIzODI4MSAxMi4wMzgwODU5LDcuODgwNDY4NzUgMTEuNzc2OTUzMSw3Ljg4MDQ2ODc1IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS00OSIgeD0iMCIgeT0iMCIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==" alt>
                <span>上传文件</span>
              </div>
              <input ref="uploadBtn" type="file" multiple @change="getFile($event)" style="position:absolute;opacity:0;z-index:-99;" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,video/*,audio/*,.xls,.xlsx,.txt,.pdf">
              <viewer :images="releaseForm.documentList.map(e => e.url)">
                <template v-for="(img, imgIndex) in releaseForm.documentList">
                  <span
                    class="upload-file__img"
                    v-if="isImg(img.url)"
                    :key="`upload_img_${imgIndex}`"
                  >
                    <img
                      :src="`${hostUrl}/${img.url}`"
                      alt
                      height="124"
                      width="124"
                    >
                    <div class="el-icon-close" @click="deleteFile(img.url, releaseForm.documentList)"></div>
                  </span>
                </template>
              </viewer>
              <template v-for="(file, fileIndex) in releaseForm.documentList">
                <div
                  class="upload-file__file"
                  :key="`upload_file_${fileIndex}`"
                  v-if="!isImg(file.url)"
                >
                  <img height="18" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NjI2ODA2OTI4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2MTkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTg3Ny4xIDI0NS4yYy0xNC42LTM2LjItMzYtNjguNS02My43LTk2LjItMjcuNy0yNy43LTYwLTQ5LjEtOTYuMi02My43LTM0LjktMTQuMS03MS43LTIxLjItMTA5LjUtMjEuMlM1MzMgNzEuMiA0OTguMiA4NS4zYy0zNi4yIDE0LjYtNjguNSAzNi05Ni4yIDYzLjdMMTM5IDQxMmMtMTUuNiAxNS42LTE1LjYgNDAuOSAwIDU2LjZzNDAuOSAxNS42IDU2LjYgMGwyNjMtMjYzYzM5LjYtMzkuNiA5Mi42LTYxLjUgMTQ5LjEtNjEuNXMxMDkuNSAyMS44IDE0OS4xIDYxLjVjMzkuNiAzOS42IDYxLjUgOTIuNiA2MS41IDE0OS4xcy0yMS44IDEwOS41LTYxLjUgMTQ5LjFMNTkxLjYgNjY5bC0wLjUgMC41LTE3NC40IDE3NC40Yy00OC4yIDQ4LjItMTI2LjcgNDguMi0xNzUgMC00OC4yLTQ4LjItNDguMi0xMjYuNyAwLTE3NWwxNzQuNC0xNzQuNGMwLjUtMC41IDAuOS0wLjkgMS4zLTEuNGwxMjEuOS0xMjEuOWM3LjUtNy41IDE3LjUtMTEuNiAyOC4yLTExLjZzMjAuOCA0LjEgMjguMiAxMS42YzcuNSA3LjUgMTEuNiAxNy41IDExLjYgMjguMnMtNC4xIDIwLjgtMTEuNiAyOC4ybC0yMzMgMjMzLjJjLTE1LjYgMTUuNi0xNS42IDQwLjkgMCA1Ni42IDcuOCA3LjggMTggMTEuNyAyOC4zIDExLjdzMjAuNS0zLjkgMjguMy0xMS43bDIzMy4yLTIzMy4yYzIyLjYtMjIuNiAzNS01Mi43IDM1LTg0LjggMC0zMi4xLTEyLjQtNjIuMi0zNS04NC44LTIyLjYtMjIuNi01Mi43LTM1LTg0LjgtMzVzLTYyLjIgMTIuNC04NC44IDM1TDMxMS4xIDQ4Ni40Yy0wLjUgMC41LTAuOSAwLjktMS4zIDEuNEwxODUuMiA2MTIuM2MtMzguNCAzOC40LTU5LjUgODkuNS01OS41IDE0NC4xIDAgNTQuNSAyMS4xIDEwNS43IDU5LjUgMTQ0LjFTMjc0LjcgOTYwIDMyOS4zIDk2MGM1NC41IDAgMTA1LjctMjEuMSAxNDQuMS01OS41bDUwLTUwIDAuNS0wLjUgMjg5LjYtMjg5LjZjMjcuNy0yNy43IDQ5LjEtNjAgNjMuNy05Ni4yIDE0LjEtMzQuOSAyMS4yLTcxLjcgMjEuMi0xMDkuNS0wLjEtMzcuOC03LjItNzQuNy0yMS4zLTEwOS41eiIgcC1pZD0iMjYyMCIgZmlsbD0iIzkxOTE5MSI+PC9wYXRoPjwvc3ZnPg==" alt>
                  <a :href="`${hostUrl}/${file.url}`"  :download="file.name">{{file.documentName}}</a>
                  <span class="el-icon-close" @click="deleteFile(file.url, releaseForm.documentList)"></span>
                </div>
              </template>
            </div>
          </el-form-item>
        </el-col>
        <!-- 右侧内容 -->
        <el-col :span="10" class="right-side">
          <!-- 1. 处置部门 -->
          <div class="biaoti">工单处置人员</div>
          <el-form-item label="主责部门">
            <div class="right-item">
              <el-input
                class="right-input"
                v-model="releaseForm.mailGroupName"
                placeholder="请选择主责部门"
                disabled
              />
              <el-button
                class="sbs-button"
                @click="showDepList"
              >
                选择
              </el-button>
            </div>
          </el-form-item>
          <!-- 2. 工单负责人 -->
          <!-- <el-row> -->
          <el-form-item label= "工单主责人">
            <div class="right-item">
              <el-input
                class="right-input"
                v-model="releaseForm.chargeMan.name"
                placeholder="请选择工单负责人"
                disabled
              />
              <el-button
                class="sbs-button"
                @click="showContactorList"
              >
                选择
              </el-button>
            </div>
          </el-form-item>
          <!-- </el-row> -->
          <!-- 协作部门 -->
          <!-- @author tanjinfeng -->
          <!-- @date 2020-10-19 -->
          <!-- @desc 新增协作部门 -->
          <!-- <el-row> -->
          <el-form-item label="协办部门">
            <div class="right-item">
              <el-input
                class="right-input"
                v-model="releaseForm.helpDepEntity.name"
                placeholder="请选择协作部门"
                disabled
              />
              <el-button
                class="sbs-button"
                @click="showHelpDepList"
              >
                选择
              </el-button>
            </div>
          </el-form-item>
          <!-- </el-row> -->
          <!-- 3. 工单参与人 -->
          <el-row class="biubiu">工单参与人</el-row>
          <el-row>
            <div
              class="add-button"
              @click="contactViewHandle"
            >
              添加参与人
            </div>
            <span v-for="(item,index) in contactorName" :key="index">
              <div class="contact-item">
                <span class="contact__inner">
                  {{ item.name }}{{ item.position ? `(${item.position})` : '' }}
                </span>
                <img src="../../../../../assets/img/del.svg"  style="position:absolute;right:90px;height:22px" @click="deleteItem(item.id, contactorName, releaseForm.participantsManList)"/>
              </div>
            </span>
          </el-row>
          <!-- 4. 抄送 -->
          <el-row class="biubiu">抄送</el-row>
          <el-row>
            <div
              class="add-button"
              @click="copyViewHandle"
            >
              添加参与人
            </div>
            <span v-for="(item,index) in copyName" :key="index">
              <div class="contact-item">
                <span class="contact__inner">
                  {{ item.name }}{{ item.position ? `(${item.position})` : '' }}
                </span>
                <img src="../../../../../assets/img/del.svg"  style="position:absolute;right:90px;height:22px" @click="deleteItem(item.id, copyName, releaseForm.copyManList)"/>
              </div>
            </span>
            <!-- <el-input v-model="copyName" placeholder="请选择抄送人" disabled></el-input>
            <el-button type="primary"   @click="copyViewHandle">添加抄送人</el-button> -->
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <!-- 底部按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="releaseSubmit">确 定</el-button>
    </span>
    <!-- 定位弹窗 -->
    <location
      ref="location"
      :workPlace="releaseForm.workPlace"
      @updateLocation="updateLocation"
    />
    <!-- 处置部门弹窗 -->
    <getDepartmentList
      ref="getDepartmentList"
      :depId="releaseForm.depId"
      @checkDepId="checkDepId"
    />
    <!-- 协作部门弹窗 -->
    <getDepartmentList
      ref="getHelpDepartmentList"
      :depId="releaseForm.helpDepId"
      @checkDepId="checkHelpDepId"
    />
    <!-- 工单负责人弹窗 -->
    <getContactorList
      ref="getContactorList"
      :contactorId="releaseForm.contactorId"
      @checkContactorId="checkContactorId"
      :depId="this.releaseForm.depId"
    />
    <!-- 参与人弹窗 -->
    <linkman-draggable
      ref="commonLink"
      v-show="showcommonLink"
      @OnchildByValue="handelLinkdata"
    />
    <!-- 抄送人弹窗 -->
    <linkman-draggable
      ref="copyLink"
      v-show="showcopyLink"
      @OnchildByValue="handelCopyLinkdata"
    />
  </el-dialog>
</template>

<script>
import location from "../location/location"
import getDepartmentList from "../getDepartmentList/getDepartmentList"
import getContactorList from "../getContactorList/getContactorList"
import LinkmanDraggable from '../LinkmanDraggable/LinkmanDraggable'

export default {
  name: 'releaseSheet',
  components: {
    location,
    getDepartmentList,
    getContactorList,
    LinkmanDraggable,
  },
  props: [
    // 工单属性列表
    "workPropertyList",
    // 刷新工单列表方法
    "getWorkData",
    // 判定弹窗内容是发布还是编辑
    "editWhich",
  ],
  watch: {
    editWhich(id) {
      if (id == -1) {
        this.dialogTitle = "发布工单";
        this.releaseForm = this.newForm;
        this.contactorName = this.newContactorName;
        this.copyName = this.newCopyName;
        this.statusUpdateShow = false;
      } else {
        this.dialogTitle = "编辑工单";
        this.getSingleData(id);
        this.statusUpdateShow = true;
        this.statusUpdateForm.workId = id;
      }
    },
  },
  mounted() {
    console.log("发布/编辑工单弹窗加载完成...", this.workPropertyList, this.getWorkData, this.editWhich);
  },
  methods: {
    // 弹窗关闭提示
    handleClose(done) {
      var that = this;
      // this.$confirm('确认关闭？')
      // .then(_ => {
      //     that.releaseVisible = false;
      //     // 取消编辑时，重置编辑内容
      //     if(that.editWhich !== -1) {
      //         that.releaseFormInit();
      //         that.getSingleData(that.editWhich);
      //     } else {
      //         // 取消发布工单时，保存编辑内容
      //         that.newForm = JSON.parse(JSON.stringify(that.releaseForm));
      //         that.newContactorName = JSON.parse(JSON.stringify(that.contactorName));
      //         that.newCopyName = JSON.parse(JSON.stringify(that.copyName));
      //     }
      //     done();
      // })
      // .catch(_ => {});
      that.releaseVisible = false;
      // 取消编辑时，重置编辑内容
      if (that.editWhich !== -1) {
        that.releaseFormInit();
        that.getSingleData(that.editWhich);
      } else {
        // 取消发布工单时，保存编辑内容
        that.newForm = JSON.parse(JSON.stringify(that.releaseForm));
        that.newContactorName = JSON.parse(JSON.stringify(that.contactorName));
        that.newCopyName = JSON.parse(JSON.stringify(that.copyName));
      }
    },
    // 获取单个工单详情
    getSingleData(id) {
      let url = window.SITE_CONFIG['baseUrl'] + "/work/workSheet/info/" + id;
      let that = this;
      this.$http
        .get(url)
        .then(
          function(res) {
            console.log("获取单个表单：", res.data.data);
            that.releaseForm = JSON.parse(JSON.stringify(res.data.data));
            if(that.releaseForm.chargeMan == null) {
                that.releaseForm.chargeMan = {
                    id: '',
                    name: ''
                };
            }
            if(that.releaseForm.helpDepEntity == null || that.releaseForm.helpDepEntity == undefined) {
                that.releaseForm.helpDepEntity = {name: ''}
            }
            that.releaseForm.participantsManList = [];
            that.releaseForm.copyManList = [];
            that.contactorName = [];
            that.copyName = [];
            for(let item of that.releaseForm.allContactorList) {
                if(item.type==2) {
                    that.contactorName.push({
                        name: item.contactorIdString,
                        id: item.contactorId
                    });
                    that.releaseForm.participantsManList.push(item.contactorId);
                } else if(item.type==3) {
                    that.copyName.push({
                        name: item.contactorIdString,
                        id: item.contactorId
                    });
                    that.releaseForm.copyManList.push(item.contactorId);
                }
            }
          },
          function(res) {
            console.log("获取单个表单失败！\n错误信息：\n", res);
          }
        );
    },
    // 工单发布/编辑提交确认
    releaseSubmit() {
      let that = this;
      this.$confirm('确认提交？')
        .then(_ => {
          // POST上传
          (function workPost() {
              let url = window.SITE_CONFIG['baseUrl'] + "/work/workSheet/save";
              if(that.editWhich !== -1) {
                  url = window.SITE_CONFIG['baseUrl'] + "/work/workSheet/update";
              }
              that.$http
              .post(url, that.releaseForm, {emulateJSON:true})
              .then(
                  function(res) {
                      console.log("表单新增/修改成功！", res);
                      // 刷新列表并清空编辑部分
                      that.getWorkData();
                      that.$parent.$refs.viewSheet.getSingleData(that.editWhich);
                      if(that.editWhich == -1) {
                          that.releaseFormInit();
                      }
                  },
                  function(res) {
                      console.log("表单新增/修改失败！", res);
                  }
              );
          })();
          this.releaseVisible = false;
          done();
        })
        .catch(_ => {}); 
    },
    // 新建表单内容初始化清空
    releaseFormInit() {
      this.releaseForm.name = '';
      this.releaseForm.workModule = 1;
      this.releaseForm.workProperty = '';
      this.releaseForm.handleTarget = '';
      this.releaseForm.workPlace = '';
      this.releaseForm.longitude = '';
      this.releaseForm.latitude = '';
      this.releaseForm.isEndtime = '0';
      this.releaseForm.endDate = '';
      this.releaseForm.endTime = '';
      this.releaseForm.remark = '';
      this.releaseForm.contactorId = '';
      this.releaseForm.depId = '';
      this.releaseForm.mailGroupName = '';
      this.releaseForm.documentList = [];
      this.releaseForm.participantsManList = [];
      this.releaseForm.copyManList = [];
      this.releaseForm.chargeMan = {
        id: '',
        name: '',
      };
      this.releaseForm.helpDepId = '';
      this.releaseForm.helpDepEntity = {name: ''};
      this.contactorName = [];
      this.copyName = [];
      // 重置工单状态变更编辑内容
      this.statusUpdateForm.documentList = [];
      this.statusUpdateForm.remark = '';
      this.statusUpdateForm.responseType = '';
    },
    // 点击定位弹窗
    mapShow() {
      this.$refs.location.mapDialogVisible = true;
    },
    // 更新位置
    updateLocation(address) {
      this.releaseForm.workPlace = address;
    },
    // 点击处置部门列表弹窗
    showDepList() {
      this.$refs.getDepartmentList.$forceUpdate();
      this.$refs.getDepartmentList.getDepVisible = true;
    },
    // 处置部门勾选，从子组件赋值到父组件
    checkDepId(id, name) {
      if (this.releaseForm.depId != id) {
        this.releaseForm.chargeMan.name = '';
      }
      this.releaseForm.depId = id;
      this.releaseForm.mailGroupName = name;
    },
    // 点击协作部门列表弹窗
    showHelpDepList() {
      this.$refs.getHelpDepartmentList.$forceUpdate();
      this.$refs.getHelpDepartmentList.getDepVisible = true;
    },
    // 协作部门勾选，从子组件赋值到父组件
    checkHelpDepId(id, name) {
      this.releaseForm.helpDepId = id;
      this.releaseForm.helpDepEntity.name = name
    },
    // 点击负责人列表弹窗
    showContactorList() {
      this.$refs.getContactorList.$forceUpdate();
      this.$refs.getContactorList.getContactorVisible = true;
    },
    // 负责人勾选，从子组件赋值到父组件
    checkContactorId(id, name) {
      this.releaseForm.contactorId = id;
      this.releaseForm.chargeMan.id = id;
      this.releaseForm.chargeMan.name = name;
    },
    // 点击显示选择参与人视图
    contactViewHandle() {
      this.showcommonLink = true;
      this.$nextTick(()=>{
        this.$refs.commonLink.handleAddContacts(
          '/mail/mailgroup/list',
          "请选择",
        );
      })
    },
    // 选择的参与人赋值
    handelLinkdata({ linkman }) {
      let that = this;
      for(let item of linkman) {
          that.releaseForm.participantsManList.push(item.id);
          that.contactorName.push({
              name: item.name,
              id: item.id
          });
      }
    },
    // 点击显示选择抄送人视图
    copyViewHandle() {
      this.showcopyLink = true;
      this.$nextTick(()=>{
        this.$refs.copyLink.handleAddContacts(
          '/mail/mailgroup/list',
          "请选择",
        );
      })
    },
    // 选择的抄送人赋值
    handelCopyLinkdata({linkman}){
      let that = this;
      for(let item of linkman) {
          console.log("uuu",that.copyName);
          that.releaseForm.copyManList.push(item.id);
          that.copyName.push({
              name: item.name,
              id: item.id
          });
      }
    },
    // 删除参与人、抄送人
    deleteItem(id, display, list) {
      for(let index in display) {
          if(display[index].id == id) {
              display.splice(index, 1);
          }
      }
      for(let index in list) {
          if(list[index] == id) {
              list.splice(index, 1);
          }
      }
      console.log("uuu", this.contactorName, this.releaseForm.participantsManList)
    },
    
    // 工单状态变更提交
    statusUpdate() {
      let that = this;
      let url = window.SITE_CONFIG['baseUrl'] + "/work/workSheet/updateStatus";
      console.log("提交的状态修改表单：", this.statusUpdateForm);
      this.$confirm('确认提交？')
        .then(_ => {
          that.$http
            .post(url, that.statusUpdateForm, {emulateJSON:true})
            .then(
                function(res) {
                    console.log("状态修改成功", res);
                    that.getWorkData();
                    that.getSingleData(that.editWhich);
                    // 刷新查看页面
                    that.$parent.$refs.viewSheet.getSingleData(that.editWhich);
                    //that.statusUpdateInit();
                },
              function(res) {
                  console.log("状态更新失败", res);
              }
          );
          done();
        })
        .catch(_ => {});
    },
    // 初始化状态变更栏
    statusUpdateInit() {
      this.statusUpdateForm.workPlace= window.sessionStorage.getItem('platformName');
      this.statusUpdateForm.remark = '';
      this.statusUpdateForm.responseType = '';
      this.statusUpdateForm.documentList = [];
      this.statusUpdateForm.workId = '';
      this.statusUpdateForm.handleResponseId = 0;
      this.statusUpdateForm.longitude = sessionStorage.getItem('longitude')
      this.statusUpdateForm.latitude = sessionStorage.getItem('latitude')
      },
      // 文件上传，返回文件所在服务器url
      getFile(event) {
        // 上传接口
        let url = window.SITE_CONFIG['baseUrl'] + "/upload/emergencyHandleProcessFile";
        let that = this;
        // 上传的文件列表
        let fileList = event.target.files;
        for(let file of fileList) {
            // 每次上传1个文件，返回一条url
            let formData = new FormData();
            formData.append("file", file);
            formData.append("token", that.$cookie.get("token"));
            that.$http
            .post(url, formData, {emulateJSON: true})
            .then(
                function(res) {
                    console.log("upload successfully and get response: ", res.data.data);
                    that.releaseForm.documentList.push({
                        documentName: res.data.data.name,
                        url: res.data.data.url,
                    });
                    // 清空input值，防止重复上传时不触发change事件
                    event.srcElement.value='';
                },
                function(res) {
                    console.log("upload fail: ", res);
                }
            );
        }
        // console.log("preview", that.filePreview);
      },
      // 状态变更文件上传，返回文件所在服务器url
      getFileStatus(event) {
        // 上传接口
        let url = window.SITE_CONFIG['baseUrl'] + "/upload/emergencyHandleProcessFile";
        let that = this;
        // 上传的文件列表
        let fileList = event.target.files;
        for(let file of fileList) {
            // 每次上传1个文件，返回一条url
            let formData = new FormData();
            formData.append("file", file);
            formData.append("token", that.$cookie.get("token"));
            that.$http
            .post(url, formData, {emulateJSON: true})
            .then(
                function(res) {
                    console.log("upload successfully and get response: ", res.data.data);
                    that.statusUpdateForm.documentList.push({
                        name: res.data.data.name,
                        url: res.data.data.url,
                    });
                    // 清空input值，防止重复上传时不触发change事件
                    event.srcElement.value='';
                },
                function(res) {
                    console.log("upload fail: ", res);
                }
            );
          }
          // console.log("preview", that.filePreview);
      },
      // 判断是图片还是文档
      isImg(url) {
          let res = url.slice(-4);
          if(res == '.png' || res == '.jpg' || res == 'jpeg' || res == '.gif' || res == '.bmp'|| res == '.svg') {
              return true;
          }
          return false;
      },
      // 删除文件
      deleteFile(url, list) {
          let that = this;
          for(let index in list) {
              if(list[index].url == url) {
                  list.splice(index, 1);
              }
          }
          console.log("删tmd：", list);
      },
  },
  data() {
      return {
          // 发布表单弹窗是否显示
          releaseVisible: false,
          // 弹窗标题名
          dialogTitle: '',
          // 本地编辑表单内容
          releaseForm: {
              name: '',
              workModule: 1,
              workProperty: '',
              handleTarget: '',
              workPlace: '',
              longitude: '',
              latitude: '',
              isEndtime: '0',
              endDate: '',
              endTime: '',
              remark: '',
              contactorId: '',
              depId: '',
              mailGroupName: '',
              documentList: [],
              participantsManList: [],
              copyManList: [],
              chargeMan: {
                  id: '',
                  name: ''
              },
              helpDepId: '',
              helpDepEntity: {name: ''},
          },
          newForm: {
              name: '',
              workModule: 1,
              workProperty: '',
              handleTarget: '',
              workPlace: '',
              longitude: '',
              latitude: '',
              isEndtime: '0',
              endDate: '',
              endTime: '',
              remark: '',
              contactorId: '',
              depId: '',
              mailGroupName: '',
              documentList: [],
              participantsManList: [],
              copyManList: [],
              chargeMan: {
                  id: '',
                  name: ''
              },
              helpDepId: '',
              helpDepEntity: {name: ''},
          },
          newContactorName: [],
          newCopyName: [],
          // 参与人的名字，用于显示，不传后台
          contactorName: [],
          // 参与人弹窗是否显示
          showcommonLink: false,
          // 抄送人的名字，用于显示，不传后台
          copyName: [],
          // 抄送人弹窗是否显示
          showcopyLink: false,
          // 表单状态更新内容
          statusUpdateForm: {
              workPlace: window.sessionStorage.getItem('platformName'),
              remark: '',
              responseType: '',
              documentList: [],
              workId: '',
              handleResponseId: 0,
              longitude: window.sessionStorage.getItem('longitude'),
              latitude: window.sessionStorage.getItem('latitude')
          },
          // 工单状态编辑是否可见
          statusUpdateShow: false,
          // 图片预览url
          filePreview: [], 
          // 上传图片的服务器主机地址
          hostUrl: window.SITE_CONFIG['cloudUrl'],
      }
  }
}
</script>

<style lang='less' scoped>
    /deep/.el-input--suffix{
        width:160 !important;
        padding-right: 0px !important;
    }
    /deep/ * {
        font-size: 14px;
    }
    /deep/ .el-row {
        padding: 0;
        margin: 0;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
    /deep/ .el-dialog {
        border-radius: 7px;
    }
    /deep/ .el-dialog__header {
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        background: #F1F4F6;
        padding: 15px 28px;
        padding-right: 14px;
    }
    /deep/ .el-dialog__title {
        font-size: 16px;
    }
    .title-cancel-button {
        color: #ADB6C2;
        float: right;
        display: inline-block;
        width: 28px;
        height: 28px;
        font-size: 20px;
        line-height: 28px;
        cursor: pointer;
        text-align: right;
        padding-right: 0;
        font-weight: bold;
    }
    /deep/ .el-form-item__label {
        font-size: 14px;
        line-height: 42px;
        padding-right: 28px;
    }
    /deep/ .el-input--medium{
      // width:200px;
    }
    /deep/ .el-date-editor .el-input__inner {
        width: 220px;
        
    }
    /deep/ .el-date-editor--time-select .el-input__inner {
        width: 220px;
        padding-left: 10px;
        margin-left:45px;
        margin-top:10px;
    }
    /deep/ .el-date-editor--time-select .el-input__prefix {
        display: none;
    }
  
    .qqtang{
      width:40px !important;
      height:30px;
      background:#fff;
      color:#fff;
      background-image:url(../../../../../assets/img/filetext4.svg);
      background-repeat:no-repeat;
      margin-top:20px;
    }
    .el-form-item {
        margin-bottom: 21px;
        margin-top: 0;
        padding-left:5px;
    }
    .left-side {
        margin-left: 10px;
        width: 602px;
        border-right:1px solid #F1F4F6;
        border-bottom:1px solid #F1F4F6;
        // .work_paper{
        //      .el-input__inner{
        //          width:400px;
        //      }
        // }
        .el-input__inner {
          width: 422px;
          height: 42px;
          line-height: 42px;
        }
    }
    .right-side{
      padding-left: 10px;
      //  width:702px;
      border-bottom:1px solid #F1F4F6;
      .right-item {
        display: flex;
        align-items: center;
        .right-input {
          margin-right: 20px;
        }
      }
      .add-button {
        margin-bottom: 10px;
        margin-left: 15px;
        padding: 9px 250px;
        width: 585px;
        height: 40px;
        background: #DAE7F8;
        color: #409eff;
      }
      .contact-item {
        background-color: #DAE7F8;
        width: 585px;
        height: 40px;
        margin-left: 15px;
        margin-bottom: 5px;
        padding-top: 6px;
        color:  #409eff;
      }
    }
    .biaoti{
        color:#333333;
        border-left: 3px solid #0091FF;
        padding-left:10px;
        margin: 10px 0;
        font-size:16px;
    }
    .el-dropdown{
        width:420px;
        border:1px solid rgba(215, 215, 215, 1);;
    }
    .el-icon-arrow-down, .el-icon--right{
      margin-left:253px;
    }
    .el-dropdown-link{
        margin:17px;
    }
    .biubiu{
      // padding-left: 15px;
      margin-top: 10px;
      width: 100px;
      // margin-left: -50px;
    }
    .left-side:first-child {
        margin-top: 28px;
    }
    /deep/ .left-side textarea {
        resize: none;
        width: 422px;
        height: 131px;
    }
    .location-icon {
        // position: absolute;
        // right: 34px;
        // top: 8px;
        cursor: pointer;
        width: 25px;
        height: 27px;
    }

/**
 * @author tanjinfeng
 * @date 2020-11-06
 * @desc 样式修正
 */
//  主体布局
.dialog-main {
    border-bottom: 1px solid #E9ECF1;
    display: flex;
    .left-side {
      border: none;
      border-right:  1px solid #E9ECF1;
      margin: 0 20px;
      padding-top: 20px;
      /deep/ .el-input__inner {
        width: 422px;
        height: 42px;
        line-height: 42px;
      }
      .address {
        width: 422px;
        /deep/ .el-input__inner {
          width: 100%;
        }
      }
    }
    .right-side {
        border: none;
        margin: 0;
    }
}
// 上传按钮
.upload-file {
    &__button {
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        &:hover {
            border-color: #0091FF;
        }
    }
    &__img {
        display: inline-block;
        position: relative;
        margin: 20px 20px 0 0;
        img {cursor: zoom-in;}
        & > div {
            color: white;
            width: 20px;
            height: 20px;
            line-height: 20px;
            position: absolute;
            right: -10px;
            top: -10px;
            background: rgba(0, 0, 0, 0.58);
            border-radius: 20px;
            cursor: pointer;
            text-align: center;
        }
    }
    &__file {
        color: #666666;
        margin: 10px 10px 0 0;
        padding: 0 5px;
        a:link {
            color: #666666;
        }
        &:hover {
            background: #F6F7FA;
            border-radius: 3px;
            a:link {color: #0091FF}
        }
        span {
            float: right;
            cursor: pointer;
            margin-top: 10px;
        }
    }
}
.contact__inner {
    border: 1px solid #D1DDF1;
    border-radius: 4px;
    display: inline-block;
    width: 90%;
    color: #666666;
    background: #F8F8F8;
    margin-left: 20px;
    padding: 0 20px;
}
</style>