#FileUpload

文件异步上传控件，使用隐藏iframe

---

##使用说明

###`new FileUpload(options)`

初始化文件上传控件

**参数**

1. `postName` - (string|array) 文件选择器的name值；若是数组则分别对应多个文件选择器的name值
2. `urlUpload` - (string) 文件上传中转地址（解决跨域）
3. `trigger` - (string|object) 上传按钮
4. `options` - (object) 高级配置，有以下功能：
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
    new FileUpload('file', '#id .submit', 'http://www.a.com', {
        moreData: {username: 'epooren', sex: 'male'},//添加提交两个变量
        accept: 'jpg|png',//只支持jpg和png格式的文件
        cbSuccess: function() {
            alert('上传成功');
        },
        cbError: function() {
            alert('上传失败');
        },
        cbAccept: function() {
            alert('文件不合法');
        },
        cbError: function() {
            alert('存在未选择文件的文件控件');
        },
    });
    
    //例二
    new FileUpload(['file_1', 'file_2', 'file_3'], $('#id .submit'), './php/upload.php', {
        uploadAll: false,//有3个文件文件选择器，不需要都选择文件
        frameName: 'iframe_name',//当默认值存在冲突时，在这里自定义
        callBackName: 'callBack_name',//当默认值存在冲突时，在这里自定义
        wrap: $('#box'),//js创建的form元素放置在该元素内；默认放在$('$id .submit')元素前面
        cbSuccess: function() {
            alert('上传成功！');
        }
    });
});
```
