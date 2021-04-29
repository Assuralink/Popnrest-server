$(document).on("ready", function(){

    // STEP1
    $(".Form_informations_adherent .form_prenom input").on("keydown", function(){
        check_step_1();
    });
    $(".Form_informations_adherent .form_nom input").on("keydown", function(){
        check_step_1();
    });
    $(".Form_informations_adherent .form_date_naissance input").on("keydown", function(){
        check_step_1();
    });
    $(".send_Form_informations_adherent").on("click", function(){
        $(".Form_informations_adherent").css("display","none");
        $(".Form_situation_epargne").css("display","block");
    });



    // STEP2
    $(".form_revenus_annuel input").on("change", function(){
        calculer_montant_impots_revenus();
    });
    $(".send_Form_situation_epargne").on("click", function(){
        simuler_assurance_vie_perin();
    });
    $(".Option").each(function(){
        $(this).find("input").on("change", function(){
            if($(this).closest(".Option").hasClass("selected")){
                $(this).closest(".Option").removeClass("selected");
            }else{
                $(this).closest(".Option").addClass("selected");
            }
        });
    });

});

function check_step_1(){
    if(
        $(".Form_informations_adherent .form_prenom input").val() != "" 
        && $(".Form_informations_adherent .form_nom input").val() != "" 
        && $(".Form_informations_adherent .form_date_naissance input").val() != ""
    ){
        $(".send_Form_informations_adherent").removeClass("disabled");
    }else{
        $(".send_Form_informations_adherent").addClass("disabled");
    }
}

function calculer_montant_impots_revenus(){

    var revenus_annuel = $(".form_revenus_annuel input").val();

    $.ajax({
        url: "/simulateur/calcul_impots_revenus_2020",
        type: 'POST',
        data: JSON.stringify({
            revenus_annuel: revenus_annuel
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        if(response.statut){
            $(".info_montant_impots ._content").html("Montant redevable : "+response.montant_impots);
        }
	});
}

function simuler_assurance_vie_perin(){

    var revenus_annuel = $(".form_revenus_annuel input").val();
    var montant_placements = $(".form_montant_placement input").val();
    var date_naissance_adherent = $(".Form_informations_adherent .form_date_naissance input").val();

    $.ajax({
        url: "/simulateur/assurance_vie_perin",
        type: 'POST',
        data: JSON.stringify({
            revenus_annuel: revenus_annuel,
            montant_placements: montant_placements,
            date_naissance_adherent: date_naissance_adherent
        }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(response){
        if(response.statut){

            console.log("OPTIONS");
            console.log(response);

            $(".montant_imposable").html(response.montant_imposable_avant_deduction);
            $(".montant_impots").html(response.montant_impots);
            $(".nb_annees_avant_retraite").html(response.nb_annees_avant_retraite);
            $(".montant_epargne_retraite").html(response.montant_epargnes_retraite);
            $(".montant_imposable_apres_deduction").html(response.montant_imposable_apres_deduction);
            $(".montant_impots_apres_deduction").html(response.montant_impots_apres_deduction);
            $(".montant_economie_impots").html(response.economie_impots);
            
        }
	});
}