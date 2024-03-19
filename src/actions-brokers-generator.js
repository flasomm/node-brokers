module.exports = function (plop) {
    plop.setGenerator('actions-brokers', {
        description: 'List or Close positions from a list of Brokers',
        prompts: [
            {
                type: 'list',
                name: 'broker',
                message: 'Select Broker',
                choices: ['Degiro', 'Ibkr', 'Kraken', 'Binance'],
            },
            {
                type: 'list',
                name: 'action',
                message: 'Select Action',
                choices: ['List Positions', 'Close Position', 'CloseAll'],
            },
        ],
        actions: (answers) => {
            const actions = [];

            if (answers?.action === 'List Positions') {
                actions.push({
                    type: 'listBrokerPositions',
                });
            }
            if (answers?.action === 'Close Position') {
                actions.push({
                    type: 'listBrokerPositions',
                });
            }
            if (answers?.action === 'CloseAll') {
                actions.push({
                    type: 'listBrokerPositions',
                });
            }
            return actions;
        }
    });
    plop.setActionType('listBrokerPositions', async (answers) => {
        console.log("answers", answers);
        return true;
    });
};
