import React, { useState } from 'react';
import Rodal from 'rodal';
import { Icon } from '@iconify/react';
import { api } from '../../../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export const PaymentModal = ({ visible, onClose, language, locale, id }) => {
  const isRTL = language === 'ar';
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState('');

  const handleVoucherPayment = async () => {
    if (!voucherCode.trim()) {
      setVoucherMessage(locale.premium.voucherCodeError);
      return;
    }

    setIsVoucherLoading(true);
    try {
      const validateResponse = await api.post('/payment/voucher/validate-voucher', {
        code: voucherCode,
      });

      if (validateResponse.data.valid) {
        const paymentResponse = await api.post(`/payment/stripe/${id}/create-payment-link`, {
          voucherCode: voucherCode,
          success_url: window.location.href,
          cancel_url: window.location.href,
        });

        if (paymentResponse.data.url) {
          setVoucherMessage(locale.premium.paymentSuccess);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setVoucherMessage(locale.premium.paymentError);
        }
      } else {
        setVoucherCode('');
        setVoucherMessage(locale.premium.invalidVoucher);
      }
    } catch (error) {
      console.error('Error processing voucher:', error);
      setVoucherMessage(error.response?.data?.message || locale.premium.voucherProcessingError);
    } finally {
      setIsVoucherLoading(false);
    }
  };

  const getDirectionalClasses = (ltrClasses, rtlClasses) => {
    return isRTL ? rtlClasses : ltrClasses;
  };

  const closeButtonPosition = getDirectionalClasses('right-2 sm:right-4', 'left-2 sm:left-4');

  const arrowIcon = getDirectionalClasses('mdi:arrow-right', 'mdi:arrow-left');

  const arrowTransform = getDirectionalClasses('group-hover:translate-x-1', 'group-hover:-translate-x-1');

  return (
    <Rodal
      visible={visible}
      onClose={onClose}
      customStyles={{
        width: '95%',
        maxWidth: '550px',
        height: 'auto',
        maxHeight: '90vh',
        borderRadius: '1rem',
        padding: 0,
        background: '#1e1f22',
        margin: 'auto',
        overflow: 'auto',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
      animation="zoom"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`relative ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <button
          onClick={onClose}
          className={`absolute ${closeButtonPosition} top-2 sm:top-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-all duration-200 z-10`}
          aria-label={locale.premium.closeModal}
        >
          <Icon icon="mdi:close" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center">
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src="/solid-logo.png"
            alt="Wicks Bot Logo"
            className="w-24 sm:w-32 mb-4 sm:mb-6 drop-shadow-2xl"
          />

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-tight">{locale.premium.premiumAccessTitle}</h2>

          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-md leading-relaxed px-2">
            {locale.premium.premiumAccessDescription}
          </p>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://discord.gg/tBwAeuJuud"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-6 sm:px-8 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 text-sm sm:text-base"
          >
            <Icon icon="mdi:discord" className="w-4 h-4 sm:w-5 sm:h-5" />
            {locale.premium.openTicket}
            <Icon icon={arrowIcon} className={`w-4 h-4 sm:w-5 sm:h-5 ${arrowTransform}`} />
          </motion.a>

          <div className="w-full max-w-md border-t border-gray-700/50 mt-6 sm:mt-8 pt-6 sm:pt-8">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">{locale.premium.voucherTitle}</h3>

            <div className="flex flex-col gap-3 sm:gap-4 px-2 sm:px-0">
              <div className={`flex flex-col ${getDirectionalClasses('sm:flex-row', 'sm:flex-row-reverse')} gap-2 w-full`}>
                <input
                  type="text"
                  placeholder={locale.premium.voucherPlaceholder}
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  disabled={isVoucherLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVoucherPayment}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-white rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] sm:min-w-[120px] transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 text-sm sm:text-base"
                  disabled={isVoucherLoading}
                >
                  {isVoucherLoading ? (
                    <>
                      <Icon icon="mdi:loading" className={`w-4 h-4 sm:w-5 sm:h-5 ${getDirectionalClasses('mr-2', 'ml-2')} animate-spin`} />
                      {locale.premium.redeem}
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:ticket-percent" className={`w-4 h-4 sm:w-5 sm:h-5 ${getDirectionalClasses('mr-2', 'ml-2')}`} />
                      {locale.premium.redeem}
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {voucherMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg ${
                      voucherMessage.includes('successful') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={voucherMessage.includes('successful') ? 'mdi:check-circle' : 'mdi:alert-circle'}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      {voucherMessage}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      <ToastContainer
        position={isRTL ? 'bottom-right' : 'bottom-left'}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Rodal>
  );
};

export default PaymentModal;

// import React, { useState } from 'react';
// import Rodal from 'rodal';
// import { Icon } from '@iconify/react';
// import { FaCreditCard, FaPaypal } from 'react-icons/fa'; // Import PayPal icon
// import { api } from '../../../../utils/api';
// import { toast, ToastContainer } from 'react-toastify';

// export const PaymentModal = ({ visible, onClose, billing, locale, language, router }) => {
//   const isRTL = language === 'ar';
//   const [paymentMethod, setPaymentMethod] = useState('credit');
//   const [isLoading, setIsLoading] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [voucherCode, setVoucherCode] = useState('');
//   const [voucherMessage, setVoucherMessage] = useState('');
//   const [isVoucherLoading, setIsVoucherLoading] = useState(false);

//   const plans = [
//     {
//       description: 'Wicks Bot Monthly Subscription',
//       price: 5.99,
//       billing: locale.premium.monthlyPlan,
//       unit: 'month',
//     },
//     {
//       description: 'Wicks Bot 3-Month Subscription',
//       price: 12.99,
//       billing: locale.premium._3MonthPlan,
//       unit: '3-month',
//     },
//     {
//       description: 'Wicks Bot 6-Month Subscription',
//       price: 24.99,
//       billing: locale.premium._6MonthPlan,
//       unit: '6-month',
//     },
//     {
//       description: 'Wicks Bot Yearly Subscription',
//       price: 44.99,
//       billing: locale.premium.yearlyPlan,
//       unit: 'year',
//     },
//   ];

//   const plan = plans[billing];
//   const finalPrice = plan.price - plan.price * (discount / 100);

//   const handleVoucher = async () => {
//     setIsVoucherLoading(true);
//     try {
//       const response = await api.post('/payment/voucher/validate-voucher', { code: voucherCode });
//       if (response.data.valid) {
//         setDiscount(response.data.discount);
//         setVoucherMessage(locale.premium.voucherSuccess);
//       } else {
//         setVoucherCode('');
//         setDiscount(0);
//         setVoucherMessage(locale.premium.voucherInvalid);
//       }
//     } catch (error) {
//       console.error('Error validating voucher:', error);
//       setVoucherMessage(locale.premium.voucherError);
//     } finally {
//       setIsVoucherLoading(false);
//     }
//   };

//   const handlePayment = () => {
//     setIsLoading(true);
//     if (paymentMethod === 'crypto') {
//       handleCryptoPayment();
//     } else if (paymentMethod === 'credit') {
//       handleStripePayment();
//     } else if (paymentMethod === 'paypal') {
//       handlePayPalPayment();
//     }
//   };

//   const handleCryptoPayment = async () => {
//     try {
//       const response = await api.post(`/payment/crypto/${router.query.id}/create-crypto-invoice`, {
//         id: router.query.id,
//         success_url: window.location.href,
//         cancel_url: window.location.href,
//         plan: billing,
//         voucherCode,
//       });
//       window.location.href = response.data.url;
//     } catch (error) {
//       console.error('Error processing crypto payment:', error);
//       setIsLoading(false);
//     }
//   };

//   const handleStripePayment = async () => {
//     try {
//       const response = await api.post(`/payment/stripe/${router.query.id}/create-payment-link`, {
//         cancel_url: window.location.href,
//         success_url: window.location.href,
//         plan: billing,
//         voucherCode,
//       });
//       window.location.href = response.data.url;
//     } catch (error) {
//       toast.warn(
//         <div className="flex items-center gap-2">
//           <span>{locale.premium.outOfStock || 'No available bots at this time. Please try again later.'}</span>
//         </div>,
//         {
//           style: { background: '#fef3c7', color: '#92400e', margin: 0 },
//           progressStyle: { background: '#f59e0b' },
//           position: 'bottom-left',
//         }
//       );

//       setIsLoading(false);
//     }
//   };

//   const handlePayPalPayment = async () => {
//     try {
//       const response = await api.post(`/payment/paypal/${router.query.id}/create-subscription`, {
//         cancel_url: window.location.href,
//         success_url: window.location.href,
//         plan: billing,
//         voucherCode,
//       });
//       window.location.href = response.data.url;
//     } catch (error) {
//       console.error('Error processing PayPal payment:', error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Rodal visible={visible} onClose={onClose} customStyles={{ width: 'auto', height: 'auto' }}>
//         <div className={`rounded-lg bg-[#1e1f22] max-md:p-6 ${isRTL ? 'pr-8' : 'pl-8'}`}>
//           <button
//             onClick={onClose}
//             className="absolute right-4 text-gray-300 p-2 focus:ring-2 top-[60px] hidden max-md:block"
//             aria-label="Close Modal"
//           >
//             ✕
//           </button>
//           <div className={`flex gap-5 max-md:flex-col`}>
//             <div className="flex flex-col w-[66%] max-md:mx-2 max-md:w-[auto]">
//               <div className="mt-4 text-2xl font-semibold text-gray-200 max-md:mt-10 max-md:max-w-full">
//                 {locale.premium.completePayment}
//               </div>
//               <div className="flex flex-col mt-6">
//                 <div className="text-lg text-gray-300 mb-4">{locale.premium.paymentMethod}</div>
//                 <div className="flex flex-col gap-4">
//                   <button
//                     className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors duration-300 ease-in-out ${
//                       paymentMethod === 'credit' ? 'bg-blue-600' : 'bg-gray-700'
//                     } text-white hover:bg-blue-500 active:bg-blue-700 cursor-pointer`}
//                     onClick={() => setPaymentMethod(paymentMethod === 'credit' ? '' : 'credit')}
//                   >
//                     <FaCreditCard />
//                     {locale.premium.creditCard}
//                   </button>
//                   {/* <button
//                   className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors duration-300 ease-in-out ${
//                     paymentMethod === 'paypal' ? 'bg-blue-600' : 'bg-gray-700'
//                   } text-white hover:bg-blue-500 active:bg-blue-700 cursor-pointer`}
//                   onClick={() => setPaymentMethod(paymentMethod === 'paypal' ? '' : 'paypal')}
//                 >
//                   <FaPaypal />
//                   Paypal
//                 </button> */}
//                 </div>
//               </div>
//             </div>
//             <div className={`flex flex-col ${isRTL ? 'mr-5' : 'ml-5'} max-md:m-0 max-md:w-full`}>
//               <div
//                 className={`flex flex-col grow px-5 pt-14 pb-6 w-full rounded-none bg-[#25272b] ${
//                   isRTL ? 'rounded-l' : 'rounded-r'
//                 } max-md:px-5 max-md:rounded-b-lg max-md:rounded-t-none`}
//               >
//                 <div className="flex justify-center items-center self-center px-7 py-5 max-w-full rounded bg-[#5c5f6b] bg-opacity-50 w-[140px] max-md:px-5 max-md:hidden">
//                   <img loading="lazy" src="/solid-logo.png" className="w-full aspect-[0.98]" alt="Product" />
//                 </div>
//                 <div className="flex flex-col px-4 py-5 mt-8 w-full font-medium rounded-lg border border-solid bg-[#2c2f35] border-[#3a3f47]">
//                   <div className="flex gap-5 justify-between w-full">
//                     <div className="flex gap-2">
//                       <img
//                         loading="lazy"
//                         src="/payment/cart.svg"
//                         className="shrink-0 my-auto aspect-square w-[31px]"
//                         alt="Subscription Icon"
//                       />
//                       <div className="flex flex-col">
//                         <div className="self-start text-base text-gray-100">Wicks Bot</div>
//                         <div className="mt-1.5 text-xs text-gray-500">
//                           ${plan.price} / {plan.unit} - {plan.billing} Subscription
//                         </div>
//                       </div>
//                     </div>
//                     <div className="my-auto text-base text-white">${finalPrice.toFixed(2)}</div>
//                   </div>
//                   <div className="shrink-0 mt-2.5 h-px border border-solid bg-gray-600 border-gray-600" />
//                   <div className="flex gap-5 justify-between items-start mt-1.5 whitespace-nowrap">
//                     <div className="flex flex-col mt-1">
//                       <div className="text-base text-gray-100">{locale.premium.total}</div>
//                       <div className="text-xs text-gray-500">Tax</div>
//                     </div>
//                     <div className="flex flex-col">
//                       <div className="text-base text-gray-100">${finalPrice.toFixed(2)}</div>
//                       <div className="text-xs text-gray-500">$0</div>
//                     </div>
//                   </div>
//                   <div className="shrink-0 mt-2 h-px border border-solid bg-gray-600 border-gray-600 w-[70%] max-md:w-full" />
//                   <div className="flex gap-4 mt-2 text-base max-md:flex max-md:flex-col max-md:items-center">
//                     <input
//                       type="text"
//                       placeholder={locale.premium.discountCode}
//                       value={voucherCode}
//                       onChange={(e) => setVoucherCode(e.target.value)}
//                       className="px-3 py-1.5 rounded-lg border border-solid bg-gray-700 border-gray-600 text-gray-300 max-md:pr-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     />
//                     <button
//                       onClick={handleVoucher}
//                       className="px-3 py-1.5 text-white whitespace-nowrap rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 cursor-pointer"
//                       disabled={isVoucherLoading}
//                       style={{ width: '100px', opacity: isVoucherLoading ? 0.5 : 1 }}
//                     >
//                       {isVoucherLoading ? (
//                         <Icon icon="eos-icons:three-dots-loading" className="w-6 h-6 text-white m-auto" />
//                       ) : (
//                         locale.premium.apply
//                       )}
//                     </button>
//                   </div>
//                   {voucherMessage && (
//                     <div className={`mt-2 ${voucherMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
//                       {voucherMessage}
//                     </div>
//                   )}
//                   <div className="shrink-0 mt-2 h-px border border-solid bg-gray-600 border-gray-600 w-[70%] max-md:w-full" />
//                   <div className="flex gap-5 justify-between mt-4 text-2xl whitespace-nowrap text-gray-100">
//                     <div>${finalPrice.toFixed(2)}</div>
//                     <div>{locale.premium.total}</div>
//                   </div>
//                   <button
//                     className="self-center flex items-center justify-center px-10 py-2.5 mt-4 text-xl font-semibold text-center text-white whitespace-nowrap bg-blue-500 rounded-lg max-md:px-5 hover:bg-blue-600 active:bg-blue-700 cursor-pointer"
//                     onClick={handlePayment}
//                     disabled={isLoading}
//                     style={{ width: '150px', height: '50px', opacity: isLoading ? 0.5 : 1 }}
//                   >
//                     {isLoading ? <Icon icon="eos-icons:three-dots-loading" className="w-12 h-12 text-white" /> : locale.premium.pay}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <ToastContainer style={{ marginBottom: '40px' }} />
//       </Rodal>
//     </>
//   );
// };

// export default PaymentModal;
