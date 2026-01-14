import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import propertyService from '../../services/propertyService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import './PropertyForm.css';

/**
 * PropertyForm Page
 * Create or edit a property
 */
export default function PropertyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        totalFloors: 1,
    });
    const [errors, setErrors] = useState({});

    // Fetch property for edit
    useEffect(() => {
        if (isEdit) {
            fetchProperty();
        }
    }, [id]);

    const fetchProperty = async () => {
        try {
            const response = await propertyService.getById(id);
            const property = response.data;
            setForm({
                name: property.name || '',
                address: property.address || '',
                city: property.city || '',
                state: property.state || '',
                postalCode: property.postalCode || '',
                country: property.country || 'India',
                totalFloors: property.totalFloors || 1,
            });
        } catch (error) {
            console.error('Failed to fetch property:', error);
            showToast('error', 'Failed to load property');
            navigate('/properties');
        } finally {
            setLoading(false);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = 'Property name is required';
        }
        if (!form.address.trim()) {
            newErrors.address = 'Address is required';
        }
        if (!form.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!form.state.trim()) {
            newErrors.state = 'State is required';
        }
        if (!form.postalCode.trim()) {
            newErrors.postalCode = 'Postal code is required';
        }
        if (!form.totalFloors || form.totalFloors < 1) {
            newErrors.totalFloors = 'At least 1 floor is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setSubmitting(true);

            const data = {
                ...form,
                totalFloors: parseInt(form.totalFloors),
            };

            if (isEdit) {
                await propertyService.update(id, data);
                showToast('success', 'Property updated successfully');
                navigate(`/properties/${id}`);
            } else {
                const response = await propertyService.create(data);
                showToast('success', 'Property created successfully');
                navigate(`/properties/${response.data.id}`);
            }
        } catch (error) {
            console.error('Failed to save property:', error);
            const message = error.response?.data?.message || 'Failed to save property';
            showToast('error', message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="property-form-page">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="property-form-page">
            {/* Back Link */}
            <Link to="/properties" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12,19 5,12 12,5" />
                </svg>
                Back to Properties
            </Link>

            {/* Page Title */}
            <h1 className="form-page-title">
                {isEdit ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="form-page-subtitle">
                {isEdit
                    ? 'Update the property details below'
                    : 'Fill in the details to create a new property'}
            </p>

            <Card className="property-form-card">
                <form onSubmit={handleSubmit}>
                    {/* Property Name */}
                    <div className="form-group">
                        <Input
                            label="Property Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g., Sunrise Apartments"
                            error={errors.name}
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="form-group">
                        <Input
                            label="Address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="e.g., 123 MG Road"
                            error={errors.address}
                            required
                        />
                    </div>

                    {/* City & State Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                label="City"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="e.g., Bangalore"
                                error={errors.city}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                label="State"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                placeholder="e.g., Karnataka"
                                error={errors.state}
                                required
                            />
                        </div>
                    </div>

                    {/* Postal & Country Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                label="Postal Code"
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                placeholder="e.g., 560038"
                                error={errors.postalCode}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                label="Country"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                placeholder="e.g., India"
                            />
                        </div>
                    </div>

                    {/* Total Floors */}
                    <div className="form-group">
                        <Input
                            label="Total Floors"
                            name="totalFloors"
                            type="number"
                            min="1"
                            value={form.totalFloors}
                            onChange={handleChange}
                            error={errors.totalFloors}
                            required
                        />
                        <p className="form-field-hint">
                            You can add individual floors later from the property detail page
                        </p>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/properties')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting}>
                            {isEdit ? 'Update Property' : 'Create Property'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
