import GoogleLogin from "../google-login";
import { useRouter } from "next/router";

export default function Nav() {
  const router = useRouter();

  return (
    <>
      <div className="bg-transparent px-12 container mx-auto px-2 wallet-wrapper">
        <GoogleLogin />
      </div>
    </>
  );
}
