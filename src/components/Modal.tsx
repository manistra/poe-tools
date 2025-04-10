import React, { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";

interface ModalBaseProps {
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  backdropClassname?: string;
}

const ModalBase: React.FC<ModalBaseProps> = ({
  isOpen,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsOpen = () => {},
  children,
  className,
  backdropClassname,
  onClose,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        onClose={() => {
          setIsOpen(false);
          onClose?.();
        }}
        className="relative z-50"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={clsx(
              "fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md",
              backdropClassname
            )}
          />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className={clsx(
              "fixed inset-0 flex w-screen items-center justify-center p-4"
            )}
          >
            <Dialog.Panel className={className}>{children}</Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ModalBase;
