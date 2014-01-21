define(function(require, exports, module) {
    var $ = require('jquery');
	var Cookie = require('matcha/cookie/1.0.0/cookie');
	
	
	var	defaultConfig = {
		trigger: null, // 触发上传按钮
		url: null, // 图片上传中转地址

		postName: 'oups', // file字段名
		data: {
			item_type: 'photo',
			return_json: 2,
			utf_8: 1,
			member_id: Cookie.get('member_id'),
			pass_hash: Cookie.get('pass_hash'),
			g_session_id: Cookie.get('g_session_id'),
		}, // 附加数据（存在默认值）
		accept: null, // 限制文件格式, 如：image/*、image/png
		progress: null,//正在上传
		success: null,// 上传成功
		error: null, // 上传失败
		change: null // file input change回调
	};

	function FileUpload_HTML5(options) {
		var self = this;
		
		if(!(self instanceof arguments.callee)) {
			return new arguments.callee(options);
		}
		
		self.options = $.extend(true, {}, defaultConfig, (options || {}));
		
		if(!(self.options.trigger instanceof $)) {
			self.options.trigger = $(self.options.trigger);
		}
		
		self.form = null;
		self.file = null;
		
		self._corsParam();
		
		self.init();
		
		return self;
	}

	$.extend(FileUpload_HTML5.prototype, {
		/*
		* 重置
		*/
		_resetInput: function() {
			var self = this;
			
			self.file.val('');
		},
		
		/*
		* 跨域参数
		*/
		_corsParam: function() {
			var self = this;
			
			if(self.options.url.indexOf('?') === -1) {
				self.options.url += '?' + 'acao_h=1';
			} else {
				self.options.url += '&' + 'acao_h=1';
			}
		},
		
		/*
		* 初始化
		*/
		init: function() {
			var self = this, key, hiddenFile = '';
			
			//创建form
			self.form = $('<form></form>').appendTo('body');
			self.form.css({
				position: 'absolute',
				zIndex: 10000,
				top: -9999,
				left: -9999,
				margin: 0,
				padding: 0,
				overflow: 'hidden'
			});
			
			//创建input
			self.file = $('<input type="file" name="' + self.options.postName + '" />').appendTo(self.form);
			self.file.css({
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
			
			//附加更多数据
			for(key in self.options.data) {
				hiddenFile += '<input type="hidden" name="' + key + 
					'" value="' + self.options.data[key] + '" />';
			}
			
			hiddenFile !== '' && self.form.append(hiddenFile);
			
			
			self.bindEvent();
			
			return self;
		},
		
		/*
		* 绑定事件
		*/
		bindEvent: function() {
			var self = this, position;
			
			self.options.trigger.on('mouseenter', function() {
				position = self.options.trigger.offset();
				
				self.form.css({
					top: position.top,
					left: position.left,
					width: self.options.trigger.outerWidth(),
					height: self.options.trigger.outerHeight()
				});
			});
			
			self.file.on('change', function() {
				if(this.value === '') return;
				
				if(self.options.change) {
					self.options.change.call(self) !== false && self.submit();
				} else {
					self.submit();
				}
				
			});
		},
		
		/**
		 * 提交上传
		 */
		submit: function() {
			var self = this, form = new FormData(self.form[0]);
			
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
				
				self.options.success && self.options.success.call(self, response, status, xhr);
			})
			.fail(function(xhr, status) {
				self._resetInput();
				
				//status: "timeout", "error", "abort", "parsererror"
				self.options.error && self.options.error.call(self, status, xhr);
			});
			
			
		}
	});
	
    module.exports = FileUpload_HTML5;
});


