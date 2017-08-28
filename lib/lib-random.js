'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _long = require('long');

var _long2 = _interopRequireDefault(_long);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LibRandom = function () {
    function LibRandom() {
        var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();

        _classCallCheck(this, LibRandom);

        this.seed = seed;

        this.pcgIncrement = _long2.default.fromInt(1, true);
        this.pcgMultiplier = _long2.default.fromString('6364136223846793005', true);
        this.pcgState = _long2.default.fromInt(this.seed, true);

        this.max32Bit = 4294967296; // 2 ** 32;

        this.storedGaussian = [];
    }

    _createClass(LibRandom, [{
        key: '_many',
        value: function _many(n, func) {
            var gen = [];
            for (var i = 0; i < n; i++) {
                gen.push(func());
            }
            return gen;
        }
    }, {
        key: '_nextState',
        value: function _nextState() {
            this.pcgState = this.pcgState.multiply(this.pcgMultiplier).add(this.pcgIncrement);
        }
    }, {
        key: '_pcg',
        value: function _pcg() {
            this._nextState();
            return this.pcgState.shiftRightUnsigned(29 - this.pcgState.shiftRightUnsigned(61).toInt()).toInt();
        }
    }, {
        key: '_pcgFloat',
        value: function _pcgFloat() {
            return this._pcg() / this.max32Bit;
        }
    }, {
        key: '_boxMuller',
        value: function _boxMuller() {
            var u = this.rand(-1, 1);
            var v = this.rand(-1, 1);
            var s = u * u + v * v;

            if (s >= 1 || s === 0) {
                return this._boxMuller();
            } else {
                var factor = Math.sqrt(-2 * Math.log(s) / s);
                this.storedGaussian.push(v * factor);
                return u * factor;
            }
        }
    }, {
        key: 'rand',
        value: function rand() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            return a + (b - a) * this._pcgFloat();
        }
    }, {
        key: 'randInt',
        value: function randInt() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.max32Bit - 1;

            return a + this._pcg() % (b + 1 - a);
        }
    }, {
        key: 'randNormal',
        value: function randNormal() {
            var mean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var variance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            var output = this.storedGaussian.length === 1 ? this.storedGaussian.pop() : this._boxMuller();
            return output * Math.sqrt(variance) + mean;
        }
    }, {
        key: 'randIntNormal',
        value: function randIntNormal() {
            var mean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var variance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            return Math.floor(0.5 + this.randNormal(mean, variance));
        }
    }, {
        key: 'randExponential',
        value: function randExponential() {
            var lambda = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return -Math.log(1 - this.rand()) / lambda;
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
        key: 'manyRandInt',
        value: function manyRandInt(n) {
            var _this2 = this;

            var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.max32Bit - 1;

            return this._many(n, function () {
                return _this2.randInt(a, b);
            });
        }
    }, {
        key: 'manyRandNormal',
        value: function manyRandNormal(n) {
            var _this3 = this;

            var mean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var variance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            return this._many(n, function () {
                return _this3.randNormal(mean, variance);
            });
        }
    }, {
        key: 'manyRandIntNormal',
        value: function manyRandIntNormal(n) {
            var _this4 = this;

            var mean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var variance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            return this._many(n, function () {
                return _this4.randIntNormal(mean, variance);
            });
        }
    }, {
        key: 'manyRandExponential',
        value: function manyRandExponential(n) {
            var _this5 = this;

            var lambda = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            return this._many(n, function () {
                return _this5.randExponential(lambda);
            });
        }
    }, {
        key: 'choose',
        value: function choose(arr) {
            return arr[this.randInt(0, arr.length - 1)];
        }
    }, {
        key: 'chooseMany',
        value: function chooseMany(arr, k) {
            var replacement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var marr = [].concat(_toConsumableArray(arr));

            if (k < 0 || k > arr.length && !replacement) {
                throw new Error('Invalid parameter set');
            }

            var out = [];
            for (var i = 0; i < k; i++) {
                var idx = this.randInt(0, marr.length - 1);
                out.push(marr[idx]);

                if (!replacement) marr.splice(idx, 1);
            }

            return out;
        }
    }, {
        key: 'shuffle',
        value: function shuffle(arr) {
            return this.chooseMany(arr, arr.length);
        }
    }, {
        key: '_getColor',
        value: function _getColor() {
            return ("0" + this.randInt(0, 255).toString(16)).slice(-2);
        }
    }, {
        key: 'colorCode',
        value: function colorCode() {
            return '#' + this._getColor() + this._getColor() + this._getColor();
        }
    }]);

    return LibRandom;
}();

exports.default = LibRandom;
