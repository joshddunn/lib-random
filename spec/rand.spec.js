import RandJS from '../src/rand';

'use strict';

// some helper functions for testing

function average (arr) {
    return arr.reduce((a,b) => {return a + b;}) / arr.length;
}

function variance (arr) {
    var average = arr.reduce((a,b) => {return a + b;}) / arr.length;
    return arr.reduce((a,b) => {return a + (b - average) ** 2;}) / arr.length;
}

describe('RandJS:', () => {

    it('default seed value', () => {
        const r = new RandJS();
        expect(r.seed <= Date.now()).toBe(true);
    });

    it('setting seed value', () => {
        const r = new RandJS(1);
        expect(r.seed).toEqual(1);
    });

    it('check default float values are between 0 and 1', () => {
        const r = new RandJS();
        var num = r.manyRand(1000);

        expect(Math.max(...num) < 1).toBe(true);
        expect(Math.min(...num) >= 0).toBe(true);
    });

    it('check float values are between 10 and 100', () => {
        const r = new RandJS();
        var num = r.manyRand(1000, 10, 100);

        expect(Math.max(...num) < 100).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    it('check default int values are between 0 and randMax', () => {
        const r = new RandJS();
        var num = r.manyRandInt(1000);

        expect(Math.max(...num) <= r.modulus).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    it('check int values are between 10 and 100, inclusive', () => {
        const r = new RandJS();
        var num = r.manyRandInt(1000, 10, 100);

        expect(Math.max(...num) <= 100).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    it('check int values are inclusive', () => {
        const r = new RandJS();
        var num = r.manyRandInt(1000, 10, 11);

        expect(num.indexOf(10)).not.toBe(-1);
        expect(num.indexOf(11)).not.toBe(-1);
    });

    it('rand pcg testing floats [0, 1)', () => {
        const r = new RandJS();
        var num = r.manyRandPcg(1000);

        expect(Math.max(...num) < 1).toBe(true);
        expect(Math.min(...num) >= 0).toBe(true);
    });

    it('rand pcg testing floats [10, 100)', () => {
        const r = new RandJS();
        var num = r.manyRandPcg(1000, 10, 100);

        expect(Math.max(...num) < 100).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    it('rand pcg testing ints [0, randMax)', () => {
        const r = new RandJS();
        var num = r.manyRandIntPcg(1000);

        expect(Math.max(...num) >= 0).toBe(true);
        expect(Math.min(...num) < 2 ** 32).toBe(true);
    });

    it('rand pcg testing ints [10, 11]', () => {
        const r = new RandJS();
        var num = r.manyRandIntPcg(1000, 10, 11);

        expect(num.indexOf(10)).not.toBe(-1);
        expect(num.indexOf(11)).not.toBe(-1);
    });

    it('rand pcg average and variance testing', () => {
        const r = new RandJS();
        var num = r.manyRandPcg(5000);

        expect(average(num) - 0.5).toBeLessThan(0.01);
        expect(variance(num) - 1/12).toBeLessThan(0.01);
    });
});
