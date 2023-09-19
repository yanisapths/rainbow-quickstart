import { AppContext } from "../../context/app";
import { useState } from "react";
import { useRouter } from "next/router";
import Loading from "../loading";
import { Toaster } from "@/components/ui/CustomToast";

export default function Layouts(props: any) {
  const { children } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const showLoadingModal = () => {
    setLoading(true);
  };
  const hideLoadingModal = () => {
    setLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        Loading: {
          show: () => {
            showLoadingModal();
          },
          hide: () => {
            hideLoadingModal();
          },
        },
      }}
    >
      <Toaster position="bottom-right" />
      <Loading isShowLoading={loading} />
      <div className="flex flex-col min-h-full bg-gradient-to-b from-black via-gray-900 to-gray-700">
        <div className="p-8 flex-1">
          {children}
          </div>
      </div>
    </AppContext.Provider>
  );
}
