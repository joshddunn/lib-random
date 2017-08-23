import RandJS from '../src/rand';

'use strict';

describe('seeds', () => {

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

        var num = [];
        for (var i = 0; i < 1000; i++) {
            num.push(r.rand());
        }

        num.forEach((e) => {
            expect(e < 1).toBe(true);
            expect(e >= 0).toBe(true);
        });
    });

    it('check float values are between 10 and 100', () => {
        const r = new RandJS();

        var num = [];
        for (var i = 0; i < 1000; i++) {
            num.push(r.rand(10, 100));
        }

        num.forEach((e) => {
            expect(e < 100).toBe(true);
            expect(e >= 10).toBe(true);
        });
    });


    it('check default int values are between 0 and 1', () => {
        const r = new RandJS();

        var num = [];
        for (var i = 0; i < 1000; i++) {
            num.push(r.randInt());
        }

        num.forEach((e) => {
            expect(e < r.m).toBe(true);
            expect(e >= 0).toBe(true);
        });
    });

    it('check int values are between 10 and 100', () => {
        const r = new RandJS();

        var num = [];
        for (var i = 0; i < 1000; i++) {
            num.push(r.randInt(10, 100));
        }

        num.forEach((e) => {
            expect(e <= 100).toBe(true);
            expect(e >= 10).toBe(true);
        });
    });

    it('check int values are inclusive', () => {
        const r = new RandJS();

        var num = [];
        for (var i = 0; i < 1000; i++) {
            num.push(r.randInt(10, 11));
        }

        expect(num.indexOf(10) === -1).toBe(false);
        expect(num.indexOf(11) === -1).toBe(false);
    });

    it('average is around 0.5', () => {
        // var num = [];
        // console.log(num.reduce((a,b) => { return a + b }) / num.length);
    });
});

