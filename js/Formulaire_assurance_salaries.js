$(document).on("ready", function(){

    var template_Form_sante_collective = $("#template_Form_sante_collective").html();
    $("._content_liste_Form_sante").html('');
    $("._content_liste_Form_sante").append(template_Form_sante_collective);

    $(".button_add_categorie").on("click", function(){
        $("._content_liste_Form_sante").append(template_Form_sante_collective);
    }); 

    $("#envoyer_devis_sante_collective").on("click", function(){
        envoyer_devis_sante_collective();
    });

});

function envoyer_devis_sante_collective(){

    var raison_sociale = $(".form_raison_sociale input").val();
    var sigle = $(".form_sigle_enseigne input").val();
    var adresse = $(".form_adresse input").val();
    var code_postal = $(".form_code_postal input").val();
    var ville = $(".form_ville input").val();
    var telephone = $(".form_telephone input").val();
    var email = $(".form_email input").val();
    var interlocuteur = $(".form_interlocuteur input").val();
    var fonction = $(".form_fonction input").val();

    var activite = $(".form_activite input").val();
    var code_naf = $(".form_code_naf input").val();
    var forme_juridique = $(".form_forme_juridique input").val();
    var siret = $(".form_siret input").val();
    var convention_collective = $(".form_convention_collective input").val();
    var nb_salaries = $(".form_nb_salaries_college input").val();
    var date_effet = $(".form_date_effet_souhaitee input").val();

    var categories_assures = [];
    $("._content_liste_Form_sante .Form_sante_collective").each(function(){
        categories_assures.push({
            categorie: $(this).find(".form_categorie_salaries select").val(),
            nb_salaries: $(this).find(".form_nombre_salaries input").val(),
            age_moyen: $(this).find(".form_age_moyen input").val(),
            note_hospitalisation_sejours: $(this).find(".form_note_hospitalisation_sejours select").val(),
            note_hospitalisation_honoraires: $(this).find(".form_note_hospitalisation_honoraires select").val(),
            note_soins_courants_honoraires: $(this).find(".form_note_soins_courants_honoraires select").val(),
            note_soins_courants_materiel_medical: $(this).find(".form_note_soins_courants_materiel_medical select").val(),
            note_aide_auditive: $(this).find(".form_note_aide_auditive select").val(),
            note_dentaire: $(this).find(".form_note_dentaire select").val(),
            note_dentaire_non_ro: $(this).find(".form_note_dentaire_non_ro select").val(),
            note_optique: $(this).find(".form_note_optique select").val(),
            note_chirurgie_refractive: $(this).find(".form_note_chirurgie_refractive select").val(),
            note_medecines_complementaires: $(this).find(".form_note_medecines_complementaires select").val(),
            note_maternite: $(this).find(".form_note_maternite select").val(),
            garanties_supplementaires_facultatives: $(this).find(".form_garanties_suppplementaires_facultatives select").val(),
            application_garantie: $(this).find(".form_application_garantie select").val(),
            lissage_cotisations: $(this).find(".form_lissage_cotisations select").val(),
            regime_base: $(this).find(".form_regime_base select").val()
        });
    });

    var accord_branche_prevoyance = $(".form_accord_branche_prevoyance select").val();
    var details_accord_branche_prevoyance = $(".form_details_accord_branche_prevoyance input").val();
    var masse_salariale = $(".form_masse_salariale input").val();
    var prevoyance_deces = $(".form_prevoyance_deces select").val();
    var rente_education = $(".form_rente_education select").val();
    var allocation_obseques = $(".form_allocation_obseques select").val();
    var rente_orphelin = $(".form_rente_orphelin select").val();
    var incapacite_invalidite = $(".form_incapacite_invalidite select").val();
    var rente_conjoint = $(".form_rente_conjoint select").val();
    var tranche_salaire_couverte = $(".form_tranche_salaire_couverte input").val();
    var budget_prevoyance = $(".form_budget_prevoyance input").val();

    var commentaire = $(".form_commentaire textarea").val();

    $.ajax({
        url: "/send/devis_assurance_salaries",
        type: 'POST',
        data: JSON.stringify({
            raison_sociale: raison_sociale,
            sigle: sigle,
            adresse: adresse,
            code_postal: code_postal,
            ville: ville,
            telephone: telephone,
            email: email,
            interlocuteur: interlocuteur,
            fonction: fonction,
            activite: activite,
            code_naf: code_naf,
            forme_juridique: forme_juridique,
            siret: siret,
            convention_collective: convention_collective,
            nb_salaries: nb_salaries,
            date_effet: date_effet,
            categories_assures: categories_assures,
            accord_branche_prevoyance: accord_branche_prevoyance,
            details_accord_branche_prevoyance: details_accord_branche_prevoyance,
            masse_salariale: masse_salariale,
            prevoyance_deces: prevoyance_deces,
            rente_education: rente_education,
            allocation_obseques: allocation_obseques,
            rente_orphelin: rente_orphelin,
            incapacite_invalidite: incapacite_invalidite,
            rente_conjoint: rente_conjoint,
            tranche_salaire_couverte: tranche_salaire_couverte,
            budget_prevoyance: budget_prevoyance,
            commentaire: commentaire
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