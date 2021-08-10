$(document).on("ready", function(){

    // Sign up Modal
    $(".Form_Signup .action").on("click", function(){

        signup(function(response){

            var cart_identifier = window.localStorage.getItem('cart_identifier');
            var userId = window.localStorage.getItem('userId');

            if(typeof cart_identifier === 'undefined' || cart_identifier == 'undefined'){
                $("#modal_signup").modal("hide");
            }else{
                assign_cart_to_user(cart_identifier,userId,function(response,err){
                    if(!err){
                        window.location.href = "/carts/id/"+cart_identifier;
                    }else{
                        console.error(err);
                    }
                });
            }
        });
    });

    $("#modal_signup .close_modal").on("click", function(){
        $("#modal_signup").modal("hide");
    });

    $("#link_LoginForm").on("click", function(){
        $("#modal_signup").modal("hide");
        $("#modal_login").modal("show");
    });


    //Login Modal
    $(".Form_Login .action").on("click", function(){
        login(function(response){

            var cart_identifier = window.localStorage.getItem('cart_identifier');
            var userId = window.localStorage.getItem('userId');
            
            if(typeof cart_identifier === 'undefined' || cart_identifier == 'undefined'){
                $("#modal_login").modal("hide");
            }else{
                assign_cart_to_user(cart_identifier,userId,function(response,err){
                    if(!err){
                        window.location.href = "/carts/id/"+cart_identifier;
                    }else{
                        console.error(err);
                    }
                });
            }
        });
    });

    $("#modal_login .close_modal").on("click", function(){
        $("#modal_login").modal("hide");
    });

    $("#link_SignupForm").on("click", function(){
        $("#modal_login").modal("hide");
        $("#modal_signup").modal("show");
    });

});