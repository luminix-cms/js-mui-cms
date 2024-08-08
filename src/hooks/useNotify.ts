import React from "react";
import NotificationContext from "../contexts/NotificationContext";

export default function useNotify() {

    return React.useContext(NotificationContext).notify;

}

