# RandJS

[rand.js](https://randjs.com) is a lightweight seeded pseudorandom number generator.

Currently, this library uses a [linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator), but looks to incorporate the [PCG Family](http://www.pcg-random.org) of generators in the future.
    
### Uniform Distribution

Random floating point numbers on the interval [a, b) (Output is a number)

    RandJS.rand(a = 0, b = 1)
    
n Random floating point numbers on the interval [a, b) (Output is an array)
  
    RandJS.manyRand(n, a = 0, b = 1)
    
Random integers on the interval [a, b] (Output is a number)

    RandJS.randInt(a = 0, b = 2147483647 - 1)
    
n Random integers on the interval [a, b] (Output is an array)

    RandJS.manyRandInt(n, a = 0, b = 2147483647 - 1)
