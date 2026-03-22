import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
  // Account Settings
  const [account, setAccount] = useState({ name: '', email: '', phone: '' });
  
  // Notification Settings + Sound
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    sound: true
  });
  
  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityVisible: true,
    discoverable: false
  });
  
  // Blocked Accounts
  const [blockedAccounts, setBlockedAccounts] = useState([]);
  
  // Modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState({ show: false, account: '' });
  
  // Notification sound
  const playNotificationSound = () => {
    if (notifications.sound) {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {}); // Ignore autoplay errors
    }
  };

  // Load from localStorage
  useEffect(() => {
    if (!isOpen) return;
    
    // Account
    const savedAccount = JSON.parse(localStorage.getItem('accountSettings') || '{}');
    setAccount(savedAccount);
    
    // Notifications
    const savedNotifications = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
    setNotifications(prev => ({ ...prev, ...savedNotifications }));
    
    // Privacy
    const savedPrivacy = JSON.parse(localStorage.getItem('privacySettings') || '{}');
    setPrivacy(savedPrivacy);
    
    // Blocked
    const savedBlocked = JSON.parse(localStorage.getItem('blockedAccounts') || '[]');
    setBlockedAccounts(savedBlocked);
  }, [isOpen]);

  // Account handlers
  const handleAccountChange = (e) => {
    const updated = { ...account, [e.target.name]: e.target.value };
    setAccount(updated);
    localStorage.setItem('accountSettings', JSON.stringify(updated));
  };

  // Notification handlers
  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notificationSettings', JSON.stringify(updated));
    
    // Play sound on toggle if sound is enabled
    if (key === 'sound' && updated.sound) {
      playNotificationSound();
    }
  };

  // Privacy handlers
  const handlePrivacyToggle = (key) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    localStorage.setItem('privacySettings', JSON.stringify(updated));
  };

  // Blocked account handlers
  const handleUnblockConfirm = () => {
    const updated = blockedAccounts.filter(acc => acc !== showUnblockModal.account);
    setBlockedAccounts(updated);
    localStorage.setItem('blockedAccounts', JSON.stringify(updated));
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('userUnblocked', { 
      detail: { account: showUnblockModal.account } 
    }));
    
    setShowUnblockModal({ show: false, account: '' });
    playNotificationSound();
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Background */}
      <div className="settings-overlay" onClick={onClose}>
        <div 
          className="settings-panel" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="panel-header">
            <h2>Settings</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Scrollable Content */}
          <div className="panel-scroll">
            
            {/* Account Settings */}
            <section className="settings-section">
              <h3>Account</h3>
              <div className="input-group">
                <label>Name</label>
                <input
                  name="name"
                  value={account.name}
                  onChange={handleAccountChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={account.email}
                  onChange={handleAccountChange}
                  placeholder="your@email.com"
                />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={account.phone}
                  onChange={handleAccountChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </section>

            {/* Notifications */}
            <section className="settings-section">
              <h3>Notifications</h3>
              <label className="toggle-item">
                <div>
                  <div className="toggle-label">Email</div>
                  <div className="toggle-desc">Email notifications</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationToggle('email')}
                />
              </label>
              <label className="toggle-item">
                <div>
                  <div className="toggle-label">Push</div>
                  <div className="toggle-desc">Push notifications</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationToggle('push')}
                />
              </label>
              <label className="toggle-item">
                <div>
                  <div className="toggle-label">SMS</div>
                  <div className="toggle-desc">SMS notifications</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={() => handleNotificationToggle('sms')}
                />
              </label>
              <label className="toggle-item">
                <div>
                  <div className="toggle-label">Sound</div>
                  <div className="toggle-desc">Notification sounds</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sound}
                  onChange={() => handleNotificationToggle('sound')}
                />
              </label>
            </section>

            {/* Privacy */}
            <section className="settings-section">
              <h3>Privacy</h3>
              <label className="toggle-item">
                <div>
                  <div className="toggle-label">Profile Visible</div>
                  <div className="toggle-desc">Show profile to others</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.profileVisible}
                  onChange={() => handlePrivacyToggle('profileVisible')}
                />
              </label>
              <label className="toggle-item">
                <div>
                  <div className="toggle-label">Activity Visible</div>
                  <div className="toggle-desc">Show recent activity</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.activityVisible}
                  onChange={() => handlePrivacyToggle('activityVisible')}
                />
              </label>
              <label className="toggle-item">
                <div>
                  <div className="toggle-label">Discoverable</div>
                  <div className="toggle-desc">Appear in searches</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.discoverable}
                  onChange={() => handlePrivacyToggle('discoverable')}
                />
              </label>
            </section>

            {/* Blocked Accounts */}
            <section className="settings-section">
              <h3>Blocked Accounts</h3>
              {blockedAccounts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <p>No blocked accounts</p>
                </div>
              ) : (
                <div className="blocked-list">
                  {blockedAccounts.map((account, index) => (
                    <div key={index} className="blocked-item">
                      <div>
                        <div className="account-name">{account}</div>
                        <div className="account-muted">Blocked</div>
                      </div>
                      <button 
                        className="unblock-btn"
                        onClick={() => setShowUnblockModal({ show: true, account })}
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Logout */}
            <section className="settings-section">
              <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                Log out
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* Unblock Confirmation Modal */}
      {showUnblockModal.show && (
        <div className="modal-overlay" onClick={() => setShowUnblockModal({ show: false, account: '' })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Unblock {showUnblockModal.account}?</h3>
            <p>This account will be able to see your profile and interact with you again.</p>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowUnblockModal({ show: false, account: '' })}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUnblockConfirm}>
                Unblock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Log out?</h3>
            <p>You'll need to sign in again to access FundHub.</p>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button className="btn-danger" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
