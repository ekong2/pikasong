angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $firebaseObject, Ref) {

  var currentSong = $firebaseObject(Ref.child('currentSong'));
  currentSong.$bindTo($scope, 'nowPlaying');

})

.controller('DJModeCtrl', function($scope, $firebaseArray, $firebaseObject, Ref){
  $scope.nowPlaying = null;
  $scope.soundObj = null;

  //Initialize reference to firebase songs table/object
  //Create a firebase array which holds the songs from firebase
  var songs = $firebaseArray(Ref.child('songs'));

  //Initialize reference to firebase currentSong object
  //Create a firebase object which holds the currentSong from firebase
  var currentSong = $firebaseObject(Ref.child('currentSong'));

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
        console.log($scope.nowPlaying);
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
            //On finish, play next song
            onfinish: function(){
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

    //Query soundcloud to get songs from query in search form
    SC.get('/tracks', { q: $scope.search.query }, function(tracks) {
      $scope.$apply(function(){
        //For every song returned, create an object and push it 
        //into $scope.queriedSongs
        for (var i = 0; i < tracks.length; i++){
          var song = tracks[i];
          $scope.queriedSongs.push({
            id: song.id,
            title: song.title,
            count: song.playback_count,
            thumbnail: song.artwork_url,
            year: song.release_year,
            uploader: song.user.username,
            percent: 0,
            votes: 1
          });
        }
      });
    });

    //Clear search input box
    $scope.search.query = "";
  };

  $scope.queueSong = function(song){
    var songAlreadyExists = false;
    //Check to see whether song already exists or not
    for (var i = 0; i < songs.length; i++){
      var queuedSong = songs[i];
      //If it does, we update its vote count and update firebase
      if (queuedSong.id === song.id){
        queuedSong.votes++;
        songs.$save(i);
        songAlreadyExists = true;
      }
    }
    //If song doesn't already exist in Firebase, add it
    if (!songAlreadyExists){
      songs.$add(song);
    }
    //Remove song from the queriedSongs list
    $scope.queriedSongs.splice($scope.queriedSongs.indexOf(song),1);
  };
})

.controller('ChatsCtrl', function($scope, Songs) {

  $scope.songs = Songs.all();
  $scope.voteReady = true;

  //Remove a song from the vote page
  $scope.remove = function(song) {
    Songs.remove(song);
    $scope.computePercents($scope.songs);
  };

  //Upvote a song
  $scope.upvote = function(song){
    console.log($scope.voteReady)
    if($scope.voteReady){
      Songs.upvote(song);
      $scope.computePercents($scope.songs);
      $scope.voteReady = false;
    }
  };

  //Downvote a song
  $scope.downvote = function(song){
    if($scope.voteReady){
      Songs.downvote(song);
      $scope.computePercents($scope.songs);
      $scope.voteReady = false;
    }
  };

  //Computes the percent and normalize for display purposes
  $scope.computePercents = function(songs){
    var totalVotes = Songs.total();
    // //Normalization factor not used right now, but will turn back on later
    var maxVotes = Songs.maxVotes($scope.songs);
    var normalizeFactor = maxVotes === 0 ? 0 : Math.floor(totalVotes/maxVotes * 5) / 5;
    for(var i = 0; i < songs.length; i++){
      songs[i].percent = totalVotes < 1 ? 0 : Math.max(songs[i].votes, 0) * normalizeFactor / totalVotes;
    }
  };

  //Inititalize the percentages to display
  $scope.songs.$loaded().then(function(){
    $scope.computePercents($scope.songs);
  });
  
  //Every 30 seconds allow people to vote again
  setInterval(function(){
    $scope.voteReady = true;
    $scope.$apply();
  }.bind($scope), 15000);

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Songs) {
  $scope.song = Songs.get($stateParams.songId);
});

