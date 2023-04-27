function define(obj) {
    return new Function(` return ${obj} = "${obj}"; `)();
}

module.exports = { define };
