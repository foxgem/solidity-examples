pragma solidity >=0.4.22 <0.6.0;

// 投票合约：
// - 任何人都可以发起提案
// - 发起者可以随时关闭提案
// - 任何人都可以针对提案投票，投票时需要发送一定量的ETH
// - 合约在接受到投票后，将接收到的ETH返还给投票者
// - 对于同一提案，不允许重复投票
contract Vote {

  struct Ballot {
    bytes32 name;
    address owner;
    bytes32[] choices;
    bool closed;
    mapping(address => bool) voteHistory;
    mapping(bytes32 => bool) validaChoices;
    mapping(bytes32 => uint) result;
  }

  mapping(bytes32 => Ballot) history;
  mapping(bytes32 => bool) existing;

  event Ballot_Created(address account, bytes32 name);
  event Ballot_Closed(address account, bytes32 name);
  event Ballot_Voted(address account, bytes32 name, bytes32 choice);

  constructor() public {
  }

  function createBallot(bytes32 name, bytes32[] memory choices) public {
    require(!existing[name], "BALLOT_EXISTING");
    history[name] = Ballot({name : name, owner : msg.sender, choices: choices, closed : false});
    for(uint i = 0; i < choices.length; i++) {
      history[name].validaChoices[choices[i]] = true;
      history[name].result[choices[i]] = 0;
    }
    existing[name] = true;
    emit Ballot_Created(msg.sender, name);
  }

  function closeBallot(bytes32 name) public {
    require(existing[name], "BALLOT_NOT_FOUND");
    Ballot storage ballot = history[name];
    require(ballot.owner == msg.sender, "NOT_PERMMITTED");
    require(ballot.closed == false, "BALLOT_ALREADY_CLOSED");
    ballot.closed = true;
    emit Ballot_Closed(msg.sender, name);
  }

  function vote(bytes32 name, bytes32 choice) public payable {
    require(existing[name], "BALLOT_NOT_FOUND");
    Ballot storage ballot = history[name];
    require(ballot.owner != msg.sender, "INVALID_VOTER");
    require(!ballot.closed, "BALLOT_ALREADY_CLOSED");
    require(!ballot.voteHistory[msg.sender], "ALREADY_VOTED");
    require(msg.value > 0, "INVALID_VAULE");
    require(ballot.validaChoices[choice], "INVALID_CHOICE");
    ballot.result[choice] = ballot.result[choice] + 1;
    ballot.voteHistory[msg.sender] = true;
    msg.sender.transfer(msg.value);
    emit Ballot_Voted(msg.sender, name, choice);
  }

}
