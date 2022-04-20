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

let three = identityf(3);
// console.log(three());

//////////////////////////////////////////
function addff(first) {
  return (second) => first + second;
}

// console.log(addff(3)(4)); //7

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
let addf = liftf(add);
// console.log(addf(3)(4)); //7
// console.log(liftf(mul)(5)(6)); //30

//////////////////////////////////////////

// function curry(binary, first) {
//   return liftf(binary)(first);
// }

function curry(binary, first) {
  return (second) => binary(first, second);
}
let add3 = curry(add, 3);
// console.log(add3(4)); //7
// console.log(curry(mul, 5)(6)); //30

//////////////////////////////////////////

// let inc = addf(1);

// let inc = liftf(add)(1);

let inc = curry(add, 1);
// console.log(inc(5));
// console.log(inc(inc(5)));

//////////////////////////////////////////

function twice(binary) {
  return (a) => binary(a, a);
}

// console.log(add(11, 11)); //22
let doubl = twice(add);
// console.log(doubl(11)); //22
let square = twice(mul);
// console.log(square(11)); //121

//////////////////////////////////////////

// function reverse(func) {
//   return (...args) => func(...args.reverse());
// }

function reverse(binary) {
  return (a, b) => binary(b, a);
}

let bus = reverse(sub);
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

let add_ltd = limit(add, 1);
// console.log(add_ltd(3, 4)); //7
// console.log(add_ltd(3, 5)); //undefined

////////////////////////////////////////// Function Challenge 4

function from(start) {
  return () => {
    let next = start;
    start += 1;
    return next;
  };
}

let index = from(0);
// console.log(index()); //0
// console.log(index()); //1
// console.log(index()); //2

//////////////////////////////////////////

function to(binary, count) {
  return () => {
    var value = binary();
    if (value >= count) return;
    return value;
  };
}

let indexTo = to(from(1), 3);
// console.log(indexTo()); // 1
// console.log(indexTo()); // 2
// console.log(indexTo()); // undefined

//////////////////////////////////////////

function fromTo(start, end) {
  return to(from(start), end);
}
let indexFromTo = fromTo(0, 3);
// console.log(indexFromTo()); //0
// console.log(indexFromTo()); //1
// console.log(indexFromTo()); //2
// console.log(indexFromTo()); //undefined

//////////////////////////////////////////

// function element(arr, gen) {
//   return () => {
//     let index = gen();
//     return index && arr[index];
//     // if (index !== undefined) {
//     //   return arr[index];
//     // }
//   };
// }

// var ele = element(['a', 'b', 'c', 'd'], fromTo(1, 3));
// console.log(ele()); // b
// console.log(ele()); // c
// console.log(ele()); // undefined

//////////////////////////////////////////

function element(arr, gen) {
  if (gen === undefined) {
    gen = fromTo(0, arr.length);
  }
  return () => {
    let index = gen();
    if (index !== undefined) {
      return arr[index];
    }
  };
}

var ele = element(['a', 'b', 'c', 'd']);
// console.log(ele()); // a
// console.log(ele()); // b
// console.log(ele()); // c
// console.log(ele()); // d
// console.log(ele()); // undefined

//////////////////////////////////////////

function collect(gen, arr) {
  return () => {
    let value = gen();
    if (value !== undefined) {
      arr.push(value);
    }
    return value;
  };
}

let array = [];
let col = collect(fromTo(0, 2), array);
// console.log(col()); // 0
// console.log(col()); // 1
// console.log(col()); // undefined
// console.log(array); // [0, 1]

//////////////////////////////////////////

function filter(gen, predicate) {
  return () => {
    let value;
    do {
      value = gen();
    } while (value !== undefined && !predicate(value));

    return value;
  };
}

let fil = filter(fromTo(0, 5), (value) => value % 3 === 0);
// console.log(fil()); // 0
// console.log(fil()); // 3
// console.log(fil()); // undefined

//////////////////////////////////////////

// function concat(gen1, gen2) {
//   let gen = gen1;
//   return () => {
//     let value = gen();
//     if (value !== undefined) {
//       return value;
//     }
//     gen = gen2;
//     return gen();
//   };
// }

function concat(...gens) {
  let next = element(gens),
    gen = next();
  return function recur() {
    let value = gen();
    if (value === undefined) {
      gen = next();
      if (gen !== undefined) {
        return recur();
      }
    }
    return value;
  };
}

let con = concat(fromTo(0, 3), fromTo(0, 2));
// console.log(con()); // 0
// console.log(con()); // 1
// console.log(con()); // 2
// console.log(con()); // 0
// console.log(con()); // 1
// console.log(con()); // undefined

////////////////////////////////////////// Function Challenge 6

// function gensymf(string) {
//   let number = 0;
//   return () => {
//     number += 1;
//     return string + number;
//   };
// }

// let geng = gensymf('G'),
//   genh = gensymf('H');
// console.log(geng()); // "G1"
// console.log(genh()); // "H1"
// console.log(geng()); // "G2"
// console.log(genh()); // "H2"

//////////////////////////////////////////

function gensymff(unary, seed) {
  return (prefix) => {
    let number = seed;
    return () => {
      number = unary(number);
      return prefix + number;
    };
  };
}

let gensymf = gensymff(inc, 0),
  geng = gensymf('G'),
  genh = gensymf('H');
// console.log(geng()); // "G1"
// console.log(genh()); // "H1"
// console.log(geng()); // "G2"
// console.log(genh()); // "H2"

//////////////////////////////////////////

// function fibonaccif(a, b) {
//   return function () {
//     let next = a;
//     a = b;
//     b += next;
//     console.log(`a: ${a} b: ${b}`);
//     return next;
//   };
// }

function fibonaccif(a, b) {
  return concat(
    concat(limit(identityf(a), 1), limit(identityf(b), 1)),
    function fibonacci() {
      var next = a + b;
      a = b;
      b = next;
      return next;
    }
  );
}

let fib = fibonaccif(0, 1);
// console.log(fib()); // 0
// console.log(fib()); // 1
// console.log(fib()); // 1
// console.log(fib()); // 2
// console.log(fib()); // 3
// console.log(fib()); // 5

////////////////////////////////////////// Function Challenge 7

function counter(value) {
  return {
    up: function () {
      value += 1;
      return value;
    },
    down: function () {
      value -= 1;
      return value;
    },
  };
}

var object = counter(10),
  up = object.up,
  down = object.down;

// console.log(up()); // 11
// console.log(down()); // 10
// console.log(down()); // 9
// console.log(up()); // 10

//////////////////////////////////////////

function revocable(binary) {
  return {
    invoke: (first, second) => {
      if (binary !== undefined) {
        return binary(first, second);
      }
    },
    revoke: () => {
      binary = undefined;
    },
  };
}

let rev = revocable(add),
  add_rev = rev.invoke;

// console.log(add_rev(3, 4)); //7
// console.log(rev.revoke());
// console.log(add_rev(5, 7)); //undefined

////////////////////////////////////////// Function Challenge 8

function m(value, source) {
  return {
    value: value,
    source: typeof source === 'string' ? source : String(value),
  };
}
// console.log(JSON.stringify(m(1))); // value : 1, source : 1
// console.log(JSON.stringify(m(Math.PI, 'pi'))); // value 3.14 , source : pi

//////////////////////////////////////////

function addm(a, b) {
  return m(a.value + b.value, `(${a.source}+${b.source})`);
}

// console.log(JSON.stringify(addm(m(3), m(4)))); // value : 7, source : "(3+4)"
// console.log(JSON.stringify(addm(m(1), m(Math.PI, 'pi')))); // value 4.14159 , source : "(1+pi)"

//////////////////////////////////////////

function liftm(binary, op) {
  return function (a, b) {
    return m(binary(a.value, b.value), `(${a.source}${op}${b.source})`);
  };
}

var addm = liftm(add, '+');

// console.log(JSON.stringify(addm(m(3), m(4)))); // value : 7, source : "(3+4)"
// console.log(JSON.stringify(liftm(mul, '*')(m(3), m(4)))); // value : 12, source : "(3*4)"

//////////////////////////////////////////

function liftm(binary, op) {
  return function (a, b) {
    if (typeof a === 'number') {
      a = m(a);
    }
    if (typeof b === 'number') {
      b = m(b);
    }
    return m(binary(a.value, b.value), `(${a.source}${op}${b.source})`);
  };
}

var addm = liftm(add, '+');

// console.log(JSON.stringify(addm(3, 4))); //value : 7, source : "(3+4)"

////////////////////////////////////////// Function Challenge 9

function exp(value) {
  return Array.isArray(value) ? value[0](value[1], value[2]) : value;
}

var sae = [mul, 5, 11];
// console.log(exp(sae)); // 55
// console.log(exp(42)); //42

//////////////////////////////////////////

function exp(value) {
  return Array.isArray(value) ? value[0](exp(value[1]), exp(value[2])) : value;
}

var nae = [Math.sqrt, [add, [square, 3], [square, 4]]];
// console.log(exp(nae)); // 5

//////////////////////////////////////////

function addg(first) {
  function more(next) {
    if (next === undefined) {
      return first;
    }
    first += next;
    return more;
  }
  if (first !== undefined) {
    return more;
  }
}
// console.log(addg()); // undefined
// console.log(addg(2)()); // 2
// console.log(addg(2)(7)()); // 9
// console.log(addg(3)(0)(4)()); // 7
// console.log(addg(1)(2)(4)(8)()); // 15

////////////////////////////////////////// Function Challenge 10

function liftg(binary) {
  return function (first) {
    if (first === undefined) {
      return first;
    }
    return function more(next) {
      if (next === undefined) {
        return first;
      }
      first = binary(first, next);
      return more;
    };
  };
}

// console.log(liftg(mul)()); // undefined
// console.log(liftg(mul)(3)()); // 3
// console.log(liftg(mul)(3)(0)(4)()); // 0
// console.log(liftg(mul)(1)(2)(4)(8)()); //64

//////////////////////////////////////////

function arrayg(first) {
  var array = [];
  function more(next) {
    if (next === undefined) {
      return array;
    }
    array.push(next);
    return more;
  }
  return more(first);
}

// console.log(arrayg()); // []
// console.log(arrayg(3)()); // [3]
// console.log(arrayg(3)(4)(5)()); // [3,4,5]

//////////////////////////////////////////

// function continuize(unary) {
//   return (callback, arg) => callback(unary(arg));
// }
function continuize(any) {
  return (callback, ...x) => callback(any(...x));
}

var sqrtc = continuize(Math.sqrt);
// sqrtc(console.log, [81]); // 9

////////////////////////////////////////// Building a Better Constructor

function constructor(init) {
  var that = other_constructor(init),
    member,
    method = function () {
      // init, member, method
    };
  that.method = method;
  return that;
}

// next pattern

function constructor(spec) {
  let { member } = spec;
  const { other } = other_constructor(spec);
  const method = function () {
    //spec, member, other, method
  };
  return Object.freeze({
    method,
    other,
  });
}

////////////////////////////////////////// Function Challenge 11

// the goal is to protect the array

function vector() {
  var array = [];

  return {
    get: function get(i) {
      return array[i];
    },
    store: function store(i, v) {
      array[i] = v;
    },
    append: function append(v) {
      array.push(v);
    },
  };
}

// let myvector = vector();
// console.log(myvector.append(7));
// console.log(myvector.store(1, 8));
// console.log(myvector.get(0)); // 7
// console.log(myvector.get(1)); // 8

// var stash;
// myvector.store('push', function () {
//   stash = this;
//   console.log(__pho);
// });
// myvector.append();

function vector() {
  var array = [];

  return {
    get: function get(i) {
      return array[+i];
    },
    store: function store(i, v) {
      array[+i] = v;
    },
    append: function append(v) {
      array[array.length] = v;
    },
  };
}

let myvector = vector();
myvector.append(7);
myvector.append(9);
myvector.store(1, 8);
myvector.store(4, 23);
myvector.append(5);
console.log(myvector.get(0)); // 7
console.log(myvector.get(1)); // 8
console.log(myvector.get(2)); // undefined
console.log(myvector.get(3)); // undefined
console.log(myvector.get(4)); // 5
console.log(myvector.get(5)); // 23

////////////////////////////////////////// Function Challenge 12
function pubsub() {
  var subscribers = [];
  return {
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      var i,
        length = subscribers.length;
      for (i = 0; i < length; i += 1) {
        subscribers[i](publication);
      }
    },
  };
}

let my_pubsub = pubsub();
console.log(my_pubsub.subscribe(log));
console.log(my_pubsub.publish('It works!')); // It works

// Securing the pubsub() Function

function pubsub() {
  var subscribers = [];
  return {
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      var i,
        length = subscribers.length;
      subscribers.forEach(function (s) {
        try {
          subscribers[i](publication);
        } catch (ignore) {}
      });
    },
  };
}
