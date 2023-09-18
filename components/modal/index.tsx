import { ReactNode, useEffect, useRef, useState } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose?: (data: boolean) => void;
  callback: (boolean: boolean) => void;
  callbackOutside?: (boolean: boolean) => void;
  width?: string;
  maxHeight?: string;
  fixed?: boolean
  hideClose?: boolean
  disableClickOutside?: boolean

};
const Modal = ({ title, children, isOpen, onClose, callback, width, maxHeight, fixed,hideClose,disableClickOutside,callbackOutside }: ModalProps) => {
  const [opened, setOpened] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);


  const handleClickOutside = (event: MouseEvent) => {
    if(!disableClickOutside){
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpened(false);
        if (onClose) onClose(true);
        if (callback) callback(false);
      }
    }

  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={"pop_up animated " + (opened ? "fadeIn" : "")} id="pop_up">
      <div className="pop_up_dialog shadow_lv2_bottom">
        <div className="pop_up_content" ref={modalRef} style={{ width: width, maxHeight: maxHeight }} id="popupContent">
          <div className={`pop_up_header relative ${fixed ? "pop_up_header_fixed" : ""}`}>
            <h2 className={`mb-2 text-2xl font-bold text-light-blue3 mb-4 ${fixed ? "mt-3" : ""}`}>{title}</h2>
            {!hideClose && <div className={`absolute right-0 cursor-pointer ${fixed ? "top-1" : "-top-1"}`} onClick={() => { setOpened(false); callback(false) }}>
              <i className="ic ic-minus ic-bg-grey ic-x3"></i>
            </div>}
          </div>
          <div className={`${fixed ? "mt-6 pt-3" : ""}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
