$(document).on("ready", function(){

    $(document).on("refresh_bookingLog", function(){
        generer_bookingLog(afficher_bookingLog)
    });
    $(document).trigger("refresh_bookingLog");

});

function generer_bookingLog(callback){

    var userId = window.localStorage.getItem('userId');
   
    $.ajax({
        url: "/users/bookings",
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
        callback(response);
	}).fail(function(err){
        
    });
}

function afficher_bookingLog(response){
    console.log(response);
}