$(document).on("ready", function(){

    $(".calculer_cmu_lamal").on("click", function(){
        calculer_cmu_lamal();
    });
    
    $(".form_age_adherent select").on("change", function(){
        calculer_cmu_lamal();
    });
    $(".form_revenu_fiscal input").on("change", function(){
        calculer_cmu_lamal();
    });
    $(".form_date_effet select").on("change", function(){
        calculer_cmu_lamal();
    });

    $(".form_revenu_fiscal input").val(45000);
    calculer_cmu_lamal();
    

    $(".button_add_conjoint").on("click", function(){
        var template_Adherent = $("#template_Adherent").html();
        $("._content_liste_adherents").append(template_Adherent);
        var item = $("._content_liste_adherents").find(".Adherent:last-child");
        $(item).addClass("conjoint");
        $(item).find(".data_qualite_adherent").val("conjoint");
        $(item).find(".button_delete_adherent").on("click", function(){
            $(this).closest(".Adherent").remove();
        });
    });
    $(".button_add_enfant").on("click", function(){
        var template_Adherent = $("#template_Adherent").html();
        $("._content_liste_adherents").append(template_Adherent);
        var item = $("._content_liste_adherents").find(".Adherent:last-child");
        $(item).addClass("enfant");
        $(item).find(".data_qualite_adherent").val("enfant");
        $(item).find(".button_delete_adherent").on("click", function(){
            $(this).closest(".Adherent").remove();
        });
    });


    $(".send_form_assurance_frontaliers").on("click", function(){
        envoyer_demande_devis_frontalier();
    });

});

function envoyer_demande_devis_frontalier(){

    var civilite = $(".Form_identite_adherent .form_civilite select").val();
    var prenom = $(".Form_identite_adherent .form_nom input").val();
    var nom = $(".Form_identite_adherent .form_prenom input").val();
    var email = $(".Form_identite_adherent .form_email input").val();
    var telephone = $(".Form_identite_adherent .form_telephone input").val();
    var regime_base = $(".Form_identite_adherent .form_regime_base select").val();
    var date_effet = $(".Form_identite_adherent .form_date_effet_contrat input").val();

    var adherents = [];
    $(".Form_adherents ._content_liste_adherents .Adherent").each(function(){
        adherents.push({
            qualite: $(this).find(".data_qualite_adherent").val(),
            date_naissance: $(this).find(".form_date_naissance input").val(),
            regime_obligatoire: $(this).find(".form_regime_obligatoire select").val(),
            departement: $(this).find(".form_departement select").val(),
            csp: $(this).find(".form_csp select").val()
        });
    });

    var montant_ij = $(".Form_pack_hospi .form_montant_ij select").val();
    var etendue_couverture = $(".Form_pack_hospi .form_etendu_couverture select").val();

    var rappel = $(".Form_rappel .form_rappel_telephonique select").val();

    $.ajax({
        url: "/send/devis_assurance_frontaliers",
        type: 'POST',
        data: JSON.stringify({
            civilite: civilite,
            nom: nom,
            prenom: prenom,
            email: email,
            telephone: telephone,
            regime_base: regime_base,
            date_effet: date_effet,
            adherents: adherents,
            montant_ij: montant_ij,
            etendue_couverture: etendue_couverture,
            rappel: rappel
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        if(response.statut){
            $(".Form_confirmation_envoi").css("display","block");
            $(".Form_adhesion_en_ligne").css("display","none");
        }
	});
}

function calculer_cmu_lamal(){
    
    var annee_fiscale = $(".Form_calculateur_cmu_lamal .form_date_effet select").val();
    var revenu_fiscal = $(".Form_calculateur_cmu_lamal .form_revenu_fiscal input").val();
    var age = $(".Form_calculateur_cmu_lamal .form_age_adherent select").val();
    
    $.ajax({
        url: "/calculer_cmu_lamal",
        type: 'POST',
        data: JSON.stringify({
            annee_fiscale: annee_fiscale,
            revenu_fiscal: revenu_fiscal,
            age: age
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        if(response.statut){
            $(".form_prix_cmu ._content").html(formaterNombre(response.prime_cmu,2,' ')+"CHF");
            $(".form_prix_lamal ._content").html(formaterNombre(response.prime_lamal,2,' ')+"CHF");
        }
	});
}