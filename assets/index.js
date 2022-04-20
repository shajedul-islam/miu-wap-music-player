window.onload = function (event) {
  if (!sessionStorage.getItem('isLoggedIn')) {
    document.getElementById("logout-btn").style.display = "none";
    let elem = document.getElementById('play_list');
    elem.innerHTML = '';
    document.getElementById("searchInput").style.display = "none";
    document.getElementById('audio-player').style.display = 'none';
    document.getElementById('play_list_div').style.display = 'none';
    document.getElementById('list-song').style.display = 'none';
  } else {
    document.getElementById("login-form").style.display = "none";
    document.getElementById('play_list_div').style.display = 'block';
    document.getElementById('list-song').style.display = 'block';
    document.getElementById("searchInput").style.display = "block";
    getSongList();
    getPlayList();
  }

}

var userid = null;
var track_list = [];


 function validate(event) {
  var data = new FormData(document.getElementById("login-form"));

  let r = undefined
   fetch("/in", {method: "POST", body: data})
    .then(response => response.text())
    .then(result => {
      r = result;
    })
    .catch(error => console.log('error', error));
    document.getElementById("login-form").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("searchInput").style.display = "inline";
    document.getElementById('audio-player').style.display = 'block';
   document.getElementById("login-form").style.display = "none";
    sessionStorage.setItem("isLoggedIn", 'true');
    getSongList();
    getPlayList();
    return false;
}

 function getSongList() {
  var myHeaders = new Headers();
  myHeaders.append("userid", userid);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  let songList = [];
  fetch("/song", {method: 'POST', body: ''})
    .then(response => response.json())
    .then(data => {
      constructTable(data, 'song_list');
    })
    .catch(error => console.log('error', error));
  // console.log(songList.);
  return songList;
}


async function getPlayList() {
  var myHeaders = new Headers();
  myHeaders.append("userid", userid);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  let playList = [];
  await fetch("http://localhost:3000/song-list/playlist", requestOptions)
    .then(response => response.json())
    .then(data => {
      let elem = document.getElementById('play_list');
      if (data.length > 0) {
        elem.innerHTML = '';
      } else {
        console.log('inside else');
        // elem.removeChild(elem.childNodes);
        elem.innerHTM = 'You have no Song on your Playlist';
      }
      constructTable(data, 'play_list', true);
      track_list = [];
      data.forEach(value => track_list.push(value));
      loadTrack(0);
    })
    .catch(error => console.log('error', error));
  return playList;
}


async function getSong(songID) {
  var myHeaders = new Headers();
  myHeaders.append("userid", userid);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  let song = [];
  await fetch(`http://localhost:3000/song-list/song/${songID}/`, requestOptions)
    .then(response => response.json())
    .then(result => result.forEach(x => song.push(x)))
    .catch(error => console.log('error', error));
  return song[0];
}

async function addToPlaylist(songID) {
  var myHeaders = new Headers();
  myHeaders.append("userid", userid);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };
  let playList = [];
  await fetch(`http://localhost:3000/song-list/song/${songID}/`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
  return playList;
}


async function deleteSongFromPlayList(songID) {
  var myHeaders = new Headers();
  myHeaders.append("userid", userid);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };
  let playList = [];
  await fetch(`http://localhost:3000/song-list/playlist/${songID}/`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
  return playList;
}


async function logout() {
  var myHeaders = new Headers();
  console.log(userid);
  myHeaders.append("userid", userid);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("http://localhost:3000/authentication/logout", requestOptions)
    .then(response => response.json())
    .then(result => {
      document.getElementById("login-form").style.display = "block";
      document.getElementById("logout-btn").style.display = "none";
      document.getElementById('searchInput').style.display = 'none';
      document.getElementById('audio-player').style.display = 'none';
      getPlayList();
      getSongList();
    })
    .catch(error => console.log('error', error));
  sessionStorage.clear()
  window.location.reload()
}


function constructTable(myList, selector, hasPlay) {
  let col = [];
  for (let i = 0; i < myList.length; i++) {
    for (let key in myList[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  // Create a table.
  let table = document.createElement("table");

  // Create table header row using the extracted headers above.
  let tr = table.insertRow(-1);                   // table row.

  for (let i = 0; i < col.length - 2; i++) {
    let th = document.createElement("th");      // table header.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }
  if (myList.length > 0) {
    th = document.createElement("th");
    th.innerHTML = 'action';
    tr.append(th);
    if (hasPlay) {
      th = document.createElement("th");
      th.innerHTML = 'playSong';
      tr.append(th);
    }
  }


  // add json data to the table as rows.
  for (let i = 0; i < myList.length; i++) {

    tr = table.insertRow(-1);

    for (let j = 0; j < col.length - 2; j++) {
      console.log(j);
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = myList[i][col[j]];
    }

    addButtonsToTable(hasPlay, myList, i, tr);
  }

  // Now, add the newly created table with json data, to a container.
  let divShowData = document.getElementById(selector);
  divShowData.innerHTML = "";
  divShowData.appendChild(table);
}


function addButtonsToTable(hasPlay, myList, index, tr) {
  let tabCell = tr.insertCell(-1);
  let btn = document.createElement("button");
  if (hasPlay) {
    btn.innerHTML = 'remove Song';
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      deleteSongFromPlayList(myList[index]['id']);
      getPlayList();
    });
  } else {
    btn.innerHTML = "Add Song";
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      addToPlaylist(myList[index]['id']);
      getPlayList();
    });
  }
  tabCell.appendChild(btn);
  if (hasPlay) {
    let tabCell = tr.insertCell(-1);
    let btn = document.createElement("button");
    btn.innerHTML = "Play Song";
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      // addToPlaylist(myList[index]['id']);
      // getPlayList();
      loadTrack(index);
      playTrack();
    });
    tabCell.appendChild(btn);
  }
}


function searchSongList() {
  let input, filter, table, tr, td, i, txtValue, div_tbl;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  div_tbl = document.getElementById('song_list');
  table = div_tbl.childNodes[0];
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


console.log('here');


// Select all the elements in the HTML page
// and assign them to a variable
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
console.log(playpause_btn);
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

// Specify globally used values
let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create the audio element for the player
let curr_track = document.createElement('audio');
curr_track.setAttribute('crossorigin', 'anonymous');

// Define the list of tracks that have to be played


function loadTrack(track_index) {
// Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();

// Load a new track
  console.log(track_list);
  console.log(track_list[track_index]['fileLocation']);
  curr_track.src = track_list[track_index]['fileLocation'];
  curr_track.load();

// Update details of the track
  track_name.textContent = track_list[track_index]['songTitle'];
  // track_artist.textContent = track_list[track_index].artist;


// Set an interval of 1000 milliseconds
// for updating the seek slider
  updateTimer = setInterval(seekUpdate, 1000);

// Move to the next track if the current finishes playing
// using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);

}


// Function to reset all values to their default
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
// Switch between playing and pausing
// depending on the current state
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
// Play the loaded track
  curr_track.play().catch(error => console.log(error));
  isPlaying = true;

// Replace icon with the pause icon
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
// Pause the loaded track
  curr_track.pause();
  isPlaying = false;

// Replace icon with the play icon
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
// Go back to the first track if the
// current one is the last in the track list
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;

// Load and play the new track
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
// Go back to the last track if the
// current one is the first in the track list
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;

// Load and play the new track
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
// Calculate the seek position by the
// percentage of the seek slider
// and get the relative duration to the track
  seekto = curr_track.duration * (seek_slider.value / 100);

// Set the current track position to the calculated seek position
  curr_track.currentTime = seekto;
}

function setVolume() {
// Set the volume according to the
// percentage of the volume slider set
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

// Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    // Add a zero to the single digit time values
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

var shuffleEnabled = false;

function shuffle() {
  const rand = Math.floor(Math.random() * (track_list.length));
  loadTrack(rand);
  if (shuffleEnabled) {
    document.getElementById('shuffle').innerHTML = '<i class="fa-duotone fa-shuffle fa-2x"></i>';
  }else{
    document.getElementById('shuffle').innerHTML = '<i class="fa-thin fa-shuffle fa-2x"></i>';
  }
}

var loopCounter = 0;
var loopEnabled = false;

function loop() {
  curr_track.loop = !loopEnabled;
  loopEnabled = !loopEnabled;
  loopCounter ++;
  if (loopCounter%3 === 0) document.getElementById('repeat').innerHTML = '<i class="fa-thin fa-repeat fa-2x"></i>';
  else if(loopCounter%3 === 1) document.getElementById('repeat').innerHTML = '<i class="fa-duotone fa-repeat fa-2x"></i>';
  else document.getElementById('repeat').innerHTML = '<i class="fa-duotone fa-repeat-1 fa-2x"></i>';

}


// Load the first track in the tracklist
// loadTrack(track_index);




