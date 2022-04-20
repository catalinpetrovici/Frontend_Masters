'use strict';

//////////////////////////////////////////
function add(first, second) {
  return first + second;
}
function sub(first, second) {
  return first - second;
}
function mul(first, second) {
  return first * second;
}

//////////////////////////////////////////
function identityf(argument) {
  return () => argument;
}

var three = identityf(3);
// console.log(three());

//////////////////////////////////////////
function addf(first) {
  return (second) => first + second;
}

// console.log(addf(3)(4)); //7

//////////////////////////////////////////

// function liftf(binary) {
//   return function (first) {
//     return function (second) {
//       return binary(first, second);
//     };
//   };
// }

// higher order function
function liftf(binary) {
  return (first) => (second) => binary(first, second);
}
var addf = liftf(add);
// console.log(addf(3)(4)); //7
// console.log(liftf(mul)(5)(6)); //30

//////////////////////////////////////////

// function curry(binary, first) {
//   return liftf(binary)(first);
// }

function curry(binary, first) {
  return (second) => binary(first, second);
}
var add3 = curry(add, 3);
// console.log(add3(4)); //7
// console.log(curry(mul, 5)(6)); //30

//////////////////////////////////////////

// var inc = addf(1);

// var inc = liftf(add)(1);

var inc = curry(add, 1);
// console.log(inc(5));
// console.log(inc(inc(5)));

//////////////////////////////////////////

function twice(binary) {
  return (a) => binary(a, a);
}

// console.log(add(11, 11)); //22
var doubl = twice(add);
// console.log(doubl(11)); //22
var square = twice(mul);
// console.log(square(11)); //121

//////////////////////////////////////////

// function reverse(func) {
//   return (...args) => func(...args.reverse());
// }

function reverse(binary) {
  return (a, b) => binary(b, a);
}

var bus = reverse(sub);
// console.log(bus(3, 2));

//////////////////////////////////////////

function composeu(f, g) {
  return (a) => g(f(a));
}

// console.log(composeu(doubl, square)(5)); // 100

//////////////////////////////////////////

function composeb(f, g) {
  return (a, b, c) => g(f(a, b), c);
}

// console.log(composeb(add, mul)(2, 3, 7)); //35

//////////////////////////////////////////

function limit(binary, count) {
  return (c, d) => {
    if (count < 1) return;
    count -= 1;
    return binary(c, d);
  };
}

var add_ltd = limit(add, 1);
// console.log(add_ltd(3, 4)); //7
// console.log(add_ltd(3, 5)); //undefined

////////////////////////////////////////// Function Challenge 4
