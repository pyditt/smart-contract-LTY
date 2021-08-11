import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SetWrapper } from '../typechain';

describe('Set', () => {
  let alice: string, bob: string, charlie: string;
  before(async () => {
    [alice, bob, charlie] = (await ethers.getSigners()).map(account => account.address);
  });

  let set: SetWrapper;
  beforeEach(async () => {
    set = await (await ethers.getContractFactory('SetWrapper')).deploy();
  });

  it('should be empty', async () => {
    expect(await set.values()).to.deep.eq([]);
  });

  it('should add an item', async () => {
    await set.add(alice);
    expect(await set.lastAction()).to.eq(true);
    expect(await set.values()).to.deep.eq([alice]);
  });

  it('should not re-add the same item', async () => {
    await set.add(alice);
    await set.add(alice);
    expect(await set.lastAction()).to.eq(false);
    expect(await set.values()).to.deep.eq([alice]);
  });

  it('should add a few items', async () => {
    await set.add(alice);
    await set.add(bob);
    await set.add(charlie);
    expect(await set.values()).to.deep.eq([alice, bob, charlie]);
  });

  it('should remove an item', async () => {
    await set.add(alice);
    await set.add(bob);
    await set.add(charlie);

    await set.remove(bob);
    expect(await set.lastAction()).to.eq(true);
    expect(await set.values()).to.deep.eq([alice, charlie]);
  });


  it('should not remove non-existing item', async () => {
    await set.remove(alice);
    expect(await set.lastAction()).to.eq(false);
  });

  it('should check if an item exists', async () => {
    await set.add(alice);
    await set.add(charlie);
    expect(await set.has(alice)).to.eq(true);
    expect(await set.has(charlie)).to.eq(true);
    expect(await set.has(bob)).to.eq(false);
  });
});
