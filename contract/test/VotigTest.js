const TestToken = artifacts.require("TestToken");
const Voting = artifacts.require("Voting");

contract("Voting test", async accounts => {
    let token;
    let voting;

    beforeEach(async () => {
        token = await TestToken.deployed();

        let now = Math.floor(Date.now() / 1000);
        voting = await Voting.new(token.address, now - 100, now + 300, 2);
    });

    it("should put 1000000 TestToken in the first account", async () => {
        let balance = await token.balanceOf.call(accounts[0]);
        assert.equal(balance.toNumber(), 1000000);
    });

    it("should be all 0 for the initial voting status", async () => {
        let s = await voting.getTotalVote();
        assert.equal(s[0].toNumber(), 0);
        assert.equal(s[1].toNumber(), 0);
    });

    it("should be the balance of account after 1 vote", async () => {
        await voting.vote(1, { from: accounts[0] });

        let s = await voting.getTotalVote();
        let balance = await token.balanceOf.call(accounts[0]);

        assert.equal(s[0].toNumber(), balance.toNumber());
        assert.equal(s[1].toNumber(), 0);
    });

    it("should not allow voting for accounts with no token", async () => {
        try {
            await voting.vote(1, { from: accounts[1] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }
    });

    it("should not allow voting before it started", async () => {
        let now = Math.floor(Date.now() / 1000);
        voting.setStartTime(now + 10);
        try {
            await voting.vote(1, { from: accounts[0] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        voting.setStartTime(now - 100);
    });

    it("should not allow voting after it ends", async () => {
        let now = Math.floor(Date.now() / 1000);
        voting.setEndTime(now - 10);
        try {
            await voting.vote(1, { from: accounts[0] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }
        voting.setEndTime(now + 300);
    });
    it("should not allow voting for invalid options", async () => {
        try {
            await voting.vote(0, { from: accounts[0] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        try {
            await voting.vote(3, { from: accounts[0] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }
    });

    it("transfer some test token and check the vote result again", async () => {
        await token.transfer(accounts[1], 20000, { from: accounts[0] });
        await voting.vote(1, { from: accounts[0] });
        await voting.vote(2, { from: accounts[1] });

        await token.transfer(accounts[1], 20000, { from: accounts[0] });

        let s = await voting.getTotalVote();
        let balance0 = await token.balanceOf.call(accounts[0]);
        let balance1 = await token.balanceOf.call(accounts[1]);

        assert.equal(s[0].toNumber(), balance0.toNumber());
        assert.equal(s[1].toNumber(), balance1.toNumber());
    });

    it("Get the vote option", async () => {
        await voting.vote(1, { from: accounts[0] });

        let record = await voting.getVoteRecord(accounts[0]);

        assert.equal(record.toNumber(), 1);
    });

    it("Change the vote option", async () => {
        await voting.vote(1, { from: accounts[0] });

        let s = await voting.getTotalVote();
        let balance0 = await token.balanceOf.call(accounts[0]);

        assert.equal(s[0].toNumber(), balance0.toNumber());
        assert.equal(s[1].toNumber(), 0);

        // Change votes
        await voting.vote(2, { from: accounts[0] });

        s = await voting.getTotalVote();

        assert.equal(s[0].toNumber(), 0);
        assert.equal(s[1].toNumber(), balance0.toNumber());
    });

    it("Wait for the vote to end", async () => {
        await token.transfer(accounts[1], 20000, { from: accounts[0] });
        await token.transfer(accounts[2], 50000, { from: accounts[0] });

        await voting.vote(1, { from: accounts[0] });
        await voting.vote(2, { from: accounts[1] });
        await voting.vote(2, { from: accounts[2] });

        // End the vote
        let now = Math.floor(Date.now() / 1000);
        voting.setEndTime(now - 10);

        let balance0 = await token.balanceOf.call(accounts[0]);
        let balance1 = await token.balanceOf.call(accounts[1]);
        let balance2 = await token.balanceOf.call(accounts[2]);

        // Make some transfer after vote ends
        await token.transfer(accounts[1], 20000, { from: accounts[0] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toNumber(), balance0.toNumber());
        assert.equal(s[1].toNumber(), balance1.toNumber() + balance2.toNumber());
    });


});