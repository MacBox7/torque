pragma solidity ^0.4.6;

import './DeviceStateManager.sol';

/**
 * @title PublicDeviceStateManager
 * @dev Manages devices connected to home network
 */
contract PublicDeviceStateManager is DeviceStateManager {

  //the address of the homemember contract
  address homeMemberContractAddress;

  event RequestDeviceStateChange(address indexed _deviceAddress,
                                 bool _changedStatus);
  event RequestDeviceRegulation(address indexed _deviceAddress,
                                uint _regulationValue);

  function PublicDeviceStateManager(address _homeMemberContractAddress)
   public
   {
      homeMemberContractAddress = _homeMemberContractAddress;
   }

  /**
   * @dev Throws if called by any account other than the home member.
   */
  modifier onlyHomeMember() {
  require(homeMemberContractAddress
         .call(bytes4(keccak256("isAuthorisedUser(address)")),
               msg.sender));
    _;
  }

  /**
   * @dev Change device state
   */
  function  requestDeviceStateChange(address _deviceAddress
                                     bool _changedStatus)
  onlyHomeMember
  public
  returns(bool _success)
  {
    require(isDevice(_deviceAddress));
    devices[_deviceAddress].status = _changedStatus;
    emit RequestDeviceStateChange(
      _deviceAddress,
      _changedStatus);
    return true;
  }
  /**
   * @dev Regulate Device Speed
   */
  function  requestDeviceRegulation(address _deviceAddress,
                                    uint _regulationValue)
  onlyHomeMember
  public
  returns(bool _success)
  {
    require(isDeviceRegulatable(_deviceAddress) &&
           (_regulationValue>0&&_regulationValue<11));
    emit RequestDeviceRegulation(
      _deviceAddress,
      _regulationValue);
    return true;
  }
}
