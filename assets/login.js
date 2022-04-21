function login() {
  // (A) GET EMAIL + PASSWORD
  var data = new FormData(document.getElementById("login-form"));
  console.log(data)

  // (B) AJAX REQUEST
  fetch("/in", {method: "POST", body: data})
      .then((res) => {
        console.log(1);
        return res.text();
      })
      .then((txt) => {
        console.log(2)
        if (txt == "OK") {
          document.getElementById("login-form").style.display = "none";
          document.getElementById("logout-btn").style.display = "block";
          document.getElementById("searchInput").style.display = "inline";
          document.getElementById('audio-player').style.display = 'block';
          document.getElementById("login-form").style.display = "none";
          sessionStorage.setItem("isLoggedIn", 'true');
          getSongList();
          getPlayList();
          // location.href = "../admin";
        } else {
          console.log('2 else')
          alert(txt);
        }
      })
      .catch((err) => {
        alert("Server error - " + err.message);
        console.log('unauthorized error')
        console.error(err);
      });
  console.log('login false')
  return false;
}
