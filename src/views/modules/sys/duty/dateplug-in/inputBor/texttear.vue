<template>
    <div>
      <textarea  cols="95" :value="value" placeholder="请输入内容" rows="9" maxlength="500" @input="changeVal($event)" :readonly="readonly" :class="readonly ? 'actives' : ''" >

      </textarea>
    </div>
</template>

<script>
  export default {
    name: 'texttear',
    data () {
      return {
        value: '',
        readonly: false
      }
    },
    methods: {
      changeVal (e) {
        this.value = e.target.value
      },
      init () {
        return this.value
      },
      upVal (val) {
        this.value = val.data
        this.readonly = val.readonly
        // console.log(this.readonly)
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>
  textarea{
    border: none;
    /*background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZIAAAAYCAYAAADQ3nvwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM3N0MzMTk1MDQ1RDExRUE5NTUxRDYxMTMwQTcwNkY5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM3N0MzMTk2MDQ1RDExRUE5NTUxRDYxMTMwQTcwNkY5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Mzc3QzMxOTMwNDVEMTFFQTk1NTFENjExMzBBNzA2RjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Mzc3QzMxOTQwNDVEMTFFQTk1NTFENjExMzBBNzA2RjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6uWE8wAAAAbklEQVR42uzVwQ0AIAwDMUDsv1QHC52hX2wpC+RzO8kCgKnjAgCEBAAhAUBIABASABASAIQEACEBQEgAQEgAEBIAhAQAIQEAIQFASAAQEgCEBACEBAAhAUBIABASAH51q8oLAMxD0osbAJh6AgwAr2MGefpP3E4AAAAASUVORK5CYII=');*/
    /*background-repeat: repeat;*/
    font-size: 14px;
    outline: none;
    line-height: 24px;
    resize:none;
    border: 1px solid #DCDEE0;
    border-radius: 5px;
    padding-left: 10px;
    width: 100%;
  }
  .actives{
    border: none;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background-color: white;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #EBEDF0;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

</style>
