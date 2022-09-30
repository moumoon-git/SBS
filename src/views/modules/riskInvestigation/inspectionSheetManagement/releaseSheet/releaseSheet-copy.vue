<template>
  <!-- 发布/编辑工单 -->
  <div class="releseSheet">
    <div class="title">
      新增工单
    </div>
    <!-- 主体 -->
    <el-form
      ref="form"
      :model="releaseForm"
      label-width="100px"
    >
      <el-row
        class="dialog-main"
      >
        <!-- 左侧内容 -->
        <el-col class="left-side">
          <!-- 1. 工单名称 -->
          <el-form-item
            label="工单名称"
            class="el-form-item__css"
          >
            <el-input
              v-model="releaseForm.name"
              placeholder="请输入工单名称"
            />
          </el-form-item>
          <!-- 2. 工单属性 -->
          <!-- <el-form-item
            label="工单属性"
            class="el-form-item__css"
          >
            <el-select
              v-model="releaseForm.workProperty"
              placeholder="请选择工单属性"
            >
              <el-option
                v-for="item in workPropertyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <!-- 3. 处置对象 -->
          <!-- <el-form-item
            label="处置对象"
            class="el-form-item__css"
          >
            <el-input
              v-model="releaseForm.handleTarget"
              placeholder="请输入处置对象"
            />
          </el-form-item> -->

          <!-- todotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodo -->
          <!-- 4. 工单地点 -->
          <el-form-item
            label="工单地点"
            class="el-form-item__css"
          >
            <el-input
              v-model="releaseForm.workPlace"
              placeholder="请输入定点或手动定位"
            />
            <img
              v-if="releaseForm.workPlace"
              class="location-icon"
              src="../img/location-active.png"
              alt="定位icon"
              @click="mapShow"
            >
            <img
              v-else
              class="location-icon"
              src="../img/location-inactive.png"
              alt="定位icon"
              @click="mapShow"
            >
          </el-form-item>
          <!-- todotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodo -->

          <!-- 5. 完成时限 -->
          <el-form-item
            label="完成时限"
            class="el-input--suffix"
          >
            <el-input
              v-model="releaseForm.endTime"
              placeholder="请输入完成时限"
            />
          </el-form-item>
          <!-- 6. 情况说明 -->
          <el-form-item
            label="情况说明"
            class="el-form-item__css"
          >
            <el-input
              v-model="releaseForm.remark"
              type="textarea"
              placeholder="简单说明一下情况"
            />
          </el-form-item>

          <!-- todotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodo -->
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
          <!-- todotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodotodo -->
          <!-- 2020-11-06 tanjinfeng 上传按钮重做 -->
          <el-form-item label="附件">
            <div class="upload-file">
              <div
                class="upload-file__button"
                @click="$refs.uploadBtn.click()"
              >
                <img
                  height="20"
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTUgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+R3JvdXAgMTgy5aSH5Lu9PC90aXRsZT4KICAgIDxnIGlkPSLpo47pmanmjpLmn6UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNjUiPgogICAgICAgIDxnIGlkPSLnvJbovpHlt6XljZUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNzYuMDAwMDAwLCAtNDk1LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0id2luLWNvcHktNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjc1LjAwMDAwMCwgNTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i5YiG57uELTXlpIfku70tNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCA0MjguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IlVwbG9hZC9fUmVzb3VyY2VzL0J1dHRvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjcuMDAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTgy5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgOS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJ1cGxvYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuODc1MDAwLCAwLjg3NTAwMCkiIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTUuODAzNzEwOTQsMC4xMzgwODU5MzcgQzUuODk1MzEyNSwwLjA0NjQ4NDM3NSA2LjAxNjk5MjE5LDAgNi4xMzg2NzE4OCwwIEM2LjI2MDM1MTU2LDAgNi4zODA2NjQwNiwwLjA0NjQ4NDM3NSA2LjQ3MzYzMjgxLDAuMTM4MDg1OTM3IEw4LjYwMzcxMDk0LDIuMjY5NTMxMjUgQzguNzg4MjgxMjUsMi40NTQxMDE1NiA4Ljc4ODI4MTI1LDIuNzUzNTE1NjIgOC42MDM3MTA5NCwyLjkzODA4NTk0IEM4LjUxNDg0Mzc1LDMuMDI2OTUzMTIgOC4zOTU4OTg0NCwzLjA3NjE3MTg4IDguMjcwMTE3MTksMy4wNzYxNzE4OCBDOC4xNDQzMzU5NCwzLjA3NjE3MTg4IDguMDI1MzkwNjIsMy4wMjY5NTMxMiA3LjkzNjUyMzQ0LDIuOTM4MDg1OTQgTDYuNjExNzE4NzUsMS42MTMyODEyNSBMNi42MTE3MTg3NSw5LjUxMjg5MDYyIEM2LjYxMTcxODc1LDkuNzc0MDIzNDQgNi4zOTk4MDQ2OSw5Ljk4NTkzNzUgNi4xMzg2NzE4OCw5Ljk4NTkzNzUgQzUuODc3NTM5MDYsOS45ODU5Mzc1IDUuNjY1NjI1LDkuNzc0MDIzNDQgNS42NjU2MjUsOS41MTI4OTA2MiBMNS42NjU2MjUsMS42MTMyODEyNSBMNC4zNDA4MjAzMSwyLjkzODA4NTk0IEM0LjE1NjI1LDMuMTIyNjU2MjUgMy44NTY4MzU5NCwzLjEyMjY1NjI1IDMuNjczNjMyODEsMi45MzgwODU5NCBDMy40ODkwNjI1LDIuNzUzNTE1NjIgMy40ODkwNjI1LDIuNDU0MTAxNTYgMy42NzIyNjU2MywyLjI2OTUzMTI1IEw1LjgwMzcxMDk0LDAuMTM4MDg1OTM3IFogTTExLjc3Njk1MzEsNy44ODA0Njg3NSBDMTEuNTE1ODIwMyw3Ljg4MDQ2ODc1IDExLjMwMzkwNjMsOC4wOTIzODI4MSAxMS4zMDM5MDYzLDguMzUzNTE1NjMgTDExLjMwMzkwNjMsMTEuMDI1IEMxMS4zMDM5MDYzLDExLjE3OTQ5MjIgMTEuMTc4MTI1LDExLjMwNjY0MDYgMTEuMDIyMjY1NiwxMS4zMDY2NDA2IEwxLjIyNjM2NzE5LDExLjMwNjY0MDYgQzEuMDcxODc1LDExLjMwNjY0MDYgMC45NDQ3MjY1NjIsMTEuMTgwODU5NCAwLjk0NDcyNjU2MiwxMS4wMjUgTDAuOTQ0NzI2NTYyLDguMzUyMTQ4NDQgQzAuOTQ0NzI2NTYyLDguMDkxMDE1NjMgMC43MzI4MTI1LDcuODc5MTAxNTYgMC40NzE2Nzk2ODgsNy44NzkxMDE1NiBDMC4yMTA1NDY4NzUsNy44NzkxMDE1NiAwLDguMDkyMzgyODEgMCw4LjM1MjE0ODQ0IEwwLDExLjM5OTYwOTQgQzAsMTEuODY4NTU0NyAwLjM4MTQ0NTMxMywxMi4yNDg2MzI4IDAuODQ5MDIzNDM3LDEyLjI0ODYzMjggTDExLjQwMDk3NjYsMTIuMjQ4NjMyOCBDMTEuODY5OTIxOSwxMi4yNDg2MzI4IDEyLjI1LDExLjg2NzE4NzUgMTIuMjUsMTEuMzk5NjA5NCBMMTIuMjUsOC4zNTIxNDg0NCBDMTIuMjUsOC4wOTIzODI4MSAxMi4wMzgwODU5LDcuODgwNDY4NzUgMTEuNzc2OTUzMSw3Ljg4MDQ2ODc1IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS00OSIgeD0iMCIgeT0iMCIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
                  alt
                >
                <span>上传文件</span>
              </div>
              <input
                ref="uploadBtn"
                type="file"
                multiple
                style="position:absolute;opacity:0;z-index:-99;"
                @change="getFile($event)"
              >
              <viewer :images="releaseForm.documentList.map(e => e.url)">
                <template v-for="(img, imgIndex) in releaseForm.documentList">
                  <span
                    v-if="isImg(img.url)"
                    :key="`upload_img_${imgIndex}`"
                    class="upload-file__img"
                  >
                    <img
                      :src="`${hostUrl}/${img.url}`"
                      alt
                      height="124"
                      width="124"
                    >
                    <div
                      class="el-icon-close"
                      @click="deleteFile(img.url, releaseForm.documentList)"
                    />
                  </span>
                </template>
              </viewer>
              <template v-for="(file, fileIndex) in releaseForm.documentList">
                <div
                  v-if="!isImg(file.url)"
                  :key="`upload_file_${fileIndex}`"
                  class="upload-file__file"
                >
                  <img
                    height="18"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NjI2ODA2OTI4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2MTkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTg3Ny4xIDI0NS4yYy0xNC42LTM2LjItMzYtNjguNS02My43LTk2LjItMjcuNy0yNy43LTYwLTQ5LjEtOTYuMi02My43LTM0LjktMTQuMS03MS43LTIxLjItMTA5LjUtMjEuMlM1MzMgNzEuMiA0OTguMiA4NS4zYy0zNi4yIDE0LjYtNjguNSAzNi05Ni4yIDYzLjdMMTM5IDQxMmMtMTUuNiAxNS42LTE1LjYgNDAuOSAwIDU2LjZzNDAuOSAxNS42IDU2LjYgMGwyNjMtMjYzYzM5LjYtMzkuNiA5Mi42LTYxLjUgMTQ5LjEtNjEuNXMxMDkuNSAyMS44IDE0OS4xIDYxLjVjMzkuNiAzOS42IDYxLjUgOTIuNiA2MS41IDE0OS4xcy0yMS44IDEwOS41LTYxLjUgMTQ5LjFMNTkxLjYgNjY5bC0wLjUgMC41LTE3NC40IDE3NC40Yy00OC4yIDQ4LjItMTI2LjcgNDguMi0xNzUgMC00OC4yLTQ4LjItNDguMi0xMjYuNyAwLTE3NWwxNzQuNC0xNzQuNGMwLjUtMC41IDAuOS0wLjkgMS4zLTEuNGwxMjEuOS0xMjEuOWM3LjUtNy41IDE3LjUtMTEuNiAyOC4yLTExLjZzMjAuOCA0LjEgMjguMiAxMS42YzcuNSA3LjUgMTEuNiAxNy41IDExLjYgMjguMnMtNC4xIDIwLjgtMTEuNiAyOC4ybC0yMzMgMjMzLjJjLTE1LjYgMTUuNi0xNS42IDQwLjkgMCA1Ni42IDcuOCA3LjggMTggMTEuNyAyOC4zIDExLjdzMjAuNS0zLjkgMjguMy0xMS43bDIzMy4yLTIzMy4yYzIyLjYtMjIuNiAzNS01Mi43IDM1LTg0LjggMC0zMi4xLTEyLjQtNjIuMi0zNS04NC44LTIyLjYtMjIuNi01Mi43LTM1LTg0LjgtMzVzLTYyLjIgMTIuNC04NC44IDM1TDMxMS4xIDQ4Ni40Yy0wLjUgMC41LTAuOSAwLjktMS4zIDEuNEwxODUuMiA2MTIuM2MtMzguNCAzOC40LTU5LjUgODkuNS01OS41IDE0NC4xIDAgNTQuNSAyMS4xIDEwNS43IDU5LjUgMTQ0LjFTMjc0LjcgOTYwIDMyOS4zIDk2MGM1NC41IDAgMTA1LjctMjEuMSAxNDQuMS01OS41bDUwLTUwIDAuNS0wLjUgMjg5LjYtMjg5LjZjMjcuNy0yNy43IDQ5LjEtNjAgNjMuNy05Ni4yIDE0LjEtMzQuOSAyMS4yLTcxLjcgMjEuMi0xMDkuNS0wLjEtMzcuOC03LjItNzQuNy0yMS4zLTEwOS41eiIgcC1pZD0iMjYyMCIgZmlsbD0iIzkxOTE5MSI+PC9wYXRoPjwvc3ZnPg=="
                    alt
                  >
                  <a
                    :href="`${hostUrl}/${file.url}`"
                    :download="file.name"
                  >{{ file.documentName }}</a>
                  <span
                    class="el-icon-close"
                    @click="deleteFile(file.url, releaseForm.documentList)"
                  />
                </div>
              </template>
            </div>
          </el-form-item>
        </el-col>
        <!-- 右侧内容 -->
        <el-col
          class="right-side"
        >
          <!-- 1. 处置部门 -->
          <div class="biaoti">
            工单处置人员
          </div>

          <el-row>
            <el-form-item
              class="el-form-item__css"
              label="主责部门"
            >
              <div style="display:flex;flex-wrap:nowrap;">
                <el-input
                  v-model="releaseForm.mailGroupName"
                  placeholder="请选择主责部门"
                  disabled
                />
                <sv-button
                  @click="showDepList"
                >
                  选择
                </sv-button>
              </div>
            </el-form-item>
          </el-row>

          <!-- 2. 工单负责人 -->
          <el-row>
            <el-form-item
              label="工单主责人"
              class="el-form-item__css"
            >
              <div style="display:flex;flex-wrap:nowrap;">
                <el-input
                  v-model="releaseForm.chargeMan.name"
                  placeholder="请选择工单负责人"
                  disabled
                />
                <sv-button
                  @click="showContactorList"
                >
                  选择
                </sv-button>
              </div>
            </el-form-item>
          </el-row>
          <!-- 协作部门 -->
          <!-- @author tanjinfeng -->
          <!-- @date 2020-10-19 -->
          <!-- @desc 新增协作部门 -->
          <!-- <el-row>
            <el-form-item
              label="协办部门"
            >
              <el-input
                v-model="releaseForm.helpDepEntity.name"
                placeholder="请选择协作部门"
                disabled
              />
              <div
                @click="showHelpDepList"
              >
                选择
              </div>
            </el-form-item>
          </el-row> -->
          <!-- 3. 工单参与人 -->
          <el-row
            class="el-form-item__css"
          >
            工单参与人
          </el-row>
          <el-row>
            <div
              style="margin-bottom:10px;height:40px;background: #DAE7F8;color: #409eff;padding:10px 0px 0px 300px"
              @click="contactViewHandle"
            >
              添加参与人
            </div>
            <span
              v-for="(item,index) in contactorName"
              :key="index"
            >
              <div style="background-color:#DAE7F8;height:40px;margin-left:15px;margin-bottom:5px;padding-top:6px;color: #409eff">
                <span class="contact__inner">{{ item.name }}{{ item.position ? `(${item.position})` : '' }}</span>
                <img
                  src="../../../../../assets/img/del.svg"
                  style="position:absolute;right:90px;height:22px"
                  @click="deleteItem(item.id, contactorName, releaseForm.participantsManList)"
                >
              </div>
            </span>
          </el-row>
          <!-- 4. 抄送 -->
          <el-row
            class="el-form-item__css"
          >
            抄送
          </el-row>
          <el-row>
            <div
              style="margin-bottom:10px;height:40px;background: #DAE7F8;color: #409eff;padding:10px 0px 0px 300px"
              @click="copyViewHandle"
            >
              添加参与人
            </div>
            <span
              v-for="(item,index) in copyName"
              :key="index"
            >
              <div style="background-color:#DAE7F8;height:40px;margin-left:15px;margin-bottom:5px;padding-top:6px;color: #409eff">
                <span class="contact__inner">{{ item.name }}{{ item.position ? `(${item.position})` : '' }}</span>
                <img
                  src="../../../../../assets/img/del.svg"
                  style="position:absolute;right:90px;height:22px"
                  @click="deleteItem(item.id, copyName, releaseForm.copyManList)"
                >
              </div>
            </span>

            <!-- <el-input v-model="copyName" placeholder="请选择抄送人" disabled></el-input>
                        <el-button type="primary"   @click="copyViewHandle">添加抄送人</el-button> -->
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <!-- 底部按钮 -->
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="$router.back(-1)">
        返 回
      </el-button>
      <el-button
        type="primary"
        @click="releaseSubmit"
      >
        确 定
      </el-button>
    </div>
    <!-- 定位弹窗 -->
    <location
      ref="location"
      :work-place="releaseForm.workPlace"
      @updateLocation="updateLocation"
    />
    <!-- 处置部门弹窗 -->
    <getDepartmentList
      ref="getDepartmentList"
      :dep-id="releaseForm.depId"
      @checkDepId="checkDepId"
    />
    <!-- 协作部门弹窗 -->
    <getDepartmentList
      ref="getHelpDepartmentList"
      :dep-id="releaseForm.helpDepId"
      @checkDepId="checkHelpDepId"
    />
    <!-- 工单负责人弹窗 -->
    <getContactorList
      ref="getContactorList"
      :contactor-id="releaseForm.contactorId"
      :dep-id="releaseForm.depId"
      @checkContactorId="checkContactorId"
    />
    <!-- 参与人弹窗 -->
    <linkman-draggable
      v-show="showcommonLink"
      ref="commonLink"
      @OnchildByValue="handelLinkdata"
    />
    <!-- 抄送人弹窗 -->
    <linkman-draggable
      v-show="showcopyLink"
      ref="copyLink"
      @OnchildByValue="handelCopyLinkdata"
    />
  </div>
</template>

<script>
import location from '../location/location';
import getDepartmentList from '../getDepartmentList/getDepartmentList';
import getContactorList from '../getContactorList/getContactorList';
import LinkmanDraggable from '../LinkmanDraggable/LinkmanDraggable';

export default {
    props: {
        sheetData: {
          type: Object,
          defalut: {},
        },
      },
  name: 'ReleaseSheet',
  components: {
    location,
    getDepartmentList,
    getContactorList,
    LinkmanDraggable,
  },
//   props: [
//     // 工单属性列表
//     'workPropertyList',
//     // 刷新工单列表方法
//     'getWorkData',
//     // 判定弹窗内容是发布还是编辑
//     'editWhich',
//   ],
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
          name: '',
        },
        helpDepId: '',
        helpDepEntity: { name: '' },
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
          name: '',
        },
        helpDepId: '',
        helpDepEntity: { name: '' },
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
        latitude: window.sessionStorage.getItem('latitude'),
      },
      // 工单状态编辑是否可见
      statusUpdateShow: false,
      // 图片预览url
      filePreview: [],
      // 上传图片的服务器主机地址
      hostUrl: window.SITE_CONFIG.cloudUrl,
    };
  },
  watch: {
    editWhich(id) {
      if (id == -1) {
        this.dialogTitle = '发布工单';
        this.releaseForm = this.newForm;
        this.contactorName = this.newContactorName;
        this.copyName = this.newCopyName;
        this.statusUpdateShow = false;
      } else {
        this.dialogTitle = '编辑工单';
        this.getSingleData(id);
        this.statusUpdateShow = true;
        this.statusUpdateForm.workId = id;
      }
    },
  },
  mounted() {
    this.init();
    console.log('发布/编辑工单弹窗加载完成...', this.workPropertyList, this.getWorkData, this.editWhich);
  },
  methods: {
    // 弹窗关闭提示
    handleClose(done) {
      const that = this;
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
    /**
     * @description:初始化工单左边的数据
     */
    init() {
      this.releaseForm.name = this.sheetData.title;
      this.releaseForm.workPlace = this.sheetData.address;
      this.releaseForm.endTime = this.sheetData.deadline;
      this.releaseForm.remark = this.sheetData.detail;
    },
    // 获取单个工单详情
    getSingleData(id) {
      const url = `${window.SITE_CONFIG.baseUrl}/work/workSheet/info/${id}`;
      const that = this;
      this.$http
        .get(url)
        .then(
          (res) => {
            console.log('获取单个表单：', res.data.data);
            that.releaseForm = JSON.parse(JSON.stringify(res.data.data));
            if (that.releaseForm.chargeMan == null) {
              that.releaseForm.chargeMan = {
                id: '',
                name: '',
              };
            }
            if (that.releaseForm.helpDepEntity == null || that.releaseForm.helpDepEntity == undefined) {
              that.releaseForm.helpDepEntity = { name: '' };
            }
            that.releaseForm.participantsManList = [];
            that.releaseForm.copyManList = [];
            that.contactorName = [];
            that.copyName = [];
            for (const item of that.releaseForm.allContactorList) {
              if (item.type == 2) {
                that.contactorName.push({
                  name: item.contactorIdString,
                  id: item.contactorId,
                });
                that.releaseForm.participantsManList.push(item.contactorId);
              } else if (item.type == 3) {
                that.copyName.push({
                  name: item.contactorIdString,
                  id: item.contactorId,
                });
                that.releaseForm.copyManList.push(item.contactorId);
              }
            }
          },
          (res) => {
            console.log('获取单个表单失败！\n错误信息：\n', res);
          },
        );
    },
    // 工单发布/编辑提交确认
    releaseSubmit() {
      this.$http({
        url: this.$http.adornUrl(
          '/ottffemergency/ottffemergencyinfo/saveAndSendWorkSheet',
        ),
        method: 'post',
        data: this.$http.adornData({
          mailGroup: this.releaseForm.depId,
          contactorId: this.releaseForm.contactorId,
          participantsManList: this.releaseForm.participantsManList,
          copyManList: this.releaseForm.copyManList,
          id: this.sheetData.id,
          isOpen: '0',
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$emit('changeToView');
        } else {
          this.$message.error(data.msg);
        }
      });
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
      this.releaseForm.helpDepEntity = { name: '' };
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
      this.releaseForm.helpDepEntity.name = name;
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
      this.$nextTick(() => {
        this.$refs.commonLink.handleAddContacts(
          '/mail/mailgroup/list',
          '请选择',
        );
      });
    },
    // 选择的参与人赋值
    handelLinkdata({ linkman }) {
      const that = this;
      for (const item of linkman) {
        that.releaseForm.participantsManList.push(item.id);
        that.contactorName.push({
          name: item.name,
          id: item.id,
        });
      }
    },
    // 点击显示选择抄送人视图
    copyViewHandle() {
      this.showcopyLink = true;
      this.$nextTick(() => {
        this.$refs.copyLink.handleAddContacts(
          '/mail/mailgroup/list',
          '请选择',
        );
      });
    },
    // 选择的抄送人赋值
    handelCopyLinkdata({ linkman }) {
      const that = this;
      for (const item of linkman) {
        console.log('uuu', that.copyName);
        that.releaseForm.copyManList.push(item.id);
        that.copyName.push({
          name: item.name,
          id: item.id,
        });
      }
    },
    // 删除参与人、抄送人
    deleteItem(id, display, list) {
      for (const index in display) {
        if (display[index].id == id) {
          display.splice(index, 1);
        }
      }
      for (const index in list) {
        if (list[index] == id) {
          list.splice(index, 1);
        }
      }
      console.log('uuu', this.contactorName, this.releaseForm.participantsManList);
    },

    // 工单状态变更提交
    statusUpdate() {
      const that = this;
      const url = `${window.SITE_CONFIG.baseUrl}/work/workSheet/updateStatus`;
      console.log('提交的状态修改表单：', this.statusUpdateForm);
      this.$confirm('确认提交？')
        .then((_) => {
          that.$http
            .post(url, that.statusUpdateForm, { emulateJSON: true })
            .then(
              (res) => {
                console.log('状态修改成功', res);
                that.getWorkData();
                that.getSingleData(that.editWhich);
                // 刷新查看页面
                that.$parent.$refs.viewSheet.getSingleData(that.editWhich);
                // that.statusUpdateInit();
              },
              (res) => {
                console.log('状态更新失败', res);
              },
            );
          done();
        })
        .catch((_) => {});
    },
    // 初始化状态变更栏
    statusUpdateInit() {
      this.statusUpdateForm.workPlace = window.sessionStorage.getItem('platformName');
      this.statusUpdateForm.remark = '';
      this.statusUpdateForm.responseType = '';
      this.statusUpdateForm.documentList = [];
      this.statusUpdateForm.workId = '';
      this.statusUpdateForm.handleResponseId = 0;
      this.statusUpdateForm.longitude = sessionStorage.getItem('longitude');
      this.statusUpdateForm.latitude = sessionStorage.getItem('latitude');
    },
    // 文件上传，返回文件所在服务器url
    getFile(event) {
      // 上传接口
      const url = `${window.SITE_CONFIG.baseUrl}/upload/emergencyHandleProcessFile`;
      const that = this;
      // 上传的文件列表
      const fileList = event.target.files;
      for (const file of fileList) {
        // 每次上传1个文件，返回一条url
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', that.$cookie.get('token'));
        that.$http
          .post(url, formData, { emulateJSON: true })
          .then(
            (res) => {
              console.log('upload successfully and get response: ', res.data.data);
              that.releaseForm.documentList.push({
                documentName: res.data.data.name,
                url: res.data.data.url,
              });
              // 清空input值，防止重复上传时不触发change事件
              event.srcElement.value = '';
            },
            (res) => {
              console.log('upload fail: ', res);
            },
          );
      }
      // console.log("preview", that.filePreview);
    },
    // 状态变更文件上传，返回文件所在服务器url
    getFileStatus(event) {
      // 上传接口
      const url = `${window.SITE_CONFIG.baseUrl}/upload/emergencyHandleProcessFile`;
      const that = this;
      // 上传的文件列表
      const fileList = event.target.files;
      for (const file of fileList) {
        // 每次上传1个文件，返回一条url
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', that.$cookie.get('token'));
        that.$http
          .post(url, formData, { emulateJSON: true })
          .then(
            (res) => {
              console.log('upload successfully and get response: ', res.data.data);
              that.statusUpdateForm.documentList.push({
                name: res.data.data.name,
                url: res.data.data.url,
              });
              // 清空input值，防止重复上传时不触发change事件
              event.srcElement.value = '';
            },
            (res) => {
              console.log('upload fail: ', res);
            },
          );
      }
      // console.log("preview", that.filePreview);
    },
    // 判断是图片还是文档
    isImg(url) {
      const res = url.slice(-4);
      if (res == '.png' || res == '.jpg' || res == 'jpeg' || res == '.gif' || res == '.bmp' || res == '.svg') {
        return true;
      }
      return false;
    },
    // 删除文件
    deleteFile(url, list) {
      const that = this;
      for (const index in list) {
        if (list[index].url == url) {
          list.splice(index, 1);
        }
      }
      console.log('删tmd：', list);
    },
  },
};
</script>

<style lang='less' scoped>

    /deep/ .el-form-item__label {
        font-size: 17px;
        line-height: 42px;
        padding-right: 28px;
    }
    /deep/.el-input--suffix{
        width:160 !important;
        padding-right: 0px !important;
    }
/**
 * @author tanjinfeng
 * @date 2020-11-06
 * @desc 样式修正
 */
//  主体布局
.releseSheet{
    background: #f4f4f4;
    height:600px;
    .title {
      position:absolute;
      top:15%;
      font-size:20px;
    }
.dialog-main {
    border-bottom: 1px solid #999999;
    display: flex;
    width: 1400px;
    .left-side {
        border: none;
        border-right:  1px solid #999999;
        margin: 0;
        padding-top: 20px;
        .el-form-item__css{
            margin:20px 0px;
        }
    }
    .right-side {
        border: none;
        margin: 0;
        .el-form-item__css{
        padding:5px
        }
    }
}
.dialog-footer{
  position: absolute;
    top: 100%;
}}
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
