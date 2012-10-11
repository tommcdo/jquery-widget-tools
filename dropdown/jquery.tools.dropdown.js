/**
 * @author    Tom McDonald
 * @package   jquery-widget-tools
 *
 * $.dropdown(options)
 *
 * EXAMPLE:
 *     $("a#login").dropdown({
 *         target: "div#login-dialog"
 *     });
 *
 * OPTIONS:
 *  target    Selector to drop down when $(this) is clicked If omitted, it will
 *            be assumed that the selector matches an <a> element, and the href
 *            attribute will be used.
 *  position  Position of the drop down relative to selector. One of 'left',
 *            'right', 'above', 'below'. Default: 'below'.
 *  anchor    Part of drop down to anchor to the selector.
 *            When position is 'left' or 'right', anchor can be one of
 *            'outer-top', 'top', 'middle', 'bottom', 'outer-bottom'.
 *            When position is 'above' or 'below', anchor can be one of
 *            'outer-left', 'left', 'center', 'right', 'outer-right'.
 *  duration  Animation length (in ms).
 *  group     Identifier of dropdown group - all dropdowns in the same group
 *            will be mutually exclusive
 */

(function($) {

	var dropdownInstances = {
		'default': []
	};

	$.widget('tools.dropdown', {

		options: {
			target: null,
			duration: 0,
			group: 'default',
			position: null,
			anchor: null
		},

		init: function() {
			this.properties = {
				isOpen: false,
				listIndex: null
			};
			if (this.options.target === null) {
				this.options.target = this.element.attr('href');
			}
		},

		_create: function() {

			this.init();

			var self = this,
				o = this.options,
				p = this.properties,
				$el = this.element,
				$t = $(this.options.target);

			// Track this instance.
			if ( ! (o.group in dropdownInstances)) {
				dropdownInstances[o.group] = [];
			}
			p.listIndex = dropdownInstances[o.group].length;
			dropdownInstances[o.group][p.listIndex] = self;

			// Attach click event to document to close target.
			$(document).click(function(e) {
				self.close();
			});

			// Set up target element.
			$t.hide();
			if (o.position !== null) {
				self.setPosition();
			}
			$t.click(function(e) {
				// Do not close target element when it is clicked.
				e.stopPropagation();
				// Close all target elements from other groups.
				$.each(dropdownInstances, function(group, instances) {
					if (group != o.group) {
						$.each(instances, function(i, dropdown) {
							dropdown.close();
						});
					}
				});
			});

			// Set up element.
			$el.click(function(e) {
				e.preventDefault();
				$.each(dropdownInstances[o.group], function(i, dropdown) {
					if (i != p.listIndex) {
						dropdown.close();
					}
				});
				if (p.isOpen) {
					self.close();
				} else {
					self.open();
				}
				return false;
			});
		},

		_setOption: function(key, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
			if (key == 'position' || key == 'anchor') {
				this.setPosition();
			}
		},

		open: function() {
			var o = this.options,
				p = this.properties,
				$el = this.element,
				$t = $(this.options.target);
			$t.slideDown(o.duration, function() {
				p.isOpen = true;
			});
		},

		close: function() {
			var o = this.options,
				p = this.properties,
				$el = this.element,
				$t = $(this.options.target);
			$t.slideUp(o.duration, function() {
				p.isOpen = false;
			});
		},

		setPosition: function() {
			// Move target element to be near trigger element.
			$(this.options.target).offset(this.offset()).css({
				position: 'absolute'
			});
		},

		offset: function() {
			var o = this.options,
				$el = this.element,
				$t = $(this.options.target);
			var x, y;
			var d = $el.offset(),
				ew = $el.outerWidth(),
				eh = $el.outerHeight(),
				tw = $t.outerWidth(),
				th = $t.outerHeight();
			var a = function(d, e, t) {
				switch (o.anchor) {
					case 'left': case 'top':
						return d;
					case 'outer-left': case 'outer-top':
						return d + e;
					case 'center': case 'middle':
						return d - (t / 2) + (e / 2);
					case 'right': case 'bottom':
						return d - t + e;
					case 'outer-right': case 'outer-bottom':
						return d - t;
				}
			};
			switch (o.position) {
				case 'below':
					x = a(d.left, ew, tw);
					y = d.top + eh;
					break;
				case 'above':
					x = a(d.left, ew, tw);
					y = d.top - th;
					break;
				case 'left':
					x = d.left - tw;
					y = a(d.top, eh, th);
					break;
				case 'right':
					x = d.left + ew;
					y = a(d.top, eh, th);
					break;
			}
			return { left: x, top: y };
		},

		destroy: function() {
		}

	});

})(jQuery);
