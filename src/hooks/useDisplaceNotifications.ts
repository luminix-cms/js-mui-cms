import React from 'react';
import NotificationContext from '../contexts/NotificationContext';
import { useTheme } from '@mui/material/styles';
import useIsDesktopMode from './useIsDesktopMode';


export default function useDisplaceNotifications(value: string | number | false) {

    const { 
        setDisplacement
    } = React.useContext(NotificationContext);

    const theme = useTheme();
    const isDesktop = useIsDesktopMode();

    const defaultDisplacement = theme.spacing(isDesktop ? 3 : 1);
    const desiredDisplacement = value === false 
        ? defaultDisplacement 
        : theme.spacing(value);
    

    React.useEffect(() => {

        setDisplacement(desiredDisplacement);

        return () => {
            setDisplacement(defaultDisplacement);
        };

    }, [desiredDisplacement, defaultDisplacement, setDisplacement]);


}



