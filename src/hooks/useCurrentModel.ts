import React from "react";
import ModelContext from "../contexts/ModelContext";

export default function useCurrentModel() {

    const { Model } = React.useContext(ModelContext);

    return Model;
}

