import TextField, { TextFieldProps } from "@mui/material/TextField";
import {styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black", 
    },
    "&:hover fieldset": {
      borderColor: "black", 
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
  '& .MuiInputLabel-root': {
    color: 'black', // Customize the label color
  },
}));

export default CustomTextField;
