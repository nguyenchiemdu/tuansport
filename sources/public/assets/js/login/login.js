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

// Show the password 

    const iconShowPassword = document.querySelector('#show-hidden-icon')
    iconShowPassword.addEventListener('click', () => {
      
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
        passwordInput.setAttribute('type', type)

        const svg = document.getElementsByTagName('svg')[0]
        if (type === 'text') {
          $(svg).replaceWith(feather.icons['eye'].toSvg())
        } else {
          $(svg).replaceWith(feather.icons['eye-off'].toSvg())
        }
    })