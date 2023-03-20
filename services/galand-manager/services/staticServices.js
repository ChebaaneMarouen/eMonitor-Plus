exports.randomName = randomName;
exports.getExtension = getExtension;

function randomName() {
  return (
    Math.random()
        .toString(16)
        .slice(2) +
    Math.random()
        .toString(16)
        .slice(2)
  );
}

function getExtension(file) {
  return '.' + file.filename.split('.').pop();
}
