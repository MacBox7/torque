pragma solidity ^0.4.21;

import './Ownable.sol';

/**
 * @title HomeMember
 * @dev Manages members of a smart home
 */
contract HomeMember is Ownable {

  struct Member {
      string name;
      uint index;
  }

  mapping(address => Member) public members;
  address[] public memberIndex;

  event LogNewMember(address indexed _memberAddress,
                     uint _index, string _name);
  event LogMemberUpdate(address indexed _memberAddress,
                        uint _index, string _name);
  event LogDeleteMember(address indexed _memberAddress, uint _index);
  
  /**
   * @dev Throws if called by any account other than the home member.
   */
  modifier onlyHomeMember() {
    require(isMember(msg.sender));
    _;
  }

  /**
   * @dev Checks if member is part of home network
   */
  function isMember(address _memberAddress)
  public
  constant
  returns(bool _isIndeed)
  {
    if(memberIndex.length == 0) return false;
    return (memberIndex[members[_memberAddress].index] == _memberAddress);
  }

  /**
   * @dev Adds member to home network
   */
  function addMember(address _memberAddress, string _name)
  public
  onlyOwner
  returns(uint _index)
  {
    require(!isMember(_memberAddress));
    members[_memberAddress].index = memberIndex.push(_memberAddress) - 1;
    members[_memberAddress].name = _name;
    emit LogNewMember(_memberAddress, members[_memberAddress].index ,
                      _name);
    return memberIndex.length - 1;
  }

  /**
   * @dev Removes member from the home network
   */
  function deleteMember(address _memberAddress)
  public
  onlyOwner
  returns(uint _index)
  {
    require(isMember(_memberAddress));
    uint rowToDelete = members[_memberAddress].index;
    address keyToMove = memberIndex[memberIndex.length - 1];
    memberIndex[rowToDelete] = keyToMove;
    members[keyToMove].index = rowToDelete;
    memberIndex.length--;
    emit LogDeleteMember(
        _memberAddress,
        rowToDelete);
    emit LogMemberUpdate(
        keyToMove,
        rowToDelete,
        members[keyToMove].name);
    return rowToDelete;
  }

  /**
   * @dev Gets member info provied the member address
   */
  function getMember(address _memberAddress)
  public
  constant
  returns(uint _index, string _name)
  {
    require(isMember(_memberAddress));
    return(
      members[_memberAddress].index,
      members[_memberAddress].name);

  }

  /**
   * @dev Get count of members connected to home network
   */
  function getMemberCount()
  public
  constant
  returns(uint _count)
  {
    return memberIndex.length;
  }
  
  /**
   * @dev Get member information provided the member index
   */
  function getMemberAtIndex(uint _index)
  public
  constant
  returns(address _memberAddress)
  {
    return memberIndex[_index];
  }

}