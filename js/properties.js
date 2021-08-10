$(document).on("ready", function(){

    $(document).on("refresh_livePrice", function(){

        var propertyId = $("#data_propertyId").val();
        var date = $(".Form_MakeBooking  .form_date input").val();
        var time = $(".Form_MakeBooking  .form_time input").val();
        var duration = $(".Form_MakeBooking  .form_duration select").val();

        calculate_bookingPrice(propertyId, date, time, duration, function(response){

            // Is instant booking ?
            if(response.is_instant_booking){
                $(".BookingForm button.action.primary").html("Instant booking");
            }else{
                $(".BookingForm button.action.primary").html("Book");
            }

            $(".form_livePrice ._content").html('£'+response.price);
        });



    });

    $(".form_duration select").on("change", function(){
        $(document).trigger("refresh_livePrice");
    });

    $(".BookingForm button.action").on("click", function(){
        if(window.localStorage.getItem('cart_identifier') != null){
            $(document).trigger("event_existantCart", function(isExpired){
                if(isExpired){
                    addBooking();
                }
            });
        }else{
            addBooking(); 
        }
    });

});

function addBooking(){

    var userId = window.localStorage.getItem('userId');
    if(typeof userId === 'undefined' || userId == 'undefined'){
        userId = 0;
    }
    var propertyId = $("#data_propertyId").val();
    var date = $(".form_date input").val();
    var time = $(".form_time input").val();
    var duration = $(".form_duration select").val();

    $.ajax({
        url: "/bookings/add",
        type: 'POST',
        data: JSON.stringify({
            userId: userId,
            propertyId: propertyId,
            date: date,
            time: time,
            duration: duration
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){

        window.localStorage.setItem('cart_identifier', response.identifier);

        if(response.userId > 0){
            window.location.href = "/carts/id/"+response.identifier;
        }else{
            $("#modal_signup").modal("show");
        }
        

	}).fail(function(err){
        console.log(err);
    });
}

function calculate_bookingPrice(propertyId,date,time,duration,callback){
    $.ajax({
        url: "/bookings/calculate",
        type: 'GET',
        data: {
            propertyId: propertyId,
            date: date,
            time: time,
            duration: duration
        },
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        callback(response);
	}).fail(function(err){
        console.log(err);
    });
}