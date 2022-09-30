<template>
  <div>
    <div style="background-color: white;padding:10px;box-sizing: border-box;" class="smsSendForm">
      <header class="serchWrap">
        <div style="display:flex;align-items:center;">
          <span class="addressee">收信人：</span>
          <el-input
            type="text"
            v-model="telphone"
            style="padding-left:10px;box-sizing:border-box;width: 12vw;min-width:194px;color:rgba(213,213,213,1);margin-right:20px;font-size: 13px;"
            placeholder="输入号码,多个号码用逗号分开"
            size="small"
          ></el-input>
          <el-button type="default" @click="addressee" plain size="small">添加</el-button>
          <!-- <el-button type="default" @click="addEventHandle" style="width:146px">添加事件关联人员</el-button> -->
        </div>
        
      </header>
      
      <div style="margin-top:10px;">
        <p style="display:flex;align-items:center">
          已添加收信人<span class="num">{{contactNum}}</span>
          <!-- <img
            src="../../../../../../../assets/img/clear.png"
            style="width:19px;"
            @click="emptyView=true"
          /> -->
          <el-button @click="emptyView=true" plain size="small" style="margin-left: 10px;">
            清空
          </el-button>
        </p>
      </div>

      <el-timeline style="list-style:none;">
        <!-- <el-timeline-item placement="top" style="position:relative;">
          <el-card>
            <div class="group">
              <div style="display:flex;align-items:center;">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAE8UlEQVRIS71WW4hVZRT+1j73GUfHTExQemgorCbGVFS6OpQ56lxOkVEJFUZYGIaHYuqhmqzIzEjMjCghMC+cTg/hqFgUlBTBPBk9hpYhhgyijOeyz/7Xiv/f/97nnzOj41P7YZ/Lf/nW5fvWWgT73D9y6foMWjeA5U4CsmAAAkz4FICiNX1WOXv0fhGGkjNCdOBYb+rX6H7SX3pHpMVn9TEx5lzpcg1IBlhCAyYzQm/SwNoYgXCg3ju2ruWExjBAq34J8iA8G1uvwgWJrZeGZxMAOATVAPphwIv30Jnhx9IbY6CHTqiXiOVBbfG1Xa6t4HFhbVzueAtISzLdX1xHynjU86MqQKQ7DId+2c1NlprLI8ut1ZMC2Ehoo1uy6XxxHfkG6IHvaguSSM9JJJDhIFgBhc5GDmxoHHJMdbmby9xfmXxxiHxafSx4RDxaAmYihYpQ8nPi+pvCMreZcZ7LNtdbnVNtvskRhfG3e3P/WKCeI/4+gGaGCwxBYjcFahGAZS6Q8QL4XYgOBioYTTF1eOw9JYzZMRMjQ2IyCHLnsqFHq45Wb6GAOoEEPEYlKYmTfuDvAKPVXB4dAn4bfiK91ZLcoPZ9IW3s1XdD8ayY8jH7QhnkzlsgfWDt18FqRnAbhDLEuANAa7NOJKhvOPLMtHORAKPP3s+qPcLY1NhvdRaF7sKf+eLQ7SEZ1hSrBTBZ1jWJMRRf7fDTmYebQfTv/k9rt6qAt5s1K1YjbqvD3CUXaH+1AFggk9iI5o3Eil9dP/xC+4UJHu2qdAujYKrBuLIVsjVbPtXwqPegv0QC70ZRKguWu0kwPyZCI0fHD2/M7nSBHn1D0tX26i4w5kVkcnIaAtUs0Jov6ys8UYtEgSCo1DOZUqrmb0Mgs0LhNqjqMf0AUgfqcnY0Wb6hA6nEc2DpaK59sQwESKsIaG9tP7HMiDYTsEcC6YJgefMFjdBYETfVvXEstbJKwwKt3lte6vneQmM8eZUMUsd9v/oBGO0GSFdexnkQHxKiP9hnPwqfh2Rboh4sh6I8gHSzwHWuU0knR2s+qdxDSnWAkxmCLBPRIgxJQcC5cj275ftBujgZ6wzz3hrrhKK3oZAcTwpBKnfaofdH5QKBuicLDQlv+3aw7acrgUT/D7xW3gyRlVBOUVZAqs0B6vuwXBChbvDE2Ae16uNHh2Zdmgoo/2rlPgnUK81CT509nS8WrWB7t1e6ielmAWdJYTGxzIyIELFmKqD+zeWl5PHrJk8m4WG/Sv37dwg08L7fpZTf5QUgkFeWuvwMkh0Emm5b8jdS16eiLmobXvzb/k+JuSRyV3NUUqMWqP+d8ldgCRkWtuE9wl6XCBt6h3mbopW7VTsywLb0xEUL1Ld1bBUULfZYE4zKTHLAC/AulMw2nJt0GGlqhlfptokxC2TK/eDlhSSYB48yBNwLxTdNPuk4c8JUYrW5SlQcoIHBcgHg7ngeiKqwtiIKi7JeuKExSb/6/OfVXaCXxzZDsLKh7GsPjUtn03OMkaGWRJF0LmjrGxoi3eCB/JbLa0XJ81caSDy317hs097a3hMLdXw7P1Uqzdhkyph+9bwomSzGdgrLfNdCtwq7dcz0K2cumNBSwnWGJ0OlUvtIDGTAnhydnpuWXq9nb4jkJoy82irdpePR2ILpw0Ek0lBtAjpDFBwqla47GQndePR/PP8BcmN/TLlC8ccAAAAASUVORK5CYII="
                  style="width:13px;height:15px;margin-right:5px"
                />
                <p class="groupTitle">通讯录分组</p>
              </div>
              <div class="groupClassifiy">
                <ul class="groupList">
                    <li
                      v-for="(item,index) in mailGroup"
                      :key="item.id"
                    >
                      <template v-if="item.num">
                        <div class="oneGroupList" :class="{'border':item.check}" @click="addressHandle(index)">
                          <p class="workUnit">{{item.name}}</p>
                          <div class="totalCount">
                            <span>{{item.num}}人</span>
                            <img src="../../../../../../../assets/img/delete.png" class="del" @click="delOneAddress(index)" />
                          </div>
                        </div>
                      </template>
                    </li>
                </ul>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
        <el-timeline-item placement="top" style="position:relative;">
          <el-card>
            <div class="group">
              <div style="display:flex;align-items:center;">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAYAAADTlvzyAAAEBklEQVRIS71WW4tbZRRd+xyTzkWntmgF/QO+qCDSIsi8WJsZcrF90GdrKbWVqlVw2oJCoC8ijRdQZJAiii3TWIdOJ60UKb71QYL4Il4Gq1OqgmKLTsxMvsuW73bOdzL11UBIcs7Z395r7bXXDlW6YoqY9kBhDBqwb+U+yX5yfk1pd48BCCAxn+a3AsjGchbrzohjuZdqPUtTX8q2TeYDzWGkfGB0ILRPpoAkJA3J7HM+xl5jV1S4b5NrkE5+p8pl9QwprkGBiE0Q5cE2aCiRZ8GgZ8uCRxGY8YnJ5DTIQzzou1Iy2iIAqFwaPJBy8gJr3pJRah70VVpE0dscliGKWhAoda3QthWJogGAj8+ujX6KJpimPhcPf7a9dLl+jsdUSe9lqXdk9NmAvK8WlanaMhGKyOlz9w11XgOaf9CDQWuxuXm58XLv7rSEZ2n6ouhA45KiW967WKFeZX6wNQUOkuDNhT5YAXi6M1QMSCeijDpTEEiQwqny14uftNtP6MaRf+op4ylmndD0eZvQUPQHgDcvPF7+qnGWb+NVeUBLPWkVuE4IkfoyNbtek8aPzKJ17pXbrzSOrtxFwCGSdJ9TLAuaXljrmAcTRwND0flev3Tii9202vigP6k52Q/JEw5tTqUrIuqzhmLFpzfcO36q/SSpnTO9aRD2QPFoNkpKC6qeWevE1Lmb/KuW1Lrw9IZvqu/yJkoHz0HqrbmgPIUcekw/sRBvLDQ3LtVf+uuOtJw+D8UPxjNtiiMNQdW5PGGROtLMev43Hvmou49E7e3VHYnCXpbKGYRlxQyFPnNt+duT3dmHxM6j/UdZqn3EGI9VbefHtUZQ9aSj1DlLPFOOPtL0M0m0Fl4cWdr1+t9bpEoPQfL9CeNqIlVrvjnxffXwjU1lLh1k5m2FsfJKDo5kE9Y+NAn9wGdWlIvCoCZmSZLmyt2RuXYbun6sv+2XO0e7Bnljpj+Zgvez0hOFZH40CmNlKK2dWHUIM7vyyMK1bIABSF5SnBxfbI4tb5/5c+OtVD4AhUfy2NyZskSefu+1gmqzJmHROzMF+iISM2t5oFHjFWK6J1NgZH9GgLEzDbmSoNo7/U4YaFtFsKXAf2TUztTJqDhyGmdhzsaibWNbMWTqltK3+pZS6xTRerJzGQ4Igoo9ddjYo9hgbZa5cI4xbYag+nGXMEh3PR2+ymH0AVGh/17pppjQBvM9vGzC13qZaAoL1RlAYUusK2zdwo6ejxMVEh7rdbyt5Zv7ZgvY21hhVXkkNLzpI1CFrwZho7lymiSNO8cPfYv/KkSi8Jsh2+T2r0a03W+GKmaUcZ12vbryGKtkNykedw3ON7wTEeeFDC9ki9AL479Q+esMrDD0+3bj/5+vfwHCmjCHcyApNAAAAABJRU5ErkJggg=="
                  style="width:14px;height:11px;margin-right:5px"
                />
                <p class="groupTitle">短信分组</p>
              </div>
              <div class="groupClassifiy">
                <ul class="groupList">
                  <li
                    class="oneGroupList"
                    v-for="(item,index) in SMSGroup"
                    :key="item.id"
                    :class="{'border':item.check}"
                    @click="SMSHandle(index)"
                  >
                    <p class="workUnit">{{item.name}}</p>
                    <div class="totalCount">
                      <span>{{item.num}}人</span>
                      <img src="../../../../../../../assets/img/delete.png" @click="delOneSMS(index)" class="del" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </el-timeline-item> -->
        <el-timeline-item placement="top" style="position:relative;">
          <el-card>
            <div class="group" >
              <div style="display:flex;align-items:center;">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAFHUlEQVRYR5VXX2xTVRz+fvd2bbd1U4guyFSicY/+ifrggzELcRJww0GikmiIRjM1ESFAEFRSJkIyHQQwkoGJ8EAUHTRsYyxMjQYViT6p0ScfNBqDPMigWzfant/PnNNzb2/b27U0ae7fc77zfef7/bmEOn9d38pil9UjYLqfRNrAaBbBFJT8TUr9oNzYucllNFPndKBaL3Z+JYlG4ucB6QLDhZLCEH3Qf/bOJQ2W4xM90RGA7EvVZ58XuPvLTLuiaBIi7QbAA1T23DsKA/bcgXOeo5HBiRV0bT5SVYEf/VxuiDhqH7G0VbAzLLmUMQOOpwBwfvyp6O75mFcFXv5Frh+MB0vkrAUYkF8Eh888ExupxjoUeMVk9j5RtMuA6p8KsAvKrVnqa28bvP02R7qaw38vTq5dFGq4cODx3DYRPFyQmIsGshM7vqEC5grcI5bCNjju/tPPNUyGsa4AfvIzcafj+U8BbvQdG9y/cjdbQONjD9DeE6YL4y/FdtYF/Fgq3eZS9IgGNWYxUtuQ8WTV9xUKsRgC6PlCBH+NvxJ/uS7g7hPSIcjuK8ZnpZwFdhbVLqJ0geItNn16XeOauoBXfiKLlZP9sMLNrBkKwASIPoYkESN14Dlw8fT6xhfqAl5+QGJ0U3aYFFw9gDSAnlALWy+gVYQgP49tbNpWF7B+qfvYtd1QuLfAyrILhpHZey2n3mUrq16aJqyVsZHgEB0Z2dx0om7glUdyXSxqQ11yeuz8vF2IeWLkwdI3+mbi37qBkRTn8fZrBwm4rRhSNjaDhcFn51SkUGKMjb7VPHRdmcvIPTTXAcEAFGJGbhtKFCwQXr4OhJmjNGH6U9TU5rEdizPXDawH9BzIPCTkbIGSmDGZYaultAxtymRlY76wvn9ySraf6U9crAZqTDvfQ/1s5d65u8CySYRvD6tSJslY+QX4HpnM/tF3b07XmrcmsJlA73l8ZqkD6iTB3aQQMfeNi2magB9ZqYmxnS2/1gL0nocCdyYvJVoTLetIKCeSPjT6epHBA33S0L5kZqHK5pvzoKmz2DuF/n6vPqFn8+wdrqNeE+V8N7Kn8WS1mlwBvOq9dJtSzjsiaDdhoeSqQ85oQ2TuzPDWhVeqMVq9aXaJOGo1QJ2iJGLGAt9cbm0e/Lqf8uXjSoCXJa8sjMcje1jQpouAqbXe/gkYLL+74v7GSi4Ly6wLaoGoNoFzD1huCVYzr5w6TBdSBwd3AUVVSszVmZTIjdHZQWHRYVRRg21SKCwkkK38ymXEto7Xzg80By5w8uRQ60dB1j7jJ96eXQvw06WrLjKmqnm6rFmwi/b7L21AgURcZ9vw4cQvJeZakZxe1EB0CIKID+zX22qVKBjXpa1uaIcC+iN1NPGqZzbDuHd7ZoOIdJkLU/SLmcqPXS9jeQ1fSFms1RKBaSD1ccs5s8c9O6QpksscY0asIKctfxX7HOi9yp4Fk4jvD2sFk2ItERL3pxPHE28Y4FVb00sFtKk2YCBNlnxBVOtQbFNgarn1nUA4z8+eOrVginq3ZDaAWX+eFBt0404tuwWzAzUzk5cDYRaMgLCGryRCDAQPpFILzlHvxpn3IXJnEdiChrizIsxs8TdSaknDPnO8htHaWUDDqVTrUepdP/MBgW/1so03eTAcygENM1/uKr4IS3FCc0I4m0q1HvbjuKdPmuK56eYssnF23QgJuQ0REM9SZT4v/xzLlqI4johSplgr5mg2FsvPTU9fmpmY6PBH/g+TV2JOwAP4yQAAAABJRU5ErkJggg=="
                  style="width:15px;height:16px;margin-right:5px"
                />
                <p class="groupTitle">联系人</p>
              </div>
              <div class="groupClassifiy">
                <div class="lianxiren">
                  <ul class="contacts">
                    <div>
                      <li
                        :class="{'border':item.check}"
                        v-for="(item,index) in allSelectData"
                        :key="index"
                        @click="setListCheck(index)"
                      >
                        <div class="info">
                          <span class="name">{{item.name?item.name:"无"}}</span>
                          <img src="../../../../../../../assets/img/delete.png" @click="delOneList(index)" class="del" />
                        </div>
                      </li>
                    </div>
                    <div>
                      <li
                        :class="{'border':item.check}"
                        v-for="(item,index) in getAddresseeData"
                        :key="index"
                        @click="checkStatus(index)"
                      >
                        <div class="info">
                          <span class="name">{{item.name?(item.name == '未知'?item.phone:item.name):"无"}}</span>
                          <img src="../../../../../../../assets/img/delete.png" @click="delOneCheck(index)" class="del" />
                        </div>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <div class="content">
        <el-form>
          <el-form-item>
            <div class="operation" style="display: flex;justify-content: flex-end;">
              <div>
                <span>已选择 收信人 <span class="num">{{this.allSelectData.filter(v=> v.check).length + this.getAddresseeData.filter(v=> v.check).length}}</span>&nbsp;&nbsp;位联系人</span>
                <!-- <el-button type="default" @click="moveOutView=true" style="width:77px">移出选中</el-button> -->
                <!-- <el-button type="default" @click="emptyView = true">清除</el-button> -->
                <el-button @click="saveGroupHandle" plain size="small">存为短信分组</el-button>
                <!-- <button class="add">添加收信联系人</button> -->
                <!-- <el-button type="default" style="width:148px" @click="addBusinessCard">添加名片至信息</el-button> -->
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="background-color:white;margin-top:15px;padding:15px 15px 7px;">
      <div style="display: flex;margin-bottom:15px;justify-content: space-between">
        <div class="configure">
          <el-select
            v-model="event"
            placeholder="请选择关联事件"
            style="vertical-align: top;min-width:144px;width:9.8vw;color:rgba(198,198,198,1);"
            size="small"
          >
            <el-option :label="item.title" :value="item.id" v-for="item in eventData" :key="item.id"></el-option>
          </el-select>
          <el-button @click="SMSSet" plain size="small">短信设置</el-button>
          <el-button @click="templateHandle" plain size="small">短信模板</el-button>

        </div>
        <p class="number">
          <span style="color:red;margin-right:5px;">*</span>
          本次发送短信总量<span class="num">{{sendWay?sendNum1:sendNum2}}</span>条&nbsp;&nbsp;&nbsp;
           本次发送微信总量 &nbsp;&nbsp;&nbsp;{{sendWay?contactWeChat+addresseeNum:0}}条&nbsp;&nbsp;&nbsp;剩余短信数量：
          <span
            style="color:red;"
          >{{form.SMSNum}}</span>
        </p>
      </div>

      <textarea
        style="height:227px;width:100%;resize:none;outline:none;border:none;border:1px solid rgba(222,222,222,1);"
        v-model="content"
        maxlength="500"
        class="textarea"
      >123
      </textarea>

      <div class="sign">
        <p style="margin:10px 0">
          签名：【{{this.form.signature}}】
          <el-checkbox v-model="sendWay">微信通知</el-checkbox>
        </p>
        <p style="color:rgba(226,226,226,1);">{{content.length}}/500字</p>
      </div>
      <div>
        <div class="send">
          <div style="display:flex;align-items:center;">
            <div v-if="whetherSend">
              <img
                src="../../../../../../../assets/img/warning.png"
                style="width:11px;margin-right:5px"
                alt
              />
              <span class="remind">短信余量不足，无法发送短信，请充值或移除部分收信人</span>
            </div>
          </div>
          <div>
            <el-button @click="content=''" plain size="small">清空内容</el-button>
            <el-button @click="saveTemplateHandle" plain size="small">添加为模板</el-button>
            <!-- <el-button type="default" @click="saveDraft">存稿</el-button> -->
            <el-button @click="toSend" plain size="small">发送</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加事件关联人员 -->
    <add-event ref="addEventView" @getEventContact="getEventContact"></add-event>

    <!-- 移出选中 -->
    <el-dialog :visible.sync="moveOutView" width="410px" title="移出联系人" center>
      <div style="background-color: #fffada;padding: 5px 20px;">
        <p>已选择</p>
        <div>
          <span>通讯录分组数量：{{mailGroup.filter(v=>{ return v.check }).length}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>短信分组数量：{{SMSGroup.filter(v=>{ return v.check }).length}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>联系人数量：{{value.filter(v=>{ return v.check }).length}}</span>
        </div>
      </div>

      <p style="text-align:center;margin-top: 40px;">是否将选中联系人移出?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="moveOutView = false">取 消</el-button>
        <el-button @click="delIt">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 清除所有 -->
    <el-dialog :visible.sync="emptyView" width="410px" title="清空联系人" center>
      <p style="text-align:center;margin-top: 40px;">是否清空联系人列表?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="emptyView = false">取 消</el-button>
        <el-button @click="delAll">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 短信详情 -->
    <el-dialog title="短信设置" :visible.sync="detailView" width="730px" center>
      <div class="process">
        <el-form :model="form">
          <el-form-item label="短信类型：">
            <el-radio-group v-model="form.type" @change="smsType">
              <el-radio :label="1">催报</el-radio>
              <el-radio :label="2">请示</el-radio>
              <el-radio :label="3">定时</el-radio>
              <el-radio :label="4">上报</el-radio>
              <el-radio :label="5">通报</el-radio>
              <el-radio :label="6">其他</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="催报短信：">
            <div style="display:flex;align-items: center;">
              <el-switch
                v-model="form.value"
                active-color="#13ce66"
                inactive-color="#c9c9c9"
                style="margin-right:8px;"
              ></el-switch>
              <span v-if="form.value">开启</span>
              <span v-else>关闭</span>
            </div>
            <div style="margin:10px 0 0 82px;" v-if="form.value">
              <el-select
                v-model="form.doTime"
                placeholder="次数"
                style="width:20%;margin-right:20px;"
              >
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
              </el-select>次&nbsp;&nbsp;&nbsp;&nbsp;
              间隔：
              <el-select
                v-model="form.doSpace"
                placeholder="分钟"
                style="width:20%;margin-right:20px;"
              >
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
              </el-select>分钟
            </div>
          </el-form-item>

          <el-form-item label="发送方式：">
            <el-radio v-model="form.radio" label="0" :disabled="form.value">即时发送</el-radio>
            <el-radio v-model="form.radio" label="1" :disabled="form.value">定时发送</el-radio>
            <template v-if="form.radio == '1'">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.date"
                style="width: 20%;margin:0 10px 0 25px;"
                value-format="yyyy-MM-dd"
                :disabled="form.value"
              ></el-date-picker>
              <el-time-picker
                placeholder="选择时间"
                v-model="form.time"
                style="width: 20%;"
                value-format="HH:mm:ss"
                :disabled="form.value"
              ></el-time-picker>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailView = false" plain size="small">取 消</el-button>
        <el-button @click="detailView = false" type="primary" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 草稿试图 -->
    <sms-send-draft ref="smsDraftView"></sms-send-draft>

    <!-- 存为模板 -->
    <save-template ref="saveTemplateView"></save-template>

    <!-- 存为分组 -->
    <save-group ref="saveGroupView"></save-group>

    <!-- 查看和修改模板 -->
    <seeOrUpdata-template ref="seeOrUpdataTemplateView"></seeOrUpdata-template>
  </div>
</template>

<script>
// var now=newDate();
// var startDate=newDate(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())).toISOString().slice(0,10);
// this.date=[now.getFullYear(),now.getMonth(),now.getDate()];
// this.date.push(startDate)
import bus from "@/views/common/js/eventBus";

import smsSendDraft from "./sms_send_draft/sms_send_draft.vue";
import seeOrUpdataTemplate from "./template/seeOrUpdata_template";
import saveTemplate from "./save_template";
import savegroup from "./save_group/seeOrUpdata_group";
import AddEvent from "./AddEvent";
import $ from "jquery";

export default {
  name: "sms_send_form",
  components: {
    "sms-send-draft": smsSendDraft,
    "seeOrUpdata-template": seeOrUpdataTemplate,
    "save-template": saveTemplate,
    "save-group": savegroup,
    AddEvent
  },
  data() {
    return {
      value: [], //,所有联系人,
      idx1: null, //删除联系人的索引值
      idx2: null, //删除收信人的索引值

      personnelView: false, //添加关联人员试图
      moveOutView: false, //移出选中试图
      emptyView: false, //清空所有试图
      detailView: false, //短信详情试图

      images: require("../../../../../../../assets/img/load.jpg"),

      tableData: [],

      call: true,
      timing: true,

      form: {
        SMSNum: 0,
        remarks: "", //关联日志
        signature: "", //短信签名
        doTime: 0, //次数
        doSpace: 0, //间隔
        date: "",
        time: "00:00:00",
        delivery: false,
        type: 6,
        value: false,
        radio: "0",

        resource: "",
        desc: ""
      },

      // 信息机
      // radio2: "Yes", //默认单选框选中

      status: false, //关联日志

      smsDraftView: false, //草稿试图

      allPhone: [], //存放所有复选框收信人的手机号码
      checkIds: "", //存放所有复选框收信人的Id
      searchId: [], //存放所有输入框收信人的Id
      telphone: "", //存放每一次输入框收信人的手机号码
      newAddressee: [], //用于转变每一次输入框收信人的手机号码格式
      newAddresseeData: [], //存放所有输入框收信人的手机号码
      getAddresseePhone: [], //转换手动添加返回的手机号
      addAddressee: [], //每次添加的收信人
      getAddresseeData: [], //存储手动添加够的数据
      // 发送参数
      content: "",
      event: "",
      eventData: [], //所有事件数据
      phone: "",
      userIds: "",
      type: "",
      sendWay: false,

      mailGroup: [], //通讯录组
      SMSGroup: [], //短信分组
      selectedNode: [], //选中的节点
      addressessGroupNum: 0, //通讯录组数量
      SMSGroupNum: 0, //短信组数量
      weChatNum: 0, //关联微信人员
      contactWeChat: 0,
      addresseeNum: 0,//收信人数量

      insertData: '',//添加名片数据

      currentCheck: [],//当前选中联系人

      allSelectData: [],
    };
  },
  created() {
    bus.$off("getData")
    bus.$on("getData", value => {
      console.log(value);
      this.currentCheck = value;
      this.currentCheck.map(v => {
        v.check = false;
      });
      this.contactWeChat = this.currentCheck.filter(v => {
        return v.openId;
      }).length;
    });

    bus.$off("forwardData")
    bus.$on("forwardData", () => {
      var forwaraData = this.$store.state.user.forward;
      this.$store.state.user.content = forwaraData.content;
      this.type = forwaraData.type;
      this.sendWay = forwaraData.sendWay;
      this.form.eventId = forwaraData.eventId;
    });

    bus.$off("getAllCheck")
    bus.$on("getAllCheck", (val, idx) => {
      // 去重
      let hash = {};
      const mailGroup = val.reduceRight((item, next) => {
        hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
        return item;
      }, []);

      // 统计每组数量
      mailGroup.forEach(v => {
        this.handleNodeClick(v);
        if (idx === 0) {
          this.addressessGroupNum = 0;
          this.$http({
            url: this.$http.adornUrl("/mail/mailcontactor/list"),
            method: "post",
            data: this.$http.adornData({
              limit: 2000,
              page: 1,
              groupId: this.selectedNode,
              search: ""
            })
          }).then(({ data }) => {
            // console.log('console.log',data.code);
            if (data.code === 0) {
              this.$set(v, "num", data.data.list.length);
              // console.log(
              //   "data+++++++++++++++++++++++++++++++++++++++++++++++++",
              //   v
              // );
              this.addressessGroupNum += data.data.list.length;

              this.weChatNum = data.data.list.filter(v => {
                return v.openId;
              }).length;
            }else{
              this.$message.error(data.msg)
            }
            
          });
        } else if (idx === 1) {
          this.SMSGroupNum = 0;
          this.$http({
            url: this.$http.adornUrl("/message/messageGroup/selectById"),
            method: "get",
            params: this.$http.adornParams({
              limit: 2000,
              page: 1,
              id: this.selectedNode.toString()
                ? this.selectedNode.toString()
                : -1,
              search: ""
            })
          }).then(({ data }) => {
            // console.log('console.log1',data);
            if (data.code === 0) {
              this.$set(v, "num", data.page.list.length);
              // console.log(
              //   "data+++++++++++++++++++++++++++++++++++++++++++++++++",
              //   data
              // );
              this.SMSGroupNum += data.page.list.length;

              this.weChatNum = data.data.list.filter(v => {
                return v.openId;
              });
            }else{
              this.$message.error(data.msg)
            }
            
          });
        }
      });
      // mailGroup.map(v => {
      // });
      //统计所有组数量
      // mailGroup.map(v=>{
      //   this.groupNum += v.num
      // })

      if (idx === 0) {
        this.mailGroup = mailGroup.reverse();
      } else if (idx === 1) {
        this.SMSGroup = mailGroup.reverse();
      }
    });

    bus.$off("getDetailData")
    bus.$on("getDetailData", val => {
      this.mailGroup = val.mlGroup;
      this.SMSGroup = val.msgGroup;
      this.content = val.content;
      if (val.phone) {
        var phoneArr = val.phone.split(",");
        var nameArr = val.name.split(",");
        nameArr.map((v, index) => {
          this.getAddresseeData.push({ name: v, phone: phoneArr[index] });
          console.log(this.getAddresseeData);
        });
      }
    });

    // 获取短信数量和签名
    this.getSMSNum();

    // 获取短信模板
    bus.$off("getContent");
    bus.$on("getContent", val => {
      this.content = val;
    });

    // 获取关联事件
    this.getEventList()
  },
  computed: {
    contactNum() {
      return this.allSelectData.length + this.getAddresseeData.length
    },
    checkContactNum() {
      return this.allSelectData.filter(v=> v.check).length + this.getAddresseeData.filter(v=> v.check).length
    },
    sendNum1() {
      return (
        this.allSelectData.length +
        this.addressessGroupNum +
        this.getAddresseeData.length + 
        this.SMSGroupNum -
        this.weChatNum -
        this.contactWeChat -
        this.addresseeNum
      );
    },
    sendNum2() {
      return (
        this.allSelectData.length +
        this.addressessGroupNum +
        this.getAddresseeData.length
      );
    },
    whetherSend() {
      return this.form.SMSNum > this.sendNum ? true : false;
    }
  },
  watch: {
    content(newV, oldV) {
      this.$store.commit("user/updateSMSContent", newV);
    },
    // 'form.value'(newV){
    //   if(newV){
    //     this.form.date = ''
    //   }else{
    //     this.getTime()
    //   }
    // },
    allSelectData(){
      bus.$emit("getCheckData", this.allSelectData);
      // alert(1111)
    },
    currentCheck(newV,oldV){
      console.log('oldV: ', oldV);
      console.log('newV: ', newV);
      let delData = []
      if (newV.length>oldV.length) {
        newV = this.delRepy(newV)
        // console.log(this.allSelectData)
        this.allSelectData = this.allSelectData.concat([...newV].filter(x => [...oldV].every(y => y.id !== x.id)))
        // console.log(this.allSelectData)
      }else{
        newV = this.delRepy(newV)
         delData = [...oldV].filter(x => [...newV].every(y => y.id !== x.id)) //要删除的数据
        this.allSelectData = [...this.allSelectData ].filter(x => [...delData].every(y => y.id !== x.id))
        // console.log(this.allSelectData)
        // alert(111)
      }
    } 
  },
  methods: {
    // 点击树形节点事件
    handleNodeClick(obj) {
      // console.log(obj);
      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        if (children != null) {
          children.forEach((item, index) => {
            findChilden(item, list);
          });
        }
      }

      // console.log("树形结点点击事件", obj.id);

      this.selectedNode = [];

      findChilden(obj, (this.selectedNode = []));
      // 查询树形关联的联系人
    },
    // 获取当前日期
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let time = y + "-" + m + "-" + d;
      this.form.date = time;
    },

    

    // 获取关联事件
    getEventList(){
      this.$http({
        url: this.$http.adornUrl("/emergency/emergencyinfo/list"),
        method: "get",
        params: this.$http.adornParams({
          limit: 100000,
          page: 1,
        })
      }).then(data => {
        if (data.data.code === 0) {
          this.eventData  = data.data.page.list
        }else{
          this.$message.error(data.data.msg)
        }
      });
    },

    showHide() {
      if (this.$refs.child.style.display === "none") {
        this.$refs.child.style.display = "block";
        this.$refs.arrow.style.transform = "rotateZ(0deg)";
      } else {
        this.$refs.child.style.display = "none";
        this.$refs.arrow.style.transform = "rotateZ(90deg)";
      }
    },
    deletCourseSub(id) {
      // 功能代码省略
    },
    // 获取剩余短信数量
    getSMSNum(){
      this.$http({
        url: this.$http.adornUrl("/message/messageinfor/getSurplusMessageSum"),
        method: "get",
        params: this.$http.adornParams({})
        }).then(data => {
        if (data.data.code === 0) {
          console.log('data: ', data);
            this.form.signature =  data.data.signcode
            this.form.SMSNum =  data.data.messageSum
        }else {
            this.$message.error(data.data.msg);
            }
      });
    },
    // 添加收信人
    addressee() {
      this.addAddressee = [];
      if (this.telphone) {
        if (this.telphone.indexOf("，") !== -1) {
          this.telphone = this.telphone.replace(new RegExp("，", "g"), ",");
        }

        this.newAddressee = this.telphone.split(",");
        console.log('this.newAddressee: ', this.newAddressee);
        for (let i in this.newAddressee) {
          if (!/^1[3456789]\d{9}$/.test(this.newAddressee[i])) {
            this.newAddresseeData = [];
            break;
          } else {
            if (this.newAddresseeData.length != 0) {
              if (this.newAddresseeData.indexOf(this.newAddressee[i]) != -1) {
              } else {
                this.newAddresseeData.push(this.newAddressee[i]);
                this.addAddressee.push(this.newAddressee[i]);
              }
            } else {
              this.newAddresseeData.push(this.newAddressee[i]);
              console.log('this.newAddresseeData: ', this.newAddresseeData);
              this.addAddressee.push(this.newAddressee[i]);
            }
          }
        }
        if (this.addAddressee.length > 0) {
          this.$http({
            url: this.$http.adornUrl(
              "/message/messageinfor/getContactorByPhone"
            ),
            method: "post",
            data: this.$http.adornData({
              phone: this.addAddressee.toString()
            })
          }).then(data => {
            if (data && data.data.code === 0) {
              data.data.data.map(v => {
                // this.newAddresseeData.push(v)
                this.addresseeNum +=  
                this.getAddresseeData.push(v);
              });
              this.addresseeNum = data.data.date.filter(v => {
              return v.openId;
            }).length;
            }else {
            this.$message.error(data.data.msg);
          }
          });
        }
        this.telphone = "";
      }
    },
    // 删除选中
    delIt() {
      if (this.value.length > 0) {
        this.value = this.value.filter(function(i) {
          return !i.check;
        });
        // console.log(this.value);
      }

      if (this.mailGroup.length > 0) {
        this.mailGroup = this.mailGroup.filter(function(i) {
          return !i.check;
        });
        // console.log(this.value);
      }

      if (this.SMSGroup.length > 0) {
        this.SMSGroup = this.SMSGroup.filter(function(i) {
          return !i.check;
        });
        // console.log(this.value);
      }

      if (this.getAddresseeData.length > 0) {
        this.getAddresseeData.map((v, index) => {
          if (v.check) {
            this.getAddresseeData.splice(index, 1);
            this.newAddresseeData.splice(index, 1);
            // console.log(this.value);
          }
        });
        // this.idx2 = null;
      }
      this.moveOutView = false;
    },

    //添加名片至信息
    addBusinessCard() {
      if (
        !this.value &&
        !this.mailGroup &&
        !this.SMSGroup &&
        !this.getAddresseeData
      ) {
        this.$message.error("请选择联系人");
      } else {
        // if (this.value.length > 0) {
        //   this.value = this.value.filter(function(i) {
        //     return i.check;
        //   });
        //   // console.log(this.value);
        // }

        // if (this.mailGroup.length > 0) {
        //   this.mailGroup = this.mailGroup.filter(function(i) {
        //     return i.check;
        //   });
        //   // console.log(this.value);
        // }

        // if (this.SMSGroup.length > 0) {
        //   this.SMSGroup = this.SMSGroup.filter(function(i) {
        //     return i.check;
        //   });
        //   // console.log(this.value);
        // }

        // if (this.getAddresseeData.length > 0) {
        //   this.getAddresseeData.map((v, index) => {
        //     if (!v.check) {
        //       this.getAddresseeData.splice(index, 1);
        //       this.newAddresseeData.splice(index, 1);
        //       // console.log(this.value);
        //     }
        //   });
        // }

        this.insertData = "";

        this.allSelectData.map(v => {
          if (
            this.content.indexOf(
              "    " + v.name + `(职务：${v.position}，手机号：${v.mobile1})`
            ) === -1
          ) {
            this.insertData +=
              "    " + v.name + `(职务：${v.position}，手机号：${v.mobile1})`;
          }
        });

      

        this.mailGroup.map(v => {
          this.handleNodeClick(v);

         this.$http({
            url: this.$http.adornUrl("/mail/mailcontactor/list"),
            method: "post",
            data: this.$http.adornData({
              limit: 2000,
              page: 1,
              groupId: this.selectedNode,
              search: ""
            })
          }).then(({ data }) => {
            // console.log('console.log3',data.code);
            if(data.code === 0) {
              if (data.data.list.length>0) {
                data.data.list.map(item => {
                  if (
                    this.content.indexOf(
                      "    " + item.name + `(职务：${item.position}，手机号：${item.mobile1})`
                    ) === -1
                  ) {
                    this.insertData +=
                      "    " + item.name + `(职务：${item.position}，手机号：${item.mobile1})`;

                  }
                });
              }
            }else{
              this.$message.error(data.msg)
            }
          })
        });

        this.SMSGroup.map(v => {
          this.handleNodeClick(v);

         this.$http({
            url: this.$http.adornUrl("/message/messageGroup/selectById"),
            method: "get",
            params: this.$http.adornParams({
              limit: 2000,
              page: 1,
              id: this.selectedNode.toString()
              ? this.selectedNode.toString()
              : -1,
              search: ""
            })
          }).then(({ data }) => {
            // console.log('console.log4',data.code);
            if(data.code === 0) {
              if (data.page.list.length>0) {
                data.page.list.map(item => {
                  if (
                    this.content.indexOf(
                      "    " + item.name + `(职务：${item.position}，手机号：${item.mobile1})`
                    ) === -1
                  ) {
                    this.insertData +=
                      "    " + item.name + `(职务：${item.position}，手机号：${item.mobile1})`;
  
                  }
                });
              }
            }else{
              this.$message.error(data.msg)
            }
          })
        });

        this.getAddresseeData.map(v => {
          if (
            this.content.indexOf(
              "    " + v.name + `(职务：${v.position}，手机号：${v.mobile1})`
            ) === -1
          ) {
            this.insertData +=
              "    " + v.name + `(职务：${v.position}，手机号：${v.phone})`;
          }
        });

        setTimeout(()=>{
          this.content = this.content + this.insertData;
        },500)

      }
    },

    // 清空所有联系人
    delAll() {
      this.allSelectData = [];
      this.getAddresseeData = [];
      this.newAddresseeData = [];
      this.mailGroup = [];
      this.SMSGroup = [];
      this.emptyView = false;
    },
    // 详情试图

    detail() {},

    // 组合手机号和用户Id
    initData() {
      this.allSelectData.map(v => {
        this.allPhone.push(v.mobile1);
        this.checkIds += v.id + ",";
      });
      if (this.getAddresseePhone.length != 0 && this.allPhone.length != 0) {
        this.phone =
          this.allPhone.toString() + "," + this.getAddresseePhone.toString();
        this.userIds = this.checkIds + this.searchId.toString();
      } else if (
        this.getAddresseePhone.length == 0 &&
        this.allPhone.length != 0
      ) {
        this.checkIds = this.checkIds.substr(0, this.checkIds.length - 1);
        this.phone = this.allPhone.toString();
        this.userIds = this.checkIds;
      } else if (
        this.allPhone.length == 0 &&
        this.getAddresseePhone.length != 0
      ) {
        this.phone = this.getAddresseePhone.toString();
        this.userIds = this.searchId.toString();
      }
    },
    // 发送信息
    toSend() {
      this.getAddresseeData.map(v => {
        this.getAddresseePhone.push(v.phone);
        this.searchId.push(v.id);
      });

      this.initData();
      if (
       this.getAddresseeData.length === 0 && this.allSelectData.length === 0
      ) {
        this.$message.error("请添加联系人");
        return;
      } else if (this.$store.state.user.content == "") {
        this.$message.error("请填写内容");
        return;
      } else {
        this.$http({
          url: this.$http.adornUrl("/message/messageinfor/sendmessage"),
          method: "post",
          data: this.$http.adornData({
            content: this.$store.state.user.content,
            phone: this.phone,
            doWay: this.form.value ? 2 : this.form.radio,
            userIds: this.userIds,
            type: this.type,
            sendWay: this.sendWay ? 1 : 0,
            signature: this.form.signature,
            eventId: parseInt(this.event),
            doTime: this.form.doTime,
            doSpace: this.form.doSpace,
            doDatas: this.form.date
              ? this.form.date + " " + this.form.time
              : "",
            mailGroup: this.mailGroup.map(v => v.id),
            messageGroup: this.SMSGroup.map(v => v.id)
          })
        }).then(data => {
          // console.log('console.log7',data);
          if (data && data.data.code == "0") {
            this.$message({
              message: "发送成功",
              type: "success"
            });
            // if (this.status) {
            //   this.$http({
            //     url: this.$http.adornUrl("/duty/dutyLogMessage/messageSave"),
            //     method: "post",
            //     data: this.$http.adornData({
            //       remark: this.form.remarks,
            //       messageInforId: data.data.msgId
            //     })
            //   }).then(data => {
            //     // console.log(data);
            //     if (data && data.data.code == "0") {
            //     } else {
            //       this.$message.error("关联日志失败");
            //     }
            //   });
            // }
            this.phone = "";
            this.userIds = "";
            this.checkIds = "";
            this.allPhone = [];
            this.getAddresseePhone = [];
            this.searchId = [];
            this.getAddresseeData = [];
            this.newAddresseeData = [];
            this.content = "";

            this.form.doTime = "";
            this.form.doSpace = "";
            this.form.date = "";
            this.form.time = "";
            this.form.remarks = "";

            this.getSMSNum();
          } else {
            this.$message.error(data.data.msg);
          }
        });
      }
    },

    // 存为模板
    saveTemplateHandle() {
      if (this.$store.state.user.content) {
        this.$refs.saveTemplateView.getDataList(this.$store.state.user.content);
      } else {
        this.$message({
          type: "error",
          message: "请输入内容"
        });
      }
    },

    // 草稿
    smsDraftViewHandle() {
      this.smsDraftView = true;
      this.$nextTick(() => {
        this.$refs.smsDraftView.init(
          this.$store.state.user.content,
          this.value,
          this.newAddresseeData
        );
      });
    },

    // 查看和修改模板
    templateHandle() {
      this.$refs.seeOrUpdataTemplateView.getDataList();
    },

    checkChanged(type) {
      if (type === "0") {
        this.doWay = 1;
        this.timing = false;
        this.call = true;
        this.$forceUpdate();
      } else if (type === "1") {
        this.doWay = 2;
        this.timing = true;
        this.call = false;
        this.$forceUpdate();
      }
    },
    //短信设置
    SMSSet() {
      this.detailView = true;
      this.getTime();
    },
    // 短信类型
    smsType(value) {
      this.type = value;
    },
    // 存为分组
    saveGroupHandle() {
      // console.log(
      //   "this.value+++++++++++++++++++++++++++++++++++++++++++++",
      //   this.value
      // );
      // console.log(
      //   "this.newAddresseeData+++++++++++++++++++++++++++++++++++++++++++++",
      //   this.newAddresseeData
      // );
      
      if (this.getAddresseeData.length > 0 || this.allSelectData.length>0) {
        this.initData();
        this.$refs.saveGroupView.getDataList(
          this.$store.state.user.content,
          this.allSelectData.filter(v=>v.check),
          this.getAddresseeData.filter(v=>v.check),
          this.phone,
          this.userIds,
          this.mailGroup,
          this.SMSGroup
        );
      } else {
        this.$message.error("请添加收信人");
      }
    },
    // 复选框点击人员触发行为
    setListCheck(idx) {
      var check = this.allSelectData[idx].check;
      this.allSelectData[idx].check = check === true ? false : true;
      this.$forceUpdate();
    },
    // 输入框点击人员触发行为
    checkStatus(idx) {
      // console.log(this.getAddresseeData);
      var check = this.getAddresseeData[idx].check;
      this.getAddresseeData[idx].check = check === true ? false : true;
      this.$forceUpdate();
    },
    // 关联日志
    journal(value) {
      this.status = value;
    },
    // 存为草稿
    saveDraft() {
      this.initData();
      this.$http({
        url: this.$http.adornUrl("/message/messagedraft/savedarft"),
        method: "post",
        data: this.$http.adornData({
          phone: this.phone,
          userIds: this.userIds,
          mailGroup: this.mailGroup.map(v => v.id),
          messageGroup: this.SMSGroup.map(v => v.id),
          content: this.$store.state.user.content
        })
      }).then(data => {
        // console.log('console.log8',data);
        if (data && data.data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          bus.$emit("initDrafts")
        }else {
          this.$message.error(data.data.msg);
        }
      });
    },
    // 添加事件关联人员
    addEventHandle() {
      this.$refs.addEventView.init();
    },
    // 选中通讯录组员
    addressHandle(idx) {
      var check = this.mailGroup[idx].check;
      this.mailGroup[idx].check = check === true ? false : true;
      this.$forceUpdate();
    },
    // 选中短信组员
    SMSHandle(idx) {
      var check = this.SMSGroup[idx].check;
      this.SMSGroup[idx].check = check === true ? false : true;
      this.$forceUpdate();
    },
    // 通讯录单个删除
    delOneAddress(idx){
      this.mailGroup.splice(idx,1)
    },
    //短信单个删除
    delOneSMS(idx){
      this.SMSGroup.splice(idx,1)
    },
    // 复选框联系人单个删除
    delOneList(idx){
      this.allSelectData.splice(idx,1) //触发删除，下次添加数据时才是新增
      this.currentCheck  = this.allSelectData
      this.$emit('initData')
    },
    // 输入框收信人单个删除
    delOneCheck(idx){
      this.getAddresseeData.splice(idx,1)
      this.newAddresseeData.splice(idx,1)
      this.$emit('initData')
      // console.log('this.getAddresseeData: ', this.getAddresseeData);
    },
    // 获取事件关联人员
    getEventContact(val){ 
      val.map(v=>v.messageInforEntityList.map(item=> {this.getAddresseeData.push(item)}))
      // console.log(this.getAddresseeData)
    },
    // 过滤选中的数据
    delRepy(filterData){
      for (let i = 0; i < filterData.length; i++) {
          if (filterData[i] === undefined) {
            filterData.splice(i, 1)
            i = i - 1          // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位
          }
        }
        return filterData
    },
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
ul {
  padding: 0;
}
.border {
  border: 1px solid #0091FF !important;
}
.bgc {
  background-color: #0091FF !important;
  color: white;
}
.color {
  color: black !important;
}
.button {
  height: 35px;
  border-radius: 5px;
  background: #0091FF;
  color: #d1f9fb;
  border: none;
  font-size: 12px;
  border: 1px solid lightblue;
  padding: 0 15px;
  box-sizing: border-box;
}
.num{
  color: #0091FF;
  margin-left: 10px;
}
.serchWrap {
  padding: 0px 10px;
  height: 50px;
  // min-height: 60px;
  // height: 7vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  border-bottom: 1px solid rgba(229, 229, 229, 1);
  .addressee {
    font-size: 15px;
    font-family: MicrosoftYaHei;
    color: black;
    font-weight: bold;
    // &::before {
    //   display: inline-block;
    //   content: "";
    //   width: 2px;
    //   height: 14px;
    //   vertical-align: middle;
    //   background-color: #0091FF;
    //   margin-right: 5px;
    // }
  }
  div {
    span {
      display: inline-block;
      min-width: 72px;
      font-size: 18px;
      color: #f4f4f4;
      line-height: 36px;
    }
    input {
      width: 70%;
      height: 35px;
      border-radius: 5px;
      background: rgb(14, 142, 190);
      color: #fff;
      border: none;
      font-size: 12px;
      border: 1px solid lightblue;
      padding: 0 10px;
      box-sizing: border-box;
    }
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  .add {
    min-width: 59px;
    height: 35px;
    border-radius: 5px;
    background: #0091FF;
    color: #d1f9fb;
    border: none;
    font-size: 12px;
    border: 1px solid lightblue;
    margin: 0 5px;
    /*font-family: "KatTi";*/
    /*letter-spacing: 5px;*/
  }
  .addEvent {
    min-width: 140px;
    height: 35px;
    border-radius: 5px;
    background: #0091FF;
    color: #d1f9fb;
    border: none;
    font-size: 12px;
    border: 1px solid lightblue;
  }
}

// 添加事件关联人员
.search {
  display: flex;
  align-items: center;
  .searchWrap {
    padding: 16px 0px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .searchIcon {
      width: 24px;
      position: absolute;
      top: 23px;
      left: 4px;
      z-index: 1;
    }
    /deep/ .el-input--medium .el-input__inner {
      padding-left: 30px;
    }
    /deep/ input::-webkit-input-placeholder {
      // padding-left: 20px;
    }
  }
}

.main {
  list-style: none;
  margin: 0;
  height: 276px;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
  .main-video {
    .audio-name {
      display: flex;
      .img-l {
        margin: 0 40px 0 10px;
      }
      .img-r {
        .iconfont {
          width: 16px;
        }
      }
    }
  }
}

.groupList {
  list-style: none;
  padding: 0 10px;
  display: flex;
  height: 39px;
  flex-wrap: wrap;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }

  .oneGroupList {
    width: 150px;
    height: 25px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #ccc;
    padding: 8px;
    align-items: center;
    border-radius: 3px;
    .workUnit {
      width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-weight: bold;
    }
    .totalCount {
    }
  }
}
.file {
  width: 22px;
  height: 20px;
}

.group {
  // margin-left: 30px;
  .groupTitle {
    margin: 10px 0;
  }
  .groupClassifiy {
    display: flex;
    align-items: center;
    .del {
      width: 18px;
      height: 18px;
      vertical-align: text-bottom;
    }
  }
}

.groupClassifiy {
  // padding: 12px;
  .lianxiren {
    font-size: 18px;
    width: 100%;
    // height: 23vh;
    // min-height: 220px;
    height: 160px;
    background-color: #fff;
    margin-left: 10px;
    box-sizing: border-box;
    .contacts {
      height: 100%;
      border-radius: 5px;
      list-style: none;
      overflow-x: scroll;
      &::-webkit-scrollbar {
        width: 0 !important;
        height: 0;
      }
      div {
        display: flex;
        flex-wrap: wrap;
        li {
          min-width: 80px;
          border: 1px solid #ccc;
          font-size: 15px;
          box-sizing: border-box;
          margin: 3px;
          border-radius: 3px;
          padding: 5px;
          .info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name {
              display: inline-block;
              min-width: 45px;
              text-align: center;
              // overflow: hidden;
              // text-overflow: ellipsis;
              // white-space: nowrap;
              font-size: 12px;
              color: #666;
            }
          }
          .opration {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 5px;
            .phone {
              line-height: 20px;
              color: rgba(216, 216, 216, 1);
            }
          }
        }
      }
      // display: flex;
      // flex-wrap: wrap;
    }
  }

  .process {
    font-size: 18px;
    width: 100%;
    // height: 29.8vh;
    // min-height: 287px;
    // min-height: 287px;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px 10px 0px;
    box-sizing: border-box;
    // margin: 5px 0 0px;
  }

  .outDuanxin {
    box-sizing: border-box;
    .duanxin {
      padding-left: 10px;
      box-sizing: border-box;
      width: 100%;
      height: 65.5px;
      // min-height: 35px;
      border-radius: 3px;
      border: none;
      border: 1px solid #ddd;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .operation {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    // .num {
    //   font-size: 0.8vw;
    //   color: #444;
    // }
  }
  .configure {
    button {
      padding: 0 10px;
      margin-right: 5px;
    }
  }
}
.number {
  font-size: 12px;
  background: rgba(254, 255, 233, 1);
  height: 20px;
  line-height: 20px;
}

.sign {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  font-size: 14px;
  // padding: 0 10px;
  box-sizing: border-box;
  p {
    margin: 0;
  }
}
.delCheck {
}

.send {
  height: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .detail {
    padding: 0 25px;
    height: 35px;
    background-color: #0091FF;
  }
  .remind {
    // padding: 8px 0px;
    font-size: 12px;
    color: rgba(226, 226, 226, 1);
  }
  // button {
  //   width: 70px;
  //   height: 40px;
  //   background-color: #0091FF;
  //   font-size: 12px;
  //   padding: 0;
  // }
}

footer {
  margin-top: 10px;
  border: 1px solid #ddd;
  height: 40px;
  color: #444;
  display: flex;
  line-height: 40px;
  .tip {
    width: 90%;
    text-align: center;
  }
  .help {
    width: 10%;
    text-align: center;
  }
}

// /deep/ .el-timeline-item__tail {
//   position: absolute;
//   left: 23px;
//   height: 100%;
//   border-left: 2px solid #0091FF;
// }

/deep/ .el-timeline .el-timeline-item:first-child .el-timeline-item__tail {
  top: 35px;
}

/deep/ .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  height: 60%;
}

/deep/ .el-timeline-item__node--normal {
  top: 25px;
  left: 18px;
  width: 12px;
  height: 12px;
}

// /deep/ .el-timeline-item__node {
//   position: absolute;
//   background-color: #0091FF;
//   border-radius: 50%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

/deep/ .el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  box-shadow: none;
}
/deep/ .el-card {
  border: none;
  background-color: none;
  color: none;
}

// /deep/ .el-input--medium .el-input__inner {
//   height: 30px;
// }

.el-select-dropdown__item {
  padding: 0 20px !important;
}

// /deep/ .el-button {
//   border: 1px solid #0091FF;
//   color: #0091FF !important;
//   width: 69px;
//   height: 30px;
//   line-height: 4px;
//   text-align: center;
//   font-size: 13px;
//   padding: 0;
//   &:hover {
//     border: none;
//     color: white !important;
//     background-color: #0091FF;
//   }
// }

/deep/ .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: #0091FF !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    text-align: center !important;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: #d1f9fb;
      }
    }
    span {
      color: #d1f9fb;
    }
  }
  /deep/ .el-dialog--center .el-dialog__body {
    // padding: 15px 0;
    padding: 10px 18px 30px;
  }
  // /deep/.el-button--primary {
  //   background-color: #0091FF;
  //   border: 1px solid #0091FF;
  // }
}

/deep/ .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0091FF;
  border-color: #0091FF;
}
/deep/ .el-checkbox .el-checkbox__inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  &::after {
    border-width: 3px;
    height: 9px;
    width: 4px;
  }
}
// /deep/ .el-button:focus, .el-button:hover{
//   color:white !important;
// }
</style>
