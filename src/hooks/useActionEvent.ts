import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePagination } from "@luminix/react";

import useNotify from "./useNotify";
import useDialog from "./useDialog";

import { ActionCallbackEvent } from "../types/Table";

export default function useActionEvent(): ActionCallbackEvent {
    const navigate = useNavigate();
    const notify = useNotify();
    const dialog = useDialog();
    const { t } = useTranslation();
    const { refresh } = usePagination();

    return { navigate, notify, dialog, t, refresh };
}

