import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { serviceAccountEmail, serviceAccountKey, sheetId } from "@/constants";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/CustomToast";
import ExpirePage from "@/components/expire";

const Home = ({}) => {
  const router = useRouter();
  const { user_id, token, expires } = router.query;
  const currentTimestamp = Date.now();
  const expire = parseInt(expires as any);
  const [isSubmit, setIsSubmited] = useState<boolean>(false);
  const [selectBirthday, setSelectBirthday] = useState<Date>();
  const formattedBirthday = dayjs(selectBirthday).format("DD-MMM-YYYY");
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsSubmited(true);
      // Call the addToGoogleSheets API to add data to Google Sheets
      const addToSheetsResponse = await fetch("/api/add-to-google-sheets", {
        method: "POST",
        body: JSON.stringify({
          nickname: data.nickname,
          firstname: data.firstname,
          lastname: data.lastname,
          birthday: formattedBirthday,
          company: data.company,
          areaOfInterest: data.areaOfInterest,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!addToSheetsResponse.ok) {
        toast({
          title: "Error",
          message: "Error adding data to Google Sheets",
          type: "error",
        });
        throw new Error("Error adding data to Google Sheets");
      } else {
        // Call grant external role
        const response = await fetch("/api/grant-external-role", {
          method: "PUT",
          body: JSON.stringify({
            user_id,
            token,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = await response.json();
        toast({
          title: "Congratulations! 🎉",
          message: "You received External role!",
          type: "success",
        });
        router.push({ pathname: "/success" });
      }
    } catch (e) {
      toast({
        title: "Error",
        message: "Please try again",
        type: "error",
      });
    }
    setIsSubmited(false);
  };

  if (currentTimestamp <= expire) {
    return <ExpirePage />;
  }

  return (
    <div>
      <Head>
        <title>Verify App</title>
        <meta
          content="Verify your NFT to access secret room on poc server"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <main className="h-screen text-white">
        {token && user_id ? (
          <>
            <div className="py-3 flex flex-col justify-center text-center items-center pt-20">
              <h1 className="text-4xl pb-2">Get to know you</h1>
              <p className="text-lg w-full">
                Tell us about youerself to join POC Discord server
              </p>
            </div>
            <div className="mx-auto max-w-xl px-4 py-2 sm:px-6 lg:px-8">
              <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="sr-only" htmlFor="nickname">
                      Nickname
                    </label>
                    <TextField
                      id="nickname"
                      fullWidth
                      label="Nickname"
                      placeholder="Nickname"
                      className="input"
                      {...register("nickname", {
                        required: true,
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="sr-only" htmlFor="firstname">
                        First name
                      </label>
                      <TextField
                        id="firstname"
                        fullWidth
                        label="First name"
                        placeholder="First name"
                        className="input"
                        {...register("firstname", {
                          required: true,
                        })}
                      />
                    </div>

                    <div>
                      <label className="sr-only" htmlFor="lastname">
                        Last name
                      </label>
                      <TextField
                        id="lastname"
                        fullWidth
                        label="Last name"
                        placeholder="Last name"
                        className="input"
                        {...register("lastname", {
                          required: true,
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
                    <div>
                      <DatePicker
                        format="DD-MMM-YYYY"
                        label="Birthday"
                        value={selectBirthday}
                        className="input"
                        onChange={(date: any) => {
                          setSelectBirthday(date);
                        }}
                      />
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="company">
                        Company
                      </label>
                      <TextField
                        id="company"
                        fullWidth
                        label="Company"
                        placeholder="Company/organization"
                        className="input"
                        {...register("company", {
                          required: true,
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <TextField
                      type="textarea"
                      className="input"
                      label="Area of interest"
                      id="areaOfInterest"
                      rows={4}
                      multiline
                      {...register("areaOfInterest", {
                        required: true,
                      })}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      className="w-full rounded-lg px-5 py-3 sm:w-auto"
                      type="submit"
                      size="lg"
                      disabled={!isValid}
                    >
                      <p className="p-2">
                        {isSubmit ? "Submitting" : " Submit"}
                      </p>
                      {isSubmit ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : null}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="py-3 flex flex-col justify-center text-center items-center pt-20">
            <h1 className="text-4xl pb-2">Invalid request</h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
