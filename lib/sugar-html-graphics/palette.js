define(function () {

    function getOffset(elem) {
        var _x = 0;
        var _y = 0;
        var _width = elem.offsetWidth;
        var _height = elem.offsetHeight;
        while( elem && !isNaN( elem.offsetLeft ) && !isNaN( elem.offsetTop ) ) {
            _x += elem.offsetLeft - elem.scrollLeft;
            _y += elem.offsetTop - elem.scrollTop;
            elem = elem.offsetParent;
        }
        return {top: _y, left: _x, width: _width, height: _height};
    }

    palette = {};

    palette.Palette = function(invoker) {
        this.invoker = invoker;
        this.container = undefined;
    };

    palette.Palette.prototype._updatePosition = function() {
        var invokerOffset = getOffset(this.invoker);
        this.container.style.top = invokerOffset.top +
            invokerOffset.height + "px";
        this.container.style.left = invokerOffset.left + "px";
    };

    // create a new container for the content of the palette, removing
    // the previous content if it had any
    palette.Palette.prototype.createContainer = function() {
        if (typeof this.container != 'undefined') {
            document.body.removeChild(this.container);
        }
        this.container = document.createElement('div');
        this.container.className = "palette";
        this.container.style.visibility = "hidden";
        document.body.appendChild(this.container);
        this._updatePosition();
    };

    palette.Palette.prototype.getContainer = function() {
        if (typeof this.container == 'undefined') {
            this.createContainer();
        }
        return this.container;
    };

    palette.Palette.prototype.popUp = function() {
        if (typeof this.container == 'undefined') {
            this.createContainer();
        }
        this.container.style.visibility = "visible";
    };

    palette.Palette.prototype.popDown = function() {
        this.container.style.visibility = "hidden";
    };

    palette.Palette.prototype.isDown = function() {
        return typeof this.container == 'undefined' ||
            this.container.style.visibility == "hidden";
    };

    palette.Palette.prototype.toggle = function() {
        if (this.isDown()) {
            this.popUp();
        }
        else {
            this.popDown();
        }
    };

    return palette;
});
