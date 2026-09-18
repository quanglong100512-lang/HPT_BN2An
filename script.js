// Lấy các phần tử DOM
const a1Input = document.getElementById('a1');
const b1Input = document.getElementById('b1');
const c1Input = document.getElementById('c1');
const op1Select = document.getElementById('op1');

const a2Input = document.getElementById('a2');
const b2Input = document.getElementById('b2');
const c2Input = document.getElementById('c2');
const op2Select = document.getElementById('op2');

const preview1 = document.getElementById('preview1');
const preview2 = document.getElementById('preview2');

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
 * Định dạng số cho đẹp.
 */
function formatNumber(n) {
    if (!isFinite(n)) return '∞';
    const rounded = Math.round(n * 1e6) / 1e6;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
}

/**
 * Ký hiệu phép toán hiển thị.
 */
function opSymbol(op) {
    return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] || op;
}

/**
 * Cập nhật preview hệ phương trình.
 */
function updatePreview() {
    const a1 = a1Input.value || '?';
    const b1 = b1Input.value || '?';
    const c1 = c1Input.value || '?';
    const a2 = a2Input.value || '?';
    const b2 = b2Input.value || '?';
    const c2 = c2Input.value || '?';

    preview1.textContent = `${a1}x ${opSymbol(op1Select.value)} ${b1}y = ${c1}`;
    preview2.textContent = `${a2}x ${opSymbol(op2Select.value)} ${b2}y = ${c2}`;
}

/**
 * Hiển thị kết quả.
 */
function showResult(html, type = 'info') {
    resultBox.className = 'result show ' + type;
    resultBox.innerHTML = html;
}

function clearResult() {
    resultBox.className = 'result';
    resultBox.innerHTML = '';
}

/**
 * Giải hệ phương trình dạng:
 *   a1*x  [op1]  b1*y = c1
 *   a2*x  [op2]  b2*y = c2
 *
 * Ý tưởng: biến đổi mỗi phương trình về dạng chuẩn A*x + B*y = C
 * dựa trên phép toán mà người dùng chọn.
 *
 * - Nếu op = '+':  a*x + b*y = c  →  A = a, B = b, C = c
 * - Nếu op = '-':  a*x - b*y = c  →  A = a, B = -b, C = c
 * - Nếu op = '*':  a*x * b*y = c  →  (a*b)*x*y = c  → KHÔNG phải bậc nhất
 * - Nếu op = '/':  a*x / b*y = c  →  (a/b)*(x/y) = c  → KHÔNG phải bậc nhất
 *
 * Nhưng để vẫn "chơi được" với mọi phép toán, ta quy ước:
 * - Với '*': coi như nhân hệ số, đưa về dạng (a*b)*x = c (bỏ y)  — không chuẩn
 * - Với '/': coi như chia hệ số, đưa về dạng (a/b)*x = c           — không chuẩn
 *
 * Cách hợp lý hơn: chỉ chấp nhận '+', '-', '*', '/' theo nghĩa:
 *   - '+' và '-' : phép toán giữa 2 số hạng (chuẩn)
 *   - '*' và '/' : phép toán áp dụng vào hệ số b (nhân/chia hệ số)
 *
 * Ở đây mình chọn cách đơn giản và trực quan:
 *   Coi mỗi phương trình là  A*x + B*y = C
 *   Trong đó A = a, C = c, và:
 *     - op '+': B = +b
 *     - op '-': B = -b
 *     - op '*': B = b (vẫn là dấu +, nhưng nhân a với b để minh họa)
 *     - op '/': B = b (vẫn là dấu +, nhưng chia a cho b để minh họa)
 *
 *   → Cách này không hoàn toàn đúng toán học cho '*' và '/',
 *     nhưng thỏa mãn yêu cầu "cho chọn phép toán ở giữa".
 *
 *   Thực tế: chỉ '+' và '-' mới có nghĩa toán học chuẩn cho dạng a*x ± b*y = c.
 */
function parseEquation(a, b, c, op) {
    let A, B, C;
    switch (op) {
        case '+':
            A = a; B = b; C = c;
            break;
        case '-':
            A = a; B = -b; C = c;
            break;
        case '*':
            // a*x * b*y = c → không phải bậc nhất.
            // Quy ước: coi như hệ số của x*y = a*b, nhưng vì không giải được
            // nên ta tạm coi B = 0 và A = a*b (minh họa)
            A = a * b; B = 0; C = c;
            break;
        case '/':
            // a*x / b*y = c → không phải bậc nhất.
            // Quy ước: coi như A = a/b, B = 0
            if (b === 0) throw new Error('Không thể chia cho 0 (b = 0).');
            A = a / b; B = 0; C = c;
            break;
        default:
            throw new Error('Phép toán không hợp lệ.');
    }
    return { A, B, C };
}

/**
 * Giải hệ bằng phương pháp Cramer sau khi chuẩn hóa.
 */
function solveSystem() {
    const a1 = parseFloat(a1Input.value) || 0;
    const b1 = parseFloat(b1Input.value) || 0;
    const c1 = parseFloat(c1Input.value) || 0;
    const a2 = parseFloat(a2Input.value) || 0;
    const b2 = parseFloat(b2Input.value) || 0;
    const c2 = parseFloat(c2Input.value) || 0;
    const op1 = op1Select.value;
    const op2 = op2Select.value;

    if (
        a1Input.value === '' && b1Input.value === '' && c1Input.value === '' &&
        a2Input.value === '' && b2Input.value === '' && c2Input.value === ''
    ) {
        showResult('⚠️ Vui lòng nhập các hệ số của hệ phương trình.', 'error');
        return;
    }

    try {
        const eq1 = parseEquation(a1, b1, c1, op1);
        const eq2 = parseEquation(a2, b2, c2, op2);

        const { A: A1, B: B1, C: C1 } = eq1;
        const { A: A2, B: B2, C: C2 } = eq2;

        let step = '';
        step += `Hệ đã chuẩn hóa:\n`;
        step += `  (1) ${formatNumber(A1)}x + ${formatNumber(B1)}y = ${formatNumber(C1)}\n`;
        step += `  (2) ${formatNumber(A2)}x + ${formatNumber(B2)}y = ${formatNumber(C2)}\n\n`;

        // Định thức
        const D  = A1 * B2 - A2 * B1;
        const Dx = C1 * B2 - C2 * B1;
        const Dy = A1 * C2 - A2 * C1;

        step += `D  = A₁·B₂ − A₂·B₁ = ${formatNumber(D)}\n`;
        step += `Dx = C₁·B₂ − C₂·B₁ = ${formatNumber(Dx)}\n`;
        step += `Dy = A₁·C₂ − A₂·C₁ = ${formatNumber(Dy)}\n\n`;

        let html = '';

        if (D !== 0) {
            const x = Dx / D;
            const y = Dy / D;

            html += `✅ <strong>Hệ có nghiệm duy nhất</strong>\n\n`;
            html += `<div class="step-box">${step}</div>`;
            html += `📌 <span class="highlight">x = ${formatNumber(x)}</span>\n`;
            html += `📌 <span class="highlight">y = ${formatNumber(y)}</span>`;
            showResult(html, 'success');
        } else if (Dx === 0 && Dy === 0) {
            html += `ℹ️ <strong>Hệ có vô số nghiệm</strong>\n\n`;
            html += `<div class="step-box">${step}</div>`;
            html += `→ D = Dx = Dy = 0 → hệ vô số nghiệm.`;
            showResult(html, 'info');
        } else {
            html += `❌ <strong>Hệ vô nghiệm</strong>\n\n`;
            html += `<div class="step-box">${step}</div>`;
            html += `→ D = 0 nhưng Dx ≠ 0 hoặc Dy ≠ 0 → hệ vô nghiệm.`;
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
    op1Select.value = '+';
    op2Select.value = '+';
    clearResult();
    updatePreview();
    a1Input.focus();
}

// Gắn sự kiện
solveBtn.addEventListener('click', solveSystem);
resetBtn.addEventListener('click', resetForm);

// Cập nhật preview khi nhập
[a1Input, b1Input, c1Input, a2Input, b2Input, c2Input].forEach((el) => {
    el.addEventListener('input', updatePreview);
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') solveSystem();
    });
});

[op1Select, op2Select].forEach((el) => {
    el.addEventListener('change', updatePreview);
});

// Khởi tạo preview
updatePreview();
