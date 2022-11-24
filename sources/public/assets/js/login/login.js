const loginForm = document.getElementById('login-form');
const loginBtn = document.querySelector('.btn')


async function submit() {
    const email = loginForm['email'].value
    const password = loginForm['password'].value
    const emailBox = loginForm['email']
    const passwordBox = loginForm['password']
    

    const result = await fetch('/login', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email, password
          })
      })
      .then(res => console.log(res.json()))
      .catch(err => err.json())
    console.log(result) 
}

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    loginForm.submit();
})