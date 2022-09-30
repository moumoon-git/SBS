<template>
    <sv-dialog
        ref="dialog"
        @cancel="$refs.dialog.visible = false"
        @modal="$refs.dialog.visible = false"
        :title="title"
    >
        <div
            class="patrol-statistics-dialog"
            v-loading="loading"
            element-loading-spinner="sv-loading"
        >
            <div
                class="patrol-statistics-dialog__header"
            >
                <span class="patrol-statistics-dialog__label">巡查时间：</span>
                <span style="margin-right:40px;color:#333333;">{{data.investigationTime ? data.investigationTime : '-'}}</span>

                <span class="patrol-statistics-dialog__label">巡查人：</span>
                <span style="color:#0091FF;">{{data.memberEntity && data.memberEntity.name ? data.memberEntity.name : '-'}}</span>
                <img height="22" v-if="data.memberEntity && data.memberEntity.isParty == 1" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NjUxNzY5ODgzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY0MzYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMi41NTY2NzEgMTI5Ljc0NDAyNmMxOTcuNDIxNTQ4IDc0LjA1NjU5IDMxNy4yMTcxMjcgMzEwLjc3Njg5MyAyMTQuNTkyOTA2IDUwMi41NzU4NTRMNDc2LjcxMjU3MyAzODAuNjE0NzM1bDk1LjU5OTM4NC05NS45NjYxMzUtNTkuNzg5MjYzLTU5LjUyMjA0NGMtMzIuOTkwMDMzIDMyLjMyMjQ4NS04NS40MjA0ODUgMzkuMjEzODEzLTEyMC43Nzk5MTEgMjQuOTYzNDc1bC0xOTAuMzQ3NTQ0IDE5MC41MzA4MiAxMDcuNzk3NzEzIDEwNy40MzAzNjIgNzEuODUzNjgzLTcxLjU4Njg2NCAyNTAuMzUzMDYxIDI1MS4yODc0MjdjLTEyMi41MTQ1MzUgNjcuMjk4MTcyLTI5Mi4zMzc1OTUgNDYuMDg5NTUxLTQxNy42NzI4MTgtODQuMTUxNzQ1bC02MC42OTAyNTIgNjAuNTIzNzY1YzE4LjE4ODY2OCAyNS4yMTM5MDUgMzMuNDIzNzM5IDQ4LjA1ODIxNyA1Mi4zNjMyOTggNjcuMjE0MjI5LTEuNjUxODggMS45ODU2NTQtNi44NTgzNSA2LjI1Nzc1Ny02Ljk1ODI4MiA2LjM3NDY3OC0zLjE4NzQzOS0wLjUxNzY0OS02Ljk1ODI4Mi0xLjc1MTgxMi0xMC4zMTI0MDgtMS43NTE4MTItMzIuMjg5MTA4IDAtNTguMzcwODI1IDI4LjExNjczNy01OC4zNzA4MjUgNjAuNDM5ODIyIDAgMzIuMjcyMTIgMjYuMzMyMTQ3IDU4LjYwNDA2NiA1OC42MjEwNTUgNTguNjA0MDY2IDMyLjMwNjA5NiAwIDU5LjkzOTE2MS0yNi41NjU3ODggNTkuOTM5MTYxLTU4Ljg3MDg4NiAwLTMuNzcxNDQzLTAuODUwODIzLTcuMjA5MTEyLTEuNTAxOTgyLTEwLjc2MzcwMmw5LjMyODA3Ni05LjE2MDc4OWMxNDQuMDkxNTA2IDk3LjIxNzg4NiAzMDIuMDE2NDMzIDEwOS4zMzI0NzMgNDcxLjkzODgyNSA3LjYwODg0MWw3MC4xNjgyMjYgNzAuNDUyMDM0IDk2LjA0OTY3OC05NC43ODE1MzgtNzAuNjE4OTItNzEuMzg2NEMxMDI2LjM0NTkyMSA0MjIuNTY1NjkyIDc1Ni4xMTc5MzYgMTIyLjQzNTM4MSA1MTIuNTU2NjcxIDEyOS43NDQwMjZMNTEyLjU1NjY3MSAxMjkuNzQ0MDI2IDUxMi41NTY2NzEgMTI5Ljc0NDAyNnoiIHAtaWQ9IjY0MzciIGZpbGw9IiNGRjAwMDAiPjwvcGF0aD48L3N2Zz4=" alt>

                <span class="patrol-statistics-dialog__label" style="margin-left:40px;">巡查结果：</span>
                <img height="22" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMjE8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW3oeafpeiusOW9lSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExODUuMDAwMDAwLCAtMjIwLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0LjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzguMDAwMDAwLCAxMDUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iuato+W4uCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzE0LjAwMDAwMCwgMTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDggQzAsMTIuNDE4Mjc4IDMuNTgxNzIyLDE2IDgsMTYgQzEyLjQxODI3OCwxNiAxNiwxMi40MTgyNzggMTYsOCBDMTYsMy41ODE3MjIgMTIuNDE4Mjc4LDAgOCwwIEMzLjU4MTcyMiwwIDAsMy41ODE3MjIgMCw4IFoiIGlkPSJTaGFwZSIgZmlsbD0iIzE5QkU2QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNi40LDExLjA4NTcxNDMgQzYuMjg1NzE0MjgsMTEuMDg1NzE0MyA2LjA1NzE0Mjg2LDEwLjk3MTQyODYgNS45NDI4NTcxNCwxMC44NTcxNDI5IEwzLjMxNDI4NTcyLDggQzMuMiw3Ljc3MTQyODU4IDMuMiw3LjQyODU3MTQyIDMuNDI4NTcxNDIsNy4yIEMzLjY1NzE0Mjg0LDYuOTcxNDI4NTggNCw2Ljk3MTQyODU4IDQuMjI4NTcxNDIsNy4yIEw2LjUxNDI4NTcyLDkuNzE0Mjg1NzIgTDExLjg4NTcxNDMsNS4wMjg1NzE0MiBDMTIuMTE0Mjg1Nyw0LjggMTIuNDU3MTQyOSw0LjggMTIuNjg1NzE0Myw1LjAyODU3MTQyIEMxMi45MTQyODU3LDUuMjU3MTQyODQgMTIuOTE0Mjg1Nyw1LjYgMTIuNjg1NzE0Myw1LjgyODU3MTQyIEw2Ljg1NzE0Mjg2LDEwLjk3MTQyODYgQzYuNzQyODU3MTQsMTAuOTcxNDI4NiA2LjYyODU3MTQ0LDExLjA4NTcxNDMgNi40LDExLjA4NTcxNDMgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" alt>
                <span style="color:#666666;">正常：{{data.usual ? data.usual : 0}}</span>
                &nbsp;&nbsp;
                <img height="22" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMzA8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW3oeafpeiusOW9lSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyMzcuMDAwMDAwLCAtMjIwLjAwMDAwMCkiIGZpbGw9IiNGQTdFN0UiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0LjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzguMDAwMDAwLCAxMDUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IuW8guW4uCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzY1LjAwMDAwMCwgMTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNy42NzQ5NTE0LDEyLjE3MTYzODcgTDEwLjUxNjM0NTYsMC44MTkzMTcwMTcgQzEwLjE4MDk5MjgsMC4zMDg3MjcxMDMgOS42MTEwOTgyMywwLjAwMTIyODk0NDA2IDkuMDAwMTYxMTYsMC4wMDEyMjg5NDQwNiBDOC4zODkyMjQwOSwwLjAwMTIyODk0NDA2IDcuODE5MzI5NTYsMC4zMDg3MjcxMDMgNy40ODM5NzY3NSwwLjgxOTMxNzAxNyBMMC4zMjUzNzA4ODcsMTIuMTcxNjM4NyBDLTAuNTEwOTUzNjY4LDEzLjQyMTc3ODUgMC4zNjI3NTYyNTEsMTUuMTE5MDg5MSAxLjg0MTU1NTMsMTUuMTE5MDg5MSBMMTYuMTU4NzY3LDE1LjExOTA4OTEgQzE3LjYzNzU2NjEsMTUuMTE5MDg5MSAxOC41MTEyNzYsMTMuNDIxNzc4NSAxNy42NzQ5NTE0LDEyLjE3MTYzODcgTDE3LjY3NDk1MTQsMTIuMTcxNjM4NyBaIE03Ljg4NTUyMzMxLDQuNjkxNTY2MjUgQzcuODg1NTIzMzEsNC41MzkyNzkgOC4wMDczNzE5Miw0LjQxNDY4MDM3IDguMTU2OTEzMzksNC40MTQ2ODAzNyBMOS44NDM0MDg5Myw0LjQxNDY4MDM3IEM5Ljk5Mjk1MDQsNC40MTQ2ODAzNyAxMC4xMTM0MTQ0LDQuNTM5Mjc5MDIgMTAuMTEzNDE0NCw0LjY5MTU2NjI1IEwxMC4xMTM0MTQ0LDUuODM1MTA1MDEgTDkuODMyMzMxNzgsOS42NjQ0MzY5NCBDOS44MjM2MDYwOCw5LjgwNzQ3Njk4IDkuNzA1NjQ5MzksOS45MTkzNjczMyA5LjU2MjMyNjM0LDkuOTIwNTU2MzkgTDguNDM3OTk1OTgsOS45MjA1NTYzOSBDOC4yOTQ2NzI5Miw5LjkxOTM2NzMzIDguMTc2NzE2MjQsOS44MDc0NzY5OCA4LjE2Nzk5MDU0LDkuNjY0NDM2OTQgTDcuODg2OTA3OTUsNS44MzUxMDUwMSBMNy44ODY5MDc5NSw0LjY5MTU2NjI1IEw3Ljg4NTUyMzMxLDQuNjkxNTY2MjUgWiBNOS4wMDAxNjExNywxMy4zNzc0NzY4IEM4LjY1NjQyNjExLDEzLjM3MzQ2MTUgOC4zMjgzNjc2MSwxMy4yMzMwNzE0IDguMDg4MTY2ODYsMTIuOTg3MTk1NyBDNy44NDc5NjYxMSwxMi43NDEzMjAxIDcuNzE1MzAyNzYsMTIuNDEwMTAzNSA3LjcxOTM2NjExLDEyLjA2NjQyMjEgQzcuNzE5MzY2MTEsMTEuMzQyMzY1NSA4LjI5MjYwODQzLDEwLjc1Mzk4MjkgOS4wMDAxNjExNywxMC43NTM5ODI5IEM5LjcwNjMyOTI1LDEwLjc1Mzk4MjkgMTAuMjgwOTU2MiwxMS4zNDIzNjU1IDEwLjI4MDk1NjIsMTIuMDY2NDIyMSBDMTAuMjg1MDE5NiwxMi40MTAxMDM1IDEwLjE1MjM1NjIsMTIuNzQxMzIwMSA5LjkxMjE1NTQ3LDEyLjk4NzE5NTcgQzkuNjcxOTU0NzIsMTMuMjMzMDcxNCA5LjM0Mzg5NjIyLDEzLjM3MzQ2MTUgOS4wMDAxNjExNywxMy4zNzc0NzY4IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+" alt>
                <span style="color:#666666;">异常：{{data.unusual ? data.unusual : 0}}</span>
            </div>
            <div
                class="patrol-statistics-dialog__main"
            >
                <div
                    class="patrol-statistics-dialog__main__left"
                >
                    <div>检查项目</div>
                    <div>
                        <div
                            v-for="(item, itemIndex) in data.instanceInforList"
                            :key="`check_item_${itemIndex}`"
                            @click="currentItem = item"
                            :class="{'patrol-statistics-dialog__main__left-active': item.id == currentItem.id}"
                        >
                            {{item.inforName}}
                            <span v-if="item.status == 1">正常</span>
                            <span v-else class="patrol-statistics-dialog__main__left-unusual">异常</span>
                        </div>
                    </div>
                </div>
                <div
                    class="patrol-statistics-dialog__main__right"
                >
                    <div>
                        <span>{{currentItem.inforName ? currentItem.inforName : '-'}}</span>
                        <span>检查时间：{{currentItem.investigationTime ? currentItem.investigationTime : '-'}}</span>
                    </div>
                    <div>
                        <div>
                            <span>检查内容：</span>
                            {{currentItem.inforEntity && currentItem.inforEntity.content ? currentItem.inforEntity.content : ''}}
                        </div>
                        <div>
                            <span>检查结果：</span>
                            <span v-if="currentItem.status == 1" style="color:#0BD295">正常</span>
                            <span v-else style="color:#FA7E7E">异常</span>
                        </div>
                        <div>
                            <span>情况说明：</span>
                            {{currentItem.remark ? currentItem.remark : ''}}
                        </div>
                        <div>
                            <span>拍照说明：</span>
                            <viewer :images="currentItem.imgList ? currentItem.imgList.map(e => e.allUrl) : []">
                                <img
                                    v-for="(img, imgIndex) in currentItem.imgList"
                                    :key="`img_${imgIndex}`"
                                    :src="img.allUrl"
                                    :alt="img.name"
                                    height="135"
                                >
                            </viewer>
                        </div>
                    </div>
                    <div>
                        {{currentItem.place}}
                        <div v-if="currentItem.status != '1'">
                        <img
                            v-if="currentItem.isNotice == 0"
                            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTEwcHgiIGhlaWdodD0iODNweCIgdmlld0JveD0iMCAwIDExMCA4MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNjAgKDg4MTAzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT7lt7LlpLHmlYg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8cG9seWdvbiBpZD0icGF0aC0xIiBwb2ludHM9IjAgMC4wNjMwMTM2NDA3IDEwNy44NDczNjggMC4wNjMwMTM2NDA3IDEwNy44NDczNjggODAuODMzODI0OCAwIDgwLjgzMzgyNDgiPjwvcG9seWdvbj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLpo47pmanmjpLmn6UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuODAwMDAwMDEyIj4KICAgICAgICA8ZyBpZD0i5beh5p+l6K6w5b2VLeW8guW4uCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwMTIuMDAwMDAwLCAtNTgyLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0id2luLWNvcHktNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQzLjAwMDAwMCwgNjMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i56qX5L2TIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i56m/5qKt57uE5aSH5Lu9LTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2OS4wMDAwMDAsIDI4Ny4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IuWIhue7hC0zIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLlt7LmoLjpqowiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4OC4wMDAwMDAsIDIxMS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i5bey5aSx5pWIIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2Ny4zMTQzNTQsIDYyLjY4NTQ0Nikgcm90YXRlKC0zMC4wMDAwMDApIHRyYW5zbGF0ZSgtNjcuMzE0MzU0LCAtNjIuNjg1NDQ2KSB0cmFuc2xhdGUoMTMuMzE0MzU0LCAyMS42ODU0NDYpIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IuWIhue7hCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMDAwMDAwLCAwLjA2ODIzNikiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iQ2xpcC00Ij48L2c+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNjkuMzQyNzMzLDcwLjkxMzU5ODYgTDcxLjA5MDY1NjUsNzIuMTMwODMwMSBMNzEuNDY5Njc4Myw2OS45NzkxNTQ0IEw3My4yNjA1MTk4LDY4LjY0NTkyMTIgTDcxLjMzMjg5MzQsNjcuNzIyMjM3MiBMNzAuNjkwNTcwNyw2NS42NzQ4ODQ0IEw2OS4xMjEwMzM2LDY3LjI1OTgwNDggTDY2Ljk0MTI5NjUsNjcuMzMzNjgzNyBMNjcuODk5NzEyMSw2OS4yNDM5MDc3IEw2Ny4xOTQxOTcxLDcxLjMzMzM4MzQgTDY5LjM0MjczMyw3MC45MTM1OTg2IFogTTUzLjkyMzY5NjUsNzguNzEzMTQ0MiBDMzYuMTU2MDE1NCw3OC43MTMxNDQyIDIxLjIyMTQ1MjcsNjYuNjgyNjgyOCAxNi44NDAzODc4LDUwLjM1ODQ0OTMgTDE0LjQ4MDk0NzgsNDkuNzI4NTc1MyBDMTguNjgzNDk0Niw2Ny41NTM4NzcyIDM0Ljc0NDg1MzgsODAuODMzODUxIDUzLjkyMzY5NjUsODAuODMzODUxIEM2NS41NTEwNjc0LDgwLjgzMzg1MSA3Ni4wMzAzMTQ0LDc1Ljk1MjE5NjYgODMuNDIzNjc0LDY4LjEzMTI2MTYgTDgxLjA2NDc2MDYsNjcuNTAxNzgxNCBDNzQuMTIzNzUyMSw3NC40MzAwMDEyIDY0LjUxODkyNzYsNzguNzEzMTQ0MiA1My45MjM2OTY1LDc4LjcxMzE0NDIgTDUzLjkyMzY5NjUsNzguNzEzMTQ0MiBaIE0yNi45NjE1NDU1LDYwLjQ2Nzc5NTEgTDI4LjY5OTIwMDIsNjEuODY0Mjc4MiBMMjkuMTEwMDgxNCw1OS43NjQ2OTgzIEwzMC45MjEzMjg4LDU4LjYzMDY2MjggTDI4Ljk5NDQ5MjMsNTcuNTA3NzgxMiBMMjguMzcyNzA3LDU1LjQwODIwMTMgTDI2Ljc3MTcwNTUsNTYuODE0NjU3NCBMMjQuNTgxNTY4LDU2LjY1NzE4ODkgTDI1LjUxODUyNDUsNTguNjUxNzg5OCBMMjQuNzgxNjc2Nyw2MC42NTcxNTEgTDI2Ljk2MTU0NTUsNjAuNDY3Nzk1MSBaIE01My45MTI5MDEyLDczLjgzMTc1MjIgTDU1LjIwODM0Miw3NS41MjE3ODI4IEw1Ni4yMzAwODE0LDczLjU3OTQwODkgTDU4LjMzNjQ4OTIsNzIuODU1MzE2MyBMNTYuNzc3ODc5MSw3MS4zODU3NDE3IEw1Ni43ODgxNDc4LDY5LjI0MzkwNzcgTDU0LjgwODI1NjIsNzAuMjcyODMzMSBMNTIuNzAxNzE2Nyw2OS42NzQ1ODQxIEw1My4wMzg2MTAzLDcxLjc4NDUzMDYgTDUxLjczMjkwMDgsNzMuNTU4NTQ0NCBMNTMuOTEyOTAxMiw3My44MzE3NTIyIFogTTQwLjgzMjI0MDYsNjcuMjgwNjY5MyBMMzkuMTM2NzE0LDY1LjkwNjEwMDcgTDM4LjYxMDExMjEsNjcuOTczOTI0NCBMMzYuNzEzOTUwMSw2OS4wODY3MDE3IEwzOC42MTAxMTIxLDcwLjE5OTQ3OSBMMzkuMTM2NzE0LDcyLjI2NzE3MTUgTDQwLjgzMjI0MDYsNzAuODkyNjAyOCBMNDMuMDU0MjM3NSw3MS4wNjAxNzU2IEw0Mi4yMDE2NjksNjkuMDk2OTM3MiBMNDMuMDU0MjM3NSw2Ny4xMzQyMjM3IEw0MC44MzIyNDA2LDY3LjI4MDY2OTMgWiBNNjMuNzA3OTYwNiw2Mi44NzIwNzY1IEM2MC43MDYxOTc5LDY0LjE3MzU1MzYgNTcuMzk5MDA2MSw2NC44ODc1NDIgNTMuOTIzNjk2NSw2NC44ODc1NDIgQzQ1Ljg0NTc1NDQsNjQuODg3NTQyIDM4LjY3MzQzNiw2MC45OTI2OTAxIDM0LjIwNzQ1NjUsNTQuOTc3NTI1IEwzMS4wNzk3MDQzLDU0LjEzNzQzMDYgQzM1Ljc0NTEzNDIsNjEuODY0Mjc4MiA0NC4yMzM5NTc1LDY3LjAxODIyMTkgNTMuOTIzNjk2NSw2Ny4wMTgyMjE5IEM1OC42MTAxOTA1LDY3LjAxODIyMTkgNjMuMDAyNTc3Myw2NS44MTEyMjU5IDY2LjgyNTQ0NDEsNjMuNzAxNDEwNiBMNjMuNzA3OTYwNiw2Mi44NzIwNzY1IFogTTUzLjkyMzY5NjUsMi4xODM1ODkzIEM3MS42OTE1MDk0LDIuMTgzNTg5MyA4Ni42MzYyMDkyLDE0LjIxNDE4MTkgOTEuMDA3MDA1MywzMC41NDg5MTMzIEw5My4zNjU5MTg3LDMxLjE3ODkxODUgQzg5LjE2Mzg5ODUsMTMuMzQyNzI1MSA3My4xMDI1MzkzLDAuMDYzMDEzNjQwNyA1My45MjM2OTY1LDAuMDYzMDEzNjQwNyBDNDIuMjk2MzI1NywwLjA2MzAxMzY0MDcgMzEuODE2ODE1NCw0Ljk0NDQwNTYgMjQuNDIzMTkyNSwxMi43NjU2MDMgTDI2Ljc4MjYzMjUsMTMuMzk1NjA4MiBDMzMuNzIzMTE0NCw2LjQ2Njg2MzQ1IDQzLjMyODMzMzgsMi4xODM1ODkzIDUzLjkyMzY5NjUsMi4xODM1ODkzIEw1My45MjM2OTY1LDIuMTgzNTg5MyBaIE0xMDUuMzYyMDQzLDQyLjA4NTcxMSBMOTkuMjk1ODUxNSw2NC42NjY5NTQ5IEM5OC44NDI3MTA1LDY2LjM2Nzc0NTggOTcuMDg0MTIzMyw2Ny4zNzU2NzUzIDk1LjM3NzgwMTQsNjYuOTI0MTM0NCBMNC43Mzg4MTE4OCw0Mi43MTU4NDc0IEMzLjAzMjQ4OTk0LDQyLjI2NDgzMTQgMi4wMjE0MTQyMSw0MC41MTEwMjYxIDIuNDc0NTU1MTgsMzguODEwODkxMyBMOC41NDA3NDYyNSwxNi4yMjk2NDc0IEM4Ljk5Mzc1NTU3LDE0LjUyODg1NjUgMTAuNzUyNzM3NywxMy41MjExODk0IDEyLjQ1ODkyOCwxMy45NzI3MzAyIEwxMDMuMTA4MDU1LDM4LjE4MDg4NjEgQzEwNC44MTQyNDUsMzguNjMyNTU4MiAxMDUuODI1MzIxLDQwLjM4NTU3NjIgMTA1LjM2MjA0Myw0Mi4wODU3MTEgTDEwNS4zNjIwNDMsNDIuMDg1NzExIFogTTEwNC42ODc4NiwzNi40MDY4NzIzIEwxMS45OTU1MTgzLDExLjY0MTkzNDEgQzkuNzIwNDY2MjUsMTEuMDMzNTgwOSA3LjM4MjYxNjkzLDEyLjM3NzA0OTUgNi43NzE3NTg2OCwxNC42NDQ3MjcgTDAuMTQ2OTc0NjAyLDM5LjI5Mzc5NDYgQy0wLjQ2Mzg4MzY1LDQxLjU2MDgxNiAwLjg4NDQ4MDYyMSw0My44OTE3NDMzIDMuMTU5MDA2MDYsNDQuNTAwNzUyNyBMOTUuODUxNzQzMSw2OS4yNTQ2NjgxIEM5OC4xMjY0MDAyLDY5Ljg2MzgwODcgMTAwLjQ2NDY0NSw2OC41MTk4MTUxIDEwMS4wNzU2MzQsNjYuMjUyMDA2NCBMMTA3LjcwMDI4Nyw0MS42MTM4MzA0IEMxMDguMzExMjc3LDM5LjMzNTc4NjIgMTA2Ljk2MzA0NCwzNy4wMDUxMjE0IDEwNC42ODc4NiwzNi40MDY4NzIzIEwxMDQuNjg3ODYsMzYuNDA2ODcyMyBaIE04MC42NzQ5NDM1LDIwLjM0NDgyMzkgTDc4LjgzMTgzNjcsMTkuMDY0MzQyNiBMNzguNTY4NTM1OCwyMS4xOTUxNTM4IEw3Ni44MzEwMTI3LDIyLjQ1NTE2NDEgTDc4Ljg0MjEwNTUsMjMuNDQxODM1NCBMNzkuNjExNDcwOSwyNS40OTk0MjM3IEw4MS4xMTcyODkyLDIzLjk3Njk2NTkgTDgzLjMzOTI4NjEsMjMuOTg3NzI2MiBMODIuMjU0NzQ5NCwyMi4wNjY2MTA2IEw4Mi44NTQ5NDM5LDIwLjAwOTAyMjQgTDgwLjY3NDk0MzUsMjAuMzQ0ODIzOSBaIE01Ni44MjAwMDcyLDYuOTkxNzU4NDIgTDU1LjUxMzc3MTEsNS4yOTA5Njc1IEw1NC40OTI0MjY2LDcuMjMzMjEwMSBMNTIuMzY1MDg2NCw3Ljk2NzY2OTM4IEw1My45MzQwOTY5LDkuNDM3NzY4OTYgTDUzLjkyMzY5NjUsMTEuNTg5NzA3MSBMNTUuOTE0MzgzNSwxMC41NjA5MTMgTDU4LjAzMTA2LDExLjE1OTE2MiBMNTcuNjk0Mjk4MSw5LjA0OTIxNTQ2IEw1OS4wMTA4MDMsNy4yNzUyMDE3IEw1Ni44MjAwMDcyLDYuOTkxNzU4NDIgWiBNNDAuMzI2NTcxMSw5Ljk4Mzc5MDk1IEwzOC41Njc4NTIzLDguNzY1NzcyMTggTDM4LjE4ODgzMDUsMTAuOTI4NDcwNyBMMzYuMzg3ODUxOSwxMi4yNzE5MzkzIEwzOC4zMzYwMTU4LDEzLjE5NTYyMzIgTDM4Ljk3ODczMzQsMTUuMjQyOTc2MSBMNDAuNTY4OTM5NywxMy42NTgwNTU3IEw0Mi43Njk4NzI1LDEzLjU4NDE3NjcgTDQxLjgxMTg1MTksMTEuNjczNjkwMyBMNDIuNTI3NjM1Niw5LjU4NDQ3NzEgTDQwLjMyNjU3MTEsOS45ODM3OTA5NSBaIE03MC4wMjcxODM5LDE0LjYyMzczMTIgTDcxLjc0Mzc3NDYsMTYuMDA5MzIyNyBMNzIuMjcwMzc2NSwxMy45NDE0OTkgTDc0LjE4NzIwNzYsMTIuODI4NTkwNCBMNzIuMjcwMzc2NSwxMS43MTU4MTMxIEw3MS43NDM3NzQ2LDkuNjQ3NDY0NSBMNzAuMDI3MTgzOSwxMS4wMzM1ODA5IEw2Ny43ODM0NjQ3LDEwLjg2NTM1MiBMNjguNjM2NjkxNSwxMi44Mzg4MjU5IEw2Ny43ODM0NjQ3LDE0LjgxMjI5OTcgTDcwLjAyNzE4MzksMTQuNjIzNzMxMiBaIE01My45MjM2OTY1LDE2LjAwOTMyMjcgQzYyLjAwMTYzODcsMTYuMDA5MzIyNyA2OS4xNzQyMjA0LDE5LjkwMzkxMjEgNzMuNjM5NDA5OSwyNS45MDg5NzMgTDc2Ljc2NzU1NzEsMjYuNzQ4NTQyNSBDNzIuMTAxNzMyMywxOS4wMzI1ODY1IDYzLjYxMjkwOSwxMy44NzgzODA0IDUzLjkyMzY5NjUsMTMuODc4MzgwNCBDNDkuMjM2Njc2LDEzLjg3ODM4MDQgNDQuODQ0OTQ3NCwxNS4wODU1MDc2IDQxLjAyMTk0OSwxNy4xOTU0NTQxIEw0NC4xMzk0MzI1LDE4LjAyNDc4ODIgQzQ3LjE0MTA2MzUsMTYuNzIzMzExMSA1MC40NDc4NjA0LDE2LjAwOTMyMjcgNTMuOTIzNjk2NSwxNi4wMDkzMjI3IEw1My45MjM2OTY1LDE2LjAwOTMyMjcgWiIgaWQ9IkZpbGwtMyIgZmlsbD0iIzBCRDI5NSIgbWFzaz0idXJsKCNtYXNrLTIpIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCBpZD0i5bey6YCa55+l5aSE572u5Lq65ZGYIiBmaWxsPSIjMEJEMjk1IiBtYXNrPSJ1cmwoI21hc2stMikiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUzLjQ2NzQ2MywgNDAuNzcwNDgyKSByb3RhdGUoMTUuMDAwMDAwKSB0cmFuc2xhdGUoLTUzLjQ2NzQ2MywgLTQwLjc3MDQ4MikgIiBmb250LWZhbWlseT0iUGluZ0ZhbmdTQy1TZW1pYm9sZCwgUGluZ0ZhbmcgU0MiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSI0LjQ2NzQ2MzQ0IiB5PSI0NS43NzA0ODIiPuW3sumAmuefpeWkhOe9ruS6uuWRmDwvdHNwYW4+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
                            alt
                            height="80"
                        >
                        <img
                            v-else
                            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTEwcHgiIGhlaWdodD0iODNweCIgdmlld0JveD0iMCAwIDExMCA4MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNjAgKDg4MTAzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT7lt7LlpLHmlYg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8cG9seWdvbiBpZD0icGF0aC0xIiBwb2ludHM9IjAgMC4wNjMwMTM2NDA3IDEwNy44NDczNjggMC4wNjMwMTM2NDA3IDEwNy44NDczNjggODAuODMzODI0OCAwIDgwLjgzMzgyNDgiPjwvcG9seWdvbj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLpo47pmanmjpLmn6UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNyI+CiAgICAgICAgPGcgaWQ9IuW3oeafpeiusOW9lS3lvILluLgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDEyLjAwMDAwMCwgLTQ2Mi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Indpbi1jb3B5LTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0My4wMDAwMDAsIDYzLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iueql+S9kyI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iuepv+airee7hOWkh+S7vS0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjkuMDAwMDAwLCAyODcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliIbnu4QtMyI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i5bey5qC46aqMIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0ODguMDAwMDAwLCA5MS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i5bey5aSx5pWIIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2Ny4zMTQzNTQsIDYyLjY4NTQ0Nikgcm90YXRlKC0zMC4wMDAwMDApIHRyYW5zbGF0ZSgtNjcuMzE0MzU0LCAtNjIuNjg1NDQ2KSB0cmFuc2xhdGUoMTMuMzE0MzU0LCAyMS42ODU0NDYpIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IuWIhue7hCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMDAwMDAwLCAwLjA2ODIzNikiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iQ2xpcC00Ij48L2c+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNjkuMzQyNzMzLDcwLjkxMzU5ODYgTDcxLjA5MDY1NjUsNzIuMTMwODMwMSBMNzEuNDY5Njc4Myw2OS45NzkxNTQ0IEw3My4yNjA1MTk4LDY4LjY0NTkyMTIgTDcxLjMzMjg5MzQsNjcuNzIyMjM3MiBMNzAuNjkwNTcwNyw2NS42NzQ4ODQ0IEw2OS4xMjEwMzM2LDY3LjI1OTgwNDggTDY2Ljk0MTI5NjUsNjcuMzMzNjgzNyBMNjcuODk5NzEyMSw2OS4yNDM5MDc3IEw2Ny4xOTQxOTcxLDcxLjMzMzM4MzQgTDY5LjM0MjczMyw3MC45MTM1OTg2IFogTTUzLjkyMzY5NjUsNzguNzEzMTQ0MiBDMzYuMTU2MDE1NCw3OC43MTMxNDQyIDIxLjIyMTQ1MjcsNjYuNjgyNjgyOCAxNi44NDAzODc4LDUwLjM1ODQ0OTMgTDE0LjQ4MDk0NzgsNDkuNzI4NTc1MyBDMTguNjgzNDk0Niw2Ny41NTM4NzcyIDM0Ljc0NDg1MzgsODAuODMzODUxIDUzLjkyMzY5NjUsODAuODMzODUxIEM2NS41NTEwNjc0LDgwLjgzMzg1MSA3Ni4wMzAzMTQ0LDc1Ljk1MjE5NjYgODMuNDIzNjc0LDY4LjEzMTI2MTYgTDgxLjA2NDc2MDYsNjcuNTAxNzgxNCBDNzQuMTIzNzUyMSw3NC40MzAwMDEyIDY0LjUxODkyNzYsNzguNzEzMTQ0MiA1My45MjM2OTY1LDc4LjcxMzE0NDIgTDUzLjkyMzY5NjUsNzguNzEzMTQ0MiBaIE0yNi45NjE1NDU1LDYwLjQ2Nzc5NTEgTDI4LjY5OTIwMDIsNjEuODY0Mjc4MiBMMjkuMTEwMDgxNCw1OS43NjQ2OTgzIEwzMC45MjEzMjg4LDU4LjYzMDY2MjggTDI4Ljk5NDQ5MjMsNTcuNTA3NzgxMiBMMjguMzcyNzA3LDU1LjQwODIwMTMgTDI2Ljc3MTcwNTUsNTYuODE0NjU3NCBMMjQuNTgxNTY4LDU2LjY1NzE4ODkgTDI1LjUxODUyNDUsNTguNjUxNzg5OCBMMjQuNzgxNjc2Nyw2MC42NTcxNTEgTDI2Ljk2MTU0NTUsNjAuNDY3Nzk1MSBaIE01My45MTI5MDEyLDczLjgzMTc1MjIgTDU1LjIwODM0Miw3NS41MjE3ODI4IEw1Ni4yMzAwODE0LDczLjU3OTQwODkgTDU4LjMzNjQ4OTIsNzIuODU1MzE2MyBMNTYuNzc3ODc5MSw3MS4zODU3NDE3IEw1Ni43ODgxNDc4LDY5LjI0MzkwNzcgTDU0LjgwODI1NjIsNzAuMjcyODMzMSBMNTIuNzAxNzE2Nyw2OS42NzQ1ODQxIEw1My4wMzg2MTAzLDcxLjc4NDUzMDYgTDUxLjczMjkwMDgsNzMuNTU4NTQ0NCBMNTMuOTEyOTAxMiw3My44MzE3NTIyIFogTTQwLjgzMjI0MDYsNjcuMjgwNjY5MyBMMzkuMTM2NzE0LDY1LjkwNjEwMDcgTDM4LjYxMDExMjEsNjcuOTczOTI0NCBMMzYuNzEzOTUwMSw2OS4wODY3MDE3IEwzOC42MTAxMTIxLDcwLjE5OTQ3OSBMMzkuMTM2NzE0LDcyLjI2NzE3MTUgTDQwLjgzMjI0MDYsNzAuODkyNjAyOCBMNDMuMDU0MjM3NSw3MS4wNjAxNzU2IEw0Mi4yMDE2NjksNjkuMDk2OTM3MiBMNDMuMDU0MjM3NSw2Ny4xMzQyMjM3IEw0MC44MzIyNDA2LDY3LjI4MDY2OTMgWiBNNjMuNzA3OTYwNiw2Mi44NzIwNzY1IEM2MC43MDYxOTc5LDY0LjE3MzU1MzYgNTcuMzk5MDA2MSw2NC44ODc1NDIgNTMuOTIzNjk2NSw2NC44ODc1NDIgQzQ1Ljg0NTc1NDQsNjQuODg3NTQyIDM4LjY3MzQzNiw2MC45OTI2OTAxIDM0LjIwNzQ1NjUsNTQuOTc3NTI1IEwzMS4wNzk3MDQzLDU0LjEzNzQzMDYgQzM1Ljc0NTEzNDIsNjEuODY0Mjc4MiA0NC4yMzM5NTc1LDY3LjAxODIyMTkgNTMuOTIzNjk2NSw2Ny4wMTgyMjE5IEM1OC42MTAxOTA1LDY3LjAxODIyMTkgNjMuMDAyNTc3Myw2NS44MTEyMjU5IDY2LjgyNTQ0NDEsNjMuNzAxNDEwNiBMNjMuNzA3OTYwNiw2Mi44NzIwNzY1IFogTTUzLjkyMzY5NjUsMi4xODM1ODkzIEM3MS42OTE1MDk0LDIuMTgzNTg5MyA4Ni42MzYyMDkyLDE0LjIxNDE4MTkgOTEuMDA3MDA1MywzMC41NDg5MTMzIEw5My4zNjU5MTg3LDMxLjE3ODkxODUgQzg5LjE2Mzg5ODUsMTMuMzQyNzI1MSA3My4xMDI1MzkzLDAuMDYzMDEzNjQwNyA1My45MjM2OTY1LDAuMDYzMDEzNjQwNyBDNDIuMjk2MzI1NywwLjA2MzAxMzY0MDcgMzEuODE2ODE1NCw0Ljk0NDQwNTYgMjQuNDIzMTkyNSwxMi43NjU2MDMgTDI2Ljc4MjYzMjUsMTMuMzk1NjA4MiBDMzMuNzIzMTE0NCw2LjQ2Njg2MzQ1IDQzLjMyODMzMzgsMi4xODM1ODkzIDUzLjkyMzY5NjUsMi4xODM1ODkzIEw1My45MjM2OTY1LDIuMTgzNTg5MyBaIE0xMDUuMzYyMDQzLDQyLjA4NTcxMSBMOTkuMjk1ODUxNSw2NC42NjY5NTQ5IEM5OC44NDI3MTA1LDY2LjM2Nzc0NTggOTcuMDg0MTIzMyw2Ny4zNzU2NzUzIDk1LjM3NzgwMTQsNjYuOTI0MTM0NCBMNC43Mzg4MTE4OCw0Mi43MTU4NDc0IEMzLjAzMjQ4OTk0LDQyLjI2NDgzMTQgMi4wMjE0MTQyMSw0MC41MTEwMjYxIDIuNDc0NTU1MTgsMzguODEwODkxMyBMOC41NDA3NDYyNSwxNi4yMjk2NDc0IEM4Ljk5Mzc1NTU3LDE0LjUyODg1NjUgMTAuNzUyNzM3NywxMy41MjExODk0IDEyLjQ1ODkyOCwxMy45NzI3MzAyIEwxMDMuMTA4MDU1LDM4LjE4MDg4NjEgQzEwNC44MTQyNDUsMzguNjMyNTU4MiAxMDUuODI1MzIxLDQwLjM4NTU3NjIgMTA1LjM2MjA0Myw0Mi4wODU3MTEgTDEwNS4zNjIwNDMsNDIuMDg1NzExIFogTTEwNC42ODc4NiwzNi40MDY4NzIzIEwxMS45OTU1MTgzLDExLjY0MTkzNDEgQzkuNzIwNDY2MjUsMTEuMDMzNTgwOSA3LjM4MjYxNjkzLDEyLjM3NzA0OTUgNi43NzE3NTg2OCwxNC42NDQ3MjcgTDAuMTQ2OTc0NjAyLDM5LjI5Mzc5NDYgQy0wLjQ2Mzg4MzY1LDQxLjU2MDgxNiAwLjg4NDQ4MDYyMSw0My44OTE3NDMzIDMuMTU5MDA2MDYsNDQuNTAwNzUyNyBMOTUuODUxNzQzMSw2OS4yNTQ2NjgxIEM5OC4xMjY0MDAyLDY5Ljg2MzgwODcgMTAwLjQ2NDY0NSw2OC41MTk4MTUxIDEwMS4wNzU2MzQsNjYuMjUyMDA2NCBMMTA3LjcwMDI4Nyw0MS42MTM4MzA0IEMxMDguMzExMjc3LDM5LjMzNTc4NjIgMTA2Ljk2MzA0NCwzNy4wMDUxMjE0IDEwNC42ODc4NiwzNi40MDY4NzIzIEwxMDQuNjg3ODYsMzYuNDA2ODcyMyBaIE04MC42NzQ5NDM1LDIwLjM0NDgyMzkgTDc4LjgzMTgzNjcsMTkuMDY0MzQyNiBMNzguNTY4NTM1OCwyMS4xOTUxNTM4IEw3Ni44MzEwMTI3LDIyLjQ1NTE2NDEgTDc4Ljg0MjEwNTUsMjMuNDQxODM1NCBMNzkuNjExNDcwOSwyNS40OTk0MjM3IEw4MS4xMTcyODkyLDIzLjk3Njk2NTkgTDgzLjMzOTI4NjEsMjMuOTg3NzI2MiBMODIuMjU0NzQ5NCwyMi4wNjY2MTA2IEw4Mi44NTQ5NDM5LDIwLjAwOTAyMjQgTDgwLjY3NDk0MzUsMjAuMzQ0ODIzOSBaIE01Ni44MjAwMDcyLDYuOTkxNzU4NDIgTDU1LjUxMzc3MTEsNS4yOTA5Njc1IEw1NC40OTI0MjY2LDcuMjMzMjEwMSBMNTIuMzY1MDg2NCw3Ljk2NzY2OTM4IEw1My45MzQwOTY5LDkuNDM3NzY4OTYgTDUzLjkyMzY5NjUsMTEuNTg5NzA3MSBMNTUuOTE0MzgzNSwxMC41NjA5MTMgTDU4LjAzMTA2LDExLjE1OTE2MiBMNTcuNjk0Mjk4MSw5LjA0OTIxNTQ2IEw1OS4wMTA4MDMsNy4yNzUyMDE3IEw1Ni44MjAwMDcyLDYuOTkxNzU4NDIgWiBNNDAuMzI2NTcxMSw5Ljk4Mzc5MDk1IEwzOC41Njc4NTIzLDguNzY1NzcyMTggTDM4LjE4ODgzMDUsMTAuOTI4NDcwNyBMMzYuMzg3ODUxOSwxMi4yNzE5MzkzIEwzOC4zMzYwMTU4LDEzLjE5NTYyMzIgTDM4Ljk3ODczMzQsMTUuMjQyOTc2MSBMNDAuNTY4OTM5NywxMy42NTgwNTU3IEw0Mi43Njk4NzI1LDEzLjU4NDE3NjcgTDQxLjgxMTg1MTksMTEuNjczNjkwMyBMNDIuNTI3NjM1Niw5LjU4NDQ3NzEgTDQwLjMyNjU3MTEsOS45ODM3OTA5NSBaIE03MC4wMjcxODM5LDE0LjYyMzczMTIgTDcxLjc0Mzc3NDYsMTYuMDA5MzIyNyBMNzIuMjcwMzc2NSwxMy45NDE0OTkgTDc0LjE4NzIwNzYsMTIuODI4NTkwNCBMNzIuMjcwMzc2NSwxMS43MTU4MTMxIEw3MS43NDM3NzQ2LDkuNjQ3NDY0NSBMNzAuMDI3MTgzOSwxMS4wMzM1ODA5IEw2Ny43ODM0NjQ3LDEwLjg2NTM1MiBMNjguNjM2NjkxNSwxMi44Mzg4MjU5IEw2Ny43ODM0NjQ3LDE0LjgxMjI5OTcgTDcwLjAyNzE4MzksMTQuNjIzNzMxMiBaIE01My45MjM2OTY1LDE2LjAwOTMyMjcgQzYyLjAwMTYzODcsMTYuMDA5MzIyNyA2OS4xNzQyMjA0LDE5LjkwMzkxMjEgNzMuNjM5NDA5OSwyNS45MDg5NzMgTDc2Ljc2NzU1NzEsMjYuNzQ4NTQyNSBDNzIuMTAxNzMyMywxOS4wMzI1ODY1IDYzLjYxMjkwOSwxMy44NzgzODA0IDUzLjkyMzY5NjUsMTMuODc4MzgwNCBDNDkuMjM2Njc2LDEzLjg3ODM4MDQgNDQuODQ0OTQ3NCwxNS4wODU1MDc2IDQxLjAyMTk0OSwxNy4xOTU0NTQxIEw0NC4xMzk0MzI1LDE4LjAyNDc4ODIgQzQ3LjE0MTA2MzUsMTYuNzIzMzExMSA1MC40NDc4NjA0LDE2LjAwOTMyMjcgNTMuOTIzNjk2NSwxNi4wMDkzMjI3IEw1My45MjM2OTY1LDE2LjAwOTMyMjcgWiIgaWQ9IkZpbGwtMyIgZmlsbD0iI0Y4NUI0NyIgbWFzaz0idXJsKCNtYXNrLTIpIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCBpZD0i5pyq6YCa55+l5aSE572u5Lq65ZGYIiBmaWxsPSIjRjg1QjQ3IiBtYXNrPSJ1cmwoI21hc2stMikiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUzLjQ2NzQ2MywgNDAuNzcwNDgyKSByb3RhdGUoMTUuMDAwMDAwKSB0cmFuc2xhdGUoLTUzLjQ2NzQ2MywgLTQwLjc3MDQ4MikgIiBmb250LWZhbWlseT0iUGluZ0ZhbmdTQy1TZW1pYm9sZCwgUGluZ0ZhbmcgU0MiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSI0LjQ2NzQ2MzQ0IiB5PSI0NS43NzA0ODIiPuacqumAmuefpeWkhOe9ruS6uuWRmDwvdHNwYW4+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
                            alt
                            height="80"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer><span></span></template>
    </sv-dialog>
</template>

<script>
export default {
    name: 'ViewDialog',
    data() {
        return {
            data: {},
            title: '巡查记录',
            loading: false,
            // 当前选定的检查项目
            currentItem: {}
        }
    },
    methods: {
        /**
         * @method
         * @desc 打开查看弹窗
         * @param {Number} id 表格项id
         */
        init(id) {
            this.title = '巡查记录'
            this.$refs.dialog.visible = true
            this.loading = true
            this.$http.get(`${window.SITE_CONFIG.baseUrl}/garbage/garbageInvestigationInstance/info?id=${id}`)
            .then(res => {
                if (res.data.code == 0) {
                    this.data = res.data.data
                    this.title = res.data.data.sortPointName + '巡查记录'
                    this.currentItem = res.data.data.instanceInforList[0] ? res.data.data.instanceInforList[0] : {}
                }
                this.loading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.patrol-statistics-dialog {
    width: 900px;
    &__label {
        color: #555555;
    }
    &__header {
        text-align: center;
        padding: 10px;
        line-height: 2;
    }
    &__main {
        margin: 0 20px 20px;
        font-size: 0;
        display: flex;
        &__left {
            font-size: 14px;
            display: inline-block;
            width: 250px;
            height: 500px;
            margin-right: 10px;
            border: 1px solid #DDDDDD;
            color: #666666;
            & > div:first-child {
                border-bottom: 1px solid #DDDDDD;
                font-weight: bold;
                height: 32px;
                line-height: 32px;
                padding-left: 15px;
            }
            & > div:nth-child(2) {
                padding: 5px 0;
                overflow: auto;
                &::-webkit-scrollbar {
                    background: transparent;
                    width: 5px;
                }
                &::-webkit-scrollbar-thumb {
                    background: #d5d5d5;
                    border-radius: 5px;
                }
                // 检查项目列表
                & > div {
                    padding: 10px 60px 10px 15px;
                    cursor: pointer;
                    position: relative;
                    &:hover {
                        background: rgba(63, 146, 254, 0.1);
                    }
                    &.patrol-statistics-dialog__main__left-active {
                        background: rgba(63, 146, 254, 0.1);
                        border-left: #0091ff 2px solid;
                        padding-left: 13px;
                    }
                    & > span {
                        position: absolute;
                        right: 15px;
                        border-radius: 3px;
                        padding: 0 8px;
                        height: 22px;
                        line-height: 22px;
                        color: white;
                        top: 50%;
                        transform: translateY(-50%);
                        background: #0BD295;
                        &.patrol-statistics-dialog__main__left-unusual {
                            background: #FA7E7E;
                        }
                    }
                }
            }
        }
        &__right {
            flex-grow: 1;
            font-size: 14px;
            display: inline-flex;
            flex-direction: column;
            height: 500px;
            border: 1px solid #DDDDDD;
            & > div:first-child {
                color: #666666;
                border-bottom: 1px solid #DDDDDD;
                font-weight: bold;
                height: 32px;
                line-height: 32px;
                padding: 0 15px;
                & > span:first-child {
                    font-weight: bold;
                }
                & > span:last-child {
                    font-weight: normal;
                    float: right;
                }
            }
            & > div:nth-child(2) {
                padding: 15px 10px;
                flex-grow: 1;
                color: #555555;
                overflow: auto;
                &::-webkit-scrollbar {
                    background: transparent;
                    width: 5px;
                }
                &::-webkit-scrollbar-thumb {
                    background: #d5d5d5;
                    border-radius: 5px;
                }
                & > div {
                    margin: 0 0 15px 70px;
                    position: relative;
                    min-height: 23px;
                    & > span:first-child {
                        position: absolute;
                        left: 0;
                        top: 0;
                        transform: translateX(-100%);
                    }
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
                img {
                    cursor: zoom-in;
                    margin: 0 10px 10px 0;
                }
            }
            & > div:nth-child(3) {
                border-top: 1px solid #DDDDDD;
                padding: 5px 15px 5px 25px;
                position: relative;
                color: #666666;
                &::before {
                    content: '';
                    background: no-repeat center/100% 100% url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAiCAYAAABBY8kOAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGqADAAQAAAABAAAAIgAAAADdmEVNAAADNUlEQVRIDa2WTUhUURTHe48ZZwakgmAiR0cdFxKBiygqKhdJ4qIgCXfhIgxpUYQQEbmQoEUFWRStjKJVFCQSRItWhRm5sJW0GXVmtBZakLVxPvudiTvemXl3njrz4HHOPR///7nnnffetba5XLFYbF8mkzmTy+W6CG2yLKsBPYX8jlxAvvX5fBOhUChRCcoyOefn5w9ns9m7+I+ZYnQ7hK88Hs/1cDgc1e1KLyOiyjpIHiEvqKBNyJRt28Otra13SnOKiBYXF3clk8lxSI6XBm5mze6eQzaATKk8WymAeyF5XS2J4IHRPzc391BhiywQ4XhAQKfurFIf5BEMKox86+Lx+IF0Ov0FoqJWqqAq5CoTGWlsbPyZ31Eqlbq9QRIZ6xnub9y5DRSwHewbEmfTsnbkiUpJgGaZptFAILAzEons596LrYGc8Up54uMVGWATdRZEV1HKxlEHAPQW4MO6TenkvyH/lFo7SYrskdZ1Ozk12wqjelNbF6kUcanI4LCgkJNC1OTg003TgCV1g65TxALrJd3moIdt2KTXxguSjNG57siuq+UaHHtkR24jfZBAT3n6f0sikQihuXXFsqm44rYh2c2Ld81ExPiOmnzKLhzSuillMEliRqLR6AjSq2JY72DinmHrUzaThGhKxruP4JemoBL7H5JmsAXI6UD6SvymZbtFgg+yOBFBU1Q1dgr7yDvYKc9ojRfqcTVglXLBvyd+mTr5TNxHLIteywuS6ZaWlgnBzBO1tbX9lj9jjUlyEF3mzn9880RCAPMY4lMNycb4anxWeAUimLNer7cfx1/lrEJG6+vrh/T8ApEY5QQD4RU9YAt6msdwLhgMFhVcRCSgjOITyKSNW7rIHdJbpkAcv3O8W3Lk+oA8pAI3KJ8yWOedYst2JEFUlWT7vciYU5LBNkk3Lhp866eg0gCm8AdEPdy/Sn0O61lOqaeJXXPw5U2OrdODOXsf5ez9njb6dbumL/n9/iNuZ2/H1mkg25qbmyeptBebU7XL7KTbjUTwXIkkiCl6B5n8DgpHXPQV7i4KmUW6Xq6t0xH4B51l/QLSVe4uCviq+2uq80vpgDBcU9Bagv0D5fklJIM6aFwAAAAASUVORK5CYII=');
                    width: 15px;
                    height: 20px;
                    position: absolute;
                    left: 5px;
                    top: 5px;
                }
                img {
                    position: absolute;
                    bottom: 60px;
                    right: 30px;
                }
            }
        }
    }
}
</style>