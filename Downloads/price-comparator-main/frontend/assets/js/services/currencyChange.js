export function convert(from, to, amount, onSuccess) {
    fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
        .then((response) => response.json())
        .then((data) => {
            const convertedAmount = (amount * data.rates[to]).toFixed(2);
            onSuccess(convertedAmount);
        });
}