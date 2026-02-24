import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

// Components
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingComplete from "@/components/onboarding/OnboardingComplete";
import StepCompanyBasics from "@/components/onboarding/StepCompanyBasics";
import StepIndustry from "@/components/onboarding/StepIndustry";
import StepTargetMarket from "@/components/onboarding/StepTargetMarket";
import StepKeywords from "@/components/onboarding/StepKeywords";
import StepPlatforms from "@/components/onboarding/StepPlatforms";
import Loader from "@/[components]/loader";

// ✅ API base from env
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Onboarding = () => {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const navigate = useNavigate();

  // 1. ADDED STRICT LOADING STATE (Default to true so form is hidden initially)
  const [isCheckingDB, setIsCheckingDB] = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [saving, setSaving] = useState(false);

  // ======================
  // FORM STATE
  // ======================
  const [companyData, setCompanyData] = useState({
    companyName: "",
    websiteUrl: "",
    businessEmail: "",
    phoneNumber: "",
  });

  const [industryData, setIndustryData] = useState({
    industry: "",
    industryOther: "",
    productDescription: "",
  });

  const [targetData, setTargetData] = useState({
    targetAudience: "",
    targetCountry: "",
    targetStateCity: "",
    businessType: "",
  });

  const [keywordsData, setKeywordsData] = useState({
    keywords: [] as string[],
  });

  const [platformsData, setPlatformsData] = useState({
    linkedin: false,
    twitter: false,
    reddit: false,
    facebook: false,
    quora: false,
    youtube: false,
  });

  // ======================
  // LOAD PROGRESS & CHECK ONBOARDING
  // ======================
  useEffect(() => {
    if (!isClerkLoaded) return;

    // Safety fallback: if somehow they hit this page without being logged in
    if (!user) {
      navigate("/");
      return;
    }

    const loadProgress = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/onboarding/progress?userId=${user.id}`,
        );

        if (!res.ok) throw new Error("Failed to load progress");

        const data = await res.json();

        if (data?.completed) {
          // If already onboarded, immediately route to dashboard.
          // Because isCheckingDB is still true, the user never sees the form.
          navigate("/dashboard", { replace: true });
        } else {
          // If not completed, set the correct step...
          if (data?.currentStep) {
            setCurrentStep(data.currentStep);
          }
          // ...and FINALLY turn off the loading screen to reveal the form
          setIsCheckingDB(false);
        }
      } catch (err) {
        console.error("Load progress error:", err);
        // If the DB call fails, we still need to turn off the loader so they aren't stuck forever
        setIsCheckingDB(false);
      }
    };

    loadProgress();
  }, [isClerkLoaded, user, navigate]);

  // ======================
  // STATE HANDLERS
  // ======================
  const handleCompanyChange = (field: string, value: string) =>
    setCompanyData((p) => ({ ...p, [field]: value }));

  const handleIndustryChange = (field: string, value: string) =>
    setIndustryData((p) => ({ ...p, [field]: value }));

  const handleTargetChange = (field: string, value: string) =>
    setTargetData((p) => ({ ...p, [field]: value }));

  const handleKeywordsChange = (field: string, value: string[]) =>
    setKeywordsData((p) => ({ ...p, [field]: value }));

  const handlePlatformsChange = (field: string, value: boolean) =>
    setPlatformsData((p) => ({ ...p, [field]: value }));

  // ======================
  // NAVIGATION
  // ======================
  const updateProgress = async (step: number) => {
    if (!user) return;

    try {
      await fetch(`${API_BASE}/api/onboarding/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          currentStep: step,
        }),
      });
    } catch (err) {
      console.error("Update progress error:", err);
    }
  };

  const handleNext = async () => {
    const step = currentStep + 1;
    if (step <= 5) {
      setCurrentStep(step);
      await updateProgress(step);
    }
  };

  const handleBack = async () => {
    const step = currentStep - 1;
    if (step >= 1) {
      setCurrentStep(step);
      await updateProgress(step);
    }
  };

  // ======================
  // FINISH
  // ======================
  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const userId = user.id;

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/onboarding`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            companyData,
            industryData,
            targetData,
            keywordsData,
            platformsData,
          }),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        throw new Error("Save failed");
      }

      // ✅ THIS IS THE KEY FIX
      localStorage.setItem("userId", userId);

      // ✅ Go directly to Dashboard after completion
      navigate("/dashboard");
    } catch (err) {
      console.error("Finish onboarding error:", err);
      alert("Failed to save onboarding. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // THE STRICT LOADING SCREEN
  // ======================
  // Blocks UI rendering until Clerk is ready AND Neon DB has returned the user's status
  if (!isClerkLoaded || isCheckingDB) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505]">
        {/* Spinner matching your branding */}
        <Loader/>
        <h2 className="text-white text-xl font-bold tracking-tight animate-pulse">
          Syncing your workspace...
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Preparing your Leadequator environment
        </p>
      </div>
    );
  }

  // ======================
  // UI - ONBOARDING FORM
  // ======================
  // This is only reached if isCheckingDB === false (meaning they definitely need to onboard)
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/leadequator_logo.png" className="h-10" alt="Logo" />
            <span className="text-xl font-bold">Leadequator</span>
          </Link>
        </div>

        {!isComplete && (
          <OnboardingProgress currentStep={currentStep} totalSteps={5} />
        )}

        <AnimatePresence mode="wait">
          {isComplete ? (
            <OnboardingComplete />
          ) : (
            <>
              {currentStep === 1 && (
                <StepCompanyBasics
                  data={companyData}
                  onChange={handleCompanyChange}
                  onNext={handleNext}
                />
              )}

              {currentStep === 2 && (
                <StepIndustry
                  data={industryData}
                  onChange={handleIndustryChange}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 3 && (
                <StepTargetMarket
                  data={targetData}
                  onChange={handleTargetChange}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 4 && (
                <StepKeywords
                  data={keywordsData}
                  onChange={handleKeywordsChange}
                  onNext={handleNext}
                  onBack={handleBack}
                  industry={industryData.industry}
                />
              )}

              {currentStep === 5 && (
                <StepPlatforms
                  data={platformsData}
                  onChange={handlePlatformsChange}
                  onNext={handleFinish}
                  onBack={handleBack}
                  loading={saving}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;