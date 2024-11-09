import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RequestForm() {
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        age: '',
        familyMembers: '',
        injuries: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Submit form data to the backend
        try {
            const response = await fetch('http://localhost:5000/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.status === 201) {
                alert(result.message);  // Form submitted successfully
            } else {
                alert(result.error || "Something went wrong");
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your form');
        }

        // Clear the form after submission
        setFormData({
            name: '',
            country: '',
            age: '',
            familyMembers: '',
            injuries: ''
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-white p-6">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg text-black" style={{ backgroundColor: '#e4e4e7' }}>
                <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Report Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold text-black">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-black">Country:</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-black">Age:</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-black">Number of Affected People:</label>
                        <input
                            type="number"
                            name="familyMembers"
                            value={formData.familyMembers}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-black">Request:</label>
                        <textarea
                            name="injuries"
                            value={formData.injuries}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Submit
                    </button>
                </form>
                <p className="text-center text-black mt-4">
                    <Link to="/" className="text-red-600 hover:underline">
                        Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RequestForm;
