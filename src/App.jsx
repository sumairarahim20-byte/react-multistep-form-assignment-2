
import { useEffect, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'application-form-data';

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  plan: '',
  terms: false,
};

function getSavedFormData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      return {
        ...initialFormData,
        ...JSON.parse(savedData),
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { ...initialFormData };
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState(getSavedFormData);

  // Save form data whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      console.error('Unable to save form data in this browser.');
    }
  }, [formData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));
  }

  function validateStep() {
    const newErrors = {};

    if (currentStep === 1) {
      if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Please enter your full name.';
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ) {
        newErrors.email = 'Please enter a valid email address.';
      }

      const cleanPhone = formData.phone.replace(/[\s-]/g, '');

      if (!/^03\d{9}$/.test(cleanPhone)) {
        newErrors.phone =
          'Enter a valid Pakistani mobile number (03XXXXXXXXX).';
      }
    }

    if (currentStep === 2) {
      if (formData.address.trim().length < 5) {
        newErrors.address = 'Please enter your full address.';
      }

      if (!formData.city.trim()) {
        newErrors.city = 'Please enter your city.';
      }

      if (!/^\d{5}$/.test(formData.postalCode.trim())) {
        newErrors.postalCode =
          'Postal code must contain exactly 5 digits.';
      }
    }

    if (currentStep === 3) {
      if (!formData.plan) {
        newErrors.plan = 'Please select a plan.';
      }

      if (!formData.terms) {
        newErrors.terms = 'Please accept the Terms & Conditions.';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep() && currentStep < 4) {
      setCurrentStep((step) => step + 1);
      setErrors({});
    }
  }

  function handlePrevious() {
    setErrors({});
    setCurrentStep((step) => Math.max(1, step - 1));
  }

  function goToStep(step) {
    setErrors({});
    setCurrentStep(step);
  }

  function renderFieldError(fieldName) {
    if (!errors[fieldName]) {
      return null;
    }

    return (
      <small className="error-message" role="alert">
        {errors[fieldName]}
      </small>
    );
  }

  function handleSubmit() {
    // Demo submission: no data is sent to a server.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      console.error('Unable to clear saved form data.');
    }

    setFormData({ ...initialFormData });
    setErrors({});
    setCurrentStep(1);
    setIsSubmitted(true);
  }

  function startNewApplication() {
    setFormData({ ...initialFormData });
    setErrors({});
    setCurrentStep(1);
    setIsSubmitted(false);
  }

  if (isSubmitted) {
    return (
      <main className="app-container">
        <section className="form-card success-card">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>

          <p className="eyebrow">APPLICATION PORTAL</p>
          <h1>Application Submitted!</h1>

          <p className="subtitle">
            Thank you for completing the form. Your demo submission
            was successful.
          </p>

          <button type="button" onClick={startNewApplication}>
            Start New Application
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-container">
      <section className="form-card">
        <p className="eyebrow">APPLICATION PORTAL</p>

        <h1>Multi-Step Form</h1>

        <p className="subtitle">
          Complete your application in a few simple steps.
        </p>

        <div className="progress-info">
          <span>STEP {currentStep} OF 4</span>
          <span>{currentStep * 25}% COMPLETE</span>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={currentStep * 25}
        >
          <div
            className="progress-fill"
            style={{ width: `${currentStep * 25}%` }}
          />
        </div>

        {currentStep === 1 && (
          <>
            <h2>Personal Details</h2>

            <p className="section-description">
              Let's start with some basic information about you.
            </p>

            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
              />
              {renderFieldError('fullName')}

              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              {renderFieldError('email')}

              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
              />
              {renderFieldError('phone')}
            </form>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2>Account &amp; Location Details</h2>

            <p className="section-description">
              Tell us where you live.
            </p>

            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your street address"
                autoComplete="street-address"
                aria-invalid={Boolean(errors.address)}
              />
              {renderFieldError('address')}

              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.city)}
              />
              {renderFieldError('city')}

              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter 5-digit postal code"
                inputMode="numeric"
                autoComplete="postal-code"
                aria-invalid={Boolean(errors.postalCode)}
              />
              {renderFieldError('postalCode')}
            </form>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2>Preferences &amp; Service Selection</h2>

            <p className="section-description">
              Choose the plan that best suits your needs.
            </p>

            <div className="plan-options">
              {[
                {
                  value: 'Basic',
                  price: 'Free',
                  description: 'Essential features',
                },
                {
                  value: 'Pro',
                  price: '$19/month',
                  description: 'Advanced features',
                },
                {
                  value: 'Enterprise',
                  price: 'Custom',
                  description: 'For larger teams',
                },
              ].map((plan) => (
                <label
                  key={plan.value}
                  className={`plan-card ${
                    formData.plan === plan.value ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.value}
                    checked={formData.plan === plan.value}
                    onChange={handleChange}
                  />

                  <span className="plan-content">
                    <strong>{plan.value}</strong>
                    <span>{plan.description}</span>
                    <strong>{plan.price}</strong>
                  </span>
                </label>
              ))}
            </div>

            {renderFieldError('plan')}

            <label className="terms-label">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={(event) => {
                  setFormData((previous) => ({
                    ...previous,
                    terms: event.target.checked,
                  }));

                  setErrors((previous) => ({
                    ...previous,
                    terms: '',
                  }));
                }}
              />

              <span>I accept the Terms &amp; Conditions.</span>
            </label>

            {renderFieldError('terms')}
          </>
        )}

        {currentStep === 4 && (
          <>
            <h2>Form Review &amp; Summary</h2>

            <p className="section-description">
              Please review your information before submitting.
            </p>

            <div className="review-section">
              <h3>Personal Details</h3>
              <p><strong>Full Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>

              <button
                type="button"
                className="previous-button"
                onClick={() => goToStep(1)}
              >
                Edit Personal Details
              </button>
            </div>

            <div className="review-section">
              <h3>Account &amp; Location</h3>
              <p><strong>Address:</strong> {formData.address}</p>
              <p><strong>City:</strong> {formData.city}</p>
              <p><strong>Postal Code:</strong> {formData.postalCode}</p>

              <button
                type="button"
                className="previous-button"
                onClick={() => goToStep(2)}
              >
                Edit Location Details
              </button>
            </div>

            <div className="review-section">
              <h3>Preferences</h3>
              <p><strong>Selected Plan:</strong> {formData.plan}</p>
              <p><strong>Terms Accepted:</strong> Yes</p>

              <button
                type="button"
                className="previous-button"
                onClick={() => goToStep(3)}
              >
                Edit Preferences
              </button>
            </div>
          </>
        )}

        <div className="form-buttons">
          {currentStep > 1 && currentStep < 4 && (
            <button
              type="button"
              className="previous-button"
              onClick={handlePrevious}
            >
              ← Previous
            </button>
          )}

          {currentStep < 3 && (
            <button type="button" onClick={handleNext}>
              Next Step →
            </button>
          )}

          {currentStep === 3 && (
            <button type="button" onClick={handleNext}>
              Review Application →
            </button>
          )}

          {currentStep === 4 && (
            <button type="button" onClick={handleSubmit}>
              Submit Application ✓
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
