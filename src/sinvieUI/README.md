# sinvieUI手册

* 版本号：4.5.0-alpha

* 日期：2021-05-27

* 作者：谭晋峰

* 仅供欣纬公司内部使用，请勿外传

# 一、组件

* 在main.js中引入：`import sinvieUI from '@/sinvieUI'`和`Vue.use(sinvieUI)`

## 1. 按钮

***

### 1.1. 一般按钮

#### # 使用
`<sv-button>按钮名字</sv-button>`

#### # 参数传递

|参数名|类型|默认值|可选值|描述|
|:-:|:-:|:-:|:-:|:--|
|type|字符串|''|primary, secondary|按钮类型，默认是灰框白底，type='primary'则为蓝底白字， type='secondary'则为浅蓝色|
|width|字符串|auto|'250px'|按钮的宽度|

### 1.2. 更多按钮

#### # 使用

``<sv-button-more/>`

* 每个按钮点击后都会显示确认弹框，点击确认后会出现旋转的图标，表示正在执行，需要在操作执行完后手动关闭（`this.$refs.buttonMore.exportingAll = false`）

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|importData|布尔值|true|是否显示“导入”选项|
|exportTemplate|布尔值|true|是否显示“导出模板”选项|
|exportQuery|布尔值|true|是否显示“部分导出”选项|
|exportAll|布尔值|true|是否显示“全部导出”选项|
|exportQrcode|布尔值|true|是否显示“二维码导出”选项|
|batchDelete|布尔值|true|是否显示“批量删除”选项|

#### # 事件传递

|事件名|描述|
|:-:|:--|
|import-data|点击“导入”选项|
|export-template|点击“导出模板”选项|
|export-query|点击“部分导出”选项|
|export-all|点击“全部导出”选项|
|export-qrcode|点击“二维码导出”选项|
|delete-selected|点击“批量删除”选项|

#### # 变量属性

|变量名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|exportingAll|布尔值|false|是否显示“正在导出已选分组数据”的图标|
|exportingQuery|布尔值|false|是否显示“正在导出所有查询数据”的图标|
|exportingQrcode|布尔值|false|是否显示“正在导出二维码”的图标|
|importingData|布尔值|false|是否显示“正在导入数据”的图标|
|downloadingTemplate|布尔值|false|是否显示“正在下载模板”的图标|
|deletingSelected|布尔值|false|是否显示“正在批量删除”的图标|

## 2. 输入框

***

### 2.1. 搜索

#### # 使用

`<sv-input-search/>`
* 一般输入框：`<sv-input-search :suffix="false"/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|变量|无|双向绑定input值|
|placeholder|字符串|'请输入关键字'|占位符|
|width|字符串|'250px'|元素容器宽度|
|suffix|布尔值|true|是否显示放大镜图标|
|clearable|布尔值|true|数据是否可一键清空|
|readonly|布尔值|false|是否只是可读|
|disabled|布尔值|false|是否禁用|

|事件名|描述|参数|
|:-:|:--|---|
|change|input值改变时触发|input值|

### 2.2. 自适应高度textarea

#### # 使用

`<sv-textarea/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|变量|无|双向绑定input值|
|placeholder|字符串|'请输入关键字'|占位符|
|width|字符串|'100%'|元素容器宽度|
|readonly|布尔值|false|是否只是可读|
|rows|数字|1|最小行数|
|maxlength|数字|null|最大字数|
|scroll|布尔值|false|是否限定高度出现scrollbar|

|事件名|描述|参数|
|:-:|:--|---|
|change|input值改变时触发|input值|

## 3. 选择器

***

### 3.1 一般选择器

#### # 使用

`<sv-select/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|变量|无|双向绑定input值|
|options|数组|[]|见下方options格式|
|placeholder|字符串|'请选择'|占位符|
|width|字符串|'150px'|元素容器宽度|
|clearable|布尔值|true|数据是否可一键清空|
|align|字符串|'center'|文字对齐|

|事件名|描述|参数|
|:-:|:--|---|
|change|选项改变时触发|选项的值|

#### # options格式

|字段名|类型|描述|
|:-:|:-:|:--|
|label|字符串|选项显示的内容|
|value|字符串或数字|选项代表的值|
|active|布尔值|可选，是否禁用该选项（灰色不可选）|

### 3.2 日期范围选择器

* 基于elementUI封装，省去组件配置和样式，只需要绑定变量
* 等一个后来人抛弃第三方组件独立写一个日期选择器

#### # 使用

`<sv-select-date v-model="dateRange"/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|数组|`['', '']`|双向绑定日期值（必须绑定一个数组变量），日期值是长度等于2的数组（为空时返回`['', '']`），第一个元素是开始时间，第二个元素是结束时间|

|事件名|描述|参数|
|:-:|:--|---|
|change|日期值改变时触发|日期值（数组）|

### 3.3 分组选择

#### # 使用

`<sv-select-group v-model="id" :name="name"/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|数字或字符串||选择的分组id|
|name|字符串||选择的分组名|

#### # 事件

|事件名|描述|参数|
|:-:|:--|---|
|change|选择分组改变时|选择的分组id|

### 3.4 多个时间范围选择

#### # 使用

`<sv-select-time-range name="标题" v-model="data"/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|数组|[{startTime: '09:00', endTime: '12:00'}]|时间范围数据|
|name|字符串||标题名，可省略|
|limit|布尔值/数值/字符串|2|班次最大数|

### 3.5 选择项目

#### # 使用

`<sv-select-item v-model="[{...}, {...}]" :api="['/treeApi', '/tableApi']"/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|数组||选择项目的数据|
|api|数组||两个字符串元素，第一个元素是分组树形的接口，第二个元素是项目列表的接口|
|title|字符串|项目|按钮名字|

### 3.6 选择摄像头

#### # 使用

* 从riskCameraEntities中获取indexCode和name用于渲染
* 确定时传递值到indexCodeList，用于新增、保存、更新、编辑

```html
<sv-select-camera
    :setting="{
        api: 'risk/riskcamera/list',
        params: {
            platformId: '',
            cameraType: ''
        }
    }"
    v-model="formData.indexCodeList"
    :riskCameraEntities="formData.riskCameraEntities"
/>
```

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|数组||选择的摄像头的indexCode数组，用于更新数据|
|setting|对象||接口和额外参数|
|riskCameraEntities|数组||已选择的摄像头的详细信息，用于渲染|

### 3.7 选择联系人

#### # 使用

* 单选的时候v-model绑定id，渲染需要依赖传参detail（mailContactor）
* 多选时v-model一个人员详细信息的列表

```html
<sv-select-contact
    title="工作人员"
    v-model="formData.garbageMemberList"
    :multiple="true"
/>
```

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|v-model|数组或字符串||多选时为数组，单选为字符串|
|detail|对象||单选时的人的详情|
|multiple|布尔值|false|是否为多选|

## 4. 树形

***

### 4.1. 树形标签

#### # 使用

`<sv-tree-tab/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|:-:|:-:|:-:|:--|
|tabList|数组|['标签A', '标签B', '标签C']|标签名|

|事件名|描述|参数|
|:-:|:--|---|
|switch|标签切换时触发|tabList的下标，从0开始|


### 4.2. 树形搜索

#### # 使用

`<sv-input-tree-search><sv-input-tree-search>`
* 只是样式有所不同，其余与`<sv-input-search>`相同

## 5. 弹框

***

### 5.1. 提示弹框

#### # 使用

`<sv-dialog-hint/>`

#### # 参数传递

|参数名|类型|默认值|可选值|描述|
|:-:|:-:|:-:|:-:|:--|
|type|字符串|''|'delete', 'alert', 'success', 'fail', 'normal'|可省略，提示弹框的类型，不同类型有不同的图标和预设文本|
|title|字符串|'提示'||弹框的标题文本
|text|字符串|不同类型有不同的默认值||提示文本
|supplement|字符串|||提示文本下方的补充说明，超出长度时可滚动
|modal|布尔值|false|true|遮罩是否为灰黑色|

### 5.2 一般弹框

#### # 使用

`<sv-dialog>your html</sv-dialog>`

#### # 参数

|参数名|类型|默认值|可选值|描述|
|:-:|:-:|:-:|:-:|:--|
|title|字符串|''||弹框标题|
|modal|布尔值|true|false|遮罩是否为灰色|

#### # 事件传递

|事件名|描述|
|cancel|点击关闭、取消、ESC|
|confirm|点击确定|
|modal|点击遮罩|

#### # 插槽
```html
<!-- 标题 -->
<template #title></template>

<!-- 正文，默认插槽 -->
<sv-dialog></sv-dialog>

<!-- 底部：缺省时为取消确定按钮 -->
<template #footer></template>
```

### 5.3 预览弹窗

#### # 使用

* `this.$preview(file)`
* `file`是一个对象，属性如下
    * `name`：文件名
    * `url`：文件地址

## 6. 表格相关

### 6.1 操作按钮

#### # 使用

`<sv-table-operation :display="['view', 'edit', 'delete']" @view="myFunc()"/>`

* 'audit', 'submit', 'resubmit'三个按钮图标一样，但是显示的文本不一样，分别是审核、报审、重新报审

#### # 参数传递

|参数名|类型|默认值|可选值|描述|
|:-:|:-:|:-:|:-:|:--|
|display|数组|['view', 'edit', 'delete']|['edit', 'delete', 'view', 'start', 'stop', 'qrcode', 'add', 'audit', 'submit', 'resubmit', 'download', 'collect', 'contactor', 'call', 'link', 'lock', 'unlock', 'recall', 'export', 'setting', 'cross', 'monitor', 'release']|所需要显示的按钮，灰色不可点击的按钮加后缀(eq. view_disable)，按照顺序生成

#### # 事件传递

|事件名|描述|
|:-:|:--|
|与按钮名同名|对应的按钮点击，例如`@view="myFunc()"`|

### 6.2 文字缩略显示

#### # 使用

`<sv-table-tooltip>很长很长的文本</sv-table-tooltip>`

* 当表格中某一列的文本（比如情况说明）很长的时候，使用这个组件，超过三行会在结尾显示省略号，并且调用`<el-tooltip>`，不超过则正常显示
* 等一个后来人独立实现

## 7. 上传

### 7.1. 上传照片

#### # 使用

`<sv-upload-img v-model="fileList"/>`

#### # 参数传递

|参数名|类型|默认值|描述|
|---|---|---|---|
|v-model|数组||文件列表|
|api|字符串|'/upload/emergencyHandleProcessFile'|上传文件的接口，可不填|
|compress|布尔值|true|是否开启图片压缩，宽高最大2000|
|isView|布尔值|true|是否仅限为预览查看|

#### # 使用

 `<sv-upload v-model="fileList" />`

#### # 参数传递

|参数名|类型|默认值|描述|
|---|---|---|---|
|v-model|对象数组||文件列表（包含url和name）|
|isView|布尔值|false|为真时限制对附件的增删操作，但仍支持预览及下载|

# 二、样式

* 在main.js中引入：`import '@/sinvieUI/scss/index.scss'`

## 1. elementUI组件

* 在调用的elementUI组件的外层标签增加对应类名即可

### 1.1 树形控件

```html
<div class="sv-tree">
    <el-tree></el-tree>
</div>
```

### 1.2 表格

```html
<div class="sv-table">
    <el-table></el-table>
</div>
```

### 1.3 分页器

```html
<div class="sv-pagination">
    <el-pagination></el-pagination>
</div>
```

### 1.4 载入图标

```html
<div
    v-loading="flag"
    element-loading-spinner="sv-loading"
>
</div>
```

# 三、模板

## 1. 三栏式布局

* 右边栏待实现

### # 使用

* 模板预设大部分常用组件以及JS脚本，如树形、表格、部分按钮及其逻辑，需要自定义请使用插槽功能
* 实例可以参照UI模板页面`sinvieUI.vue`

```html
<sv-template></sv-template>
```

### 1.1 左边栏

#### # 插槽

```html
slot-1：
<template #left__container>
    <!-- 整个左边栏 -->
    <!-- 插入一个空的行内元素则不显示整个左边栏 -->
</template>

slot-2：
<template #left__content>
    <!-- 自定义左边栏的内容，保留了左边栏的框和折叠按钮 -->
</template>

slot-3：
<template #tree__operation>
    <!-- 自定义树节点的操作按钮 -->
    <!-- 默认是删除、编辑、新增三个按钮 -->
</template>
```

#### # 参数传递

* `treeSetting`
    * `tab`: 【数组】最上方可切换标签名的列表，不需要则不传
    * `api`: 【数组/字符串】后台接口，不带服务器和端口，只有一条的时候可以传字符串
    * `searchAdd`: 【布尔值】搜索框旁的新增，用于树形不要新增但搜索框的新增保留的情况
    * `edit`: 【布尔值或对象或数组】树节点是否可编辑（新增、编辑、删除按钮），可省略，默认为false
        * 取值为true时，按钮出现，分别对应四个事件['tree-node-add', 'tree-add', 'tree-node-edit', 'tree-node-delete']
        * 取值为对象{delete, update, delete}，使用预设的新增编辑删除操作，取值对应三个api接口，属性取值为true时则只显示按钮不使用预设逻辑
        * 取值为数组，取值和`sv-table-operation`的`display` attribute相同，可以自由配置
    * `overload.getTree`
    * 函数，用来覆盖默认的`getTree`方法
    * 第一个参数是axios请求参数，第二个参数是`sv-template`组件实例的`this`，可以访问所有属性
    * 需要修改的重要参数是`treeList`（树形数据）
    * 举例：
        ```vue
        <sv-template
            :overload="{
                getTree: (request, vm) => {
                    vm.treeLoading = true;
                    $http(request).then((response) => {
                        // 树形数据
                        vm.treeList = response.data.data.list;
                    }).finally(() => {
                        vm.treeLoading = false;
                    })
                }
            }"
        >
        <sv-template>
        ```

```html
<sv-template
    :treeSetting = "{
        tab: [],    // ['tab1', 'tab2']
        api: [],    // ['/api/getdata', '/api/gettreedata']
        edit: true
    }"
><sv-template>
```

* `treeProps`
    * 本身是`el-tree`的参数，一般不需要配置，使用模板预设默认值即可
```html
<sv-template
    :treeProps = "{
        children: 'children',
        label: 'name',
        value: 'id',
        disabled: data => data.id == 0  // 预设树形的数据顶部会增加一个“全部节点”，其id为0，所以设置为不可勾选
    }"
><sv-template>
```

#### # 事件

* `@tree-click`
    * 参数1 `data`: 点击的节点的数据，点击全部时为`null`
    * 参数2 `tabIndex`: 当前激活的树标签，值为其下标，从0开始
    * 一般配合下方`getTableList`方法使用

* `@tree-node-delete`、`@tree-node-edit`、`@tree-node-add`
    * 树节点编辑
    * 参数 `data`: 点击的节点的数据

* `@tree-add`
    * 搜索框旁边的加号按钮

* `@date-change`
    * 日期选择器取值变化

* `@collapse`
    * 左边栏折叠，返回布尔值

#### # 方法

* `getTree(tabIndex)`
    * 请求树形数据
    * tabIndex：树标签页的下标，没有书标签页的时候可以传0或者省略
    * 使用示例：`this.$refs.template.getTree()`，`this.$refs.template.getTree(1)`

* `getDate()`
    * 获取时间选择器取值

* `getTreeChecked()`
    * 获取所有树形勾选的节点

* `getTableChecked()`
    * 获取所有表格勾选的数据

* `getTreeNodeChildren(id)`
    * 获取树节点的所有子孙节点
    * 树节点的id
    * 返回一个数组，包括树节点自身及其所有子孙节点的id

### 1.2 中间栏

#### # 插槽

```html
slot-1：
<template #middle__container>
    <!-- 整个中间栏 -->
    <!-- 插入一个空的行内元素则不显示整个左边栏 -->
</template>

slot-2：
<template #middle__header>
    <!-- 自定义中间栏表格上方整个头部的内容 -->
</template>

slot-3：
<template #middle__title>
    <!-- 自定义中间栏表格上方头部的左侧标题 -->
</template>

slot-4：
<template #middle__operation>
    <!-- 自定义中间栏表格上方头部的右侧操作内容 -->
</template>

slot-5：
<template #middle__operation__select>
    <!-- 自定义中间栏表格上方头部选择器，保留左侧标题、搜索框、日期选择器、更多按钮 -->
</template>

slot-6：
<template #middle__operation__button>
    <!-- 自定义中间栏表格上方头部右边的按钮，保留左侧标题、搜索框、日期选择器、更多按钮 -->
</template>

slot-7：
<template #middle__statistics>
    <!-- 自定义中间栏表格上方头数据统计栏，默认什么都没有 -->
</template>

slot-8：
<template #middle__table>
    <!-- 自定义中间栏表格列内容，详细配置参考elementUI表格 -->
    <!-- 超长文本使用sv-table-tooltip -->
    <!-- 最右侧操作按钮使用sv-table-operation -->
    <el-table-column
        label="列名"
        header-align="center"
        align="center"
        width="50px"
        prop="variable"
    >
        <template slot-scope="scope"></template>
    </el-table-column>
</template>

slot-9：
<template #middle__footer>
    <!-- 自定义页脚分页器，一般用不上 -->
</template>

slot-10：
<template #upper__container>
    <!-- 表格上方，默认为空 -->
</template>
```

#### # 参数传递

* `title`
    * 标题，字符串

* `dateSelect`
    * 是否显示日期选择器，布尔值，默认为true

* `searchSetting`
    * 对象，设置搜索框的宽度和placeholder，可缺省
    * `:searchSetting="{width:'150px', placeholder:'请输入关键字'}"`

* `exportSelectConfig`
    * 全部导出按钮的配置，不配置或api为空则不显示导出按钮
    * `params`是额外的请求参数，一些参数（比如导出的组id）已经预先写好了，但是可以覆盖掉

* `overload.getTableList`
    * 函数，用来覆盖默认的`getTableList`方法
    * 第一个参数是axios请求参数，第二个参数是`sv-template`组件实例的`this`，可以访问所有属性
    * 需要修改的重要参数是`tableList`（表格数据）和`paginationConifg.totalCount`（数据总数）
    * 举例：
        ```vue
        <sv-template
            :overload="{
                getTableList: (request, vm) => {
                    vm.tableLoading = true;
                    $http(request).then((response) => {
                        // 表格列表
                        vm.tableList = response.data.data.list;
                        // 数据总数
                        vm.paginationConfig.totalCount = response.data.data.totalCount;
                    }).finally(() => {
                        vm.tableLoading = false;
                    })
                }
            }"
        >
        <sv-template>
        ```
    
```html
<sv-template
    :exportSelectConfig="{
        // 后台接口，不带主机
        api: '/api/exportall',
        // 额外的参数，
        params: {
            name: 'Tom',
            groupId: [1, 2, 3]
        }
    }"
></sv-template>
```

* `exportQueryConfig`
    * 部分导出按钮的配置，详细同上
    * `noselect`，某些页面没有左边栏的树形分组，添加`noselect: true`

* `importDataConfig`
    * 导入按钮的配置，详细同上

* `exportQrcodeConfig`
    * 批量导出二维码的配置，详细同上

* `downloadTemplateConfig`
    * 下载模板按钮的配置，详细同上

* `deleteSelectedConfig`
    * 批量删除按钮的配置，其他同上

* `tableRequest`
    * 表格数据请求参数
    * `api`：后台接口，不带主机
    * `params`：额外请求参数，默认自带search、startTime、endTime、page、limit

```html
<sv-template
    :tableRequest="{
        // 后台接口，不带主机
        api: '/api/gettablelist',
        // 额外的参数，
        params: {
            name: 'Tom',
            groupId: [1, 2, 3]
        }
    }"
></sv-template>
```

#### # 方法

* `getTableList(tableRequest)`
    * 请求表格数据
    * 使用示例：`this.$refs.template.getTableList(this.tableRequest)`

#### # 事件

* `@refresh`
    * 表格请求数据结束
    * 参数1：request，请求的参数
    * 参数2：data，请求响应的数据

# 版本历史 changelog

* 1.0.0-alpha: 基本组件与样式
* 1.1.0-alpha: 优化基本组件，并且使用已有组件制作了一个双栏式布局的模板，里面已经有大部分通用逻辑，只需要传入接口和部分参数即可
* 1.1.1-alpha:
    * 修复提示弹窗显示内容过长时的bug
    * 树形控件勾选框添加判断条件，导出按钮不可用时不显示
    * 提示弹窗增加遮罩颜色配置
* 1.2.0-alpha:
    * 三栏式布局模板中间栏增加插槽：标题、统计数据
    * 更新搜索框的图标为矢量图
* 1.3.0-alpha:
    * 左边栏新增“自定义树节点的操作按钮”的插槽
    * `v-slot`采用简写写法`#`
* 2.0.0-alpha:
    * 修改左边栏树点击事件，传递节点id改为传递节点数据
* 2.0.1-alpha:
    * 修改三栏式布局模板中treeSetting的参数可取值，tab可以不写，api只有一个的时候可以为字符串
* 2.1.0-alpha:
    * 三栏式布局模板中增加一个prop，是否显示日期选择器
    * 修改说明文档中的案例，无slot组件使用单标签
* 2.2.0-alpha:
    * “更多”按钮中增加“二维码导出”按钮
    * 表格操作按钮增加“发布”按钮
    * 修复bug：提示弹窗补充说明文本不换行
* 2.3.0-alpha:
    * 选择器增加align配置项
    * 增加一般弹窗组件`sv-dialog`
    * `sv-input-search`组件增加只读状态传参
    * 增加自动高度的textarea组件`sv-textarea`
* 2.3.1-alpha:
    * 修复`sv-select`change事件无效的bug
    * 增加双栏式布局模板左边栏搜索框旁边加号点击事件
    * 增加双栏式布局模板树形数据刷新的方法说明
* 2.4.0-alpha:
    * 增加上传照片的组件`sv-upload-img`
    * 增加`sv-input-search`禁用状态传参
    * 增加选择分组的组件`sv-select-group`
* 2.4.1-alpha
    * 增加双栏式布局中间栏refresh事件
    * 增加选择多个时间范围的组件`sv-select-time-range`
* 2.5.0-alpha
    * 增加选择项目的组件`sv-select-item`
    * 增加选择摄像头的组件`sv-select-camera`
* 2.6.0-alpha
    * 增加选择联系人的组件`sv-select-contact`
* 3.0.0-alpha
    * 双栏式布局模板导出逻辑之前搞错了，现在重新编写
    * 双栏式布局模板和更多按钮新增二维码导出功能
    * 双栏式布局模板，导出功能增加配置项`noselect`，用于无分组页面导出
    * 选择联系人组件，增加树形配置`groupTreeProps`和`contactTreeProps`传参，以适应树形数据根据不同的字段名显示
* 3.1.0-alpha
    * 双栏式布局模板新增左边栏树形节点新增编辑删除弹窗功能实现
    * `sv-button`新增次级按钮样式（`type="secondary"`）
    * 双栏式布局模板中间栏增加配置传参，设置搜索框宽度和placeholder
* 3.2.0-alpha
    * 新增elementUI的“载入中”的样式
    * 新增`sv-dialog`关闭弹窗的动画效果
* 3.3.0-alpha
    * `sv-upload-img`新增图片压缩功能
* 3.4.0-alpha
    * 双栏式布局增加上方的插槽
* 3.4.1-alpha
    * 更多按钮交互逻辑优化：点击确认才取消勾选栏进入下一步操作，点击取消会返回菜单
    * 双栏式布局折叠按钮样式优化，防止挡住树形操作按钮
    * 选择联系人组件debug：已选联系人的电话（phone或mobile1）不存在时则不显示，而不是显示undefined
* 4.0.0-alpha
    * 双栏式布局模板中左侧树形操作按钮可以按照权限配置，根据`treeSetting.edit`取值决定显示哪些操作按钮
        1. `true`：显示删除、编辑、新增
        2. 数组（取值同`sv-table-operation`的`display` attribute）：自由配置图标
        3. 对象：分别是删除、编辑、新增的接口，接口有配置才显示，并且有对应的弹窗与逻辑
* 4.1.0-alpha
    * 双栏式布局模板增加getTreeNodeChildren方法
* 4.2.0-alpha
    * `sv-textarea`组件新增prop `maxlength`和`scroll`
* 4.3.0-alpha
    * `sv-select-time-range`组件新增prop `limit`
* 4.4.0-alpha
    * 新增文件预览弹窗功能`sv-preview`
* 4.5.0-alpha
    * 新增`sv-template`的重载配置