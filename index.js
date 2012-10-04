/// <reference path="../CommonFiles/jQuery/jquery-1.8.1-vsdoc.js" />


Application = {
	domain: "",
	sLastHash: "",
	timer: null,

	oUser: {
		NAME: '',
		CUSTOMER_ID: '',
		USER_ID: '',
		USER_CONTACT_ID: '',
		USER_NAME: '',
		USER_ROLE: '',
		USER_PW: '',
		USER_LAST_LOGIN: '',
		CODE: '',
		WEBPASS: '',
		TOKENRATE: 10,
		TOKENUNIT: 'Token',
		MONTHLYBUDGET: null,
		LANDINGS: null,
		SHIPTIME: null,
		STARTED: '',
		PROVIDER_NAME: null,
		HIDE_WAREHOUSE_REWARDS: '',
		SELECTED_WAREHOUSE_ITEMS: '',
		PARTICIPANT_ALIAS: ''
	},
	oUserRec: {
		ADMIN_ROLE: "",
		CLASS_IDS: "",
		CLASS_NAMES: "",
		CONTACT_ID: "",
		EMAIL: "",
		EMAIL_VERIFIED: "",
		ID: "",
		INACTIVATED: "",
		LAST_LOGIN: "",
		LIMITS: "",
		NAME: "",
		PHONE: "",
		TITLE: ""
	},
	bAlpha: false,
	oPrefs: {
		oGeneral: {
			bAudio: true,
			bShowInactives: false,
			sSortParticipants: "",
			nZoomTo: 0,
			sChangeEmail: ""
		},
		oSignIn: {
			sUser: "",
			sPassword: ""
		},
		oNewAccount: {
			sName: "",
			sEmail: "",
			sProgramName: "",
			sTokenUnit: "Token",
			sParticipantAlias: "Student",
			nTokenRate: 15
		},
		oCollapsibles: {
			sClasses: "collapse",
			sUser: "collapse",
			sPartyTransactions: "collapse"
		},
		oDeposit: {
			nButton1: 1,
			nButton2: 5,
			nButton3: 10,
			sDescription: "Good Job!"
		},
		oWithdrawal: {
			nButton1: 1,
			nButton2: 5,
			nButton3: 10,
			// Description default set in Dashboard.validate to "Tokens/Points/Credits Redeemed"
			sDescription: ""
		},
		oTokens: {
			sDepositDescription: "Earned in Session",
			nTokenTappedAmount: 1
		}
	},

	getPrefs: function () {
		var sData = window.localStorage.getItem("Preferences");

		var oData = {};
		if (sData) {
			try {
				oData = $.evalJSON(sData);
			}
			catch (error) {
				//console.log(error);
				window.localStorage.clear();
				alert("Your local storage (sign in info, sessions tokens, etc) has been cleared because it has been corrupted.");
				oData = {};
			}
		}


		Application.oPrefs = $.extend(true, {}, Application.oPrefs, oData);

		Application.oPrefs.oGeneral.nZoomTo =
			(window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;
		Application.setZoom();
	},
	savePrefs: function () {
		window.localStorage.setItem("Preferences", $.toJSON(Application.oPrefs));
	},
	supportInfo: function () {
		if (
			confirm(
				'window.outerWidth: ' + window.outerWidth + '\nwindow.outerHeight ' + window.outerHeight + '\n\n' +
				'window.innerWidth: ' + window.innerWidth + '\nwindow.innerHeight ' + window.innerHeight + '\n\n' +
				'window.devicePixelRatio: ' + window.devicePixelRatio + '\n\n' +
				'document.documentElement.clientHeight: ' + document.documentElement.clientHeight + '\n\n' +
				'screen.height: ' + screen.height + '\n\n' +
				'screen.availHeight: ' + screen.availHeight + '\n\n' +
				'$("body").width(): ' + $("body").width() + '\n$("body").height(): ' + $("body").height() + '\n\n' +
				'Clear all local storage? (' + localStorage.length + ' items)'
			)
		) {
			window.localStorage.clear();
			window.location.reload();
		}

		// '$(window).width(): ' + $(window).width() + '\n$(window).height(): ' + $(window).height() + '\n\n' +
		//	'$(".ui-page:visible").width(): ' + $(".ui-page:visible").width() + '\n$(".ui-page:visible").height(): ' + $(".ui-page:visible").height() + '\n\n'

	},

	setZoom: function () {
		//$('*').css("zoom", "105%");
		var nZoomTo = Application.oPrefs.oGeneral.nZoomTo;
		$('html').removeClass('zoom240 zoom320 zoom360 zoom420 zoom480 zoom540 zoom800');
		$('html span.zoomState').hide();
		if (nZoomTo >= 800) {
			$('html').addClass('zoom800');
			$('html span.zoomState.800').show();
		}
		else if (nZoomTo >= 540) {
			$('html').addClass('zoom540');
			$('html span.zoomState.540').show();
		}
		else if (nZoomTo >= 480) {
			$('html').addClass('zoom480');
			$('html span.zoomState.480').show();
		}
		else if (nZoomTo >= 420) {
			$('html').addClass('zoom420');
			$('html span.zoomState.420').show();
		}
		else if (nZoomTo >= 360) {
			$('html').addClass('zoom360');
			$('html span.zoomState.360').show();
		}
		else if (nZoomTo >= 320) {
			$('html').addClass('zoom320');
			$('html span.zoomState.320').show();
		}
		else {
			$('html').addClass('zoom240');
			$('html span.zoomState.240').show();
		}

	},

	drawTokenAmount: function (jSelector, sAmount) {
		var aAmount = sAmount.toString();

		var sHTML = '<span class="DisplayTokens">';
		var nShiftCnt = 0;
		for (var nX = 0; nX < aAmount.length; nX++) {
			if (aAmount[nX] == "1") {
				sHTML += '<span class="oneShift">' + aAmount[nX] + '</span>';
				nShiftCnt++;
			}
			else sHTML += '<span>' + aAmount[nX] + '</span>';
		}
		sHTML += '</span>';
		var jSpan = $(sHTML);
		if (aAmount[0] == "1") {
			jSpan.addClass("shifted");
		}

		jSelector.empty().append(jSpan);

	},

	audio: {
		init: function () {
			this.ching1 = $("#TokenAudio").get(0);
		},
		ching1: null
	},
	hideAddressBar: function (fnCallback) {
		return;
		if (document.height < window.outerHeight) {
			//$('div[data-role="page"]:visible').css("height", "100%");
			//	((window.outerHeight / window.devicePixelRatio) + (50 * window.devicePixelRatio)) +	'px');
			//$('div[data-role="page"]:visible')
			//	.append('<div style="height:' + (20 * window.devicePixelRatio) + 'px"></div>');
			document.body.style.height = (window.outerHeight + 50) + 'px';
		}

		//$.mobile.silentScroll(0);

		setTimeout(function () {
			if (fnCallback) { fnCallback(); }
			window.scrollTo(0, 1);
		}, 50);
		return;


		setTimeout(function () {
			//if (window.pageYOffset) return;

			var jPage = $('.ui-page:visible').eq(0); // $('.ui-page:visible').eq(0);
			var nPage = jPage.height();
			var nDoc = $(window).height();



			if (nDoc > nPage) {
				jPage.css("height", nDoc + "px");
			}
			window.scrollTo(0, 1);
		}, 1);
	},
	lostPassword: {
		initailized: false,
		init: function () {
			var jPage = $('#dlgLostPassword');
			$("button.Save", jPage).click(function () {
				Application.lostPassword.checkAccount();
			});
			$("button.Cancel", jPage).click(function () { jPage.dialog('close'); });

			$('input#LostPassEmail').keyup(function () {
				if ($(this).val().isValidEmail()) {
					$("button.Save", jPage).button("enable");
				}
				else $("button.Save", jPage).button("disable");
			});

			this.initailized = true;
		},
		open: function () {
			if (!Application.lostPassword.initailized) {
				Application.lostPassword.init();
			}
			$.mobile.changePage($("#dlgLostPassword"), { changeHash: true });
			$('input#LostPassEmail').val($('#txtUser').val()).keyup();

		},
		checkAccount: function () {
			ui.elap.on("Verifying Address...");
			var sEmail = $('input#LostPassEmail').val().trim();

			new execQuery("select * from adm$user_email_accounts(" + sEmail.prepSQL() + ");",
			function (data) {
				var multipleUsers = function () {
					$('#dlgLostPassword').dialog('close');
					ui.elap.off();
					ui.showMessage({
						sTitle: "Multiple Accounts Found",
						sMessage:
							'There is more than one account associated with the e-mail address you entered.  ' +
							'To sign in, please contact a Token Rewards helper at:' +
							'<div style="text-align:center; margin:.5em">' +
								'<a href="mailto:help@tokenrewards.com">help@tokenrewards.com</a> ' +
								'<br/><br/>' +
								'or call<br/><a href="tel:8009269194">(800) 926-9194</a>' +
							'</div>'
					});
				};

				if (!data[0].USER_ID) {
					LogEntry('Lost Password attempted for unknown e-mail address: ' + sEmail);
					ui.elap.off();
					ui.showMessage({
						sTitle: "E-Mail Not Found",
						sMessage: "Sorry, but the e-mail address you entered is not in our system.  " +
								"Please check the address and try again.<br/><br/>" +
								"For further assistance, send an e-mail to:" +
								'<div style="text-align:center; margin:.5em">' +
									'<a href="mailto:help@tokenrewards.com">help@tokenrewards.com</a> ' +
									'<br/><br/>' +
									'or call<br/><a href="tel:8009269194">(800) 926-9194</a>' +
								'</div>'
					});
					return;
				}

				if (data.length > 1) {
					multipleUsers(data);
					return;
				}

				Application.lostPassword.sendLoginEmail(data[0]);

			});


		},
		sendLoginEmail: function (oUser) {
			ui.elap.on("Sending E-mail...");
			var oName = oUser.CONTACT_NAME.parseName();
			Email.send({
				to_contact_id: oUser.CONTACT_ID,
				to_name: oUser.CONTACT_NAME,
				to_address: oUser.EMAIL,
				template: 'admin_user_send_login',
				contents: Email.contentTemplates.admin_lost_password
					.replace(/__first_name__/g, oName.nick)
					.replace(/__contact_name__/g, oName.asEntered)
					.replace(/__customer_name__/g, oUser.CUSTOMER_NAME)
					.replace(/__admin_role__/g, oUser.ADMIN_ROLE)
					,
				callback: function (bSuccess, oEmail) {
					$('#dlgLostPassword').dialog('close');
					ui.elap.off();

					var sMessage = "You have been sent an e-mail containing a temporary " +
					"four character password you can use to sign in."
					ui.showMessage({
						sTitle: "E-Mail Delivered",
						sMessage: sMessage
					});
				}
			});
		}
	},


	ready: function () {
		var sSubDomain = window.location.hostname.substring(0, window.location.hostname.indexOf(".") + 1)
		if (sSubDomain != "jupiter.") {
			sSubDomain = "";
			$(".BetaTag").show();
		}
		else {
			Application.bAlpha = true;
			$("div.AlphaZoom").show();
			$(".AlphaTag").show();
		}
		Application.domain = sSubDomain;


		Application.getPrefs();
		Email.init();
		Application.audio.init();

		LogEntry(
			"New user from: " +
			window.document.referrer + "<br\> UserAgent: " +
			window.navigator.userAgent, false, false
		);

		$("#popupMessage").popup();

		$('div[data-role="page"]').bind('pageinit', function (event, page) {
			//console.log(this.id + " pageinit");

			if (typeof window[this.id] === "object"
				&& typeof window[this.id].init === "function") {
				window[this.id].init();
			}
		});

		$('div[data-role="page"]').bind('pagebeforeshow', function (event, page) {
			//console.log(this.id + " pagebeforeshow");
			if (typeof window[this.id] === "object"
				&& typeof window[this.id].refresh === "function") {
				if ($(this).has('[data-record="true"]') && page.prevPage.attr("id") == "dlgConfirm") {
					return;
				}
				window[this.id].refresh();
			}

		});

		$('div[data-role="page"]').bind('pageshow', function (event, page) {
			return;
			//console.log(this.id + " pageshow");
			var jThis = $(this);
			if (jThis.has('[data-record="true"]') && page.prevPage.attr("id") != "dlgConfirm") {
				//$('input', jThis).eq(0).focus();
			}
		});

		/* $('.backButton').onpress(function (event) {
		event.preventDefault();
		event.stopPropagation();
		window.history.back()
		});
		*/

		$("#dlgTransactOptions").bind('pageinit', function () { LedgerEntry.options.init() });
		$("#dlgTransactOptions").bind('pageshow', function () { LedgerEntry.options.refresh() });


		$('div[data-role="collapsible"]').bind('expand', function (event) {
			event.stopPropagation();
			var jThis = $(this);
			jThis.children().slideDown("fast");

			setTimeout(function () {
				$("a.ui-collapsible-heading-toggle", jThis).addClass("ui-btn-active");
			}, 100);
		})
		.bind('collapse', function (event) {
			event.stopPropagation();
			$(this).children().next().slideUp("fast");
		});

		$(window).bind('resize', function (e) {
			//orientationchange 
			Application.oPrefs.oGeneral.nZoomTo =
				(window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;
			Application.savePrefs();
			setTimeout(function () {
				Application.setZoom();
				//alert(jQuery.event.special.orientationchange.orientation());
			}, 1);
		});

		$(document).bind('pagebeforechange', function (event, data) {
			Application.pagebeforechange(event, data);
		});

		$(document).bind('pagechange', function (event, data) {

			setTimeout(function () {
				//$("body").removeAttr("style");
			}, 500);


			var sHash = (typeof data.toPage == 'string')
				? $.mobile.path.parseUrl(data.toPage).hash
				: "#" + data.toPage.attr("id");

			$(sHash).nodoubletapzoom();

			if (Application.sLastHash != sHash) {
				Application.sLastHash = sHash;
				LogEntry("Page changed to " + sHash);
				Application.hideAddressBar();
				$(sHash).trigger("updatelayout");
			}
		});

		window.location.hash = "#SignIn";

	},

	pagebeforechange: function (event, data) {
		var sToHash = (typeof data.toPage == 'string')
				? $.mobile.path.parseUrl(data.toPage).hash
				: "#" + data.toPage.attr("id");

		if (!sToHash
				|| sToHash == "#SignIn"
				|| sToHash == "#NewAccount"
				|| sToHash == "#dlgMessage"
				|| sToHash == "#dlgLostPassword"
				|| sToHash == "#dlgTransactOptions") return;

		//console.log(data, sToHash, data.options.fromPage[0].id);
		if (!Application.oUser.CUSTOMER_ID) {
			event.preventDefault();
			$.mobile.changePage($("#SignIn"), {
				changeHash: true,
				showLoadMsg: false
			});
		}


		var sFromPage = data.options.fromPage[0].id;

		if (typeof data.toPage == "object"
				&& typeof window[sFromPage] === "object"
				&& typeof window[sFromPage].backConfirm === "function"
				&& window[sFromPage].bEdited && window[sFromPage].bReqsMet) {
			event.preventDefault();
			window.history.forward();
			window[sFromPage].backConfirm();
		}


	}
};

TokenSession = {
	aoTokens: [],
	oSummary: { 'aoParties': [], 'nTotal': 0, dFirst: null, dLast: null },

	clear: function () {
		ui.showConfirm({
			sTitle: "Erase Session?",
			sMessage: "Are you sure you want to erase all the unsaved session " +
					Application.oUser.TOKENUNIT.toLowerCase() + "s?",
			fnConfirmCallback: function () {
				TokenSession.eraseTokens();
				$("#WrapSessionSummary, #TokenSessionMore").trigger("collapse");
				TokenSession.refresh();
				ui.popupMessage("Session Tokens Cleared");
			}
		});
	},
	enter: function (oParty, nAmount) {
		var oTokens = TokenSession.aoTokens;
		var nTot = 0;

		if (Application.oPrefs.oGeneral.bAudio) {
			Application.audio.ching1.play();
		}

		oTokens.push({
			'sPartyCode': oParty.CODE,
			'sPartyName': oParty.NAME,
			'nAmount': nAmount,
			'dTimestamp': Date()
		});
		TokenSession.storeTokens();

		for (var nX = 0; nX < oTokens.length; nX++) {
			if (oTokens[nX].sPartyCode == oParty.CODE) {
				nTot = nTot + oTokens[nX].nAmount;
			}
		}

		this.refresh();
		return nTot;
	},
	readSummary: function () {
		var sTokens = window.localStorage.getItem("SessionTokens-" + Application.oUser.CUSTOMER_ID);


		if (!sTokens || !$.evalJSON(sTokens)) { TokenSession.aoTokens = []; }
		else TokenSession.aoTokens = $.evalJSON(sTokens);

		var aoTokens = TokenSession.aoTokens;
		if (aoTokens.length == 0) {
			TokenSession.oSummary = {
				'aoParties': [],
				'nTotal': 0,
				oFirst: { sCode: '', sName: '', dTimeStamp: null },
				oLast: { sCode: '', sName: '', dTimeStamp: null }
			};
			return;
		}

		var aoParties = [];
		var nTot = 0;
		var oFirst = { sName: '', sCode: '', dTimestamp: new Date(3000, 0, 1) };
		var oLast = { sName: '', sCode: '', dTimestamp: new Date(0) };

		for (var nX = 0; nX < aoTokens.length; nX++) {
			nTot = nTot + aoTokens[nX].nAmount;
			aoTokens[nX].dTimestamp = aoTokens[nX].dTimestamp.toDate();
			if (aoTokens[nX].dTimestamp < oFirst.dTimestamp) {
				oFirst.dTimestamp = aoTokens[nX].dTimestamp;
				oFirst.sCode = aoTokens[nX].sPartyCode;
				oFirst.sName = aoTokens[nX].sPartyName;
			}
			if (aoTokens[nX].dTimestamp > oLast.dTimestamp) {
				oLast.dTimestamp = aoTokens[nX].dTimestamp;
				oLast.sCode = aoTokens[nX].sPartyCode;
				oLast.sName = aoTokens[nX].sPartyName;
			}

			var nPartyIndex = aoParties.searchSortedColumn(aoTokens[nX].sPartyCode, 'sPartyCode');
			if (nPartyIndex >= 0) {
				aoParties[nPartyIndex].nTotal = aoParties[nPartyIndex].nTotal + aoTokens[nX].nAmount;
				aoParties[nPartyIndex].aTokens.push(aoTokens[nX]);
			}
			else {
				aoParties.push({
					'sPartyCode': aoTokens[nX].sPartyCode,
					'nTotal': aoTokens[nX].nAmount,
					'aTokens': [aoTokens[nX]]
				});

				aoParties.sortColumn('sPartyCode', 1, null);
			}
		}
		TokenSession.oSummary = {
			'aoParties': aoParties,
			'nTotal': nTot,
			'oFirst': oFirst,
			'oLast': oLast
		};
	},
	refresh: function () {
		TokenSession.readSummary();

		var oSummary = this.oSummary;

		var jWrap = $("#Dashboard div.WrapSessionSummary");
		jWrap.toggle(oSummary.nTotal > 0);
		if (oSummary.nTotal > 0) {
			Application.drawTokenAmount($(".SessionTokenTotal", jWrap), oSummary.nTotal);
			$(".SessionParties", jWrap).text(oSummary.aoParties.length);
			$(".SessionFirst", jWrap).text(
				oSummary.oFirst.sName + ", " +
				oSummary.oFirst.dTimestamp.format("shortDateTime")
			);
			$(".SessionLast", jWrap).text(
				oSummary.oLast.sName + ", " +
				oSummary.oLast.dTimestamp.format("shortDateTime")
			);
		}


		if (oSummary.nTotal == 0) {
			$("#Participants #partyList li.liParty div.SessionTokens").text("0").removeClass("Awarded");
			return;
		}
		var aoParties = oSummary.aoParties;

		$("#Participants #partyList li.liParty").each(function () {
			var jThis = $(this);
			var nIndex = aoParties.searchSortedColumn(jThis.data('oParty').CODE, 'sPartyCode');
			if (nIndex >= 0) {
				Application.drawTokenAmount($('div.SessionTokens', jThis), aoParties[nIndex].nTotal);
				$('div.SessionTokens', jThis).addClass("Awarded");
			}
			else {
				$('div.SessionTokens', jThis).removeClass("Awarded").text("0");
			}
		});

	},
	saveDialog: {
		oSaveParty: null,

		initialized: false,
		init: function () {
			if (this.initialized) { return false; }
			var jPage = $("#dlgSaveSessionTokens");

			jPage.bind('pageinit', function () {

				var jPage = $("#dlgSaveSessionTokens");
				$("a.Save.ui-btn", jPage).on('click', function () {
					TokenSession.saveDialog.save();
				});
				$(".Cancel.ui-btn", jPage).on('click', function () {
					TokenSession.saveDialog.cancel();
				});
			});
			this.initialized = true;
		},
		open: function (oParty) {
			this.init();
			var jPage = $("#dlgSaveSessionTokens");
			$("#SessionTokenDepositDescription", jPage).val(Application.oPrefs.oTokens.sDepositDescription);

			if (!oParty) {
				$(".PartyName", jPage).hide();
				$("#SessionDepositAmount", jPage).text(TokenSession.oSummary.nTotal);
				$("#SessionDepositParties", jPage).text(TokenSession.oSummary.aoParties.length);
				$("#WrapSessionDepositParties", jPage).show();
			}
			else {
				var aoParties = TokenSession.oSummary.aoParties
				var oSesParty = null;
				for (var nX = 0; nX < aoParties.length; nX++) {
					if (aoParties[nX].sPartyCode == oParty.CODE) {
						oSesParty = aoParties[nX];
						break;
					}
				}

				if (oSesParty) {
					TokenSession.saveDialog.oSaveParty = oSesParty;
					$(".PartyName", jPage).text(oSesParty.aTokens[0].sPartyName).show();
					$("#SessionDepositAmount", jPage).text(oSesParty.nTotal);
					$("#WrapSessionDepositParties", jPage).hide();
				}
				else return false;

			}
			$.mobile.changePage(jPage);
		},
		save: function () {
			$("#dlgSaveSessionTokens").dialog("close");

			ui.elap.on("Saving");
			Application.oPrefs.oTokens.sDepositDescription = $("#SessionTokenDepositDescription").val();
			Application.savePrefs();

			var SQL = "";

			if (TokenSession.saveDialog.oSaveParty) {
				SQL =
				"select * from ADM$PARTY_LEDGER_IUD(" +
					"0," + //sTransID
					Application.oUser.USER_ID.prepSQL(true) + "," +
					this.oSaveParty.sPartyCode.prepSQL() + "," +
					Application.oPrefs.oTokens.sDepositDescription.prepSQL() + "," +
					this.oSaveParty.nTotal.prepSQL() + "," +
					"null,null,null,null,null);\n" +
				"select * from adm$participant(" +
					Application.oUser.CUSTOMER_ID.prepSQL() + "," +
					TokenSession.saveDialog.oSaveParty.sPartyCode.prepSQL() + ");"

				new execQuery(SQL, function (data) {
					var aoTokens = TokenSession.aoTokens;
					for (var nX = aoTokens.length - 1; nX >= 0; nX--) {
						if (aoTokens[nX].sPartyCode == TokenSession.saveDialog.oSaveParty.sPartyCode) {
							aoTokens.splice(nX, 1);
						}
					}
					TokenSession.storeTokens();

					TokenSession.refresh();
					Participant.data = data[1][0];
					Participant.refresh();
					Participants.refresh(data[1][0]);
					ui.elap.off();
					this.oSaveParty = null;
					ui.popupMessage("Session " + Application.oUser.TOKENUNIT + "s Deposited");

				});
			}
			else {
				var aoParties = TokenSession.oSummary.aoParties;
				for (var nX = 0; nX < aoParties.length; nX++) {
					var oParty = aoParties[nX];
					if (oParty.nTotal <= 0) { continue; }
					SQL += "select * from ADM$PARTY_LEDGER_IUD(" +
					"0," + //sTransID
					Application.oUser.USER_ID.prepSQL(true) + "," +
					oParty.sPartyCode.prepSQL() + "," +
					Application.oPrefs.oTokens.sDepositDescription.prepSQL() + "," +
					oParty.nTotal.prepSQL() + "," +
					"null,null,null,null,null);";

				}
				new execQuery(SQL, function () {
					$("#dlgSaveSessionTokens").dialog("close");
					Participants.lastClassFetched = null;

					TokenSession.eraseTokens();
					TokenSession.refresh();

					ui.elap.off();
					ui.popupMessage("Session " + Application.oUser.TOKENUNIT + "s Deposited");

				});
			}

		},
		cancel: function () {
			this.oSaveParty = null;
			$("#dlgSaveSessionTokens").dialog("close");
		}
	},

	adjustParty: {
		initialized: false,
		init: function () {
			if (this.initialized) { return; }

			var jPage = $("#dlgAdjustTokens");
			jPage.bind('pageinit', function () {

				var jPage = $("#dlgAdjustTokens");
				$("a.ui-btn.Okay", jPage).on('click', function () {
					TokenSession.adjustParty.save();
				});
				$("a.ui-btn.Cancel", jPage).on('click', function () {
					$("#dlgAdjustTokens").dialog("close");
				});
			});

			this.initialized = true;
		},
		open: function (oParty) {
			this.init();
			TokenSession.readSummary();

			var aoParties = TokenSession.oSummary.aoParties

			var jPage = $("#dlgAdjustTokens");
			$(".PartyName", jPage).text(oParty.NAME);

			var nCurTokens = 0;
			for (var nX = 0; nX < aoParties.length; nX++) {
				if (aoParties[nX].sPartyCode == oParty.CODE) {
					nCurTokens = aoParties[nX].nTotal;
					break;
				}
			}
			$(".CurrentTokens", jPage).text(nCurTokens);
			$(".TokenAmount", jPage).val("");

			$.mobile.changePage(jPage);
		},
		save: function () {
			var oParty = Participant.data;
			var jPage = $("#dlgAdjustTokens");

			var nCurTokens = $(".CurrentTokens", jPage).text().toNumber();
			var nNewTokens = $(".TokenAmount", jPage).val().toNumber();

			jPage.dialog("close");
			if ($("input#chkEraseTokens", jPage).prop("checked")) {
				var aoTokens = TokenSession.aoTokens;
				for (var nX = aoTokens.length - 1; nX >= 0; nX--) {
					if (aoTokens[nX].sPartyCode == oParty.CODE) {
						aoTokens.splice(nX, 1);
					}
				}
				TokenSession.storeTokens();
				TokenSession.refresh();
				Participant.refresh();
				ui.popupMessage("Session " + Application.oUser.TOKENUNIT + "s Cleared");

			}
			else {
				TokenSession.enter(oParty, nNewTokens - nCurTokens);
				Participant.refresh();
				ui.popupMessage("Session " + Application.oUser.TOKENUNIT + "s Adjusted");
			}
			jPage.dialog("close");
		}
	},

	storeTokens: function () {
		window.localStorage.setItem("SessionTokens-" + Application.oUser.CUSTOMER_ID, $.toJSON(TokenSession.aoTokens));
	},
	eraseTokens: function () {
		window.localStorage.removeItem("SessionTokens");
		window.localStorage.removeItem("SessionTokens-" + Application.oUser.CUSTOMER_ID);
	}

};

SignIn = {
	bAutoSignedIn: false,
	init: function () {
		var jPage = $("#SignIn");
		$(".currentYear", jPage).text((new Date()).getFullYear());

		$(".AlphaTag, .BetaTag", jPage).bind('click', function () {
			Application.supportInfo();
			return;
		});

		$("#btnSignIn", jPage).bind('click', function () {
			SignIn.manualLogin();
		});
		$("a#LostPassHelp", jPage).click(function () {
			Application.lostPassword.open();
		});
		$("#btnNewAccount", jPage).click(function () {
			ui.showMessage({
				sTitle: 'New Account',
				sMessage: 'Please visit TokenRewards.com or call' +
				'<div style="font-size:1.2em; font-weight: bold; margin:.5em 0">' +
					'<a href="tel:+1-800-926-9194">(800) 926-9194</a>' +
				'</div>' +
				'to start a new reward program account.'
			});
		});
		$("input", jPage).keyup(function () {
			var jPage = $("#SignIn");
			var sUser = $("#txtUser", jPage).val();
			var sPass = $("#txtPassword", jPage).val();

			if (sUser && sPass) {
				$("#btnSignIn", jPage).button("enable");
				$("#chkSavePassword", jPage).checkboxradio('enable');
			}
			else {
				$("#btnSignIn").button("disable");
				$("#chkSavePassword").checkboxradio('disable');
			}
		}).keyup();

	},
	refresh: function () {
		var jPage = $("#SignIn");
		var oData = Application.oPrefs.oSignIn;

		// && (Application.oUser.CUSTOMER_ID == undefined || Application.oUser.CUSTOMER_ID == '')
		$("#txtUser", jPage).val(oData.sUser).keyup().focus();
		//$("#txtPassword", jPage).val(oData.sPassword);

		if (oData.sUser && oData.sPassword) {
			ui.elap.on("Signing In...");
			new execQuery(
				"select * from adm$login(" + oData.sUser.prepSQL() + "," + oData.sPassword.prepSQL() + ", null);",
				function (aRow) {
					ui.elap.off();
					SignIn.bAutoSignedIn = true;
					if (SignIn.validateUser(aRow[0])) {
						return;
					}
					else {
						ui.showMessage({
							sTitle: "Not Signed In",
							sMessage: "Unable to sign in with using the saved e-mail and password."
						});
					}

				}
			);
		}


		ui.elap.off();

		Application.hideAddressBar();
	},
	manualLogin: function () {
		ui.elap.on("Signing In...");
		var sUser = $("#txtUser").val();
		var sPass = $("#txtPassword").val();

		Application.oPrefs.oSignIn.sUser = sUser;
		Application.savePrefs();

		new execQuery(
			"select * from adm$login(" + sUser.prepSQL() + "," + sPass.prepSQL() + ",null);",
			function (aRow) {
				ui.elap.off();

				if (!SignIn.validateUser(aRow[0])) {
					ui.showMessage({
						sTitle: "Not Signed In",
						sMessage:
						'<p>' +
							'Sorry, but you could not be signed in with the e-mail and password combination entered.' +
							'<br /><br />' +
							'Please try again or contact us for assistance.' +
						'</p>' +
						'<div class="center">' +
							'Email: <a href="mailto:help@tokenrewards.com">help@tokenrewards.com</a>' +
							'<br />or<br />' +
							'Call: <a href="tel:+1-800-926-9194">(800) 926-9194</a><br/>(9 to 5 p.m. Central)' +
						'</div>'

					});
					return;
				}


				if ($("#chkSavePassword").is(":checked")) {
					Application.oPrefs.oSignIn.sPassword = sPass;
					Application.savePrefs();
				}
			}
		);

	},
	validateUser: function (oUser) {
		if (!oUser || oUser.CUSTOMER_ID == undefined || oUser.CUSTOMER_ID == '') {
			return false;
		}
		SignIn.userValidated(oUser);
		return true;
	},
	userValidated: function (oUser) {
		Application.oUser = oUser;

		var jPage = $("#Dashboard");
		$("#ProviderName", jPage).html(oUser.PROVIDER_NAME.replace(" ", "&nbsp;"));
		$(".UserName", jPage).html(oUser.USER_NAME.replace(" ", "&nbsp;"));

		sLastSignIn = (oUser.USER_LAST_LOGIN) ?
			oUser.USER_LAST_LOGIN.toDateFormat("shortDateTime")
			: "Initial Sign In";
		$("#LastSignIn", jPage).text(sLastSignIn);

	
		$("span.TokenUnit").text(Application.oUser.TOKENUNIT);
		$("span.ParticipantAlias").text(Application.oUser.PARTICIPANT_ALIAS);

		var sDescript = Application.oPrefs.oWithdrawal.sDescription;
		Application.oPrefs.oWithdrawal.sDescription =
			(sDescript) ? sDescript : Application.oUser.TOKENUNIT.toProperCase() + "s Redeemed";

		Dashboard.bRefresh = true;
		$.mobile.changePage($("#Dashboard"));

		if (Application.oUser.TEMP_PASS_USED) {
			ui.showMessage({
				sTitle: "Temporary Sign In",
				sMessage:
						'You were successfully signed in using a temporary password.  ' +
						'<br/><br/>' +
						'Tap/click "Your User Profile" to change ' +
						'your existing password.',
				fnCallback: function () {
					$("#Dashboard #WrapUserInfo").trigger("expand");
				}
			});
		}
	}

}

NewAccount = {
	sEmailCode: '',

	init: function () {
		var jPage = $("#NewAccount");

		$('input', jPage).keyup(function () {
			NewAccount.validate();
		});

		$(".SendConfirmCode", jPage).click(function () {
			if ($(this).hasClass('ui-disabled')) { return; }
			NewAccount.submitEmailAddress(true);
		});
		$(".CheckConfirmCode", jPage).click(function () {
			if ($(this).hasClass('ui-disabled')) { return; }
			NewAccount.submitEmailAddress(false);
		});

		$("#NewTokenRate", jPage).constrainNumeric({ absolute: true, integer: true, minValue: 1 });

		$('select#NewTokenUnit', jPage).change(function () {
			$("span.TokenUnit").text($(this).val());
			NewAccount.validate();
		});
		$('select#NewParticipantAlias', jPage).change(function () {
			$("span.ParticipantAlias").text($(this).val());
			NewAccount.validate();
		});

		$("a.GetPassword", jPage).click(function () {
			if ($(this).hasClass('ui-disabled')) { return; }
			NewAccount.getPassword();
		});

		$("#CreateAccount", jPage).click(function () {
			if ($(this).hasClass('ui-disabled')) { return; }
			NewAccount.createAccount();
		});

	},

	refresh: function () {
		var jPage = $("#NewAccount");


		var sEmail = Application.oPrefs.oNewAccount.sEmail
			|| $("#txtUser").val();

		var sName = Application.oPrefs.oNewAccount.sName;

		$(".UserEmail", jPage).val(sEmail);
		$(".UserName", jPage).val(sName);


		$("#NewTokenRate", jPage).val(Application.oPrefs.oNewAccount.nTokenRate);

		$("span.TokenUnit", jPage).text(Application.oPrefs.oNewAccount.sTokenUnit);
		$("span.ParticipantAlias", jPage).text(Application.oPrefs.oNewAccount.sParticipantAlias);

		$("#ContactInfo", jPage).show();
		$("#ProgramInfo, #SetPassword", jPage).hide();
		this.validate();
	},
	validate: function () {
		var jPage = $("#NewAccount");
		var jWrap = $(".WrapEmail", jPage);
		var sEmail = $('input.UserEmail', jWrap).val().trim(),
			sName = $('input.UserName', jPage).val().trim(),
			sCode = $('input.ConfirmCode', jPage).val().trim();


		$("span.valid, span.verified, span.invalid", jWrap).hide();
		if (sEmail.isValidEmail()) {
			$("span.valid", jWrap).show();
		}
		else if (sEmail) {
			$("span.invalid", jWrap).show();
		}

		$(".SendConfirmCode", jPage).toggleClass('ui-disabled', !sEmail.isValidEmail() || !sName);

		$(".CheckConfirmCode", jPage).toggleClass('ui-disabled', !sEmail.isValidEmail() || !sCode);

		var nTokenRate = $("#NewTokenRate", jPage).val().toNumber();
		$(".DollarsPerToken", jPage).toggle(nTokenRate > 0)
		$(".DollarsPerToken", jPage).html(formatCurrency(1 / nTokenRate, true, false, false));

		var sProgramName = $("#NewProgramName", jPage).val().trim();
		$("a.GetPassword", jPage).toggleClass('ui-disabled', !sProgramName || nTokenRate == 0);

		var sPass1 = $(".Password1", jPage).val().trim();
		var sPass2 = $(".Password2", jPage).val().trim();

		var bValidPassword = !sPass1.match(/\s/) && sPass1.length >= 4 && sPass1 == sPass2;

		$("#CreateAccount", jPage).toggleClass('ui-disabled', !bValidPassword);
	},


	submitEmailAddress: function (bConfirm) {
		var jPage = $("#NewAccount");
		var sEmail = $('input.UserEmail', jPage).val().trim(),
			sName = $('input.UserName', jPage).val().trim();

		new execQuery("select * from adm$user_email_accounts(" + sEmail.prepSQL() + ");",
		function (data) {
			if (!data[0].USER_ID) {
				if (bConfirm) { NewAccount.sendConfirmCode(); }
				else NewAccount.verifyCode();
			}
			else {
				ui.showMessage({
					sTitle: "Accounts Exists",
					sMessage:
						'One or more administrator accounts for the supplied e-mail address already exists.' +
						'<br/><br/>' +
						'To start another reward program with this e-mail address contact Token Rewards ' +
						'at (800) 926-9194.' +
						'<br/><br/>' +
						'Otherwise, choose "Cancel" to go back to the sign in screen and click the "Lost Password" link.',
					fnCallback: function () { window.history.back(); }
				});
			}
		});
	},
	sendConfirmCode: function () {
		var jPage = $("#NewAccount");
		var sEmail = $('input.UserEmail', jPage).val().trim(),
			sName = $('input.UserName', jPage).val().trim();

		ui.elap.on("Sending E-Mail...");

		var oName = sName.parseName();

		Application.oPrefs.oNewAccount.sEmail = sEmail;
		Application.oPrefs.oNewAccount.sName = sName;
		Application.savePrefs();

		Email.send({
			to_contact_id: '',
			to_name: sName,
			to_address: sEmail,
			template: 'admin_confirm_email',
			contents: Email.contentTemplates.admin_confirm_email
					.replace(/__first_name__/g, oName.nick)
					,
			callback: function (bSuccess, oEmail) {
				ui.elap.off();
				if (!bSuccess) { alert("Error Sending E-Mail."); return; }

				Application.oPrefs.oGeneral.sChangeEmail = oEmail.to_address;
				Application.savePrefs();
				var sMessage = "You have been sent an e-mail containing the " +
							"four character confirmation code.  <br/><br/>Please check your inbox, " +
							"if you do not see the e-mail, check your spam folder."
				ui.showMessage({
					sTitle: "E-Mail Delivered",
					sMessage: sMessage
				});
			}
		});
	},


	verifyCode: function () {
		var jPage = $("#NewAccount");
		var sEmail = $('input.UserEmail', jPage).val().trim(),
			sName = $('input.UserName', jPage).val().trim();

		Application.oPrefs.oNewAccount.sEmail = sEmail;
		Application.oPrefs.oNewAccount.sName = sName;
		Application.savePrefs();


		new execQuery("select * from com$email_verify(" +
			$(".ConfirmCode", jPage).val().prepSQL() + "," +
			sEmail.prepSQL() + ");",
		function (data) {
			if (data.length > 0) {
				NewAccount.sEmailCode = data[0].CODE;
				NewAccount.getProgramInfo();
			}
			else {
				ui.showMessage({
					sTitle: "Wrong Confirmation Code",
					sMessage: "The confirmation code you entered does not appear to be correct. " +
						"<br/><br/>" +
						"Please try again."
				});
			}

		});
	},

	getProgramInfo: function () {
		var jPage = $("#NewAccount");


		var oName = $('input.UserName', jPage).val().trim().parseName();

		var sProgramName = Application.oPrefs.oNewAccount.sProgramName
			|| ((oName.last) ? oName.last : "My") + " Reward Program";

		$("#NewProgramName", jPage).val(sProgramName.trim());

		$("#ContactInfo", jPage).hide();
		$("#ProgramInfo", jPage).show();

		this.validate();
	},
	getPassword: function () {
		var jPage = $("#NewAccount");

		var oAccount = Application.oPrefs.oNewAccount;

		oAccount.sProgramName = $("#NewProgramName", jPage).val().trim();
		oAccount.sTokenUnit = $('select#NewTokenUnit', jPage).val();
		oAccount.sParticipantAlias = $('select#NewParticipantAlias', jPage).val();
		oAccount.nTokenRate = $("#NewTokenRate", jPage).val().toNumber();

		Application.savePrefs();

		$("#ContactInfo, #ProgramInfo", jPage).hide();
		$("#SetPassword", jPage).show();

	},

	createAccount: function () {
		var jPage = $("#NewAccount");
		var oAccount = Application.oPrefs.oNewAccount;
		var sPassword = $(".Password1", jPage).val().trim();

		$("#txtPassword").val(sPassword);

		Application.oPrefs.oSignIn.sUser = oAccount.sEmail;
		if ($(".NewPasswordSave", jPage).val() == "yes") {
			Application.oPrefs.oSignIn.sPassword = sPassword;
		}
		Application.savePrefs();

		new execQuery("select * from adm$new_customer(" +
			oAccount.sName.prepSQL() + "," +
			oAccount.sEmail.prepSQL() + "," +
			NewAccount.sEmailCode.prepSQL() + "," +
			oAccount.sProgramName.prepSQL() + "," +
			sPassword.prepSQL() + "," +
			oAccount.sTokenUnit.prepSQL() + "," +
			oAccount.nTokenRate.prepSQL() + "," +
			oAccount.sParticipantAlias.prepSQL() + ");",
		function () {
			ui.showMessage({
				sTitle: "Account Created!",
				sMessage:
					'Your new account for Token Tap and Admin.TokenRewards.com has been created!',
				fnCallback: function () { $.mobile.changePage("#SignIn"); }
			});

		});
		/*
		USER_NAME Varchar(256),
		EMAIL_ADDRESS Varchar(1000),
		EMAIL_CODE varchar(32),
		ACCOUNT_NAME Varchar(256),
		PW Varchar(32),
		TOKENUNIT Smallint,
		TOKENRATE Smallint,
		PARTICIPANT_ALIAS varchar(32)
		*/

	}
};

Dashboard = {
	aoClasses: [],
	oTotals: {},
	bRefresh: false,
	bFirstTimeMessageShown: false,

	init: function () {
		var jPage = $("#Dashboard");
		$(".currentYear", jPage).text((new Date()).getFullYear());

		$(".AlphaTag, .BetaTag", jPage).bind('click', function () {
			Application.supportInfo();
			return;
		});

		$("a.DepositSession", jPage).click(function () {
			TokenSession.saveDialog.open();
		});

		$("#btnSignOut", jPage).click(function () {
			Dashboard.signOut();
		});

		$("a.ResetSession", jPage).click(function () {
			TokenSession.clear();
		});

		$("li#AllParties", jPage).click(function () {
			Participants.oClass = $.extend({}, {
				CLASS_NAME: "All " + Application.oUser.PARTICIPANT_ALIAS + "s",
				ID: "-1"
			},
			Dashboard.oTotals);

			if (Participants.lastClassFetched != Participants.oClass.ID) {
				$("#Participants #partyList").empty();
			}
		});
		$("a#NewParty", jPage).bind('click', function () {
			PartyProfile.insert();
		});

		$(".SessionTokenTotal", jPage).detach().appendTo($(".WrapSessionSummary h4 a", jPage));

		$("#CollapsibleClasses", jPage).bind('collapse', function () {
			Application.oPrefs.oCollapsibles.sClasses = "collapse";
			Application.savePrefs();
		})
		.bind('expand', function () {
			Application.oPrefs.oCollapsibles.sClasses = "expand";
			Application.savePrefs();
		});

		$("#WrapUserInfo", jPage).bind('collapse', function () {
			Application.oPrefs.oCollapsibles.sUser = "collapse";
			Application.savePrefs();
		})
		.bind('expand', function () {
			Application.oPrefs.oCollapsibles.sUser = "expand";
			Application.savePrefs();
		});


		$("a#NewClass", jPage).click(function () { ClassGroup.insert(); });

		jPage.bind('swipeleft', function (event) {
			event.preventDefault();
			event.stopPropagation();
			if (Application.oUser.CUSTOMER_ID) {

				Participants.oClass = $.extend({}, {
					CLASS_NAME: "All " + Application.oUser.PARTICIPANT_ALIAS + "s",
					ID: "-1"
				}, Dashboard.oTotals);
				$.mobile.changePage($("#Participants"));
			}
		});

	},
	refresh: function (fnCallback) {

		$("span.TokenUnit").text(Application.oUser.TOKENUNIT);
		$("span.ParticipantAlias").text(Application.oUser.PARTICIPANT_ALIAS);

		if (!this.bRefresh) { return; }
		this.bRefresh = false;

		TokenSession.refresh();

		new execQuery(
			"select count(*) as PARTICIPANTS,\n" +
			"  sum(a.ACTIVATED) as ACTIVE_PARTICIPANTS,\n" +
			"	sum(iif(a.ACTIVATED=1,a.BALANCE,0)) as balance,\n" +
			"	sum(iif(a.ACTIVATED=1,a.EARNED,0)) as earned,\n" +
			"	sum(iif(a.ACTIVATED=1,a.SPENT,0)) as spent,\n" +
			"	sum(iif(a.ACTIVATED=1,a.PENDING,0)) as pending\n" +
			"  from ADM$PARTICIPANTS(" + Application.oUser.CUSTOMER_ID.prepSQL() + ", null, -1, -1, null) a;\n" +
			"select * from adm$classes(" +
				Application.oUser.CUSTOMER_ID.prepSQL() + "," +
				Application.oUser.USER_ID.prepSQL() +
			");" +
			"select * from adm$reusable_transactions(" + Application.oUser.CUSTOMER_ID.prepSQL() + ") order by 3 desc;",
		function (data) {

			Dashboard.oTotals = $.extend({}, data[0][0]);
			Dashboard.aoClasses = $.extend([], data[1]);
			Dashboard.aoClasses.sortColumn('ID', 1);
			LedgerEntry.aoRemembered = $.extend([], data[2]);

			Participants.total = data[0][0].COUNT;
			var aoClasses = data[1];

			var jPage = $("#Dashboard");

			var jUl = $("ul#WrapAllParties", jPage).toggleClass("invisible", Dashboard.oTotals.ACTIVE_PARTICIPANTS == 0);
			var jLi = $("li#AllParties", jUl);

			$("span.ActiveCount", jLi).text(Dashboard.oTotals.ACTIVE_PARTICIPANTS);
			$("span.InactiveCount", jLi).text("/" + Dashboard.oTotals.PARTICIPANTS.toNumber());
			$("span.Balance", jLi).text(Dashboard.oTotals.BALANCE);

			$("#WrapUserInfo", jPage).trigger(Application.oPrefs.oCollapsibles.sUser);

			var jWrap = $("#WrapDashboardClasses", jPage);
			if (aoClasses.length == 0) {
				// move to bottom of dashboard
				jWrap.detach();
				$("#WrapNewParty").after(jWrap);
				$(".ui-collapsible", jWrap).hide();
			}
			else {
				// move to top (under user info) of dashboard
				$(".ui-collapsible", jWrap).show();

				jWrap.detach();
				$("#WrapAllParties").before(jWrap);

				$("#CollapsibleClasses", jWrap).trigger(Application.oPrefs.oCollapsibles.sClasses);
				jUl = $("ul#DashboardClasses", jWrap);
				$("li.Class", jUl).remove();

				for (var nX = 0; nX < aoClasses.length; nX++) {
					jUl.append(Dashboard.newClassLi(aoClasses[nX]));
				}


				jUl.trigger("create").listview("refresh");
				jUl.trigger('updatelayout');

			}


			$(".InactiveCount, .InactiveCountNote", jPage).toggle(Application.oPrefs.oGeneral.bShowInactives);

			if (fnCallback) { fnCallback(); }
			else {
				ui.elap.off();

				setTimeout(function () {
					if (SignIn.bAutoSignedIn) {
						ui.popupMessage("Automatically signed in<br/>using saved password.");
						SignIn.bAutoSignedIn = false;
					}
					if (Application.oUser.USER_LAST_LOGIN == "" && !this.bFirstTimeMessageShown) {
						this.bFirstTimeMessageShown = true;
						ui.showMessage({
							sTitle: "Getting Started",
							sMessage: 'Get started by clicking the "New&nbsp;' +
								Application.oUser.PARTICIPANT_ALIAS + '" button. <br/><br/>' +
								'Once you have entered one or more ' +
								Application.oUser.PARTICIPANT_ALIAS.toLowerCase() + 's, click ' +
								'"View All ' + Application.oUser.PARTICIPANT_ALIAS + 's" to begin awarding ' +
								Application.oUser.TOKENUNIT.toLowerCase() + 's!'
						});
					}
				}, 500);
				Application.hideAddressBar();
			}
		});
	},

	newClassLi: function (oClass) {
		var jLi = $("ul#liPrototypes li.Class").clone().removeClass("prototype").data('oClass', oClass);

		$("span.ClassName", jLi).text(oClass.CLASS_NAME);
		$("span.ActiveCount", jLi).text(oClass.ACTIVE_PARTICIPANTS.toNumber());
		$("span.InactiveCount", jLi).text("/" + oClass.PARTICIPANTS.toNumber());
		$("span.Balance", jLi).text(oClass.BALANCE);
		jLi.click(function () {
			var jThis = $(this);
			Participants.oClass = jThis.data('oClass');
			if (Participants.lastClassFetched != Participants.oClass.ID) {
				$("#Participants #partyList").empty();
			}
		});
		return jLi;
	},

	signOut: function () {
		LogEntry("Sign Out clicked");
		ui.showConfirm({
			sTitle: "Sign Out?",
			sMessage: 'Click "Okay" to clear your password and sign out.',
			fnConfirmCallback: function () {

				Application.oPrefs.oSignIn.sPassword = "";
				Application.savePrefs();
				$("#txtPassword").val("");
				for (var sX in Application.oUser) {
					Application.oUser[sX] = "";
				}
				window.location.hash = "#SignIn";
				window.location.reload();
			}
		});
	}

};

Preferences = {
	initialized: false,
	init: function () {
		var jPage = $("#Preferences");
		$("#AudioOnOff", jPage).change(function (event) {
			event.preventDefault();
			event.stopPropagation();
			Application.oPrefs.oGeneral.bAudio = $(this).val() == "on";
			Application.savePrefs();
		});

		$("#ShowInactives", jPage).change(function () {
			Application.oPrefs.oGeneral.bShowInactives = $(this).val() == "show";
			Application.savePrefs();
			Participants.lastClassFetched = null;
			Dashboard.bRefresh = true;
		});

		$("#SortParties", jPage).change(function () {
			Application.oPrefs.oGeneral.sSortParticipants = $(this).val();
			Application.savePrefs();
			Participants.lastClassFetched = null;
		});

		jPage.on('swiperight', function (event) {
			event.preventDefault();
			event.stopPropagation();
			window.history.back();
		});

		this.initialized = true;
	},
	refresh: function () {
		var jPage = $("#Preferences");
		var oData = Application.oPrefs.oGeneral;

		$("#AudioOnOff", jPage).val(oData.bAudio ? "on" : "off").slider("refresh");
		$("#ShowInactives", jPage).val(oData.bShowInactives ? "show" : "hide").slider("refresh");
		$("#SortParties", jPage).val(oData.sSortParticipants).selectmenu("refresh");
	}
};

UserProfile = {
	init: function () { },
	bRefreshed: false,
	refresh: function () {
		if (this.bRefreshed) { return; }
		this.bRefreshed = true;
		var jPage = $("#UserProfile");
		ui.elap.on();
		$('.UserEmail', jPage).text(Application.oPrefs.oSignIn.sUser)
		var SQL = "select * from adm$customer_contacts(" + Application.oUser.CUSTOMER_ID.prepSQL() + ");" +
			"select * from adm$users(" + Application.oUser.CUSTOMER_ID.prepSQL() + ") where id = " + Application.oUser.USER_ID.prepSQL() + ";"
		new execQuery(SQL, function (data) {
			var sContact = Application.oUser.USER_NAME;
			Application.oUserRec = data[1][0];

			$(".UserName", jPage).text(sContact);
			$(".UserTitle", jPage).text(Application.oUserRec.TITLE);
			$(".UserPhone", jPage).text(Application.oUserRec.PHONE);

			ui.elap.off();

			return;
			// Shipping Address here? No, don't think so.
			for (var nX = 0; nX < data[0].length; nX++) {
				var oX = data[0][nX];
				if (oX.CONTACT_ROLE == "__SHIP") {

					var cPrefix = "";
					sContact += '<br/>' +
					((oX[cPrefix + 'ADDRESS'].length > 0) ? oX[cPrefix + 'ADDRESS'].encodeHTML() + '<br/>' : '') +
					oX[cPrefix + 'CITY'].encodeHTML() +
					((oX[cPrefix + 'CITY'] == "") ? ' ' : ', ') +
					oX[cPrefix + 'STATE'].encodeHTML() + ' ' + oX[cPrefix + 'ZIP'].encodeHTML();
				}
			}
			$('.UserContact', jPage).html(sContact);
		});
	}
};

ChangeEmail = {
	initialized: false,
	init: function () {
		var jPage = $("#ChangeEmail");

		$('.UserEmail', jPage).keyup(function () { ChangeEmail.setNotice(); })
		.val(Application.oPrefs.oGeneral.sChangeEmail);

		$('.ConfirmCode', jPage).keyup(function () {
			var jPage = $("#ChangeEmail");
			var sEmail = $('input.UserEmail', jPage).val().trim();
			$(".CheckConfirmCode", jPage).toggleClass('ui-disabled',
				!($(this).val().length == 4 && sEmail.isValidEmail())
			);

		});

		$(".SendConfirmCode", jPage).click(function () {
			if ($(this).hasClass('ui-disabled')) { return; }
			ChangeEmail.submitEmailAddress(true);
		});

		$(".CheckConfirmCode", jPage).click(function () {
			if ($(this).hasClass('ui-disabled')) { return; }

			ChangeEmail.submitEmailAddress(false);


		});

		this.initialized = true;
	},
	refresh: function () {
		var jPage = $("#ChangeEmail");
		this.setNotice();
	},
	setNotice: function () {
		var jPage = $("#ChangeEmail");
		var jWrap = $(".WrapEmail", jPage);
		var sEmail = $('input.UserEmail', jWrap).val().trim();

		$("span.valid, span.verified, span.invalid", jWrap).hide();
		if (sEmail.isValidEmail()) {
			$("span.valid", jWrap).show();
		}
		else if (sEmail) {
			$("span.invalid", jWrap).show();
		}

		$(".SendConfirmCode", jPage).toggleClass('ui-disabled', !sEmail.isValidEmail());

	},

	submitEmailAddress: function (bConfirm) {
		var jPage = $("#ChangeEmail");
		var sEmail = $('input.UserEmail', jPage).val().trim();

		new execQuery("select * from adm$user_email_accounts(" + sEmail.prepSQL() + ");",
		function (data) {
			if (!data[0].USER_ID) {
				if (bConfirm) {
					ChangeEmail.sendConfirmCode();
				}
				else ChangeEmail.verifyCode();

			}
			else {
				ui.showMessage({
					sTitle: "Accounts Exists",
					sMessage:
						'One or more administrator accounts for the supplied e-mail address already exists.' +
						'<br/><br/>' +
						'Please try a different e-mail address.'
				});
			}
		});
	},


	sendConfirmCode: function () {
		var jPage = $("#ChangeEmail");
		var sEmail = $('input.UserEmail', jPage).val().trim();

		ui.elap.on("Sending E-Mail...");


		var oName = Application.oUser.USER_NAME.parseName();

		Email.send({
			to_contact_id: Application.oUser.USER_CONTACT_ID,
			to_name: Application.oUser.USER_NAME,
			to_address: sEmail,
			template: 'admin_confirm_email',
			contents: Email.contentTemplates.admin_confirm_email
					.replace(/__first_name__/g, oName.nick)
					,
			callback: function (bSuccess, oEmail) {
				ui.elap.off();
				if (!bSuccess) { alert("Error Sending E-Mail."); return; }

				Application.oPrefs.oGeneral.sChangeEmail = oEmail.to_address;
				Application.savePrefs();
				var sMessage = "You have been sent an e-mail containing the " +
							"four character confirmation code.  <br/><br/>Please check your inbox, " +
							"if you do not see the e-mail, check your spam folder."
				ui.showMessage({
					sTitle: "E-Mail Delivered",
					sMessage: sMessage
				});
			}
		});

	},
	verifyCode: function () {
		var jPage = $("#ChangeEmail");
		var sEmail = $('input.UserEmail', jPage).val().trim();

		new execQuery("select * from com$email_verify(" +
			$(".ConfirmCode", jPage).val().prepSQL() + "," +
			sEmail.prepSQL() + ");",
		function (data) {
			if (data.length > 0) {
				ChangeEmail.save();
			}
			else {
				ui.showMessage({
					sTitle: "Wrong Confirmation Code",
					sMessage: "The confirmation code you entered does not appear to be correct. " +
						"<br/><br/>" +
						"Please try again."
				});
			}

		});
	},
	save: function () {
		ui.elap.on("Saving...");
		var jPage = $("#ChangeEmail");
		var sEmail = $('input.UserEmail', jPage).val().trim();
		Application.oPrefs.oGeneral.sChangeEmail = "";
		Application.oPrefs.oSignIn.sUser = sEmail;
		Application.savePrefs();

		$('input.UserEmail', jPage).val("");
		$('.ConfirmCode', jPage).val("");

		Application.oUserRec.EMAIL = sEmail;
		$('.UserEmail').text(sEmail);
		LogEntry("Email address changed to " + sEmail);

		var oUser = Application.oUserRec;
		SQL = "select * from adm$user_iu(" +
			oUser.ID.prepSQL(true) + "," +
			Application.oUser.CUSTOMER_ID.prepSQL() + "," +
			oUser.NAME.prepSQL() + "," +
			oUser.TITLE.prepSQL(true) + "," +
			oUser.PHONE.prepSQL(true) + "," +
			oUser.EMAIL.prepSQL() + "," +
			oUser.INACTIVATED.prepSQL(true) + "," +
			oUser.ADMIN_ROLE.prepSQL() + "," +
			oUser.CLASS_IDS.prepSQL() +
			");";


		new execQuery(SQL, function (data) {
			ui.elap.off();
			ui.showMessage({
				sTitle: "E-Mail Changed",
				sMessage: "Your new e-mail address has been successfully confirmed and saved.",
				fnCallback: function () {
					window.history.back();
				}
			});

		});
	}
};

ChangePassword = {
	initialized: false,
	init: function () {
		var jPage = $("#ChangePassword");

		$(".Password1, .Password2", jPage).keyup(function () {
			ChangePassword.validate();
		});

		$("#SaveNewPassword", jPage).click(function () {
			if (!$(this).hasClass('ui-disabled')) {
				ChangePassword.save();
			}
		});

		this.initialized = true;
	},
	validate: function () {
		var jPage = $("#ChangePassword");

		var sPass1 = $(".Password1", jPage).val().trim();
		var sPass2 = $(".Password2", jPage).val().trim();

		var bValidPassword = !sPass1.match(/\s/) && sPass1.length >= 4 && sPass1 == sPass2;

		$("#SaveNewPassword", jPage).toggleClass('ui-disabled', !bValidPassword);

	},
	save: function () {
		ui.elap.on("Saving Password...");
		var jPage = $("#ChangePassword");
		var sPass1 = $(".Password1", jPage).val().trim();

		new execQuery("select * from ADM$USER_UPDATE_PW(" +
				Application.oUser.USER_ID.prepSQL(true) + "," +
				sPass1.prepSQL() + ");",
			function (data) {
				ui.elap.on("Sending E-Mail...");
				if (data[0].CONTACT_ID == '') {
					ui.modalMessage({ title: "Error", message: "There was an error saving your password." });
					return;
				}
				var oContactName = Application.oUserRec.NAME.parseName();
				var sEmail = Application.oUserRec.EMAIL;

				Email.send({
					to_contact_id: Application.oUserRec.CONTACT_ID,
					to_name: oContactName.asEntered,
					to_address: sEmail,
					template: 'admin_user_pw_changed',
					contents: Email.contentTemplates.admin_password_changed
					.replace(/__first_name__/g, oContactName.nick)
					.replace(/__contact_pw__/g, data[0].CONTACT_PW)
					.replace(/__token_name__/g, Application.oUser.TOKENUNIT.toLowerCase())
					.replace(/__provider_name__/g, Application.oUser.PROVIDER_NAME)
					,
					callback: function (bSuccess, oEmail) {
						ui.elap.off();
						if (!bSuccess) { alert("Error Sending E-Mail."); return; }

						ui.showMessage({
							sTitle: "New Password Saved.",
							sMessage: "Your new password was successfully saved. " +
								"An e-mail has also been delivered to you " +
								"as a reminder that you've changed your password.",
							fnCallback: function () { 
								window.history.back();
							}
						});
					}
				});

			});
	}
};

ChangeUserProfile = {
	initialized: false,
	bEdited: false,
	bReqsMet: false,

	init: function () {
		var jPage = $("#ChangeUserProfile");

		$("input", jPage).keyup(function () {
			ChangeUserProfile.validate();
		});

		$(".saveButton", jPage).click(function () {
			if ($(this).hasClass("ui-disabled")) { return; }
			ChangeUserProfile.save(function () { window.history.back(); });
		});
	},
	refresh: function () {
		var jPage = $("#ChangeUserProfile");
		$(".UserName", jPage).val(Application.oUserRec.NAME);
		$(".UserTitle", jPage).val(Application.oUserRec.TITLE);
		$(".UserPhone", jPage).val(Application.oUserRec.PHONE);
		this.validate();
	},
	validate: function () {
		var jPage = $("#ChangeUserProfile"),
			bReqsMet = false,
			bEdited = false,
			oRec = Application.oUserRec,
			oUpdated = {
				NAME: $(".UserName", jPage).val(),
				TITLE: $(".UserTitle", jPage).val(),
				PHONE: $(".UserPhone", jPage).val()
			}

		if (oRec.NAME != oUpdated.NAME || oRec.TITLE != oUpdated.TITLE || oRec.PHONE != oUpdated.PHONE) {
			bEdited = true;
		}

		if ($(".UserName", jPage).val().length) { bReqsMet = true; }

		$(".saveButton", jPage).toggleClass("ui-disabled", !bEdited || !bReqsMet);
		this.bEdited = bEdited;
		this.bReqsMet = bReqsMet;

	},
	save: function (fnCallback) {
		ui.elap.on("Saving...");
		this.bEdited = this.bReqsMet = false;
		var jPage = $("#ChangeUserProfile");

		var oUpdated = {
			NAME: $(".UserName", jPage).val(),
			TITLE: $(".UserTitle", jPage).val(),
			PHONE: $(".UserPhone", jPage).val()
		}
		Application.oUserRec = $.extend(true, {}, Application.oUserRec, oUpdated);
		Application.oUser.USER_NAME = oUpdated.NAME;
		$(".UserName").text(oUpdated.NAME);
		$(".UserTitle").text(oUpdated.TITLE);
		$(".UserPhone").text(oUpdated.PHONE);

		LogEntry("User Profile updated.");

		var oUser = Application.oUserRec;
		SQL = "select * from adm$user_iu(" +
			oUser.ID.prepSQL(true) + "," +
			Application.oUser.CUSTOMER_ID.prepSQL() + "," +
			oUpdated.NAME.prepSQL() + "," +
			oUpdated.TITLE.prepSQL(true) + "," +
			oUpdated.PHONE.prepSQL(true) + "," +
			oUser.EMAIL.prepSQL() + "," +
			oUser.INACTIVATED.prepSQL(true) + "," +
			oUser.ADMIN_ROLE.prepSQL() + "," +
			oUser.CLASS_IDS.prepSQL() +
			");";


		new execQuery(SQL, function (data) {
			ui.elap.off();
			ui.popupMessage("User Profile Saved.");
			if (fnCallback) { fnCallback(); }

			return;
			ui.showMessage({
				sTitle: "Edits Saved",
				sMessage: "The edits to your user profile have been saved.",
				fnCallback: function () {
					window.history.back();
				}
			});

		});
	},
	backConfirm: function () {
		ui.showConfirm({
			sTitle: "Save?",
			sMessage:
				'Do you want to save your changes to your user profile before continuing?',
			sConfirmButtonText: "Yes",
			sCancelButtonText: "No",
			fnConfirmCallback: function () {
				ChangeUserProfile.save(function () { window.history.back(); }); 
			},
			fnCancelCallback: function () {
				ChangeUserProfile.bEdited = ChangeUserProfile.bReqsMet = false;
				window.history.back();
			}
		});

	}

};

RewardProgramSettings = {
	initialized: false,
	bEdited: false,
	bReqsMet: false,

	init: function () {
		var jPage = $("#RewardProgramSettings");

		$(".EditTokenRate", jPage).constrainNumeric({ absolute: true, integer: true, minValue: 1 });
		$('input', jPage).keyup(function () { RewardProgramSettings.validate(); });
		$('select#EditTokenUnit', jPage).change(function () {
			$("span.TokenUnit").text($(this).val());
			RewardProgramSettings.validate();
		});
		$('select#EditParticipantAlias', jPage).change(function () {
			$("span.ParticipantAlias").text($(this).val());
			RewardProgramSettings.validate();
		});

		$("a.saveButton", jPage).bind('click', function () {
			if (RewardProgramSettings.bEdited && RewardProgramSettings.bReqsMet) {
				RewardProgramSettings.save(function () { window.history.back(); });
			}
		});

	},
	refresh: function () {
		var jPage = $("#RewardProgramSettings");

		$("#EditProgramName", jPage).val(Application.oUser.PROVIDER_NAME);
		$("#EditTokenUnit", jPage).val(Application.oUser.TOKENUNIT).selectmenu("refresh");
		$("#EditParticipantAlias", jPage).val(Application.oUser.PARTICIPANT_ALIAS).selectmenu("refresh");
		$("#EditTokenRate", jPage).val(Application.oUser.TOKENRATE);

		$("#DollarsPerToken", jPage).html(formatCurrency(1 / Application.oUser.TOKENRATE, true, false, false));

		this.validate();
	},
	validate: function () {
		var jPage = $("#RewardProgramSettings");

		var oUpdated = {
			PROVIDER_NAME: $("#EditProgramName", jPage).val(),
			TOKENUNIT: $("#EditTokenUnit", jPage).val(),
			PARTICIPANT_ALIAS: $("#EditParticipantAlias", jPage).val(),
			TOKENRATE: $("#EditTokenRate", jPage).val().toNumber()
		};

		$("span.TokenUnit", jPage).text(oUpdated.TOKENUNIT);
		$("span.ParticipantAlias", jPage).text(oUpdated.PARTICIPANT_ALIAS);

		$(".DollarsPerToken", jPage).toggle(oUpdated.TOKENRATE > 0)

		$(".DollarsPerToken", jPage).html(formatCurrency(1 / oUpdated.TOKENRATE, true, false, false));

		this.bEdited = this.bReqsMet = false;

		for (var sKey in oUpdated) {
			if (oUpdated[sKey] != Application.oUser[sKey]) {
				this.bEdited = true;
				break;
			}
		}

		if (oUpdated.TOKENRATE && oUpdated.PROVIDER_NAME) {
			this.bReqsMet = true;
		}

		$('a.saveButton', jPage).toggleClass('ui-disabled', !this.bReqsMet || !this.bEdited);
	},
	save: function (fnCallback) {
		var jPage = $("#RewardProgramSettings");

		this.bEdited = this.bReqsMet = false;

		var oUpdated = {
			PROVIDER_NAME: $("#EditProgramName", jPage).val(),
			TOKENUNIT: $("#EditTokenUnit", jPage).val(),
			PARTICIPANT_ALIAS: $("#EditParticipantAlias", jPage).val(),
			TOKENRATE: $("#EditTokenRate", jPage).val()
		};

		var SQL = "execute procedure adm$customer_update2(" +
				Application.oUser.CUSTOMER_ID.prepSQL() + "," +
				oUpdated.PROVIDER_NAME.prepSQL() + "," +
				oUpdated.TOKENUNIT.prepSQL() + "," +
				oUpdated.PARTICIPANT_ALIAS.prepSQL() + "," +
				oUpdated.TOKENRATE.prepSQL() +
		");";
		Application.oUser = $.extend(true, {}, Application.oUser, oUpdated);

		new execQuery(SQL, function () {

			$("#ProviderName").text(oUpdated.PROVIDER_NAME);
			$("span.TokenUnit").text(Application.oUser.TOKENUNIT);
			$("span.ParticipantAlias").text(Application.oUser.PARTICIPANT_ALIAS);

			if (fnCallback) { fnCallback(); }

			ui.popupMessage("Edits Saved");
		});
	},

	backConfirm: function () {
		ui.showConfirm({
			sTitle: "Save?",
			sMessage:
				'Do you want to save your changes to your reward program settings before continuing?',
			sConfirmButtonText: "Yes",
			sCancelButtonText: "No",
			fnConfirmCallback: function () {
				RewardProgramSettings.save(function () { window.history.back(); }); 
			},
			fnCancelCallback: function () {
				RewardProgramSettings.bEdited = RewardProgramSettings.bReqsMet = false;
				window.history.back();
			}
		});

	}
};

Participants = {
	initialized: false,
	maxDisplay: 200,
	total: 0,
	oClass: {
		ID: '',
		CLASS_NAME: '',
		PARTICIPANTS: '',
		ACTIVE_PARTICIPANTS: '',
		BALANCE: '',
		EARNED: '',
		SPENT: '',
		PENDING: ''
	},

	lastClassFetched: null,
	timer: null,

	init: function () {
		if (this.initialized) { return; }
		var jPage = $("#Participants");

		$("a.NewParty", jPage).click(function () { PartyProfile.insert(Participants.oClass.ID); });
		$("a.EditClass", jPage).click(function () { ClassGroup.update(Participants.oClass); });



		jPage.on('swiperight', function (event) {
			event.preventDefault();
			event.stopPropagation();
			var goBack = function () {
				window.history.back();
				Participants.timer = null;
			}

			if (Participants.timer) { return; }
			Participants.timer = setTimeout(goBack, 1);
		});

		$(".ui-listview-filter .ui-input-text", jPage).attr("tabindex", "-1");

		/* AutoDividers
		$("#partyList").listview({
		autodividers: false,
		autodividersSelector: function (li) {
		var out = $('.partyName', $(li)).text().substr(0,1);
		return out;
		}
		});
		*/


		this.initialized = true;

	},

	refresh: function (oParty, fnCallback) {
		var jPage = $("#Participants");
		$('div[data-role="header"] h1 .ClassName', jPage).text(this.oClass.CLASS_NAME);

		var sSummary = 'No ' + Application.oUser.PARTICIPANT_ALIAS + 's';
		if (Application.oPrefs.oGeneral.bShowInactives) {
			if (this.oClass.PARTICIPANTS > 0) {
				sSummary = this.oClass.ACTIVE_PARTICIPANTS + " Active,  " +
				(this.oClass.PARTICIPANTS.toNumber() - this.oClass.ACTIVE_PARTICIPANTS.toNumber()) + " Inactive " +
				Application.oUser.PARTICIPANT_ALIAS.toPlural(this.oClass.PARTICIPANTS)
			}
		}
		else {
			if (this.oClass.ACTIVE_PARTICIPANTS > 0) {
				sSummary = this.oClass.ACTIVE_PARTICIPANTS + " Active " +
				Application.oUser.PARTICIPANT_ALIAS.toPlural(this.oClass.ACTIVE_PARTICIPANTS);
			}
		}

		$('div[data-role="header"] h1 .SubHeader', jPage).text(sSummary);

		var jTbl = $("table#wrapPartySummary", jPage);
		$("td.balance", jTbl).text(this.oClass.BALANCE);
		$("td.deposited", jTbl).text(this.oClass.EARNED);
		$("td.withdrawn", jTbl).text(this.oClass.SPENT);

		$(".EditClass", jPage).toggle(this.oClass.ID != "-1");

		if (oParty) {
			$('#partyList li', jPage).each(function () {
				var jThis = $(this);
				if (jThis.data("oParty").CODE == oParty.CODE) {
					if (Participants.oClass.ID == "-1"
						|| $.inArray(Participants.oClass.ID, Participant.data.CLASS_IDS.split(",")) > -1) {

						Participants.drawOne(jThis, oParty);
					}
					else jThis.remove();

					return;

				}
			});
		}
		else {
			// Refresh all parties
			this.fetchParties(fnCallback);
		}
	},
	fetchParties: function (fnCallback) {
		if (Participants.oClass.ID == this.lastClassFetched) {
			ui.elap.off();
			return;
		}

		ui.elap.on();
		$("#NoParties, #NoParties_Class, #MaxParties").hide();

		var oData = Application.oPrefs.oGeneral

		var sInactives = oData.bShowInactives ? "-1" : "1";
		var nSortOpt = oData.sSortParticipants ? oData.sSortParticipants.toNumber() : 0;
		var sSortCol = "name ascending";
		switch (nSortOpt) {
			case 1: sSortCol = "sort_name ascending"; break;
			case 2: sSortCol = "balance descending, name ascending"; break;
			case 3: sSortCol = "balance ascending, name ascending"; break;
		}



		this.lastClassFetched = Participants.oClass.ID;
		new execQuery("select * from adm$Participants(" +
			Application.oUser.CUSTOMER_ID.prepSQL() + "," +
			"null," + //party_code
			sInactives.prepSQL() + "," + //activated
			Participants.oClass.ID.prepSQL() + "," + //class_id , $("#txtSearchName").val().prepSQL() + 
			"null) order by " + sSortCol + ";",
			function (aRows) {
				Participants.drawParties(aRows);
				if (fnCallback) fnCallback();
				ui.elap.off();
			}


		/* HTML markup to enable search on server
		<div id="wrapSearchParty" class="ui-bar">
		<label for="txtSearchName" class="ui-hidden-accessible">Search</label>
		<input id="txtSearchName" type="search" value="" placeholder="Search Name, Email, or Code" 
		data-theme="c"/>
		</div>
		*/

		);
	},
	drawParties: function (aRows) {

		var sClassId = this.oClass.ID;
		var jPage = $("#Participants");
		var jUl = $("#partyList", jPage).empty();

		$(".ui-listview-filter", jPage).toggle(aRows.length > 7);

		if (aRows.length > Participants.maxDisplay) {
			$("#MaxParties", jPage).show();
		}


		if (aRows.length == 0) {
			if (sClassId == "-1") {
				$("#NoParties", jPage).show();
			}
			else $("#NoParties_Class", jPage).show();
			return;
		}


		var jX = $("#liPrototypes");

		for (var nX = 0; nX < aRows.length; nX++) {
			var jLi = $(".liParty.prototype", jX).clone().removeClass("prototype");
			var oParty = aRows[nX];

			Participants.drawOne(jLi, oParty);

			jUl.append(jLi);


			$('div.WrapSessionTokens', jLi)
			.on('tap', function (event) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				var jTokenClicked = $(this);
				var nNewTot = TokenSession.enter(jTokenClicked.parents('li').data('oParty'), 1);
				var cAnimation = "bounceIn";
				jTokenClicked.addClass('animated ' + cAnimation);
				setTimeout(function () {
					jTokenClicked.removeClass('animated ' + cAnimation);
					//Application.drawTokenAmount($(".SessionTokens", jTokenClicked), nNewTot);
				}, 1000);
			}).nodoubletapzoom();

			$("a", jLi).click(function (event) {
				event.preventDefault();
				event.stopPropagation();
				Participants.openParty($(this).parents('li'));
			});

			jLi.on('vmousedown', function (event) {
				//event.stopImmediatePropagation();
				var jPartyLi = $(this);
				jPartyLi.siblings().removeClass("ui-btn-up-e");
				jPartyLi.removeClass('ui-btn-up-d').addClass("ui-btn-up-e");
			});

			jLi.on('swipeleft', function (event) {
				event.preventDefault();
				event.stopPropagation();
				Participants.openParty($(this));
			});

		}



		jUl.trigger("create").listview("refresh");
		jUl.trigger('updatelayout');
		jUl.show();

		TokenSession.refresh();

	},

	drawOne: function (jLiNode, oParty) {
		$("div.Inactive", jLiNode).toggle(oParty.ACTIVATED != "1");
		$("div.WrapSessionTokens", jLiNode).toggle(oParty.ACTIVATED == "1");
		$(".partyName", jLiNode).text(
			(Application.oPrefs.oGeneral.sSortParticipants == "1") ?
			oParty.SORT_NAME : oParty.NAME);

		var sBalance = ""; // "No " + Application.oUser.TOKENUNIT + "s";
		if (oParty.BALANCE) {
			sBalance = oParty.BALANCE + " " + Application.oUser.TOKENUNIT.toPlural(oParty.BALANCE);
		}
		$(".partyBalance", jLiNode).text(sBalance);

		$(".partyClasses", jLiNode).html(oParty.CLASS_NAME);

		jLiNode.data({ 'oParty': oParty });

	},

	openParty: function (jPartyLi) {
		setTimeout(function () {
			Participant.data = jPartyLi.data('oParty');
			$.mobile.changePage($("#Participant"));
		}, 100);
	},
	highlightParty: function () {
	}

};

Participant = {
	data: {
		ACTIVATED: "1",
		ADDRESS: "",
		AWARDS: "",
		BALANCE: "",
		BIRTHYEAR: "",
		CITY: "",
		CLASS_ID: "",
		CLASS_IDS: "",
		CLASS_NAME: "",
		CODE: "",
		CONTACTS: "",
		CONTACTS_ACTIVE: "",
		CONTACT_ID: "",
		CUSTOMER_ID: "",
		CUSTOM_CODE: "",
		DIRECT_SHIP: "",
		EARNED: "",
		EMAIL: "",
		EMAIL_VERIFIED: "",
		GENDER: "",
		LASTUPDATE: "",
		LAST_DEPOSIT: "",
		LAST_LOGIN: "",
		LAST_WITHDRAW: "",
		NAME: "",
		NICK_NAME: "",
		NOTES: "",
		PASSWORD_SET: "",
		PENDING: "",
		RECORD_NUMBER: "",
		SORT_NAME: "",
		SPENT: "",
		STATE: "",
		ZIP: ""
	},

	initialized: false,
	timer: null,
	init: function () {
		if (this.initialized) {
			this.refresh();
			return;
		}

		var jPage = $("#Participant");

		jPage.on('swiperight', function (event) {
			event.preventDefault();
			event.stopPropagation();

			var goBack = function () {
				window.history.back();
				Participant.timer = null;
			}

			if (Participant.timer) { return; }
			Participant.timer = setTimeout(goBack, 100);

			//$("#Participant_header a.ui-btn-left", jPage).click();
			//event.stopPropagation();
		});

		jPage.on('swipeleft', function (event) {
			event.preventDefault();
			event.stopPropagation();

			$.mobile.changePage($("#PartyTransactions"));
		});


		$("#WrapPartyBalances", jPage)
		.bind('collapse', function () {
			Application.oPrefs.oCollapsibles.sPartyTransactions = "collapse";
			Application.savePrefs();
		})
		.bind('expand', function () {
			Application.oPrefs.oCollapsibles.sPartyTransactions = "expand";
			Application.savePrefs();
		});


		$(".btnDeposit", jPage).on('click', function () {
			LedgerEntry.insert(1);
		})

		$(".btnWithdraw", jPage).on('click', function () {
			LedgerEntry.insert(-1);
		})

		$("a.DepositSession", jPage).on('click', function () {
			TokenSession.saveDialog.open(Participant.data);
		})
		$("a.AdjustSession", jPage).on('click', function () {
			TokenSession.adjustParty.open(Participant.data);
		})

		$(".SessionTokenTotal", jPage).detach().appendTo($(".WrapSessionSummary h4 a", jPage));


		$(".partyBalance", jPage).detach().appendTo($("h1 a", jPage));

		$("a#EditProfile", jPage).on('click', function () {
			PartyProfile.update();
		});
		this.initialized = true;
	},

	refresh: function () {
		oParty = Participant.data;
		jPage = $("#Participant");
		$("div.PartyName", jPage).text(oParty.NAME);
		$("div.Inactive", jPage).toggle(oParty.ACTIVATED != "1");

		$("#partyCode", jPage).text(oParty.CODE.toUpperCase());

		$("#wrapViewPartyEmail").toggle(oParty.EMAIL > "");


		$("#partyEmail", jPage).text(oParty.EMAIL);
		var jWrap = $(".WrapEmail", jPage);
		$("span.valid, span.verified, span.invalid", jWrap).hide();
		if (oParty.EMAIL_VERIFIED) {
			$("span.verified", jWrap).show();
		}
		else if (oParty.EMAIL.isValidEmail()) {
			$("span.valid", jWrap).show();
		}
		else if (oParty.EMAIL) {
			$("span.invalid", jWrap).show();
		}


		$("#wrapViewPartyClasses").toggle(oParty.CLASS_NAME > "");
		$("#partyClasses", jPage).html(oParty.CLASS_NAME);

		$("#partyEarned", jPage).text(oParty.EARNED);
		$("#partySpent", jPage).text(oParty.SPENT);
		$("#partyPending", jPage).text(oParty.PENDING);
		$(".partyBalance", jPage).text(oParty.BALANCE);

		var aoParties = TokenSession.oSummary.aoParties
		var oSesParty = null;
		for (var nX = 0; nX < aoParties.length; nX++) {
			if (aoParties[nX].sPartyCode == oParty.CODE) {
				oSesParty = aoParties[nX];
				break;
			}
		}

		if (oSesParty) {
			$("div.WrapSessionSummary", jPage).show();
			Application.drawTokenAmount($(".SessionTokenTotal", jPage), oSesParty.nTotal);

		}
		else $("div.WrapSessionSummary", jPage).hide();

		$("#WrapPartyBalances", jPage)
		.trigger(Application.oPrefs.oCollapsibles.sPartyTransactions)

	}
};

PartyProfile = {
	initialized: false,
	bInserting: null,
	bEdited: false,
	bReqsMet: false,
	sDefaultClassId: '',
	oDataPrototype: {
		ACTIVATED: "1",
		ADDRESS: "",
		AWARDS: "",
		BALANCE: "",
		BIRTHYEAR: "",
		CITY: "",
		CLASS_ID: "",
		CLASS_IDS: "",
		CLASS_NAME: "",
		CODE: "",
		CONTACTS: "",
		CONTACTS_ACTIVE: "",
		CONTACT_ID: "",
		CUSTOMER_ID: "",
		CUSTOM_CODE: "",
		DIRECT_SHIP: "",
		EARNED: "",
		EMAIL: "",
		EMAIL_VERIFIED: "",
		GENDER: "",
		LASTUPDATE: "",
		LAST_DEPOSIT: "",
		LAST_LOGIN: "",
		LAST_WITHDRAW: "",
		NAME: "",
		NICK_NAME: "",
		NOTES: "",
		PASSWORD_SET: "",
		PENDING: "",
		RECORD_NUMBER: "",
		SORT_NAME: "",
		SPENT: "",
		STATE: "",
		ZIP: ""
	},

	init: function () {
		if (this.initialized) { return; }
		var jPage = $("#PartyProfile");

		$('input[type="text"]', jPage).keyup(function () {
			var sId = $(this).attr("id");
			if (/Name/.test(sId)) { PartyProfile.setExtraNames(this, false); }
			if (/Email/.test(sId)) { PartyProfile.setEmailNotice(); }
			PartyProfile.validate();
		});

		$("#wrapExtraNames input", jPage).focusout(function () {
			PartyProfile.setExtraNames(this, true);
		});

		$('input#PartyEmail', jPage).keyup(function () {
			PartyProfile.setEmailNotice();
			PartyProfile.validate();
		});

		$("#selPartyStatus", jPage).bind('change', function () {
			PartyProfile.validate();
		});

		$("a.saveButton", jPage).bind('click', function () {
			if (PartyProfile.bEdited && PartyProfile.bReqsMet) {
				PartyProfile.save(function () { window.history.back(); });
			}
		});

		this.initialized = true;
	},

	insert: function (sClassId) {
		this.bInserting = true;
		this.sDefaultClassId = (!sClassId || sClassId == "-1") ? "" : sClassId;

		$.mobile.changePage($("#PartyProfile"));
	},
	update: function () {
		this.bInserting = false;
		this.sDefaultClassId = "";
		$.mobile.changePage($("#PartyProfile"));
	},

	refresh: function () {
		var jPage = $("#PartyProfile");
		var oParty = {};

		if (this.bInserting) {
			$("#PartyProfile div h1").html("New<br/>" + Application.oUser.PARTICIPANT_ALIAS);
			oParty = $.extend({}, this.oDataPrototype);
			oParty.CLASS_ID = oParty.CLASS_IDS = this.sDefaultClassId;
		}
		else {
			oParty = Participant.data;
			$("div h1", jPage).html("Edit<br/>" + Application.oUser.PARTICIPANT_ALIAS);
		}

		$("input#PartyName", jPage).val(oParty.NAME);
		var oNames = oParty.NAME.parseName();
		var jSortName = $("#txtSortName", jPage);
		jSortName.val(oParty.SORT_NAME).addClass((oParty.SORT_NAME != oNames.sort) ? "edited" : "");

		var jNickName = $("#txtNickName", jPage);
		jNickName.val(oParty.NICK_NAME).addClass((oParty.NICK_NAME != oNames.nick) ? "edited" : "");




		$("input#PartyEmail", jPage).val(oParty.EMAIL);
		var jWrap = $("#wrapPartyEmail", jPage);
		if (oParty.EMAIL_VERIFIED) {
			$("span.verified", jWrap).show();
			$("span.valid", jWrap).hide();
			$("span.invalid", jWrap).hide();
			$("input#PartyEmail", jWrap).textinput('disable');
			$("#VerifiedEmailNote", jWrap).show();
		}
		else {
			$("#VerifiedEmailNote", jWrap).hide();
			$("span.verified", jWrap).hide();
			$("input#PartyEmail", jWrap).textinput('enable');
		}
		PartyProfile.setEmailNotice();

		$("#wrapPartyStatus", jPage).toggle(!this.bInserting);
		$("#selPartyStatus", jPage).val(oParty.ACTIVATED);
		$("#selPartyStatus").slider("refresh");

		var aoClasses = $.extend([], Dashboard.aoClasses).sortColumn("ID")

		if (aoClasses.length == 0) {
			$("#WrapPartyClasses").hide();
			PartyProfile.validate();
		}
		else {
			$("#WrapPartyClasses").show();
			var aPartyClasses = oParty.CLASS_IDS.split(",");
			var sCount = "0", sCount2 = "0";

			var jUl = $('#AssignedClassList', jPage).empty();
			if (!oParty.CLASS_IDS) {
				jUl.append('<li class="NoAssignments">Not Assigned to Any Classes</li>');
			}
			else {
				sCount = aPartyClasses.length;
				for (var nX = 0; nX < aPartyClasses.length; nX++) {
					var oClass = aoClasses[aoClasses.searchSortedColumn(aPartyClasses[nX], "ID")];
					jUl.append(PartyProfile.newAssignedClass(oClass));
				}
			}


			jUl2 = $("#UnassignedClassList", jPage).empty();
			if (Dashboard.aoClasses.length == 0) {
				jUl2.append('<li>There are no classes.</li>');
			}
			else {
				sCount2 = Dashboard.aoClasses.length;
				for (var nX = 0; nX < Dashboard.aoClasses.length; nX++) {
					var oClass = Dashboard.aoClasses[nX];
					if ($.inArray(oClass.ID, aPartyClasses) == -1) {
						jUl2.append(PartyProfile.newUnassignedClass(oClass));
					}
					else sCount2--;
				}
			}

			setTimeout(function () {
				jUl.trigger("create").listview("refresh").trigger('updatelayout');
				jUl2.trigger("create").listview("refresh").trigger('updatelayout');


				var jCount = $("#AssignedCountBubble", jPage);
				var jCount2 = $("#UnassignedCountBubble", jPage);
				if (jCount.length == 0) {

					$("h2", jPage).append(
						'<span id="AssignedCountBubble" ' +
							'class="ClassCountBubble ui-li-count ui-btn-up-c ui-btn-corner-all">0</span>'
					);
					$("h3", jPage).append(
						'<span id="UnassignedCountBubble" ' +
							'class="ClassCountBubble ui-li-count ui-btn-up-c ui-btn-corner-all">0</span>'
					);

					jCount = $("#AssignedCountBubble", jPage);
					jCount2 = $("#UnassignedCountBubble", jPage);
				}
				jCount.text(sCount);
				jCount2.text(sCount2);
				PartyProfile.validate();
			}, 1);

		}
	},


	updatedValues: function () {
		var jPage = $("#PartyProfile");
		var oData = $.extend({}, (PartyProfile.bInserting) ? PartyProfile.oDataPrototype : Participant.data);

		oData.NAME = $("input#PartyName", jPage).val().trim();
		oData.EMAIL = $("input#PartyEmail", jPage).val().trim();

		oData.ACTIVATED = $("#selPartyStatus", jPage).val();

		var sCLASS_ID = '';
		var aCLASS_IDS = [];
		$("#AssignedClassList li.AssignedClass", jPage).each(function () {
			var jThis = $(this);
			aCLASS_IDS.push(jThis.data().ID.toNumber());
			if (jThis.find(".PartyClassHomeIcon").hasClass("Home")) {
				sCLASS_ID = jThis.data().ID;
			}
		});
		var jAssignedClasses = $("#AssignedClassList li.AssignedClass", jPage)
		if (!sCLASS_ID && jAssignedClasses.length > 0) {
			jAssignedClasses.eq(0).find(".PartyClassHomeIcon").addClass("Home");
			sCLASS_ID = jAssignedClasses.eq(0).data().ID;
		}

		var sCLASS_IDS = aCLASS_IDS.sort().join(",");
		oData.CLASS_ID = sCLASS_ID;
		oData.CLASS_IDS = sCLASS_IDS;

		oData.SORT_NAME = $("#txtSortName").val().trim();
		oData.NICK_NAME = $("#txtNickName").val().trim();
		return oData;

		/*
		this.SORT_NAME = $("#diagEditParticipant #txtSortName").val().trim();
		this.NICK_NAME = $("#diagEditParticipant #txtNickName").val().trim();

		this.ACTIVATED = $("#selPartyStatus").val();

		this.GENDER = $("#diagEditParticipant #selPartyGender").val();
		this.BIRTHYEAR = $("#diagEditParticipant #selPartyBirthYear").val();

		this.EMAIL = $("#diagEditParticipant #txtPartyEmail").val().trim();

		var bCurrentShip = Participants.edit.oPartyData.DIRECT_SHIP ? true : false;
		var bUpdatedShip = $("#wrapShipWhere select").val() == "1";
		if (bUpdatedShip && bCurrentShip) {
		this.DIRECT_SHIP = Participants.edit.oPartyData.DIRECT_SHIP;
		}
		else if (bUpdatedShip && !bCurrentShip) {
		this.DIRECT_SHIP = 'now';
		}
		else this.DIRECT_SHIP = '';

		this.ADDRESS = $('#wrapPartyAddress textarea').val().trim();
		this.CITY = $('#wrapPartyAddress input[fld="CITY"]').val().trim();
		this.STATE = $('#wrapPartyAddress select[fld="STATE"]').val();
		this.ZIP = $('#wrapPartyAddress input[fld="ZIP"]').val().trim();
		*/
	},

	validate: function () {
		var jPage = $("#PartyProfile");
		$("#AssignedCountBubble", jPage).text($("ul#AssignedClassList li.AssignedClass").length);
		$("#UnassignedCountBubble", jPage).text($("ul#UnassignedClassList li.UnassignedClass").length);

		var oUpdated = new PartyProfile.updatedValues();

		var oCurrent = this.bInserting ? $.extend({}, this.oDataPrototype) : Participant.data;

		// Sort current class id's for comparison
		oCurrent.CLASS_IDS = oCurrent.CLASS_IDS.split(",").sort().join(",");


		var bEdited = false;

		for (var sField in oUpdated) {
			if (oUpdated[sField] != oCurrent[sField]) {
				//alert(sField + "\n" + oUpdated[sField] + "\n" + oCurrent[sField]);
				bEdited = true;
			}
		}

		var bReqsMet = true;
		if (!oUpdated.NAME) {
			//$("#wrapPartyName .requiredAsterix").show();
			bReqsMet = false;
		}

		/*
		if (oUpdated.DIRECT_SHIP) {
		if (!oUpdated.ADDRESS) {
		$('#wrapPartyAddress [fld="ADDRESS"]').prev().find(".requiredAsterix").show();
		bReqsMet = false;
		}
		if (!oUpdated.CITY) {
		$('#wrapPartyAddress [fld="CITY"]').prev().find(".requiredAsterix").show();
		bReqsMet = false;
		}
		if (!oUpdated.STATE) {
		$('#wrapPartyAddress [fld="STATE"]').prev().find(".requiredAsterix").show();
		bReqsMet = false;
		}
		if (!oUpdated.ZIP) {
		$('#wrapPartyAddress [fld="ZIP"]').prev().find(".requiredAsterix").show();
		bReqsMet = false;
		}
		}
		*/

		if (!bReqsMet) {
			//$("#NoteRequiredField, .requiredAsterix", jBtnPane).show();
		}

		PartyProfile.bEdited = bEdited;
		PartyProfile.bReqsMet = bReqsMet;

		$('a.saveButton', jPage).toggleClass('ui-disabled', !this.bReqsMet || !this.bEdited);

	},

	setExtraNames: function (elementEdited, bOnBlur) {
		var oNames = $("#PartyProfile #PartyName").val().parseName();
		var jEle = $(elementEdited);

		switch (elementEdited.id) {
			case "PartyName":
				if (!$("#txtSortName").hasClass("edited")) {
					$("#txtSortName").val(oNames.sort);
				}
				else if ($("#txtSortName").hasClass("edited") && $("#txtSortName").val().trim() == oNames.sort) {
					$("#txtSortName").removeClass("edited");
				}

				if (!$("#txtNickName").hasClass("edited")) {
					$("#txtNickName").val(oNames.nick);
				}
				else if ($("#txtNickName").hasClass("edited") && $("#txtNickName").val().trim() == oNames.nick) {
					$("#txtNickName").removeClass("edited");
				}

				break;
			case "txtSortName":
				if (bOnBlur && !jEle.val().trim()) jEle.val(oNames.sort);
				if (oNames.sort == jEle.val().trim()) jEle.removeClass("edited");
				else jEle.addClass("edited");
				break;
			case "txtNickName":
				if (bOnBlur && !jEle.val().trim()) jEle.val(oNames.nick);
				if (oNames.nick == jEle.val().trim()) jEle.removeClass("edited");
				else jEle.addClass("edited");
				break;
		}

	},

	setEmailNotice: function () {
		if (Participant.data.EMAIL_VERIFIED) { return; }
		var jWrap = $("#PartyProfile #wrapPartyEmail");
		var sEmail = $("input#PartyEmail", jWrap).val().trim();
		$(".valid, .invalid, .verified", jWrap).hide();

		if (sEmail.isValidEmail()) {
			$("span.valid", jWrap).show();
		}
		else if (sEmail) $("span.invalid", jWrap).show();
	},

	newAssignedClass: function (oClass) {
		var jClassLi = $("#LiClasses li.AssignedClass.prototype").clone()
			.removeClass('prototype').data(oClass);

		$("span.ClassName", jClassLi).text(oClass.CLASS_NAME);

		$('button.RemoveClass', jClassLi).attr("data-enhance", "true")
			.bind('click', function () {
				var jClass = $(this).parents('li');

				var jNewClass = PartyProfile.newUnassignedClass(jClass.data());
				jClass.remove();

				$("button.AssignClass", jNewClass).button();

				var jUl = $("ul#AssignedClassList");

				if ($("li.AssignedClass", jUl).length == 0) {
					jUl.append('<li class="NoAssignments">Not Assigned to Any Classes</li>');
				}

				jUl.listview("refresh").trigger('updatelayout');
				$("ul#UnassignedClassList").append(jNewClass).listview("refresh").trigger('updatelayout');

				$("#PartyProfile").trigger('updatelayout');
				PartyProfile.validate();
			}).trigger("create");

		var jHomeClassIcon = $('.PartyClassHomeIcon', jClassLi)
			.bind('click', function () {
				$(this).parents('li').siblings().find(".PartyClassHomeIcon.Home").removeClass("Home");
				$(this).addClass("Home");
				PartyProfile.validate();
			});

		if (Participant.data.CLASS_ID == oClass.ID) {
			jHomeClassIcon.addClass("Home");
		}

		return jClassLi;
	},
	newUnassignedClass: function (oClass) {
		var jClassLi = $("#LiClasses li.UnassignedClass.prototype").clone()
			.removeClass('prototype').data(oClass);
		$("span.ClassName", jClassLi).text(oClass.CLASS_NAME);

		$('button.AssignClass', jClassLi).attr("data-enhance", "true").bind('click', function () {
			var jClass = $(this).parents('li');

			var jNewClass = PartyProfile.newAssignedClass(jClass.data());
			jClass.remove();

			$("button.RemoveClass", jNewClass).button();

			var jUl = $("ul#AssignedClassList");
			$("li.NoAssignments", jUl).remove();

			jUl.append(jNewClass).listview("refresh").trigger('updatelayout');

			$("ul#UnassignedClassList").listview("refresh").trigger('updatelayout');

			$("#PartyProfile").trigger('updatelayout');

			PartyProfile.validate();
		}).trigger("create");

		return jClassLi;
	},

	save: function (fnCallback) {
		ui.elap.on("Saving");
		this.bEdited = this.bReqsMet = false;

		var oUpdated = new PartyProfile.updatedValues();
		oUpdated.CLASS_ID = (oUpdated.CLASS_ID) ? oUpdated.CLASS_ID : "";
		var SQL =
			"select code from adm$participant_update(" +
				Application.oUser.CUSTOMER_ID.prepSQL() + "," +
				oUpdated.CODE.prepSQL(true) + "," +
				"1," + // 1 (true) because contact info included in update
				oUpdated.ACTIVATED.prepSQL() + "," +
				oUpdated.CLASS_ID.prepSQL(true) + "," +
				oUpdated.CLASS_IDS.prepSQL(true) + "," +

				oUpdated.NAME.prepSQL() + "," +
				oUpdated.SORT_NAME.prepSQL() + "," +
				oUpdated.NICK_NAME.prepSQL() + "," +
				oUpdated.EMAIL.prepSQL(true) + "," +
				oUpdated.GENDER.prepSQL(true) + "," +
				oUpdated.BIRTHYEAR.prepSQL(true) + "," +

				oUpdated.DIRECT_SHIP.prepSQL(true) + "," +
				oUpdated.ADDRESS.prepSQL(true) + "," +
				oUpdated.CITY.prepSQL(true) + "," +
				oUpdated.STATE.prepSQL(true) + "," +
				oUpdated.ZIP.prepSQL(true) +
			");\n" +
			"select * from adm$participant(" +
				Application.oUser.CUSTOMER_ID.prepSQL() + "," +
				oUpdated.CODE.prepSQL() + ");"

		var sMessage = "";
		if (this.bInserting) {
			sMessage = "New " + Application.oUser.PARTICIPANT_ALIAS + " Saved";
		}
		else {
			sMessage = Application.oUser.PARTICIPANT_ALIAS + " Edits Saved";
		}

		new execQuery(SQL, function (data) {
			LogEntry(sMessage + " - " + oUpdated.CODE + ", " + oUpdated.NAME);
			if (PartyProfile.bInserting) {
				Participants.lastClassFetched = null;
			}
			else {
				Participant.data = data[1][0];
				Participant.refresh();
				Participants.refresh(Participant.data);
			}
			Dashboard.bRefresh = true;
			Dashboard.refresh(function () {
				ui.elap.off();
				ui.popupMessage(sMessage);
				if (fnCallback) { fnCallback(); }
			});
		});

	},

	backConfirm: function () {
		ui.showConfirm({
			sTitle: "Save?",
			sMessage:
				'Do you want to save ' +
				((PartyProfile.bInserting) ? 'this new' : 'your edits to this') + ' ' +
				Application.oUser.PARTICIPANT_ALIAS.toLowerCase() + ' before continuing?',
			sConfirmButtonText: "Yes",
			sCancelButtonText: "No",
			fnConfirmCallback: function () {
				PartyProfile.save(function () { window.history.back(); });
			},
			fnCancelCallback: function () {
				PartyProfile.bEdited = PartyProfile.bReqsMet = false;
				window.history.back();
			}
		});

	}

};

ClassGroup = {
	initialized: false,
	bInserting: null,
	bEdited: false,
	bReqsMet: false,
	oClass: {
		CLASS_NAME: '',
		ID: ''
	},

	init: function () {
		if (this.initialized) { return; }
		var jPage = $("#ClassGroup");

		$("a.saveButton", jPage).on('click', function () {
			if (ClassGroup.bEdited && ClassGroup.bReqsMet) {
				ClassGroup.save();
			}
		});

		$('input', jPage).keyup(function () { ClassGroup.validate() });

		$("a#DeleteClass", jPage).on('click', function () {
			ui.showConfirm({
				sTitle: "Delete Class?",
				sMessage: 'Are you sure want to delete this class?' +
				'<br/><br/>' +
				'<div style="font-style:italic; font-size:.9em">' +
					'Note: ' + Application.oUser.PARTICIPANT_ALIAS + 's assigned to this class will not be deleted, ' +
					'but they will have this class assignment removed.' +
				'</div>'
				,
				sConfirmButtonText: "Yes",
				sCancelButtonText: "No",
				fnConfirmCallback: function () {
					ClassGroup.deleteClass();
				},
				fnCancelCallback: function () { }
			});

		});


		this.initialized = true;
	},

	insert: function () {
		this.bInserting = true;
		this.oClass = {
			CLASS_NAME: '',
			ID: ''
		}

		$.mobile.changePage($("#ClassGroup"));
	},
	update: function (oClass) {
		this.bInserting = false;
		this.oClass = oClass;

		$.mobile.changePage($("#ClassGroup"));
	},
	refresh: function () {
		var jPage = $("#ClassGroup");
		if (this.bInserting) {
			$('div[data-role="header"] h1', jPage).text("New Class");
			$("a#DeleteClass", jPage).hide();
		}
		else {
			$('div[data-role="header"] h1', jPage).text("Edit Class");
			$("a#DeleteClass", jPage).show();
		}

		$('input', jPage).val(this.oClass.CLASS_NAME);

		this.validate();

	},
	validate: function () {
		var jPage = $("#ClassGroup");
		var sName = $('input', jPage).val().trim();
		this.bEdited = this.oClass.CLASS_NAME != sName
		this.bReqsMet = (sName > "");

		$('a.saveButton', jPage).toggleClass('ui-disabled', !this.bReqsMet || !this.bEdited);
	},
	save: function (fnCallback) {
		var jPage = $("#ClassGroup");
		this.bEdited = this.bReqsMet = false;

		var SQL = "execute procedure adm$classes_iud(" +
			"null," + // delete_rec
			Application.oUser.CUSTOMER_ID.prepSQL() + "," +
			this.oClass.ID.prepSQL(true) + "," + // CLASS_ID
			$('input', jPage).val().prepSQL() + ");"; // NAME
		ui.elap.on("Saving");
		new execQuery(SQL, function () {
			Dashboard.bRefresh = true;
			Dashboard.refresh(function () {

				if (!ClassGroup.bInserting && Participants.oClass.ID == ClassGroup.oClass.ID) {
					Participants.oClass = $.extend({}, Dashboard.aoClasses[Dashboard.aoClasses.searchSortedColumn(ClassGroup.oClass.ID, 'ID')]);
					Participants.lastClassFetched = null;
					Participants.refresh(false, ClassGroup.saveCallBack);
				}
				else {
					//if (fnCallback) { fnCallbackClassGroup(); }
					ClassGroup.saveCallBack();
				}
			});

		});
	},
	saveCallBack: function () {
		window.history.back();
		ui.elap.off();
		ui.popupMessage("Class Saved");
	},

	deleteClass: function () {
		var SQL = "execute procedure adm$classes_iud(" +
			"1," + // delete_rec
			Application.oUser.CUSTOMER_ID.prepSQL() + "," +
			this.oClass.ID.prepSQL(true) + "," + // CLASS_ID
			"null);"; // NAME
		ui.elap.on("Deleting Class");
		new execQuery(SQL, function () {
			Participants.lastClassFetched = null;
			Dashboard.bRefresh = true;
			Dashboard.refresh(function () {

				if (Participants.oClass.ID == ClassGroup.oClass.ID) { }

				window.history.go(-2);
				ui.elap.off();
				ui.popupMessage("Class Deleted");
			});

		});

	},

	backConfirm: function () {
		ui.showConfirm({
			sTitle: "Save?",
			sMessage:
				'Do you want to save ' +
				((ClassGroup.bInserting) ? 'this new' : 'your edits to the') + ' ' +
				'class/group before continuing?',
			sConfirmButtonText: "Yes",
			sCancelButtonText: "No",
			fnConfirmCallback: function () {
				ClassGroup.save();
			},
			fnCancelCallback: function () {
				ClassGroup.bEdited = ClassGroup.bReqsMet = false;
				window.history.back();
			}
		});

	}
};

PartyTransactions = {
	initialized: false,
	init: function () {
		if (this.initialized) { return; }
		var jPage = $("#PartyTransactions");
		jPage.bind('swiperight', function (event) {
			event.preventDefault();
			event.stopPropagation();
			window.history.back();
			return;
		});


	},
	refresh: function () {
		ui.elap.on();

		var jPage = $("#PartyTransactions");
		var oParty = Participant.data;
		$("span.PartyName", jPage).text(oParty.NAME);
		var jUl = $('ul[data-role="listview"]', jPage).empty();

		new execQuery("select * from adm$party_ledger(" +
			Application.oUser.CUSTOMER_ID.prepSQL() + "," +
			Participant.data.CODE.prepSQL() + ");",
		function (aRows) {

			var jProto = $(".liTrans.prototype");
			for (var nX = 0; nX < aRows.length; nX++) {
				var jLi = jProto.clone().removeClass("prototype");
				var oTrans = aRows[nX];
				//console.log(oTrans)
				$(".postDateTime", jLi).html(
					"Posted: " +
					oTrans.ADDED.toDateFormat("shortDateTime") +
					((oTrans.ADMIN_USER_ID) ? " by " + oTrans.ADMIN_USER_NAME : "")
				);
				$(".description", jLi).html(oTrans.DESCRIPTION);
				$(".amount", jLi).html(oTrans.AMOUNT);
				jUl.append(jLi);
			}
			jUl.trigger("create").listview("refresh");
			jUl.show();
			$(jUl).trigger('updatelayout');

			ui.elap.off();
		});
	}
};

LedgerEntry = {
	initialized: false,
	nType: null,
	sType: "",
	aoRemembered: [],
	bInserting: false,
	bEdited: false,
	bReqsMet: false,

	oLastUsed: {
		deposit: {
			amount: 1,
			description: ""
		},
		withdrawal: {
			amount: 1,
			description: ""
		}
	},
	oCurrent: {},

	init: function () {
		if (this.initialized) return;

		var jPage = $("#LedgerEntry.ui-page");

		$("#txtAmount", jPage).constrainNumeric({ absolute: true, integer: true })
		.keyup(function () { LedgerEntry.validate(); })
		.change(function () { LedgerEntry.validate(); });

		$("a.QuickButton", jPage).on("click", function () {
			var jAmt = $("#txtAmount");
			var nAmount = $(this).text().toNumber();

			jAmt.val(nAmount);
			LedgerEntry.validate();
		});
		//this.oLastUsed.deposit.description = Application.oPrefs.oDeposit.sDescription;
		//this.oLastUsed.withdrawal.description = Application.oPrefs.oWithdrawal.sDescription;

		$("a#ConfigQuickTokens").on("click", function () {
			$.mobile.changePage($("#dlgTransactOptions"));
		});

		$("#selRememberedDeposits").change(function () {
			jOpt = $('option:selected', $(this));
			var nAmount = Math.abs(jOpt.attr("tokens").toNumber());
			var sDescript = jOpt.attr("description");

			$("#txtAmount").val(nAmount);
			$("#txtTransactDescript").val(sDescript);
			LedgerEntry.validate();
		});


		$("a.saveButton", jPage).on('click', function () {
			if (LedgerEntry.bEdited && LedgerEntry.bReqsMet) {
				LedgerEntry.save();
			}
		});

		this.initialized = true;
	},

	insert: function (nType) {
		this.bInserting = true;
		LedgerEntry.nType = nType;
		LedgerEntry.oCurrent = {};
		$.mobile.changePage($("#LedgerEntry"));
	},

	refresh: function () {

		var jPage = $("div#LedgerEntry.ui-page");

		var sType = (this.nType == 1) ? "Deposit" : "Withdrawal";
		this.sType = sType;

		$("h1", jPage).html(
			((this.bInserting) ? "New<br/>" : "Edit<br/>") +
			sType
		);


		$(".PartyName", jPage).text(Participant.data.NAME);


		var oPrefs = (this.nType == 1) ? Application.oPrefs.oDeposit : Application.oPrefs.oWithdrawal;
		$("a#QuickButton1 span.ui-btn-text", jPage).text(oPrefs.nButton1);
		$("a#QuickButton2 span.ui-btn-text", jPage).text(oPrefs.nButton2);
		$("a#QuickButton3 span.ui-btn-text", jPage).text(oPrefs.nButton3);



		$('#LedgerEntry label[for="txtAmount"]')
		.text(Application.oUser.TOKENUNIT + "s to " + sType + ":");

		$('#LedgerEntry label[for="txtTransactDescript"]')
		.text("Reason for " + sType + ":");

		var jDesc = $("#txtTransactDescript");
		var jAmt = $("#txtAmount");
		var jLabel = $('#LedgerEntry label[for="selRememberedDeposits"] span')
		if (this.nType == 1) {
			var sDescript = (this.oLastUsed.deposit.description) ? this.oLastUsed.deposit.description : oPrefs.sDescription;
			jAmt.val(this.oLastUsed.deposit.amount);
			jDesc.val(sDescript);
			jLabel.text("Deposit");
		}
		else {
			jAmt.val(this.oLastUsed.withdrawal.amount);
			var sDescript = (this.oLastUsed.withdrawal.description) ? this.oLastUsed.withdrawal.description : oPrefs.sDescription;
			jDesc.val(sDescript);
			jLabel.text("Withdrawal");
		}

		var aoX = LedgerEntry.aoRemembered;
		var jSel = $("#selRememberedDeposits").empty();
		jSel.append('<option value="0">Select One...</option>');
		for (var nX = 0; nX < aoX.length; nX++) {
			if (
				(LedgerEntry.nType == 1 && aoX[nX].AMOUNT.toNumber() > 0) ||
				(LedgerEntry.nType == -1 && aoX[nX].AMOUNT.toNumber() < 0)
			) {
				jSel.append(
					'<option tokens="' + aoX[nX].AMOUNT + '" description="' + aoX[nX].DESCRIPTION + '">' +
						aoX[nX].DESCRIPTION + ', <br/>' +
						aoX[nX].AMOUNT + ' ' +
						Application.oUser.TOKENUNIT.toPlural(aoX[nX].AMOUNT) +
					'</option>'
				);
			}
		}
		jSel.selectmenu("refresh", true);

		$("div#balanceBefore span").text(Participant.data.BALANCE);

		this.validate();
	},
	validate: function () {
		var jPage = $("#LedgerEntry.ui-page");
		var nAmount = $("#txtAmount", jPage).val().toNumber();
		var nBal = Participant.data.BALANCE.toNumber() + (nAmount * this.nType);
		$("div#balanceAfter span.amount").text(nBal);

		this.bReqsMet = (nAmount != 0);

		if (this.bInserting) {
			this.bEdited = true;
		}

		$('a.saveButton', jPage).toggleClass('ui-disabled', !this.bReqsMet || !this.bEdited);

	},

	options: {
		initialized: false,
		init: function () {
			if (this.initialized) return;

			var jPage = $("#dlgTransactOptions");
			$(".TokenAmount", jPage).constrainNumeric({ absolute: true, integer: true });

			$("button.Save", jPage).click(function () { LedgerEntry.options.save() });
			$("button.Cancel", jPage).click(function () {
				$("#dlgTransactOptions").dialog('close');
			});

			this.initialized = true;
		},
		refresh: function () {
			var jPage = $("#dlgTransactOptions");

			$("h1.ui-title", jPage).text("Configure " + LedgerEntry.sType + "s");
			var oPrefs = (LedgerEntry.nType == 1) ? Application.oPrefs.oDeposit : Application.oPrefs.oWithdrawal;

			$("#QuickButton1-Value", jPage).val(oPrefs.nButton1);
			$("#QuickButton2-Value", jPage).val(oPrefs.nButton2);
			$("#QuickButton3-Value", jPage).val(oPrefs.nButton3);

			$(".Deposit-Withdrawal", jPage).text((LedgerEntry.nType == 1) ? "deposit" : "withdrawal");

			$("#DefaultDescription", jPage).val(oPrefs.sDescription);


		},
		save: function () {
			var jPage = $("#dlgTransactOptions");
			var oPrefs = (LedgerEntry.nType == 1) ? Application.oPrefs.oDeposit : Application.oPrefs.oWithdrawal;

			oPrefs.nButton1 = $("#QuickButton1-Value", jPage).val();
			oPrefs.nButton2 = $("#QuickButton2-Value", jPage).val();
			oPrefs.nButton3 = $("#QuickButton3-Value", jPage).val();

			oPrefs.sDescription = $("#DefaultDescription", jPage).val();

			Application.savePrefs();
			jPage.dialog('close');

		}
	},

	save: function (fnCallback) {
		ui.elap.on("Saving...");
		LedgerEntry.bEdited = LedgerEntry.bReqsMet = false;

		var jAmt = $("#txtAmount");
		var jDesc = $("#txtTransactDescript");
		if (this.nType == 1) {
			this.oLastUsed.deposit.amount = jAmt.val();
			this.oLastUsed.deposit.description = jDesc.val();
		}
		else {
			this.oLastUsed.withdrawal.amount = jAmt.val();
			this.oLastUsed.withdrawal.description = jDesc.val();
		}


		var cItemText = jDesc.val();
		var cAmount = Number(jAmt.val()) * this.nType;
		var cReusable = ($("#chkAddToAutoComplete").is(":checked")) ? "1" : "";

		var sTransID = typeof (LedgerEntry.oCurrent.ID) != "undefined" ? LedgerEntry.oCurrent.ID.prepSQL(true) : "null";
		var oParty = Participant.data;

		var SQL = "select * from ADM$PARTY_LEDGER_IUD(" +
			sTransID + "," +
			Application.oUser.USER_ID.prepSQL(true) + "," +
			oParty.CODE.prepSQL() + "," +
			cItemText.prepSQL() + "," +
			cAmount.prepSQL() + "," +
			cReusable.prepSQL(true) + ",null,null,null,null);" +
			"select * from adm$Participant(" +
				Application.oUser.CUSTOMER_ID.prepSQL() + "," +
				oParty.CODE.prepSQL() + ");";


		new execQuery(SQL, function (data) {

			Participant.data = data[1][0];
			Participant.refresh();
			Participants.refresh(Participant.data);

			Dashboard.bRefresh = true
			Dashboard.refresh(function () {
				ui.elap.off();
				ui.popupMessage(((LedgerEntry.nType == 1) ? "Deposit" : "Withdrawal") + " Saved");
				window.history.back();
			});
		});

	},
	backConfirm: function () {
		ui.showConfirm({
			sTitle: "Save?",
			sMessage:
				'Do you want to save ' +
				((LedgerEntry.bInserting) ? 'this new' : 'your edits to the') + ' ' +
				LedgerEntry.sType.toLowerCase() + ' before continuing?',
			sConfirmButtonText: "Yes",
			sCancelButtonText: "No",
			fnConfirmCallback: function () {
				LedgerEntry.save();
			},
			fnCancelCallback: function () {
				LedgerEntry.bEdited = LedgerEntry.bReqsMet = false;
				window.history.back();
			}
		});

	}

};

ui = {
	showMessage: function (options) { ui.message.open(options) },
	message: {
		initialized: false,
		init: function () {
			if (this.initialized) return;
			var jPage = $("#dlgMessage").popup()
			.bind({
				popupafterclose: function (event, ui) {
					$(this).addClass("noDisplay");
				},
				popupbeforeposition: function (event, ui) {
					$(this).removeClass("noDisplay");
				}
			});

			$("button#CloseMessage", jPage).button().on('click', function () {
				ui.message.close();
			});

			this.initialized = true;
		},
		defaultOptions: {
			sTitle: "Message",
			sMessage: "Note",
			sButtonText: "Okay",
			fnCallback: false
		},
		options: {},
		open: function (options) {
			if (!this.initialized) this.init();

			if (typeof options.fnCallback != "function") {
				ui.message.options.fnCallback = false;
			}
			else ui.message.options.fnCallback = options.fnCallback;

			var opts = this.options = $.extend({}, ui.message.defaultOptions, options);
			//console.log(this.options);

			var jPage = $("#dlgMessage");
			$("h1", jPage).text(opts.sTitle);
			$("#message", jPage).html(opts.sMessage);
			$("#CloseMessage", jPage).text(opts.sButtonText);

			jPage.popup("open", { history: false, positionTo: "window" });

			//$.mobile.changePage(jPage);
		},
		close: function () {
			if (this.options.fnCallback) {
				this.options.fnCallback();
			}
			$("#dlgMessage").popup("close");
		}
	},

	showConfirm: function (options) { ui.confirm.open(options) },
	confirm: {
		initialized: false,
		init: function () {
			if (this.initialized) return;

			var jPage = $("#dlgConfirm").popup()
			.bind({
				popupafterclose: function (event, ui) {
					$(this).addClass("noDisplay");
				},
				popupbeforeposition: function (event, ui) {
					$(this).removeClass("noDisplay");
				}
			});

			$("#dlgConfirm-Close", jPage).button();

			$("a#ConfirmButton", jPage).button().on('click', function () {
				ui.confirm.confirmed();
			});
			$("a#CancelButton", jPage).button().on('click', function () {
				ui.confirm.canceled();
			});

			this.initialized = true;
		},
		defaultOptions: {
			sTitle: "Confirm",
			sMessage: "Note",
			sConfirmButtonText: "Okay",
			sCancelButtonText: "Cancel",
			fnCancelCallback: false,
			fnConfirmCallback: false
		},
		options: {},
		open: function (options) {
			if (!this.initialized) this.init();

			if (typeof options.fnCancelCallback != "function") {
				ui.confirm.options.fnCancelCallback = false;
			}
			else ui.message.options.fnCancelCallback = options.fnCancelCallback;

			if (typeof options.fnConfirmCallback != "function") {
				ui.confirm.options.fnConfirmCallback = false;
			}
			else ui.message.options.fnConfirmCallback = options.fnConfirmCallback;


			var opts = this.options = $.extend({}, ui.confirm.defaultOptions, options);

			var jPage = $("#dlgConfirm");
			$("h1", jPage).text(opts.sTitle);
			$("#ConfirmMessage", jPage).empty().html(opts.sMessage);
			$("#ConfirmButton .ui-btn-text", jPage).text(opts.sConfirmButtonText);
			$("#CancelButton .ui-btn-text", jPage).text(opts.sCancelButtonText);

			jPage.popup("open", { history: false, positionTo: "window" });
		},
		confirmed: function () {
			$("#dlgConfirm").popup("close");
			if (this.options.fnConfirmCallback) {
				this.options.fnConfirmCallback();
			}
		},
		canceled: function () {
			$("#dlgConfirm").popup("close");
			if (this.options.fnCancelCallback) {
				this.options.fnCancelCallback();
			}
		}
	},

	popupMessage: function (sContents) {
		setTimeout(function () {
			var jPopup = $("div#popupMessage");
			$(".ui-content", jPopup).html(sContents);
			jPopup.popup({ container: $('html'), history: false, tolerance: "0" });
			jPopup.popup('open', { y: window.innerHeight - 100 });
			setTimeout(function () {
				jPopup.popup('close');
			}, 1500);
		}, 1);
	},

	elap: {
		on: function (sMessage) {
			var bNoText = true;
			if (!sMessage) {
				sMessage = "Loading...";
				bNoText = false;
			}
			$.mobile.loadingMessage = sMessage;
			$.mobile.loading('show');
			//$("#elapsor").show();
			//$.mobile.showPageLoadingMsg("a", sMessage);
		},
		off: function () {
			//$("#elapsor").hide(); 
			//$.mobile.hidePageLoadingMsg();
			$.mobile.loading('hide');
		}
	}
};




function execQuery(cQuery, callback) {
	var my = this;
	this.queryScript = "http://" + Application.domain + "tokentap.com/cgi-scripts/TR_XHR_query.pl";
	this.cursorDelimeter = "◄◄◄" + String.fromCharCode(13) + String.fromCharCode(13);
	this.rowDelimeter = "◄◄" + String.fromCharCode(13);
	this.fieldDelimeter = "◄" + String.fromCharCode(9);

	var cUserPass = ";;";
	if (Application.dataKeys) {
		cUserPass = Application.dataKeys.cUser + ";" + Application.dataKeys.cPassword + ";";
	}
	cQuery = cUserPass + String.fromCharCode(13) + cQuery;

	this.responseObject = function (cResponseString) {
		var tblSep = my.cursorDelimeter;
		var rowSep = my.rowDelimeter;
		var fieldSep = my.fieldDelimeter;

		if (cResponseString.indexOf(rowSep) == -1) return cResponseString;

		var responseArrayOfRowStrings = function () {
			var aRecStrings = cResponseString.split(rowSep);
			return aRecStrings;
		}
		var responseArrayOfRowArrays = function () {
			var array_of_row_strings = responseArrayOfRowStrings();
			var array_of_row_arrays = [];
			for (var i = 0; i < array_of_row_strings.length; i++) {
				array_of_row_arrays.push(array_of_row_strings[i].split(fieldSep));
			}
			return array_of_row_arrays;
		}
		var responseRows = function () {

			var array_of_row_hashes = [];
			/*
			array_of_row_hashes.castNumeric = function (cColName) {
				for (var nX = 0; nX < this.length; nX++) {
					this[nX][cColName] = Number(this[nX][cColName]);
				}
				return this
			}

			array_of_row_hashes.dataSort = function (cColName, nOrder) {
				this.sort(
function (a, b) {
	if (!nOrder) nOrder = 1;
	if (a[cColName] < b[cColName]) return -1 * nOrder;
	if (a[cColName] > b[cColName]) return 1 * nOrder;
	return 0;
});
				return this;
			}

			array_of_row_hashes.groupBy = function (cColName, aAggFuncs) {
				this.dataSort(cColName);

				var nX = 1;
				while (nX < this.length) {
					if (this[nX][cColName] == this[nX - 1][cColName]) {
						for (var nY = 0; nY < aAggFuncs.length; nY++) { aAggFuncs[nY](nX, this); }
						this.splice(nX, 1);
					}
					else {
						nX++;
					}
				}
				return this
			}

			array_of_row_hashes.numBinarySearch = function (nSearchVal, cSearchCol) {
				if (!this.length) return -1;

				var high = this.length - 1;
				var low = 0;

				while (low <= high) {
					mid = parseInt((low + high) / 2)
					element = this[mid];
					if (element[cSearchCol] > nSearchVal) {
						high = mid - 1;
					} else if (element[cSearchCol] < nSearchVal) {
						low = mid + 1;
					} else {
						return mid;
					}
				}

				return -1;
			};
			*/
			var array_of_row_arrays = responseArrayOfRowArrays();
			var fields = array_of_row_arrays.shift();
			while (array_of_row_arrays.length > 1) {
				var row_array = array_of_row_arrays.shift();
				if (!row_array[0].match(/(\d+ rows{0,1})/)) {
					var row_hash = {};
					for (var i = 0; i < fields.length; i++) row_hash[fields[i]] = row_array[i];
					array_of_row_hashes.push(row_hash);
				}
				else { if (array_of_row_arrays.length > 0) fields = array_of_row_arrays.shift(); }
			}
			return array_of_row_hashes;
		}

		var nTables = cResponseString.countOccurs(tblSep);
		if (nTables <= 1) {
			//erase the table seperator and return one table ( row of arrays )
			cResponseString = cResponseString.replace(tblSep, "");
			return responseRows();
		}

		var aTables = [];
		aTables = cResponseString.split(tblSep);
		aTables.length--;  //Remove Last Terminator
		for (var nX = 0; nX < nTables; nX++) {
			cResponseString = aTables[nX];
			aTables[nX] = responseRows();
		}
		return aTables;
	}

	this.callback = function () { };
	if (callback) this.callback = callback;

	return $.ajax({
		type: "POST",
		cache: false,
		url: my.queryScript,
		data: cQuery,
		dataType: "text",
		success: function (cResponse) {
			my.callback(my.responseObject(cResponse));
		},
		jsonp: true,
		//jsonp: false, jsonpCallback: "this.success",
		error: function (xhr, textStatus, errorThrown) {
			console.log("Error: " + errorThrown);
		}
	});
}
function Run_CGI(cScript, oQueryData, callback) {
	var my = this;
	this.script = cScript;
	var cMethod = "GET";
	if (cScript.match(/send|save/)) {
		cMethod = "POST";
	}

	this.query = {};
	if (oQueryData) this.query = oQueryData;
	
	this.callback = function(oData) { }
	if (callback) this.callback = callback;
	$.ajax({
		type: cMethod,
		url: cScript,
		data: my.query,
		dataType: "text",
		success: function (returnedData) {
			my.callback(returnedData);
		},
		error: function (xhr, textStatus, errorThrown) {
			my.callback(false);
			console.log("Error: " + errorThrown);
		}
	});
}


// From: http://docs.phonegap.com/en/1.1.0/phonegap_media_media.md.html#Media
function playAudio(src) {
	// Create Media object from src
	my_media = new Media(src, onSuccess, onError);

	// Play audio
	my_media.play();

	// Update my_media position every second
	if (mediaTimer == null) {
		mediaTimer = setInterval(function () {
			// get my_media position
			my_media.getCurrentPosition(
			// success callback
function (position) {
	if (position > -1) {
		setAudioPosition((position) + " sec");
	}
},
			// error callback
function (e) {
	console.log("Error getting pos=" + e);
	setAudioPosition("Error: " + e);
}
);
		}, 1000);
	}
}

function pauseAudio() {
if (my_media) {
my_media.pause();
}
}

function stopAudio() {
if (my_media) {
my_media.stop();
}
clearInterval(mediaTimer);
mediaTimer = null;
}

function onSuccess() {
console.log("playAudio():Audio Success");
}

// #region  Base Prototypes 
String.prototype.trim = function () {
	var rTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
	return (this.toString() || "").replace(rTrim, "");
}
String.prototype.validEmail = function () {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	return reg.test(this.toString().trim());
}
String.prototype.isValidEmail = function () {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	return reg.test(this.toString().trim());
}
String.prototype.countOccurs = function (cStringToCount) {
	//returns a case sensative count of how many occurances of cStringToCount are in 'this' string
	var aMatches = this.match(new RegExp(cStringToCount, "gm"));
	if (aMatches == null) { return 0; }
	return aMatches.length;
}
String.prototype.toPlural = function (nAmount) {
	var sX = this.toString();

	var nAmount = Number(nAmount);
	if (nAmount == 1) return sX;

	if (sX.match(/x|s$/)) return sX + "es";
	return sX + "s"
}
String.prototype.toNumber = function () {
	if (this.toString() == "-Infinity") return -Infinity;
	if (this.toString() == "Infinity") return Infinity;
	return (new Number(this.toString().replace(/[^0-9\.\-]/gim, ""))) + 0;
}
String.prototype.toEmptyFromZero = function () {
	if (this.toString() == "0") return "";
	return this.toString();
}

String.prototype.parseName = function (cNickOverride) {
	// Needs fix for multiple suffixes, comma seperated and not comma seperated
	var aTitles = ['dr', 'doctor', 'miss', 'mr', 'mister', 'mrs', 'ms',
		'lt', 'capt', 'cpt', 'maj', 'ltc', 'col', 'gen', 
		'sgt', 'cpl', 'pfc', 'pv', 'pv1', 'pv2', 'ssg', 'sfc', 'msg', '1sg', 'sgm',
		'judge', 'hon', 'honerable', 'principal', 'pastor', 'father', 'fr', 'brother', 'br', 'prof', 'professor'];
	var aPrefixes = ['bin', 'da', 'dal', 'de', 'del', 'der', 'de', 'e', 'la', 'le', 'san', 'st', 'ste', 'van', 'vel', 'von'];
	var aSuffixes = ['esq', 'esquire', 'jr', 'sr', '2', '2nd', '3', '3rd', 'ii', 'iii', 'iv',
		'phd', 'bs', 'mba', 'ma', 'msa', 'ba', 'llb', 'lld', 'edd', 'dba', 'md', 'dds', 'ca', 'cpa'];

	var aCommaNodes = [], aSpaceNodes = [];
	var nX = 0;
	var cCurrent, cNext;

	var oName = { title: "", first: "", middle: "", last: "", suffix: "", sort: "", nick: "", short: "", long: "", asEntered: this.toString() }



	function normInArray(cVal, aSearch) {
		return $.inArray(cVal.trim().toLowerCase().replace('.', ''), aSearch) > -1;
	}

	// Check for a nick name in parens, store and remove before splitting comma nodes e.g. (Bobby) or (jimi)
	var rParens = /\(.+\)/;
	oName.nick = rParens.exec(oName.asEntered);

	oName.nick = (oName.nick == null) ? '' : oName.nick[0].trim();
	var cNameToParse = oName.asEntered.replace(oName.nick, '');
	oName.nick = oName.nick.replace(/\(|\)/g, '');

	var aCommaNodes = (cNameToParse.replace(/\s+/g, ' ')).replace(oName.Nick, '').trim().split(',');
	switch (aCommaNodes.length) {
		case 1: // title first middles last suffix
			var aSpaceNodes = aCommaNodes[0].trim().split(' ');
			for (nX = 0; nX < aSpaceNodes.length; nX++) {
				cCurrent = aSpaceNodes[nX].trim();
				cNext = (nX < aSpaceNodes.length - 1) ? aSpaceNodes[nX + 1].trim() : '';

				if (nX == 0 && normInArray(cCurrent, aTitles)) {
					oName.title = cCurrent;
					continue;
				}

				if (!oName.first) {
					oName.first = cCurrent;
					continue;
				}

				if (nX == aSpaceNodes.length - 2 && cNext && normInArray(cNext, aSuffixes)) {
					oName.last += (oName.last) ? " " + cCurrent : cCurrent;
					oName.suffix = cNext;
					break;
				}

				if (nX == aSpaceNodes.length - 1) {
					oName.last += (oName.last) ? " " + cCurrent : cCurrent;
					continue;
				}

				if (normInArray(cCurrent, aPrefixes)) {
					oName.last += (oName.last) ? " " + cCurrent : cCurrent;
					continue;
				}

				if (cNext == 'y' || cNext == 'Y') {
					oName.last += (oName.last) ? " " + cCurrent : cCurrent;
					continue;
				}

				if (oName.last) {
					oName.last += " " + cCurrent;
					continue;
				}

				oName.middle += (oName.middle) ? " " + cCurrent : cCurrent;
			}
			break;
		case 2:
			switch (normInArray(aCommaNodes[1], aSuffixes)) {
				case true: // title first middles last, suffix
					var aSpaceNodes = aCommaNodes[0].trim().split(' ');
					for (nX = 0; nX < aSpaceNodes.length; nX++) {
						cCurrent = aSpaceNodes[nX].trim();
						cNext = (nX < aSpaceNodes.length - 1) ? aSpaceNodes[nX + 1].trim() : '';

						if (nX == 0 && normInArray(cCurrent, aTitles)) {
							oName.title = cCurrent;
							continue;
						}

						if (!oName.first) {
							oName.first = cCurrent;
							continue;
						}

						if (nX == aSpaceNodes.length - 1) {
							oName.last += (oName.last) ? " " + cCurrent : cCurrent;
							continue;
						}

						if (normInArray(cCurrent, aPrefixes)) {
							oName.last += (oName.last) ? " " + cCurrent : cCurrent;
							continue;
						}

						if (cNext == 'y' || cNext == 'Y') {
							oName.last += (oName.last) ? " " + cCurrent : cCurrent;
							continue;
						}

						if (oName.last) {
							oName.last += " " + cCurrent;
							continue;
						}

						oName.middle += (oName.middle) ? " " + cCurrent : cCurrent;
					}
					oName.suffix = aCommaNodes[1].trim();
					break;
				case false: // last, title first middles suffix
					aSpaceNodes = aCommaNodes[1].trim().split(' ');
					for (nX = 0; nX < aSpaceNodes.length; nX++) {
						cCurrent = aSpaceNodes[nX].trim();
						cNext = (nX < aSpaceNodes.length - 1) ? aSpaceNodes[nX + 1].trim() : '';

						if (nX == 0 && normInArray(cCurrent, aTitles)) {
							oName.title = cCurrent;
							continue;
						}

						if (!oName.first) {
							oName.first = cCurrent;
							continue;
						}

						if (nX == aSpaceNodes.length - 2 && cNext && normInArray(cNext, aSuffixes)) {
							oName.middle += (oName.middle) ? " " + cCurrent : cCurrent;
							oName.suffix = cNext;
							break;
						}

						if (nX == aSpaceNodes.length - 1 && normInArray(cCurrent, aSuffixes)) {
							oName.suffix = cCurrent;
							continue;
						}

						oName.middle += (oName.middle) ? " " + cCurrent : cCurrent;
					}
					oName.last = aCommaNodes[0];
					break;
			}
			aCommaNodes.join();
			break;
		case 3: // last, title first middles, suffix
			var aSpaceNodes = aCommaNodes[1].trim().split(' ');

			for (nX = 0; nX < aSpaceNodes.length; nX++) {
				cCurrent = aSpaceNodes[nX].trim();
				cNext = (nX < aSpaceNodes.length - 1) ? aSpaceNodes[nX + 1].trim() : '';

				if (nX == 0 && normInArray(cCurrent, aTitles)) {
					oName.title = cCurrent;
					continue;
				}

				if (!oName.first) {
					oName.first = cCurrent;
					continue;
				}

				oName.middle += (oName.middle) ? " " + cCurrent : cCurrent;
			}

			oName.last = aCommaNodes[0].trim();
			oName.suffix = aCommaNodes[2].trim();
			break;
		default: // unparseable
			oName.last = aCommaNodes.join();
			break;
	}

	var cNickForLongName = (cNickOverride && cNickOverride.length > 0) ? cNickOverride : (oName.nick) ? oName.nick : '';

	oName.long =
		(((oName.title) ? oName.title + " " : "") +
		((oName.first) ? oName.first + " " : "") +
		((cNickForLongName) ? "(" + cNickForLongName + ") " : "") +
		((oName.middle) ? oName.middle + " " : "") +
		((oName.last) ? oName.last + " " : "") +
		((oName.suffix) ? oName.suffix + " " : "")).trim();

	oName.formal =
		(((oName.title) ? oName.title + " " : "") +
		((oName.first) ? oName.first + " " : "") +
		((oName.middle) ? oName.middle + " " : "") +
		((oName.last) ? oName.last + " " : "") +
		((oName.suffix) ? oName.suffix + " " : "")).trim();

	oName.short =
		((oName.first) ? oName.first + " " : "") +
		((oName.last) ? oName.last + " " : "").trim();

	// if no last name and title, set first = title + first, last = first
	// eg Dr. Death, Principal Smith
	if (!oName.last && oName.title) {
		oName.last = oName.first;
		oName.first = oName.title + " " + oName.first;
		oName.short = oName.first;
		oName.long = oName.first;
	}

	// Fix the sort name
	var cSubSort = oName.title;
	cSubSort += (oName.first) ? ((cSubSort) ? " " : "") + oName.first : "";
	cSubSort += (oName.middle) ? ((cSubSort) ? " " : "") + oName.middle : "";
	cSubSort += (oName.suffix) ? ((cSubSort) ? ", " : "") + oName.suffix : "";
	cSubSort += (oName.nick) ? " (" + oName.nick + ")" : "";
	cSubSort = (cSubSort && (oName.last)) ? ", " + cSubSort : cSubSort;
	oName.sort = oName.last + cSubSort.trim();

	oName.nick = (!oName.nick) ? oName.first : oName.nick;
	oName.nick = (cNickOverride && cNickOverride.length > 0) ? cNickOverride : oName.nick;
	return oName;
}

String.prototype.toDate = function () { return new Date(this.toString()); }
String.prototype.toDaysLeft = function () {
	var cX = this.toString().replace('-', '');
	if (cX == "0") return "Today";
	if (cX == "1") return "Tomorrow";
	return "in " + cX + " days";
}
String.prototype.toDateFormat = function (cFormat) { return (new Date(this.toString())).format(cFormat); };

String.prototype.toProperCase = function () {
	if (arguments.length == 0) {
		// uppercase char of each word
		var aTokens = this.trim().split(" ");
		var cReturn = '';
		for (var nX = 0; nX < aTokens.length; nX++) {
			aTokens[nX] = aTokens[nX].slice(0, 1).toUpperCase() + aTokens[nX].slice(1, this.length).toLowerCase();
			cReturn += aTokens[nX] + " ";
		}
		return cReturn.trim();
	}

	// else an abitrary arg was passed, just uppercase first character and lowercase rest
	return this.slice(0,1).toUpperCase() + this.slice(1, this.length).toLowerCase();
}
String.prototype.encodeHTML = function () {
	return this
	.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;")
	.replace(/"/g, "&quot;")
	.replace(/  /g," &nbsp;")
	.replace(/\n/g, '<br />');
}
String.prototype.decodeHTML = function () {
	return this
	.replace(/&amp;/g, "&")
	.replace(/&lt;/g, "<")
	.replace(/&gt;/g, ">")
	.replace(/&quot;/g, '"')
	.replace(/&nbsp;/g, " ")
	.replace(/<br \/>|<br\/>/g, String.fromCharCode(10));
}
String.prototype.toSingleLineText = function () {
	// Requires jQuery.  Strips HTML and line breaks & multiple spaces.
	return $(("<div>" + this.toString() + "</div>").replace(/<br \/>|<br\/>/g, " ")).text().replace(/\s{2,}/g," ");
}
String.prototype.prepSQL = function (bNullEmptyString) {
	var cStringToQuote = this;
	if (cStringToQuote == null) return 'null';

	if (bNullEmptyString && cStringToQuote == '') return 'null';

	// convert to string if not already
	cStringToQuote = cStringToQuote.toString();

	// replace semicolons
	cStringToQuote = cStringToQuote.replace(/;/g, "<_semicolon_>");

	// escape single quotes
	cStringToQuote = cStringToQuote.replace(/'/g, "''");

	// convert line feeds to ascii equivelants
	//cStringToQuote = cStringToQuote.replace(/\n/g, "'||ASCII_CHAR(13)||ASCII_CHAR(10)||'");

	if (cStringToQuote.length < 10000) {
		cStringToQuote = cStringToQuote.replace(/\n/g, "'||ASCII_CHAR(10)||'");
	}
	return "'" + cStringToQuote + "'";
}
String.prototype.toCurrency = function (bHTML, bHideCents, bBlankZero) {
	return formatCurrency(this.toNumber(), bHTML, bHideCents, bBlankZero);
}

Number.prototype.prepSQL = function () {
	return this.toString().prepSQL();
}
Number.prototype.toOrdinal = function () {
	var i = this.toString();
	if (i.match(/\D/)) return i;
	if (i == 3 || i.match(/[^1]3$/)) return i + 'rd';
	if (i == 2 || i.match(/[^1]2$/)) return i + 'nd';
	if (i == 1 || i.match(/[^1]1$/)) return i + 'st';
	return i + 'th';
}
Number.prototype.toNumber = function () {
	return this.toString().toNumber();
}
Number.prototype.toEmptyFromZero = function () {
	if (this.toString() == "0") return "";
	return this.toString();
}
Number.prototype.toCurrency = function (bHTML, bHideCents, bBlankZero) {
	return formatCurrency(this, bHTML, bHideCents, bBlankZero);
}

Array.prototype.sortColumn = function (sColName, nOrder, bForceNumeric) {
	this.sort(
		function (a, b) {
			if (!nOrder) nOrder = 1;

			if (bForceNumeric) {
				if (a[sColName].toNumber() < b[sColName].toNumber()) return -1 * nOrder;
				if (a[sColName].toNumber() > b[sColName].toNumber()) return 1 * nOrder;
				return 0;
			}

			if (a[sColName] < b[sColName]) return -1 * nOrder;
			if (a[sColName] > b[sColName]) return 1 * nOrder;
			return 0;
		});
	return this;
}
Array.prototype.searchSortedColumn = function (nsSearchVal, sSearchCol) {
	// returns index of matching uSearchVal (type numeric and string only) in sSearchCol
	// MUST be sorted by sSearchCol 

	if (!this.length) return -1;

	var high = this.length - 1;
	var low = 0;

	while (low <= high) {
		mid = parseInt((low + high) / 2)
		element = this[mid];
		if (element[sSearchCol] > nsSearchVal) {
			high = mid - 1;
		} else if (element[sSearchCol] < nsSearchVal) {
			low = mid + 1;
		} else {
			return mid;
		}
	}

	return -1;
};

Date.prototype.isValidDate = function () { return isFinite(this); }
Date.prototype.toDateFormat = function (cFormat) { return dateFormat(cFormat) }
 // #endregion


function formatCurrency(num, bHTML, bHideCents, bBlankZero) {
	var sign = false, cents = 0, cReturn = "", nNumberValue;

	if (bBlankZero && (Number(num)==0 || num==undefined || isNaN(num) || num=='' || num==0)) return "";

	if ( num==undefined || isNaN(num) || num=='') {sign = true;  num = "0";cents = ".00", nNumberValue = 0;}
	else {
		num = num.toString().replace(/\$|\,/g,'');
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num*100+0.50000000001);
		cents = num%100;
		nNumberValue =  Math.floor(num/100);
		num = Math.floor(num/100).toString();
		if (bHideCents) cents = "";
		else {
		if (cents < 10) cents = "0" + cents;
		cents = "." + cents;
		}
	  
		for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
			num = num.substring(0,num.length-(4*i+3))+','+
		num.substring(num.length - (4 * i + 3));
	}
	if (!bHTML) cReturn = (((sign) ? '' : '-') + '$' + num + cents);
	else {
		if (nNumberValue >= 1) {
			cReturn = ((sign) ? '' : '-') +
				'<span style="font-size:80%; position:relative; top:-.2em;">$</span>' + 
				'<span style="">' + num + '</span>' +
				((!bHideCents) ? '<span style="font-size:70%; position:relative; top:-.35em">' + cents + '</span>' : '');
		}
		else {
			cReturn = ((sign) ? '' : '-') + '<span style="font-size:100%;">' + String(Math.floor((Number(cents)) * 100)) + '</span>' +
				'<span style="position:relative; top:-.2em">&cent;</span>';
		}
	}
	return cReturn
}

var dateFormat = function () {
	/*
	* Date Format 1.2.3
	* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	* MIT license
	*
	* Includes enhancements by Scott Trenda <scott.trenda.net>
	* and Kris Kowal <cixar.com/~kris.kowal/>
	*
	* Accepts a date, a mask, or a date and a mask.
	* Returns a formatted version of the given date.
	* The date defaults to the current date/time.
	* The mask defaults to dateFormat.masks.default.
	*/

	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;
		
		var masks = {
			"default": "ddd mmm dd yyyy HH:MM:ss",
			smallDate: "m/d",
			smallDateTime: "m/d, h:MM tt",
			shortDate: "m/d/yy",
			jsDate: "mm/dd/yyyy",
			interbaseDate: "mm-dd-yy",
			Firebird: "mm-dd-yy",
			mediumDate: "mmm d, yyyy",
			longDate: "mmmm d, yyyy",
			longDateTime: "mmmm d, yyyy h:MM tt",
			fullDate: "dddd, mmmm d, yyyy",
			shortTime: "h:MM tt",
			mediumTime: "h:MM:ss TT",
			longTime: "h:MM:ss TT Z",
			shortDateTime: "m/d/yy h:MM tt",
			shortDateTimeSecs: "m/d/yy h:MM:ss tt",
			isoDate: "yyyy-mm-dd",
			isoTime: "HH:MM:ss",
			isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
			isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
		};

		// Internationalization strings
		var i18n = {
			dayNames: [
				"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
				"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			]
		};


		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) return ""; //throw SyntaxError("invalid date");

		var mask = String(masks[mask] || mask || masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d: d,
				dd: pad(d),
				ddd: i18n.dayNames[D],
				dddd: i18n.dayNames[D + 7],
				m: m + 1,
				mm: pad(m + 1),
				mmm: i18n.monthNames[m],
				mmmm: i18n.monthNames[m + 12],
				yy: String(y).slice(2),
				yyyy: y,
				h: H % 12 || 12,
				hh: pad(H % 12 || 12),
				H: H,
				HH: pad(H),
				M: M,
				MM: pad(M),
				s: s,
				ss: pad(s),
				l: pad(L, 3),
				L: pad(L > 99 ? Math.round(L / 10) : L),
				t: H < 12 ? "a" : "p",
				tt: H < 12 ? "am" : "pm",
				T: H < 12 ? "A" : "P",
				TT: H < 12 ? "AM" : "PM",
				Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
} ();
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

jQuery.fn.constrainNumeric = function (options, callback) {
	/*
	* Allows only valid characters to be entered into input boxes.
	* Note: does not validate that the final text is a valid number
	* (that could be done by another script, or server-side)
	*
	* @name     numeric
	* @param    decimal      Decimal separator (e.g. '.' or ',' - default is '.')
	* @param    callback     A function that runs if the number is not valid (fires onblur)
	* @author   Sam Collett (http://www.texotela.co.uk)
	* @example  $(".numeric").numeric();
	* @example  $(".numeric").numeric(",");
	* @example  $(".numeric").numeric(null, callback);
	*
	*/
	var defaults = {
		decimal: ".",
		absolute: false,
		integer: false,
		minValue: false,
		maxValue: false
	};
	var o = $.extend(defaults, options);
	var decimal = o.decimal;
	callback = typeof callback == "function" ? callback : function () { };

	this.keypress(
		function (e) {
			var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
			// allow enter/return key (only when in an input box)
			if (key == 13 && this.nodeName.toLowerCase() == "input") {
				return true;
			}
			else if (key == 13) {
				return false;
			}
			var allow = false;
			// allow ctrl+a
			if ((e.ctrlKey && key == 97 /* firefox */) || (e.ctrlKey && key == 65) /* opera */) return true;
			// allow ctrl+x (cut)
			if ((e.ctrlKey && key == 120 /* firefox */) || (e.ctrlKey && key == 88) /* opera */) return true;
			// allow ctrl+c (copy)
			if ((e.ctrlKey && key == 99 /* firefox */) || (e.ctrlKey && key == 67) /* opera */) return true;
			// allow ctrl+z (undo)
			if ((e.ctrlKey && key == 122 /* firefox */) || (e.ctrlKey && key == 90) /* opera */) return true;
			// allow or deny ctrl+v (paste), shift+ins
			if ((e.ctrlKey && key == 118 /* firefox */) || (e.ctrlKey && key == 86) /* opera */
			|| (e.shiftkey && key == 45)) return true;

			// if a number was not pressed
			if (key < 48 || key > 57) {
				if (!o.absolute) {
					/* '-' only allowed at start */
					if (key == 45 && this.value.length == 0) return true;
				}

				if (o.integer && key == 46) return false;

				if (!o.integer) {
					/* only one decimal separator allowed */
					if (key == decimal.charCodeAt(0) && this.value.indexOf(decimal) != -1) {
						allow = false;
					}
				}

				// check for other keys that have special purposes
				if (
					key != 8 /* backspace */ &&
					key != 9 /* tab */ &&
					key != 13 /* enter */ &&
					key != 35 /* end */ &&
					key != 36 /* home */ &&
					key != 37 /* left */ &&
					key != 39 /* right */ &&
					key != 46 /* del */
				) {
					allow = false;
				}
				else {
					// for detecting special keys (listed above)
					// ie does not support 'charCode' and ignores them in keypress anyway
					if (typeof e.charCode != "undefined") {
						// special keys have 'keyCode' and 'which' the same (e.g. backspace)
						if (e.keyCode == e.which && e.which != 0) {
							allow = true;
						}
						// or keyCode != 0 and 'charCode'/'which' = 0
						else if (e.keyCode != 0 && e.charCode == 0 && e.which == 0) {
							allow = true;
						}
					}
				}
				// if key pressed is the decimal and it is not already in the field
				if (key == decimal.charCodeAt(0) && this.value.indexOf(decimal) == -1) {
					allow = true;
				}
			}
			else {
				allow = true;
			}
			return allow;
		}
	)
	.blur(
		function () {
			var val = jQuery(this).val();
			if (o.minValue && Number(val) < o.minValue) $(this).val(o.minValue);
			if (o.maxValue && Number(val) > o.maxValue) $(this).val(o.maxValue);
			else if (val != "") {
				var re = new RegExp("^\\d+$|\\d*" + decimal + "\\d+");
				if (!re.exec(val)) {
					callback.apply(this);
				}
			}
		}
	);
	return this;
}


// jQuery Mobile Initializations
$(document).bind("mobileinit", function () {

	$.extend($.mobile.zoom, { locked: true, enabled: false });
	$.mobile.pushStateEnabled = false;
	$.mobile.ajaxEnabled = false;
	$.mobile.hashListeningEnabled = true;
	$.mobile.ignoreContentEnabled = true;
	$.mobile.defaultPageTransition = 'slide';
	$.mobile.defaultDialogTransition = 'pop';
	$.mobile.transitionFallbacks.slide = 'none';
	$.mobile.transitionFallbacks.flip = 'none';
	$.mobile.transitionFallbacks.pop = 'none';
	$.mobile.orientationChangeEnabled = false;

	$.mobile.loadingMessageTextVisible = true;
	$.mobile.loadingMessageTheme = "a"


	$.event.special.tap.tapholdThreshold = 1000;
	$.event.special.swipe.durationThreshold = 500;
	$.event.special.swipe.horizontalDistanceThreshold = 250;

	// Navigation
	$.mobile.page.prototype.options.backBtnText = "Back";
	$.mobile.page.prototype.options.addBackBtn = false;
	$.mobile.page.prototype.options.backBtnTheme = "b";

	// Page
	$.mobile.page.prototype.options.theme = "d";
	$.mobile.page.prototype.options.headerTheme = "b";
	$.mobile.page.prototype.options.contentTheme = "d";
	$.mobile.page.prototype.options.footerTheme = "b";

	// Controls
	$.mobile.button.prototype.options.theme = "b";
	$.mobile.selectmenu.prototype.options.theme = "b";

	// List views
	$.mobile.listview.prototype.options.headerTheme = "a";  // Header for nested lists
	$.mobile.listview.prototype.options.theme = "d";  // List items / content
	$.mobile.listview.prototype.options.dividerTheme = "d";  // List divider

	$.mobile.listview.prototype.options.splitTheme = "c";
	$.mobile.listview.prototype.options.countTheme = "c";
	$.mobile.listview.prototype.options.filterTheme = "c";
	// $.mobile.listview.prototype.options.filterPlaceholder = "Filter data...";
	
	$(document).ready(function () { Application.ready(); });

});


// JSON Plug-in
(function ($) {
 $.toJSON=function(o)
{if(typeof(JSON)=='object'&&JSON.stringify)
return JSON.stringify(o);var type=typeof(o);if(o===null)
return"null";if(type=="undefined")
return undefined;if(type=="number"||type=="boolean")
return o+"";if(type=="string")
return $.quoteString(o);if(type=='object')
{if(typeof o.toJSON=="function")
return $.toJSON(o.toJSON());if(o.constructor===Date)
{var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
if(o.constructor===Array)
{var ret=[];for(var i=0;i<o.length;i++)
ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]";}
var pairs=[];for(var k in o){var name;var type=typeof k;if(type=="number")
name='"'+k+'"';else if(type=="string")
name=$.quoteString(k);else
continue;if(typeof o[k]=="function")
continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val);}
return"{"+pairs.join(", ")+"}";}};$.evalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);return eval("("+src+")");};$.secureEvalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
return eval("("+src+")");else
throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string)
{if(string.match(_escapeable))
{return'"'+string.replace(_escapeable,function(a)
{var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};})(jQuery);


if (typeof PhoneGap != "undefined") {
document.addEventListener("deviceready", function () {
// PhoneGap API is ready
}, false);
}
else PhoneGap = false;

function LogEntry(cDetail, bDisableASync, fnCallBack) {
	var SQL = "select * from COM$Web_Log_Entry(" +
					Application.oUser.CUSTOMER_ID.prepSQL(true) + ", " +
					Application.oUser.CODE.prepSQL(true) + ", " +
					Application.oUser.USER_NAME.prepSQL(true) + ", " +
					window.location.href.prepSQL() + ", " +
					cDetail.prepSQL() + ", '<_USER_IP_ADDRESS_>');";

	var cUserPass = ";;";
	if (Application.dataKeys) {
		cUserPass = Application.dataKeys.cUser + ";" + Application.dataKeys.cPassword + ";";
	}
	SQL = cUserPass + String.fromCharCode(13) + SQL;

	$.ajax({
		type: "POST",
		cache: false,
		async: !bDisableASync,
		url: "http://" + Application.domain + "tokentap.com/cgi-scripts/TR_XHR_query.pl",
		data: SQL,
		dataType: "text",
		success: function (sResponse) {
			if (sResponse && sResponse.match(": '',: '',\r")) {
				Application.sUserIP = sResponse.split(": '',: '',\r")[1].trim();
			}
			if (fnCallBack) fnCallBack();
		}
	});
}

var Email = {
	sTemplateFile: "/mobile_email_templates.html",
	sendParams: function () {
		this.to_name = '';
		this.to_address = '';

		this.from_name = 'Token Rewards';
		this.from_address = 'Mail@TokenRewards.com';
		this.subject = '';
		this.contents = '';
		this.email_code = '';
	},
	masterTemplate: '',
	contentTemplates: {},
	send: function (oEmail) {
		var email = new Email.sendObject();
		email.data.to_contact_id = (oEmail.to_contact_id) ? oEmail.to_contact_id : '';
		email.data.to_name = oEmail.to_name;
		email.data.to_address = oEmail.to_address;
		email.data.bcc_address = oEmail.bcc_address;

		email.data.from_name = (oEmail.from_name) ? oEmail.from_name : email.data.from_name;
		email.data.from_address = (oEmail.from_address) ? oEmail.from_address : email.data.from_address;

		email.data.subject = oEmail.subject;
		email.data.contents = oEmail.contents;

		email.data.template = (oEmail.template) ? oEmail.template : email.data.template;

		email.send(oEmail.callback);
	},
	sendObject: function () {
		var thisSendObject = this;
		this.sendParams = new Email.sendParams();
		this.data = {
			to_contact_id: '',
			to_name: '',
			to_address: '',
			from_name: thisSendObject.sendParams.from_name,
			from_address: thisSendObject.sendParams.from_address,
			subject: '',
			contents: '',
			template: ''
		};
		this.send = function (callback) {
			var sendMail = function (emailData) {
				var email = thisSendObject.sendParams;

				email.email_code = emailData.CODE;
				email.to_contact_id = thisSendObject.data.to_contact_id;
				email.to_name = thisSendObject.data.to_name;
				email.to_address = thisSendObject.data.to_address;
				email.from_name = thisSendObject.data.from_name;
				email.from_address = thisSendObject.data.from_address;
				email.subject = thisSendObject.data.subject;


				//Use contents returned from Firebird (in case email_code is in message_body)
				email.contents = Email.masterTemplate
					.replace(/__message_body__/, emailData.CONTENTS)
					.replace(/__email_code__/g, email.email_code)
					.replace(/__email_code_short__/g, email.email_code.slice(0, 4).toUpperCase())
					.replace(/__year__/g, (new Date()).getFullYear());

				new Run_CGI(
				"http://" + Application.domain + "tokenrewards.com/Common/cgi-scripts/mail_sender.pl", email, 
				function (cData) {
					var bSuccess = (/Success/gim).test(cData);
					if (bSuccess) { LogEntry("Email successfully delivered to " + email.to_address + " - " + email.subject); }
					else LogEntry("Email UNSUCCESSFULLY delivered to " + email.to_address + " - " + email.subject);

					if (callback) callback(bSuccess, email);
				});
			};

			var jContents = $(thisSendObject.data.contents);
			var jSubject = jContents.filter('pre');
			if (jSubject.length) {
				thisSendObject.data.subject = jSubject.eq(0).text().trim();
				thisSendObject.data.contents =
					thisSendObject.data.contents.replace(/\<pre[\s\S]+<\/pre\>/i, '');
			}


			var sFrom = '"' + thisSendObject.data.from_name + '" <' + thisSendObject.data.from_address + '>';
			var cSQL = "select * from com$email_insert(" +
					thisSendObject.data.to_contact_id.prepSQL(true) + "," +
					thisSendObject.data.to_name.prepSQL() + "," +
					thisSendObject.data.to_address.prepSQL() + "," +
					sFrom.prepSQL() + "," +
					thisSendObject.data.subject.prepSQL() + "," +
					thisSendObject.data.contents.prepSQL() + "," +
					thisSendObject.data.template.prepSQL() +
				");"
			var query = new execQuery(cSQL, function (data) { sendMail(data[0]); });
		}
	},
	init: function () {
		$.get(this.sTemplateFile, function (data) {
			
			var sTemplates = data.replace(/__current_domain__/gim, Application.domain);
			var jMails = $(data);
			Email.contentTemplates.admin_lost_password = jMails.filter("#admin_lost_password").html();
			Email.contentTemplates.admin_confirm_email = jMails.filter("#admin_confirm_email").html();
			Email.contentTemplates.admin_password_changed = jMails.filter("#admin_password_changed").html();

			
			Email.masterTemplate = sTemplates.replace(/TEMPLATES_BEGIN[\s\S]+TEMPLATES_END/gm, "");
		});
	}
};


/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-teststyles-prefixes
 */
window.Modernizr = function (a, b, c) { function v(a) { i.cssText = a } function w(a, b) { return v(l.join(a + ";") + (b || "")) } function x(a, b) { return typeof a === b } function y(a, b) { return !! ~("" + a).indexOf(b) } function z(a, b, d) { for (var e in a) { var f = b[a[e]]; if (f !== c) return d === !1 ? a[e] : x(f, "function") ? f.bind(d || b) : f } return !1 } var d = "2.6.2", e = {}, f = b.documentElement, g = "modernizr", h = b.createElement(g), i = h.style, j, k = {}.toString, l = " -webkit- -moz- -o- -ms- ".split(" "), m = {}, n = {}, o = {}, p = [], q = p.slice, r, s = function (a, c, d, e) { var h, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body"); if (parseInt(d, 10)) while (d--) j = b.createElement("div"), j.id = e ? e[d] : g + (d + 1), l.appendChild(j); return h = ["&#173;", '<style id="s', g, '">', a, "</style>"].join(""), l.id = g, (m ? l : n).innerHTML += h, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = f.style.overflow, f.style.overflow = "hidden", f.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), f.style.overflow = k), !!i }, t = {}.hasOwnProperty, u; !x(t, "undefined") && !x(t.call, "undefined") ? u = function (a, b) { return t.call(a, b) } : u = function (a, b) { return b in a && x(a.constructor.prototype[b], "undefined") }, Function.prototype.bind || (Function.prototype.bind = function (b) { var c = this; if (typeof c != "function") throw new TypeError; var d = q.call(arguments, 1), e = function () { if (this instanceof e) { var a = function () { }; a.prototype = c.prototype; var f = new a, g = c.apply(f, d.concat(q.call(arguments))); return Object(g) === g ? g : f } return c.apply(b, d.concat(q.call(arguments))) }; return e }), m.touch = function () { var c; return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : s(["@media (", l.join("touch-enabled),("), g, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function (a) { c = a.offsetTop === 9 }), c }; for (var A in m) u(m, A) && (r = A.toLowerCase(), e[r] = m[A](), p.push((e[r] ? "" : "no-") + r)); return e.addTest = function (a, b) { if (typeof a == "object") for (var d in a) u(a, d) && e.addTest(d, a[d]); else { a = a.toLowerCase(); if (e[a] !== c) return e; b = typeof b == "function" ? b() : b, typeof enableClasses != "undefined" && enableClasses && (f.className += " " + (b ? "" : "no-") + a), e[a] = b } return e }, v(""), h = j = null, e._version = d, e._prefixes = l, e.testStyles = s, e } (this, this.document);


// Prevent double-tap zoom 
// from: http://stackoverflow.com/questions/3103842/safari-ipad-prevent-zoom-on-double-tap
(function($) {
    $.fn.nodoubletapzoom = function() {
        //if($("html.touch").length == 0) return;

        $(this).bind('touchstart', function preventZoom(e){
            var t2 = e.timeStamp;
            var t1 = $(this).data('lastTouch') || t2;
            var dt = t2 - t1;
            var fingers = e.originalEvent.touches.length;
            $(this).data('lastTouch', t2);
            if (!dt || dt > 500 || fingers > 1){
                return; // not double-tap
            }
            e.preventDefault(); // double tap - prevent the zoom
            // also synthesize click events we just swallowed up
            $(this).trigger('tap');
        });
    };
         })(jQuery);


/* onpress event


/* Author:
    Max Degterev @suprMax
    Valerio Di Donato @drowne
    
    JQM fast buttons without nasty ghostclicks.
    Highly inspired by http://code.google.com/mobile/articles/fast_buttons.html
    
    Usage
    
    live:
    $('#someid').onpress(function(event){});
    $('#someid').offpress(function(event){});
    
    TODO: find a way to remove handleTouchStart handler as well
var isTouch = {};

(function($) {
    isTouch = (window.hasOwnProperty('ontouchstart'));

    var ghostsLifeTime = 1000;
    
    var normalizeArgs = function(args) {
        var callback,
            selector;
            
        if (typeof args[0] === 'function') {
            callback = args[0];
        }
        else {
            selector = args[0];
            callback = args[1];
        }
        return [selector, callback];
    };

    if (isTouch) {
        var ghosts = [];

        var touches = {},
            $doc = $(document),
            hasMoved = false,
            handlers = {};
            
        var handleTouchStart = function(e) {
            e.stopPropagation();
            touches.x = e.originalEvent.touches[0].pageX;
            touches.y = e.originalEvent.touches[0].pageY;
            hasMoved = false;
        };

        var handleTouchMove = function(e) {
            if (Math.abs(e.originalEvent.touches[0].pageX - touches.x) > 10 || Math.abs(e.originalEvent.touches[0].pageX - touches.y) > 10) {
                hasMoved = true;
            }
        };

        var removeGhosts = function() {
            ghosts.splice(0, 2);
        };

        var handleGhosts = function(e) {
            var i, l;
            for (i = 0, l = ghosts.length; i < l; i += 2) {
                if (Math.abs(e.pageX - ghosts[i]) < 25 && Math.abs(e.pageY - ghosts[i + 1]) < 25) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        };

        $doc.live('click', handleGhosts);
        $doc.live('touchmove', handleTouchMove);

        $.fn.onpress = function() {
            var args = normalizeArgs(arguments);
            $(this).addClass("touchStart");
            var handleTouchEnd = function(e) {
                e.stopPropagation();

                if (!hasMoved) {
                    args[1].call(this, e);
                    ghosts.push(touches.x, touches.y);
                    window.setTimeout(removeGhosts, ghostsLifeTime);
                }
            };
            
            handlers[args[1]] = handleTouchEnd;

            if (args[0]) {
                this.live('touchstart.onpress', args[0], handleTouchStart);
                this.live('touchend.onpress', args[0], handleTouchEnd);
                this.live('press', args[0], args[1]);
            }
            else {
                this.live('touchstart.onpress', handleTouchStart);
                this.live('touchend.onpress', handleTouchEnd);
                this.live('press', args[1]);
            }
        };
        
        $.fn.offpress = function() {
            var args = normalizeArgs(arguments);
            if (args[1]) {
                if (args[0]) {
                    this.die('.onpress', args[0], handlers[args[1]]);
                    this.die('press', args[0], args[1]);
                }
                else {
                    this.die('.onpress', handlers[args[1]]);
                    this.die('press', args[1]);
                }
                delete handlers[args[1]];
            }
            else {
                if (args[0]) {
                    this.die('.onpress', args[0]);
                    this.die('press', args[0]);
                }
                else {
                    this.die('.onpress');
                    this.die('press');
                }
            }
        };
    }
    else {
        $.fn.onpress = function() {
			
            var args = normalizeArgs(arguments);
            if (args[0]) {
                this.live('click.onpress', args[0], args[1]);
                this.live('press.onpress', args[0], args[1]);
            }
            else {
                this.live('click.onpress', args[1]);
                this.live('press.onpress', args[1]);
            }
            
        };
        $.fn.offpress = function() {
            var args = normalizeArgs(arguments);
            args[0] ? this.die('.onpress', args[0], args[1]) : this.die('.onpress', args[1]);
        };
    }
})(jQuery);

*/



