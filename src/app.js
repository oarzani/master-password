const { writeSecrets } = require("./models/secret");
const { readSecrets } = require("./models/secret");

/* commands 
set {key} {value}
unset {key}
get {key}
*/

// const firstArgument = parseInt(process.argv[2]);
// const secondArgument = parseInt(process.argv[3]);

// function add(a, b) {
//   return a + b;
// }
// function sub(a, b) {
//   return a - b;
// }

// const addResult = add(firstArgument, secondArgument);
// console.log(`Add Result ${addResult}`);
// const subResult = sub(firstArgument, secondArgument);
// console.log(`Sub Result ${subResult}`);

//Längere Variante
// const userArgv = process.argv.slice(2);
// const action = userArgv[0];
// const key = userArgv[1];
// const value = userArgv[2];

//Kürzere Variante:
// const [action, key, value] = process.argv.slice(2);

const userArgv = process.argv.slice(2);
const [action, key, value] = userArgv;

console.log(action, key, value);

function set(key, value) {
  const secrets = readSecrets();
  secrets[key] = value;

  writeSecrets(secrets);
}

function unset(key) {
  const secrets = readSecrets();
  delete secrets[key];
  writeSecrets(secrets);
}

function get(key) {
  const secrets = readSecrets();

  const secret = secrets[key];
  console.log(secret);
}

// set(key, value);
//call the correct funktion base on action
// //Soluzion 1
// switch (action) {
//   case "get":
//     get(key);
//     break;
//   case "set":
//     set(key, value);
//     break;
//   case "unset":
//     unset(key);
//     break;
//   default:
//     throw new Error("unknown action");
// }

// solution 2:
// function perform() {
//   if (action === "set") {
//     set(key, value);
//   } else if (action === "unset") {
//     unset(key);
//   } else if (action === "get") {
//     get(key);
//   } else {
//     throw new Error("unknown action");
//   }
// }
// perform();

// solution 3:
const commands = {
  set: set,
  get: get,
  unset: unset
};

const command = commands[action];
if (!command) {
  throw new Error("unknown action");
}
command(key, value);
