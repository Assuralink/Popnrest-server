$(document).on("ready", function(){

    $(document).on("event_existantCart", function(e, cb){

        var cartId = window.localStorage.getItem('cart_identifier');
        get_cart_details(cartId, function(response){

            // IF booking is not expired, display modal existing booking in user's cart
            // ELSE, delete it
            // CB send to actionner if booking is expired or no
            if(!response.expired){

                $(".Booking_details .main_picture").css("background-image", "url(\""+response.images[0].url+"\")");
                $(".Booking_details .property_name ._content").html(response.title);
                $(".Booking_details .property_address").html(response.address);
                $(".Booking_details .booking_dates ._content").html(response.fromDate);
                $(".Booking_details .booking_duration ._content").html(response.durationString);
                $(".Booking_details .booking_totalPrice ._content").html(response.total+"£");
                
                $("#modal_existantCart").modal("show");
            }else{
                window.localStorage.removeItem('cart_identifier');
                cb(response.expired);
            }
        });
    });

    $("#modal_existantCart .Booking_details .actions .cancel").on("click", function(){
        $("#modal_existantCart").modal('hide');
        window.localStorage.removeItem('cart_identifier');
    });

    $("#modal_existantCart .Booking_details .actions .action").on("click", function(){
        var cartId = window.localStorage.getItem('cart_identifier');
        window.location.href = "/carts/id/"+cartId;
    });

});

function get_cart_details(cartId, callback){
    $.ajax({
        url: "/carts/details",
        type: 'GET',
        dataType: 'json',
        data: {
            cartId: cartId
        },
        contentType: 'application/json'
    }).done(function(response){
        console.log(response);
        callback(response);
	}).fail(function(err){
        
    });
}