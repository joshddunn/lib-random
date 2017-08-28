import Long from 'long';

export default class RandJS {

    constructor(seed = Date.now()) {
        this.seed = seed;

        this.pcgIncrement = Long.fromInt(1, true);
        this.pcgMultiplier = Long.fromString('6364136223846793005', true);
        this.pcgState = Long.fromInt(this.seed, true);

        this.max32Bit = 4294967296; // 2 ** 32;

        this.storedGaussian = [];
    }

    _many(n, func) {
        let gen = [];
        for (var i = 0; i < n; i++) {
            gen.push(func());
        }
        return gen;
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

    _boxMuller () {
        let u = this.rand(-1, 1);
        let v = this.rand(-1, 1);
        let s = u * u + v * v;

        if (s >= 1 || s === 0) {
            return this._boxMuller();
        } else {
            let factor = Math.sqrt((-2 * Math.log(s)) / s);
            this.storedGaussian.push(v * factor);
            return u * factor;
        }
    }

    rand(a = 0, b = 1) {
        return a + (b - a) * this._pcgFloat();
    }

    randInt(a = 0, b = this.max32Bit - 1) {
        return a + this._pcg() % (b + 1 - a);
    }

    randNormal(mean = 0, variance = 1) {
        let output = this.storedGaussian.length === 1 ? this.storedGaussian.pop() : this._boxMuller();
        return output * Math.sqrt(variance) + mean;
    }

    randIntNormal(mean = 0, variance = 1) {
        return Math.floor(0.5 + this.randNormal(mean, variance));
    }

    randExponential(lambda = 1) {
        return - Math.log(1 - this.rand()) / lambda;
    }

    manyRand(n, a = 0, b = 1) {
        return this._many(n, () => this.rand(a, b));
    }

    manyRandInt(n, a = 0, b = this.max32Bit - 1) {
        return this._many(n, () => this.randInt(a, b));
    }

    manyRandNormal(n, mean = 0, variance = 1) {
        return this._many(n, () => this.randNormal(mean, variance));
    }

    manyRandIntNormal(n, mean = 0, variance = 1) {
        return this._many(n, () => this.randIntNormal(mean, variance));
    }

    manyRandExponential(n, lambda = 1) {
        return this._many(n, () => this.randExponential(lambda));
    }

    choose(arr) {
        return arr[this.randInt(0, arr.length - 1)];
    }

    chooseMany(arr, k, replacement = false) {
        let marr = [...arr];

        if (k < 0 || (k > arr.length && !replacement)) {
            throw new Error('Invalid parameter set');
        }

        let out = [];
        for (var i = 0; i < k; i++) {
            let idx = this.randInt(0, marr.length - 1);
            out.push(marr[idx]);

            if (!replacement) marr.splice(idx, 1);
        }

        return out;
    }

    shuffle(arr) {
        return this.chooseMany(arr, arr.length);
    }

    _getColor() {
        return ("0" + this.randInt(0, 255).toString(16)).slice(-2);
    }

    colorCode() {
        return '#' + this._getColor() + this._getColor() + this._getColor();
    }
}
