angular.module('starter.services', [])

.factory('Songs', function() {
  // Might use a resource here that returns a JSON array


  //TODO: access firebase to gather all the songs

  //Populate the songs into this 
  // Some fake testing songs
  var songs = [{
    id: 0,
    artist: 'Flume',
    title: 'Paperthin',
    thumbnail: 'https://i1.sndcdn.com/artworks-000004688378-o32its-t500x500.jpg',
    votes: 10
  }, {
    id: 1,
    artist: 'Zedd',
    title: 'I Want You to Know',
    thumbnail: 'http://3.bp.blogspot.com/-bc2Owx2R40k/VOrClGI_8QI/AAAAAAAAB2k/8gXUdDx5vjk/s1600/zedd___i_want_you_to_know__both_together__by_dsrange431-d8hx0cu.png',
    votes: 0
  }, {
    id: 2,
    artist: 'Pokemon Soundtrack',
    title: 'The Pikachu Song',
    thumbnail: 'http://fc04.deviantart.net/fs70/f/2012/244/6/b/profile_picture_by_pikachu_song-d5d91ua.png',
    votes: 4
  }, {
    id: 3,
    artist: 'Rick Ross',
    title: 'Hustlin',
    thumbnail: 'http://clubtone.net/_ld/3508/350888.jpg',
    votes: 12
  }, {
    id: 4,
    artist: 'Kendrick Lamar',
    title: 'Bitch, Dont Kill My Vibe',
    thumbnail: 'http://upload.wikimedia.org/wikipedia/en/5/5e/Kendrick_Lamar_Bitch_Don\'t_Kill_My_Vibe.png',
    votes: 7
  }];

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
    }
  };
});
