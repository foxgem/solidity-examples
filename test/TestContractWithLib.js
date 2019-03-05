const ContractWithLib = artifacts.require("ContractWithLib");

contract('合约和Lib的测试场景', async (accounts) => {
    describe('StringUtils使用', () => {
        before(async () => {
            this.instance = await ContractWithLib.new();
        })

        it('compare可以工作', async () => {
            assert(await this.instance.compare("test", "test"));
            assert(! await this.instance.compare("test", "test1"));
            assert(! await this.instance.compare("test", "test      "));
        })
    })
})