// Utility to reset opportunities data with correct dates
export const resetOpportunitiesData = () => {
  const correctData = [
    {
      id: "erp-consultant",
      title: "ERP System Consultant",
      type: "consulting",
      description: "Design and implement a robust ERP system integrating HR, finance, and operations",
      location: "Remote/Nairobi",
      duration: "3 months",
      deadline: "2025-02-15", // Past deadline
      manuallyDisabled: false
    },
    {
      id: "field-officer",
      title: "Field Officer (APBET Teacher)",
      type: "employment",
      description: "Lead Education for Sustainable Development in schools within informal settlements",
      location: "Nairobi, Kenya",
      duration: "Full-time",
      deadline: "2026-03-31", // Future: March 31, 2026
      manuallyDisabled: false
    },
    {
      id: "external-audit",
      title: "External Audit Services",
      type: "consulting",
      description: "Conduct external audit of financial statements for FY 2025",
      location: "Nairobi, Kenya",
      duration: "6 weeks",
      deadline: "2026-02-27", // Future: Feb 27, 2026
      manuallyDisabled: false
    }
  ];
  
  localStorage.setItem('afosi_opportunities', JSON.stringify(correctData));
  console.log('Opportunities data reset successfully!');
  return correctData;
};

// Call this function to reset data
if (typeof window !== 'undefined') {
  // Check if data needs reset
  const stored = localStorage.getItem('afosi_opportunities');
  if (stored) {
    const data = JSON.parse(stored);
    const fieldOfficer = data.find((o: any) => o.id === 'field-officer');
    // If field officer has old deadline, reset all data
    if (fieldOfficer && fieldOfficer.deadline === '2025-02-27') {
      console.log('Detected old deadline, resetting...');
      resetOpportunitiesData();
      window.location.reload();
    }
  }
}
