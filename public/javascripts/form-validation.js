(function () {
  'use strict'
  window.addEventListener('load', function () {
    // get all forms
    var forms = document.getElementsByClassName('needs-validation')
    var password = document.getElementById('password')
    var rePassword = document.getElementById('rePassword')

    function validatePassword() {
      if (password.value !== rePassword.value) {
        rePassword.setCustomValidity("Passwords Don't Match")
      } else {
        rePassword.setCustomValidity("")
      }
    }

    // Add password confirmation to signup form
    if (password && rePassword) {
      password.addEventListener('input', validatePassword)
      rePassword.addEventListener('input', validatePassword)
    }

    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
  }, false)
})()