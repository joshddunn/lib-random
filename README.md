# RandJS

[rand.js](https://randjs.com) is a lightweight seeded pseudorandom number generator.

Currently, this library uses a [linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator), but looks to incorporate the [PCG Family](http://www.pcg-random.org) of generators in the future.

Download the file [rand.min.js](lib/rand.min.js) and include in your project.

    <script type="text/javascript" src="rand.min.js"></script>

## Usage

Start by defining an instance of the class. Note that the seed is optional.

    var r = RandJS(seed = Date.now());
    
### Uniform Distribution

Random floating point numbers on the interval [a, b) (Output is a number)

    r.rand(a = 0, b = 1)
    
n Random floating point numbers on the interval [a, b) (Output is an array)
  
    r.manyRand(n, a = 0, b = 1)
    
Random integers on the interval [a, b] (Output is a number)

    r.randInt(a = 0, b = 2147483647 - 1)
    
n Random integers on the interval [a, b] (Output is an array)

    r.manyRandInt(n, a = 0, b = 2147483647 - 1)
