import React from 'react';
import './CustomsPopup.css';

const CustomPopup = ({ formData, onClose, onSubmit, onChange }) => {
  return (
    <div className="custom-popup">
      <div className="popup-content">
        <h2>Location Details</h2>
        <form onSubmit={onSubmit}>
          <label>
            Day:
            <input
              type="text"
              value={formData.day}
              onChange={(e) => onChange('day', e.target.value)}
              required
            />
          </label>
          <label>
            Daytime:
            <input
              type="text"
              value={formData.daytime}
              onChange={(e) => onChange('daytime', e.target.value)}
            />
          </label>
          <label>
            Type:
            <select
              value={formData.Type}
              onChange={(e) => onChange('Type', e.target.value)}
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
