/**
 * File: flickerplate.js
 * Type: Javascript file
 * Author: Chris Humboldt
 * Last Edited: 30 April 2015
 */

// Table of contents
// ---------------------------------------------------------------------------------------
// Modernizr
// Tools
// Component call
// Component
// Prototype component

// Modernizr
// ---------------------------------------------------------------------------------------
/*! modernizr 3.0.0-alpha.3 (Custom Build) | MIT *
 * http://v3.modernizr.com/download/#-touchevents !*/
! function(e, n) {
	function o(e, n) {
		return typeof e === n
	}

	function t() {
		var e, n, t, s, i, a, l;
		for (var c in f) {
			if (e = [], n = f[c], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
				for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
			for (s = o(n.fn, "function") ? n.fn() : n.fn, i = 0; i < e.length; i++) a = e[i], l = a.split("."), 1 === l.length ? Modernizr[l[0]] = s : (!Modernizr[l[0]] || Modernizr[l[0]] instanceof Boolean || (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])), Modernizr[l[0]][l[1]] = s), r.push((s ? "" : "no-") + l.join("-"))
		}
	}

	function s(e) {
		var n = c.className,
			o = Modernizr._config.classPrefix || "";
		if (Modernizr._config.enableJSClass) {
			var t = new RegExp("(^|\\s)" + o + "no-js(\\s|$)");
			n = n.replace(t, "$1" + o + "js$2")
		}
		Modernizr._config.enableClasses && (n += " " + o + e.join(" " + o), c.className = n)
	}

	function i() {
		var e = n.body;
		return e || (e = u("body"), e.fake = !0), e
	}

	function a(e, n, o, t) {
		var s, a, r, f, l = "modernizr",
			d = u("div"),
			p = i();
		if (parseInt(o, 10))
			for (; o--;) r = u("div"), r.id = t ? t[o] : l + (o + 1), d.appendChild(r);
		return s = ["&#173;", '<style id="s', l, '">', e, "</style>"].join(""), d.id = l, (p.fake ? p : d).innerHTML += s, p.appendChild(d), p.fake && (p.style.background = "", p.style.overflow = "hidden", f = c.style.overflow, c.style.overflow = "hidden", c.appendChild(p)), a = n(d, e), p.fake ? (p.parentNode.removeChild(p), c.style.overflow = f, c.offsetHeight) : d.parentNode.removeChild(d), !!a
	}
	var r = [],
		f = [],
		l = {
			_version: "3.0.0-alpha.3",
			_config: {
				classPrefix: "flick-",
				enableClasses: !0,
				enableJSClass: !0,
				usePrefixes: !0
			},
			_q: [],
			on: function(e, n) {
				var o = this;
				setTimeout(function() {
					n(o[e])
				}, 0)
			},
			addTest: function(e, n, o) {
				f.push({
					name: e,
					fn: n,
					options: o
				})
			},
			addAsyncTest: function(e) {
				f.push({
					name: null,
					fn: e
				})
			}
		},
		Modernizr = function() {};
	Modernizr.prototype = l, Modernizr = new Modernizr;
	var c = n.documentElement,
		d = l._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
	l._prefixes = d;
	var u = function() {
			return "function" != typeof n.createElement ? n.createElement(arguments[0]) : n.createElement.apply(n, arguments)
		},
		p = l.testStyles = a;
	Modernizr.addTest("touchevents", function() {
		var o;
		if ("ontouchstart" in e || e.DocumentTouch && n instanceof DocumentTouch) o = !0;
		else {
			var t = ["@media (", d.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
			p(t, function(e) {
				o = 9 === e.offsetTop
			})
		}
		return o
	}), t(), s(r), delete l.addTest, delete l.addAsyncTest;
	for (var h = 0; h < Modernizr._q.length; h++) Modernizr._q[h]();
	e.Modernizr = Modernizr
}(window, document);

// Tools
// ---------------------------------------------------------------------------------------
var tool = {
	addEvent: function($elem, $type, $eventHandle) {
		if ($elem == null || typeof($elem) == 'undefined') return;
		if ($elem.addEventListener) {
			$elem.addEventListener($type, $eventHandle, false);
		} else if ($elem.attachEvent) {
			$elem.attachEvent("on" + $type, $eventHandle);
		} else {
			$elem["on" + $type] = $eventHandle;
		}
	},
	classAdd: function($selector, $class) {
		var $crtClass = $selector.className;

		if ($selector.className.indexOf($class) === -1) {
			$selector.className = $selector.className === '' ? $class : $selector.className + ' ' + $class;
		}
	},
	classRemove: function($selector, $class) {
		var $crtClass = $selector.className;

		if ($crtClass.indexOf($class) > -1) {
			$selector.className = $selector.className.split(' ').filter(function($val) {
				return $val != $class;
			}).toString().replace(/,/g, ' ');
		}
	},
	hasClass: function($element, $class) {
		return (' ' + $element.className + ' ').indexOf(' ' + $class + ' ') > -1;
	},
	idAdd: function($selector, $id) {
		$selector.setAttribute('id', $id);
	},
	getIndex: function($node) {
		return [].indexOf.call($node.parentNode.children, $node);
	},
	log: function($text) {
		if (window.console) {
			console.log($text);
		}
	},
	wrap: function($element, $tag, $className) {
		var $wrapper = document.createElement($tag);
		var $tempElement = $element.cloneNode(true);
		$wrapper.className = $className;

		$element.parentNode.insertBefore($wrapper, $element).appendChild($tempElement);
		$element.parentNode.removeChild($element);
	},
	wrapInner: function($element, $tag, $className) {
		if (typeof $tag === "string") {
			$tag = document.createElement($tag);
		}
		if ($className !== undefined) {
			var $div = $element.appendChild($tag).setAttribute('class', $className);
		} else {
			var $div = $element.appendChild($tag);
		}
		while ($element.firstChild !== $tag) {
			$tag.appendChild($element.firstChild);
		}
	}
};

// Component call
// ---------------------------------------------------------------------------------------
function Flickerplate($selector, $userOptions) {
	var $selectorType = $selector.charAt(0).toString();

	if ($selectorType === '.') {
		var $elements = document.querySelectorAll($selector);
		for (var $i = 0; $i < $elements.length; $i++) {
			new FlickerplateComponent($elements[$i], $userOptions);
		}
	} else if ($selectorType === '#') {
		new FlickerplateComponent(document.getElementById($selector.substring(1)), $userOptions);
	}
};

// Component
// ---------------------------------------------------------------------------------------
function FlickerplateComponent($element, $userOptions) {

	// Setup
	this.element = $element;
	this.options = {
		arrows: true,
		arrowsConstraint: false,
		autoFlick: true,
		autoFlickDelay: 10,
		dotAlignment: 'center',
		dotNavigation: true,
		flickAnimation: 'transform-slide',
		flickPosition: 1,
		theme: 'light'
	};

	// User options
	if (typeof $userOptions === 'object') {
		for (var $optionKey in $userOptions) {
			if ($userOptions.hasOwnProperty($optionKey)) {
				this.options[$optionKey] = $userOptions[$optionKey];
			}
		}
	}

	// Initialise
	this.init();
}

// Prototype component
// ---------------------------------------------------------------------------------------
FlickerplateComponent.prototype = {
	init: function() {
		// Variables
		var $flicker = this.element;
		var $options = this.options;

		var $arrows = $flicker.getAttribute('data-arrows') || $options.arrows;
		var $arrowsConstraint = $flicker.getAttribute('data-arrows-constraint') || $options.arrowsConstraint;
		var $autoFlick = $flicker.getAttribute('data-auto-flick') || $options.autoFlick;
		var $autoFlickDelay = $flicker.getAttribute('data-flick-delay') * 1000 || $options.autoFlickDelay * 1000;
		var $dotAlignment = $flicker.getAttribute('data-dot-alignment') || $options.dotAlignment;
		var $dotNavigation = $flicker.getAttribute('data-dot-navigation') || $options.dotNavigation;
		var $flickAnimation = $flicker.getAttribute('data-flick-animation') || $options.flickAnimation;
		var $flickPosition = $flicker.getAttribute('data-flick-position') || $options.flickPosition;
		var $theme = $flicker.getAttribute('data-theme') || $options.theme;

		var $autoFlickWatch;
		var $flickCount = 0;
		var $flickerMoving = false;
		var $transitionEventListner = "transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd";

		// Execute
		flickerSetup();

		flickerAttachArrows();
		flickerAttachDots();
		flickerAutoStart();

		// Functions
		function flickerAttachArrows() {
			if ($flickAnimation != 'scroller-slide' && $arrows == true) {
				var $arrowLeft = document.createElement('div');
				var $arrowRight = document.createElement('div');

				$arrowLeft.className = 'arrow-navigation left';
				$arrowRight.className = 'arrow-navigation right';

				$flicker.insertBefore($arrowLeft, $flicker.querySelectorAll('.flicks')[0]);
				$flicker.insertBefore($arrowRight, $flicker.querySelectorAll('.flicks')[0]);

				// Click event
				var $arrowNavigationElements = document.querySelectorAll('.arrow-navigation');
				for (var $i = $arrowNavigationElements.length - 1; $i >= 0; $i--)(function($i) {
					$arrowNavigationElements[$i].onclick = function() {
						if (tool.hasClass(this, 'right')) {
							if (++$flickPosition > $flickCount) {
								$flickPosition = $arrowsConstraint ? $flickCount : 1;
							}
						} else {
							if (--$flickPosition < 1) {
								$flickPosition = $arrowsConstraint ? 1 : $flickCount;
							}
						}
						flickerMove();
						flickerAutoReset();
					};
				})($i);
			}
		};

		function flickerAttachDots() {
			if ($flickAnimation != 'scroller-slide' && $dotNavigation == true) {
				var $dots = document.createElement('div');
				var $dotsUL = document.createElement('ul');
				$dots.className = 'dot-navigation ' + $dotAlignment;

				for (var $i = $flickCount - 1; $i >= 0; $i--) {
					var $dotLI = document.createElement('li');
					var $dot = document.createElement('div');
					$dot.className = ($i === $flickCount - 1) ? 'dot active' : 'dot';

					$dotLI.appendChild($dot);
					$dotsUL.appendChild($dotLI);
				};

				$dots.appendChild($dotsUL);
				$flicker.insertBefore($dots, $flicker.querySelectorAll('.flicks')[0]);

				// Events
				var $dotElements = $flicker.querySelectorAll('.dot-navigation li');
				for (var $i = $dotElements.length - 1; $i >= 0; $i--) {
					$dotElements[$i].onclick = function() {
						$flickPosition = tool.getIndex(this) + 1;
						tool.classRemove($flicker.querySelector('.dot.active'), 'active');
						tool.classAdd(this.querySelector('.dot'), 'active');
						flickerMove();
					};
				};
			}
		}

		function flickerAutoFlick() {
			if (++$flickPosition > $flickCount) {
				$flickPosition = 1;
			}
			flickerMove();
		}

		function flickerAutoReset() {
			flickerAutoStop();
			flickerAutoStart();
		}

		function flickerAutoStart() {
			if ($autoFlick == true) {
				$autoFlickWatch = setInterval(flickerAutoFlick, $autoFlickDelay);
			}
		}

		function flickerAutoStop() {
			if ($autoFlick == true) {
				$autoFlickWatch = clearInterval($autoFlickWatch);
			}
		}

		function flickerMove($firstCheck) {
			$firstCheck = $firstCheck || false;
			var $flicks = $flicker.querySelector('ul.flicks');
			var $movePosition = $flickPosition - 1;
			$flicker.setAttribute('data-flick-position', $flickPosition);

			switch ($flickAnimation) {
				case 'transform-slide':
					$flicks.setAttribute('style', '-webkit-transform:translate3d(-' + $movePosition + '%, 0, 0);-o-transform:translate3d(-' + $movePosition + '%, 0, 0);-moz-transform:translate3d(-' + $movePosition + '%, 0, 0);transform:translate3d(-' + $movePosition + '%, 0, 0)');
					break;
				case 'transition-fade':
					var $allFlicks = $flicker.querySelectorAll('li');
					for (var $i = $allFlicks.length - 1; $i >= 0; $i--)(function($i) {
						tool.classRemove($allFlicks[$i], 'active');
					})($i);
					tool.classAdd($flicker.querySelector('li:nth-child(' + $flickPosition + ')'), 'active');
					break;
				case 'transition-slide':
					$flicks.style.left = '-' + $movePosition + '00%';
					break;
			}

			if ($dotNavigation == true && $firstCheck == false) {
				tool.classRemove($flicker.querySelector('.dot.active'), 'active');
				tool.classAdd($flicker.querySelector('.dot-navigation li:nth-child(' + $flickPosition + ') .dot'), 'active');
			}
		};

		function flickerSetup() {
			tool.classAdd($flicker, 'flickerplate flicker-theme-' + $theme + ' animate-' + $flickAnimation);
			tool.classAdd($flicker.getElementsByTagName('ul')[0], 'flicks');
			$flicker.setAttribute('data-flick-position', $flickPosition);

			flickerMove(true);

			// Each flick
			var $flicks = $flicker.querySelectorAll('ul.flicks > li');
			for (var $i = $flicks.length - 1; $i >= 0; $i--) {
				$flickCount++;
				tool.wrapInner($flicks[$i], 'div', 'flick-inner');
				tool.wrapInner($flicks[$i].querySelectorAll('.flick-inner')[0], 'div', 'flick-content');

				var $background = $flicks[$i].getAttribute('data-background') || false;
				if ($background !== false) {
					$flicks[$i].style.backgroundImage = 'url(' + $background + ')';
				}
			}

			// Kill the animation
			if ($flickAnimation != 'scroller-slide' && $flickAnimation != 'jquery-slide' && $flickAnimation != 'jquery-fade') {
				$flicker.addEventListener($transitionEventListner, function() {
					$flickerMoving = false;
				});
			}
		};
	}
};