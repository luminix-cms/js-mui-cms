import React from 'react';

export default function useKeyPress(key: string, onPress?: () => void) {
    const [isDown, setIsDown] = React.useState(false);
    
    React.useEffect(() => {
        const onDown = (event: KeyboardEvent) => {
            if (event.key === key) {
                setIsDown(true);
                onPress && onPress();
            }
        };
    
        const onUp = (event: KeyboardEvent) => {
            if (event.key === key) {
                setIsDown(false);
            }
        };

        window.addEventListener('keydown', onDown);
        window.addEventListener('keyup', onUp);

        return () => {
            window.removeEventListener('keydown', onDown);
            window.removeEventListener('keyup', onUp);
        };
    }, [key, onPress]);

    return isDown;
}


