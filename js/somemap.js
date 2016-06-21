var map;

function initialize() {
  var myCenter;
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      myCenter = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(myCenter);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }else{
    myCenter = new google.maps.LatLng(39.0397266, -94.5785667 );
  }
  map = new google.maps.Map(document.getElementById('googleMap'), {
    center:myCenter,
    zoom:11,
    scrollwheel:false,
    draggable:false,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  });

  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');
  // (In this example we use a locally stored copy instead.)
  script.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp';
  // script.src = '/maps/documentation/javascript/tutorials/js/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);

  //google sheet data
  Tabletop.init( { key: '1OsCBjUnhUYDjt86opGTe-iswhfSVC39d-9aRIKIzZI0',
                  callback: function(data, tabletop) {
                    console.log(data);
                    var locations = data.Locations.elements;
                    var geoJs = location_data_to_geoJson(locations);
                    console.log(geoJs);
                    put_geoJson_on_map(geoJs);

                  },
                  simpleSheet: false } );
}


function icon_from_marker_location_type(l){
  return 'icon.jpg';
}
function location_data_to_geoJson (data) {
  var gj = {'type':'FeatureCollection','features':[]},
    feature = {},
    geometry = {'type':'Point'};

  var i, r;
  for(i=data.length;i--;){
    r = data[i];
    gj.features.push({
      'type':'Feature',
      'geometry': {
        'type':'Point',
        'icon': "http://i.imgur.com/8liV6HN.png",
        'coordinates':[
          r.latitude,
          r.longitude
        ]
      },
      'properties':{
        'name': r.name,
        'description': r.description
      }
    })
  }
  return gj;
}
function put_geoJson_on_map(geoJs){
  for (var i = 0; i < geoJs.features.length; i++) {
    var coords = geoJs.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: "http://i.imgur.com/YirEmMt.png?1"
    });
  }

}

// Loop through the results array and place a marker for each
// set of coordinates.
window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  }
}