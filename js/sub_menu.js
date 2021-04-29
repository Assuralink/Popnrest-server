$(document).on("ready", function(){

    var current_url = $("#data_current_url").val();

    $(".sub_menu a").each(function(){
        var href = $(this).prop("href");
        if(href == current_url){
            $(this).addClass("active");
        }
    });

});