angular.module('starter.services', [])

.factory('Songs', function($firebaseArray, Ref) {

  //Import firebase song array
  var songs = $firebaseArray(Ref.child('songs'));

  //Compute the total votes
  function computeTotal(){
    return songs.reduce(function(sum, song){
      return sum + song.votes;
    }, 0);
  };

  return {
    all: function() {
      return songs;
    },
    remove: function(song) {
      songs.splice(songs.indexOf(song), 1);
    },
    get: function(songId) {
      for (var i = 0; i < songs.length; i++) {
        if (songs[i].id === parseInt(songId)) {
          return songs[i];
        }
      }
      return null;
    },
    //Upvote a song and save to firebase
    upvote: function(song){
      song.votes++;
      songs.$save(song);
    },
    //Downvote a song and save to firebase
    downvote: function(song){
      song.votes--;
      songs.$save(song);
    },
    //Return the total number of votes
    total: function(){
      return computeTotal();
    },
    //Return the song with the max number of votes
    maxVotes: function(songs){
      return songs.reduce(function(max, song){
        return Math.max(max, song.votes);
      }, 0);
    }
  };
});
