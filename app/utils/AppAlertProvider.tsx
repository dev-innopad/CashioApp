import React, { createContext, ReactNode, useContext, useState } from 'react';

// Types for Modal Props and Button
interface Button {
	text: string;
	onPress: () => void;
	type?: string;
}

interface ModalProps {
	title: string;
	message: string;
	buttons: Button[];
}

// Context type
interface ModalContextType {
	isVisible: boolean;
	modalProps: ModalProps;
	showAlert: (props: { title?: string; desc: string; buttons?: Button[] }) => void;
	hideAlert: () => void;
}

// Create Context with a default value
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// ModalProvider Component to wrap the app
interface ModalProviderProps {
	children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [modalProps, setModalProps] = useState<ModalProps>({
		title: 'Alert', // Default title
		message: '',
		buttons: [],
	});

	// Show alert with an object containing title, desc, and buttons
	const showAlert = ({ title = 'Alert', desc, buttons = [{ text: 'OK', onPress: () => { } }] }: { title?: string; desc: string; buttons?: Button[] }) => {
		setModalProps({ title, message: desc, buttons });
		setIsVisible(true);
	};

	const hideAlert = () => {
		setIsVisible(false);
	};

	return (
		<ModalContext.Provider value={{ isVisible, modalProps, showAlert, hideAlert }}>
			{children}
		</ModalContext.Provider>
	);
};

// Custom Hook to use Modal context
export const useAppAlertBox = (): ModalContextType => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error('useAppAlertBox must be used within a ModalProvider');
	}
	return context;
};
