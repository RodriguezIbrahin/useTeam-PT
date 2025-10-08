import { useState } from "react";
import ConfirmModal from "../components/modals/ConfirmModal";
export default function useConfirmToast() {
  const [confirmState, setConfirmState] = useState(null);

  const confirm = (message) => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
        resolve,
      });
    });
  };

  const ConfirmModalElement = confirmState ? (
    <ConfirmModal
      message={confirmState.message}
      onConfirm={() => {
        confirmState.resolve(true);
        setConfirmState(null);
      }}
      onCancel={() => {
        confirmState.resolve(false);
        setConfirmState(null);
      }}
    />
  ) : null;

  return [confirm, ConfirmModalElement];
}
