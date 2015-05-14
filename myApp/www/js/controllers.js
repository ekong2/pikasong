angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('DjCtrl', function($scope, Songs, $firebaseObject, $firebaseArray, Ref) {

  var songsRef = Ref.child('songs');
  var songs = $firebaseArray(songsRef);

  $scope.queriedSongs = [];
  $scope.search = {};

  $scope.searchSong = function(){
    SC.initialize({
      client_id: '2e75744c571473e8d226078a69bba4b3'
    });

    $scope.queriedSongs = [];

    SC.get('/tracks', { q: $scope.search.query }, function(tracks) {
      $scope.$apply(function(){
        for (var i = 0; i < tracks.length; i++){
          var song = tracks[i];
          $scope.queriedSongs.push({
            id: song.id,
            title: song.title,
            count: song.playback_count,
            thumbnail: song.artwork_url,
            year: song.release_year
          });
        }
      });
    });

    $scope.search.query = "";
  }

  $scope.queueSong = function(song){
    songs.$add(song);
    $scope.queriedSongs.splice($scope.queriedSongs.indexOf(song),1);
  }

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
