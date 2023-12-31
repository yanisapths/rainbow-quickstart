import { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { serviceAccountEmail, serviceAccountKey, sheetId } from "@/constants";
import { JWT } from "google-auth-library";
import { google } from "googleapis";

export default async function addToGoogleSheets(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { nickname, firstname, lastname, birthday, company, areaOfInterest } =
    req.body;

  const auth =  new google.auth.GoogleAuth({
    credentials: {
      private_key: serviceAccountKey.replace(/\\n/g,'n'),
      client_email: serviceAccountEmail
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  try {
    const doc = new GoogleSpreadsheet(sheetId, auth);

    // Load the Google Sheets document
    await doc.loadInfo();

    // Select the first sheet (assuming it's the one you want to add data to)
    const sheet = doc.sheetsByIndex[0];

    // Prepare the data to be added
    const rowData = {
      nickname,
      firstname,
      lastname,
      birthday,
      company,
      areaOfInterest,
    };

    // Add a new row with the data
    await sheet.addRow(rowData);

    // Respond with a success message
    res.status(200).json({ message: "Row added successfully." });
  } catch (error) {
    console.error("Error adding row to Google Sheets:", error);
    res.status(500).json({ message: "Error adding row to Google Sheets." });
  }
}
