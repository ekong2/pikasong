//This is where we create firebase.auth, we inject the firebase dependency as well as the factor we created in firebase.ref
angular.module('firebase.auth', ['firebase', 'firebase.ref'])

.controller('AuthCtrl', function($scope, $firebaseAuth, Ref) {
  $scope.AuthObj = $firebaseAuth(Ref);
});

