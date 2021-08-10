$(document).on("ready", function(){

    get_user_details(function(response, err){
        if(!err){   
            $(".user_firstname").html(response.user.firstname);
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