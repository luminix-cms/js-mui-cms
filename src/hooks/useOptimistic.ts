import React from "react";

export default function useOptimistic<T>(state: T) {

    const [optimistic, setOptimistic] = React.useState(state);

    React.useEffect(() => {
        if (state) {
            setOptimistic(state);
        }
    }, [state]);

    return optimistic;

}

