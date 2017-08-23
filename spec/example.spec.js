import Example from '../src/example.js';

describe('Initial test', () => {
    it('Property', () => {
        var e = new Example();
        expect(e.property).toBe('Hello, World!');
    });
});
