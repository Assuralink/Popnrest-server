$(document).on("ready", function(){
    
    $(document).on("refresh_connectedUser", function(){

        var userId = window.localStorage.getItem('userId');
        if(typeof userId === 'undefined' || userId == 'undefined'){
            userId = 0;
        }

        if(userId > 0){
            get_user_details(function(response, err){
                if(!err){

                    console.log("> User details");
                    console.log(response);

                    $(".Profil .profil_username").html(response.user.firstname+" "+response.user.lastname);

                    $(".Profil .logout_button").css("display","block");
                    $(".Profil .login_button").css("display","none");

                }else{
                    console.error(err);
                }
            });
        }else{
            $(".Profil .profil_icon").removeClass("connected");
            $(".Profil .profil_username").html("New user");
            $(".Profil .logout_button").css("display","none");
            $(".Profil .login_button").css("display","block");
        }

    });
    $(document).trigger("refresh_connectedUser");

    $(".logout_btn").on("click", function(){
        window.location.href = "/";
        window.localStorage.clear();
        $(document).trigger("refresh_connectedUser");
    });

    $(".toogle_menu").on("click", function(){
        if(
            $(".user_submenu").hasClass("toogle")
        ){
            $(".user_submenu").removeClass("toogle")
        }else{
            $(".user_submenu").addClass("toogle")
        }
    });


});

function get_user_details(callback){
    
    var userId = window.localStorage.getItem('userId');

    $.ajax({
        url: "/users/details",
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        },
        type: 'GET',
        data: {
            userId: userId
        },
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        callback(response, null);
	}).fail(function(err){
        callback(null, err);
    });
}