import React, { useRef, useState } from 'react';

const OtpInput = ({setOtp,otp}) => {
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0]; // only take first digit
    setOtp(newOtp);

    // Move to next input
    if (index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current field
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move focus to previous field
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    const nextIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputsRef.current[nextIndex].focus();
  };

  
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }} onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input     key={index}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={digit}
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          style={{
            width: '40px',
            height: '40px',
            fontSize: '24px',
            textAlign: 'center',
            border: '1px solid #1a3864',
            borderRadius: '4px',
            backgroundColor:'white'
          }}
        />
      ))}
      
    </div>
  );
};

export default OtpInput;
