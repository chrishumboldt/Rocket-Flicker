Rocket.defaults.flicker = {
    target: '.flicker',
    animation: 'transform-slide',
    arrows: true,
    arrowsConstraint: false,
    autoFlick: true,
    autoFlickDelay: 10,
    dotAlignment: 'center',
    dots: true,
    position: 1
};
var RockMod_Flicker;
(function (RockMod_Flicker) {
    var _d = Rocket.defaults.flicker;
    function applyFlicker(flicker, options) {
        if (!Rocket.is.element(flicker) || !Rocket.is.object(options)) {
            return false;
        }
        options = setupFlicker(flicker, options);
        var autoFlickWatch;
        var elements = options.elements;
        options.autoStart = function () {
            autoFlickWatch = setTimeout(function () {
                move('next', options);
            }, Rocket.milliseconds.seconds(options.autoFlickDelay));
        };
        options.autoStop = function () {
            clearTimeout(autoFlickWatch);
        };
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
        }
        ;
        function stop() {
            if (options.autoFlick && options.autoFlickDelay) {
                clearTimeout(autoFlickWatch);
                options.autoFlick = false;
            }
        }
        ;
        arrowNavigation(options);
        dotNavigation(options);
        move(options.position, options);
        if (Rocket.is.touch()) {
            moveHammer(options);
        }
        return {
            flicker: flicker,
            move: moveInner,
            start: start,
            stop: stop
        };
    }
    function arrowNavigation(options) {
        if (options.animation === 'scroller-slide' || !options.arrows) {
            return false;
        }
        Rocket.event.add(options.elements.arrows.left, 'click', function () {
            move('previous', options);
        });
        Rocket.event.add(options.elements.arrows.right, 'click', function () {
            move('next', options);
        });
    }
    function dotNavigation(options) {
        if (options.animation === 'scroller-slide' || !options.dots) {
            return false;
        }
        Rocket.event.add(options.elements.dots, 'click', function (event) {
            if (Rocket.has.class(event.target, 'dot') && !Rocket.has.class(event.target, '_active')) {
                move(Rocket.get.index(event.target.parentNode) + 1, options);
            }
        });
    }
    var html = {
        arrow: function (directionInput) {
            var direction = directionInput || 'left';
            var elmArrow = document.createElement('div');
            elmArrow.className = 'rocket-flicker-arrow _' + direction;
            return elmArrow;
        },
        dots: function (count) {
            var dots = document.createElement('div');
            var dotsUl = document.createElement('ul');
            dots.className = 'rocket-flicker-dots';
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
    function move(to, options) {
        if (options.autoFlick && options.autoFlickDelay) {
            options.autoStop();
            options.autoStart();
        }
        switch (to) {
            case 'next':
                if (options.position < options.count) {
                    options.position++;
                }
                else if (!options.arrowsConstraint) {
                    options.position = 1;
                }
                break;
            case 'previous':
                if (options.position > 1) {
                    options.position--;
                }
                else if (!options.arrowsConstraint) {
                    options.position = options.count;
                }
                break;
            default:
                if (typeof to === 'number') {
                    if (to <= options.count && to >= 1) {
                        options.position = to;
                    }
                    else if (to >= options.count) {
                        options.position = options.count;
                    }
                    else if (to <= 1) {
                        options.position = 1;
                    }
                }
                else {
                    return false;
                }
        }
        var elements = options.elements;
        var movePosition = options.position - 1;
        switch (options.animation) {
            case 'transform-slide':
                var translate3D = 'translate3d(-' + movePosition + '00%, 0, 0)';
                elements.UL.setAttribute('style', '-webkit-transform:' + translate3D + ';-o-transform:' + translate3D + ';-moz-transform:' + translate3D + ';transform:' + translate3D);
                options.lastPosXPercent = -(movePosition) * 100;
                break;
            case 'transition-fade':
                Rocket.classes.remove(elements.UL.querySelector('li._active'), '_active');
                Rocket.classes.add(elements.UL.querySelector('li:nth-child(' + options.position + ')'), '_active');
                break;
            case 'transition-slide':
                elements.UL.style.left = '-' + movePosition + '00%';
                options.lastPosXLeft = -(movePosition + '00');
                break;
        }
        if (options.animation !== 'scroller-slide' && options.dots) {
            Rocket.classes.remove(elements.dots.querySelector('._active'), '_active');
            Rocket.classes.add(elements.dots.querySelector('li:nth-child(' + options.position + ') .dot'), '_active');
        }
    }
    function moveHammer(options) {
        if (typeof Hammer === 'function') {
            var hammerTime = new Hammer(options.elements.UL);
            hammerTime.on('swipeleft swiperight', function (event) {
                moveSwipe(event, options);
            });
        }
    }
    function moveSwipe(event, options) {
        if (event.type == 'swipeleft') {
            move('next', options);
        }
        else if (event.type == 'swiperight') {
            move('previous', options);
        }
    }
    function setupFlicker(flicker, options) {
        if (!Rocket.is.element(flicker) || !Rocket.is.object(options)) {
            return false;
        }
        var newOptions = JSON.parse(JSON.stringify(options));
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
        Rocket.classes.add(flicker, ['rocket-flicker', '_a-' + options.animation]);
        Rocket.classes.add(flickerUL, 'flicks');
        if (flicksCount > 0) {
            for (var i = 0, len = flicksCount; i < len; i++) {
                var background = flickerLIs[i].getAttribute('data-background') || false;
                if (background) {
                    flickerLIs[i].style.backgroundImage = 'url(' + background + ')';
                }
            }
        }
        if (options.animation !== 'scroller-slide') {
            if (options.arrows) {
                newOptions.elements.arrows = {
                    left: flicker.insertBefore(html.arrow('left'), flickerUL),
                    right: flicker.insertBefore(html.arrow('right'), flickerUL)
                };
            }
            if (options.dots) {
                newOptions.elements.dots = flicker.insertBefore(html.dots(flicksCount), flickerUL);
                Rocket.classes.add(newOptions.elements.dots, '_' + options.dotAlignment);
            }
        }
        return newOptions;
    }
    function init(uOptions) {
        if (!Rocket.is.object(uOptions)) {
            return false;
        }
        var options = {
            target: Rocket.helper.setDefault(uOptions.target, _d.target),
            animation: Rocket.helper.setDefault(uOptions.animation, _d.animation),
            arrows: Rocket.helper.setDefault(uOptions.arrows, _d.arrows),
            arrowsConstraint: Rocket.helper.setDefault(uOptions.arrowsConstraint, _d.arrowsConstraint),
            autoFlick: Rocket.helper.setDefault(uOptions.autoFlick, _d.autoFlick),
            autoFlickDelay: Rocket.helper.setDefault(uOptions.autoFlickDelay, _d.autoFlickDelay),
            dotAlignment: Rocket.helper.setDefault(uOptions.dotAlignment, _d.dotAlignment),
            dots: Rocket.helper.setDefault(uOptions.dots, _d.dots),
            position: Rocket.helper.setDefault(uOptions.position, _d.position)
        };
        var flickers = Rocket.dom.select(options.target);
        if (flickers.length < 1) {
            return false;
        }
        var objReturn = [];
        for (var _i = 0, flickers_1 = flickers; _i < flickers_1.length; _i++) {
            var flicker = flickers_1[_i];
            objReturn.push(applyFlicker(flicker, options));
        }
        return objReturn;
    }
    RockMod_Flicker.init = init;
})(RockMod_Flicker || (RockMod_Flicker = {}));
Rocket.flicker = RockMod_Flicker.init;
