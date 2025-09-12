// Файл: src/features/RegisterPage/RegisterPage.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleAuthButton from "@/src/components/GoogleAuthButton/GoogleAuthButton";
import RegistrationForm from "./RegistrationForm/RegistrationForm";
import VerificationForm from "./VerificationForm/VerificationForm";
import SuccessForm from "./SuccessForm/SuccessForm";
import "./RegisterPage.scss";

export default function RegisterPage({ redirectTo = "/" }) {
  const router = useRouter();

  // Локальный state для управления шагами
  const [step, setStep] = useState("form"); // form, verification, success
  const [email, setEmail] = useState("");

  // Handle Google OAuth success
  const handleGoogleSuccess = ({ user }) => {
    router.replace(redirectTo);
  };

  const handleGoogleError = (error) => {
    console.error("[RegisterPage] Google auth error:", error);
  };

  // Callbacks для переходов между шагами
  const handleRegistrationSuccess = (userEmail) => {
    setEmail(userEmail);
    setStep("verification");
  };

  const handleVerificationSuccess = () => {
    setStep("success");
  };

  const handleBackToForm = () => {
    setStep("form");
    setEmail("");
  };

  const handleBackToVerification = () => {
    setStep("verification");
  };

  return (
    <section className="register-page">
      <div className="container">
        <div className="register-page__wrapper">
          <div className="register-page__card">
            {/* Header */}
            <div className="register-page__header">
              <h1 className="register-page__title">
                {step === "form" && "Registrácia"}
                {step === "verification" && "Overte svoj email"}
                {step === "success" && "Registrácia úspešná!"}
              </h1>
              <p className="register-page__subtitle">
                {step === "form" && "Vytvorte si účet na FastCredit fóre"}
                {step === "verification" &&
                  `Odoslali sme overovací kód na ${email}`}
                {step === "success" &&
                  "Váš účet bol úspešne vytvorený a overený"}
              </p>
            </div>

            {/* Google OAuth - only show on form step */}
            {step === "form" && (
              <>
                <div className="register-page__google-container">
                  <GoogleAuthButton
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                  />
                </div>

                <div className="register-page__divider">
                  <span>alebo</span>
                </div>
              </>
            )}

            {/* Form Components - каждый со своим useActionState */}
            {step === "form" && (
              <RegistrationForm onSuccess={handleRegistrationSuccess} />
            )}

            {step === "verification" && (
              <VerificationForm
                email={email}
                onSuccess={handleVerificationSuccess}
                onBackToForm={handleBackToForm}
              />
            )}

            {step === "success" && (
              <SuccessForm
                email={email}
                redirectTo={redirectTo}
                onBackToVerification={handleBackToVerification}
              />
            )}

            {/* Footer - only show on form step */}
            {step === "form" && (
              <div className="register-page__footer">
                <div className="register-page__login">
                  <span>Už máte účet? </span>
                  <Link
                    href="/login"
                    className="register-page__link register-page__link--primary"
                  >
                    Prihláste sa
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
