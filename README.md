#FileUpload

文件异步上传控件，使用隐藏iframe技术

---

##使用说明

###`new FileUpload(options)`

初始化控件

**参数**

1. `options` - (object) 高级配置，有以下功能：
   - `trigger` - (string|object) 上传按钮
   - `url` - (string) 文件上传地址
   - `postName` - (string) 文件选择器（&lt;input type="file" /&gt;）的name值 
   - `data` - (object) 附加上传的数据
   - `accept` - (string) 限制文件类型
   - `success` - (function) [回调] 上传成功
   - `error` - (function) [回调] 上传失败 
   - `change` - (function) [回调] 文件选择器的value值改变

例子：
```js

define(function(require, exports, module) {
    var FileUpload = require('fileupload');
    
    //例一：选择文件后立即上传
    new FileUpload({
        trigger: '#id .submit',
        url: 'http://www.a.com',
        postName: 'pic',//默认值是：oups
        data: {name: 'xiaozhang', age: '23'},
        accept: 'image/gif, image/jpeg',
        success: function(data, self) {
            //data：后台返回的数据
            //self：FileUpload对象
        },
        error: function(data, self) {
            //data：后台返回的数据
            //self：FileUpload对象
        },
        change: function(self) {
            //self：FileUpload对象
            
            /*
            *return false;
            *返回false，阻止上传 
            */
        }
    });
    
    //例二：自定义一个上传按钮
    var File = new FileUpload({
        trigger: $('#id .submit'),
        url: './php/upload.php',//可以是相对地址
        data: {name: 'xiaozhang', age: '23'},
        accept: 'image/*',
        success: function(data, self) {
            //
        },
        error: function(data, self) {
            //
        },
        change: function(self) {
            //阻止默认的上传动作
            return false;
        }
    });
    
    $('.btn').click(function() {
        //点击.btn按钮上传
        File.submit();
    });
    
});

```

##特别提醒
1. accept参数格式就是input标签accept属性值的格式（http://www.w3school.com.cn/html5/att_input_accept.asp）
2. trigger可以是CSS选择器格式字符串，或jQuery对象


