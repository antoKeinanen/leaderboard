import React from "react";

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  label: string;
}

function Modal({ children, label, open, setOpen }: ModalProps) {
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-fit w-fit rounded-md bg-emerald-600 px-4 py-2"
      >
        {label}
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="absolute left-0 right-0 top-0 ml-0 flex h-screen w-screen items-center justify-center bg-slate-950 bg-opacity-75"
          >
            <dialog
              open={open}
              onClick={(e) => e.stopPropagation()}
              className="w-2/3 rounded-lg border-2 border-emerald-950 bg-emerald-900 px-8 py-4 text-emerald-100"
            >
              {children}
            </dialog>
          </div>
        </>
      )}
    </>
  );
}

export default Modal;
