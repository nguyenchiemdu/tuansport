const loginForm = document.getElementById('login-form');
const loginBtn = document.querySelector('.btn')
const usernameInput = loginForm['username']
const passwordInput = loginForm['password']
const inputBoxes = document.querySelectorAll('.input-box')

async function submit() {
  let body = {
    username: loginForm['username'].value,
    password: loginForm['password'].value
  }
  await fetch('http://localhost:3000/login', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
    .then(res =>
      {
        result = res
        if (!result.success) {
          inputBoxes.forEach(inputBox =>{
            inputBox.classList.add('is-invalid')
          })
          document.getElementById('form-message').innerText = result.message
      } else {
        document.cookie='token='+result.data.token
        window.location.href = '/'
        inputBoxes.forEach(inputBox =>{
          inputBox.classList.remove('is-invalid')
        })
      }
    }
    )

    
}

loginForm.oninput = function () {
  inputBoxes.forEach(inputBox => {
    inputBox.classList.remove('is-invalid')
  })
}

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    submit();
})
// Show hide password
    function password_show_hide() {
      var x = document.getElementById("password");
      var show_eye = document.getElementById("show_eye");
      var hide_eye = document.getElementById("hide_eye");
      hide_eye.classList.remove("d-none");
      if (x.type === "password") {
        x.type = "text";
        show_eye.style.display = "none";
        hide_eye.style.display = "block";
      } else {
        x.type = "password";
        show_eye.style.display = "block";
        hide_eye.style.display = "none";
      }
    }