#FileUpload

文件异步上传控件，使用隐藏iframe

---

##使用说明

###`new FileUpload(options)`

初始化异步文件上传控件

**参数**

1. `options` - (object) 高级配置，有以下功能：
   - `trigger` - (string|object) 上传按钮
   - `urlUpload` - (string) 文件上传中转地址（解决跨域）
   - `postName` - (string|array) 文件选择器的name值；若是数组则分别对应多个文件选择器的name值
   - `moreData` - (object) 附加的上传数据
   - `accept` - (string) 允许的文件格式
   - `uploadAll` - (boolean) 所有文件选择器都不能为空
   - `frameName` - (string) iframe元素的name值
   - `callBackName` - (string) 自定义回调函数名
   - `wrap` - (string|object) 自定义form元素的父元素
   - `cbSuccess` - (function) [回调] 上传成功
   - `cbError` - (function) [回调] 上传失败
   - `cbAccept` - (function) [回调] 文件不合法
   - `cbEmpty` - (function) [回调] 有文件选择器未选择文件

例子：
```js
define(function(require, exports, module) {
    var FileUpload = require('fileupload');
    
    //例一
    new FileUpload({
        trigger: '#id .submit',
        urlUpload: 'http://www.a.com',
        postName: 'file',
        moreData: {username: 'epooren', sex: 'male'},
        accept: 'jpg|png',
        cbSuccess: function() {
            alert('上传成功');
        },
        cbError: function() {
            alert('上传失败');
        },
        cbAccept: function() {
            alert('文件不合法');
        }
    });
    
    //例二
    new FileUpload({
        trigger: $('#id .submit'), 
        urlUpload: './php/upload.php',
        postName: ['file_1', 'file_2', 'file_3'],
        uploadAll: false,
        frameName: 'iframe_name',
        callBackName: 'callBack_name',
        wrap: $('#box'),
        cbSuccess: function() {
            alert('上传成功！');
        },
        cbError: function() {
            alert('必须选择一个文件！');
        }
    });
});
```
