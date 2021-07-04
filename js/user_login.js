$(document).on("ready", function(){

    $(".btn_login").on("click", function(){
        login();
    });

});

function login(){

    var email = $(".Form_login .form_email input").val();
    var password = $(".Form_login .form_password input").val();

    $.ajax({
        url: "/users/login",
        type: 'POST',
        data: JSON.stringify({
            email: email,
            password: password,
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        window.localStorage.setItem('userId', response.user.id);
        window.localStorage.setItem('token', response.token);
        window.location.replace("/users/account");
	}).fail(function(err){
        $(".error_message").html(err.responseJSON.message);
    });
}