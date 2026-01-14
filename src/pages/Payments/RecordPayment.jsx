import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import rentService from '../../services/rentService';
import tenantService from '../../services/tenantService';
import useToast from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';

export default function RecordPayment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dueInfo, setDueInfo] = useState(null);

    const [paymentData, setPaymentData] = useState({
        amountPaid: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentForMonth: new Date().toISOString().slice(0, 7) + '-01', // First day of current month
        paymentMode: 'UPI',
        transactionReference: '',
        notes: ''
    });

    useEffect(() => {
        if (location.state?.tenantId) {
            fetchPreselectedTenant(location.state.tenantId);
        }
    }, [location.state]);

    const fetchPreselectedTenant = async (id) => {
        try {
            const tenant = await tenantService.getTenantById(id);
            if (tenant) {
                setSelectedTenant(tenant);
                setStep(2);
            }
        } catch (error) {
            console.error('Failed to fetch pre-selected tenant:', error);
            showToast('error', 'Failed to load tenant details');
        }
    };

    useEffect(() => {
        const searchTenants = async () => {
            if (searchQuery.length > 2) {
                try {
                    const results = await tenantService.getAllTenants({ query: searchQuery });
                    setSearchResults(results);
                } catch (error) {
                    console.error('Search failed:', error);
                }
            } else {
                setSearchResults([]);
            }
        };

        const timer = setTimeout(searchTenants, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (selectedTenant) {
            fetchDueInfo(selectedTenant.id);
        }
    }, [selectedTenant]);

    const fetchDueInfo = async (tenantId) => {
        try {
            // Default to checking due for the selected payment month
            const response = await rentService.getTenantDue(tenantId, paymentData.paymentForMonth);
            setDueInfo(response.data);
            // Pre-fill amount with due amount
            if (response.data && response.data.dueAmount > 0) {
                setPaymentData(prev => ({ ...prev, amountPaid: response.data.dueAmount }));
            }
        } catch (error) {
            console.error('Failed to fetch due info:', error);
        }
    };

    const handleTenantSelect = (tenant) => {
        setSelectedTenant(tenant);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await rentService.recordPayment(selectedTenant.id, paymentData);
            showToast('success', 'Payment recorded successfully');
            navigate('/payments');
        } catch (error) {
            console.error('Payment failed:', error);
            showToast('error', error.response?.data?.message || 'Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <div className="page-header">
                <div>
                    <h1>Record Payment</h1>
                    <p className="text-secondary">Capture a new rent payment</p>
                </div>
            </div>

            <div className="payment-container">
                {/* Step 1: Select Tenant */}
                <div className={`card step-card ${step === 1 ? 'active' : ''}`}>
                    <div className="step-header">
                        <span className="step-number">1</span>
                        <h3>Select Tenant</h3>
                    </div>

                    {step === 1 && (
                        <div className="step-content">
                            <Input
                                label="Search Tenant"
                                placeholder="Search by name or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />

                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    {searchResults.map(tenant => (
                                        <div
                                            key={tenant.id}
                                            className="search-result-item"
                                            onClick={() => handleTenantSelect(tenant)}
                                        >
                                            <div className="tenant-info">
                                                <strong>{tenant.fullName}</strong>
                                                <span className="text-secondary">Room {tenant.roomNumber}</span>
                                            </div>
                                            <span className="tenant-phone">{tenant.phone}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step > 1 && selectedTenant && (
                        <div className="selected-preview">
                            <div className="tenant-info">
                                <strong>{selectedTenant.fullName}</strong>
                                <span className="text-secondary">Room {selectedTenant.roomNumber}</span>
                            </div>
                            <Button variant="text" onClick={() => setStep(1)}>Change</Button>
                        </div>
                    )}
                </div>

                {/* Step 2: Payment Details */}
                <div className={`card step-card ${step === 2 ? 'active' : ''}`}>
                    <div className="step-header">
                        <span className="step-number">2</span>
                        <h3>Payment Details</h3>
                    </div>

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="step-content">
                            {dueInfo && (
                                <div className="due-alert">
                                    <span>Current Due: <strong>{formatCurrency(dueInfo.dueAmount)}</strong></span>
                                </div>
                            )}

                            <div className="form-grid">
                                <Input
                                    label="Amount Paid"
                                    type="number"
                                    required
                                    value={paymentData.amountPaid}
                                    onChange={(e) => setPaymentData({ ...paymentData, amountPaid: e.target.value })}
                                    prefix="₹"
                                />

                                <Input
                                    label="Payment Date"
                                    type="date"
                                    required
                                    value={paymentData.paymentDate}
                                    onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                                />

                                <div className="form-group">
                                    <label>Payment Mode</label>
                                    <select
                                        className="form-input"
                                        value={paymentData.paymentMode}
                                        onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
                                    >
                                        <option value="UPI">UPI</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CARD">Card</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                    </select>
                                </div>

                                <Input
                                    label="For Month"
                                    type="month"
                                    required
                                    value={paymentData.paymentForMonth.slice(0, 7)}
                                    onChange={(e) => setPaymentData({ ...paymentData, paymentForMonth: e.target.value + '-01' })}
                                />

                                <Input
                                    label="Transaction Ref (Optional)"
                                    value={paymentData.transactionReference}
                                    onChange={(e) => setPaymentData({ ...paymentData, transactionReference: e.target.value })}
                                    placeholder="UPI Ref / Cheque No"
                                />
                            </div>

                            <div className="form-actions mt-4">
                                <Button type="button" variant="secondary" onClick={() => navigate('/payments')}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" loading={loading}>
                                    Record Payment
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <style jsx>{`
                .page-header {
                    margin-bottom: 2rem;
                }
                .payment-container {
                    max-width: 800px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .step-card {
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                }
                .step-card.active {
                    border: 2px solid var(--primary);
                    box-shadow: var(--shadow-md);
                }
                .step-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .step-number {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: var(--bg-secondary);
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                .active .step-number {
                    background: var(--primary);
                    color: white;
                }
                .search-results {
                    margin-top: 0.5rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    max-height: 200px;
                    overflow-y: auto;
                }
                .search-result-item {
                    padding: 0.75rem 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    border-bottom: 1px solid var(--border);
                }
                .search-result-item:hover {
                    background: var(--bg-hover);
                }
                .search-result-item:last-child {
                    border-bottom: none;
                }
                .selected-preview {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                .due-alert {
                    background: var(--bg-warning-light);
                    color: var(--text-warning);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    margin-bottom: 1.5rem;
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    background: var(--surface);
                    color: var(--text-primary);
                }
            `}</style>
        </PageContainer>
    );
}
