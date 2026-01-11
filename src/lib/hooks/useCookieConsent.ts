import { useState, useEffect } from 'react';

type ConsentStatus = 'granted' | 'denied' | null;

export const useCookieConsent = () => {
    const [consent, setConsent] = useState<ConsentStatus>(null);

    useEffect(() => {
        const storedConsent = localStorage.getItem('cookie_consent');
        if (storedConsent === 'granted' || storedConsent === 'denied') {
            setConsent(storedConsent);
        }
    }, []);

    const acceptCookies = () => {
        setConsent('granted');
        localStorage.setItem('cookie_consent', 'granted');
        // Trigger an event so other components can react if needed (optional but good for immediate script loading)
        window.dispatchEvent(new Event('cookie_consent_updated'));
    };

    const rejectCookies = () => {
        setConsent('denied');
        localStorage.setItem('cookie_consent', 'denied');
        window.dispatchEvent(new Event('cookie_consent_updated'));
    };

    return { consent, acceptCookies, rejectCookies };
};
