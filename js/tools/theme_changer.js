$(document).on("ready", function(){

    // THEME NIGHT MODE
    $(document).on("change_theme_mode", function(e, mode){

        // Modal TimePicker
        if(mode == 'journey_mode'){
            if(!$("#modal_time_selection .modal-content").hasClass("journey_mode")){
                $("#modal_time_selection .modal-content").removeClass("night_mode");
                $("#modal_time_selection .modal-content").addClass("journey_mode");
            }
        }else{
            if(!$("#modal_time_selection .modal-content").hasClass("night_mode")){
                $("#modal_time_selection .modal-content").removeClass("journey_mode");
                $("#modal_time_selection .modal-content").addClass("night_mode");
            }
        }

        // Footer
        if(mode == 'journey_mode'){
            if(!$("body").hasClass("journey_mode")){
                $("body").removeClass("night_mode");
                $("body").addClass("journey_mode");
            }
        }else{
            if(!$("body").hasClass("night_mode")){
                $("body").removeClass("journey_mode");
                $("body").addClass("night_mode");
            }
        }

        // Footer
        if(mode == 'journey_mode'){
            if(!$("footer").hasClass("journey_mode")){
                $("footer").removeClass("night_mode");
                $("footer").addClass("journey_mode");
            }
        }else{
            if(!$("footer").hasClass("night_mode")){
                $("footer").removeClass("journey_mode");
                $("footer").addClass("night_mode");
            }
        }

        $(".Form").each(function(){
            if(mode == 'journey_mode'){
                if(!$(this).hasClass("journey_mode")){
                    $(this).removeClass("night_mode");
                    $(this).addClass("journey_mode");
                }
            }else{
                if(!$(this).hasClass("night_mode")){
                    $(this).removeClass("journey_mode");
                    $(this).addClass("night_mode");
                }
            } 
        });

        $(".Theme").each(function(){
            if(mode == 'journey_mode'){
                if(!$(this).hasClass("journey_mode")){
                    $(this).removeClass("night_mode");
                    $(this).addClass("journey_mode");
                }
            }else{
                if(!$(this).hasClass("night_mode")){
                    $(this).removeClass("journey_mode");
                    $(this).addClass("night_mode");
                }
            } 
        });

        if(mode == 'journey_mode'){
            $(".BookingForm h3").html("Make a <b>booking</b>");
        }else{  
            $(".BookingForm h3").html("Book a <b>night</b>");
        }
    
    });

    // On page display
    var theme_mode = $("#data_theme_mode").val();
    if(theme_mode == "night_mode" || theme_mode == "journey_mode"){
        $(document).trigger("change_theme_mode", theme_mode);
    }

});