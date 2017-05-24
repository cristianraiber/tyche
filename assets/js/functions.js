"use strict";
(function ($) {
	var Tyche = {
		exists: function (e) {
			return $(e).length > 0;
		},

		initStyleSelects: function () {
			var selects = $('select');
			$.each(selects, function () {
				if ( $(this).parent().hasClass('styled-select') ) {
					return false;
				}

				$(this).wrap('<div class="styled-select"></div>');
			});
		},

		/* ==========================================================================
		 handleMobileMenu
		 ========================================================================== */
		handleMobileMenu: function () {
			var MOBILEBREAKPOINT = 991;
			if ( $(window).width() > MOBILEBREAKPOINT ) {

				$("#mobile-menu").hide();
				$("#mobile-menu-trigger").removeClass("mobile-menu-opened").addClass("mobile-menu-closed");

			} else {

				if ( !Tyche.exists("#mobile-menu") ) {

					$("#desktop-menu").clone().attr({
						id     : "mobile-menu",
						"class": ""
					}).insertAfter("#site-navigation");

					$("#mobile-menu > li > a, #mobile-menu > li > ul > li > a").each(function () {
						var $t = $(this);
						if ( $t.next().hasClass('sub-menu') || $t.next().is('ul') || $t.next().is('.sf-mega') ) {
							$t.append('<span class="fa fa-angle-down mobile-menu-submenu-arrow mobile-menu-submenu-closed"></span>');
						}
					});

					$(".mobile-menu-submenu-arrow").on("click", function (event) {
						var $t = $(this);
						if ( $t.hasClass("mobile-menu-submenu-closed") ) {
							$t.removeClass("mobile-menu-submenu-closed fa-angle-down").addClass("mobile-menu-submenu-opened fa-angle-up").parent().siblings("ul, .sf-mega").slideDown(300);
						} else {
							$t.removeClass("mobile-menu-submenu-opened fa-angle-up").addClass("mobile-menu-submenu-closed fa-angle-down").parent().siblings("ul, .sf-mega").slideUp(300);
						}
						event.preventDefault();
					});

					$("#mobile-menu li, #mobile-menu li a, #mobile-menu ul").attr("style", "");

				}

			}

		},

		/* ==========================================================================
		 showHideMobileMenu
		 ========================================================================== */

		showHideMobileMenu: function () {
			$("#mobile-menu-trigger").on("click", function (event) {

				var $t = $(this),
						$n = $("#mobile-menu");

				if ( $t.hasClass("mobile-menu-opened") ) {
					$t.removeClass("mobile-menu-opened").addClass("mobile-menu-closed");
					$n.slideUp(300);
				} else {
					$t.removeClass("mobile-menu-closed").addClass("mobile-menu-opened");
					$n.slideDown(300);
				}
				event.preventDefault();

			});

		},

		initMainSlider: function () {
			jQuery('#main-slider').owlCarousel({
				loop           : true,
				nav            : true,
				items          : 1,
				dots           : false,
				mouseDrag      : true,
				navText        : [
					"<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>" ],
				navClass       : [ "main-slider-previous", "main-slider-next" ],
				autoplay       : true,
				autoplayTimeout: 17000,
				responsive     : {
					1  : {
						nav: false
					},
					600: {
						nav: false
					},
					991: {
						nav: true,

					}
				}
			});
		},

		initProductSlider: function () {
			var elements = jQuery('.tyche-product-slider-container');
			elements.each(function () {
				var selector = jQuery(this).find('.tyche-product-slider'),
						prev = jQuery(this).find('.tyche-product-slider-navigation .prev'),
						next = jQuery(this).find('.tyche-product-slider-navigation .next');

				selector.owlCarousel({
					loop      : false,
					margin    : 30,
					responsive: {
						1  : {
							items: 1
						},
						600: {
							items: 2
						},
						991: {
							items: parseInt(selector.attr('data-attr-elements'))
						}
					}
				});

				prev.on('click', function (event) {
					event.preventDefault();
					selector.trigger('prev.owl.carousel');
				});
				next.on('click', function (event) {
					event.preventDefault();
					selector.trigger('next.owl.carousel');
				});
			});

		},
		initMultiLang    : function () {
			var $selector = jQuery('#tyche_multilang_flag-chooser');
			if ( !$selector.length ) {
				return false;
			}
			var $active = $selector.find('.active'),
					$class = $active.attr('class'),
					$wrapper = jQuery('.top-multilang');
			/* Remove active class */
			$class = $class.replace(' active', '');
			/* Remove lang prefix class */
			$class = $class.replace('lang-', '');

			switch ( $class ) {
				case 'en':
					$class = 'uk';
					break;
			}

			var $image = tyche_variables.flags + $class + '.png';
			$wrapper.prepend('<img src="' + $image + '" alt="country flag" />');
		},

		updateAjaxCart: function () {
			console.log('aaaa');

			/**
			 * During ajax, we lose scope - so declare "self"
			 * @type {*}
			 */
			var self = $(this),
					/**
					 * Create the args object for the AJAX call
					 *
					 * action [ Class, Method Name ]
					 * args [ parameters to be sent to method ]
					 *
					 * @type {{action: [*]}}
					 */
					args = {
						'action': [ 'Tyche_WooCommerce_Hooks', 'get_cart_total' ]
					};

			/**
			 * Initiate the AJAX function
			 *
			 * Note that the Epsilon_Framework class, has the following method :
			 *
			 * public function epsilon_framework_ajax_action(){};
			 *
			 * which is used as a proxy to gather $_POST data, verify it
			 * and call the needed function, in this case : Epsilon_Framework::dismiss_required_action()
			 *
			 */
			$.ajax({
				type    : "POST",
				data    : { action: 'tyche_ajax_action', args: args },
				dataType: "json",
				url     : WPUrls.ajaxurl,
				success : function (data) {
					console.log(data);
				}
			})
		}

	};

	jQuery(document).ready(function ($) {
		Tyche.initMainSlider();
		Tyche.initMultiLang();
		Tyche.initProductSlider();
		Tyche.handleMobileMenu();
		Tyche.showHideMobileMenu();
		Tyche.initStyleSelects();
	});

	jQuery(window).load(function () {

	});

	jQuery(window).resize(function () {
		Tyche.handleMobileMenu();
	});

	jQuery(document.body).on('updated_cart_totals', function () {
		console.log('aaa');
		Tyche.updateAjaxCart();
	});
})(jQuery);

// non jQuery scripts below