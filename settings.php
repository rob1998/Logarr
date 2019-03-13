<?php
include('assets/php/functions.php');
include('assets/php/auth_check.php');
if (isset($_GET["action"]) && $_GET["action"] == "register") {
    if (
        isset($_POST["user_name"]) && isset($_POST["user_password"]) && isset($_POST["user_password_repeat"])
        && !empty($_POST["user_name"]) && !empty($_POST["user_password"]) && !empty($_POST["user_password_repeat"])
    ) {
        echo "true";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<!--
     Logarr | Settings
https://github.com/Monitorr/Logarr
-->

<!-- settings.php -->

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <link rel="manifest" href="webmanifest.json">

    <link rel="icon" type="image/png" href="favicon.png">
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
    <link rel="apple-touch-icon" href="favicon.ico">

    <meta name="description" content="Logarr">

    <script type="text/javascript" src="assets/js/pace.js" async></script>

    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/vendor/sweetalert2.min.css">
    <link rel="stylesheet" href="assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/logarr.css">
    <link rel="stylesheet" href="assets/data/custom.css">

    <meta name="theme-color" content="#464646" />
    <meta name="theme_color" content="#464646" />

    <title>
        <?php
        $title = $GLOBALS['preferences']['sitetitle'];
        echo $title . PHP_EOL;
        ?>
        | Settings
    </title>

    <style>
        .header-brand {
            cursor: default;
        }

        #settingsbrand {
            cursor: pointer;
        }

        .swal2-bottom-start {
            margin-left: .5rem !important;
            bottom: 5em !important;
            cursor: default;
        }

        .swal2-icon.swal2-warning {
            color: yellow !important;
            border-color: yellow !important;
        }
    </style>

    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/vendor/sweetalert2.min.js"></script>
    <script src="assets/js/logarr.main.js"></script>

    <?php appendLog($logentry = "Logarr settings loaded"); ?>

    <!-- Check if Logarr settings auth is enabled / if TRUE, check login status every 10s -->
    <?php checkLoginsettings(); ?>

    <script>
        function toastwelcome() {
            Toast.fire({
                toast: true,
                type: 'success',
                title: 'Welcome to Logarr!',
                position: 'bottom-start',
                background: 'rgba(50, 1, 25, 0.75)',
                timer: 5000
            })
        };

        $(document).ready(function() {
            console.log("Welcome to Logarr!");
            toastwelcome();
        });
    </script>

    <!-- sync config with javascript -->
    <script>
        let settings = <?php echo json_encode($GLOBALS['settings']); ?>;
        let preferences = <?php echo json_encode($GLOBALS['preferences']); ?>;
        let authentication = <?php echo json_encode($GLOBALS['authentication']); ?>;
        settings = true;
        //refreshConfig();
        refreshConfig(false);
    </script>

    <!-- UI clock functions: -->
    <script>
        <?php
        //initial values for clock:
        $dt = new DateTime("now", new DateTimeZone("$timezone"));
        $timeStandard = (int)($GLOBALS['preferences']['timestandard']);
        $rftime = $GLOBALS['settings']['rftime'];
        $timezone_suffix = '';
        if (!$timeStandard) {
            $dateTime = new DateTime();
            $dateTime->setTimeZone(new DateTimeZone($timezone));
            $timezone_suffix = $dateTime->format('T');
        }
        $serverTime = $dt->format("D d M Y H:i:s");
        ?>
        let servertime = "<?php echo $serverTime; ?>";
        let timeStandard = <?php echo $timeStandard; ?>;
        let timeZone = "<?php echo $timezone_suffix; ?>";
        let rftime = <?php echo $settings['rftime']; ?>;

        $(document).ready(function() {
            //TODO: Causing memory crash at times:
            //    setInterval(function() {
            //        syncServerTime()
            //    }, settings.rftime); //delay is rftime
            syncServerTime();
            updateTime();
        });
    </script>

    <script>
        $(function() {
            switch (window.location.hash) {
                case "#user-preferences":
                    load_preferences();
                    break;
                case "#logarr-settings":
                    load_settings();
                    break;
                case "#logarr-authentication":
                    load_authentication();
                    break;
                case "#logs-configuration":
                    load_logs();
                    break;
                case "#registration":
                    load_registration();
                    break;
                default:
                    load_info();
            }
        });
    </script>

    <script src="assets/js/clock.js" async></script>
    <script src="assets/data/custom.js"></script>

    <script>
        $(document).ready(function() {
            //TODO: Causing memory crash at times:
            setInterval(function() {
                syncServerTime()
            }, settings.rftime); //delay is rftime
        });
    </script>


</head>

<body>

    <script>
        document.body.className += ' fade-out';
        $(function() {
            $('body').removeClass('fade-out');
        });
    </script>

    <div id="settingscolumn" class="settingscolumn">

        <div id="logoHeaderSettings">
            <img src="assets/images/logo_white_glow_crop.png" alt="Logarr">
        </div>

        <div id="settingsbrand">
            <div id="brand" class="navbar-brand" onclick='window.location.href="index.php";' title="Return to Logarr">
                <?php
                echo $preferences['sitetitle'];
                ?>
            </div>
        </div>

        <div id="summary"></div>

        <div class="Column left">
            <div id="clock">
                <canvas id="canvas" width="120" height="120"></canvas>
                <div class="dtg" id="timer"></div>
            </div>
        </div>

        <div id="wrapper" class="left">

            <!-- Sidebar -->
            <nav class="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">

                <div class="settingstitle">
                    Settings
                </div>

                <ul class="nav sidebar-nav">

                    <li class="sidebar-nav-item" data-item="info">
                        <a href="#info" onclick="load_info()" title="Information"><i class="fa fa-fw fa-info"></i>Info</a>
                    </li>
                    <li class="sidebar-nav-item" data-item="user-preferences">
                        <a href="#user-preferences" onclick="load_preferences()" title="Preferences"><i class="fa fa-fw fa-user"></i>User Preferences</a>
                    </li>
                    <li class="sidebar-nav-item" data-item="logarr-settings">
                        <a href="#logarr-settings" onclick="load_settings()" title="Settings"><i class="fa fa-fw fa-cog"></i>Logarr Settings</a>
                    </li>
                    <li class="sidebar-nav-item" data-item="logarr-authentication">
                        <a href="#logarr-authentication" onclick="load_authentication()" title="Authentication"><i class="fa fa-fw fa-lock"></i>Authentication</a>
                    </li>
                    <li class="sidebar-nav-item" data-item="logs-configuration">
                        <a href="#logs-configuration" onclick="load_logs()" title="Log Configuration"><i class="fa fa-fw fa-book"></i>Log Configuration</a>
                    </li>
                    <li class="sidebar-nav-item" data-item="registration">
                        <a href="#registration" onclick="load_registration()" title="Registration"><i class="fas fa-user-plus"></i>Registration</a>
                    </li>
                    <?php if (isset($_SESSION['user_name']) && isset($_SESSION['user_is_logged_in']) && !empty($_SESSION['user_name']) && ($_SESSION['user_is_logged_in'])) { ?>
                    <li class="sidebar-nav-item" data-item="log-out">
                        <a href="settings.php?action=logout" onclick='logouttoast();' title="Log Out"><i class="fas fa-sign-out-alt"></i>Log Out</a>
                    </li>
                    <?php 
                } ?>
                    <li class="sidebar-nav-item" data-item="logarr">
                        <a href="index.php" title="Return to Logarr"><i class="fa fa-fw fa-home"></i>Logarr</a>
                    </li>

                </ul>

            </nav>

        </div>

        <div id="version">

            <script src="assets/js/update.js" async></script>

            <p><a class="footer a" href="https://github.com/monitorr/Logarr" target="_blank" title="Logarr Repo">
                    Logarr | </a> <a class="footer a" href="https://github.com/Monitorr/logarr/releases" target="_blank" title="Logarr Releases">
                    <?php echo file_get_contents("assets/js/version/version.txt"); ?> </a>
            </p>

            <div id="version_check_auto"></div>

        </div>

    </div>

    <div class="settings-title">
        <div id="settings-page-title" class="header-brand">
        </div>
    </div>

    <div id="includedContent">

        <script>
        </script>

    </div>

    <div id="footer" class="settings-footer">

        <div id="logarrid">
            <a href="https://github.com/monitorr/logarr" title="Logarr GitHub repo" target="_blank" class="footer">Logarr </a> |
            <a href="https://github.com/Monitorr/logarr/releases" title="Logarr releases" target="_blank" class="footer">
                v:
                <?php echo file_get_contents("assets/js/version/version.txt"); ?></a> |
            <a href="settings.php" title="Logarr Settings" target="_blank" class="footer">Settings</a>
            <?php if (isset($_SESSION['user_name']) && isset($_SESSION['user_is_logged_in']) && !empty($_SESSION['user_name']) && ($_SESSION['user_is_logged_in'])) {
                echo " | <a href='index.php?action=logout' onclick='logouttoast(); 'title='Log out' class='footer'></i>Logout</a>";
            } ?>
            <br>
        </div>

    </div>

</body>

</html> 