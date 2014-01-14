#FileUpload

文件异步上传控件，使用隐藏iframe技术

---

##使用说明

###`new FileUpload(options)`

初始化异步文件上传控件

**参数**

1. `options` - (object) 高级配置，有以下功能：
   - `trigger` - (string|object) 上传按钮
   - `urlUpload` - (string) 文件上传中转地址（解决跨域）
   - `postName` - (string|array) 文件选择器的name值；若是数组则分别对应多个文件选择器的name值
   - `wrap` - (string|object) 自定义form元素的父元素
   - `moreData` - (object) 附加的上传数据
   - `accept` - (string) 允许的文件格式
   - `uploadAll` - (boolean) 所有文件选择器都不能为空
   - `frameName` - (string) iframe元素的name值
   - `callBackName` - (string) 自定义回调函数名
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

##参数`options`配置详解

###`trigger`
+ 触发上传的按钮
+ 格式：CSS选择器 | jQuery对象
+ js内部创建的form元素默认放置在trigger之前，即同级元素

###`urlUpload`
+ 格式： 字符串
+ 处理上传数据程序的地址（实际为解决跨域的中转程序）
+ 在这个程序写真实的上传地址
+ 可以是相对地址，必须是同域

###`postName`
+ 文件选择器的name值（<input type="file" name="postName" />）
+ 格式：字符串 | 数组
+ 数组（array('postName1', 'postName2', 'postName3')）
+ input标签由FileUpload插件内部创建

###`wrap`(可选)
+ FileUpload插件内部创建的form元素的容器；form元素默认放在trigger之前
+ 格式：CSS选择器 | jQuery对象

###`moreData`(可选)
+ 附加的数据；默认没有附加数据
+ 格式：{name1: 'value1', name2: 'value2'}
+ 以post方式提交

---
待续




