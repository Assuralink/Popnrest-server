$(document).on("ready", function(){

    $(".Form_login .action").on("click", function(){
        login();
    });
    

});

function login(){

    var email = $(".Form_login .form_email input").val();
    var password = $(".Form_login .form_password input").val();

    $.ajax({
        url: "/customers/login",
        type: 'POST',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        if(response.statut){
            window.location.href = '/customers/bookings-log';
        }else{
            
        }
	});
}