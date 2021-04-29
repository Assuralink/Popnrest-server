$(document).on("ready", function(){

    $(".Form_account button").each(function(){
        $(this).on("click", function(){
            var isForm_toogle = $(this).closest("._form").find(".data_isForm_toogle").val();
            console.log("isForm_toogle ? "+isForm_toogle);
        });
    });

}); 

function update_password(){
    $.ajax({
        url: "/customers/account/password",
        type: 'PATCH',
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        if(response.statut){
            callback(response);
        }
	});
}