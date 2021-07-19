import { HttpProvider } from 'web3-core';

export async function blockchainTimeTravel(cb: (travel: (offset: number) => Promise<void>) => Promise<void>) {
  function advanceBlockAtTime(time: number) {
    return new Promise<void>((resolve, reject) => {
      (web3.currentProvider as HttpProvider).send(
        {
          jsonrpc: "2.0",
          method: "evm_mine",
          params: [time],
          id: new Date().getTime(),
        },
        (err, _) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    });
  }

  let time = Math.floor(Date.now() / 1000);
  await cb(async offset => {
    time += offset;
    await advanceBlockAtTime(time);
  });
  // Reset time
  await advanceBlockAtTime(Math.floor(Date.now() / 1000));
}
