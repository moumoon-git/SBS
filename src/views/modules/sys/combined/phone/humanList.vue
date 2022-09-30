<template>
  <div>
    <header class="header">
      <div class="header_left">
        <span style="margin-right:12px;color:#333;font-weight:bold;letter-spacing: 1px;">{{ humanTitle }}</span><span style="color:#0091FF;">{{ pageListNum }}</span>人
      </div>
      <!-- 搜索框 -->
      <sv-input-search
        v-model="search"
        width="300px"
        placeholder="请输入联系人姓名关键字"
        @change="handleSearch"
      />
      <div class="header_right">
        <div
          class="disFrom"
          :class="FromFlag?'disFromActive':''"
          @click="tabDisFrom"
        />
        <div
          class="disCard"
          :class="!FromFlag?'disCardActive':''"
          @click="tabDisCard"
        />
      </div>
    </header>

    <list
      ref="list"
      class="listx"
    />

    <div class="footer">
      <!-- <div class="BtnsWrap"> -->
      <!-- <button class="homePage" @click="sikpHomePage" >首页</button> -->
      <el-pagination
        :current-page.sync="page"
        :page-size="limit"
        layout="prev, pager, next, sizes"
        :total="pageListNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- <button class="trailerPage" @click="sikpTrailerPage" >尾页</button> -->
      <!-- <div class="allPage">共{{pageListNum}}条记录 第{{page}}页/共{{Math.ceil(pageListNum/limit)}}页</div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus.js';
import url from '@/mock/modules/url';
import list from './list';

export default {
  name: 'HumanList',
  components: {
    list,
  },
  data() {
    return {
      FromFlag: true,
      pageListAry: [],
      pageListNum: 12,
      allPage: '',
      groupId: [],
      search: '',
      limit: 20,
      page: 1,
      startTime: '',
      humanTitle: '全部联系人',
      endTime: '',
      ajaxType: 1, // 1是全部联系人 2是选择了组织目录 3是常用联系人 4是最近联系人 5是搜索后的
      flag: true,
      platformId: '0',
    };
  },
  mounted() {
    this.allPage = Math.ceil(this.pageListNum / this.limit);
    Bus.$off('linkman');
    Bus.$on('linkman', (data) => {
      this.limit = 20;
      this.page = 1;
      // console.log(data)  // 点击联系人目录拿到的对象
      this.humanTitle = data.name;
      this.platformId = data.platformId;
      // eslint-disable-next-line eqeqeq
      if (data.name == '常用联系人') {
        this.commonContactorList();
        // eslint-disable-next-line eqeqeq
      } else if (data.name == '最近联系人') {
        this.latelyList();
      } else if (data.platformName) {
        this.platformId = data.id;
        this.groupId = [];
        this.limit = 20;
        this.page = 1;
        if (data.id === 0) {
          this.flag = true;
        } else {
          this.flag = false;
        }
        this.searchHttpHuman();
      } else {
        function findChilden(data, list) {
          if (data.id) {
            list.push(data.id);
          }
          const { children } = data;
          if (children != null) {
            children.forEach((item, index) => {
              findChilden(item, list);
            });
          }
        }
        // console.log('树形结点点击事件', obj.id)
        this.groupId = [];
        this.platformId = data.platformId;
        findChilden(data, this.groupId = []);
        // this.search = ''
        this.limit = 20;
        this.page = 1;
        this.flag = false;
        this.searchHttpHuman();
      }
      this.$refs.list.saveSpaces(data);
    });
    Bus.$off('refresh');
    Bus.$on('refresh', (data) => {
      // console.log(data)  // 点击联系人目录拿到的对象
      this.humanTitle = data.name;
      // eslint-disable-next-line eqeqeq
      if (data.name == '常用联系人') {
        this.commonContactorList();
        // eslint-disable-next-line eqeqeq
      } else if (data.name == '最近联系人') {
        this.latelyList();
      } else {
        function findChilden(data, list) {
          if (data.id) {
            list.push(data.id);
          }
          const { children } = data;
          if (children != null) {
            children.forEach((item, index) => {
              findChilden(item, list);
            });
          }
        }

        // console.log('树形结点点击事件', obj.id)

        this.groupId = [];

        findChilden(data, this.groupId = []);
        // this.search = ''
        // this.limit = 20
        // this.page = 1
        this.searchHttpHuman();
      }
      this.$refs.list.saveSpaces(data);
    });
    Bus.$off('searchStr');
    Bus.$on('searchStr', (data) => {
      // console.log(data)  // 搜索字段
      // this.groupId = []
      this.search = data;
      this.limit = 20;
      this.page = 1;
      if (this.humanTitle === '常用联系人') {
        this.commonContactorList();
      } else if (this.humanTitle === '最近联系人') {
        this.latelyList();
      } else {
        this.searchHttpHuman();
      }
      this.$refs.list.saveSpaces(this.groupId);
    });
    this.searchHttpHuman();
  },
  methods: {
    sikpHomePage() {
      this.page = 1;
      this.ifAjaxType();
    },
    sikpTrailerPage() {
      this.page = Math.ceil(this.pageListNum / this.limit);
      this.ifAjaxType();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.limit = val;
      this.allPage = Math.ceil(this.pageListNum / this.limit);
      this.ifAjaxType();
      // console.log(this.limit)
    },
    handleCurrentChange(val) {
      // var allLI = document.querySelectorAll('.appendChild')
      // for (let i = 0; i < allLI.length; i++) {
      //   allLI[i].style.display = 'none'
      // }
      // console.log(`当前页: ${val}`)
      this.page = val;
      this.ifAjaxType();
    },
    ifAjaxType() {
      // eslint-disable-next-line eqeqeq
      if (this.ajaxType == 1) {
        //  全部联系人
        this.searchHttpHuman();
        // eslint-disable-next-line eqeqeq
      } else if (this.ajaxType == 2) {
        //  选择了组织目录
        this.searchHttpHuman();
        // eslint-disable-next-line eqeqeq
      } else if (this.ajaxType == 3) {
        // 常用联系人
        this.commonContactorList();
        // eslint-disable-next-line eqeqeq
      } else if (this.ajaxType == 4) {
        // 最近联系人
        this.latelyList();
        // eslint-disable-next-line eqeqeq
      } else if (this.ajaxType == 5) {
        // 搜索后
        this.searchHttpHuman();
      }
    },
    searchHttpHuman() {
      this.ajaxType = 1;
      const that = this;
      // 获取联系人
      this.$http({
        url: this.$http.adornUrl(url.liknHuman.url),
        method: url.liknHuman.method,
        data: this.$http.adornParams({
          flag: this.flag,
          groupId: that.groupId ? that.groupId : [],
          search: that.search,
          limit: that.limit,
          page: that.page,
          platformId: String(this.platformId),
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$refs.list.init(data.data.list);
          this.pageListNum = data.data.totalCount;
          this.ListAry(this.pageListNum);
          // if (this.flag) {
          //   // el-pager
          //   var ulWrap = document.querySelector('.el-pager')
          //   console.log(ulWrap)
          //   if (data.data.totalCount > this.limit) {
          //     let num = data.data.totalCount / this.limit // 页数
          //
          //     for (var i = 1; i <= num; i++) {
          //       let li = document.createElement('li')
          //       // eslint-disable-next-line eqeqeq
          //       if (i == 1) {
          //         li.className = 'number active appendChild'
          //       } else {
          //         li.className = 'number  appendChild'
          //       }
          //       li.innerText = i
          //       ulWrap.appendChild(li)
          //     }
          //     // eslint-disable-next-line eqeqeq
          //     if (data.data.totalCount % this.limit != 0) {
          //       let li = document.createElement('li')
          //       li.className = 'number appendChild'
          //       li.innerText = Math.ceil(data.data.totalCount / this.limit)
          //       ulWrap.appendChild(li)
          //     }
          //   } else {
          //     let li = document.createElement('li')
          //     li.className = 'number active appendChild'
          //     li.innerText = 1
          //     ulWrap.appendChild(li)
          //   }
          //   this.flag = false
          // }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    commonContactorList() {
      // 常用联系人
      this.$http({
        url: this.$http.adornUrl(url.contactorList.url),
        method: url.contactorList.method,
        data: this.$http.adornParams({
          page: this.page,
          limit: this.limit,
          search: this.search,
        }),
      }).then(({ data }) => {
        console.log('data', data);
        if (data.code === 0) {
          this.$refs.list.init(data.data.list);
          this.pageListNum = data.data.totalCount;
          this.ajaxType = 3;
          this.ListAry(this.pageListNum);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    latelyList() {
      // 最近联系人
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/contactor/recentContactorPage`,
        method: 'post',
        data: this.$http.adornParams({
          page: this.page,
          limit: this.limit,
          search: this.search,
          status: 0,
          startTime: this.startTime,
          endTime: this.endTime,
        }),
      }).then((data) => {
        if (data.data.errorcode === 0) {
          // 去重
          this.$refs.list.init(data.data.data.data);
          this.pageListNum = data.data.data.totalSize;
          this.ajaxType = 4;
          this.ListAry(this.pageListNum);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    ListAry(x) {
      // 计算每页条数
      if (x >= this.limit) {
        for (let i = this.limit; i <= x; i += this.limit) {
          if (Math.ceil(x / i) >= 1) {
            this.pageListAry.push(i);
          }
        }
        const arr = new Set(this.pageListAry);
        // console.log(Array.from(arr))
        this.pageListAry = Array.from(arr);
      } else {
        this.pageListAry = [this.limit];
      }
    },
    tabDisFrom() {
      // 切换表格
      this.FromFlag = true;
      this.$refs.list.FromFlag(true);
    },
    tabDisCard() {
      // 切换卡片
      this.FromFlag = false;
      this.$refs.list.FromFlag(false);
    },
    /**
     * 执行搜索
     *
     * @param keyword 搜索关键词
     */
    handleSearch(keyword) {
      Bus.$emit('searchStr', keyword);
    },
  },
};
</script>

<style scoped>
.header{
  color: #333333;
  padding-left: 20px;
  height: 65px;
  display: flex;
  font-size: 15px;
  background: #fff;
  align-items: center;
  font-weight: 400;
  border-bottom: 1px solid #F2F2F2;
}
.footer{
  /* display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px 0 25px;
  margin-top: 5px;
  position: relative; */
}
.footer>div{
  /* display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%; */
}
.allPage{
  color:  #999999;
  font-size: 14px;
  margin-bottom: 5px;
  margin-left: 10px;
}
.footer /deep/ .el-pagination__jump{
  /* margin-left: 70px; */
}
.footer /deep/ .el-pagination{
  /* padding-right: 20px ;
  position: relative; */
}
.footer /deep/ .el-pagination__sizes{
  /* position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto; */
}
/* .footer /deep/ .el-pager li.active{
  background:  #0091FF;
  color: #fff !important;
}
.footer /deep/ .el-pager li:hover{
  color: #0091FF;
}
.footer /deep/ .el-pager li{
  border: 1px solid #DDDEE1;
  margin-right: 10px;
  min-width: 30px;
  height: 30px;
  border-radius:2px;
}
.footer /deep/ .el-pager li:last-child{
  margin: 0;
}
.footer /deep/ .btn-prev,.footer /deep/ .btn-next{
  border: 1px solid #DDDEE1;
  padding: 0;
  border-radius:2px;
  margin: 0 5px 0 10px;
}
.footer /deep/ .btn-prev{
  border: 1px solid #DDDEE1;
  padding: 0;
  margin-right: 10px;
}
.footer /deep/ .el-pagination button:hover {
  color: #0091FF;
} */
.header_left{
  width: 90%;
  position: relative;
  font-size:14px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
}
/* .header_left:after{
  content: '';
  height: 2px;
  width: 100%;
  background: #f1f1f1;
  position: absolute;
  bottom: -23px;
  left: 0;
} */
.header_right{

}
.listx{
    height: 640px;
    margin-top: 20px;
    width: 100%;
}
.BtnsWrap{
  position: relative;
}
.BtnsWrap>button{
  outline: none;
  width:43px;
  height:28px;
  border:1px solid rgba(198,198,198,1);
  border-radius:3px;
  background: #fff;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(130, 130, 130, 1);
  /*position: absolute;*/
  /*top: 15px;*/
  /*bottom: 0;*/
  /*margin: auto;*/
  cursor: pointer;
}
.BtnsWrap>.homePage{
  position: relative;
  top: -2px;
  left: -7px;
}
.BtnsWrap>.trailerPage{
  z-index: 99999;
  position: relative;
  top: -2px;
  left: -170px;
}
/* .footer /deep/ .el-pagination button{
  min-width: 32.5px;
} */
.header_right{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
}
.disFrom{
  margin-right: 15px;
  width: 24px;
  height: 22px;
  cursor: pointer;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAAB+ElEQVRYCe1YO0sDQRD+YhIfIIigkkCwEmy0iSKCNloIYm8jsVLBfyCCFloookXsbES0EAQL2xSWgghRLCSNgg+S+ECMUfABnjMmR27vznuEXEhx02R2djPfl2/mdvcCuGasgEeY3pOqkcYCJIxTPCjMlX6QggfbCGAeo54v/fTr0vLwgSTdZiXHjTEYC4SpT4ajUSlZDjLyr2UsxlQSqlIOyA+G6lURB4d5LKE11IQchLeW2iVkppOrkJlCPrMFyvn4I7CTAFb7AS9tqYsnQPxBuULr+6kGM91AuFk7pxexReg4DWxeAHM9QGMNsEX+VUYvrRgbCDlEaLoTmOwAfPkDJxEBXj5FcPXIRwoxeatmSyFOKpNhn8vRXMde6cwWoe8f4DoLtDXkCLB/aVIyJt0byJG3QtsWobVTYPYIuJ8AmkiZ8C7w/GEOs9RHjd1lvo5X2CI01g60EBG5TBuDwPmTMZDfC/D3irOofA6X75NOe0lJlipcWWarZLEbujKdAfsjQC2VIhKjjZE2SyPjpl6hHhpqNVpVmLNFKEMXzeQ7wE8bE2I/+VZIpudxD73+c0HVWy/G3B4S9eBRxTW1S0hbJDHiKiTqoR2pFUrdmewr2hTFR/JYKWUGkRC9a08dAuUgxRiM9fd+r2BU4X82KJi6rquARQV+AWmiKIU4nDCaAAAAAElFTkSuQmCC');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.disFromActive{
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAAB3ElEQVRYCe1YO0sDQRD+TmIUfETER5JCQRuxEA2I4A/IHxAEC0VsLFMoRgstFMTW3kqxsbex0EZBRNMLViJEjCBWPpJ4ziRu4h5x9xZyIchNs7M7MzvffjPZYwP4ombAksxHdhCP2ISNOVqPSLbqT9KwsI8wNjBtfYrtA0IpjEUwSWnNu0mEDp4kAlhWRZoGoRTGIjPSkucTR04ZkPdlqnQ+qTWcgCoF1HTNB6Sj22dIx5B8D2m8Y93A7BCwfA7kbWB9HIj1qIOyX8DONZDKqP2E1QjQRBhYGAa2roCXD2Ce9IGQ2Orv8ezBPSD507Fr07nVEqCI3I9XI3VgR5PaP0cMMXilJKwSDiOGeFMBhnUuR+aNteqJESBmpL8NuHstAmB9UFMyBn1J3yse3YgRoKUxYHsS6N0DnomZ1AzQ2axPs3ZBjX2j92MPI0CHt8ATARFlWjwFRrrUibJ5gOPcSqmZCgEumtrtxkZ+v5q67m5qo5LF+4DEKDB1DLxTKQ7idDHSZakSbuYV6qGTe5VX2WYEKBQEoi0A/9oYEOvR1vJmlTTuoXaKcyt+D+mYqrum9gH5JdMxoLM7eyitC/DALuWUAfFbu9biyCnf1Pzw57d2rf9sqDUJfr5/zcA30PZopqVQJQ4AAAAASUVORK5CYII=");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.disFrom:hover{
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAAB3ElEQVRYCe1YO0sDQRD+TmIUfETER5JCQRuxEA2I4A/IHxAEC0VsLFMoRgstFMTW3kqxsbex0EZBRNMLViJEjCBWPpJ4ziRu4h5x9xZyIchNs7M7MzvffjPZYwP4ombAksxHdhCP2ISNOVqPSLbqT9KwsI8wNjBtfYrtA0IpjEUwSWnNu0mEDp4kAlhWRZoGoRTGIjPSkucTR04ZkPdlqnQ+qTWcgCoF1HTNB6Sj22dIx5B8D2m8Y93A7BCwfA7kbWB9HIj1qIOyX8DONZDKqP2E1QjQRBhYGAa2roCXD2Ce9IGQ2Orv8ezBPSD507Fr07nVEqCI3I9XI3VgR5PaP0cMMXilJKwSDiOGeFMBhnUuR+aNteqJESBmpL8NuHstAmB9UFMyBn1J3yse3YgRoKUxYHsS6N0DnomZ1AzQ2axPs3ZBjX2j92MPI0CHt8ATARFlWjwFRrrUibJ5gOPcSqmZCgEumtrtxkZ+v5q67m5qo5LF+4DEKDB1DLxTKQ7idDHSZakSbuYV6qGTe5VX2WYEKBQEoi0A/9oYEOvR1vJmlTTuoXaKcyt+D+mYqrum9gH5JdMxoLM7eyitC/DALuWUAfFbu9biyCnf1Pzw57d2rf9sqDUJfr5/zcA30PZopqVQJQ4AAAAASUVORK5CYII=");
  background-size: 100% 100%;
}
.disCard{
  width: 24px;
  height: 22px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAACIUlEQVRYCe1YOUsDQRT+4q2JBwoSDzCNUUS0s7ERC0EFS8EDwUb0B1gIYmGljaCNvYKFlYKNjSCKjYWVRAsLz2ijhQeYoOs8N8scLtkdNSGBHUjmHbPv+/btm2MX8FryDPgk96ZRgHvMw8AYs9dIvv9XovBhDUHMYdAXsw+/Yiz0bhvG9bOR8kYYhAWGaU+GrMvGXTrIWHdLWIQpEsoRFSbX1AcUSwrVBJZUGiqhFMK7C+0RcspTxmUoz4mx6t+9As6fuNWfDwyFgRIW6fYV2LoAPgzu76oH2qq47iRpEXp8B/q2gU8BkADin8BkKzBzBKxHZMgWRuZ0RLYl07Qe2Wv8JxkK/pxYZ61eBLSziX5V1iKkXpwKPbsJVRUBlewnNh/bnhsrTEs40Yt+yyfakslaRU0z6XIceHjjIWmWBUtMfbETmGpjs4wVudUayizJXa9FiEIGGAF/OQ8un1+AUCnY6YU31c899pIWoRi78/YN4OyRB6MM7QwAXXXA0gkwfSjPxNFmthT08PFOklZR06MSyVBwWgqOH0yYgzuZDFn3b02f238tQm6D/mVcdhMqzLW/d8tu9eIoO5voV2Wtoq4uBla7gYhQ1DTrhpvMsLMdQK1f3lz7Qyqkjr5snXbT17MztbhKILtrSCfZvx3rZcgpc2qGojcvTpf8nz+BFRUjyoTYu/bEHpAOUoRBWN/v9wIjeTPOuI8NAlNP9DLgMgNfxMy/djYCf3UAAAAASUVORK5CYII=");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}
.disCardActive{
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAACFElEQVRYCe1YOyxDURj+bmklqoMuVBORGGhMBosQo0XCZJCwmySWmgwiMZhsZvFIjBIGg3S2ERFqqQRtJBWv1qtyndPrOg839/aUe6PSk7Tnf53//853z3/qAqrDngFNcG/qAWQwBx0TxB4RfL+vpKFhBc2Yxaj2aqavNYXibICJCzb3lAjZeJwQQMeMWcZnCsXZYEYwua5INUVA7j8mq/0JR0MGZLXAU1sVkBPdf44hse2d4BP/YCvQ0cgCc2/ARhLIF4BoEBhpB2q42y1xARxmWbyTpAQoXAfsDAM+riAt4Cc8Lx8BC73AeEwseUzAdK2JNjtN6ZEF/d/B0OShgFHCnPmCVjbeL8tKgOTFbuiVDSj7DNyQDz90HTi7NSzJz5n3mz7eZieLx3OJprcfDeQcNdWzGNplmTzT20Kkyzjez++BglPWKe0Lh1KX0bKPBEDujgGQa6UeQP6qYEP2M4+1pAQoQHZ+MAZ0hlkyytDQFpC4BKa7gcU+sRNXT8hVsMvinSSOXKdQ41HxYOgKehX0NBlr+1tEMNQ6EDV8pX4rASo16U/iKhvQy7v13k27OfNRVjbeL8tKh/r6CZjcA2LcoaZdt35qpJ3fB65y4o/rdkouaa/zHQqUcA/ZpyvTy91DlX2Gyty/0rIqQ050yQylnRa44BdqioDou7bXQ6op3kP0xZ++a3v9zwavSajW+9cMfABoomlrOGj4GAAAAABJRU5ErkJggg==");
  background-size: 100% 100%;
}
.disCard:hover{
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAACFElEQVRYCe1YOyxDURj+bmklqoMuVBORGGhMBosQo0XCZJCwmySWmgwiMZhsZvFIjBIGg3S2ERFqqQRtJBWv1qtyndPrOg839/aUe6PSk7Tnf53//853z3/qAqrDngFNcG/qAWQwBx0TxB4RfL+vpKFhBc2Yxaj2aqavNYXibICJCzb3lAjZeJwQQMeMWcZnCsXZYEYwua5INUVA7j8mq/0JR0MGZLXAU1sVkBPdf44hse2d4BP/YCvQ0cgCc2/ARhLIF4BoEBhpB2q42y1xARxmWbyTpAQoXAfsDAM+riAt4Cc8Lx8BC73AeEwseUzAdK2JNjtN6ZEF/d/B0OShgFHCnPmCVjbeL8tKgOTFbuiVDSj7DNyQDz90HTi7NSzJz5n3mz7eZieLx3OJprcfDeQcNdWzGNplmTzT20Kkyzjez++BglPWKe0Lh1KX0bKPBEDujgGQa6UeQP6qYEP2M4+1pAQoQHZ+MAZ0hlkyytDQFpC4BKa7gcU+sRNXT8hVsMvinSSOXKdQ41HxYOgKehX0NBlr+1tEMNQ6EDV8pX4rASo16U/iKhvQy7v13k27OfNRVjbeL8tKh/r6CZjcA2LcoaZdt35qpJ3fB65y4o/rdkouaa/zHQqUcA/ZpyvTy91DlX2Gyty/0rIqQ050yQylnRa44BdqioDou7bXQ6op3kP0xZ++a3v9zwavSajW+9cMfABoomlrOGj4GAAAAABJRU5ErkJggg==");
  background-size: 100% 100%;
}
 .el-icon-arrow-up:before {
  content: '1'
}
</style>
