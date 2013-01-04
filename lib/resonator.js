function Resonator() {
	this.level = 0;
	this.energyTotal = 0;
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

Resonator.prototype.getLevel = function() {
	return this.level;
};

Resonator.prototype.setLevel = function(level) {
	this.level = level;
};

Resonator.prototype.getEnergyTotal = function() {
	return this.energyTotal;
};

Resonator.prototype.setEnergyTotal = function(energyTotal) {
	this.energyTotal = energyTotal;
};

Resonator.prototype.getEnergyPercentage = function() {
	return parseInt((this.getEnergyTotal() / this.levels[this.getLevel()-1]) * 100);
};

Resonator.createFromResponseData = function(responseData) {
	var resonator = new Resonator();
	resonator.setLevel(responseData.level);
	resonator.setEnergyTotal(responseData.energyTotal);
	return resonator;
};

module.exports = Resonator;