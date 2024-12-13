import React, { createContext, useState, useEffect } from 'react';

export const DoctorsContext = createContext();

export const DoctorsProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://easymedi-backend.vercel.app/doctors');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch doctors. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data:", data);
      setDoctors(data);  
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(err.message || 'An unknown error occurred while fetching doctors.');
    } finally {
      setLoading(false);
    }
  };

  const deleteFromLast = async () => {
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
        setDoctors((prevDoctors) => {
          if (Array.isArray(prevDoctors) && prevDoctors.length > 0) {
            // Remove the last doctor from the list
            return prevDoctors.slice(0, -1);
          }
          return [];
        });
      }
      return data.success;
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError(err.message || 'Failed to delete doctor');
      return false;
    }
  };


  const deleteFromStart = async () => {
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
        setDoctors((prevDoctors) => {
          if (Array.isArray(prevDoctors) && prevDoctors.length > 0) {
            return prevDoctors.slice(1);
          }
          return [];
        });
      }
      return data.success;
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError(err.message || 'Failed to delete doctor');
      return false;
    }
  };


 
  useEffect(() => {
    fetchDoctors();
  }, []);

  const addDoctor = async (newDoctor) => {
    try {
      const response = await fetch('https://easymedi-backend.vercel.app/doctors/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoctor),
      });

      if (!response.ok) {
        throw new Error('Failed to add doctor');
      }

      const addedDoctor = await response.json();
      setDoctors((prevDoctors) => {
        if (Array.isArray(prevDoctors)) {
          return [...prevDoctors, addedDoctor];
        }
        fetchDoctors();
        return [addedDoctor];  
      });
      return true;
    } catch (err) {
      console.error("Error adding doctor:", err);
      setError(err.message || 'Failed to add doctor');
      return false;
    }
  };

  const deleteDoctor = async (doctorId) => {
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
        setDoctors((prevDoctors) => {
          if (Array.isArray(prevDoctors)) {
            return prevDoctors.filter(doctor => doctor.id !== doctorId);
          }
          return [];
        });
      }
      return data.success;
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError(err.message || 'Failed to delete doctor');
      return false;
    }
  };

  return (
    <DoctorsContext.Provider value={{ doctors, loading, error, addDoctor, deleteDoctor, setDoctors, deleteFromLast, deleteFromStart }}>
      {children}
    </DoctorsContext.Provider>
  );
};
