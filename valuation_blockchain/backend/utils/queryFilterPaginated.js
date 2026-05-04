const { TRANSFER_SCAN_BLOCK_RANGE } = require('../config');

async function queryFilterPaginated(contract, filter, fromBlock, toBlock, maxBlockRange = TRANSFER_SCAN_BLOCK_RANGE) {
    let allEvents = [];
    let currentBlock = fromBlock;
    const latestBlockNumber =
        toBlock === 'latest' ? await contract.runner.provider.getBlockNumber() : toBlock;

    while (currentBlock <= latestBlockNumber) {
        const endBlock = Math.min(currentBlock + maxBlockRange - 1, latestBlockNumber);
        try {
            const events = await contract.queryFilter(filter, currentBlock, endBlock);
            allEvents = allEvents.concat(events);
        } catch (err) {
            console.warn(`⚠️  Error querying blocks ${currentBlock}-${endBlock}: ${err.message}`);
        }
        currentBlock = endBlock + 1;
    }

    return allEvents;
}

module.exports = {
    queryFilterPaginated,
};
