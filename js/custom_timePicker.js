$(document).on("ready", function(){

    var min_hour = 9;
    var max_hour = 19;

    // Default
    var h = new Date().getHours();
    if(h < 10){
        h = "0"+h;
    }
    var m = Number(new Date().getMinutes());
    if(Number(m + 5) < 60){
        m += 5;
    }else{
        m = 0;
        h = Number(h + 1);
    }
    if(m < 10){
        m = "0"+m;
    }
    var time = h + ":" + m;

    $(".Form_timepicker .hours input").val(h);
    $(".Form_timepicker .minutes input").val(m);
    $(".form_time input").val(time);


    // Which theme display ?
    // Check current time and comparate with max / min hour to choose the correct theme
    var current_hour = new Date().getHours();
    if(
        current_hour >= min_hour 
        && current_hour <= max_hour
    ){
        $(document).trigger("change_theme_mode", "journey_mode");
    }else{  
        $(document).trigger("change_theme_mode", "night_mode");
    }


    // Auto Formatting TIME
    $(".form_time input").on("keyup", function(){

        var l = Number($(this).val().length);
        var val = $(this).val();
        var error = false;

        if(l == 2){
            val += ":";
        }
        if(l > 5){
            val = String(val).substring(0,5);
        }
        
        if(Number(val.length) == 5){
            if(!validate_time(val)){
                error = true;
            }
        }       

        $(this).css("border-color","transparent");
        if(error){
            val = '';
            $(this).css("border-color","orangered");
        }else{
            $(document).trigger("refresh_livePrice");
        }

        $(this).val(val);
    });


    // Instant booking ?
    var time_picker = $(".Form_timepicker .hours input").val();



    // Display TimePicker
    $(".display_timePicker").on("click", function(){
       $("#modal_time_selection").modal("show");
    });
    $("#modal_time_selection .close_modal").on("click", function(){
        $("#modal_time_selection").modal("hide");
    });


    // TimePicker HOURS
    $(".Form_timepicker .hours .upgrade").on("click", function(){

        var current_hour = $(".Form_timepicker .hours input").val();
        var new_hour = Number(current_hour) + 1;

        if(new_hour < 0){
            new_hour = 23;
        }
        if(new_hour > 23){
            new_hour = 0;
        }

        if(new_hour >= min_hour && new_hour <= max_hour){
            $(document).trigger("change_theme_mode", "journey_mode");
        }else{
            $(document).trigger("change_theme_mode", "night_mode");
        }

        if(new_hour < 10){
            new_hour = "0"+new_hour;
        }
        $(".Form_timepicker .hours input").val(new_hour);

        $(document).trigger('refresh_timePicker');
    });

    $(".Form_timepicker .hours .downgrade").on("click", function(){

        var current_hour = $(".Form_timepicker .hours input").val();
        var new_hour = Number(current_hour) - 1;

        if(new_hour < 0){
            new_hour = 23;
        }
        if(new_hour > 23){
            new_hour = 0;
        }

        if(new_hour >= min_hour && new_hour <= max_hour){
            $(document).trigger("change_theme_mode", "journey_mode");
        }else{
            $(document).trigger("change_theme_mode", "night_mode");
        }

        if(new_hour < 10){
            new_hour = "0"+new_hour;
        }
        $(".Form_timepicker .hours input").val(new_hour);

        $(document).trigger('refresh_timePicker');
    });

    $(".Form_timepicker .hours input").on("change", function(){

        var new_hour = $(".Form_timepicker .hours input").val();

        if(isNaN(new_hour)){
            new_hour = min_hour;
        }

        if(new_hour < 0){
            new_hour = 23;
        }
        if(new_hour > 23){
            new_hour = 0;
        }

        if(new_hour >= min_hour && new_hour <= max_hour){
            $(document).trigger("change_theme_mode", "journey_mode");
        }else{
            $(document).trigger("change_theme_mode", "night_mode");
        }

        if(new_hour < 10){
            new_hour = "0"+new_hour;
        }
        $(".Form_timepicker .hours input").val(new_hour);

        $(document).trigger('refresh_timePicker');
    });


    // TimePicker MINUTES
    $(".Form_timepicker .minutes .upgrade").on("click", function(){
        var current_minute = $(".Form_timepicker .minutes input").val();
        var new_minute = Number(current_minute) + 1;
        if(new_minute <= 10){
            new_minute = "0"+new_minute;
        }
        if(new_minute < 60){
            $(".Form_timepicker .minutes input").val(new_minute);
        }else{
            $(".Form_timepicker .minutes input").val("00");
        }
        $(document).trigger('refresh_timePicker');
    });

    $(".Form_timepicker .minutes .downgrade").on("click", function(){
        var current_minute = $(".Form_timepicker .minutes input").val();
        var new_minute = Number(current_minute) - 1;
        if(new_minute < 10){
            new_minute = "0"+new_minute;
        }
        if(new_minute >= 0){
            $(".Form_timepicker .minutes input").val(new_minute);
        }else{
            $(".Form_timepicker .minutes input").val("59");
        }
        $(document).trigger('refresh_timePicker');
    });

    $(".Form_timepicker .minutes input").on("change", function(){
        var new_minutes = $(".Form_timepicker .minutes input").val();
        if(isNaN(new_minutes) || new_minutes < 0 || new_minutes > 60){
            $(".Form_timepicker .minutes input").val("00");
        }
        $(document).trigger('refresh_timePicker');
    });

    $(document).on('refresh_timePicker', function(){

        var h = $(".Form_timepicker .hours input").val();
        var m = $(".Form_timepicker .minutes input").val();
        var time = h+":"+m;

        $(".Form_MakeBooking .form_time input").val(time);
        $(document).trigger("refresh_livePrice");
    });

});

function validate_time(value){

    var response = true;
    var regExp = new RegExp(/([0-9]{2})[:]([0-9]{2})/g);

    if(Number(value.length) == 5){
        
        var capture = regExp.exec(value);

        if(capture == null){
            response = false;
        }else{
            var h = capture[1];
            var m = capture[2];
            if(h > 23 || m > 59){
                response = false;
            }
        }
    }else{
        response = false;
    }

    return response;
}