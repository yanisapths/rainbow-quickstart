import { AppContext } from "../../context/app";
import Nav from "./navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../loading";

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
      <Loading isShowLoading={loading} />
      <div className="flex flex-col min-height-100vh">
        <div className="container mx-auto px-2 flex-1">{children}</div>
      </div>
    </AppContext.Provider>
  );
}
