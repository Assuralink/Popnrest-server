$(document).on("ready", function(){

    get_user_details(function(response){
        $(".user_firstname").html(response.user.firstname);
    });

});

function get_user_details(callback){

    var userId = window.localStorage.getItem('userId');

    $.ajax({
        url: "/users/details",
        type: 'GET',
        data: {
            userId: userId
        },
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        callback(response);
	}).fail(function(err){
        console.error(err);
    });
}