import { Dimensions, ViewStyle } from "react-native";
import DeviceInfo from "react-native-device-info";
import { AppHeight } from "./responsive";

// Window dimensions
const {
	width: WindowWidth,
	height: WindowHeight
} = Dimensions.get("window");

// App and device info
const AppName = DeviceInfo.getApplicationName();
const AppBaseVersion = DeviceInfo.getVersion();
const AppBuildVersion = DeviceInfo.getBuildNumber();
const PlatformName = DeviceInfo.getSystemName();
const SystemVersion = DeviceInfo.getSystemVersion();

const AppSettingVersion = `${PlatformName}${SystemVersion}-build-v${AppBaseVersion}.${AppBuildVersion}`;

// Reusable styles
const AppShadow = {
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.25,
	shadowRadius: 3.84,
	elevation: 5,
};

const borderRadius10 = { borderRadius: 10 };

const allCenter: (ViewStyle) = {
	justifyContent: "center",
	alignItems: "center",
};

const createIconSize = (size: number) => ({
	height: AppHeight[`_${size}`],
	width: AppHeight[`_${size}`],
});

const icon15 = createIconSize(15);
const icon20 = createIconSize(20);
const icon24 = createIconSize(24);
const icon35 = createIconSize(35);

// Exports
export {
	AppName,
	AppSettingVersion,
	AppShadow,
	borderRadius10,
	allCenter,
	PlatformName,
	WindowWidth,
	WindowHeight,
	icon15,
	icon20,
	icon24,
	icon35,
};
