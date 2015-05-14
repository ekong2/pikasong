angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('DJModeCtrl', function($scope, $firebaseArray, $firebaseObject, Ref){
  $scope.nowPlaying = null;
  $scope.soundObj = null;

  //Initialize reference to firebase songs table/object
  var songsRef = Ref.child('songs');
  //Create a firebase array which holds the songs from firebase
  var songs = $firebaseArray(songsRef);

  //Initialize reference to firebase currentSong object
  var currentSongRef = Ref.child('currentSong');
  //Create a firebase object which holds the currentSong from firebase
  var currentSong = $firebaseObject(currentSongRef);

  //Have the currentSong object in firebase always update when $scope.nowPlaying
  //is updated. This is 3 way binding
  currentSong.$bindTo($scope, 'nowPlaying');
  //If user clicks on play button
  $scope.startPlaying = function(){
    //If there's a song already playing, pause it
    if ($scope.soundObj){
      $scope.soundObj.stop();
    }

    songs.$loaded().then(function() {
      //Search for song with max number of votes
      if (songs.length !== 0){
        var maxVotes = 0;
        var indexOfMax = 0;
        for (var i = 0; i < songs.length; i++){
          var song = songs[i];
          if (song.votes > maxVotes){
            indexOfMax = i;
            maxVotes = song.votes;
          }
        }
        //Set most popular song to $scope.nowPlaying, remember this also updates
        //the firebase currentSong due to 3 way binding
        $scope.nowPlaying = songs[indexOfMax];
        //Remove it from firebase's song table
        songs.$remove(indexOfMax);
        
        //Soundcloud initialization
        SC.initialize({
          client_id: '2e75744c571473e8d226078a69bba4b3'
        });

        //API call to soundcloud to get the track.
        SC.stream("/tracks/" + $scope.nowPlaying.id, function(sound){
          $scope.soundObj = sound;
          sound.play({
            onEnd: function(){
              $scope.startPlaying();
            }
          });
        });
      }
    });
  };
})

.controller('DjCtrl', function($scope, Songs, $firebaseArray, Ref) {

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
            year: song.release_year,
            votes: 1
          });
        }
      });
    });

    $scope.search.query = "";
  };

  $scope.queueSong = function(song){
    songs.$add(song);
    $scope.queriedSongs.splice($scope.queriedSongs.indexOf(song),1);
  };
})

.controller('ChatsCtrl', function($scope, Songs) {
  $scope.songs = Songs.all();

  $scope.remove = function(song) {
    Songs.remove(song);
    $scope.computePercents($scope.songs);
  };

  $scope.upvote = function(song){
    Songs.upvote(song);
    $scope.computePercents($scope.songs);
  };

  $scope.downvote = function(song){
    Songs.downvote(song);
    $scope.computePercents($scope.songs);
  };

  // $scope.sort = function(){
  //   $scope.songs.sort(function(a, b){return b.votes-a.votes});
  // };

  $scope.computePercents = function(songs){
    var totalVotes = Songs.total();
    var maxVotes = Songs.maxVotes($scope.songs);
    var normalizeFactor = maxVotes === 0 ? 0 : 0.9/(maxVotes);
    for(var i = 0; i < songs.length; i++){
      songs[i].percent = Math.max(songs[i].votes, 0) * normalizeFactor;
    }
  };

  // $scope.timer = 0;

  // $scope.$watch('votes', function(){
  //   $window.clearTimeout($scope.timer);
  //   $scope.timer = $window.setTimeout(rearrange, 100);
  // });

  // function rearrange(){
  //     $('.item').each(function(idx, el){
  //       var $el = $(el);        
  //       var newTop = idx * $config.OFFSET_Y;

  //       if (newTop != parseInt($el.css('top'))) {
  //         $el.css({
  //           'top': newTop
  //         })
  //         .one('webkitTransitionEnd', function (evt){
  //           $(evt.target).removeClass('moving');
  //         })
  //         .addClass('moving');  
  //       }
        
  //     });
  //   }

  $scope.computePercents($scope.songs);
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Songs) {
  $scope.song = Songs.get($stateParams.songId);
});

