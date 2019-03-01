const ContractWithLib = artifacts.require("ContractWithLib");

contract('合约和Lib的测试场景', async (accounts) => {
    describe('StringUtils使用', () => {
        before(async () => {
            this.instance = await ContractWithLib.new();
        })

        it('compare可以工作', async () => {
            assert(await this.instance.compare(web3.utils.utf8ToHex("test"), web3.utils.utf8ToHex("test")));
            assert(! await this.instance.compare(web3.utils.utf8ToHex("test"), web3.utils.utf8ToHex("test1")));
        })
    })
})