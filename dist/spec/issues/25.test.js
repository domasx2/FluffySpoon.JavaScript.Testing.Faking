"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var index_1 = require("../../src/index");
ava_1.default('issue 25_2', function (t) {
    var calc = index_1.Substitute.for();
    calc.add(index_1.Arg.all()).returns(1337);
    calc.add(2, 5);
    t.notThrows(function () { return calc.received().add(2, 5); });
});
ava_1.default('issue 25_1: call verification does not work when using Arg.all() to set up return values', function (t) {
    var calc = index_1.Substitute.for();
    calc.add(index_1.Arg.all()).returns(1337);
    calc.add(2, 5);
    t.throws(function () { return calc.received().add(3, 4); });
});
//# sourceMappingURL=25.test.js.map