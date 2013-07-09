/* Instantiate the global sp object; include auth */
var sp = getSpotifyApi(),
  auth = sp.require('$api/auth'),
  app_id = '126891607432106',
  permissions = ['user_actions.music,friends_actions.music'],
  request_url = 'https://graph.facebook.com/me/music.listens',
  fbButtonHTML;

window.onload = function(){
  fbButtonHTML = document.getElementById('fb-login');
  fbButtonHTML.addEventListener('click', authFB);
}

function authFB() {
  auth.authenticateWithFacebook(app_id, permissions, {
    onSuccess: function(accessToken, ttl) {
      fbButtonHTML.style.display = 'none';
      // var url = 'https://graph.facebook.com/1052847553?method=GET&format=json&callback=___GraphExplorerAsyncCallback___&access_token=' + accessToken;
      var url = 'https://graph.facebook.com/me?fields=id,friends,music.listens&access_token=' + accessToken;
      document.getElementById('accessToken').innerHTML = accessToken;
      req(url, function (response) {
        response.friends.data.forEach(function(val){
          url = 'https://graph.facebook.com/' + val.id +
            '?fields=name,music.listens&access_token=' + accessToken;
          req(url, function (response) {
            var listens = response["music.listens"] && response["music.listens"].data;
            if(!listens) return;
            var listensElem = document.getElementById('listens');
            listensElem.innerHTML = listensElem.innerHTML + response.name + "<br>";
            // listensElem.innerHTML = listensElem.innerHTML + print(listens);
          });
        });
        // handle(response);
      });
    },
    onFailure: function(error) {
      console.log('Authentication failed with error: ' + error);
    },
    onComplete: function() { }
  });
}

function handle(response) {
  var listens = document.getElementById('listens');
  listens.innerHTML = listens.innerHTML + print(response);
}

function req(url, fn){
  $.ajax({url: url, success: fn});
}