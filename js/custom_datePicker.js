$(document).on("ready", function(){

    const datepicker = MCDatepicker.create({
        el: '#display_datePicker',
        dateFormat: 'yyyy-mm-dd',
        bodyType: 'modal',
        autoClose: true,
        selectedDate: new Date()
    });

    datepicker.onSelect((date, formatedDate) => {
        $(".form_date input").val(formatedDate);
        $(document).trigger("refresh_livePrice");
    });

    datepicker.onClose(() => {
        $(".form_date input").focus();
    });

    $(".form_date input").on("keyup", function(){

        var val = $(this).val();
        var l = Number(val.length);
        var error = false;

        if(l == 4){
            val = val + '-';
        }
        if(l == 7){
            val = val + '-';
        }
        if(l > 10){
            val = String(val).substring(0,10);
        }

        if(l == 10){
            if(!validate_date(val)){
                error = true;
            }
        }

        $(".form_date input").css("border-color","transparent");
        if(error){
            $(".form_date input").css("border-color","orangered");
            val = '';
        }else{
            $(document).trigger("refresh_livePrice");
        }
        
        $(this).val(val);
    });

    // DEFAULT DATE
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy+'-'+mm+'-'+dd;
    $(".form_date input").val(today);

});

function validate_date(value){

    var regExp = new RegExp(/([0-9]{4})[-]([0-9]{2})[-]([0-9]{2})/g);
    var response = true;

    if(Number(value.length) == 10){

        var capture = regExp.exec(value);

        if(capture != null){

            var yyyy = Number(capture[1]);
            var mm = Number(capture[2]);
            var dd = Number(capture[3]);

            if(
                dd > 31 || 
                dd < 1 || 
                mm > 12 || 
                mm < 1 || 
                yyyy < new Date().getFullYear() ||
                yyyy > new Date().getFullYear()
            ){
                response = false;
            }

        }else{
            response = false;
        }
    }

    return response;
}