import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import tenantService from '../../services/tenantService';
import propertyService from '../../services/propertyService';
import roomService from '../../services/roomService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import './TenantForm.css';

/**
 * TenantForm Page
 * Handles "Move-in" flow (Add Tenant) and "Edit Tenant"
 */
export default function TenantForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchParams] = useSearchParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Step for Move-in Wizard: 1 = Room Selection, 2 = Tenant Details, 3 = Agreement
    const [step, setStep] = useState(1);

    // Filter Data
    const [properties, setProperties] = useState([]);
    const [vacantRooms, setVacantRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        // Room Selection
        propertyId: '',
        roomId: '',

        // Tenant Details
        fullName: '',
        userId: '', // Optional: Link to a registered user
        email: '',
        phone: '',
        permanentAddress: '',
        idProofType: 'AADHAR',
        idProofNumber: '',
        emergencyContactName: '',
        emergencyContactPhone: '',

        // Agreement Details
        rentAmount: '',
        securityDeposit: '',
        moveInDate: new Date().toISOString().split('T')[0],
        paymentDueDay: 5,
        leaseDurationMonths: 11
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            fetchTenantData();
        } else {
            fetchInitialData();
        }
    }, [id]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Check for pre-fill params
            const prefillRoomId = searchParams.get('roomId');
            const prefillPropertyId = searchParams.get('propertyId');

            // Fetch base data
            const promises = [
                propertyService.getAll(),
                roomService.getVacant()
            ];

            // If we have a specific room ID, fetch its details too
            if (prefillRoomId) {
                promises.push(roomService.getById(prefillRoomId));
            }

            const results = await Promise.all(promises);
            const propRes = results[0];
            const roomsRes = results[1];
            const targetRoomRes = prefillRoomId ? results[2] : null;

            const allProperties = propRes.data || [];
            let rawVacantRooms = roomsRes.data || [];

            // Helper to safe extract property ID from potentially nested structure
            const getRoomPropertyId = (room) => {
                // If it's already at top level
                if (room.propertyId) return parseInt(room.propertyId);
                // If nested in floor -> property
                if (room.floor?.property?.id) return parseInt(room.floor.property.id);
                // If nested in floor -> propertyId (unlikely but possible in some DTOs)
                if (room.floor?.propertyId) return parseInt(room.floor.propertyId);
                return null;
            };

            // Normalize vacant rooms to include propertyId at top level
            let allVacantRooms = rawVacantRooms.map(room => ({
                ...room,
                propertyId: getRoomPropertyId(room)
            }));

            // If target room exists but wasn't in vacant list (e.g. API lag or cache), add it
            if (targetRoomRes?.data) {
                const targetRoom = targetRoomRes.data;
                const targetPropertyId = getRoomPropertyId(targetRoom);

                // Normalize target room
                const normalizedTargetRoom = {
                    ...targetRoom,
                    propertyId: targetPropertyId
                };

                const exists = allVacantRooms.find(r => r.id === normalizedTargetRoom.id);
                if (!exists) {
                    allVacantRooms = [...allVacantRooms, normalizedTargetRoom];
                }

                // Set form data for room pre-fill
                if (targetPropertyId) {
                    setFormData(prev => ({
                        ...prev,
                        propertyId: targetPropertyId,
                        roomId: normalizedTargetRoom.id,
                        rentAmount: normalizedTargetRoom.rentAmount || ''
                    }));
                }
            } else if (prefillPropertyId) {
                // Set form data for property pre-fill
                setFormData(prev => ({
                    ...prev,
                    propertyId: parseInt(prefillPropertyId)
                }));
            }

            setProperties(allProperties);
            setVacantRooms(allVacantRooms);

        } catch (error) {
            console.error('Failed to load form data:', error);
            showToast('error', 'Failed to load form requirements');
        } finally {
            setLoading(false);
        }
    };

    const fetchTenantData = async () => {
        setLoading(true);
        try {
            const data = await tenantService.getTenantById(id);
            setFormData({
                ...data,
                // Map API response to form fields if needed
                roomId: data.roomId || '', // Might not be needed for simple edit
            });
            // Skip room selection in edit mode
            setStep(2);
        } catch (error) {
            console.error('Failed to fetch tenant:', error);
            showToast('error', 'Failed to load tenant data');
        } finally {
            setLoading(false);
        }
    };

    // Filter rooms when property changes
    useEffect(() => {
        if (!isEditMode && formData.propertyId) {
            const rooms = vacantRooms.filter(r => r.propertyId === parseInt(formData.propertyId));
            setFilteredRooms(rooms);
        }
    }, [formData.propertyId, vacantRooms, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field changes
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.propertyId) newErrors.propertyId = 'Please select a property';
        if (!formData.roomId) newErrors.roomId = 'Please select a room';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Enter valid 10-digit phone number';
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors = {};
        if (!formData.rentAmount) newErrors.rentAmount = 'Rent amount is required';
        if (!formData.moveInDate) newErrors.moveInDate = 'Move-in date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditMode) {
            if (!validateStep2()) return;
        } else {
            if (!validateStep3()) return;
        }

        setSubmitting(true);

        try {
            if (isEditMode) {
                // Update tenant profile
                await tenantService.updateTenant(id, {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    idProofType: formData.idProofType,
                    idProofNumber: formData.idProofNumber,
                    emergencyContactName: formData.emergencyContactName,
                    emergencyContactPhone: formData.emergencyContactPhone,
                    moveInDate: formData.moveInDate
                });

                // Also update agreement if rent details changed
                if (formData.rentAmount) {
                    await tenantService.updateAgreement(id, {
                        monthlyRentAmount: parseFloat(formData.rentAmount),
                        securityDeposit: parseFloat(formData.securityDeposit) || 0,
                        paymentDueDay: parseInt(formData.paymentDueDay) || 5
                    });
                }

                showToast('success', 'Tenant updated successfully');
            } else {
                // Construct the payload as expected by the createTenant API
                // Payload structure from api_docs.md:
                // { tenant: { ... }, roomId: 123, agreement: { ... } }

                const payload = {
                    roomId: parseInt(formData.roomId),
                    tenant: {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        moveInDate: formData.moveInDate,
                        idProofType: formData.idProofType,
                        idProofNumber: formData.idProofNumber,
                        emergencyContactName: formData.emergencyContactName,
                        emergencyContactPhone: formData.emergencyContactPhone
                    },
                    agreement: {
                        monthlyRentAmount: parseFloat(formData.rentAmount),
                        securityDeposit: parseFloat(formData.securityDeposit) || 0,
                        paymentDueDay: parseInt(formData.paymentDueDay),
                        startDate: formData.moveInDate
                    }
                };

                await tenantService.createTenant(payload);
                showToast('success', 'Tenant moved in successfully');
            }
            navigate('/tenants');
        } catch (error) {
            console.error('Operation failed:', error);
            showToast('error', error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    // Find room name for summary
    const selectedRoomName = filteredRooms.find(r => r.id === parseInt(formData.roomId))?.roomNumber;
    const selectedPropertyName = properties.find(p => p.id === parseInt(formData.propertyId))?.name;

    return (
        <div className="tenant-form-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{isEditMode ? 'Edit Tenant' : 'New Move-in'}</h1>
                    <p className="page-subtitle">
                        {isEditMode ? 'Update tenant details' : `Step ${step} of 3: ${getStepTitle(step)}`}
                    </p>
                </div>
            </div>

            <div className="form-container">
                <Card className="form-card">
                    {/* Progress Bar (Move-in only) */}
                    {!isEditMode && (
                        <div className="wizard-progress">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                                <div className="step-number">1</div>
                                <span>Room</span>
                            </div>
                            <div className="progress-line" />
                            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                                <div className="step-number">2</div>
                                <span>Details</span>
                            </div>
                            <div className="progress-line" />
                            <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                                <div className="step-number">3</div>
                                <span>Agreement</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Room Selection */}
                        {step === 1 && !isEditMode && (
                            <div className="form-step">
                                <div className="form-group">
                                    <label>Select Property</label>
                                    <select
                                        name="propertyId"
                                        value={formData.propertyId}
                                        onChange={handleChange}
                                        className={`form-select ${errors.propertyId ? 'error' : ''}`}
                                    >
                                        <option value="">-- Choose Property --</option>
                                        {properties.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.propertyId && <span className="error-text">{errors.propertyId}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Select Available Room</label>
                                    <select
                                        name="roomId"
                                        value={formData.roomId}
                                        onChange={handleChange}
                                        className={`form-select ${errors.roomId ? 'error' : ''}`}
                                        disabled={!formData.propertyId}
                                    >
                                        <option value="">-- Choose Room --</option>
                                        {filteredRooms.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.roomNumber} ({r.roomType}) - ₹{r.rentAmount || 'N/A'}
                                            </option>
                                        ))}
                                        {formData.propertyId && filteredRooms.length === 0 && (
                                            <option disabled>No vacant rooms available</option>
                                        )}
                                    </select>
                                    {errors.roomId && <span className="error-text">{errors.roomId}</span>}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Tenant Details */}
                        {step === 2 && (
                            <div className="form-step">
                                <div className="form-row">
                                    <Input
                                        label="Full Name *"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        error={errors.fullName}
                                        placeholder="e.g. Rahul Sharma"
                                    />
                                    <Input
                                        label="Phone Number *"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        error={errors.phone}
                                        placeholder="10 digit mobile number"
                                    />
                                </div>

                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    placeholder="rahul@example.com"
                                />

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>ID Proof Type</label>
                                        <select
                                            name="idProofType"
                                            value={formData.idProofType}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="AADHAR">Aadhaar Card</option>
                                            <option value="PAN">PAN Card</option>
                                            <option value="OTHER">Other</option>
                                            <option value="NONE">None</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="ID Proof Number"
                                        name="idProofNumber"
                                        value={formData.idProofNumber}
                                        onChange={handleChange}
                                        placeholder="XXXX-XXXX-XXXX"
                                    />
                                </div>

                                <h3 className="section-title">Emergency Contact</h3>
                                <div className="form-row">
                                    <Input
                                        label="Contact Name"
                                        name="emergencyContactName"
                                        value={formData.emergencyContactName}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Contact Phone"
                                        name="emergencyContactPhone"
                                        value={formData.emergencyContactPhone}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Rent Agreement Fields - shown in edit mode */}
                                {isEditMode && (
                                    <>
                                        <h3 className="section-title">Rent Agreement</h3>
                                        <div className="form-row">
                                            <Input
                                                label="Monthly Rent (₹) *"
                                                name="rentAmount"
                                                type="number"
                                                value={formData.rentAmount}
                                                onChange={handleChange}
                                                error={errors.rentAmount}
                                            />
                                            <Input
                                                label="Security Deposit (₹)"
                                                name="securityDeposit"
                                                type="number"
                                                value={formData.securityDeposit}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-row">
                                            <Input
                                                label="Move-in Date"
                                                name="moveInDate"
                                                type="date"
                                                value={formData.moveInDate}
                                                onChange={handleChange}
                                            />
                                            <div className="form-group">
                                                <label>Rent Due Day (Each Month)</label>
                                                <select
                                                    name="paymentDueDay"
                                                    value={formData.paymentDueDay}
                                                    onChange={handleChange}
                                                    className="form-select"
                                                >
                                                    {[...Array(31)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Step 3: Agreement Details */}
                        {step === 3 && (
                            <div className="form-step">
                                {!isEditMode && (
                                    <div className="summary-box">
                                        <h4>Move-in Summary</h4>
                                        <p><strong>Property:</strong> {selectedPropertyName}</p>
                                        <p><strong>Room:</strong> {selectedRoomName}</p>
                                        <p><strong>Tenant:</strong> {formData.fullName}</p>
                                    </div>
                                )}

                                <div className="form-row">
                                    <Input
                                        label="Monthly Rent (₹) *"
                                        name="rentAmount"
                                        type="number"
                                        value={formData.rentAmount}
                                        onChange={handleChange}
                                        error={errors.rentAmount}
                                    />
                                    <Input
                                        label="Security Deposit (₹)"
                                        name="securityDeposit"
                                        type="number"
                                        value={formData.securityDeposit}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-row">
                                    <Input
                                        label="Move-in Date *"
                                        name="moveInDate"
                                        type="date"
                                        value={formData.moveInDate}
                                        onChange={handleChange}
                                        error={errors.moveInDate}
                                    />
                                    <div className="form-group">
                                        <label>Rent Due Day (Each Month)</label>
                                        <select
                                            name="paymentDueDay"
                                            value={formData.paymentDueDay}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {[...Array(31)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={step === 1 ? () => navigate('/tenants') : handleBack}
                                disabled={submitting}
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </Button>

                            {step < 3 && !isEditMode ? (
                                <Button type="button" onClick={handleNext}>
                                    Next Step
                                </Button>
                            ) : (
                                <Button type="submit" loading={submitting}>
                                    {isEditMode ? 'Update Profile' : 'Confirm Move-in'}
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

function getStepTitle(step) {
    switch (step) {
        case 1: return 'Select Room';
        case 2: return 'Tenant Details';
        case 3: return 'Rent Agreement';
        default: return '';
    }
}
