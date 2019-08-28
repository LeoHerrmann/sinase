var ui = {
    header:  {
        add_scroll_event: function() {
            var header = document.getElementsByTagName("header")[0];
            var header_heading = document.querySelector("header > h1");

            window.addEventListener("scroll", function() {
                if (window.innerWidth > 800) {
                    if (document.querySelector("html").scrollTop == 0) {
                        header_heading.style.fontSize = "var(--space-4)";
                        // header_heading.style.lineHeight = "var(--space-4)"
                    }
                    else {
                        header_heading.style.fontSize = "var(--space-3)";
                        // header_heading.style.lineHeight = "var(--space-3)";
                    }
                }
            });
        }
    },



    control_center: {
        create_tabs: function() {
            var tabs = document.querySelectorAll("#control_center > .tab");

            for (tab of tabs) {
                var tab_button = document.createElement("button");

                tab_button.innerText = tab.getAttribute("data-tab-name");
                tab_button.setAttribute("data-associated-tab", tab.id);

                tab_button.addEventListener("click", function(e) {
                    ui.control_center.open_tab(e.target.getAttribute("data-associated-tab"), e.target);
                });

                document.getElementById("tab_switcher").append(tab_button);
            }

            document.querySelector("#tab_switcher > button").click();
        },


        open_tab: function(tab_id, pressed_button) {
            var tabs = document.querySelectorAll("#control_center > .tab");

            for (tab of tabs) {
                tab.style.display = "none";
            }

            document.getElementById(tab_id).style.display = "block";


            var buttons = document.querySelectorAll("#tab_switcher > button");

            for (button of buttons) {
                button.classList.remove("highlighted");
            }

            pressed_button.classList.add("highlighted");
        },


        show: function() {
            document.getElementById("control_center").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        },

        hide: function() {
            document.getElementById("control_center").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }
    }
}
