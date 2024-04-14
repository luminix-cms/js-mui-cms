import React from 'react';

export default function useKeyChord(keys: string[], onPress?: () => void) {
    const [isDown, setIsDown] = React.useState(false);

    React.useEffect(() => {
        const downKeys = new Set<string>();

        const onDown = (event: KeyboardEvent) => {
            downKeys.add(event.key);
            if (keys.every((key) => downKeys.has(key))) {
                setIsDown(true);
                onPress && onPress();
            }
        };

        const onUp = (event: KeyboardEvent) => {
            downKeys.delete(event.key);

            if (keys.every((key) => !downKeys.has(key))) {
                setIsDown(false);
            }
        };

        window.addEventListener('keydown', onDown);
        window.addEventListener('keyup', onUp);

        return () => {
            window.removeEventListener('keydown', onDown);
            window.removeEventListener('keyup', onUp);
        };
    }, [keys, onPress]);

    return isDown;
}

