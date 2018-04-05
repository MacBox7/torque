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
    bool isRegulatable;
    string name
  }

  mapping(address => Device) public devices;
  address[] public deviceIndex;

  event LogNewDevice(address indexed _deviceAddress,
                     uint _index, bool _status,
                     bool _isRegulatable,string _name);
  event LogDeviceUpdate(address indexed _deviceAddress,
                        uint _index, bool status);
  event LogDeviceOn(address indexed _deviceAddress, uint _index);
  event LogDeviceOff(address indexed _deviceAddress, uint _index);
  event LogDeleteDevice(address indexed _deviceAddress, uint _index);
  event regulateDevice(address indexed _deviceAddress,uint _regulationValue);

  /**
   * @dev Checks if device is part of home network
   */
  function isDevice(address _deviceAddress)
  public
  constant
  returns(bool _isIndeed)
  {
    if(deviceIndex.length == 0) return false;
    return (deviceIndex[devices[_deviceAddress].index] == _deviceAddress);
  }

  /**
   * @dev Adds device to home network
   */
  function addDevice(address _deviceAddress, bool _status,
                     bool _isRegulatable,string _name)
  public
  onlyOwner
  returns(uint _index)
  {
    require(!isDevice(_deviceAddress));
    devices[_deviceAddress].status = false;
    devices[_deviceAddress].index = deviceIndex.push(_deviceAddress) - 1;
    devices[_deviceAddress].name = _name;
    devices[_deviceAddress].isRegulatable = _isRegulatable;
    emit LogNewDevice(_deviceAddress, devices[_deviceAddress].index, _status
                      ,_isRegulatable,_name);
    return deviceIndex.length - 1;
  }

  /**
   * @dev Removes device from the home network
   */
  function deleteDevice(address _deviceAddress)
  public
  onlyOwner
  returns(uint _index)
  {
    require(isDevice(_deviceAddress));
    uint rowToDelete = devices[_deviceAddress].index;
    address keyToMove = deviceIndex[deviceIndex.length - 1];
    deviceIndex[rowToDelete] = keyToMove;
    devices[keyToMove].index = rowToDelete;
    deviceIndex.length--;
    emit LogDeleteDevice(
        _deviceAddress,
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
  function getDevice(address _deviceAddress)
  public
  constant
  returns(uint _index, bool _status,bool _isRegulatable,string _name)
  {
    require(isDevice(_deviceAddress));
    return(
      devices[_deviceAddress].index,
      devices[_deviceAddress].status,
      devices[_deviceAddress].isRegulatable,
      devices[_deviceAddress].name);

  }

  /**
   * @dev Turn on device
   */
  function turnOnDevice(address _deviceAddress)
  public
  onlyOwner
  returns(bool _success)
  {
    require(isDevice(_deviceAddress));
    devices[_deviceAddress].status = true;
    emit LogDeviceOn(
      _deviceAddress,
      devices[_deviceAddress].index);
    return true;
  }

  /**
   * @dev Turn off device
   */
  function turnOffDevice(address _deviceAddress)
  public
  onlyOwner
  returns(bool _success)
  {
    require(isDevice(_deviceAddress));
    devices[_deviceAddress].status = false;
    emit LogDeviceOff(
      _deviceAddress,
      devices[_deviceAddress].index);
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
  returns(address _deviceAddress)
  {
    return deviceIndex[_index];
  }
  /**
   * @dev Checks if device is regulatbable
   */
  function isDeviceRegulatable(address _deviceAddress)
  public
  constant
  returns(bool _isIndeed)
  {
    if(!isDevice(_deviceAddress)) return false;
    return ((deviceIndex[devices[_deviceAddress].index] == _deviceAddress)&&
            (devices[_deviceAddress].isRegulatable == true ));
  }

  /**
   * @dev Regulate device
   */
  function regulateDevice(address _deviceAddress,uint _regulationValue)
  public
  onlyOwner
  returns(bool _success)
  {
    require(isDeviceRegulatable(_deviceAddress) &&
           (_regulationValue>0&&_regulationValue<11));
    emit LogDeviceOn(
      _deviceAddress,
      _regulationValue);
    return true;
  }

}
