define(function () {
    var util = require("sugar-html-graphics/util");
//    var util = require("util");

    var radioToolButton = {};

    radioToolButton.RadioToolButton = function (elems) {
        this.elems = elems;
        var active;
        var that = this;

        for (i = 0; i < elems.length; i++) {
            var elem = elems[i];
            elem.addEventListener("click", clickHandler);

            if (active === undefined && util.hasClass(elem, 'active')) {
                active = elem;
            }
        }

        if (active === undefined) {
            active = elems[0];
            updateClasses();
        }

        function clickHandler(evt) {
            active = evt.target;
            updateClasses();
        }

        function updateClasses() {
            for (i = 0; i < elems.length; i++) {
            var elem = elems[i];
                util.removeClass(elem, 'active');
            }
            util.addClass(active, 'active');
        }

        this.getActive = function () {
            return active;
        };

    };

    return radioToolButton;

});
