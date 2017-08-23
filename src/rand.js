export default class RandJS {

    constructor(seed = Date.now()) {
        this.seed = seed;
        this.current = this.seed;
        this.modulus = 2147483647;
        this.multiplier = 16807;
    }

    _next() {
        return this.current = (this.current * this.multiplier) % this.modulus;
    }

    _many(n, func, gen = []) {
        gen.push(func());
        return gen.length === n ? gen : this._many(n, func, gen);
    }

    rand(a = 0, b = 1) {
        return a + (b - a) * this._next() / this.modulus;
    }

    randInt(a = 0, b = this.modulus - 1) {
        return a + this._next() % (b + 1 - a);
    }

    manyRand(n, a = 0, b = 1) {
        return this._many(n, () => this.rand(a, b));
    }

    manyRandInt(n, a = 0, b = this.modulus - 1) {
        return this._many(n, () => this.randInt(a, b));
    }

    static seed() {
        return this.seed;
    }

    get randMax() {
        return this.modulus;
    }
}
