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

    var template_BookingLog = $("#template_BookingLog").html();
    var template_noElement = $("#template_noElement").html();

    $("#Upcoming_bookings ._content").html('');
    if(Number(response.upcoming_bookings.length) > 0){
        for(var p in response.upcoming_bookings){

            var bookingLog = response.upcoming_bookings[p];

            $("#Upcoming_bookings ._content").append(template_BookingLog);
            var item = $("#Upcoming_bookings ._content").find(".BookingLog");

            $(item).find(".date").html(bookingLog.date);
            $(item).find(".time").html(bookingLog.time);
            $(item).find(".duration").html(bookingLog.duration);
            $(item).find(".location").html(bookingLog.location);
            $(item).find(".price").html(bookingLog.price);

        }
    }else{
        $("#Upcoming_bookings ._content").append(template_noElement);
        $("#Upcoming_bookings ._content").find(".message_noElement ._content").html("No upcoming bookings");
    }

    $("#Past_bookings ._content").html('');
    if(Number(response.past_bookings.length) > 0){
        for(var p in response.past_bookings){

            var bookingLog = response.past_bookings[p];

            $("#Past_bookings ._content").append(template_BookingLog);
            var item = $("#Past_bookings ._content").find(".BookingLog");

            $(item).find(".date").html(bookingLog.date);
            $(item).find(".time").html(bookingLog.time);
            $(item).find(".duration").html(bookingLog.duration);
            $(item).find(".location").html(bookingLog.location);
            $(item).find(".price").html(bookingLog.price);

        }
    }else{
        $("#Past_bookings ._content").append(template_noElement);
        $("#Past_bookings ._content").find(".message_noElement ._content").html("No past bookings");
    }
}