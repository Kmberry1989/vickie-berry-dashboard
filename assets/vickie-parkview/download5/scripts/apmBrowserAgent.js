(function() {
    const script = $("script[data-apm-configurations]");
    const apm_configuration = JSON.parse(script.attr('data-apm-configurations'));

    window.apmrum = (window.apmrum || {});
    window.apmrum.serviceName=apm_configuration.service_name;
    window.apmrum.webApplication='Healthelife Patient Portal';
    window.apmrum.ociDataUploadEndpoint=apm_configuration.data_endpoint;
    window.apmrum.OracleAPMPublicDataKey=apm_configuration.public_key;

    window.apmrum.udfAttributes = [
        { name: 'pageTitle', value: () => document.title }
    ];

    window.apmrum.rewriteRules = [
        {
            context: 'all',
            options: 'g',
            pattern: '(person\/[a-zA-Z0-9]{32})|(person\/[a-zA-Z0-9]{15})',
            replacement: 'person\/*',
            type: 'all-values'
        }
    ];

    const session_cookie_info = JSON.parse(script.attr('data-session-cookie-info'));
    if (session_cookie_info) {
        window.apmrum.tracking_cookie=session_cookie_info.name;
        window.apmrum.sid=session_cookie_info.value;
    }
}());
