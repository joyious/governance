const TestToken = artifacts.require('TestToken');
const Voting = artifacts.require('Voting');

module.exports = async function (deployer) {
  // Use deployer to state migration tasks.
  await deployer.deploy(TestToken);

  let now = Math.floor(Date.now());
  await deployer.deploy(Voting, TestToken.address, now - 10, now + 5 * 24 * 3600, 2);
};
