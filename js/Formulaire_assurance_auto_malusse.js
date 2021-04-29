$(document).on("ready", function(){

    $(".form_assurance_actuelle_vehicule select").on("change", function(){
        // Véhicule soumis suspension assurance
        if($(this).val() == 3){
            $(".form_sinistre_suspension").css("display","block");
        }else{
            $(".form_sinistre_suspension").css("display","none");
        }
    });

    $(".form_qualite_assure select").on("change", function(){
        // Société
        if($(this).val() == 2){
            $(".form_nb_salaries").css("display","block");
        }else{
            $(".form_nb_salaries").css("display","none");
        }
    });

    $(".form_mode_achat_vehicule select").on("change", function(){
        if($(this).val() == 3){
            $(".form_nature_comptant").css("display","block");
        }else{
            $(".form_nature_comptant").css("display","none");
        }
    });

    $(".button_add_sinistre").on("click", function(){
        var template_Form_Sinistre = $("#template_Form_Sinistre").html();
        $("._content_liste_sinistres").append(template_Form_Sinistre);
        var elem = $("._content_liste_sinistres").find(".Form_Sinistre:last-child");
        $(elem).find(".button_delete_Sinistre").on("click", function(){
            $(this).closest(".Form_Sinistre").remove();
        });
    });

    $(".form_resiliation_assureur select").on("change", function(){
        if($(this).val() == 1){
            $(".Form_resiliation_assureur ._details").css("display","block");
        }else{
            $(".Form_resiliation_assureur ._details").css("display","none");
        }
    });
    $(".form_suspension_permis select").on("change", function(){
        if($(this).val() == 1){
            $(".Form_suspension_permis ._details").css("display","block");
        }else{
            $(".Form_suspension_permis ._details").css("display","none");
        }
    });
    $(".form_annulation_permis select").on("change", function(){
        if($(this).val() == 1){
            $(".Form_annulation_permis ._details").css("display","block");
        }else{
            $(".Form_annulation_permis ._details").css("display","none");
        }
    });
    $(".form_alcoolemie select").on("change", function(){
        if($(this).val() == 1){
            $(".Form_alcoolemie ._details").css("display","block");
        }else{
            $(".Form_alcoolemie ._details").css("display","none");
        }
    });

});