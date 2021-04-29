$(document).on("ready", function(){

    $(document).on("get_bookings_list", function(){
        get_bookings_list(function(response){
            display_upcoming_bookings(response);
            display_past_bookings(response);
        });
    });
    $(document).trigger("get_bookings_list");

});

function get_bookings_list(callback){
    $.ajax({
        url: "/customers/bookings",
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        if(response.statut){
            callback(response);
        }
	});
}

function display_upcoming_bookings(response){

    var template_Booking = $("#template_Booking").html();
    $("._content_upcoming_bookings_list").html('');

    if(Number(response.upcoming_bookings.length) > 0){

        $(".Upcoming_bookings ._list").css("display","block");
        $(".Upcoming_bookings .noElement").css("display","none");

        for(var i in response.upcoming_bookings){

            var booking = response.upcoming_bookings[i];

            $("._content_upcoming_bookings_list").append(template_Booking);
            var item = $("._content_upcoming_bookings_list").find(".Booking:last-child");

            $(item).find(".date").html(booking.date);
            $(item).find(".time").html(booking.time);
            $(item).find(".duration").html(booking.duration);
            $(item).find(".location").html(booking.location);
            $(item).find(".price").html(booking.price);
        }
    }else{
        $(".Upcoming_bookings ._list").css("display","none");
        $(".Upcoming_bookings .noElement").css("display","block");
    }
}

function display_past_bookings(response){

    var template_Booking = $("#template_Booking").html();
    $("._content_past_bookings_list").html('');

    if(Number(response.past_bookings.length) > 0){

        $(".Past_bookings ._list").css("display","block");
        $(".Past_bookings .noElement").css("display","none");

        for(var i in response.past_bookings){

            var booking = response.past_bookings[i];
            console.log(booking);

            $("._content_past_bookings_list").append(template_Booking);
            var item = $("._content_past_bookings_list").find(".Booking:last-child");

            $(item).find(".date").html(booking.date);
            $(item).find(".time").html(booking.time);
            $(item).find(".duration").html(booking.duration);
            $(item).find(".location").html(booking.location);
            $(item).find(".price").html(booking.price);
        }
    }else{
        $(".Past_bookings ._list").css("display","none");
        $(".Past_bookings .noElement").css("display","block");
    }
}