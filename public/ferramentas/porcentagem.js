document.addEventListener('DOMContentLoaded', function() {
    // Cálculo de Porcentagem
    const percentageValue = document.getElementById('percentageValue');
    const baseValue = document.getElementById('baseValue');
    const resultValue = document.getElementById('resultValue');

    percentageValue?.addEventListener('input', calculatePercentage);
    baseValue?.addEventListener('input', calculatePercentage);

    function calculatePercentage() {
        const perc = parseFloat(percentageValue.value) || 0;
        const base = parseFloat(baseValue.value) || 0;
        resultValue.value = ((perc * base) / 100).toFixed(2);
    }

    // Proporção
    const proportionValue = document.getElementById('proportionValue');
    const proportionTotal = document.getElementById('proportionTotal');
    const proportionResult = document.getElementById('proportionResult');

    proportionValue?.addEventListener('input', calculateProportion);
    proportionTotal?.addEventListener('input', calculateProportion);

    function calculateProportion() {
        const value = parseFloat(proportionValue.value) || 0;
        const total = parseFloat(proportionTotal.value) || 0;
        if (total === 0) {
            proportionResult.value = '0.00';
            return;
        }
        proportionResult.value = ((value / total) * 100).toFixed(2);
    }

    // Aumento Percentual
    const increaseInitial = document.getElementById('increaseInitial');
    const increaseFinal = document.getElementById('increaseFinal');
    const increaseResult = document.getElementById('increaseResult');

    increaseInitial?.addEventListener('input', calculateIncrease);
    increaseFinal?.addEventListener('input', calculateIncrease);

    function calculateIncrease() {
        const initial = parseFloat(increaseInitial.value) || 0;
        const final = parseFloat(increaseFinal.value) || 0;
        if (initial === 0) {
            increaseResult.value = '0.00';
            return;
        }
        increaseResult.value = (((final - initial) / initial) * 100).toFixed(2);
    }

    // Redução Percentual
    const decreaseInitial = document.getElementById('decreaseInitial');
    const decreaseFinal = document.getElementById('decreaseFinal');
    const decreaseResult = document.getElementById('decreaseResult');

    decreaseInitial?.addEventListener('input', calculateDecrease);
    decreaseFinal?.addEventListener('input', calculateDecrease);

    function calculateDecrease() {
        const initial = parseFloat(decreaseInitial.value) || 0;
        const final = parseFloat(decreaseFinal.value) || 0;
        if (initial === 0) {
            decreaseResult.value = '0.00';
            return;
        }
        decreaseResult.value = (((initial - final) / initial) * 100).toFixed(2);
    }
});
