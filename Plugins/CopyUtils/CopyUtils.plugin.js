//META{"name":"CopyUtils","website":"https://github.com/polop2301/BD-Plugins/tree/master/Plugins/CopyUtils","source":"https://raw.githubusercontent.com/polop2301/BD-Plugins/master/Plugins/CopyUtils/CopyUtils.plugin.js"}*//

class CopyUtils {
	getName () {return "CopyUtils";}

	getVersion () {return "0.0.2";}

	getAuthor () {return "Montarex23";}

	getDescription () {return "Allows you to copy channel link, name and topic.";}
	
	getRawUrl () {return "https://raw.githubusercontent.com/polop2301/BD-Plugins/master/Plugins/CopyUtils/CopyUtils.plugin.js";}

	constructor () {
		this.changelog = {
			"improved":[["Nothing","Just a test"]]
		};

		this.labels = {};
	}

	initConstructor () {
		this.defaults = {
			settings: {
				"spacesInsteadOfDashes":	{value:true,	inner:false,	description:"Spaces instead of dashes."}
			}
		};
	}

	getSettingsPanel () {
		if (!global.BDFDB || typeof BDFDB != "object" || !BDFDB.loaded || !this.started) return;
		var settings = BDFDB.getAllData(this, "settings");
		var settingsitems = [], inneritems = [];
		
		for (let key in settings) (!this.defaults.settings[key].inner ? settingsitems : inneritems).push(BDFDB.React.createElement(BDFDB.LibraryComponents.SettingsSwitch, {
			className: BDFDB.disCN.marginbottom8,
			plugin: this,
			keys: ["settings", key],
			label: this.defaults.settings[key].description,
			value: settings[key]
		}));
	
		return BDFDB.createSettingsPanel(this, settingsitems);
	}

	load () {}

	start () {
		if (!global.BDFDB) global.BDFDB = {myPlugins:{}};
		if (global.BDFDB && global.BDFDB.myPlugins && typeof global.BDFDB.myPlugins == "object") global.BDFDB.myPlugins[this.getName()] = this;
		var libraryScript = document.querySelector('head script#BDFDBLibraryScript');
		if (!libraryScript || (performance.now() - libraryScript.getAttribute("date")) > 600000) {
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("id", "BDFDBLibraryScript");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.min.js");
			libraryScript.setAttribute("date", performance.now());
			libraryScript.addEventListener("load", () => {this.initialize();});
			document.head.appendChild(libraryScript);
		}
		else if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();
		this.startTimeout = setTimeout(() => {this.initialize();}, 30000);
	}

	initialize () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			if (this.started) return;
			BDFDB.loadMessage(this);
		}
		else {
			console.error(`%c[${this.getName()}]%c`, 'color: #3a71c1; font-weight: 700;', '', 'Fatal Error: Could not load BD functions!');
		}
	}

	stop () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			BDFDB.unloadMessage(this);
		}
	}

	onChannelContextMenu (instance, menu, returnvalue) {
		if (instance.props && instance.props.channel && !BDFDB.getParentEle(".container-hidden", instance.props.target) && !menu.querySelector(`${this.name}-contextMenuSubItem`)) {
			let [children, index] = BDFDB.getContextMenuGroupAndIndex(returnvalue, ["FluxContainer(MessageDeveloperModeGroup)", "DeveloperModeGroup"]);
			const itemgroup = BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuItemGroup, {
				className: `BDFDB-contextMenuItemGroup ${this.name}-contextMenuItemGroup`,
				children: [
					BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuSubItem, {
						label: this.labels.context_localchannelsettings_text,
						className: `BDFDB-contextMenuSubItem ${this.name}-contextMenuSubItem ${this.name}-channelsettings-contextMenuSubItem`,
						render: [BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuItemGroup, {
							className: `BDFDB-contextMenuItemGroup ${this.name}-contextMenuItemGroup`,
							children: [
								BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuItem, {
									label: this.labels.submenu_copylink_text,
									className: `BDFDB-ContextMenuItem ${this.name}-ContextMenuItem ${this.name}-channelsettings-ContextMenuItem`,
									action: e => {
										BDFDB.closeContextMenu(menu);
										let channelidtocopy = instance.props.channel.id;
										let guildidtocopy = instance.props.channel.guild_id;
										console.log('topic:');
										console.log(instance.props.channel.topic);
										BDFDB.LibraryRequires.electron.clipboard.write({text:`https://discordapp.com/channels/${guildidtocopy}/${channelidtocopy}`});
										BDFDB.showToast(this.labels.copy_link_success, {type:"success"});
									}
								}),
								BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuItem, {
									label: this.labels.submenu_copyname_text,
									className: `BDFDB-ContextMenuItem ${this.name}-ContextMenuItem ${this.name}-resetsettings-ContextMenuItem`,
									action: e => {
										BDFDB.closeContextMenu(menu);
										let channelnametocopy = instance.props.channel.name;
										if (BDFDB.getData("spacesInsteadOfDashes", this, "settings") == true) {
											channelnametocopy = channelnametocopy.replace(/-/g, " ");
										}
										BDFDB.LibraryRequires.electron.clipboard.write({text:channelnametocopy});
										BDFDB.showToast(this.labels.copy_name_success, {type:"success"});
									}
								}),
								BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuItem, {
									label: this.labels.submenu_copytopic_text,
									className: `BDFDB-ContextMenuItem ${this.name}-ContextMenuItem ${this.name}-resetsettings-ContextMenuItem`,
									action: e => {
										BDFDB.closeContextMenu(menu);
										let channeltopictocopy = instance.props.channel.topic;
										if (channeltopictocopy == "") {
											BDFDB.showToast(this.labels.copy_topic_empty, {type:"error"});
											return
										}
										BDFDB.LibraryRequires.electron.clipboard.write({text:channeltopictocopy});
										BDFDB.showToast(this.labels.copy_topic_success, {type:"success"});
									}
								})
							]
						})]
					})
				]
			});
			if (index > -1) children.splice(index, 0, itemgroup);
			else children.push(itemgroup);
		}
	}

	setLabelsByLanguage () {
		switch (BDFDB.getDiscordLanguage().id) {
			case "pl":
				return {
					context_localchannelsettings_text:		"Kopiuj",
					submenu_copylink_text:					"Link",
					submenu_copyname_text:					"Nazwę",
					submenu_copytopic_text:					"Temat",
					copy_link_success:						"Link pomyślnie skopiowany",
					copy_name_success:						"Nazwa pomyślnie skopiowana",
					copy_topic_success:						"Temat pomyślnie skopiowany",
					copy_topic_empty:						"Temat kanału jest pusty"
				};
			default:
				return {
					context_localchannelsettings_text:		"Copy",
					submenu_copylink_text:					"Link",
					submenu_copyname_text:					"Name",
					submenu_copytopic_text:					"Topic",
					copy_link_success:						"Link copied successfully",
					copy_name_success:						"Name copied successfully",
					copy_topic_success:						"Topic copied successfully",
					copy_topic_empty:						"Channel topic is empty"
				};
		}
	}
}
