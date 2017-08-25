import RandJS from '../src/rand';

'use strict';

describe('RandJS:', () => {

    xit('default seed value', () => {
        const r = new RandJS();
        expect(r.seed <= Date.now()).toBe(true);
    });

    xit('setting seed value', () => {
        const r = new RandJS(1);
        expect(r.seed).toEqual(1);
    });

    xit('check default float values are between 0 and 1', () => {
        const r = new RandJS();
        var num = r.manyRand(1000);

        expect(Math.max(...num) < 1).toBe(true);
        expect(Math.min(...num) >= 0).toBe(true);
    });

    xit('check float values are between 10 and 100', () => {
        const r = new RandJS();
        var num = r.manyRand(1000, 10, 100);

        expect(Math.max(...num) < 100).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    xit('check default int values are between 0 and randMax', () => {
        const r = new RandJS();
        var num = r.manyRandInt(1000);

        expect(Math.max(...num) <= r.modulus).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    xit('check int values are between 10 and 100, inclusive', () => {
        const r = new RandJS();
        var num = r.manyRandInt(1000, 10, 100);

        expect(Math.max(...num) <= 100).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    xit('check int values are inclusive', () => {
        const r = new RandJS();
        var num = r.manyRandInt(1000, 10, 11);

        expect(num.indexOf(10)).not.toBe(-1);
        expect(num.indexOf(11)).not.toBe(-1);
    });

    xit('rand pcg testing floats [0, 1)', () => {
        const r = new RandJS();
        var num = r.manyRandPcg(1000);

        expect(Math.max(...num) < 1).toBe(true);
        expect(Math.min(...num) >= 0).toBe(true);
    });

    xit('rand pcg testing floats [10, 100)', () => {
        const r = new RandJS();
        var num = r.manyRandPcg(1000, 10, 100);

        expect(Math.max(...num) < 100).toBe(true);
        expect(Math.min(...num) >= 10).toBe(true);
    });

    it('speed', () => {
        const r = new RandJS();
        var num;
        for(var i = 0; i < 50000000; i++) {
            num = r.randPcg();
        }
    });

});
