import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterApi } from "../apps/ChatServiceApp/hooks/useRegisterApi";
import { useToast } from "./ui/useToast";
import { EyeIcon, EyeSlashIcon, CheckIcon } from "@heroicons/react/24/outline";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  // API hooks
  const { register, isLoading, clearError } = useRegisterApi();
  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Mark field as touched
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    const fieldErrors = validateField(
      name,
      formData[name as keyof typeof formData]
    );
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  };

  const validateField = (fieldName: string, value: string) => {
    const newErrors: Record<string, string> = {};

    if (fieldName === "username") {
      if (!value.trim()) {
        newErrors.username = "Username is required";
      } else if (value.length < 3) {
        newErrors.username = "Username must be at least 3 characters long";
      }
    }

    if (fieldName === "password") {
      if (!value) {
        newErrors.password = "Password is required";
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }
    }

    if (fieldName === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== value) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const validateForm = () => {
    const usernameErrors = validateField("username", formData.username);
    const passwordErrors = validateField("password", formData.password);
    const confirmPasswordErrors = validateField(
      "confirmPassword",
      formData.confirmPassword
    );

    const allErrors = {
      ...usernameErrors,
      ...passwordErrors,
      ...confirmPasswordErrors,
    };
    setErrors(allErrors);
    setTouchedFields({ username: true, password: true, confirmPassword: true });

    return Object.keys(allErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
        return { label: "Weak", color: "text-red-500", bgColor: "bg-red-500" };
      case 2:
        return {
          label: "Fair",
          color: "text-yellow-500",
          bgColor: "bg-yellow-500",
        };
      case 3:
        return {
          label: "Good",
          color: "text-blue-500",
          bgColor: "bg-blue-500",
        };
      case 4:
      case 5:
        return {
          label: "Strong",
          color: "text-green-500",
          bgColor: "bg-green-500",
        };
      default:
        return { label: "", color: "", bgColor: "" };
    }
  };

  const getFieldClassName = (fieldName: string) => {
    const baseClasses =
      "w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm input-focus-glow";

    if (errors[fieldName]) {
      return `${baseClasses} form-field-invalid`;
    }

    if (
      touchedFields[fieldName] &&
      !errors[fieldName] &&
      formData[fieldName as keyof typeof formData]
    ) {
      return `${baseClasses} form-field-valid`;
    }

    if (isLoading) {
      return `${baseClasses} form-field-disabled`;
    }

    return `${baseClasses} border-gray-200`;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        clearError();
        await register(formData.username.trim(), formData.password);

        setSignupSuccess(true);

        // Add a small delay to show success state
        setTimeout(() => {
          showToast("Account created successfully! Please sign in.", "success");
          navigate("/login");
        }, 800);
      } catch (error) {
        // Error is already handled by the API hook, but we can show a specific message
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";

        // Handle specific error cases
        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("taken")
        ) {
          showToast(
            "Username already exists. Please choose a different username.",
            "error"
          );
        } else if (errorMessage.includes("username")) {
          showToast("Invalid username format. Please try again.", "error");
        } else {
          showToast(errorMessage, "error");
        }
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const isFormValid =
    formData.username.trim().length >= 3 &&
    formData.password.length >= 8 &&
    formData.confirmPassword === formData.password;
  const isButtonDisabled = isLoading || !isFormValid;
  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const renderLoadingButton = () => {
    if (signupSuccess) {
      return (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckIcon className="w-6 h-6 text-white success-checkmark" />
          </div>
          <span className="opacity-0">Success!</span>
        </>
      );
    }

    if (isLoading) {
      return (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full loading-dot"></div>
              <div className="w-2 h-2 bg-white rounded-full loading-dot"></div>
              <div className="w-2 h-2 bg-white rounded-full loading-dot"></div>
            </div>
          </div>
          <span className="opacity-0">Creating Account...</span>
        </>
      );
    }

    return "Create Account";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      {/* Premium Animated Background Elements */}

      {/* Main Gradient Orbs */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
      <div
        className="absolute bottom-[-200px] right-[-150px] w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 via-pink-400/15 to-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-[30%] right-[15%] w-[300px] h-[300px] bg-gradient-to-br from-cyan-400/15 via-blue-400/10 to-purple-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Floating Geometric Shapes */}
      <div className="absolute top-[20%] left-[10%] w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg rotate-45 animate-float"></div>
      <div
        className="absolute bottom-[30%] left-[20%] w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full animate-float"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute top-[60%] right-[25%] w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg rotate-12 animate-float"
        style={{ animationDelay: "2.5s" }}
      ></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.03) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Animated Light Rays */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
      <div
        className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Floating Particles */}
      <div className="absolute top-[15%] left-[15%] w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
      <div
        className="absolute top-[25%] right-[20%] w-1 h-1 bg-purple-400/40 rounded-full animate-bounce"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute bottom-[20%] left-[30%] w-1.5 h-1.5 bg-cyan-400/35 rounded-full animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-[35%] right-[10%] w-1 h-1 bg-pink-400/30 rounded-full animate-bounce"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Premium Glass Morphism Card */}
      <div className="z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20 animate-scale-in">
        <div className="text-center animate-fade-in-up">
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Magure.AI
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm">
            Join us and start your journey today
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="space-y-5 animate-fade-in-up stagger-1"
        >
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
              {touchedFields.username &&
                !errors.username &&
                formData.username.trim() && (
                  <span className="ml-2 text-green-500">
                    <CheckIcon className="w-4 h-4 inline" />
                  </span>
                )}
            </label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Enter your username"
                className={getFieldClassName("username")}
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 animate-slide-up">
                  {errors.username}
                </p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
              {touchedFields.password &&
                !errors.password &&
                formData.password && (
                  <span className="ml-2 text-green-500">
                    <CheckIcon className="w-4 h-4 inline" />
                  </span>
                )}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className={`${getFieldClassName("password")} pr-12`}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover-scale ${
                  errors.password ? "top-[calc(50%-12px)]" : "top-1/2"
                }`}
                disabled={isLoading}
                data-tooltip={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 animate-fade-in-up">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">
                    Password Strength
                  </span>
                  <span className={`text-xs font-medium ${strengthInfo.color}`}>
                    {strengthInfo.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${strengthInfo.bgColor}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-red-600 animate-slide-up">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
              {touchedFields.confirmPassword &&
                !errors.confirmPassword &&
                formData.confirmPassword && (
                  <span className="ml-2 text-green-500">
                    <CheckIcon className="w-4 h-4 inline" />
                  </span>
                )}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className={`${getFieldClassName("confirmPassword")} pr-12`}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover-scale ${
                  errors.confirmPassword ? "top-[calc(50%-12px)]" : "top-1/2"
                }`}
                disabled={isLoading}
                data-tooltip={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 animate-slide-up">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Sign Up Button */}
          <div className="animate-fade-in-up stagger-2">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full py-3 px-4 text-white font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden btn-primary click-scale ${
                isLoading && !signupSuccess ? "btn-loading" : ""
              } ${
                signupSuccess
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : ""
              }`}
            >
              {renderLoadingButton()}
            </button>
          </div>
        </form>

        <div className="animate-fade-in-up stagger-3">
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={handleLoginRedirect}
              className="text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer transition-colors duration-200 font-medium hover-scale"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>

      {/* Additional Premium Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none"></div>
    </div>
  );
};

export default Signup;
