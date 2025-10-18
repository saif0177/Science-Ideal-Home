# 🏫 Science Ideal Home - Hostel Management System

A comprehensive, mobile-first hostel management system designed for managing students, staff, expenses, and payments efficiently.

## ✨ Features

### 🧭 Navigation
- **Dashboard**: Summary view (placeholder for future statistics)
- **Student Management**: Complete student records and payment tracking
- **Staff/Expense Management**: Track salaries and expenses
- **Calculator**: Built-in calculator for quick calculations

### 👨‍🎓 Student Management
- **Search & Filter**: Search by name, roll, or student ID with advanced filtering
- **Student Profiles**: Detailed student information with profile photos
- **Payment Tracking**: Complete payment history with status tracking
- **Payment Management**: Add apartment bills, tuition fees, and food bills
- **Auto-calculation**: Food bills calculated automatically (days × rate)
- **Receipt Generation**: Print professional payment receipts
- **Status Tracking**: Present/Ex-student status with payment status indicators
- **WhatsApp Integration**: Direct WhatsApp messaging for notifications

### 👨‍🏫 Staff & Expense Management
- **Staff Records**: Manage staff information and salaries
- **Expense Tracking**: Track all hostel-related expenses
- **Payment Status**: Monitor paid/unpaid status
- **Contact Information**: Store phone numbers with WhatsApp integration

### 🧮 Calculator
- Full-featured calculator with:
  - Basic operations (addition, subtraction, multiplication, division)
  - Clear and delete functions
  - Clean, modern interface

### 💾 Data Management
- **Local Storage**: All data stored securely in browser's localStorage
- **Persistent Data**: Data persists across sessions
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices
- **Touch-Friendly**: Large buttons and intuitive interface
- **Clean UI**: Modern, professional design with smooth animations
- **Easy Navigation**: Bottom navigation bar for quick access

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. Start adding students and staff members
3. Track payments and expenses
4. Use the calculator for quick calculations

## 📖 Usage Guide

### Adding a Student
1. Click the **+** button in the Student section
2. Fill in student details (name, roll, class, etc.)
3. Upload a profile photo (optional)
4. Add parent information and contact details
5. Click "Save Student"

### Recording a Payment
1. Open a student's profile
2. Click the "Payment" button
3. Enter apartment bill, tuition fee, and food details
4. Food bill calculates automatically
5. Choose payment status (Complete/Pending)
6. Save or print receipt

### Managing Staff/Expenses
1. Navigate to Staff/Expense section
2. Click "Add New"
3. Enter title, description, and amount
4. Add phone number if applicable
5. Set payment status
6. Save record

### Using the Calculator
1. Click the Calculator icon in the navigation
2. Perform calculations as needed
3. Close when done

## 🎨 Design Features

- **Color Scheme**: Professional blue gradient theme
- **Typography**: Clean, readable fonts (Segoe UI)
- **Icons**: Font Awesome icons for visual clarity
- **Cards**: Shadow-based card design for content organization
- **Animations**: Smooth transitions and hover effects
- **Tags**: Color-coded status indicators

## 💡 Key Functionality

### Student Search & Filter
- Real-time search across name, roll, and student ID
- Filter by status (Present/Ex-student)
- Filter by payment status (Complete/Pending)
- Combined filtering for precise results

### Payment System
- Monthly payment tracking
- Multiple bill types:
  - Apartment bills
  - Tuition fees
  - Food bills (with day-based calculation)
- Automatic total calculation
- Payment history with timestamps
- Receipt printing functionality

### WhatsApp Integration
- Direct WhatsApp messaging from student profiles
- WhatsApp buttons in contact forms
- Automatic message formatting for payment reminders
- Opens WhatsApp Web or app automatically

### Data Persistence
- All data stored in browser's localStorage
- Automatic saving on form submission
- Data survives page refreshes
- JSON-based storage format

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Vanilla JavaScript for functionality
- **Font Awesome**: Icon library
- **LocalStorage API**: Data persistence

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📊 Data Structure

### Student Object
```javascript
{
  id: string,
  name: string,
  roll: string,
  class: string,
  group: string,
  phone: string,
  phone2: string,
  studentId: string,
  fatherName: string,
  fatherPhone1: string,
  fatherPhone2: string,
  fatherJob: string,
  address: string,
  notes: string,
  status: 'present' | 'ex',
  photo: string (base64),
  payments: Array,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Payment Object
```javascript
{
  id: string,
  month: string (YYYY-MM),
  apartment: number,
  tuition: number,
  food: number,
  total: number,
  status: 'complete' | 'pending',
  date: timestamp
}
```

### Staff Object
```javascript
{
  id: string,
  title: string,
  description: string,
  amount: number,
  phone: string,
  status: 'paid' | 'unpaid',
  month: string (YYYY-MM),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔮 Future Enhancements

- [ ] Dashboard statistics (total students, monthly income, expenses)
- [ ] Google Drive integration for cloud backup
- [ ] Automatic monthly notification system
- [ ] SMS integration
- [ ] Dark mode toggle
- [ ] Export data to Excel/PDF
- [ ] Advanced reporting and analytics
- [ ] Multi-user authentication
- [ ] Attendance tracking
- [ ] Meal planning system

## 📝 Notes

- This system is designed for mobile view but works on all screen sizes
- Data is stored locally - backup regularly by exporting
- WhatsApp integration requires WhatsApp to be installed on the device
- Receipt printing uses browser's print functionality
- All currency amounts are in BDT (৳)

## 🤝 Support

For issues or feature requests, please refer to the documentation or contact the administrator.

## 📄 License

This project is designed for Science Ideal Home hostel management purposes.

---

**Science Ideal Home** - Modern Hostel Management Made Easy
