var STD_CARD_TEMPLATE_COMPILED = _.template(
'<div class="flip-container std-card">'+
'<div class="flipper">'+
'<div class="front">'+
'<h3 class="l10n" data-lkey="<%= std.LocalizationKey %>"><%= std.Name %></h3>'+
'<section class="std-card-front-info">'+
'<p class="l10n" data-lkey="<%= std.LocalizationKey %>Spread"><%= std.Howyougetit %><br />'+
'<a href="<%- std.Website %>" class="l10n" data-lkey="STDDescriptionCDC">STD description at CDC website </a></p>'+
'<strong class="l10n" data-lkey="Testing">Testing</strong><ul class="std-card-front-info-treat"> <%= std.Stdtesting %></ul>'+
'<strong class="l10n" data-lkey="Treatment">Treatment</strong><ul class="std-card-front-info-treat"> <%= std.Stdtreatment %></ul>'+
'</section>'+
'</div>'+
'<div class="back">'+
'<div class="img-responsive img-circle center-block" style="background: url(<%- std.Picture %>) no-repeat, #FFF;">'+
'</div>'+
'<h3 class="l10n" data-lkey="<%= std.LocalizationKey %>"><%= std.Name %></h3>'+
'<p class="l10n" data-lkey="<%= std.LocalizationKey %>Symptoms"><%= std.Whattowatchfor %></p>'+
'</div>'+
'</div>'+
'<div class="flip-button">'+
'<button class="btn toggle-flip moreinfo l10n" data-lkey="MoreInfo"><span class="glyphicon glyphicon-picture ok-warning-glyphicon-inbutton"></span><br />view symptoms</button>'+
'<button class="btn toggle-flip hideinfo l10n" data-lkey="HideInfo"><span class="glyphicon glyphicon-remove ok-warning-glyphicon-inbutton"></span><br />hide symptoms</button>'+
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
    e.preventDefault();
    e.currentTarget.classList.toggle('flipped');
    return false;
  })
});