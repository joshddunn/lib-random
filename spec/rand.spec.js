import RandJS from '../src/rand';

'use strict';

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

        expect(Math.max(...num) <= r.randMax).toBe(true);
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

        expect(num.indexOf(10)).not.toBe(false);
        expect(num.indexOf(11)).not.toBe(false);
    });

});

