import ModelContext from "../../contexts/ModelContext";
import { ModelProviderProps } from "../../types/PropTypes";

const ModelProvider: React.FunctionComponent<ModelProviderProps> = ({ Model, children }) => {

    return (
        <ModelContext.Provider value={{ Model }}>
            {children}
        </ModelContext.Provider>
    );
};

export default ModelProvider;
