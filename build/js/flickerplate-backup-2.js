/**
 * File: buil/js/flickerplate.js
 * Type: Javascript component file
 * Author: Chris Humboldt
**/

var Flickerplate = function () {
	// Variables
	var defaults = {
		selector: '.flickerplate',
		animation: 'transform-slide',
		arrows: true,
		arrowsConstraint: false,
		autoFlick: true,
		autoFlickDelay: 10,
		dotAlignment: 'center',
		dots: true,
		position: 1,
		theme: 'light'
	};
	// HTML
	var html = {
		arrow: function (direction) {
			var direction = direction || 'left';
			var elmArrow = document.createElement('div');
			elmArrow.className = 'flickerplate-arrow _' + direction;
			return elmArrow;
		},
		dots: function (count) {
			var dots = document.createElement('div');
			var dotsUl = document.createElement('ul');

			dots.className = 'flickerplate-dots';
			for (var i = 0, len = count; i < len; i++) {
				var dotLi = document.createElement('li');
				var dot = document.createElement('div');
				dot.className = (i === 0) ? 'dot _active' : 'dot';

				dotLi.appendChild(dot);
				dotsUl.appendChild(dotLi);
			}
			dots.appendChild(dotsUl);
			return dots;
		}
	};
	// Webplate tools (partial)
	var web = {
		element: {
			body: document.getElementsByTagName('body')[0],
			html: document.getElementsByTagName('html')[0]
		},
		classAdd: function (element, classValue) {
			var self = this;
			if (self.exists(element)) {
				if (typeof classValue === 'object') {
					for (var i = 0, len = classValue.length; i < len; i++) {
						self.classAddExecute(element, classValue[i]);
					}
				} else if (self.hasWhiteSpace(classValue)) {
					var classes = classValue.split(' ');
					for (var i = 0, len = classes.length; i < len; i++) {
						self.classAddExecute(element, classes[i]);
					}
				} else {
					self.classAddExecute(element, classValue);
				}
			}
		},
		classAddExecute: function (element, classValue) {
			var crtClass = element.className;
			if (crtClass.match(new RegExp('\\b' + classValue + '\\b', 'g')) === null) {
				element.className = crtClass === '' ? classValue : crtClass + ' ' + classValue;
			}
		},
		classClear: function (element) {
			if (this.exists(element)) {
				element.removeAttribute('class');
			}
		},
		classRemove: function (element, classValue) {
			var self = this;
			if (self.exists(element)) {
				if (typeof classValue === 'object') {
					for (var i = classValue.length - 1; i >= 0; i--) {
						self.classRemoveExecute(element, classValue[i]);
					}
				} else if (self.hasWhiteSpace(classValue)) {
					var classes = classValue.split(' ');
					for (var i = 0, len = classes.length; i < len; i++) {
						self.classRemoveExecute(element, classes[i]);
					}
				} else {
					self.classRemoveExecute(element, classValue);
				}
			}
		},
		classRemoveExecute: function (element, classValue) {
			if (element.className.indexOf(classValue) > -1) {
				element.className = element.className.split(' ').filter(function (val) {
					return val != classValue;
				}).toString().replace(/,/g, ' ');
				if (element.className === '') {
					this.classClear(element);
				}
			}
		},
		exists: function (check) {
			return (check === null || check === false || typeof (check) == 'undefined') ? false : true;
		},
		hasClass: function (element, classValue) {
			return (' ' + element.className + ' ').indexOf(' ' + classValue + ' ') > -1;
		},
		hasWhiteSpace: function (check) {
			return /\s/.test(check);
		},
		isTouch: function () {
			return 'ontouchstart' in window || 'onmsgesturechange' in window;
		},
		log: function (text) {
			if (window && window.console) {
				console.log(text);
			}
		}
	};
	// Functions
	var applyAllFlickers = function (options) {
		var returnFlicks = [];
		var allflickers = document.querySelectorAll(options.selector);
		if (allflickers.length > 0) {
			for (var i = 0, len = allflickers.length; i < len; i++) {
				returnFlicks.push(applyFlicker(allflickers[i], options));
			}
		}
		return returnFlicks;
	};
	var applyFlicker = function (thisFlicker, options) {
		var flicker = {
			container: thisFlicker,
			list: thisFlicker.querySelector('ul'),
			items: thisFlicker.querySelectorAll('li'),
			options: JSON.parse(JSON.stringify(options)),
			itemsCount: 0,
			lastPosXPercent: 0,
			move: function () {
				var self = this;
				var movePosition = self.options.position - 1;
				// Animation types
				switch (self.options.animation) {
					case 'transform-slide':
						var translate3D = 'translate3d(-' + movePosition + '00%, 0, 0)';
						self.list.setAttribute('style', '-webkit-transform:' + translate3D + ';-o-transform:' + translate3D + ';-moz-transform:' + translate3D + ';transform:' + translate3D);
						self.lastPosXPercent = -(movePosition);
						break;
					case 'transition-fade':
						for (var $i = 0, $len = self.items.length; $i < $len; $i++) {
						   web.classRemove(self.items[i], '_active');
						}
						web.classAdd(self.list.querySelector('li:nth-child(' + self.options.position + ')'), '_active');
						break;
					case 'transition-slide':
						self.list.style.left = '-' + movePosition + '00%';
						self.lastPosXPercent = -(movePosition + '00');
						break;
				}
				// Update dot navigation
				if (self.options.dots) {
					web.classRemove(self.dots.querySelector('._active'), '_active');
					web.classAdd(self.dots.querySelector('li:nth-child(' + self.options.position + ') .dot'), '_active');
				}
			},
			setup: function () {
				var self = this;
				// Basic
				web.classAdd(self.container, ['flickerplate', '_t-' + self.options.theme, '_a-' + self.options.animation]);
				web.classAdd(self.list, 'flicks');
				self.itemsCount = self.items.length;
				// Set backgrounds
				if (self.itemsCount > 0) {
					for (var i = 0, len = self.items.length; i < len; i++) {
						var background = self.items[i].getAttribute('data-background') || false;
						if (background) {
							self.items[i].style.backgroundImage = 'url(' + background + ')';
						}
					}
				}
				// Arrows
				if (self.options.animation !== 'scroller-slide' && self.options.arrows) {
					self.arrows = {
						left: self.container.insertBefore(html.arrow('left'), self.list),
						right: self.container.insertBefore(html.arrow('right'), self.list)
					};
				}
				// Dots
				if (self.options.animation !== 'scroller-slide' && self.options.dots) {
					self.dots = self.container.insertBefore(html.dots(self.itemsCount), self.list);
				}
				// Set position
				self.move();
			}
		};
		flicker.setup();
		return flicker;
	};
	/*
	var flicker = {
		move: function (flicker, options) {},
		navigate: function (flicker, options) {},
		setup: function (flicker, options) {
			// Variables
			var flicks = flicker.querySelectorAll('li');
			var flickerList = flicker.querySelector('ul');
			// Basic setup
			web.classAdd(flicker, ['flickerplate', '_t-' + options.theme, '_a-' + options.animation]);
			web.classAdd(flickerList, 'flicks');
			// Each flick
			options.flicksTotal = flicks.length;
			if (flicks.length > 0) {
				for (var i = 0, len = flicks.length; i < len; i++) {
					var background = flicks[i].getAttribute('data-background') || false;
					if (background) {
						flicks[i].style.backgroundImage = 'url(' + background + ')';
					}
				}
			}
			// Arrow
			if (options.animation !== 'scroller-slide' && options.arrows) {
				flicker.insertBefore(html.arrow('left'), flickerList);
				flicker.insertBefore(html.arrow('right'), flickerList);
			}
			// Dots
			if (options.animation !== 'scroller-slide' && options.dots) {
				flicker.insertBefore(html.dots(options.flicksTotal), flickerList);
			}

			this.move(flicker, options);
			this.navigate(flicker, options);
		}
	};
	*/
	var setup = function () {
		if (!web.isTouch()) {
			web.classAdd(web.element.html, 'flickerplate-no-touch');
		}
	};
	// Initialize
	var init = function (userOptions) {
		var userOptions = userOptions || false;
		var options = {
			selector: userOptions.selector || defaults.selector,
			animation: userOptions.animation || defaults.animation,
			arrows: (typeof userOptions.arrows !== 'undefined') ? userOptions.arrows : defaults.arrows,
			arrowsConstraint: (typeof userOptions.arrowsConstraint !== 'undefined') ? userOptions.arrowsConstraint : defaults.arrowsConstraint,
			autoFlick: (typeof userOptions.autoFlick !== 'undefined') ? userOptions.autoFlick : defaults.autoFlick,
			autoFlickDelay: userOptions.autoFlickDelay || defaults.autoFlickDelay,
			dotAlignment: userOptions.dotAlignment || defaults.dotAlignment,
			dots: (typeof userOptions.dots !== 'undefined') ? userOptions.dots : defaults.dots,
			position: userOptions.position || defaults.position,
			theme: userOptions.theme || defaults.theme,
			flicksTotal: 0
		};
		return applyAllFlickers(options);
	};
	// Return
	return {
		defaults: defaults,
		init: init,
		setup: setup
	};
}();

Flickerplate.setup();
