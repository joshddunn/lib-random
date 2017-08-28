import LibRandom from '../src/lib-random';

'use strict';

// some helper functions for testing

function average (arr) {
    return arr.reduce((a,b) => {return a + b;}) / arr.length;
}

function variance (arr) {
    var average = arr.reduce((a,b) => {return a + b;}) / arr.length;
    return arr.reduce((a,b) => {return a + (b - average) ** 2;}, 0) / arr.length;
}

describe('LibRandom:', () => {

    it('default seed value', () => {
        const r = new LibRandom();
        expect(r.seed <= Date.now()).toBe(true);
    });

    it('setting seed value', () => {
        const r = new LibRandom(1);
        expect(r.seed).toEqual(1);
    });

    it('rand pcg testing floats [0, 1)', () => {
        const r = new LibRandom();
        var num = r.manyRand(100000);

        expect(Math.max(...num) < 1).toBe(true);
        expect(Math.min(...num) >= 0).toBe(true);
    });

    it('rand pcg testing floats [10, 100)', () => {
        const r = new LibRandom();
        var num = r.manyRand(100000, 10, 100);

        expect(Math.max(...num) < 100).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    it('rand pcg testing ints [0, randMax)', () => {
        const r = new LibRandom();
        var num = r.manyRandInt(100000);

        expect(Math.max(...num) >= 0).toBe(true);
        expect(Math.min(...num) < 2 ** 32).toBe(true);
    });

    it('rand pcg testing ints [10, 11]', () => {
        const r = new LibRandom();
        var num = r.manyRandInt(100000, 10, 11);

        expect(num.indexOf(10)).not.toBe(-1);
        expect(num.indexOf(11)).not.toBe(-1);
    });

    it('rand pcg average and variance testing', () => {
        const r = new LibRandom();
        var num = r.manyRand(100000);

        expect(average(num) - 0.5).toBeLessThan(0.01);
        expect(variance(num) - 1/12).toBeLessThan(0.01);
    });

    it('rand pcg algorithm for normal distribution', () => {
        const r = new LibRandom();
        var num = r.manyRandNormal(1000000);

        // console.log(average(num));
        // console.log(variance(num));

        expect(Math.abs(average(num))).toBeLessThan(0.01);
        expect(Math.abs(variance(num) - 1)).toBeLessThan(0.01);
    });

    it('rand pcg algorithm for normal distribution, mean = 4, variance = 10', () => {
        const r = new LibRandom();
        var m = 4;
        var v = 10;
        var num = r.manyRandNormal(1000000, m, v);

        // console.log(average(num));
        // console.log(variance(num));

        expect(Math.abs(average(num) - m)).toBeLessThan(0.02);
        expect(Math.abs(variance(num) - v)).toBeLessThan(0.05);
    });

    it('rand int pcg algorithm for normal distribution', () => {
        const r = new LibRandom();
        var num = r.manyRandIntNormal(100000);

        // console.log(average(num));
        // console.log(variance(num));

        expect(Math.abs(average(num))).toBeLessThan(0.01);
        expect(Math.abs(variance(num) - 1)).toBeLessThan(0.11);
    });

    it('rand float pcg exponential distribution', () => {
        const r = new LibRandom();
        var num = r.manyRandExponential(100000);

        expect(Math.abs(average(num) - 1)).toBeLessThan(0.01);
        expect(Math.abs(variance(num) - 1)).toBeLessThan(0.01);
    });

    it('rand float pcg exponential distribution, lambda 7', () => {
        const r = new LibRandom();
        let lambda = 7;
        var num = r.manyRandExponential(100000, lambda);

        // console.log(average(num));
        // console.log(variance(num));

        expect(Math.abs(average(num) - 1 / lambda)).toBeLessThan(0.01);
        expect(Math.abs(variance(num) - 1 / (lambda ** 2) )).toBeLessThan(0.01);
    });

    it('testing choice', () => {
        const r = new LibRandom();
        var arr = [1, 'a', {}];
        var num = r.choose(arr);
        var set = new Set();

        for (var i = 0; i < 100; i++) {
            set.add(r.choose(arr));
        }

        expect(arr.includes(num)).toBe(true);
        expect(set.has(arr[0])).toBe(true);
        expect(set.has(arr[1])).toBe(true);
        expect(set.has(arr[2])).toBe(true);

    });

    it('testing choose many', () => {
        const r = new LibRandom();
        var arr = [1,2,3,4,5];
        var num = r.chooseMany(arr, 3);
        var set = new Set(num);

        // without replacement
        expect(num.length).toBe(3);
        expect(set.size).toBe(3);
        expect(() => {
            r.chooseMany(arr, 6);
        }).toThrow(new Error('Invalid parameter set'));
        expect(() => {
            r.chooseMany(arr, -1);
        }).toThrow(new Error('Invalid parameter set'));

        // with replacement
        expect(r.chooseMany(arr, 20, true).length).toBe(20);
        expect(() => {
            r.chooseMany(arr, -1, true);
        }).toThrow(new Error('Invalid parameter set'));
    });

    it('testing colorcode', () => {
        const r = new LibRandom();
        var num = r.colorCode();

        expect(num[0]).toBe('#');
        expect(num.search(/[^g-z]/)).toBe(0);
        expect(num.length).toBe(7);
    });

    it('testing shuffle', () => {
        const r = new LibRandom();
        var arr = [1,2,3,4,5,6,7,8,9,10];
        var num = r.shuffle(arr);

        expect(arr).not.toBe(num);
        expect(arr.length).toBe(num.length);
        expect(new Set(arr).size).toBe(new Set(num).size);
    });

});
