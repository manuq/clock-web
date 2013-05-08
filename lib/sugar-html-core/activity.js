define(function(require) {
    var shortcut = require("sugar-html-core/shortcut");

    var activity = {};

    var bus = require("sugar-html-core/bus");

    activity.setup = function() {
        shortcut.add("Ctrl", "Q", this.close);
    };

    activity.getXOColor = function(callback) {
        bus.sendMessage("activity.get_xo_color", [], callback);
    };

    activity.close = function(callback) {
        bus.sendMessage("activity.close", [], callback);
    };

    return activity;
});
