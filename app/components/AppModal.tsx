// components/AppModal.tsx
import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Info,
    X,
} from 'lucide-react-native';

type ModalType = 'success' | 'error' | 'warning' | 'info';

interface AppModalProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ICONS = {
    success: <CheckCircle size={40} color="#4ECDC4" />,
    error: <AlertCircle size={40} color="#FF6B6B" />,
    warning: <AlertTriangle size={40} color="#F4C66A" />,
    info: <Info size={40} color="#A855F7" />,
};

export default function AppModal({
    visible,
    title,
    message,
    type = 'info',
    onClose,
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Cancel',
}: AppModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.close} onPress={onClose}>
                        <X size={20} color="#aaa" />
                    </TouchableOpacity>

                    <View style={styles.icon}>{ICONS[type]}</View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancel]}
                            onPress={onClose}>
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirm]}
                            onPress={onConfirm ?? onClose}>
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '85%',
        backgroundColor: '#1F1D3A',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    close: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    icon: {
        marginBottom: 12,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    cancel: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    confirm: {
        backgroundColor: '#EF4444',
    },
    cancelText: {
        color: '#ccc',
        fontWeight: '600',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '600',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

});
