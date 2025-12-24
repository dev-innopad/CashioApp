import { Icons } from "../assets/icons";
import { Platform } from 'react-native';

export const SettingList = [
	{
		id: 0,
		icon: Icons.icnTheme,
		title: 'settingScreen.appearance.title', // Translation key
		desc: 'settingScreen.appearance.desc', // Translation key
	},
	// Only add this item if the platform is iOS
	...(Platform.OS === 'ios'
		? [
			{
				id: 1,
				icon: Icons.icnAppIcon,
				title: 'settingScreen.changeIcon.title', // Translation key
				desc: 'settingScreen.changeIcon.desc', // Translation key
			},
		]
		: []),
	{
		id: 2,
		icon: Icons.icnTranslate,
		title: 'settingScreen.language.title', // Translation key
		desc: 'settingScreen.language.desc', // Translation key
	},
	{
		id: 3,
		icon: Icons.icnNotifications,
		title: 'settingScreen.notifications.title', // Translation key
		desc: 'settingScreen.notifications.desc', // Translation key
	},
	{
		id: 4,
		icon: Icons.icnTerms,
		title: 'settingScreen.terms.title', // Translation key
		desc: 'settingScreen.terms.desc', // Translation key
	},
	{
		id: 5,
		icon: Icons.icnSendfeedback,
		title: 'settingScreen.feedback.title', // Translation key
		desc: 'settingScreen.feedback.desc', // Translation key
	},
	{
		id: 6,
		icon: Icons.icnInfo,
		title: 'settingScreen.about.title', // Translation key
		desc: 'settingScreen.about.desc', // Translation key
	},
	{
		id: 7,
		icon: Icons.icnLogout,
		title: 'settingScreen.logout.title', // Translation key
		desc: 'settingScreen.logout.desc', // Translation key
	},
];