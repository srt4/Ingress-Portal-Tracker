$(document).ready(function() {
    var map = initializeMap();

    fetchPortals(map);

    window.onload = function(){
        initializePanelHeights(map)
    };
});

var fetchPortals = function(map) {
    var portals = []; // todo store this elsewhere

    $.getJSON("/portals/", function(data){
        $(data).each(function (key, value){
            portals.push(value);

            // add basic portal info
            var $portalDiv = $("<div/>");
            $portalDiv.append($("<h1/>").text(value.name));
            $portalDiv.append($("<h2/>").text(value.address));

            // add mods
            var $modsUl = $("<ul/>");
            $(value.mods).each(function(key, mod){
                $modsUl.append($("<li/>").text(mod.rarity));
            });
            $portalDiv.append($modsUl);

            // add resonators
            var $resonatorsUl = $("<div/>");
            $(value.resonators).each(function(key, resonator){
                $resonatorsUl.append(resonator.level + ", ");
            });
            $portalDiv.append($resonatorsUl);

            // append to left-side list
            $("#portals").append($portalDiv);
        });
    }).done(function() {
        allPortalsLoaded(portals, map);
    });
};

var allPortalsLoaded = function(portals, map) {
    console.log("Well, all portalps are loaded");
    portals.forEach(function(portal) {
        var lat = portal.latitude / 10;
        var lon = portal.longitude / 10;
        L.marker(new L.LatLng(lat, lon)).addTo(map);
    });
};

var initializeMap = function() {
    var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/4bdf8a2626c048129923f7597f80acce/45831/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        cloudmade = new L.TileLayer(cloudmadeUrl, {fadeAnimation: false, zoomAnimation: false, maxZoom: 18, attribution: cloudmadeAttribution});

    var map = new L.Map('map');

    map.addLayer(cloudmade);

    updateMapLocationWithUserLoc(map);

    return map;
};

var initializePanelHeights = function(/*L.Map to invalidate */map) {
    $("#portals").height($(window).height());
    $("#map").height($(window).height());

    map.invalidateSize();
};

var updateMapLocationWithUserLoc = function(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        onError();
    }

    function onSuccess(position) {
        $.loc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };

        map.setView(new L.LatLng($.loc.lat, $.loc.lon), 17);
    }

    function onError() {
        // U District
        $.loc = {
            lat: 47.6605431,
            lon: -122.3126639
        };

        map.setView(new L.LatLng($.loc.lat, $.loc.lon), 17);
    }
};