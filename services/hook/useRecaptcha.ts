import { useReCaptcha } from "next-recaptcha-v3";

const useGoogleRecaptcha = () => {
  const { loaded, executeRecaptcha } = useReCaptcha();
  const token = async () => {
    return await { token: await executeRecaptcha("form_submit") }
  };
  return {
    token,
    loaded
  };
};

export default useGoogleRecaptcha;
