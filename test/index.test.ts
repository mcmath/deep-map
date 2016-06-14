import deepMap = require("..");

let obj = {
  one: "un",
  two: 2,
  three: [
    {name: "Babar", id: 1}
  ]
};

let mapped1: typeof obj = deepMap(obj, (value, key) => {
  if (typeof key === "string") {
    return key.split("");
  } else {
    return key.toFixed(1);
  }
});

let mapped2: typeof obj = deepMap(obj, value => value, {
  thisArg: "four"
});

let mapped3: typeof obj = deepMap(obj, value => value, {
  inPlace: true
});
