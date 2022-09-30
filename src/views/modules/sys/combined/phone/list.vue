<template>
  <div>
    <div
      v-if="FromFlags"
      class="wrap"
    >
      <el-table
        :data="tableData"
        style="width: 100%;text-align: center;height: 100%;"
        height="640"
      >
        <el-table-column
          label="序号"
          style="width: 100%;text-align: center;"
          width="82"
          align="center"
        >
          <template slot-scope="scope">
            <!--              <img :src="scope.row.images?scope.row.images:'data:image/png;base64,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'" alt="" style="width: 69px;height: 85px;margin-right: 20px;" >-->
            <span
              style="font-size:13px;color: #666666;font-weight: bold;cursor: pointer;"
            >{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          style="width: 100%;text-align: center;"
          width="212"
          align="center"
        >
          <template slot-scope="scope">
            <!--              <img :src="scope.row.images?scope.row.images:'data:image/png;base64,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'" alt="" style="width: 69px;height: 85px;margin-right: 20px;" >-->
            <span
              style="font-size:13px;color: #666666;font-weight: bold;cursor: pointer;display: inline-block;max-width: 84px;width: 84px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
              @click="handleDetails(scope.$index, scope.row)"
            >{{ scope.row.name?scope.row.name:(scope.row.contactName?scope.row.contactName:'无') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="工作单位"
          align="center"
        >
          <template slot-scope="scope">
            <div class="workUnitWrap">
              <div
                style="font-size:13px;color: #666666;font-weight: bold;"
              >
                {{ scope.row.workUnit?scope.row.workUnit.split('、')[0]?scope.row.workUnit.split('、')[0]:'无' :'无' }}{{ scope.row.workUnit?scope.row.workUnit.split('、')[1]? '、' + scope.row.workUnit.split('、')[1]:'' :'' }}{{ scope.row.workUnit?scope.row.workUnit.split('、')[1]? '、' + scope.row.workUnit.split('、')[1]:'' :'' }}
              </div>
              <!--                <div style="font-size:13px;font-weight: bold;">{{ scope.row.workUnit?scope.row.workUnit.split('、')[1]?scope.row.workUnit.split('、')[1]:'无' :'无' }}</div>-->
              <!--                <div style="font-size:13px;font-weight: bold;">{{ scope.row.workUnit?scope.row.workUnit.split('、')[2]?scope.row.workUnit.split('、')[2]:'无' :'无' }}</div>-->
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="职位"
          align="center"
        >
          <template slot-scope="scope">
            <div
              style="font-size:13px;color: #666666;font-weight: bold;"
            >
              {{ scope.row.position?scope.row.position:'无' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="手机号码"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div
              style="font-size:13px;color: #666666;font-weight: bold;"
            >
              {{ scope.row.mobile || '无' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="来源单位"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div
              style="font-size:13px;color: #666666;font-weight: bold;"
            >
              {{ scope.row.platformName || '无' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div class="operate">
              <div
                v-if="scope.row.contactId !== 0"
                class="examine"
                @click="handleDetails(scope.$index, scope.row)"
              />
              <div v-if="scope.row.contactId !== 0">
                <img
                  v-if="scope.row.commonlyUsed == 1"
                  style="width: 22px;height: 22px;margin-right: 10px;cursor: pointer;"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABz0lEQVRIS9XUQUgUYRQA4Pfm/8cQITzUxcOGwmKdgk129VDUJRE71GGdWQz00NVbh6CbUNChY0cjUmO2OXQTPSkuxEytXmRPe1ohKURYXUja+f2fT2JD1JmdFRdpTj/87//em/e/GYQ2PdgmFy4fpjXrVqBwyTQP7mDK3W72prErrvv2Jw7OMfjGzDgvLgSm79l+pUWJMYFANQH1Xsx82YnCY1Vc9+xZRHh6DHrNVb9sCaZStgN2dd+BFEkiTCJgkoCeAaD8BxHVONEHrqqs0ShLQ5eh9quCD1ZUI+ZUxYFn/+BZ6WnWw5P7DBVkxrkXCit/bILImGFcxMepBkiPzPTn1VD4aOOPZ9kG4kdems1xqhLBSMdg3jseG3p5qph7DFo73OcrEfiOFPQQB/LrZ7Qm/FjgW4t8acOhEUhvzXT++Vn7keNW960KT0UiDOaZXpCZ/GhLMHnjVxWqKlccmpzhTYZvtAQHfnaIP7SvR4cY+E0A7zQZcwL1FK8n/841kSTZjYPze7F7rL7ZFt/2LKPvhYnTmHK2GoepmLuplH7FGZ9IoW/jgLsRG6bl+xK6rl/DtPszrMf7hWyi86672VIrms9vdESsn9B5kvx/8CG3wJUXWJkCPgAAAABJRU5ErkJggg=="
                  alt
                  @click="handleCollect(scope.$index, scope.row)"
                >
                <img
                  v-else
                  style="width: 22px;height: 22px;margin-right: 10px;cursor: pointer;"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABwklEQVRIS9WUv0sbcRjG3+eS6FAQBycHpUJonTooTYI/oItS2qGdWiFgLwY6uTkILkFQ6ODo4OClmCDSP6C0U6FCc6J1EacsKiiFImhDHUzuHl/FgJjeeRGD9AsHB+/z/dzzfd73vpAGLTSIK/cPXvrJbqfMrzxFT2oQv286aWDHlu0sQzAiwAczhsk7AefW+ajicFthIX1KBvBwNIZDP3ggx1bByQFIVkEuOTuWCE3VBf60zaa/x9KlbY2KuFExjCjJtDoIXwGVhPyotaLqijCkuFOS3cwzVKqaGsfZgruv4vabMqypA6ua/aAn2CpwFMJFhZ/nGXSVHMd5me6LfPcEnxeyNt+KcElfIwHIRyJ4bsZhX9V6Ni+7xlcKXxFKsw/8kGEMpXqxeV3jOxWW7X5RwbAXmIK5VBwT/6r7grWRu5p1h7djfNYIXtQFzttsKQs1P5/7BLJnxozOusCLa0wY5I+LTcCJ0J2viJGPQMb1B3l3OdeMCFqTcfwJnLGO3RuAOQotVozpsX4cVDdnN/hYypzRs7yWMJ6YvdgKDM58Y7jzgbSZT/HLK+OFVXa8H8BeXVEEmF9fSaBL6DYf+f/AZy3/kBe1XbyiAAAAAElFTkSuQmCC"
                  alt
                  @click="handleCollect(scope.$index, scope.row)"
                >
              </div>
              <div
                class="call"
                @click="handleCallOut (scope.$index, scope.row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div
      v-if="!FromFlags"
      class="wrapx"
    >
      <!--卡片显示-->
      <div
        v-for="(item, index) in tableData"
        :key="index"
        class="cardWrap"
      >
        <div class="cardWrap_tow">
          <div class="cardWrap_tow_header">
            <!-- 鼠标移入效果 -->
            <div class="cardWrap_tow_header_right">
              <img
                v-if="item.commonlyUsed == 1"
                class="oneImg"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAXCAYAAAD3CERpAAADv0lEQVRIS62Wf0yVVRjHP+e89773BwgIlQ1R8qKZgRvqLH/VynIJQ2UYtWXrt5BrTrdqtbkWW/1Tf2RbG9O5xj86hgldtyZDJWs0bZU1amhWV4iwHygo2vX+4N73dO4lCIPLvdx5/jln73vO8znP836f530E/46BffMLnJZqRVAy+uymzIqAQO1y157fPWpPjC78e+e9gJD7koEUEln4MGLmQqK+w4hrvcmOxN6HMmp8zkmgnm0IUT+1BYFY9CSO5TuJXDiFrWANgY/KENf/SAp21/ik9lDFNo7zNAWomYWz+hiBE68gfu/AXunFuthF9OQb2pw1JThtqCh5HnPhZkLN5XGAmnEH7iovgYPrIHDx5kOVPQvXE58T/PRV+O34GMC+voGovx+r4/XYNRKCp++pMJBLtmN6HiHQvAGhImPGVW4xGZVN+Fs2I66cSw+qpB0yC5B5JYhbFum5GCN3AdLuJtC+E/o+m2DYXn4Am95rBQeJXvoRa/AsakDPA11aZH/FI5DYU1devbn2A50ORagr3VhXe7Au/6zXPr3uRVztntQTZXMhsosQM+Yic/Sc40FmFyKz5hLu/BDrhz24t/4yuXrF/E315rIdBL06VMPX9AWjSVMh0QYlbcg5a3Hc9xaBQ2VkPPV1gpTJX13vfGg3oaPbUP3fpg2MHxQ2jHtewzbnfkKHq3A/+30CqLTVy6U7MO96jMCxlxD9p9MES4wVu7AXlRFo3YoY7Jrim8YqklaqKH4GR2ktoS/qUD1Hpge2ubGtqsOYtZRQ+3bQooqN5CkjJMyrwLXmTYJfvov6qSklcEz55rq9yIxZBNtqEf6+sXPJoSMfBbGgGse9LxPcv2LKxB+1rGY/gPPBdwh+XKWBF264aIpQkBpqK95C2FuZmqeOXFzVbQRbNsL/fgKpQXWIjZV18UIePaXnFEasCLq2nCTUptV/qTMNT6WJuamZ4dPvo3rbb0TqCylDF4SIf8JVzI2HCHftB583DagzD+ejrbpQVMHfI4JQOvdE/irsi5/T6iwlcqaRyLmDMK5SGavfBisyITqphTfbg2tDI9ebdJcQ86hwPWZpjS5thYS+24P68yuM0hcx85cT7jlB9Jv3QItH3v00hqec4U8eT8NTeyZmRaMWRD/KkYN0zdRetRA5ewARuvyfwVuXjHg+eyWRvg6M25cx3NmAdaYhFegkPZL7NqSnQnc4Q0R/PY4IDyWWU86d8d5JDXWPaMAKj987eY8U7waVipWfxSkIdTpbgkp3g5k153X8R8Y/2bqXJ1trHkgAAAAASUVORK5CYII="
                alt
                @click="callCollect(item)"
              >
              <img
                v-else
                class="oneImg"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAXCAYAAAD3CERpAAADLUlEQVRIS7VW3U6aQRA9KFT+hCqFggErmpiqRY2itdoYH6Y3fYa+Q3vHTd+jvdR4ZVDBKlgTwSIqIgii8icgdGYjtio/H9ZOsln4sjtnz8yZ2ZXhxhYXF60ymew7jTfVb08058jnp/n5+S9Vf7Lqj+Xl5Q+VSuWrFKDu7m6o1RrE4jEUrq6abiG/VwsLC8oHoEtLSx/pRK5mHsxmM+x2O87OzsDgq2trKBYKzbaBmLaR/wovvGUqBbS9vR1TU1PY3t7GxcUFxsfHcXl5iWAw+P9ALRYLeHg8HgHS0dGByUkn3KtulIrFhsCPYsosp6ffYmdnh0KbvAUYGRnBFeU1EAg8PajN1guTyYj19fU7ztVqNSYmJui7B7lcti5wQ6aUbBE2jUYLrVZDo5N+a6BQyOH3+5FKpR44djgc6OzsRIEElU6nkc5kkLmZqyKrC6pQKFxDQ0OiHPjUuVwOGXKQzeaQz/PI12TCB2XGSqWKZhVUKjUNpZgPDsI4Ojqqr16j0ejq6+vDxsYGSqVSU0U2WsAH6erqwuDgINaorGZnZ2uXjF6vdw0PD4swcin8kxGonQhwLXuJxPu5udqgbW1tLpvNhp6eHvh8PpGfx5q9vx8mowlbW5uUnmzj5sBhMVMtvurtxe7uLhKJREu4dHAMDAyAokZN5CcBZsR+SXVqMLwQ+QgGA4jFYpKA+cCcHla/z+cnNf/py5JAGcVkMqGfwrSysiIJlNm9JvV7qWNx+fxtLYC+pPxahJqlmFwuh9PpFG3y0aCcm3Klgl97e1IwwVfIu5mZmiKUxJTzw7dIKBQS19h9Y8GUy+UH38fGxqgZRHB6Gm89vNSd6AaZhNfrFQ1dGB1Er9PDarWSOnWIRCKIRqN3OhVHhy5t7N2LjiSmSqVSMHW73YKRwWAA1zC3tnA4jPPzlPjPXSceP8X+fkjkka8+I9Xn5uaP1pnyVTY6OiocsUAUimc4OYni+Pj4TovUarXEnMGfI5lMQqfT4fDwUKxrqt5abyQOMfVjFIslcpjA9fV1XUGpVCoRDb4kGJxDXLW6byR+DZI4vtFChySpSl+UJ9BP9DD7XN3yGygspSeC9FRqAAAAAElFTkSuQmCC"
                alt
                @click="callCollect(item)"
              >
              <img
                class="oneImgs"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADi0lEQVRIS6WWe0hTcRTHv/du9+7OF5aWvaykh5XRgwTtrWgvoicVRgUF/SG9iIqQirI/gqK0IqKiPwqCUiJ6UFhIZaVpUGmUPY1MLaOsbDk3r9tu51zZ5txcWuev7f5+O5/z+J5zJ4Atz5IFaGsgCMP17/9vb6DhLDIi9gvI+7WOHB//f58BPGjCegbUECDWfWwUgBWDJKT0MqCi0YnjVa1waP+I17RaAlicECCyizAjcHmyGekxRjz+4cS4SBFXPjmwvMz+bxANLgH5Fk98BVPNSOxpwNKHNhR9cyK9twEF08zIeq4i540aMA3OOD9ZRu5bB0q+u/zueAB9FAH188OwqMSmR+22g2NNWBsnIfZ6E5q8jz3nCuX+epaCSFnA3OIWP4gHMDhUxIe5oZh424qydpGMCBfxak4opt5pRnGDM2AW8eEC7k1XoBjgB/EAOJLfi8Ow8pEd+bXeUI+NNyFziIS4G1bU2bzdzh0jYdMwyQ/40uLCmEK757lPD0rTQlDV5MIqgrDtHCkjO0HG5ooWXU3tbdkAA2bFUMhkA0MEpFK/bE4Nm8pVnPnozdQHsH6ohENU877XrGhs1XBxkhnRMpBaZOtUpzEmAU/SFV2BQXvAHiIlQe/DkXcq9laqWNjfqMt29v1m3PoSuP4MOJ8kY3dla3AVuUPcQyXJGiFjZIEV1c0aCqebMTpCxPjCZnyxd3/ifErEEG42q6ba6sKMezZEU4TlM0N056ykQFINNud+AL7Ma4Ijz6Yy7XulIrGHiLupIbQ6XJhD5eoOJCCAIVyq7AQTltBUX6pzYEp021QzZN4Dmy6CBCrdBpKqgwb45PtWVJJEO1qnAL54IVnBkgFGpJCKSmjI3JCGFg15NQ5sHi7ppeMBi6ZJDiTnoADeMxx1cpQBGaV23Kh3YGiYgBMTFH0hnnyvYuPTFvC9w/pAysh8YscpysZtQQHupp9LUnTJbnum4ihJuDM7McGE1YMl9Lrq3Vt/BbAzjpB7smuUCdc/O/QoP7VbG27ggn5GXJliRhwtRpY4W5cAbgez+xhwOrFtc3JTj7xVPaCx9O64Seu+ytom5y6XqGM5eNq3xkvUYJnWg4CKn05SFKhPIl78IoUV23wG0u+VGWxo2p8xiBWWRguPh7Hoq1Pvj8+M6K/MfMt2+uGBrjru1j0N26l9LPjGHRDFLfQpqlsOOrusoYGOcvhvyx8Nf4YD9MYCOwAAAABJRU5ErkJggg=="
                alt
                @click="CallOut(item)"
              >
            </div>
          </div>

          <div class="cardWrap_tow_content">
            <!-- 主要内容 -->
            <div class="imgBgr">
              <img
                style="cursor: pointer;"
                :src="
                  item.images
                    ?item.images.toLowerCase().startsWith('http')
                      ? item.images : $window.SITE_CONFIG.cloudUrl + item.images
                    :'data:image/png;base64,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'"
                alt
                class="cardWrap_tow_content_Img"
                @click="humanDetails(item)"
              >
            </div>
            <div class="content">
              <p>
                姓名：
                <span>{{ item.name?item.name:(item.contactName?item.contactName:'无') }}</span>
              </p>
              <p>
                单位：
                <span>{{ item.workUnit?item.workUnit:'' }}</span>
              </p>
              <p>
                职务：
                <span>{{ item.position?item.position:'' }}</span>
              </p>
              <p>
                电话：
                <span>{{ item.mobile1?item.mobile1:(item.ti_call_type === 0?item.vc_calling:(item.ti_call_type === 1?item.vc_called:'无')) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <lookDetails ref="lookDetails" />
  </div>
</template>

<script>
import url from '@/mock/modules/url';
import Bus from '@/utils/bus.js';
import lookDetails from './lookDetails';

export default {
  name: 'List',
  components: {
    lookDetails,
  },
  inject: ['combined'],
  data() {
    return {
      tableData: [],
      saveSpace: '',
      FromFlags: true,
    };
  },
  methods: {
    saveSpaces(data) {
      this.saveSpace = data;
      // console.log(this.saveSpace)
    },
    handleCollect(index, row) {
      // 常用联系人接口返回的联系人id字段为： id
      // 最近联系人接口返回的联系人id字段为： i_contact_id
      // 通过分组查询联系人接口返回的联系人id字段为： id

      // 收藏联系人
      const data = {
        contactId: String(row.i_contact_id || row.contactId || row.id || row.i_id),
        // eslint-disable-next-line eqeqeq
        isCommonlyUsed: row.commonlyUsed == 0 ? 1 : 0,
      };
      this.collect(data);
    },
    callCollect(item) {
      const data = {
        contactId: String(item.i_contact_id || item.contactId || item.id || item.i_id),
        // eslint-disable-next-line eqeqeq
        isCommonlyUsed: item.commonlyUsed == 0 ? 1 : 0,
      };
      this.collect(data);
    },
    collect(data) {
      const that = this;
      this.$http({
        url: this.$http.adornUrl(url.collect.url),
        method: url.collect.method,
        data: this.$http.adornParams(data),
      }).then(({ data }) => {
        if (data.code === 0) {
          // console.log(data)
          Bus.$emit('refresh', that.saveSpace);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    handleCallOut(index, row) {
      // console.log(index, row)
      // name unit duty phoneNum type images
      // this.callPhone(row); //  一键呼出
      this.combined.uds.makePhoneCall({
        phone: row.phone || row.mobile1 || row.mobile2 || row.mobile,
        type: 1,
        name: row.name || row.contactName,
        id: row.id || row.i_contact_id,
      });
    },
    CallOut(item) {
      // console.log(item)
      // name unit duty phoneNum type images
      // this.callPhone(item); //  一键呼出
      this.combined.uds.makePhoneCall({
        phone: item.phone || item.mobile1 || item.mobile2,
        type: 1,
        name: item.name,
        id: item.id,
      });
    },
    handleDetails(index, row) {
      // console.log('查看联系人', index, row)
      this.$refs.lookDetails.init(row);
    },
    handleHistory(index, row) {
      // console.log('通讯记录', index, row)
    },
    init(data) {
      // 拿数据渲染的函数
      // console.log(data)
      this.tableData = data;
    },
    FromFlag(val) {
      this.FromFlags = val;
    },
    humanDetails(item) {
      this.$refs.lookDetails.init(item);
    },
  },
};
</script>

<style scoped lang="scss">
.wrap /deep/ .el-table th > .cell {
  text-align: center;
  color: #333333;
  font-size: 14px;
}
.wrap /deep/ .el-table thead > tr > th:last-child {
  background: #fff;
}
.wrap /deep/ .el-table thead > tr > th {
  /* background: #555; */
  padding: 0;
  height: 65px;
  /* line-height: 30px; */
  /* border-right: 1px solid #fff; */
}
.wrap /deep/ .el-table thead > tr > th > div {
  /* color: #fff !important; */
}
.wrap /deep/ .el-table tbody > tr > td {
  padding: 0;
}
.wrap /deep/ .el-table td,
.el-table th,
.el-table--border,
.el-table--group {
  // border-color: #F2F2F2;
}
.wrap /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  // background-color: #F9FCFF !important;
}

.listx[data-v-139ec9a4] {
  margin-top: 0 !important;
}
.workUnitWrap {
  max-height: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 5px 0;
}
.workUnitWrap > div {
  line-height: 1;
}
.examine {
  width: 21px;
  height: 21px;
  margin-right: 10px;
  cursor: pointer;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAADD0lEQVRYCe1WTWhTQRCeSZooFqGgWBQVxUOC0IOSkkIRUQT14NEiatNGpSfpxUPPHryoR09e0mjx7EWrHsSDhcYEW/EfKSIpFCu2iKi1NBm/1W7yku7mPaRpI76FsLvfzM58++3OvhD5zVfAV+DfVoA1/XRWjkqRrovIVo2tRs/Mkxygvp52Hlb5A5pEI5BTXJRAiovmVSa4ysppQpqknpcIaqDR+oYn2ORVMSZeIKb78B8Xos0sdFBIdnhd/7d+ngiisiaCQerqjvFTnSj1XtbyNF/BpT6vMVOPjRWEacZkW8RaUBkhm92VoFIO9+CEk5wKltzJcyDXn85wFEoeMifgr6EwtZ3ayx/MdqJbz6X15ze1cdli8vFyBx8l4pwzLYayEmC6arIpjJlmQ3to0mZX+Mk2/ojus83HVUG8lOO2xQovMD0jXEpTg8Lbv2f4xWBGXpvsCsPSCI54t83uTlCoxbb4Nx6AvWj3wPFHwSJq96htcT1iETp2952ssYYp0nGrbRkM7gqStE7P8DUcV5+6c86cQ0+kfUFooAJ0OKDAfnCQOvFdHXPAFcObWYkUivQY8TdWGBYnrgoqPyw+l87SJWeAVE6iIDcMW7MTd47xvEzVIqd8u9v5La6AtcpL/2ZSo0WjEFBtCrs4jUp+6EyuxumMbMD1u4wdnKm26TlUHMH4pZ5X99iEKpL91XiyA+8DWu0jZs5TkA4kYjxRHUDNe+Ksnoezg6Myi2K4YPIB3glc/czNKEvZ1e2I+3st5MohiNbFaQCP3isntlxjK0Ec7Vgyzre9JOpiLuBRvljtixjzOOLDzWHeZPsFm3gfNveleq2e1zpidXc8Nw7TiMwtcc/3dvCDJWgl8Ck1Km8AxSvhPzMrQVyN9amMeH7jZB46QDFUdVgnwngXkt+ButZnBr4R+BnJqTiuVayTrXSvq9h6B1eakC2fT9CmjFe8pKD6bnpdVG8/JxcHQRqqd2Kv8VG5JS6lKkap840cHZECbfMaqB5++PeTT8ToHp4sl49gPbL7MX0FfAX+QwV+AQur8kqN/lm2AAAAAElFTkSuQmCC");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.examine:hover {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAACt0lEQVRYCe1WPWsUURQ9d4lRECGgJCoqgkWCYBksREQR1MLSYGGjaApZ18LC2iKNpkl2Y6GFjT/ARvwoxMJ0kij4WaQQhRiCCZJiJSa5njfZ+diZ92Y2JjAbmIG3896597579sy9bwYorkKBQoHNrYAE9Kt6DooHHPsCLI+J4AcEg7ghz0z6UsChHcgZMkYgw6VxRQnmq5zPyNwjTzEkGHVoo3nbE+xYg1hLLN4XHO/4CPZwnGLswTXE/5drawQFU2ynAZRlIsjySLdhAfdItBxgtolgmfCczdTAurjHFpe9FYJGuYtN5Mxul+UPVCuooo8JTjsSLPCPHWHsN4cdeKg9qGOCe+y1+WTXoOA1z6S3tmCIKMkPW22r4Dy6ea6lXddkhuZfLpdsBU3NpV0lvMeK0+EAfuIDRvSz00PQS/UOu+zZBBVdrmAPX8mwK0sA3rBvo3bYR7MfseI8RnWrH2C5X7BgGwZlKwj0MFuNDTHo1Vw09Zj2Ywm3o1BsXmeNHkNFJmN4uLyvvfiLNwR2hWA4y1bQ+CqukuJQGMZZVft4gJgX+vYmvHkxnUrO+F6Xr/x1dnn4NTOirmqY5lFxiZ38qjk3VzXdyQa5yz9wJWHzAcE47R/9ZeK+2iQnEvhN8bilExR8Z+BJqjCV2CAKjOowSdyKQuueNwimP2JBJZOcYbKbdSj4tG5Slg3cBAWTfKxPLDFJaECWqeCdpAGLJH6Go9s5OnCctt+WWA9K6+JxV5AV72StLcYspkQq8jKGxpezPMi/EDwaN5i1m6BiBzu19TPOaAWPYmeQSHGIyZ+yydzHjHpvEis5s096kwSZcpi01CQ58IqndDdJ3DOn9aYiWM9JJFvagEuooOCxzTMXLMIl7GJV4QfBWb5b9+dCyk9a4tlZxvPEl5NvL+6FAoUChQIbq8A/U22fGMDFq3IAAAAASUVORK5CYII=");
  background-size: 100% 100%;
}
.operate {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.call {
  width: 22px;
  height: 22px;
  margin-right: 10px;
  vertical-align: middle;
  cursor: pointer;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACEklEQVRIS72UP2gTcRTH3/cuLbGIiIMUdHOTuFQxaVREqiKCg4KTgrlEEBGcpP4ZSsWlKm4iSm2iVRwKdRCEDEUHTXqKHR26CFZ0kIKDFKpefl9fUq5cc9f0MqQ/OLjf7733eX9/P0iHFjrElfUHj1e41UtIyq7J7LksvrebWWTEY1WvYMG6r/kkSfEsG9dye3GvHXgI/LTKbcbiF4V0+yCKGHrYWdiPWf+sOM3D6vjYXFkGh4dhmp2GwR940pAvQ9EBZ5w0XjyucovVJZvVcIfUOCmCya9lKTTDQ+DSR57Q+F6FI8CeXAYzRde4apQOygkM5NN4EzwLgTXFPoAzK8F44GRwqX726BO7EouS1DKkLFvKChhVh1fWLMXEZ3Yv/OYvVexZUsZ1hY40GxarzALmgNNv345qauRUlFxOiPB0AyuY0oiOtDMRS3YRqxGNxfe+XOF5hZd81dI0TwnMUYr1409NHl7ch59rlsJXeOLyGYVn63sdt3805nwhmxgvurWb6mhoGUSZ+7uI3RcOYb5l83zhc5ebPLCiFyQVMHit/wP6JVdAgKu5NO7EAteVdPR6dfTqsL7WNeZdJ2MPxgY34G+ZxAa5pWW5rNvl2xiAUICDennetQUOlGa7J5LXeh/Xlu8Sskf/50Fzw+lPjMZuXsvUSYxVZOO3KVmIeidWHbfW9YwnXf+HPl5cq2t1LOL/UxmzF7u08HkAAAAASUVORK5CYII=");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.call:hover {
  vertical-align: middle;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAB0ElEQVRIS9WUyytEURzHv2dkmiTJQoqdndgMpZQsPJKyoKxYYafGI++FyMYjw0yezWKKspgaC6UsZIOymT9gNhYKJSElec3P904zXPfe5rGYZOo2557f7/c53+/vnHMVMvRTGeLiD8AbUogPlOMdYQypq3SdWStekR56WSXMASHehnG41FI6cDPYLcUEXRBs14EiXKAMAyr8PbcsDchCM+4ximkVMS5qBnukjUl7Fuo60a924ZYC+sjHG0qZE6SIIOE9RrgZ7JVWqtu3AFcRHIJHzhmr/hWPoB6D6lg/ZwavihOfCBnA64T2Ree2JBuP1GznxtpwSBE+tmg4eSsCYscNHpiYE00WTLBwzuTAIzWM1TI2b7Wp1qfCKwEWdcQKjqi2MZ0ToeVagzU1wKku3k24X3ci2lnZxFZc4xWbGFG3yVsRz/DIDoddsdd3Ouil7W2syAyhUzrQJS9RJYbVXeLNi0e9kkfYGV/LdQUHHNfzcRgUjtHRQmpgLWtNinhCDriAM2GPBYt0M5o6WMv0iwNPmCXcZbiNcY5wvo5X/iQ98E9rSjjs5gIt/K/gk8Ox1tdJqvWlvnmJvSvMIxcveLb6Tmilf/A9Tqg4efD/Kf4CvYB8F9jIUCoAAAAASUVORK5CYII=");
  background-size: 100% 100%;
}
// .wrap /deep/ .el-table tbody>tr:nth-of-type(even){
//   background: rgba(238,238,238,1);
// }
.wrapx {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  overflow: auto;
  height: 100%;
}
.cardWrap {
  position: relative;
  width: 310px;
  height: 148px;
  margin-bottom: 30px;
  margin-right: 13px;
}
.cardWrap_tow {
  width: 310px;
  border: 1px solid rgba(219, 219, 219, 1);
  transition: all 0.5s;
  border-radius: 3px;
}
.cardWrap:hover .cardWrap_tow {
  border-radius: 0px 0px 3px 3px;
  border: none;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.12);
}
.cardWrap:hover .cardWrap_tow_header {
  display: block;
  transition: all 0.5s;
}
.cardWrap_tow_header {
  position: absolute;
  top: 10px;
  left: -1px;
  transition: all 0.5s;
  width: 310px;
  height: 30px;
  background: transparent;
  border-radius: 3px 3px 0px 0px;
  display: none;
}
.cardWrap_tow_header_left {
  position: relative;
  padding-left: 43px;
  display: flex;
  align-items: center;
  float: left;
  height: 100%;
}
.cardWrap_tow_header_left > img {
  position: absolute;
  left: 17px;
  bottom: 1px;
}
.cardWrap_tow_header_left > span {
  color: #fff;
  font-size: 12px;
}
.cardWrap_tow_header_right {
  display: flex;
  align-items: center;
  padding-right: 14px;
  float: right;
  height: 100%;
}
.cardWrap_tow_header_right > img {
  cursor: pointer;
}
.cardWrap_tow_header_right > .oneImg {
  margin-right: 4px;
}
.cardWrap_tow_content {
  width: 310px;
  height: 148px;
  display: flex;
  box-sizing: border-box;
}
.imgBgr {
  padding: 17px 13px 18px;
  background: #f8f8f8;
}
.imgBgr > img {
  min-width: 91px;
  min-height: 113px;
  max-width: 91px;
  max-height: 113px;
}
.cardWrap_tow_content > .content > p {
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 1);
}
.cardWrap_tow_content > .content {
  padding-top: 11px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px 0 25px 19px;
}
.oneImgs {
  width: 22px;
  height: 23px;
}
</style>
