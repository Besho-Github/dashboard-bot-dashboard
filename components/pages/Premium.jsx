import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../context';
import { api } from '../../utils/api';
import { GeneralSkeleton } from '.';
import { PremiumContent } from '../ui/dashboard/premium/PremiumContent';
import { PlanSelection } from '../ui/dashboard/premium/PlanSelection';
import PaymentModal from '../ui/dashboard/premium/PaymentModal';
import SaveBar from '../ui/dashboard/common/SaveBar';
import { GuildDataContext } from '../../context/guild';
import PremiumContentSkeleton from '../ui/dashboard/premium/Skeleton';
import { useParams } from 'next/navigation';

function Premium() {
  const { isPremium } = useContext(GuildDataContext);
  const { locale, language } = useContext(DataContext);
  const [visible, setVisible] = useState(false);
  const [billing, setBilling] = useState(0);
  const [premiumData, setPremiumData] = useState(null);
  const [initialPremiumData, setInitialPremiumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState({
    hasUnsavedChanges: false,
    saving: false,
  });
  const isRTL = language === 'ar';
  const { id } = useParams();
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const { data } = await api.get(`/premium/${id}/status`);
        setPremiumData(data);
        setInitialPremiumData(data);
      } catch (error) {
        console.error('Error fetching premium status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, [id]);

  const showModal = (billing) => {
    setBilling(billing);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const handleChange = (field, value) => {
    setSave((prevData) => ({
      ...prevData,
      hasUnsavedChanges: true,
    }));
    if (field.includes('.')) {
      const [, key] = field.split('.');
      setPremiumData((prevData) => ({
        ...prevData,
        bot: {
          ...prevData.bot,
          user: { ...prevData.bot.user, [key]: value },
        },
      }));
    } else {
      setPremiumData((prevData) => ({
        ...prevData,
        bot: {
          ...prevData.bot,
          [field]: value,
        },
      }));
    }
  };

  const handleSave = async () => {
    setSave((prevData) => ({
      ...prevData,
      saving: true,
    }));
    try {
      const userUpdateData = {
        username: premiumData.bot.user.username,
        avatar: premiumData.bot.user.avatar,
        banner: premiumData.bot.user.banner,
      };
      await api.put(`/premium/${id}/personalize`, {
        bot_status: premiumData.bot.bot_status,
        activity_type: premiumData.bot.activity_type,
        activity_text: premiumData.bot.activity_text,
        stream_url: premiumData.bot.stream_url,
        user: userUpdateData,
      });
      setSave((prevData) => ({
        ...prevData,
        saving: false,
        hasUnsavedChanges: false,
      }));
      setInitialPremiumData(premiumData);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSave((prevData) => ({
        ...prevData,
        saving: false,
      }));
    }
  };

  const handleReset = () => {
    setPremiumData(initialPremiumData);
    setSave((prevData) => ({
      ...prevData,
      hasUnsavedChanges: false,
    }));
  };

  if (loading) {
    if (isPremium) return <PremiumContentSkeleton />;
    return <GeneralSkeleton />;
  }

  return (
    <>
      <Head>
        <title>{locale.premium.title}</title>
      </Head>
      {premiumData?.premium ? (
        <PremiumContent premiumData={premiumData} handleChange={handleChange} locale={locale} isRTL={isRTL} id={id} showModal={showModal} />
      ) : (
        <PlanSelection locale={locale} isRTL={isRTL} showModal={showModal} />
      )}
      <PaymentModal visible={visible} onClose={hideModal} billing={billing} locale={locale} language={language} id={id} />
      <SaveBar saving={save.saving} hasUnsavedChanges={save.hasUnsavedChanges} onSave={handleSave} onReset={handleReset} />
      <ToastContainer />
    </>
  );
}

export default Premium;
