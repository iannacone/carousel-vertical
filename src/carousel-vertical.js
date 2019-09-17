/**
 * carousel vertical
 * @version 1.0
 * @author Simone Iannacone
 * @todo follow the owl carousel direction
 */
;(function($){
'use strict';
	
	var defaults_options = {
			items: 4,
			margin: 10,
			nav: true,
			navText: ['prev', 'next'],
		};
	
	$.fn.extend({
		carouselVertical: function(argumentss){
			
			var carouselVerticalClass = function(element, options){
				
				var _options = {},
					$this = null,
					$stage = null,
					$items = null,
					_this = null,
					_height = 0,
					_stage_height = 0,
					_items_height = 0,
					_items_outer_height = 0,
					_items_count = 0,
					_current_item = 1,
					_current_item_pos = 1,
					_last_item = 1,
					_last_item_pos = 1;
				
				function init(el, opts){
					_this = el;
					$this = $(_this);
					if($this.hasClass('cv-loaded'))
						return false;
					_options = opts;
					$items = $this.find('.item');
					_items_count = $items.length;
					if(_items_count == 0)
						return false;
					_height = $this.height();
					if(_items_count < _options.items) _options.items = _items_count;
					$this.wrapInner('<div class="cv-stage-outer"><div class="cv-stage"></div></div>');
					// drag and drop (for touchscreens) always active
					$this.addClass('cv-drag');
					// explicit height for position relative
					$this.height(_height);
					$items.wrap('<div class="cv-item"></div>');
					$items = $this.find('.cv-item');
					$items.slice(0, _options.items).addClass('active');
					_items_height = parseInt((_height - _options.margin * _options.items) / _options.items);
					$items.css({
						'height': _items_height + 'px',
						'margin-bottom': _options.margin + 'px'
					});
					_items_outer_height = _items_height + _options.margin;
					_stage_height = _items_outer_height * _items_count;
					_last_item = _items_count - _options.items;
					_last_item_pos = -_last_item * _items_outer_height;
					$stage = $this.find('.cv-stage');
					$items = $this.find('.cv-item');
					$this.addClass('cv-loaded');
					_this.addEventListener('touchstart', touchHandler, true);
					_this.addEventListener('MSPointerDown', touchHandler, true);
					_this.addEventListener('touchmove', touchHandler, true);
					_this.addEventListener('MSPointerMove', touchHandler, true);
					_this.addEventListener('touchend', touchHandler, true);
					_this.addEventListener('MSPointerUp', touchHandler, true);
					_this.addEventListener('touchcancel', touchHandler, true);
					_this.addEventListener('mousedown', mouseHandler, false);
					_this.addEventListener('mousemove', mouseHandler, false);
					_this.addEventListener('mouseup', mouseHandler, false);
					if(_options.nav){
						$this.prepend('<div class="cv-nav"><div class="cv-prev">' + _options.navText[0] + '</div><div class="cv-next">' + _options.navText[1] + '</div></div>');
						var prev_btn = $this.find('.cv-prev')[0],
							next_btn = $this.find('.cv-next')[0];
						prev_btn.addEventListener('touchend', touchHandler, true);
						prev_btn.addEventListener('MSPointerUp', touchHandler, true);
						prev_btn.addEventListener('click', prevClick, false);
						next_btn.addEventListener('touchend', touchHandler, true);
						next_btn.addEventListener('MSPointerUp', touchHandler, true);
						next_btn.addEventListener('click', nextClick, false);
					}
					$this.on('goTo', goTo);
					moveTo(0);
					return true;
				}
				
				if(!init(element, options))
					return false;
				
				var is_mousedown = false;
				function mouseHandler(e){
					var diff = e.clientY - _current_item_pos;
					switch(e.type){
						case 'mousedown':
							is_mousedown = true;
							_current_item_pos = diff;
						break;
						case 'mousemove':
							if(is_mousedown)
								moveByMouse(diff);
							break;
						case 'mouseup':
						default:
							if(is_mousedown) {
								if(diff > 0) diff = 0;
								moveFinal(diff);
								is_mousedown = false;
							}
					}
				}
				var clickms = 100,
					lastTouchDown = -1;
				function touchHandler(e){
					// https://stackoverflow.com/questions/5186441/javascript-drag-and-drop-for-touch-devices#6362527
					var touch = e.changedTouches[0],
						simulatedEvent = document.createEvent('MouseEvent'),
						d = new Date(),
						type = null;
					switch(e.type){
						case 'touchstart':
							type = 'mousedown';
							lastTouchDown = d.getTime();
							break;
						case 'touchmove':
							type = 'mousemove';
							lastTouchDown = -1;
							break;        
						case 'touchend':
							if(lastTouchDown > -1 && (d.getTime() - lastTouchDown) < clickms){
								lastTouchDown = -1;
								type = 'click';
								break;
							}
							type = 'mouseup';
							break;
						case 'touchcancel':
						default:
							return;
					}
					simulatedEvent.initMouseEvent(type, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
					touch.target.dispatchEvent(simulatedEvent);
					e.preventDefault();
				}
				function moveByMouse(pos){
					if(pos > 0) pos /= 5;
					if(pos < _last_item_pos) pos = _last_item_pos + (pos - _last_item_pos) / 5;
					$stage.css('transition', 'none');
					$this.addClass('cv-grab');
					move(pos);
				}
				function moveFinal(pos){
					$stage.css('transition', 'all 0.25s ease');
					$this.removeClass('cv-grab');
					moveTo(Math.round(-pos / _items_outer_height));
				}
				function move(pos){
					$stage.css('transform', 'translateY(' + pos + 'px)');
				}
				// 1: first element
				function goTo(e, n){
					if(typeof n != 'undefined' && $.isNumeric(n) && Math.floor(n) == n)
						moveTo(n - 1);
				}
				// 0: first element
				function moveTo(n){
					if(n < 0) n = 0;
					if(n > _last_item) n = _last_item;
					_current_item = n;
					$items.removeClass('active');
					$items.slice(n, (_options.items + n)).addClass('active');
					_current_item_pos = -_items_outer_height * n;
					move(_current_item_pos);
				}
				/*
				replaced by css transition
				function slideTop(pos){
					var mem = pos,
						interval = setInterval(function(){
							mem -= 10;
							if(mem < 0){
								mem = 0;
								clearInterval(interval);
							}
							move(mem);
						}, 1);
				}
				*/
				function prevClick(){
					moveTo(_current_item - 1);
				}
				function nextClick(){
					moveTo(_current_item + 1);
				}
			};
			
			function init(el, args){
				if(typeof args == 'object' || typeof args == 'undefined'){
					var options = $.extend({}, defaults_options, args);
					carouselVerticalClass(el, options);
				}
			}
			
			var length = this.length;
			if(length < 1) return this;
			if(typeof argumentss == 'undefined') argumentss = defaults_options;
			if(length > 1)
				for(var c = 0; c < length; c++)
					init(this[c], argumentss);
			else
				init(this[0], argumentss);
			return this;
		}
	});

})(jQuery);