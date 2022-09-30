<template>
  <!-- <div class="organizational-structure-contact-list"> -->
  <div :class="ContactList.wrapper">
    <!-- <div class="organizational-structure-contact-list__header">
      <span v-if="title" class="contingency-plan__title">{{ title }}</span>
      <span style="float: right;">
        <sv-button type="primary" @click="contactViewHandle">添加联系人</sv-button>
        <sv-button type="primary" @click="delHandle">删除</sv-button>
      </span>
    </div>
    <div class="sv-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        border
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTEycHgiIGhlaWdodD0iMTEycHgiIHZpZXdCb3g9IjAgMCAxMTIgMTEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPuaaguaXoOaVsOaNrjwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8cmVjdCBpZD0icGF0aC0xIiB4PSI4LjM0NDcyMTM3IiB5PSIyNC4wNjg1NzE0IiB3aWR0aD0iNDYuMjk0NjAyOSIgaGVpZ2h0PSI2MC4xNzE0Mjg2IiByeD0iMi45OTUyIj48L3JlY3Q+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSI0Ni4yOTQ2MDI5IiBoZWlnaHQ9IjYwLjE3MTQyODYiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICA8L21hc2s+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSIxMDAlIiB5MT0iNzUuNzI5NDAwNCUiIHgyPSIwJSIgeTI9IjI0LjIzODkzNTYlIiBpZD0ibGluZWFyR3JhZGllbnQtMyI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNDMkU5RkIiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ExQzRGRCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLpgJrnlKjlm77moIciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02Ni4wMDAwMDAsIC00MTUuMDAwMDAwKSIgaWQ9Iue8lue7hC01Ij4KICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjYuMDAwMDAwLCAzNTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i5pqC5peg5pWw5o2u5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA2NS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i5YiG57uELTgtY29weSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjEuMjAwMDAwLCAxNi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgb3BhY2l0eT0iMC41IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHg9IjQuNjExMjg1NjUiIHk9IjkuMDI1NzE0MjkiIHdpZHRoPSI3NC42Njg3MTQzIiBoZWlnaHQ9Ijc1LjIxNDI4NTciPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0i55+p5b2iIiBzdHJva2U9IiNEMERBRUQiIG1hc2s9InVybCgjbWFzay0yKSIgc3Ryb2tlLXdpZHRoPSIxLjQ5NzYiIGZpbGw9IiNGNUY4RkUiIHN0cm9rZS1kYXNoYXJyYXk9IjMuNzQzOTk5ODYyNjcwODk5LDIuMjQ2NDAwMDcwMTkwNDMiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiBzdHJva2U9IiNEMERBRUQiIHN0cm9rZS13aWR0aD0iMC43NDg4IiBmaWxsPSIjRjVGOEZFIiB4PSIyNy4zODYzIiB5PSI5LjQwMDExNDI5IiB3aWR0aD0iNDUuNTQ1ODAyOSIgaGVpZ2h0PSI2NC42ODc2Mjg2IiByeD0iMS40OTc2Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik01MC43NTAwMDgxLDE2LjkyMTU0MjkgTDYxLjczMTc5NTcsMjcuOTgzNTY5NiBMNjEuNzMxNzk1Nyw3NS4yMjA5NzE0IEM2MS43MzE3OTU3LDc1LjUzMTEzNDUgNjEuNjA2MDc3Myw3NS44MTE5MzQ1IDYxLjQwMjgxOCw3Ni4wMTUxOTM4IEM2MS4xOTk1NTg4LDc2LjIxODQ1MyA2MC45MTg3NTg4LDc2LjM0NDE3MTQgNjAuNjA4NTk1Nyw3Ni4zNDQxNzE0IEw2MC42MDg1OTU3LDc2LjM0NDE3MTQgTDE3LjMwOTE5MjgsNzYuMzQ0MTcxNCBDMTYuOTk5MDI5Nyw3Ni4zNDQxNzE0IDE2LjcxODIyOTcsNzYuMjE4NDUzIDE2LjUxNDk3MDUsNzYuMDE1MTkzOCBDMTYuMzExNzExMiw3NS44MTE5MzQ1IDE2LjE4NTk5MjgsNzUuNTMxMTM0NSAxNi4xODU5OTI4LDc1LjIyMDk3MTQgTDE2LjE4NTk5MjgsNzUuMjIwOTcxNCBMMTYuMTg1OTkyOCwxOC4wNDQ3NDI5IEMxNi4xODU5OTI4LDE3LjczNDU3OTcgMTYuMzExNzExMiwxNy40NTM3Nzk3IDE2LjUxNDk3MDUsMTcuMjUwNTIwNSBDMTYuNzE4MjI5NywxNy4wNDcyNjEzIDE2Ljk5OTAyOTcsMTYuOTIxNTQyOSAxNy4zMDkxOTI4LDE2LjkyMTU0MjkgTDE3LjMwOTE5MjgsMTYuOTIxNTQyOSBMNTAuNzUwMDA4MSwxNi45MjE1NDI5IFoiIGlkPSLlkIjlubblvaLnirYiIHN0cm9rZT0iI0QwREFFRCIgc3Ryb2tlLXdpZHRoPSIwLjc0ODgiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTUxLjI4MDI4ODUsMTcuNDU1Njk3OSBMNjEuMjA2OTQ2NywyNy40NTQ4ODU3IEw1Mi40MDM0ODg1LDI3LjQ1NDg4NTcgQzUyLjA5MzMyNTQsMjcuNDU0ODg1NyA1MS44MTI1MjU0LDI3LjMyOTE2NzMgNTEuNjA5MjY2MiwyNy4xMjU5MDgxIEM1MS40MDYwMDcsMjYuOTIyNjQ4OCA1MS4yODAyODg1LDI2LjY0MTg0ODggNTEuMjgwMjg4NSwyNi4zMzE2ODU3IEw1MS4yODAyODg1LDI2LjMzMTY4NTcgTDUxLjI4MDI4ODUsMTcuNDU1Njk3OSBaIiBpZD0i55+p5b2iIiBzdHJva2U9IiNEMERBRUQiIHN0cm9rZS13aWR0aD0iMC43NDg4IiBmaWxsPSIjQ0FENUU4Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgIDxlbGxpcHNlIGlkPSLmpK3lnIblvaIiIGZpbGw9IiNDQUQ1RTgiIGZpbGwtcnVsZT0ibm9uemVybyIgY3g9IjMwLjc0NTMzNTciIGN5PSIzNi44NTUiIHJ4PSIxLjQ5MzM3NDI5IiByeT0iMS41MDQyODU3MSI+PC9lbGxpcHNlPgogICAgICAgICAgICAgICAgICAgICAgICA8ZWxsaXBzZSBpZD0i5qSt5ZyG5b2iLWNvcHktNCIgZmlsbD0iI0NBRDVFOCIgZmlsbC1ydWxlPSJub256ZXJvIiBjeD0iNDcuMTcyNDUyOCIgY3k9IjM2Ljg1NSIgcng9IjEuNDkzMzc0MjkiIHJ5PSIxLjUwNDI4NTcxIj48L2VsbGlwc2U+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00NC4xODU3MDQzLDQ0LjM3NjQyODYgQzQ0LjE4NTcwNDMsNDEuNDY4NjQ5NCA0MS44NDU1ODE3LDM5LjExMTQyODYgMzguOTU4ODk0MywzOS4xMTE0Mjg2IEMzNi4wNzIyMDY4LDM5LjExMTQyODYgMzMuNzMyMDg0Miw0MS40Njg2NDk0IDMzLjczMjA4NDIsNDQuMzc2NDI4NiIgaWQ9Iui3r+W+hCIgc3Ryb2tlPSIjQ0FENUU4IiBzdHJva2Utd2lkdGg9IjAuNzQ4OCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcuOTM2MjQ5ODIsMTMuNTM1OTYyMiBDOC4zOTYyMDkxLDEzLjUzNTk2MjIgOC43OTM0NDY2NiwxMy42ODMzODIyIDkuMTA3MDU1MjYsMTMuOTc4MjIyMiBDOS4zOTk3NTY2MiwxNC4yNzMwNjIyIDkuNTY3MDE0NTQsMTQuNjUyMTQyMiA5LjU2NzAxNDU0LDE1LjExNTQ2MjIgQzkuNTY3MDE0NTQsMTUuNTc4NzgyMiA5LjM5OTc1NjYyLDE1Ljk3ODkyMjIgOS4wODYxNDgwMiwxNi4yNzM3NjIyIEM4Ljc3MjUzOTQyLDE2LjU2ODYwMjIgOC4zOTYyMDkxLDE2LjcxNjAyMjIgNy45MzYyNDk4MiwxNi43MTYwMjIyIEM3LjQ3NjI5MDU0LDE2LjcxNjAyMjIgNy4wOTk5NjAyMiwxNi41NDc1NDIyIDYuNzg2MzUxNjIsMTYuMjUyNzAyMiBDNi40NzI3NDMwMiwxNS45NTc4NjIyIDYuMzI2MzkyMzQsMTUuNTc4NzgyMiA2LjMyNjM5MjM0LDE1LjExNTQ2MjIgQzYuMzI2MzkyMzQsMTQuNjUyMTQyMiA2LjQ3Mjc0MzAyLDE0LjI3MzA2MjIgNi43ODYzNTE2MiwxMy45NzgyMjIyIEM3LjA5OTk2MDIyLDEzLjY4MzM4MjIgNy40NzYyOTA1NCwxMy41MzU5NjIyIDcuOTM2MjQ5ODIsMTMuNTM1OTYyMiBaIE04LjMxMjU4MDE0LDEuMzg0MzQyMTggQzkuNjcxNTUwNzQsMS4zODQzNDIxOCAxMC43Nzk2MzQ1LDEuNzQyMzYyMTggMTEuNjE1OTI0MSwyLjUwMDUyMjE4IEMxMi40NTIyMTM3LDMuMjM3NjIyMTggMTIuODcwMzU4NSw0LjI0ODUwMjE4IDEyLjg3MDM1ODUsNS41MzMxNjIxOCBDMTIuODcwMzU4NSw2LjU4NjE2MjE4IDEyLjU5ODU2NDMsNy40NDk2MjIxOCAxMi4wOTY3OTA2LDguMTIzNTQyMTggQzExLjkwODYyNTQsOC4zMzQxNDIxOCAxMS4zMDIzMTU1LDguOTAyNzYyMTggMTAuMjk4NzY3OSw5Ljc4NzI4MjE4IEM5LjkyMjQzNzYyLDEwLjEwMzE4MjIgOS42NTA2NDM1LDEwLjQ2MTIwMjIgOS40NjI0NzgzNCwxMC44NDAyODIyIEM5LjI1MzQwNTk0LDExLjI2MTQ4MjIgOS4xNDg4Njk3NCwxMS43MDM3NDIyIDkuMTQ4ODY5NzQsMTIuMjA5MTgyMiBMOS4xNDg4Njk3NCwxMi4yMDkxODIyIEw5LjE0ODg2OTc0LDEyLjUwNDAyMjIgTDYuNzQ0NTM3MTQsMTIuNTA0MDIyMiBMNi43NDQ1MzcxNCwxMi4yMDkxODIyIEM2Ljc0NDUzNzE0LDExLjQwODkwMjIgNi44Njk5ODA1OCwxMC43MTM5MjIyIDcuMTYyNjgxOTQsMTAuMTQ1MzAyMiBDNy40MzQ0NzYwNiw5LjU3NjY4MjE4IDguMjQ5ODU4NDIsOC42OTIxNjIxOCA5LjYwODgyOTAyLDcuNDcwNjgyMTggTDkuNjA4ODI5MDIsNy40NzA2ODIxOCBMOS44NTk3MTU5LDcuMTc1ODQyMTggQzEwLjIzNjA0NjIsNi43MTI1MjIxOCAxMC40MjQyMTE0LDYuMjA3MDgyMTggMTAuNDI0MjExNCw1LjY4MDU4MjE4IEMxMC40MjQyMTE0LDQuOTg1NjAyMTggMTAuMjE1MTM5LDQuNDM4MDQyMTggOS44Mzg4MDg2Niw0LjAzNzkwMjE4IEM5LjQ0MTU3MTEsMy42Mzc3NjIxOCA4Ljg3NzA3NTYyLDMuNDQ4MjIyMTggOC4xNjYyMjk0NiwzLjQ0ODIyMjE4IEM3LjI0NjMxMDksMy40NDgyMjIxOCA2LjU5ODE4NjQ2LDMuNzIyMDAyMTggNi4yMDA5NDg5LDQuMzExNjgyMTggQzUuODQ1NTI1ODIsNC43OTYwNjIxOCA1LjY3ODI2NzksNS40OTEwNDIxOCA1LjY3ODI2NzksNi4zNzU1NjIxOCBMNS42NzgyNjc5LDYuMzc1NTYyMTggTDMuMjk0ODQyNTMsNi4zNzU1NjIxOCBDMy4yOTQ4NDI1Myw0LjgxNzEyMjE4IDMuNzMzODk0NTcsMy41OTU2NDIxOCA0LjY1MzgxMzE0LDIuNzExMTIyMTggQzUuNTUyODI0NDYsMS44MjY2MDIxOCA2Ljc2NTQ0NDM4LDEuMzg0MzQyMTggOC4zMTI1ODAxNCwxLjM4NDM0MjE4IFoiIGlkPSLlkIjlubblvaLnirYiIGZpbGw9IiNFQUVBRUEiIGZpbGwtcnVsZT0ibm9uemVybyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC4wODI2MDAsIDkuMDUwMTgyKSByb3RhdGUoLTMwLjAwMDAwMCkgdHJhbnNsYXRlKC04LjA4MjYwMCwgLTkuMDUwMTgyKSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI0LjI5NjkxNjQsMTkuNDUzMzkzNSBMMjQuMjk2NDUsMjEuMzMzMzkzNSBMMjYuMTYzNjM0MywyMS4zMzM3NTA3IEwyNi4xNjM2MzQzLDI0LjM0MjMyMjEgTDI0LjI5NjQ1LDI0LjM0MTM5MzUgTDI0LjI5NjkxNjQsMjYuMjIyNjc5MyBMMjEuMzEwMTY3OCwyNi4yMjI2NzkzIEwyMS4zMDk0NSwyNC4zNDEzOTM1IEwxOS40NDM0NSwyNC4zNDIzMjIxIEwxOS40NDM0NSwyMS4zMzM3NTA3IEwyMS4zMDk0NSwyMS4zMzMzOTM1IEwyMS4zMTAxNjc4LDE5LjQ1MzM5MzUgTDI0LjI5NjkxNjQsMTkuNDUzMzkzNSBaIiBpZD0i5ZCI5bm25b2i54q2IiBmaWxsPSIjRUFFQUVBIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyLjgwMzU0MiwgMjIuODM4MDM2KSByb3RhdGUoLTMxNS4wMDAwMDApIHRyYW5zbGF0ZSgtMjIuODAzNTQyLCAtMjIuODM4MDM2KSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIyLjkwNzg0ODUsNTAuMzkzNTcxNCBMNDAuMDc2MTk3MSw1MC4zOTM1NzE0IEM0MC4yODM4OTU2LDUwLjM5MzU3MTQgNDAuNDUyMjY4NSw1MC41NjE5NDQzIDQwLjQ1MjI2ODUsNTAuNzY5NjQyOSBDNDAuNDUyMjY4NSw1MC45NzczNDE0IDQwLjI4Mzg5NTYsNTEuMTQ1NzE0MyA0MC4wNzYxOTcxLDUxLjE0NTcxNDMgTDIyLjkwNzg0ODUsNTEuMTQ1NzE0MyBDMjIuNzAwMTUsNTEuMTQ1NzE0MyAyMi41MzE3NzcxLDUwLjk3NzM0MTQgMjIuNTMxNzc3MSw1MC43Njk2NDI5IEMyMi41MzE3NzcxLDUwLjU2MTk0NDMgMjIuNzAwMTUsNTAuMzkzNTcxNCAyMi45MDc4NDg1LDUwLjM5MzU3MTQgWiIgaWQ9IuefqeW9oiIgZmlsbD0iI0U1RTlGMSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIuOTA3ODQ4NSw1NC45MDY0Mjg2IEw0Ny41NDMwNjg1LDU0LjkwNjQyODYgQzQ3Ljc1MDc2NzEsNTQuOTA2NDI4NiA0Ny45MTkxNCw1NS4wNzQ4MDE1IDQ3LjkxOTE0LDU1LjI4MjUgQzQ3LjkxOTE0LDU1LjQ5MDE5ODUgNDcuNzUwNzY3MSw1NS42NTg1NzE0IDQ3LjU0MzA2ODUsNTUuNjU4NTcxNCBMMjIuOTA3ODQ4NSw1NS42NTg1NzE0IEMyMi43MDAxNSw1NS42NTg1NzE0IDIyLjUzMTc3NzEsNTUuNDkwMTk4NSAyMi41MzE3NzcxLDU1LjI4MjUgQzIyLjUzMTc3NzEsNTUuMDc0ODAxNSAyMi43MDAxNSw1NC45MDY0Mjg2IDIyLjkwNzg0ODUsNTQuOTA2NDI4NiBaIiBpZD0i55+p5b2iLWNvcHktNiIgZmlsbD0iI0U1RTlGMSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iLWNvcHktNyIgZmlsbD0iI0U1RTlGMSIgeD0iMjIuNTMxNzc3MSIgeT0iNTkuNDE5Mjg1NyIgd2lkdGg9IjMyLjg1NDIzNDMiIGhlaWdodD0iMSIgcng9IjAuNSI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iLWNvcHktOCIgZmlsbD0iI0U1RTlGMSIgeD0iMjIuNTMxNzc3MSIgeT0iNjMuOTMyMTQyOSIgd2lkdGg9IjMyLjg1NDIzNDMiIGhlaWdodD0iMSIgcng9IjAuNSI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iLWNvcHktOSIgZmlsbD0iI0U1RTlGMSIgeD0iMjIuNTMxNzc3MSIgeT0iNjguNDQ1IiB3aWR0aD0iMzIuODU0MjM0MyIgaGVpZ2h0PSIxIiByeD0iMC41Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNC4wMDc0MjE5LDYwLjggTDE0LjAwNzQyMTksNjguOCBNMTgsNjQuODE5ODczIEwxMCw2NC44MTk4NzMiIGlkPSLlkIjlubblvaLnirYiIHN0cm9rZT0idXJsKCNsaW5lYXJHcmFkaWVudC0zKSIgc3Ryb2tlLXdpZHRoPSIxLjYiIG9wYWNpdHk9IjAuNTM1NDEyMDE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTguODA3NDIxOSw5NS4yIEw5OC44MDc0MjE5LDEwMy4yIE0xMDIuOCw5OS4yMTk4NzMgTDk0LjgsOTkuMjE5ODczIiBpZD0i5ZCI5bm25b2i54q2LWNvcHktMiIgc3Ryb2tlPSJ1cmwoI2xpbmVhckdyYWRpZW50LTMpIiBzdHJva2Utd2lkdGg9IjEuNiIgb3BhY2l0eT0iMC41MzU0MTIwMTYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTguODAwMDAwLCA5OS4yMDAwMDApIHJvdGF0ZSgtMzE1LjAwMDAwMCkgdHJhbnNsYXRlKC05OC44MDAwMDAsIC05OS4yMDAwMDApICI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtMTQiIHN0cm9rZT0idXJsKCNsaW5lYXJHcmFkaWVudC0zKSIgc3Ryb2tlLXdpZHRoPSIxLjYiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuNTM1NDEyMDE2IiBjeD0iNTgiIGN5PSIxMiIgcj0iMy4yIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="position" label="职务" align="center"></el-table-column>
        <el-table-column prop="mobile1" label="移动电话" align="center"></el-table-column>
        <el-table-column prop="homeTel" label="固定电话" align="center"></el-table-column>
      </el-table>
    </div> -->
    <div v-if="departmentDetails.id">
      <!-- 职责详情 -->
      <div
        :class="ContactList.details"
      >
        <div :class="ContactList.detailsGroup">
          <div>{{ departmentDetails.groupName }}</div>
          <div>
            <sv-button
              type="primary"
              @click="editData(departmentDetails, 1)"
            >
              编辑
            </sv-button>
            <sv-button
              type="primary"
              @click="delData(departmentDetails, 1)"
            >
              删除
            </sv-button>
          </div>
        </div>
        <div :class="ContactList.detailsDuty">
          部门职责:{{ departmentDetails.responsibilities }}
        </div>
      </div>
      <!-- 职务 -->
      <div
        :class="ContactList.post"
      >
        <div :class="ContactList.postHeader">
          <div>
            部门职务
          </div>
          <div>
            <sv-button
              type="primary"
              @click="addPost(2)"
            >
              添加
            </sv-button>
          </div>
        </div>
        <!-- 职务详情 -->
        <div
          v-for="(item,index) in departmentPost"
          :key="index"
          :class="ContactList.postDetail"
        >
          <div :class="ContactList.postDetailHeader">
            <div>{{ item.name }}</div>
            <div>
              <sv-button
                type="primary"
                @click="editData(item, 2)"
              >
                编辑
              </sv-button>
              <sv-button
                type="primary"
                @click="delData(item, 2)"
              >
                删除
              </sv-button>
            </div>
          </div>
          <div>职责:{{ item.responsibility }}</div>
          <div>
            成员:
            <span
              v-for="(val,i) in item.mailContactorEntityList"
              :key="i"
            >
              {{ val.name }}{{ val.workUnit }}/{{ val.position }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      :class="ContactList.empty"
    >
      <span :class="ContactList.emptyText">暂无数据</span>
    </div>
    <el-dialog
      :visible.sync="delDataView"
      width="410px"
      :title="'删除'+(type===1?'部门':'职务')"
      center
      append-to-body
    >
      <p style="text-align:center;">是否删除-{{name}}?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delDataView = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="delHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <add-group-or-unit
      ref="groupUnitView"
      :linkman="linkman"
      @saveGroup="saveGroup(arguments)"
      @editGroup="editGroup(arguments)"
      @contact-view-handle="contactViewHandle"
    />
    <!-- 派发联系人视图 -->
    <linkman-draggable
      v-show="showcommonLink"
      ref="commonLink"
      @OnchildByValue="handelLinkdata"
    />
  </div>
</template>

<script>
import LinkmanDraggable from '@/views/common/LinkmanDraggable ';
import AddGroupOrUnit from "../ContactGroup/AddGroupOrUnit";
import bus from '@/views/common/js/eventBus';
import AddContact from './AddContact';

export default {
  name: 'OrganizationalStructure',
  components: {
    LinkmanDraggable,
    AddGroupOrUnit,
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      showcommonLink: false,
      unitId: '', // 当前组Id
      title: '',
      // 部门详情
      departmentDetails: {},
      // 部门职务
      departmentPost: {},
      // 部门id
      id: '',
      // 类别1:部门 2:职务
      name: '', // 删除对象
      type: '',
      // 预案id
      ReservePlanId: '',
      // 联系人id
      contacts: [],
      // 联系人数据
      linkman: [],
      delDataView: false, // 删除职务视图
      // 存在预案时候的组id
      saveUnitId: '',
    };
  },
  mounted() {
    bus.$off('addContact');
    bus.$on('addContact', (val) => {
      if (val) {
        console.log(val);
        this.unitId = val.id;
        this.title = val.name;
        // 存在预案id
        if (val.incidentPlanId) {
          // console.log(val);
          // 获取部门详情
          this.getDepartmentDetails(this.unitId);
          // 查找数据节点id
          this.findChild(val);
          // 若存在预案id，设置部门id值
          this.saveUnitId = val.id;
        }
        console.log(this.saveUnitId);
        // this.getContactList();
      } else {
        // console.log(val);
        this.departmentDetails = {};
        this.tableData = [];
        this.title = '';
      }
    });
    // bus.$off('getContactGroup');
    // bus.$on('getContactGroup', (val) => {
    //   this.ReservePlanId = val.id;
    //   console.log('valvalvalvalvalval', val);
    // });
    bus.$off('getContactList');
    bus.$on('getContactList', (val) => {
      // console.log('valvalvalvalvalval', val);
      // 获取部门详情
      // this.getDepartmentDetails(this.ReservePlanId);
      if (val) {
        this.ReservePlanId = val.id;
      }
      // // 查找数据节点id
      // this.findChild(val);
    });
  },
  methods: {
    delDepartment() {
      
    },
    // 删除分组
    delHandle() {
      this.$http({
        url: this.$http.adornUrl(
          `/incidentplan/${
            this.type === 1 ? "rpIncidentMailgroup" : "rpIncidentUnit"
          }/delete`
        ),
        method: 'post',
        data: this.$http.adornData({
          ids: [this.id.toString()],
        }),
      }).then(({ data }) => {
        // console.log(data);
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: '成功删除',
            duration: 1500,
            onClose: () => {
              bus.$emit('showDetail', this.ReservePlanId);
            },
          });
        } else {
          this.$message.error(data.msg);
        }
        this.delDataView = false;
      });
    },
    delData(obj, type) {
      // console.log(obj);
      this.id = obj.id;
      this.type = type;
      this.name = obj.name;
      this.delDataView = true;
    },
    saveGroup(saveArguments) {
      const [name, responsibility, parentId, responsibilities, mailContactIds] = saveArguments;
      // 添加部门
      if (this.type === 1) {
        this.$http({
          url: this.$http.adornUrl("/incidentplan/rpIncidentMailgroup/save"),
          method: "post",
          data: this.$http.adornData({
            name,
            parentId,
            responsibilities,
            incidentPlanId: this.ReservePlanId, // 预案id
          }),
        }).then(({ data }) => {
          // console.log(data);
          if (data.code === 0) {
            this.$message({
              type: "success",
              message: "成功添加分组"
            });
            bus.$emit("showDetail", this.ReservePlanId);
          } else {
            this.$message.error(data.message);
          }
        });
      } else {
        if (mailContactIds.length > 0) {
          this.contacts = [];
          mailContactIds.forEach((item) => {
            this.contacts.push(item.id);
          });
        }
        // console.log(saveArguments, this.contacts);
        console.log(this.unitId);
        // 添加职务
        this.$http({
          url: this.$http.adornUrl('/incidentplan/rpIncidentUnit/save'),
          method: 'post',
          data: this.$http.adornData({
            name,
            responsibility,
            // incidentMailgroupId: this.unitId, // 部门id
            incidentMailgroupId: this.saveUnitId || this.unitId || -1, // 部门id
            mailContactIds: this.contacts,
          }),
        }).then(({ data }) => {
          // console.log(data);
          if (data.code === 0) {
            this.$message({
              type: "success",
              message: "成功添加单位"
            });
            bus.$emit("showDetail", this.ReservePlanId);
          } else {
            this.$message.error(data.message);
          }
        });
      }
    },
    editGroup(editArguments) {
      // console.log(editArguments, this.ReservePlanId);
      const [name, responsibility, parentId, responsibilities, mailContactIds] = editArguments;
      // 编辑单位、分组
      if (this.type === 1) {
        this.$http({
          url: this.$http.adornUrl(
            '/incidentplan/rpIncidentMailgroup/update',
          ),
          method: 'post',
          data: this.$http.adornData({
            name,
            parentId,
            responsibilities,
            id: this.id,
          }),
        }).then(({ data }) => {
        // console.log(data);
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '成功编辑部门',
            });
            bus.$emit('showDetail', this.ReservePlanId);
          } else {
            this.$message.error(data.message);
          }
        });
      // this.$http({
      //   url: this.$http.adornUrl(
      //     `/incidentplan/${
      //       this.type === 1 ? 'rpIncidentMailgroup' : 'rpIncidentUnit'
      //     }/update`,
      //   ),
      //   method: 'post',
      //   data: this.$http.adornData({
      //     name,
      //     parentId,
      //     responsibilities,
      //     id: this.id,
      //   }),
      // }).then(({ data }) => {
      //   // console.log(data);
      //   if (data.code === 0) {
      //     this.$message({
      //       type: 'success',
      //       message: this.type === 1 ? '成功编辑分组' : '成功编辑单位',
      //     });
      //     bus.$emit('showDetail', this.ReservePlanId);
      //   } else {
      //     this.$message.error(data.message);
      //   }
      // });
      } else {
        if (mailContactIds && mailContactIds.length > 0) {
          this.contacts = [];
          mailContactIds.forEach((item) => {
            this.contacts.push(item.id);
          });
        }
        // console.log(this.contacts);
        this.$http({
          url: this.$http.adornUrl(
            '/incidentplan/rpIncidentUnit/update',
          ),
          method: 'post',
          data: this.$http.adornData({
            name,
            parentId,
            responsibility,
            id: this.id,
            mailContactIds: this.contacts
          }),
        }).then(({ data }) => {
          // console.log(data);
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '成功编辑部门职责',
            });
            bus.$emit('showDetail', this.ReservePlanId);
          } else {
            this.$message.error(data.message);
          }
        });
      }
    },
    addPost(type) {
      this.type = type;
      // this.$refs.groupUnitView.getDataList(null, "添加", 2);
      this.$refs.groupUnitView.getDataList(null, '新增', 2);
    },

    /**
     * @description: 编辑部门/职务
     * @param {Object} obj 部门数据
     * @param {Number} type 用于判断是部门还是职务
     */
    editData(obj, type) {
      // console.log(obj);
      this.id = obj.id;
      this.type = type;
      this.$refs.groupUnitView.getDataList(obj, '编辑', type);
    },
    /**
     * @description: 寻找数据下所有节点id
     * @param {Objct} obj 获取到的部门数据
     */
    findChild(obj) {
      let selectedNode = [];
      function findChildren(obj ,selectedNode) {
        selectedNode.push(obj.id);
        if (obj.children != null) {
          obj.children.forEach((item) => {
            findChildren(item, selectedNode);
          });
        }
      }
      findChildren(obj, selectedNode);
      // console.log(obj, selectedNode);
      // 获取部门职务
      this.getDepartmentPost(selectedNode);
    },
    /**
     * @description: 获取部门职务
     * @param {Number} ids 部门ids
     */
    getDepartmentPost(ids) {
      this.$http({
        url: this.$http.adornUrl('/incidentplan/rpIncidentUnit/getUnitByMailGroup'),
        method: 'post',
        data: this.$http.adornData({
          ids,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          // console.log(data);
          this.departmentPost = data.data;
        }
      });
    },
    /**
     * @description: 获取部门详情
     * @param {Number} id 部门id
     */
    getDepartmentDetails(id) {
      this.$http({
        url: this.$http.adornUrl(`/incidentplan/rpIncidentMailgroup/info/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          id,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          // console.log(data);
          this.departmentDetails = data.data;
        }
      });
    },
    // 初始化联系人列表
    getContactList() {
      this.$http({
        url: this.$http.adornUrl('/incidentplan/rpIncidentUnit/getContactorByUnit'),
        method: 'get',
        params: this.$http.adornParams({
          id: this.unitId,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.tableData = data.data;
        } else {
          this.tableData = [];
          this.$message.error(data.msg);
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加联系人试图
    contactHandle() {
      if (this.unitId) {
        this.$refs.AddContactView.getDataList(this.tableData);
        // console.log("this.tableDatathis.tableDatathis.tableDatathis.tableDatathis.tableData",this.tableData)
        // console.log(this.tableData)
      } else {
        this.$message.error('请选择单位');
      }
    },
    // 添加联系人
    addContact(mailContactIds) {
      this.$http({
        url: this.$http.adornUrl('/incidentplan/rpIncidentUnit/saveContactorToUnit'),
        method: 'post',
        data: this.$http.adornData({
          mailContactIds,
          id: this.unitId,
        }),
      }).then(({ data }) => {
        // console.log(data)
        if (data && data.code == 0) {
          this.$message({
            message: '成功添加联系人',
            type: 'success',
          });
          this.getContactList();
          this.showcommonLink = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 选择联系人视图
    contactViewHandle() {
      if (this.unitId) {
        this.showcommonLink = true;
        this.$nextTick(() => {
          this.$refs.commonLink.handleAddContacts(
            '/mail/mailgroup/list',
            '请选择',
          );
        });
      } else {
        this.$message.error('请选择单位');
      }
    },
    // 选择联系人数据
    handelLinkdata({ linkman }) {
      // console.log(linkman)
      // console.log(this.contacts);
      const contacts = [];
      for (let i = 0; i < linkman.length; i++) {
        contacts.push(linkman[i].id);
      }
      // 保存联系人数据
      this.linkman = linkman;
      // 保存联系人id
      this.contacts = contacts;
      // this.addContact(contacts);
    },
    // delHandle() {
    //   // console.log(this.multipleSelection.map(v=>v.id))
    //   this.$http({
    //     url: this.$http.adornUrl('/incidentplan/rpIncidentUnit/deleteUnitContactor'),
    //     method: 'post',
    //     data: this.$http.adornData({
    //       mailContactIds: this.multipleSelection.map((v) => v.id),
    //       id: this.unitId,
    //     }),
    //   }).then(({ data }) => {
    //     // console.log(data)
    //     if (data && data.code == 0) {
    //       this.$message({
    //         message: '成功添加联系人',
    //         type: 'success',
    //       });
    //       this.getContactList();
    //     } else {
    //       this.$message.error(data.msg);
    //     }
    //   });
    // },
  },
};
</script>

<style lang="scss" module="ContactList">
.wrapper{
  padding: 0 20px;
  min-width: 500px;
  // 部门详情
  .details{
    border-bottom: 1px solid #ccc;
    .detailsGroup{
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: space-between;
    }
    .detailsDuty{
      overflow-y: auto;
    &::-webkit-scrollbar{
      display: none;
    }
    }
  }
  // 部门职务
  .post{
    max-height: 600px;
    overflow-y: auto;
    &::-webkit-scrollbar{
      display: none;
    }
    // 职务头部
    .postHeader{
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: space-between;
    }
    // 职务详情
    .postDetail{
      min-height: 150px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 10px;
      margin-bottom: 10px;
      // 详情头部
      .postDetailHeader{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  // 暂无数据
  .empty{
    position: relative;
    min-height: 50%;
    text-align: center;
    width: 100%;
    .emptyText{
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      color: #909399;
      font-size: 14px;
    }
  }
}
</style>
