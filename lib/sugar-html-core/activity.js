define(function(require) {
    var activity = {};

    var bus = require("sugar-html-core/bus");

    activity.getXOColor = function(callback) {
        bus.sendMessage("activity.get_xo_color", [], callback);
    };

    activity.close = function(callback) {
        bus.sendMessage("activity.close", [], callback);
    };

    return activity;
});
