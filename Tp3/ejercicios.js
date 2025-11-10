//Ejercicio 1

function sumUnique(nums) {
  const uniqueNumbers = new Set();

  for (const item of nums) {
    const num = Number(item);
    
    if (Number.isFinite(num)) {
      uniqueNumbers.add(num);
    }
  }

  let sum = 0;
  for (const num of uniqueNumbers) {
    sum += num;
  }
  
  return sum;
}
//Ejercicio 2
function pick(obj, keys) {
  return keys.reduce((newObj, key) => {
    if (Object.hasOwn(obj, key)) {
      newObj[key] = obj[key];
    }
    return newObj;
  }, {});
}
//Ejercicio 3

function groupBy(list, keyOrFn) {
  const isFunction = typeof keyOrFn === 'function';

  return list.reduce((groups, item) => {
    const key = isFunction ? keyOrFn(item) : item[keyOrFn];

    if (!Object.hasOwn(groups, key)) {
      groups[key] = [];
    }

    groups[key].push(item);

    return groups;
  }, {});
}
//Ejercicio 4
function sortByMany(list, specs) {
  const clonedList = [...list];

  clonedList.sort((a, b) => {
    for (const spec of specs) {
      const { key, dir } = spec;
      const valA = a[key];
      const valB = b[key];
      const direction = (dir === 'desc') ? -1 : 1;

      if (valA > valB) {
        return 1 * direction;
      }
      if (valA < valB) {
        return -1 * direction;
      }
    }
    return 0;
  });

  return clonedList;
}
//Ejercicio 5

function deepEqual(a, b) {
  if (a === b) return true;

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  
  if (a.constructor !== b.constructor) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
  } else {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!Object.hasOwn(b, key) || !deepEqual(a[key], b[key])) {
        return false;
      }
    }
  }

  return true;
}
//Ejercicio 6

function isBalanced(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{',
  };
  const openers = new Set(['(', '[', '{']);

  for (const char of s) {
    if (openers.has(char)) {
      stack.push(char);
    } 
    else if (Object.hasOwn(pairs, char)) {
      if (stack.length === 0) {
        return false;
      }
      
      const lastOpen = stack.pop();
      
      if (lastOpen !== pairs[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}
//Ejercicio 7

function wordFreq(text) {
  const frequencies = new Map();

  const cleanedText = text
    .toLowerCase()
    .replace(/[.,:;!?]/g, '');

  const words = cleanedText
    .split(/\s+/)
    .filter(Boolean);

  for (const word of words) {
    const count = frequencies.get(word) || 0;
    frequencies.set(word, count + 1);
  }

  return frequencies;
}
//Ejercicio 9

function debounce(fn, delay) {
  let timerId = null;

  return function(...args) {
    const context = this;

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn.apply(context, args);
      timerId = null;
    }, delay);
  };
}
//Ejercicio 10A

function withTimeout(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout'));
    }, ms);
  });

  return Promise.race([
    promise,
    timeoutPromise
  ]);
}
//Ejercicio 10B

function allSettledLite(promises) {
  const safePromises = promises.map(promise => {
    return promise
      .then(value => {
        return { status: 'fulfilled', value: value };
      })
      .catch(reason => {
        return { status: 'rejected', reason: reason };
      });
  });

  return Promise.all(safePromises);
}