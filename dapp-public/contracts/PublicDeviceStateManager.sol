pragma solidity ^0.4.6;

import './Ownable.sol';

/**
 * @title DeviceStateManager
 * @dev Manages devices connected to home network 
 */
contract DeviceStateManager is Ownable {

  struct Device {
    bool status;
    uint index;
  }
  
  mapping(address => Device) private devices;
  address[] private deviceIndex;

  event LogNewDevice(address indexed _ledAddress, uint _index, bool _status);
  event LogDeviceUpdate(address indexed _ledAddress, uint _index, bool status);
  event LogDeviceOn(address indexed _ledAddress, uint _index);
  event LogDeviceOff(address indexed _ledAddress, uint _index);
  event LogDeleteDevice(address indexed _ledAddress, uint _index);
  
  /**
   * @dev Checks if device is part of home network 
   */
  function isDevice(address _ledAddress) 
  public 
  constant 
  returns(bool _isIndeed)
  {
    if(deviceIndex.length == 0) return false;
    return (deviceIndex[devices[_ledAddress].index] == _ledAddress);
  }
  
  /**
   * @dev Adds device to home network
   */
  function addDevice(address _ledAddress, bool _status) 
  public 
  onlyOwner 
  returns(uint _index)
  {
    require(!isDevice(_ledAddress));
    devices[_ledAddress].status = false;
    devices[_ledAddress].index = deviceIndex.push(_ledAddress) - 1;
    emit LogNewDevice(_ledAddress, devices[_ledAddress].index, _status);
    return deviceIndex.length - 1;
  }
  
  /**
   * @dev Removes device from the home network
   */
  function deleteDevice(address _ledAddress)
  public
  onlyOwner
  returns(uint _index)
  {
    require(!isDevice(_ledAddress)); 
    uint rowToDelete = devices[_ledAddress].index;
    address keyToMove = deviceIndex[deviceIndex.length - 1];
    deviceIndex[rowToDelete] = keyToMove;
    devices[keyToMove].index = rowToDelete; 
    deviceIndex.length--;
    emit LogDeleteDevice(
        _ledAddress, 
        rowToDelete);
    emit LogDeviceUpdate(
        keyToMove, 
        rowToDelete, 
        devices[keyToMove].status);
    return rowToDelete;
  }
  
  /**
   * @dev Gets device info provied the device address
   */
  function getDevice(address _ledAddress)
  public
  constant
  returns(uint _index, bool _status)
  {
    require(!isDevice(_ledAddress));
    return(
      devices[_ledAddress].index, 
      devices[_ledAddress].status);
    
  } 
  
  /**
   * @dev Turn on device
   */
  function turnOnDevice(address _ledAddress)
  public
  onlyOwner
  returns(bool _success)
  {
    require(!isDevice(_ledAddress));
    devices[_ledAddress].status = true;
    emit LogDeviceOn(
      _ledAddress, 
      devices[_ledAddress].index);
    return true;
  }
  
  /**
   * @dev Turn off device
   */
  function turnOffDevice(address _ledAddress)
  public
  onlyOwner
  returns(bool _success)
  {
    require(!isDevice(_ledAddress));
    devices[_ledAddress].status = false;
    emit LogDeviceOff(
      _ledAddress, 
      devices[_ledAddress].index);
    return true;
  }
  
  /**
   * @dev Get count of devices connected to home network
   */
  function getDeviceCount()
  public
  constant
  returns(uint _count)
  {
    return deviceIndex.length;
  }
  
  /**
   * @dev Get device information provided the device index
   */
  function getDeviceAtIndex(uint _index)
  public
  constant
  returns(address _ledAddress)
  {
    return deviceIndex[_index];
  }

}