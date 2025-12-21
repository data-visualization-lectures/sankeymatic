/* Rescue project_id before dataviz-auth-client.js clears it */
(function () {
    if (window.location.search) {
        const p = new URLSearchParams(window.location.search).get('project_id');
        if (p) {
            window.SKM_PROJECT_ID = p;
            console.log('Rescued project_id:', p);
        }
    }
})();
