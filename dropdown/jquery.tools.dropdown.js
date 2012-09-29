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
 *   target    Selector to drop down when $(this) is clicked
 *   duration  Animation length (in ms)
 *   group     Identifier of dropdown group - all dropdowns in the same group
 *             will be mutually exclusive
 */

(function($) {

	(function() {

		var dropdownInstances = {
			'default': []
		};

		$.widget('tools.dropdown', {

			options: {
				target: null,
				duration: 0,
				group: 'default',
				position: null,
				alignment: null
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
					// Move target element to be near trigger element.
					var x = $el.offset().left;
					var y = $el.offset().top;
					var width = $el.width();
					var height = $el.height();
					$t.offset({
						left: x,
						top: y + height + parseInt($el.css('paddingBottom'))
					}).css({
						position: 'absolute'
					});
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

			open: function() {
				var o = this.options,
					p = this.properties,
					$el = $(this.element),
					$t = $(this.options.target);
				$t.slideDown(o.duration, function() {
					p.isOpen = true;
				});
			},

			close: function() {
				var o = this.options,
					p = this.properties,
					$el = $(this.element),
					$t = $(this.options.target);
				$t.slideUp(o.duration, function() {
					p.isOpen = false;
				});
			},

			destroy: function() {
			}

		});
	})();

})(jQuery);
