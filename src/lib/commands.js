const { readSecrets, writeSecrets } = require("./secret");
const crypto = require("crypto");

//siehe Beispiel Ressources
function set(password, key, value) {
  const cryptoKey = crypto.createCipher("aes-128-cbc", password);
  let encryptedValue = cryptoKey.update(value, "utf8", "hex");
  encryptedValue += cryptoKey.final("hex");

  const secrets = readSecrets();
  secrets[key] = encryptedValue;
  writeSecrets(secrets);
}

function unset(password, key) {
  const secrets = readSecrets();
  delete secrets[key];
  writeSecrets(secrets);
}

function get(password, key) {
  const secrets = readSecrets();
  const secret = secrets[key];

  const cryptoKey = crypto.createDecipher("aes-128-cbc", password);
  let decryptedSecret = cryptoKey.update(secret, "hex", "utf8");
  decryptedSecret += cryptoKey.final("utf8");

  console.log(decryptedSecret);
}

const commands = {
  set,
  get,
  unset
};

exports.executeCommand = function executeCommand(password, action, key, value) {
  const command = commands[action];
  if (!command) {
    throw new Error("unknown action");
  }
  command(password, key, value);
};
