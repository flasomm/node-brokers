import {IBApi, EventName} from "@stoqey/ib";

const ib = new IBApi({
    // clientId: 0,
    // host: '127.0.0.1',
    port: 4001,
});

function Position(id, symbol, size, avgCost, currency) {
    this.id = id;
    this.symbol = symbol;
    this.size = size;
    this.avgCost = avgCost;
    this.currency = currency;
}


let positionsCount = 0;
const positions = [];

ib.on(EventName.error, (err, code, reqId) => {
    console.error(`${err.message} - code: ${code} - reqId: ${reqId}`);
}).on(
    EventName.position,
    (account, contract, pos, avgCost) => {
        positions.push(new Position(contract.conId, contract.symbol, pos, avgCost, contract.currency));
        positionsCount++;
    }).once(EventName.positionEnd, () => {
    console.table(positions);
    console.log(`Total: ${positionsCount} positions.`);
    ib.disconnect();
});

export const getPositions = () => {
    ib.connect();
    ib.reqPositions();
}
