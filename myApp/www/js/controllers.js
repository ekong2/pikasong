angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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
