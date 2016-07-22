var IMAGE_URLS = {
  CONDOM: "images/igmikc-map-icon-condom.png",
  EVENT: "images/igmikc-map-icon-event.png",
  TREATMENT: "images/igmikc-map-icon-treatment.png"
};
var DEFAULT_EVENT_IMAGES = ['http://i.imgur.com/dtHaKF6.jpg','http://i.imgur.com/Szs6sUL.jpg'];
var DEFAULT_EVENT_IMAGE = DEFAULT_EVENT_IMAGES[0];
var DEFAULT_MAP_CENTER = {
  LAT: 39.0397266,
  LNG: -94.5785667
};
var POINT_TYPE = {
  CONDOM: 'condom',
  EVENT: 'event',
  TREATMENT: 'treatment'
};
var map;

function mobileAndTabletcheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
function showMap (center) {
  map = new google.maps.Map(document.getElementById('googleMap'), {
    center:center,
    zoom:11,
    scrollwheel:false,
    draggable:true,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  });


  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');
  // (In this example we use a locally stored copy instead.)
  script.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp';
  // script.src = '/maps/documentation/javascript/tutorials/js/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);

  //add current location as center if the user is on mobile phone
  if(mobileAndTabletcheck()){
    var myMarker = new google.maps.Marker({
      position: center,
      map: map,
    });
  }
}
function initialize() {
  //the timeout of geolocation.getCurrentPosition doesn't work in some browsers
  //show the map first, re-center if we can get user location
  var myCenter = new google.maps.LatLng(DEFAULT_MAP_CENTER.LAT, DEFAULT_MAP_CENTER.LNG);
  showMap(myCenter);
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      map.setCenter({lat:position.coords.latitude,lng:position.coords.longitude});
    });
  }
}


function location_data_to_geoJson (data) {
  var gj = {'type':'FeatureCollection','features':[]},
    feature = {},
    geometry = {'type':'Point'};

  //loop over row data
  var i, row;
  for(i=data.length;i--;){
    row = data[i];
    // console.log(row);
    gj.features.push({
      'type':'Feature',
      'geometry': {
        'type':'Point',
        'coordinates':[
          row.Longitude,
          row.Latitude
        ]
      },
      'properties':row
    })
  }
  return gj;
}

// var markerInfoWindowContent = function(m) {
//   return "<h1 class='infowindow'>"+m.prop.Name+"</h1><div>"+m.prop.Details+"</div>"
// };
// console.log(_.template(''));


var SNS = ['Twitter','Facebook','Instagram'];
var infowindow_compiled = _.template(
'<div class="ok-event">'+
  '<a href id="close-infowindow" class="pull-right">close x</a>'+
  '<aside class="type-<%- prop.Type.toLowerCase() %>"><%= prop.Title %></aside>' +
  '<h5><%= prop.Name %></h5>'+
  '<address><%= prop.Address %></address>'+
  '<div><a target="_blank" href="http://maps.google.com/?q=<%= prop.Address %>">view on google map</a></div>' +
  '<time><span class="l10n" data-lkey="<%= prop.Days %>"><%= prop.Days %></span> <%= prop.Hours %></time>'+
  '<div class="phone-number"><%= prop.PhoneNumber %></div>'+
  '<section class="event-details"><%= prop.Details %></section>'+
  '<a target="_blank" href="<%- prop.Website %>" class="event-website"><%= prop.Website %></a>'+
  '<section class="icons-social">'+
  '<% _.forEach(SNS, function(s){'+
  'if(prop[s] !== ""){%>'+
  '<span><a target="_blank" href="<%= prop[s] %>" '+
  'class="icon-social-<%-s.toLowerCase()%>"></a></span>'+
  '<%}'+
  '})%>'+
  '</section>'+
'</div>');
var event_carousel_template_compiled = _.template(
'<div class="item <%= event.Active %>">'+
  '<img class="img-responsive img-rounded" src="<%- event.EventImage %>" alt="Event 1">'+
  '<div class="carousel-caption">'+
    '<h3><%= event.Name %></h3>'+
    '<p><%= event.Date %> <%= event.Days %> <%= event.Hours %></p>'+
    '<p><%= event.Address %></p>'+
    '<p><%= event.Details %></p>'+
    '<button type="button" class="btn btn-secondary show-marker center-block l10n" data-type="event" data-id="<%= event.id %>" data-lkey="ViewOnMap">view on map</button>'+
  '</div>'+
'</div>'
);
var stdlocation_compiled = _.template(
  '<div class="col-xs-6 col-md-4 ok-treatment">'+
  '<h5><%= prop.Name %></h5>'+
  '<address><%= prop.Address %></address>'+
  't: <a href="tel:<%= prop.PhoneNumber %>"><%= prop.PhoneNumber %></a><br />'+
  '<time><span class="l10n" data-lkey="<%= prop.Days %>"><%= prop.Days %></span> <%= prop.Hours %></time>'+
  '<section class="treatment-details"><strong class="l10n" data-lkey="Treated">Treated</strong>: <span class="l10n" data-lkey="<%= prop.LocalizationKey %>Treatment"><%= prop.Details %></span></section><br />'+
  '<button type="button" class="btn btn-secondary show-marker center-block l10n" data-type="treatment" data-id="<%= prop.id %>" data-lkey="ViewOnMap">view on map</button>'+
  '</div>'
);
var infowindowdom = document.getElementById('info-window');
var markers = [];
var events = [];
function geoJson_data_init(geoJs){
  var i, e, coords, lat_lng, marker, fp, icon_url, std_html='';
  var thres_date = new Date();
  thres_date.setMonth(thres_date.getMonth()+1);
  for (var i = 0; i < geoJs.features.length; i++) {
    fp = geoJs.features[i];
    coords = fp.geometry.coordinates;
    lat_lng = new google.maps.LatLng(coords[1],coords[0]);
    fp.properties.id = i;
    if(fp.properties.Type.toLowerCase() == POINT_TYPE.CONDOM){
      icon_url = IMAGE_URLS.CONDOM;
      fp.properties.Title = 'Free Condoms';
    }else if(fp.properties.Type.toLowerCase() == POINT_TYPE.EVENT){
      icon_url = IMAGE_URLS.EVENT;
      e = fp.properties;
      e.Title = 'Event';
      if(new Date(e.Date) < thres_date){
        if(e.EventImage == ''){
          e.EventImage = DEFAULT_EVENT_IMAGES[i % DEFAULT_EVENT_IMAGES.length];
        }
        events.push(e);
      }
    }else if(fp.properties.Type.toLowerCase() == POINT_TYPE.TREATMENT){
      icon_url = IMAGE_URLS.TREATMENT;
      fp.properties.Title = 'STD Treatment Center';
      std_html += stdlocation_compiled({'prop':fp.properties});
    }else{
      icon_url = IMAGE_URLS.CONDOM;
    }
    marker = new google.maps.Marker({
      position: lat_lng,
      map: map,
      icon: icon_url,
      prop: fp.properties
    });
    marker.addListener('click', function() {
      // console.log('clicked');
      // var infowindow = new google.maps.InfoWindow({
      //   content: markerInfoWindowContent(this)
      // });
      // infowindow.open(map, this);
      var self = this
      console.log(self.prop);
      infowindowdom.innerHTML = infowindow_compiled({'prop':self.prop});
      $(infowindowdom).addClass("activating");
    });
    markers.push(marker);
  }
  // if(carousel_inner_html === ''){
  //   //no event
  //   var no_event={
  //     Name:"No Upcoming Event",
  //     Active: "active",
  //     EventImage:DEFAULT_EVENT_IMAGE
  //   };
  //   carousel_inner_html = event_carousel_template_compiled({'event':no_event});
  // }
  // document.getElementById('event-carousel-inner').innerHTML = carousel_inner_html;
  document.getElementById('std-treatment-list-section').innerHTML = std_html;
}

//close window
function close_info_window() {
  $(infowindowdom).removeClass("active");
}
function show_marker_by_id(id){
  var m;
  for(var i=markers.length;i--;){
    m = markers[i];
    if(m.icon.indexOf('-selected') !== -1){
      m.setIcon(m.icon.replace('-selected.', '.'));
    }
  }
  m = markers[id];
  if(typeof m !== 'undefined'){
    m.setIcon(m.icon.replace('.', '-selected.'));
    m.setZIndex(10000);
    map.setCenter(m.getPosition());
    map.setZoom(14);
  }
  return m;
}
function highlight_markers_by_type (marker_type) {
  var m;
  for(var i=markers.length;i--;){
    m = markers[i];
    if(m.icon.indexOf('-selected') !== -1){
      m.setIcon(m.icon.replace('-selected.', '.'));
      m.setZIndex(100);
    }
    if(m.prop.Type.toLowerCase() === marker_type.toLowerCase() &&
      m.icon.indexOf('-selected') === -1){
      m.setIcon(m.icon.replace('.', '-selected.'));
      m.setZIndex(9999);
    }
  }
}

// 
// events
// function locations_to_recent_events(locations) {
//   // console.log(locations);
//   var events = [], 
//     thres_date = new Date();
//   thres_date.setMonth(thres_date.getMonth()+1);
//   for(var i=locations.length;i--;){
//     // console.log(locations[i].Type.toLowerCase());    
//     if(locations[i].Type.toLowerCase() == 'event' && new Date(locations[i].Date) < thres_date){
//       if(locations[i].EventImage == ''){
//         locations[i].EventImage = DEFAULT_EVENT_IMAGES[i % DEFAULT_EVENT_IMAGES.length];
//       }
//       events.push(locations[i]);
//     }
//   }

//   // console.log(events);
//   return events;
// }

function event_carousel_init() {
  var carousel_inner_html = '';
  if(events.length > 0){
    //sort
    events.sort(function(a,b) {return new Date(a.Date) > new Date(b.Date)});
    events[0].Active = 'active';
    for(var i=events.length;i--;){
      carousel_inner_html += event_carousel_template_compiled({'event':events[i]});
    }
  }else{
    var no_event={
      Name:"No Upcoming Event",
      Active: "active",
      EventImage:DEFAULT_EVENT_IMAGE
    };
    carousel_inner_html = event_carousel_template_compiled({'event':no_event});
  }
  document.getElementById('event-carousel-inner').innerHTML = carousel_inner_html;
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
$(document).ready(function() {
  $('body').on('click', function(e) {
    if(!$.contains(infowindowdom, e.target) && $(infowindowdom).hasClass("active")){
      console.log($(infowindowdom));
      close_info_window();  
    }
    if($(infowindowdom).hasClass("activating")){
      $(infowindowdom).removeClass("activating");
      $(infowindowdom).addClass("active");
    }
    if(e.target.id == 'close-infowindow'){
      console.log('close button');
      e.preventDefault();
      close_info_window();
    }
  }).keyup(function(e) {
    if(e.keyCode == 27){
      close_info_window();
    }
  });
  $('body').on('click', '.highlight-marker', function(e) {
    e.preventDefault();
    highlight_markers_by_type($(e.target).data('type'));
    return false;
  });
  $('body').on('click', '.show-marker', function(e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#map-scroll-position").offset().top
    }, 1000);
    show_marker_by_id($(e.target).data('id'));
    return false;
  });
});