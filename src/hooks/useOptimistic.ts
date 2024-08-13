import React from "react";

/**
 * 
 * Hook to create an optimistic state. It will update the result when the state changes, if the state is not falsy.
 * 
 * @example
 * ```tsx
 * const [state, setState] = React.useState<string>();
 * const optimistic = useOptimistic(state);
 * 
 * const handleClick = () => {
 *     if (Math.random() > 0.5) {
 *         setState('new value');
 *     } else {
 *         setState(null);
 *     }
 * };
 * 
 * // After the first time state is set to 'new value'
 * // the optimistic state will always be 'new value'
 * 
 * return (
 *    <>
 *        <p>{optimistic}</p>
 *        <button onClick={handleClick}>
 *            Change Value
 *        </button>
 *    </>
 * );
 * ```
 *
 */
export default function useOptimistic<T>(state: T) {

    const [optimistic, setOptimistic] = React.useState(state);

    React.useEffect(() => {
        if (state) {
            setOptimistic(state);
        }
    }, [state]);
    
    return state || optimistic;

}

