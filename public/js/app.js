var userStore; // don't want to make this global... todo
var filterUtils;
var markers = [];
var markerGroup;
var lastMapCenter;

$(document).ready(function() {
    var map = initializeMap();
    markerGroup = new L.LayerGroup();
    map.addLayer(markerGroup);

    map.on('movestart', function(event){
        $("#portals").addClass("loading"); // combined this with moveend?
    });

    map.on('moveend', function(event) {
        MapUtils.updatePortalsOnMap(map);
    });

    map.on('zoomend', function(event){
        MapUtils.updatePortalsOnMap(map, true);
    });

    userStore = new UserStore();
    userStore.fetchAllusers();

    window.onload = function(){
        initializeOrUpdatePanelHeights(map)
    };

    $(document).on("resize", function() {
        initializeOrUpdatePanelHeights(map);
    });
});

/**
 *
 * @param {L.LayerGroup} markerGroup
 */
var deleteAllMarkers = function(markerGroup) {
    markerGroup.clearLayers();
};

/**
 *
 * @param {L.Map} map
 * @param {L.LatLngBounds} bounds
 */
var fetchPortals = function(map, bounds) {
    var icons = {
        enlightened: L.icon({
            iconUrl: "/img/enlightened.png",
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        }),
        resistance: L.icon({
            iconUrl: "/img/resistance.png",
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        })
    };

    var url = "/portals/lite";
    if(bounds !== undefined) {
        deleteAllMarkers(markerGroup);
        url += "/" + bounds.lat + "/" + bounds.lon + "/" + bounds.radius;
    }

    $.getJSON(url, function(data){
        $("#portals").empty();
        $(data).each(function (key, value){
            markers.push(appendPortal(value, map, icons));
        });
    }).done(function() {
            $("#portals").removeClass("loading");
            filterUtils = new MapFilterUtils();
            filterUtils.setMarkerDivCollection(markers);
            filterUtils.setMap(map);
            filterUtils.setSidebarDiv($("#portals"));
            filterUtils.addHandlersToFilters();
    });
};

/**
 *
 * @param {Portal} portal
 * @param {L.Map} map
 * @param {Object} icons
 * @return {Object}
 */
var appendPortal = function(portal, map, icons) {
    portal.userMap = userStore.users;

    var $portalDiv = $("<div/>").html(
        new EJS({
            url:"/js/ejs/tpl/portalSidebar.ejs"
        }).render(portal)
    );

    // append to left-side list
    $("#portals").append($portalDiv);

    var lat = portal.latitude;
    var lon = portal.longitude;

    var marker = new L.Marker(new L.LatLng(lat, lon), {
        icon: icons[portal.team]
    });

    markerGroup.addLayer(marker);

    var popupHtml = new EJS({
        url: "/js/ejs/tpl/portalPopup.ejs"
    }).render(portal);

    // add marker
    marker.bindPopup(
        popupHtml
    );

    $portalDiv.click(function() {
        map.panTo(
            new L.LatLng(lat, lon)
        );
        console.log(new L.LatLng(lat, lon)
        );
        marker.openPopup();
    });

    return {
        marker: marker,
        div: $portalDiv,
        portal: portal
    };
};

/**
 *
 * @return {L.Map}
 */
var initializeMap = function() {
        cloudmadeUrl = 'http://{s}.tile.cloudmade.com/4bdf8a2626c048129923f7597f80acce/45831/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        cloudmade = new L.TileLayer(cloudmadeUrl, {fadeAnimation: false, zoomAnimation: false, maxZoom: 18, attribution: cloudmadeAttribution});

    var map = new L.Map('map');
    map.addLayer(cloudmade);
    updateMapLocationWithUserLoc(map);

    return map;
};

/**
 *
 * @param {L.Map} map
 */
var initializeOrUpdatePanelHeights = function(map) {
    $("#portals").height($(window).height());
    $("#map").height($(window).height());

    map.invalidateSize();
};

/**
 *
 * @param {L.Map} map
 */
var updateMapLocationWithUserLoc = function(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        onError();
    }

    /**
     *
     * @param position
     */
    function onSuccess(position) {
        var loc = L.latLng(
            position.coords.latitude,
            position.coords.longitude
        );

        firstRun(loc);
    }

    function onError() {
        // U District
        var loc = L.latLng(
            47.6605431,
            -122.3126639
        );

        firstRun(loc);
    }

    function firstRun(loc) {
        map.setView(loc, 17);
        MapUtils.updatePortalsOnMap(map, true);
        lastMapCenter = MapUtils.getLatLonRadiusFromMap(map.getBounds());

    }
};

var MapUtils = {
    /**
     *
     * @param {L.LatLngBounds} bounds
     * @return {Object}
     */
    getLatLonRadiusFromMap: function(bounds) {
        var northEast = bounds.getNorthEast();
        var southWest = bounds.getSouthWest();

        return {
            lat: (0.5 * (northEast.lat + southWest.lat)),
            lon: (0.5 * (northEast.lng + southWest.lng)),
            radius: (Math.max(
                (0.5 * (northEast.lat - southWest.lat)),
                (0.5 * (northEast.lng - southWest.lng))
            ))
        };
    },

    /**
     *
     * @param {Object} lastMapBounds
     * @param {Object} currentMapBounds
     * @return {Boolean}
     */
    shouldUpdatePortals: function(lastMapBounds, currentMapBounds) {
        var radius = lastMapBounds.radius;

        if (Math.abs(currentMapBounds.lat - lastMapBounds.lat) < 0.5*radius) {
            if (Math.abs(currentMapBounds.lon - lastMapBounds.lon) < 0.5*radius) {
                return false;
            }
        }

        return true;
    },

    /**
     *
     * @param {L.Map} map
     * @param {Boolean} force
     */
    updatePortalsOnMap: function(map, force) {
        var radius;

        try {
            radius = MapUtils.getLatLonRadiusFromMap(map.getBounds());
        } catch(e) {
            // do nothing
        }

        if(radius !== undefined
            &&
          (force || MapUtils.shouldUpdatePortals(lastMapCenter, radius))) {
            fetchPortals(map, radius);
            lastMapCenter = radius;
        } else {
            $("#portals").removeClass("loading");
        }
    }
};