/**
 * @author tanjinfeng
 * @date 2020-11-05
 * @desc 垃圾分类-巡查统计页面
 */

<template>
    <div class="patrol-statistics">
        <sv-template
            ref="template"
            title="巡查统计"
            :treeSetting="treeSetting"
            @tree-click="handleTreeClick"
            :tableRequest="tableRequest"
            @table-request="getStat($event)"
            :searchSetting="{
                width: '290px',
                placeholder: '请输入分类点名称、巡查人姓名关键字'
            }"
            :export-select-config="{
                api: '/garbage/garbageInvestigationInstance/xlsOutputSelect',
                params: {}
            }"
            :export-query-config="{
                api: '/garbage/garbageInvestigationInstance/xlsOutputCondition',
                params: {}
            }"
        >
            <template #middle__operation__select>
                <input id="party" type="checkbox" style="cursor:pointer;" @change="partyCheck">
                <label class="is-party" for="party">党员巡查</label>
                <sv-select
                    v-model="tableRequest.params.sortPoint"
                    placeholder="选择分类点"
                    :options="classificationSiteListOptions"
                    @change="getTableList"
                    :filter="true"
                />
                <sv-select
                    v-model="tableRequest.params.town"
                    placeholder="选择社区"
                    :options="communityListOptions"
                    @change="getTableList"
                />
                <sv-select
                    v-model="tableRequest.params.result"
                    placeholder="选择巡查结果"
                    :options="patrolResultOptions"
                    @change="getTableList"
                />
            </template>
            <template #middle__statistics>
                <div class="patrol-statistics__stat">
                    <div>
                        <div>{{stat.investigationAll ? stat.investigationAll : '0'}}</div>
                        <div>巡查总数</div>
                    </div>
                    <div>
                        <div>{{stat.investigationUnusual ? stat.investigationUnusual : '0'}}{{stat.investigationUnusualPercent ? `（${(100 * Number(stat.investigationUnusualPercent)).toFixed(2)}%）` : ''}}</div>
                        <div>巡查异常数</div>
                    </div>
                    <div>
                        <div>{{stat.isPartyInvestigationCount ? stat.isPartyInvestigationCount : '0'}}{{stat.isPartyInvestigationCountPercent ? `（${(100 * Number(stat.isPartyInvestigationCountPercent)).toFixed(2)}%）` : ''}}</div>
                        <div>党员巡查数</div>
                    </div>
                    <div>
                        <div>{{stat.memberCount ? stat.memberCount : '0'}}</div>
                        <div>巡查总人数</div>
                    </div>
                    <div>
                        <div>{{stat.isPartyMemberCount ? stat.isPartyMemberCount : '0'}}{{stat.isPartyMemberCountPercent ? `（${(100 * Number(stat.isPartyMemberCountPercent)).toFixed(2)}）` : ''}}</div>
                        <div>党员巡查人数</div>
                    </div>
                    <div>
                        <div>{{stat.unusualReportCount ? stat.unusualReportCount : '0'}}</div>
                        <div>异常上报数</div>
                    </div>
                    <div>
                        <div>{{stat.isPartyUnusualReportCount ? stat.isPartyUnusualReportCount : '0'}}{{stat.isPartyUnusualReportCountPercent ? `（${(100 * Number(stat.isPartyUnusualReportCountPercent)).toFixed(2)}）` : ''}}</div>
                        <div>党员异常上报数</div>
                    </div>
                </div>
            </template>
            <template #middle__table>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="分类点名称"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.sortPointName" :style="scope.row.unusual ? 'color:#F66E6E!important;' : ''"/>
                        <div v-if="scope.row.unusual" :style="scope.row.unusual ? 'color:#F66E6E!important;' : ''">出现异常</div>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="所属社区"
                    prop="townName"
                />
                <el-table-column
                    header-align="center"
                    align="center"
                    label="巡查时间"
                    prop="investigationTime"
                />
                <el-table-column
                    header-align="center"
                    align="center"
                    label="巡查人"
                    prop="memberEntity.name"
                >
                    <template slot-scope="scope">
                        <span style="display:flex;justify-content:center;align-items:center;">
                            <span>{{scope.row.memberEntity ? scope.row.memberEntity.name : ''}}</span>
                            <img height="22" v-if="scope.row.memberEntity && scope.row.memberEntity.isParty == 1" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NjUxNzY5ODgzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY0MzYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMi41NTY2NzEgMTI5Ljc0NDAyNmMxOTcuNDIxNTQ4IDc0LjA1NjU5IDMxNy4yMTcxMjcgMzEwLjc3Njg5MyAyMTQuNTkyOTA2IDUwMi41NzU4NTRMNDc2LjcxMjU3MyAzODAuNjE0NzM1bDk1LjU5OTM4NC05NS45NjYxMzUtNTkuNzg5MjYzLTU5LjUyMjA0NGMtMzIuOTkwMDMzIDMyLjMyMjQ4NS04NS40MjA0ODUgMzkuMjEzODEzLTEyMC43Nzk5MTEgMjQuOTYzNDc1bC0xOTAuMzQ3NTQ0IDE5MC41MzA4MiAxMDcuNzk3NzEzIDEwNy40MzAzNjIgNzEuODUzNjgzLTcxLjU4Njg2NCAyNTAuMzUzMDYxIDI1MS4yODc0MjdjLTEyMi41MTQ1MzUgNjcuMjk4MTcyLTI5Mi4zMzc1OTUgNDYuMDg5NTUxLTQxNy42NzI4MTgtODQuMTUxNzQ1bC02MC42OTAyNTIgNjAuNTIzNzY1YzE4LjE4ODY2OCAyNS4yMTM5MDUgMzMuNDIzNzM5IDQ4LjA1ODIxNyA1Mi4zNjMyOTggNjcuMjE0MjI5LTEuNjUxODggMS45ODU2NTQtNi44NTgzNSA2LjI1Nzc1Ny02Ljk1ODI4MiA2LjM3NDY3OC0zLjE4NzQzOS0wLjUxNzY0OS02Ljk1ODI4Mi0xLjc1MTgxMi0xMC4zMTI0MDgtMS43NTE4MTItMzIuMjg5MTA4IDAtNTguMzcwODI1IDI4LjExNjczNy01OC4zNzA4MjUgNjAuNDM5ODIyIDAgMzIuMjcyMTIgMjYuMzMyMTQ3IDU4LjYwNDA2NiA1OC42MjEwNTUgNTguNjA0MDY2IDMyLjMwNjA5NiAwIDU5LjkzOTE2MS0yNi41NjU3ODggNTkuOTM5MTYxLTU4Ljg3MDg4NiAwLTMuNzcxNDQzLTAuODUwODIzLTcuMjA5MTEyLTEuNTAxOTgyLTEwLjc2MzcwMmw5LjMyODA3Ni05LjE2MDc4OWMxNDQuMDkxNTA2IDk3LjIxNzg4NiAzMDIuMDE2NDMzIDEwOS4zMzI0NzMgNDcxLjkzODgyNSA3LjYwODg0MWw3MC4xNjgyMjYgNzAuNDUyMDM0IDk2LjA0OTY3OC05NC43ODE1MzgtNzAuNjE4OTItNzEuMzg2NEMxMDI2LjM0NTkyMSA0MjIuNTY1NjkyIDc1Ni4xMTc5MzYgMTIyLjQzNTM4MSA1MTIuNTU2NjcxIDEyOS43NDQwMjZMNTEyLjU1NjY3MSAxMjkuNzQ0MDI2IDUxMi41NTY2NzEgMTI5Ljc0NDAyNnoiIHAtaWQ9IjY0MzciIGZpbGw9IiNGRjAwMDAiPjwvcGF0aD48L3N2Zz4=" alt>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="巡查结果"
                    width="170px"
                >
                    <template slot-scope="scope">
                        <img height="22" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMjE8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW3oeafpeiusOW9lSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExODUuMDAwMDAwLCAtMjIwLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0LjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzguMDAwMDAwLCAxMDUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iuato+W4uCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzE0LjAwMDAwMCwgMTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDggQzAsMTIuNDE4Mjc4IDMuNTgxNzIyLDE2IDgsMTYgQzEyLjQxODI3OCwxNiAxNiwxMi40MTgyNzggMTYsOCBDMTYsMy41ODE3MjIgMTIuNDE4Mjc4LDAgOCwwIEMzLjU4MTcyMiwwIDAsMy41ODE3MjIgMCw4IFoiIGlkPSJTaGFwZSIgZmlsbD0iIzE5QkU2QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNi40LDExLjA4NTcxNDMgQzYuMjg1NzE0MjgsMTEuMDg1NzE0MyA2LjA1NzE0Mjg2LDEwLjk3MTQyODYgNS45NDI4NTcxNCwxMC44NTcxNDI5IEwzLjMxNDI4NTcyLDggQzMuMiw3Ljc3MTQyODU4IDMuMiw3LjQyODU3MTQyIDMuNDI4NTcxNDIsNy4yIEMzLjY1NzE0Mjg0LDYuOTcxNDI4NTggNCw2Ljk3MTQyODU4IDQuMjI4NTcxNDIsNy4yIEw2LjUxNDI4NTcyLDkuNzE0Mjg1NzIgTDExLjg4NTcxNDMsNS4wMjg1NzE0MiBDMTIuMTE0Mjg1Nyw0LjggMTIuNDU3MTQyOSw0LjggMTIuNjg1NzE0Myw1LjAyODU3MTQyIEMxMi45MTQyODU3LDUuMjU3MTQyODQgMTIuOTE0Mjg1Nyw1LjYgMTIuNjg1NzE0Myw1LjgyODU3MTQyIEw2Ljg1NzE0Mjg2LDEwLjk3MTQyODYgQzYuNzQyODU3MTQsMTAuOTcxNDI4NiA2LjYyODU3MTQ0LDExLjA4NTcxNDMgNi40LDExLjA4NTcxNDMgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" alt>
                        {{scope.row.usual ? scope.row.usual : 0}}
                        &nbsp;&nbsp;
                        <img height="22" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMzA8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW3oeafpeiusOW9lSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyMzcuMDAwMDAwLCAtMjIwLjAwMDAwMCkiIGZpbGw9IiNGQTdFN0UiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0LjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzguMDAwMDAwLCAxMDUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IuW8guW4uCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzY1LjAwMDAwMCwgMTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNy42NzQ5NTE0LDEyLjE3MTYzODcgTDEwLjUxNjM0NTYsMC44MTkzMTcwMTcgQzEwLjE4MDk5MjgsMC4zMDg3MjcxMDMgOS42MTEwOTgyMywwLjAwMTIyODk0NDA2IDkuMDAwMTYxMTYsMC4wMDEyMjg5NDQwNiBDOC4zODkyMjQwOSwwLjAwMTIyODk0NDA2IDcuODE5MzI5NTYsMC4zMDg3MjcxMDMgNy40ODM5NzY3NSwwLjgxOTMxNzAxNyBMMC4zMjUzNzA4ODcsMTIuMTcxNjM4NyBDLTAuNTEwOTUzNjY4LDEzLjQyMTc3ODUgMC4zNjI3NTYyNTEsMTUuMTE5MDg5MSAxLjg0MTU1NTMsMTUuMTE5MDg5MSBMMTYuMTU4NzY3LDE1LjExOTA4OTEgQzE3LjYzNzU2NjEsMTUuMTE5MDg5MSAxOC41MTEyNzYsMTMuNDIxNzc4NSAxNy42NzQ5NTE0LDEyLjE3MTYzODcgTDE3LjY3NDk1MTQsMTIuMTcxNjM4NyBaIE03Ljg4NTUyMzMxLDQuNjkxNTY2MjUgQzcuODg1NTIzMzEsNC41MzkyNzkgOC4wMDczNzE5Miw0LjQxNDY4MDM3IDguMTU2OTEzMzksNC40MTQ2ODAzNyBMOS44NDM0MDg5Myw0LjQxNDY4MDM3IEM5Ljk5Mjk1MDQsNC40MTQ2ODAzNyAxMC4xMTM0MTQ0LDQuNTM5Mjc5MDIgMTAuMTEzNDE0NCw0LjY5MTU2NjI1IEwxMC4xMTM0MTQ0LDUuODM1MTA1MDEgTDkuODMyMzMxNzgsOS42NjQ0MzY5NCBDOS44MjM2MDYwOCw5LjgwNzQ3Njk4IDkuNzA1NjQ5MzksOS45MTkzNjczMyA5LjU2MjMyNjM0LDkuOTIwNTU2MzkgTDguNDM3OTk1OTgsOS45MjA1NTYzOSBDOC4yOTQ2NzI5Miw5LjkxOTM2NzMzIDguMTc2NzE2MjQsOS44MDc0NzY5OCA4LjE2Nzk5MDU0LDkuNjY0NDM2OTQgTDcuODg2OTA3OTUsNS44MzUxMDUwMSBMNy44ODY5MDc5NSw0LjY5MTU2NjI1IEw3Ljg4NTUyMzMxLDQuNjkxNTY2MjUgWiBNOS4wMDAxNjExNywxMy4zNzc0NzY4IEM4LjY1NjQyNjExLDEzLjM3MzQ2MTUgOC4zMjgzNjc2MSwxMy4yMzMwNzE0IDguMDg4MTY2ODYsMTIuOTg3MTk1NyBDNy44NDc5NjYxMSwxMi43NDEzMjAxIDcuNzE1MzAyNzYsMTIuNDEwMTAzNSA3LjcxOTM2NjExLDEyLjA2NjQyMjEgQzcuNzE5MzY2MTEsMTEuMzQyMzY1NSA4LjI5MjYwODQzLDEwLjc1Mzk4MjkgOS4wMDAxNjExNywxMC43NTM5ODI5IEM5LjcwNjMyOTI1LDEwLjc1Mzk4MjkgMTAuMjgwOTU2MiwxMS4zNDIzNjU1IDEwLjI4MDk1NjIsMTIuMDY2NDIyMSBDMTAuMjg1MDE5NiwxMi40MTAxMDM1IDEwLjE1MjM1NjIsMTIuNzQxMzIwMSA5LjkxMjE1NTQ3LDEyLjk4NzE5NTcgQzkuNjcxOTU0NzIsMTMuMjMzMDcxNCA5LjM0Mzg5NjIyLDEzLjM3MzQ2MTUgOS4wMDAxNjExNywxMy4zNzc0NzY4IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+" alt>
                        {{scope.row.unusual ? scope.row.unusual : 0}}
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="操作"
                    width="80px"
                >
                    <template slot-scope="scope">
                        <sv-table-operation
                            :display="['view']"
                            @view="openViewDialog(scope.row.id)"
                        ></sv-table-operation>
                    </template>
                </el-table-column>
            </template>
        </sv-template>
        <!-- 查看弹窗 -->
        <ViewDialog ref="ViewDialog"/>
    </div>
</template>

<script>
import ViewDialog from './ViewDialog'
export default {
    name: 'PatrolStatistics',
    components: {
        ViewDialog
    },
    data() {
        return {
            // 树形接口
            treeSetting: {
                api: '/garbage/garbageSortpointGroup/list',
                edit: false
            },
            // 表格数据接口
            tableRequest: {
                api: '/garbage/garbageInvestigationInstance/recordList',
                params: {
                    groupIds: [],
                    town: '',
                    villageType: '',
                    launchType: '',
                    delegating: '',
                    sortPoint: '',
                    result: '',
                    isParty: ''
                }
            },
            // 分类点列表选项
            classificationSiteListOptions: [],
            // 小区列表选项
            communityListOptions: [],
            // 巡查结果选项
            patrolResultOptions: [{
                label: '正常',
                value: '1'
            }, {
                label: '异常',
                value: '2'
            }],
            // 统计数据
            stat: {}
        }
    },
    methods: {
        /**
         * @method
         * @desc 获取表格数据
         */
        getTableList() {
            this.$refs.template.getTableList(this.tableRequest)
        },
        /**
         * @method
         * @desc 点击树形，获取表格数据
         */
        handleTreeClick(data, tabIndex) {
            this.tableRequest.params.groupIds = data ? [data.id] : []
            this.getTableList()
        },
        /**
         * @method
         * @desc 获取分类点列表
         */
        getClassificationSiteList() {
            const request = {
                method: 'post',
                url: '/garbage/garbageSortPoint/list',
                baseURL: window.SITE_CONFIG.baseUrl,
                data: {
                    page: 1,
                    limit: 100
                }
            }
            this.$http(request).then(res => {
                if (res.data.code == 0) {
                    this.classificationSiteListOptions = res.data.page.list.map(e => ({
                        label: e.name,
                        value: e.id
                    }))
                }
            })
        },
        /**
         * @method
         * @desc 获取小区列表
         */
        getCommunityList() {
            this.$http.get(`${window.SITE_CONFIG.baseUrl}/sys/systown/list`)
            .then(response => {
                if(response.data.code === 0) {
                    let options = []
                    response.data.list.forEach(item => {
                        options.push({
                            label: item.townName,
                            value: item.id
                        })
                    })
                    this.communityListOptions = options
                } else {
                    console.log('获取小区列表数据失败！错误信息：【\n', response, '\n】')
                }
            })
            .catch(error => {
                console.log('获取小区列表数据失败！错误信息：【\n', error, '\n】')
            })
        },
        /**
         * @method
         * @desc 打开查看弹窗
         * @param {Number} id 表格项id
         */
        openViewDialog(id) {
            this.$refs.ViewDialog.init(id)
        },
        /**
         * @method
         * @desc 是否党员勾选，请求表格数据
         */
        partyCheck() {
            this.tableRequest.params.isParty == '1' ? this.tableRequest.params.isParty = '' : this.tableRequest.params.isParty = '1'
            this.getTableList()
        },
        /**
         * @method
         * @desc 获取统计数据
         * @param {Object} data 请求参数
         */
        getStat(data) {
            const request = {
                method: 'post',
                url: '/garbage/garbageInvestigationInstance/recordCount',
                baseURL: window.SITE_CONFIG.baseUrl,
                data
            }
            this.$http(request).then(res => {
                if (res.data.code == 0) {
                    this.stat = res.data.data
                }
            })
        }
    },
    mounted() {
        this.getClassificationSiteList()
        this.getCommunityList()
    }
}
</script>

<style lang="scss" scoped>
.patrol-statistics {
    .is-party {
        font-size: 14px;
        cursor: pointer;
        margin-right: 10px;
        user-select: none;
        &:hover {
            color: #0091ff;
        }
    }
    &__stat {
        display: flex;
        justify-content: center;
        text-align: center;
        & > div {
            position: relative;
            padding: 5px 15px;
            flex-grow: 1;
            flex-shrink: 0;
            &:not(:last-child):after {
                content: '';
                display: block;
                position: absolute;
                width: 1px;
                height: 20px;
                background: #F0F0F0;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
            & > div:first-child {
                color: #333333;
                font-weight: bold;
                font-size: 20px;
            }
            & > div:last-child {
                color: #999999;
                font-weight: normal;
                font-size: 14px;
            }
        }
    }
}
</style>