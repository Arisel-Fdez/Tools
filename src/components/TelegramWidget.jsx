import React from 'react';

const TelegramWidget = () => {
  const handleTelegramRedirect = () => {
    window.location.href = 'https://t.me/Monitoringtoolsbot';
  };

  return (
    <button className="btn btn-outline-primary" onClick={handleTelegramRedirect}>
      <i className="bi bi-telegram"></i> Bot Telegram
    </button>
  );
};

export default TelegramWidget;
