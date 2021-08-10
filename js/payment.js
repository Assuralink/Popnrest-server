// A reference to Stripe.js initialized with your real test publishable API key.
var stripe = Stripe("pk_test_bIVegNr7PNOmkoc79fY3gvAW00uUsVA0Rs");

$(document).on("ready", function(){

    // Disable the button until we have Stripe set up on the page
    $("#StripeForm button").disabled = true;

    $.ajax({
        url: "/payments/stripe/create",
        type: 'POST',
        data: JSON.stringify({
            cartId: "cartId123"
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){

        console.log("Stripe payment create : ");
        console.log(response);

        displayStripePaymentForm(response.clientSecret);

	}).fail(function(err){
        console.error(err);
    });

});

function displayStripePaymentForm(clientSecret){

    var elements = stripe.elements();
    var style = {
        base: {
            border: "1px solid #dedede",
            color: "#212529",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
            color: "#212529"
            }
        },
        invalid: {
            fontFamily: 'Arial, sans-serif',
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    };

    var card = elements.create("card", { style: style });
    // Stripe injects an iframe into the DOM
    card.mount("#cardElement");
    card.on("change", function (event) {
        if(event.empty){
            $("#StripeForm button").addClass("disabled");
        }else{
            $("#StripeForm button").removeClass("disabled");
        }
        $("#card-error").textContent = event.error ? event.error.message : "";
    });

    $("#StripeForm").on("submit", function(event) {
        event.preventDefault();
        // Complete payment when the submit button is clicked
        payWithCard(stripe, card, clientSecret);
    });
}

function payWithCard(stripe, card, clientSecret){

    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card
        }
    }).then(function(result){
        if(result.error) {
        
            // var errorMsg = document.querySelector("#card-error");
            // errorMsg.textContent = errorMsgText;
            // setTimeout(function() {
            //     errorMsg.textContent = "";
            // }, 4000);

            console.error(result.error);

        }else{    

            var cartId = $("#data_cartIdentifier").val();
    
            $.ajax({
                url: "/carts/confirm_payment",
                type: 'POST',
                data: JSON.stringify({
                    cartId: cartId,
                    providerId: 1,
                    external_id: result.paymentIntent.id,
                    amount: result.paymentIntent.amount
                }),
                dataType: 'json',
                contentType: 'application/json'
            }).done(function(response){
                window.location.href = "/carts/id/"+cartId;
            }).fail(function(err){
                console.error(err);
            });
            
        }
    });
}