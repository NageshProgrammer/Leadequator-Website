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

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

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
  // LOAD PROGRESS
  // ======================
  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadProgress = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/onboarding/progress?userId=${user.id}`,
      );

      const data = await res.json();

      if (data?.completed) {
        navigate("/dashboard");
      } else if (data?.currentStep) {
        setCurrentStep(data.currentStep);
      }
    };

    loadProgress();
  }, [isLoaded, user, navigate]);

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

    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/onboarding/progress`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, currentStep: step }),
      },
    );
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
      const res = await fetch("https://api.leadequator.live", {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          companyData,
          industryData,
          targetData,
          keywordsData,
          platformsData,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setIsComplete(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/leadequator_logo.png"
              alt="Leadequator"
              className="h-10"
            />
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
