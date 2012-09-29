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

		$.widget('ui.dropdown', {

			options: {
				target: null,
				duration: 0,
				group: 'default'
			},

			_create: function() {
				this.properties = {
					isOpen: false,
					listIndex: null
				};

				var self = this,
					o = this.options,
					p = this.properties,
					$el = $(this.element),
					$t = $(this.options.target);

				if ( ! (o.group in dropdownInstances)) {
					dropdownInstances[o.group] = [];
				}
				p.listIndex = dropdownInstances[o.group].length;
				dropdownInstances[o.group][p.listIndex] = self;

				$(document).click(function(e) {
					self.close();
				});
				$t.hide().click(function(e) {
					e.stopPropagation();
				});
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
