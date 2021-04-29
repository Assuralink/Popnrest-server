$(document).on("ready", function(){

    $(".envoyer_message_contact").on("click", function(){
        envoyer_message_contact();
    });
    

});

function envoyer_message_contact(){

    var expediteur = $(".Formulaire_Contact .form_societe input").val();
    var email = $(".Formulaire_Contact .form_email input").val();
    var telephone = $(".Formulaire_Contact .form_telephone input").val();
    var message = $(".Formulaire_Contact .form_message textarea").val();

    $.ajax({
        url: "/contact/send_message",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
            expediteur: expediteur,
            email: email,
            telephone: telephone,
            message: message
        }),
        contentType: "application/json"
    }).done(function(response){
        if(response.statut){
            $(".Formulaire_Contact .form_societe input").val('');
            $(".Formulaire_Contact .form_email input").val('');
            $(".Formulaire_Contact .form_telephone input").val('');
            $(".Formulaire_Contact .form_message textarea").val('');
            $("#resultat").html("Votre message a bien été transmis.");
            window.setTimeout(function(){
                $("#resultat").html('');
            },5000);

        }
    });
}