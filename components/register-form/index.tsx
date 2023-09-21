import { serviceAccountEmail, serviceAccountKey, sheetId } from "@/constants";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { toast } from "../ui/CustomToast";

export default function RegisterForm() {
  const router = useRouter();
  const [isSubmit, setIsSubmited] = useState<boolean>(false);
  const [selectBirthday, setSelectBirthday] = useState<Date>();
  const formattedBirthday = dayjs(selectBirthday).format("DD-MMM-YYYY");
  const serviceAccountAuth = new JWT({
    email: serviceAccountEmail,
    key: serviceAccountKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  const { handleSubmit, register } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsSubmited(true);
      const req = {
        nickname: data.nickname,
        firstname: data.firstname,
        lastname: data.lastname,
        birthday: formattedBirthday,
        company: data.company,
        areaOfInterest: data.areaOfInterest,
      };

      await doc.loadInfo();
      const allSheets = doc.sheetsByIndex;
      if (allSheets.length === 0) {
        await doc.addSheet({
          headerValues: [
            "nickname",
            "firstname",
            "lastname",
            "birthday",
            "company",
            "areaOfInterest",
          ],
        });
      }

      const sheet = doc.sheetsByIndex[0];
      await sheet.addRow(req).then(() => {
        setIsSubmited(true);
        toast({
          title: "Success! 🎉",
          message: "Thank you, we received your info!",
          type: "success",
        });
        router.push({ pathname: "/success" });
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        message: "Please try again",
        type: "error",
      });
      setIsSubmited(false);
    } finally {
      setIsSubmited(false); // Set isSubmit to false after the API request is completed (success or error)
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-2 sm:px-6 lg:px-8">
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

          <Button
            variant="default"
            className="w-full rounded-lg px-5 py-3 sm:w-auto"
            type="submit"
            size="lg"
          >
            <p className="p-2">{isSubmit ? "Submitting" : " Submit"}</p>
            {isSubmit ? <Loader2 className="animate-spin h-4 w-4" /> : null}
          </Button>
        </form>
      </div>
    </div>
  );
}
