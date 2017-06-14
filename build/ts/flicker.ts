/**
@author Chris Humboldt
**/

// Extend Rocket defaults
Rocket.defaults.flicker = {
   target: '.rocket-flicker',
   animation: 'transformslide',
   arrows: true,
   arrowsConstraint: false,
   autoFlick: true,
   autoFlickDelay: 10,
   dotAlignment: 'center',
   dots: true,
   position: 1
};

// Module container
module RockMod_Flicker {
   // Variables
   const _RD = Rocket.defaults.flicker;

   // Functions
   function applyFlicker(flicker, options: options) {
      // Catch
      if (!Rocket.is.element(flicker) || !Rocket.is.object(options)) { return false; }

      // Continue
      options = setupFlicker(flicker, options);

      // Variables
		let autoFlickWatch;
		let elements = options.elements;

      // Functions
      options.autoStart = () => {
         autoFlickWatch = setTimeout(function () {
				move('next', options);
			}, Rocket.milliseconds.seconds(options.autoFlickDelay));
      }

      options.autoStop = () => {
         clearTimeout(autoFlickWatch);
      }

      function moveInner(position) {
         move(position, options);
      }

      function start(delay) {
			var delay = (typeof delay === 'number') ? delay : Rocket.defaults.flicker.autoFlickDelay;
			clearTimeout(autoFlickWatch);
			options.autoFlick = true;
			options.autoFlickDelay = delay;
			autoFlickWatch = setTimeout(function () {
				move('next', options);
			}, Rocket.milliseconds.seconds(options.autoFlickDelay));
		};

      function stop () {
			if (options.autoFlick && options.autoFlickDelay) {
				clearTimeout(autoFlickWatch);
				options.autoFlick = false;
			}
		};

      // Execute
      arrowNavigation(options);
      dotNavigation(options);
      move(options.position, options);
      if (Rocket.is.touch()) {
         moveHammer(options);
      }

      return {
         flicker: flicker,
         move: moveInner,
         options: options,
         start: start,
         stop: stop
      }
   }

   function arrowNavigation(options: options) {
      if (options.animation === 'scrollerslide' || !options.arrows) {
         return false;
      }
      Rocket.event.add(options.elements.arrows.left, 'click', function () {
         move('previous', options);
      });
      Rocket.event.add(options.elements.arrows.right, 'click', function () {
         move('next', options);
      });
   }

   function dotNavigation(options: options) {
      if (options.animation === 'scrollerslide' || !options.dots) {
         return false;
      }
      Rocket.event.add(options.elements.dots, 'click', function (event) {
         if (Rocket.has.class(event.target, 'dot') && !Rocket.has.class(event.target, '_active')) {
            move(Rocket.get.index(event.target.parentNode) + 1, options);
         }
      });
   }

   const html = {
      arrow: (directionInput) => {
			const direction = directionInput || 'left';
			const elmArrow = document.createElement('div');
			elmArrow.className = 'rocket-flicker-arrow _' + direction;

			return elmArrow;
		},
		dots: (count) => {
			const dots = document.createElement('div');
			const dotsUl = document.createElement('ul');

			dots.className = 'rocket-flicker-dots';
			for (let i = 0, len = count; i < len; i++) {
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

   function move(to, options: options) {
      // Auto flick
      if (options.autoFlick && options.autoFlickDelay) {
         options.autoStop();
         options.autoStart();
      }
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
      let elements = options.elements;
      let movePosition = options.position - 1;

      switch (options.animation) {
         case 'transformslide':
            var translate3D = 'translate3d(-' + movePosition + '00%, 0, 0)';
            elements.UL.setAttribute('style', '-webkit-transform:' + translate3D + ';-o-transform:' + translate3D + ';-moz-transform:' + translate3D + ';transform:' + translate3D);
            options.lastPosXPercent = -(movePosition) * 100;
            break;
         case 'transitionfade':
            Rocket.classes.remove(elements.UL.querySelector('li._active'), '_active');
            Rocket.classes.add(elements.UL.querySelector('li:nth-child(' + options.position + ')'), '_active');
            break;
         case 'transitionslide':
            elements.UL.style.left = '-' + movePosition + '00%';
            options.lastPosXLeft = -(movePosition + '00');
            break;
      }
      // Update dot navigation
      if (options.animation !== 'scrollerslide' && options.dots) {
         Rocket.classes.remove(elements.dots.querySelector('._active'), '_active');
         Rocket.classes.add(elements.dots.querySelector('li:nth-child(' + options.position + ') .dot'), '_active');
      }
   }

   function moveHammer(options: options) {
      if (typeof Hammer === 'function') {
         var hammerTime = new Hammer(options.elements.UL);
         hammerTime.on('swipeleft swiperight', function(event) {
            moveSwipe(event, options);
         });
      }
   }

   function moveSwipe(event: any, options: options) {
      if (event.type == 'swipeleft') {
         move('next', options);
      } else if (event.type == 'swiperight') {
         move('previous', options);
      }
   }

   function setupFlicker(flicker, options: options) {
      // Catch
      if (!Rocket.is.element(flicker) || !Rocket.is.object(options)) { return false; }

      // Continue
		// Variables
		let newOptions: options = JSON.parse(JSON.stringify(options));
		var flickerUL = flicker.querySelector('ul');
		var flickerLIs = flicker.querySelectorAll('li');
		var flicksCount = flickerLIs.length;
		newOptions.elements = {
         arrows: {},
         dots: {},
         flicker: flicker,
			UL: flickerUL,
			LIs: flickerLIs
		};
		newOptions.count = flicksCount;
      newOptions.endPosX = 0;
		newOptions.flickerWidth = 0;
		newOptions.lastPosXLeft = 0;
		newOptions.lastPosXPercent = 0;
		newOptions.panCSS = 'translate3d(0, 0, 0)';
		newOptions.panThreshold = 100;
		newOptions.posX = 0;

      // Classes
		Rocket.classes.add(flicker, ['rocket-flicker', '_a-' + options.animation]);
		Rocket.classes.add(flickerUL, 'flicks');

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
		if (options.animation !== 'scrollerslide') {
			if (options.arrows) {
				newOptions.elements.arrows = {
					left: flicker.insertBefore(html.arrow('left'), flickerUL),
					right: flicker.insertBefore(html.arrow('right'), flickerUL)
				}
			}
			if (options.dots) {
				newOptions.elements.dots = flicker.insertBefore(html.dots(flicksCount), flickerUL);
				Rocket.classes.add(newOptions.elements.dots, '_' + options.dotAlignment);
			}
		}

      return newOptions;
   }

   // Initialiser
   export function init(uOptions: options): any {
      if (!Rocket.is.object(uOptions)) { uOptions = {}; }

      const options = {
         target: Rocket.helper.setDefault(uOptions.target, _RD.target),
         animation: Rocket.helper.setDefault(uOptions.animation, _RD.animation),
         arrows: Rocket.helper.setDefault(uOptions.arrows, _RD.arrows),
         arrowsConstraint: Rocket.helper.setDefault(uOptions.arrowsConstraint, _RD.arrowsConstraint),
         autoFlick: Rocket.helper.setDefault(uOptions.autoFlick, _RD.autoFlick),
         autoFlickDelay: Rocket.helper.setDefault(uOptions.autoFlickDelay, _RD.autoFlickDelay),
         dotAlignment: Rocket.helper.setDefault(uOptions.dotAlignment, _RD.dotAlignment),
         dots: Rocket.helper.setDefault(uOptions.dots, _RD.dots),
         position: Rocket.helper.setDefault(uOptions.position, _RD.position)
      }

      var flickers = Rocket.dom.select(options.target);

      // Catch
      if (flickers.length < 1) {
         return false;
      }

      // Initialise each instance and return
      let objReturn = [];
      for (let flicker of flickers) {
         objReturn.push(applyFlicker(flicker, options));
      }

      return objReturn;
   }
}

// Bind to Rocket
Rocket.flicker = RockMod_Flicker.init;
