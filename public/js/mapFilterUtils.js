function MapFilterUtils() {
    this.markerDivCollection = {};
    this.map = undefined;
    this.sidebarDiv = undefined;
}

MapFilterUtils.prototype.setMap = function(map) {
    this.map = map;
};

MapFilterUtils.prototype.setSidebarDiv = function(sidebarDiv) {
    this.sidebarDiv = sidebarDiv;
};

MapFilterUtils.prototype.setMarkerDivCollection = function(collection) {
    this.markerDivCollection = collection;
};

MapFilterUtils.prototype.addHandlersToFilters = function() {
    // initialize selectors we may want to reuse
    var $filterContainer = $("#filters"),
        $levelFilters = $filterContainer.find("#level-filters"),
        $factionFilters = $filterContainer.find("#faction-filters"),
        $searchFilters = $filterContainer.find("#search-filters"),
        $levelFilterForm = $levelFilters.find("#level-filter"),
        $factionFilterForm = $factionFilters.find("#faction-filter"),
        $searchFilterForm;

    var context = this;

    $factionFilterForm.on("click", function(e){
        var checked = [];
        $("#faction-filter").find("input:checked").each(function(key, value){
            checked.push($(value).val());
        });

        if(checked.length == 0){
            checked = ['resistance', 'enlightened'];
        }

        context.filterPortalsByFactions(checked);
    });
};

/*
accepts an object of format: [ {marker: $(), div: $()}, ... ]
 */
MapFilterUtils.prototype.filterPortalsByFactions = function(factions) {
    var context = this;
    this.sidebarDiv.empty();

    this.markerDivCollection.forEach(function(entity){
        context.map.removeLayer(entity.marker);

        factions.forEach(function(faction){
            if(entity.portal.team == faction) {
                context.map.addLayer(entity.marker);
                context.sidebarDiv.append(entity.div);
            }
        });
    });
};