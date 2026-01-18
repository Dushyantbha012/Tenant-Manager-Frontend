import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useViewMode, VIEW_MODES } from '../../context/ViewModeContext';
import authService from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import './Profile.css';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const { showToast } = useToast();
    const { mode, switchMode, owners, selectedOwnerId, selectOwner, loading: modeLoading } = useViewMode();

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        fullName: '',
        phone: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileForm({
                fullName: user.fullName || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            await updateProfile(profileForm);
            showToast('success', 'Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            showToast('error', 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showToast('error', 'New passwords do not match');
            return;
        }

        setPasswordLoading(true);
        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            showToast('success', 'Password changed successfully');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Failed to change password:', error);
            const msg = error.response?.data?.message || 'Failed to change password';
            showToast('error', msg);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <h1 className="page-title">My Profile</h1>

            <div className="profile-grid">
                {/* User Details Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Personal Information</h2>
                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <Input
                                label="Email Address"
                                value={user?.email || ''}
                                disabled
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                label="Full Name"
                                value={profileForm.fullName}
                                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                label="Phone Number"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                disabled={!isEditing}
                                placeholder="+91"
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Role</label>
                            <div>
                                <Badge variant="primary">{user?.userType}</Badge>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setProfileForm({
                                            fullName: user.fullName || '',
                                            phone: user.phone || '',
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={profileLoading}
                                    variant="primary"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Change Password Card */}
                {/* Only show for users not using OAuth (assuming OAuth users don't have passwords, or backend handles it) 
                    For simplicity, we show it, but backend would likely throw error if user has no password.
                    Ideally 'authProvider' check.
                */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Security</h2>
                    </div>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <Input
                                label="Current Password"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                label="New Password"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                label="Confirm New Password"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <Button
                                type="submit"
                                loading={passwordLoading}
                                variant="outline"
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </div>

                {/* View Mode Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>View Mode</h2>
                    </div>
                    <div className="view-mode-section">
                        <p className="mode-description">
                            Switch between viewing properties you own or properties you assist with.
                        </p>

                        <div className="mode-toggle-group">
                            <label className="input-label">Current Mode</label>
                            <div className="mode-buttons">
                                <button
                                    className={`mode-btn ${mode === VIEW_MODES.OWNER ? 'active' : ''}`}
                                    onClick={() => switchMode(VIEW_MODES.OWNER)}
                                    type="button"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mode-icon">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    Owner
                                </button>
                                <button
                                    className={`mode-btn ${mode === VIEW_MODES.ASSISTANT ? 'active' : ''}`}
                                    onClick={() => switchMode(VIEW_MODES.ASSISTANT)}
                                    type="button"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mode-icon">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    Assistant
                                </button>
                            </div>
                        </div>

                        {mode === VIEW_MODES.ASSISTANT && (
                            <div className="form-group">
                                <label className="input-label">Filter by Owner</label>
                                {modeLoading ? (
                                    <p className="text-muted">Loading owners...</p>
                                ) : owners.length > 0 ? (
                                    <select
                                        className="owner-select-profile"
                                        value={selectedOwnerId || ''}
                                        onChange={(e) => selectOwner(e.target.value)}
                                    >
                                        <option value="">All Owners</option>
                                        {owners.map(owner => (
                                            <option key={owner.id} value={owner.id}>
                                                {owner.fullName} ({owner.email})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-muted">You are not an assistant for any owner yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
