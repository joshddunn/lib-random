import Long from 'long';

export default class RandJS {

    constructor(seed = Date.now()) {
        this.seed = seed;
        this.current = this.seed;
        this.modulus = 2147483647;
        this.multiplier = 16807;

        this.pcgIncrement = Long.fromInt(1, true);
        this.pcgMultiplier = Long.fromString('6364136223846793005', true);
        this.pcgState = Long.fromInt(this.seed, true);

        this.max32Bit = 4294967296; // 2 ** 32;
    }

    _next() {
        return this.current = (this.current * this.multiplier) % this.modulus;
    }

    _many(n, func, gen = []) {
        gen.push(func());
        return gen.length === n ? gen : this._many(n, func, gen);
    }

    _nextState() {
        this.pcgState = this.pcgState.multiply(this.pcgMultiplier).add(this.pcgIncrement);
    }

    _pcg() {
        this._nextState();
        return this.pcgState.shiftRightUnsigned(29 - this.pcgState.shiftRightUnsigned(61).toInt()).toInt();
    }

    _pcgFloat() {
        return this._pcg() / this.max32Bit;
    }

    _ziggurat(mean = 0, variance = 1) {
        const f = function (x) {
            return Math.exp(- x * x / 2);
        }

        const finv = function (y) {
            return Math.sqrt(- 2 * Math.log(y));
        }

        const height = function (layer) {
            var y = f(r);
            var x = r;
            for (var i = 2; i <= layer; i++) {
                y = y + (f(r) * r) / x;
                x = finv(y);
            }

            return y;
        }

        // the areas are all fucked up
        while (true) {
            var r = 3.65415288536;

            var layer = this.randIntPcg(0, 255);

            // rectangles need to be of all equal area
            var yi = height(layer);
            var yip1 = height(layer + 1);

            var xi = finv(yi);
            var xip1 = finv(yip1);

            var x = this.randPcg() * xi;

            if (x < xip1) {
                return this.randIntPcg(0, 1) === 0 ? x : - x;
            }

            if (layer == 0) {
                while (true) {
                    var x = - Math.log(this.randPcg()) / r;
                    var y = - Math.log(this.randPcg());

                    if (2 * y > x * x) {
                        return this.randIntPcg(0, 1) === 0 ? x + r : - x - r;
                    }
                }
            }

            var y = yi + this.randPcg() * (yip1 - yi);
            if (y < f(x)) {
                return this.randIntPcg(0, 1) === 0 ? x : - x;
            }
        }
    }

    rand(a = 0, b = 1) {
        return a + (b - a) * (this._next() / this.modulus);
    }

    randPcg(a = 0, b = 1) {
        return a + (b - a) * this._pcgFloat();
    }

    randPcgNormal(mean = 0, variance = 1) {
        return this._ziggurat(mean, variance);
    }

    randInt(a = 0, b = this.modulus - 1) {
        return a + this._next() % (b + 1 - a);
    }

    randIntPcg(a = 0, b = this.max32Bit - 1) {
        return a + this._pcg() % (b + 1 - a);
    }

    manyRand(n, a = 0, b = 1) {
        return this._many(n, () => this.rand(a, b));
    }

    manyRandPcg(n, a = 0, b = 1) {
        return this._many(n, () => this.randPcg(a, b));
    }

    manyRandInt(n, a = 0, b = this.modulus - 1) {
        return this._many(n, () => this.randInt(a, b));
    }

    manyRandIntPcg(n, a = 0, b = this.max32Bit - 1) {
        return this._many(n, () => this.randIntPcg(a, b));
    }

    manyRandPcgNormal(n, mean = 0, variance = 1) {
        return this._many(n, () => this.randPcgNormal(mean, variance));
    }
}
