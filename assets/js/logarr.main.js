// Logarr main JS script
// https://github.com/Monitorr


// Variables
let results, currentIndex = 0;
let nIntervId = [];
let home = false;

let rfconfig = (typeof settings !== "undefined") ? settings.rfconfig : 15000;

//TODO Can we remove this so rfconfig doesn't load automatically on child pages we don't want it to?

//nIntervId["refreshConfig"] = setInterval(refreshConfig, rfconfig);

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    showCloseButton: true,
    background: 'rgba(50, 1, 25, 0.75)',
    onBeforeOpen: () => {
        $(".swal2-container").draggable({
            containment: "#containment-wrapper",
            scroll: false
        });
    }
});

function logupdatetoast() {
    Toast.fire({
        toast: true,
        title: '<p class="logupdatetoast">Updating Logs</p>',
        showCloseButton: false,
        background: 'rgba(50, 1, 25, 0.75)',
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    })
};

function logoutwarning() {
    Toast.fire({
        toast: true,
        type: 'warning',
        title: '<p class="logouttoast"> An error occurred while checking login status. <br> You will be auto-logged out in 2 minutes. </p>',
        background: 'rgba(255, 196, 0, 0.75)'
    })
};

function logouttoast() {
    Toast.fire({
        toast: true,
        type: 'warning',
        title: '<p class="logouttoast"> You have been logged out </p>',
        background: 'rgba(255, 196, 0, 0.75)'
    })
};

function logsingleupdatetoast() {
    Toast.fire({
        toast: true,
        title: 'Updating Log',
        showCloseButton: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        }
    })
};

function udtoast() {
    Toast.fire({
        toast: true,
        type: 'warning',
        title: 'Auto-update disabled',
        timer: 3000
    })
};

function uetoast() {
    Toast.fire({
        toast: true,
        type: 'warning',
        title: 'Auto-update enabled',
        timer: 3000
    })
};

function validerror() {
    Toast.fire({
        type: 'error',
        title: 'Invalid Settings value!',
        background: 'rgba(207, 0, 0, 0.75)',
        timer: 15000
    })
};

function logerror() {
    Toast.fire({
        toast: true,
        type: 'error',
        title: 'Error loading log!',
        background: 'rgba(207, 0, 0, 0.75)',
        timer: 10000
    })
};

function searchtoast() {
    Toast.fire({
        toast: true,
        title: 'Searching ...',
        showCloseButton: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        }
    })
};

function clearsearch() {
    Toast.fire({
        toast: true,
        type: 'warning',
        title: 'Clearing search results',
        timer: 3000
    })
};

function logroll() {
    Toast.fire({
        toast: true,
        type: 'warning',
        title: 'Attempting log roll',
        timer: 5000
    })
};

function logrollmodal() {
    Swal.fire({
        toast: false,
        position: 'center',
        title: '<div id="rolllogtitle">Roll Log results:</div>',
        html:
            '<div id="responseModal">' +
            '<div id="modalContent"></div>' +
            '</div>',
        width: "auto",
        background: 'rgba(50, 1, 25, 0.9)',
        allowOutsideClick: true,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        animation: false,
        customClass: 'logrollmodal',
        onBeforeOpen: () => {

            //TODO: //Turn OFF autorefresh before log roll attempt // Works but will re-enabled w/ rfconfig:
            //TODO What?
            $("#autoUpdateSlider").attr("data-enabled", "false");
            clearInterval(nIntervId["refreshLogs"]);
        },
        onClose: () => {

            //TODO / TESTING :

            //refreshblockUI();

            //Re-enable LOG auto-update IF ON:
            refreshLog();

            loadLogs();

        }
    })
};

function dllog() {
    Toast.fire({
        toast: true,
        type: 'success',
        title: 'Downloading log',
        timer: 5000
    })
};

function filtertoast() {
    Toast.fire({
        toast: true,
        type: 'warning',
        title: 'Filtering logs'
    })
};

function updateavailtoast() {
    Toast.fire({
        toast: true,
        type: 'warning',
        title: '<a class="toastlink swal2-title" href="https://github.com/Monitorr/logarr/releases" title="Logarr releases" target="_blank">A Logarr update is available!</a>',
        customClass: 'updateavailtoast',
        timer: 10000
    })
};

function updatechecklatest() {
    Toast.fire({
        toast: true,
        type: 'success',
        title: 'You have the latest <br> Logarr version',
        timer: 5000
    })
};

function updatecheckerror() {
    Toast.fire({
        toast: true,
        type: 'error',
        title: 'An error occurred <br> while checking your Logarr version!',
        background: 'rgba(207, 0, 0, 0.75)'
    })
};

function synctimeerror() {
    Toast.fire({
        toast: true,
        type: 'error',
        title: 'An error occurred <br> while synchronizing time!',
        background: 'rgba(207, 0, 0, 0.75)',
        timer: 10000
    })
};

function syncconfigerror() {
    Toast.fire({
        toast: true,
        type: 'error',
        title: 'An error occurred <br> while synchronizing settings!',
        background: 'rgba(207, 0, 0, 0.75)',
        timer: 10000
    })
};

function exterror() {
    Toast.fire({
        toast: true,
        type: 'error',
        title: 'PHP extension not loaded!',
        background: 'rgba(207, 0, 0, 0.75)',
        timer: 10000
    })
};

function ghajaxerror() {
    Toast.fire({
        toast: true,
        type: 'error',
        title: 'An error occurred while <br> retrieving releases from GitHub!',
        background: 'rgba(207, 0, 0, 0.75)',
        timer: 10000
    })
};

function searchresults() {
    Toast.fire({
        toast: true,
        type: 'info',
        position: 'bottom-start',
        title: '<div id="searchtitle">Search results:</div>',
        html:
            '<div id="countmodal" class="countmodal">' +
            '</div>',
        width: "auto",
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        animation: true
    })
};

function nosearch() {
    Toast.fire({
        toast: true,
        type: 'warning',
        position: 'bottom-start',
        title: 'Missing search query!',
        width: "auto",
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        animation: true,
        timer: 3000
    })
};

// Reload Setup page after user creation / Setup complete:
function sareload() {
    let timerInterval;
    Toast.fire({
        toast: true,
        showCloseButton: false,
        showCancelButton: false,
        html: '<p id="reloadtitle">Reloading Logarr in <strong></strong> seconds </p>' +
            '<button id="reload-btn" class="btn btn-primary" title="Reload Logarr">' +
            'Reload Logarr' +
            '</button>',
        timer: 10000,
        onBeforeOpen: () => {
            console.log("Reloading Logarr in 10 seconds");
            const content = Swal.getContent()
            const $ = content.querySelector.bind(content)
            const reload = $('#reload-btn')

            Swal.showLoading()

            reload.addEventListener('click', () => {
                top.location = "settings.php";
            })

            timerInterval = setInterval(() => {
                Swal.getContent().querySelector('strong')
                    .textContent = (Swal.getTimerLeft() / 1000)
                        .toFixed(0)
            }, 100)
        },
        onClose: () => {
            clearInterval(timerInterval);
            var win = window.open('index.php', '_blank');
            if (win) {
                win.focus();
            } else {
                //Browser has blocked popup:
                alert('Please allow popups for this website');
            };
            top.location = "settings.php";
        }
    })
}

function toastwelcome() {
    Toast.fire({
        toast: true,
        type: 'success',
        title: 'Welcome to Logarr!',
        position: 'bottom-start',
        background: 'rgba(50, 1, 25, 0.75)',
        timer: 10000
    })
};

function datadirsuccess() {
    Toast.fire({
        toast: true,
        type: 'success',
        title: 'Data directory <br> created successfully!',
        background: 'rgba(0, 184, 0, 0.75)'
    })
};

function datadirerror() {
    Toast.fire({
        toast: true,
        type: 'error',
        title: 'Error creating <br> data directory!',
        background: 'rgba(207, 0, 0, 0.75)'
    })
};

function usersuccess() {
    Toast.fire({
        toast: true,
        type: 'success',
        title: 'User created successfully!',
        background: 'rgba(0, 184, 0, 0.75)'
    })
};

function usererror() {
    Toast.fire({
        toast: true,
        type: 'error',
        title: 'Error creating user!',
        background: 'rgba(207, 0, 0, 0.75)'
    })
};

function refreshblockUI() {
    $('#body').addClass("cursorwait");
    setTimeout(function () {
        loadLogs();
    }, 300);

    //wait after log update to highlight terms:
    if (settings.autoHighlight === "true") {
        setTimeout(function () {
            highlightjs();
        }, 1500);
    }
    //wait after log update, if search input field is not empty, perform search:
    if ($("input[name='markinput']").val() !== "") {
        setTimeout(function () {
            mark();
        }, 1500);
        $('#count').removeClass("hidden");
    } else {
        $('#count').addClass("hidden");
        $('.btn-visible').addClass("btn-hidden");
        $('#searchBtn').removeClass("marksearchInput");
    }
}

// Load logs
function loadLogs() {
    logupdatetoast();
    $("#logcontainer").load("index.php #logwrapper", function( response, status, xhr ) {
        if ( status === "error" ) {
            const msg = "Sorry but there was an error: ";
            $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        Toast.close();
    });
}


// highlight terms:
function highlightjs() {

    if ('customHighlightTerms' in settings && settings.customHighlightTerms !== "") {
        var array = settings.customHighlightTerms.split(",");
        for (let i = 0; i < array.length; i++) {
            console.log("Highlighting text containing: " + array[i].trim());
            $(".expand").highlight(array[i].trim(), {
                element: 'em',
                className: array[i].trim(),
            });
            $('.' + array[i].trim()).addClass("highlightterms");
        }
    };
}

// Jumps to the element matching the currentIndex
function jumpTo() {
    if (results.length) {
        let position,
            $current = results.eq(currentIndex);
        results.removeClass("current");
        if ($current.length) {
            $current.addClass("current");
            let currentMarkResult = $('.markresults.current');
            let parent = currentMarkResult.parent();
            while (!parent.is('div')) {
                parent = parent.parent();
            }

            /* not animated page scroll */
            $('html, body').scrollTop(
                $(parent).offset().top
            );

            /*
                $('html, body').animate({
                    scrollTop: $(parent).offset().top
                }, 200); //make this value bigger if you want smoother/longer scroll
            */

            /* not animated scroll */
            parent.scrollTop(
                currentMarkResult.offset().top - parent.offset().top + parent.scrollTop()
            );
        }
    }
}

// Marks search results
function mark() {

    // Read the keyword
    let keyword = $("input[name='markinput']").val();
    let content = $(".slide");

    // Determine selected options
    // Mark the keyword inside the context:

    content.unmark({
        done: function () {
            content.mark(keyword, {
                separateWordSearch: false,
                done: function () {

                    searchresults();

                    //Future TODO:  Add # of results to individual log containers

                    results = content.find("mark");
                    let count = $(".count");
                    count.text(results.length);
                    count.append(" occurance(s) of: '");
                    count.append(keyword);
                    count.append("'");
                    results.addClass("markresults");
                    count.addClass("countresults");
                    //If no search results found, hide next,prev buttons:
                    if (results.length === 0) {
                        $('.btn-visible').addClass("btn-hidden");
                    } else {
                        $('.btn-visible').removeClass("btn-hidden");
                    }

                    //Append search results count to SweetAlert modal:
                    let countmodal = $(".countmodal");
                    countmodal.text(results.length);
                    countmodal.append(" occurance(s) of: '");
                    countmodal.append(keyword);
                    countmodal.append("'");
                    $('.swal2-close').addClass("hidden");

                    currentIndex = 0;
                    if (settings.jumpOnSearch === "true") jumpTo(); // Auto focus/scroll to first searched term after search submit, if option enabled in settings
                }
            });
        }
    });
}

// on page ready functions
$(function () {

    //Search box expand:
    $('#text-search2').focus(function () {
        $('#text-search2').addClass('text-search2-expand');
    });
    $('#text-search2').blur(function () {
        $('#text-search2').removeClass('text-search2-expand');
    });

    // Perform search action on click
    $("button[data-search='search']").on("click", function () {

        if ($("input[name='markinput']").val() !== "") {

            console.log('Logarr is performing search');
            $('#count').removeClass("hidden");
            $('#body').addClass("cursorwait");

            searchtoast();

            $('#buttonStart :checkbox').prop('checked', false).change();
            setTimeout(function () {
                $('.btn-visible').removeClass("btn-hidden"); // unhide next/previous buttons on search
                mark();
                $('#body').removeClass("cursorwait");
                console.log(results.length + " search result(s) found");
            }, 300);

        } else {
            nosearch();
            console.log("No query to search!");
        }
    });

    //TODO:  Why does ENTER keyup work without this?

    // Perform search action on enter
    // $("#text-search2").keyup(function (event) {
    //     if (event.keyCode === 13) {
    //         console.log('Logarr is performing search');
    //         $('#body').addClass("cursorwait");
    //         searchtoast();
    //         $('#buttonStart :checkbox').prop('checked', false).change(); // TODO: BUG: if auto-update is enabled, disable it after search submit
    //         setTimeout(function () {
    //             $('.btn-visible').removeClass("btn-hidden"); // unhide next/previous buttons on search
    //             mark();
    //             $('#body').removeClass("cursorwait");
    //         }, 300);
    //     }
    // });

    // Clears the search
    $("button[data-search='clear']").on("click", function () {
        clearsearch();
        $('#searchBtn').removeClass("marksearchInput");
        $(".slide").unmark();
        $("input[name='markinput']").val("");
        $('.count').removeClass("countresults");
        $('.btn-visible').addClass("btn-hidden");
        console.log('Logarr cleared search results');
    });

    // Next and previous search jump to
    $("button[data-search='next']").add($("button[data-search='prev']")).on("click", function () {
        if (results.length) {
            currentIndex += $(this).is($("button[data-search='prev']")) ? -1 : 1;
            if (currentIndex < 0) {
                currentIndex = results.length - 1;
            }
            if (currentIndex > results.length - 1) {
                currentIndex = 0;
            }
            jumpTo();
        }
    });

    // Live search when user keyup in search field:
    let timeoutID = null;
    $("input[name='markinput']").keyup(function (e) {
        if ($("input[name='markinput']").val() !== "") {

            //Color search button BLUE on keyup:
            $('#searchBtn').addClass("marksearchInput");

            clearTimeout(timeoutID);
            if (settings.liveSearch === "true") {
                $('.btn-visible').removeClass("btn-hidden"); // unhide next/previous buttons on search
                timeoutID = setTimeout(() => mark(e.target.value), 500);
                $('#count').removeClass("hidden");
            }
        } else {
            $('#count').addClass("hidden");
            Toast.close();
        }
    });

    //Remove "searching" modal after search is complete:
    $("input[name='markinput']").blur(function (e) {
        Toast.close();
    });

    // unlink log action
    $(document).on('click', "button[data-action='unlink-log']", function (event) {
        event.preventDefault(); // stop being refreshed
        console.log('Attempting log roll');
        logrollmodal();
        $.ajax({
            type: 'POST',
            url: 'assets/php/unlink.php',
            dataType: "json",
            data: "file=" + $(".path[data-service='" + $(this).data('service') + "']").html().trim(),
            success: function (data) {
                if(data.result === "SUCCESS") {
                    Toast.fire({
                        type: 'success',
                        title: data.result + ": Log rolled"
                    });
                } else {
                    Toast.fire({
                        type: 'error',
                        title: data.result + ": " + data.data,
                        background: 'rgba(207, 0, 0, 0.75)'
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("ERROR: unlink ajax posting failed");
                Toast.fire({
                    type: 'error',
                    title: 'An error occurred while attempting log roll!',
                    background: 'rgba(207, 0, 0, 0.75)'
                })
            }
        });
        return false;
    });

    // download log action
    $(document).on('click', "button[data-action='download-log']", function (event) {
        event.preventDefault();
        dllog();
        let logFilePath = ($(".path[data-service='" + $(this).data('service') + "']").html()).replace('file=', '').trim();
        console.log("Downloading log file: " + logFilePath);
        window.open('assets/php/download.php?file=' + logFilePath);
        return false;
    });

    // update log action
    $(document).on('click', "button[data-action='update-log']", function (event) {
        event.preventDefault();
        $('#body').addClass("cursorwait");
        logsingleupdatetoast();
        loadLog(logs[$(this).parent().parent().data("index")]);
        setTimeout(function () {
            if (settings.autoHighlight === "true") {
                setTimeout(function () {
                    highlightjs();
                }, 500);
            };
            $('#body').removeClass("cursorwait");
            Toast.close();
        }, 2000);
        return false;
    });

    // filter logs
    $(document).on('click', ".category-filter-item", function (event) {
        refreshblockUI();
        setTimeout(function () {
            console.log('Filtering logs on: ' + window.location.hash);
        }, 500);
    });
});


//TODO: Testing:

function refreshConfig() {
    $.ajax({
        url: "assets/php/sync-config.php",
        type: "GET",
        success: function (response) {

            // Check if authentication settings have changed:
            if (home) {
                refreshAuth();
            }

            let json = JSON.parse(response);
            settings = json.settings;
            preferences = json.preferences;
            authentication = json.authentication;
            logs = json.logs;

            if (home, settings) {
                if (settings.rfconfig !== rfconfig) {
                    rfconfig = settings.rfconfig > 300 ? settings.rfconfig : 30000;
                    clearInterval(nIntervId["refreshConfig"]);
                    nIntervId["refreshConfig"] = setInterval(refreshConfig, rfconfig);
                }
            }

            if (home) {
                document.title = preferences.sitetitle; //update index.php page title to configured site title
            }

            document.getElementById("brand").innerHTML = preferences.sitetitle; //update header title to configured site title
            console.log("Refreshed config variables | Interval: " + settings.rfconfig + " ms");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR: Config refresh failed!");

            setTimeout(function () {

                syncconfigerror();

            }, 120000);
        }
    });
}

function overwriteLogUpdate() {

    if ($("#autoUpdateSlider").attr("data-enabled") === "false") {
        $("#autoUpdateSlider").attr("data-enabled", "true");
        clearInterval(nIntervId["refreshLogs"]);
        nIntervId["refreshLogs"] = setInterval(refreshblockUI, settings.rflog);
        console.log("Log auto update: Enabled | Interval: " + settings.rflog + " ms");
        uetoast();
    } else {
        $("#autoUpdateSlider").attr("data-enabled", "false");
        clearInterval(nIntervId["refreshLogs"]);
        console.log("Log auto update: Disabled");
        udtoast();
    }
}

// Check if authentication settings have changed:
function refreshAuth() {

    console.log('Logarr is checking authentication settings | Interval ' + settings.rfconfig + ' (Auto)');

    $.ajax({
        url: "assets/php/sync-config-auth.php",
        type: "GET",
        success: function (response) {

            let json = JSON.parse(response);

            authentication = json.authentication;

            if (authentication.logsEnabled === "false") {

                console.log("Logarr auth: DISABLED (Auto)");

            } else {

                console.log("Logarr auth: ENABLED (Auto)");

                function checkLoginSync() {

                    $.ajax({
                        type: "GET",
                        url: "assets/php/login-status.php",
                        success: function (data) {

                            if (data === "true") {
                                // User is logged IN:
                                console.log('Logarr user is logged IN (Auto)');

                            } else {
                                // User is logged OUT:
                                console.log('Logarr user is logged OUT (Auto)');

                                logouttoast();

                                // If user user is logged out, refresh index page to envoke authentication page:
                                setTimeout(function () {

                                    window.location.href = "index.php";

                                }, 1000);
                            }
                        },

                        error: function () {
                            // error
                            console.log("%cERROR: An error occurred while checking login status", "color: red;");

                            logouttoast();

                            setTimeout(function () {

                                window.location.href = 'assets/php/authentication/unauthorized.php';

                            }, 3000);
                        }
                    });
                }
                checkLoginSync();
            };
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR: Authentication settings check error!");
            syncconfigerror();

            setTimeout(function () {

                //window.location.href = "index.php";
                window.location.href = 'assets/php/authentication/unauthorized.php';

            }, 3000);
        }
    });
}

function updateTime() {
    setInterval(function () {
        var res = date.toString().split(" ");
        var time = res[4];
        var timeSplit = time.split(":");
        if (timeStandard) {
            time = parseInt((timeSplit[0] > 12) ? (timeSplit[0] - 12) : timeSplit[0]) + ":" + timeSplit[1] + ":" + timeSplit[2];
            if (timeSplit[0] >= 12) {
                time += " PM";
            } else {
                time += " AM";
            }
        }
        var dateString = res[0] + ' | ' + res[2] + " " + res[1] + "<br>" + res[3];
        var dateString2 = res[0] + ' | ' + res[2] + " " + res[1];
        var data = '<div class="dtg">' + time + ' ' + timeZone + '</div>';
        data += '<div id="line">__________</div>';
        data += '<div class="date">' + dateString + '</div>';
        data1 = '<div class="dateRight">' + dateString2 + '</div>';
        $("#timer").html(data);
        $("#dateRight").html(data1);
    }, 1000);
}

function syncServerTime() {
    console.log('Logarr time update | Interval: ' + settings.rftime + ' ms');
    $.ajax({
        url: "assets/php/time.php",
        type: "GET",
        success: function (response) {
            var response = $.parseJSON(response);
            servertime = response.serverTime;
            timeStandard = parseInt(response.timeStandard);
            timeZone = response.timezoneSuffix;
            rftime = response.rftime;
            date = new Date(servertime);
            $("#synctimeerror").addClass("hidden");
            if (response.rftime < 1001 || response.rftime == null || response.rftime === false) {
                rftime: 60000;
                console.log("%cERROR: Time refresh settings value is INVALID", "color: red;");
                console.log("Time refresh interval is set to default: 60000 ms");
                $("#synctimeerror").removeClass("hidden");
                validerror();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("%cERROR: Time update failed!", "color: red;");
            $("#synctimeerror").removeClass("hidden");
            synctimeerror();
        }
    });
}

function load_info() {
    document.getElementById("settings-page-title").innerHTML = 'Information';
    document.getElementById("includedContent").innerHTML = '<object  type="text/html" class="object" data="assets/php/settings/info.php" ></object>';
    $(".sidebar-nav-item").removeClass('active');
    $("li[data-item='info']").addClass("active");
}

function load_preferences() {
    document.getElementById("settings-page-title").innerHTML = 'User Preferences';
    document.getElementById("includedContent").innerHTML = '<object type="text/html" class="object" data="assets/php/settings/user_preferences.php" ></object>';
    $(".sidebar-nav-item").removeClass('active');
    $("li[data-item='user-preferences']").addClass("active");
}

function load_settings() {
    document.getElementById("settings-page-title").innerHTML = 'Settings';
    document.getElementById("includedContent").innerHTML = '<object type="text/html" class="object" data="assets/php/settings/site_settings.php" ></object>';
    $(".sidebar-nav-item").removeClass('active');
    $("li[data-item='logarr-settings']").addClass("active");
}

function load_authentication() {
    document.getElementById("settings-page-title").innerHTML = 'Authentication';
    document.getElementById("includedContent").innerHTML = '<object type="text/html" class="object" data="assets/php/settings/authentication.php" ></object>';
    $(".sidebar-nav-item").removeClass('active');
    $("li[data-item='logarr-authentication']").addClass("active");
}

function load_logs() {
    document.getElementById("settings-page-title").innerHTML = 'Log Configuration';
    document.getElementById("includedContent").innerHTML = '<object type="text/html" class="object" data="assets/php/settings/logs_settings.php" ></object>';
    $(".sidebar-nav-item").removeClass('active');
    $("li[data-item='logs-configuration']").addClass("active");
}

function load_setup() {
    document.getElementById("settings-page-title").innerHTML = 'Setup';
    $("#includedContent").html('<object type="text/html" class="object" data="setup.php" ></object>');
    $(".sidebar-nav-item").removeClass('active');
    $("li[data-item='setup']").addClass("active");
}

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function checkedAll(isChecked) {
    var c = document.getElementsByName('slidebox');

    for (var i = 0; i < c.length; i++) {
        if (c[i].type == 'checkbox') {
            c[i].checked = isChecked;
        }
    }
}

function checkAll1() {
    checkedAll(true);
}

function parseGithubToHTML(result) {

    result = result.replace(/\n/g, '<br />'); //convert line breaks

    result = result.replace(/\*\*\*(.*)\*\*\*/g, '<em class="bold italic">$1</em>'); // convert bold italic text
    result = result.replace(/\*\*(.*)\*\*/g, '<em class="bold">$1</em>'); // convert bold italic text
    result = result.replace(/\*(.*)\*/g, '<em class="italic">$1</em>'); // convert bold italic text

    result = result.replace(/\_(.*)\_/g, '<em class="italic">$1</em>'); // convert to italic text

    result = result.replace(/\#\#\#(.*)/g, '<h3>$1</h3>'); // convert to H3
    result = result.replace(/\#\#(.*)/g, '<h2>$1</h2>'); // convert to H2
    result = result.replace(/\#\s(.*)/g, '<h1>$1</h1>'); // convert to H1

    result = result.replace(/\[(.*)\]\((http.*)\)/g, '<a class="releaselink" href=$2 target="_blank" title="$1">$1</a>'); // convert links with titles
    result = result.replace(/(https:\/\/github.com\/Monitorr\/logarr\/issues\/(\d*))/g, '<a class="releaselink" href="$1" title="GitHub Issue" target="_blank">#$2</a>'); // convert issue links
    result = result.replace(/\s(https?:\/\/?[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g, '<a class="releaselink" href="$1" target="_blank">$1</a>'); // convert normal links

    var addItems = [];
    var fixItems = [];
    var changeItems = [];


    result = result.replace(/(?:<br \/>)*\d+\.\s*ADD: (.*)/gi, function (s, match) {
        addItems.push(match);
        return "";
    });
    result = result.replace(/(?:<br \/>)*\d+\.\s*FIX: (.*)/gi, function (s, match) {
        fixItems.push(match);
        return "";
    });
    result = result.replace(/(?:<br \/>)*\d+\.\s*CHANGE: (.*)/gi, function (s, match) {
        changeItems.push(match);
        return "";
    });

    result = result.replace(/(?:\n*(?:<br.*>)*\n*\s*)*-?\s*(?:(?:Other\s*changes)|(?:Changes)):(?:(?:\n*(?:<br.*>)*\n*\s*)*(?:(?:\d+\.\s*)|(?:-\s*\t*))(.*))(?:(?:\n*(?:<br.*>)*\n*\s*)*(?:(?:\d+\.\s*)|(?:-\s*\t*))(.*))?(?:(?:\n*(?:<br.*>)*\n*\s*)*(?:(?:\d+\.\s*)|(?:-\s*\t*))(.*))?(?:\n*(?:<br.*>)*\n*\s*)*/g, function (s, m1, m2) {
        if (m1 != "") changeItems.push(m1);
        if (m2 != "") changeItems.push(m2);
        return "";
    });

    if ((addItems.length > 0) || (fixItems.length > 0) || (changeItems.length > 0)) {
        result += "<h3> - CHANGE LOG:</h3><ol>";
    }

    var i = 0;
    for (i = 0; i < addItems.length; i++) {
        result += "<li><i class='fa fa-plus'></i> ADD: " + addItems[i] + "</li>";
        if (i == addItems.length - 1 && i != 0) result += "<br>";
    }

    var i = 0;
    for (i = 0; i < fixItems.length; i++) {
        result += "<li><i class='fa fa-wrench'></i> FIX: " + fixItems[i] + "</li>";
        if (i == fixItems.length - 1 && i != 0) result += "<br>";
    }

    var i = 0;
    for (i = 0; i < changeItems.length; i++) {
        result += "<li><i class='fas fa-pencil-alt'></i> CHANGE: " + changeItems[i] + "</li>";
    }

    result += "</ol>";
    return result;
}

function toggleCategory(category, categoryList) {
    filtertoast();
    var categories;
    if (category != "") {
        categories = categoryList.split(',');
        var index = categories.indexOf(category);
        if (index == -1) {
            categories.push(category);
        } else {
            $(".log-container[data-category='" + category + "']").remove();
            categories.splice(index, 1);
        }
        category = categories.join();
    }
    window.location.hash = category;
    console.log('Filtering logs on: ' + category);
    loadLogs();
}

function arraySubset(arr1, arr2) {
    for (var i = arr2.length; i--;) {
        if (arr1.indexOf(arr2[i]) == -1) return false;
    }
    return true;
}