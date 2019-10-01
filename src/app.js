const { executeCommand } = require("./lib/commands");
const readline = require("readline");
const crypto = require("crypto");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const fs = require("fs");

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

// console.log(action, key, value);

// function set(key, value) {
//   const secrets = readSecrets();
//   secrets[key] = value;

//   writeSecrets(secrets);
// }

// function unset(key) {
//   const secrets = readSecrets();
//   delete secrets[key];
//   writeSecrets(secrets);
// }

// function get(key) {
//   const secrets = readSecrets();

//   const secret = secrets[key];
//   console.log(secret);
// }

// // set(key, value);
// //call the correct funktion base on action
// // //Soluzion 1
// // switch (action) {
// //   case "get":
// //     get(key);
// //     break;
// //   case "set":
// //     set(key, value);
// //     break;
// //   case "unset":
// //     unset(key);
// //     break;
// //   default:
// //     throw new Error("unknown action");
// // }

// // solution 2:
// // function perform() {
// //   if (action === "set") {
// //     set(key, value);
// //   } else if (action === "unset") {
// //     unset(key);
// //   } else if (action === "get") {
// //     get(key);
// //   } else {
// //     throw new Error("unknown action");
// //   }
// // }
// // perform();

// // solution 3:

// const commands = {
//   set: set,
//   get: get,
//   unset: unset
// };
// function executeCommand(action) {
//   const command = commands[action];
//   if (!command) {
//     throw new Error("unknown action");
//   }
//   command(key, value);
// }
const fileName = ".password";
const masterPasswordHash = fs.readFileSync(fileName, "utf-8");
("696b1eaf04369604657016c039ecf829$11826216c0ae28249bf1d45d6faf1e79ba9be4fc80ea7ca8e5fa0a41a6889015"); //Hash aus der createHash.js generiert
rl.question("What is the master-password? ", password => {
  rl.output.write("\n");
  if (verifyHash(password, masterPasswordHash)) {
    executeCommand(password, action, key, value);
  } else {
    console.log("invalid password");
  }
  rl.close();
});

// Override default output to hide password
rl._writeToOutput = function _writeToOutput() {
  rl.output.write("*");
};

// Checking the password hash
function verifyHash(password, original) {
  const originalHash = original.split("$")[1];
  const salt = original.split("$")[0];
  const hash = crypto
    .pbkdf2Sync(password, salt, 2048, 32, "sha512")
    .toString("hex");

  return hash === originalHash;
}
