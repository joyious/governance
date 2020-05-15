pragma solidity ^0.5.4;


interface IERC20 {
    function balanceOf(address _owner) external view returns (uint256);
}


contract Voter {
    IERC20 public token;

    uint256 public startTime;
    uint256 public endTime;
    uint256 public optionCount;

    mapping(address => uint256) public voteRecord;
    address[] public addressVoted;

    uint256[] public status;

    constructor(
        address _token,
        uint256 _start,
        uint256 _end,
        uint256 _optionCount
    ) public {
        require(now < _end, "Please input a future end time");

        token = IERC20(_token);
        startTime = _start;
        endTime = _end;
        optionCount = _optionCount;
        status = new uint256[](_optionCount);
    }

    function getLiveStatus() private view returns (uint256[] memory) {
        uint256 length = addressVoted.length;
        uint256 i;

        uint256[] memory result = new uint256[](optionCount);

        for (i = 0; i < length; ++i) {
            address acc = addressVoted[i];
            uint256 option = voteRecord[acc] - 1;
            uint256 weight = token.balanceOf(acc);

            result[option] += weight;
        }

        return result;
    }

    function isAlive() private view returns (bool) {
        return now < endTime;
    }

    function vote(uint256 _option) external {
        require(now > startTime, "Voting has not Started yet");
        require(now < endTime, "Voting has ended");
        require(_option - 1 < optionCount, "Please choose a valid option");
        require(voteRecord[msg.sender] == 0, "You have voted already");
        require(token.balanceOf(msg.sender) != 0, "You have no toke avaliable");

        voteRecord[msg.sender] = _option;
        addressVoted.push(msg.sender);

        status = getLiveStatus();
    }

    function getTotalVote() external view returns (uint256[] memory) {
        require(now > startTime, "Voting has not Started yet");

        if (isAlive()) {
            return getLiveStatus();
        } else {
            return status;
        }
    }
}
