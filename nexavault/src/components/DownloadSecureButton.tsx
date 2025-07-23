import { useState } from 'react';

interface Props {
  serviceName: string;
}

const DownloadSecureButton = ({ serviceName }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/secure/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceName }),
      });

      const { token } = await res.json();

      const downloadUrl = `http://localhost:3000/api/secure/download-html?token=${token}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${serviceName}-secure.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      alert('🔒 Secure download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
    >
      {loading ? 'Encrypting...' : `🔐 Download Secure Data`}
    </button>
  );
};

export default DownloadSecureButton;
