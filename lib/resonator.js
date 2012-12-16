function Resonator() {
	this.level = 0;
	this.energyTotal = 0;
}

Resonator.prototype.getLevel = function() {
	return this.level;
}
Resonator.prototype.setLevel = function(level) {
	this.level = level;
}

Resonator.prototype.getEnergyTotal = function() {
	return this.energyTotal;
}
Resonator.prototype.setEnergyTotal = function(energyTotal) {
	this.energyTotal = energyTotal;
}

Resonator.createFromResponseData = function(responseData) {
	var resonator = new Resonator();
	resonator.setLevel(responseData.level);
	resonator.setEnergyTotal(responseData.energyTotal);
	return resonator;
}

module.exports = Resonator;