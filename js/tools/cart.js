function assign_cart_to_user(cartId,userId,callback){    
    $.ajax({
        url: "/users/assign/cart",
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        },
        type: 'POST',
        data: JSON.stringify({
            cartId: cartId,
            userId: userId
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        callback(response, null);
	}).fail(function(err){
        callback(null, err);
    });
}