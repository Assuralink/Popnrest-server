$(document).on("ready", function(){

    
    $(document).on("refresh_accountDetails", function(){
        get_user_details(function(response){
        
            accountDetails_toogleAndUpdate(
                $(".Form_account_details .Form_firstname"),
                response.user.firstname,
                update_firstname
            );

            accountDetails_toogleAndUpdate(
                $(".Form_account_details .Form_lastname"),
                response.user.lastname,
                update_lastname
            );

            accountDetails_toogleAndUpdate(
                $(".Form_account_details .Form_email"),
                response.user.email,
                update_email
            );

            accountDetails_toogleAndUpdate(
                $(".Form_account_details .Form_phoneNumber"),
                response.user.phoneNumber,
                update_phoneNumber
            );

        });
    });

    $(document).trigger("refresh_accountDetails");

});

function update_firstname(value){
    
    var userId = window.localStorage.getItem('userId');
   
    $.ajax({
        url: "/users/firstname/update",
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        },
        type: 'POST',
        data: JSON.stringify({
            userId: userId,
            firstname: value
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        $(".Form_account_details .Form_firstname input").val(response.firstname)
        $(".Form_account_details .Form_firstname span").html(response.firstname);
	}).fail(function(err){
        
    });
}

function update_lastname(value){

    var userId = window.localStorage.getItem('userId');

    $.ajax({
        url: "/users/lastname/update",
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        },
        type: 'POST',
        data: JSON.stringify({
            userId: userId,
            lastname: value
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        $(".Form_account_details .Form_lastname input").val(response.lastname)
        $(".Form_account_details .Form_lastname span").html(response.lastname);
	}).fail(function(err){
        
    });
}

function update_email(value){

    var userId = window.localStorage.getItem('userId');

    $.ajax({
        url: "/users/email/update",
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        },
        type: 'POST',
        data: JSON.stringify({
            userId: userId,
            email: value
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        $(".Form_account_details .Form_email input").val(response.email)
        $(".Form_account_details .Form_email span").html(response.email);
	}).fail(function(err){
        
    });
}

function update_phoneNumber(value){

    var userId = window.localStorage.getItem('userId');

    $.ajax({
        url: "/users/phoneNumber/update",
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        },
        type: 'POST',
        data: JSON.stringify({
            userId: userId,
            phoneNumber: value
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        $(".Form_account_details .Form_phoneNumber input").val(response.phoneNumber)
        $(".Form_account_details .Form_phoneNumber span").html(response.phoneNumber);
	}).fail(function(err){
        
    });
}

function accountDetails_toogleAndUpdate(elem, value, fn){

    // Fill with value
    $(elem).find("input").val(value);
    $(elem).find("span").html(value);
    if(value == ''){
        $(elem).find("span").addClass("not_provided");
        $(elem).find("span").html('Not provided');
    }

    $(elem).find(".action").on("click", function(){

        // Appearence toogle / untoogle
        if($(this).closest("._form").hasClass("untoogle")){
            $(this).closest("._form").removeClass("untoogle");
            $(this).closest("._form").addClass("toogle");
        }else{
            $(this).closest("._form").removeClass("toogle");
            $(this).closest("._form").addClass("untoogle");
        }

        // Action
        if($(this).closest("._form").hasClass("untoogle")){
            fn($(this).closest("._form").find("input").val());
        }
    });
}

