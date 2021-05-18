import React, {useEffect} from 'react';

function Callback() {
    useEffect(() => {
        const urlSearchSpace = new URLSearchParams(window.location.href.split("?").pop());
        const token = urlSearchSpace.get("access_token");
        const refreshToken = urlSearchSpace.get("refresh_token");
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
        props.history.push("/dashboard");
    }, [])

    return null;
}

export default Callback;
