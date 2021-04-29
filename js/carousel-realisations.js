$(document).ready(function(){

    // ARRIVER SUR LA PAGE -------------------------

    var realisations = [];

    var descriptif = ["description 1", "description 2","description 3","description 4"];
    var moyensTechniques = ["usinage","fraisage","rectification plane","FAO"];
    realisations.push({
        descriptif:descriptif,
        moyensTechniques: moyensTechniques,
        designation: "Nom machine 1",
        index: 1
    });

    realisations.push({
        descriptif:descriptif,
        moyensTechniques: moyensTechniques,
        designation: "Nom machine 2",
        index: 2
    });

    var marginLeft = ( $(".content").width() - $("#container-designation-machine").width() ) / 2;
    $("#container-designation-machine").css("margin-left", marginLeft);

    var nbRealisations = $(".data-nb-realisations").val();
    $("#nb-realisations").html(nbRealisations);


    // ---------------------------------------- FONCTIONS ----------------------------------------

    var currentIndex = 0;
    $(".item-carousel").each(function(){
        if($(this).css("display") == "block"){
            currentIndex = $(this).find(".data-index").val();
        }
    });  

    function nextCarousel(){

        var nextIndex = Number(currentIndex) + 1;
        if(nextIndex > nbRealisations){
            nextIndex = 1;
        }

        $(".item-carousel").css("display","none");
        $(".item-carousel").each(function(){
            if($(this).find(".data-index").val() == nextIndex){
                var designation = $(this).find(".data-designation-machine").val();
                $(".designation-machine").html(designation);

                $("#index-realisation").html(nextIndex);

                $(this).css("display","block");
                currentIndex = nextIndex;
            }
        });  
    }

    function previousCarousel(){
        
        var nextIndex = Number(currentIndex) - 1;
        if(nextIndex <= 1){
            nextIndex = 1;
        }

        $(".item-carousel").css("display","none");
        $(".item-carousel").each(function(){
            if($(this).find(".data-index").val() == nextIndex){
                var designation = $(this).find(".data-designation-machine").val();
                $(".designation-machine").html(designation);

                $("#index-realisation").html(nextIndex);

                $(this).css("display","block");
                currentIndex = nextIndex;
            }
        });  
    }


    // ---------------------------------------- EVENEMENTS ----------------------------------------

    $(".fleche-droite").on("click",function(){
        nextCarousel();
    });
    $(".fleche-gauche").on("click",function(){
        previousCarousel();
    });

    $("#index-realisation").html(1);


});