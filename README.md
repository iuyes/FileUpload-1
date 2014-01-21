#FileUpload

文件异步上传控件（支持HTML5，使用Ajax上传，否则使用iframe）

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
   - `progress()` - (boolean, number, number) [回调]上传进度-HTML5才能用
   - `success()` - (object) [回调] 上传成功
   - `error()` - (object | string) [回调] 上传失败 
   - `change()` - () [回调] 文件选择器的value值改变

**接口**

1. `submit()` - 上传文件
2. `supportAjax()` - 是否支持Ajax上传

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
        success: function(data) {
            //data：后台返回的数据
        },
        error: function(data) {
            //data：后台返回的数据
        },
        change: function() {
            /*
            *return false;
            *返回false，阻止上传 
            */
        }
    });
    
    
    //例二：进度条
    new FileUpload({
      trigger: '.submit',
      url: './upload.php',
      progress: function(boolean, loaded, total) {
         //是否计算出文件大小、上传字节数、总字节数
      },
      success: function(data) {
         
      },
      error: function(data) {
         //data可能会是是错误码（文字）
      }
    });
    
    
    //例三：自定义一个上传按钮
    var File = new FileUpload({
        trigger: $('#id .submit'),
        url: './php/upload.php',//可以是相对地址
        data: {name: 'xiaozhang', age: '23'},
        accept: 'image/*',
        success: function(data) {
            //
        },
        error: function(data) {
            //
        },
        change: function() {
            //阻止默认的上传动作
            return false;
        }
    });
    //自定义的按钮
    $('.btn').click(function() {
        //点击.btn按钮上传
        File.submit();
    });
    
});

```

##特别提醒
1. 回调函数的this都指向FileUpload对象
2. trigger可以是CSS选择器格式字符串，或jQuery对象
3. 回调函数中的this指向FileUpload对象
1. accept参数格式就是input标签accept属性值的格式（http://www.w3school.com.cn/html5/att_input_accept.asp）


