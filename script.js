// Lấy các phần tử DOM
const a1Input = document.getElementById('a1');
const b1Input = document.getElementById('b1');
const c1Input = document.getElementById('c1');
const a2Input = document.getElementById('a2');
const b2Input = document.getElementById('b2');
const c2Input = document.getElementById('c2');
const operatorSelect = document.getElementById('operator');
const solveBtn = document.getElementById('solveBtn');
const resetBtn = document.getElementById('resetBtn');
const resultBox = document.getElementById('result');

/**
 * Thực hiện phép toán giữa hai số.
 */
function applyOperator(x, y, op) {
    switch (op) {
        case '+': return x + y;
        case '-': return x - y;
        case '*': return x * y;
        case '/':
            if (y === 0) throw new Error('Không thể chia cho 0.');
            return x / y;
        default:
            throw new Error('Phép toán không hợp lệ.');
    }
}

/**
 * Định dạng số.
 */
function formatNumber(n) {
    if (!isFinite(n)) return '∞';
    const rounded = Math.round(n * 1e6) / 1e6;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
}

function showResult(html, type = 'info') {
    resultBox.className = 'result show ' + type;
    resultBox.innerHTML = html;
}

function clearResult() {
    resultBox.className = 'result';
    resultBox.innerHTML = '';
}

/**
 * Giải hệ phương trình bằng phương pháp khử (dựa trên phép toán đã chọn).
 * Hệ:
 *   a1*x + b1*y = c1   (1)
 *   a2*x + b2*y = c2   (2)
 */
function solveSystem() {
    const a1 = parseFloat(a1Input.value) || 0;
    const b1 = parseFloat(b1Input.value) || 0;
    const c1 = parseFloat(c1Input.value) || 0;
    const a2 = parseFloat(a2Input.value) || 0;
    const b2 = parseFloat(b2Input.value) || 0;
    const c2 = parseFloat(c2Input.value) || 0;
    const op = operatorSelect.value;

    if (
        a1Input.value === '' && b1Input.value === '' && c1Input.value === '' &&
        a2Input.value === '' && b2Input.value === '' && c2Input.value === ''
    ) {
        showResult('⚠️ Vui lòng nhập các hệ số của hệ phương trình.', 'error');
        return;
    }

    try {
        let step = ''; // Mô tả từng bước biến đổi
        let newA = 0, newB = 0, newC = 0; // Phương trình mới sau khi khử

        // ============ PHÉP CỘNG: (1) + (2) ============
        if (op === '+') {
            step = `Bước 1: Cộng vế theo vế (1) + (2)\n`;
            newA = applyOperator(a1, a2, '+');
            newB = applyOperator(b1, b2, '+');
            newC = applyOperator(c1, c2, '+');
            step += `→ (${formatNumber(newA)})x + (${formatNumber(newB)})y = ${formatNumber(newC)}\n`;
        }

        // ============ PHÉP TRỪ: (1) − (2) ============
        else if (op === '-') {
            step = `Bước 1: Trừ vế theo vế (1) − (2)\n`;
            newA = applyOperator(a1, a2, '-');
            newB = applyOperator(b1, b2, '-');
            newC = applyOperator(c1, c2, '-');
            step += `→ (${formatNumber(newA)})x + (${formatNumber(newB)})y = ${formatNumber(newC)}\n`;
        }

        // ============ PHÉP NHÂN: (1)*a2 − (2)*a1 ============
        else if (op === '*') {
            step = `Bước 1: Nhân (1) với a₂ = ${formatNumber(a2)}, nhân (2) với a₁ = ${formatNumber(a1)}\n`;
            const A1 = applyOperator(a1, a2, '*');
            const B1 = applyOperator(b1, a2, '*');
            const C1 = applyOperator(c1, a2, '*');
            const A2 = applyOperator(a2, a1, '*');
            const B2 = applyOperator(b2, a1, '*');
            const C2 = applyOperator(c2, a1, '*');
            step += `  (1') ${formatNumber(A1)}x + ${formatNumber(B1)}y = ${formatNumber(C1)}\n`;
            step += `  (2') ${formatNumber(A2)}x + ${formatNumber(B2)}y = ${formatNumber(C2)}\n`;

            step += `Bước 2: Trừ vế theo vế (1') − (2') để khử x\n`;
            newA = applyOperator(A1, A2, '-');
            newB = applyOperator(B1, B2, '-');
            newC = applyOperator(C1, C2, '-');
            step += `→ (${formatNumber(newA)})x + (${formatNumber(newB)})y = ${formatNumber(newC)}\n`;
        }

        // ============ PHÉP CHIA: (1)/a1 − (2)/a2 ============
        else if (op === '/') {
            if (a1 === 0 || a2 === 0) {
                throw new Error('Không thể chia cho 0 (a₁ hoặc a₂ bằng 0).');
            }
            step = `Bước 1: Chia (1) cho a₁ = ${formatNumber(a1)}, chia (2) cho a₂ = ${formatNumber(a2)}\n`;
            const B1 = applyOperator(b1, a1, '/');
            const C1 = applyOperator(c1, a1, '/');
            const B2 = applyOperator(b2, a2, '/');
            const C2 = applyOperator(c2, a2, '/');
            step += `  (1') x + ${formatNumber(B1)}y = ${formatNumber(C1)}\n`;
            step += `  (2') x + ${formatNumber(B2)}y = ${formatNumber(C2)}\n`;

            step += `Bước 2: Trừ vế theo vế (1') − (2') để khử x\n`;
            newA = 0;
            newB = applyOperator(B1, B2, '-');
            newC = applyOperator(C1, C2, '-');
            step += `→ ${formatNumber(newB)}y = ${formatNumber(newC)}\n`;
        }

        // ============ GIẢI PHƯƠNG TRÌNH CÒN LẠI ============
        let x, y;

        // Nếu khử được x (newA = 0, newB ≠ 0)
        if (newA === 0 && newB !== 0) {
            y = applyOperator(newC, newB, '/');
            step += `Bước 3: Giải được y = ${formatNumber(newC)} / ${formatNumber(newB)} = ${formatNumber(y)}\n`;

            // Thế y vào (1) để tìm x
            if (a1 !== 0) {
                x = applyOperator(applyOperator(c1, applyOperator(b1, y, '*'), '-'), a1, '/');
                step += `Bước 4: Thế y vào (1): x = (${formatNumber(c1)} − ${formatNumber(b1)}·${formatNumber(y)}) / ${formatNumber(a1)} = ${formatNumber(x)}\n`;
            } else if (a2 !== 0) {
                x = applyOperator(applyOperator(c2, applyOperator(b2, y, '*'), '-'), a2, '/');
                step += `Bước 4: Thế y vào (2): x = (${formatNumber(c2)} − ${formatNumber(b2)}·${formatNumber(y)}) / ${formatNumber(a2)} = ${formatNumber(x)}\n`;
            }
        }
        // Nếu khử được y (newB = 0, newA ≠ 0)
        else if (newB === 0 && newA !== 0) {
            x = applyOperator(newC, newA, '/');
            step += `Bước 3: Giải được x = ${formatNumber(newC)} / ${formatNumber(newA)} = ${formatNumber(x)}\n`;

            if (b1 !== 0) {
                y = applyOperator(applyOperator(c1, applyOperator(a1, x, '*'), '-'), b1, '/');
                step += `Bước 4: Thế x vào (1): y = (${formatNumber(c1)} − ${formatNumber(a1)}·${formatNumber(x)}) / ${formatNumber(b1)} = ${formatNumber(y)}\n`;
            } else if (b2 !== 0) {
                y = applyOperator(applyOperator(c2, applyOperator(a2, x, '*'), '-'), b2, '/');
                step += `Bước 4: Thế x vào (2): y = (${formatNumber(c2)} − ${formatNumber(a2)}·${formatNumber(x)}) / ${formatNumber(b2)} = ${formatNumber(y)}\n`;
            }
        }
        // Trường hợp đặc biệt: cả newA và newB đều = 0
        else if (newA === 0 && newB === 0) {
            if (newC === 0) {
                showResult(
                    `ℹ️ <strong>Hệ có vô số nghiệm</strong>\n\n` +
                    `<strong>${step}</strong>\n` +
                    `→ Phương trình mới có dạng 0 = 0 → hệ vô số nghiệm.`,
                    'info'
                );
                return;
            } else {
                showResult(
                    `❌ <strong>Hệ vô nghiệm</strong>\n\n` +
                    `<strong>${step}</strong>\n` +
                    `→ Phương trình mới có dạng 0 = ${formatNumber(newC)} (vô lý) → hệ vô nghiệm.`,
                    'error'
                );
                return;
            }
        }

        // Kiểm tra nghiệm có hợp lệ không
        if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
            showResult(
                `❌ <strong>Không thể giải bằng phép toán đã chọn</strong>\n\n` +
                `<strong>${step}</strong>\n` +
                `→ Hãy thử chọn phép toán khác (+, −, ×, ÷).`,
                'error'
            );
            return;
        }

        // Kiểm tra nghiệm bằng cách thế vào 2 phương trình gốc
        const check1 = applyOperator(applyOperator(a1, x, '*'), applyOperator(b1, y, '*'), '+');
        const check2 = applyOperator(applyOperator(a2, x, '*'), applyOperator(b2, y, '*'), '+');
        const eps = 1e-6;
        const valid = Math.abs(check1 - c1) < eps && Math.abs(check2 - c2) < eps;

        let html = '';
        if (valid) {
            html += `✅ <strong>Hệ có nghiệm duy nhất</strong>\n\n`;
            html += `<strong>${step}</strong>\n`;
            html += `📌 <span class="highlight">x = ${formatNumber(x)}</span>\n`;
            html += `📌 <span class="highlight">y = ${formatNumber(y)}</span>\n\n`;
            html += `🔍 Kiểm tra:\n`;
            html += `  (1): ${formatNumber(a1)}·${formatNumber(x)} + ${formatNumber(b1)}·${formatNumber(y)} = ${formatNumber(check1)} (cần = ${formatNumber(c1)})\n`;
            html += `  (2): ${formatNumber(a2)}·${formatNumber(x)} + ${formatNumber(b2)}·${formatNumber(y)} = ${formatNumber(check2)} (cần = ${formatNumber(c2)})`;
            showResult(html, 'success');
        } else {
            html += `⚠️ <strong>Nghiệm tìm được KHÔNG thỏa mãn hệ gốc</strong>\n\n`;
            html += `<strong>${step}</strong>\n`;
            html += `x = ${formatNumber(x)}, y = ${formatNumber(y)}\n\n`;
            html += `→ Phép toán "${op}" không phù hợp với hệ này.\n`;
            html += `→ Hãy thử chọn phép toán khác (+, −, ×, ÷).`;
            showResult(html, 'error');
        }
    } catch (err) {
        showResult('❌ Lỗi: ' + err.message, 'error');
    }
}

function resetForm() {
    [a1Input, b1Input, c1Input, a2Input, b2Input, c2Input].forEach((el) => {
        el.value = '';
    });
    operatorSelect.value = '+';
    clearResult();
    a1Input.focus();
}

solveBtn.addEventListener('click', solveSystem);
resetBtn.addEventListener('click', resetForm);

[a1Input, b1Input, c1Input, a2Input, b2Input, c2Input].forEach((el) => {
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') solveSystem();
    });
});
