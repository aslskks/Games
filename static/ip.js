window.onload = async () => {
    try {
        // Get public IP
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const clientIP = ipData.ip;

        // Get only the endpoint path (ex: /something)
        const endpoint = window.location.pathname;

        await fetch('/log_ip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ip: clientIP,
                endpoint: endpoint
            })
        });

    } catch (error) {
        console.error(error);
    }
};