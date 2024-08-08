import React from "react";
import DialogContext from "../contexts/DialogContext";

export default function useDialog() {

    return React.useContext(DialogContext).dialog;

}

