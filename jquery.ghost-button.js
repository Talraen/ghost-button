/**
* jQuery Ghost Button v1.0.0
* Button that floats in the corner of the page, or outside if room permits
*/

(function($) {
	$.GhostButton = function(options, element) {
		this.$element = $(element);

		this._create(options);
	};

	$.GhostButton.settings = {
		animate: false,
		context: 'body',
		opacity: 0.5,
		position: 'top left'
	};

	$.GhostButton.prototype = {
		option: function(key, value) {
			if ($.isPlainObject(key)) {
				this.options = $.extend(true, this.options, key);
			} else {
				this.options[key] = value;
			}

			this._refresh();
		},

		_create: function(options) {
			var ghostButton = this;
			this.options = $.extend(true, {}, $.GhostButton.settings, options);

			this._refresh();

			$(window).resize(function() {
				ghostButton._placeButton();
			})

			this.$element.hover(function() {
				ghostButton._fade(1);
			}, function() {
				if (ghostButton.inContent) {
					ghostButton._fade(ghostButton.options.opacity);
				}
			})
		},

		_fade: function(opacity) {
			if (this.options.animate) {
				this.$element.stop().animate({opacity: opacity}, this.options.animate);
			} else {
				this.$element.css('opacity', opacity);
			}
		},

		_interpretPosition: function(position) {
			this.vertical = position.match(/\bbottom\b/) ? 'bottom' : 'top';
			this.horizontal = position.match(/\bright\b/) ? 'right' : 'left';
		},

		_placeButton: function() {
			this._interpretPosition(this.options.position);
			var width = this.$element.outerWidth(true);

			var css = {position: 'fixed'};
			var left = this.$context.offset().left;
			if (this.horizontal == 'left') {
				left = left - width;
				if (left < 0) {
					left = 0;
					this.inContent = true;
				} else {
					this.inContent = false;
				}
			} else {
				var windowWidth = $(window).width();
				left = left + parseInt(this.$context.outerWidth());
				if (left + width > windowWidth) {
					left = windowWidth - width;
					this.inContent = true;
				} else {
					this.inContent = false;
				}
			}

			this._fade(this.inContent ? this.options.opacity : 1);

			css.left = left;
			css[this.vertical] = 0;
			css[this.vertical == 'bottom' ? 'top' : 'right'] = '';

			this.$element.css(css);
		},

		_refresh: function() {
			this.$context = $(this.options.context);
			this._placeButton();
		}
	};

	$.fn.ghostButton = function(options) {
		if (typeof(options) == 'string') {
			var args = Array.prototype.slice.call(arguments, 1);

			this.each(function() {
				var instance = $.data(this, 'ghostButton');
				if (!instance) {
					console.log('Cannot call ghostButton method ' + options + ' prior to initialization');
					return;
				}
				if (!$.isFunction(instance[options]) || options.charAt(0) == '_') {
					console.log('Method "' + options + '" not found in ghostButton instance');
					return;
				}
				instance[options].apply(instance, args);
			})
		} else {
			this.each(function() {
				var instance = $.data(this, 'ghostButton');
				if (instance) {
					instance.option(options || {});
				} else {
					$.data(this, 'ghostButton', new $.GhostButton(options, this));
				}
			});
		}

		return this;
	}

})(jQuery);
