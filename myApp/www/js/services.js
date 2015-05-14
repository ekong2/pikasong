angular.module('starter.services', [])

.factory('Songs', function() {
  // Might use a resource here that returns a JSON array


  //TODO: access firebase to gather all the songs

  //Populate the songs into this 
  // Some fake testing songs
  var songs = [{
    id: 0,
    title: 'Flume - Paperthin',
    thumbnail: 'https://i1.sndcdn.com/artworks-000004688378-o32its-t500x500.jpg',
    votes: 10
  }, {
    id: 1,
    title: 'Zedd - I Want You to Know',
    thumbnail: 'http://3.bp.blogspot.com/-bc2Owx2R40k/VOrClGI_8QI/AAAAAAAAB2k/8gXUdDx5vjk/s1600/zedd___i_want_you_to_know__both_together__by_dsrange431-d8hx0cu.png',
    votes: 0
  }, {
    id: 2,
    title: 'Pokemon Soundtrack - The Pikachu Song',
    thumbnail: 'http://fc04.deviantart.net/fs70/f/2012/244/6/b/profile_picture_by_pikachu_song-d5d91ua.png',
    votes: 4
  }, {
    id: 3,
    title: 'Rick Ross - Hustlin',
    thumbnail: 'http://clubtone.net/_ld/3508/350888.jpg',
    votes: 12
  }, {
    id: 4,
    title: 'Kendrick Lamar - Bitch, Dont Kill My Vibe',
    thumbnail: 'http://upload.wikimedia.org/wikipedia/en/5/5e/Kendrick_Lamar_Bitch_Don\'t_Kill_My_Vibe.png',
    votes: 7
  }];

  var totalVotes = songs.reduce(function(sum, song){
    return sum + song.votes;
  }, 0);

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
      totalVotes++;
    },
    downvote: function(song){
      song.votes--;
      totalVotes--;
    },
    total: function(){
      return totalVotes;
    },
    maxVotes: function(songs){
      return songs.reduce(function(max, song){
        return Math.max(max, song.votes);
      }, 0);
    }
  };
});
