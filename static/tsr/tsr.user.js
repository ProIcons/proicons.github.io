// ==UserScript==
// @name                    TheSimsResource Utilities
// @name:el                 TheSimsResource - Επέκαταση Δυνατοτήων
// @author                  Nikolas Mavropoylos
// @author:el               Νικόλας Μαυρόπουλος
// @namespace               https://proicons.github.io/
// @version                 3.6.3
// @iconURL                 http://thesimsresource.com/favicon.ico
// @description             TheSimsResource Utilities is a kit, allowing you to have better access on TheSimsResource Site. It allows you to navigate through pages with arrow keys, and also fast download and preview of their content.
// @match                   http://www.thesimsresource.com/*
// @match                   http://thesimsresource.com/*
// @match                   https://www.thesimsresource.com/*
// @match                   https://thesimsresource.com/*
// @updateURL               https://proicons.github.io/static/tsr/tsr.user.js
// @require                 https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require                 http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @run-at document-body
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_info
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @copyright               2014, Nikolas Mavropoylos
// ==/UserScript==
/*
 **
 **
 ** Prototypes
 **
 **
 */

Object.defineProperty(Object.prototype, 'Size', {
    value:
        function () {
            var size = 0, key;
            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size;
        },
    enumerable: false
});
Object.defineProperty(Object.prototype, 'GetValue', {
    value:
        function (index) {
            var size = 0, key;
            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    if (size === index) {
                        return [key, this[key]];
                    }
                    size++;
                }
            }
            return Object();
        },
    enumerable: false
});
Object.defineProperty(Object.prototype, 'ConvertToString', {
    value:
        function () {
            return JSON.stringify(this);
        },
    enumerable: false
});
String.prototype.between = function (prefix, suffix) {
    s = this;
    var i = s.indexOf(prefix);
    if (i >= 0) {
        s = s.substring(i + prefix.length);
    }
    else {
        return '';
    }
    if (suffix) {
        i = s.indexOf(suffix);
        if (i >= 0) {
            s = s.substring(0, i);
        }
        else {
            return '';
        }
    }
    return s;
}
String.prototype.toFloat = function () { return parseFloat(this); }
String.prototype.toInt = function () { return parseInt(this); }
String.prototype.toJson = function () {
    try {
        return JSON.parse(this);
    } catch (unused) {
        return [];
    }
}
String.prototype.Replace = function (target, replace, nth) {
    var i = 0;
    var Input;
    if (typeof (target) == "string")
        Input = new RegExp(target.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "g");
    else
        Input = target;
    return this.replace(Input, function (match, z, original) {
        i++;
        return (i === nth) ? replace : match;
    });
}

var _pLogger = new _pLog();
var _pVersion = GM_info["script"]["version"];
var _pBaseUrl = "https://proicons.github.io/static/tsr/";
var _pCSSContentUrl = "css/tsr.user.css";
var _pCSSVersionUrl = "css/tsr.user.css.ver";
var _pStorage = new function () {
    var _pObj = '_pObject_: ';
    var _pFun = '_pFunction_: ';
    if (typeof GM_setValue != "function")
        _pLogger.Print("This is a UserScript function, and requires GM_setValue.", "error");
    if (typeof GM_getValue != "function")
        _pLogger.Print("This is a UserScript function, and requires GM_getValue.", "error");
    if (typeof GM_listValues != "function")
        _pLogger.Print("This is a UserScript function, and requires GM_listValues.", "error");
    this.Set = function (varName, varValue) {
        if (!varName) {
            _pLogger.Print('Undefined Variable sent to _pStorage.set().', "error");
            return;
        }
        if ((/[^\w _-]/).test(varName))
            _pLogger.Print('Suspect, probably illegal, Variable sent to _pStorage.set().', "warn");
        switch (typeof varValue) {
            case 'undefined':
                _pLogger.Print('Undefined Variable sent to _pStorage.set().', "error");
                break;
            case 'boolean':
            case 'string':
                GM_setValue(varName, varValue);
                break;
            case 'number':
                if (varValue === varValue.toInt() && Math.abs(varValue) < 2147483647) {
                    GM_setValue(varName, varValue);
                    break;
                }
            case 'object':
                var safeStr = _pObj + varValue.ConvertToString();
                GM_setValue(varName, safeStr);
                break;
            case 'function':
                var safeStr = _pFun + varValue.toString();
                GM_setValue(varName, safeStr);
                break;
            default:
                _pLogger.Print('Unknown Variable type sent to _pStorage.set().', "error");
                break;
        }
    }
    this.Get = function (varName, defaultValue) {
        if (!varName) {
            _pLogger.Print('Undefined Variable sent to _pStorage.get().', "error");
            return;
        }
        if (/[^\w _-]/.test(varName)) {
            _pLogger.Print('Suspect, probably illegal Variable Name, sent to _pStorage.get().', "error");
        }
        var varValue = GM_getValue(varName);
        if (!varValue)
            return defaultValue;
        if (typeof varValue == "string") {
            var regxp = new RegExp('^' + _pObj + '(.+)$');
            var m = varValue.match(regxp);
            if (m && m.length > 1) {
                varValue = JSON.parse(m[1]);
                return varValue;
            }
            var regxp = new RegExp('^' + _pFun + '((?:.|\n|\r)+)$');
            var m = varValue.match(regxp);
            if (m && m.length > 1) {
                varValue = eval('(' + m[1] + ')');
                return varValue;
            }
        };
        return varValue;
    }
    this.List = function (extended) {
        if (extended)
            var Items = {};
        else
            var Items = [];
        for (var i = 0; i < GM_listValues().length; i++) {
            var Key = GM_listValues()[i];
            if (extended) {
                var Val = this.Get(GM_listValues()[i]);
                Items[Key] = Val;
            }
            else
                Items.push(Key);
        }
        return Items;
    }
    this.Exists = function (varName) {
        return (GM_listValues().indexOf(varName) > -1) ? true : false;
    }
    this.Init = function (varName, varValue) {
        if (!this.Exists(varName))
            this.Set(varName, varValue);
    }
};
function _pLog() {
    this.Print = function () {
        if (GM_getValue("_pSetLogs") == "true") {
            var args = []
            var Time = new Date().toTimeString().split(" ")[0];
            var Type = arguments[1];
            var Tabs = "";
            args = Array.prototype.slice.call(arguments, 2);
            //args.unshift("%c             %c["+Time+"]\t"+arguments[0],"background-image: url(\"https://proicons.github.io/static/tsr/img/tsrelogo.png\");background-size:cover;font-size:14px;border-radius:3px;","font-size:15px;");
            args.unshift("%c[%cTheSimsResource Utilities%c][%c" + Time + "%c]%c\t" + arguments[0], "font-weight:bold;", "color:#666", "font-weight:bold;", "color:#999;", "font-weight:bold", "");
            switch (Type) {
                case "plain":
                    console.log.apply(console, args);
                    break;
                case "info":
                    console.info.apply(console, args);
                    break;
                case "warn":
                    console.warn.apply(console, args);
                    break;
                case "error":
                    console.error.apply(console, args);
                    break;
                case "group":
                    if (Browser() != "Firefox") {
                        console.group.apply(console, args);
                    }
                    else {
                        console.group(">");
                        console.log.apply(console, args);
                    }
                    break;
                case "groupc":
                    if (Browser() != "Firefox") {
                        console.groupCollapsed.apply(console, args);
                    }
                    else {
                        console.group(">");
                        console.log.apply(console, args);
                    }

                    break;
            }
        }
    };
    this.Clear = function () {
        if (_pStorage.Get("_pSetLogs") == "true")
            console.clear()
    };
    this.Count = function (data) {
        if (_pStorage.Get("_pSetLogs") == "true")
            console.count(data)
    };
    this.CloseGroup = function () {
        if (_pStorage.Get("_pSetLogs") == "true")
            console.groupEnd()
    };
    this.Time = function (data) {
        if (_pStorage.Get("_pSetLogs") == "true")
            console.time(data)
    };
    this.TimeEnd = function (data) {
        if (_pStorage.Get("_pSetLogs") == "true")
            console.timeEnd(data)
    };
    return this;
};
_pStorage.Init("_pOptInfo", "false");
_pStorage.Init("_pOptPagi", "true");
_pStorage.Init("_pOptNavi", "true");
_pStorage.Init("_pOptFadl", "true");
_pStorage.Init("_pOptPomo", "true");
_pStorage.Init("_pOptFase", "true");
_pStorage.Init("_pOptScro", "false");
_pStorage.Init("_pOptLang", navigator.language.toString().split("-")[0]);
_pStorage.Init("_pSetCSSv", "0");
_pStorage.Init("_pSetLogs", "false");
_pStorage.Init("_pSetAUpd", "true");
_pStorage.Init("_pSetCUpd", "0");
_pStorage.Init("_pHisDown", [{}]);


unsafeWindow.on = true;
var Browser = function () {
    // Return cached result if avalible, else get result then cache it.
    if (Browser.prototype._cachedResult)
        return Browser.prototype._cachedResult;

    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    var isFirefox = typeof InstallTrigger !== 'undefined';// Firefox 1.0+
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isChrome = !!window.chrome && !isOpera;// Chrome 1+
    var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

    return (Browser.prototype._cachedResult =
        isOpera ? 'Opera' :
            isFirefox ? 'Firefox' :
                isSafari ? 'Safari' :
                    isChrome ? 'Chrome' :
                        isIE ? 'IE' :
                            '');
};
var timeoutHandler = new Timeout(function () { }, 0);
var clearHandler = new Timeout(function () { }, 0);
var BusyHandler = false;
var Busy = false;
var Items = [[]];
var CurrentPage;
var PrevPage;
var cURL;
var tURL;
var currentURL = window.location.pathname;
var _pNavBar = '<nav class="_pNavBar clearfix" style="display:none;" role="navigation">\
		<div class="_pNavBarSettings">\
	  		<div class="_pNavBarSettingsContainer">\
	  			<center>\
					<label>%_pLanguage%</label>\
					<br>\
					%_pLanguageSelect%\
				</center>\
				<br>\
				<div style="margin-top:-7px;cursor: help;margin-left:15px;" class="_pCheckbox">\
					<input db="_pSetAUpd" type="checkbox" value="">\
					<label>\
						<span help="%_pHelpAutoUpdate%">Check for Updates</span>\
					</label>\
				</div>\
				<div style="margin-left:15px;" class="_pCheckbox">\
					<input db="_pSetLogs" type="checkbox" value="">\
					<label>\
						<span help="%_pHelpLogging%">Logging</span>\
					</label>\
				</div>\
				<div style="text-align:center;">\
					<a style="float:none;height:25px;margin-top:10px;font-size:12px;" id="_pAbout" class="button button-black" rel="nofollow">\
						<div style="margin-top:-5px;">%_pAbout%</div>\
					</a>\
				</div>\
			</div>\
		</div>\
		<div class="_pNavBarCog">\
			<img src="https://proicons.github.io/static/tsr/img/expcog.png" width="15">\
  		</div>\
		<div class="_pNavBarUpdate">\
			<div class="_pNavBarUpdateContainer">\
				%_pUpdateChanges%\
			</div>\
			<img style="margin-top:10px;" src="https://proicons.github.io/static/tsr/img/expleft.png" width="25">\
		</div>\
		<div class="_pNavBarHelper">\
			<center>\
				<img src="https://proicons.github.io/static/tsr/img/expdown.png" width="25">\
			</center>\
			<div class="_pNavBarHelperContainer">\
			</div>\
		</div>\
		<a href="/" id="logo" class=""><img src="https://proicons.github.io/static/tsr/img/tsrelogo.png" width="82"/></a>\
		<form class="pull-left form-inline">\
			<div class="form-group">\
				<a href="#" id="_pSOptL">\
					%_pSearchSettings%\
					<span class="_pRightArrow icon-rightarrow"></span>\
				</a>\
			</div>\
			<div Con="_pSOptL" style="line-height: 18px;display:none;" class="form-group _pNavOpts">\
				<div class="_pCheckbox">\
					<input db="_pOptPagi" type="checkbox" value="">\
					<label>\
						<span help="%_pHelpPagination%">Pagination on Top</span>\
					</label>\
				</div>\
				<div class="_pCheckbox">\
					<input db="_pOptNavi" type="checkbox" value="">\
					<label>\
						<span help="%_pHelpNavigation%">Navigate with arrows</span>\
					</label>\
				</div>\
				<div class="_pCheckbox">\
					<input db="_pOptFase" type="checkbox" value="">\
					<label>\
						<span help="%_pHelpFastSearch%">Fast Ajax Search</span>\
					</label>\
				</div>\
			</div>\
		</form>\
		<form class="pull-left form-inline">\
			<div class="form-group">\
				<a href="#" id="_pDOptL">\
					%_pDownloadSettings%\
					<span class="_pRightArrow icon-rightarrow"></span>\
				</a>\
			</div>\
			<div Con="_pDOptL" class="form-group _pNavOpts" style="display:none;">\
				<div class="_pCheckbox">\
					<input db="_pOptFadl" type="checkbox" value="">\
					<label>\
						<span help="%_pHelpFastDownload%">Fast Download</span>\
					</label>\
				</div>\
				<div class="_pCheckbox">\
					<input db="_pOptPomo" type="checkbox" value="">\
					<label>\
						<span help="%_pHelpPreview%">Preview</span>\
					</label>\
				</div>\
			</div>\
		</form>\
		<form class="pull-left form-inline">\
			<div class="form-group">\
				<a href="#" id="_pBOptL">\
					%_pBrowseSettings%\
					<span class="_pRightArrow icon-rightarrow"></span>\
				</a>\
			</div>\
			<div Con="_pBOptL" class="form-group _pNavOpts" style="display:none;">\
				<div class="_pCheckbox">\
					<input db="_pOptScro" ugroup=1 type="checkbox" value="">\
					<label>\
						<span help="%_pHelpInfiniteScroll%">Infinite Scroll Results</span>\
					</label>\
				</div>\
				<div class="_pCheckbox">\
					<input db="_pOptTabl" ugroup=1 type="checkbox" value="">\
					<label>\
						<span help="%_pHelpAjaxTable%">Ajax Table Results</span>\
					</label>\
				</div>\
			</div>\
		</form>\
		<div class="pull-right _pNavInfo" style="display:none">\
			<span id="wrapper-version"></span>\
			<br\>\
			%_pScriptVersion%\
		</div>\
		<div class="pull-right _pOptInfo_trig" style="width:auto;padding-top:10px;margin-right:5px;">\
			<div class="_pCheckbox">\
				<input db="_pOptInfo" type="checkbox" value="">\
				<label>\
					%_pInfoButton%\
				</label>\
			</div>\
		</div>\
	</nav>';
var _pPreviewContainer = '\
	<div class="_pContainer">\
		<div class="_pHeader">\
			<img class="_pLogo" src="https://proicons.github.io/static/tsr/img/tsrelogo.png"/>\
			<div class="_pTitle"></div>\
			<div class="_pClose"><a class="icon-close md-close" style="color:#fff"> </a></div>\
		</div>\
		<div class="_pLoadOverlay">\
			<center><h2>%_pLoadMessage%</h2></center>\
		</div>\
		<div class="_pContent">\
			<div class="_pImagePreview">\
				<a href="#" class="_pNext">></a>\
				<a href="#" class="_pPrev"><</a>\
				<ul id="_pImageList">\
					<li><img src="https://proicons.github.io/static/tsr/img/null.jpg"></li>\
					<li><img src="https://proicons.github.io/static/tsr/img/null.jpg"></li>\
					<li><img src="https://proicons.github.io/static/tsr/img/null.jpg"></li>\
				</ul>\
			</div>\
			<div class="_pDescription">\
				<div id="_pDescTitle"   style="padding-top:5px;font-size:24px;text-align:center;"></div>\
				<div id="_pDescInfo"    style="margin-top:2px;margin-right:5px;font-size:16px;text-align:right;"></div>\
				<hr>\
				<div id="_pDescContent" style="margin-left:10px;margin-right:10px;"></div>\
				<hr>\
			</div>\
		</div>\
		<div class="_pDownloadSection">\
			<div align="center">\
				<a rel="nofollow" id="_pDownload" class="button button-green"><span class="icon-download"></span>%_pDownload%</a>\
			</div>\
		</div>\
		<div class="_pDownloadSetSection">\
			<div align="center">\
				<a rel="nofollow" id="_pSetDownload" style="display:none;" class="button button-green" ><span class="icon-download"></span>%_pDownloadSet%</a>\
				<a rel="nofollow" id="_pSetView" style="display:none;" class="button button-blue" ><span class="icon-info"></span>%_pViewSet%</a>\
			</div>\
		</div>\
	</div>';
var _pInfoContainer = '\
	<div class="_pOverlay"></div>\
	<div style="display:none" class="_pUpdateContainer">\
		<div class="_pInfoHeader">\
			TheSimsResource - Update\
		</div>\
		<div class="_pUpdateContent">\
			<center><span style="font-size:24px">%_pUpdateAvailable%</span></center>\
			<div>%_pLocalVersion% <span id="_pLocalVersion"></span></div>\
			<div>%_pRemoteVersion% <span id="_pRemoteVersion"></span></div>\
			<div style="text-align:center;margin-top:10px;">\
			<a rel="nofollow" style="height:25px;margin-top:4px;font-size:12px;" id="_pUpdate" class="button button-black"><div style="margin-top:-5px;">%_pUpdate%</div></a>\
			<a rel="nofollow" style="height:25px;margin-top:4px;font-size:12px;" id="_pCancel" class="button button-black"><div style="margin-top:-5px;">%_pCancel%</div></a>\
			</div>\
		</div>\
	</div>\
	<div style="display:none" class="_pInfoContainer">\
		<div class="_pInfoHeader">\
			<div style="position:absolute;margin-top:5px;width:100%;text-align:center;">TheSimsResource Utilities '+ _pVersion + '</div>\
			<div class="_pClose"><a class="icon-close md-close" style="color:#fff"></a></div>\
		</div>\
		<div class="_pInfoOverlay">\
		</div>\
		<div class="_pInfoContent">\
			<div style="font-size:32px;text-align:center;">TheSimsResource Utilites</div>\
			<div style="font-size:24px;text-align:center;color:#999;">%_pCreditsVersion%</div>\
			<div style="text-align:center;"><img src="https://proicons.github.io/static/tsr/img/tsrelogo.png"/></div>\
			<div>\
				<table align="center">\
					<tbody>\
						<tr>\
							<td align="right"><b>%_pCreditsDeveloped%</b></td>\
							<td>%_pCreditsDeveloper%</td>\
						</tr>\
						<tr>\
							<td align="right"><b>eMail</b></td>\
							<td>info@devian.gr</td>\
						</tr>\
						 <tr>\
							<td align="right"><b>%_pCreditsWebPage%</b></td>\
							<td>http://www.devian.gr</td>\
						</tr>\
						<tr>\
							<td align="right"><b>GitHub</b></td>\
							<td><a href="http://www.github.com/ProIcons/tsr">http://www.github.com/ProIcons/tsr</a></td>\
						</tr>\
					</tbody>\
				</table>\
			</div>\
			<div>\
				<b>%_pCreditsCompatibility%</b>\
				<table>\
					<tbody>\
						<tr>\
							<td align="left"><ul><li><b>Chrome</b></li></ul></td>\
							<td>Tampermonkey</td>\
						</tr>\
						<tr>\
							<td align="left"><ul><li><b>Firefox</b></li></ul></td>\
							<td>Greasemonkey</td>\
						</tr>\
						<tr>\
							<td align="left"><b>&nbsp;</b></td>\
							<td>Tampermonkey</td>\
						</tr>\
						<tr>\
							<td align="left"><ul><li><b>Opera</b></li></ul></td>\
							<td>Violentmonkey</td>\
						</tr>\
						<tr>\
							<td align="left">&nbsp;</td>\
							<td>Tampermonkey</td>\
						</tr>\
						<tr>\
							<td align="left"><ul><li><b>Microsoft Edge</b></li></ul></td>\
							<td>Tampermonkey</td>\
						</tr>\
					</tbody>\
				</table>\
			</div>\
			<div id="_pUpdateMessage"> </div>\
			<div style="text-align:center">\
				<a rel="nofollow" style="height:25px;margin-top:4px;font-size:12px;" id="_pUpdateButton" class="button button-black">\
					<div style="margin-top:-5px;">%_pUpdateCheck%</div>\
				</a>\
			</div>\
		</div>\
	</div>';
var _pTranslations = {
    "el": {
        "_pUniversalLangName": "Greek",
        "_pNativeLangName": "Ελληνικά",
        "_pHelpPagination": "Τοποθετεί ενα αντίγραφο της Μπάρας Σελιδοποίησης στην κορυφή των αποτελεσμάτων <br>Δεν λειτουργεί με την επιλογή <strong>Infinite Scroll Results</strong>",
        "_pHelpNavigation": "Επιτρέπει την πλοήγηση στα αντικείμενα με τα βελάκια <- -><br>Δεν λειτουργεί με την επιλογή <strong>Infinite Scroll Results</strong>",
        "_pHelpFastDownload": "Όταν πατάτε πάνω στην είκονα του αντικειμένου το κατεβάζει αυτόματα",
        "_pHelpPreview": "Πάνω στην εικόνα του αντικειμένου τοποθετείται ενα κουμπί 'Λεπτομέριες'. Όταν το πατάτε εμφανίζονται οι πληροφορίες του Αντικειμένου σε ενα αναδυόμενο παράθυρο",
        "_pHelpInfiniteScroll": "Οσο σκρολάρετε προς τα κάτω, νεα αντικείμενα εμφανίζονται στο τέλος της λίστας αντικειμένων",
        "_pHelpAjaxTable": "Οταν πατάτε να αλλάξετε σελίδα αντικειμένων, η νέα σελίδα φορτώνεται στο παρασκήνιο και τα αντικείμενα εμφανίζονται άμεσα στην σελίδα που είστε",
        "_pHelpFastSearch": "Η αναζήτηση γίνεται στο παρασκήνιο και τα αποτελέσματα εμφανίζονται άμεσα στην τρέχουσα σελίδα",
        "_pHelpAutoUpdate": "Το TheSimsResource Utilities θα ψάχνει κατα περιόδους για διαθέσιμες ενημερώσεις συστήματος",
        "_pHelpLogging": "Το TheSimsResource Utilities θα καταγράφει τις λεπτομέριες λειτουργίας του στην κονσόλα προγραμματιστών",
        "_pScriptVersion": "Έκδοση Προσθήκης: " + _pVersion,
        "_pDownload": "Λήψη",
        "_pDownloadSet": "Λήψη Σετ",
        "_pViewSet": "Προεπισκόπηση Σετ",
        "_pInfoButton": "Λεπτομέριες",
        "_pLoadMessage": "Παρακαλώ Περιμένετε...",
        "_pBrowseSettings": "Επιλογές Πλοήγησης",
        "_pDownloadSettings": "Επιλογές Λήψης",
        "_pSearchSettings": "Επιλογές Αναζήτησης",
        "_pUpdateChanges": "<center>Για να εφαρμοστούν οι αλλαγές<br>παρακαλώ<br>ανανεώστε την σελίδα</center>",
        "_pLanguage": "Γλώσσα",
        "_pLocalVersion": "Τοπική Έκδοση : ",
        "_pRemoteVersion": "Απομακρυσμένη Έκδοση : ",
        "_pUpdate": "Ενημέρωση",
        "_pUpdateCheck": "Ελεγχος για ενημερώσεισ",
        "_pUpdateAvailable": "Ενημέρωση διαθέσιμη",
        "_pCancel": "Ακύρωση",
        "_pCreditsVersion": "Εκδοση " + _pVersion,
        "_pCreditsDeveloped": "Προγραμματιστής ",
        "_pCreditsDeveloper": "Νικόλας Μαυρόπουλος",
        "_pCreditsWebPage": "Ιστοσελίδα",
        "_pCreditsCompatibility": "Συμβατότητα: ",
        "_pAbout": "Σχετικα με",
    },
    "en": {
        "_pUniversalLangName": "English",
        "_pNativeLangName": "English",
        "_pHelpPagination": "Copies the Page navigation Element, on the top of the Item list. <br>This won't work if you have <strong>Infinite Scroll Results</strong>",
        "_pHelpNavigation": "Allows you to navigate through pages with arrows <- -><br>This won't work if you have <strong>Infinite Scroll Results</strong>",
        "_pHelpFastDownload": "When you click on a Item's Thumbnail, it gets auto downloaded",
        "_pHelpPreview": "Now on Item's Thumbnails there's a button 'Info'. On click, it is loading the Item's information, and appearing it on a Modal Window",
        "_pHelpInfiniteScroll": "As you scroll the results are appending to the Current page",
        "_pHelpAjaxTable": "When you click to change the page, the items of the next page are getting appended to your current page",
        "_pHelpFastSearch": "Search is triggered in the background, and the results are getting appended in current page",
        "_pHelpAutoUpdate": "TheSimsResource Utilities addon will search from time to time for available updates.",
        "_pHelpLogging": "TheSimsResource Utilities addon will log activity to Developers' Console",
        "_pScriptVersion": "Script Version: " + _pVersion,
        "_pDownload": "Download",
        "_pDownloadSet": "Download Set",
        "_pViewSet": "View Set",
        "_pInfoButton": "Info",
        "_pLoadMessage": "Please Wait...",
        "_pBrowseSettings": "Browse Options",
        "_pDownloadSettings": "Download Options",
        "_pSearchSettings": "Search Options",
        "_pUpdateChanges": "<center>Refresh Page<br>to<br>Apply Changes</center>",
        "_pLanguage": "Language",
        "_pLocalVersion": "Local Version : ",
        "_pRemoteVersion": "Remote Version : ",
        "_pUpdate": "Update",
        "_pUpdateCheck": "Check for Updates",
        "_pUpdateAvailable": "Update is available.",
        "_pCancel": "Cancel",
        "_pCreditsVersion": "Version " + _pVersion,
        "_pCreditsDeveloped": "Developed by",
        "_pCreditsDeveloper": "Nikolas Mavropoylos",
        "_pCreditsWebPage": "Web Page",
        "_pCreditsCompatibility": "Compatibility: ",
        "_pAbout": "About"
    }
};


/*
 **
 **
 ** Functions
 **
 **
 */

function _isInteger(s) {
    return (s.toString().search(/^[0-9]+$/) == 0);
}

function _pApplyCSS(fn) {
    _pLogger.Print("Style Injection Initialized", "group");
    _pLogger.Print("Checking Stylesheet Version from the Remote Server", "plain");
    _pLogger.Print("Entering Asynchronous Mode (Async1)", "plain");
    GM_xmlhttpRequest({
        method: "GET",
        url: _pBaseUrl + _pCSSVersionUrl + "?" + ((new Date()).getTime()),
        onload: function (response) {
            _pLogger.Print("[Async1] Stylesheet Local Version: " + _pStorage.Get("_pSetCSSv"), "plain");
            var ver = parseInt(response.responseText);
            _pLogger.Print("[Async1] Stylesheet Remote Version: " + ver, "plain");
            if (ver > parseInt(_pStorage.Get("_pSetCSSv"))) {
                _pLogger.Print("[Async1] Stylesheet Versions missmatch. Recaching CSS Style from Remote Server", "plain");
                _pStorage.Set("_pSetCSSv", response.responseText);
                _pLogger.Print("[Async1] Entering Asynchronous Mode (Async2)", "plain");
                GM_xmlhttpRequest({
                    method: "GET",
                    url: _pBaseUrl + _pCSSContentUrl + "?" + ((new Date()).getTime()),
                    onload: function (response) {
                        _pLogger.Print("[Async1][Async2] CSStylesheet Recache Completed.", "plain");
                        _pStorage.Set("_pSetCSSc", response.responseText);
                        $('head').append("<style type='text/css'>" + _pStorage.Get("_pSetCSSc") + "</style>");
                        fn();
                    },
                    onerror: function (response) {
                        _pLogger.Print("[Async1][Async2] Error: " + response.status, "error");
                        throw new Error("UserScript Terminated");
                    }
                });
            }
            else {
                $('head').append("<style type='text/css'>" + _pStorage.Get("_pSetCSSc") + "</style>");
                fn();
            }
        },
        onerror: function (response) {
            _pLogger.Print("[Async1] Error: " + response.status, "error");
            throw new Error("UserScript Terminated");
        }
    });
    _pLogger.CloseGroup();

}
function _pCheckUpdate(override, fn) {
    if (fn == undefined)
        fn = function () { };
    var _pTime = _pStorage.Get("_pSetCUpd") + "";
    var _pUpdateProceed = false;
    if ((new Date().getTime()) > _pTime.toInt())
        _pUpdateProceed = true;
    if (override != undefined)
        _pUpdateProceed = true;
    if (_pUpdateProceed) {
        _pStorage.Set("_pSetCUpd", (new Date().setTime((new Date().getTime()) + (1 * 5 * 60 * 1000))) + "");
        _pLogger.Print("Checking for new Updates...", "group");
        GM_xmlhttpRequest({
            method: "GET",
            url: _pBaseUrl + "tsr.ver?" + ((new Date()).getTime()),
            async: false,
            onload: function (response) {
                _pLogger.Print("Local  Version: " + _pVersion, "plain");
                _pLogger.Print("Remote Version: " + response.responseText, "plain");
                if (_pVersion.Replace(".", "", 2).toFloat() < response.responseText.Replace(".", "", 2).toFloat()) {
                    _pLogger.Print("Versions Missmatch. Available Version: " + response.responseText, "plain");
                    $("#_pLocalVersion").html(_pVersion);
                    $("#_pRemoteVersion").html(response.responseText);
                    $("._pOverlay").show();
                    $("._pUpdateContainer").show();
                }
                if (_pVersion.Replace(".", "", 2).toInt() > response.responseText.Replace(".", "", 2).toInt())
                    _pLogger.Print("Versions Missmatch. Client has higher Version than official. Official Version: " + response.responseText, "plain");
            },
            onerror: function (response) {
                _pLogger.Print("Error: " + response.status, "error");
            }
        });
        _pLogger.CloseGroup();
        fn();
    }
}
function _pDownload(id) {
    _pLogger.Print("Download Initialized", "group");
    if (Browser() == "Chrome" || Browser() == "Opera") {
        _pLogger.Print("Browser " + Browser() + " Method #1", "plain");
        _pLogger.Time("Download Completed: ");
        var url = '/ajax.php?c=downloads&a=initDownload' + '&itemid=' + id + '&format=zip&time=1660884710';
        $.ajax("downloads/download/itemId/" + id, {
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            $.ajax(url, {
                xhrFields: {
                    withCredentials: true
                }
            }).done(function (data) {
                $.ajax("/downloads/download/itemId/" + id, {
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(() => {
                    $.ajax("/tsrHitCounter.php", {
                        xhrFields: {
                            withCredentials: true
                        }
                    }).done(() => {
                        $.ajax("/ajax.php?c=downloads&a=refreshbasket", {
                            xhrFields: {
                                withCredentials: true
                            }
                        }).done(() => {
                            setTimeout(() => {
                                _dl(id, "zip", function (url) {
                                    _pLogger.Print("Download Starting...", "plain");
                                    window.location.assign(url);
                                    _pLogger.TimeEnd("Download Completed: ");
                                });
                            }, 1000);
                        });
                    });
                });
            })
        }).fail(function (err) {
            console.log('Error in _nonSubDl');
            console.log(err);
        });
    }
    else if (Browser() == "Firefox") {
        _pLogger.Print("Browser " + Browser() + " Method #2", "plain");
        function RunInPage(func) {
            _pLogger.Print("Injecting Script Download Directive to WebPage...", "plain");
            var s = document.createElement("script");
            s.textContent = "(" + func + ")(" + id + ");";
            document.body.appendChild(s);
            _pLogger.Print("Injection Complete. Download Starting...", "plain");
            setTimeout(function () { document.body.removeChild(s) }, 0);
        }
        RunInPage(function (itemid) {
            _dl2(itemid, "zip", function (url) {
                window.location.assign(url);
            });
        });
    }
    _pLogger.CloseGroup();
}
function _dl2(itemid, format, callback, extraInfo) {
    var mid = typeof (localStorage.memberId) !== 'undefined' ? localStorage.memberId : 0;
    var lk = typeof (localStorage.LoginKey) !== 'undefined' ? localStorage.LoginKey : 0;
    var ex = '';
    if (typeof (extraInfo) !== 'undefined')
        ex = '&ex=1';
    var ajxc = '/ajax.php?c=downloads&a=getdownloadurl&ajax=1&itemid=' + itemid + '&mid=' + mid + '&lk=' + lk + ex;
    $.ajax(ajxc,
        {
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Referer', 'https://www.thesimsresource.com/downloads/thankyou/id/' + itemid)
            }
        }).done(function (data) {
        if (data.error && data.error.length > 0) {
            console.log('logout initiated in _dl');
            alert(data.error);
            if (data.logout)
                logout();
        } else {
            if (typeof (callback) !== 'undefined') {
                callback(data.url, data.data);
            } else {
                document.location.href = data.url;
            }
        }
    }).fail(function (err) {
        console.log('Error in _dl');
        console.log(err);
        alert(err.message);
    });
}
function _pFastNavigate(e) {
    _pLogger.Print("Fast Navigation Initialized", "group");
    if ($(e.currentTarget).parent().attr("class") != "on") {
        _pLogger.Print("Determining Current Page Number", "plain");
        var ElementPage = (($(e.currentTarget).find("span").length > 0) ? _pGetPage($(e.currentTarget).attr("href")) : parseInt($(e.currentTarget).html()));
        _pLogger.Print("Current Page:  " + ElementPage, "plain");
        _pLogger.Print("Previous Page: " + CurrentPage, "plain");
        PrevPage = CurrentPage;
        CurrentPage = ElementPage;
        _pLogger.Print("Checking if page is cached...", "plain");
        if (Items[ElementPage] == undefined) {
            if (!Busy) {
                Busy = true;
                tURL[tURL.length - 4] = CurrentPage;
                cURL = tURL.join("/");
                _pLogger.Print("Page is not cached. Fetching New page...", "plain");
                _pFetchPage(cURL, function (Data) { _pLoadItems(Data); });
                setTimeout(function () { Busy = false; }, 200);
            }
        }
        else {
            _pLogger.Print("Page is cached.", "plain");
            _pLogger.Print("Replacing Navigation Bars...", "plain");
            $(".pager").each(function (i, e) {
                $(e).html(Items[ElementPage][1]);
                $(".jump").remove();
            });
            $(".pager ul li a").on("click", function (z) {
                _pFastNavigate(z);
            });
            _pLogger.Print("Replacing Items...", "plain");
            $("[page=" + ElementPage + "]").show();
            $("[page=" + PrevPage + "]").hide();
        }
    }
    _pLogger.CloseGroup();
    e.preventDefault();
}

function _pFetchPage(URL, fn) {
    _pLogger.Print("Page Fetch Initialized", "group");
    _pLogger.Print("Entering Asynchronous Mode (Async4)", "plain");
    _pLogger.Time("[Aysnc4] Paged Fetched: ");
    currentURL = URL;
    $.ajax({
        url: URL,
        success: function (data) {
            _pLogger.TimeEnd("[Async4] Paged Fetched: ");
            fn(data);
        }
    });
    _pLogger.CloseGroup();

}

function _pFilter_Exported(filterDiv) {
    var illegalScript = $("script:contains('currentSection')").html();
    illegalScript = illegalScript.substr(illegalScript.indexOf("\n") + 1);
    illegalScript = illegalScript.substr(illegalScript.indexOf("\n") + 1);
    eval(illegalScript);
    var options = "";
    var attributes = "";
    var buttons = $(filterDiv).find("a.fil_button,input.fil_input");
    buttons.each(function (i, e) {
        e = $(e);
        var v = e.is('input') ? e.val() : e.attr('value');
        var k = e.attr("key");
        if (!v || !k)
            return;
        if (k.match(/myexpansions/)) {
            if (e.hasClass("fil_checkon"))
                options += "emask/" + localStorage.ExpansionMasks + "/";
        } else if (k.match(/attr[0-9]?/)) {
            if (e.hasClass("fil_checkon") || e.hasClass("fil_on") || e.hasClass("fil_input"))
                attributes += (attributes != "" ? "," : "") + k + "_" + encodeURIComponent(v);
        } else {
            if (e.hasClass("fil_checkon") || e.hasClass("fil_on") || e.hasClass("fil_input"))
                options += k + "/" + encodeURIComponent(v) + "/";
        }
    });
    var newUrl = root + "/" + currentSection + (currentCategory ? ("/category/" + currentCategory) : "") + "/" + options + (attributes != "" ? ("attributes" + "/" + attributes + "/") : "");
    if (currentURL.match(/\/free\/0/))
        newUrl += "free/0/";
    else if (currentURL.match(/\/free\/1/))
        newUrl += "free/1/";
    if (currentURL.match(/\/search\//)) {
        var m = currentURL.match(/\/search\/(.*?)\//);
        newUrl += "search/" + encodeURIComponent(m[1]) + "/";
    }
    return newUrl;
}

function _pGetPage(href) {
    var _URL;
    if (href == undefined)
        _URL = window.location.pathname;
    else
        _URL = href;
    if (_URL.split('/').indexOf("browse") > 0) {
        var Url = _URL.split('/');
        if (Url[Url.length - 5] == "page")
            return parseInt(Url[Url.length - 4]);
        else
            return 1;
    }
    else
        return 0;
}

function _pGetTranslation(Option, Language) {
    _pLogger.Print("Getting Variable Replacement for [Item : " + Option + "][Language : " + Language + "]...", "groupc");
    var Result;
    if (Option != "_pLanguageSelect")
        if (_pTranslations[Language] != undefined) {
            var Trans = _pTranslations[Language][Option];
            _pLogger.Print("Variable [" + Option + " : " + Trans + "]", "plain");
            _pLogger.CloseGroup();
            return Trans;
        }
        else {
            var Trans = _pTranslations["en"][Option];
            _pLogger.Print("Variable in this Language is not Available. Fallback to Default Language (English)", "plain");
            _pLogger.Print("Variable [" + Option + " : " + Trans + "]", "plain");
            _pLogger.CloseGroup();
            return Trans;
        }
    else {
        _pLogger.Print("Fetching Available Languages...", "group");
        Result = "<select>";
        for (var i = 0; i < _pTranslations.Size(); i++) {
            var Key = _pTranslations.GetValue(i)[0];
            var Obj = _pTranslations.GetValue(i)[1];
            _pLogger.Print("Language Found: " + Obj._pUnverstalLangName + " - " + Obj._pNativeLangName, "plain");
            Result += "<option " + (Key == _pStorage.Get("_pOptLang") ? "selected" : "") + " value=\"" + Key + "\">" + Obj._pUniversalLangName + ((Obj._pNativeLangName != "") ? (" - " + Obj._pNativeLangName) : "") + "</option>";
        }
        _pLogger.CloseGroup();
        _pLogger.CloseGroup();
        Result += "</select>";
        return Result;
    }
}

function _pLoadItems(data, newSearch) {
    _pLogger.Print("Load Items Initialized", "group");
    _pLogger.Print("Hidding Items of Previous Page/Search...", "plain");
    $("[itemid]").each(function (c, o) {
        if (!$(o).is("[page]"))
            $(o).attr("page", PrevPage);
        if (newSearch) {
            $(o).remove();
        }
        else
            $(o).hide();
    });
    var tPage;
    if (newSearch) {
        _pLogger.Print("This is a new Search. Previous Items Removed", "plain");
        tPage = 1;
        Items = [[]];
    }
    else
        tPage = CurrentPage;
    var iObject = $($.parseHTML(data));
    $.each(iObject.find(".loadingbox"), function (i, e) { $(e).remove() });
    var Found = false;
    _pLogger.Print("Extracting Items...", "groupc");
    iObject.find("[itemid]").each(function (i, e) {
        $(e).attr("page", tPage);
        $("#browse-files").append($(e));
        Found = true;
        _pLogger.Print("Item Found [ID : " + $(e).attr("itemid") + "]", "plain");
    });

    if (Found) {
        _pLogger.Print("Items Found", "plain");
        _pProcessItems();
        _pLogger.Print("Replacing Navigation Bar...", "plain");
        var Pager = iObject.find(".pager");
        $(".pager").each(function (i, e) {
            $(e).html(Pager.html());
            $(".jump").remove();
        });
        if (newSearch)
            tURL = $(".pager ul li a:last").attr("href").split('/');
        $(".pager ul li a").on("click", function (z) {
            _pFastNavigate(z);
        });
        _pLogger.Print("Caching Items...", "plain");
        Items[tPage] = [true, Pager.html()];
    }
    else {
        _pLogger.Print("No Items Found", "plain");
    }
    _pLogger.CloseGroup();
    _pLogger.CloseGroup();
}
function _pPreviewInit(e, b) {
    _pLogger.Print("Preview Item Initialized...", "group");
    var Temp = [];
    Temp[0] = b[0];
    Temp[1] = b[1];
    Temp[2] = b[2];
    $("._pLoadOverlay").css("display", "block");
    $("._pContainer").css("top", $(window).scrollTop() + "px");
    $("._pContainer").show();
    _pLogger.Print("Showing Item Container...", "plain");
    _pLogger.Print("Fetching Item's Information... Entering Asynchronous Mode (Async5)", "plain");
    $.get(Temp[1], function (data) {
        _pLogger.Print("[Async5] Showing Loading Overlay...", "plain");
        _pLogger.Print("[Async5] Item's Page Loaded", "plain");
        _pLogger.Print("[Async5] Extracting Information...", "groupc");
        var iObject = $($.parseHTML(data));
        var iTemp = $(iObject.find("[class='big-header']"));
        iTemp.find("span").remove();
        var iTitle = iTemp.html();
        _pLogger.Print("[Async5] Title: " + iTitle, "plain");
        $("#_pImageList").html("");
        $('._pImagePreview ul').attr("style", "");
        $('#_pDownload').attr("dlid", Temp[0]);
        var Counter = 0;
        $(iObject.find("ul[class=slides]")).find("li").each(function (i, e) {
            Counter++;
            $("#_pImageList").append("<li><img src='" + $($(e).find("img")).attr("src") + "'></li>");
        });
        _pLogger.Print("[Async5] Images Found: " + Counter, "plain");
        if ($("#_pImageList li").length < 2) {
            $("._pNext, ._pPrev").hide();
        }
        else {
            $("._pNext, ._pPrev").show();
            var slideCount = $('._pImagePreview ul li').length;
            var slideWidth = $('._pImagePreview ul li').width();
            var slideHeight = $('._pImagePreview ul li').height();
            var sliderUlWidth = slideCount * slideWidth;
            $('._pImagePreview ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
            $('._pImagePreview ul li:last-child').prependTo('._pImagePreview ul');
            $('._pImagePreview ul li:last-child').prependTo('._pImagePreview ul');
        }
        $("._pTitle").html(iTitle);
        $("#_pDescTitle").html(iTitle);
        if (Temp[2] == null) {
            var iDate = iObject.find("[class=big-published-details]").find("em").html();
            iDate = iDate.substr(iDate.indexOf(" ") + 1);
            var iAuthor = iObject.find("[class=big-creator]").html();
            Temp[2] = "<em>" + iDate + " by <strong>" + iAuthor + "</strong></em>";
        }
        $("#_pDescInfo").html(Temp[2]);

        var _Desc = $($(iObject.find("div[class=info-description]")).html());
        _pLogger.Print("[Async5] Description: " + _Desc, "plain");
        $("#_pDescContent").html(_Desc);
        _pLogger.Print("[Async5] Determining if this Item belongs to a Set...", "plain");
        if ($(iObject).find("a:contains('This Creation belongs to a Set')").length > 0) {
            _pLogger.Print("[Async5] Item Belongs to Set with ID: " + $(iObject).find("a:contains('This Creation belongs to a Set')").attr("href").split('/')[6], "plain");
            $("#_pSetDownload,#_pSetView").show();
            $("#_pSetDownload").attr("dlid", $(iObject).find("a:contains('This Creation belongs to a Set')").attr("href").split('/')[6]);
            $("#_pSetView").attr("viewid", $(iObject).find("a:contains('This Creation belongs to a Set')").attr("href").split('/')[6]);
            $("#_pSetView").attr("viewurl", $(iObject).find("a:contains('This Creation belongs to a Set')").attr("href"));
        }
        else {
            _pLogger.Print("[Async5] This item does not belong to a Set.", "plain");
            $("#_pSetDownload,#_pSetView").hide();
        }
        _pLogger.CloseGroup();
        _pLogger.Print("[Async5] Removing Loading Overlay...", "plain");
        $("._pLoadOverlay").hide();
    });
    _pLogger.CloseGroup();
    e.preventDefault();
    e.stopPropagation();
};

function _pProcessItems() {
    _pLogger.Print("Process Items Initialized...", "group");
    var ItemID = [];
    ItemID[0] = [];
    ItemID[1] = [];
    ItemID[2] = [];
    var TimeOut;
    var Once = 0;
    _pLogger.Print("Searching Page for Items...", "plain");
    $.each($("html").find(".loadingbox"), function (i, e) { $(e).remove() });
    $("[itemid]").each(function (i, e) {
        if (Once == 0) {
            _pLogger.Print("Processing Items...", "group");
            Once++;
        }
        if (!$(e).is("[edited]")) {
            _pLogger.Print("Processing Item [ID:" + $(e).attr("itemid") + "]", "plain");
            $(e).attr("edited", true);
            var mElement = $(e);
            var aElement = $(e).find("a[rel=maingroup]");
            ItemID[0][i] = mElement.attr("itemid");
            ItemID[1][i] = aElement.attr("data-href");
            aElement.attr("onclick", "");
            if (_pStorage.Get("_pOptPomo") == "true") {
                var cElement = $($(e).find("div.browse-info"));
                var cEm = $(cElement.find("em"));
                ItemID[2][i] = cEm.html();
                cEm.remove();
                cElement.append(_pTranslateHtml("<div><a rel='nofollow' preview=" + ItemID[0][i] + " id='_pInfoButton' style='height:25px;margin-top:4px;font-size:12px;' class='button button-blue' ><div style='margin-top:-5px;'><span class='icon icon-info'></span>%_pInfoButton%</div></a></div>"));
                var iElement = $("[preview=" + ItemID[0][i] + "]");
                iElement.on("click", function (e) {
                    var Temp = [];
                    Temp[0] = ItemID[0][i];
                    Temp[1] = ItemID[1][i];
                    Temp[2] = ItemID[2][i];
                    _pPreviewInit(e, Temp);
                });
            }
            if (_pStorage.Get("_pOptFadl") == "true") {
                aElement.click(function (e) {
                    _pDownload(ItemID[0][i]);
                    e.preventDefault();
                });
            }
        }
    });
    _pLogger.CloseGroup();
    _pLogger.CloseGroup();
}

function _pResetFilter_Exported() {
    var illegalScript = $("script:contains('currentSection')").html();
    illegalScript = illegalScript.substr(illegalScript.indexOf("\n") + 1);
    illegalScript = illegalScript.substr(illegalScript.indexOf("\n") + 1);
    eval(illegalScript);
    newUrl = "/" + currentSection + "/category/" + currentCategory + "/";
    if (currentURL.match(/\/free\/0/))
        newUrl += "free/0/";
    else if (currentURL.match(/\/free\/1/))
        newUrl += "free/1/";
    return newUrl;
}

function _pSearch_Exported() {
    var illegalScript = $("script:contains('currentSection')").html();
    illegalScript = illegalScript.substr(illegalScript.indexOf("\n") + 1);
    illegalScript = illegalScript.substr(illegalScript.indexOf("\n") + 1);
    eval(illegalScript);

    var cat = "";

    if ($('search_category_any') != null && $('search_category_any').checked)
        cat = topCategory;
    else
        cat = currentCategory;
    var url = root + "/" + currentSection + "/";
    if (cat != null && cat.length > 0)
        url = url + "category/" + cat + "/";
    var freemode_subscriber = $('freemode_subscriber');
    var freemode_free = $('freemode_free');
    if (freemode_subscriber != null && freemode_subscriber.className == "on")
        url = url + "free/0/";
    else if (freemode_free != null && freemode_free.className == "on")
        url = url + "free/1/";
    var expfilter = $('search_expansionpacksfilter');
    if (expfilter != null && expfilter.attr('checked'))
        url = url + "emask/" + getExpansionPacks() + "/";
    try {
        //alert(currentCategory);
        if (attributeIDlist != null) {
            var attributes = "";
            var attributeIDarr = attributeIDlist.split(",");
            for (i = 0; i < attributeIDarr.length; i++) {
                attr = $('attr_' + attributeIDarr[i]);
                if (attr != null) {
                    if (attr.selectedIndex > 0) {
                        if (attributes.length > 0)
                            attributes = attributes + ",";
                        attributes = attributes + "attr" + attributeIDarr[i] + "_" + attr.options[attr.selectedIndex].value;
                    } else if (attr.value.length > 0) {
                        if (attributes.length > 0)
                            attributes = attributes + ",";
                        attributes = attributes + "attr" + attributeIDarr[i] + "_" + attr.value;
                    }
                }
            }
            if (attributes.length > 0)
                url = url + "attributes/" + attributes + "/";
        }
    } catch (e) { }
    if (extraSearchFields != null && extraSearchFields.length > 0) {
        var fieldsArr = extraSearchFields.split(',');
        for (i = 0; i < fieldsArr.length; i++) {
            field = $('search_' + fieldsArr[i]);
            if (field != null) {
                if (field.selectedIndex > 0)
                    url = url + fieldsArr[i] + "/" + field.options[field.selectedIndex].value + "/";
                else if (field.type != null && field.type.toLowerCase() == "checkbox" && field.checked)
                    url = url + fieldsArr[i] + "/" + field.value + "/";
                else if (field.type != null && field.type.toLowerCase() == "text" && field.value.length > 0)
                    url = url + fieldsArr[i] + "/" + field.value + "/";
            } else
                alert(fieldsArr[i] + ' not found');
        }
    }
    var searchPhrase = $('#search_searchfield').val();
    if (searchPhrase != null && searchPhrase.length > 0) {
        searchPhrase = searchPhrase.replace(/^\s+|\s+$/g, '');
        if (searchPhrase.indexOf(' ') == -1 && (searchPhrase.indexOf('"') > -1 || searchPhrase.indexOf('"') > -1))
            searchPhrase = searchPhrase.replace(/"/g, '');
        if (searchPhrase.length < 3) {
            alert('The search phrase must a least contain 3 characters!');
            return false;
        }
        if (searchPhrase.length > 3 && _isInteger(searchPhrase)) {
            if (confirm('You have entered a number. Is this the ID of the item you are looking for?')) {
                url = root + "/" + currentSection.replace(/browse/g, 'details') + "/category/" + topCategory + "/id/" + searchPhrase + "/";
                return url;
            }
        }
        url = url + "search/" + encodeURI(searchPhrase.toLowerCase()) + "/";
    }
    var orderSelect = $('search_order');
    if (orderSelect != null && orderSelect.selectedIndex > 0 && orderSelect.options[orderSelect.selectedIndex].value != "") {
        url = url + "order/" + orderSelect.options[orderSelect.selectedIndex].value + "/";
    }
    var viewSelect = $('search_view');
    if (viewSelect != null && viewSelect.selectedIndex > 0 && viewSelect.options[viewSelect.selectedIndex].value != "") {
        url = url + "view/" + viewSelect.options[viewSelect.selectedIndex].value + "/";
    }
    return url;
}

function _pTranslateHtml(Content) {
    _pLogger.Print("HTML Variable Replacement Initialized", "group");
    var RegexPattern = /(%_p[A-Z])\w.*?(%)/g;
    var Language = _pStorage.Get("_pOptLang");
    _pLogger.Print("Regular Expression: " + RegexPattern, "plain");
    _pLogger.Print("Language: " + Language, "plain");
    _pLogger.Print("Searcing for Variables in HTML Content..", "plain");
    var Matches = Content.match(RegexPattern);
    _pLogger.Print("Variables Found: " + Matches.length, "plain");
    var toReplace = [];
    for (var i = 0; i < Matches.length; i++) {
        Content = Content.replace(Matches[i], _pGetTranslation(Matches[i].between("%", "%"), Language));
    }
    _pLogger.CloseGroup();
    return Content;
}

function Timeout(fn, interval) {
    var Handle = this;
    var id = setTimeout(function () { fn(); Handle.cleared = true; }, interval);

    Handle.cleared = false;
    Handle.clear = function clear() {
        this.cleared = true;
        clearTimeout(id);
    };
}

/*
 **
 **
 ** Main Code
 **
 **
 */
$(document).ready(function () {
    _pLogger.Clear();
    PrevPage = _pGetPage();
    CurrentPage = PrevPage;
    if (CurrentPage > 0 && $(".pager ul li a:last").length > 0) {
        tURL = $(".pager ul li a:last").attr("href").split('/');
        console.log(tURL);
    };
    if (Browser() != "Firefox") {
        _pLogger.Print("%cTheSimsResource Utilities", "plain", "margin-left:20%;font-size:50px");
        _pLogger.Print("%cVersion " + _pVersion, "plain", "margin-left:32%;color:#999;font-size:30px;height:500px");
        _pLogger.Print("%cDeveloped By%cEmail", "plain", "margin-left:31.75%;color:#AAA", "margin-left:6%;color:#AAA");
        _pLogger.Print("%cNikolas Mavropoylos%c - %cinfo@devian.gr", "plain", "margin-left:28.50%;font-size:18px;color:#666;", "", "font-weight:bold;font-size:18px");
        _pLogger.Print("%c            ", "plain", "background-image: url(\"https://proicons.github.io/static/tsr/img/tsrelogo.png\");background-size:cover;font-size:20px;border-radius:5px;margin-left:34.5%");
    }
    else {
        _pLogger.Print("%cTheSimsResource Utilities", "plain", "font-size:50px");
        _pLogger.Print("%cVersion " + _pVersion, "plain", "color:#999;font-size:30px;height:500px");
        _pLogger.Print("%cDeveloped By", "plain", "color:#AAA");
        _pLogger.Print("%cNikolas Mavropoylos%c - %cinfo@devian.gr", "plain", "font-size:18px;color:#666;", "", "font-weight:bold;font-size:18px");
        _pLogger.Print("%c            ", "plain", "background-image: url(\"https://proicons.github.io/static/tsr/img/tsrelogo.png\");background-size:cover;font-size:20px;border-radius:5px;");
    }
    _pLogger.Print("%cInitializing Script...", "group", "font-weight:bold");
    _pLogger.Time("Script Initialization Complete. Time: ");
    _pApplyCSS(function () {
        _pLogger.Print("[Async1] Style Injection Complete", "plain");
        $("._pNavBar").show();
    });
    if ($("#cookiesdirective").length > 0)
        $("#cookiesdirective").find("div").css("margin-bottom", "21px");
    Items[CurrentPage] = true;
    $(".jump").remove();
    $(".ad-browse-rectangle,.nonsubscriber,[class^=ad-]").each(function (i, e) { $(e).remove() });
    $(".loadingbox").remove();
    $(".sticky_bottom").remove();
    $("#browse-files").css("z-index", "-1");
    $("body").prepend(_pTranslateHtml(_pInfoContainer));
    $("body").append(_pTranslateHtml(_pNavBar));

    if (window.location.pathname.split('/').indexOf("browse") > 0) {
        $("#browse-files").prepend(_pTranslateHtml(_pPreviewContainer));
        $("._pContainer").css("background-color", "#fff");
        $("._pContainer").css("margin-top", "");
        $("._pContainer").css("margin-left", "");
        $("._pContainer").css("z-index", "1");
        $("#_pDownload,#_pSetDownload").on("click", function (e) {
            _pDownload($(this).attr("dlid"));
            e.preventDefault();
        });
        $("#_pSetView").on("click", function (e) {
            var pTemp = [];
            pTemp[0] = $("#_pSetView").attr("viewid");
            pTemp[1] = $("#_pSetView").attr("viewurl");
            pTemp[2] = null;
            _pPreviewInit(e, pTemp);
            e.preventDefault();
        });

        if (_pStorage.Get("_pOptPomo")) {

            function stopScroll(e) {
                if ($("._pContainer").is(":visible")) {
                    if ($(e.target).attr("class") == "_pDescription") {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
            $(document).keydown(function (e) {
                switch (e.which) {
                    case 27:
                        if ($("._pContainer").is(":visible"))
                            $("._pContainer").hide();
                        break;
                }
            });
            _pProcessItems();
            $('body').on({
                'mousewheel': function (e) {
                    stopScroll(e);
                },
                'scroll': function (e) {
                    stopScroll(e);
                },
                'touchmove': function (e) {
                    stopScroll(e);
                }
            });

        }
        $('._pDescription').bind('mousewheel DOMMouseScroll', function (e) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        });

        var slideCount = $('._pImagePreview ul li').length;
        var slideWidth = $('._pImagePreview ul li').width();
        var slideHeight = $('._pImagePreview ul li').height();
        var sliderUlWidth = slideCount * slideWidth;
        $('._pImagePreview ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
        $('._pImagePreview ul li:last-child').prependTo('._pImagePreview ul');
        function moveLeft() {
            $('._pImagePreview ul').animate({
                left: + slideWidth
            }, 200, function () {
                $('._pImagePreview ul li:last-child').prependTo('._pImagePreview ul');
                $('._pImagePreview ul').css('left', '');
            });
        };
        function moveRight() {
            $('._pImagePreview ul').animate({
                left: - slideWidth
            }, 200, function () {
                $('._pImagePreview ul li:first-child').appendTo('._pImagePreview ul');
                $('._pImagePreview ul').css('left', '');
            });
        };
        $('._pNext').click(function (e) { moveLeft(); e.preventDefault(); });
        $('._pPrev').click(function (e) { moveRight(); e.preventDefault(); });

        if (_pStorage.Get("_pOptScro") == "true") {
            var Page = 0;
            var Busy = false;
            var cURL = window.location.pathname;
            tURL = $(".pager ul li a:last").attr("href").split('/');
            $(".pager").remove();
            $(window).scroll(function (e) {
                var _pCStart = $("#browse-files").offset().top;
                var _pCEnd = _pCStart + $("#browse-files").height();
                var _pSStart = $(window).scrollTop();
                var _pSEnd = $(window).scrollTop() + $(window).height();
                if (_pSEnd >= _pCEnd) {
                    if (!Busy) {
                        _pLogger.Print("Infinite Scrolling Initialized", "group");
                        Busy = true;
                        cURL = cURL.split('/');
                        if (cURL[cURL.length - 5] == "page") {
                            Page = parseInt(cURL[cURL.length - 4]);
                            Page++;
                        }
                        else
                            Page = 2;
                        tURL[tURL.length - 4] = Page;
                        cURL = tURL.join("/");
                        $("#broswe-files").append('<div id="_pLoadMore"><hr><img src="/images/v9/ajax-loader.gif" width="25px" class="dldelayspinner" id="dldelayspinner"><hr></div>');
                        _pLogger.Print("Fetching Next page, Entering Asynchronous Mode (Async3)", "plain");
                        $.get(cURL, function (data) {
                            _pLogger.Print("Page fetched. Extracting Items...", "plain");
                            $("#pLoadMore").remove();
                            var iObject = $($.parseHTML(data));
                            var Found = false;
                            var Itemlist = "";
                            iObject.find("[itemid]").each(function (i, e) {
                                Itemlist += $(e).attr("itemid") + ",";
                                $("#browse-files").append($(e));
                                Found = true;
                            });

                            if (Found) {
                                _pLogger.Print("Items " + Itemlist + " Inserted.", "plain");
                                _pLogger.CloseGroup();
                                _pProcessItems();
                                setTimeout(function () { Busy = false; }, 1000);
                            }
                            else {
                                _pLogger.Print("No items found!.", "plain");
                                _pLogger.CloseGroup();
                            }
                        });
                    }
                }
            });
        }
        else {
            if (_pStorage.Get("_pOptPagi") == "true") {
                var newHTML = $(".pager").clone();
                $("#browse-files").before(newHTML);
            }
        }
        if (_pStorage.Get("_pOptTabl") == "true") {
            if (_pStorage.Get("_pOptNavi") == "true") {
                $(document).keydown(function (e) {
                    var FakeObject = {}
                    FakeObject.preventDefault = function () { };
                    switch (e.which) {
                        case 37: // left
                            if ($(".icon-previousarrow").parent().length > 0) {
                                FakeObject.currentTarget = $(".icon-previousarrow").parent();
                                _pFastNavigate(FakeObject);
                            }
                            break;

                        case 39: // right
                            if ($(".icon-nextarrow").parent().length > 0) {
                                FakeObject.currentTarget = $(".icon-nextarrow").parent();
                                _pFastNavigate(FakeObject);
                            }
                            break;
                        default: return;
                    }
                });
            }
            $(".pager ul li a").on("click", function (e) { _pFastNavigate(e); });
        }
        if (_pStorage.Get("_pOptFase") == "true") {
            $("#search_searchfield").parent().attr("onsubmit", "");
            $("#search_searchfield").parent().on('submit', function (e) {
                if ($("#search_searchfield").val().length > 0) {
                    _pFetchPage(_pSearch_Exported(), function (Data) { _pLoadItems(Data, true); });
                }
                e.preventDefault();
            });
            var ObjAFilter = $("[onclick^=filterItems]");
            var ObjRFilter = $("[onclick^=resetFilter]");
            ObjAFilter.attr("onclick", "");
            ObjRFilter.attr("onclick", "");
            ObjAFilter.on("click", function (e) {
                _pFetchPage(_pFilter_Exported($("#filters")), function (Data) { _pLoadItems(Data, true); });
                e.preventDefault();
            });
            ObjRFilter.on("click", function (e) {
                _pFetchPage(_pResetFilter_Exported(), function (Data) { _pLoadItems(Data, true); });
                e.preventDefault();
            });
        }
        if (_pStorage.Get("_pOptNavi") == "true" && _pStorage.Get("_pOptScro") == "false" && _pStorage.Get("_pOptTabl") == "false") {
            $(document).keydown(function (e) {
                switch (e.which) {
                    case 37: // left
                        document.location.href = $(".icon-previousarrow").parent().attr("href");
                        break;

                    case 39: // right
                        document.location.href = $(".icon-nextarrow").parent().attr("href");
                        break;
                    default: return;
                }
            });
        }
    }
    if (window.location.pathname.split('/')[2] == "details") {
        if (_pStorage.Get("_pOptFadl") == "true") {
            $(".big-download-buttons").click(function (e) {
                _pDownload($(".big-download-buttons a").attr("itemid"));
                e.preventDefault();
                e.stopPropagation();
            });
            $(".dldelayspinner").hide();
            $("a[rel=nofollow][title=Download]").show();

        }
        //<a href="/ajax.php?c=downloads&amp;a=install&amp;itemid=1308697" rel="nofollow" itemid="1308697" style="clear: both;" class="button button-green hideme tsrinstall">Install with TSR CC Manager</a>
    }
    $("#wrapper-version").html(((GM_info['scriptHandler'] == undefined) ? "Greasemonkey" : GM_info['scriptHandler']) + " " + ((GM_info['version'] == undefined) ? "3.1.1+" : GM_info['version']));

    for (var i = 0; i < _pStorage.List(true).Size(); i++) {
        var Obj = _pStorage.List(true).GetValue(i);
        var Key = Obj[0];
        var Val = Obj[1];
        if (Val == "true")
            $("[db=" + Key + "]").prop('checked', true);
    }
    if (_pStorage.Get("_pOptInfo") == "true") {
        $("._pNavInfo").show(0);
        $("[db=_pOptInfo]").prop('checked', true);
    }
    $("[db^=_pOpt],[db^=_pSet]").each(function (i, e) {
        $(e).click(function (element) {
            if ($(e).prop('checked') == true) {
                _pStorage.Set($(e).attr("db"), "true");
                if ($(e).is("[ugroup]")) {
                    $("[db^=_pOpt],[db^=_pSet]").each(function (z, n) {
                        if (e != n) {
                            if ($(e).attr("ugroup") == $(n).attr("ugroup")) {
                                _pStorage.Set($(n).attr("db"), "false");
                                $(n).prop('checked', false);
                            }
                        }
                    });

                }
            }
            else
                _pStorage.Set($(e).attr("db"), "false");
            if ($(e).attr("db") == "_pOptInfo")
                if ($(e).prop('checked') == true) {
                    $("[Con^=_p]").hide(300);
                    $("._pNavInfo").show(300);
                }
                else {
                    $("._pNavInfo").hide(300);
                }
            else
                $("._pNavBarUpdate").animate({ "margin-right": "-230px", "width": "200px" }, 200);

        });
    });
    $("[id^=_p][id$=OptL]").each(function (i, e) {
        $(e).click(function (element) {
            if ($("[Con=" + $(e).attr("id") + "]").is(":visible")) {
                $("[Con=" + $(e).attr("id") + "]").hide(300);
                if (_pStorage.Get("_pOptInfo") == "true") {
                    $("[db=_pOptInfo]").prop("checked", true);
                    $("._pNavInfo").show(300);
                }
            }
            else {
                $("[Con=" + $(e).attr("id") + "]").show(300);
                $("[Con^=_p][Con$=OptL]").each(function (z, n) {
                    if ($(e).attr("id") != $(n).attr("Con"))
                        ($(n).is(":visible")) ? $(n).hide(300) : null;
                });
                if ($("._pNavInfo").is(":visible")) {
                    $("[db=_pOptInfo]").prop("checked", false);
                    $("._pNavInfo").hide(300);
                }
            }
            element.preventDefault();
        });
    });
    $("._pNavBarUpdate img").click(function (e) {
        $("._pNavBarUpdate").animate({ "margin-right": "0px", "width": "0px" }, 200);
        e.preventDefault();
    });
    $("._pNavBarHelper center img").click(function (e) {
        var clearHandler = new Timeout(function () {
            $("._pNavBarHelper").slideUp(200);
        }, 200);
        e.preventDefault();

    });
    $("._pNavBarCog img").click(function (e) {
        if ($("._pNavBarSettings").width() == 0) {
            $("._pNavBarSettings").animate({ "margin-left": "-230px", "width": "200px" }, 200);
            $(this).animate({ "margin-left": "3px" }, 200);
            setTimeout(function () { $("._pNavBarSettings").animate({ "height": "126px", "margin-top": "-87px", "border-top-right-radius": "10px" }, 200); }, 350);
        }
        else {
            $("._pNavBarSettings").animate({ "height": "44px", "margin-top": "-5px", "border-top-right-radius": "0px" }, 200);
            setTimeout(function () { $("._pNavBarSettings").animate({ "margin-left": "0px", "width": "0px" }, 200); }, 350);
            $(this).animate({ "margin-left": "15px" }, 200);

        }
    });
    $("._pNavBarCog img").mouseenter(function () {
        $({ deg: 0 }).animate({ deg: 30 }, {
            duration: 200,
            step: function (now) {
                $("._pNavBarCog img").css({
                    transform: 'rotate(' + now + 'deg)'
                });
            }
        });
    });
    $("._pNavBarCog img").mouseleave(function () {
        $({ deg: 30 }).animate({ deg: 0 }, {
            duration: 200,
            step: function (now) {
                $("._pNavBarCog img").css({
                    transform: 'rotate(' + now + 'deg)'
                });
            }
        });
    });
    $("._pNavBarSettingsContainer center select").on("change", function (e) {
        _pStorage.Set("_pOptLang", this.value);
        $("._pNavBarUpdate").animate({ "margin-right": "-230px", "width": "200px" }, 200);
    });
    $("._pNavBarHelperContainer,._pNavBarHelper").mouseover(function () {
        if (!clearHandler.cleared) {
            clearHandler.clear();
        }
    });
    $("._pNavBarHelperContainer,._pNavBarHelper").mouseleave(function () {
        BusyHandler = false;
        clearHandler = new Timeout(function () {
            $("._pNavBarHelper").slideUp(200);
        }, 200);
    });
    $("._pCheckbox label span[help]").each(function (i, e) {
        $(e).css("cursor", "help");
        $(e).mouseover(function () {
            if (!clearHandler.cleared) {
                clearHandler.clear();
                $('._pNavBarHelperContainer').html($(e).attr("help"));
            }
            else {
                if (!BusyHandler) {
                    BusyHandler = true;
                    timeoutHandler = new Timeout(function () {
                        $('._pNavBarHelperContainer').html($(e).attr("help"));
                        $("._pNavBarHelper").slideDown(200);
                        BusyHandler = false;
                    }, 200);
                }
            }
        });
        $(e).mouseleave(function () {
            BusyHandler = false;
            if (!timeoutHandler.cleared)
                timeoutHandler.clear();
            else {
                clearHandler = new Timeout(function () {
                    $("._pNavBarHelper").slideUp(200);
                }, 200);
            }
        });
    });
    $("#_pUpdate").click(function (e) {
        $("._pUpdateContainer").hide();
        if (!$("._pInfoContainer").is(":visible")) {
            $("._pOverlay").hide();
        }
        $("._pNavBarUpdate").animate({ "margin-right": "-230px", "width": "200px" }, 200);

        window.location.assign("https://proicons.github.io/static/tsr/tsr.user.js?" + ((new Date()).getTime()));
        e.preventDefault();
    });
    $("#_pCancel").click(function (e) {
        $("._pUpdateContainer").hide();
        if (!$("._pInfoContainer").is(":visible")) {
            $("._pOverlay").hide();
        }
    });
    $("#_pUpdateButton").click(function (e) {
        $(this).hide();
        _pCheckUpdate(true, function () { $("#_pUpdateButton").show() });

    });
    $("._pClose").each(function (i, e) {
        $(e).on("click", function (e) {
            if ($(this).parent().attr("class") == "_pInfoHeader") {
                $("._pInfoContainer").hide();
                if (!$("._pUpdateContainer").is(":visible")) {
                    $("._pOverlay").hide();
                }
            }
            else
                $("._pContainer").hide();
            e.preventDefault();
        });
    });
    $("#_pAbout").click(function (e) {
        $("._pInfoContent").css("margin-top", "400px");
        $("._pInfoContainer").show();
        $("._pInfoContent").animate({ "margin-top": "0px" }, 10000);
        $("._pOverlay").show();
        e.preventDefault();
    });
    _pLogger.TimeEnd("Script Initialization Complete. Time: ");
    _pLogger.CloseGroup();
    if (_pStorage.Get("_pSetAUpd") == "true")
        _pCheckUpdate();
});