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
 * Thực hiện phép toán giữa hai số theo toán tử được chọn.
 * @param {number} x
 * @param {number} y
 * @param {string} op - '+', '-', '*', '/'
 * @returns {number}
 */
function applyOperator(x, y, op) {
    switch (op) {
        case '+': return x + y;
        case '-': return x - y;
        case '*': return x * y;
        case '/':
            if (y === 0) {
                throw new Error('Không thể chia cho 0.');
            }
            return x / y;
        default:
            throw new Error('Phép toán không hợp lệ.');
    }
}

/**
 * Định dạng số cho đẹp (loại bỏ số 0 thừa, giữ tối đa 6 chữ số thập phân).
 */
function formatNumber(n) {
    if (!isFinite(n)) return '∞';
    const rounded = Math.round(n * 1e6) / 1e6;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
}

/**
 * Hiển thị kết quả.
 */
function showResult(html, type = 'info') {
    resultBox.className = 'result show ' + type;
    resultBox.innerHTML = html;
}

/**
 * Xóa kết quả.
 */
function clearResult() {
    resultBox.className = 'result';
    resultBox.innerHTML = '';
}

/**
 * Giải hệ phương trình:
 *   a1*x + b1*y = c1
 *   a2*x + b2*y = c2
 * Sử dụng định thức (Cramer) kết hợp phép toán do người dùng chọn
 * để minh họa phép cộng/trừ/nhân/chia.
 */
function solveSystem() {
    // Đọc giá trị, mặc định 0 nếu bỏ trống
    const a1 = parseFloat(a1Input.value) || 0;
    const b1 = parseFloat(b1Input.value) || 0;
    const c1 = parseFloat(c1Input.value) || 0;
    const a2 = parseFloat(a2Input.value) || 0;
    const b2 = parseFloat(b2Input.value) || 0;
    const c2 = parseFloat(c2Input.value) || 0;
    const op = operatorSelect.value;

    // Kiểm tra input rỗng hoàn toàn
    if (
        a1Input.value === '' && b1Input.value === '' && c1Input.value === '' &&
        a2Input.value === '' && b2Input.value === '' && c2Input.value === ''
    ) {
        showResult('⚠️ Vui lòng nhập các hệ số của hệ phương trình.', 'error');
        return;
    }

    try {
        // Định thức chính: D = a1*b2 - a2*b1
        // Dùng chính phép toán người dùng chọn để minh họa
        const a1b2 = applyOperator(a1, b2, op);
        const a2b1 = applyOperator(a2, b1, op);
        const D = applyOperator(a1b2, a2b1, '-');

        // Định thức Dx = c1*b2 - c2*b1
        const c1b2 = applyOperator(c1, b2, op);
        const c2b1 = applyOperator(c2, b1, op);
        const Dx = applyOperator(c1b2, c2b1, '-');

        // Định thức Dy = a1*c2 - a2*c1
        const a1c2 = applyOperator(a1, c2, op);
        const a2c1 = applyOperator(a2, c1, op);
        const Dy = applyOperator(a1c2, a2c1, '-');

        let html = '';

        if (D !== 0) {
            // Hệ có nghiệm duy nhất
            const x = applyOperator(Dx, D, '/');
            const y = applyOperator(Dy, D, '/');

            html += `✅ <strong>Hệ có nghiệm duy nhất</strong>\n`;
            html += `D = ${formatNumber(D)}, Dx = ${formatNumber(Dx)}, Dy = ${formatNumber(Dy)}\n`;
            html += `<span class="highlight">x = ${formatNumber(x)}</span>\n`;
            html += `<span class="highlight">y = ${formatNumber(y)}</span>`;
            showResult(html, 'success');
        } else {
            // D = 0
            if (Dx === 0 && Dy === 0) {
                html += `ℹ️ <strong>Hệ có vô số nghiệm</strong>\n`;
                html += `(D = Dx = Dy = 0). Hệ phương trình có vô số nghiệm thỏa mãn một trong hai phương trình.`;
                showResult(html, 'info');
            } else {
                html += `❌ <strong>Hệ vô nghiệm</strong>\n`;
                html += `(D = 0 nhưng Dx ≠ 0 hoặc Dy ≠ 0). Hệ phương trình không có nghiệm.`;
                showResult(html, 'error');
            }
        }
    } catch (err) {
        showResult('❌ Lỗi: ' + err.message, 'error');
    }
}

/**
 * Reset toàn bộ form.
 */
function resetForm() {
    [a1Input, b1Input, c1Input, a2Input, b2Input, c2Input].forEach((el) => {
        el.value = '';
    });
    operatorSelect.value = '+';
    clearResult();
    a1Input.focus();
}

// Gắn sự kiện
solveBtn.addEventListener('click', solveSystem);
resetBtn.addEventListener('click', resetForm);

// Nhấn Enter trong ô input cũng giải
[a1Input, b1Input, c1Input, a2Input, b2Input, c2Input].forEach((el) => {
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') solveSystem();
    });
});
