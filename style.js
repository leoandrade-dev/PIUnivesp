document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.qtde button');
    const removeButtons = document.querySelectorAll('.remove');
    const limparCarrinhoButton = document.getElementById('limparCarrinhoBtn');

    function atualizarQuantidade(acao, quantidadeSpan, valorTotalSpan, precoUnitario) {
        let quantidade = parseInt(quantidadeSpan.textContent);

        if (acao === 'aumentar') {
            quantidade++;
        } else if (acao === 'diminuir' && quantidade > 0) {
            quantidade--;
        }

        quantidadeSpan.textContent = quantidade;
        const total = precoUnitario * quantidade;
        valorTotalSpan.textContent = quantidade === 0 ? '' : `R$ ${total.toFixed(2)}`; // Define o valor total como uma string vazia se a quantidade for zero
        calcularSubtotal();
    }

    function calcularSubtotal() {
        let subtotal = 0;
        let quantidadeTotal = 0;
        document.querySelectorAll('.valor-Total').forEach(td => {
            const valor = parseFloat(td.textContent.replace('R$', '').trim());
            if (!isNaN(valor)) {
                subtotal += valor;
            }
        });
        document.querySelectorAll('.qtdProduto').forEach(span => {
            quantidadeTotal += parseInt(span.textContent);
        });

        // Define o subtotal como uma string vazia se for igual a zero
        document.getElementById('subtotal').textContent = subtotal === 0 ? '' : `R$ ${subtotal.toFixed(2)}`;

        // Calcular desconto
        let desconto = 0.00;
        let descontoText = "";

        if (subtotal > 1000.00) {
            desconto = subtotal * 0.10;
            descontoText = "10%";
        } else if (subtotal > 500.00) {
            desconto = subtotal * 0.075;
            descontoText = "7.5%";
        } else if (subtotal > 200.00) {
            desconto = subtotal * 0.05;
            descontoText = "5%";
        } else if (subtotal >= 100.00) {
            desconto = subtotal * 0.02;
            descontoText = "2%";
        }

        // Calcular frete
        let frete;
        let freteText;
        if (quantidadeTotal === 0) {
            frete = 0.00;
            freteText = '';
        } else if (subtotal < 200.00) {
            frete = 5.00;
            freteText = `R$ ${frete.toFixed(2)}`;
        } else {
            frete = 0.00;
            freteText = 'Grátis';
        }

        // Calcular o total com desconto e frete
        const totalComDesconto = subtotal - desconto + frete;

        // Define o total com desconto como uma string vazia se for igual a zero
        document.getElementById('total').textContent = totalComDesconto === 0 ? '' : `R$ ${totalComDesconto.toFixed(2)}`;
        document.getElementById('desconto').textContent = descontoText;
        document.getElementById('frete').textContent = freteText;
    }

    function removerItem(button) {
        const row = button.closest('tr');
        const quantidadeSpan = row.querySelector('.qtdProduto');
        const valorTotalSpan = row.querySelector('.valor-Total');

        quantidadeSpan.textContent = '0';
        valorTotalSpan.textContent = '';
        calcularSubtotal();
    }

    function limparCarrinho() {
        document.querySelectorAll('.qtdProduto').forEach(span => {
            span.textContent = '0';
        });

        document.querySelectorAll('.valor-Total').forEach(span => {
            span.textContent = '';
        });

        calcularSubtotal();
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const acao = button.getAttribute('data-action');
            const quantidadeSpan = button.parentElement.querySelector('.qtdProduto');
            const valorTotalSpan = button.closest('tr').querySelector('.valor-Total');
            const precoUnitario = parseFloat(button.closest('tr').querySelector('td[data-preco]').getAttribute('data-preco'));
            atualizarQuantidade(acao, quantidadeSpan, valorTotalSpan, precoUnitario);
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            removerItem(button);
        });
    });

    limparCarrinhoButton.addEventListener('click', () => {
        limparCarrinho();
    });

    // Calcular o total inicial
    calcularSubtotal();
});
