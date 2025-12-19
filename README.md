# Hospice Tororo EMR

An offline-first Electronic Medical Record system built for Hospice Tororo in rural Uganda. This Progressive Web App (PWA) enables nurses to conduct patient assessments even without internet connectivity, with automatic synchronization when connection is restored.

## 🎯 Features

- **Offline-First Architecture**: Works seamlessly without internet connection
- **Patient Pain Assessment**: Comprehensive 0-10 pain scale with location and type tracking
- **Quick Physical Exam**: Vital signs, consciousness level, mobility, and symptom tracking
- **Location Tracking**: Supports both ward and home-based patient care
- **Limited PII**: Uses patient initials only to protect privacy
- **Auto-Sync**: Automatically syncs data when connection is restored
- **PWA Support**: Installable on mobile and desktop devices
- **Nurse Authentication**: Simple login system to track who performs assessments

## 🏗️ Technology Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Offline Storage**: LocalForage (IndexedDB/WebSQL/LocalStorage)
- **PWA**: Vite PWA Plugin with Workbox
- **Styling**: Custom CSS with responsive design

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Getting Started

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 👥 Usage

### For Nurses

1. **Login**: Enter your name and nurse ID
2. **Start Assessment**:
   - Enter patient initials (limited PII)
   - Select location (Ward or Home)
3. **Pain Assessment**:
   - Rate pain level (0-10 scale)
   - Specify location and type
   - Add duration and notes
4. **Quick Exam**:
   - Record vital signs
   - Assess consciousness and mobility
   - Check symptoms
   - Document interventions
5. **Sync**: View and sync pending assessments when online

### Offline Mode

- All assessments are saved locally first
- Works completely offline
- Data syncs automatically when online
- Visual indicator shows connection status

## 📱 PWA Installation

### On Mobile (Android/iOS):
1. Open the app in your browser
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install"
4. The app will launch like a native app

### On Desktop (Chrome/Edge):
1. Look for the install icon in the address bar
2. Click "Install"
3. App opens in its own window

## 🔧 Configuration

### Backend Integration

To connect to your backend API, update the following files:

**`src/components/PatientWorkflow.jsx`** and **`src/components/PendingSync.jsx`**:

Replace the TODO comments with actual API calls:

```javascript
// Example API integration
const response = await fetch('YOUR_API_ENDPOINT/assessments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(fullAssessment)
});
```

### PWA Manifest

Edit **`vite.config.js`** to customize:
- App name and description
- Theme colors
- Icons (place in `/public` directory)
- Caching strategies

## 📂 Project Structure

```
/src
  /components
    - Header.jsx          # Navigation and nurse info
    - Login.jsx           # Authentication
    - PatientWorkflow.jsx # Main assessment flow
    - PainAssessment.jsx  # Pain evaluation form
    - QuickExam.jsx       # Physical examination form
    - PendingSync.jsx     # Offline sync management
  /utils
    - offlineStorage.js   # LocalForage wrapper
    - registerSW.js       # Service worker registration
  - App.jsx              # Main app component
  - main.jsx             # Entry point
  - index.css            # Global styles
```

## 🔒 Privacy & Security

- **Limited PII**: Only patient initials are collected
- **Local Storage**: Data stored encrypted in browser
- **Nurse Authentication**: Tracks who performs assessments
- **No External Analytics**: No third-party tracking

## 🌍 Localization

To add support for local languages (Luganda, Swahili, etc.):

1. Create translation files in `/src/locales/`
2. Use a library like `react-i18next`
3. Add language selector to Header component

## 🤝 Contributing

This is a humanitarian project for Hospice Tororo. Contributions are welcome!

### Development Guidelines

1. Maintain offline-first approach
2. Keep the UI simple and accessible
3. Test on low-end devices
4. Consider poor network conditions
5. Minimize data usage

## 📝 Future Enhancements

- [ ] Backend API integration
- [ ] Patient ID scanning (QR codes)
- [ ] Photo documentation
- [ ] Medication tracking
- [ ] Multi-language support
- [ ] Data export (PDF reports)
- [ ] Advanced analytics
- [ ] Voice input for notes

## 🐛 Troubleshooting

### App won't work offline
- Check if service worker is registered
- Clear browser cache and reload
- Ensure PWA is properly installed

### Data not syncing
- Check internet connection
- View browser console for errors
- Verify backend API is accessible

### Storage full
- Check browser storage limits
- Clear old synced assessments
- Run `clearOldAssessments()` utility

## 📄 License

This project is built for Hospice Tororo Uganda. Please contact the organization for usage rights.

## 👏 Acknowledgments

Built with ❤️ for the healthcare workers at Hospice Tororo who provide compassionate care to patients in rural Uganda.

---

**For Support**: Contact your system administrator or IT department.