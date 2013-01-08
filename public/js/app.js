$(document).ready(function() {
    $.getJSON("/portals/faction/enlightened", function(data){
        $(data).each(function (key, value){
            var $portalDiv = $("<div/>");
            $portalDiv.append($("<h1/>").text(value.name));
            $portalDiv.append($("<h2/>").text(value.address));
            var $modsUl = $("<ul/>");
            $(value.mods).each(function(key, mod){
                $modsUl.append($("<li/>").text(mod.rarity));
            });
            $portalDiv.append($modsUl);

            var $resonatorsUl = $("<ul/>");
            $(value.resonators).each(function(key, resonator){
                $resonatorsUl.append($("<li/>").text(resonator.level));
            });
            $portalDiv.append($resonatorsUl);

            $("#portals").append($portalDiv);
        });
    });
});