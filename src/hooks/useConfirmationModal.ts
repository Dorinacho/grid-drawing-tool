import { useCallback, useState } from 'react';
import type { ConfirmationAction } from '../components/modals/ConfirmationModal.tsx';

export const useConfirmationModal = () => {
    const [state, setState] = useState<{
        visible: boolean;
        action: ConfirmationAction | null;
        pendingAction: (() => void) | null;
    }>({
        visible: false,
        action: null,
        pendingAction: null,
    });

    const showConfirmation = useCallback(
        (action: ConfirmationAction, pendingAction: () => void) => {
            setState({
                visible: true,
                action,
                pendingAction,
            });
        },
        []
    );

    const hideConfirmation = useCallback(() => {
        setState({
            visible: false,
            action: null,
            pendingAction: null,
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (state.pendingAction) {
            state.pendingAction();
        }
        hideConfirmation();
    }, [state, hideConfirmation]);

    return {
        confirmationState: state,
        showConfirmation,
        hideConfirmation,
        handleConfirm,
    };
};
