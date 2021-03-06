(function($) {

	$.textSelection = {};
	$.textSelection.enable = true;
	var api = $.textSelection.api = {};
	
	api.get = function(all) {
		var str = [];
		
		api.callback.call(this, function(range) {
			str.push(range.text);
			range.select();
			
			return !!all;
		});
		
		return all ? str: str[0];
	};
	
	api.replace = function(reg, rep) {
		return api.callback.call(this, function(range) {
			range.setText( rep !== undefined ? range.text.replace(reg, rep) : reg );
			range.toEnd();
		});
	};
	
	api.prepend = function(str) {
		return api.callback.call(this, function(range) {
			range.setText( str + range.text );
			range.toEnd();
		});
	};
	
	api.append = function(str) {
		return api.callback.call(this, function(range) {
			range.setText( range.text + str );
			range.toEnd();
		});
	};
	
	api.wrap = function(b, a) {
		return api.callback.call(this, function(range) {
			range.setText( b + range.text + a );
			range.toEnd();
		});
	};
	
	api.select = function(start, end) {
		return api.callback.call(this, function(range) {
			range.select(start, end);
		});
	};
	
	api.callback = function(callback) {
		return this.each(function(){
			return callback( new Range(this) );
		});
	};
	
	var Range;
	if (window.getSelection) {
		
		Range = function(elem) {
			this.elem = elem;
			elem.focus();
			
			this.start = elem.selectionStart;
			this.end   = elem.selectionEnd;
			this.text  = $(elem).val().substring(this.start, this.end);
		}
		
		Range.prototype = {
			
			setText: function(str) {
				var val = $(this.elem).val();
				$(this.elem).val( val.substr(0, this.start) + str + val.substr(this.end) );
				this.text = str;
				this.end = this.start + str.length;
			}
			
			, select: function(start, end) {
				if (!isNaN( start )) {
					this.start = start;
				}
				if (!isNaN( end )) {
					this.end = end;
				}
				this.elem.setSelectionRange(this.start, this.end);
			}
		};
	}
	else if (document.selection) {
		
		Range = function(elem) {
			this.elem = elem;
			this.init();
		}
		
		Range.prototype = {
			
			init: function() {
				this.elem.focus();
				
				this.range = document.selection.createRange();
				
				this.text = this.range.text;
				
				var clone = this.range.duplicate();
				clone.moveToElementText( this.elem );
				clone.setEndPoint( 'EndToEnd', this.range );
				
				this.start = clone.text.replace(/\r/g, '').length - this.text.replace(/\r/g, '').length;
				this.end   = this.start + this.text.replace(/\r/g, '').length;
			}
			
			, setText: function(str) {
				this.text = str;
				this.range.text = str;
				this.end = this.start + str.replace(/\r/g, '').length;
			}
			
			, select: function (start, end) {
				if (isNaN( start )) {
					start = this.start;
				}
				if (isNaN( end )) {
					end = this.end;
				}
				
				var range = this.elem.createTextRange();
				range.collapse();
				range.moveEnd( 'character', end );
				range.moveStart( 'character', start );
				range.select();
				
				this.init();
			}
		};
	}
	else {
		Range = function() {};
		$.textSelection.enabled = false;
	}
	
	var prot = Range.prototype;
	prot.toStart = function() {
		this.select( this.start, this.start );
	};
	
	prot.toEnd = function() {
		this.select( this.end, this.end );
	};
	
	$.fn.textSelection = function(cmd) {
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (typeof cmd == "function") {
			args = [ cmd ];
			cmd = 'callback';
		}
		if (cmd === true) {
			args = [ true ];
			cmd = 'get';
		}
		
		return api[ cmd || 'get' ].apply( this, args );
	};
})($);