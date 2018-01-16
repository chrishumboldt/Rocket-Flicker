/**
@author Chris Humboldt
**/

// Set the defaults
Rocket.defaults.flicker = {
   target: '.mod-flicker',
   animation: 'transformslide',
   arrows: true,
   arrowsConstraint: false,
   autoFlick: true,
   autoFlickDelay: 10,
   dotAlignment: 'center',
   dots: true,
   pauseOnHover: false,
   position: 1
};

// Module
Rocket.flicker = ({
   target = Rocket.defaults.flicker.target,
   animation = Rocket.defaults.flicker.animation,
   arrows = Rocket.defaults.flicker.arrows,
   arrowsConstraint = Rocket.defaults.flicker.arrowsConstraint,
   autoFlick = Rocket.defaults.flicker.autoFlick,
   autoFlickDelay = Rocket.defaults.flicker.autoFlickDelay,
   dotAlignment = Rocket.defaults.flicker.dotAlignment,
   dots = Rocket.defaults.flicker.dots,
   pauseOnHover = Rocket.defaults.flicker.pauseOnHover,
   position = Rocket.defaults.flicker.position
} = {}) => {
   // Methods
   const action = {
      autoStart(flicker) {
         if (flicker.autoFlickWatch) { clearTimeout(flicker.autoFlickWatch); }

         flicker.autoFlickWatch = setTimeout(() => {
            action.move({ flicker, newPosition: 'next' });
         }, Rocket.milliseconds.seconds(autoFlickDelay));
      },
      autoStop(flicker) {
         clearTimeout(flicker.autoFlickWatch);
      },
      move({ flicker, newPosition }) {
         const itemCount = flicker.items.length;

         if (autoFlick && autoFlickDelay) {
            action.autoStart(flicker);
         }

         switch (newPosition) {
            case 'next':
               if (flicker.position < itemCount) {
                  flicker.position++;
               } else if (!arrowsConstraint) {
                  flicker.position = 1;
               }
               break;

            case 'previous':
               if (flicker.position > 1) {
                  flicker.position--;
               } else if (!arrowsConstraint) {
                  flicker.position = itemCount;
               }
               break;

            default:
               if (!Rocket.is.integer(newPosition)) { return; }

               if (newPosition < 1) {
                  flicker.position = 1;
               } else if (newPosition > itemCount) {
                  flicker.position = itemCount;
               } else {
                  flicker.position = newPosition;
               }
         }

         // Move it
         const movePosition = flicker.position - 1;

         switch (animation) {
            case 'transformslide':
               const translate3D = `translate3d(-${movePosition}00%, 0, 0)`;
               flicker.inner.setAttribute('style', `-webkit-transform: ${translate3D}; -moz-transform: ${translate3D}; transform: ${translate3D}`);
               break;

            case 'transitionfade':
               Rocket.state.clear(flicker.inner.querySelector('li.is-active'));
               Rocket.state.add(flicker.inner.querySelector(`li:nth-child(${flicker.position})`), 'active');
               break;

            case 'transitionslide':
               flicker.inner.style.left = `-${movePosition}00%`;
               flicker.lastPosXLeft = -(`${movePosition}00`);
               break;
         }

         // Update dot navigation
         if (animation !== 'scrollerslide' && dots) {
            Rocket.state.clear(flicker.dots.querySelector('.is-active'));
            Rocket.state.add(flicker.dots.querySelector(`li:nth-child(${flicker.position}) .mod-flicker-dot`), 'active');
         }
      }
   };

   function applyFlicker(flickerElement) {
      let leaveTimer = undefined;

      if (!Rocket.is.element(flickerElement)) { return; }

      const flicker = setupFlicker(flickerElement);
      flicker.autoFlickWatch = undefined;

      // Actions and events
      action.autoStart(flicker);
      Rocket.event.add(flicker.arrows.left, 'click', () => {
         action.move({flicker, newPosition: 'previous'});
      });
      Rocket.event.add(flicker.arrows.right, 'click', () => {
         action.move({flicker, newPosition: 'next'});
      });
      Rocket.event.add(flicker.dots.querySelectorAll('li'), 'click', (event) => {
         action.move({flicker, newPosition: (Rocket.get.index(event.currentTarget) + 1)});
      })

      if (autoFlick && pauseOnHover) {
         Rocket.event.add(flicker.container, 'mouseover', () => {
            action.autoStop(flicker);
            if (leaveTimer) { clearTimeout(leaveTimer); }
         });

         Rocket.event.add(flicker.container, 'mouseleave', () => {
            leaveTimer = setTimeout(() => {
               action.move({flicker, newPosition: 'next'});
               action.autoStart(flicker);
            }, 500);
         });
      }

      // Result
      return {
         flicker: flicker.container,
         move: (option) => {
            action.move({flicker, newPosition: option});
         },
         start: () => {
            action.move({flicker, newPosition: 'next'});
            action.autoStart(flicker);
         },
         stop: () => {
            if (leaveTimer) { clearTimeout(leaveTimer); }
            action.autoStop(flicker);
         }
      };
   };

   const generate = {
      arrow(side = 'left') {
         let elmArrow = document.createElement('div');
         elmArrow.className = `mod-flicker-arrow _side-${side}`;
         return elmArrow;
      },
      dots(total = 0) {
         const dots = document.createElement('div');
         const dotsUL = document.createElement('ul');

         dots.className = 'mod-flicker-dots';

         for (let i = 0; i < total; i++) {
            const dotLI = document.createElement('li');
            const dot = document.createElement('div');

            dot.className = `mod-flicker-dot${(i === 0) ? ' is-active' : ''}`;
            dotLI.appendChild(dot);
            dotsUL.appendChild(dotLI);
         }

         dots.appendChild(dotsUL);
         return dots;
      }
   };

   function init() {
      const flickers = Rocket.dom.select(target);
      return (flickers.length > 0) ? flickers.map((item) => applyFlicker(item)) : flickers;
   };

   function setupFlicker(flicker) {
      const store = {
         arrows: {},
         container: flicker,
         dots: {},
         endPosX: 0,
         flickerWidth: 0,
         inner: flicker.querySelector('ul'),
         items: flicker.querySelectorAll('li'),
         lastPosXLeft: 0,
         lastPosXPercent: 0,
         panCSS: 'translate3d(0, 0, 0)',
         panThreshold: 100,
         position: position,
         posX: 0
      };

      // General element classes
      Rocket.classes.add(store.container, ['mod-flicker', `_animation-${animation}`]);
      Rocket.classes.add(flicker.querySelector('ul'), ['mod-flicker-inner']);

      // Set the backgrounds and active state
      store.items.forEach((item, index) => {
         const background = item.getAttribute('data-background');
         if (background) { item.style.backgroundImage = `url(${background})`; }
         if (index === (store.position - 1)) { Rocket.state.add(item, 'active') }
      });

      // Set arrows and dots
      if (animation != 'scrollerslide') {
         if (arrows === true) {
            store.arrows = {
               left: store.container.appendChild(generate.arrow('left')),
               right: store.container.appendChild(generate.arrow('right'))
            };
         }

         if (dots === true) {
            store.dots = store.container.appendChild(generate.dots(store.items.length));
         }
      }

      return store;
   }

   // Execute
   return init();
};
