function Mod() {
	this.type = '';
	this.rarity = '';
	this.stats = {};
}

Mod.prototype.getName = function() {
	return this.name;
};

Mod.prototype.setName = function(name) {
	this.name = name;
};

Mod.prototype.getType = function() {
	return this.type;
};

Mod.prototype.setType = function(type) {
	this.type = type;
};

Mod.prototype.getRarity = function() {
	return this.rarity;
};

Mod.prototype.setRarity = function(rarity) {
	this.rarity = rarity;
};

Mod.prototype.getStats = function() {
	return this.stats;
};

Mod.prototype.setStats = function(stats) {
	this.stats = stats;
};

Mod.createFromResponseData = function(responseData) {
	var mod = new Mod();
	mod.setName(responseData.displayName);
	mod.setType(responseData.type);
	mod.setRarity(responseData.rarity);
	mod.setStats(responseData.stats);
	//console.log("MOD DATA: ", responseData);
	return mod;
};

module.exports = Mod;