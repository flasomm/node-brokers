const path = require("path");

module.exports = async function (plop) {
    plop.setPlopfilePath(__dirname);
    plop.load(path.join(__dirname, 'actions-brokers-generator.js'));
    const actionsBrokers = plop.getGenerator('actions-brokers');
    const results = await actionsBrokers.runActions();
    console.log(results);
};