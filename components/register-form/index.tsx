import { RegisterRequest } from "@/model/register.model";
import { registerMemeber } from "@/services/api";
import { yupResolver } from "@hookform/resolvers/yup"
import { verifyMessage } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignMessage } from "wagmi";
import * as yup from "yup";
import { Recaptcha } from "@/model/recaptcha.model";
import { useReCaptcha } from "next-recaptcha-v3";

export default function RegisterForm({
  closeModal,
  profile,
  callback,
  signed,
}: any) {
  const [showSpinner, setSpinner] = useState<boolean>(false);
  const [submited, setSubmited] = useState<boolean>(false);
  const { loaded, executeRecaptcha } = useReCaptcha();

  const getRecaptchaToken = async () => {
    return await executeRecaptcha("form_submit");
  };

  const validation = yup.object().shape({
    // consent: yup.bool().oneOf([true], 'Checkbox selection is required'),
  });
  const optionsForm = {
    resolver: yupResolver(validation),
    defaultValues: {},
  };

  const {
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm(optionsForm);

  const submitForm = () => {
    setSpinner(true);
    setSubmited(true);
    const message = `Please sign to confirm this information.\n\nWebsite: ${process.env.NEXT_PUBLIC_URL}\nNonce: ${profile.id}\nEmployee ID: ${profile.employeeId}\nFirst Name: ${profile.firstName}\nLast Name: ${profile.lastName}\nEmail: ${profile.email}`;
    signMessage({ message });
  };

  const onTriggerValidation = (event: any) => {
    const { name } = event.target;
    trigger(name);
  };

  const registerNewMember = async (signedMessage: string) => {
    try {
      const req: RegisterRequest = {
        signedMessage: signedMessage,
        id: profile.id,
        publicAddress: profile.wallet,
      };
      const token: Recaptcha = await { token: await getRecaptchaToken() };
      const data = await registerMemeber(req, token);
      if (data.status == 200) {
        closeModal(false);
        setSpinner(false);

        callback(false);
        signed(true);
      }
    } catch (err) {
      setSpinner(false);
      callback(true);
      signed(false);
    }
  };

  const { data, error, isLoading, signMessage, isError } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      registerNewMember(data);
    },
    onError(error) {
      setSpinner(false);
      signed(false);
      console.log(error)
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="grid gap-3 mb-6 md:grid-cols-2">
          <div className="">
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white "
            >
              First name
            </label>
            <input
              value={profile.firstName}
              disabled
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="First name"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="last_name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Last name
            </label>
            <input
              value={profile.lastName}
              disabled
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Last name"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="company"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              value={profile.email}
              disabled
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Email"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="employeeId"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              EmployeeId
            </label>
            <input
              value={profile.employeeId}
              disabled
              type="string"
              id="employeeId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="123-45-678"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              required
            />
          </div>
        </div>
        {/* <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                        <input id="consent" type="checkbox"
                            defaultChecked={false}
                            {...register("consent", {
                                required: true

                            })} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
                </div> */}
        <button
          type="submit"
          disabled={!isValid || showSpinner}
          className="relative submit-form disabled:opacity-75 disabled:cursor-not-allowed"
        >
          REGISTER
        </button>
        {error && (
          <p className="text-red-500 mt-4 text-center">{error.message}</p>
        )}
      </form>
    </>
  );
}
