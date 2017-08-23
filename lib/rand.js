'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uint = require('cuint/lib/uint64');

var _uint2 = _interopRequireDefault(_uint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RandJS = function () {
    function RandJS() {
        var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();

        _classCallCheck(this, RandJS);

        this.seed = seed;
        this.current = this.seed;
        this.modulus = 2147483647;
        this.multiplier = 16807;

        this.pcgIncrement = (0, _uint2.default)(this.seed);
        this.pcgMultiplier = (0, _uint2.default)('6364136223846793005');
        this.pcgState = (0, _uint2.default)(this.seed);
        this.max32Bit = 2 ** 32;
    }

    _createClass(RandJS, [{
        key: '_next',
        value: function _next() {
            return this.current = this.current * this.multiplier % this.modulus;
        }
    }, {
        key: '_many',
        value: function _many(n, func) {
            var gen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            gen.push(func());
            return gen.length === n ? gen : this._many(n, func, gen);
        }
    }, {
        key: '_nextState',
        value: function _nextState() {
            this.pcgState.multiply(this.pcgMultiplier).add(this.pcgIncrement);
        }
    }, {
        key: '_pcg',
        value: function _pcg() {
            this._nextState();

            // output = state >> (29 - (state >> 61))
            return this.pcgState.clone().shiftr(29 - this.pcgState.clone().shiftr(61).toNumber()).toNumber();
        }
    }, {
        key: '_pcgFloat',
        value: function _pcgFloat() {
            return this._pcg() / this.max32Bit;
        }
    }, {
        key: 'randpcg',
        value: function randpcg() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            return a + (b - a) * this._pcgFloat();
        }
    }, {
        key: 'rand',
        value: function rand() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            return a + (b - a) * (this._next() / this.modulus);
        }
    }, {
        key: 'randInt',
        value: function randInt() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.modulus - 1;

            return a + this._next() % (b + 1 - a);
        }
    }, {
        key: 'manyRand',
        value: function manyRand(n) {
            var _this = this;

            var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            return this._many(n, function () {
                return _this.rand(a, b);
            });
        }
    }, {
        key: 'manyRandPcg',
        value: function manyRandPcg(n) {
            var _this2 = this;

            var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            return this._many(n, function () {
                return _this2.randpcg(a, b);
            });
        }
    }, {
        key: 'manyRandInt',
        value: function manyRandInt(n) {
            var _this3 = this;

            var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.modulus - 1;

            return this._many(n, function () {
                return _this3.randInt(a, b);
            });
        }
    }]);

    return RandJS;
}();

exports.default = RandJS;
