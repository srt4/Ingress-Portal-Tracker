var userStore; // don't want to make this global... todo
var filterUtils;
var markers = [];
var markerGroup;
var lastMapCenter;

$(document).ready(function() {
    var map = initializeMap();
    markerGroup = new L.LayerGroup();
    map.addLayer(markerGroup);

    map.on('moveend', function(event) {
        var radius;

        try {
            radius = MapUtils.getLatLonRadiusFromMap(map.getBounds());
        } catch(e) {
            // do nothing
        }



        if(radius !== undefined) {
            if (MapUtils.shouldUpdatePortals(lastMapCenter, radius)) {
                fetchPortals(map, radius);
                lastMapCenter = radius;
            }
        }
    });

    userStore = new UserStore();
    userStore.fetchAllusers();

    fetchPortals(map);

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

    var url = "/portals";
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
        cloudmadeUrl = 'http://map1.craigslist.org/t01/{z}/{x}/{y}.png',
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
var initializeOrUpdatePanelHeights = function(/*L.Map to invalidate */map) {
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

    function onSuccess(position) {
        $.loc = {
 //           lat: 47.6605431,
 //           lon: -122.3126639
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };

        map.setView(new L.LatLng($.loc.lat, $.loc.lon), 17);
        lastMapCenter = MapUtils.getLatLonRadiusFromMap(map.getBounds());
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

var MapUtils = {
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

    shouldUpdatePortals: function(lastMapBounds, currentMapBounds) {
        var radius = lastMapBounds.radius;

        if (Math.abs(currentMapBounds.lat - lastMapBounds.lat) < 0.5*radius) {
            if (Math.abs(currentMapBounds.lon - lastMapBounds.lon) < 0.5*radius) {
                return false;
            }
        }

        return true;
    }
};