const fs = require("fs");

const fileName = "secrets.json";

function readSecrets() {
  try {
    const secretsJSON = fs.readFileSync(fileName, "utf-8");
    const secrets = JSON.parse(secretsJSON);

    return secrets;
  } catch (error) {
    writeSecrets({});
    return {};
  }
}

function writeSecrets(secrets) {
  fs.writeFileSync(fileName, JSON.stringify(secrets));
}

// fs.writeFileSync('../data/phraseFreqs.json', JSON.stringify(output))

exports.readSecrets = readSecrets;
exports.writeSecrets = writeSecrets;
