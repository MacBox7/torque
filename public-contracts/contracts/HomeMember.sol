pragma solidity ^0.4.18;


import "./Ownable.sol";

/**
 * @title HomeMember
 * @dev The HomeMember contract has home members addresses,
 * and provides basic authorization control functions.
 */
contract HomeMember is Ownable  {
  mapping (address => bool) homeMember;
  
  event MemberAdded(address indexed whitelistedMember);
  event MemberRemoved(address indexed blacklistedMember);
  
  
  /**
   * @dev Add a new home member
   */
  function HomeMember() public {
    homeMember[msg.sender] = true;
  }
  
  /**
   * @dev Throws if called by any account other than the home member.
   */
  modifier onlyHomeMember() {
    require(homeMember[msg.sender]);
    _;
  }
  
  /**
   * @dev Add a new home member
   */
  function addHomeMember(address _target) onlyOwner public {
    homeMember[_target] = true;
    MemberAdded(_target);
  }
  
  /**
   * @dev Unauthrorize an already existing home member
   */
  function removeHomeMember(address _target) onlyOwner public {
    assert(homeMember[_target]);
    delete(homeMember[_target]);
    MemberRemoved(_target);
  }

}