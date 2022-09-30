<template>
  <div>
    <editor id="tinymce" v-model="tinymceHtml" :init="editorInit"></editor>
  </div>
</template>

<script>

// import tinymce from 'tinymce/tinymce'
// import 'tinymce/themes/modern/theme'
// import Editor from '@tinymce/tinymce-vue'
// import 'tinymce/plugins/image'
// import 'tinymce/plugins/link'
// import 'tinymce/plugins/code'
// import 'tinymce/plugins/table'
// import 'tinymce/plugins/lists'
// import 'tinymce/plugins/contextmenu'
// import 'tinymce/plugins/wordcount'
// import 'tinymce/plugins/colorpicker'
// import 'tinymce/plugins/textcolor'
export default {
  data () {
    return {
        tinymceHtml:'请输入内容!',
        editorInit: {
            language_url: '/static/tinymce/zh_CN.js',
            language: 'zh_CN',
            skin_url: '/static/tinymce/skins/lightgray',
            height: 300,
            plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
            toolbar:'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
            branding: false
    //         plugins: [ //配置插件：可自己随意选择，但如果是上传本地图片image和imagetools是必要的
    //   'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
    //   'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
    //   'save table contextmenu directionality emoticons template paste imagetools textcolor'
    //     ],
    // //工具框，也可自己随意配置
    //     toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',       
    //     image_advtab: true,
        }
    }
  },
  mounted(){
      tinymce.init({})
  },
  components: {
      Editor
  },
  methods: {

  }
    
}
</script>
<style lang="less" >


</style>
