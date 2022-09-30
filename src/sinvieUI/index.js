/* eslint-disable */
import sv_button from './sv_button/sv_button.vue';
import sv_button_more from './sv_button/sv_button_more.vue';
import sv_input_search from './sv_input/sv_input_search.vue';
import sv_input_tree_search from './sv_input/sv_input_tree_search.vue';
import sv_textarea from './sv_input/sv_textarea.vue';
import sv_select from './sv_select/sv_select.vue';
import sv_select_date from './sv_select/sv_select_date.vue';
import sv_select_group from './sv_select/sv_select_group.vue';
import sv_select_camera from './sv_select/sv_select_camera.vue';
import sv_select_time_range from './sv_select/sv_select_time_range.vue';
import sv_select_item from './sv_select/sv_select_item.vue';
import sv_select_contact from './sv_select/sv_select_contact.vue';
import sv_tree_tab from './sv_tab/sv_tree_tab.vue';
import sv_table_tooltip from './sv_table/sv_table_tooltip.vue';
import sv_table_operation from './sv_table/sv_table_operation.vue';
import sv_template from './sv_template/sv_template.vue';
import sv_dialog from './sv_dialog/sv_dialog.vue';
import sv_dialog_hint from './sv_dialog/sv_dialog_hint.vue';
import sv_dialog_tree from './sv_dialog/sv_dialog_tree.vue';
import sv_upload_img from './sv_upload_img/sv_upload_img.vue';
import sv_preview from './sv_preview/sv_preview.vue';
import sv_upload from './sv_upload/sv_upload.vue';

export default {
  install(Vue, options) {
    Vue.component('SvButton', sv_button);
    Vue.component('SvButtonMore', sv_button_more);
    Vue.component('SvInputSearch', sv_input_search);
    Vue.component('SvInputTreeSearch', sv_input_tree_search);
    Vue.component('SvTextarea', sv_textarea);
    Vue.component('SvSelect', sv_select);
    Vue.component('SvSelectDate', sv_select_date);
    Vue.component('SvSelectGroup', sv_select_group);
    Vue.component('SvSelectTimeRange', sv_select_time_range);
    Vue.component('SvSelectItem', sv_select_item);
    Vue.component('SvSelectCamera', sv_select_camera);
    Vue.component('SvSelectContact', sv_select_contact);
    Vue.component('SvTreeTab', sv_tree_tab);
    Vue.component('SvTableTooltip', sv_table_tooltip);
    Vue.component('SvTableOperation', sv_table_operation);
    Vue.component('SvTemplate', sv_template);
    Vue.component('SvDialog', sv_dialog);
    Vue.component('SvDialogHint', sv_dialog_hint);
    Vue.component('SvDialogTree', sv_dialog_tree);
    Vue.component('SvUploadImg', sv_upload_img);
    Vue.component('SvUpload', sv_upload)
    // 创建并挂载预览弹窗实例到body
    const Preview = Vue.extend(sv_preview);
    const previewInstance = new Preview();
    window.document.body.appendChild(previewInstance.$mount().$el);
    Vue.prototype.$preview = previewInstance.init;
  },
};
