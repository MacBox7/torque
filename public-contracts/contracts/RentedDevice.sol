pragma solidity ^0.4.18;

contract RentedDevice {
    address public owner;
    address public renter;
    address public device;
    uint public rentalTime;
    uint public returnTime;
    bool public rented;
    uint public rentalPrice;
    uint public minRentalTime;
    uint constant MIN_RENTAL_TIME = 60;
    uint public maxRentalTime;
    uint constant MAX_RENTAL_TIME = 3600;
    bool public available;
    string public nameOfDevice;
    bool public status;
    
    //Events
    
    event Rent(address indexed _renter, uint _rentalTime,
               uint _returnTime, uint _rentalPrice);
    event ReturnRental(address indexed _renter, uint _returnTime);
    event DeviceAdded(address owner);
    event LogDeviceOn(address _renter);
    event LogDeviceOff(address _renter);
  
    /**
    *Modifiers
    */

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyRenter() {
        require(msg.sender == renter);
        _;
    }
    
    modifier onlyDevice() {
        require(msg.sender == device);
        _;
    }

    modifier whenNotRented() {
        require(!rented || now > returnTime);
        _;
    }

    modifier whenRented() {
        require(rented && now <= returnTime);
        _;
    }

    modifier ifAvailable() {
        require(available);
        _;
    }   
    
    modifier  isRentedSet(){
        require(rented);
        _;
    }
    //Constructor
   
    function RentedDevice() public {
        owner = msg.sender;
    }
   
   //functions 
   
    function rentableSetup(uint _pricePerSecond, uint _minRentalTime,
                          uint _maxRentalTime,string _nameOfDevice,
                          address _device) 
    public onlyOwner {
        require(!available);
        require( _minRentalTime < _maxRentalTime);

        available = true;
        minRentalTime = _minRentalTime;
        maxRentalTime = _maxRentalTime;
        nameOfDevice = _nameOfDevice;
        device = _device;
        setRentalPricePerSecond(_pricePerSecond); // _pricePerHour > 0;
        emit DeviceAdded(owner);
    }

    function setAvailable(bool _available) public onlyOwner {
        available = _available;
    }

    function setRentalPricePerSecond(uint _pricePerSecond)
    public onlyOwner
    whenNotRented{
        require(_pricePerSecond > 0);
        rentalPrice = _pricePerSecond;
    }

    function rent() 
    public payable ifAvailable
    whenNotRented {
        require (msg.value > 0);
        require (rentalPrice > 0);
       
        uint amount = msg.value;
        uint calculatedRentalTime = amount / rentalPrice;
        require(calculatedRentalTime >= minRentalTime && 
                calculatedRentalTime <= maxRentalTime);

        returnTime = now + calculatedRentalTime;

        rented = true;
        renter = msg.sender;
        rentalTime = now;

        emit Rent(renter, rentalTime, returnTime, rentalPrice);
    }

    function rentalElapsedTime() 
    private view isRentedSet 
    returns (uint){
        if(now<returnTime)
        return now-rentalTime;
        else
        return returnTime-rentalTime;
    }

    function rentalAccumulatedPrice() private view 
    isRentedSet 
    returns (uint){
        uint _rentalElapsedTime = rentalElapsedTime();
        return rentalPrice * _rentalElapsedTime;
    }

    function rentalBalanceRemaining()
    private view isRentedSet 
    returns (uint){
        return rentalTimeRemaining() * rentalPrice;
    }

    function rentalTimeRemaining() private view  
    isRentedSet 
    returns (uint){
        if(returnTime>now){
        return (returnTime - now);
        }
        else{
            return 0;
        }
    
    }

    function rentalTotalTime() public view 
    isRentedSet 
    returns (uint){
        return (returnTime - rentalTime);
    }

    function returnRental() public onlyRenter whenRented{
        uint fundsToReturn = 0;
        if(rentalElapsedTime() < minRentalTime){
            fundsToReturn = (rentalTotalTime() - minRentalTime)*rentalPrice;
        }else{
            fundsToReturn = rentalBalanceRemaining();
        }
        
        emit ReturnRental(renter, now);
        msg.sender.transfer(fundsToReturn);
        turnOffDevice();
        resetRental();
        address contractAddress = this;
        owner.transfer(contractAddress.balance);
    }
    
    function endOfRentalTime() 
    public onlyDevice {
        require(now > returnTime);
        address contractAddress = this;
        owner.transfer(contractAddress.balance);
        emit ReturnRental(device, now);
        resetRental();
    }
    
    function resetRental() 
    private{
        rented = false;
        renter = address(0);
        rentalTime = 0;
        returnTime = 0;
        
    }
    
    function turnOnDevice()
    public
    onlyRenter whenRented
    returns(bool _success){
        status = true;
        emit LogDeviceOn(msg.sender);
        return true;
    }

    //@dev Turn off device
    function turnOffDevice()
    public
    onlyRenter whenRented
    returns(bool _success){
        status = false;
        emit LogDeviceOff(msg.sender);
        return true;
    }
   
    /// @dev public function for providing time info
    function timeInfo()
    public view isRentedSet 
    returns(uint _timeElapsed,uint _timeRemaining){
       return(rentalElapsedTime(),
             rentalTimeRemaining());
    }

    /// @dev public fucntion for providing time info
    function balanceInfo()
    public view isRentedSet 
    returns(uint _balanceSpent,uint _balanceRemaining){
        return(rentalAccumulatedPrice(),
              rentalBalanceRemaining());
    }
}