var STD_CARD_TEMPLATE_COMPILED = _.template(
'<div class="flip-container std-card">'+
'<div class="flipper">'+
'<div class="front">'+
'<h3><%= std.Name %></h3>'+
'<section class="std-card-front-info">'+
'<p><%= std.Howyougetit %></p>'+
'<a href="<%- std.Website %>">STD description at CDC website >>></a>'+
'<p class="std-card-front-info-treat"><strong>Testing</strong><%= std.Stdtesting %></p>'+
'<p class="std-card-front-info-treat"><strong>Treatment</strong><%= std.Stdtreatment %></p>'+
'</section>'+
'</div>'+
'<div class="back">'+
'<div class="img-responsive img-circle center-block" style="background: url(<%- std.Picture %>) no-repeat, #FFF;">'+
'</div>'+
'<h3><%= std.Name %></h3>'+
'<p><%= std.Whattowatchfor %></p>'+
'</div>'+
'</div>'+
'<div class="flip-button">'+
'<button class="btn toggle-flip">more info</button>'+
'</div>'+
'</div>'
);


function init_std_cards (stds) {
  var inner_html ='';
  for(var i=0;i<stds.length;i++){
    inner_html += STD_CARD_TEMPLATE_COMPILED({std:stds[i]});
  }
  document.getElementById('std-card-list-section').innerHTML = inner_html;
}

$(document).ready(function() {
  $('body').on('click', '.toggle-flip', function(e) {
    e.preventDefault();
    e.currentTarget.parentNode.parentNode.classList.toggle('flipped');
    return false;
  }).on('click', '.flip-container', function(e) {
    console.log(e.target);    
    e.preventDefault();
    e.currentTarget.classList.toggle('flipped');
    return false;
  })
})

Tabletop.init( { key: '1OsCBjUnhUYDjt86opGTe-iswhfSVC39d-9aRIKIzZI0',
  callback: function(data, tabletop) {
    var stds = data.Stdtesting.elements;
    init_std_cards(stds);
  },
  simpleSheet: false } );