import React, { createContext, useState, useEffect } from 'react';

export const DoctorsContext = createContext();

export const DoctorsProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear errors
  const clearError = () => setError(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://easymedi-backend.vercel.app/doctors', {
      mode: 'no-cors',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch doctors. Status: ${response.status}`);
      }
      const data = await response.json();
      setDoctors(data.doctorsList || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(err.message || 'An error occurred while fetching doctors.');
    } finally {
      setLoading(false);
    }
  };

  const updateDoctorsState = (updateFn) => {
    setDoctors((prev) => {
      if (Array.isArray(prev)) {
        return updateFn(prev);
      }
      return [];
    });
  };

  const deleteFromLast = async () => {
    clearError();
    try {
      const response = await fetch(`https://easymedi-backend.vercel.app/doctors/del-end`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete doctor. Server responded with: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        updateDoctorsState((prev) => prev.slice(0, -1)); 
       
      }
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError(err.message || 'Failed to delete doctor.');
    }
  };

  const deleteFromStart = async () => {
    clearError();
    try {
      const response = await fetch(`https://easymedi-backend.vercel.app/doctors/del-start`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete doctor. Server responded with: ${errorText}`);

      }

      const data = await response.json();
      if (data.success) {
        updateDoctorsState((prev) => prev.slice(1));
    
      }
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError(err.message || 'Failed to delete doctor.');
    }
  };

  const addDoctor = async (newDoctor) => {
    try {
      const response = await fetch('https://easymedi-backend.vercel.app/doctors/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoctor),
      }); 
  
      const result = await response.json();
 
      if (result.success) {
        return true;
      } else {
        throw new Error('Failed to parse added doctor data');
      }
    } catch (err) {
      console.error("Error adding doctor:", err);
      setError(err.message || 'Failed to add doctor.');
    }
  };
  
  

  const deleteDoctor = async (doctorId) => {
    clearError();
    try {
      const response = await fetch(`https://easymedi-backend.vercel.app/doctors/del/${doctorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete doctor. Server responded with: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        updateDoctorsState((prev) => prev.filter((doctor) => doctor.id !== doctorId));
      }
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError(err.message || 'Failed to delete doctor.');
    }
  };

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        fetchDoctors,
        setDoctors,
        loading,
        error,
        fetchDoctors,
        addDoctor,
        deleteDoctor,
        deleteFromLast,
        deleteFromStart,
        clearError,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};
