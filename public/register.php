<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Sports Shop</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <h1 class="logo">⚡ Sports Shop</h1>
            <div class="nav-links">
                <a href="login.php">Login</a>
            </div>
        </div>
    </nav>

    <div class="auth-container">
        <div class="auth-card">
            <h2>Create Account</h2>
            <form id="registerForm">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="username" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" required>
                </div>
                <div id="errorMessage" class="error-message"></div>
                <button type="submit" class="btn btn-primary">Register</button>
            </form>
            <p class="auth-link">Already have an account? <a href="login.php">Login here</a></p>
        </div>
    </div>

    <script src="auth.js"></script>
</body>
</html>
