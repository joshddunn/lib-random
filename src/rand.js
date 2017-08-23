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

    static seed() {
        return this.seed;
    }
}
