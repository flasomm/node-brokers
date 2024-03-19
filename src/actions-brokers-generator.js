import {closePositions, getPortfolio} from './degiro-actions.js';
import {getPositions} from './ibkr-actions.js';

export default function (plop) {
    plop.setGenerator('actions-brokers', {
        description: 'List or Close positions from a list of Brokers',
        prompts: [
            {
                type: 'list',
                name: 'broker',
                message: 'Select Broker',
                choices: ['Degiro', 'Ibkr'],
            },
            {
                when(context) {
                    return context.broker.includes('Degiro');
                },
                type: 'input',
                name: 'otpCode',
                message: 'Enter OTP code',
            },
            {
                type: 'list',
                name: 'action',
                message: 'Select Action',
                choices: ['List Positions', 'Close All'],
            },
        ],
        actions: (answers) => {
            const actions = [];

            if (answers?.action === 'List Positions') {
                actions.push({
                    type: 'listBrokerPositions',
                });
            }
            if (answers?.action === 'Close All') {
                actions.push({
                    type: 'closeBrokerPositions',
                });
            }
            return actions;
        }
    });

    plop.setActionType('listBrokerPositions', async (answers) => {
        if(answers.broker === 'Degiro') {
            await getPortfolio(answers);
        }
        if(answers.broker === 'Ibkr') {
            await getPositions(answers);
        }
        return true;
    });
    plop.setActionType('closeBrokerPositions', async (answers) => {
        await closePositions(answers);
        return true;
    });
};
