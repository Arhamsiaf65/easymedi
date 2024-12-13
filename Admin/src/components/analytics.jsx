import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Analytics() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);  // Track the selected appointment

  const getDoctors = async () => {
    try {
      const req = await fetch('http://localhost:4000/doctors/');
      const response = await req.json();
      setDoctors(response.doctorsList);

      const specializationsList = [
        ...new Set(response.doctorsList.map((doc) => doc.specialization)),
      ];
      setSpecializations(specializationsList);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:4000/appointments/patient/appointments');
      const data = await response.json();

      const validAppointments = (data?.appointments?.arr || [])
        .filter((appointment) => appointment && appointment.patient)
        .reverse();

      setAppointments(validAppointments);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  
  // Prepare data for Bar Chart (Doctors per Specialization)
  const specializationCount = doctors.reduce((acc, doctor) => {
    acc[doctor.specialization] = (acc[doctor.specialization] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(specializationCount),
    datasets: [
      {
        label: 'Doctors per Specialization',
        data: Object.values(specializationCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Light blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Pie Chart (Distribution of Specializations)
  const pieChartData = {
    labels: specializations,
    datasets: [
      {
        label: 'Specializations Distribution',
        data: specializations.map((spec) => specializationCount[spec] || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red
          'rgba(75, 192, 192, 0.6)', // Green
          'rgba(255, 159, 64, 0.6)', // Orange
          'rgba(153, 102, 255, 0.6)', // Purple
          'rgba(255, 205, 86, 0.6)', // Yellow
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Appointments Bar Chart (Appointments per Doctor)
  const appointmentsCount = appointments.reduce((acc, appointment) => {
    acc[appointment.doctorName] = (acc[appointment.doctorName] || 0) + 1;
    return acc;
  }, {});

  const appointmentsChartData = {
    labels: Object.keys(appointmentsCount),
    datasets: [
      {
        label: 'Appointments per Doctor',
        data: Object.values(appointmentsCount),
        backgroundColor: 'rgba(255, 159, 64, 0.6)', // Light orange
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    getDoctors();
    fetchAppointments();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Analytics Dashboard</h1>

      {/* Doctors Section with Bar Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Doctors per Specialization</h2>
        <div className="w-full max-w-xs mx-auto">
          <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Doctors per Specialization' } } }} />
        </div>
      </div>

      {/* Specializations Section with Pie Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Specializations Distribution</h2>
        <div className="w-full max-w-xs mx-auto">
          <Pie data={pieChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Specializations Distribution' } } }} />
        </div>
      </div>

      {/* Appointments Section with Bar Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Appointments per Doctor</h2>
        <div className="w-full max-w-xs mx-auto">
          <Bar data={appointmentsChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Appointments per Doctor' } } }} />
        </div>
      </div>

    </div>
  );
}

export default Analytics;
