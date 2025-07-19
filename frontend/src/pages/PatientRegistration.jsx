import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { patientsAPI } from "../api";
import { useAPIMutation } from "../hooks/useAPI";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { mutate: createPatient, loading: isSubmitting, error: submitError, success: submitSuccess } = useAPIMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    ward: "",
    conditionNotes: "",
    emergencyContact: "",
    contactPhone: "",
    bloodGroup: "",
    allergies: "",
    admissionType: "regular"
  });
  const [errors, setErrors] = useState({});

  const wards = [
    { value: "ICU", label: "ICU - Intensive Care Unit", description: "Critical care patients" },
    { value: "General", label: "General Ward", description: "Standard medical care" },
    { value: "Maternity", label: "Maternity Ward", description: "Pregnancy and childbirth care" },
    { value: "Pediatrics", label: "Pediatrics Ward", description: "Children's medical care" },
    { value: "Cardiology", label: "Cardiology Ward", description: "Heart-related conditions" },
    { value: "Orthopedics", label: "Orthopedics Ward", description: "Bone and joint care" },
    { value: "Emergency", label: "Emergency Ward", description: "Urgent medical attention" }
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 0 || formData.age > 150) {
      newErrors.age = "Please enter a valid age";
    }

    if (!formData.ward) {
      newErrors.ward = "Please select a ward";
    }

    if (!formData.conditionNotes.trim()) {
      newErrors.conditionNotes = "Condition notes are required";
    } else if (formData.conditionNotes.trim().length < 10) {
      newErrors.conditionNotes = "Please provide more detailed condition notes";
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = "Emergency contact name is required";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (!/^\d{10}$/.test(formData.contactPhone.replace(/\D/g, ''))) {
      newErrors.contactPhone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Transform form data to match API expectations
      const patientData = {
        name: formData.fullName,
        age: parseInt(formData.age),
        ward: formData.ward,
        condition_notes: formData.conditionNotes,
        emergency_contact: formData.emergencyContact,
        contact_phone: formData.contactPhone,
        blood_group: formData.bloodGroup,
        allergies: formData.allergies,
        admission_type: formData.admissionType
      };

      await createPatient(() => patientsAPI.create(patientData), {
        onSuccess: (data) => {
          console.log("Patient registered successfully:", data);

          // Reset form after successful submission
          setTimeout(() => {
            setFormData({
              fullName: "",
              age: "",
              ward: "",
              conditionNotes: "",
              emergencyContact: "",
              contactPhone: "",
              bloodGroup: "",
              allergies: "",
              admissionType: "regular"
            });
          }, 2000);
        },
        onError: (error) => {
          console.error("Registration failed:", error);
          setErrors({ submit: "Registration failed. Please try again." });
        }
      });

    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Registration failed. Please try again." });
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Patient <strong>{formData.fullName}</strong> has been successfully registered to {formData.ward} Ward.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Another Patient
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">➕ Patient Registration</h1>
              <p className="text-gray-600 mt-1">Register a new patient in the hospital system</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter patient's full name"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    min="0"
                    max="150"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Ward Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏥 Ward Assignment</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Ward *
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ward ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a ward...</option>
                  {wards.map(ward => (
                    <option key={ward.value} value={ward.value}>
                      {ward.label} - {ward.description}
                    </option>
                  ))}
                </select>
                {errors.ward && (
                  <p className="mt-1 text-sm text-red-600">{errors.ward}</p>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🩺 Medical Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition Notes *
                  </label>
                  <textarea
                    name="conditionNotes"
                    value={formData.conditionNotes}
                    onChange={handleInputChange}
                    placeholder="Describe the patient's condition, symptoms, and reason for admission..."
                    rows="4"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                      errors.conditionNotes ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.conditionNotes && (
                    <p className="mt-1 text-sm text-red-600">{errors.conditionNotes}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select blood group...</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admission Type
                    </label>
                    <select
                      name="admissionType"
                      value={formData.admissionType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="regular">Regular Admission</option>
                      <option value="emergency">Emergency Admission</option>
                      <option value="scheduled">Scheduled Surgery</option>
                      <option value="transfer">Transfer from Another Hospital</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Known Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any known allergies (medications, food, environmental)..."
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Full name of emergency contact"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.emergencyContact && (
                    <p className="mt-1 text-sm text-red-600">{errors.emergencyContact}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="10-digit phone number"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Section */}
            {(errors.submit || submitError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit || submitError}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register Patient'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">📋 Registration Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure all required fields (*) are completed accurately</li>
            <li>• Provide detailed condition notes for proper care assignment</li>
            <li>• Emergency contact should be immediately reachable</li>
            <li>• Ward selection determines initial care team assignment</li>
            <li>• Blood group information helps in emergency situations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;