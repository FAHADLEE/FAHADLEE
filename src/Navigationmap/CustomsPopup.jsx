import React, { useState } from 'react';
import './CustomsPopup.css';

const CustomPopup = ({ formData, onClose, onSubmit, onChange }) => {
  const [localFormData, setLocalFormData] = useState(formData);

  const handleInputChange = (field, value) => {
    setLocalFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    onChange(field, value);
  };

  return (
    <div className="custom-popup">
      <div className="popup-content">
        <h2>Location Details</h2>
        <form onSubmit={onSubmit}>
          <label>
            Day:
            <input
              type="date"
              value={localFormData.day}
              onChange={(e) => handleInputChange('day', e.target.value)}
              required
            />
          </label>
          <label>
            Daytime:
            <input
              type="time"
              value={localFormData.daytime}
              onChange={(e) => handleInputChange('daytime', e.target.value)}
            />
          </label>
          <label>
            Type:
            <select
              value={localFormData.Type}
              onChange={(e) => handleInputChange('Type', e.target.value)}
            >
              <option value="start">Start</option>
              <option value="end">End</option>
              <option value="waypoint">Waypoint</option>
            </select>
          </label>
          <div className="button-group">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomPopup;
