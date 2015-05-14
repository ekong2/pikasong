angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('DjCtrl', function($scope, Songs) {

  $scope.search = {};

  $scope.searchSong = function(){
    SC.initialize({
      client_id: '2e75744c571473e8d226078a69bba4b3'
    });

    SC.get('/tracks', { q: $scope.search.query }, function(tracks) {
      console.log(tracks);
    });

     $scope.search.query = "";
  }


  $scope.songs = Songs.all();
//   $scope.play = function(id){
//    SC.stream("/tracks/" + id ,function(sound){
//       // Save sound, it holds all the data needed to stop, resume, etc.
//       $scope.soundObj = sound;
//       sound.play({
//       onfinish: function() {              
//           //Start a new song or something.
//         }
//       });
//   });
// }

// $scope.pause = function(){
//   $scope.soundObj.pause();
// }


})

.controller('ChatsCtrl', function($scope, Songs) {
  $scope.songs = Songs.all();
  
  $scope.remove = function(song) {
    Songs.remove(song);
  };

  $scope.upvote = function(song){
    Songs.upvote(song);
  };

  $scope.downvote = function(song){
    Songs.downvote(song);
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Songs) {
  $scope.song = Songs.get($stateParams.songId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
