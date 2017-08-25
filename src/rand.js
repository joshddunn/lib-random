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

    rand(a = 0, b = 1) {
        return a + (b - a) * (this._next() / this.modulus);
    }

    randPcg(a = 0, b = 1) {
        return a + (b - a) * this._pcgFloat();
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
}
