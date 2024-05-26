document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    document.getElementById('signup-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const data = {
            formType: 'signup',
            username: event.target.email.value,
            password: event.target.password.value,
            alsoPassword: event.target.alsoPassword.value,
            fName: event.target.fName.value,
            lName: event.target.lName.value,
            phone: event.target.phone.value
        };

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                document.getElementById('signupError').innerText = data.message;
            }
        })
        .catch(error => {
            document.getElementById('signupError').innerText = 'An unknown error has occurred. Please try again.';
        });
    });

    document.getElementById('login-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const data = {
            formType: 'login',
            username: event.target.email.value,
            password: event.target.password.value
        };

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                document.getElementById('loginError').innerText = data.message;
            }
        })
        .catch(error => {
            document.getElementById('loginError').innerText = 'An unknown error has occurred. Please try again.';
        });
    });
});