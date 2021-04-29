$(document).on("ready",function(){
    
    function initMap() {
        var home = {lat: 45.928786, lng: 6.084761};
        var map = new google.maps.Map(document.getElementById('map-contact'), {
            zoom: 15,
            center: home
        });
        var icons = {
            societe: {
                icon: "/images/marker-societe.png"
            }
        }
        var marker = new google.maps.Marker({
            position: home,
            icon: "/images/marker-societe.png",
            map: map
        });
    }
    initMap();
    
});