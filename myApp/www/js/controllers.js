angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Songs) {
  $scope.songs = Songs.all();
  console.log($scope.songs);
  $scope.remove = function(song) {
    Songs.remove(song);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Songs) {
  $scope.song = Songs.get($stateParams.songId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
