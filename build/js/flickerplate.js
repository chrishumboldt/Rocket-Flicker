/**
 * File: buil/js/flickerplate.js
 * Type: Javascript component file
 * Author: Chris Humboldt
**/

// Webplate tools module extension
var Web = (function (Web) {
	// Variables
	if (!Web.element) {
		var webEl = {
			body: document.getElementsByTagName('body')[0],
			html: document.getElementsByTagName('html')[0],
			title: document.getElementsByTagName('title')[0],
			webplateScript: document.getElementById('webplate')
		};
		Web.element = webEl;
	}
	// Basic checks
	if (!Web.exists) {
		var exists = function (check) {
			return (check === null || check === false || typeof (check) == 'undefined') ? false : true;
		};
		Web.exists = exists;
	}
	if (!Web.has) {
		var has = {
			spaces: function (check) {
				return /\s/.test(check);
			},
			class: function (element, className) {
				return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
			}
		};
		Web.has = has;
	}
	if (!Web.is) {
		var is = {
			touch: function () {
				return 'ontouchstart' in window || 'onmsgesturechange' in window;
			}
		};
		Web.is = is;
	}
	// Classes
	if (!Web.class) {
		var classMethods = {
			add: function (element, className) {
				if (exists(element)) {
					if (typeof className === 'object') {
						for (var i = 0, len = className.length; i < len; i++) {
							classMethods.addExecute(element, className[i]);
						}
					} else if (has.spaces(className)) {
						var classes = className.split(' ');
						for (var i = 0, len = classes.length; i < len; i++) {
							classMethods.addExecute(element, classes[i]);
						}
					} else {
						classMethods.addExecute(element, className);
					}
				}
			},
			addExecute: function (element, className) {
				var crtClass = element.className;
				if (crtClass.match(new RegExp('\\b' + className + '\\b', 'g')) === null) {
					element.className = crtClass === '' ? className : crtClass + ' ' + className;
				}
			},
			clear: function (element) {
				if (exists(element)) {
					element.removeAttribute('class');
				}
			},
			remove: function (element, className) {
				if (exists(element)) {
					if (typeof className === 'object') {
						for (var i = className.length - 1; i >= 0; i--) {
							classMethods.removeExecute(element, className[i]);
						}
					} else if (has.spaces(className)) {
						var classes = className.split(' ');
						for (var i = 0, len = classes.length; i < len; i++) {
							classMethods.removeExecute(element, classes[i]);
						}
					} else {
						classMethods.removeExecute(element, className);
					}
				}
			},
			removeExecute: function (element, className) {
				if (element.className.indexOf(className) > -1) {
					element.className = element.className.split(' ').filter(function (val) {
						return val != className;
					}).toString().replace(/,/g, ' ');
					if (element.className === '') {
						classMethods.clear(element);
					}
				}
			}
		};
		Web.class = classMethods;
	}
	// Development
	if (!Web.log) {
		var log = function (text) {
			if (window && window.console) {
				console.log(text);
			}
		};
		Web.log = log;
	}
	// Events
	if (!Web.event) {
		var eventMethods = {
			add: function (elem, type, eventHandle) {
				if (elem == null || typeof (elem) == 'undefined') return;
				if (elem.addEventListener) {
					elem.addEventListener(type, eventHandle, false);
				} else if (elem.attachEvent) {
					elem.attachEvent('on' + type, eventHandle);
				} else {
					elem['on' + type] = eventHandle;
				}
			},
			remove: function (elem, type, eventHandle) {
				if (elem == null || typeof (elem) == 'undefined') return;
				if (elem.removeEventListener) {
					elem.removeEventListener(type, eventHandle, false);
				} else if (elem.detachEvent) {
					elem.detachEvent('on' + type, eventHandle);
				} else {
					elem['on' + type] = eventHandle;
				}
			}
		};
		Web.event = eventMethods;
	}

	return Web;
})(Web || {});

// Component container
var Flickerplate = (function () {
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

	// Functions
	var setup = function () {
		if (!Web.is.touch()) {
			Web.class.add(Web.element.html, 'fp-no-touch');
		}
	};
	var setupFlicker = function (flicker, options) {
		if (!flicker || typeof options !== 'object') {
			return false;
		}
		// Variables
		var options = JSON.parse(JSON.stringify(options));
		var flickerUL = flicker.querySelector('ul');
		var flickerLIs = flicker.querySelectorAll('li');
		var flicksCount = flickerLIs.length;
		var flickerEl = {
			UL: flickerUL,
			LIs: flickerLIs
		};
		options.count = flicksCount;

		Web.class.add(flicker, ['flickerplate', '_t-' + options.theme, '_a-' + options.animation]);
		Web.class.add(flickerUL, 'flicks');

		// Set backgrounds
		if (flicksCount > 0) {
			for (var i = 0, len = flicksCount; i < len; i++) {
				var background = flickerLIs[i].getAttribute('data-background') || false;
				if (background) {
					flickerLIs[i].style.backgroundImage = 'url(' + background + ')';
				}
			}
		}
		// Set arrows & dots
		if (options.animation !== 'scroller-slide') {
			if (options.arrows) {
				flickerEl.arrows = {
					left: flicker.insertBefore(html.arrow('left'), flickerUL),
					right: flicker.insertBefore(html.arrow('right'), flickerUL)
				}
			}
			if (options.dots) {
				flickerEl.dots = flicker.insertBefore(html.dots(flicksCount), flickerUL);
			}
		}

		return {
			flicker: flicker,
			options: options,
			elements: flickerEl
		};
	};

	// Inner component
	var component = function (flickerObj) {
		if (!flickerObj) {
			return false;
		}
		// Variables
		var elements = flickerObj.elements;
		var flicker = flickerObj.flicker;
		var options = flickerObj.options;

		// Functions
		var arrowNavigation = function () {
			if (options.animation === 'scroller-slide' || !options.arrows) {
				return false;
			};
			Web.event.add(elements.arrows.left, 'click', function () {
				move('previous');
			});
			Web.event.add(elements.arrows.right, 'click', function () {
				move('next');
			});
		};
		var move = function (to) {
			// Set the new position
			switch (to) {
				case 'next':
					if (options.position < options.count) {
						options.position++;
					} else if (!options.arrowsConstraint) {
						options.position = 1;
					}
					break;
				case 'previous':
					if (options.position > 1) {
						options.position--;
					} else if (!options.arrowsConstraint) {
						options.position = options.count;
					}
					break;
				default:
					if (typeof to === 'number') {
						if (to <= options.count && to >= 1) {
							options.position = to;
						} else if (to >= options.count) {
							options.position = options.count;
						} else if (to <= 1) {
							options.position = 1;
						}
					} else {
						return false;
					}
			}

			// Move it
			var movePosition = options.position - 1;
			switch (options.animation) {
				case 'transform-slide':
					var translate3D = 'translate3d(-' + movePosition + '00%, 0, 0)';
					elements.UL.setAttribute('style', '-webkit-transform:' + translate3D + ';-o-transform:' + translate3D + ';-moz-transform:' + translate3D + ';transform:' + translate3D);
					break;
				case 'transition-fade':
					Web.class.remove(elements.UL.querySelector('li._active'), '_active');
					Web.class.add(elements.UL.querySelector('li:nth-child(' + options.position + ')'), '_active');
					break;
				case 'transition-slide':
					elements.UL.style.left = '-' + movePosition + '00%';
					break;
			}
			// Update dot navigation
			if (options.animation !== 'scroller-slide' && options.dots) {
				Web.class.remove(elements.dots.querySelector('._active'), '_active');
				Web.class.add(elements.dots.querySelector('li:nth-child(' + options.position + ') .dot'), '_active');
			}
		};

		// Execute and return
		arrowNavigation();
		move(options.position);
		Web.class.add();
		return {
			flicker: flicker,
			move: move
		}
	};

	// Initialiser
	var init = function (uOptions) {
		// Options
		var uOptions = (typeof uOptions === 'object') ? uOptions : false; // User options
		var options = {
			selector: (typeof uOptions.selector === 'string') ? uOptions.selector : defaults.selector,
			animation: (typeof uOptions.animation === 'string') ? uOptions.animation : defaults.animation,
			arrows: (typeof uOptions.arrows === 'boolean') ? uOptions.arrows : defaults.arrows,
			arrowsConstraint: (typeof uOptions.arrowsConstraint === 'boolean') ? uOptions.arrowsConstraint : defaults.arrowsConstraint,
			autoFlick: (typeof uOptions.autoFlick === 'boolean') ? uOptions.autoFlick : defaults.autoFlick,
			autoFlickDelay: (typeof uOptions.autoFlickDelay === 'number') ? uOptions.autoFlickDelay : defaults.autoFlickDelay,
			dotAlignment: (typeof uOptions.dotAlignment === 'string') ? uOptions.dotAlignment : defaults.dotAlignment,
			dots: (typeof uOptions.dots === 'boolean') ? uOptions.dots : defaults.dots,
			position: (typeof uOptions.position === 'number') ? uOptions.position : defaults.position,
			theme: (typeof uOptions.theme === 'string') ? uOptions.theme : defaults.theme
		};
		var flickers = document.querySelectorAll(options.selector);
		if (flickers.length < 1) {
			return false;
		}

		// Initialise each component and return
		var objReturn = [];
		for (var i = 0, len = flickers.length; i < len; i++) {
		   objReturn.push(new component(setupFlicker(flickers[i], options)));
		}
		return objReturn;
	};

	// Execute and return
	setup();
	return {
		defaults: defaults,
		init: init
	};
})();
