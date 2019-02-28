const Vote = artifacts.require("Vote");

contract('Vote测试用例', async (accounts) => {
    describe('投票创建', () => {
        before(async () => {
            this.instance = await Vote.new();
        })

        it('能够创建投票', async () => {
            let result = await this.instance.createBallot(web3.utils.utf8ToHex('ballot1'), [
                web3.utils.utf8ToHex('item1'),
                web3.utils.utf8ToHex('item2'),
                web3.utils.utf8ToHex('item3')
            ]);

            assert.equal(result.logs.length, 1);
            assert.equal(result.logs[0].event, 'Ballot_Created');
            assert.equal(result.logs[0].args.account, accounts[0]);
            assert.equal(web3.utils.hexToUtf8(result.logs[0].args.name), 'ballot1');
        })

        it('不能重复创建同名的投票', async () => {
            let result;
            try {
                result = await this.instance.createBallot(web3.utils.utf8ToHex('ballot1'), []);
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'BALLOT_EXISTING');
                assert.isUndefined(result);
                return;
            }
        })
    })

    describe('投票关闭', () => {
        before(async () => {
            this.instance = await Vote.new();
            await this.instance.createBallot(web3.utils.utf8ToHex('ballot1'), [
                web3.utils.utf8ToHex('item1'),
                web3.utils.utf8ToHex('item2'),
                web3.utils.utf8ToHex('item3')
            ]);
        })

        it('非投票Owner不能关闭投票', async () => {
            let result;
            try {
                result = await this.instance.closeBallot(web3.utils.utf8ToHex('ballot1'), {
                    from: accounts[1]
                });
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'NOT_PERMMITTED');
                assert.isUndefined(result);
                return;
            }
        })

        it('只有投票的Owner才能够关闭投票', async () => {
            let result = await this.instance.closeBallot(web3.utils.utf8ToHex('ballot1'));

            assert.equal(result.logs.length, 1);
            assert.equal(result.logs[0].event, 'Ballot_Closed');
            assert.equal(result.logs[0].args.account, accounts[0]);
            assert.equal(web3.utils.hexToUtf8(result.logs[0].args.name), 'ballot1');
        })

        it('不能重复关闭同名的投票', async () => {
            let result;
            try {
                result = await this.instance.closeBallot(web3.utils.utf8ToHex('ballot1'));
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'BALLOT_ALREADY_CLOSED');
                assert.isUndefined(result);
                return;
            }
        })

        it('不能重复关闭不存在的投票', async () => {
            let result;
            try {
                result = await this.instance.closeBallot(web3.utils.utf8ToHex('ballot_not_found'));
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'BALLOT_NOT_FOUND');
                assert.isUndefined(result);
                return;
            }
        })

        it('不能投票给已关闭投票', async () => {
            let result;
            try {
                result = await this.instance.vote(web3.utils.utf8ToHex('ballot1'), [], {
                    from: accounts[1]
                });
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'BALLOT_ALREADY_CLOSED');
                assert.isUndefined(result);
                return;
            }
        })
    })

    describe('投票操作', () => {
        before(async () => {
            this.instance = await Vote.new();
            await this.instance.createBallot(web3.utils.utf8ToHex('ballot1'), [
                web3.utils.utf8ToHex('item1'),
                web3.utils.utf8ToHex('item2'),
                web3.utils.utf8ToHex('item3')
            ]);
        })

        it('不能对不存在的投票进行投票', async () => {
            let result;
            try {
                result = await this.instance.vote(web3.utils.utf8ToHex('ballot_not_found'), []);
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'BALLOT_NOT_FOUND');
                assert.isUndefined(result);
                return;
            }
        })

        it('投票Owner不允许自己投票', async () => {
            let result;
            try {
                result = await this.instance.vote(web3.utils.utf8ToHex('ballot1'), []);
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'INVALID_VOTER');
                assert.isUndefined(result);
                return;
            }
        })

        it('投票人投票时必须转账', async () => {
            let result;
            try {
                result = await this.instance.vote(web3.utils.utf8ToHex('ballot1'), [], {
                    from: accounts[1],
                    value: 0
                });
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'INVALID_VAULE');
                assert.isUndefined(result);
                return;
            }
        })

        it('投票人必须投票给有效的选项', async () => {
            let result;
            try {
                result = await this.instance.vote(web3.utils.utf8ToHex('ballot1'), web3.utils.utf8ToHex('item_invalid'), {
                    from: accounts[1],
                    value: 1
                });
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'INVALID_CHOICE');
                assert.isUndefined(result);
                return;
            }
        })

        it('投票人能够投票，并且投票金额将退回', async () => {
            let oldBalance = await web3.eth.getBalance(accounts[1]);
            let result = await this.instance.vote(web3.utils.utf8ToHex('ballot1'), web3.utils.utf8ToHex('item1'), {
                from: accounts[1],
                value: 10000000000000000000
            });
            let newBalance = await web3.eth.getBalance(accounts[1]);

            assert.equal(result.logs.length, 1);
            assert.equal(result.logs[0].event, 'Ballot_Voted');
            assert.equal(result.logs[0].args.account, accounts[1]);
            assert.equal(web3.utils.hexToUtf8(result.logs[0].args.name), 'ballot1');
            assert.equal(web3.utils.hexToUtf8(result.logs[0].args.choice), 'item1');
            assert(oldBalance - newBalance < 10000000000000000000);
        })

        it('同一用户不能重复投票', async () => {
            let result;
            try {
                result = await this.instance.vote(web3.utils.utf8ToHex('ballot1'), web3.utils.utf8ToHex('item1'), {
                    from: accounts[1],
                    value: 1
                });
                assert.fail('不应该在这里!');
            } catch (error) {
                assert.equal(error.reason, 'ALREADY_VOTED');
                assert.isUndefined(result);
                return;
            }
        })
    })
})