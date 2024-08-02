import React from "react";
import NotificationContext from "../contexts/NotificationContext";



export default function useNotifications() {

    return React.useContext(NotificationContext);


}

