$(document).on("ready", function(){

    var theme_mode = $("#data_theme_mode").val();
    $(document).trigger("change_theme_mode", theme_mode);

    $("#link_LoginForm").on("click", function(){
        $("#Signup_section").css("display","none");
        $("#Login_section").css("display","block");
    });
    $("#link_SignupForm").on("click", function(){
        $("#Signup_section").css("display","block");
        $("#Login_section").css("display","none");
    });

    $(".Form_Signup button.action").on("click", function(){
        signup(function(response){
            $("#Signup_section").css("display","none");
            $("#Authentification_granteed").css("display","block");
            $("#Authentification_granteed").find(".firstname").html(response.user.firstname);
        });
    });

    $(".Form_Login button.action").on("click", function(){
        login(function(response){
            $("#Login_section").css("display","none");
            $("#Authentification_granteed").css("display","block");
            $("#Authentification_granteed").find(".firstname").html(response.user.firstname);
        });
    });



    $("#applyPromotionalCode").on("click", function(){
        applyPromotionalCode();
    });

    $("#cancel_booking").on("click", function(){
        window.localStorage.removeItem('cart_identifier');
        window.location.href = "/";
    });
    


    $(document).on("refresh_connectedUser", function(){

        var userId = window.localStorage.getItem('userId');
        if(typeof userId === 'undefined' || userId == 'undefined'){
            userId = 0;
        }

        if(userId > 0){
            get_user_details(function(response, err){
                if(!err){
                    $(".Authentification_granteed .username").html(response.user.firstname);
                }else{
                    console.error(err);
                }
            });
        }

    });

    $(document).on("refresh_cart_details", function(){

        var cartId = $("#data_cartIdentifier").val();

        get_cart_details(cartId, function(response){

            // Promotional code
            if(response.promotional_code != null){

                $("#PromotionalCodeApplied").css("display","block");
                $("#HavePromotionalCode").css("display","none");
                $("#PromotionalCodeApplied .code").html(response.promotional_code.code);
                $("#PromotionalCodeApplied .reduction").html(response.promotional_code.reduction);
                $("#PromotionalCodeApplied .old_price").html(response.promotional_code.old_total);
                $("#PromotionalCodeApplied .new_price").html(response.promotional_code.new_total);

                $("#CartDetails .price").html(response.promotional_code.new_total);

            }else{
                $("#PromotionalCodeApplied").css("display","none");
                $("#HavePromotionalCode").css("display","block");
            }

        });
    });
    $(document).trigger("refresh_cart_details");


    var stripe = Stripe('pk_test_bIVegNr7PNOmkoc79fY3gvAW00uUsVA0Rs');
    var elements = stripe.elements();
    

});

function applyPromotionalCode(){

    var cartId = $("#data_cartIdentifier").val();
    var code = $(".PromotionalCodeForm input").val();

    $.ajax({
        url: "/bookings/promotional/add",
        type: 'POST',
        data: JSON.stringify({
            cartId: cartId,
            code: code
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(){
        $(document).trigger("refresh_cart_details");
	}).fail(function(err){
        console.error(err);
    });
}

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