import React from "react";
import ReactDOM from "react-dom";

const ContributorModal = ({ contributor, onMouseEnter, onMouseLeave, onClose }) => {
  if (!contributor) return null;

  return ReactDOM.createPortal(
    <div
      className="aboutus-modal-overlay"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="aboutus-modal">
        <button className="aboutus-modal-close" onClick={onClose}>&times;</button>
        <img
          src={contributor.img}
          alt={contributor.name}
          className="aboutus-modal-img"
        />
        <div className="aboutus-modal-name">{contributor.name}</div>
      </div>
    </div>,
    document.body
  );
};

export default ContributorModal;