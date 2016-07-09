var current_language='english', translations;
function init_l10n(t) {
  translations = t;
}
function change_language(language) {
  var lkey, translation;
  current_language = language;
  for(var i=translations.length;i--;){
    console.log(translations[i]['Language']);
    console.log(language);
    if(translations[i]['Language'].toLowerCase() === language.toLowerCase()){
      translation = translations[i];
      break;
    }
  }
  console.log(translation['UpcomingEvents']);
  $('.l10n').each(function(k, el) {
    lkey = $(el).data('lkey');
    if(translation && translation.hasOwnProperty(lkey)){
      el.innerHTML = translation[lkey];
    }
  });

}
$(document).ready(function() {
  $('input.language-btn').on('change', function(e) {
    e.preventDefault();
    var language = $(e.currentTarget).data('language');
    if(current_language !== language){
      change_language(language);
    }
    return false;
  });
})