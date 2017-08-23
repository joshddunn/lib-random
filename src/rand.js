import UINT64 from 'cuint/lib/uint64';

export default class RandJS {

    constructor(seed = Date.now()) {
        this.seed = seed;
        this.current = this.seed;
        this.modulus = 2147483647;
        this.multiplier = 16807;

        this.pcgIncrement = UINT64(1);
        this.pcgMultiplier = UINT64('6364136223846793005');
        this.pcgState = UINT64(this.seed);
        this.max32Bit = 2 ** 32;
    }

    _next() {
        return this.current = (this.current * this.multiplier) % this.modulus;
    }

    _many(n, func, gen = []) {
        gen.push(func());
        return gen.length === n ? gen : this._many(n, func, gen);
    }

    _nextState() {
        this.pcgState.multiply(this.pcgMultiplier).add(this.pcgIncrement);
    }

    _pcg() {
        this._nextState();

        // output = state >> (29 - (state >> 61))
        // return this.pcgState.clone().shiftr(29 - this.pcgState.clone().shiftr(61).toNumber()).toNumber();

        // output = (state ^ (state >> 22)) >> (22 + (state >> 61))
        var left = this.pcgState.clone().xor(this.pcgState.clone().shiftr(22));
        var right = 22 + this.pcgState.clone().shiftr(61).toNumber();

        return left.shiftr(right).toNumber();
    }

    _pcgFloat() {
        return this._pcg() / this.max32Bit;
    }

    randpcg(a = 0, b = 1) {
        return a + (b - a) * this._pcgFloat();
    }

    rand(a = 0, b = 1) {
        return a + (b - a) * (this._next() / this.modulus);
    }

    randInt(a = 0, b = this.modulus - 1) {
        return a + this._next() % (b + 1 - a);
    }

    manyRand(n, a = 0, b = 1) {
        return this._many(n, () => this.rand(a, b));
    }

    manyRandPcg(n, a = 0, b = 1) {
        return this._many(n, () => this.randpcg(a, b));
    }

    manyRandInt(n, a = 0, b = this.modulus - 1) {
        return this._many(n, () => this.randInt(a, b));
    }
}
