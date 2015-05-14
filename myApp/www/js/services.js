angular.module('starter.services', [])

.factory('Songs', function($firebaseArray, Ref) {

  var songs = $firebaseArray(Ref.child('songs'));

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
    upvote: function(song){
      song.votes++;
      songs.$save(song);
    },
    downvote: function(song){
      song.votes--;
      songs.$save(song);
    },
    total: function(){
      return computeTotal();
    },
    maxVotes: function(songs){
      return songs.reduce(function(max, song){
        return Math.max(max, song.votes);
      }, 0);
    }
  };
});
