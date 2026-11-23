// src/components/ui/PhoneInputWithCountry.jsx
import React, { useState, useEffect, useId } from 'react';
import { COUNTRY_CODES, parsePhoneNumber, validators } from '../../constants/validationData';
import { Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function PhoneInputWithCountry({
  label = 'Contact Mobile Number',
  value = '',
  onChange,
  required = false,
  error: customError,
  helperText,
  id: customId,
  className,
  disabled = false,
}) {
  const generatedId = useId();
  const inputId = customId || generatedId;

  const parsed = parsePhoneNumber(value);
  const [selectedCountryCode, setSelectedCountryCode] = useState(parsed.country.dialCode);
  const [nationalNumber, setNationalNumber] = useState(parsed.nationalNumber);
  const [isTouched, setIsTouched] = useState(false);

  // Sync if external value changes drastically
  useEffect(() => {
    if (value) {
      const p = parsePhoneNumber(value, selectedCountryCode);
      if (p.country.dialCode !== selectedCountryCode) {
        setSelectedCountryCode(p.country.dialCode);
      }
      if (p.nationalNumber !== nationalNumber) {
        setNationalNumber(p.nationalNumber);
      }
    }
  }, [value]);

  const activeCountry = COUNTRY_CODES.find((c) => c.dialCode === selectedCountryCode) || COUNTRY_CODES[0];

  // Validation
  const validationError = required || nationalNumber.length > 0
    ? validators.phone(nationalNumber, selectedCountryCode)
    : null;

  const displayError = customError || (isTouched ? validationError : null);
  const isValid = !validationError && nationalNumber.length > 0;

  const handleCountryChange = (e) => {
    const newDialCode = e.target.value;
    setSelectedCountryCode(newDialCode);
    const combined = `${newDialCode} ${nationalNumber}`.trim();
    const err = validators.phone(nationalNumber, newDialCode);
    if (onChange) {
      onChange(combined, {
        countryCode: newDialCode,
        nationalNumber,
        isValid: !err,
        error: err,
      });
    }
  };

  const handleNumberChange = (e) => {
    // Only allow digits, spaces, and dashes in typing
    const raw = e.target.value;
    const cleanDigits = raw.replace(/[^\d]/g, '');
    setNationalNumber(cleanDigits);
    setIsTouched(true);

    const combined = cleanDigits ? `${selectedCountryCode} ${cleanDigits}` : '';
    const err = validators.phone(cleanDigits, selectedCountryCode);
    if (onChange) {
      onChange(combined, {
        countryCode: selectedCountryCode,
        nationalNumber: cleanDigits,
        isValid: !err,
        error: err,
      });
    }
  };

  return (
    <div className={clsx('w-full flex flex-col', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-error-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="flex items-center gap-1.5 w-full">
        {/* Country Selector Dropdown */}
        <div className="relative shrink-0 w-36">
          <select
            value={selectedCountryCode}
            onChange={handleCountryChange}
            disabled={disabled}
            aria-label="Country Dial Code"
            className={clsx(
              'w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-md border border-neutral-200',
              'h-9 py-2 px-2.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              disabled && 'opacity-60 cursor-not-allowed pointer-events-none'
            )}
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.dialCode}>
                {country.flag} {country.dialCode} ({country.name})
              </option>
            ))}
          </select>
        </div>

        {/* National Number Input */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3 flex items-center pointer-events-none text-neutral-400">
            <Phone size={14} />
          </div>

          <input
            id={inputId}
            type="tel"
            disabled={disabled}
            placeholder={activeCountry.placeholder || 'Enter mobile number'}
            value={nationalNumber}
            onChange={handleNumberChange}
            onBlur={() => setIsTouched(true)}
            className={clsx(
              'w-full bg-white text-neutral-900 text-sm rounded-md border transition-all duration-150',
              'h-9 py-2 pl-9 pr-8',
              'placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
              displayError
                ? 'border-error-500 text-neutral-900 focus:border-error-500 focus:ring-error-500/20'
                : isValid
                ? 'border-emerald-500 hover:border-emerald-600 focus:border-emerald-500 focus:ring-emerald-500/20'
                : 'border-neutral-200 hover:border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
              disabled && 'bg-neutral-50 text-neutral-400 cursor-not-allowed pointer-events-none'
            )}
          />

          {displayError ? (
            <div className="absolute right-2.5 flex items-center pointer-events-none text-error-500">
              <AlertCircle size={15} />
            </div>
          ) : isValid ? (
            <div className="absolute right-2.5 flex items-center pointer-events-none text-emerald-600">
              <CheckCircle2 size={15} />
            </div>
          ) : null}
        </div>
      </div>

      {displayError ? (
        <p className="text-xs text-error-600 mt-1.5 flex items-center gap-1">
          <AlertCircle size={12} className="shrink-0" /> {displayError}
        </p>
      ) : helperText ? (
        <p className="text-xs text-neutral-500 mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
}
