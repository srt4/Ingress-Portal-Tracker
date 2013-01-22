function Resonator() {
	this.level = 0;
	this.energyTotal = 0;
    this.distanceToPortal = 0;
    this.slot = -1;
    this.ownerGuid = '';
	this.levels = [
		1000,
		1500,
		2000,
		2500,
		3000,
		4000,
		5000,
		6000
	]; // http://decodeingress.wordpress.com/2012/11/18/ingress-portal-levels-and-link-range/
}

Resonator.prototype.getSlot = function() {
    return this.slot;
};

Resonator.prototype.setSlot = function(slot) {
    this.slot = parseInt(slot, 10);
};

Resonator.prototype.getLevel = function() {
	return this.level;
};

Resonator.prototype.setLevel = function(level) {
	this.level = parseInt(level, 10);
};

Resonator.prototype.getOwnerGuid = function() {
    return this.ownerGuid;
};

Resonator.prototype.setOwnerGuid = function(guid) {
    this.ownerGuid = guid;
};

Resonator.prototype.getDistanceToPortal = function() {
    return this.distanceToPortal;
};

Resonator.prototype.setDistanceToPortal = function(distance) {
    this.distanceToPortal = parseInt(distance, 10);
};

Resonator.prototype.getEnergyTotal = function() {
	return this.energyTotal;
};

Resonator.prototype.setEnergyTotal = function(energyTotal) {
	this.energyTotal = parseInt(energyTotal, 10);
};

Resonator.prototype.getEnergyPercentage = function() {
	return parseInt((this.getEnergyTotal() / this.levels[this.getLevel()-1]) * 100);
};

Resonator.createFromResponseData = function(responseData) {
	var resonator = new Resonator();
	resonator.setLevel(responseData.level);
    resonator.setSlot(responseData.slot);
    resonator.setOwnerGuid(responseData.ownerGuid);
    resonator.setDistanceToPortal(responseData.distanceToPortal)
	resonator.setEnergyTotal(responseData.energyTotal);
	return resonator;
};

module.exports = Resonator;