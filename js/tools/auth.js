function signup(cb){

    var firstname = $(".Form_Signup .form_firstname input").val();
    var lastname = $(".Form_Signup .form_lastname input").val();
    var email = $(".Form_Signup .form_email input").val();
    var password = $(".Form_Signup .form_password input").val();
    var confirmPassword = $(".Form_Signup .form_confirmPassword input").val();
    var phoneNumber = $(".Form_Signup .form_phoneNumber input").val();
    var birthday = $(".Form_Signup .form_birthday input").val();

    $(".Form_Signup .error_message").html('');

    $.ajax({
        url: "/users/signup",
        type: 'POST',
        data: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            phoneNumber: phoneNumber,
            birthday: birthday
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){

        window.localStorage.setItem('userId', response.user.id);
        window.localStorage.setItem('token', response.token);

        $(document).trigger("refresh_connectedUser");
        cb(response);

	}).fail(function(err){
        $(".Form_Signup .error_message").html(err.responseJSON.message);
    });
}

function login(cb){
    
    var email = $(".Form_Login .form_email input").val();
    var password = $(".Form_Login .form_password input").val();

    $(".Form_Login .error_message").html('');

    $.ajax({
        url: "/users/login",
        type: 'POST',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){

        window.localStorage.setItem('userId', response.user.id);
        window.localStorage.setItem('token', response.token);
        $(document).trigger("refresh_connectedUser");
        
        cb(response);
        
	}).fail(function(err){
        $(".Form_Login .error_message").html(err.responseJSON.message);
    });
}