// Data Storage
let students = JSON.parse(localStorage.getItem('students')) || [];
let staff = JSON.parse(localStorage.getItem('staff')) || [];
let currentStudentId = null;
let currentStaffId = null;

// Calculator State
let calcValue = '0';
let calcPrevValue = null;
let calcOperation = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initStudentSection();
    initStaffSection();
    initCalculator();
    initForms();
    loadStudents();
    loadStaff();
});

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            if (sectionId === 'calculator') return; // Calculator is handled separately
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show section
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Student Section
function initStudentSection() {
    // Search
    document.getElementById('studentSearch').addEventListener('input', (e) => {
        filterAndDisplayStudents();
    });
    
    // Filter button
    document.getElementById('filterBtn').addEventListener('click', () => {
        document.getElementById('filterPanel').classList.toggle('active');
    });
    
    // Apply filter
    document.getElementById('applyFilterBtn').addEventListener('click', () => {
        filterAndDisplayStudents();
    });
    
    // Add student button
    document.getElementById('addStudentBtn').addEventListener('click', () => {
        openStudentForm();
    });
    
    // Filter changes
    document.getElementById('filterStatus').addEventListener('change', filterAndDisplayStudents);
    document.getElementById('filterPayment').addEventListener('change', filterAndDisplayStudents);
}

function loadStudents() {
    filterAndDisplayStudents();
}

function filterAndDisplayStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterPayment = document.getElementById('filterPayment').value;
    
    let filtered = students.filter(student => {
        // Search filter
        const matchesSearch = !searchTerm || 
            student.name.toLowerCase().includes(searchTerm) ||
            student.roll.toLowerCase().includes(searchTerm) ||
            (student.studentId && student.studentId.toLowerCase().includes(searchTerm));
        
        // Status filter
        const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
        
        // Payment filter
        let matchesPayment = true;
        if (filterPayment !== 'all') {
            const hasPayment = student.payments && student.payments.length > 0;
            const lastPayment = hasPayment ? student.payments[student.payments.length - 1] : null;
            matchesPayment = lastPayment ? lastPayment.status === filterPayment : filterPayment === 'pending';
        }
        
        return matchesSearch && matchesStatus && matchesPayment;
    });
    
    displayStudents(filtered);
}

function displayStudents(studentsToDisplay) {
    const container = document.getElementById('studentCards');
    
    if (studentsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>No students found</p>
                <small>Add your first student or adjust filters</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = studentsToDisplay.map(student => {
        const lastPayment = student.payments && student.payments.length > 0 
            ? student.payments[student.payments.length - 1] 
            : null;
        const paymentStatus = lastPayment ? lastPayment.status : 'pending';
        
        return `
            <div class="student-card" onclick="openStudentProfile('${student.id}')">
                <div class="student-photo">
                    ${student.photo ? `<img src="${student.photo}" alt="${student.name}">` : '<i class="fas fa-user"></i>'}
                </div>
                <div class="student-info">
                    <h3>${student.name}</h3>
                    <p>Roll: ${student.roll} | Class: ${student.class}</p>
                    <div class="student-tags">
                        <span class="tag tag-${student.status}">${student.status === 'present' ? 'Present' : 'Ex-Student'}</span>
                        <span class="tag tag-${paymentStatus}">${paymentStatus === 'complete' ? 'Paid' : 'Pending'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openStudentForm(studentId = null) {
    const modal = document.getElementById('studentFormModal');
    const form = document.getElementById('studentForm');
    const title = document.getElementById('studentFormTitle');
    
    form.reset();
    document.getElementById('photoPreview').innerHTML = '<i class="fas fa-user"></i>';
    
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        
        title.textContent = 'Edit Student';
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentRoll').value = student.roll;
        document.getElementById('studentClass').value = student.class;
        document.getElementById('studentGroup').value = student.group || '';
        document.getElementById('studentPhone').value = student.phone;
        document.getElementById('studentPhone2').value = student.phone2 || '';
        document.getElementById('studentIdNumber').value = student.studentId || '';
        document.getElementById('fatherName').value = student.fatherName || '';
        document.getElementById('fatherPhone1').value = student.fatherPhone1 || '';
        document.getElementById('fatherPhone2').value = student.fatherPhone2 || '';
        document.getElementById('fatherJob').value = student.fatherJob || '';
        document.getElementById('studentAddress').value = student.address || '';
        document.getElementById('moreDetails').value = student.notes || '';
        document.getElementById('studentStatus').value = student.status;
        
        if (student.photo) {
            document.getElementById('photoPreview').innerHTML = `<img src="${student.photo}" alt="${student.name}">`;
        }
    } else {
        title.textContent = 'Add New Student';
        document.getElementById('studentId').value = '';
    }
    
    modal.classList.add('active');
}

function openStudentProfile(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    currentStudentId = studentId;
    
    // Update profile header
    document.getElementById('profilePhotoLarge').innerHTML = student.photo 
        ? `<img src="${student.photo}" alt="${student.name}">` 
        : '<i class="fas fa-user"></i>';
    document.getElementById('profileName').textContent = student.name;
    document.getElementById('profileRollClass').textContent = `Roll: ${student.roll} | Class: ${student.class}`;
    document.getElementById('profilePhone').textContent = student.phone;
    
    // Update details
    document.getElementById('profileFatherName').textContent = student.fatherName || 'N/A';
    document.getElementById('profileFatherJob').textContent = student.fatherJob || 'N/A';
    document.getElementById('profileAddress').textContent = student.address || 'N/A';
    document.getElementById('profileNotes').textContent = student.notes || 'N/A';
    
    // Update payment history
    const historyList = document.getElementById('paymentHistoryList');
    if (!student.payments || student.payments.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No payment history</p>';
    } else {
        historyList.innerHTML = student.payments.map(payment => `
            <div class="payment-item">
                <div class="payment-item-header">
                    <h4>${payment.month}</h4>
                    <span class="tag tag-${payment.status}">${payment.status === 'complete' ? 'Paid' : 'Pending'}</span>
                </div>
                <p>Apartment: ৳${payment.apartment || 0}</p>
                <p>Tuition: ৳${payment.tuition || 0}</p>
                <p>Food: ৳${payment.food || 0}</p>
                <p><strong>Total: ৳${payment.total}</strong></p>
                ${payment.date ? `<p><small>Paid on: ${new Date(payment.date).toLocaleString()}</small></p>` : ''}
            </div>
        `).join('');
    }
    
    document.getElementById('studentProfileModal').classList.add('active');
}

// Student Form Handling
function initForms() {
    // Photo upload preview
    document.getElementById('profilePhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('photoPreview').innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Student form submit
    document.getElementById('studentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveStudent();
    });
    
    // Student form close buttons
    document.getElementById('closeStudentForm').addEventListener('click', () => {
        document.getElementById('studentFormModal').classList.remove('active');
    });
    document.getElementById('cancelStudentForm').addEventListener('click', () => {
        document.getElementById('studentFormModal').classList.remove('active');
    });
    
    // Profile modal buttons
    document.getElementById('closeProfile').addEventListener('click', () => {
        document.getElementById('studentProfileModal').classList.remove('active');
    });
    
    document.getElementById('sendNoticeBtn').addEventListener('click', () => {
        sendNotice(currentStudentId);
    });
    
    document.getElementById('addPaymentBtn').addEventListener('click', () => {
        openPaymentForm(currentStudentId);
    });
    
    document.getElementById('editStudentBtn').addEventListener('click', () => {
        document.getElementById('studentProfileModal').classList.remove('active');
        openStudentForm(currentStudentId);
    });
    
    // Payment form
    document.getElementById('paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        savePayment();
    });
    
    // Payment form auto-calculation
    ['foodDays', 'foodRate', 'apartmentBill', 'tuitionFee'].forEach(id => {
        document.getElementById(id).addEventListener('input', calculatePaymentTotal);
    });
    
    // Payment form close
    document.getElementById('closePaymentForm').addEventListener('click', () => {
        document.getElementById('paymentFormModal').classList.remove('active');
    });
    document.getElementById('cancelPaymentForm').addEventListener('click', () => {
        document.getElementById('paymentFormModal').classList.remove('active');
    });
    
    document.getElementById('printReceiptBtn').addEventListener('click', () => {
        printReceipt();
    });
    
    // Staff form
    document.getElementById('staffForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveStaff();
    });
    
    document.getElementById('closeStaffForm').addEventListener('click', () => {
        document.getElementById('staffFormModal').classList.remove('active');
    });
    document.getElementById('cancelStaffForm').addEventListener('click', () => {
        document.getElementById('staffFormModal').classList.remove('active');
    });
    
    // Staff detail modal
    document.getElementById('closeStaffDetail').addEventListener('click', () => {
        document.getElementById('staffDetailModal').classList.remove('active');
    });
    
    document.getElementById('editStaffBtn').addEventListener('click', () => {
        document.getElementById('staffDetailModal').classList.remove('active');
        openStaffForm(currentStaffId);
    });
    
    document.getElementById('deleteStaffBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this record?')) {
            deleteStaff(currentStaffId);
        }
    });
    
    // WhatsApp buttons
    document.querySelectorAll('.btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', function() {
            const phoneInputId = this.getAttribute('data-phone');
            const phoneNumber = document.getElementById(phoneInputId).value;
            if (phoneNumber) {
                openWhatsApp(phoneNumber);
            } else {
                showToast('Please enter a phone number first');
            }
        });
    });
}

function saveStudent() {
    const studentId = document.getElementById('studentId').value;
    const photoInput = document.getElementById('profilePhoto');
    const photoPreview = document.getElementById('photoPreview').querySelector('img');
    
    const studentData = {
        id: studentId || generateId(),
        name: document.getElementById('studentName').value,
        roll: document.getElementById('studentRoll').value,
        class: document.getElementById('studentClass').value,
        group: document.getElementById('studentGroup').value,
        phone: document.getElementById('studentPhone').value,
        phone2: document.getElementById('studentPhone2').value,
        studentId: document.getElementById('studentIdNumber').value,
        fatherName: document.getElementById('fatherName').value,
        fatherPhone1: document.getElementById('fatherPhone1').value,
        fatherPhone2: document.getElementById('fatherPhone2').value,
        fatherJob: document.getElementById('fatherJob').value,
        address: document.getElementById('studentAddress').value,
        notes: document.getElementById('moreDetails').value,
        status: document.getElementById('studentStatus').value,
        photo: photoPreview ? photoPreview.src : null,
        createdAt: studentId ? students.find(s => s.id === studentId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (studentId) {
        // Update existing student
        const index = students.findIndex(s => s.id === studentId);
        studentData.payments = students[index].payments || [];
        students[index] = studentData;
        showToast('Student updated successfully');
    } else {
        // Add new student
        studentData.payments = [];
        students.push(studentData);
        showToast('Student added successfully');
    }
    
    localStorage.setItem('students', JSON.stringify(students));
    document.getElementById('studentFormModal').classList.remove('active');
    loadStudents();
}

function openPaymentForm(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentStudentId').value = studentId;
    
    // Set current month as default
    const now = new Date();
    const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('paymentMonth').value = monthString;
    
    calculatePaymentTotal();
    document.getElementById('paymentFormModal').classList.add('active');
}

function calculatePaymentTotal() {
    const foodDays = parseFloat(document.getElementById('foodDays').value) || 0;
    const foodRate = parseFloat(document.getElementById('foodRate').value) || 0;
    const foodBill = foodDays * foodRate;
    
    document.getElementById('foodBill').value = foodBill;
    
    const apartment = parseFloat(document.getElementById('apartmentBill').value) || 0;
    const tuition = parseFloat(document.getElementById('tuitionFee').value) || 0;
    const total = apartment + tuition + foodBill;
    
    document.getElementById('totalAmount').value = total;
}

function savePayment() {
    const studentId = document.getElementById('paymentStudentId').value;
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const payment = {
        id: generateId(),
        month: document.getElementById('paymentMonth').value,
        apartment: parseFloat(document.getElementById('apartmentBill').value) || 0,
        tuition: parseFloat(document.getElementById('tuitionFee').value) || 0,
        food: parseFloat(document.getElementById('foodBill').value) || 0,
        total: parseFloat(document.getElementById('totalAmount').value) || 0,
        status: document.getElementById('paymentStatus').value,
        date: new Date().toISOString()
    };
    
    if (!student.payments) {
        student.payments = [];
    }
    student.payments.push(payment);
    
    localStorage.setItem('students', JSON.stringify(students));
    document.getElementById('paymentFormModal').classList.remove('active');
    showToast('Payment saved successfully');
    
    // Refresh profile if open
    if (currentStudentId === studentId) {
        openStudentProfile(studentId);
    }
    loadStudents();
}

function printReceipt() {
    const studentId = document.getElementById('paymentStudentId').value;
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const month = document.getElementById('paymentMonth').value;
    const apartment = document.getElementById('apartmentBill').value;
    const tuition = document.getElementById('tuitionFee').value;
    const food = document.getElementById('foodBill').value;
    const total = document.getElementById('totalAmount').value;
    
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #2563eb; margin: 0; }
                .info { margin-bottom: 20px; }
                .info p { margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f8fafc; }
                .total { font-size: 1.2em; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; color: #64748b; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Science Ideal Home</h1>
                <p>Payment Receipt</p>
            </div>
            <div class="info">
                <p><strong>Student Name:</strong> ${student.name}</p>
                <p><strong>Roll:</strong> ${student.roll}</p>
                <p><strong>Class:</strong> ${student.class}</p>
                <p><strong>Month:</strong> ${month}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
                <tr>
                    <td>Apartment Bill</td>
                    <td>৳${apartment}</td>
                </tr>
                <tr>
                    <td>Tuition Fee</td>
                    <td>৳${tuition}</td>
                </tr>
                <tr>
                    <td>Food Bill</td>
                    <td>৳${food}</td>
                </tr>
                <tr class="total">
                    <td>Total</td>
                    <td>৳${total}</td>
                </tr>
            </table>
            <div class="footer">
                <p>Thank you for your payment!</p>
            </div>
        </body>
        </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
}

function sendNotice(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const message = `Dear ${student.name}, this is a reminder about your pending payment. Please contact us for details. - Science Ideal Home`;
    
    // Show options
    if (confirm('Send notice via WhatsApp?')) {
        openWhatsApp(student.phone, message);
    }
}

function openWhatsApp(phoneNumber, message = '') {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}${message ? '?text=' + encodeURIComponent(message) : ''}`;
    window.open(url, '_blank');
}

// Staff Section
function initStaffSection() {
    document.getElementById('addStaffBtn').addEventListener('click', () => {
        openStaffForm();
    });
}

function loadStaff() {
    displayStaff(staff);
}

function displayStaff(staffToDisplay) {
    const container = document.getElementById('staffCards');
    
    if (staffToDisplay.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>No staff or expenses found</p>
                <small>Add your first staff member or expense</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = staffToDisplay.map(item => `
        <div class="staff-card" onclick="openStaffDetail('${item.id}')">
            <h3>${item.title}</h3>
            <p>${item.description || 'No description'}</p>
            <div class="staff-amount">৳${item.amount}</div>
            <div class="staff-footer">
                <span class="tag tag-${item.status === 'paid' ? 'complete' : 'pending'}">
                    ${item.status === 'paid' ? 'Paid' : 'Not Paid'}
                </span>
                ${item.phone ? `<span><i class="fas fa-phone"></i> ${item.phone}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function openStaffForm(staffId = null) {
    const modal = document.getElementById('staffFormModal');
    const form = document.getElementById('staffForm');
    const title = document.getElementById('staffFormTitle');
    
    form.reset();
    
    if (staffId) {
        const staffMember = staff.find(s => s.id === staffId);
        if (!staffMember) return;
        
        title.textContent = 'Edit Staff/Expense';
        document.getElementById('staffId').value = staffMember.id;
        document.getElementById('staffTitle').value = staffMember.title;
        document.getElementById('staffDescription').value = staffMember.description || '';
        document.getElementById('staffAmount').value = staffMember.amount;
        document.getElementById('staffPhone').value = staffMember.phone || '';
        document.getElementById('staffStatus').value = staffMember.status;
        document.getElementById('staffMonth').value = staffMember.month || '';
    } else {
        title.textContent = 'Add Staff/Expense';
        document.getElementById('staffId').value = '';
        
        // Set current month as default
        const now = new Date();
        const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        document.getElementById('staffMonth').value = monthString;
    }
    
    modal.classList.add('active');
}

function openStaffDetail(staffId) {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;
    
    currentStaffId = staffId;
    
    document.getElementById('staffDetailTitle').textContent = staffMember.title;
    document.getElementById('staffDetailPhone').textContent = staffMember.phone || 'No phone';
    document.getElementById('staffDetailDescription').textContent = staffMember.description || 'No description';
    document.getElementById('staffDetailAmount').textContent = `৳${staffMember.amount}`;
    document.getElementById('staffDetailStatus').innerHTML = `<span class="tag tag-${staffMember.status === 'paid' ? 'complete' : 'pending'}">${staffMember.status === 'paid' ? 'Paid' : 'Not Paid'}</span>`;
    document.getElementById('staffDetailMonth').textContent = staffMember.month || 'N/A';
    
    document.getElementById('staffDetailModal').classList.add('active');
}

function saveStaff() {
    const staffId = document.getElementById('staffId').value;
    
    const staffData = {
        id: staffId || generateId(),
        title: document.getElementById('staffTitle').value,
        description: document.getElementById('staffDescription').value,
        amount: parseFloat(document.getElementById('staffAmount').value),
        phone: document.getElementById('staffPhone').value,
        status: document.getElementById('staffStatus').value,
        month: document.getElementById('staffMonth').value,
        createdAt: staffId ? staff.find(s => s.id === staffId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (staffId) {
        const index = staff.findIndex(s => s.id === staffId);
        staff[index] = staffData;
        showToast('Record updated successfully');
    } else {
        staff.push(staffData);
        showToast('Record added successfully');
    }
    
    localStorage.setItem('staff', JSON.stringify(staff));
    document.getElementById('staffFormModal').classList.remove('active');
    loadStaff();
}

function deleteStaff(staffId) {
    staff = staff.filter(s => s.id !== staffId);
    localStorage.setItem('staff', JSON.stringify(staff));
    document.getElementById('staffDetailModal').classList.remove('active');
    loadStaff();
    showToast('Record deleted successfully');
}

// Calculator
function initCalculator() {
    document.getElementById('calculatorBtn').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('calculatorModal').classList.add('active');
    });
    
    document.getElementById('closeCalculator').addEventListener('click', () => {
        document.getElementById('calculatorModal').classList.remove('active');
    });
    
    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            const action = this.getAttribute('data-action');
            
            if (number !== null) {
                handleCalculatorNumber(number);
            } else if (action) {
                handleCalculatorAction(action);
            }
        });
    });
}

function handleCalculatorNumber(num) {
    if (calcValue === '0' || calcValue === 'Error') {
        calcValue = num;
    } else {
        calcValue += num;
    }
    updateCalculatorDisplay();
}

function handleCalculatorAction(action) {
    switch(action) {
        case 'clear':
            calcValue = '0';
            calcPrevValue = null;
            calcOperation = null;
            break;
        case 'delete':
            calcValue = calcValue.length > 1 ? calcValue.slice(0, -1) : '0';
            break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            if (calcPrevValue !== null && calcOperation !== null) {
                calculate();
            }
            calcPrevValue = parseFloat(calcValue);
            calcOperation = action;
            calcValue = '0';
            break;
        case 'equals':
            calculate();
            calcPrevValue = null;
            calcOperation = null;
            break;
    }
    updateCalculatorDisplay();
}

function calculate() {
    if (calcPrevValue === null || calcOperation === null) return;
    
    const current = parseFloat(calcValue);
    let result;
    
    switch(calcOperation) {
        case 'add':
            result = calcPrevValue + current;
            break;
        case 'subtract':
            result = calcPrevValue - current;
            break;
        case 'multiply':
            result = calcPrevValue * current;
            break;
        case 'divide':
            result = current !== 0 ? calcPrevValue / current : 'Error';
            break;
    }
    
    calcValue = result.toString();
}

function updateCalculatorDisplay() {
    document.getElementById('calcDisplay').textContent = calcValue;
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modals on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
