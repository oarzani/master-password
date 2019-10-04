const { readSecrets, writeSecrets } = require("./secret");
const crypto = require("crypto");
const { getCollection } = require("./database");
//siehe Beispiel Ressources

async function set(password, key, value) {
  const secretsCollection = await getCollection("secrets");

  // Updated or insert secfet

  const cryptoKey = crypto.createCipher("aes-128-cbc", password);
  let encryptedValue = cryptoKey.update(value, "utf8", "hex");
  encryptedValue += cryptoKey.final("hex");
  await secretsCollection.insertOne({ key, value: encryptedValue });
  // const secrets = readSecrets();
  // secrets[key] = encryptedValue;
  // writeSecrets(secrets);
}

async function unset(password, key) {
  const secretsCollection = await getCollection("secrets");
  await secretsCollection.deleteOne({ key });

  // Delete secret
  // const secrets = readSecrets();
  // delete secrets[key];
  // writeSecrets(secrets);
}

async function get(password, key) {
  const secretsCollection = await getCollection("secrets");
  //Find secrets
  const secret = await secretsCollection.findOne({ key });

  const secrets = await readSecrets();
  const secret = secrets[key];

  const cryptoKey = crypto.createDecipher("aes-128-cbc", password);
  let decryptedSecret = cryptoKey.update(secret, "hex", "utf8");
  decryptedSecret += cryptoKey.final("utf8");

  return decryptedSecret;
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
  return command(password, key, value);
};

exports.set = set;
exports.unset = unset;
exports.get = get;
