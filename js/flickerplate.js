/**
 * File: flickerplate.js
 * Type: Javascript file
 * Author: Chris Humboldt
 * Last Edited: 1 May 2015
 */

// Table of contents
// ---------------------------------------------------------------------------------------
// Tools
// Component call
// Component
// Prototype component

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
	isTouch: function() {
		return 'ontouchstart' in window || 'onmsgesturechange' in window;
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
	// Add touch detection
	var $htmlElement = document.getElementsByTagName('html')[0];
	if (!tool.isTouch() && !tool.hasClass($htmlElement, 'flick-no-touch')) {
		tool.classAdd($htmlElement, 'flick-no-touch');
	}

	// Component
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