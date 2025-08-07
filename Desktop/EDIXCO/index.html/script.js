document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const pass = document.getElementById('password').value;
    const confirmPass = document.querySelector('input[name="confirm-new-password"]').value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[A-Za-z\s]+$/;


    if (!namePattern.test(name)) {
        alert("Invalid Name");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Invalid Email");
        return;
    }

    if (pass !== confirmPass) {
        alert("Confirm password does not match.");
        return;
    }
   // Check if user already exists
    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email]) {
        alert("You already have an account. Please sign in.");
        return;
    }

    // Store new user in localStorage
    users[email] = {
        name: name,
        password: pass
    };
    localStorage.setItem('users', JSON.stringify(users));

    // Welcome message
    alert(`HELLO, ${name}! Your account has been created successfully.`);


    // Redirect to another page
    window.location.href = "page.html";
});
