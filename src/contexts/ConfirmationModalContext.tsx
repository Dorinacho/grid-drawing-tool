import React, { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import type { ConfirmationAction } from '../components/modals/ConfirmationModal.tsx';

interface ConfirmationModalContextType {
    visible: boolean;
    action: ConfirmationAction | null;
    show: (action: ConfirmationAction, onConfirm: () => void) => void;
    hide: () => void;
    confirm: () => void;
}

const ConfirmationModalContext = createContext<ConfirmationModalContextType | null>(null);

export const ConfirmationModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [action, setAction] = useState<ConfirmationAction | null>(null);
    const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

    const show = useCallback((newAction: ConfirmationAction, callback: () => void) => {
        setAction(newAction);
        setOnConfirm(() => callback); // Wrap in function to store callback correctly
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        setVisible(false);
        setAction(null);
        setOnConfirm(null);
    }, []);

    const confirm = useCallback(() => {
        onConfirm?.();
        hide();
    }, [onConfirm, hide]);

    return (
        <ConfirmationModalContext.Provider value={{ visible, action, show, hide, confirm }}>
            {children}
        </ConfirmationModalContext.Provider>
    );
};

export const useConfirmationModal = (): ConfirmationModalContextType => {
    const context = useContext(ConfirmationModalContext);
    if (!context) {
        throw new Error('useConfirmationModal must be used within ConfirmationModalProvider');
    }
    return context;
};
