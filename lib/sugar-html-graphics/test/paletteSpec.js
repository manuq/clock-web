var palette = require("../palette");

describe("palette", function() {
    it("should start down", function() {
        var myPalette = new palette.Palette('a');
        expect(myPalette.isDown()).toBe(true);
    });
});
