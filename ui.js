var ui = {
    popup: {
        show: function(id) {
            document.getElementById(id).style.display = "block";
            document.getElementById("overlay").style.display = "block";
        },


        hide: function() {
            var popups = document.getElementsByClassName("popup");

            for (popup of popups) {
                popup.style.opacity = "0";
                popup.style.top = "60%";
            }


            var overlay = document.getElementById("overlay");
            overlay.style.opacity = "0";


            setTimeout(function() {
                for (popup of popups) {
                    popup.style.display = "none";
                    popup.style.opacity = "1";
                    popup.style.top = "50%";
                }

                overlay.style.display = "none";
                overlay.style.opacity = "1";
            }, 300); 
        }
    }
};





window.addEventListener("load", function() {
    document.getElementById("help_text_container").innerHTML = help_text;
});
