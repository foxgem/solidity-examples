# Solidity例子

记录学习Solidity过程中所写的例子程序，工程本身用truffle创建，每个例子均有相对应的测试代码，使用下面的命令运行测试：
1. 启动ganache-cli
1. truffle test

## 例子

- Vote：简单投票合约
- ContractWithLib：合约和Lib配合的例子，包括：
  - 利用“using A for B”，扩展基本类型的能力

## 实践总结

- 使用bytes32替代string，因为更省gas，相应的在调用时，使用下面代码编解码：
  - 调用时：web3.utils.utf8ToHex(string)
  - 获取返回值：web3.utils.hexToUtf8(bytes32)

## 参考链接

- [相当不错的Solidity教程](https://www.bitdegree.org/learn/solidity-introduction)
