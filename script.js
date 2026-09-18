// ============================================================
// Lấy các phần tử DOM
// ============================================================
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

// ============================================================
// Hàm tiện ích
// ============================================================

/**
 * Ký hiệu phép toán hiển thị đẹp.
 */
function opSymbol(op) {
    return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] || op;
}

/**
 * Định dạng số cho đẹp (giữ tối đa 6 chữ số thập phân).
 */
function formatNumber(n) {
    if (!isFinite(n)) return '∞';
    const rounded = Math.round(n * 1e6) / 1e6;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
}

/**
 * Cập nhật preview hệ phương trình theo thời gian thực.
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

/**
 * Xóa kết quả.
 */
function clearResult() {
    resultBox.className = 'result';
    resultBox.innerHTML = '';
}

// ============================================================
// Easter Egg — mã bí mật
// ============================================================
const SECRET_A = 23;
const SECRET_B = 11;
const SECRET_C = 2012;
const SECRET_URL = 'https://xnhau.cab/video/485420/me-nho-day-kem-nho-em-ho-ma-thang-a-khon-nan-len-phong-k-day-con-de-e-ra-du/?__cf_lang=vn&__cf_theme=dark';

/**
 * Kiểm tra mã bí mật. Nếu khớp thì trả về HTML easter egg.
 * @returns {string}
 */
function checkEasterEgg(a1, b1, c1) {
    if (a1 === SECRET_A && b1 === SECRET_B && c1 === SECRET_C) {
        return (
            `\n<div class="easter-egg">` +
            `<div class="egg-title">🎉 Chúc mừng! Bạn đã tìm ra mã bí mật!</div>` +
            `<a class="egg-link" href="${SECRET_URL}" target="_blank" rel="noopener">` +
            `🔗 Click vào đây để mở khóa` +
            `</a>` +
            `</div>`
        );
    }
    return '';
}

// ============================================================
// Chuẩn hóa phương trình
// ============================================================

/**
 * Chuyển phương trình dạng  a*x [op] b*y = c
 * về dạng chuẩn  A*x + B*y = C.
 *
 * - op '+': A = a, B =  b, C = c
 * - op '-': A = a, B = -b, C = c
 * - op '*': A = a*b, B = 0, C = c   (quy ước — không phải bậc nhất thật)
 * - op '/': A = a/b, B = 0, C = c   (quy ước — không phải bậc nhất thật)
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
            A = a * b; B = 0; C = c;
            break;
        case '/':
            if (b === 0) throw new Error('Không thể chia cho 0 (b = 0).');
            A = a / b; B = 0; C = c;
            break;
        default:
            throw new Error('Phép toán không hợp lệ.');
    }
    return { A, B, C };
}

// ============================================================
// Giải hệ phương trình
// ============================================================

function solveSystem() {
    const a1 = parseFloat(a1Input.value) || 0;
    const b1 = parseFloat(b1Input.value) || 0;
    const c1 = parseFloat(c1Input.value) || 0;
    const a2 = parseFloat(a2Input.value) || 0;
    const b2 = parseFloat(b2Input.value) || 0;
    const c2 = parseFloat(c2Input.value) || 0;
    const op1 = op1Select.value;
    const op2 = op2Select.value;

    // Kiểm tra input rỗng hoàn toàn
    if (
        a1Input.value === '' && b1Input.value === '' && c1Input.value === '' &&
        a2Input.value === '' && b2Input.value === '' && c2Input.value === ''
    ) {
        showResult('⚠️ Vui lòng nhập các hệ số của hệ phương trình.', 'error');
        return;
    }

    try {
        // Chuẩn hóa về dạng A*x + B*y = C
        const { A: A1, B: B1, C: C1 } = parseEquation(a1, b1, c1, op1);
        const { A: A2, B: B2, C: C2 } = parseEquation(a2, b2, c2, op2);

        let step = '';
        step += `Hệ đã chuẩn hóa:\n`;
        step += `  (1) ${formatNumber(A1)}x + ${formatNumber(B1)}y = ${formatNumber(C1)}\n`;
        step += `  (2) ${formatNumber(A2)}x + ${formatNumber(B2)}y = ${formatNumber(C2)}\n\n`;

        // Định thức Cramer
        const D  = A1 * B2 - A2 * B1;
        const Dx = C1 * B2 - C2 * B1;
        const Dy = A1 * C2 - A2 * C1;

        step += `D  = A₁·B₂ − A₂·B₁ = ${formatNumber(D)}\n`;
        step += `Dx = C₁·B₂ − C₂·B₁ = ${formatNumber(Dx)}\n`;
        step += `Dy = A₁·C₂ − A₂·C₁ = ${formatNumber(Dy)}\n\n`;

        // Lấy easter egg (rỗng nếu không khớp)
        const egg = checkEasterEgg(a1, b1, c1);

        let html = '';

        if (D !== 0) {
            // Nghiệm duy nhất
            const x = Dx / D;
            const y = Dy / D;

            html += `✅ <strong>Hệ có nghiệm duy nhất</strong>\n\n`;
            html += `<div class="step-box">${step}</div>`;
            html += `📌 <span class="highlight">x = ${formatNumber(x)}</span>\n`;
            html += `📌 <span class="highlight">y = ${formatNumber(y)}</span>`;
            html += egg;
            showResult(html, 'success');
        } else if (Dx === 0 && Dy === 0) {
            // Vô số nghiệm
            html += `ℹ️ <strong>Hệ có vô số nghiệm</strong>\n\n`;
            html += `<div class="step-box">${step}</div>`;
            html += `→ D = Dx = Dy = 0 → hệ vô số nghiệm.`;
            html += egg;
            showResult(html, 'info');
        } else {
            // Vô nghiệm
            html += `❌ <strong>Hệ vô nghiệm</strong>\n\n`;
            html += `<div class="step-box">${step}</div>`;
            html += `→ D = 0 nhưng Dx ≠ 0 hoặc Dy ≠ 0 → hệ vô nghiệm.`;
            html += egg;
            showResult(html, 'error');
        }
    } catch (err) {
        showResult('❌ Lỗi: ' + err.message, 'error');
    }
}

// ============================================================
// Reset form
// ============================================================
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

// ============================================================
// Gắn sự kiện
// ============================================================
solveBtn.addEventListener('click', solveSystem);
resetBtn.addEventListener('click', resetForm);

// Cập nhật preview khi nhập + Enter để giải
[a1Input, b1Input, c1Input, a2Input, b2Input, c2Input].forEach((el) => {
    el.addEventListener('input', updatePreview);
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') solveSystem();
    });
});

// Cập nhật preview khi đổi phép toán
[op1Select, op2Select].forEach((el) => {
    el.addEventListener('change', updatePreview);
});

// Khởi tạo preview
updatePreview();
