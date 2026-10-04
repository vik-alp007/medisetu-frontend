import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Receipt, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Download, 
  X, 
  ShieldCheck,
  Smartphone,
  Building
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import PaymentCard from '../../components/cards/PaymentCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import OutlineButton from '../../components/common/OutlineButton';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { billingService } from '../../services/billingService';

export const BillsScreen = () => {
  const [billsData, setBillsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiNotice, setApiNotice] = useState(null);

  // Payment Checkout Modal State
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('patient@upi');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch bills from backend (GET /api/bills/)
  useEffect(() => {
    let isMounted = true;

    const fetchBills = async () => {
      try {
        setLoading(true);
        setApiNotice(null);
        // Backend endpoint: GET /api/bills/
        const data = await billingService.getBills();
        if (isMounted && data) {
          if (typeof data === 'object') {
            setBillsData(data);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Backend bills API error:', err);
          setApiNotice(err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unable to load bills from the hospital server.');
          setBillsData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBills();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setApiNotice('Online payment is not connected yet because the backend team has not provided a payment endpoint.');
  };

  const outstanding = billsData?.outstandingAmount ?? 0;
  const billDetails = billsData?.billDetails || [];
  const previousPayments = billsData?.previousPayments || [];

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-6"
      >
        {/* Header (Screen 16) */}
        <TopHeader
          title="Bills & Payments"
          subtitle="Hospital invoices, pending balances & payment receipts"
          showBack={true}
          backTo="/dashboard"
          className="px-1"
        />

        {apiNotice && (
          <ErrorAlert
            title="Billing Notice"
            message={apiNotice}
            onDismiss={() => setApiNotice(null)}
          />
        )}

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner size="lg" /></div>
        ) : !billsData ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center text-sm text-medisetu-muted">No billing data was returned by the hospital server.</div>
        ) : (
        <>
        {/* Outstanding Balance Hero Card (Figma Screen 16) */}
        {outstanding > 0 ? (
          <PaymentCard
            variant="outstanding"
            amount={outstanding}
            status="Due"
            onPay={() => setShowPayModal(true)}
          />
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-medisetu-navy">All Bills Cleared!</h3>
              <p className="text-xs sm:text-sm text-medisetu-muted mt-1">
                You have no pending hospital dues or unpaid invoices.
              </p>
            </div>
            <StatusBadge status="Zero Balance" variant="success" size="md" className="mx-auto" />
          </div>
        )}

        {/* Bill Breakdown Details */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-medisetu-navy flex items-center gap-2">
              <Receipt className="w-5 h-5 text-medisetu-primary" /> Invoice Breakdown
            </h3>
            <span className="text-xs text-medisetu-muted">Ref: #INV-2026-904</span>
          </div>

          <div className="space-y-3">
            {billDetails.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-medisetu-slate">{item.item}</span>
                <span className="font-semibold text-medisetu-navy">₹{item.amount}</span>
              </div>
            ))}

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-base font-bold text-medisetu-navy">
              <span>Total Invoice Amount</span>
              <span className="text-medisetu-primary">₹{outstanding > 0 ? outstanding : 1200}</span>
            </div>
          </div>
        </section>

        {/* Previous Payments History (Screen 16) */}
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-medisetu-navy px-1">
            Previous Payments
          </h3>

          <div className="space-y-3">
            {previousPayments.map((pay) => (
              <PaymentCard
                key={pay.id}
                variant="history"
                amount={pay.amount}
                date={pay.date}
                status={pay.status}
              />
            ))}
          </div>
        </section>

        </>)}

        {/* Payment Checkout Modal */}
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
                    <span className="text-xs text-medisetu-muted">Amount Payable: ₹{outstanding}</span>
                  </div>
                  <button
                    onClick={() => setShowPayModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {paymentSuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                    <h4 className="text-lg font-bold text-medisetu-navy">Payment Successful!</h4>
                    <p className="text-xs text-medisetu-muted">
                      Receipt #REC-{Date.now().toString().slice(-6)} generated and sent to your email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleProcessPayment} className="space-y-4">
                    {/* Method Selector */}
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
                        <Smartphone className="w-4 h-4" /> UPI (GPay/PhonePe)
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
                        <CreditCard className="w-4 h-4" /> Cards
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
                        <Building className="w-4 h-4" /> Net Banking
                      </button>
                    </div>

                    {selectedMethod === 'upi' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-medisetu-navy">UPI ID / VPA</label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-medisetu-navy focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-medisetu-primary"
                        />
                      </div>
                    )}

                    {selectedMethod === 'card' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Card Number (•••• •••• •••• ••••)"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            maxLength={3}
                            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-medisetu-muted pt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>256-Bit SSL Encrypted Healthcare Payment</span>
                    </div>

                    <PrimaryButton
                      fullWidth
                      size="lg"
                      type="submit"
                      isLoading={processing}
                    >
                      Pay ₹{outstanding}
                    </PrimaryButton>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </PatientLayout>
  );
};

export default BillsScreen;
