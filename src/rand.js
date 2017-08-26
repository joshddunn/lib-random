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

        this.r = 3.65415288536101;
        this.A = 0.00492867323399;

        this.zigguratBoxCoords = null;
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

    _normalPdf(x) {
        return Math.exp(- x * x / 2);
    }

    _normalPdfInverse(y) {
        return Math.sqrt(- 2 * Math.log(y));
    }

    _buildZigguratBoxCoords () {
        this.zigguratBoxCoords = new Array(257).fill(0);

        this.zigguratBoxCoords[0] = {
            x: this.r / this._normalPdf(this.r),
            y: 0
        };

        this.zigguratBoxCoords[1] = {
            x: this.r,
            y: this._normalPdf(this.r)
        };

        for (var i = 2; i < this.zigguratBoxCoords.length - 1; i++) {
            let y = this.zigguratBoxCoords[i-1].y + this.A / this.zigguratBoxCoords[i-1].x;
            this.zigguratBoxCoords[i] = {
                x: this._normalPdfInverse(y),
                y: y
            }
        }

        this.zigguratBoxCoords[256] = {
            x: 0,
            y: 1
        };
    }

    _zigguratTails() {
        let x = - Math.log(this.randPcg()) / this.r;
        let y = - Math.log(this.randPcg());

        if (y + y > x * x) {
            return this.randIntPcg(0, 1) === 0 ? x + this.r : x - this.r;
        } else {
            return this._zigguratTails();
        }
    }

    _ziggurat() {
        let layer = this.randIntPcg(0, 255);

        let point_i  = this.zigguratBoxCoords[layer];
        let point_ip = this.zigguratBoxCoords[layer + 1];

        let x = this.randPcg(-1, 1) * point_i.x;
        let y = point_i.y + this.randPcg() * (point_ip.y - point_i.y);

        if (Math.abs(x) < point_ip.x) return x;

        if (layer == 0) return this._zigguratTails();

        if (y < this._normalPdf(x)) return x;

        return this._ziggurat();
    }

    rand(a = 0, b = 1) {
        return a + (b - a) * (this._next() / this.modulus);
    }

    randPcg(a = 0, b = 1) {
        return a + (b - a) * this._pcgFloat();
    }

    randPcgNormal(mean = 0, variance = 1) {
        if (this.zigguratBoxCoords === null) this._buildZigguratBoxCoords();
        return (this._ziggurat() - mean) / Math.sqrt(variance);
    }

    randIntPcgNormal(mean = 0, variance = 1) {
        return Math.floor(0.5 + this.randPcgNormal(mean, variance));
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

    manyRandIntPcgNormal(n, mean = 0, variance = 1) {
        return this._many(n, () => this.randIntPcgNormal(mean, variance));
    }
}
