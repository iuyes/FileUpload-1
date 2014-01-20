/*
*
* FileUpload Model
*
* @author 小张<QQ:651493317>
*
*/

define(function(require, exports, module) {
    var $ = require('jquery'),
		Cookie = require('matcha/cookie/1.0.0/cookie');

	/**
	* 指向解决iframe跨域的中转程序
	*/
	var iframeUID = 0,
		urlTransit = 'http://my.poco.cn/module_common/item/iframe_transit.php',
		cbKey = 'callback',
		cbValue = 'fileupload_callback';
		
	var	defaultConfig = {
		trigger: null, // 触发上传按钮
		url: null, // 图片上传中转地址

		postName: 'oups', // file字段名
		data: {// 附加数据
			item_type: 'photo',
			redirect_url: urlTransit,//ajax不需要
			utf_8: 1,
			member_id: Cookie.get('member_id'),
			pass_hash: Cookie.get('pass_hash'),
			g_session_id: Cookie.get('g_session_id'),
			return_json: 2//iframe不需要
		}, 
		accept: null, // 限制文件格式, 如：image/*、image/png
		
		progress: null,// [回调]正在上传
		success: function() { alert('上传成功！');}, // [回调]上传成功
		error: function() { alert('上传失败！');}, // [回调]上传失败
		change: null // [回调]input change
	};
	
	
    function FileUpload(options) {
        var self = this;
        if (!(self instanceof arguments.callee)) {
            return new arguments.callee(options);
        }

        self.options = $.extend(true, {}, defaultConfig, (options || {}));

        if (!(self.options.trigger instanceof $)) {
            self.options.trigger = $(self.options.trigger);
        }
		
		//定义回调函数
		self.cbName = cbValue + iframeUID;
		
		if(self.options.data.redirect_url.indexOf('?') === -1) {
			self.options.data.redirect_url += '?' + cbKey + '=' + self.cbName;
		} else {
			self.options.data.redirect_url += '&' + cbKey + '=' + self.cbName;
		}
		self.options.data.redirect_url = encodeURI(self.options.data.redirect_url);
		
		self.form = null;
		self.file = null;
		
		//根据需要过滤
		if(self.supportAjax()) {
			self._corsParam();
			delete self.options.data.redirect_url;
		} else {
			delete self.options.data.return_json;
		}
		
        self.init();
		
		iframeUID++;
		
        return self;
	}

    $.extend(FileUpload.prototype, {
        /**
         * 重置文件input(成功返回后调用)
         */
        _resetInput: function() {
			var self = this;
			
			self.file.val('');
        },
		
		/*
		* XHR跨域参数
		*/
		_corsParam: function() {
			var self = this;
			
			if(self.options.url.indexOf('?') === -1) {
				self.options.url += '?' + 'acao_h=1';
			} else {
				self.options.url += '&' + 'acao_h=1';
			}
		},
		
        /**
         * 初始化，创建iframe、form、input
         */
        init: function() {
            var self = this,
				body = $('body'),
				key,
				hiddenFile = '',
				target = 'plugin_file_upload_' + iframeUID;
			
            // create iframe to body
			body.append('<iframe name="' + target + '" style="display:none;"></iframe>');
			
            // create form to body
			self.form = $('<form></form>').appendTo('body');
			self.form.attr({
				action: self.options.url,
				target: target,
				method: 'post',
				enctype: 'multipart/form-data'
			}).css({
				position: 'absolute',
				zIndex: 10000,
				top: -9999,
				left: -9999,
				overflow: 'hidden',
				padding: 0,
				margin: 0
			});
			
            // create input
			self.file = $('<input type="file" />').appendTo(self.form);
			self.file.attr({
				name: self.options.postName
			}).css({
				opacity: 0,
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%'
			});
			//限制文件类型
			if(self.options.accept !== null) {
				self.file.attr('accept', self.options.accept);
			}
			
			
			//添加更多数据
			for(key in self.options.data) {
				hiddenFile += '<input type="hidden" name="' + key + 
					'" value="' + self.options.data[key] + '" />';
			}
			hiddenFile !== '' && self.form.append(hiddenFile);
			
			self.bindEvent();
			
            return self;
        },

        /**
         * 事件捆绑，input position to trigger、input change event
         */
        bindEvent: function() {
            var self = this, position;

            // $trigger mouseenter event
			self.options.trigger.on('mouseenter', function() {
				position = self.options.trigger.offset();
				
				self.form.css({
					top: position.top,
					left: position.left,
					width: self.options.trigger.outerWidth(),
					height: self.options.trigger.outerHeight()
				});
			});

            // $input change event
			self.file.on('change', function() {				
				if(self.file.val() === '') return;
				
				if(self.options.change) {
					self.options.change.call(self) !== false && self.submit();
				} else {
					self.submit();
				}
			});
			
			
			if(!self.supportAjax()) {
				// [回调]上传文件后
				window[self.cbName] = function(response) {
					self._resetInput();
					
					if(response.code === 0) {
						self.options.success && self.options.success.call(self, response);
					} else {
						self.options.error && self.options.error.call(self, response);
					}
				};
			}
			
            return self;
        },
		
		/*
		* 是否支持ajax上传
		*/
		supportAjax: function() {
			if(window.FormData) {
				return true;
			} else {
				return false;
			}
		},
		
        /**
         * 提交上传
         */
        submit: function() {
            var self = this, form;
			
			if(self.supportAjax()){
				form = new FormData(self.form[0]);
				
				$.ajax({
					url: self.options.url,
					type: 'POST',
					data: form,
					dataType: 'json',
					processData: false,
					contentType: false,
					xhr: function() {
						var xhr = $.ajaxSettings.xhr();
						
						if(self.options.progress) {
							xhr.upload.addEventListener('progress', function(ev) {
								self.options.progress.call(self, ev.lengthComputable, ev.loaded, ev.total);
							}, false);
						}
						
						return xhr;
					}
				})
				.done(function(response, status, xhr) {				
					self._resetInput();
					
					if(response.code === 0) {
						self.options.success && self.options.success.call(self, response, status, xhr);
					} else {
						self.options.error && self.options.error.call(self, response, status, xhr);
					}
				})
				.fail(function(xhr, status) {
					self._resetInput();
					
					//status: "timeout", "error", "abort", "parsererror"
					self.options.error && self.options.error.call(self, status, xhr);
				});
				
				
			} else {
				self.form.submit();
			}
			
            return self;
        }
    });

    module.exports = FileUpload;
});

