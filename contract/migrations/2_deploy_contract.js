const TestToken = artifacts.require('TestToken');
const Voting = artifacts.require('Voting');

module.exports = async function (deployer) {
  // Use deployer to state migration tasks.
  await deployer.deploy(TestToken);

  let token = await TestToken.deployed();
  let now = Math.floor(Date.now());
  let totalSupply = await token.totalSupply();
  await deployer.deploy(Voting, TestToken.address, now - 10, now + 5 * 24 * 3600, 2, totalSupply / 5, totalSupply / 2);
};
