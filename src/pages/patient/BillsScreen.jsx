import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  Calendar,
  X,
  ShieldCheck,
  Smartphone,
  Building,
  UserRound,
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import PaymentCard from '../../components/cards/PaymentCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import OutlineButton from '../../components/common/OutlineButton';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';
import EmptyState from '../../components/feedback/EmptyState';

import { billingService } from '../../services/billingService';

const getBackendError = (error) => {
  const data = error?.response?.data;

  if (typeof data?.detail === 'string') {
    return data.detail;
  }

  if (typeof data?.message === 'string') {
    return data.message;
  }

  if (data && typeof data === 'object') {
    const firstFieldError = Object.values(data)
      .flat()
      .find((value) => typeof value === 'string');

    if (firstFieldError) {
      return firstFieldError;
    }
  }

  return (
    error?.message ||
    'Unable to load billing information from the hospital server.'
  );
};

const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return '—';
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }

  return `₹${numericAmount.toLocaleString('en-IN')}`;
};

const formatDate = (value) => {
  if (!value) {
    return 'Date not provided';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getDoctorName = (bill) => {
  const doctor = bill?.doctor_detail?.user;

  if (!doctor) {
    return 'Doctor not provided';
  }

  const fullName = `${doctor.first_name || ''} ${
    doctor.last_name || ''
  }`.trim();

  return fullName || doctor.username || 'Doctor not provided';
};

const getBillStatus = (status) => {
  const normalized = String(status || '').toUpperCase();

  if (
    normalized === 'PAID' ||
    normalized === 'COMPLETED' ||
    normalized === 'SUCCESS'
  ) {
    return {
      label: 'Paid',
      variant: 'success',
    };
  }

  if (
    normalized === 'CANCELLED' ||
    normalized === 'FAILED' ||
    normalized === 'REFUNDED'
  ) {
    return {
      label: status,
      variant: 'danger',
    };
  }

  return {
    label: status || 'Pending',
    variant: 'warning',
  };
};

export const BillsScreen = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState(null);

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchBills = async () => {
      try {
        setLoading(true);
        setApiNotice(null);

        const data = await billingService.getBills();

        if (!isMounted) return;

        const normalizedBills = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setBills(normalizedBills);
      } catch (error) {
        if (!isMounted) return;

        console.error('Billing API error:', error);

        setBills([]);
        setApiNotice(getBackendError(error));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBills();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * Calculate total pending amount from actual backend bills.
   */
  const outstandingAmount = useMemo(() => {
    return bills
      .filter((bill) => {
        const status = String(bill?.status || '').toUpperCase();

        return ![
          'PAID',
          'COMPLETED',
          'SUCCESS',
          'CANCELLED',
          'REFUNDED',
        ].includes(status);
      })
      .reduce((total, bill) => {
        return total + Number(bill?.amount || bill?.consultation_fee || 0);
      }, 0);
  }, [bills]);

  const hasOutstandingBalance = outstandingAmount > 0;

  const paidBills = useMemo(() => {
    return bills.filter((bill) => {
      const status = String(bill?.status || '').toUpperCase();

      return ['PAID', 'COMPLETED', 'SUCCESS'].includes(status);
    });
  }, [bills]);

  const handlePaymentAttempt = (event) => {
    event.preventDefault();

    setApiNotice(
      'Online payment is not connected yet because the backend team has not provided a payment endpoint.'
    );
  };

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-6"
      >
        {/* Header */}
        <TopHeader
          title="Bills & Payments"
          subtitle="Hospital invoices, pending balances & payment receipts"
          showBack={true}
          backTo="/dashboard"
          className="px-1"
        />

        {apiNotice && (
          <ErrorAlert
            title="Billing Service"
            message={apiNotice}
            onDismiss={() => setApiNotice(null)}
          />
        )}

        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : bills.length === 0 ? (
          <EmptyState
            title="No Bills Found"
            description="You currently have no billing records available."
          />
        ) : (
          <>
            {/* Outstanding Balance */}
            {hasOutstandingBalance ? (
              <PaymentCard
                variant="outstanding"
                amount={outstandingAmount}
                status="Due"
                onPay={() => setShowPayModal(true)}
              />
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />

                <div>
                  <h3 className="text-xl font-bold text-medisetu-navy">
                    All Bills Cleared!
                  </h3>

                  <p className="text-xs sm:text-sm text-medisetu-muted mt-1">
                    You have no pending hospital dues or unpaid invoices.
                  </p>
                </div>

                <StatusBadge
                  status="Zero Balance"
                  variant="success"
                  size="md"
                  className="mx-auto"
                />
              </div>
            )}

            {/* Current Bills */}
            <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-medisetu-navy flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-medisetu-primary" />
                  Current Bills
                </h3>

                <span className="text-xs text-medisetu-muted">
                  {bills.length} {bills.length === 1 ? 'bill' : 'bills'}
                </span>
              </div>

              <div className="space-y-3">
                {bills.map((bill) => {
                  const statusInfo = getBillStatus(bill?.status);
                  const doctorName = getDoctorName(bill);

                  return (
                    <div
                      key={bill?.id}
                      className="border border-slate-100 rounded-2xl p-4 space-y-3"
                    >
                      {/* Bill top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-medisetu-navy">
                            Consultation Bill
                          </p>

                          <p className="text-xs text-medisetu-muted mt-1">
                            Bill #{bill?.id}
                          </p>
                        </div>

                        <StatusBadge
                          status={statusInfo.label}
                          variant={statusInfo.variant}
                          size="sm"
                        />
                      </div>

                      {/* Doctor */}
                      <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserRound className="w-4 h-4 text-medisetu-primary" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-medisetu-navy">
                            {doctorName}
                          </p>

                          <p className="text-xs text-medisetu-muted">
                            {bill?.doctor_detail?.specialization ||
                              'Medical Consultation'}
                          </p>
                        </div>
                      </div>

                      {/* Amount + date */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-medisetu-primary" />

                          <div>
                            <p className="text-[11px] text-medisetu-muted">
                              Amount
                            </p>

                            <p className="text-sm font-bold text-medisetu-navy">
                              {formatAmount(
                                bill?.amount ?? bill?.consultation_fee
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-medisetu-primary" />

                          <div>
                            <p className="text-[11px] text-medisetu-muted">
                              Date
                            </p>

                            <p className="text-sm font-semibold text-medisetu-navy">
                              {formatDate(bill?.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Previous Payments */}
            <section className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-medisetu-navy px-1">
                Previous Payments
              </h3>

              {paidBills.length > 0 ? (
                <div className="space-y-3">
                  {paidBills.map((bill) => (
                    <PaymentCard
                      key={bill?.id}
                      variant="history"
                      amount={bill?.amount ?? bill?.consultation_fee}
                      date={formatDate(bill?.created_at)}
                      status="Paid"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center">
                  <p className="text-sm font-semibold text-medisetu-navy">
                    No Previous Payments
                  </p>

                  <p className="text-xs text-medisetu-muted mt-1">
                    Paid bills will appear here once a payment is recorded by
                    the hospital.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Payment Modal */}
        <AnimatePresence>
          {showPayModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-medisetu-navy">
                      Payment Gateway
                    </h3>

                    <span className="text-xs text-medisetu-muted">
                      Amount Payable: {formatAmount(outstandingAmount)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Online payment is not connected yet. The backend team has
                    not provided a payment endpoint, so no payment will be
                    processed from this screen.
                  </p>
                </div>

                <form onSubmit={handlePaymentAttempt} className="space-y-4">
                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('upi')}
                      className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        selectedMethod === 'upi'
                          ? 'border-medisetu-primary bg-blue-50 text-medisetu-primary'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      UPI
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('card')}
                      className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        selectedMethod === 'card'
                          ? 'border-medisetu-primary bg-blue-50 text-medisetu-primary'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Cards
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('netbanking')}
                      className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        selectedMethod === 'netbanking'
                          ? 'border-medisetu-primary bg-blue-50 text-medisetu-primary'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      Net Banking
                    </button>
                  </div>

                  {selectedMethod === 'upi' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-medisetu-navy">
                        UPI ID / VPA
                      </label>

                      <input
                        type="text"
                        value={upiId}
                        onChange={(event) => setUpiId(event.target.value)}
                        placeholder="yourname@bank"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-medisetu-navy focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-medisetu-primary"
                      />
                    </div>
                  )}

                  {selectedMethod === 'card' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number"
                        disabled
                        className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm cursor-not-allowed"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          disabled
                          className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm cursor-not-allowed"
                        />

                        <input
                          type="password"
                          placeholder="CVV"
                          disabled
                          className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'netbanking' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                      <Building className="w-8 h-8 text-medisetu-primary mx-auto mb-2" />

                      <p className="text-sm font-semibold text-medisetu-navy">
                        Net banking integration pending
                      </p>

                      <p className="text-xs text-medisetu-muted mt-1">
                        This option will be connected once the payment API is
                        provided.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-medisetu-muted pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />

                    <span>
                      Payment processing will be enabled after backend
                      integration.
                    </span>
                  </div>

                  <PrimaryButton fullWidth size="lg" type="submit">
                    Payment Integration Pending
                  </PrimaryButton>
                </form>

                <OutlineButton
                  fullWidth
                  onClick={() => setShowPayModal(false)}
                >
                  Close
                </OutlineButton>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </PatientLayout>
  );
};

export default BillsScreen;