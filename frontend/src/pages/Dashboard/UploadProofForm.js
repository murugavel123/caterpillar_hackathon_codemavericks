import { useState } from 'react';
import axios from 'axios';

export default function UploadProofForm({ taskId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('proof', file);

    setUploading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/tasks/upload-proof/${taskId}`, formData);
      console.log('Uploaded:', res.data);
      setSuccess(true);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-700"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading || success}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
      >
        {uploading ? 'Uploading...' : success ? 'Uploaded ✅' : 'Submit Proof'}
      </button>
    </div>
  );
}
