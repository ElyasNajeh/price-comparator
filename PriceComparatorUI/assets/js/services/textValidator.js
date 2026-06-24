export function spellCheck(text) {
    return fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            text: text,
            language: 'en-US'
        })
    })
        .then((response) => response.json())
        .then((data) => {
            let corrected = text;
            for (const match of data.matches.reverse()) {
                if (match.replacements.length > 0) {
                    corrected = corrected.slice(0, match.offset) + match.replacements[0].value
                        + corrected.slice(match.offset + match.length);
                }
            }

            if (corrected !== text) {
                if (confirm(`Did you mean: ${corrected}?`)) {
                    document.getElementById('searchInput').value = corrected;
                    return corrected;
                }
            }

            return text;
        });
}