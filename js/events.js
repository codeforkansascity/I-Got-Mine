//google sheet data


var EVENT_CAROUSEL_TEMPLATE_COMPILED = _.template(
'<div class="item <%= event.Active %>">'+
  '<img class="img-responsive img-rounded" src="<%- event.EventImage %>" alt="Event 1">'+
  '<div class="carousel-caption">'+
    '<h3><%= event.Name %></h3>'+
    '<p><%= event.Date %> <%= event.Days %> <%= event.Hours %></p>'+
    '<p><%= event.Details %></p>'+
  '</div>'+
'</div>'
)
var DEFAULT_EVENT_IMAGE = 'http://i.imgur.com/dtHaKF6.jpg';
function locations_to_recent_events(locations) {
  // console.log(locations);
  var events = [], 
    thres_date = new Date();
  thres_date.setMonth(thres_date.getMonth()+1);
  for(var i=locations.length;i--;){
    console.log(locations[i].Type.toLowerCase());    
    if(locations[i].Type.toLowerCase() == 'event' && new Date(locations[i].Date) < thres_date){
      if(locations[i].EventImage == ''){
        locations[i].EventImage = DEFAULT_EVENT_IMAGE;
      }
      events.push(locations[i]);
    }
  }
  //sort
  events.sort(function(a,b) {return new Date(a.Date) > new Date(b.Date)});
  events[0].Active = 'active';
  console.log(events);
  return events;
}

function event_carousel_init(events) {
  var carousel_inner_html = '';
  if(events.length > 0){
    for(var i=events.length;i--;){
      carousel_inner_html += EVENT_CAROUSEL_TEMPLATE_COMPILED({event:events[i]});
    }
    document.getElementById('event-carousel-inner').innerHTML = carousel_inner_html;
  }
}

Tabletop.init( { key: '1OsCBjUnhUYDjt86opGTe-iswhfSVC39d-9aRIKIzZI0',
  callback: function(data, tabletop) {
    var locations = data.Locations.elements;
    events = locations_to_recent_events(locations);
    event_carousel_init(events);
  },
  simpleSheet: false } );

