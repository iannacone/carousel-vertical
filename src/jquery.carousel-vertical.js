/*!
 * carousel vertical
 * Copyright 2011-2019 Simone Iannacone
 * Licensed under MIT (https://github.com/iannacone/carousel-vertical/blob/master/LICENSE)
 * 
 * TODOS
 *   follow the owl carousel direction
 */
;
(function ($, window, document, undefined) {
	'use strict';

	var defaults_options = {
		items: 4,
		margin: 10,
		nav: true,
		navText: ['prev', 'next'],
	};

	$.fn.extend({
		carouselVertical: function (args) {

			var carouselVerticalClass = function (element, options) {

				var $element = $(element),
					$stage = null,
					$items = null,
					element_height = 0,
					stage_height = 0,
					items_height = 0,
					items_outer_height = 0,
					items_count = 0,
					current_item = 1,
					current_item_pos = 1,
					last_item = 1,
					last_item_pos = 1,

					is_mousedown = false,

					clickms = 100,
					lastTouchDown = -1;



				function init() {

					if ($element.hasClass('cv-loaded')) {
						return false;
					}

					$items = $element.find('.item');

					items_count = $items.length;
					if (items_count === 0) {
						return false;
					}

					element_height = $element.height();

					if (items_count < options.items) {
						options.items = items_count;
					}

					items_height = parseInt((element_height - options.margin * options.items) / options.items);
					items_outer_height = items_height + options.margin;
					stage_height = items_outer_height * items_count;
					last_item = items_count - options.items;
					last_item_pos = -last_item * items_outer_height;

					$element.wrapInner('<div class="cv-stage-outer"><div class="cv-stage"></div></div>');

					// drag and drop (for touchscreens) always active
					$element.addClass('cv-drag');

					// explicit height for position relative
					$element.height(element_height);

					$items.wrap('<div class="cv-item"></div>');

					// update after wrap
					$items = $element.find('.cv-item');
					$stage = $element.find('.cv-stage');

					$items
						.css({
							'height': items_height + 'px',
							'margin-bottom': options.margin + 'px'
						})
						// add the active class to the active els
						.slice(0, options.items)
						.addClass('active'); // the double tab is wanted!

					$element.addClass('cv-loaded');

					element.addEventListener('touchstart', touchHandler, true);
					element.addEventListener('MSPointerDown', touchHandler, true);
					element.addEventListener('touchmove', touchHandler, true);
					element.addEventListener('MSPointerMove', touchHandler, true);
					element.addEventListener('touchend', touchHandler, true);
					element.addEventListener('MSPointerUp', touchHandler, true);
					element.addEventListener('touchcancel', touchHandler, true);
					element.addEventListener('mousedown', mouseHandler, false);
					element.addEventListener('mousemove', mouseHandler, false);
					element.addEventListener('mouseup', mouseHandler, false);

					if (options.nav) {
						$element.prepend('<div class="cv-nav"><div class="cv-prev">' + options.navText[0] + '</div><div class="cv-next">' + options.navText[1] + '</div></div>');

						let prev_btn = $element.find('.cv-prev')[0],
							next_btn = $element.find('.cv-next')[0];

						prev_btn.addEventListener('touchend', touchHandler, true);
						prev_btn.addEventListener('MSPointerUp', touchHandler, true);
						prev_btn.addEventListener('click', prevClick, false);
						next_btn.addEventListener('touchend', touchHandler, true);
						next_btn.addEventListener('MSPointerUp', touchHandler, true);
						next_btn.addEventListener('click', nextClick, false);
					}

					$element.on('goTo', goTo);
					moveTo(0);

					return true;

				}



				if (!init()) {
					return false;
				}



				function mouseHandler(e) {

					let diff = e.clientY - current_item_pos;

					switch (e.type) {

						case 'mousedown':
							is_mousedown = true;
							current_item_pos = diff;
							break;

						case 'mousemove':
							if (is_mousedown) {
								moveByMouse(diff);
							}
							break;

						case 'mouseup':
						default:
							if (is_mousedown) {
								if (diff > 0) {
									diff = 0;
								}
								moveFinal(diff);
								is_mousedown = false;
							}
							break;

					}

				}



				function touchHandler(e) {

					// https://stackoverflow.com/questions/5186441/javascript-drag-and-drop-for-touch-devices#6362527

					let touch = e.changedTouches[0],
						simulatedEvent = document.createEvent('MouseEvent'),
						d = new Date(),
						type = null;

					switch (e.type) {

						case 'touchstart':
							type = 'mousedown';
							lastTouchDown = d.getTime();
							break;

						case 'touchmove':
							type = 'mousemove';
							lastTouchDown = -1;
							break;

						case 'touchend':
							if (lastTouchDown > -1 && (d.getTime() - lastTouchDown) < clickms) {
								lastTouchDown = -1;
								type = 'click';
							} else {
								type = 'mouseup';
							}
							break;

						case 'touchcancel':
						default:
							return;

					}

					simulatedEvent.initMouseEvent(type, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
					touch.target.dispatchEvent(simulatedEvent);
					e.preventDefault();

				}



				function moveByMouse(pos) {

					if (pos > 0) {
						pos /= 5;
					}

					if (pos < last_item_pos) {
						pos = last_item_pos + (pos - last_item_pos) / 5;
					}

					$stage.css('transition', 'none');
					$element.addClass('cv-grab');
					move(pos);

				}



				function moveFinal(pos) {

					$stage.css('transition', 'all 0.25s ease');
					$element.removeClass('cv-grab');
					moveTo(Math.round(-pos / items_outer_height));

				}



				function move(pos) {

					$stage.css('transform', 'translateY(' + pos + 'px)');

				}



				// 1: first element
				function goTo(e, n) {

					if (n !== undefined && $.isNumeric(n) && Math.floor(n) === n) {
						moveTo(n - 1);
					}

				}



				// 0: first element
				function moveTo(n) {

					if (n < 0) {
						n = 0;
					}

					if (n > last_item) {
						n = last_item;
					}

					current_item = n;
					$items.removeClass('active');
					$items.slice(n, (options.items + n)).addClass('active');
					current_item_pos = -items_outer_height * n;
					move(current_item_pos);

				}



				/*
				replaced by css transition
				function slideTop(pos) {

					let mem = pos,
						interval = setInterval(function() {

							mem -= 10;

							if (mem < 0) {
								mem = 0;
								clearInterval(interval);
							}

							move(mem);

						}, 1);
					
				}
				*/



				function prevClick() {

					moveTo(current_item - 1);

				}



				function nextClick() {

					moveTo(current_item + 1);

				}


			};



			for (let c = 0; c < this.length; c++) {

				var options = $.extend({}, defaults_options, args);
				carouselVerticalClass(this[c], options);

			}

			return this;

		}
	});

})(jQuery, window, document);