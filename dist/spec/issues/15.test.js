"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var index_1 = require("../../src/index");
ava_1.default('issue 15: can call properties twice', function (t) {
    var baz = "baz";
    var foo = index_1.Substitute.for();
    foo.bar.returns(baz);
    var call1 = foo.bar;
    var call2 = foo.bar;
    t.is(call1, baz);
    t.is(call2, baz);
});
//# sourceMappingURL=15.test.js.map