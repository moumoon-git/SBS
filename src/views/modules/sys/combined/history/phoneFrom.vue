<template>
  <div class="FromWrap">
    <div class="options">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAYAAAC5tzfZAAAAsklEQVQoU2OcPn36GQYGhuOZmZm506ZNswWyq4AYJ2BkZDzBCNQ0GajiGlDT9KlTp6oA2SEENF1mxKcAlxx5mhoaGjiePXv2d9asWb+JtRXkpyfQgAgF+smNiYlpJwHNKxiBIdYBDJFzwIBYNXPmTH6gBht8mv78+XOPPD8R6w9kdeTZBAyIG////9+flZWVCWSHAdmVBGw/zAgMsQagotvZ2dlLgZoUgOx4fJr+/v17FgD5vkUOmM/d4gAAAABJRU5ErkJggg=="
        alt
      />
      <div class="optionsList_wrap">
        <div class="optionsList">
          <p @click="relevancyx">批量关联事件</p>
          <p @click="comment">批量备注</p>
          <p @click="addblacklist">加入黑名单</p>
          <!--            <p @click="blacklist">电话黑名单</p>-->
        </div>
      </div>
    </div>
    <!--      ref="multipleTable" tooltip-effect="dark"-->
    <el-table
      :data="tableData"
      style="width: 100%; overflow-y: auto"
      height="629"
      :row-class-name="indexMethod"
      @row-click="tabClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="100"
      />
      <el-table-column
        label="通话类型"
        width="130"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.direct === '已拨'">
            <img
              style="height: 16px; width: 16px"
              src="data:image/png;base64,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"
              alt
            />
            已拨
          </div>
          <div v-else-if="scope.row.direct === '未接'" style="color: #ff0000">
            <img
              style="height: 16px; width: 16px"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB6klEQVQ4T42TT0jTYRjHvz9NIZmgIOix444FBgYLAz0YeBh0yEHgwA5CQRuxQyRktA5BscU6DBZkIDRoHTrtYAcPDZUOGSEsQrwkBB0aEUhazc/j3slvc81eePc+/77f9/s872+eWFVp7LeU9qRT2NkT0i1sQo2L3CiRL+Q2LUPBJY+fy9gLBOcp2MDOcS52SYlmgj0pRN2zTin8h3ryFSP4hpHg1gUD7EqnO6R3f6Wz3dJ6C5JxSIrEC2AiRlCl+Iy/mNgKRQVueuQnQFmAm4vk1rEnyEc9ZL0nkIbtuetrhvMJpOeaFQC+aa0DfPxLCnJmPIL3YBuG4OIPaaCn1lIEP98sv5Xv7TB5BvYZNhvQGvK3OLP4D/6LwIpQkUGyqTiPPUnoJQQXICodR0KN9F3q65U+4jwFeNe1NetUfWpHckBgy73xEqArBF9BkmI2U/gT+B+sBh+RGsTfruMOCXwvkHagkiO5Si7GrtjrsIcgegvTLOCNBgI3jxsUJJ2S1wx1mvhDdoA5xcktk7uNH+a0j+roAhQlmiOZ5Ku8b/8Lm1N/TUW95RSGtdd68UmPAH7BjV+RG7Mn9lfS3jVyc/8kcEMz2XcovM5ehTDPLhMLGZiaSFuC+o0/GdxJbgQYBhAEXCYX5wN8sw9Dp48fbCixtwAAAABJRU5ErkJggg=="
              alt
            />
            未接
          </div>

          <div v-else>
            <img
              style="height: 16px; width: 16px"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACdUlEQVQ4T42TTUhUURTHz7l3psQ2SUUhE7UQomyRWWCEYB8bE4IgIUiKkMaZN2AzhlDq6J0RCqLmjU4zOk8wo8JFLaJNtGgRGK6SirQWQVBBYkpNgWZv7j3dN/qCSMu7ufed8z+/83HvQ9ArGIlWI/KMPpZIpVqzyfiwY1/JQiMiyrRwRCl1mhRNci9/KG1Zm011v1gOEGyOVvb1dj9z/GiExQ0ieNfXI+KOoSkc3ccZv59JiI3LAJykT0CpO5meeBZDETFjS6qwemPvFwO0oOtt3v5ZZ12//MaFGJHOCAFbW8iKUAQEraTgFIZaxDyzV/lSqbbPBbEQzMjR67yERg0dcQH+sNjNUa5Z+MYyRHYNpaxFo6VrVOapI9sbf1xooVkc4RysjCl8S7ZQSAATNsGJgaR4jgFdGkN2XPe83wnQ5ffoUsf6zK6bK7qFhSAxkSdIWklhGUb7ZizyvkwnRMmKAYFmsZNxGv2Ymyt9MHjlu34XbQz40bQpqv4HQVcQCHee5AxjUx8mtpWXl9NUDka0cz5tjh8GuCv1dd9GBoeUVE/ncqxhaEj8KIzTBdTX1/MNvh0JbarOmLCnpgbY9gqIIaggAJvWwmkF0ACKGhnTO+GxdFKM/QY4IL/f7/UUl/YD0q6MGat0bKHQxXWKe7Z66OurVCo179gC4Y6DDPmwtLHuD4ALYcWbopyxhm+zUHWrX0wtNYdgRHQgQdFfAPcxNX1RZzyMJSSphJqdvGRZlu2CFv4feqQUGUsDFpWN59u3rFaeq3ouNUA0SAw/oYL1enJ+RXChPykG/wlwM549F93rRXZAA3yo1IyNdG/A7B53/L8AmboBY5+D+twAAAAASUVORK5CYII="
              alt
            />
            <span>{{ scope.row.direct }}</span>
            <!-- <span v-if="scope.row.callType === 0">呼入</span>
            <span v-if="scope.row.callType === 1">呼出</span> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="通话号码" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.callType === 0">
            {{ scope.row.calling }}
          </span>
          <span v-else>
            {{ scope.row.callType === 1 ? scope.row.called : '无' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="联系人">
        <template slot-scope="scope">
          <span v-if="scope.row.callType !== 4">
            {{ scope.row.contactor ? scope.row.contactor : '未知' }}
          </span>
          <span v-else>
            {{ scope.row.operator ? scope.row.operator : '未知' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="工作单位">
        <template slot-scope="scope">
          {{ scope.row.workUnit ? scope.row.workUnit : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="职务">
        <template slot-scope="scope">
          {{ scope.row.position ? scope.row.position : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="值班员">
        <template slot-scope="scope">
          {{ scope.row.operator ? scope.row.operator : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="通话时间" width="210">
        <template slot-scope="scope">
          {{ scope.row.startTime ? scope.row.startTime : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="通话时长" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime === null"> -- </span>
          <span v-else>
            {{ scope.row.diffTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="关联事件">
        <template slot-scope="scope">
          {{ scope.row.eventTitle }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: space-around">
            <el-tooltip
              class="item"
              effect="dark"
              content="备注"
              placement="top"
            >
              <img
                style="cursor: pointer"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACYElEQVQ4T42US4gScRzHnVFRSbDAVWiDvQXbIUpog3aNDYTdQ7TQZSFwm4QBX4cu0WGhleiwsBdBHUlEhN3TSpcuQZeEIKJDh/KxbCx72CUQRAIZzef0/clMiLMzKvyZ8ff4/J7/YQwGAxMOh5/iuYFjxNH9dbtdPpvN1uDzRpIk8nlfrVZ3isVin0DbEHpZln3LMMxfPdJgMDDU6/WPTqdTgM+1Vqu1ZbfbBfidl8vll0wkEimLoricz+f/TMuK9AieAWih3W5vwGcUPBQKHQL4jTL7gQhLikIPCKd96K8gu8eFQqGr2ILBI8BdFSwajb6G4oFseJJKpTg5owPI51Dqw0wm01NACOBDVnHoHqlgHMdddjgcbjJG+SKafR4MBufR08+VSuU6NXoM5MV71mg0rpdKpbOpZcZiMbZWq+1Qazqdzq1cLvdbzvQengcmk2m11+st4P2JCsbz/B0Y+MgB2Rwh6q9+v/9iOBzuoZxP0N0GdB7ydzjeZDJ5itasocxNFQwlrZrN5hWCAXAG4CKcDuPx+PdAIHDVarWeQNXAvnlo38hOEzYxTVqdn8joA8A+RL+Jd68gCF/G7TRhfr//ksvlcpJxs9kUkckmelLCFI8tFksjkUh0JtdHE4ZR7yL6DXLAs47VCOjt3ixlMjJAmgbShdGe2Wy20Z5p/dxu9ylW5v8N0CqTQZkxlLemB8MgnqfT6a+KzazTnKVK1Wrcn/WrcREdu8mhGg8tLV2VJfqeIX1x0hiyIQxZRT75H/I5yF7B5hlNjfoUlvtkuQAmQadMd3QxcMbhdAsE6uE/wjGgf3KtraIAAAAASUVORK5CYII="
                alt
                @click.stop="remarks(scope)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="关联事件"
              placement="top"
            >
              <img
                style="cursor: pointer"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAB7UlEQVQ4T52TPUhCURTHe36l0BI0NAQVNBgkNDS2RGsQDVFDkGF+T0FbNERDQw216FOSjAiKhggbhAYdGhqCGpIailqChoagMNGn9rvhg4e9V5pw4dzz8Xvn/O9Raqn7+f3+cUmSNjn1oe97tVpVOIuxWOxEmyBROEpRAGeHCGAPVSqVERIv9UjkD5lMpgwwNf6KLUvBYPCdwjkAauAI+xzfKQWKFobPgm+MwmH8k7UOBXhHgPBXe2VZfhIBn8/XQWAWc0CvI2LXiqLsx+PxVxEPBAI9fPjxBygcDnfrilPnzOVyz9lsVtEF4RyAnmoExJhBdEwbdtQIRJtjCEIjp9lsTqFbF2eDry6LwlAoNEUXThVSKpX2E4nEvSGIwBHJNwiasFgsZ8DSwBZ4lFnsHhUE9BDB7wxBFBxTcM0rrrjd7k673S52Rga2pTe2Icjj8fRZrdZMoVBwAVkvl8sndLYXjUbbmwKpyV6vdxDAFaAJNFsF5BLjcT9npAc1789XYyy7w+F4FGPRXSyZTL5QtAZgmqV0RSKRj18XUtt+7QUzCHsgBK8VfrJrI3R40TCo9pdx0sEx9guAAh2Ke3Mdqd2xQ21oM4NWrfl8fpcx3/Q0KhWLxX6xXM1utcgXr2yz2W4lBFziPv8fiKZm+ws49m2jo0wl+wAAAABJRU5ErkJggg=="
                alt
                @click.stop="relevancy(scope)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="电话"
              placement="top"
            >
              <img
                style="cursor: pointer"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAACD0lEQVQ4T42UT0sbQRiH3WQPDfQjVCh4WW8WCqWgEKFFC34ABQsrzWaTVFBQ0IMHoUoLKtVLdkMCTWkFD4KKQntQWA9FRA+ChQTqoYeAglcPSxKSPm/YBf9QnYXh3Zl932d+85uZ1dp4kslkRzQadZvNZjfdnUgkMpLNZq/km8qjAXgB4CeAE03TVokTxIrjOK9VAJKjpVKpU4p+l0qlt57n1YEaQI/4NgroqwpIS6fTTN7sdV3XCwsAfwTcDaRHCULBJZB0Lpdbvwb5AsQA8lIJgpIfQCoosaSA/gfCdL1ef5PP53eVICgxSVzwfb+9WCz6QP4ALQKdVwG0jDVN81EsFjtH/izbugLkM5B+oM8EqgLSJAk1E7KERqPRKX3OSYmwGS7xIVALEo/HdcMwTnk9oXDIsqxXuq6LV9P0l5QgkmTb9nMUHFA4SmEOdTZLdFE3zs6t3AdqKQmfTCYzBmSRwn4K9wCPAV5mbEaMBtxH7hxwnbgcHsYbkGCLHeKwmEvhL8DveHcZ+0t7SlujieEm49/L5bJ1BxL4843ZBlA0jKKt4CrYnJ1Dzo5A2gLfNgB9ugMJlxYc/UmS5phtXu7VbV84DlOMJf4LkQJAgyhyAJ0RJ/Fg/5p/j1G6zbh/L0QKEonEE7Z7geRBYMdEuWMXMod4VK1Wex6EhDPjQRe/iPdA4oHBXq1WGykUCpV/9DMH7rWV1DoAAAAASUVORK5CYII="
                alt
                @click.stop="oneCallPhone(scope)"
              />
            </el-tooltip>
          </div> </template
        >>
      </el-table-column>
    </el-table>

    <div v-show="fsf" id="sd" class="szc">
      <div ref="remark">备注信息: {{ tableBottomRemark }}</div>
      <audiox ref="audiox"  />
    </div>

    <remarkPopUp ref="remarkPopUps" />
    <relevancePopUp ref="relevancePopUps" />
    <addBlackList ref="addBlackLists" />
  </div>
</template>

<script>
import audiox from './audio';
import remarkPopUp from '../popUpWindows/remarkPopUp';
import relevancePopUp from '../popUpWindows/relevancePopUp';
import addBlackList from '../popUpWindows/addBlackList';
import url from '../../../../../mock/modules/url';

export default {
  name: 'PhoneFrom',
  components: {
    audiox,
    remarkPopUp,
    relevancePopUp,
    addBlackList,
  },
  inject: ['combined'],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      // 插入元素的判断下标
      parentNode: '',
      fsf: false,
      tableBottomRemark: '',
      setInt: '',
    };
  },
  mounted() {},
  methods: {
    init(list) {
      this.tableData = list;
      // console.log(list)
      this.fsf = false;
      const FromWrap = document.querySelector('.FromWrap table tbody');
      for (let i = 0; i < FromWrap.children.length; i++) {
        FromWrap.children[i].className = 'el-table__row';
      }
      clearInterval(this.setInt);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val, this.multipleSelection)
    },
    Time(startTime, endTime) {
      const timeStart = new Date(startTime).getTime();
      const timeEnd = new Date(endTime).getTime();
      const data = (timeEnd - timeStart) / 1000;
      const shi =
        parseInt(data / 3600, 10) < 10
          ? `0${parseInt(data / 3600, 10)}`
          : parseInt(data / 3600, 10);
      const fen =
        parseInt(data / 60, 10) % 60 < 10
          ? `0${parseInt(data / 60, 10) % 60}`
          : parseInt(data / 60, 10) % 60;
      const miao = data % 60 < 10 ? `0${data % 60}` : data % 60;
      return `${shi}:${fen}:${miao}`;
    },
    remarks(scope) {
      console.log('备注', scope.row);
      this.$refs.remarkPopUps.init(scope.row);
    },
    relevancy(scope) {
      console.log('关联', scope.row);
      this.$refs.relevancePopUps.init([scope.row]);
    },
    oneCallPhone(scope) {
      let phoneNum = '';
      if (scope.row.call !== '') {
        phoneNum = scope.row.call;
      } else {
        phoneNum =
          scope.row.callType === 1 ? scope.row.called : scope.row.calling;
      }
      const callName =
        scope.row.callType !== 4 ? scope.row.contactor : scope.row.operator;
      this.combined.uds.makePhoneCall({
        phone: phoneNum,
        type: 1,
        name: callName !== '' ? callName : '未知',
        id: scope.row.id,
      });
      // if (scope.row.ti_call_type != 4) {
      //   // scope.row.phoneCalled
      //   console.log("一键呼出", scope.row);

      //   scope.row.mobile1 = scope.row.phoneCalled;
      //   this.callPhone(scope.row); //  一键呼出
      // }
    },
    exsd() {
      // this.multipleSelection
      if (this.multipleSelection.length > 0) {
        let ids = '';
        const that = this;
        this.multipleSelection.forEach((ele, ind) => {
          // eslint-disable-next-line eqeqeq
          if (ind != that.multipleSelection.length - 1) {
            ids += `${ele.id},`;
          } else {
            ids += ele.id;
          }
        });
        const request = {
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/phone/phoneinfo/output-excel',
          headers: {
            token: this.$cookie.get('token'),
          },
          params: {
            ids,
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '导出电话记录.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      } else {
        this.$message.error('请选择');
      }
    },
    // eslint-disable-next-line no-dupe-keys
    relevancyx() {
      // console.log('批量关联事件')
      if (this.multipleSelection.length != 0) {
        this.$refs.relevancePopUps.init(this.multipleSelection);
      } else {
        this.$message.error('请先选择');
      }
    },
    openblackList() {
      this.$refs.addBlackLists.openblackListx();
    },
    comment() {
      // console.log('批量备注', this.multipleSelection)
      if (this.multipleSelection.length != 0) {
        this.$refs.remarkPopUps.init(this.multipleSelection);
      } else {
        this.$message.error('请先选择');
      }
    },
    exportExit() {
      // this.exsd()
      // console.log('导出报表')
    },
    addblacklist() {
      if (this.multipleSelection.length != 0) {
        this.$refs.addBlackLists.init(this.multipleSelection);
      } else {
        this.$message.error('请先选择');
      }
      // console.log('加入黑名单')
    },
    blacklist() {
      // console.log('电话黑名单')
    },
    indexMethod({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
      // console.log(row.index, rowIndex)
    },
    tabClick(row, event, column) {
      this.$refs.audiox.getRow(row);
      // eslint-disable-next-line no-unused-vars
      const that = this;

      this.fsf = true;
      //   单元格点击事件 nextSibling
      this.parentEleClss(column.target);
      const parentEle = this.parentNode;
      // console.log(row)
      // console.log(parentEle.offsetWidth)
      // console.log("点击录音点击录音",row,row.recordFile)
      this.$refs.audiox.init(window.SITE_CONFIG.cloudUrl + row.recordFile);
      this.tableBottomRemark = row.remark || row.vc_remark || '无';
      //  拿到点击的元素
      const FromWrap = document.querySelector('.FromWrap table tbody');
      for (let i = 0; i < FromWrap.children.length; i++) {
        FromWrap.children[i].className = 'el-table__row';
      }
      const sd = document.getElementById('sd');
      clearInterval(this.setInt);
      this.setInt = setInterval(() => {
        sd.style.width = `${parentEle.offsetWidth}px`;
      }, 50);
      this.parentNode.className = 'el-table__row sd';
      FromWrap.insertBefore(sd, this.parentNode.nextSibling);
      // if (this.tr) {
      //   this.tr.remove()
      // }
    },
    parentEleClss(target) {
      if (target) {
        if (target.parentNode) {
          if (target.parentNode.className == 'el-table__row') {
            this.parentNode = target.parentNode;
          } else {
            const targets = target.parentNode;
            this.parentEleClss(targets);
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.FromWrap {
  height: 100%;
  position: relative;
}
.options {
  position: absolute;
  top: 16px;
  right: 40px;
  width: 12px;
  height: 20px;
  padding-bottom: 10px;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.options > img {
  width: 100%;
  height: 100%;
}
.optionsList_wrap {
  position: relative;
}
.options:hover .optionsList {
  display: block;
}
.optionsList {
  position: absolute;
  top: 15px;
  left: -52px;
  width: 95px;
  box-sizing: border-box;
  border: 1px solid #00a9f2;
  background: #fff;
  z-index: 5;
  display: none;
}
.optionsList:before {
  content: '';
  position: absolute;
  top: -6px;
  left: 40px;
  transform: rotate(45deg);
  width: 10px;
  height: 10px;
  border: 1px solid #00a9f2;
  border-right-color: transparent;
  border-bottom-color: transparent;
  background: #fff;
  z-index: 3;
}
.optionsList > p {
  text-align: center;
  font-size: 12px;
  height: 21px;
  line-height: 21px;
  margin: 0;
  padding: 0 7px;
  color: #696969;
}
.optionsList > p:active {
  background: #f1f1f1;
  color: #00a9f2;
}
.FromWrap /deep/ .cell {
  text-align: center;
  font-weight: bold;
  font-size: 13px;
  height: 41px;
}
.FromWrap /deep/ thead .el-checkbox__inner:before {
  content: '全选';
  position: absolute;
  left: 17px;
}
.FromWrap /deep/ .el-table td,
.FromWrap /deep/ .el-table th.is-leaf {
  border-bottom: 1px dashed #ebeef5;
}
.FromWrap /deep/ .el-table::before {
  height: 0;
}
.FromWrap /deep/ .tr {
  position: relative;
}
.FromWrap /deep/ .td {
  padding-bottom: 45px;
  display: block;
}
#sd {
  position: relative;
  background: #f6f6f6;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border: 1px solid #00a9f2;
  border-top: 0;
  padding: 11px 12px;
  z-index: 999;
}
.FromWrap /deep/ .sd > td {
  border-top: 1px solid #00a9f2;
}
.FromWrap /deep/ .sd > td:first-child {
  border-left: 1px solid #00a9f2;
}
.FromWrap /deep/ .sd > td:last-child {
  border-right: 1px solid #00a9f2;
}
.FromWrap /deep/ .el-table__body-wrapper {
  overflow-y: auto;
}
.optionsList:hover {
  display: block;
}
.szc{
  color:#666666;
}
</style>
