document.addEventListener('DOMContentLoaded', function() {
    const btnCalcular = document.getElementById('calcular');
    const btnLimpar = document.getElementById('limpar');

    if (btnCalcular) {
        btnCalcular.addEventListener('click', calcularJurosCompostos);
    }

    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparCampos);
    }

    function calcularJurosCompostos() {
        const valorInicial = parseFloat(document.getElementById('valorInicial').value) || 0;
        const taxaJuros = parseFloat(document.getElementById('taxaJuros').value) || 0;
        const periodoTaxa = document.getElementById('periodoTaxa').value;
        const periodo = parseInt(document.getElementById('periodo').value) || 0;
        const tipoPeriodo = document.getElementById('tipoPeriodo').value;
        const investimentoMensal = parseFloat(document.getElementById('investimentoMensal').value) || 0;

        if (periodo <= 0) return;

        // Converter período para meses
        const totalMeses = tipoPeriodo === 'anos' ? periodo * 12 : periodo;

        // Converter taxa para mensal
        let taxaMensal;
        if (periodoTaxa === 'anual') {
            taxaMensal = Math.pow(1 + (taxaJuros / 100), 1 / 12) - 1;
        } else {
            taxaMensal = taxaJuros / 100;
        }

        let montante = valorInicial;
        let totalInvestido = valorInicial;
        const historico = [];

        for (let i = 1; i <= totalMeses; i++) {
            const jurosNoMes = montante * taxaMensal;
            montante += jurosNoMes + investimentoMensal;
            totalInvestido += investimentoMensal;
            
            historico.push({
                mes: i,
                juros: jurosNoMes,
                totalInvestido: totalInvestido,
                totalJuros: montante - totalInvestido,
                acumulado: montante
            });
        }

        const totalFinal = montante;
        const totalJuros = totalFinal - totalInvestido;

        // Exibir resultados
        document.getElementById('resultado').style.display = 'block';
        document.getElementById('totalFinal').innerText = formatarMoeda(totalFinal);
        document.getElementById('totalInvestido').innerText = formatarMoeda(totalInvestido);
        document.getElementById('totalJuros').innerText = formatarMoeda(totalJuros);

        // Preencher tabela
        const tabela = document.getElementById('tabelaResultados');
        tabela.innerHTML = '';
        document.getElementById('tabela').style.display = 'block';

        historico.forEach(item => {
            const row = tabela.insertRow();
            row.insertCell(0).innerText = item.mes;
            row.insertCell(1).innerText = formatarMoeda(item.juros);
            row.insertCell(2).innerText = formatarMoeda(item.totalInvestido);
            row.insertCell(3).innerText = formatarMoeda(item.totalJuros);
            row.insertCell(4).innerText = formatarMoeda(item.acumulado);
        });

        // Mostrar Gráfico
        document.getElementById('grafico').style.display = 'block';
        renderizarGraficos(totalInvestido, totalJuros, historico);
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function limparCampos() {
        document.getElementById('valorInicial').value = '';
        document.getElementById('taxaJuros').value = '';
        document.getElementById('periodo').value = '';
        document.getElementById('investimentoMensal').value = '';
        document.getElementById('resultado').style.display = 'none';
        document.getElementById('tabela').style.display = 'none';
        document.getElementById('grafico').style.display = 'none';
    }

    let chartInstance = null;

    function renderizarGraficos(investido, juros, historico) {
        const ctx = document.createElement('canvas');
        const container = document.getElementById('barChart');
        container.innerHTML = '';
        container.appendChild(ctx);

        if (chartInstance) {
            chartInstance.destroy();
        }

        const labels = historico.map(h => h.mes % 12 === 0 ? `Ano ${h.mes/12}` : `Mês ${h.mes}`);
        // Filtrar labels para não ficar muito poluído se o período for longo
        const filteredLabels = labels.filter((l, i) => historico.length > 24 ? i % 6 === 0 : true);
        const filteredInvestido = historico.filter((h, i) => historico.length > 24 ? i % 6 === 0 : true).map(h => h.totalInvestido);
        const filteredAcumulado = historico.filter((h, i) => historico.length > 24 ? i % 6 === 0 : true).map(h => h.acumulado);

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filteredLabels,
                datasets: [
                    {
                        label: 'Total Investido',
                        data: filteredInvestido,
                        borderColor: '#9ca3af',
                        backgroundColor: '#f3f4f6',
                        fill: true
                    },
                    {
                        label: 'Valor Acumulado',
                        data: filteredAcumulado,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }
});
