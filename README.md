# lib-random
[![npm](https://img.shields.io/npm/dt/express.svg)](https://npmjs.com/package/lib-random)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://npmjs.com/package/lib-random)

lib-random is a seeded pseudorandom number generator for many distributions.

This library uses a generator from the [PCG Family](http://www.pcg-random.org).

# Usage

### ES6

    import LibRandom from 'lib-random';
    
    var r = new LibRandom(1);
    console.log(r.rand());
    
    ...

### ES5 in RunKit + npm

    var LibRandom = require("lib-random").default

    var r = new LibRandom(1)
    console.log(r.rand())    
    
    ...

# API

    new LibRandom(seed = Date().now)

## Utilities

Given an array, one entry will be returned uniformly at random (Output is an element of the array)

    LibRandom.choose(arr)

Given an arrany, k entries will be returned uniformly at random with or without replacement (Output is an array)

    LibRandom.chooseMany(arr, k, replacement = false)

The elements in an array will be shuffled (Output is an array)

    LibRandom.shuffle(arr)

A random colorCode will be returned in the form, '#bada55' (Output is a string)

    LibRandom.colorCode()

## Uniform Distribution

Random floating point numbers on the interval [a, b) (Output is a number)

    LibRandom.rand(a = 0, b = 1)
    
n Random floating point numbers on the interval [a, b) (Output is an array)
  
    LibRandom.manyRand(n, a = 0, b = 1)
    
Random integers on the interval [a, b] (Output is a number)

    LibRandom.randInt(a = 0, b = 2 ** 32 - 1)
    
n Random integers on the interval [a, b] (Output is an array)

    LibRandom.manyRandInt(n, a = 0, b = 2 ** 32 - 1)

## Normal Distribution

Currently, normally distributed random numbers are generated using the [Box-Muller](https://en.wikipedia.org/wiki/Box–Muller_transform) to generate random numbers.

The generating algorithm will be switched to the [ziggurat algorithm](https://en.wikipedia.org/wiki/Ziggurat_algorithm) once 64-bit arithmetic becomes faster in javascript. 

Random floating point numbers (Output is a number)

    LibRandom.randNormal(mean = 0, variance = 1)

n Random floating point numbers (Output is an array)

    LibRandom.manyRandNormal(n, mean = 0, variance = 1)

Random integers (Output is a number)

    LibRandom.randIntNormal(mean = 0, variance = 1)

n Random integers (Output is an array)

    LibRandom.manyRandIntNormal(n, mean = 0, variance = 1)

## Exponential Distribution

Random floating point numbers (Output is a number)

    LibRandom.randExponential(lambda = 1)

n Random floating point numbers (Output is an array)

    LibRandom.manyRandExponential(n, lambda = 1)

# To Be Added

- [Major probability distributions](https://en.wikipedia.org/wiki/List_of_probability_distributions)  
    
