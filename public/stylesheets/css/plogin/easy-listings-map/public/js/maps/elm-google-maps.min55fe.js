!function(a,b){var c=infoBubble=markerClusterer=animatedMarker=null,d=!0,e=[];b.initializeListingMap=function(){if(!c){var a=[];for(i=0,max=elm_google_maps.map_types.length;i<max;i++)"ROADMAP"===elm_google_maps.map_types[i]?a.push(google.maps.MapTypeId.ROADMAP):"SATELLITE"===elm_google_maps.map_types[i]?a.push(google.maps.MapTypeId.SATELLITE):"HYBRID"===elm_google_maps.map_types[i]?a.push(google.maps.MapTypeId.HYBRID):"TERRAIN"===elm_google_maps.map_types[i]&&a.push(google.maps.MapTypeId.TERRAIN);a.length||a.push(google.maps.MapTypeId.ROADMAP);var b=new google.maps.LatLng(elm_google_maps.default_latitude,elm_google_maps.default_longitude),d={zoom:parseInt(elm_google_maps.zoom),center:b,mapTypeControl:!0,scrollwheel:!1,mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DEFAULT,mapTypeIds:a},zoomControl:!0,zoomControlOptions:{style:google.maps.ZoomControlStyle.DEFAULT,position:google.maps.ControlPosition.RIGHT_TOP},streetViewControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP}};elm_google_maps.map_styles.length&&(d.styles=jQuery.parseJSON(elm_google_maps.map_styles)),c=new google.maps.Map(document.getElementById(elm_google_maps.map_id),d),"undefined"!=typeof elm_google_maps.default_map_type&&c.setMapTypeId(google.maps.MapTypeId[elm_google_maps.default_map_type]),infoBubble=generateInfoBubble();var f=elm_google_maps.markers;f=jQuery.parseJSON(f),f.length&&(createMarkers(f),addMarkersToCluster()),"1"===elm_google_maps.auto_zoom&&e.length?mapAutoZoom():e.length&&c.setCenter(e[0].position),"undefined"!=typeof elm_google_maps.zoom_events&&0!=elm_google_maps.zoom_events&&(google.maps.event.addListener(c,"dragend",getBoundMarkers),google.maps.event.addListener(c,"zoom_changed",getBoundMarkers)),google.maps.event.addListener(c,"tilesloaded",function(){jQuery("#gmap-loading").remove()})}},"object"==typeof google&&"object"==typeof google.maps&&(a(function(){a("#"+elm_google_maps.map_id).is(":visible")?initializeListingMap():(a('a[data-toggle="tab"]').on("shown shown.bs.tab",function(b){a("#"+elm_google_maps.map_id).is(":visible")&&initializeListingMap()}),a("ul.ui-tabs-nav li, ul.z-tabs-nav li").on("click",function(b){a("#"+elm_google_maps.map_id).is(":visible")&&initializeListingMap()}))}),google.maps.event.addDomListener(b,"resize",function(){if(c){var a=c.getCenter();google.maps.event.trigger(c,"resize"),c.setCenter(a)}})),b.getInfoWindow=function(a,b){return function(){var d=infoBubble.get("position");if("undefined"==typeof d||"undefined"!=typeof d&&a.position.lat()!==d.lat()&&a.position.lng()!==d.lng()){infoBubble.close(),infoBubble=generateInfoBubble();var e="";if(b.info.length>1)for(i=0,max=b.info.length;i<max;i++)e='<div class="property-infobubble-content"><img width="16" height="16" style="position: absolute; right: 0; margin-right: 8px; cursor: pointer; width: 16px; height: 16px;" onclick="infoBubble.close();" src="'+elm_google_maps.info_window_close+'"><a href="'+decodeURIComponent(b.info[i].url)+'"><img src="'+b.info[0].image_url+'" width="300" height="150" class="elm-infobubble-image wp-post-image" /></a><div class="title"><a class="infobubble-property-title" href="'+decodeURIComponent(b.info[i].url)+'">'+b.info[i].title+'</a></div><div class="property-type-status">'+b.info[i].property_type+" - "+b.info[i].property_status+'</div><div class="property-feature-icons epl-clearfix">'+b.info[i].icons+"</div></div>",infoBubble.addTab(b.info[i].tab_title,e);else e='<div class="property-infobubble-content"><img width="16" height="16" style="position: absolute; right: 0; margin-right: 8px; cursor: pointer; width: 16px; height: 16px;" onclick="infoBubble.close();" src="'+elm_google_maps.info_window_close+'"><a href="'+decodeURIComponent(b.info[0].url)+'"><img src="'+b.info[0].image_url+'" width="300" height="150" class="elm-infobubble-image wp-post-image" /></a><div class="title"><a class="infobubble-property-title" href="'+decodeURIComponent(b.info[0].url)+'">'+b.info[0].title+'</a></div><div class="property-type-status">'+b.info[0].property_type+" - "+b.info[0].property_status+'</div><div class="property-feature-icons epl-clearfix">'+b.info[0].icons+"</div></div>",infoBubble.setContent(e)}infoBubble.isOpen()||infoBubble.open(c,a)}},b.getBoundMarkers=function(){if(!d)return void(d=!0);var a=c.getBounds(),b=a.getSouthWest(),e=a.getNorthEast(),f=b.lat(),g=b.lng(),h=e.lat(),i=e.lng();jQuery.ajax({type:"POST",url:elmPublicAjaxUrl,data:{action:"load_map_markers",nonce:elm_google_maps.nonce,southWestLat:f,southWestLng:g,northEastLat:h,northEastLng:i,query_vars:elm_google_maps.query_vars,cluster_size:elm_google_maps.cluster_size}}).done(function(a){a=jQuery.parseJSON(a),1===a.success?addListingsToMap(a.markers):0===a.success&&console.log(a.message)})},b.removeMarkers=function(){markerClusterer&&markerClusterer.clearMarkers(),e=[]},b.createMarkers=function(a){if(a.length){var b;for(i=0,max=a.length;i<max;i++)b=new google.maps.Marker({position:new google.maps.LatLng(a[i].latitude,a[i].longitude),icon:a[i].marker_icon,listing_id:a[i].listing_id}),e.push(b),google.maps.event.addListener(b,"click",getInfoWindow(b,a[i]))}},b.addMarkersToCluster=function(){if(e.length){var a=-1==elm_google_maps.cluster_size?null:parseInt(elm_google_maps.cluster_size,10);markerClusterer=new MarkerClusterer(c,e,{ignoreHidden:!0,maxZoom:14,gridSize:a,styles:elm_google_maps.cluster_style}),google.maps.event.addListener(markerClusterer,"click",function(a){console.log(a.getMarkers())})}},b.addListingsToMap=function(a){removeMarkers(),a.length&&(createMarkers(a),addMarkersToCluster())},b.animateListingMarker=function(a,b){b||(b=google.maps.Animation.BOUNCE);for(var c=0,d=e.length;d>c;c++)for(var f=0,g=e[c].listing_id.length;g>f;f++)if(a==e[c].listing_id[f])return animatedMarker=e[c],void e[c].setAnimation(b)},b.stopAnimatedMarker=function(){animatedMarker&&animatedMarker.setAnimation(null)},b.mapAutoZoom=function(){var a=new google.maps.LatLngBounds;for(i=0,max=e.length;i<max;i++)a.extend(e[i].getPosition());c.setCenter(a.getCenter()),c.fitBounds(a),d=!1,c.setZoom(c.getZoom()-1>=0?c.getZoom()-1:c.getZoom()),c.getZoom()>15&&(d=!1,c.setZoom(15))},b.generateInfoBubble=function(){return new InfoBubble({minWidth:320,minHeight:280,hideCloseButton:!0})},InfoBubble.prototype.setCloseButtonStyle=function(a,b){this.close_.style[a]=b}}(jQuery,window);
