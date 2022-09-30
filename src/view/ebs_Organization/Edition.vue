<template>
  <div>
    <div class="clearfix">
      <router-link
        to="/organization"
        style="color: #000000;"
      >
        预案编制
      </router-link>><span style="color: dodgerblue;">查看</span>
    </div>
    <div class="top">
      <el-button
        type="primary"
        class="sbs-button"
        @click="handleAdd"
      >
        新增预案版本
      </el-button>
      <el-button
        type="danger"
        class="sbs-button"
        @click="handleDelete"
      >
        删除
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="handleUpdate"
      >
        修改
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="handleEnable"
      >
        启动版本
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="back"
      >
        返回
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="download"
      >
        导出
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="fontSize='huge', changePDF()"
      >
        大
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="fontSize='medium', changePDF()"
      >
        中
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="fontSize='small', changePDF()"
      >
        小
      </el-button>
    </div>
    <el-container>
      <el-aside width="250px">
        <div
          class="left"
          style="margin-left: 20px;"
        >
          <p
            style="cursor: pointer;"
            @click="getLatestPreplan"
          >
            <img
              :src="imgsrc ? require('../../assets/img/Edition1.png') : require('../../assets/img/Edition.png')"
              alt=""
            >
            <span :class="{ active: isActive }">当前版本{{ current }}</span>
          </p>
          <div class="version">
            <h2>历史版本</h2>
            <ul>
              <li
                v-for="(item, index) in Historyeditions"
                :key="index"
                :class="{ levelsclass: index == levelsindex }"
                @click="handleClick(item.id,index)"
              >
                <img
                  src="../../assets/img/Edition.png"
                  alt=""
                >
                <p>{{ item.version }}</p>
              </li>
            </ul>
          </div>
        </div>
      </el-aside>
      <el-main>
        <el-card class="box-card">
          <div style="height: calc(100vh - 260px);overflow: auto;">
            <vuepdf ref="child" />
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import vuepdf from '@/view/ebs_Organization/PDF';

export default {
  name: 'Edition',
  components: {
    vuepdf,
  },
  data() {
    return {
      queryid: '', // 预案ID
      current: '', // 最新版本文本
      currentID: '', // 最新版本ID
      versionId: '', // 导出
      Historyeditions: [], // 历史版本
      deleteid: '', // 历史版本ID
      levelsindex: -1,
      isActive: true,
      imgsrc: true,
      fontSize: 'medium',
    };
  },
  created() {
    this.queryid = Number(sessionStorage.getItem('preplanId'));
    this.getVersionBriefs();
  },
  methods: {
    // 获取预案版本概要
    getVersionBriefs() {
      this.Historyeditions = [];
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getVersionBriefs',
        baseURL: window.g.ApiUrl,
        data: {
          id: this.queryid,
        },
      }).then((res) => {
        const { data } = res.data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].status === '已启用') {
            this.current = data[i].version;
            this.versionId = data[i].id; // 当前版本id
            this.currentID = data[i].id; // 最新版本id
            this.$refs.child.pdfdata(this.versionId, this.fontSize);
          } else {
            this.Historyeditions.push(data[i]);
          }
        }
      });
    },
    getLatestPreplan() { // 获得最新预案
      this.versionId = this.currentID;
      this.levelsindex = -1;
      this.imgsrc = true;
      this.isActive = true;
      this.$refs.child.pdfdata(this.versionId, this.fontSize);
    },
    changePDF() {
      this.$refs.child.pdfdata(this.versionId, this.fontSize);
    },
    back() {
      this.$router.push({
        path: '/organization',
        name: 'organization',
      });
    },
    // 点击左列表
    handleClick(id, index) {
      this.levelsindex = index;
      this.imgsrc = false;
      this.deleteid = id;
      this.isActive = false;
      this.versionId = id; // 版本ID
      this.$refs.child.pdfdata(this.versionId, this.fontSize);
    },
    // 新增预案版本
    handleAdd() {
      sessionStorage.setItem('preplanId', this.queryid); // 有版本id时的预案id
      sessionStorage.setItem('preplanEditionid', this.queryid); // 无版本id时的预案id
      sessionStorage.setItem('preplanVersionId', 0); // 版本id
      this.$router.push({
        path: '/newlyadded',
        name: 'newlyadded',
      });
    },
    // 启用版本
    handleEnable() {
      this.$confirm('确定启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (this.currentID === this.versionId) {
          this.$message({
            message: '当前版本是最新版本,不需要启用！',
            type: 'warning',
          });
          return;
        }
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/planHistoryEdition',
          baseURL: window.g.ApiUrl,
          data: {
            planId: this.queryid,
            versionId: this.versionId,
          },
        }).then((res) => {
          if (res) {
            this.$message({
              message: '当前版本已启用',
              type: 'success',
            });
            this.isActive = true;
            this.imgsrc = true;
            this.levelsindex = -1;
            this.deleteid = '';
            this.getVersionBriefs();
            // 启用后马上刷新当前预案
            this.$refs.child.pdfdata(this.versionId, this.fontSize);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用',
        });
      });
    },
    // 修改预案
    handleUpdate() {
      sessionStorage.setItem('preplanId', this.queryid); // 有版本id时的预案id
      sessionStorage.setItem('preplanEditionid', 0); // 无版本id时的预案id
      sessionStorage.setItem('preplanVersionId', this.versionId); // 版本id
      this.$router.push({
        path: '/newlyadded',
        name: 'newlyadded',
      });
    },
    // 删除预案
    handleDelete() {
      if (this.deleteid === '') {
        this.$message({
          message: '请选中历史版本再删除！',
          type: 'warning',
        });
        return;
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/deleteVersion',
          baseURL: window.g.ApiUrl,
          data: {
            id: this.deleteid,
          },
        }).then((res) => {
          if (res) {
            this.$message.error('已删除');
            this.getVersionBriefs();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    download() {
      const request = {
        method: 'get',
        baseURL: window.g.ApiUrl,
        url: '/emergency/preparation/preplan/download',
        params: {
          versionId: this.versionId,
          fontSize: this.fontSize,
          ifFlowChart: false,
        },
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = `${sessionStorage.getItem('preplanName')}.pdf`;
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
  },
};
</script>

<style scoped>
.clearfix {
  margin-left: 20px;
  line-height: 52px;
}
* {
padding: 0;
margin: 0;
}

a {
text-decoration: none;
color: red;
}

li {
list-style: none;
}
.top {
  margin: 0px 0px 20px 20px;
}
.top ul {
width: 404px;
border: 1px solid #777777;
height: 30px;
margin-bottom: 30px;
}

.top li {
float: left;
width: 80px;
height: 30px;
text-align: center;
line-height: 30px;
background: #dddddd;
border-right: 1px solid #777777;
cursor: pointer;
}

.top li:hover {
background: #409EFF;
color: #fff;
border-color: #409EFF;
}

.top li:last-child {
border-right: 0;
}

.box-card {
min-height: 500px;
}

.middle h1 {
text-align: center;
}

.middle li {
line-height: 30px;
}

.middle li span {
margin-left: 10px;
}

.left p {
text-align: center;
}

/*.left p span{
color: #009e0f;
}*/

.left p img {
display: block;
margin: 0 auto;
}

.left ul li {
cursor: pointer;
}

.version {
position: relative;
border: 1px solid #CCCCCC;
text-align: center;
width: 200px;
height: inherit;
margin-top: 20px;
padding-top: 40px;
}

.version h2 {
position: absolute;
left: 54px;
width: 100px;
background: #FFFFFF;
top: -14px;
color: #CCCCCC;
font-size: 20px;
font-weight: normal;
}

.version li {
}

.version li img {
display: block;
height: 50px;
width: 50px;
margin: 0 auto;
}

.version li p {
margin-top: 10px;
}

.levelsclass {
color: #009e0f;
/*background: url(../../assets/img/Edition1.png) no-repeat;
background-size: 50px 50px;*/
}

.active {
color: #009e0f;
}

.hasError {
color: #8C8C8C;
}

.btn {
padding: 9px 15px;
margin-bottom: 40px;
}

.el-scrollbar__wrap {
overflow-x: hidden;
}
</style>
