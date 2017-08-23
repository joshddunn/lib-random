export default class RandJS {

    constructor(seed = Date.now()) {
        this.seed = seed;
        this.current = this.seed;
        this.m = 2147483647;
        this.a = 16807;
    }

    next() {
        return this.current = (this.current * this.a) % this.m;
    }

    rand(a = 0, b = 1) {
        return a + (b - a) * this.next() / this.m;
    }

    randInt(a = 0, b = this.m - 1) {
        return a + this.next() % (b + 1 - a);
    }

    manyRand(n, a = 0, b = 1) {
        return this._many(n, () => this.rand(a, b));
    }

    manyRandInt(n, a = 0, b = this.m - 1) {
        return this._many(n, () => this.randInt(a, b));
    }

    _many(n, func, gen = []) {
        gen.push(func());
        return gen.length === n ? gen : this._many(n, func, gen);
    }

    static seed() {
        return this.seed;
    }
}
