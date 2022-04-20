const Song = require("./song");
let users = [];

class User {

  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.playlist = [];
  }

  setLoginTime(time){
    this.loginTime = time;
  }

  static getUser(username){
    const index = users.findIndex(x => x.username === username);
    if (index > -1) {
      console.log("Validation Success!");
      return users[index];
    }else {
      throw new Error("Unable to find the user!");
    }
  }

  save() {
    users.push(this);
    return this;
  }

  fetchPlaylist() {
    return this.playlist;
  }

  addToPlaylist(song) {
    if(this.playlist.find(x=>x.id === song)){
      return this.playlist;
    }
    this.playlist.push(Song.getSong(song));
    return this.playlist;
  }

  removeFromPlaylist(song) {
    const index = this.playlist.findIndex(x => x.id === song);
    if (index > -1) {
      this.playlist.splice(index,1);
    }else {
      throw new Error("Unable to find the song!");
    }
    return this.playlist;
  }


  static fetchAll() {
    return users;
  }


}

const user1 = new User("k", "123").save();
const user2 = new User("t", "1234").save();
user1.addToPlaylist(Song.fetchAll()[4].id);
user1.addToPlaylist(Song.fetchAll()[0].id);
user1.addToPlaylist(Song.fetchAll()[7].id);
user1.addToPlaylist(Song.fetchAll()[1].id);


module.exports = User;
