function login () {
  // (A) GET EMAIL + PASSWORD
  var data = new FormData(document.getElementById("login-form"));
  console.log(data)
  
  // (B) AJAX REQUEST
  fetch("/in", { method:"POST", body:data })
  .then((res) => {
    console.log(1);
    return res.text();
  })
  .then((txt) => {
    console.log(2)
    if (txt=="OK") { location.href = "../admin"; }
    else { alert(txt); }
  })
  .catch((err) => {
    alert("Server error - " + err.message);
    console.log('unauthorized error')
    console.error(err);
  });
  console.log('login false')
  return false;
}
