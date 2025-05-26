jQuery(document).ready(function ($) {

    /* ---------------------------------------------------------------------- */
    /*	------------------------------- Loading ----------------------------- */
    /* ---------------------------------------------------------------------- */

    // Page Preloading
    $(window).load(function () {
        $('#spinner').fadeOut(200);
        $('#preloader').delay(200).fadeOut('slow');
        $('.wrapper').fadeIn(200);
        $('#custumize-style').fadeIn(200);
    });

    /* ---------------------------------------------------------------------- */
    /* ------------------------------- Tabs profile ------------------------- */
    /* ---------------------------------------------------------------------- */

    // Toggle chevron icons for collapsible tabs in the profile section
    $('.collapse_tabs').click(function () {
        if ($(this).hasClass('collapsed')) {
            $(this).find('i.glyphicon').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        } else {
            $(this).find('i.glyphicon').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        }
    });

    /* ---------------------------------------------------------------------- */
    /* -------------------------- easyResponsiveTabs ------------------------ */
    /* ---------------------------------------------------------------------- */

    // Initialize responsive tabs
    $('#verticalTab').easyResponsiveTabs({
        type: 'vertical', // Mmakes the tabs vertical
        width: 'auto',    // Automatically adjusts width
        fit: true         // Fits tabs to container
    });

    // Add/remove active class for icon styling on accordion click
    $("h2.resp-accordion").click(function () {
        $(this).find(".icon_menu").addClass("icon_menu_active");
        $("h2.resp-accordion").not(this).find(".icon_menu").removeClass("icon_menu_active");

        // Scroll to the active accordion
        $('html, body').animate({ scrollTop: $('h2.resp-accordion').offset().top - 50 }, 600);
    });

    // Add/remove active class for icon styling on tab list item click
    $(".resp-tabs-list li").click(function () {
        $(this).find(".icon_menu").addClass("icon_menu_active");
        $(".resp-tabs-list li").not(this).find(".icon_menu").removeClass("icon_menu_active");
    });

    // Add/remove hover class for icon styling on tab list item hover
    $(".resp-tabs-list li").hover(
        function () { $(this).find(".icon_menu").addClass("icon_menu_hover"); },
        function () { $(this).find(".icon_menu").removeClass("icon_menu_hover"); }
    );

    // Add/remove hover class for icon styling on accordion hover
    $("h2.resp-accordion").hover(
        function () { $(this).find(".icon_menu").addClass("icon_menu_hover"); },
        function () { $(this).find(".icon_menu").removeClass("icon_menu_hover"); }
    );

    /* ---------------------------------------------------------------------- */
    /* --------------------------- Scroll tabs ------------------------------ */
    /* ---------------------------------------------------------------------- */

    // Initialize custom scrollbar for content areas
    $(".content_2").mCustomScrollbar({
        theme: "dark-2",                // Uses a dark theme for the scrollbar
        contentTouchScroll: true,       // Enables touch scrolling
        advanced: {
            updateOnContentResize: true, // Updates scrollbar on content resize
            updateOnBrowserResize: true, // Updates scrollbar on browser resize
            autoScrollOnFocus: false     // Disables auto-scroll on focus
        }
    });

    /* ---------------------------------------------------------------------- */
    /* ------------------------- Effect tabs -------------------------------- */
    /* ---------------------------------------------------------------------- */

    var animation_style = 'bounceIn'; // Default animation style for tabs

    // Change animation style based on dropdown selection (if exists)
    $('.dropdown-select').change(function () {
        animation_style = $('.dropdown-select').val();
    });

    // Apply animation on tab click and reinitialize scrollbar
    $('ul.resp-tabs-list li[class^=tabs-]').click(function () {
        var tab_name = $(this).attr('data-tab-name');

        // Apply animation
        $('.resp-tabs-container').addClass('animated ' + animation_style);
        $('.resp-tabs-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.resp-tabs-container').removeClass('animated ' + animation_style);
        });

        // Reinitialize custom scrollbar for the new tab content
        $(".content_2").mCustomScrollbar("destroy");
        $(".content_2").mCustomScrollbar({
            theme: "dark-2",
            contentTouchScroll: true,
            advanced: {
                updateOnContentResize: true,
                updateOnBrowserResize: true,
                autoScrollOnFocus: false
            }
        });

        // Initialize Google Maps if contact tab is selected
        if (tab_name == "contact") {
            initialize(); // Assumes initialize() is defined for GMaps
        }
        return false;
    });

    // Initialize Google Maps on accordion click for contact tab (responsive view)
    $("#verticalTab h2.resp-accordion").click(function () {
        // This might need to be more specific if there are multiple accordions
        if ($(this).attr('aria-controls') === 'tab_item-4') { // Assuming tab_item-4 is contact
             initialize();
        }
    });
    

    /* ---------------------------------------------------------------------- */
    /* ---------------------- redimensionnement (Resizing) ------------------ */
    /* ---------------------------------------------------------------------- */

    // Adjusts scrollbar and container heights based on window width
    function redimensionnement() {
        if (window.matchMedia("(max-width: 860px)").matches) {
            // For smaller screens, destroy custom scrollbar and use native scrolling
            $(".content_2").mCustomScrollbar("destroy");
            $(".resp-vtabs .resp-tabs-container").css("height", "100%");
            $(".content_2").css("height", "100%");
        } else {
            // For larger screens, set fixed height and apply custom scrollbar
            $(".resp-vtabs .resp-tabs-container").css("height", "860px"); // Fixed height
            $(".content_2").css("height", "860px"); // Fixed height
            $(".content_2").mCustomScrollbar("destroy"); // Destroy existing before reinitializing
            $(".content_2").mCustomScrollbar({
                theme: "dark-2",
                contentTouchScroll: true,
                advanced: {
                    updateOnContentResize: true,
                    updateOnBrowserResize: true,
                    autoScrollOnFocus: true // Changed to true, assuming focus should scroll
                }
            });
        }
    }

    // Bind resize function to load and resize events
    window.addEventListener('load', redimensionnement, false);
    window.addEventListener('resize', redimensionnement, false);

    /* ---------------------------------------------------------------------- */
    /* -------------------------- Contact Form (Legacy) --------------------- */
    /* ---------------------------------------------------------------------- */
    /*
    // TODO: Review this legacy contact form submission logic. It is currently disabled.
    // The corresponding HTML form in _includes/contact.html is also commented out.
    // If this form is to be re-enabled, ensure the selectors and logic are still valid.

    var $contactform = $('#contactform'); // Form ID
    var $success = 'Your message has been sent. Thank you!'; // Success message
    var $error = 'Sorry, something went wrong. Please try again later.'; // Error message (generic)

    $contactform.submit(function() {
        $.ajax({
            type: "POST",
            url: "https://formspree.io/f/xyylwyvq", // External form handling service
            data: $(this).serialize(),
            success: function(msg) {
                var msg_error = msg.split(","); // Assuming error flags are comma-separated
                var output_error = '';

                if (msg_error.indexOf('error-message') != -1) {
                    $("#contact-message").addClass("has-error").removeClass("has-success");
                    output_error = 'Please enter your message.';
                } else {
                    $("#contact-message").addClass("has-success").removeClass("has-error");
                }

                if (msg_error.indexOf('error-email') != -1) {
                    $("#contact-email").addClass("has-error").removeClass("has-success");
                    output_error = 'Please enter valid e-mail.';
                } else {
                    $("#contact-email").addClass("has-success").removeClass("has-error");
                }

                if (msg_error.indexOf('error-name') != -1) {
                    $("#contact-name").addClass("has-error").removeClass("has-success");
                    output_error = 'Please enter your name.';
                } else {
                    $("#contact-name").addClass("has-success").removeClass("has-error");
                }

                var response; // Variable to hold the response message
                if (msg == 'success') {
                    response = '<div class="alert alert-success success-send">' +
                               '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                               '<i class="glyphicon glyphicon-ok" style="margin-right: 5px;"></i> ' + $success +
                               '</div>';
                    $(".reset").trigger('click'); // Reset form on success
                    $("#contact-name, #contact-email, #contact-message").removeClass("has-success");
                } else {
                    response = '<div class="alert alert-danger error-send">' +
                               '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                               '<i class="glyphicon glyphicon-remove" style="margin-right: 5px;"></i> ' + (output_error || $error) + // Use specific error or generic
                               '</div>';
                }
                // Remove any previous messages and show new one
                $(".error-send, .success-send").remove();
                $contactform.prepend(response);
            },
            error: function() { // AJAX error handling
                var response = '<div class="alert alert-danger error-send">' +
                               '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                               '<i class="glyphicon glyphicon-remove" style="margin-right: 5px;"></i> ' + $error + // Generic error
                               '</div>';
                $(".error-send, .success-send").remove();
                $contactform.prepend(response);
            }
        });
        return false; // Prevent default form submission
    });
    */

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- Portfolio ------------------------------ */
    /* ---------------------------------------------------------------------- */

    // Portfolio filter and hover effects
    var filterList = {
        init: function () {
            // Initialize MixItUp plugin for portfolio filtering
            // http://mixitup.io
            $('#portfoliolist').mixitup({
                targetSelector: '.portfolio',    // Elements to filter
                filterSelector: '.filter',       // Filter control elements
                effects: ['fade'],               // Animation effect
                easing: 'snap',                  // Easing function
                onMixEnd: filterList.hoverEffect // Callback after filtering
            });
        },
        hoverEffect: function () {
            // Hover effect for portfolio items
            $('#portfoliolist .portfolio').hover(
                function () { // Mouse enter
                    $(this).find('.label').stop().animate({ bottom: 0 }, 200);
                    $(this).find('img').stop().animate({ top: -30 }, 500);
                },
                function () { // Mouse leave
                    $(this).find('.label').stop().animate({ bottom: -40 }, 200);
                    $(this).find('img').stop().animate({ top: 0 }, 300);
                }
            );
        }
    };

    filterList.init(); // Run portfolio filtering and hover effects

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- prettyPhoto ---------------------------- */
    /* ---------------------------------------------------------------------- */

    // Initialize prettyPhoto lightbox for portfolio images
    $("a[rel^='portfolio']").prettyPhoto({
        animation_speed: 'fast', /* fast/slow/normal */
        social_tools: '',        // Disables social sharing buttons
        theme: 'pp_default',     // Default theme
        horizontal_padding: 5,
        deeplinking: false,      // Disables deeplinking
    });

    /* ---------------------------------------------------------------------- */
    /* ------------------------------ Google Maps --------------------------- */
    /* ---------------------------------------------------------------------- */

    var map; // Variable to hold the map instance

    // Initializes Google Map (called when contact tab/accordion is shown)
    function initialize() {
        if ($('#map').length > 0) { // Check if map div exists
            map = new GMaps({
                div: '#map',    // Target div for the map
                lat: -37.817917, // Latitude
                lng: 144.965065, // Longitude
                zoom: 16         // Zoom level
            });
            map.addMarker({
                lat: -37.81792,
                lng: 144.96506,
                title: 'Marker with InfoWindow',
                icon: 'images/pins-map/map-marker.png', // Custom marker icon
                infoWindow: {
                    content: '<p>Melbourne Victoria, 300, Australia</p>' // Info window content
                }
            });
        }
    }

    /* ---------------------------------------------------------------------- */
    /* --------------------------------- Blog ------------------------------- */
    /* ---------------------------------------------------------------------- */

    // Handles navigation within the blog (showing full post from list)
    $('a.read_m, a.read_more').click(function () { // Combined selectors for similar functionality
        var pagina = $(this).attr('href');
        var postdetail = pagina + '-page'; // Assumes post detail sections have IDs like '#post-1-page'

        if (pagina.indexOf("#post-") != -1) {
            $('#blog-page').hide();    // Hide the list of blog posts
            $(postdetail).show();      // Show the selected post detail
            $(".tabs-blog").trigger('click'); // Trigger click on a tab, possibly to resize or reinit scrollbar
        }
        return false; // Prevent default link behavior
    });

    // Handles "Back to All Posts" and pagination within detailed post view
    $('.content-post a').click(function () {
        var pagina = $(this).attr('href');

        if (pagina == "#blog") { // If "All Posts" link
            $('.content-post').hide(); // Hide current detailed post
            $('#blog-page').show();    // Show the list of blog posts
            $(".tabs-blog").trigger('click'); // Re-trigger tab system
        } else if (pagina.indexOf("#post-") != -1) { // If pagination to another post
            var postdetail = pagina + '-page';
            $('#blog-page').hide();
            $('.content-post').hide(); // Hide all detailed post sections
            $(postdetail).show();      // Show the target post
            $(".tabs-blog").trigger('click');
        }
        return false;
    });

    /* ---------------------------------------------------------------------- */
    /* ---------------------------- icon menu (Tabs Arrow) ------------------ */
    /* ---------------------------------------------------------------------- */

    // Add up/down arrows to accordion headers based on their active state
    $(".resp-tabs-container h2.resp-accordion").each(function () {
        if ($(this).hasClass('resp-tab-active')) {
            $(this).append("<i class='glyphicon glyphicon-chevron-up arrow-tabs'></i>");
        } else {
            $(this).append("<i class='glyphicon glyphicon-chevron-down arrow-tabs'></i>");
        }
    });

    // Toggle arrows on accordion click
    $(".resp-tabs-container h2.resp-accordion").click(function () {
        if ($(this).hasClass('resp-tab-active')) {
            $(this).find("i.arrow-tabs").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        }
        // Ensure other accordions have the down arrow
        $(".resp-tabs-container h2.resp-accordion").not(this).each(function () {
            if (!$(this).hasClass('resp-tab-active')) { // Check if it's NOT the active one
                $(this).find("i.arrow-tabs").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
            }
        });
    });

    /* ---------------------------------------------------------------------- */
    /* -------------------------------- skillbar ---------------------------- */
    /* ---------------------------------------------------------------------- */

    // Animate skill bars when the resume tab/accordion is shown
    function animateSkillbars() {
        $('.skillbar').each(function () {
            $(this).find('.skillbar-bar').width(0); // Reset width
        });
        $('.skillbar').each(function () {
            $(this).find('.skillbar-bar').animate({
                width: $(this).attr('data-percent')
            }, 2000); // Animate to data-percent width
        });
    }

    // Trigger skillbar animation on resume tab click
    $('.tabs-resume').click(function () {
        animateSkillbars();
    });

    // Trigger skillbar animation on resume accordion click (responsive)
    $('#resume').prev('h2.resp-accordion').click(function () {
        animateSkillbars();
    });

    // Demo page radio button change handler (if exists)
    $('input:radio[name=page_builder]').on('change', function () {
        $('input:radio[name=page_builder]').each(function () {
            var $this = $(this);
            if ($(this).prop('checked')) {
                window.location.replace($this.val()); // Redirect to selected page
            }
        });
        return false;
    });

    /* ---------------------------------------------------------------------- */
    /* ------------------------------ particlesJS --------------------------- */
    /* ---------------------------------------------------------------------- */
    // Load particles.js configuration from JSON file
    if ($('#particles-js').length) { // Check if the container element exists
        $.getJSON('assets/js/particles-config.json', function(loadedConfig) {
            particlesJS("particles-js", loadedConfig);

            // The Stats.js part seems to be for development/debugging, keep it separate
            // It relies on pJSDom which is part of particlesJS instance
            var count_particles, stats, update;
            stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            // Consider conditionally appending this, or ensuring '.js-count-particles' exists
            // document.body.appendChild(stats.domElement); 
            count_particles = document.querySelector('.js-count-particles');
            update = function () {
                stats.begin();
                stats.end();
                if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS && window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
                    if(count_particles){ // Check if element exists
                         count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
                    }
                }
                requestAnimationFrame(update);
            };
            requestAnimationFrame(update);

        }).fail(function(jqxhr, textStatus, error) {
            console.error("Error loading particles-config.json: " + textStatus + ", " + error);
        });
    }

}); // End jQuery(document).ready

/* ---------------------------------------------------------------------- */
/* ---------------------- Third-Party Minified Code --------------------- */
/* ---------------------------------------------------------------------- */
// The following code appears to be a minified third-party library (Webpack loader),
// possibly related to pubmine.com for advertising or analytics.
// It has been de-minified for basic readability but its internal logic is not modified.
// Do not modify unless its purpose and functionality are fully understood.

! function(t) {
    function e(e) {
        for (var n, i, o = e[0], s = e[1], a = 0, u = []; a < o.length; a++) i = o[a], Object.prototype.hasOwnProperty.call(r, i) && r[i] && u.push(r[i][0]), r[i] = 0;
        for (n in s) Object.prototype.hasOwnProperty.call(s, n) && (t[n] = s[n]);
        for (c && c(e); u.length;) u.shift()()
    }
    var n = {},
        r = {
            0: 0
        };

    function i(e) {
        if (n[e]) return n[e].exports;
        var r = n[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return t[e].call(r.exports, r, r.exports, i), r.l = !0, r.exports
    }
    i.e = function(t) {
        var e = [],
            n = r[t];
        if (0 !== n)
            if (n) e.push(n[2]);
            else {
                var o = new Promise((function(e, i) {
                    n = r[t] = [e, i]
                }));
                e.push(n[2] = o);
                var s, a = document.createElement("script");
                a.charset = "utf-8", a.timeout = 120, i.nc && a.setAttribute("nonce", i.nc), a.src = function(t) {
                    return i.p + "" + ({}[t] || t) + ".js"
                }(t);
                var c = new Error;
                s = function(e) {
                    a.onerror = a.onload = null, clearTimeout(u);
                    var n = r[t];
                    if (0 !== n) {
                        if (n) {
                            var i = e && ("load" === e.type ? "missing" : e.type),
                                o = e && e.target && e.target.src;
                            c.message = "Loading chunk " + t + " failed.\n(" + i + ": " + o + ")", c.name = "ChunkLoadError", c.type = i, c.request = o, n[1](c)
                        }
                        r[t] = void 0
                    }
                };
                var u = setTimeout((function() {
                    s({
                        type: "timeout",
                        target: a
                    })
                }), 12e4);
                a.onerror = a.onload = s, document.head.appendChild(a)
            }
        return Promise.all(e)
    }, i.m = t, i.c = n, i.d = function(t, e, n) {
        i.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: n
        })
    }, i.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, i.t = function(t, e) {
        if (1 & e && (t = i(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var n = Object.create(null);
        if (i.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: t
            }), 2 & e && "string" != typeof t)
            for (var r in t) i.d(n, r, function(e) {
                return t[e]
            }.bind(null, r));
        return n
    }, i.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return i.d(e, "a", e), e
    }, i.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, i.p = "https://c0.pubmine.com/2.20.01606319652693/", i.oe = function(t) {
        throw console.error(t), t
    };
    var o = window.wpATAJsonpFunction = window.wpATAJsonpFunction || [],
        s = o.push.bind(o);
    o.push = e, o = o.slice();
    for (var a = 0; a < o.length; a++) e(o[a]);
    var c = s;
    i(i.s = 203)
}([]);
