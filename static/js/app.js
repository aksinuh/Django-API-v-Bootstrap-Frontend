$(document).ready(function() {
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        // AJAX ilə Django backend-ə login sorğusu
        $.ajax({
            url: '/api/login/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: function(response) {
                // Tokeni localStorage-ə yaz
                if (response.token) {
                    localStorage.setItem('authToken', response.token);
                    window.location.href = 'tasks.html';
                } else {
                    alert('Token alınmadı!');
                }
            },
            error: function(xhr) {
                let errorMsg = 'Login uğursuz oldu';
                if (xhr.responseJSON && xhr.responseJSON.detail) {
                    errorMsg += ': ' + xhr.responseJSON.detail;
                }
                alert(errorMsg);
            }
        });
    });
});


$(document).ready(function() {
    $('#registerForm').submit(function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const email = $('#email').val();
        const password1 = $('#password1').val();
        const password2 = $('#password2').val();
        
        if (password1 !== password2) {
            alert('Şifrələr uyğun gəlmir!');
            return;
        }
        
        $.ajax({
            url: '/api/register/',
            method: 'POST',
            data: {
                username: username,
                email: email,
                password: password1
            },
            success: function(response) {
                alert('Qeydiyyat uğurla tamamlandı!');
                window.location.href = 'login.html';
            },
            error: function(xhr) {
                alert('Qeydiyyat uğursuz oldu: ' + xhr.responseText);
            }
        });
    });
});